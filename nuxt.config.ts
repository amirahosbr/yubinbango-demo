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
  modules: ['@nuxtjs/tailwindcss'],
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
        // This plugin injects the export so Vite can bundle it as an ES module.
        name: 'yubinbango-core-esm-compat',
        transform(code: string, id: string) {
          if (id.includes('yubinbango-core.js')) {
            return `${code}\nexport default YubinBango;\n`
          }
          return null
        },
      },
    ],
  },
})
