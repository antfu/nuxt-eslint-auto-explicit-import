export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '../src/module',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  devtools: {
    enabled: true,
  },
})
