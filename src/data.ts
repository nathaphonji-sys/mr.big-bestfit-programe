import Papa from 'papaparse'
import productsCsv from '../data/product_master_01-2.csv?raw'
import pillowsCsv from '../data/bestfit_pillow_base_rules_01-2.csv?raw'
import mattressesCsv from '../data/bestfit_mattress_base_rules_01-2.csv?raw'
import clinicCsv from '../data/clinic_adjustment_rules_01-2.csv?raw'
import type { SheetKey } from './config/googleSheets'
export type Row = Record<string, string>
export type BestFitData = { products: Row[]; inactiveProducts: Row[]; pillows: Row[]; mattresses: Row[]; clinic: Row[] }
export const isActive = (value: unknown) => ['t', 'true', '1', 'yes', 'y'].includes(String(value ?? '').trim().toLowerCase())
export function parseCsv(csv: string): Row[] {
  const parsed = Papa.parse<string[]>(csv.replace(/^\uFEFF/, ''), { skipEmptyLines: 'greedy' })
  if (parsed.errors.length) throw new Error(`ข้อมูล CSV ไม่สมบูรณ์: ${parsed.errors[0].message}`)
  const [header, ...values] = parsed.data
  if (!header?.length) throw new Error('ไฟล์ CSV ว่าง')
  const keys = header.map(v => v.trim())
  if (keys.some(k => !k) || new Set(keys).size !== keys.length) throw new Error('ชื่อคอลัมน์ว่างหรือซ้ำกัน')
  return values.map(cells => {
    if (cells.length > keys.length) throw new Error('ข้อมูล CSV มีคอลัมน์เกิน header')
    return Object.fromEntries(keys.map((key, i) => [key, String(cells[i] ?? '').trim()]))
  })
}
const schemas: Record<SheetKey, {id: string; required: string[]}> = {
  products: {id:'product_key',required:['product_name','aliases','product_group','product_url','image_url','display_priority']},
  pillows: {id:'rule_key',required:['head_pillow','special_pillow','positioning_pillow','special_positioning_pillow']},
  mattresses: {id:'rule_key',required:['primary_mattress','special_mattress','topper_result']},
  clinic: {id:'rule_id',required:['priority','sleep_position_code','main_problem','current_pillow_problem','shoulder_type','mattress_feel','promote_product','addon_product_1','addon_product_2','addon_product_3','message_type','clinical_note','addon_reason']},
}
export function validateRows(rows: Row[], key: SheetKey): Row[] {
  if (!rows.length) throw new Error(`${key}: ไม่พบแถวข้อมูล`)
  const {id,required} = schemas[key], seen = new Set<string>()
  for (const row of rows) {
    for (const column of ['active',id,...required]) if (!(column in row)) throw new Error(`${key}: ไม่พบคอลัมน์ ${column}`)
    if (!row[id] || seen.has(row[id])) throw new Error(`${key}: ข้อมูลซ้ำหรือไม่มีรหัส ${row[id]}`)
    seen.add(row[id])
  }
  return rows
}
export function buildBestFitData(tables: Record<SheetKey,Row[]>): BestFitData {
  for (const key of Object.keys(schemas) as SheetKey[]) validateRows(tables[key],key)
  return {
    products: tables.products.filter(r=>isActive(r.active)).sort((a,b)=>Number(a.display_priority || Infinity)-Number(b.display_priority || Infinity)),
    inactiveProducts: tables.products.filter(r=>!isActive(r.active)),
    pillows: tables.pillows.filter(r=>isActive(r.active)),
    mattresses: tables.mattresses.filter(r=>isActive(r.active)),
    clinic: tables.clinic.filter(r=>isActive(r.active)),
  }
}
// Keep the original CSV snapshot intact as the offline fallback (this app had no local JSON).
export const localData = buildBestFitData({products:parseCsv(productsCsv),pillows:parseCsv(pillowsCsv),mattresses:parseCsv(mattressesCsv),clinic:parseCsv(clinicCsv)})
// Backward-compatible exports for existing calculation tests and callers.
export const { products, inactiveProducts, pillows, mattresses, clinic } = localData
