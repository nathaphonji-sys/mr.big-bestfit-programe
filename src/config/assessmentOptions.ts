/**
 * แก้ label (และ description) ได้: เป็นข้อความแสดงผลเท่านั้น
 * ห้ามเปลี่ยน value/code เช่น P1, P2, P3, A–D, X/Y หรือ none ถ้าไม่ได้แก้ rules ด้วย
 * การเพิ่ม/ลบตัวเลือกต้องตรวจ rules ก่อน ไม่ใช่แค่แก้ label
 * หลังแก้ไฟล์นี้ต้อง build/deploy ใหม่
 */
export type AssessmentOption = { readonly value: string; readonly label: string; readonly description?: string }
export const assessmentOptions = {
  sleep: [
    {"value": "P1", "label": "นอนหงาย", "description": "Back sleeper"},
    {"value": "P2", "label": "นอนตะแคง", "description": "Side sleeper"},
    {"value": "P3", "label": "นอนคว่ำ", "description": "Stomach sleeper"},
  ],
  front: [
    {"value": "A", "label": "สะโพกกว้างกว่าไหล่"},
    {"value": "B", "label": "ไหล่กว้างกว่าสะโพก"},
    {"value": "C", "label": "ไหล่และสะโพกสมดุล"},
    {"value": "D", "label": "รูปร่างค่อนข้างตรง"},
  ],
  side: [
    {"value": "X", "label": "ลำตัวด้านข้างไม่โค้งมาก"},
    {"value": "Y", "label": "ลำตัวด้านข้างมีส่วนโค้ง"},
  ],
  problem: [
    {"value": "none", "label": "ยังไม่ระบุ"},
    {"value": "no_problem", "label": "ไม่มีปัญหา"},
    {"value": "neck_pain", "label": "ปวดคอ"},
    {"value": "shoulder_pain", "label": "ปวดบ่า / ไหล่"},
    {"value": "back_pain", "label": "ปวดหลัง"},
    {"value": "arm_numbness", "label": "ชาแขน"},
    {"value": "snoring", "label": "นอนกรน"},
    {"value": "reflux", "label": "กรดไหลย้อน / แน่นท้อง"},
  ],
  pillow: [
    {"value": "none", "label": "ยังไม่ระบุ"},
    {"value": "too_low", "label": "หมอนเดิมต่ำไป"},
    {"value": "too_high", "label": "หมอนเดิมสูงไป"},
    {"value": "too_soft", "label": "หมอนเดิมยุบ / นิ่มไป"},
    {"value": "too_firm", "label": "หมอนเดิมแข็งไป"},
    {"value": "no_neck_support", "label": "หมอนเดิมไม่รองรับคอ"},
    {"value": "not_sure", "label": "ไม่แน่ใจ"},
  ],
  shoulder: [
    {"value": "none", "label": "ยังไม่ระบุ"},
    {"value": "narrow", "label": "ไหล่แคบ"},
    {"value": "normal", "label": "ไหล่ปกติ"},
    {"value": "wide", "label": "ไหล่กว้าง"},
    {"value": "not_sure", "label": "ไม่แน่ใจ"},
  ],
  feel: [
    {"value": "none", "label": "ยังไม่ระบุ"},
    {"value": "soft", "label": "ที่นอนนุ่ม"},
    {"value": "medium", "label": "ที่นอนกลาง"},
    {"value": "firm", "label": "ที่นอนแข็ง"},
    {"value": "not_sure", "label": "ไม่แน่ใจ"},
  ],
} as const satisfies Record<string, readonly AssessmentOption[]>
