<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full badge-pattern">パターン</span>
        <h1 class="text-2xl font-bold text-gray-900">usePostalCode Composable</h1>
      </div>
      <p class="text-gray-500 text-sm">
        yubinbango-core を Nuxt 3 の Composable に包んだパターン。
        <code class="bg-gray-100 px-1 rounded text-xs">composables/usePostalCode.ts</code> に分離することで、
        複数のフォームページから同じロジックを再利用できます。
      </p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- Zip -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">郵便番号</label>
          <div class="flex items-center gap-2">
            <span class="text-gray-400 font-medium">〒</span>
            <input
              v-model="form.zip"
              type="text"
              maxlength="8"
              placeholder="例: 1000001 または 100-0001"
              class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition font-mono"
              :class="{ 'border-red-400': postalError }"
            />
            <div v-if="postalLoading" class="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          </div>
          <p v-if="postalError" class="mt-1 text-xs text-red-500">{{ postalError }}</p>
          <p v-else class="mt-1 text-xs text-gray-400">7桁の数字を入力すると自動入力します</p>
        </div>

        <!-- Auto-filled -->
        <div class="bg-gray-50 rounded-xl p-4 mb-5 space-y-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">自動入力エリア</p>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">都道府県</label>
            <input v-model="form.pref" type="text" placeholder="自動入力されます" :class="autoClass(form.pref)" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">市区町村</label>
            <input v-model="form.city" type="text" placeholder="自動入力されます" :class="autoClass(form.city)" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">町域・番地</label>
            <input v-model="form.address" type="text" placeholder="自動入力されます（続きは手入力）" :class="autoClass(form.address)" />
          </div>
        </div>

        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">建物名・部屋番号</label>
          <input v-model="form.building" type="text" placeholder="例: ○○マンション 101号室" class="field" />
        </div>

        <div class="border-t border-gray-100 my-6" />

        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">
            氏名 <span class="text-red-500 text-xs">必須</span>
          </label>
          <input v-model="form.name" type="text" placeholder="例: 山田 太郎" class="field" required />
        </div>

        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">電話番号</label>
          <input v-model="form.phone" type="tel" placeholder="例: 03-1234-5678" class="field" />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-1">メールアドレス</label>
          <input v-model="form.email" type="email" placeholder="例: example@mail.com" class="field" />
        </div>

        <button
          type="submit"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors text-base"
        >
          送信する
        </button>

        <div v-if="submitted" class="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          ✅ フォームが送信されました（デモ）
        </div>
      </form>
    </div>

    <!-- How it works -->
    <details class="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 select-none">
        実装コード
      </summary>
      <div class="px-6 pb-6">
        <p class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">composables/usePostalCode.ts</p>
        <CodeBlock :code="code1" />

        <p class="mt-5 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">pages/composable.vue (利用側)</p>
        <CodeBlock :code="code2" />

        <ul class="mt-4 text-sm text-gray-600 space-y-1">
          <li>✅ ページコンポーネントが非常にシンプルになる</li>
          <li>✅ 複数フォームページで同じロジックを再利用できる</li>
          <li>✅ loading / error 状態も composable に集約</li>
          <li>✅ バックエンド（yubinbango-core / zipcloud）を差し替えやすい</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Composable デモ | 郵便番号自動入力' })

const code1 = `import YubinBango from 'yubinbango-core2' // core2: module.exports あり、Vite plugin 不要

export function usePostalCode() {
  const loading = ref(false)
  const error   = ref<string | null>(null)

  function lookup(zipcode: string): Promise<PostalAddress | null> {
    const clean = zipcode.replace(/-/g, '')
    if (!/^\\d{7}$/.test(clean)) return Promise.resolve(null)

    loading.value = true
    return new Promise((resolve) => {
      new YubinBango.Core(clean, (addr) => {
        loading.value = false
        resolve(addr.region
          ? { pref: addr.region, city: addr.locality, street: addr.street }
          : null
        )
      })
    })
  }

  function watchAndFill(zipRef, target) {
    watch(zipRef, async (val) => {
      const result = await lookup(val)
      if (result) {
        target.pref    = result.pref
        target.city    = result.city
        target.address = result.street
      }
    })
  }

  return { lookup, watchAndFill, loading, error }
}`

const code2 = `const { watchAndFill, loading: postalLoading, error: postalError } = usePostalCode()
const form = reactive({ zip: '', pref: '', city: '', address: '' })

// ← これだけでフォームへの自動入力が完成
watchAndFill(toRef(form, 'zip'), form)`

const { watchAndFill, loading: postalLoading, error: postalError } = usePostalCode()

const form = reactive({
  zip: '',
  pref: '',
  city: '',
  address: '',
  building: '',
  name: '',
  phone: '',
  email: '',
})

const submitted = ref(false)

// usePostalCode の watchAndFill に form.zip の変化を監視させるだけ
watchAndFill(toRef(form, 'zip'), form)

function autoClass(val: string) {
  return [
    'w-full px-3 py-2.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition',
    val ? 'bg-purple-50 border-purple-400 autofilled' : 'bg-white border-gray-300',
  ]
}

function handleSubmit() {
  submitted.value = true
}
</script>

<style scoped>
.field {
  @apply w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base bg-white
         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition;
}
</style>
