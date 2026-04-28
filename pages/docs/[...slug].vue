<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <NuxtLinkLocale to="/" class="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-8">
      ← back
    </NuxtLinkLocale>
    <div v-if="page">
      <article class="prose prose-sm prose-gray max-w-none">
        <ContentRenderer :value="page" />
      </article>
    </div>
    <p v-else class="text-gray-400 text-sm">Page not found.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(route.path).first()
)
</script>
