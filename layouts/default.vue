<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
        <NuxtLink to="/" class="text-blue-600 font-bold text-base mr-4 whitespace-nowrap">
          〒 自動入力デモ
        </NuxtLink>
        <NuxtLink to="/yubinbango-core" class="nav-link" :class="{ 'nav-link-active': route.path === '/yubinbango-core' }">
          yubinbango-core
        </NuxtLink>
        <NuxtLink to="/yubinbango-core2" class="nav-link" :class="{ 'nav-link-active': route.path === '/yubinbango-core2' }">
          yubinbango-core2
        </NuxtLink>
        <NuxtLink to="/zipcloud" class="nav-link" :class="{ 'nav-link-active': route.path === '/zipcloud' }">
          zipcloud API
        </NuxtLink>
        <NuxtLink to="/yubinbango-script" class="nav-link" :class="{ 'nav-link-active': route.path === '/yubinbango-script' }">
          yubinbango.js
        </NuxtLink>
        <NuxtLink to="/composable" class="nav-link" :class="{ 'nav-link-active': route.path === '/composable' }">
          Composable
        </NuxtLink>
      </div>
    </nav>
    <main class="pb-16">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
