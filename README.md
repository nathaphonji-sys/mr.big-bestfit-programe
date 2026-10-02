# MR.BIG Public BestFIT Prototype — Google Sheets

พร้อม deploy: ใช้ Build Command `npm run build` และ Output Directory `dist` ดูคู่มือทีละขั้นในไฟล์นี้

เว็บแอป Vite + React + TypeScript สำหรับเลือกหมอน หมอนจัดท่า สินค้าเสริม ที่นอน และท็อปเปอร์ จาก Google Sheets ทั้ง 4 ไฟล์ของ MR.BIG โดยโหลดแท็บแรกเมื่อเปิดหน้า คำนวณในเบราว์เซอร์ และใช้ CSV เดิมเป็นข้อมูลสำรอง ไม่ต้องมี Retool, Supabase, API key หรือฐานข้อมูล

## เริ่มใช้งานบนเครื่อง

1. แตก ZIP แล้วเปิดโฟลเดอร์ `bestfit-prototype`
2. ติดตั้ง Node.js 22.12 ขึ้นไป (แนะนำรุ่น 22 LTS) จาก https://nodejs.org หากเครื่องยังไม่มี
3. เปิด Terminal ในโฟลเดอร์นี้ แล้วรันทีละบรรทัด:

```sh
npm ci
npm run dev
```

4. เปิด http://localhost:5173 หน้า 1 กรอกน้ำหนัก ส่วนสูง และเลือกท่านอนให้ครบ แล้วกด “ถัดไป”
5. หน้า 2 เลือกรูปร่างด้านหน้าและด้านข้างให้ครบ แล้วกด “ถัดไป”
6. หน้า 3 มีข้อมูลเพิ่มเติม 4 ข้อที่ไม่บังคับ กด “ดูคำแนะนำ BestFIT” เพื่อใช้คำตอบที่เลือก หรือกด “ข้าม” เพื่อดูผลพื้นฐาน ปุ่มข้ามจะตั้งปัญหาหลัก/หมอนเดิม/ไหล่/ที่นอนเดิมเป็น `none` ทั้งหมด (ค่า “ยังไม่ระบุ” ที่ calculation เดิมรองรับ)
7. ปุ่ม “ย้อนกลับ” คงคำตอบที่กรอกไว้ การกด “แก้ไขคำตอบ” จากหน้าผลลัพธ์แล้วส่งใหม่จะคำนวณด้วยคำตอบล่าสุด

หยุดเว็บด้วย Ctrl+C ใน Terminal การเปิด `index.html` ด้วยการดับเบิลคลิกไม่สามารถแทนการรันคำสั่งข้างต้นได้

## Build และตรวจงาน

```sh
npm test
npm run build
npm run preview
```

- `npm test`: ตรวจ 119 test cases รวมทุก 75 ชุดหมอน + 200 ชุดที่นอน ขอบช่วงน้ำหนัก/ส่วนสูง clinical priority และ Body Pillow dedupe, CSV สถานะสินค้า Special Mattress การโหลดซ้ำจาก Sheets, timeout, ข้อมูลผิดรูปแบบ และ fallback
- `npm run build`: ตรวจ TypeScript แล้วสร้างเว็บใน `dist/`
- `npm run preview`: เปิด build ที่ http://localhost:4173
- `scripts/browser-check.mjs`: smoke test สำหรับเครื่องที่มี Google Chrome; เปิด `npm run dev` ในอีก Terminal แล้วใช้ `node scripts/browser-check.mjs` (ดูสถานะตรวจจริงใน `QA.md`)

## นำขึ้น Vercel

โปรเจกต์นี้เตรียมให้ deploy ได้ แต่ยังไม่ได้เผยแพร่ขึ้นบัญชี Vercel และยังไม่มีลิงก์สาธารณะ

### วิธีผ่าน GitHub และหน้าเว็บ Vercel สำหรับผู้เริ่มต้น

ก่อนเริ่ม แตก ZIP แล้วเปิดโฟลเดอร์ `bestfit-prototype` ต้องเห็น `package.json`, `package-lock.json`, `src`, `public`, `data`, `api` และ `vercel.json` บน Mac เปิด Terminal พิมพ์ `cd ` (มีช่องว่าง) แล้วลากโฟลเดอร์นี้เข้า Terminal และกด Enter จากนั้นรัน `npm ci` → `npm run dev` เพื่อทดลองในเครื่อง หยุดด้วย Ctrl+C แล้วรัน `npm run build` ต้องไม่มี error และได้ `dist/index.html`

ใน GitHub สร้าง repository เช่น `bestfit-prototype` เลือก Upload files นำไฟล์และโฟลเดอร์ในโปรเจกต์ขึ้นไป รวม config และ package-lock.json แต่ไม่เอา `node_modules`, `dist`, `.env` หรือ ZIP จากนั้นกด Commit changes แล้วเข้าสู่ระบบ Vercel และเชื่อมบัญชี GitHub เพื่อเลือก repository นี้

