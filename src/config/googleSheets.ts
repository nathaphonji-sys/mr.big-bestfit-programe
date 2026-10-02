// Only these four IDs can be read by the proxy. Omit gid to export the first tab.
export const SPREADSHEET_IDS = {
  products: '1IJYNkYaLVhTDQAYzqodQcz-LS3Bow1lJ2FlR_U3x7p0',
  clinic: '14-coLGe9gh-iHki7tDAVTDYZUCqFvZS2Vt7A1jyNJQs',
  pillows: '1n84XMPRemPu_tJwIZVFQaZvElpoR1PaL9Zbgj4xBDLg',
  mattresses: '1gcIiug9SFUhewf9n07ZXjHX1xslfOyw6Oy5a3PjFeFk',
} as const
export type SheetKey = keyof typeof SPREADSHEET_IDS
export function firstSheetCsvUrl(key: SheetKey) {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_IDS[key]}/export?format=csv`
}
