<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <h1 class="text-lg font-semibold text-gray-700 mb-6">Docs</h1>
    <ul class="space-y-2">
      <li v-for="doc in docs" :key="doc._path">
        <NuxtLinkLocale
          :to="doc.path"
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {{ doc.title }}
        </NuxtLinkLocale>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { data: docs } = await useAsyncData('docs-list', () =>
  queryCollection('docs').select('path', 'title').all()
)
</script>
