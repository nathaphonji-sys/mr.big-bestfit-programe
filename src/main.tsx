import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<main className="data-loading" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true"/><h1>กำลังโหลดข้อมูล BestFIT</h1><p>กำลังอ่านสินค้าและกฎจาก Google Sheets…</p></main>)
Promise.all([import('./App'),import('./services/googleSheets')]).then(async ([{default:App},{loadBestFitData}])=>{
  const dataState=await loadBestFitData()
  root.render(<React.StrictMode><App dataState={dataState}/></React.StrictMode>)
}).catch(()=>{
  root.render(<main className="fatal"><h1>ยังไม่สามารถเปิด BestFIT ได้</h1><p>ข้อมูลสำรองอาจไม่สมบูรณ์ กรุณาลองใหม่หรือติดต่อ MR.BIG</p><button onClick={()=>location.reload()}>ลองอีกครั้ง</button></main>)
})
