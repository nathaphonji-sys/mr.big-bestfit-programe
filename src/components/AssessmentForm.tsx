import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronLeft, LockKeyhole } from 'lucide-react'
import { emptyInputs, validate, type Inputs } from '../engine'
import { assessmentOptions, type AssessmentOption } from '../config/assessmentOptions'
import { assessmentContent as content } from '../config/assessmentContent'
import { assessmentVisuals } from '../config/assessmentVisuals'
import AssessmentImage from './AssessmentImage'
import '../assessment.css'

type Errors = Partial<Record<keyof Inputs, string>>
const stepFields: (keyof Inputs)[][] = [['weight', 'height', 'sleep'], ['front', 'side']]

export default function AssessmentForm({ input, onChange, onComplete }: {
  input: Inputs
  onChange: (key: keyof Inputs, value: string) => void
  onComplete: (answers: Inputs) => void
}) {
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const set = (key: keyof Inputs, value: string) => {
    onChange(key, value)
    setErrors(previous => ({ ...previous, [key]: undefined }))
  }
  const moveTo = (next: number) => {
    setStep(next)
    window.setTimeout(() => {
      const title = document.getElementById('step-title')
      title?.focus({ preventScroll: true })
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 20)
  }
  const advance = (event: FormEvent) => {
    event.preventDefault()
    // Page 3 is optional. All its choices (including "none") are engine-supported.
    if (step === 2) { onComplete(input); return }
    const all = validate(input)
    const relevant: Errors = Object.fromEntries(Object.entries(all).filter(([key]) => stepFields[step].includes(key as keyof Inputs)).map(([key]) => [key, content.validation.fields[key as keyof Inputs]]))
    // The wizard requires both shapes; the underlying calculation stays unchanged.
    if (step === 1) {
      if (!input.front) relevant.front = content.validation.fields.front
      if (!input.side) relevant.side = content.validation.fields.side
    }
    setErrors(relevant)
    if (Object.keys(relevant).length) {
      window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 30)
      return
    }
    moveTo(step + 1)
  }
  const skipOptional = () => {
    // Pass the snapshot directly so calculation cannot read stale React state.
    onComplete({ ...input, problem: emptyInputs.problem, pillow: emptyInputs.pillow,
      shoulder: emptyInputs.shoulder, feel: emptyInputs.feel })
  }
  const help = (key: keyof Inputs) => content.questions[key].helperText
    ? <p className="assessment-shape-hint" id={`${key}-help`}>{content.questions[key].helperText}</p> : null
  const describedBy = (key: keyof Inputs) => [content.questions[key].helperText ? `${key}-help` : '', errors[key] ? `${key}-error` : ''].filter(Boolean).join(' ') || undefined
  const select = (key: keyof Inputs, options: readonly AssessmentOption[]) => <div className="assessment-field">
    <label htmlFor={key}>{content.questions[key].label}</label>
    {help(key)}
    <div className="assessment-select"><select id={key} value={input[key]} onChange={e => set(key, e.target.value)} aria-invalid={!!errors[key]} aria-describedby={describedBy(key)}>
      {options.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
    </select><ChevronDown size={17} aria-hidden="true" /></div>
    {errors[key] && <small className="error" id={`${key}-error`}>{errors[key]}</small>}
  </div>
  const choices = (key: 'sleep' | 'front' | 'side', options: readonly AssessmentOption[]) => {
    const images: Record<string, string> = assessmentVisuals[key]
    return <fieldset className={`assessment-question assessment-question-${key}`}>
      <legend>{content.questions[key].label}<span className="assessment-required"> *</span></legend>
      {help(key)}
      <div className={`assessment-options assessment-options-${key}`}>
        {options.map(({value: code, label: text}) => <label className={`assessment-option ${input[key] === code ? 'is-selected' : ''}`} key={code}>
          <input type="radio" name={key} value={code} checked={input[key] === code} onChange={() => set(key, code)} required aria-invalid={!!errors[key]} aria-describedby={describedBy(key)} />
          <span className="assessment-check" aria-hidden="true">{input[key] === code && <Check size={13} strokeWidth={2.5} />}</span>
          <AssessmentImage image={images[code]} />
          <span className="assessment-option-label">{key === 'sleep' ? text : <><strong>{code}</strong><span>{text}</span></>}</span>
        </label>)}
      </div>
      {errors[key] && <small className="error" id={`${key}-error`}>{errors[key]}</small>}
    </fieldset>
  }
  const hasErrors = Object.values(errors).some(Boolean)
  return <section className="assessment-shell" aria-label={content.accessibility.formLabel}>
    <nav className="assessment-progress" aria-label={content.accessibility.progressLabel}>
      {content.steps.map(({label}, index) => <div key={label} className={`assessment-progress-step ${index === step ? 'is-current' : ''} ${index < step ? 'is-complete' : ''}`} aria-current={index === step ? 'step' : undefined}>
        <span className="assessment-progress-track" />
        <span className="assessment-progress-label"><span>{index < step ? <Check size={12} /> : `0${index + 1}`}</span>{label}</span>
      </div>)}
    </nav>
    <form ref={formRef} onSubmit={advance} noValidate autoComplete="off" className="assessment-form">
      <div className="assessment-section-heading"><span className="assessment-step-count">0{step + 1} / 03</span><h2 id="step-title" tabIndex={-1}>{content.steps[step].title}</h2>
        <p>{content.steps[step].description}</p>
      </div>
      {step === 0 && <><div className="assessment-fields assessment-measurements">
        {(['weight', 'height'] as const).map(key => {
          const {label, unit, placeholder} = content.questions[key]
          return <div key={key} className="assessment-field">
          <label htmlFor={key}>{label}<span className="assessment-required"> *</span></label>
          {help(key)}
          <div className="assessment-number"><input id={key} type="number" inputMode="decimal" min="0.1" step="any" required placeholder={placeholder} value={input[key]} onChange={e => set(key, e.target.value)} aria-invalid={!!errors[key]} aria-describedby={[`${key}-unit`, describedBy(key)].filter(Boolean).join(' ')} /><span id={`${key}-unit`}>{unit}</span></div>
          {errors[key] && <small id={`${key}-error`} className="error">{errors[key]}</small>}
        </div>})}
      </div>
        <div className="assessment-basic-sleep">{choices('sleep', assessmentOptions.sleep)}</div>
      </>}
      {step === 1 && <>
        {choices('front', assessmentOptions.front)}
        {choices('side', assessmentOptions.side)}
      </>}
      {step === 2 && <div className="assessment-fields">
        {select('problem', assessmentOptions.problem)}
        {select('pillow', assessmentOptions.pillow)}
        {select('shoulder', assessmentOptions.shoulder)}
        {select('feel', assessmentOptions.feel)}
      </div>}
      {hasErrors && <p className="assessment-validation" role="alert">{step === 0 ? content.validation.page1 : content.validation.page2}</p>}
      <div className={`assessment-actions ${step === 2 ? 'assessment-actions-final' : ''}`}>
        {step > 0 ? <button className="assessment-back" type="button" onClick={() => { setErrors({}); moveTo(step - 1) }}><ChevronLeft size={16} />{content.buttons.back}</button> : <span className="assessment-required-note">{content.helper.required}</span>}
        {step === 2 && <button type="button" className="assessment-skip" onClick={skipOptional}>{content.buttons.skip}</button>}
        <button type="submit" className="assessment-submit">{step === 2 ? content.buttons.submit : content.buttons.next}<ArrowRight size={18} /></button>
      </div>
    </form>
    <p className="assessment-privacy"><LockKeyhole size={13} aria-hidden="true" />{content.helper.privacy}</p>
  </section>
}
