/** Uses the plain image_url cell; Markdown syntax is deliberately not interpreted. */
export function getDisplayImageUrl(imageUrl: string | null | undefined): string {
  const raw = imageUrl?.trim() ?? ''
  if (!raw) return ''
  try {
    const url = new URL(raw)
    if (!['https:', 'http:'].includes(url.protocol)) return ''
    if (url.hostname === 'drive.google.com') {
      const fileId = url.pathname.match(/^\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get('id')
      if (!fileId || !/^[\w-]+$/.test(fileId)) return ''
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
    }
    return url.href
  } catch { return '' }
}
