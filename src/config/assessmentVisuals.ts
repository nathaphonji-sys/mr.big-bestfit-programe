/**
 * แก้ path/URL รูปได้ แต่ห้ามเปลี่ยน value/code ของ mapping ถ้าไม่ได้แก้ rules
 * P1 → back, P2 → side, P3 → stomach; A/B/C/D → front shape; X/Y → side shape
 * แก้ label ตัวเลือกที่ assessmentOptions.ts ไม่ใช่ไฟล์นี้
 * เปลี่ยนรูป local asset หรือแก้ URL ใน config ต้อง build/deploy ใหม่
 * รูปสินค้าใน result ให้แก้ Google Sheets product_master.image_url แล้วกดอัปเดต Sheets (ไม่ต้อง deploy)
 */
export const assessmentVisuals = {
  sleep: {
    P1: '/assets/assessment/sleep-position/back.svg',
    P2: '/assets/assessment/sleep-position/side.svg',
    P3: '/assets/assessment/sleep-position/stomach.svg',
  },
  front: {
    A: '/assets/assessment/front-shape/shape-a.svg',
    B: '/assets/assessment/front-shape/shape-b.svg',
    C: '/assets/assessment/front-shape/shape-c.svg',
    D: '/assets/assessment/front-shape/shape-d.svg',
  },
  side: {
    X: '/assets/assessment/side-shape/shape-x.svg',
    Y: '/assets/assessment/side-shape/shape-y.svg',
  },
  shoulder: {
    narrow: '/assets/assessment/shoulder-type/narrow.svg',
    normal: '/assets/assessment/shoulder-type/normal.svg',
    wide: '/assets/assessment/shoulder-type/wide.svg',
  },
  feel: {
    soft: '/assets/assessment/mattress-feel/soft.svg',
    medium: '/assets/assessment/mattress-feel/medium.svg',
    firm: '/assets/assessment/mattress-feel/firm.svg',
  },
  placeholder: '/assets/assessment/placeholders/assessment-placeholder.svg',
} satisfies Record<string, Record<string, string> | string>

export type AssessmentVisualGroup = 'sleep' | 'front' | 'side' | 'shoulder' | 'feel'
