<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full badge-npm">npm パッケージ</span>
        <h1 class="text-2xl font-bold text-gray-900">yubinbango-core</h1>
      </div>
      <p class="text-gray-500 text-sm">
        TypeScript フレンドリーな npm パッケージ。住所データを JSONP で
        <code class="bg-gray-100 px-1 rounded text-xs">yubinbango.github.io</code> から取得し、
        セッション内にキャッシュします。<code class="bg-gray-100 px-1 rounded text-xs">watch</code>
        で zip の変化を検知し、7桁になったタイミングでコールバックを呼び出します。
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
              class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
              :class="{ 'border-red-400': status.error }"
            />
            <div v-if="status.loading" class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          </div>
          <p v-if="status.error" class="mt-1 text-xs text-red-500">{{ status.error }}</p>
          <p v-else class="mt-1 text-xs text-gray-400">7桁の数字を入力すると自動入力します</p>
        </div>

        <!-- Auto-filled section -->
        <div class="bg-gray-50 rounded-xl p-4 mb-5 space-y-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">自動入力エリア</p>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">都道府県</label>
            <input
              v-model="form.pref"
              type="text"
              placeholder="自動入力されます"
              :class="autoClass(form.pref)"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">市区町村</label>
            <input
              v-model="form.city"
              type="text"
              placeholder="自動入力されます"
              :class="autoClass(form.city)"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">町域・番地</label>
            <input
              v-model="form.address"
              type="text"
              placeholder="自動入力されます（続きは手入力）"
              :class="autoClass(form.address)"
            />
          </div>
        </div>

        <!-- Manual fields -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">建物名・部屋番号</label>
          <input
            v-model="form.building"
            type="text"
            placeholder="例: ○○マンション 101号室"
            class="field"
          />
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
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-base"
        >
          送信する
        </button>

        <!-- Success -->
        <div v-if="status.success" class="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
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
        <CodeBlock class="mt-4" :code="codeBlock" />
        <ul class="mt-4 text-sm text-gray-600 space-y-1">
          <li>✅ JSONP でデータ取得・セッション内キャッシュ（同郵便番号は再リクエストなし）</li>
          <li>✅ TypeScript 型定義あり</li>
          <li>✅ Vue のリアクティビティと完全に互換</li>
          <li>✅ Pinia store からでも同じ書き方で呼べる</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import YubinBango from 'yubinbango-core'

useHead({ title: 'yubinbango-core デモ | 郵便番号自動入力' })

const codeBlock = `// npm install yubinbango-core
import YubinBango from 'yubinbango-core'

const form = reactive({ zip: '', pref: '', city: '', address: '' })

watch(() => form.zip, (val) => {
  const clean = val.replace(/-/g, '')
  if (!/^\\d{7}$/.test(clean)) return

  new YubinBango.Core(clean, (addr) => {
    form.pref    = addr.region   // 例: "東京都"
    form.city    = addr.locality // 例: "新宿区"
    form.address = addr.street   // 例: "新宿"
  })
})`

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

const status = reactive({ loading: false, error: '', success: false })

function autoClass(val: string) {
  return [
    'w-full px-3 py-2.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition',
    val
      ? 'bg-blue-50 border-blue-400 autofilled'
      : 'bg-white border-gray-300',
  ]
}

watch(
  () => form.zip,
  (val) => {
    const clean = val.replace(/-/g, '')
    status.error = ''
    status.success = false

    if (clean.length < 7) {
      if (clean.length === 0) {
        form.pref = ''
        form.city = ''
        form.address = ''
      }
      return
    }

    if (!/^\d{7}$/.test(clean)) {
      status.error = '郵便番号は半角数字7桁で入力してください'
      return
    }

    if (!import.meta.client) return

    status.loading = true
    new YubinBango.Core(clean, (addr) => {
      status.loading = false
      if (!addr.region) {
        status.error = '該当する住所が見つかりませんでした'
        return
      }
      form.pref = addr.region
      form.city = addr.locality
      form.address = addr.street
    })
  },
)

function handleSubmit() {
  status.success = true
}
</script>

<style scoped>
.field {
  @apply w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base bg-white
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition;
}
</style>
