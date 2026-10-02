import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { assessmentVisuals } from '../config/assessmentVisuals'
import { getAssessmentImageUrl } from '../utils/assessmentImage'

function ImageWithFallback({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  const [placeholderFailed, setPlaceholderFailed] = useState(false)
  const placeholder = getAssessmentImageUrl(assessmentVisuals.placeholder)
  const isPlaceholder = !src || failed
  const url = isPlaceholder ? placeholder : src
  return <span className="assessment-image-frame" aria-hidden="true">
    {url && !(isPlaceholder && placeholderFailed)
      ? <img src={url} alt="" decoding="async" referrerPolicy="no-referrer"
          onError={() => isPlaceholder ? setPlaceholderFailed(true) : setFailed(true)} />
      : <ImageIcon size={30} strokeWidth={1} className="assessment-placeholder-icon" />}
  </span>
}

export default function AssessmentImage({ image }: { image?: string }) {
  const src = getAssessmentImageUrl(image)
  return <ImageWithFallback key={src} src={src} />
}
