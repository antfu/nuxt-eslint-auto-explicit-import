import type { Unimport } from 'unimport'
import { logger } from '@nuxt/kit'
import { createHooks } from 'hookable'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import module from '../src/module'

interface MockNuxt {
  options: Record<string, any>
  hooks: ReturnType<typeof createHooks>
  hook: ReturnType<typeof createHooks>['hook']
  callHook: ReturnType<typeof createHooks>['callHook']
}

function createMockNuxt(): MockNuxt {
  const hooks = createHooks()
  return {
    options: {},
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
  }
}

async function setupModule(nuxt: MockNuxt) {
  // The wrapped module accepts (inlineOptions, nuxt) — pass our mock directly
  // so it doesn't try to look up Nuxt via `tryUseNuxt()`.
  await (module as any)({}, nuxt)
}

describe('nuxt-eslint-auto-explicit-import module', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('exposes the expected module meta', async () => {
    const meta = await (module as any).getMeta()
    expect(meta.name).toBe('nuxt-eslint-auto-explicit-import')
  })

  it('registers an eslint addon with the module name', async () => {
    const nuxt = createMockNuxt()
    await setupModule(nuxt)

    const addons: any[] = []
    await nuxt.callHook('eslint:config:addons', addons)

    expect(addons).toHaveLength(1)
    expect(addons[0].name).toBe('nuxt-eslint-auto-explicit-import')
    expect(typeof addons[0].getConfigs).toBe('function')
  })

  it('produces the createAutoInsert config using imports from unimport', async () => {
    const nuxt = createMockNuxt()
    await setupModule(nuxt)

    const mockImports = [
      { from: 'vue', name: 'ref' },
      { from: 'vue', name: 'computed' },
    ]
    const mockUnimport = {
      getImports: vi.fn(async () => mockImports),
    } as unknown as Unimport

    await nuxt.callHook('imports:context', mockUnimport)

    const addons: any[] = []
    await nuxt.callHook('eslint:config:addons', addons)
    const result = await addons[0].getConfigs()

    expect(result.imports).toEqual([
      { from: 'eslint-plugin-unimport', name: 'createAutoInsert' },
    ])
    expect(result.configs).toHaveLength(1)
    expect(result.configs[0]).toContain('// nuxt-eslint-auto-explicit-import')
    expect(result.configs[0]).toContain('createAutoInsert({')
    expect(result.configs[0]).toContain(`imports: ${JSON.stringify(mockImports)}`)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('warns and falls back to empty imports when unimport context is missing', async () => {
    const nuxt = createMockNuxt()
    await setupModule(nuxt)

    const addons: any[] = []
    await nuxt.callHook('eslint:config:addons', addons)
    const result = await addons[0].getConfigs()

    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0][0]).toContain('unimport is not ready')
    expect(result.configs[0]).toContain('imports: []')
  })

  it('reflects the latest imports each time getConfigs is called', async () => {
    const nuxt = createMockNuxt()
    await setupModule(nuxt)

    let current: any[] = [{ from: 'vue', name: 'ref' }]
    const mockUnimport = {
      getImports: vi.fn(async () => current),
    } as unknown as Unimport
    await nuxt.callHook('imports:context', mockUnimport)

    const addons: any[] = []
    await nuxt.callHook('eslint:config:addons', addons)

    const first = await addons[0].getConfigs()
    expect(first.configs[0]).toContain(JSON.stringify(current))

    current = [{ from: 'vue', name: 'ref' }, { from: 'vue', name: 'shallowRef' }]
    const second = await addons[0].getConfigs()
    expect(second.configs[0]).toContain(JSON.stringify(current))
    expect(mockUnimport.getImports).toHaveBeenCalledTimes(2)
  })
})
