/// <reference types="@nuxt/eslint" />

import type { Unimport } from 'unimport'
import { defineNuxtModule, logger } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-eslint-auto-explicit-import',
  },
  setup(options, nuxt) {
    let unimport: Unimport

    nuxt.hook('imports:context', (ctx) => {
      unimport = ctx
    })

    nuxt.hook('eslint:config:addons', (addons) => {
      addons.push({
        name: 'nuxt-eslint-auto-explicit-import',
        async getConfigs() {
          if (!unimport)
            logger.warn('unimport is not ready for nuxt-eslint-auto-explicit-import')
          return {
            imports: [
              {
                from: 'eslint-plugin-unimport',
                name: 'createAutoInsert',
              },
            ],
            configs: [
              [
                '// nuxt-eslint-auto-explicit-import',
                'createAutoInsert({',
                `  imports: ${JSON.stringify(await unimport?.getImports() || [])}`,
                '})',
              ].join('\n'),
            ],
          }
        },
      })
    })
  },
})