1. สร้าง repository บน GitHub แล้วนำไฟล์ภายใน `bestfit-prototype` เข้า repository อย่าอัปโหลด `node_modules` หรือ `.env`
2. ลงชื่อเข้าใช้ Vercel แล้วเลือก **Add New → Project** และ import repository
3. หาก repository มีโฟลเดอร์ `bestfit-prototype` ครอบอยู่ ให้เลือกโฟลเดอร์นี้เป็น **Root Directory** หาก `package.json` อยู่ระดับบนสุด ให้ใช้ root เดิม
4. ตั้ง **Framework Preset: Vite**, **Build Command: npm run build**, **Output Directory: dist**, **Install Command: npm ci**, **Node.js: 22.x**
5. ไม่ต้องเพิ่ม Environment Variables กด **Deploy**
6. เมื่อสำเร็จ คัดลอก URL HTTPS ที่ Vercel แสดง แล้วทดลองเปิดแบบไม่ลงชื่อเข้าใช้ก่อนนำไปฝังในร้าน

| ค่าบน Vercel | ใส่ค่า |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |
| Node.js Version | 22.x |
| Environment Variables | ไม่ต้องเพิ่มสำหรับข้อมูลสาธารณะทั้ง 4 Sheets นี้ |

รอจน deployment แสดง Ready แล้วคัดลอก Production URL เช่น `https://bestfit-example.vercel.app` หากล้มเหลว เปิด Build Logs ดู error แรก และตรวจ Root Directory/Node version/ไฟล์ที่อัปโหลด เมื่อแก้โค้ดครั้งต่อไปให้อัปเดตไฟล์และ Commit เข้า repository เดิม Vercel ที่เชื่อม Git จะสร้าง deployment ใหม่ ส่วนการแก้เซลล์ Sheets ใช้ปุ่มอัปเดตในแอปได้เลย แนวทางอ้างอิง [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite)

ก่อนฝัง Shopify เปิด Production URL แบบไม่ลงชื่อเข้าใช้ ตรวจปุ่มอัปเดต Sheets และทดลอง 65 kg / 170 cm / นอนตะแคง / C / X / ข้ามหน้า 3 ให้เห็นที่นอนหลัก Special Mattress และ Topper หากหน้าเว็บเปิดได้แต่ API ผิดพลาด ให้ตรวจว่าโฟลเดอร์ `api` ถูก deploy ไปด้วย

### ทางเลือกผ่าน Terminal

```sh
npx vercel
```

ทำตามการเข้าสู่ระบบ/เลือกบัญชีและโปรเจกต์ เมื่อดู preview แล้วพร้อมเผยแพร่ใช้:

```sh
npx vercel --prod
```

ไฟล์ `vercel.json` ระบุ Vite และ output ให้แล้ว หน้าเดียวนี้ไม่ต้องมี SPA rewrite มี Vercel Function ที่ `api/sheets.ts` สำหรับอ่าน CSV จาก Google โดยไม่ต้องตั้ง secret ต้อง deploy ทั้งโปรเจกต์พร้อม `api/` ไม่ใช่อัปโหลดเฉพาะ `dist/` ไป static hosting

## ฝังใน Shopify ด้วย iframe

ใช้ URL ที่ deploy สำเร็จจริงแทน `https://YOUR-BESTFIT-PROJECT.vercel.app` ด้านล่าง (ตัวอย่างนี้ยังเปิดไม่ได้จนกว่าจะเปลี่ยน URL)

1. เปิด Shopify Admin → Online Store → Themes → Customize / Edit theme
2. เลือกหน้า/เทมเพลตที่จะใช้ เช่น หน้า BestFIT
3. เพิ่ม section หรือ block **Custom liquid** หากธีมรองรับ
4. วางโค้ดนี้ แล้ว Preview ก่อน Save:

```html
<div style="max-width:1280px;margin:0 auto;">
  <iframe
    src="https://YOUR-BESTFIT-PROJECT.vercel.app"
    title="BestFIT by MR.BIG — แบบประเมินหมอนและที่นอน"
    loading="lazy"
    referrerpolicy="no-referrer"
    width="100%"
    height="1200"
    style="display:block;border:0;border-radius:24px;"
  ></iframe>
  <p style="text-align:center;font-size:14px;">
    <a href="https://YOUR-BESTFIT-PROJECT.vercel.app"
       target="_blank" rel="noopener noreferrer">เปิด BestFIT แบบเต็มหน้าจอ</a>
  </p>
</div>
```

iframe เลื่อนภายในได้เมื่อผลลัพธ์ยาว และปุ่มสินค้าจะเปิดแท็บใหม่ จึงไม่ทำให้หน้าร้านหายไป ปรับความสูงตาม layout ของธีมได้ ตัวอย่างนี้ไม่ใช้ auto-resize หรือส่งคำตอบผ่าน postMessage

หากธีมไม่มี Custom liquid ให้ใช้หน้า HTML ที่ธีมอนุญาต iframe หรือให้ผู้ดูแลธีมเพิ่ม section จากโค้ดนี้ ชื่อเมนูอาจต่างตามภาษาและเวอร์ชันธีม

หากต้องแก้โค้ดธีมเพิ่มเติม ดู [Shopify: Editing theme code](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/edit-code/edit-theme-code) โดยใช้ Custom liquid ที่ธีมมีให้ก่อนเมื่อทำได้

หาก iframe เปิดไม่ได้: ตรวจว่า URL เป็น HTTPS และเปิดแบบไม่ลงชื่อเข้าใช้ได้ ตรวจ Vercel Deployment Protection และนโยบาย CSP/frame-src ของ Shopify theme โปรเจกต์นี้ไม่ได้ตั้ง X-Frame-Options หรือ frame-ancestors ที่ขวาง iframe หากเพิ่มข้อจำกัดภายหลัง ต้องอนุญาตโดเมนร้านที่ใช้จริง

