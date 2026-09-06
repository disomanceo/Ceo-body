import * as THREE from 'three';
import {enrichAnatomyParts} from './anatomy-schema.js';
import {extendAnatomyV13} from './anatomy-extensions.js';
import {extendAnatomyV14} from './anatomy-extensions-v14.js';

export const systems = {
 nervous:['ระบบประสาท','Nervous system','#e8b0b2'],
 respiratory:['ระบบหายใจ','Respiratory system','#e8a6a6'],
 circulatory:['ระบบไหลเวียนเลือด','Circulatory system','#c84551'],
 digestive:['ระบบย่อยอาหาร','Digestive system','#d39a78'],
 urinary:['ระบบทางเดินปัสสาวะ','Urinary system','#bc6970'],
 endocrine:['ระบบต่อมไร้ท่อ','Endocrine system','#dca161'],
 lymphatic:['ระบบน้ำเหลือง','Lymphatic system','#9aa877'],
 reproductive:['ระบบสืบพันธุ์','Reproductive system','#d891a6'],
 skeletal:['ระบบโครงกระดูก','Skeletal system','#e8ddc4'],
 muscular:['ระบบกล้ามเนื้อ','Muscular system','#a8444b'],
 integumentary:['ระบบผิวหนัง','Integumentary system','#c99479'],
 sensory:['อวัยวะรับความรู้สึก','Sense organs','#b0cbd0']
};
const functions = {
 nervous:['รับและส่งสัญญาณเพื่อควบคุมการทำงานและตอบสนองต่อสิ่งเร้า','Receives and transmits signals for control and responses.'],
 respiratory:['เป็นส่วนหนึ่งของทางเดินอากาศและระบบแลกเปลี่ยนแก๊ส','Part of the airways and gas exchange system.'],
 circulatory:['ช่วยลำเลียงเลือด ออกซิเจน และสารต่าง ๆ ทั่วร่างกาย','Helps transport blood, oxygen and other substances.'],
 digestive:['ทำหน้าที่เกี่ยวข้องกับการย่อย การดูดซึม หรือการขับกากอาหาร','Participates in digestion, absorption or waste elimination.'],
 urinary:['มีส่วนในการสร้าง ลำเลียง เก็บ หรือขับปัสสาวะ','Participates in producing, transporting, storing or releasing urine.'],
 endocrine:['หลั่งฮอร์โมนเพื่อควบคุมการทำงานของร่างกาย','Releases hormones that regulate body functions.'],
 lymphatic:['เกี่ยวข้องกับภูมิคุ้มกันและระบบน้ำเหลือง','Contributes to immune defense and the lymphatic system.'],
 reproductive:['เป็นส่วนหนึ่งของระบบสืบพันธุ์','Part of the reproductive system.'],
 skeletal:['ช่วยค้ำจุนร่างกาย ป้องกันอวัยวะ และเป็นจุดเกาะของกล้ามเนื้อ','Provides support, protection and attachment for muscles.'],
 muscular:['หดตัวเพื่อเคลื่อนไหวหรือคงท่าทาง','Contracts to produce movement or maintain posture.'],
 integumentary:['เป็นเกราะป้องกันและช่วยควบคุมอุณหภูมิร่างกาย','Provides a protective barrier and helps regulate temperature.'],
 sensory:['รับสิ่งเร้าและส่งข้อมูลไปยังระบบประสาท','Detects stimuli and sends information to the nervous system.']
};
export function buildAnatomy(){
 const root=new THREE.Group(), parts=[];
 const material=(color)=>new THREE.MeshStandardMaterial({color,roughness:.52,metalness:0});
 function part(id,th,en,system,pos,desc,variant){
  const g=new THREE.Group();g.position.set(...pos);g.userData={id};root.add(g);
  const p={id,th,en,system,group:g,base:g.position.clone(),desc:desc||functions[system],variant};parts.push(p);return p;
 }
 function ell(p,xyz,scale,color,rot=0,warp=0){
  const geo=new THREE.SphereGeometry(1,32,24);
  if(warp){const a=geo.attributes.position;for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i);const f=1+warp*Math.sin(y*8+x*5)*Math.cos(z*7);a.setXYZ(i,x*f,y,z*f);}geo.computeVertexNormals();}
  const mesh=new THREE.Mesh(geo,material(color||systems[p.system][2]));mesh.position.set(...xyz);mesh.scale.set(...scale);mesh.rotation.z=rot;p.group.add(mesh);return mesh;
 }
 function tube(p,pts,r,color,closed=false){
  const curve=new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v)),closed);
  const geo=new THREE.TubeGeometry(curve,Math.max(30,pts.length*7),r,10,closed);
  const m=new THREE.Mesh(geo,material(color||systems[p.system][2]));p.group.add(m);return {mesh:m,curve};
 }
 function organ(id,th,en,sys,pos,scale,desc,color,rot=0,warp=.035,variant){
  const p=part(id,th,en,sys,pos,desc,variant);ell(p,[0,0,0],scale,color,rot,warp);return p;
 }
 const brain=part('brain','สมองใหญ่','Cerebrum','nervous',[0,16.7,0],['ประมวลผลความรู้สึก ความคิด ความจำ และควบคุมการเคลื่อนไหวโดยสมัครใจ','Processes sensation, thought and memory; controls voluntary movement.']);
 for(const s of [-1,1]){
  ell(brain,[s*.42,0,0],[.55,.65,.67],'#cba4a4',0,.06);
  for(let j=0;j<11;j++){const pts=[];for(let k=0;k<24;k++){const a=k/23*Math.PI*1.8;pts.push([s*(.42+.5*Math.cos(a)),.54*Math.sin(a),-.52+j*.10+.023*Math.sin(a*7+j)]);}tube(brain,pts,.032,'#e1bcb4');}
 }
 organ('cerebellum','สมองน้อย','Cerebellum','nervous',[0,16.05,-.35],[.63,.27,.4],['ช่วยประสานการเคลื่อนไหวและการทรงตัว','Coordinates movement and balance.']);
 organ('brainstem','ก้านสมอง','Brainstem','nervous',[0,15.8,-.12],[.16,.37,.16],['เชื่อมสมองกับไขสันหลัง และควบคุมหน้าที่อัตโนมัติที่สำคัญ','Connects the brain to the spinal cord and regulates vital automatic functions.']);
 const cord=part('spinal-cord','ไขสันหลัง','Spinal cord','nervous',[0,12.1,-.53]);cord.signalPath=tube(cord,[[0,3.8,0],[0,1,0],[0,-2.5,0]],.075,'#ead7a0').curve;
 const trachea=part('trachea','หลอดลมคอ','Trachea','respiratory',[0,13.85,.17]);trachea.airPath=tube(trachea,[[0,1.25,0],[0,0,0],[0,-.65,0]],.145,'#dabeb0').curve;
 for(let i=0;i<16;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.147,.022,8,24),material('#ead8c7'));m.rotation.x=Math.PI/2;m.position.y=1.15-i*.12;trachea.group.add(m);}
 organ('larynx','กล่องเสียง','Larynx','respiratory',[0,15.1,.24],[.24,.27,.2]);
 const lungParts=[];
 for(const s of [-1,1]){
 const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
 const p=part(s===1?'lung-left':'lung-right','ปอด'+side[0],side[1]+' lung','respiratory',[s*.92,12.45,.04],['แลกเปลี่ยนออกซิเจนและคาร์บอนไดออกไซด์ที่ถุงลม ปอดขวามี 3 กลีบ ปอดซ้ายมี 2 กลีบ','Gas exchange occurs in the alveoli. The right lung has three lobes; the left has two.']);
 const geo=new THREE.SphereGeometry(1,40,32),a=geo.attributes.position;
 for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i),z=a.getZ(i);let width=.78*(.82-.21*y);if(s===1 && x<-.15&&y<.2&&y>-.65)width*=.73;a.setXYZ(i,x*width,y*1.47,z*.63*(.92-.12*y));}geo.computeVertexNormals();
 p.group.add(new THREE.Mesh(geo,material(s===1?'#cf9295':'#da9a9b')));
 tube(p,[[-s*.53,.08,.38],[0,-.31,.57],[s*.48,-.59,.24]],.018,'#9a666d');
 if(s===-1)tube(p,[[s*.5,.11,.22],[0,.16,.6],[-s*.5,.24,.38]],.015,'#9a666d');
 lungParts.push(p);
 const bron=part('bronchus-'+s,'หลอดลมใหญ่'+side[0],side[1]+' main bronchus','respiratory',[0,13.2,.03]);
 bron.airPath=tube(bron,[[0,0,0],[s*.4,-.35,0],[s*.92,-.6,0]],.11,'#ddc5b5').curve;
 for(let j=0;j<4;j++)tube(bron,[[s*.65,-.48,0],[s*(.8+j*.09),-.15-j*.31,.05],[s*(1.16+j*.08),.05-j*.46,.1]],.04,'#e1c8ba');
 }
 const diaphragm=part('diaphragm','กะบังลม','Diaphragm','respiratory',[0,10.86,-.05],['หดตัวและเคลื่อนต่ำลงขณะหายใจเข้า ช่วยให้ช่องอกขยาย','Contracts and moves downward during inhalation, expanding the chest cavity.']);
 ell(diaphragm,[0,0,0],[1.6,.22,.78],'#b9686b');
 const heart=part('heart','หัวใจ','Heart','circulatory',[.31,12.1,.53],['กล้ามเนื้อหัวใจบีบตัวส่งเลือดไปปอดและทั่วร่างกาย มี 4 ห้อง','The heart pumps blood through pulmonary and systemic circulation. It has four chambers.']);
 ell(heart,[0,0,0],[.48,.7,.43],'#9d3543',-.28,.06);ell(heart,[-.25,.4,0],[.29,.27,.3],'#b24750');
 tube(heart,[[.15,.3,.38],[.12,0,.42],[.25,-.43,.22]],.032,'#e2a080');
 const aorta=part('aorta','หลอดเลือดแดงใหญ่','Aorta','circulatory',[0,12,.06],['นำเลือดจากหัวใจห้องล่างซ้ายไปเลี้ยงร่างกาย','Carries blood from the left ventricle to the systemic circulation.']);
 aorta.flowPaths=[{curve:tube(aorta,[[.35,.55,.1],[.4,1.05,0],[0,1.35,-.05],[-.3,.9,-.25],[-.25,-3.8,-.33]],.12,'#be3644').curve,direction:1,oxygenated:true,rate:.22,pulsatility:.55}];
 const vena=part('vena-cava','หลอดเลือดดำใหญ่','Venae cavae','circulatory',[-.19,11.9,-.02]);
 const svc=tube(vena,[[0,2.5,0],[0,1.25,0],[.08,.62,.1],[.22,.28,.25]],.12,'#526da6').curve;
 const ivc=tube(vena,[[0,-3.4,0],[0,-1.45,0],[.05,-.35,.08],[.22,.28,.25]],.12,'#526da6').curve;
 vena.flowPaths=[{curve:svc,direction:1,oxygenated:false,rate:.16,pulsatility:.12},{curve:ivc,direction:1,oxygenated:false,rate:.15,pulsatility:.08}];
 for(const s of [-1,1]){
 let p=part('pulmonary-artery-'+s,'หลอดเลือดแดงปอด'+(s===1?'ซ้าย':'ขวา'),(s===1?'Left':'Right')+' pulmonary artery','circulatory',[.1,12.7,.1]);
 p.flowPaths=[{curve:tube(p,[[0,0,0],[s*.4,.25,0],[s*.8,.1,-.1]],.08,'#526da6').curve,direction:1,oxygenated:false,rate:.2,pulsatility:.42}];
 p=part('pulmonary-vein-'+s,'หลอดเลือดดำปอด'+(s===1?'ซ้าย':'ขวา'),(s===1?'Left':'Right')+' pulmonary veins','circulatory',[.1,12.2,.1]);
 p.flowPaths=[{curve:tube(p,[[0,0,0],[s*.6,.1,-.1],[s*.8,.3,-.1]],.065,'#bf454c').curve,direction:-1,oxygenated:true,rate:.18,pulsatility:.1}];
 }
 function flowVessel(id,th,en,pos,pts,r,color,oxygenated,direction=1,rate=.17,pulsatility=.12,flowColor){
  const p=part(id,th,en,'circulatory',pos);p.flowPaths=[{curve:tube(p,pts,r,color).curve,direction,oxygenated,rate,pulsatility,color:flowColor}];return p;
 }
 for(const s of [-1,1]){
  const th=s===1?'ซ้าย':'ขวา',en=s===1?'Left':'Right';
  flowVessel('carotid-artery-'+s,'หลอดเลือดแดงคาโรติด'+th,en+' carotid artery',[0,13.15,.02],[[s*.12,0,0],[s*.18,.8,.02],[s*.26,2.0,.03],[s*.3,3.15,.05]],.052,'#c9404d',true,1,.2,.38);
  flowVessel('jugular-vein-'+s,'หลอดเลือดดำจูกูลาร์'+th,en+' jugular vein',[0,13.12,-.1],[[s*.42,3.1,0],[s*.38,2.0,0],[s*.3,.85,.02],[s*.15,0,.08]],.055,'#4e70ae',false,1,.16,.08);
  flowVessel('brachial-artery-'+s,'หลอดเลือดแดงแขน'+th,en+' brachial artery',[0,13.25,.12],[[s*.3,.05,0],[s*1.3,.35,0],[s*2.08,-.55,.02],[s*2.55,-2.0,.04],[s*2.9,-4.0,.05]],.048,'#c9404d',true,1,.19,.34);
  flowVessel('brachial-vein-'+s,'หลอดเลือดดำแขน'+th,en+' brachial vein',[0,13.18,-.05],[[s*2.82,-4.0,0],[s*2.5,-2.0,0],[s*2.0,-.58,0],[s*1.22,.25,.02],[s*.2,0,.06]],.052,'#4e70ae',false,1,.15,.07);
  flowVessel('renal-artery-'+s,'หลอดเลือดแดงไต'+th,en+' renal artery',[0,10.15,-.18],[[0,.18,.05],[s*.42,.12,0],[s*.82,0,-.18]],.046,'#c9404d',true,1,.19,.3);
  flowVessel('renal-vein-'+s,'หลอดเลือดดำไต'+th,en+' renal vein',[0,10.05,-.3],[[s*.82,.08,-.05],[s*.42,.12,0],[0,.18,.08]],.05,'#4e70ae',false,1,.15,.06);
  flowVessel('femoral-artery-'+s,'หลอดเลือดแดงขา'+th,en+' femoral artery',[0,8.25,.02],[[s*.18,.1,0],[s*.65,-.6,.02],[s*.75,-2.1,.08],[s*.7,-4.35,.08],[s*.7,-7.2,.18]],.055,'#c9404d',true,1,.18,.32);
  flowVessel('femoral-vein-'+s,'หลอดเลือดดำขา'+th,en+' femoral vein',[0,8.18,-.15],[[s*.78,-7.15,.02],[s*.76,-4.3,0],[s*.8,-2.0,0],[s*.7,-.55,.02],[s*.2,.12,.1]],.06,'#4e70ae',false,1,.145,.05);
 }
 flowVessel('hepatic-artery','หลอดเลือดแดงตับ','Hepatic artery',[0,10.72,.12],[[.05,.05,0],[-.28,.02,.08],[-.72,-.05,.18]],.045,'#c9404d',true,1,.18,.28);
 flowVessel('hepatic-vein','หลอดเลือดดำตับ','Hepatic vein',[-.52,10.68,-.12],[[-.18,0,.05],[.08,.04,0],[.52,.12,.02]],.05,'#4e70ae',false,1,.145,.05);
 flowVessel('portal-vein','หลอดเลือดดำพอร์ทัลตับ','Hepatic portal vein',[0,9.15,.2],[[.15,-.15,.12],[-.1,.25,.08],[-.34,.72,.03],[-.55,1.28,-.02]],.06,'#76559b',false,1,.12,.03,0xa876d6);
 const eso=part('esophagus','หลอดอาหาร','Esophagus','digestive',[0,12.8,-.23],['ลำเลียงอาหารไปยังกระเพาะด้วยการบีบตัวเป็นคลื่น','Moves swallowed food to the stomach by peristalsis.']);
 eso.foodPath=tube(eso,[[0,2.35,0],[0,0,0],[.15,-2.3,.25],[.5,-2.7,.42]],.09).curve;
 const liver=organ('liver','ตับ','Liver','digestive',[-.6,10.63,.32],[1.06,.49,.69],['สร้างน้ำดี แปรรูปสารอาหาร และช่วยกำจัดสารบางชนิดจากเลือด','Produces bile, processes nutrients and helps remove substances from blood.'],'#864447',-.13,.05);
 ell(liver,[.8,.04,0],[.61,.23,.45],'#8f4b49',-.13);
 const stomach=part('stomach','กระเพาะอาหาร','Stomach','digestive',[.7,10.27,.36],['คลุกเคล้าอาหารกับกรดและเอนไซม์เพื่อเริ่มย่อยโปรตีน','Mixes food with acid and enzymes to begin protein digestion.']);
 ell(stomach,[0,0,0],[.56,.69,.43],'#d28d86',-.32);tube(stomach,[[.08,-.3,0],[-.26,-.55,0],[-.61,-.5,.02]],.2,'#d28d86');
 organ('gallbladder','ถุงน้ำดี','Gallbladder','digestive',[-.68,10.15,.72],[.16,.29,.14],['เก็บและทำให้น้ำดีเข้มข้นก่อนปล่อยสู่ลำไส้เล็ก','Stores and concentrates bile before its release into the small intestine.'],'#738653',-.3);
 organ('pancreas','ตับอ่อน','Pancreas','digestive',[.18,9.94,-.05],[.78,.17,.23],['สร้างเอนไซม์ย่อยอาหาร และฮอร์โมน เช่น อินซูลิน','Produces digestive enzymes and hormones such as insulin.'],'#d5ab7b',.13,.10);
 organ('spleen','ม้าม','Spleen','lymphatic',[1.36,10.37,-.23],[.27,.49,.28],['กรองเลือดและมีบทบาทด้านภูมิคุ้มกัน','Filters blood and supports immune function.'],'#874d68',-.2);
 const small=part('small-intestine','ลำไส้เล็ก','Small intestine','digestive',[0,8.84,.4],['ย่อยอาหารต่อและดูดซึมสารอาหารส่วนใหญ่ การบีบตัวช่วยเคลื่อนอาหาร','Continues digestion and absorbs most nutrients. Peristalsis moves contents.']);
 const pts=[];for(let row=0;row<7;row++){for(let j=0;j<13;j++){const t=j/12;pts.push([((row%2)?1-t:t)*1.64-.82,.85-row*.25,.10*Math.sin(t*Math.PI*3+row)]);}}
 small.path=tube(small,pts,.105,'#d6a28c').curve;
 const large=part('large-intestine','ลำไส้ใหญ่','Large intestine','digestive',[0,8.9,.37],['ดูดซึมน้ำและเกลือแร่บางส่วน และรวมกากอาหารเป็นอุจจาระ','Absorbs water and some electrolytes and forms feces.']);
 const cp=[[-1,-.85,0],[-1.13,-.2,0],[-1.12,.85,0],[-.85,1.05,0],[0,1.02,.07],[.9,.96,0],[1.1,.6,0],[1.05,-.5,0],[.7,-.94,0],[.2,-1.08,-.02],[0,-1.4,0]];
 large.path=tube(large,cp,.18,'#bd8d79').curve;
 for(let i=0;i<34;i++){const q=large.path.getPoint(i/34);ell(large,q.toArray(),[.195,.16,.195],'#cda08b');}
 const appendix=part('appendix','ไส้ติ่ง','Vermiform appendix','digestive',[-1,8.03,.43]);tube(appendix,[[0,0,0],[.1,-.26,0],[.3,-.35,0]],.045,'#bc8d81');
 organ('rectum','ไส้ตรง','Rectum','digestive',[0,7.48,.13],[.17,.45,.17],['เก็บอุจจาระชั่วคราวก่อนการขับถ่าย','Temporarily stores feces before defecation.']);
 for(const s of [-1,1]){
 const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
 const kidney=organ('kidney-'+s,'ไต'+side[0],side[1]+' kidney','urinary',[s*.83,10.12+(s===1?.13:0),-.52],[.32,.56,.28],['กรองเลือดและปรับสมดุลน้ำ เกลือแร่ และกรด–ด่าง โดยสร้างปัสสาวะ','Filters blood and regulates fluid, electrolyte and acid–base balance by producing urine.'],'#9d4c4e',s*-.12,.08);
 ell(kidney,[-s*.16,0,.15],[.11,.27,.12],'#caa185');
 const ureter=part('ureter-'+s,'ท่อไต'+side[0],side[1]+' ureter','urinary',[s*.7,9.5,-.45]);ureter.urinePath=tube(ureter,[[0,.3,0],[-s*.1,-.9,0],[-s*.43,-1.85,.65]],.038,'#d8b7a0').curve;
 organ('adrenal-'+s,'ต่อมหมวกไต'+side[0],side[1]+' adrenal gland','endocrine',[s*.82,10.83,-.48],[.25,.13,.2],undefined,'#d8ae66');
 }
 organ('bladder','กระเพาะปัสสาวะ','Urinary bladder','urinary',[0,7.72,.64],[.38,.36,.3],['เก็บปัสสาวะก่อนขับออกทางท่อปัสสาวะ','Stores urine before release through the urethra.'],'#d0a68c');
 const urethra=part('urethra','ท่อปัสสาวะ','Urethra','urinary',[0,7.47,.64]);urethra.urinePath=tube(urethra,[[0,0,0],[0,-.54,0]],.05,'#d5b598').curve;
 for(const s of [-1,1])organ('thyroid-'+s,'ต่อมไทรอยด์ กลีบ'+(s===1?'ซ้าย':'ขวา'),'Thyroid '+(s===1?'left':'right')+' lobe','endocrine',[s*.18,14.68,.38],[.15,.25,.11],['ผลิตฮอร์โมนที่ช่วยควบคุมอัตราการเผาผลาญ','Produces hormones that regulate metabolic activity.'],'#bc705e',s*.25);
 organ('pituitary','ต่อมใต้สมอง','Pituitary gland','endocrine',[0,16.16,.15],[.09,.07,.08],undefined,'#d6a379');
 organ('pineal','ต่อมไพเนียล','Pineal gland','endocrine',[0,16.45,-.2],[.055,.055,.07],['ผลิตเมลาโทนินที่เกี่ยวข้องกับวงจรหลับ–ตื่น','Produces melatonin involved in sleep–wake timing.']);
 organ('thymus','ต่อมไทมัส','Thymus','lymphatic',[0,13.35,.54],[.31,.4,.16],['เป็นแหล่งพัฒนาของทีลิมโฟไซต์ มีขนาดลดลงเมื่ออายุมากขึ้น','Supports T-cell maturation and becomes smaller with age.'],'#c6a3a0');
 for(const s of [-1,1])for(const [region,th,y,x] of [['cervical','คอ',14.8,.41],['axillary','รักแร้',12.9,1.9],['inguinal','ขาหนีบ',7.7,.85]]){
 const p=part('nodes-'+region+s,'กลุ่มต่อมน้ำเหลือง'+th+(s===1?'ซ้าย':'ขวา'),(s===1?'Left ':'Right ')+region+' lymph nodes','lymphatic',[s*x,y,.2]);
 for(let i=0;i<4;i++)ell(p,[(i%2)*.08,i*.13,0],[.065,.08,.05],'#99a571');
 }
 // Female reproductive anatomy — simplified teaching geometry.
 organ('uterus','มดลูก','Uterus','reproductive',[0,7.85,.05],[.3,.39,.2],['เป็นอวัยวะกล้ามเนื้อที่รองรับการฝังตัวและการเจริญเติบโตของตัวอ่อนระหว่างตั้งครรภ์','A muscular organ supporting implantation and development during pregnancy.'],'#c77f91',0,.03,'female');
 organ('cervix','ปากมดลูก','Cervix','reproductive',[0,7.53,.08],[.16,.18,.14],['เป็นส่วนล่างแคบของมดลูกที่เปิดเข้าสู่ช่องคลอด และช่วยสร้างเมือกปากมดลูก','The narrow lower part of the uterus opening into the vagina and producing cervical mucus.'],'#ba7185',0,.02,'female');
 const vagina=part('vagina','ช่องคลอด','Vagina','reproductive',[0,7.38,.08],['เป็นทางเชื่อมจากปากมดลูกสู่ภายนอก และเป็นส่วนหนึ่งของทางคลอด','A canal connecting the cervix to the exterior and forming part of the birth canal.'],'female');tube(vagina,[[0,.08,0],[0,-.52,.12]],.11,'#bd8590');
 const vulva=part('vulva','อวัยวะเพศภายนอกหญิง','Vulva','reproductive',[0,6.82,.58],['ประกอบด้วยโครงสร้างภายนอกที่ช่วยปกป้องช่องเปิดของระบบสืบพันธุ์และทางเดินปัสสาวะ','External genital structures that help protect the openings of the reproductive and urinary tracts.'],'female');ell(vulva,[0,0,0],[.31,.23,.08],'#c99099');
 organ('clitoris','คลิตอริส','Clitoris','reproductive',[0,7.02,.72],[.07,.055,.06],['เป็นอวัยวะที่มีปลายประสาทหนาแน่นและมีบทบาทสำคัญด้านความรู้สึกทางเพศ','A highly innervated organ important in sexual sensation.'],'#d89aa4',0,.01,'female');
 for(const s of [-1,1]){
  organ('ovary-'+s,'รังไข่'+(s===1?'ซ้าย':'ขวา'),(s===1?'Left':'Right')+' ovary','reproductive',[s*.66,7.97,.02],[.16,.1,.11],['ผลิตเซลล์ไข่และฮอร์โมนเพศ','Produces oocytes and sex hormones.'],'#c79b9d',0,.03,'female');
  const ft=part('tube-'+s,'ท่อนำไข่'+(s===1?'ซ้าย':'ขวา'),(s===1?'Left':'Right')+' uterine tube','reproductive',[0,8.06,.02],['ลำเลียงเซลล์ไข่จากบริเวณรังไข่สู่มดลูก และเป็นตำแหน่งที่การปฏิสนธิมักเกิดขึ้น','Transports the oocyte toward the uterus and is a common site of fertilization.'],'female');tube(ft,[[s*.18,0,0],[s*.4,.18,0],[s*.66,.12,0],[s*.73,-.06,0]],.04,'#cc8a9a');
  organ('labium-majus-'+s,'แคมใหญ่'+(s===1?'ซ้าย':'ขวา'),(s===1?'Left':'Right')+' labium majus','reproductive',[s*.13,6.83,.68],[.08,.22,.06],['เป็นรอยพับผิวหนังภายนอกที่ช่วยปกป้องโครงสร้างบริเวณปากช่องคลอด','An outer skin fold that helps protect structures around the vaginal opening.'],'#c58f94',0,.01,'female');
  organ('labium-minus-'+s,'แคมเล็ก'+(s===1?'ซ้าย':'ขวา'),(s===1?'Left':'Right')+' labium minus','reproductive',[s*.07,6.86,.73],[.04,.17,.035],['เป็นรอยพับด้านในของอวัยวะเพศภายนอกหญิงที่ล้อมรอบบริเวณปากช่องคลอดและท่อปัสสาวะ','An inner fold of the vulva surrounding the vestibular openings.'],'#d6a0a3',0,.01,'female');
 }

 // Male reproductive anatomy — simplified teaching geometry.
 const scrotum=part('scrotum','ถุงอัณฑะ','Scrotum','reproductive',[0,6.66,.61],['เป็นถุงผิวหนังที่รองรับอัณฑะและช่วยควบคุมอุณหภูมิให้เหมาะต่อการสร้างอสุจิ','A skin sac supporting the testes and helping maintain a temperature suitable for sperm production.'],'male');ell(scrotum,[0,0,0],[.31,.34,.22],'#b98578');
 const penis=part('penis','องคชาต','Penis','reproductive',[0,7.05,.73],['เป็นอวัยวะภายนอกที่เป็นทางออกของปัสสาวะ และนำส่งน้ำอสุจิผ่านท่อปัสสาวะในระบบสืบพันธุ์ชาย','An external organ that carries urine and conveys semen through the urethra in the male reproductive system.'],'male');tube(penis,[[0,0,0],[0,-.08,.42],[0,-.12,.85]],.13,'#bd887c');ell(penis,[0,-.12,.92],[.17,.15,.16],'#c49386');
 organ('prostate','ต่อมลูกหมาก','Prostate','reproductive',[0,7.34,.5],[.23,.16,.2],['สร้างของเหลวส่วนหนึ่งของน้ำอสุจิ และล้อมรอบท่อปัสสาวะส่วนต้นใต้กระเพาะปัสสาวะ','Contributes fluid to semen and surrounds the proximal urethra below the bladder.'],'#bc8a7a',0,.03,'male');
 for(const s of [-1,1]){
  const sideTh=s===1?'ซ้าย':'ขวา',sideEn=s===1?'Left':'Right';
  organ('testis-'+s,'อัณฑะ'+sideTh,sideEn+' testis','reproductive',[s*.19,6.69,.62],[.14,.21,.14],['สร้างอสุจิและฮอร์โมนเทสโทสเตอโรน','Produces sperm and testosterone.'],'#c59c94',0,.03,'male');
  const epi=part('epididymis-'+s,'หลอดเก็บอสุจิ'+sideTh,sideEn+' epididymis','reproductive',[s*.3,6.72,.55],['เป็นท่อขดที่อสุจิเจริญสมบูรณ์และถูกเก็บชั่วคราวก่อนเข้าสู่ท่อนำอสุจิ','A coiled duct where sperm mature and are stored before entering the vas deferens.'],'male');tube(epi,[[0,.18,0],[s*.04,.05,.03],[0,-.18,.02]],.035,'#c7a58e');
  const vas=part('vas-deferens-'+s,'ท่อนำอสุจิ'+sideTh,sideEn+' vas deferens','reproductive',[s*.3,6.86,.5],['ลำเลียงอสุจิจากหลอดเก็บอสุจิเข้าสู่ช่องเชิงกรานและไปยังท่อหลั่ง','Transports sperm from the epididymis into the pelvis toward the ejaculatory duct.'],'male');tube(vas,[[0,0,0],[s*.06,.45,-.08],[s*.08,.9,-.18],[-s*.12,1.25,-.23]],.035,'#caa78e');
  organ('seminal-vesicle-'+s,'ถุงน้ำเชื้อ'+sideTh,sideEn+' seminal vesicle','reproductive',[s*.24,7.62,.25],[.12,.19,.1],['สร้างของเหลวที่มีสารอาหารและเป็นส่วนสำคัญของน้ำอสุจิ','Produces nutrient-rich fluid that forms a major component of semen.'],'#c9a178',s*.18,.05,'male');
  const ej=part('ejaculatory-duct-'+s,'ท่อหลั่ง'+sideTh,sideEn+' ejaculatory duct','reproductive',[s*.18,7.5,.36],['ลำเลียงอสุจิและของเหลวจากถุงน้ำเชื้อผ่านต่อมลูกหมากเข้าสู่ท่อปัสสาวะ','Carries sperm and seminal-vesicle fluid through the prostate toward the urethra.'],'male');tube(ej,[[0,.08,-.08],[-s*.08,-.12,.08],[-s*.16,-.28,.16]],.025,'#c6a38d');
  organ('bulbourethral-'+s,'ต่อมคาวเปอร์'+sideTh,sideEn+' bulbourethral gland','reproductive',[s*.12,7.1,.46],[.055,.055,.05],['หลั่งของเหลวใสช่วยหล่อลื่นและปรับสภาพท่อปัสสาวะก่อนการหลั่ง','Releases a clear secretion that lubricates and conditions the urethra before ejaculation.'],'#caa270',0,.01,'male');
 }
 for(const s of [-1,1]){
 const side=s===1?['ซ้าย','Left']:['ขวา','Right'];
 const eye=organ('eye-'+s,'ลูกตา'+side[0],side[1]+' eye','sensory',[s*.36,16.42,.59],[.19,.19,.19],['รับแสง โดยจอตาเปลี่ยนแสงเป็นสัญญาณประสาท','Detects light; the retina converts it into neural signals.'],'#ece8dd',0,0);
 ell(eye,[0,0,.17],[.092,.092,.028],'#6c867c');ell(eye,[0,0,.194],[.043,.043,.014],'#1c2526');
 organ('ear-'+s,'ใบหู'+side[0],side[1]+' auricle','sensory',[s*.86,16.32,0],[.12,.31,.19],['รวบรวมเสียงเข้าสู่ช่องหู','Collects sound into the ear canal.'],'#c99883');
 }
 organ('tongue','ลิ้น','Tongue','digestive',[0,15.91,.53],[.25,.09,.27],['ช่วยเคลื่อนอาหาร กลืน รับรส และออกเสียง','Helps manipulate food, swallow, taste and articulate speech.'],'#bf7c81');
 organ('nasal-cavity','โพรงจมูก','Nasal cavity','respiratory',[0,16.38,.39],[.18,.22,.29],['ช่วยกรอง อุ่น และเพิ่มความชื้นของอากาศ','Filters, warms and humidifies inhaled air.']);
 // Skeleton: separate selectable major bones, ribs and vertebrae.
 const bone='#e1d5bb';
 const skull=part('skull','กะโหลกศีรษะ','Cranium','skeletal',[0,16.62,-.05]);
 const sg=new THREE.SphereGeometry(1,32,24);const sm=new THREE.Mesh(sg,material(bone));sm.scale.set(.9,.99,.77);skull.group.add(sm);
 const jaw=part('mandible','ขากรรไกรล่าง','Mandible','skeletal',[0,15.78,.28]);tube(jaw,[[-.62,.3,-.16],[-.53,-.02,.17],[0,-.2,.35],[.53,-.02,.17],[.62,.3,-.16]],.095,bone);
 for(let i=0;i<24;i++){const kind=i<7?'C':i<19?'T':'L',n=i<7?i+1:i<19?i-6:i-18;organ('vertebra-'+kind+n,'กระดูกสันหลัง '+kind+n,'Vertebra '+kind+n,'skeletal',[0,15.23-i*.285,-.65],[.23,.12,.2],undefined,bone,0,.01);}
 organ('sacrum','กระดูกกระเบนเหน็บ','Sacrum','skeletal',[0,7.98,-.52],[.35,.52,.18],undefined,bone);
 organ('coccyx','กระดูกก้นกบ','Coccyx','skeletal',[0,7.41,-.44],[.1,.2,.09],undefined,bone);
 for(const s of [-1,1]){
 const st=s===1?'ซ้าย':'ขวา',se=s===1?'Left':'Right';
 for(let i=0;i<12;i++){const y=13.85-i*.25,w=.74+Math.sin((i+1)/13*Math.PI)*.88;const p=part('rib-'+s+'-'+(i+1),'ซี่โครง'+st+' คู่ที่ '+(i+1),se+' rib '+(i+1),'skeletal',[0,y,0]);tube(p,[[s*.18,.1,-.67],[s*w,.03,-.35],[s*(w+.06),-.13,.25],[s*w*.72,-.23,.7],[s*(i>9?.65:.16),-.33,.75]],.045,bone);}
 const clav=part('clavicle-'+s,'กระดูกไหปลาร้า'+st,se+' clavicle','skeletal',[0,14,.32]);tube(clav,[[s*.12,0,.18],[s*.8,.1,.1],[s*1.8,0,-.1]],.085,bone);
 organ('scapula-'+s,'กระดูกสะบัก'+st,se+' scapula','skeletal',[s*1.11,13.25,-.62],[.52,.69,.11],undefined,bone,s*-.15);
 const pelvis=part('hip-'+s,'กระดูกสะโพก'+st,se+' hip bone','skeletal',[s*.65,8.05,-.17]);ell(pelvis,[0,.25,-.12],[.58,.65,.19],bone,s*-.27);tube(pelvis,[[s*.15,.15,.03],[s*.35,-.4,.18],[0,-.75,.27],[-s*.43,-.68,.4],[-s*.45,-.25,.35]],.115,bone);
 function long(id,th,en,a,b,r){const p=part(id+s,th+st,se+' '+en,'skeletal',a);const v=b.map((q,i)=>q-a[i]);tube(p,[[0,0,0],v],r,bone);ell(p,[0,0,0],[r*1.7,r*1.7,r*1.7],bone);ell(p,v,[r*1.65,r*1.65,r*1.65],bone);}
 long('humerus-','กระดูกต้นแขน','humerus',[s*1.89,13.83,0],[s*2.6,11.19,0],.14);
 long('radius-','กระดูกเรเดียส','radius',[s*2.66,11.12,.05],[s*2.97,9.12,.07],.075);
 long('ulna-','กระดูกอัลนา','ulna',[s*2.48,11.12,-.04],[s*2.8,9.12,-.02],.074);
 long('femur-','กระดูกต้นขา','femur',[s*.79,7.78,0],[s*.68,4.54,0],.185);
 organ('patella-'+s,'กระดูกสะบ้า'+st,se+' patella','skeletal',[s*.68,4.5,.22],[.2,.24,.1],undefined,bone);
 long('tibia-','กระดูกหน้าแข้ง','tibia',[s*.67,4.36,0],[s*.67,.97,0],.13);
 long('fibula-','กระดูกน่อง','fibula',[s*.9,4.32,-.04],[s*.9,.98,-.03],.06);
 for(let i=0;i<8;i++)organ('carpal-'+s+'-'+i,'กระดูกข้อมือ'+st+' '+(i+1),se+' carpal '+(i+1),'skeletal',[s*(2.8+(i%4)*.09),8.97-Math.floor(i/4)*.12,.02],[.059,.065,.06],undefined,bone);
 for(let finger=0;finger<5;finger++){
 const x=s*(2.72+finger*.13),len=finger===0?.42:.62;
 long('metacarpal-'+finger+'-','กระดูกฝ่ามือ นิ้ว '+(finger+1)+' ','metacarpal '+(finger+1),[x,8.81,.02],[x+s*.04,8.36,.04],.035);
 const count=finger===0?2:3;for(let j=0;j<count;j++)long('hand-phalanx-'+finger+'-'+j+'-','กระดูกนิ้วมือ '+(finger+1)+' ท่อน '+(j+1)+' ','hand phalanx '+(finger+1)+'.'+(j+1),[x+s*.04,8.31-j*len/count,.04],[x+s*.06,8.34-(j+1)*len/count,.07],.027);
 }
 for(let i=0;i<7;i++)organ('tarsal-'+s+'-'+i,'กระดูกข้อเท้า'+st+' '+(i+1),se+' tarsal '+(i+1),'skeletal',[s*(.57+(i%3)*.13),.71-Math.floor(i/3)*.09,-.15+Math.floor(i/3)*.18],[.1,.1,.13],undefined,bone);
 for(let toe=0;toe<5;toe++){
 const x=s*(.44+toe*.12);long('metatarsal-'+toe+'-','กระดูกฝ่าเท้า นิ้ว '+(toe+1)+' ','metatarsal '+(toe+1),[x,.49,.22],[x,.4,.73],.042);
 for(let j=0;j<(toe===0?2:3);j++)long('foot-phalanx-'+toe+'-'+j+'-','กระดูกนิ้วเท้า '+(toe+1)+' ท่อน '+(j+1)+' ','toe phalanx '+(toe+1)+'.'+(j+1),[x,.37,.78+j*.11],[x,.34,.87+j*.11],.031);
 }
 }
 const stern=part('sternum','กระดูกอก','Sternum','skeletal',[0,12.72,.8]);ell(stern,[0,0,0],[.14,.85,.065],bone);
 // Major muscle groups are intentionally simplified.
 for(const s of [-1,1]){
 const st=s===1?'ซ้าย':'ขวา',se=s===1?'Left':'Right';
 for(const [id,th,en,pos,scale,rot] of [
 ['deltoid','กล้ามเนื้อเดลทอยด์','deltoid',[s*1.91,13.63,0],[.4,.55,.4],s*-.22],
 ['pectoralis','กล้ามเนื้อหน้าอกใหญ่','pectoralis major',[s*.84,13.05,.74],[.79,.53,.17],s*.1],
 ['biceps','กล้ามเนื้อไบเซ็ปส์','biceps brachii',[s*2.22,12.36,.16],[.25,.85,.26],s*-.25],
 ['triceps','กล้ามเนื้อไตรเซ็ปส์','triceps brachii',[s*2.22,12.37,-.22],[.26,.89,.23],s*-.25],
 ['forearm-flexors','กลุ่มกล้ามเนื้องอปลายแขน','forearm flexors',[s*2.76,10.29,.13],[.22,.86,.21],s*-.12],
 ['rectus','กล้ามเนื้อหน้าท้องตรง','rectus abdominis',[s*.35,10.21,.87],[.3,1.38,.16],0],
 ['oblique','กล้ามเนื้อหน้าท้องด้านข้าง','external oblique',[s*1.21,10.11,.41],[.3,1.45,.36],s*-.1],
 ['trapezius','กล้ามเนื้อทราพีเซียส','trapezius',[s*.62,13.37,-.8],[.72,1.11,.17],s*.2],
 ['latissimus','กล้ามเนื้อหลังแผ่นกว้าง','latissimus dorsi',[s*.84,11.4,-.81],[.71,1.4,.17],s*-.2],
 ['gluteus','กล้ามเนื้อก้นใหญ่','gluteus maximus',[s*.64,7.52,-.48],[.59,.61,.43],0],
 ['quadriceps','กลุ่มกล้ามเนื้อต้นขาด้านหน้า','quadriceps',[s*.77,6.25,.2],[.42,1.29,.38],0],
 ['hamstrings','กลุ่มกล้ามเนื้อต้นขาด้านหลัง','hamstrings',[s*.76,6.2,-.3],[.35,1.3,.3],0],
 ['gastrocnemius','กล้ามเนื้อน่อง','gastrocnemius',[s*.76,3.29,-.2],[.31,.93,.33],0],
 ['tibialis','กล้ามเนื้อหน้าแข้งด้านหน้า','tibialis anterior',[s*.68,2.75,.18],[.2,1.22,.18],0]
 ])organ(id+'-'+s,th+st,se+' '+en,'muscular',pos,scale,undefined,'#a94d50',rot,.015);
 }
 const skin=part('skin','ผิวหนังและขอบเขตร่างกาย','Skin and body envelope','integumentary',[0,0,0]);
 ell(skin,[0,16.55,-.04],[.97,1.19,.84],'#c99880');
 ell(skin,[0,14.85,-.04],[.42,.7,.4],'#c99880');
 ell(skin,[0,12.17,-.05],[1.94,2.23,.95],'#c99880');
 ell(skin,[0,9.75,-.01],[1.46,1.51,.81],'#c99880');
 ell(skin,[0,7.99,-.01],[1.34,1.02,.77],'#c99880');
 for(const s of [-1,1]){
 ell(skin,[s*2.13,12.66,0],[.45,1.58,.45],'#c99880',s*-.27);
 ell(skin,[s*2.74,10.29,0],[.3,1.2,.31],'#c99880',s*-.13);
 ell(skin,[s*2.96,8.43,.03],[.34,.61,.17],'#c99880');
 ell(skin,[s*.77,6.19,0],[.59,1.79,.6],'#c99880');
 ell(skin,[s*.73,2.75,-.03],[.4,1.77,.4],'#c99880');
 ell(skin,[s*.73,.47,.29],[.39,.28,.71],'#c99880');
 }

 // Detailed structures are shown only when the parent is opened.
 const sub=(id,th,en,sys,pos,scale,parent,desc,color)=>{
 const p=organ(id,th,en,sys,pos,scale,desc,color,0,.01);p.parent=parent;return p;
 };
 sub('right-atrium','หัวใจห้องบนขวา','Right atrium','circulatory',[.08,12.4,.52],[.21,.23,.23],'heart',['รับเลือดจากร่างกายผ่านหลอดเลือดดำใหญ่','Receives systemic venous blood through the venae cavae.'],'#8b6476');
 sub('left-atrium','หัวใจห้องบนซ้าย','Left atrium','circulatory',[.55,12.42,.26],[.21,.23,.23],'heart',['รับเลือดจากปอดผ่านหลอดเลือดดำปอด','Receives oxygenated blood from the pulmonary veins.'],'#b55c62');
 sub('right-ventricle','หัวใจห้องล่างขวา','Right ventricle','circulatory',[.13,11.98,.67],[.23,.4,.23],'heart',['ส่งเลือดไปปอดผ่านหลอดเลือดแดงปอด','Pumps blood into the pulmonary arteries toward the lungs.'],'#87516c');
 sub('left-ventricle','หัวใจห้องล่างซ้าย','Left ventricle','circulatory',[.57,11.93,.4],[.24,.43,.23],'heart',['ส่งเลือดไปทั่วร่างกายผ่านหลอดเลือดแดงใหญ่','Pumps blood into the aorta for systemic circulation.'],'#ac404c');
 for(const [id,th,en,pos] of [
 ['tricuspid','ลิ้นไตรคัสปิด','Tricuspid valve',[.12,12.19,.61]],
 ['mitral','ลิ้นไมทรัล','Mitral valve',[.56,12.16,.35]],
 ['pulmonary-valve','ลิ้นพัลโมนารี','Pulmonary valve',[.34,12.7,.5]],
 ['aortic-valve','ลิ้นเอออร์ติก','Aortic valve',[.45,12.58,.33]]
 ]){const p=part(id,th,en,'circulatory',pos,['เปิดให้เลือดไหลไปข้างหน้าและปิดเพื่อป้องกันเลือดไหลย้อน','Opens for forward blood flow and closes to prevent backflow.']);p.parent='heart';const m=new THREE.Mesh(new THREE.TorusGeometry(.13,.025,8,32),material('#d3bd9e'));m.rotation.x=Math.PI/2;p.group.add(m);}
 for(const [id,th,en,parent,pos,scale] of [
 ['right-upper-lobe','ปอดขวากลีบบน','Right superior lung lobe','lung-right',[-.92,13.03,.01],[.56,.84,.5]],
 ['right-middle-lobe','ปอดขวากลีบกลาง','Right middle lung lobe','lung-right',[-.92,12.25,.35],[.57,.42,.37]],
 ['right-lower-lobe','ปอดขวากลีบล่าง','Right inferior lung lobe','lung-right',[-.92,11.9,-.13],[.62,.8,.52]],
 ['left-upper-lobe','ปอดซ้ายกลีบบน','Left superior lung lobe','lung-left',[.92,13.01,.1],[.55,.9,.5]],
 ['left-lower-lobe','ปอดซ้ายกลีบล่าง','Left inferior lung lobe','lung-left',[.92,11.99,-.12],[.61,.84,.5]]
 ])sub(id,th,en,'respiratory',pos,scale,parent,['กลีบปอดประกอบด้วยหลอดลมฝอยและถุงลมที่ทำหน้าที่แลกเปลี่ยนแก๊ส','A lung lobe contains bronchioles and alveoli involved in gas exchange.'],'#d5a3a2');
 for(const [id,th,en,pos,scale,desc] of [
 ['duodenum','ลำไส้เล็กส่วนต้น','Duodenum',[-.25,9.5,.36],[.45,.32,.18],['รับอาหารจากกระเพาะ น้ำดี และน้ำย่อยจากตับอ่อน','Receives stomach contents, bile and pancreatic secretions.']],
 ['jejunum','ลำไส้เล็กส่วนกลาง','Jejunum',[.14,9.08,.4],[.72,.42,.2],['เป็นบริเวณสำคัญในการดูดซึมสารอาหาร','An important site of nutrient absorption.']],
 ['ileum','ลำไส้เล็กส่วนปลาย','Ileum',[-.1,8.4,.4],[.74,.35,.2],['ดูดซึมสารอาหารต่อ รวมถึงวิตามินบี 12 และเกลือน้ำดี','Continues absorption, including vitamin B12 and bile salts.']]
 ])sub(id,th,en,'digestive',pos,scale,'small-intestine',desc,'#cca18b');


 const carpals=[['สแคฟฟอยด์','scaphoid'],['ลูเนต','lunate'],['ไตรควีทรัม','triquetrum'],['พิสิฟอร์ม','pisiform'],['ทราพีเซียม','trapezium'],['ทราพีซอยด์','trapezoid'],['แคพิเทต','capitate'],['ฮาเมต','hamate']];
 const tarsals=[['ทาลัส','talus'],['ส้นเท้า','calcaneus'],['นาวิคิวลาร์','navicular'],['คิวบอยด์','cuboid'],['คูนิฟอร์มด้านใน','medial cuneiform'],['คูนิฟอร์มตรงกลาง','intermediate cuneiform'],['คูนิฟอร์มด้านนอก','lateral cuneiform']];
 for(const p of parts){
 const match=p.id.match(/^(carpal|tarsal)-(-?1)-(\d+)$/);if(!match)continue;
 const [,type,s,index]=match,[th,en]=(type==='carpal'?carpals:tarsals)[Number(index)];
 p.th='กระดูก'+th+(s==='1'?'ซ้าย':'ขวา');p.en=(s==='1'?'Left ':'Right ')+en;
 p.desc=[type==='carpal'?'เป็นกระดูกข้อมือ ช่วยให้ข้อมือเคลื่อนไหวและถ่ายทอดแรงระหว่างมือกับปลายแขน':'เป็นกระดูกบริเวณข้อเท้าหรือส่วนหลังของเท้า ช่วยรับน้ำหนักและถ่ายทอดแรงขณะเดิน',type==='carpal'?'A carpal bone contributing to wrist movement and force transmission.':'A tarsal bone contributing to weight support and force transmission in the foot.'];
 }

 extendAnatomyV13(root,parts,systems);
 extendAnatomyV14(root,parts,systems);
 enrichAnatomyParts(parts);
 for(const p of parts)p.group.traverse(o=>{if(o.isMesh){o.userData.partId=p.id;o.material.userData.baseColor=o.material.color.clone();}});
 return {root,parts};
}
