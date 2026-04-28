declare module 'yubinbango-core2' {
  export interface YubinBangoData {
    region_id: string
    region: string
    locality: string
    street: string
    extended: string
  }

  // yubinbango-core2 compiles to: module.exports = YubinBango
  // So the default import IS the YubinBango namespace object.
  const YubinBango: {
    Core: new (zipcode: string, callback: (data: YubinBangoData) => void) => void
  }
  export = YubinBango
}