## แก้สินค้าและกฎใน Google Sheets

แก้ข้อมูลที่ **แท็บแรก (ซ้ายสุด)** ของแต่ละไฟล์ต่อไปนี้:

| ข้อมูล | Google Sheets |
| --- | --- |
| สินค้าและรายละเอียด | [product_master_01-2](https://docs.google.com/spreadsheets/d/1IJYNkYaLVhTDQAYzqodQcz-LS3Bow1lJ2FlR_U3x7p0/edit) |
| กฎปรับคำแนะนำตามอาการ | [clinic_adjustment_rules_01-2](https://docs.google.com/spreadsheets/d/14-coLGe9gh-iHki7tDAVTDYZUCqFvZS2Vt7A1jyNJQs/edit) |
| กฎหมอน | [bestfit_pillow_base_rules_01-2](https://docs.google.com/spreadsheets/d/1n84XMPRemPu_tJwIZVFQaZvElpoR1PaL9Zbgj4xBDLg/edit) |
| กฎที่นอนและท็อปเปอร์ | [bestfit_mattress_base_rules_01-2](https://docs.google.com/spreadsheets/d/1gcIiug9SFUhewf9n07ZXjHX1xslfOyw6Oy5a3PjFeFk/edit) |

บันทึกใน Sheets แล้วกด **อัปเดต Google Sheets** ด้านบนแอป **ไม่ต้อง build/deploy ใหม่เมื่อแก้เฉพาะเซลล์** ปุ่มนี้กดได้ทุกหน้ารวมถึงหน้าผลลัพธ์ โดยไม่ต้องกรอกฟอร์มให้ครบ คำตอบและขั้นตอนปัจจุบันยังอยู่ หากอยู่หน้าผลลัพธ์จะคำนวณใหม่ด้วยข้อมูลล่าสุด ไม่มีการ polling และ Google อาจใช้เวลาสั้น ๆ ก่อนส่งเซลล์ที่เพิ่งแก้ผ่าน CSV export

- แถวแรกต้องเป็นชื่อคอลัมน์เดิม เช่น `product_key`, `rule_key`, `active` อย่าเพิ่มหัวเรื่องเหนือแถว header
- คงรหัสสินค้า/กฎให้ไม่ซ้ำ ไม่มี header ว่างหรือซ้ำ ชื่อคอลัมน์และค่าแต่ละช่องจะถูก trim
- `active` รองรับ `true`, `t`, `TRUE`, `1` (รวม yes/y เดิม) ค่าว่าง/false/f ไม่เปิดใช้งานตามปกติ ข้อยกเว้นที่ร้องขอ: สินค้าที่ระบุใน `special_mattress` ของ rule ที่เปิดใช้งานจะยังแสดง และ lookup รายละเอียดจาก catalog ทั้งหมด แม้ active ของสินค้าว่าง/false
- ไม่ต้องเปลี่ยนชื่อแท็บให้ตรงชื่อไฟล์ เพราะอ่านแท็บแรกโดยไม่ผูก `gid` หรือชื่อแท็บ อย่าย้ายแท็บคำอธิบายมาไว้ก่อนข้อมูล
- ทั้ง 4 ไฟล์ต้องให้บุคคลที่ไม่ได้ลงชื่อเข้าใช้สามารถอ่าน CSV ได้ การตรวจครั้งนี้อ่านได้แล้ว แอปไม่เปลี่ยนสิทธิ์แชร์ให้เอง หากเปลี่ยนเป็นไฟล์ส่วนตัวจะใช้ข้อมูลสำรอง
- ไฟล์เหล่านี้เป็นข้อมูลสาธารณะของแอป จึงไม่ควรเพิ่มข้อมูลลูกค้าหรือข้อมูลลับลงไป

## ลำดับคำแนะนำหมอนและ Clinical Priority

คำเตือนอยู่ก่อนคำแนะนำเสมอ จากนั้นใช้ `promote_product` ของกฎที่ match โดยเรียง priority ตัวเลขน้อยก่อน (เท่ากันใช้ rule_id) สินค้าที่ promote ไม่จำเป็นต้องอยู่ใน base rule และแสดงได้แม้ไม่มีกฎหมอนพื้นฐานที่ตรง ตัว promote อื่นที่ไม่ซ้ำจะเป็นคำแนะนำรองหรือปรากฏในคำแนะนำตามสรีระ/หมายเหตุ

ข้อกำหนดเฉพาะนอนกรน: เมื่อ `main_problem=snoring` และกฎที่ match มี Slopie Pillow ใน promote หรือ add-on ให้ Slopie เป็น Clinical Primary แม้มีกฎทั่วไปเรื่องไหล่ที่ promote สินค้าอื่น กรณีไม่มีกฎที่ match แนะนำ Slopie จะไม่เพิ่ม Slopie เอง ส่วนอาการอื่นยังใช้ explicit promote ตาม priority; ไม่ยกระดับ add-on ทุกชิ้นโดยอัตโนมัติ

เมื่อมี Clinical Primary หมอน head_pillow/special_pillow จาก base ยังอยู่ในคำแนะนำตามสรีระด้านล่าง (เปิดไว้เริ่มต้น) และสินค้าหลักจะไม่ซ้ำในส่วน add-on

`dedupeRecommendations()` รวม Body Pillow ทุกขนาดไว้ในกลุ่มเดียว ใช้ positioning_pillow จาก base ก่อน special_positioning_pillow แล้วจึงใช้ clinic add-on ถ้า base ไม่มี Body Pillow เหตุผลของ clinic ยังคงอยู่ในการ์ดที่เลือก ไม่ลบสินค้าเสริมอื่น และไม่เปลี่ยนวิธี lookup product_master เดิม

ระหว่าง `npm run dev` เปิด “ข้อมูลอ้างอิงการคำนวณ” ที่ท้ายผลลัพธ์เพื่อดู matched pillow rule, matched clinic rules, promote_product, final primary/base/positioning/add-ons รายละเอียด debug นี้ซ่อนอยู่ใน collapsible section และไม่รวมใน production build

## การแสดง Special Mattress

ระบบเก็บชื่อคอลัมน์ `primary_mattress`, `special_mattress`, `topper_result` ตรงตาม Sheets และแสดงที่นอนหลัก → ที่นอนทางเลือก / Special Mattress → Topper ที่แนะนำ ตาม rule เดิม Special Mattress ข้ามเฉพาะชื่อว่าง/No Match Found และรวมเป็นการ์ดเดียวหากซ้ำกับที่นอนหลัก การ lookup ใช้ชื่อ/รหัส/aliases เดิม รองรับ Age+ 9" Mattress และ Figured One–Five ไม่เดาชื่อสินค้าใกล้เคียง ถ้าหา catalog ไม่พบจะยังแสดงชื่อจาก rule พร้อม placeholder

claim, รูป, ราคา และลิงก์แสดงตามข้อมูลใน product_master ส่วน description, best_for และ size อยู่ใน “เกี่ยวกับสินค้านี้” ช่องว่างจะไม่ถูกเติมด้วยข้อมูลที่แต่งขึ้น ข้อมูลสำรองเดิมของ Age+ ยังไม่มีรายละเอียดครบ จึงแสดง placeholder เมื่อจำเป็นได้

## เปลี่ยน Spreadsheet ID ในอนาคต

เปิด `src/config/googleSheets.ts` แล้วแก้เฉพาะค่าของ `SPREADSHEET_IDS`:

```ts
export const SPREADSHEET_IDS = {
  products: 'ID ของ product_master',
  clinic: 'ID ของ clinic_adjustment_rules',
  pillows: 'ID ของ bestfit_pillow_base_rules',
  mattresses: 'ID ของ bestfit_mattress_base_rules',
} as const
```

ID คือส่วนระหว่าง `/d/` กับ `/edit` ในลิงก์ Sheets ต้องไม่ใส่ URL เต็ม หลังเปลี่ยน ID ให้ `npm test`, `npm run build` และ deploy ใหม่ สำหรับ local ให้หยุดแล้วรัน `npm run dev` ใหม่

## วิธีโหลดและข้อมูลสำรอง

เมื่อเปิดหน้า แอปแสดง “กำลังโหลดข้อมูล BestFIT” และเรียก `/api/sheets?sheet=...` ทั้ง 4 ตารางพร้อมกัน API ส่งต่อไปยัง Google CSV export ของแท็บแรก จึงไม่มีการ fetch ข้ามโดเมนจาก frontend และไม่มีปัญหา CORS ฝั่ง browser

`src/services/googleSheets.ts` มี `loadProductMaster()`, `loadClinicAdjustmentRules()`, `loadPillowRules()`, `loadMattressRules()` และ `loadBestFitData()` ใช้ header เป็น key และคงชื่อคอลัมน์สำหรับ logic เดิม

หากอ่านไม่สำเร็จ ไฟล์ว่าง header ผิด รหัสซ้ำ หรือหมดเวลารอ (API 10 วินาที / frontend 15 วินาที) แอปใช้ **ข้อมูลสำรองทั้ง 4 ตารางพร้อมกัน** เพื่อไม่ผสมกฎใหม่กับสินค้าเก่า พร้อมข้อความ “อัปเดต Google Sheets ไม่สำเร็จ ขณะนี้ใช้ข้อมูลสำรองเดิม กรุณาลองอีกครั้ง” และปุ่มอัปเดตเพื่อทดลองโหลดใหม่ โดยไม่รีเฟรชหน้าและไม่ล้างคำตอบ

ข้อมูลสำรองเป็น **CSV เดิมใน `data/`** เนื่องจากโปรเจกต์เดิมไม่ได้ใช้ JSON เก็บ snapshot วันที่ 29 กันยายน 2026 ไว้เหมือนเดิม หากต้องการอัปเดตสำรอง ให้ export Sheets เป็น CSV UTF-8 แทนไฟล์ชื่อเดิมใน `data/` แล้วทดสอบ/build/deploy ใหม่

เมื่อเปิดครั้งแรกสำเร็จ แอปแสดง “โหลดข้อมูลจาก Google Sheets แล้ว” เมื่อกดอัปเดตจะแสดง “กำลังอัปเดตข้อมูล...” แล้วเปลี่ยนเป็น “อัปเดตข้อมูลล่าสุดแล้ว” พร้อมเวลาโหลดใหม่ในข้อมูลอ้างอิงผลลัพธ์ ปุ่มจะพักเฉพาะระหว่างมีคำขอโหลดอยู่เพื่อไม่ส่งซ้ำ โดยไม่ขึ้นกับ validation ของฟอร์ม

## โครงสร้างไฟล์ที่เกี่ยวข้อง

- `src/config/googleSheets.ts`: IDs และ URL ของ CSV export แท็บแรก
- `api/sheets.ts`: Vercel Function อ่านเฉพาะ 4 รายการที่กำหนด ไม่รับ arbitrary URL หรือ credentials จากผู้ใช้
- `vite.config.ts`: ใช้ API handler เดียวกันใน `npm run dev` และ `npm run preview`
- `src/services/googleSheets.ts`: โหลดข้อมูล, timeout, และ fallback
- `src/data.ts`: parse/trim/ตรวจ schema และแปลงเป็น shape เดิม
- `src/engine.ts`: สูตรเดิม โดยรับชุดข้อมูลที่โหลดได้เป็น parameter
- `src/main.tsx`: loading state และเริ่มแอปหลังโหลด
- `data/`: snapshot สำรองเดิม ไม่แก้ไฟล์ synced `sources/` ของ ChatGPT project
- `reference/retool/`: โค้ดเดิมสำหรับอ้างอิง ไม่ได้รันเป็น backend

อ่าน `DATA_SOURCES.md` สำหรับเกณฑ์จาก Retool เดิม และ `QA.md` สำหรับผลการตรวจ

## ฟอนต์และภาพ

สีหลัก #676767 พื้นขาว รองรับมือถือ โลโก้จริงใช้ `public/assets/brand/mrbig-logo.svg` และฟอนต์จริงใช้ `public/fonts/gotham.woff2` กับ `public/fonts/Sukhumvit.woff2` ตามรายละเอียดด้านล่าง รูป Assessment และรูปสินค้าใช้แหล่งเดิม

## เปลี่ยนรูปสินค้าผ่าน Google Drive

1. อัปโหลดรูปสินค้าอัตราส่วน **1:1** ไปยังโฟลเดอร์ Google Drive ที่ต้องการ
2. เปิด Share ของ **ไฟล์รูปแต่ละไฟล์** แล้วตั้ง General access เป็น **Anyone with the link → Viewer**
3. เลือก **Copy link** ของไฟล์รูป (ไม่ใช่ลิงก์โฟลเดอร์)
4. วาง URL ตรง ๆ ในคอลัมน์ `image_url` ของสินค้านั้นใน [product_master_01-2](https://docs.google.com/spreadsheets/d/1IJYNkYaLVhTDQAYzqodQcz-LS3Bow1lJ2FlR_U3x7p0/edit) ไม่ใช้ Markdown เช่น `[รูป](URL)` หรือสูตร HYPERLINK ที่แสดงเฉพาะข้อความ
5. บันทึกและ **refresh แอป** เมื่อขึ้น “โหลดข้อมูลจาก Google Sheets แล้ว” แอปจะอ่าน URL ล่าสุด ไม่ต้อง deploy ใหม่

รองรับ `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`, `https://drive.google.com/open?id=FILE_ID`, `https://drive.google.com/uc?id=FILE_ID` และ direct image URL ทั่วไป แปลงลิงก์ Drive เป็น `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1000` ใน `src/utils/productImage.ts` ด้วย `getDisplayImageUrl()`

ใช้ `<img>` จาก `image_url` จริง ไม่ใช้ Markdown image link หรือรูปจำลองแทนรูปสินค้า กรอบมี `aspect-ratio: 1 / 1`, `object-fit: contain`, padding 16px, พื้น #F7F7F7 และมุมโค้ง 20–24px จึงแสดงรูปเต็มโดยไม่ crop หรือยืดสัดส่วน

หากช่องว่าง URL ไม่ถูกต้อง ไฟล์ไม่มีสิทธิ์อ่าน หรือ Google ส่งรูปไม่สำเร็จ จะแสดง placeholder MR.BIG ภายในกรอบขนาดเดิม และลองรูปใหม่เมื่อ URL เปลี่ยนหรือรีเฟรช หากแอปกำลังใช้ข้อมูลสำรอง จะยังใช้ image_url ใน CSV สำรอง ไม่ใช่ค่าล่าสุดจาก Sheets

ถ้าเปลี่ยนเนื้อหาไฟล์รูปเดิมโดยใช้ลิงก์เดิม Google อาจ cache thumbnail ชั่วคราว หากต้องการเปลี่ยนทันทีให้อัปโหลดไฟล์ใหม่แล้วเปลี่ยนลิงก์ใน Sheets สามารถใช้ URL รูปบน Shopify/CDN แทน Drive ได้ โดยแนะนำ HTTPS

หน้า result ให้หมอนหลักเด่นที่สุด พร้อม `short_claim`, `short_description`, `best_for` และลิงก์สินค้า หมอนทางเลือกพับเก็บได้ หมอนจัดท่า/สินค้าเสริมและที่นอน/ท็อปเปอร์เป็นการ์ดรอง ข้อมูลอ้างอิงพับเก็บไว้ สูตรคำนวณและการโหลด Sheets คงเดิม

## ข้อมูลส่วนตัวและขอบเขต v1

คำตอบอยู่ใน React state เท่านั้น ไม่มี localStorage, sessionStorage, cookies, analytics, database, การส่งคำตอบเข้า API หรือการเก็บชื่อ/เบอร์โทร รีเฟรชหน้าแล้วเริ่มใหม่

การเปิดเว็บมีการโหลดข้อมูลสินค้าหรือกฎจาก Google Sheets ผ่าน API และโหลดไฟล์เว็บไซต์ตามปกติ และภาพสินค้าบางรายการโหลดจาก Google Drive; ลิงก์สินค้านำไปเว็บ MR.BIG ไม่มีการแนบคำตอบใน URL หรือคำขอเหล่านี้ บริการ hosting/รูปภาพอาจมี access logs ตามระบบของผู้ให้บริการ

ข้อมูล Sheets อ่านผ่าน API สาธารณะ และ CSV สำรองรวมอยู่ใน JavaScript สาธารณะ คนที่เข้าชมเว็บสามารถอ่านได้ จึงไม่ควรใส่ข้อมูลลับหรือข้อมูลลูกค้าใน CSV เหล่านี้

คำแนะนำแสดงตามข้อมูลที่ได้รับ ไม่ใช่การวินิจฉัยหรือรับรองผลรักษา ข้อความ warning จากกฎต้นฉบับแสดงก่อนสินค้า ข้อมูลน้ำหนัก/ส่วนสูงรับจำนวนบวกตาม logic เดิม; ต้นทางไม่มีเกณฑ์อายุหรือขอบเขตประชากรที่ใช้สูตร

## เอกสารอ้างอิงการติดตั้งและเผยแพร่

- [Google: CSV export ใช้แท็บแรก](https://developers.google.com/workspace/drive/api/guides/ref-export-formats)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js)

- [Vite Getting Started](https://vite.dev/guide/)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Shopify: Editing theme code](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/edit-code/edit-theme-code)

สำหรับผู้พัฒนา: `.npmrc` ตั้ง `legacy-peer-deps=true` เพื่อให้ `npm ci` ใช้ชุด dependency ที่ล็อกไว้ โดยไม่ดึง optional peer tooling ของ test framework เพิ่มเอง ชุดนี้ผ่าน typecheck, unit tests และ production build; เก็บ `.npmrc` พร้อม `package-lock.json` ใน repository

## วิธีเปลี่ยนโลโก้และฟอนต์

- **โลโก้:** วางที่ `public/assets/brand/` ไฟล์ที่ Header ใช้จริงคือ **`mrbig-logo.svg`** หากโหลดไม่ได้จะแสดงข้อความ MR.BIG แทน ส่วน `mrbig-logo-white.svg` และ `mrbig-symbol.svg` ยังเป็นไฟล์เตรียมไว้ ไม่ได้แสดงใน Header
- **ขนาดโลโก้:** แก้ `.brand-logo` และ `.brand-logo img` ใน `src/styles.css` ไฟล์จริงมีพื้นที่โปร่งใสรอบโลโก้ จึงใช้ความกว้างภาพ 180px บน desktop และ 150px บนมือถือ พร้อม `height:auto` และ `object-fit:contain` โดยไม่ครอปหรือแก้ artwork ความสูงของตัวโลโก้ที่มองเห็นประมาณ 72px / 60px หากเปลี่ยนเป็นไฟล์ที่ไม่มีพื้นที่โปร่งใส ให้ปรับขนาด CSS ให้เหมาะกับไฟล์ใหม่
- **Gotham:** ไฟล์จริง **`public/fonts/gotham.woff2`** ใช้ชื่อ CSS `GothamMRBIG` สำหรับภาษาอังกฤษ ตัวเลข 0–9 และเครื่องหมาย Latin
- **Sukhumvit:** ไฟล์จริง **`public/fonts/Sukhumvit.woff2`** ใช้ชื่อ CSS `SukhumvitMRBIG` สำหรับภาษาไทย ชื่อไฟล์ขึ้นต้นด้วย S ใหญ่ ต้องใช้ให้ตรง รวมถึงบน Vercel
- **น้ำหนักฟอนต์:** ทั้งสองไฟล์เป็น static font น้ำหนักเดียว ไม่ใช่ variable font: Gotham Book มี metadata น้ำหนัก 325 และ Sukhumvit Set Medium น้ำหนัก 500 จึงไม่ได้ประกาศช่วง 300–800 หากเพิ่มตัวหนาหรือตัวบาง ให้เพิ่มไฟล์และ `@font-face` ของน้ำหนักนั้นจริง
- **แหล่งตั้งค่า:** `@font-face` และ `--brand-font` อยู่ส่วนต้นของ `src/styles.css` มี `unicode-range` แยกภาษา ทำให้ตัวเลขในข้อความไทย ชื่อสินค้า ราคา ขนาด และข้อมูล debug ใช้ Gotham ส่วนตัวอักษรไทยใช้ Sukhumvit โดยไม่มีการเปลี่ยนค่าข้อมูล
- **หลังเปลี่ยนโลโก้/ฟอนต์:** บันทึกไฟล์ → ตรวจด้วย `npm run dev` → รัน **`npm run build`** → deploy ใหม่ หากยังเห็นไฟล์เดิม ให้ reload โดยล้าง cache ของเบราว์เซอร์

### ปรับสี CI

แก้ CSS variables ใน `:root` ของ `src/styles.css` เช่น `--brand-primary`, `--brand-text`, `--brand-soft-bg`, `--brand-border`, `--brand-radius` แล้ว build/deploy ใหม่ รูปสินค้าใน Google Sheets `product_master.image_url` ยังแก้แล้วกดอัปเดต Google Sheets ได้โดยไม่ต้อง deploy

ภาพ Assessment 9 ภาพยังใช้ไฟล์จากสำเนาพอร์ต 5173 เดิม โดยไม่เปลี่ยนรหัส P1/P2/P3, A/B/C/D, X/Y

## วิธีแก้ข้อความ คำถาม ตัวเลือก และรูปประกอบแบบประเมิน

เปิดโฟลเดอร์ `bestfit-prototype` ในโปรแกรมแก้โค้ด เช่น VS Code แล้วเปิดไฟล์ตามตารางนี้ แก้เฉพาะข้อความระหว่างเครื่องหมายคำพูด คงเครื่องหมาย `{ } [ ] ,` และชื่อ key ไว้ตามเดิม

| ต้องการแก้ | ไฟล์ | จุดที่แก้ |
| --- | --- | --- |
| หัวข้อใหญ่และคำอธิบายหน้าแรก | `src/config/assessmentContent.ts` | `hero.title`, `hero.titleSuffix`, `hero.subtitle` |
| ชื่อขั้นตอน หัวข้อ และคำอธิบายแต่ละหน้า | `src/config/assessmentContent.ts` | `steps` → `label`, `title`, `description` |
| คำถาม หน่วย ตัวอย่างในช่อง และคำอธิบายสั้น | `src/config/assessmentContent.ts` | `questions` → `label`, `unit`, `placeholder`, `helperText` |
| ข้อความปุ่ม หมายเหตุ และข้อความเตือน | `src/config/assessmentContent.ts` | `buttons`, `helper`, `validation` |
| ชื่อตัวเลือกที่ผู้ใช้เห็น | `src/config/assessmentOptions.ts` | แก้เฉพาะ `label` ของตัวเลือก |
| รูปท่านอน/รูปร่างประกอบแบบประเมิน | `src/config/assessmentVisuals.ts` | แก้ path หรือ URL ของรหัสนั้น เช่น `sleep.P1` |
| รูปและรายละเอียดสินค้าในผลลัพธ์ | Google Sheets `product_master` | เช่น `image_url`, `short_claim`, `product_url` |

**ตัวอย่างแก้ตัวเลือก:** จาก `{"value": "P2", "label": "นอนตะแคง"}` เปลี่ยนเป็น `{"value": "P2", "label": "นอนตะแคงเป็นหลัก"}` ได้ โดยห้ามเปลี่ยน `P2` เพราะเป็นรหัสที่เชื่อมกับ rules รหัสอื่น เช่น P1/P3, A/B/C/D, X/Y, snoring, shoulder_pain และ none ต้องคงเดิมเช่นกัน ไม่เพิ่มหรือลบตัวเลือกโดยไม่ได้ตรวจ rules

ใน `assessmentContent.ts` ค่า `helperText: ''` หมายถึงไม่แสดงคำอธิบายใต้คำถาม ใส่ข้อความสั้น ๆ ได้เมื่อต้องการช่วยผู้กรอก การแก้ `validation` เปลี่ยนเพียงคำเตือน ไม่เปลี่ยนเงื่อนไขว่าข้อมูลใดจำเป็น ส่วน `steps` ใช้แก้ข้อความของ 3 หน้าเดิม ไม่ใช้เพิ่มหน้า ย้ายคำถาม หรือเปลี่ยนลำดับฟอร์ม

หัวข้อใหญ่แยกเป็น `hero.title` (BestFIT) และ `hero.titleSuffix` (Sleep Recommendation) เพื่อคงการจัดบรรทัดเดิม ส่วน `description` ภาษาอังกฤษในตัวเลือกท่านอนเก็บไว้เพื่อความเข้ากันได้กับโครงสร้างเดิม ปัจจุบันการ์ดแสดง `label` ภาษาไทย

**เปลี่ยนรูป assessment:** วางไฟล์ใน `public/assets/assessment/` แล้วแก้ path ใน `assessmentVisuals.ts` ให้ตรง เช่น P1 ใช้ `/assets/assessment/sleep-position/back.png` หรือใส่ลิงก์รูป Google Drive ที่แชร์แบบ Anyone with the link → Viewer แทนได้ อย่าแก้รหัส P1/P2/P3 หรือ A–D/X/Y

**อะไรต้อง deploy ใหม่:** การแก้ไฟล์ config ทั้ง 3 ไฟล์ และการเปลี่ยนไฟล์รูป local ต้องบันทึกไฟล์ → ตรวจด้วย `npm run dev` → รัน `npm run build` → อัปเดต repository/นำขึ้น Vercel อีกครั้ง เว็บจริงจึงจะเปลี่ยนตาม การแก้ path เป็นลิงก์ Drive ใน config ก็ต้อง deploy ใหม่เช่นกัน

**อะไรไม่ต้อง deploy ใหม่:** รูปสินค้าและรายละเอียดสินค้าในผลลัพธ์ที่แก้ใน Google Sheets `product_master` รวมถึงกฎใน Sheets ทั้ง 4 ไฟล์ ใช้ปุ่ม **อัปเดต Google Sheets** เพื่อโหลดใหม่ได้เลย ส่วนข้อความคำถามและรูป assessment ไม่ได้อ่านจาก Sheets หากแทนภาพในไฟล์ Drive เดิมโดย URL ไม่เปลี่ยน อาจเพียง refresh เพื่อโหลดภาพใหม่ แต่ cache ของ Google อาจทำให้ภาพเดิมยังปรากฏชั่วคราว

ไฟล์ `src/options.ts` เป็นตัวเชื่อมให้ engine และ result ใช้โครงสร้างเดิม ไม่ต้องแก้ไฟล์นี้เพื่อเปลี่ยน label และไม่ต้องแก้ `engine.ts` หรือ `Results.tsx` เมื่อเปลี่ยนข้อความแบบประเมิน

## รูปประกอบแบบประเมิน (Assessment)

ฟอร์มแบ่งเป็น 3 หน้า: ข้อมูลพื้นฐาน (น้ำหนัก/ส่วนสูง/ท่านอน) → รูปร่าง (ด้านหน้า/ด้านข้าง) → ข้อมูลเพิ่มเติม (ปัญหาหลัก/หมอนเดิม/ไหล่/ที่นอนเดิม) รูปท่านอนและรูปร่างเป็น option cards กรอบ 1:1 ไม่ครอปรูป ส่วนไหล่และความรู้สึกที่นอนใช้ dropdown เพื่อให้หน้าจอเรียบง่าย มี mapping รูปเตรียมไว้สำหรับนำไปใช้เพิ่มในอนาคต

รูปเริ่มต้นเป็นภาพเวกเตอร์ SVG โทนเทาที่แก้หรือเปลี่ยนได้ ไฟล์อยู่ที่ `public/assets/assessment/` และ mapping อยู่ที่ `src/config/assessmentVisuals.ts`:

| กลุ่ม | รหัส | โฟลเดอร์ / ชื่อไฟล์ |
| --- | --- | --- |
| ท่านอน | P1 / P2 / P3 | `sleep-position/back.svg`, `side.svg`, `stomach.svg` |
| รูปร่างด้านหน้า | A / B / C / D | `front-shape/shape-a.svg` ถึง `shape-d.svg` |
| รูปร่างด้านข้าง | X / Y | `side-shape/shape-x.svg`, `shape-y.svg` |
| ไหล่ (เตรียมไว้) | narrow / normal / wide | `shoulder-type/narrow.svg`, `normal.svg`, `wide.svg` |
| ที่นอน (เตรียมไว้) | soft / medium / firm | `mattress-feel/soft.svg`, `medium.svg`, `firm.svg` |
| รูปสำรอง | placeholder | `placeholders/assessment-placeholder.svg` |

**วิธีที่ 1 — ใช้ไฟล์ในโปรเจกต์**

1. วางรูปใน `public/assets/assessment/...` ใช้รูปสี่เหลี่ยมจัตุรัสที่มีพื้นที่รอบภาพพอเหมาะ
2. แทนไฟล์เดิมด้วยชื่อเดิม หรือแก้ path ใน `assessmentVisuals.ts` ให้ตรงกับไฟล์ใหม่ รองรับ PNG, JPG, WebP, SVG เช่น เปลี่ยน P1 เป็น `/assets/assessment/sleep-position/back.png` (ไม่ใส่ `public` ใน URL)
3. Run `npm run build` และ deploy ใหม่เพื่ออัปเดตเว็บจริง

**วิธีที่ 2 — ใช้ Google Drive**

1. สร้างโฟลเดอร์ชื่อ `MRBIG_BestFIT_Assessment_Images` ใน Google Drive แล้วอัปโหลดรูป
2. ตั้งค่า **ไฟล์รูปแต่ละไฟล์** เป็น **Anyone with the link → Viewer**
3. Copy share link ของไฟล์รูป
4. วางลิงก์แทนค่า path ใน `src/config/assessmentVisuals.ts` เช่น `sleep.P1` รับลิงก์ `/file/d/FILE_ID/view`, `/open?id=FILE_ID`, `/uc?id=FILE_ID` หรือ direct image URL ได้
5. Build/deploy ใหม่ แล้ว refresh แอป หากแทนรูปในไฟล์ Drive เดิมโดยไม่เปลี่ยน ID ให้ refresh; Google อาจเก็บภาพเดิมใน cache ชั่วคราว

`getAssessmentImageUrl()` ใน `src/utils/assessmentImage.ts` รองรับ local path และแปลง Drive link เป็น thumbnail ขนาด w1000 โดยไม่ต้องแก้การคำนวณ หากไม่มีรูปหรือโหลดไม่ได้ จะแสดง placeholder; หาก placeholder โหลดไม่ได้ด้วย จะใช้ไอคอนสำรองในกรอบเดิม

การตั้งค่ารูป Assessment อยู่ใน config นี้ ไม่ได้อ่านจาก Google Sheets ในเวอร์ชันนี้ หากเพิ่ม sheet mapping ในอนาคต จึงค่อยนำ field `image_url` มาใช้กับ helper เดิมได้ ส่วน `product_master.image_url` ยังใช้สำหรับรูปสินค้าในหน้าผลลัพธ์ตามเดิม
