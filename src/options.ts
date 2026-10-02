// Compatibility adapter: engine and result code keep their existing tuple interface.
// Edit labels only in config/assessmentOptions.ts; do not maintain a second option list.
import { assessmentOptions, type AssessmentOption } from './config/assessmentOptions'
const tuples = (options: readonly AssessmentOption[]): string[][] => options.map(({value,label,description}) => description === undefined ? [value,label] : [value,label,description])
export const sleepOptions = tuples(assessmentOptions.sleep)
export const frontOptions = tuples(assessmentOptions.front)
export const sideOptions = tuples(assessmentOptions.side)
export const problemOptions = tuples(assessmentOptions.problem)
export const pillowOptions = tuples(assessmentOptions.pillow)
export const shoulderOptions = tuples(assessmentOptions.shoulder)
export const feelOptions = tuples(assessmentOptions.feel)
