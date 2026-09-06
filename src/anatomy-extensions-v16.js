import * as THREE from 'three';

// v1.6: musculoskeletal teaching depth and specific muscle actions.
export function extendAnatomyV16(root,parts,systems){
 const existing=new Set(parts.map(p=>p.id));
 const material=(system,color)=>new THREE.MeshStandardMaterial({color:color||systems[system]?.[2]||'#c8a0a0',roughness:.55,metalness:0});
 function part(d){if(existing.has(d.id))return parts.find(p=>p.id===d.id);const g=new THREE.Group();g.position.set(...d.pos);g.userData={id:d.id};root.add(g);const p={id:d.id,th:d.th,en:d.en,system:d.system,systems:d.systems||[d.system],group:g,base:g.position.clone(),desc:d.desc,parent:d.parent};parts.push(p);existing.add(d.id);return p;}
 function ell(d,scale,color,rot=[0,0,0]){const p=part(d);if(!p.group.children.length){const m=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),material(d.system,color));m.scale.set(...scale);m.rotation.set(...rot);p.group.add(m);}return p;}
 function tube(d,points,r,color){const p=part(d);if(!p.group.children.length){const c=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));p.group.add(new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(24,points.length*8),r,8,false),material(d.system,color)));}return p;}
 const muscle='#a94d50',deep='#8f4148',bone='#e1d5bb';

 // Make the original simplified muscle groups educationally specific instead of generic.
 const actions={
  deltoid:['กางแขนเป็นหลัก และช่วยงอ/เหยียดหรือหมุนแขนตามส่วนของกล้ามเนื้อที่ทำงาน','Primarily abducts the arm; different fibers also assist flexion, extension and rotation at the shoulder.'],
  pectoralis:['หุบแขนและหมุนต้นแขนเข้าด้านใน และช่วยงอไหล่โดยเฉพาะส่วน clavicular','Adducts and medially rotates the humerus and assists shoulder flexion, especially through its clavicular fibers.'],
  biceps:['งอข้อศอกและช่วยหงายปลายแขน โดยยังช่วยงอข้อไหล่เล็กน้อย','Flexes the elbow and supinates the forearm, with a smaller role in shoulder flexion.'],
  triceps:['เหยียดข้อศอก และ long head ช่วยเหยียดและหุบแขนที่ข้อไหล่','Extends the elbow; the long head also assists shoulder extension and adduction.'],
  'forearm-flexors':['งอข้อมือและนิ้วหลายข้อ และช่วยควบคุมแรงจับ','Flex the wrist and fingers and contribute to grip control.'],
  rectus:['งอลำตัวและช่วยเพิ่มแรงดันในช่องท้อง','Flexes the trunk and contributes to increased intra-abdominal pressure.'],
  oblique:['ช่วยหมุนและเอียงลำตัว พร้อมพยุงผนังหน้าท้อง','Rotates and laterally flexes the trunk while supporting the abdominal wall.'],
  trapezius:['ยก ดึงเข้าหาแนวกลาง กด และหมุนสะบักขึ้นตามส่วนของกล้ามเนื้อ','Elevates, retracts, depresses and upwardly rotates the scapula depending on the active fibers.'],
  latissimus:['เหยียด หุบ และหมุนต้นแขนเข้าด้านใน พร้อมช่วยดึงลำตัวเข้าหาแขน','Extends, adducts and medially rotates the humerus and can help pull the trunk toward a fixed arm.'],
  gluteus:['เหยียดและหมุนสะโพกออกด้านนอก โดยช่วยพยุงลำตัวขณะยืนขึ้นหรือขึ้นบันได','Extends and laterally rotates the hip and helps stabilize the trunk during rising and climbing.'],
  quadriceps:['เหยียดข้อเข่า โดย rectus femoris ยังช่วยงอข้อสะโพก','Extends the knee; rectus femoris also assists hip flexion.'],
  hamstrings:['งอข้อเข่าและช่วยเหยียดข้อสะโพก โดยควบคุมขาระหว่างการเดิน','Flex the knee and assist hip extension while controlling the limb during gait.'],
  gastrocnemius:['กดปลายเท้าลงและช่วยงอเข่า มีบทบาทสำคัญในการเขย่งและผลักตัวขณะเดิน','Plantar-flexes the ankle and assists knee flexion, contributing to push-off and tiptoe stance.'],
  tibialis:['กระดกข้อเท้าขึ้นและบิดฝ่าเท้าเข้าด้านใน ช่วยควบคุมการวางส้นเท้าขณะเดิน','Dorsiflexes and inverts the foot and helps control heel placement during gait.']
 };
 for(const p of parts){if(p.system!=='muscular')continue;for(const [prefix,desc] of Object.entries(actions))if(p.id===prefix||p.id.startsWith(prefix+'-')){p.desc=desc;break;}}

 // Head, neck, shoulder and trunk muscles.
 for(const s of [-1,1]){const th=s===1?'ซ้าย':'ขวา',en=s===1?'Left':'Right';
  ell({id:`masseter-${s}`,th:`กล้ามเนื้อแมสซีเตอร์${th}`,en:`${en} masseter`,system:'muscular',pos:[s*.58,15.9,.42],desc:['ยกขากรรไกรล่างเพื่อปิดปากและสร้างแรงบดเคี้ยว','Elevates the mandible to close the jaw and generate chewing force.']},[.11,.28,.10],muscle,[0,0,s*.10]);
  ell({id:`temporalis-${s}`,th:`กล้ามเนื้อเทมโพราลิส${th}`,en:`${en} temporalis`,system:'muscular',pos:[s*.55,16.55,.02],desc:['ยกและดึงขากรรไกรล่างถอยหลัง ช่วยในการบดเคี้ยว','Elevates and retracts the mandible during mastication.']},[.22,.30,.08],muscle);
  tube({id:`sternocleidomastoid-${s}`,th:`กล้ามเนื้อสเตอร์โนไคลโดมาสตอยด์${th}`,en:`${en} sternocleidomastoid`,system:'muscular',pos:[0,0,0],desc:['เมื่อทำงานข้างเดียวช่วยหมุนศีรษะไปด้านตรงข้ามและเอียงคอ เมื่อทำงานสองข้างช่วยงอคอ','Unilateral contraction rotates the head to the opposite side and laterally flexes the neck; bilateral action assists neck flexion.']},[[s*.34,15.72,.10],[s*.50,15.02,.16],[s*.58,14.45,.35]],.07,muscle);
  ell({id:`serratus-anterior-${s}`,th:`กล้ามเนื้อเซอร์ราตัสแอนทีเรียร์${th}`,en:`${en} serratus anterior`,system:'muscular',pos:[s*1.45,12.45,.45],desc:['ดันสะบักไปด้านหน้าและช่วยหมุนสะบักขึ้น ทำให้ยกแขนเหนือศีรษะได้','Protracts and upwardly rotates the scapula, helping raise the arm overhead.']},[.22,.90,.16],muscle,[0,0,s*.10]);
  ell({id:`erector-spinae-${s}`,th:`กลุ่มเอเรคเตอร์สไปนี${th}`,en:`${en} erector spinae`,system:'muscular',pos:[s*.34,11.0,-.78],desc:['เหยียดและเอียงกระดูกสันหลัง ช่วยรักษาท่าทางตั้งตรง','Extends and laterally flexes the vertebral column and helps maintain upright posture.']},[.18,2.1,.15],deep);
  ell({id:`supraspinatus-${s}`,th:`กล้ามเนื้อซูปราสไปเนตัส${th}`,en:`${en} supraspinatus`,system:'muscular',pos:[s*1.10,13.83,-.58],desc:['เริ่มการกางแขนช่วงต้นและช่วยพยุงหัว humerus ในข้อไหล่','Initiates early arm abduction and stabilizes the humeral head in the shoulder joint.']},[.30,.16,.10],deep,[0,0,s*.12]);
  ell({id:`infraspinatus-${s}`,th:`กล้ามเนื้ออินฟราสไปเนตัส${th}`,en:`${en} infraspinatus`,system:'muscular',pos:[s*1.15,13.25,-.72],desc:['หมุนต้นแขนออกด้านนอกและช่วยพยุงข้อไหล่','Laterally rotates the humerus and stabilizes the shoulder joint.']},[.34,.40,.11],deep);
  ell({id:`teres-minor-${s}`,th:`กล้ามเนื้อเทเรสมินอร์${th}`,en:`${en} teres minor`,system:'muscular',pos:[s*1.35,12.92,-.63],desc:['ช่วยหมุนต้นแขนออกด้านนอกและพยุงหัว humerus','Assists lateral rotation of the humerus and stabilizes the humeral head.']},[.12,.30,.10],deep,[0,0,s*.18]);
  ell({id:`subscapularis-${s}`,th:`กล้ามเนื้อซับสแคพูลาริส${th}`,en:`${en} subscapularis`,system:'muscular',pos:[s*1.02,13.20,-.45],desc:['หมุนต้นแขนเข้าด้านในและช่วยพยุงข้อไหล่','Medially rotates the humerus and stabilizes the shoulder joint.']},[.34,.45,.10],deep);
  ell({id:`brachialis-${s}`,th:`กล้ามเนื้อเบรเคียลิส${th}`,en:`${en} brachialis`,system:'muscular',pos:[s*2.22,11.75,.10],desc:['เป็นกล้ามเนื้องอข้อศอกที่ทำงานได้ดีไม่ว่าปลายแขนจะคว่ำหรือหงาย','A strong elbow flexor effective regardless of forearm pronation or supination.']},[.20,.56,.20],deep,[0,0,s*-.20]);
  ell({id:`forearm-extensors-${s}`,th:`กลุ่มกล้ามเนื้อเหยียดปลายแขน${th}`,en:`${en} forearm extensors`,system:'muscular',pos:[s*2.70,10.15,-.16],desc:['เหยียดข้อมือและนิ้วหลายข้อ และช่วยคงตำแหน่งข้อมือขณะจับสิ่งของ','Extend the wrist and fingers and stabilize the wrist during gripping.']},[.21,.82,.20],deep,[0,0,s*-.10]);
 }
 // Hip, thigh and leg muscles.
 for(const s of [-1,1]){const th=s===1?'ซ้าย':'ขวา',en=s===1?'Left':'Right';
  ell({id:`iliopsoas-${s}`,th:`กล้ามเนื้ออิลิโอโซแอส${th}`,en:`${en} iliopsoas`,system:'muscular',pos:[s*.45,7.95,.28],desc:['เป็นกล้ามเนื้องอข้อสะโพกที่สำคัญ ช่วยยกต้นขาเข้าหาลำตัว','A major hip flexor that raises the thigh toward the trunk.']},[.20,.70,.20],deep,[0,0,s*.08]);
  ell({id:`gluteus-medius-${s}`,th:`กล้ามเนื้อก้นกลาง${th}`,en:`${en} gluteus medius`,system:'muscular',pos:[s*.75,7.90,-.35],desc:['กางข้อสะโพกและรักษาระดับเชิงกรานเมื่อยืนขาเดียวหรือเดิน','Abducts the hip and keeps the pelvis level during single-leg stance and walking.']},[.43,.42,.26],muscle);
  tube({id:`sartorius-${s}`,th:`กล้ามเนื้อซาร์โทเรียส${th}`,en:`${en} sartorius`,system:'muscular',pos:[0,0,0],desc:['ช่วยงอ กาง และหมุนสะโพกออก พร้อมช่วยงอข้อเข่า','Assists hip flexion, abduction and lateral rotation while also flexing the knee.']},[[s*.50,7.55,.35],[s*.85,6.55,.34],[s*.60,5.45,.30],[s*.52,4.75,.28]],.075,muscle);
  ell({id:`adductors-${s}`,th:`กลุ่มกล้ามเนื้อหุบต้นขา${th}`,en:`${en} hip adductors`,system:'muscular',pos:[s*.40,6.25,.05],desc:['หุบต้นขาเข้าหาแนวกึ่งกลางและช่วยควบคุมเชิงกรานระหว่างการเคลื่อนไหว','Adduct the thigh toward the midline and help control the pelvis during movement.']},[.28,1.15,.25],deep);
  ell({id:`soleus-${s}`,th:`กล้ามเนื้อโซลีอัส${th}`,en:`${en} soleus`,system:'muscular',pos:[s*.74,2.85,-.18],desc:['กดปลายเท้าลงโดยเฉพาะเมื่อเข่างอ และช่วยพยุงท่ายืน','Plantar-flexes the ankle, especially with the knee flexed, and contributes to postural stability.']},[.27,.84,.28],deep);
  ell({id:`fibularis-longus-${s}`,th:`กล้ามเนื้อไฟบูลาริสลองกัส${th}`,en:`${en} fibularis longus`,system:'muscular',pos:[s*.91,2.75,.03],desc:['ช่วยกดปลายเท้าลงและบิดฝ่าเท้าออก พร้อมช่วยพยุงส่วนโค้งของเท้า','Assists plantar flexion and eversion and helps support the foot arches.']},[.14,1.15,.14],deep);
 }

 // Cranial bones: selectable components inside the parent skull.
 ell({id:'frontal-bone',th:'กระดูกหน้าผาก',en:'Frontal bone',system:'skeletal',pos:[0,16.92,.28],parent:'skull',desc:['สร้างหน้าผาก หลังคาเบ้าตาบางส่วน และส่วนหน้าของกะโหลกสมอง','Forms the forehead, part of the orbital roof and anterior cranial vault.']},[.62,.38,.50],bone);
 for(const s of [-1,1]){const th=s===1?'ซ้าย':'ขวา',en=s===1?'Left':'Right';
  ell({id:`parietal-bone-${s}`,th:`กระดูกข้างขม่อม${th}`,en:`${en} parietal bone`,system:'skeletal',pos:[s*.38,16.95,-.12],parent:'skull',desc:['สร้างผนังด้านข้างและหลังคาส่วนใหญ่ของกะโหลกสมอง','Forms much of the lateral wall and roof of the cranial vault.']},[.45,.45,.48],bone);
  ell({id:`temporal-bone-${s}`,th:`กระดูกขมับ${th}`,en:`${en} temporal bone`,system:'skeletal',pos:[s*.63,16.45,-.08],parent:'skull',desc:['สร้างผนังด้านข้างและฐานกะโหลกบางส่วน และล้อมรอบโครงสร้างหู','Forms part of the lateral skull and cranial base and surrounds structures of the ear.']},[.30,.32,.37],bone);
  ell({id:`zygomatic-bone-${s}`,th:`กระดูกโหนกแก้ม${th}`,en:`${en} zygomatic bone`,system:'skeletal',pos:[s*.55,16.18,.52],parent:'skull',desc:['สร้างความนูนของแก้มและเป็นส่วนของผนังเบ้าตา','Forms the cheek prominence and part of the orbital wall.']},[.16,.17,.14],bone);
  ell({id:`maxilla-${s}`,th:`กระดูกขากรรไกรบน${th}`,en:`${en} maxilla`,system:'skeletal',pos:[s*.28,15.98,.55],parent:'skull',desc:['รองรับฟันบนและสร้างส่วนของเบ้าตา โพรงจมูก และเพดานแข็ง','Supports the upper teeth and contributes to the orbit, nasal cavity and hard palate.']},[.27,.20,.18],bone);
  ell({id:`nasal-bone-${s}`,th:`กระดูกจมูก${th}`,en:`${en} nasal bone`,system:'skeletal',pos:[s*.08,16.35,.69],parent:'skull',desc:['กระดูกคู่ขนาดเล็กที่สร้างสันจมูกส่วนบน','A small paired bone forming the upper bridge of the nose.']},[.07,.13,.045],bone);
  ell({id:`ilium-${s}`,th:`กระดูกอิเลียม${th}`,en:`${en} ilium`,system:'skeletal',pos:[s*.72,8.25,-.18],parent:`hip-${s}`,desc:['ส่วนกว้างด้านบนของ hip bone รับแรงจากกระดูกกระเบนเหน็บและเป็นจุดเกาะกล้ามเนื้อจำนวนมาก','The broad superior part of the hip bone, transmitting load from the sacrum and providing extensive muscle attachment.']},[.45,.44,.17],bone);
  ell({id:`ischium-${s}`,th:`กระดูกอิสเคียม${th}`,en:`${en} ischium`,system:'skeletal',pos:[s*.64,7.68,-.25],parent:`hip-${s}`,desc:['ส่วนล่างด้านหลังของ hip bone รับน้ำหนักเมื่อนั่งและเป็นจุดเกาะ hamstrings','The posteroinferior hip-bone component that bears weight in sitting and anchors the hamstrings.']},[.30,.34,.18],bone);
  ell({id:`pubis-${s}`,th:`กระดูกหัวหน่าว${th}`,en:`${en} pubis`,system:'skeletal',pos:[s*.42,7.75,.25],parent:`hip-${s}`,desc:['ส่วนหน้าของ hip bone เชื่อมกับอีกข้างที่ pubic symphysis และเป็นจุดเกาะกล้ามเนื้อสะโพก/หน้าท้อง','The anterior hip-bone component joining its counterpart at the pubic symphysis and providing muscle attachments.']},[.28,.22,.16],bone);
 }
 ell({id:'occipital-bone',th:'กระดูกท้ายทอย',en:'Occipital bone',system:'skeletal',pos:[0,16.55,-.55],parent:'skull',desc:['สร้างด้านหลังและฐานของกะโหลก มี foramen magnum ให้ก้านสมองต่อกับไขสันหลัง','Forms the posterior skull and cranial base and contains the foramen magnum.']},[.55,.42,.25],bone);
 ell({id:'sphenoid-bone',th:'กระดูกสฟีนอยด์',en:'Sphenoid bone',system:'skeletal',pos:[0,16.35,.05],parent:'skull',desc:['กระดูกฐานกะโหลกรูปร่างซับซ้อน เชื่อมกระดูกกะโหลกหลายชิ้นและรองรับต่อมใต้สมอง','A complex cranial-base bone articulating with many skull bones and supporting the pituitary region.']},[.40,.18,.25],bone);
 ell({id:'ethmoid-bone',th:'กระดูกเอทมอยด์',en:'Ethmoid bone',system:'skeletal',systems:['skeletal','sensory'],pos:[0,16.38,.42],parent:'skull',desc:['เป็นส่วนของหลังคาโพรงจมูกและผนังเบ้าตา มีทางผ่านของเส้นประสาทรับกลิ่น','Contributes to the nasal roof and medial orbit and provides passage for olfactory nerve fibers.']},[.18,.17,.13],bone);
}
