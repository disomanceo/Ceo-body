import * as THREE from 'three';

// v1.4: deeper integumentary, endocrine and lymphatic teaching anatomy.
export function extendAnatomyV14(root,parts,systems){
  const existing=new Set(parts.map(p=>p.id));
  const mat=(system,color,opts={})=>new THREE.MeshStandardMaterial({color:color||systems[system]?.[2]||'#c8a0a0',roughness:.55,metalness:0,...opts});
  function part(def){
    if(existing.has(def.id))return parts.find(p=>p.id===def.id);
    const group=new THREE.Group();group.position.set(...def.pos);group.userData={id:def.id};root.add(group);
    const p={id:def.id,th:def.th,en:def.en,system:def.system,systems:def.systems||[def.system],group,base:group.position.clone(),desc:def.desc,parent:def.parent,variant:def.variant};parts.push(p);existing.add(def.id);return p;
  }
  function ell(def,scale,color){const p=part(def);if(!p.group.children.length){const m=new THREE.Mesh(new THREE.SphereGeometry(1,22,16),mat(def.system,color));m.scale.set(...scale);p.group.add(m);}return p;}
  function box(def,scale,color){const p=part(def);if(!p.group.children.length){const m=new THREE.Mesh(new THREE.BoxGeometry(...scale),mat(def.system,color));p.group.add(m);}return p;}
  function tube(def,points,r,color){const p=part(def);if(!p.group.children.length){const c=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));const m=new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(24,points.length*8),r,8,false),mat(def.system,color));p.group.add(m);p.lymphPath=c;}return p;}

  // Integumentary cross-section teaching patch; children appear through Explore components.
  const skinParent='skin',sx=-1.55,sy=11.45,sz=.95;
  box({id:'epidermis',th:'หนังกำพร้า',en:'Epidermis',system:'integumentary',pos:[sx,sy+.22,sz],parent:skinParent,desc:['ชั้นนอกสุดของผิวหนัง เป็นเกราะป้องกันและช่วยลดการสูญเสียน้ำ','The outer skin layer forming a protective barrier and limiting water loss.']},[1.15,.10,.55],'#d7a58c');
  box({id:'dermis',th:'หนังแท้',en:'Dermis',system:'integumentary',pos:[sx,sy,sz],parent:skinParent,desc:['ชั้นเนื้อเยื่อเกี่ยวพันที่มีหลอดเลือด เส้นประสาท รูขุมขน และต่อมต่าง ๆ','A connective-tissue layer containing vessels, nerves, hair follicles and glands.']},[1.15,.34,.55],'#c88778');
  box({id:'hypodermis',th:'ชั้นใต้ผิวหนัง',en:'Hypodermis',system:'integumentary',pos:[sx,sy-.33,sz],parent:skinParent,desc:['ชั้นใต้ผิวที่มีไขมันและเนื้อเยื่อเกี่ยวพัน ช่วยรองรับ เก็บพลังงาน และเป็นฉนวน','A subcutaneous layer rich in adipose and connective tissue for cushioning, energy storage and insulation.']},[1.15,.30,.55],'#d2b56d');
  tube({id:'hair-shaft',th:'เส้นขน',en:'Hair shaft',system:'integumentary',pos:[0,0,0],parent:skinParent,desc:['ส่วนของเส้นขนที่ยื่นพ้นผิว ช่วยในการรับสัมผัสและการปกป้องบางบริเวณ','The portion of hair projecting above the skin, contributing to protection and sensation.']},[[sx+.2,sy+.52,sz],[sx+.18,sy+.18,sz]],.025,'#5e4437');
  ell({id:'hair-follicle',th:'รูขุมขน',en:'Hair follicle',system:'integumentary',pos:[sx+.18,sy-.05,sz],parent:skinParent,desc:['ปลอกเนื้อเยื่อที่ล้อมรากขนและเป็นบริเวณที่เส้นขนเจริญ','A tissue sheath surrounding the hair root where hair grows.']},[.07,.27,.07],'#775749');
  ell({id:'sebaceous-gland',th:'ต่อมไขมัน',en:'Sebaceous gland',system:'integumentary',pos:[sx+.38,sy+.02,sz],parent:skinParent,desc:['หลั่งซีบัมเพื่อหล่อลื่นผิวหนังและเส้นขน','Secretes sebum that lubricates skin and hair.']},[.11,.09,.08],'#d3b36b');
  tube({id:'sweat-gland',th:'ต่อมเหงื่อ',en:'Sweat gland',system:'integumentary',pos:[0,0,0],parent:skinParent,desc:['สร้างเหงื่อที่ช่วยระบายความร้อนและขับสารบางชนิด','Produces sweat that supports heat loss and excretion of small amounts of solute.']},[[sx-.28,sy-.24,sz],[sx-.38,sy-.08,sz],[sx-.26,sy+.12,sz],[sx-.34,sy+.38,sz]],.035,'#9bc5cf');
  tube({id:'arrector-pili',th:'กล้ามเนื้อยกขน',en:'Arrector pili muscle',system:'integumentary',systems:['integumentary','muscular'],pos:[0,0,0],parent:skinParent,desc:['กล้ามเนื้อเรียบขนาดเล็กที่หดตัวทำให้เส้นขนตั้งและเกิดขนลุก','A small smooth muscle whose contraction raises the hair and produces goosebumps.']},[[sx+.16,sy-.12,sz],[sx+.48,sy+.22,sz]],.025,'#a64f55');
  ell({id:'cutaneous-receptor',th:'ตัวรับความรู้สึกในผิวหนัง',en:'Cutaneous sensory receptor',system:'integumentary',systems:['integumentary','sensory','nervous'],pos:[sx-.15,sy-.05,sz],parent:skinParent,desc:['ตรวจจับการสัมผัส แรงกด การสั่น อุณหภูมิ หรือความเจ็บปวดตามชนิดของตัวรับ','Detects touch, pressure, vibration, temperature or pain depending on receptor type.']},[.07,.11,.07],'#e1cf83');
  tube({id:'cutaneous-vessel',th:'หลอดเลือดผิวหนัง',en:'Cutaneous blood vessel',system:'integumentary',systems:['integumentary','circulatory'],pos:[0,0,0],parent:skinParent,desc:['หลอดเลือดในหนังแท้ช่วยเลี้ยงเนื้อเยื่อและปรับการสูญเสียความร้อน','Dermal vessels nourish tissue and help regulate heat loss.']},[[sx-.5,sy-.16,sz],[sx,sy-.18,sz],[sx+.5,sy-.16,sz]],.025,'#c34d58');
  box({id:'nail-plate',th:'แผ่นเล็บ',en:'Nail plate',system:'integumentary',pos:[2.95,8.43,.20],desc:['แผ่นเคราตินแข็งที่ปกป้องปลายนิ้วและช่วยการหยิบจับละเอียด','A hard keratin plate protecting the fingertip and assisting fine manipulation.']},[.35,.08,.22],'#d7b9aa');

  // Endocrine detail.
  ell({id:'thyroid-isthmus',th:'คอคอดต่อมไทรอยด์',en:'Thyroid isthmus',system:'endocrine',pos:[0,14.62,.39],desc:['เนื้อเยื่อที่เชื่อมกลีบซ้ายและขวาของต่อมไทรอยด์ด้านหน้าหลอดลม','A band of thyroid tissue connecting the two lobes anterior to the trachea.']},[.20,.07,.08],'#bd725f');
  for(const s of [-1,1])for(const [n,dy] of [[1,.10],[2,-.10]]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
    ell({id:`parathyroid-${s}-${n}`,th:`ต่อมพาราไทรอยด์${side[0]} ${n}`,en:`${side[1]} parathyroid gland ${n}`,system:'endocrine',pos:[s*.19,14.67+dy,-.03],desc:['หลั่งพาราไทรอยด์ฮอร์โมน ช่วยควบคุมระดับแคลเซียมในเลือดและสมดุลของกระดูก','Secretes parathyroid hormone, helping regulate blood calcium and bone mineral balance.']},[.045,.055,.035],'#d4b36c');
  }
  for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'],parent=`adrenal-${s}`;
    ell({id:`adrenal-cortex-${s}`,th:`เปลือกต่อมหมวกไต${side[0]}`,en:`${side[1]} adrenal cortex`,system:'endocrine',pos:[s*.82,10.83,-.48],parent,desc:['ชั้นนอกของต่อมหมวกไต สร้างฮอร์โมนสเตียรอยด์ เช่น cortisol และ aldosterone','The outer adrenal layer producing steroid hormones such as cortisol and aldosterone.']},[.20,.10,.16],'#d9b45f');
    ell({id:`adrenal-medulla-${s}`,th:`แกนต่อมหมวกไต${side[0]}`,en:`${side[1]} adrenal medulla`,system:'endocrine',pos:[s*.82,10.83,-.46],parent,desc:['ส่วนแกนในของต่อมหมวกไต หลั่ง catecholamines เช่น adrenaline ในการตอบสนองต่อความเครียด','The inner adrenal region releasing catecholamines such as adrenaline during stress responses.']},[.10,.055,.08],'#b9876f');
  }
  for(const i of [-2,-1,0,1,2])ell({id:`pancreatic-islet-${i+3}`,th:`กลุ่มเซลล์ไอส์เลตตับอ่อน ${i+3}`,en:`Pancreatic islet ${i+3}`,system:'endocrine',systems:['endocrine','digestive'],pos:[i*.22,9.96,.12],parent:'pancreas',desc:['กลุ่มเซลล์ต่อมไร้ท่อของตับอ่อนที่หลั่งฮอร์โมน เช่น insulin และ glucagon','An endocrine cell cluster of the pancreas releasing hormones such as insulin and glucagon.']},[.045,.045,.04],'#e0b681');

  // Lymphatic transport network and immune organs.
  const lymph='#a7b77e';
  tube({id:'thoracic-duct',th:'ท่อน้ำเหลืองทรวงอก',en:'Thoracic duct',system:'lymphatic',pos:[0,0,0],desc:['ท่อน้ำเหลืองหลักที่รับน้ำเหลืองจากร่างกายส่วนใหญ่และเทเข้าสู่หลอดเลือดดำบริเวณคอด้านซ้าย','The main lymphatic duct draining most of the body into the left venous angle.']},[[.08,8.9,-.5],[.08,11.2,-.55],[.06,13.5,-.5],[-.12,14.45,-.35]],.035,lymph);
  tube({id:'right-lymphatic-duct',th:'ท่อน้ำเหลืองขวา',en:'Right lymphatic duct',system:'lymphatic',pos:[0,0,0],desc:['รับน้ำเหลืองจากศีรษะและทรวงอกด้านขวารวมถึงแขนขวา แล้วเทเข้าสู่หลอดเลือดดำด้านขวา','Drains the right upper quadrant of the body into the right venous angle.']},[[-.12,14.55,-.3],[-.35,14.3,-.25],[-.48,13.9,-.2]],.03,lymph);
  ell({id:'cisterna-chyli',th:'ซิสเทอร์นาชิลี',en:'Cisterna chyli',system:'lymphatic',pos:[.08,9.15,-.50],desc:['ถุงขยายบริเวณต้นท่อน้ำเหลืองทรวงอก รับน้ำเหลืองจากช่องท้องและขาส่วนล่าง','An expanded lymphatic sac at the origin of the thoracic duct receiving lymph from the abdomen and lower limbs.']},[.10,.18,.08],lymph);
  for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
    ell({id:`palatine-tonsil-${s}`,th:`ต่อมทอนซิลเพดาน${side[0]}`,en:`${side[1]} palatine tonsil`,system:'lymphatic',pos:[s*.25,15.72,.22],desc:['เนื้อเยื่อน้ำเหลืองบริเวณคอหอย ช่วยตรวจจับสิ่งแปลกปลอมที่เข้าสู่ทางปากและจมูก','Lymphoid tissue in the pharynx that samples material entering through the mouth and nose.']},[.10,.15,.08],lymph);
    ell({id:`popliteal-nodes-${s}`,th:`ต่อมน้ำเหลืองหลังเข่า${side[0]}`,en:`${side[1]} popliteal lymph nodes`,system:'lymphatic',pos:[s*.72,4.5,-.3],desc:['กลุ่มต่อมน้ำเหลืองหลังเข่าที่รับน้ำเหลืองจากบางส่วนของขาและเท้า','A lymph-node group behind the knee receiving lymph from parts of the leg and foot.']},[.09,.13,.07],lymph);
    tube({id:`upper-limb-lymphatics-${s}`,th:`หลอดน้ำเหลืองแขน${side[0]}`,en:`${side[1]} upper-limb lymphatics`,system:'lymphatic',pos:[0,0,0],desc:['ลำเลียงน้ำเหลืองจากมือและแขนไปยังต่อมน้ำเหลืองรักแร้และเข้าสู่ท่อน้ำเหลืองส่วนกลาง','Carry lymph from the hand and arm toward axillary nodes and central lymphatic ducts.']},[[s*2.9,8.8,-.05],[s*2.55,10.8,-.12],[s*1.85,12.6,-.15],[s*1.45,13.0,-.15]],.025,lymph);
    tube({id:`lower-limb-lymphatics-${s}`,th:`หลอดน้ำเหลืองขา${side[0]}`,en:`${side[1]} lower-limb lymphatics`,system:'lymphatic',pos:[0,0,0],desc:['ลำเลียงน้ำเหลืองจากเท้าและขาขึ้นสู่ต่อมน้ำเหลืองขาหนีบและทางเดินน้ำเหลืองส่วนกลาง','Carry lymph from the foot and leg toward inguinal nodes and central lymphatic pathways.']},[[s*.72,.6,-.08],[s*.74,3.1,-.12],[s*.78,5.8,-.10],[s*.84,7.7,.12]],.025,lymph);
  }
  for(const i of [-2,-1,0,1,2])ell({id:`mesenteric-node-${i+3}`,th:`ต่อมน้ำเหลืองเมเซนเทอริก ${i+3}`,en:`Mesenteric lymph node ${i+3}`,system:'lymphatic',pos:[i*.25,9.0,.18],desc:['ต่อมน้ำเหลืองในเยื่อแขวนลำไส้ ช่วยกรองน้ำเหลืองจากทางเดินอาหารและสนับสนุนภูมิคุ้มกันของลำไส้','A mesenteric lymph node filtering intestinal lymph and supporting gut immune surveillance.']},[.07,.09,.06],lymph);
  ell({id:'intestinal-lacteals',th:'หลอดแลคทีลในลำไส้',en:'Intestinal lacteals',system:'lymphatic',systems:['lymphatic','digestive'],pos:[0,8.9,.46],parent:'small-intestine',desc:['หลอดน้ำเหลืองขนาดเล็กในวิลไลของลำไส้เล็ก ช่วยดูดซึมไขมันจากอาหารเข้าสู่ระบบน้ำเหลือง','Small lymphatic vessels in intestinal villi that absorb dietary lipids into lymph.']},[.16,.08,.08],lymph);
  ell({id:'red-bone-marrow',th:'ไขกระดูกแดง',en:'Red bone marrow',system:'lymphatic',systems:['lymphatic','skeletal'],pos:[0,12.72,.80],parent:'sternum',desc:['เนื้อเยื่อสร้างเม็ดเลือดและเป็นแหล่งกำเนิดเซลล์ภูมิคุ้มกันหลายชนิด','Hematopoietic tissue producing blood cells and precursors of many immune cells.']},[.08,.55,.04],'#9d4b54');
}
