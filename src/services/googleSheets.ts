import { buildBestFitData, localData, parseCsv, validateRows, type BestFitData, type Row } from '../data'
import type { SheetKey } from '../config/googleSheets'
export type SheetLoadStatus = { key: SheetKey; status: 'loaded' | 'failed'; rowCount?: number; error?: string }
export type DataLoadResult = { data: BestFitData; source: 'google-sheets' | 'local-fallback'; loadedAt: string; error?: string; sheets?: SheetLoadStatus[] }
export type Fetcher = typeof fetch
async function loadSheet(key: SheetKey, fetcher: Fetcher = fetch): Promise<Row[]> {
  const controller = new AbortController()
  const timeout = setTimeout(()=>controller.abort(),15000)
  try {
    const response = await fetcher(`/api/sheets?sheet=${key}&ts=${Date.now()}`,{signal:controller.signal,cache:'no-store',credentials:'omit'})
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const csv = await response.text()
    if (/^\s*</.test(csv) || !csv.trim()) throw new Error('ไม่ได้รับข้อมูล CSV')
    return validateRows(parseCsv(csv),key)
  } catch (error) {
    throw new Error(`${key}: ${controller.signal.aborted ? 'หมดเวลารอข้อมูล' : error instanceof Error ? error.message : 'โหลดข้อมูลไม่สำเร็จ'}`)
  } finally { clearTimeout(timeout) }
}
export const loadProductMaster = (fetcher?: Fetcher) => loadSheet('products',fetcher)
export const loadClinicAdjustmentRules = (fetcher?: Fetcher) => loadSheet('clinic',fetcher)
export const loadPillowRules = (fetcher?: Fetcher) => loadSheet('pillows',fetcher)
export const loadMattressRules = (fetcher?: Fetcher) => loadSheet('mattresses',fetcher)
export async function loadBestFitData(fetcher?: Fetcher): Promise<DataLoadResult> {
  const keys: SheetKey[] = ['products', 'clinic', 'pillows', 'mattresses']
  // Wait for all four reports so Admin can see every failure, not just the first.
  const results = await Promise.allSettled(keys.map(key => loadSheet(key, fetcher)))
  const sheets: SheetLoadStatus[] = results.map((result, index) => result.status === 'fulfilled'
    ? {key: keys[index], status: 'loaded', rowCount: result.value.length}
    : {key: keys[index], status: 'failed', error: result.reason instanceof Error ? result.reason.message : String(result.reason)})
  const loadedAt = new Date().toISOString()
  try {
    const failed = sheets.filter(sheet => sheet.status === 'failed')
    if (failed.length) throw new Error(failed.map(sheet => sheet.error).join('; '))
    const rows = Object.fromEntries(results.map((result, index) => [keys[index], result.status === 'fulfilled' ? result.value : []])) as Record<SheetKey, Row[]>
    return {data:buildBestFitData(rows),source:'google-sheets',loadedAt,sheets}
  } catch (error) {
    // Never combine new rules with an older product catalog after a partial failure.
    return {data:localData,source:'local-fallback',loadedAt,sheets,error:error instanceof Error?error.message:'Failed to load Google Sheets'}
  }
}
