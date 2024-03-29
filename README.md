# Nuxt ESLint - Auto {Explicit} Import

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Love auto imports but are concerned about the implicitness? This module is for you!

You can use composables anywhere as you would with auto import, and ESLint will insert the explicit import statement for you automatically.

This is a Nuxt module that extends the configuration for [`@nuxt/eslint`](https://eslint.nuxt.com/packages/module).

This could also be helpful if you are migrating away from implicit auto imports.

[example commit](https://github.com/antfu/eslint-flat-config-viewer/commit/0f8000851b4ac0d7f3ea5e49963c6d7248303b7b)

> [!IMPORTANT]
> Experimental :)

## Setup

```bash
npm i -D nuxt-eslint-auto-explicit-import @nuxt/eslint
```

```ts
export default defineNuxtConfig({
  modules: [
    // Both are required
    '@nuxt/eslint',
    'nuxt-eslint-auto-explicit-import'
  ],
})
```

```js
// eslint.config.mjs
import withNuxt from './nuxt/eslint.config.mjs'

export default withNuxt({
  // Your ESLint config
})
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-eslint-auto-explicit-import/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-eslint-auto-explicit-import

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-eslint-auto-explicit-import.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-eslint-auto-explicit-import

[license-src]: https://img.shields.io/npm/l/nuxt-eslint-auto-explicit-import.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-eslint-auto-explicit-import

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
