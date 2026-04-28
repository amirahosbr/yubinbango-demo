declare module 'yubinbango-core' {
  export interface YubinBangoData {
    region_id: string
    region: string
    locality: string
    street: string
    extended: string
  }

  // The package exports a namespace: YubinBango = { Core: class }
  // var YubinBango; ... t.Core = i ... module.exports = YubinBango
  const YubinBango: {
    Core: new (zipcode: string, callback: (data: YubinBangoData) => void) => void
  }
  export default YubinBango
}
