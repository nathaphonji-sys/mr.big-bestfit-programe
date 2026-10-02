import { useState } from 'react'

/** Replace public/assets/brand/mrbig-logo.svg with the approved brand artwork. */
export default function BrandLogo() {
  const [failed, setFailed] = useState(false)
  return <span className="brand-logo">
    {failed ? <span className="brand-logo-fallback">MR.BIG</span> :
      <img src="/assets/brand/mrbig-logo.svg" alt="MR.BIG" onError={() => setFailed(true)} />}
  </span>
}
