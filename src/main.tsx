import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { isAdminLocation } from './utils/appMode'
const isAdminMode = isAdminLocation(window.location)
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<main className="data-loading" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true"/><h1>กำลังโหลดข้อมูล BestFIT</h1><p>{isAdminMode ? 'กำลังอ่านสินค้าและกฎจาก Google Sheets…' : 'กำลังเตรียมคำแนะนำสำหรับคุณ…'}</p></main>)
Promise.all([import('./App'),import('./services/googleSheets')]).then(async ([{default:App},{loadBestFitData}])=>{
  const dataState=await loadBestFitData()
  root.render(<React.StrictMode><App dataState={dataState} isAdminMode={isAdminMode}/></React.StrictMode>)
}).catch(()=>{
  root.render(<main className="fatal"><h1>ยังไม่สามารถเปิด BestFIT ได้</h1><p>กรุณาลองใหม่อีกครั้งภายหลัง หรือติดต่อ MR.BIG</p><button onClick={()=>location.reload()}>ลองอีกครั้ง</button></main>)
})
