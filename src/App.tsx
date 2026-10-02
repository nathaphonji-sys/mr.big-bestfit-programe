import { useMemo, useRef, useState } from 'react'
import Results from './components/Results'
import AssessmentForm from './components/AssessmentForm'
import BrandLogo from './components/BrandLogo'
import { assessmentContent } from './config/assessmentContent'
import { loadBestFitData, type DataLoadResult } from './services/googleSheets'
import { calculate, emptyInputs, type Inputs } from './engine'

export default function App({ dataState: initialData, loadData = loadBestFitData }: { dataState: DataLoadResult; loadData?: typeof loadBestFitData }) {
  const [dataState, setDataState] = useState(initialData)
  const [reloading, setReloading] = useState(false)
  const [hasReloaded, setHasReloaded] = useState(false)
  const reloadInFlight = useRef(false)
  const [input, setInput] = useState<Inputs>({ ...emptyInputs })
  const [submitted, setSubmitted] = useState<Inputs | null>(null)
  const result = useMemo(() => submitted ? calculate(submitted, dataState.data) : null, [submitted, dataState.data])
  const [formVersion, setFormVersion] = useState(0)
  const focusTitle = () => window.setTimeout(() => document.querySelector<HTMLElement>('#step-title, #results-title')?.focus({ preventScroll: true }), 30)
  const reloadData = async () => {
    if (reloadInFlight.current) return
    reloadInFlight.current = true
    setReloading(true)
    try {
      const latest = await loadData()
      setDataState(latest)
      setHasReloaded(true)
    } finally {
      reloadInFlight.current = false
      setReloading(false)
    }
  }
  const reset = () => {
    setInput({ ...emptyInputs }); setSubmitted(null); setFormVersion(version => version + 1)
    focusTitle(); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return <>
    <a className="skip-link" href="#main">ข้ามไปเนื้อหา</a>
    <header className="site-header"><a href="#" onClick={e => { e.preventDefault(); reset() }} className="brand-home" aria-label="MR.BIG เริ่มหน้าแรก"><BrandLogo /></a><div className="header-right"><span className="prototype-badge">PUBLIC PROTOTYPE</span><span className="language">TH</span></div></header>
    <main id="main">
      <div className={`data-status sheets-status ${dataState.error && !reloading ? 'data-fallback' : ''}`}>
        <span role={dataState.error && !reloading ? 'alert' : 'status'} aria-live="polite">{reloading ? 'กำลังอัปเดตข้อมูล...' : dataState.error ? 'อัปเดต Google Sheets ไม่สำเร็จ ขณะนี้ใช้ข้อมูลสำรองเดิม กรุณาลองอีกครั้ง' : hasReloaded ? 'อัปเดตข้อมูลล่าสุดแล้ว' : 'โหลดข้อมูลจาก Google Sheets แล้ว'}</span>
        <button type="button" className="sheets-reload" onClick={() => void reloadData()} disabled={reloading} aria-busy={reloading}>{reloading ? 'กำลังอัปเดตข้อมูล...' : 'อัปเดต Google Sheets'}</button>
        {dataState.error && !reloading && <details><summary>รายละเอียด</summary>{dataState.error}</details>}
      </div>
      {result ? <Results dataState={dataState} result={result} onEdit={() => { setSubmitted(null); focusTitle() }} onReset={reset} /> : <>
        <section className="assessment-hero"><h1>{assessmentContent.hero.title} <span>{assessmentContent.hero.titleSuffix}</span></h1><p>{assessmentContent.hero.subtitle}</p></section>
        <AssessmentForm key={formVersion} input={input} onChange={(key, value) => setInput(previous => ({ ...previous, [key]: value }))} onComplete={answers => {
          setInput(answers); setSubmitted({ ...answers }); focusTitle(); window.scrollTo({ top: 0, behavior: 'smooth' })
        }} />
      </>}
    </main>
    <footer className="site-footer"><p>MR.BIG BestFIT Recommendation</p><p>คำแนะนำเพื่อการนอนที่เหมาะกับสรีระของคุณ</p></footer>
  </>
}
