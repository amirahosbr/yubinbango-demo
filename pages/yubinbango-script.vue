<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full badge-dom">スクリプトタグ版</span>
        <h1 class="text-2xl font-bold text-gray-900">yubinbango.js</h1>
      </div>
      <p class="text-gray-500 text-sm">
        CDN のスクリプトタグ版。フォームフィールドに特定のクラス名（<code class="bg-gray-100 px-1 rounded text-xs">p-region</code>,
        <code class="bg-gray-100 px-1 rounded text-xs">p-locality</code> 等）を付与することで DOM を直接書き換えます。
        Vue のリアクティビティと競合するため、<code class="bg-gray-100 px-1 rounded text-xs">setTimeout</code> で同期する回避策が必要です。
      </p>
    </div>

    <!-- Warning banner -->
    <div class="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 text-sm text-yellow-800">
      <strong>⚠️ 注意:</strong> このアプローチは Vue の <code class="bg-yellow-100 px-1 rounded text-xs">v-model</code> と競合します。
      yubinbango.js が DOM を直接書き換えても Vue は変更を検知できないため、<code class="bg-yellow-100 px-1 rounded text-xs">setTimeout</code>
      で DOM の値を手動で読み取って同期する必要があります。実務では yubinbango-core を推奨します。
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <!-- yubinbango.js が必要な非表示フィールド -->
      <span class="p-country-name hidden">Japan</span>

      <form class="h-adr" @submit.prevent="handleSubmit" novalidate>
        <!-- Zip -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">郵便番号</label>
          <div class="flex items-center gap-2">
            <span class="text-gray-400 font-medium">〒</span>
            <input
              ref="zipRef"
              v-model="form.zip"
              type="text"
              maxlength="8"
              placeholder="例: 1000001 または 100-0001"
              class="p-postal-code flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition font-mono"
              @input="onZipInput"
            />
          </div>
          <p class="mt-1 text-xs text-gray-400">7桁入力後、DOM 読み取りで自動入力します（約300ms）</p>
        </div>

        <!-- Auto-filled (DOM-driven, synced back to Vue) -->
        <div class="bg-gray-50 rounded-xl p-4 mb-5 space-y-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">自動入力エリア (DOM → Vue 同期)</p>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">都道府県</label>
            <input
              ref="prefRef"
              :value="form.pref"
              type="text"
              placeholder="自動入力されます"
              class="p-region"
              :class="autoClass(form.pref)"
              @input="form.pref = ($event.target as HTMLInputElement).value"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">市区町村</label>
            <input
              ref="cityRef"
              :value="form.city"
              type="text"
              placeholder="自動入力されます"
              class="p-locality"
              :class="autoClass(form.city)"
              @input="form.city = ($event.target as HTMLInputElement).value"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">町域・番地</label>
            <input
              ref="addrRef"
              :value="form.address"
              type="text"
              placeholder="自動入力されます（続きは手入力）"
              class="p-street-address"
              :class="autoClass(form.address)"
              @input="form.address = ($event.target as HTMLInputElement).value"
            />
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
          class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl transition-colors text-base"
        >
          送信する
        </button>

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
          <li>⚠️ Vue のリアクティビティと競合する DOM 操作</li>
          <li>⚠️ setTimeout によるタイミング依存の同期</li>
          <li>⚠️ v-model が使えず :value + @input パターンが必要</li>
          <li>❌ Nuxt 3 / Vue では非推奨 — yubinbango-core を使うべき</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
const codeBlock = `// 1. useHead でスクリプトタグを追加
useHead({
  script: [{ src: 'https://yubinbango.github.io/yubinbango/asset/js/yubinbango.js' }]
})

// 2. フォームに特定のクラス名を付与 (yubinbango.js が認識する)
// <form class="h-adr">
//   <span class="p-country-name" hidden>Japan</span>
//   <input class="p-postal-code" />  ← zip 入力フィールド
//   <input class="p-region"      />  ← 都道府県 (DOM 直書き換え)
//   <input class="p-locality"    />  ← 市区町村 (DOM 直書き換え)
//   <input class="p-street-address" />
// </form>

// 3. yubinbango.js は DOM を直接書き換えるので Vue は気づかない
//    → setTimeout で DOM から Vue state に手動同期
function onZipInput() {
  setTimeout(() => {
    form.pref    = prefRef.value?.value ?? ''
    form.city    = cityRef.value?.value ?? ''
    form.address = addrRef.value?.value ?? ''
  }, 300) // yubinbango.js が処理を終えるまで待つ
}

// ⚠️ v-model ではなく :value + @input を使う
// <input ref="prefRef" :value="form.pref" @input="form.pref = $event.target.value" />`

useHead({
  title: 'yubinbango.js デモ | 郵便番号自動入力',
  script: [
    {
      src: 'https://yubinbango.github.io/yubinbango/asset/js/yubinbango.js',
      defer: true,
    },
  ],
})

const zipRef = ref<HTMLInputElement | null>(null)
const prefRef = ref<HTMLInputElement | null>(null)
const cityRef = ref<HTMLInputElement | null>(null)
const addrRef = ref<HTMLInputElement | null>(null)

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

const status = reactive({ success: false })

function autoClass(val: string) {
  return [
    'w-full px-3 py-2.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 transition',
    val ? 'bg-yellow-50 border-yellow-400 autofilled' : 'bg-white border-gray-300',
  ]
}

function onZipInput() {
  // yubinbango.js は非同期で DOM を書き換えるため、少し待ってから同期する
  setTimeout(() => {
    form.pref = prefRef.value?.value ?? ''
    form.city = cityRef.value?.value ?? ''
    form.address = addrRef.value?.value ?? ''
  }, 300)
}

function handleSubmit() {
  status.success = true
}
</script>

<style scoped>
.field {
  @apply w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base bg-white
         focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition;
}
</style>
