export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxt/content'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'ja',
    locales: [
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ms', name: 'BM', file: 'ms.json' },
    ],
  },
  css: ['~/assets/css/main.css'],
  typescript: {
    tsConfig: {
      exclude: ['../node_modules/yubinbango-core'],
    },
  },
  vite: {
    plugins: [
      {
        // yubinbango-core creates a browser global but has no module.exports.
        // yubinbango-core2 adds module.exports, which can break in browser runtime
        // under some edge bundles ("module is not defined"). This plugin normalizes
        // both packages to ESM exports for stable client/runtime behavior.
        name: 'yubinbango-core-esm-compat',
        transform(code: string, id: string) {
          if (id.includes('/yubinbango-core2/') && id.includes('yubinbango-core.js')) {
            const withoutCommonJs = code.replace(/module\.exports\s*=\s*YubinBango;?/g, '')
            return `${withoutCommonJs}\nexport default YubinBango;\n`
          }
          if (id.includes('/yubinbango-core/') && id.includes('yubinbango-core.js')) {
            return `${code}\nexport default YubinBango;\n`
          }
          return null
        },
      },
    ],
  },
})
