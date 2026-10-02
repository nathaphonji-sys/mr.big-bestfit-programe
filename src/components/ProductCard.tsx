import { useState } from 'react'
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import { safeUrl, type Recommendation } from '../engine'
import { getDisplayImageUrl } from '../utils/productImage'
function ProductImage({url,name,featured}: {url:string;name:string;featured:boolean}) {
  const [failed,setFailed] = useState(false)
  return <div className="product-image-frame">
    {url && !failed ? <img src={url} alt={name} loading={featured?'eager':'lazy'} decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/> :
      <div className="product-placeholder" role="img" aria-label={`ยังไม่มีภาพสินค้า ${name}`}><ImageIcon size={32} strokeWidth={1}/><span>MR.BIG</span><small>ยังไม่มีภาพสินค้า</small></div>}
  </div>
}
export default function ProductCard({item,featured=false,label,showSize=false}: {item:Recommendation;featured?:boolean;label?:string;showSize?:boolean}) {
  const p=item.product, name=p?.product_name || item.name, url=getDisplayImageUrl(p?.image_url), link=safeUrl(p?.product_url)
  return <article className={`recommendation-card ${featured?'recommendation-primary':'recommendation-secondary'}`}>
    <ProductImage key={url} url={url} name={name} featured={featured}/>
    <div className="recommendation-content">
      <span className="eyebrow">{label || (featured?'PRIMARY RECOMMENDATION':'BESTFIT SELECTION')}</span>
      <h3>{name}</h3>
      {p?.short_claim && <p className="product-claim">{p.short_claim}</p>}
      {featured ? <>
        {p?.short_description && <p className="product-description">{p.short_description}</p>}
        {p?.best_for && <div className="product-best-for"><span>เหมาะสำหรับ</span><p>{p.best_for}</p></div>}
        <p className="fit-reason">{item.reason}</p>
      </> : <details className="recommendation-detail"><summary>เกี่ยวกับสินค้านี้</summary>
        {p?.short_description && <p>{p.short_description}</p>}
        {p?.best_for && <p>เหมาะสำหรับ: {p.best_for}</p>}
        {showSize && p?.size && <p>ขนาด: {p.size}</p>}
        <p>{item.reason}</p>
      </details>}
      {!p && <p className="muted">ยังไม่มีรายละเอียดสินค้า</p>}
      <div className="recommendation-action">
        {p?.price_thb && Number(p.price_thb)>0 && <strong>฿{Number(p.price_thb).toLocaleString('th-TH')}</strong>}
        {link ? <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`ดูรายละเอียดสินค้า ${name}`}>ดูรายละเอียดสินค้า <ArrowUpRight size={16}/></a> : <span className="muted">สอบถามรายละเอียดกับ MR.BIG</span>}
      </div>
    </div>
  </article>
}
