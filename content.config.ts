import { defineContentConfig, defineCollection } from '@nuxt/content'
import { fileURLToPath } from 'node:url'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: fileURLToPath(new URL('./docs', import.meta.url)),
        prefix: '/docs',
      },
    }),
  },
})
