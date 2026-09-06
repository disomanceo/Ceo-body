import {quizExtras} from './quiz-bank-v16.js';

const Q=(q,options,answer,explain)=>({q,options,answer,explain});

export const quizzes={
 circulation:[
  Q(['หลอดเลือดใดนำเลือดจากหัวใจห้องล่างซ้ายออกไปเลี้ยงร่างกาย?','Which vessel carries blood from the left ventricle to the systemic circulation?'],[['หลอดเลือดแดงใหญ่ (Aorta)','Aorta'],['หลอดเลือดดำใหญ่','Vena cava'],['หลอดเลือดแดงปอด','Pulmonary artery'],['หลอดเลือดดำปอด','Pulmonary vein']],0,['Aorta เป็นทางออกหลักของเลือดจากหัวใจซ้ายไปทั่วร่างกาย','The aorta is the main outflow from the left heart to the body.']),
  Q(['เลือดที่มีออกซิเจนต่ำจากหัวใจขวาเดินทางไปปอดผ่านอะไร?','Oxygen-poor blood from the right heart travels to the lungs through which vessel?'],[['หลอดเลือดดำปอด','Pulmonary veins'],['หลอดเลือดแดงปอด','Pulmonary arteries'],['Aorta','Aorta'],['Jugular vein','Jugular vein']],1,['Pulmonary arteries นำเลือดจากหัวใจขวาไปปอด','Pulmonary arteries carry blood from the right heart to the lungs.']),
  Q(['Hepatic portal vein มีบทบาทเด่นอย่างไร?','What is the key role of the hepatic portal vein?'],[['ส่งเลือดจากลำไส้ไปตับ','Carries blood from the gut to the liver'],['ส่งเลือดจากปอดไปหัวใจ','Carries blood from lungs to heart'],['ส่งเลือดจากหัวใจไปสมอง','Carries blood from heart to brain'],['ส่งปัสสาวะไปกระเพาะปัสสาวะ','Carries urine to the bladder']],0,['Portal vein นำเลือดที่มีสารอาหารจากทางเดินอาหารเข้าสู่ตับก่อนเข้าระบบไหลเวียนทั่วไป','The portal vein carries nutrient-rich blood from the digestive tract to the liver first.'])
 ],
 respiratory:[
  Q(['ขณะหายใจเข้า กะบังลมเปลี่ยนแปลงอย่างไร?','What happens to the diaphragm during inhalation?'],[['หดตัวและเคลื่อนต่ำลง','Contracts and moves downward'],['คลายตัวและเคลื่อนสูงขึ้น','Relaxes and moves upward'],['หยุดเคลื่อนไหว','Stops moving'],['บีบหัวใจ','Compresses the heart']],0,['การหดตัวของกะบังลมเพิ่มปริมาตรช่องอกและช่วยให้อากาศไหลเข้า','Diaphragm contraction increases thoracic volume and helps draw air inward.']),
  Q(['Trachea แยกเป็นโครงสร้างใดก่อนเข้าสู่ปอด?','The trachea divides into which structures before entering the lungs?'],[['หลอดเลือดแดงปอด','Pulmonary arteries'],['หลอดลมใหญ่ซ้ายและขวา','Left and right main bronchi'],['ท่อไต','Ureters'],['หลอดอาหาร','Esophagus']],1,['ปลาย trachea แยกเป็น main bronchi ซ้ายและขวา','The trachea divides into the left and right main bronchi.']),
  Q(['การแลกเปลี่ยนออกซิเจนและคาร์บอนไดออกไซด์เกิดเด่นที่บริเวณใด?','Where does oxygen–carbon dioxide exchange mainly occur?'],[['ถุงลมปอด','Alveoli'],['กล่องเสียง','Larynx'],['โพรงจมูก','Nasal cavity'],['กะบังลม','Diaphragm']],0,['ถุงลมมีผนังบางและอยู่ใกล้เส้นเลือดฝอย เหมาะกับการแพร่แก๊ส','Alveoli have thin walls closely associated with capillaries for gas diffusion.'])
 ],
 digestive:[
  Q(['การบีบตัวเป็นคลื่นที่ช่วยดันอาหารเรียกว่าอะไร?','What is the wave-like contraction that moves food called?'],[['Peristalsis','Peristalsis'],['Filtration','Filtration'],['Ventilation','Ventilation'],['Ossification','Ossification']],0,['Peristalsis คือการหดตัวเป็นคลื่นของผนังทางเดินอาหาร','Peristalsis is wave-like contraction of the digestive tract wall.']),
  Q(['อวัยวะใดสร้างน้ำดี?','Which organ produces bile?'],[['ตับ','Liver'],['ถุงน้ำดี','Gallbladder'],['กระเพาะอาหาร','Stomach'],['ม้าม','Spleen']],0,['ตับสร้างน้ำดี ส่วนถุงน้ำดีทำหน้าที่เก็บและทำให้น้ำดีเข้มข้น','The liver produces bile; the gallbladder stores and concentrates it.']),
  Q(['บริเวณใดดูดซึมสารอาหารส่วนใหญ่?','Where are most nutrients absorbed?'],[['ลำไส้เล็ก','Small intestine'],['หลอดอาหาร','Esophagus'],['ไส้ตรง','Rectum'],['กระเพาะปัสสาวะ','Urinary bladder']],0,['ลำไส้เล็กเป็นบริเวณหลักของการย่อยต่อและการดูดซึมสารอาหาร','The small intestine is the primary site for continued digestion and nutrient absorption.'])
 ],
 nervous:[
  Q(['สมองส่วนใดช่วยประสานการเคลื่อนไหวและการทรงตัว?','Which brain region helps coordinate movement and balance?'],[['สมองน้อย','Cerebellum'],['สมองใหญ่','Cerebrum'],['ต่อมไทรอยด์','Thyroid'],['ม้าม','Spleen']],0,['Cerebellum ช่วยปรับความแม่นยำของการเคลื่อนไหวและการทรงตัว','The cerebellum refines movement and balance.']),
  Q(['โครงสร้างใดเป็นทางผ่านสัญญาณหลักระหว่างสมองกับร่างกาย?','Which structure is a major signal pathway between the brain and body?'],[['ไขสันหลัง','Spinal cord'],['หลอดอาหาร','Esophagus'],['Aorta','Aorta'],['ท่อไต','Ureter']],0,['ไขสันหลังเป็นแกนสื่อสารสำคัญระหว่างสมองและส่วนต่าง ๆ ของร่างกาย','The spinal cord is a major communication pathway between brain and body.']),
  Q(['สมองใหญ่เกี่ยวข้องเด่นกับข้อใด?','The cerebrum is strongly associated with which function?'],[['ความคิด ความจำ และการเคลื่อนไหวโดยสมัครใจ','Thought, memory and voluntary movement'],['สร้างปัสสาวะ','Urine production'],['สร้างน้ำดี','Bile production'],['กรองน้ำเหลือง','Lymph filtration']],0,['Cerebrum รองรับการรับรู้ ความคิด ความจำ ภาษา และการควบคุมโดยสมัครใจ','The cerebrum supports perception, thought, memory, language and voluntary control.'])
 ],
 urinary:[
  Q(['ปัสสาวะไหลจากไตไปกระเพาะปัสสาวะผ่านอะไร?','Urine travels from the kidneys to the bladder through what?'],[['ท่อไต','Ureters'],['ท่อปัสสาวะ','Urethra'],['หลอดเลือดแดงไต','Renal arteries'],['หลอดอาหาร','Esophagus']],0,['Ureters เป็นท่อคู่ที่ลำเลียงปัสสาวะจากไตไป bladder','The ureters carry urine from the kidneys to the bladder.']),
  Q(['หน้าที่หลักของกระเพาะปัสสาวะคืออะไร?','What is the main function of the urinary bladder?'],[['เก็บปัสสาวะชั่วคราว','Temporarily stores urine'],['กรองเลือด','Filters blood'],['สร้างฮอร์โมนไทรอยด์','Produces thyroid hormones'],['แลกเปลี่ยนแก๊ส','Exchanges gases']],0,['Bladder เป็นถุงกล้ามเนื้อสำหรับเก็บปัสสาวะก่อนขับออก','The bladder is a muscular reservoir for urine before elimination.']),
  Q(['เลือดเข้าสู่ไตผ่านหลอดเลือดใด?','Blood enters the kidneys through which vessels?'],[['Renal arteries','Renal arteries'],['Renal veins','Renal veins'],['Ureters','Ureters'],['Pulmonary veins','Pulmonary veins']],0,['Renal arteries นำเลือดเข้าสู่ไต ส่วน renal veins นำเลือดออก','Renal arteries deliver blood to the kidneys; renal veins carry it away.'])
 ],
 skeletal:[
  Q(['โครงสร้างใดช่วยป้องกันสมองโดยตรง?','Which structure directly protects the brain?'],[['กะโหลก','Cranium'],['Femur','Femur'],['Tibia','Tibia'],['Scapula','Scapula']],0,['กะโหลกสร้างโครงแข็งล้อมรอบสมอง','The cranium forms a rigid protective case around the brain.']),
  Q(['กระดูกต้นแขนเรียกว่าอะไร?','What is the upper-arm bone called?'],[['Humerus','Humerus'],['Radius','Radius'],['Femur','Femur'],['Fibula','Fibula']],0,['Humerus เป็นกระดูกยาวหลักของต้นแขน','The humerus is the main long bone of the upper arm.']),
  Q(['กระดูกใดเป็นแกนหลักของต้นขา?','Which bone is the main bone of the thigh?'],[['Femur','Femur'],['Ulna','Ulna'],['Sternum','Sternum'],['Clavicle','Clavicle']],0,['Femur เป็นกระดูกยาวของต้นขาและรับแรงสำคัญในการยืนและเดิน','The femur is the long bone of the thigh and bears major loads during standing and walking.'])
 ],
 muscular:[
  Q(['กล้ามเนื้อคู่ใดทำงานตรงข้ามกันที่ข้อศอก?','Which muscle pair acts antagonistically at the elbow?'],[['Biceps และ Triceps','Biceps and triceps'],['Quadriceps และ Gastrocnemius','Quadriceps and gastrocnemius'],['Deltoid และ Rectus abdominis','Deltoid and rectus abdominis'],['Trapezius และ Tibialis anterior','Trapezius and tibialis anterior']],0,['Biceps ช่วยงอข้อศอก ส่วน triceps ช่วยเหยียดข้อศอก','Biceps flexes the elbow while triceps extends it.']),
  Q(['กล้ามเนื้อใดช่วยยกแขนที่ข้อไหล่?','Which muscle helps raise the arm at the shoulder?'],[['Deltoid','Deltoid'],['Hamstrings','Hamstrings'],['Gastrocnemius','Gastrocnemius'],['Rectus abdominis','Rectus abdominis']],0,['Deltoid เป็นกล้ามเนื้อสำคัญของการกาง/ยกแขน','The deltoid is a major muscle for raising/abducting the arm.']),
  Q(['Quadriceps อยู่บริเวณใด?','Where are the quadriceps located?'],[['ด้านหน้าต้นขา','Front of the thigh'],['ด้านหลังปลายแขน','Back of the forearm'],['หน้าอก','Chest'],['คอ','Neck']],0,['Quadriceps เป็นกลุ่มกล้ามเนื้อขนาดใหญ่ด้านหน้าต้นขา','The quadriceps are a large muscle group on the front of the thigh.'])
 ],
 endocrine:[
  Q(['ต่อมใดอยู่บริเวณคอและช่วยควบคุมการเผาผลาญ?','Which gland is in the neck and helps regulate metabolism?'],[['ไทรอยด์','Thyroid'],['ต่อมใต้สมอง','Pituitary'],['ต่อมหมวกไต','Adrenal'],['ไทมัส','Thymus']],0,['Thyroid สร้างฮอร์โมนที่มีผลต่ออัตราการใช้พลังงานของเนื้อเยื่อ','The thyroid produces hormones that influence metabolic activity.']),
  Q(['ต่อมหมวกไตอยู่บริเวณใด?','Where are the adrenal glands located?'],[['เหนือไต','Above the kidneys'],['ในปอด','Inside the lungs'],['ใต้หัวใจ','Below the heart'],['ในกระเพาะอาหาร','Inside the stomach']],0,['Adrenal glands อยู่ด้านบนของไตแต่ละข้าง','The adrenal glands sit on top of the kidneys.']),
  Q(['ตับอ่อนมีบทบาทต่อระดับกลูโคสผ่านฮอร์โมนใดเด่น?','The pancreas regulates blood glucose notably through which hormone?'],[['อินซูลิน','Insulin'],['เมลาโทนิน','Melatonin'],['ไทรอกซิน','Thyroxine'],['อะดรีนาลีนเท่านั้น','Adrenaline only']],0,['เซลล์ต่อมไร้ท่อของตับอ่อนหลั่ง insulin และ glucagon เพื่อช่วยควบคุม glucose','Pancreatic endocrine cells release insulin and glucagon to regulate glucose.'])
 ],
 lymphatic:[
  Q(['อวัยวะใดมีบทบาทสำคัญต่อการพัฒนาทีลิมโฟไซต์?','Which organ is important for T-lymphocyte development?'],[['ไทมัส','Thymus'],['ม้าม','Spleen'],['ตับ','Liver'],['กระเพาะอาหาร','Stomach']],0,['Thymus เป็นแหล่งสำคัญของการพัฒนา T cells โดยเฉพาะช่วงต้นชีวิต','The thymus is important for T-cell development, especially early in life.']),
  Q(['หน้าที่หนึ่งของต่อมน้ำเหลืองคืออะไร?','What is one function of lymph nodes?'],[['กรองน้ำเหลืองและเป็นจุดพบของเซลล์ภูมิคุ้มกัน','Filter lymph and host immune-cell interactions'],['สร้างปัสสาวะ','Produce urine'],['สูบฉีดเลือด','Pump blood'],['ย่อยโปรตีนด้วยกรด','Digest protein with acid']],0,['Lymph nodes กรองน้ำเหลืองและเป็นจุดสำคัญของการตอบสนองทางภูมิคุ้มกัน','Lymph nodes filter lymph and support immune responses.']),
  Q(['ม้ามเกี่ยวข้องเด่นกับอะไร?','What is the spleen notably involved in?'],[['กรองเลือดและสนับสนุนภูมิคุ้มกัน','Filtering blood and supporting immunity'],['แลกเปลี่ยนแก๊ส','Gas exchange'],['สร้างน้ำดี','Bile production'],['เก็บปัสสาวะ','Urine storage']],0,['Spleen ช่วยกรองเลือดและสนับสนุนการทำงานของภูมิคุ้มกัน','The spleen filters blood and supports immune function.'])
 ],
 reproductive:[
  Q(['รังไข่ทำหน้าที่เด่นข้อใด?','What is a major function of the ovaries?'],[['สร้างเซลล์ไข่และฮอร์โมนเพศ','Produce oocytes and sex hormones'],['กรองเลือด','Filter blood'],['แลกเปลี่ยนแก๊ส','Exchange gases'],['เก็บปัสสาวะ','Store urine']],0,['Ovaries ผลิต oocytes และฮอร์โมนเพศหลายชนิด','The ovaries produce oocytes and several sex hormones.']),
  Q(['อวัยวะใดรองรับการฝังตัวและการตั้งครรภ์?','Which organ supports implantation and pregnancy?'],[['มดลูก','Uterus'],['ต่อมลูกหมาก','Prostate'],['ท่อปัสสาวะ','Urethra'],['ม้าม','Spleen']],0,['Uterus เป็นอวัยวะกล้ามเนื้อที่รองรับการฝังตัวและพัฒนาการของตัวอ่อน','The uterus supports implantation and fetal development.']),
  Q(['ท่อนำอสุจิ (vas deferens) มีหน้าที่หลักอย่างไร?','What is the main function of the vas deferens?'],[['ลำเลียงอสุจิจากหลอดเก็บอสุจิเข้าสู่ช่องเชิงกราน','Carries sperm from the epididymis into the pelvis'],['สร้างอสุจิ','Produces sperm'],['สร้างน้ำดี','Produces bile'],['เก็บปัสสาวะ','Stores urine']],0,['Vas deferens ลำเลียงอสุจิจาก epididymis ไปยังบริเวณท่อหลั่ง','The vas deferens carries sperm from the epididymis toward the ejaculatory duct.'])
 ],
 sensory:[
  Q(['จอตาทำหน้าที่สำคัญอย่างไร?','What is a key function of the retina?'],[['เปลี่ยนแสงเป็นสัญญาณประสาท','Converts light into neural signals'],['สร้างเสียง','Produces sound'],['กรองเลือด','Filters blood'],['สร้างน้ำดี','Produces bile']],0,['Retina มีเซลล์รับแสงที่เปลี่ยนพลังงานแสงเป็นสัญญาณประสาท','The retina contains photoreceptors that convert light into neural signals.']),
  Q(['ใบหูช่วยทำอะไรเป็นหลัก?','What does the auricle mainly do?'],[['รวบรวมคลื่นเสียงเข้าสู่ช่องหู','Collects sound waves into the ear canal'],['สร้างเมลาโทนิน','Produces melatonin'],['ควบคุมระดับน้ำตาล','Controls blood glucose'],['สูบเลือด','Pumps blood']],0,['Auricle ช่วยรวบรวมและนำคลื่นเสียงเข้าสู่ทางเดินหู','The auricle collects and directs sound waves into the ear canal.']),
  Q(['อวัยวะใดมีตัวรับรส?','Which organ contains taste receptors?'],[['ลิ้น','Tongue'],['ไต','Kidney'],['ม้าม','Spleen'],['กะบังลม','Diaphragm']],0,['ลิ้นมีตัวรับรสที่ตอบสนองต่อสารเคมีในอาหาร','The tongue contains taste receptors responsive to chemicals in food.'])
 ],
 integumentary:[
  Q(['หน้าที่สำคัญของผิวหนังคือข้อใด?','Which is an important function of skin?'],[['เป็นเกราะป้องกันและลดการสูญเสียน้ำ','Provides a protective barrier and reduces water loss'],['สูบฉีดเลือด','Pumps blood'],['สร้างปัสสาวะ','Produces urine'],['ย่อยอาหาร','Digests food']],0,['Skin เป็นแนวกั้นสำคัญระหว่างร่างกายกับสิ่งแวดล้อมและช่วยลดการสูญเสียน้ำ','Skin is an important barrier between the body and environment and reduces water loss.']),
  Q(['ผิวหนังช่วยควบคุมอุณหภูมิผ่านกลไกใด?','How does skin help regulate temperature?'],[['การเปลี่ยนแปลงการไหลเวียนผิวหนังและเหงื่อ','Changes in skin blood flow and sweating'],['การบีบตัวของหัวใจเท่านั้น','Heart contraction only'],['การสร้างน้ำดี','Bile production'],['การกรองที่ไตเท่านั้น','Kidney filtration only']],0,['หลอดเลือดผิวหนังและต่อมเหงื่อมีบทบาทในการระบายความร้อน','Skin blood vessels and sweat glands contribute to heat regulation.']),
  Q(['ตัวรับในผิวหนังสามารถตรวจจับอะไรได้?','What can skin receptors detect?'],[['สัมผัส แรงกด อุณหภูมิ และความเจ็บปวด','Touch, pressure, temperature and pain'],['เฉพาะแสง','Only light'],['เฉพาะเสียง','Only sound'],['เฉพาะกลูโคส','Only glucose']],0,['ตัวรับผิวหนังหลายชนิดส่งข้อมูลความรู้สึกเข้าสู่ระบบประสาท','Different skin receptors relay sensory information to the nervous system.'])
 ]
};

for(const [id,items] of Object.entries(quizExtras))if(quizzes[id])quizzes[id].push(...items);

export function getQuiz(id){return quizzes[id]||[];}
export function createQuiz(id,count=5,random=Math.random){
 const bank=[...getQuiz(id)],n=Math.min(count,bank.length);
 for(let i=bank.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bank[i],bank[j]]=[bank[j],bank[i]];}
 return bank.slice(0,n);
}
export function quizLength(id,count=5){return Math.min(count,getQuiz(id).length);}
export function scoreQuiz(id,answers){const q=getQuiz(id);return q.reduce((score,item,i)=>score+(answers?.[i]===item.answer?1:0),0);}
