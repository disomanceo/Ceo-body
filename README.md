# Ceo-body 1.5.0

สื่อการสอนกายวิภาคมนุษย์แบบ 3 มิติ

เว็บใช้งานจริง: https://ceo-body.pages.dev
GitHub: https://github.com/disomanceo/Ceo-body

โปรเจ็คในเครื่อง: D:\\AI-Workspace\\Ceo-body
เปิด Start-Ceo-body.cmd แล้วเข้า http://localhost:5188
ใช้ Node.js 22.12+ หรือ 24+ ตัวเปิดจะตรวจบริการเดิมก่อนและรอให้พร้อมจึงเปิดหน้าเว็บ

## ความสามารถ
- 534 รายการรวมแบบหญิงและชาย / 12 หมวดระบบ พร้อม multi-system filtering และ metadata การสอน 4 มิติ
- ชื่อและคำอธิบายไทย–อังกฤษ ค้นได้ทั้งสองภาษา กรองระบบ เลือกชิ้น แสดง/ซ่อน; v1.2 รองรับ multi-system tagging ทำให้อวัยวะเดียวอยู่ได้หลายระบบ เช่น pancreas = digestive + endocrine, tongue = digestive + sensory, nasal cavity = respiratory + sensory และ gonads = reproductive + endocrine; ระบบสืบพันธุ์แสดงรายการทั้งชายและหญิง และเมื่อเลือกอวัยวะของอีกเพศจะสลับ Female/Male ให้อัตโนมัติ
- Teaching metadata v1.2: ทุก selectable structure มีข้อมูลสองภาษา 4 มิติ Function / Location / Relations / Clinical note พร้อม fallback ตามระบบ และตรวจ schema อัตโนมัติ
- หมุน ซูม แยกชิ้น ดูเฉพาะชิ้น มุมหน้า/หลัง/ข้าง คืนมุมมอง โดยกล้องคำนวณกึ่งกลางจากขอบเขตโมเดลจริงและซูมรอบจุดกึ่งกลาง; ปรับแรงหน่วง/ความไวการหมุนให้สมูท และแยกโหมดควบคุมเป็น “หมุน” กับ “เลื่อน” ชัดเจน
- แผงนำทางบนภาพ: ขึ้น/ลง/ซ้าย/ขวา + ปุ่มกลับกึ่งกลางโดยคงมุมและระยะซูม + เมนู “ไปที่…” สำหรับศีรษะ/อก/ท้อง/เชิงกราน/ขา/เท้า; Shift+ล้อเมาส์เลื่อนแนวตั้ง, ปุ่มลูกศรบนคีย์บอร์ดเลื่อนมุมมอง, สองนิ้วซูม+เลื่อน และดับเบิลคลิกเพื่อ Focus
- 3 มิติ / โครงสร้าง wireframe / โปร่งใส / ภาพตัดด้วย clipping plane
- ชั้นผิวหนัง กระดูก กล้ามเนื้อ กราฟิกสูง/เบา ป้ายชื่อหลบกัน
- โครงสร้าง 105 กลุ่มใช้โมเดลละเอียด BodyParts3D; เมื่อนับกลีบปอด ลิ้นหัวใจ และส่วนลำไส้ที่แยกได้รวมเป็น 116 รายการละเอียด และใช้ optimized model assets ครบทั้ง 166 ไฟล์
- หัวใจ: ห้องบน/ล่างซ้ายขวาและลิ้น 4 ตำแหน่งเป็นแผนภาพ 3 มิติ
- ปอด: แยก 3 กลีบขวา 2 กลีบซ้าย; ลำไส้เล็ก: duodenum, jejunum, ileum
- ระบบสืบพันธุ์ v1.1: หญิง 13 โครงสร้าง รวม uterus, cervix, vagina, ovaries, uterine tubes, vulva, clitoris, labia majora/minora; ชาย 15 โครงสร้าง รวม testes, epididymides, vasa deferentia, seminal vesicles, ejaculatory ducts, prostate, bulbourethral glands, scrotum และ penis พร้อมหน้าที่ไทย–อังกฤษ
- Nervous + Sensory v1.3: ระบบประสาทกรองได้ 54 ชิ้น ครอบคลุม cerebral lobes, thalamus/hypothalamus, brainstem subdivisions, cranial/autonomic/peripheral nerves และ limb plexuses; Sensory กรองได้ 43 ชิ้น ครอบคลุม cornea/iris/lens/retina/optic nerve, middle-ear ossicles, cochlea, vestibular structures, olfactory pathway และ taste buds
- Skin + Endocrine + Lymphatic v1.4: ผิวหนังแยก 12 ชิ้นรวมชั้นผิว ขน ต่อม ตัวรับ และหลอดเลือด; Endocrine กรองได้ 25 ชิ้นรวม parathyroids, adrenal cortex/medulla และ pancreatic islets; Lymphatic กรองได้ 26 ชิ้นรวม thoracic/right lymphatic ducts, cisterna chyli, tonsils, limb lymphatics, mesenteric/popliteal nodes, lacteals และ red marrow
- Deep Pathways v1.5: Digestive 46 ชิ้นจาก oral cavity/teeth/salivary glands ถึง segmented colon/anal canal พร้อม bile/pancreatic ducts; Urinary 27 ชิ้นรวม kidney layers และ nephron; Respiratory 34 ชิ้นรวม pharynx/epiglottis/pleura/bronchioles/alveoli/sinuses; Circulatory 72 ชิ้นรวม coronary circulation, cardiac conduction, SVC/IVC และหลอดเลือดแขนขาที่สำคัญ
- ภาพเคลื่อนไหวหัวใจ ปอด/กะบังลม คลื่นบีบตัวของลำไส้ และการไหลเวียนเลือดหลัก แยกเปิดปิด หยุด/เล่น ความเร็ว 0.5/1/2 เท่า; จุดแดง = เลือดมีออกซิเจน จุดน้ำเงิน = เลือดออกซิเจนต่ำ จุดม่วง = hepatic portal flow พร้อมจังหวะ pulsatile ที่นุ่มขึ้น
- วงจรเลือดเพื่อการสอนขยายถึงศีรษะ แขน ไต ตับ เชิงกราน และขา ผ่าน carotid/jugular, brachial, renal, hepatic/portal และ femoral vessels; จุดแดง/น้ำเงิน/ม่วงแสดงชนิดการไหลต่างกัน
- Guided Lesson Engine ครบทั้ง 12 ระบบ: ไหลเวียนเลือด, หายใจ, ย่อยอาหาร, ประสาท, ทางเดินปัสสาวะ, โครงกระดูก, กล้ามเนื้อ, ต่อมไร้ท่อ, น้ำเหลือง/ภูมิคุ้มกัน, สืบพันธุ์, อวัยวะรับความรู้สึก และผิวหนัง รวม 108 ฉากสอนแบบ Step-by-step
- แต่ละบทมี ก่อนหน้า/ถัดไป/เริ่มใหม่ + จุดลำดับกดข้ามขั้น + PageUp/PageDown + กล้อง tween แบบนุ่ม + ไฮไลต์เฉพาะโครงสร้างที่กำลังสอน และคำอธิบายไทย–อังกฤษ; Esc ปิดบทเรียน
- สาธิตเฉพาะระบบ: อากาศสีฟ้าใน trachea/bronchi, อาหารสีเหลืองผ่าน esophagus/ลำไส้พร้อม peristalsis, สัญญาณประสาทสีเขียวตาม spinal cord, ปัสสาวะไหลตาม ureter/urethra และเลือดตามหลอดเลือดหลัก
- ปุ่ม 🔊 อ่านคำอธิบายขั้นปัจจุบันด้วย Web Speech API ตามภาษาที่เลือกเมื่อเบราว์เซอร์รองรับ; Lesson Engine จำสถานะก่อนเรียนและคืนระบบ/เพศ/อวัยวะ/โหมดภาพ/animation เดิมเมื่อออก
- Auto Presentation: ปุ่ม ▶/Ⅱ ให้ระบบเดินบทเรียนอัตโนมัติทุกประมาณ 9 วินาที พร้อมกล้อง tween และหยุดอัตโนมัติเมื่อถึงขั้นสุดท้าย; ผู้สอนหยุดหรือแทรกควบคุมเองได้ตลอด
- Quiz Engine ครบ 12 ระบบ ระบบละ 3 ข้อ รวม 36 ข้อแบบ 4 ตัวเลือก ไทย–อังกฤษ พร้อมเฉลยอธิบายทันที, สรุปคะแนน, Retry และเก็บคะแนนดีที่สุดไว้ใน localStorage ของเครื่อง
- Classroom Results: ปุ่ม “ผลคะแนน” สรุป Best Score, จำนวนครั้งที่ทำ และเวลาทำล่าสุดครบ 12 ระบบ พร้อมล้างประวัติในเครื่องได้
- Production bundle แยก Three.js, lesson data และ quiz data เป็น chunks เพื่อลด initial bundle และตัด build warning ก้อนใหญ่
- รองรับหน้าจอเล็ก เมนูเรียงใต้ภาพเมื่อใช้มือถือ
- ใช้งานออฟไลน์ได้เมื่อมี dist พร้อมไฟล์โมเดล บริการผูกเฉพาะ 127.0.0.1

