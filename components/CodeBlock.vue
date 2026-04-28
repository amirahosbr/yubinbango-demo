<template>
  <div class="relative group">
    <pre class="code-block !pr-16"><code>{{ code }}</code></pre>
    <button
      @click="copy"
      class="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150
             opacity-0 group-hover:opacity-100 focus:opacity-100
             border"
      :class="copied
        ? 'bg-green-500 border-green-400 text-white'
        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white'"
    >
      {{ copied ? 'コピー済み ✓' : 'コピー' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ code: string }>()
const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(props.code.trim()).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>
