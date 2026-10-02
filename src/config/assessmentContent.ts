/**
 * แก้ข้อความ/label ในไฟล์นี้ได้ โดยไม่ต้องแก้สูตรคำนวณ
 * อย่าเปลี่ยน key ของคำถามหรือลำดับ steps เพื่อย้าย field; ไฟล์นี้ใช้แก้ข้อความเท่านั้น
 * หลังแก้ข้อความต้อง build/deploy ใหม่ (npm run build)
 * รูป assessment: assessmentVisuals.ts / รูปสินค้า result: Google Sheets product_master.image_url
 */
export const assessmentContent = {
  hero: {
    title: 'BestFIT',
    titleSuffix: 'Sleep Recommendation',
    subtitle: 'ค้นหาหมอนและที่นอนที่เหมาะกับสรีระของคุณ',
  },
  accessibility: {
    formLabel: 'แบบประเมิน BestFIT',
    progressLabel: 'ขั้นตอนแบบประเมิน',
  },
  steps: [
    { label: 'ข้อมูลพื้นฐาน', title: 'ข้อมูลพื้นฐานของคุณ', description: 'เริ่มจากสรีระและท่านอนที่ใช้บ่อยที่สุด' },
    { label: 'รูปร่าง', title: 'ประเมินรูปร่างเพื่อเลือกที่นอนและการรองรับ', description: 'เลือกรูปร่างที่ใกล้เคียงกับคุณทั้งสองด้าน' },
    { label: 'ข้อมูลเพิ่มเติม', title: 'ข้อมูลเพิ่มเติมเพื่อปรับคำแนะนำให้แม่นยำขึ้น', description: 'ส่วนนี้ไม่จำเป็นต้องกรอก หากต้องการดูผลลัพธ์พื้นฐานสามารถกดข้ามได้' },
  ],
  // helperText ว่าง = ไม่แสดงคำอธิบายใต้คำถาม ใส่ข้อความได้เมื่อจำเป็น
  questions: {
    weight: { label: 'น้ำหนัก', unit: 'kg', placeholder: '65', helperText: '' },
    height: { label: 'ส่วนสูง', unit: 'cm', placeholder: '170', helperText: '' },
    sleep: { label: 'ท่านอนหลัก', helperText: '' },
    front: { label: 'เมื่อมองจากด้านหน้า', helperText: '' },
    side: { label: 'เมื่อมองจากด้านข้าง', helperText: '' },
    problem: { label: 'ปัญหาหลักที่คุณรู้สึก', helperText: '' },
    pillow: { label: 'ความรู้สึกกับหมอนเดิม', helperText: '' },
    shoulder: { label: 'ลักษณะไหล่', helperText: '' },
    feel: { label: 'ความรู้สึกกับที่นอนเดิม', helperText: '' },
  },
  buttons: { next: 'ถัดไป', back: 'ย้อนกลับ', skip: 'ข้าม', submit: 'ดูคำแนะนำ BestFIT' },
  helper: { required: '* ข้อมูลจำเป็น', privacy: 'ไม่บันทึกข้อมูลส่วนตัวของคุณ' },
  validation: {
    page1: 'กรุณากรอกน้ำหนัก ส่วนสูง และเลือกท่านอน เพื่อไปต่อ',
    page2: 'กรุณาเลือกรูปร่างทั้งด้านหน้าและด้านข้าง เพื่อไปต่อ',
    // เปลี่ยนเฉพาะข้อความที่แสดง ไม่เปลี่ยนเงื่อนไข validation ใน engine
    fields: {
      weight: 'กรอกน้ำหนักที่มากกว่า 0 กก.',
      height: 'กรอกส่วนสูงที่มากกว่า 0 ซม.',
      sleep: 'กรุณาเลือกข้อมูลให้ครบถ้วน',
      front: 'กรุณาเลือกรูปร่างด้านหน้า',
      side: 'กรุณาเลือกรูปร่างด้านข้าง',
      problem: 'กรุณาเลือกข้อมูลให้ครบถ้วน',
      pillow: 'กรุณาเลือกข้อมูลให้ครบถ้วน',
      shoulder: 'กรุณาเลือกข้อมูลให้ครบถ้วน',
      feel: 'กรุณาเลือกข้อมูลให้ครบถ้วน',
    },
  },
}