## ขอบเขต
เป็นสื่อการสอนภาพรวมและโครงสร้างที่ระบุในรายการ ไม่ใช่ atlas ครบทุกโครงสร้างของมนุษย์
โมเดล BodyParts3D ถูกลดจำนวนจุด หมุน และปรับขนาดให้เข้ากับหุ่นสอน จึงไม่ใช่สัดส่วนจากภาพสแกนที่คงไว้ทั้งหมด
อวัยวะอื่น กระดูกบางชิ้น และกลุ่มกล้ามเนื้อยังเป็นรูปทรงย่อ; ห้องหัวใจเป็นแผนภาพ
สีและการเคลื่อนไหวแสดงหลักการ ไม่ใช่ค่าการทำงานทางสรีรวิทยาที่วัดได้
หลอดเลือด/เส้นประสาทส่วนย่อย ถุงลมระดับเซลล์ และรายละเอียดเนื้อเยื่อไม่ได้รวมทั้งหมด

## เครดิต
BodyParts3D, (c) The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.
https://github.com/Kevin-Mattheus-Moerman/BodyParts3D
https://creativecommons.org/licenses/by-sa/2.1/jp/
ไฟล์ models และโมเดลที่ปรับแล้วอยู่ภายใต้ CC BY-SA 2.1 Japan เช่นเดิม ดู public/ATTRIBUTION.txt และ public/models/source-manifest.json
คำอธิบายเบื้องต้นเรียบเรียงใหม่โดยอ้างอิง OpenStax:
https://openstax.org/details/books/anatomy-and-physiology-2e
Three.js และ Vite: MIT

