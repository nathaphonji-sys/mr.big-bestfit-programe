import type { DataLoadResult } from '../services/googleSheets'

const sheetLabels = { products: 'สินค้า · product_master', clinic: 'กฎปรับคำแนะนำ · clinic', pillows: 'กฎหมอน · pillows', mattresses: 'กฎที่นอน · mattresses' }

export default function AdminTools({ dataState, reloading, hasReloaded, onReload }: {
  dataState: DataLoadResult; reloading: boolean; hasReloaded: boolean; onReload: () => void
}) {
  const fallback = dataState.source === 'local-fallback'
  const status = reloading ? 'กำลังอัปเดตข้อมูล...' : fallback ? 'โหลด Google Sheets ไม่สำเร็จ ขณะนี้ใช้ข้อมูลสำรอง' : hasReloaded ? 'อัปเดตข้อมูลล่าสุดแล้ว' : 'โหลด Google Sheets สำเร็จ'
  return <aside className="admin-tools" aria-label="Admin tools">
    <div className="admin-tools-heading"><span className="eyebrow">Admin tools</span>
      <button type="button" className="secondary" onClick={onReload} disabled={reloading} aria-busy={reloading}>{reloading ? 'กำลังอัปเดตข้อมูล...' : 'อัปเดตข้อมูลล่าสุด'}</button>
    </div>
    <p className="admin-status" role={fallback && !reloading ? 'alert' : 'status'} aria-live="polite">{status}</p>
    <dl className="admin-metadata">
      <div><dt>Data source</dt><dd>{fallback ? 'Fallback CSV' : 'Google Sheets'}</dd></div>
      <div><dt>Last loaded · เวลาไทย</dt><dd><time dateTime={dataState.loadedAt}>{new Date(dataState.loadedAt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}</time></dd></div>
    </dl>
    {reloading && <p className="admin-hint">กำลังโหลดข้อมูลใหม่ สถานะรายไฟล์และเวลาที่แสดงยังเป็นรอบก่อนหน้า</p>}
    {dataState.sheets && <ul className="admin-sheets">{dataState.sheets.map(sheet => <li key={sheet.key}>
      <span>{sheetLabels[sheet.key]}</span><span>{sheet.status === 'loaded' ? `โหลดสำเร็จ · ${sheet.rowCount} แถว` : 'โหลดไม่สำเร็จ'}</span>
      {sheet.error && <small>{sheet.error}</small>}
    </li>)}</ul>}
    {fallback && <p className="admin-hint">รอบนี้ใช้ CSV สำรองทั้งชุด ไม่ผสมข้อมูลใหม่กับข้อมูลสำรอง เวลาข้างต้นคือเวลาที่โหลดชุดสำรอง ไม่ใช่เวลาอัปเดต Google Sheets</p>}
    {dataState.error && <details className="admin-error"><summary>รายละเอียดข้อผิดพลาด</summary><p>{dataState.error}</p></details>}
  </aside>
}
