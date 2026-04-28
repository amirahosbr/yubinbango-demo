import type { YubinBangoData } from 'yubinbango-core'
import YubinBango from 'yubinbango-core'

export interface PostalAddress {
  pref: string
  city: string
  street: string
}

export function usePostalCode() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  function lookup(zipcode: string): Promise<PostalAddress | null> {
    const clean = zipcode.replace(/-/g, '')

    if (!/^\d{7}$/.test(clean)) {
      return Promise.resolve(null)
    }

    if (!import.meta.client) return Promise.resolve(null)

    loading.value = true
    error.value = null

    return new Promise((resolve) => {
      new YubinBango.Core(clean, (addr: YubinBangoData) => {
        loading.value = false

        if (!addr.region) {
          error.value = '該当する住所が見つかりませんでした'
          resolve(null)
          return
        }

        resolve({
          pref: addr.region,
          city: addr.locality,
          street: addr.street,
        })
      })
    })
  }

  function watchAndFill(
    zipRef: Ref<string>,
    target: { pref: string; city: string; address: string },
  ) {
    watch(zipRef, async (val) => {
      error.value = null

      if (val.replace(/-/g, '').length < 7) {
        if (!val) {
          target.pref = ''
          target.city = ''
          target.address = ''
        }
        return
      }

      const result = await lookup(val)
      if (result) {
        target.pref = result.pref
        target.city = result.city
        target.address = result.street
      }
    })
  }

  return { lookup, watchAndFill, loading, error }
}