## พัฒนา / คืนไฟล์โมเดลเมื่อใช้ source archive
npm install
npm run models
npm test
npm run build
npm start
Source archive เก็บซอร์สและสคริปต์ดาวน์โหลดโมเดล; npm run models ต้องใช้อินเทอร์เน็ต
Release zip ในเครื่องมี dist และโมเดลพร้อมใช้ ไม่ต้องติดตั้ง npm packages เพื่อเปิด

## ผลตรวจสอบ
ผ่าน 42 automated tests: ข้อมูลสองภาษา, 12 ระบบ, multi-system schema, metadata 4 มิติ, laterality หลัก, เพศ, geometry, Nervous/Sensory depth, เส้นทางลำไส้/เลือด/อากาศ/อาหาร/สัญญาณประสาท/ปัสสาวะ, Lesson Engine 12 บท, Quiz Engine 12 ชุด/36 ข้อ, การคำนวณคะแนน, การสลับ female/male ในบทสืบพันธุ์, โหลดโมเดลละเอียด, fallback และ asset mapping ครบ
ทดสอบในเบราว์เซอร์ครบ 12 บทและ 108 ฉาก: การสลับบทขณะเล่น, ก่อนหน้า/ถัดไป, จุดลำดับ, PageUp/PageDown, Esc, ภาษาไทย/อังกฤษ, camera tween, Auto Presentation และ Quiz flow ตั้งแต่ตอบจนสรุปคะแนน/Retry
ตรวจคืนสถานะก่อนเรียน: system, sex, selected part, transparent mode และ simulation toggles กลับตรงเดิมหลังออกจากบทเรียน
ตรวจ interaction: หมุน/เลื่อน/ซูม/Focus ใช้กึ่งกลางเดียวกัน, โหมดเลื่อนลากขึ้นลงได้โดยตรง, ปุ่มลูกศร/Shift+wheel และ gesture ลากไม่ถูกตีความเป็นการคลิกโดยไม่ตั้งใจ
หน้าจอ 390 x 844 ไม่มี horizontal overflow, lesson panel ไม่ทับ navigation pad, Web Speech API เรียกได้ และ animation ทดสอบประมาณ 60 FPS
Console หลังทดสอบ: ไม่มี error หรือ warning
Release 1.1.0 เพิ่มระบบสืบพันธุ์หญิง 13 / ชาย 15 โครงสร้าง, ค้นข้ามเพศและสลับเพศอัตโนมัติ, Guided Lesson ระบบสืบพันธุ์ 8 ขั้น และตรวจ mobile header/credit ไม่มี horizontal overflow
