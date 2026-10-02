import type { IncomingMessage, ServerResponse } from 'node:http'
import { firstSheetCsvUrl, SPREADSHEET_IDS, type SheetKey } from '../src/config/googleSheets'
// Shared by Vercel Functions and Vite's dev/preview middleware. No browser credentials forwarded.
export async function handleSheets(req: Pick<IncomingMessage,'method'|'url'>, res: Pick<ServerResponse,'statusCode'|'setHeader'|'end'>, fetcher: typeof fetch = fetch) {
  res.setHeader('Cache-Control','no-store')
  res.setHeader('X-Content-Type-Options','nosniff')
  const fail = (code: number, message: string) => { res.statusCode=code;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify({error:message})) }
  if (req.method!=='GET') {res.setHeader('Allow','GET');fail(405,'GET only');return}
  const params=new URL(req.url || '/api/sheets','http://localhost').searchParams
  const key=params.get('sheet') || ''
  if (params.getAll('sheet').length!==1 || !Object.hasOwn(SPREADSHEET_IDS,key)) {fail(400,'Unknown sheet');return}
  const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),10000)
  try {
    const response=await fetcher(firstSheetCsvUrl(key as SheetKey),{signal:controller.signal,cache:'no-store',credentials:'omit'})
    if (!response.ok) {fail(502,`Google Sheets returned ${response.status}`);return}
    if (response.headers.get('content-type')?.includes('text/html')) {fail(502,'Sheet is not publicly readable as CSV');return}
    const csv=await response.text()
    if (!csv.trim() || /^\s*</.test(csv) || csv.length>2_000_000) {fail(502,'Invalid CSV response');return}
    res.statusCode=200
    res.setHeader('Content-Type','text/csv; charset=utf-8')
    res.end(csv)
  } catch {fail(controller.signal.aborted?504:502,'Unable to load Google Sheets')}
  finally {clearTimeout(timeout)}
}
export default function handler(req: IncomingMessage,res: ServerResponse) { return handleSheets(req,res) }
