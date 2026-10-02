import { buildBestFitData, localData, parseCsv, validateRows, type BestFitData, type Row } from '../data'
import type { SheetKey } from '../config/googleSheets'
export type DataLoadResult = { data: BestFitData; source: 'google-sheets' | 'local-fallback'; loadedAt: string; error?: string }
export type Fetcher = typeof fetch
async function loadSheet(key: SheetKey, fetcher: Fetcher = fetch): Promise<Row[]> {
  const controller = new AbortController()
  const timeout = setTimeout(()=>controller.abort(),15000)
  try {
    const response = await fetcher(`/api/sheets?sheet=${key}`,{signal:controller.signal,cache:'no-store',credentials:'omit'})
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
  try {
    const [products,clinic,pillows,mattresses] = await Promise.all([loadProductMaster(fetcher),loadClinicAdjustmentRules(fetcher),loadPillowRules(fetcher),loadMattressRules(fetcher)])
    return {data:buildBestFitData({products,clinic,pillows,mattresses}),source:'google-sheets',loadedAt:new Date().toISOString()}
  } catch (error) {
    // Never combine new rules with an older product catalog after a partial failure.
    return {data:localData,source:'local-fallback',loadedAt:new Date().toISOString(),error:error instanceof Error?error.message:'โหลด Google Sheets ไม่สำเร็จ'}
  }
}
