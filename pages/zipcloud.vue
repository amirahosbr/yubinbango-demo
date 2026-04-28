<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full badge-api">REST API</span>
        <h1 class="text-2xl font-bold text-gray-900">zipcloud API</h1>
      </div>
      <p class="text-gray-500 text-sm">
        無料の郵便番号検索 API <code class="bg-gray-100 px-1 rounded text-xs">zipcloud.ibsnet.co.jp</code> を
        Nuxt の <code class="bg-gray-100 px-1 rounded text-xs">$fetch</code> で呼び出す方法。
        npm インストール不要ですが、ネットワーク接続が必要です。
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
              class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition font-mono"
              :class="{ 'border-red-400': status.error }"
            />
            <div v-if="status.loading" class="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          </div>
          <p v-if="status.error" class="mt-1 text-xs text-red-500">{{ status.error }}</p>
          <p v-else class="mt-1 text-xs text-gray-400">7桁の数字を入力すると API を呼び出して自動入力します</p>
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
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors text-base"
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
          <li>✅ npm インストール不要</li>
          <li>✅ API レスポンスの型定義が明確</li>
          <li>⚠️ ネットワーク接続が必要</li>
          <li>⚠️ API のダウンタイムで動作しなくなる可能性あり</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'zipcloud API デモ | 郵便番号自動入力' })

const codeBlock = `// npm インストール不要 — $fetch を使うだけ

interface ZipcloudResult {
  address1: string // 都道府県
  address2: string // 市区町村
  address3: string // 町域
}
interface ZipcloudResponse {
  status: number
  message: string | null
  results: ZipcloudResult[] | null
}

watch(() => form.zip, async (val) => {
  const clean = val.replace(/-/g, '')
  if (!/^\\d{7}$/.test(clean)) return

  // zipcloud は Content-Type: text/plain を返すので parseResponse が必要
  const data = await $fetch<ZipcloudResponse>(
    \`https://zipcloud.ibsnet.co.jp/api/search?zipcode=\${clean}\`,
    { parseResponse: (txt) => JSON.parse(txt) }
  )

  if (!data.results?.length) return // 該当なし

  const r = data.results[0]
  form.pref    = r.address1 // 例: "東京都"
  form.city    = r.address2 // 例: "新宿区"
  form.address = r.address3 // 例: "新宿"
})`

interface ZipcloudResult {
  address1: string
  address2: string
  address3: string
  kana1: string
  kana2: string
  kana3: string
  prefcode: string
  zipcode: string
}

interface ZipcloudResponse {
  status: number
  message: string | null
  results: ZipcloudResult[] | null
}

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
    'w-full px-3 py-2.5 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition',
    val ? 'bg-green-50 border-green-400 autofilled' : 'bg-white border-gray-300',
  ]
}

watch(
  () => form.zip,
  async (val) => {
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

    status.loading = true
    try {
      // zipcloud serves Content-Type: text/plain, so $fetch returns a raw string.
      // parseResponse forces JSON parsing regardless of the content-type header.
      const data = await $fetch<ZipcloudResponse>(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${clean}`,
        { parseResponse: (txt) => JSON.parse(txt) },
      )
      if (!data.results?.length) {
        status.error = '該当する住所が見つかりませんでした'
        return
      }
      const r = data.results[0]
      form.pref = r.address1
      form.city = r.address2
      form.address = r.address3
    }
    catch {
      status.error = 'API の呼び出しに失敗しました。ネットワークを確認してください。'
    }
    finally {
      status.loading = false
    }
  },
)

function handleSubmit() {
  status.success = true
}
</script>

<style scoped>
.field {
  @apply w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base bg-white
         focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition;
}
</style>
