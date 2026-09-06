import * as THREE from 'three';

// Incremental schematic anatomy that complements the BodyParts3D-backed core.
// Geometry is intentionally lightweight and educational, not scan-equivalent.
export function extendAnatomyV13(root,parts,systems){
  const existing=new Set(parts.map(p=>p.id));
  const material=(system,color)=>new THREE.MeshStandardMaterial({color:color||systems[system]?.[2]||'#c8a0a0',roughness:.55,metalness:0});
  function addPart({id,th,en,system,pos,desc,parent,variant,systems:members}){
    if(existing.has(id))return parts.find(p=>p.id===id);
    const group=new THREE.Group();group.position.set(...pos);group.userData={id};root.add(group);
    const p={id,th,en,system,systems:members||[system],group,base:group.position.clone(),desc,variant,parent};parts.push(p);existing.add(id);return p;
  }
  function ell(def,scale,color,rot=[0,0,0]){
    const p=addPart(def);if(!p||p.group.children.length)return p;
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),material(def.system,color));mesh.scale.set(...scale);mesh.rotation.set(...rot);p.group.add(mesh);return p;
  }
  function tube(def,points,radius,color){
    const p=addPart(def);if(!p||p.group.children.length)return p;
    const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*8),radius,8,false),material(def.system,color));p.group.add(mesh);p.signalPath=curve;return p;
  }
  function ring(def,major,minor,color,rot=[Math.PI/2,0,0]){
    const p=addPart(def);if(!p||p.group.children.length)return p;
    const mesh=new THREE.Mesh(new THREE.TorusGeometry(major,minor,10,32),material(def.system,color));mesh.rotation.set(...rot);p.group.add(mesh);return p;
  }

  const neural='#e7c17f',brainColor='#c89a9e',sensoryColor='#a9d4d5';
  const lobes=[
    ['frontal',[.38,16.82,.31],[.38,.43,.30],['เกี่ยวข้องกับการวางแผน การตัดสินใจ บุคลิกภาพ และการควบคุมการเคลื่อนไหวโดยสมัครใจ','Supports planning, decision-making, personality and voluntary motor control.']],
    ['parietal',[.42,17.02,-.02],[.38,.31,.34],['ประมวลผลข้อมูลสัมผัสและช่วยรับรู้ตำแหน่งของร่างกายในอวกาศ','Processes somatic sensation and contributes to spatial body awareness.']],
    ['temporal',[.50,16.42,.02],[.34,.27,.34],['เกี่ยวข้องกับการได้ยิน ความจำ และการเข้าใจภาษา','Contributes to hearing, memory and language comprehension.']],
    ['occipital',[.32,16.72,-.43],[.31,.31,.25],['เป็นบริเวณสำคัญของการประมวลผลข้อมูลการมองเห็น','A major region for processing visual information.']]
  ];
  for(const [name,pos,scale,desc] of lobes)for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
    ell({id:`${name}-lobe-${s}`,th:`กลีบ${name==='frontal'?'หน้าผาก':name==='parietal'?'ข้างขม่อม':name==='temporal'?'ขมับ':'ท้ายทอย'}${side[0]}`,en:`${side[1]} ${name} lobe`,system:'nervous',systems:['nervous'],pos:[s*pos[0],pos[1],pos[2]],desc,parent:'brain'},scale,brainColor);
  }
  ell({id:'thalamus',th:'ทาลามัส',en:'Thalamus',system:'nervous',pos:[0,16.45,-.03],desc:['เป็นสถานีถ่ายทอดข้อมูลประสาทหลายชนิดไปยังเปลือกสมอง','Relays many sensory and motor signals to the cerebral cortex.'],parent:'brain'},[.22,.13,.17],'#b58c9e');
  ell({id:'hypothalamus',th:'ไฮโปทาลามัส',en:'Hypothalamus',system:'nervous',systems:['nervous','endocrine'],pos:[0,16.27,.03],desc:['ช่วยควบคุมอุณหภูมิ ความหิว กระหาย ระบบอัตโนมัติ และเชื่อมการควบคุมกับต่อมใต้สมอง','Regulates temperature, hunger, thirst and autonomic functions and links neural control with the pituitary.'],parent:'brain'},[.14,.09,.11],'#d0a179');
  ell({id:'corpus-callosum',th:'คอร์ปัสคาโลซัม',en:'Corpus callosum',system:'nervous',pos:[0,16.65,-.08],desc:['มัดใยประสาทขนาดใหญ่ที่เชื่อมสมองใหญ่ซีกซ้ายและขวา','A large fiber tract connecting the left and right cerebral hemispheres.'],parent:'brain'},[.42,.07,.12],'#ead8bd');
  ell({id:'midbrain',th:'สมองส่วนกลาง',en:'Midbrain',system:'nervous',pos:[0,15.98,-.10],desc:['เป็นส่วนของก้านสมองที่เกี่ยวข้องกับการเคลื่อนไหว การตื่นตัว และรีเฟล็กซ์ทางตา/หู','A brainstem region involved in movement, arousal and visual/auditory reflexes.'],parent:'brainstem'},[.15,.16,.14],brainColor);
  ell({id:'pons',th:'พอนส์',en:'Pons',system:'nervous',pos:[0,15.78,-.07],desc:['เป็นสะพานเชื่อมหลายบริเวณของสมองและมีบทบาทในวงจรการหายใจและการนอน','Relays signals between brain regions and participates in breathing and sleep regulation.'],parent:'brainstem'},[.19,.14,.15],brainColor);
  ell({id:'medulla',th:'เมดัลลาออบลองกาตา',en:'Medulla oblongata',system:'nervous',pos:[0,15.57,-.10],desc:['ควบคุมหน้าที่อัตโนมัติสำคัญ เช่น การหายใจ อัตราหัวใจ และความดันเลือด','Controls vital autonomic functions including breathing, heart rate and blood pressure.'],parent:'brainstem'},[.12,.18,.12],brainColor);

  // Cranial and peripheral teaching nerves.
  for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
    tube({id:`trigeminal-nerve-${s}`,th:`เส้นประสาทไตรเจมินัล${side[0]}`,en:`${side[1]} trigeminal nerve`,system:'nervous',systems:['nervous','sensory'],pos:[0,0,0],desc:['รับความรู้สึกส่วนใหญ่ของใบหน้าและควบคุมกล้ามเนื้อบดเคี้ยวบางส่วน','Carries most facial sensation and motor supply to muscles of mastication.']},[[s*.15,16.2,.2],[s*.38,16.15,.42],[s*.72,15.95,.55]],.025,neural);
    tube({id:`vagus-nerve-${s}`,th:`เส้นประสาทเวกัส${side[0]}`,en:`${side[1]} vagus nerve`,system:'nervous',pos:[0,0,0],desc:['เป็นเส้นประสาทสมองที่สำคัญของระบบพาราซิมพาเทติก ไปยังคอ อก และช่องท้อง','A major cranial parasympathetic nerve supplying the neck, thorax and abdomen.']},[[s*.18,15.72,-.05],[s*.32,14.3,-.2],[s*.38,12.5,-.25],[s*.28,10.4,-.25]],.022,neural);
    tube({id:`brachial-plexus-${s}`,th:`ร่างแหประสาทแขน${side[0]}`,en:`${side[1]} brachial plexus`,system:'nervous',pos:[0,0,0],desc:['เครือข่ายเส้นประสาทที่ให้เส้นประสาทหลักแก่ไหล่ แขน และมือ','A nerve network supplying the shoulder, arm and hand.']},[[s*.3,14.5,-.2],[s*.8,14.1,-.2],[s*1.45,13.7,-.05]],.035,neural);
    for(const [id,th,en,z,off] of [['radial','เรเดียล','radial',-.18,.12],['median','มีเดียน','median',.08,0],['ulnar','อัลนาร์','ulnar',-.02,-.13]]){
      tube({id:`${id}-nerve-${s}`,th:`เส้นประสาท${th}${side[0]}`,en:`${side[1]} ${en} nerve`,system:'nervous',pos:[0,0,0],desc:[id==='radial'?'เลี้ยงกล้ามเนื้อเหยียดแขนและรับความรู้สึกบางส่วนของด้านหลังแขน/มือ':id==='median'?'เลี้ยงกล้ามเนื้อปลายแขนและมือหลายมัด รวมถึงการรับความรู้สึกฝ่ามือบางส่วน':'เลี้ยงกล้ามเนื้อมือหลายมัดและรับความรู้สึกด้านนิ้วก้อยของมือ',id==='radial'?'Supplies major extensor muscles and sensory regions of the posterior upper limb.':id==='median'?'Supplies many forearm/hand muscles and sensory regions of the palm.':'Supplies many intrinsic hand muscles and sensation on the little-finger side.']},[[s*1.45,13.7,z],[s*(2.1+off),12.3,z],[s*(2.65+off),10.4,z],[s*(2.88+off),8.75,z]],.022,neural);
    }
    tube({id:`lumbar-plexus-${s}`,th:`ร่างแหประสาทเอว${side[0]}`,en:`${side[1]} lumbar plexus`,system:'nervous',pos:[0,0,0],desc:['เครือข่ายเส้นประสาทบริเวณเอวที่ให้เส้นประสาทสำคัญแก่หน้าท้องส่วนล่างและต้นขา','A lumbar nerve network supplying the lower abdominal wall and parts of the thigh.']},[[s*.2,9.9,-.55],[s*.45,9.1,-.45],[s*.65,8.4,-.25]],.028,neural);
    tube({id:`sacral-plexus-${s}`,th:`ร่างแหประสาทกระเบนเหน็บ${side[0]}`,en:`${side[1]} sacral plexus`,system:'nervous',pos:[0,0,0],desc:['เครือข่ายเส้นประสาทในเชิงกรานที่เป็นต้นกำเนิดของเส้นประสาทไซอาติกและเส้นประสาทขาหลายเส้น','A pelvic nerve network giving rise to the sciatic nerve and other lower-limb nerves.']},[[s*.15,8.2,-.55],[s*.45,7.65,-.5],[s*.72,7.2,-.35]],.032,neural);
    tube({id:`femoral-nerve-${s}`,th:`เส้นประสาทเฟมอรัล${side[0]}`,en:`${side[1]} femoral nerve`,system:'nervous',pos:[0,0,0],desc:['เส้นประสาทสำคัญด้านหน้าต้นขา ช่วยควบคุมกล้ามเนื้อเหยียดเข่าและรับความรู้สึกบางส่วน','A major anterior-thigh nerve supporting knee extension and regional sensation.']},[[s*.55,8.4,.05],[s*.72,7.1,.25],[s*.72,5.4,.25],[s*.65,4.5,.18]],.024,neural);
    tube({id:`sciatic-nerve-${s}`,th:`เส้นประสาทไซอาติก${side[0]}`,en:`${side[1]} sciatic nerve`,system:'nervous',pos:[0,0,0],desc:['เส้นประสาทขนาดใหญ่จากเชิงกรานลงด้านหลังต้นขา ก่อนแยกเป็นแขนงสำหรับขาส่วนล่าง','A large nerve descending from the pelvis through the posterior thigh before dividing for the lower leg.']},[[s*.55,7.6,-.35],[s*.72,6.2,-.38],[s*.75,4.65,-.32]],.035,neural);
    tube({id:`tibial-nerve-${s}`,th:`เส้นประสาททิเบียล${side[0]}`,en:`${side[1]} tibial nerve`,system:'nervous',pos:[0,0,0],desc:['แขนงของไซอาติกที่เลี้ยงกล้ามเนื้อด้านหลังขาส่วนล่างและฝ่าเท้า','A sciatic branch supplying posterior lower-leg muscles and the plantar foot.']},[[s*.75,4.65,-.3],[s*.76,3.1,-.28],[s*.7,1.25,-.18],[s*.7,.55,.2]],.022,neural);
    tube({id:`common-fibular-nerve-${s}`,th:`เส้นประสาทคอมมอนไฟบูลาร์${side[0]}`,en:`${side[1]} common fibular nerve`,system:'nervous',pos:[0,0,0],desc:['แขนงของไซอาติกที่โค้งรอบบริเวณหัวกระดูกน่องและให้เส้นประสาทแก่ด้านหน้า/ด้านข้างขา','A sciatic branch curving around the fibular head and supplying anterior/lateral leg regions.']},[[s*.76,4.65,-.27],[s*.92,4.35,-.08],[s*.86,3.1,.12],[s*.78,1.4,.15]],.02,neural);
    tube({id:`sympathetic-chain-${s}`,th:`โซ่ประสาทซิมพาเทติก${side[0]}`,en:`${side[1]} sympathetic trunk`,system:'nervous',pos:[0,0,0],desc:['แนวปมประสาทของระบบซิมพาเทติกข้างกระดูกสันหลัง ช่วยควบคุมการตอบสนองอัตโนมัติ','A paravertebral chain of sympathetic ganglia involved in autonomic responses.']},[[s*.22,14.9,-.62],[s*.24,12.5,-.64],[s*.22,10,-.62],[s*.2,7.7,-.55]],.018,'#d8ba72');
  }

  // Eye components.
  for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
    const eyeId=`eye-${s}`,x=s*.36;
    ell({id:`sclera-${s}`,th:`ตาขาว${side[0]}`,en:`${side[1]} sclera`,system:'sensory',pos:[x,16.42,.59],desc:['ชั้นพังผืดแข็งด้านนอกของลูกตา ช่วยคงรูปร่างและปกป้องโครงสร้างภายใน','The tough outer fibrous coat that maintains eye shape and protects internal structures.'],parent:eyeId},[.185,.185,.185],'#ecebe4');
    ell({id:`cornea-${s}`,th:`กระจกตา${side[0]}`,en:`${side[1]} cornea`,system:'sensory',pos:[x,16.42,.77],desc:['พื้นผิวใสด้านหน้าตาที่หักเหแสงเข้าสู่ลูกตา','The transparent anterior surface that refracts incoming light.'],parent:eyeId},[.105,.105,.035],'#cce8e7');
    ring({id:`iris-${s}`,th:`ม่านตา${side[0]}`,en:`${side[1]} iris`,system:'sensory',pos:[x,16.42,.76],desc:['ควบคุมขนาดรูม่านตาและปริมาณแสงที่เข้าสู่ตา','Controls pupil size and the amount of light entering the eye.'],parent:eyeId},.073,.025,'#6c9a91');
    ell({id:`lens-${s}`,th:`เลนส์ตา${side[0]}`,en:`${side[1]} lens`,system:'sensory',pos:[x,16.42,.67],desc:['โครงสร้างใสที่เปลี่ยนความโค้งเพื่อช่วยโฟกัสภาพบนจอตา','A transparent structure that changes shape to focus images on the retina.'],parent:eyeId},[.085,.11,.035],'#dfe8cc');
    ell({id:`retina-${s}`,th:`จอตา${side[0]}`,en:`${side[1]} retina`,system:'sensory',systems:['sensory','nervous'],pos:[x,16.42,.45],desc:['ชั้นประสาทที่มีเซลล์รับแสงและเปลี่ยนแสงเป็นสัญญาณประสาท','A neural layer containing photoreceptors that converts light into neural signals.'],parent:eyeId},[.145,.145,.028],'#c99b72');
    tube({id:`optic-nerve-${s}`,th:`เส้นประสาทตา${side[0]}`,en:`${side[1]} optic nerve`,system:'sensory',systems:['sensory','nervous'],pos:[0,0,0],desc:['นำข้อมูลการมองเห็นจากจอตาเข้าสู่สมอง','Carries visual information from the retina toward the brain.'],parent:eyeId},[[x,16.42,.43],[s*.25,16.4,.18],[s*.12,16.43,-.02]],.035,'#e5d9a9');
  }

  // Ear components.
  for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'],earId=`ear-${s}`,x=s*.86;
    tube({id:`ear-canal-${s}`,th:`ช่องหู${side[0]}`,en:`${side[1]} external auditory canal`,system:'sensory',pos:[0,0,0],desc:['นำคลื่นเสียงจากใบหูไปยังแก้วหู','Conducts sound waves from the auricle to the tympanic membrane.'],parent:earId},[[x,16.32,.05],[s*.65,16.32,.02],[s*.53,16.32,0]],.045,'#b79082');
    ell({id:`tympanic-membrane-${s}`,th:`แก้วหู${side[0]}`,en:`${side[1]} tympanic membrane`,system:'sensory',pos:[s*.50,16.32,0],desc:['สั่นตามคลื่นเสียงและถ่ายทอดแรงสั่นไปยังกระดูกหูชั้นกลาง','Vibrates with sound and transfers mechanical energy to the middle-ear ossicles.'],parent:earId},[.055,.08,.018],'#d8c5aa');
    for(const [id,th,en,dx,dy] of [['malleus','กระดูกค้อน','malleus',.44,.03],['incus','กระดูกทั่ง','incus',.38,0],['stapes','กระดูกโกลน','stapes',.32,-.03]])ell({id:`${id}-${s}`,th:`${th}${side[0]}`,en:`${side[1]} ${en}`,system:'sensory',systems:['sensory','skeletal'],pos:[s*dx,16.32+dy,-.02],desc:['เป็นหนึ่งในกระดูกหูชั้นกลางที่ถ่ายทอดและเพิ่มประสิทธิภาพแรงสั่นของเสียง','One of the middle-ear ossicles that transmits sound vibration toward the inner ear.'],parent:earId},[.035,.05,.025],'#e1d5bb');
    ring({id:`cochlea-${s}`,th:`คอเคลีย${side[0]}`,en:`${side[1]} cochlea`,system:'sensory',pos:[s*.22,16.3,-.05],desc:['อวัยวะหูชั้นในรูปเกลียวที่เปลี่ยนการสั่นเป็นสัญญาณประสาทการได้ยิน','A spiral inner-ear organ that converts vibration into auditory neural signals.'],parent:earId},.09,.025,'#d2b58e',[0,Math.PI/2,0]);
    ring({id:`semicircular-canals-${s}`,th:`ท่อครึ่งวงกลม${side[0]}`,en:`${side[1]} semicircular canals`,system:'sensory',pos:[s*.22,16.48,-.08],desc:['ตรวจจับการหมุนศีรษะและมีบทบาทสำคัญต่อการทรงตัว','Detect head rotation and contribute to balance.'],parent:earId},.105,.018,'#b8c992',[0,Math.PI/2,0]);
    ell({id:`vestibule-${s}`,th:`เวสทิบูล${side[0]}`,en:`${side[1]} vestibule`,system:'sensory',pos:[s*.25,16.37,-.06],desc:['บริเวณหูชั้นในที่ตรวจจับความเร่งเชิงเส้นและตำแหน่งศีรษะเทียบกับแรงโน้มถ่วง','An inner-ear region sensing linear acceleration and head position relative to gravity.'],parent:earId},[.07,.08,.06],'#b7c58e');
    tube({id:`vestibulocochlear-nerve-${s}`,th:`เส้นประสาทเวสทิบูโลโคเคลียร์${side[0]}`,en:`${side[1]} vestibulocochlear nerve`,system:'sensory',systems:['sensory','nervous'],pos:[0,0,0],desc:['นำข้อมูลการได้ยินและการทรงตัวจากหูชั้นในไปยังก้านสมอง','Carries auditory and balance information from the inner ear to the brainstem.'],parent:earId},[[s*.18,16.35,-.08],[s*.10,16.25,-.13],[s*.05,16.05,-.12]],.028,'#e4d59d');
  }

  for(const s of [-1,1]){
    const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
    ell({id:`olfactory-bulb-${s}`,th:`ปุ่มรับกลิ่น${side[0]}`,en:`${side[1]} olfactory bulb`,system:'sensory',systems:['sensory','nervous'],pos:[s*.13,16.58,.35],desc:['รับสัญญาณกลิ่นจากเยื่อบุรับกลิ่นและส่งต่อเข้าสู่สมอง','Receives olfactory signals from the nasal epithelium and relays them into the brain.'],parent:'brain'},[.08,.055,.12],'#d9c884');
    ell({id:`olfactory-epithelium-${s}`,th:`เยื่อบุรับกลิ่น${side[0]}`,en:`${side[1]} olfactory epithelium`,system:'sensory',systems:['sensory','nervous'],pos:[s*.09,16.44,.48],desc:['มีเซลล์รับกลิ่นที่ตรวจจับโมเลกุลกลิ่นในอากาศ','Contains olfactory receptor cells that detect airborne odor molecules.'],parent:'nasal-cavity'},[.07,.045,.12],sensoryColor);
  }
  ell({id:'taste-buds',th:'ปุ่มรับรส',en:'Taste buds',system:'sensory',systems:['sensory','digestive'],pos:[0,15.92,.58],desc:['กลุ่มเซลล์รับความรู้สึกทางเคมีที่ตรวจจับคุณภาพรสของสารละลายในอาหาร','Chemosensory cell groups that detect dissolved taste qualities.'],parent:'tongue'},[.13,.035,.14],'#e3b5b0');

  return {added:parts.filter(p=>!existing.has(p.id)).length};
}
