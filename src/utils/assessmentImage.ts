import { getDisplayImageUrl } from './productImage'

export function getAssessmentImageUrl(imageUrlOrPath: string | null | undefined): string {
  const raw = imageUrlOrPath?.trim() ?? ''
  // Root-relative assets only; protocol-relative external URLs are not local paths.
  if (raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) return raw
  return getDisplayImageUrl(raw)
}
