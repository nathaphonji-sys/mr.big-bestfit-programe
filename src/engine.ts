import { getDisplayImageUrl } from './utils/productImage'
import { localData, products, type BestFitData, type Row } from './data'
import { feelOptions, frontOptions, pillowOptions, problemOptions, shoulderOptions, sideOptions, sleepOptions } from './options'
export type Inputs = { weight: string; height: string; sleep: string; front: string; side: string; problem: string; pillow: string; shoulder: string; feel: string }
export const emptyInputs: Inputs = { weight:'', height:'', sleep:'', front:'', side:'', problem:'none', pillow:'none', shoulder:'none', feel:'none' }
export const normalize = (s: string) => s.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu,'')
export const weightCode = (v: number) => v <= 48 ? 'W1' : v <= 59 ? 'W2' : v <= 69 ? 'W3' : v <= 80 ? 'W4' : 'W5'
export const heightCode = (v: number) => v <= 150 ? 'H1' : v <= 165 ? 'H2' : v <= 175 ? 'H3' : v <= 185 ? 'H4' : 'H5'
export function validate(input: Inputs): Partial<Record<keyof Inputs,string>> {
  const errors: Partial<Record<keyof Inputs,string>> = {}
  if (!input.weight.trim() || !Number.isFinite(Number(input.weight)) || Number(input.weight) <= 0) errors.weight = 'กรอกน้ำหนักที่มากกว่า 0 กก.'
  if (!input.height.trim() || !Number.isFinite(Number(input.height)) || Number(input.height) <= 0) errors.height = 'กรอกส่วนสูงที่มากกว่า 0 ซม.'
  const checks: [keyof Inputs, string[][], boolean][] = [['sleep',sleepOptions,false],['front',frontOptions,true],['side',sideOptions,true],['problem',problemOptions,false],['pillow',pillowOptions,false],['shoulder',shoulderOptions,false],['feel',feelOptions,false]]
  for (const [key, options, optional] of checks) if (!(optional && !input[key]) && !options.some(o => o[0] === input[key])) errors[key] = 'กรุณาเลือกข้อมูลให้ครบถ้วน'
  // Both blank means pillow-only; a half-completed mattress assessment needs correction.
  if (input.front && !input.side) errors.side = 'เลือกรูปร่างด้านข้างเพื่อคำนวณที่นอน'
  if (input.side && !input.front) errors.front = 'เลือกรูปร่างด้านหน้าเพื่อคำนวณที่นอน'
  return errors
}
export function resolveProduct(name: string, catalog: Row[] = products): Row | undefined {
  const n = normalize(name)
  if (!n || n === 'nomatchfound') return undefined
  // Exact names and aliases only: avoid inventing a product through a partial text match.
  return catalog.find(p => [p.product_name,p.product_key,...p.aliases.split(',')].some(v => normalize(v) === n))
}
export type Recommendation = { name: string; product?: Row; reason: string; source?: 'primary_mattress' | 'special_mattress' | 'head_pillow' | 'special_pillow' | 'positioning_pillow' | 'special_positioning_pillow' | 'clinical_promote' | 'clinical_addon' }
export type Result = { input: Inputs; pillowKey: string; mattressKey: string | null; base?: Row; mattress?: Row; rules: Row[]; primary?: Recommendation; clinicalPrimary?: Recommendation; alternatives: Recommendation[]; positioning: Recommendation[]; addons: Recommendation[]; beds: Recommendation[]; toppers: Recommendation[] }
const validName = (name: string | null | undefined): name is string => typeof name === 'string' && !!name.trim() && normalize(name) !== 'nomatchfound'
const isBodyPillowName = (name: string | undefined) => /^bodypillow(?:\d+x\d+)?$/.test(normalize((name || '').replace(/×/g,'x')))
const isBodyPillow = (item: Recommendation) => [item.name,item.product?.product_name,item.product?.product_key].some(isBodyPillowName)
const recommendationKey = (item: Recommendation) => isBodyPillow(item) ? 'body_pillow' : normalize(item.product?.product_key || item.name)
const bodyRank = (item: Recommendation) => item.source === 'positioning_pillow' ? 0 : item.source === 'special_positioning_pillow' ? 1 : 2
/** Stable composition dedupe. Product lookup itself remains unchanged. */
export function dedupeRecommendations(items: (Recommendation | null | undefined)[], excluded: Recommendation[] = []): Recommendation[] {
  const excludedKeys = new Set(excluded.map(recommendationKey))
  const result: Recommendation[] = [], indexes = new Map<string,number>()
  for (const item of items) {
    if (!item || !validName(item.name)) continue
    const key = recommendationKey(item)
    if (excludedKeys.has(key)) continue
    const index = indexes.get(key)
    if (index === undefined) { indexes.set(key,result.length); result.push({...item,name:item.name.trim()}); continue }
    if (key === 'body_pillow') {
      const previous = result[index], preferred = bodyRank(item) < bodyRank(previous) ? item : previous
      const reasons = [...new Set([previous.reason,item.reason].filter(Boolean))]
      result[index] = {...preferred,reason:reasons.join(' · ')}
    }
  }
  return result
}
export function calculate(input: Inputs, data: BestFitData = localData): Result {
  const { clinic, inactiveProducts, mattresses, pillows, products } = data
  if (Object.keys(validate(input)).length) throw new Error('กรุณาตรวจสอบข้อมูลที่กรอก')
  const w = weightCode(Number(input.weight)), h = heightCode(Number(input.height))
  const pillowKey = `${w}_${h}_${input.sleep}`
  const mattressKey = input.front && input.side ? `${w}_${h}_${input.front}_${input.side}` : null
  const base = pillows.find(r => r.rule_key === pillowKey)
  const mattress = mattresses.find(r => r.rule_key === mattressKey)
  const match: Record<string,string> = { sleep_position_code: input.sleep, main_problem: input.problem, current_pillow_problem: input.pillow, shoulder_type: input.shoulder, mattress_feel: input.feel }
  const rules = clinic.filter(r => Object.entries(match).every(([key,value]) => r[key] === 'any' || r[key] === value)).sort((a,b) => Number(a.priority || Infinity) - Number(b.priority || Infinity) || a.rule_id.localeCompare(b.rule_id))
  const preferredBodyName = [base?.positioning_pillow,base?.special_positioning_pillow].find(isBodyPillowName)
  const clinicalName = (name: string) => {
    if (isBodyPillowName(name) && preferredBodyName) return preferredBodyName
    return ['bodyscale','newbodyscale','bodyscalepillow','newbodyscalepillow'].includes(normalize(name)) && base?.head_pillow ? base.head_pillow : name
  }
  const rec = (name: string, reason: string, source?: Recommendation['source']): Recommendation => ({name, product:resolveProduct(name, products), reason, ...(source?{source}:{})})
  const id = (r: Recommendation) => r.product?.product_key || normalize(r.name)
  function unique(items: Recommendation[], excluded: Recommendation[] = []) {
    return dedupeRecommendations(items.filter(r => validName(r.name) && !resolveProduct(r.name,inactiveProducts)),excluded)
  }
  // rules are already ordered by numeric priority then rule_id. Explicit promotions do not need a base match.
  const promotions = dedupeRecommendations(rules.filter(r=>validName(r.promote_product)).map(r=>{
    const name = clinicalName(r.promote_product)
    return {...rec(name,r.clinical_note,'clinical_promote'),product:resolveProduct(name,products) || resolveProduct(name,inactiveProducts)}
  }))
  // The snoring exception is grounded in matched clinic rows, never an invented Slopie recommendation.
  const snoringRule = input.problem === 'snoring' ? rules.find(r=>
    [r.promote_product,r.addon_product_1,r.addon_product_2,r.addon_product_3].some(name=>normalize(name)==='slopiepillow')) : undefined
  const snoringPrimary = snoringRule ? {...rec('Slopie Pillow',snoringRule.clinical_note,'clinical_promote'),product:resolveProduct('Slopie Pillow',products) || resolveProduct('Slopie Pillow',inactiveProducts)} : undefined
  const clinicalPrimary = snoringPrimary || promotions[0]
  const primary = clinicalPrimary || (base ? rec(base.head_pillow,'เลือกตามน้ำหนัก ส่วนสูง และท่านอนของคุณ','head_pillow') : undefined)
  const alternatives = base ? unique([rec(base.head_pillow,'ตัวเลือกพื้นฐานตามสรีระ','head_pillow'),rec(base.special_pillow,'ตัวเลือกพิเศษจากกฎ BestFIT','special_pillow')],primary ? [primary] : []) : []
  const clinicalAddons = rules.flatMap(r => [r.addon_product_1,r.addon_product_2,r.addon_product_3]
    .filter(validName).map(n => rec(clinicalName(n),r.addon_reason || r.clinical_note,'clinical_addon')))
  // Body Pillow sizing comes from the base positioning rule. Keep the clinical reason on that one card.
  const bodyReasons = [...new Set(clinicalAddons.filter(isBodyPillow).map(r=>r.reason).filter(Boolean))]
  const positioning = base ? unique([
    rec(base.positioning_pillow,'หมอนจัดท่าตามสรีระและท่านอน','positioning_pillow'),
    rec(base.special_positioning_pillow,'หมอนจัดท่าทางเลือกจากกฎ BestFIT','special_positioning_pillow')
  ].map(item=>isBodyPillow(item) && bodyReasons.length ? {...item,reason:[item.reason,...bodyReasons].join(' · ')} : item),[...(primary?[primary]:[]),...alternatives]) : []
  const addons = unique([...promotions,...clinicalAddons],[...(primary?[primary]:[]),...alternatives,...positioning])
  const beds: Recommendation[] = mattress ? unique([
    {...rec(mattress.primary_mattress,'ที่นอนหลักตามน้ำหนัก ส่วนสูง และรูปร่าง'), source:'primary_mattress' as const}
  ]) : []
  // An explicit special_mattress rule must remain visible even if its catalog active flag is blank/false.
  // Resolve details from the complete catalog; keep the existing active policy for all other recommendations.
  if (mattress && validName(mattress.special_mattress)) {
    const name = mattress.special_mattress.trim()
    const special: Recommendation = {name, product:resolveProduct(name,products) || resolveProduct(name,inactiveProducts),
      reason:'ที่นอนทางเลือกพิเศษจากกฎ BestFIT', source:'special_mattress'}
    if (!beds.some(item => id(item) === id(special))) beds.push(special)
  }
  return { input:{...input}, pillowKey, mattressKey, base, mattress, rules, primary, clinicalPrimary, alternatives, positioning, addons,
    beds,
    toppers: mattress ? unique([rec(mattress.topper_result,'ท็อปเปอร์จากกฎ BestFIT สำหรับรูปร่างของคุณ')]) : [] }
}
export function safeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : undefined } catch { return undefined }
}
export function imageUrl(value: string | undefined): string | undefined {
  return getDisplayImageUrl(value) || undefined
}
