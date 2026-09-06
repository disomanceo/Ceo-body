import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildAnatomy,systems} from './anatomy.js';
import {partHasSystem,partSystems,teachingField} from './anatomy-schema.js';
import './style.css';
import {loadDetailedModels} from './detailed-models.js';
import {bloodFlowProgress,breathingState,heartScale,intestinalRadiusScale,intestinalTubeScale} from './physiology.js';
import {isPointerClick,sphereFitDistance,viewMoveStep} from './view-utils.js';
import {getLesson,lessonOrder,lessons,lessonStepAt} from './lesson-data.js';
import {createQuiz,quizLength} from './quiz-data.js';
import {attemptPercent,bestAttempt,resultsCsv,summarizeHistories} from './results-utils.js';
import {initVisitorCounter,renderVisitorCounter} from './visitor-counter.js';

let saved;try{saved=JSON.parse(localStorage.getItem('ceo-body-preferences')||'null');}catch{saved=null;}
const state={lang:saved?.lang==='en'?'en':'th',mode:'solid',system:'all',query:'',selected:'heart',hidden:new Set(),isolated:false,explode:0,playing:false,heart:true,blood:true,lungs:true,gut:true,air:false,urine:false,signal:false,lymph:false,speed:1,labels:true,sex:'female',quality:saved?.quality||'high',interaction:'rotate',lesson:null,lessonChoice:'circulation',lessonStep:0,lessonReturn:null,presentation:false,presentationNextAt:0,quiz:null};
const simulationKeys=['heart','blood','lungs','gut','air','urine','signal','lymph'];
const tr=(th,en)=>state.lang==='th'?th:en;
const title=p=>state.lang==='th'?p.th:p.en;
const $=s=>document.querySelector(s);
let openedParent=null,cutaway=false,modelLoading=true,modelFailures=0;
const clipPlane=new THREE.Plane(new THREE.Vector3(0,0,-1),0);
const app=$('#app');
app.innerHTML=`<header class="compact-header"><div class="developer-cluster"><a class="ceo-mini-brand" href="./" aria-label="Ceo-body"><span class="ceo-mini-icon">C<span>✦</span></span><span class="ceo-mini-word">Ceo<span>-body</span></span></a><div class="developer-credit" aria-label="ผู้พัฒนา"><strong>พัฒนาโดย ผอ.สุธน พุทธรัตน์</strong><span>ผู้อำนวยการโรงเรียนวัดไผ่มุ้ง</span><span id="visitorCounter" class="visitor-counter">◉ ผู้เข้าชม —</span></div></div><div class="school-header-brand" aria-label="สื่อการสอนกายวิภาคแบบโต้ตอบ ของโรงเรียนวัดไผ่มุ้ง"><img src="./school-logo.webp" alt="ตราโรงเรียนวัดไผ่มุ้ง"><div class="school-header-copy"><strong id="schoolHeaderTitle">สื่อการสอนกายวิภาคแบบโต้ตอบ</strong><span id="schoolHeaderSchool">ของโรงเรียนวัดไผ่มุ้ง</span></div></div><div class="header-actions"><button id="resultsButton"></button><button id="quality"></button><div class="language"><button id="th">ไทย</button><button id="en">EN</button></div></div></header>
<main><aside class="sidebar"><div class="side-top"><div class="eyebrow">ANATOMY LIBRARY</div><h1 id="libraryTitle"></h1><input id="search" type="search" autocomplete="off"><div class="system-select"><select id="system"></select></div><div class="list-actions"><button id="showAll"></button><span id="count"></span></div></div><div id="partList"></div><div class="side-footer" id="sideFooter"></div></aside>
<section class="workspace"><div class="view-toolbar"><div class="segmented" id="modes"></div><button id="reset"></button></div><div id="viewport"><div id="loading" role="status"></div><div id="modelStatus" role="status"></div><canvas id="scene" aria-label="Interactive 3D human anatomy" tabindex="0"></canvas><div id="labels"></div><div class="orientation" id="orientation"></div><div class="scene-heading"><span class="eyebrow" id="sceneEyebrow"></span><h2 id="sceneTitle"></h2><p id="sceneSub"></p></div><div class="view-cameras"><button data-view="front"></button><button data-view="back"></button><button data-view="side"></button><button id="full">⛶</button></div><div class="navigation-pad"><div class="nav-mode"><button id="rotateMode" aria-pressed="true">↻ <span id="rotateModeText"></span></button><button id="moveMode" aria-pressed="false">✥ <span id="moveModeText"></span></button></div><select id="bodyRegion" aria-label="Jump to body region"></select><div class="nav-cross"><button data-pan="up" aria-label="Move view up">↑</button><button data-pan="left" aria-label="Move view left">←</button><button id="recenter" aria-label="Recenter view">◎</button><button data-pan="right" aria-label="Move view right">→</button><button data-pan="down" aria-label="Move view down">↓</button></div></div><section id="lessonPanel" class="lesson-panel" hidden><div class="lesson-top"><span id="lessonProgress"></span><div class="lesson-top-actions"><button id="lessonAuto" aria-label="Auto presentation">▶</button><button id="lessonSpeak" aria-label="Read lesson aloud">🔊</button><button id="lessonClose" aria-label="Close lesson">×</button></div></div><h3 id="lessonTitle"></h3><p id="lessonBody"></p><div id="lessonDots" class="lesson-dots"></div><div class="lesson-actions"><button id="lessonPrev"></button><button id="lessonQuiz"></button><button id="lessonNext" class="primary"></button></div></section><section id="quizPanel" class="quiz-panel" hidden><div class="quiz-top"><span id="quizProgress"></span><button id="quizClose">×</button></div><h3 id="quizTitle"></h3><p id="quizQuestion"></p><div id="quizOptions" class="quiz-options"></div><div id="quizFeedback" class="quiz-feedback"></div><div class="quiz-actions"><button id="quizNext" class="primary"></button></div></section><div class="scene-hint" id="sceneHint"></div><div class="anatomy-note" id="anatomyNote"></div></div><div class="bottom-controls"><div class="explode-row"><label for="explode" id="explodeLabel"></label><input id="explode" type="range" min="0" max="100" value="0"><output id="explodeValue">0%</output><button id="labelsToggle"></button></div><div class="simulation-row"><button id="play" class="play-button"></button><select id="lessonSelect" class="lesson-select" aria-label="Lesson"></select><button id="lessonStart" class="lesson-button"></button><span class="sim-label" id="simulationLabel"></span><label class="sim-chip"><input type="checkbox" id="heart" checked><span id="heartText"></span></label><label class="sim-chip"><input type="checkbox" id="blood" checked><span id="bloodText"></span></label><label class="sim-chip"><input type="checkbox" id="lungs" checked><span id="lungsText"></span></label><label class="sim-chip"><input type="checkbox" id="gut" checked><span id="gutText"></span></label><label class="sim-chip"><input type="checkbox" id="air"><span id="airText"></span></label><label class="sim-chip"><input type="checkbox" id="urine"><span id="urineText"></span></label><label class="sim-chip"><input type="checkbox" id="signal"><span id="signalText"></span></label><label class="sim-chip"><input type="checkbox" id="lymph"><span id="lymphText"></span></label><select id="speed" aria-label="Animation speed"><option value=".5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></div></div></section>
<aside class="inspector"><div class="eyebrow" id="detailEyebrow"></div><div id="organBadge"></div><h2 id="organName"></h2><p id="organAlt"></p><span id="organSystem"></span><div class="detail-divider"></div><h3 id="functionHeading"></h3><p id="organFunction"></p><div class="teaching-meta"><h3 id="locationHeading"></h3><p id="organLocation"></p><h3 id="relationsHeading"></h3><p id="organRelations"></p><h3 id="clinicalHeading"></h3><p id="organClinical"></p></div><div class="organ-actions"><button id="isolate" class="primary"></button><button id="hide"></button><button id="focus"></button><button id="detailsButton"></button><button id="cutaway"></button></div><div class="detail-divider"></div><h3 id="layersHeading"></h3><label class="setting"><span id="skinText"></span><input id="skin" type="checkbox" checked></label><label class="setting"><span id="bonesText"></span><input id="bones" type="checkbox" checked></label><label class="setting"><span id="musclesText"></span><input id="muscles" type="checkbox"></label><label class="setting"><span id="sexText"></span><select id="sex"><option value="female"></option><option value="male"></option></select></label><div class="detail-divider"></div><div class="simulation-info"><span class="pulse-dot"></span><strong id="simulationStatus"></strong><p id="simulationInfo"></p></div><details><summary id="aboutHeading"></summary><p id="aboutText"></p><a href="https://openstax.org/details/books/anatomy-and-physiology-2e" target="_blank" rel="noopener noreferrer">OpenStax · Anatomy & Physiology 2e ↗</a></details></aside></main><section id="resultsPanel" class="results-panel" hidden><div class="results-card"><div class="results-head"><div><span class="eyebrow">CLASSROOM RESULTS</span><h2 id="resultsTitle"></h2></div><button id="resultsClose">×</button></div><div id="resultsSummary" class="results-summary"></div><div id="resultsTable" class="results-table"></div><div class="results-actions"><button id="resultsExport"></button><button id="resultsReset"></button></div></div></section><div id="toast" role="status"></div>`;

let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:$('#scene'),antialias:true,alpha:true,powerPreference:'high-performance'});}
catch(error){$('#loading').textContent=tr('ไม่สามารถเปิดภาพ 3 มิติได้ กรุณาเปิดการเร่งกราฟิกในเบราว์เซอร์แล้วลองใหม่','3D unavailable. Enable browser graphics acceleration and reload.');throw error;}
renderer.localClippingEnabled=true;
renderer.setPixelRatio(Math.min(devicePixelRatio,state.quality==='low'?1:2));
renderer.setClearColor(0x0c1724,1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.4;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.05,150);
camera.position.set(0,10,31);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,9,0);controls.enableDamping=true;controls.dampingFactor=.085;controls.rotateSpeed=.52;controls.zoomSpeed=.7;controls.panSpeed=.7;controls.enablePan=true;controls.screenSpacePanning=true;controls.zoomToCursor=false;controls.minDistance=1;controls.maxDistance=55;controls.minPolarAngle=Math.PI*.04;controls.maxPolarAngle=Math.PI*.96;controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;controls.mouseButtons.MIDDLE=THREE.MOUSE.DOLLY;controls.mouseButtons.RIGHT=THREE.MOUSE.PAN;controls.touches.ONE=THREE.TOUCH.ROTATE;controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
scene.add(new THREE.HemisphereLight(0xc5e4ff,0x735353,2.1));
for(const [color,intensity,pos] of [[0xffe1c6,3,[7,18,12]],[0x9cc8ff,2,[-8,10,5]],[0xc5d9ff,2,[1,15,-8]]]){const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);}
const {root,parts}=buildAnatomy();scene.add(root);const byId=new Map(parts.map(p=>[p.id,p]));
const floor=new THREE.Mesh(new THREE.CircleGeometry(5.1,80),new THREE.MeshBasicMaterial({color:0x132534,transparent:true,opacity:.7,side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.y=.03;scene.add(floor);
const ring=new THREE.Mesh(new THREE.RingGeometry(4.85,4.87,100),new THREE.MeshBasicMaterial({color:0x37717d,transparent:true,opacity:.5,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;scene.add(ring);
const labelPool=[];
const important=['brain','lung-left','lung-right','heart','liver','stomach','small-intestine','large-intestine','bladder','kidney-1'];
for(const id of important){const el=document.createElement('button');el.className='model-label';el.onclick=()=>select(id);$('#labels').append(el);labelPool.push({id,el});}
const selectedLabel=document.createElement('button');selectedLabel.className='model-label selected-label';$('#labels').append(selectedLabel);
const flowDots=[];for(const id of ['esophagus','small-intestine','large-intestine']){const p=byId.get(id),path=p?.foodPath||p?.path;if(!path)continue;for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshBasicMaterial({color:0xf6d66b}));p.group.add(m);m.visible=false;flowDots.push({mesh:m,p,path,phase:i/5});}}
const airDots=[];for(const p of parts.filter(p=>p.airPath))for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.052,9,7),new THREE.MeshBasicMaterial({color:0x9ee9ff,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));p.group.add(m);m.visible=false;airDots.push({mesh:m,p,path:p.airPath,phase:i/5});}
const urineDots=[];for(const p of parts.filter(p=>p.urinePath))for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.05,9,7),new THREE.MeshBasicMaterial({color:0xf2d65c,transparent:true,opacity:.9,depthWrite:false}));p.group.add(m);m.visible=false;urineDots.push({mesh:m,p,path:p.urinePath,phase:i/4});}
const signalDots=[];for(const p of parts.filter(p=>p.signalPath))for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:0x9af5c9,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending}));p.group.add(m);m.visible=false;signalDots.push({mesh:m,p,path:p.signalPath,phase:i/7});}
const lymphDots=[];for(const p of parts.filter(p=>p.lymphPath))for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:0xb7d67f,transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending}));p.group.add(m);m.visible=false;lymphDots.push({mesh:m,p,path:p.lymphPath,phase:i/5});}
const bloodDots=[];
for(const p of parts.filter(p=>p.flowPaths))for(const stream of p.flowPaths)for(let i=0;i<7;i++){
 const material=new THREE.MeshBasicMaterial({color:stream.color??(stream.oxygenated?0xff5864:0x4b7dff),transparent:true,opacity:.92,depthWrite:false,blending:THREE.AdditiveBlending});
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),material);mesh.visible=false;p.group.add(mesh);
 bloodDots.push({mesh,p,stream,phase:i/7});
}
let elapsed=0,last=performance.now(),cameraTween=null;
function selected(){return byId.get(state.selected);}
function currentLesson(){return state.lesson?getLesson(state.lesson):null;}
function currentLessonStep(){return state.lesson?lessonStepAt(state.lesson,state.lessonStep):null;}
function activeLessonIds(){return new Set(currentLessonStep()?.parts||[]);}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),2200);}
function allowed(p){return (!p.variant||p.variant===state.sex)&&!state.hidden.has(p.id);}
function visible(p){
 if(!allowed(p))return false;
 if(currentLesson()){
  const active=activeLessonIds(),lesson=currentLesson();
  if(p.parent&&!active.has(p.id))return false;
  return partHasSystem(p,lesson.system)||active.has(p.id);
 }
 if(openedParent){return p.parent===openedParent;}
 if(p.parent)return false;
 if(state.isolated)return p.id===state.selected;
 if(state.system!=='all')return partHasSystem(p,state.system);
 if(p.system==='integumentary')return $('#skin').checked;
 if(p.system==='skeletal')return $('#bones').checked;
 if(p.system==='muscular')return $('#muscles').checked;
 return true;
}
function applyAppearance(){
 const lessonIds=activeLessonIds(),lessonActive=Boolean(currentLesson());
 for(const p of parts){
 p.group.visible=visible(p);
 p.group.traverse(o=>{if(!o.isMesh||!o.userData.partId)return;const m=o.material;
 const context=(state.system==='all'&&!state.isolated),isSkin=p.system==='integumentary',isBone=p.system==='skeletal';
 let opacity=1;
 if(context&&isSkin)opacity=.075;
 else if(context&&isBone)opacity=.27;
 else if(state.mode==='transparent'&&p.id!==state.selected)opacity=.18;
 if(lessonActive&&p.group.visible&&!lessonIds.has(p.id))opacity=Math.min(opacity,.16);
 if(state.mode==='structure'&&!isSkin){m.wireframe=true;opacity=context&&isBone?.35:.72;}else m.wireframe=false;
 m.transparent=opacity<1;m.opacity=opacity;m.depthWrite=opacity>.8;
 m.clippingPlanes=cutaway?[clipPlane]:[];m.clipShadows=true;
 const lessonHighlight=lessonActive&&lessonIds.has(p.id);m.emissive.set(lessonHighlight?0x51211b:p.id===state.selected?0x4d2310:0x000000);m.emissiveIntensity=lessonHighlight?.7:.45;
 });
 }
}
function renderList(){
 const q=state.query.toLocaleLowerCase();const list=parts.filter(p=>(!p.variant||p.variant===state.sex||state.system==='reproductive'||Boolean(q))&&partHasSystem(p,state.system)&&(!q||(p.th+' '+p.en+' '+partSystems(p).join(' ')+' '+Object.values(p.teaching||{}).flat().join(' ')).toLocaleLowerCase().includes(q))).sort((a,b)=>Object.keys(systems).indexOf(a.system)-Object.keys(systems).indexOf(b.system));
 $('#count').textContent=tr(list.length+' ชิ้น',list.length+' parts');
 $('#partList').replaceChildren();
 if(!list.length){const e=document.createElement('p');e.className='empty';e.textContent=tr('ไม่พบชิ้นส่วนที่ค้นหา','No matching parts');$('#partList').append(e);return;}
 let prev='';
 for(const p of list){
 const groupSystem=state.system==='all'?p.system:state.system;
 if(groupSystem!==prev){const h=document.createElement('div');h.className='group-label';h.textContent=systems[groupSystem][state.lang==='th'?0:1];$('#partList').append(h);prev=groupSystem;}
 const row=document.createElement('div');row.className='part-row'+(p.id===state.selected?' active':'');
 const selectBtn=document.createElement('button');selectBtn.className='part-name';selectBtn.innerHTML='<span class="part-dot"></span><span></span>';selectBtn.lastElementChild.textContent=title(p);selectBtn.firstElementChild.style.background=systems[groupSystem][2];selectBtn.onclick=()=>select(p.id);
 const eye=document.createElement('button');eye.className='eye-button';eye.textContent=visible(p)?'◉':'○';eye.title=tr('แสดง/ซ่อน ','Show/hide ')+title(p);eye.setAttribute('aria-label',eye.title);eye.setAttribute('aria-pressed',String(visible(p)));eye.onclick=()=>{
 if(visible(p)){state.hidden.add(p.id);}else{if(p.variant&&p.variant!==state.sex){state.sex=p.variant;$('#sex').value=state.sex;}state.hidden.delete(p.id);if(p.parent)openedParent=p.parent;else if(openedParent)openedParent=null;if(p.system==='muscular')$('#muscles').checked=true;if(p.system==='skeletal')$('#bones').checked=true;if(p.system==='integumentary')$('#skin').checked=true;if(state.isolated)state.selected=p.id;}
 update();
 };row.append(selectBtn,eye);$('#partList').append(row);
 }
}
function renderDetail(){
 const p=selected(),lang=state.lang==='th'?0:1;$('#organName').textContent=title(p);$('#organAlt').textContent=state.lang==='th'?p.en:p.th;
 $('#organSystem').textContent=partSystems(p).map(id=>systems[id]?.[lang]).filter(Boolean).join(' · ');$('#organSystem').style.color=systems[p.system][2];
 $('#organBadge').textContent=p.system==='circulatory'?'♥':p.system==='respiratory'?'◡':p.system==='skeletal'?'✧':'◈';$('#organBadge').style.color=systems[p.system][2];
 $('#organFunction').textContent=teachingField(p,'function')[lang];$('#organLocation').textContent=teachingField(p,'location')[lang];$('#organRelations').textContent=teachingField(p,'relations')[lang];$('#organClinical').textContent=teachingField(p,'clinical')[lang];
 const parent=p.parent||p.id;
 $('#detailsButton').hidden=!parts.some(x=>x.parent===parent);
 $('#detailsButton').textContent=openedParent?tr('กลับดูอวัยวะเต็มชิ้น','Close detailed view'):tr('แยกส่วนประกอบภายใน','Explore components');
 $('#cutaway').textContent=cutaway?tr('ปิดภาพตัด','Close cutaway'):tr('ดูภาพตัดภายใน','Cutaway view');
 $('#cutaway').setAttribute('aria-pressed',String(cutaway));
 $('#isolate').textContent=state.isolated?tr('กลับไปดูร่วมกัน','Show together'):tr('แสดงเฉพาะชิ้นนี้','Isolate this part');
 $('#hide').textContent=state.hidden.has(p.id)?tr('แสดงชิ้นนี้','Show this part'):tr('ซ่อนชิ้นนี้','Hide this part');
 $('#focus').textContent=tr('ขยายดูชิ้นนี้','Focus on this part');
 const lessonStep=currentLessonStep();
 $('#sceneTitle').textContent=lessonStep?lessonStep.title[state.lang==='th'?0:1]:state.isolated?title(p):state.system==='all'?tr('สำรวจร่างกายมนุษย์','Explore the human body'):systems[state.system][state.lang==='th'?0:1];
 $('#sceneSub').textContent=lessonStep?lessonStep.body[state.lang==='th'?0:1]:tr('เลือกชิ้นส่วนเพื่อเรียนรู้ชื่อและหน้าที่','Select a structure to explore its name and function');
}
function update(){applyAppearance();renderList();renderDetail();renderSimulation();}
function select(id){
 if(!byId.has(id))return;const target=byId.get(id);if(target.variant&&target.variant!==state.sex){state.sex=target.variant;$('#sex').value=state.sex;}state.selected=id;state.hidden.delete(id);
 const p=selected();openedParent=p.parent||null;if(p.system==='muscular')$('#muscles').checked=true;if(p.system==='skeletal')$('#bones').checked=true;if(p.system==='integumentary')$('#skin').checked=true;
 update();
}
function renderLesson(){
 const lesson=currentLesson(),step=currentLessonStep(),panel=$('#lessonPanel');
 if(!lesson||!step){panel.hidden=true;return;}
 panel.hidden=false;const i=state.lessonStep,n=lesson.steps.length;
 $('#lessonProgress').textContent=tr('ขั้นที่ '+(i+1)+' / '+n,'Step '+(i+1)+' / '+n);
 $('#lessonTitle').textContent=step.title[state.lang==='th'?0:1];$('#lessonBody').textContent=step.body[state.lang==='th'?0:1];
 $('#lessonDots').replaceChildren(...lesson.steps.map((s,j)=>{const b=document.createElement('button');b.className=j===i?'active':'';b.textContent=String(j+1);b.title=s.title[state.lang==='th'?0:1];b.setAttribute('aria-label',tr('ไปขั้นที่ ','Go to step ')+(j+1));b.onclick=()=>{stopPresentation();applyLessonStep(j,true);};return b;}));
 $('#lessonPrev').textContent=tr('← ก่อนหน้า','← Previous');$('#lessonPrev').disabled=i===0;
 $('#lessonQuiz').textContent=tr('แบบทดสอบ','Quiz');$('#lessonQuiz').title=tr('ทำแบบทดสอบท้ายบท','Take the lesson quiz');
 $('#lessonNext').textContent=i===n-1?tr('↺ เริ่มใหม่','↺ Restart'):tr('ถัดไป →','Next →');
 $('#lessonAuto').textContent=state.presentation?'Ⅱ':'▶';$('#lessonAuto').title=state.presentation?tr('หยุดนำเสนออัตโนมัติ','Stop auto presentation'):tr('นำเสนออัตโนมัติ','Auto presentation');$('#lessonAuto').setAttribute('aria-pressed',String(state.presentation));
 $('#lessonSpeak').title=tr('อ่านคำอธิบายขั้นนี้','Read this step aloud');$('#lessonSpeak').setAttribute('aria-label',$('#lessonSpeak').title);
 $('#lessonClose').title=tr('ปิดบทเรียน','Close lesson');
}
function speakLesson(){
 const step=currentLessonStep();if(!step)return;if(!('speechSynthesis'in window)){toast(tr('เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง','Speech synthesis is unavailable in this browser'));return;}
 speechSynthesis.cancel();const i=state.lang==='th'?0:1,u=new SpeechSynthesisUtterance(step.title[i]+'. '+step.body[i]);u.lang=state.lang==='th'?'th-TH':'en-US';u.rate=.92;speechSynthesis.speak(u);
}
function stopPresentation(){state.presentation=false;state.presentationNextAt=0;renderLesson();}
function togglePresentation(){if(!currentLesson())return;state.presentation=!state.presentation;state.presentationNextAt=state.presentation?performance.now()+9000:0;renderLesson();}
function quizHistory(id){try{const value=JSON.parse(localStorage.getItem('ceo-body-quiz-history-'+id)||'[]');return Array.isArray(value)?value:[];}catch{return [];}}
function saveQuizResult(id,score,total){try{const history=quizHistory(id);history.unshift({score,total,at:new Date().toISOString(),version:'1.6'});localStorage.setItem('ceo-body-quiz-history-'+id,JSON.stringify(history.slice(0,30)));localStorage.setItem('ceo-body-quiz-'+id,String(Math.max(Number(localStorage.getItem('ceo-body-quiz-'+id)||0),score)));}catch{}}
function resultRows(){const lang=state.lang==='th'?0:1;return lessonOrder.map(id=>{const lesson=getLesson(id),history=quizHistory(id);return{id,title:lesson.title[lang],history,best:bestAttempt(history),last:history[0]||null,target:quizLength(id)};});}
function renderResults(){
 const rows=resultRows(),summary=summarizeHistories(rows);
 $('#resultsTitle').textContent=tr('ผลการเรียนและคะแนนแบบทดสอบ','Learning & quiz results');
 $('#resultsSummary').textContent=tr('ทำแล้ว '+summary.attemptedSystems+' / '+summary.totalSystems+' ระบบ · รวม '+summary.totalAttempts+' ครั้ง · ค่าเฉลี่ย '+summary.average+'%','Completed '+summary.attemptedSystems+' / '+summary.totalSystems+' systems · '+summary.totalAttempts+' attempts · Average '+summary.average+'%');
 $('#resultsTable').replaceChildren(...rows.map(r=>{const row=document.createElement('div');row.className='result-row';const last=r.last?new Date(r.last.at).toLocaleString(state.lang==='th'?'th-TH':'en-US',{dateStyle:'short',timeStyle:'short'}):'—';const avg=r.history.length?Math.round(r.history.reduce((s,a)=>s+attemptPercent(a),0)/r.history.length):0;row.innerHTML='<div class="result-name"></div><div class="result-stat"></div><div class="result-stat"></div><div class="result-date"></div>';row.children[0].textContent=r.title;row.children[1].textContent=r.best?tr('ดีที่สุด '+attemptPercent(r.best)+'% ('+r.best.score+'/'+r.best.total+')','Best '+attemptPercent(r.best)+'% ('+r.best.score+'/'+r.best.total+')'):tr('ยังไม่มีคะแนน','No score yet');row.children[2].textContent=r.history.length?tr('เฉลี่ย '+avg+'% · '+r.history.length+' ครั้ง','Avg '+avg+'% · '+r.history.length+' attempts'):tr('เป้าหมาย '+r.target+' ข้อ','Target '+r.target+' questions');row.children[3].textContent=last;return row;}));
 $('#resultsExport').textContent=tr('ส่งออก CSV','Export CSV');$('#resultsReset').textContent=tr('ล้างประวัติคะแนนในเครื่องนี้','Clear scores on this device');$('#resultsClose').title=tr('ปิดผลคะแนน','Close results');
}
function openResults(){renderResults();$('#resultsPanel').hidden=false;}
function closeResults(){$('#resultsPanel').hidden=true;}
function exportResults(){const rows=resultRows(),csv=resultsCsv(rows,state.lang),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Ceo-body-results-'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);toast(tr('ส่งออกผลคะแนน CSV แล้ว','Results exported as CSV'));}
function resetResults(){if(!confirm(tr('ล้างคะแนนและประวัติแบบทดสอบทั้งหมดในเครื่องนี้?','Clear all quiz scores and history on this device?')))return;for(const id of lessonOrder){localStorage.removeItem('ceo-body-quiz-'+id);localStorage.removeItem('ceo-body-quiz-history-'+id);}renderResults();toast(tr('ล้างประวัติคะแนนแล้ว','Quiz history cleared'));}
function startQuiz(){const lesson=currentLesson();if(!lesson)return;stopPresentation();const questions=createQuiz(state.lesson,5);if(!questions.length)return;state.quiz={lessonId:state.lesson,questions,index:0,answers:Array(questions.length).fill(null),score:0,answered:false,finished:false};renderQuiz();}
function closeQuiz(){state.quiz=null;$('#quizPanel').hidden=true;}
function renderQuiz(){
 const qstate=state.quiz,panel=$('#quizPanel');if(!qstate){panel.hidden=true;return;}const questions=qstate.questions,lesson=getLesson(qstate.lessonId),i=qstate.index,lang=state.lang==='th'?0:1;panel.hidden=false;
 $('#quizTitle').textContent=lesson.title[lang]+' · '+tr('แบบทดสอบสุ่ม 5 ข้อ','5-question random quiz');$('#quizClose').title=tr('ปิดแบบทดสอบ','Close quiz');
 if(qstate.finished){const best=bestAttempt(quizHistory(qstate.lessonId));$('#quizProgress').textContent=tr('สรุปคะแนน','Score summary');$('#quizQuestion').textContent=tr('ได้ '+qstate.score+' / '+questions.length+' คะแนน ('+Math.round(qstate.score/questions.length*100)+'%)','Score: '+qstate.score+' / '+questions.length+' ('+Math.round(qstate.score/questions.length*100)+'%)');$('#quizOptions').replaceChildren();$('#quizFeedback').textContent=best?tr('ดีที่สุดในเครื่องนี้: '+attemptPercent(best)+'% ('+best.score+'/'+best.total+')','Best on this device: '+attemptPercent(best)+'% ('+best.score+'/'+best.total+')'):'';$('#quizNext').textContent=tr('สุ่มทำใหม่','Retry with new questions');return;}
 const q=questions[i];$('#quizProgress').textContent=tr('ข้อ '+(i+1)+' / '+questions.length,'Question '+(i+1)+' / '+questions.length);$('#quizQuestion').textContent=q.q[lang];$('#quizFeedback').textContent='';
 $('#quizOptions').replaceChildren(...q.options.map((opt,j)=>{const b=document.createElement('button');b.textContent=opt[lang];b.disabled=qstate.answered;if(qstate.answered)b.className=j===q.answer?'correct':j===qstate.answers[i]?'wrong':'';b.onclick=()=>answerQuiz(j);return b;}));
 $('#quizNext').textContent=i===questions.length-1?tr('สรุปคะแนน','See score'):tr('ข้อต่อไป','Next question');$('#quizNext').disabled=!qstate.answered;
 if(qstate.answered)$('#quizFeedback').textContent=(qstate.answers[i]===q.answer?tr('✓ ถูกต้อง · ','✓ Correct · '):tr('✗ ยังไม่ถูก · ','✗ Not quite · '))+q.explain[lang];
}
function answerQuiz(choice){const qstate=state.quiz;if(!qstate||qstate.answered)return;const q=qstate.questions[qstate.index];qstate.answers[qstate.index]=choice;qstate.answered=true;if(choice===q.answer)qstate.score++;renderQuiz();}
function nextQuiz(){const qstate=state.quiz;if(!qstate)return;const questions=qstate.questions;if(qstate.finished){qstate.questions=createQuiz(qstate.lessonId,5);qstate.index=0;qstate.answers=Array(qstate.questions.length).fill(null);qstate.score=0;qstate.answered=false;qstate.finished=false;renderQuiz();return;}if(!qstate.answered)return;if(qstate.index===questions.length-1){qstate.finished=true;saveQuizResult(qstate.lessonId,qstate.score,questions.length);renderQuiz();return;}qstate.index++;qstate.answered=false;renderQuiz();}
function renderSimulation(){
 renderLesson();if(state.quiz)renderQuiz();
 const lesson=currentLesson(),choice=getLesson(state.lessonChoice);
 $('#play').textContent=state.playing?tr('Ⅱ หยุดชั่วคราว','Ⅱ Pause'):tr('▶ เริ่มทำงาน','▶ Animate');
 $('#play').setAttribute('aria-pressed',String(state.playing));
 $('#lessonStart').textContent=lesson?tr('✓ กำลังเรียน','✓ Learning'):tr((choice?.icon||'▶')+' เริ่มบทเรียน',(choice?.icon||'▶')+' Start lesson');
 $('#lessonStart').setAttribute('aria-pressed',String(Boolean(lesson)));
 $('#simulationStatus').textContent=state.playing?tr('กำลังแสดงการทำงาน','Simulation running'):tr('หยุดภาพเคลื่อนไหว','Simulation paused');
 $('.pulse-dot').classList.toggle('running',state.playing);
 const info=lesson?lesson.title[state.lang==='th'?0:1]+' · '+currentLessonStep().body[state.lang==='th'?0:1]:tr('เลือกช่องจำลองได้อิสระ: หัวใจ • เลือด • ปอด • อาหาร/ลำไส้ • อากาศ • ปัสสาวะ • สัญญาณประสาท • น้ำเหลือง แล้วใช้ปุ่มเริ่ม/หยุดควบคุมเวลาภาพเคลื่อนไหวทั้งหมด','Simulation channels can be mixed freely: heart • blood • lungs • food/gut • air • urine • neural signals • lymph; Animate/Pause controls the shared animation clock.');
 $('#simulationInfo').textContent=info;
}
function captureLessonReturn(){
 if(state.lessonReturn)return;state.lessonReturn={system:state.system,selected:state.selected,sex:state.sex,playing:state.playing,heart:state.heart,blood:state.blood,lungs:state.lungs,gut:state.gut,air:state.air,urine:state.urine,signal:state.signal,lymph:state.lymph,mode:state.mode,explode:state.explode,labels:state.labels,query:state.query,hidden:[...state.hidden],isolated:state.isolated,skin:$('#skin').checked,bones:$('#bones').checked,muscles:$('#muscles').checked,openedParent,cutaway};
}
function restoreLessonReturn(full=true){
 const r=state.lessonReturn;state.lessonReturn=null;if(!r)return;
 Object.assign(state,{sex:r.sex,playing:r.playing,heart:r.heart,blood:r.blood,lungs:r.lungs,gut:r.gut,air:r.air,urine:r.urine,signal:r.signal,lymph:r.lymph,mode:r.mode,explode:r.explode,labels:r.labels});
 if(full){Object.assign(state,{system:r.system,selected:r.selected,query:r.query,isolated:r.isolated});state.hidden=new Set(r.hidden);openedParent=r.openedParent;cutaway=r.cutaway;$('#search').value=r.query;}else{const cur=byId.get(state.selected);if(cur?.variant&&cur.variant!==state.sex)state.selected=r.selected;}
 $('#sex').value=state.sex;$('#explode').value=Math.round(state.explode*100);$('#explodeValue').value=Math.round(state.explode*100)+'%';$('#skin').checked=r.skin;$('#bones').checked=r.bones;$('#muscles').checked=r.muscles;for(const id of simulationKeys)$('#'+id).checked=Boolean(state[id]);
}
function clearLessonState(){
 if(!state.lesson)return;stopPresentation();closeQuiz();state.lesson=null;state.lessonStep=0;restoreLessonReturn(false);
}
function applyLessonStep(index,smooth=true){
 const lesson=currentLesson();if(!lesson)return;if('speechSynthesis'in window)speechSynthesis.cancel();state.lessonStep=Math.max(0,Math.min(lesson.steps.length-1,index));
 const step=currentLessonStep();if(step.sex&&step.sex!==state.sex){state.sex=step.sex;$('#sex').value=step.sex;}
 const first=step.parts.find(id=>byId.has(id)&&allowed(byId.get(id)));if(first)state.selected=first;
 update();frameLessonStep(smooth);
}
function exitLesson(){
 if('speechSynthesis'in window)speechSynthesis.cancel();stopPresentation();closeQuiz();state.lesson=null;state.lessonStep=0;restoreLessonReturn(true);localize();resetCamera();
}
function startLesson(id=state.lessonChoice){
 const lesson=getLesson(id);if(!lesson)return;if(state.lesson===id){exitLesson();return;}stopPresentation();closeQuiz();if(!state.lesson)captureLessonReturn();
 state.lesson=id;state.lessonChoice=id;state.lessonStep=0;state.system=lesson.system;state.query='';$('#search').value='';state.isolated=false;openedParent=null;state.hidden.clear();cutaway=false;state.mode='solid';state.explode=0;$('#explode').value=0;$('#explodeValue').value='0%';state.labels=true;
 const sim=lesson.simulation||{};state.playing=true;for(const key of simulationKeys)state[key]=Boolean(sim[key]);
 for(const key of simulationKeys)$('#'+key).checked=state[key];$('#skin').checked=false;$('#bones').checked=false;$('#muscles').checked=false;
 localize();applyLessonStep(0,false);toast(lesson.start[state.lang==='th'?0:1]);
}
function localize(){
 document.documentElement.lang=state.lang;renderVisitorCounter($('#visitorCounter'),state.lang);
 if(!modelLoading)$('#modelStatus').textContent=modelFailures?tr('บางชิ้นใช้รูปทรงย่อ — รีโหลดเพื่อลองใหม่','Some simplified fallbacks — reload to retry'):tr('โมเดลกายวิภาคพร้อมแล้ว','Anatomical models ready');
 $('.side-top .eyebrow').textContent=tr('คลังชิ้นส่วนร่างกาย','ANATOMY LIBRARY');
 $('#detailEyebrow').textContent=tr('ชิ้นส่วนที่เลือก','SELECTED STRUCTURE');
 $('#speed').setAttribute('aria-label',tr('ความเร็วภาพเคลื่อนไหว','Animation speed'));
 $('#scene').setAttribute('aria-label',tr('โมเดลร่างกายมนุษย์แบบ 3 มิติ','Interactive 3D human anatomy'));
 const texts={
 schoolHeaderTitle:['สื่อการสอนกายวิภาคแบบโต้ตอบ','Interactive Anatomy Teaching Media'],schoolHeaderSchool:['ของโรงเรียนวัดไผ่มุ้ง','Wat Phai Mung School'],resultsButton:['ผลคะแนน','Results'],
 libraryTitle:['ส่วนต่าง ๆ ของร่างกาย','Body structures'],showAll:['แสดงทั้งหมด','Show all'],
 sideFooter:['หมุน 360° • แยกชิ้นส่วน • เรียนรู้หน้าที่','Rotate 360° • Separate • Explore'],
 reset:['↺ คืนมุมมอง','↺ Reset view'],
 sceneEyebrow:['HUMAN BODY / สำรวจ','HUMAN BODY / EXPLORE'],
 orientation:['ซ้ายของภาพ = ขวาของร่างกาย (มุมหน้า)','Image left = anatomical right (front view)'],
 sceneHint:['โหมดหมุน: ลากเพื่อหมุน · โหมดเลื่อน: ลากขึ้น/ลง/ซ้าย/ขวา · Shift+ล้อเมาส์เลื่อนแนวตั้ง · ดับเบิลคลิกเพื่อขยาย','Rotate mode: drag to orbit · Move mode: drag freely · Shift+wheel moves vertically · Double-click to focus'],
 rotateModeText:['หมุน','Rotate'],moveModeText:['เลื่อน','Move'],
 anatomyNote:['BodyParts3D · แบบจำลองเพื่อการศึกษา','BodyParts3D · Educational model'],
 explodeLabel:['แยกชิ้นส่วน','Separate parts'],labelsToggle:['ป้ายชื่อ','Labels'],
 simulationLabel:['จำลองการทำงาน','Physiology'],heartText:['หัวใจ','Heart'],bloodText:['เลือด','Blood flow'],lungsText:['ปอด','Lungs'],gutText:['อาหาร/ลำไส้','Food/Gut'],airText:['อากาศ','Air'],urineText:['ปัสสาวะ','Urine'],signalText:['ประสาท','Neural'],lymphText:['น้ำเหลือง','Lymph'],
 detailEyebrow:['ชิ้นส่วนที่เลือก','SELECTED STRUCTURE'],functionHeading:['หน้าที่','Function'],locationHeading:['ตำแหน่ง','Location'],relationsHeading:['ความสัมพันธ์','Relations'],clinicalHeading:['เกร็ดทางคลินิก','Clinical note'],layersHeading:['ชั้นและรูปแบบร่างกาย','Body layers & variant'],
 skinText:['ขอบเขตผิวหนัง','Skin envelope'],bonesText:['โครงกระดูก','Skeleton'],musclesText:['กล้ามเนื้อ','Muscles'],sexText:['ระบบสืบพันธุ์','Reproductive anatomy'],
 aboutHeading:['ขอบเขตและแหล่งเรียนรู้','Scope & learning resources'],
 aboutText:['อวัยวะหลักใช้รูปทรงจาก BodyParts3D ปรับขนาดเข้ากับหุ่นสอน และผสมรูปทรงย่อของชิ้นส่วนอื่น ห้องหัวใจเป็นแผนภาพ 3 มิติ ไม่ใช่ภาพสแกน ยังไม่รวมทุกเส้นประสาท หลอดเลือด หรือโครงสร้างระดับเซลล์ โมเดลต้นฉบับ: BodyParts3D © The Database Center for Life Science, CC BY-SA 2.1 Japan.','Major organs use BodyParts3D meshes fitted to a teaching body, alongside simplified structures. Heart chambers are schematic. This is not a scan or exhaustive atlas of nerves, vessels or cells. Models: BodyParts3D © The Database Center for Life Science, CC BY-SA 2.1 Japan.']
 };
 for(const [id,t]of Object.entries(texts))$('#'+id).textContent=t[state.lang==='th'?0:1];
 $('#search').placeholder=tr('ค้นหาชื่อไทยหรืออังกฤษ…','Search Thai or English names…');$('#search').setAttribute('aria-label',$('#search').placeholder);
 $('#system').innerHTML='<option value="all">'+tr('ทุกระบบ','All systems')+'</option>'+Object.entries(systems).map(([id,s])=>'<option value="'+id+'">'+s[state.lang==='th'?0:1]+'</option>').join('');$('#system').value=state.system;$('#system').setAttribute('aria-label',tr('ระบบร่างกาย','Body system'));
 $('#sex option[value="female"]').textContent=tr('หญิง','Female');$('#sex option[value="male"]').textContent=tr('ชาย','Male');
 $('#bodyRegion').innerHTML=[['',tr('ไปที่…','Jump to…')],['center',tr('กึ่งกลางร่างกาย','Body center')],['head',tr('ศีรษะ','Head')],['chest',tr('อก','Chest')],['abdomen',tr('ท้อง','Abdomen')],['pelvis',tr('เชิงกราน','Pelvis')],['legs',tr('ขา','Legs')],['feet',tr('เท้า','Feet')]].map(([v,t])=>'<option value="'+v+'">'+t+'</option>').join('');$('#bodyRegion').setAttribute('aria-label',tr('ข้ามไปยังส่วนของร่างกาย','Jump to body region'));
 $('#lessonSelect').innerHTML=lessonOrder.map(id=>{const l=lessons[id];return '<option value="'+id+'">'+l.icon+' '+l.title[state.lang==='th'?0:1]+'</option>';}).join('');$('#lessonSelect').value=state.lessonChoice;$('#lessonSelect').setAttribute('aria-label',tr('เลือกบทเรียนสาธิต','Choose guided lesson'));
 $('#quality').textContent=state.quality==='low'?tr('กราฟิก: เบา','Graphics: Low'):tr('กราฟิก: สูง','Graphics: High');
 $('#modes').innerHTML=[['solid','3 มิติ','3D'],['structure','โครงสร้าง','Structure'],['transparent','โปร่งใส','Transparent']].map(([id,th,en])=>'<button data-mode="'+id+'" class="'+(state.mode===id?'active':'')+'" aria-pressed="'+(state.mode===id)+'">'+tr(th,en)+'</button>').join('');
 for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>{state.mode=b.dataset.mode;localize();};
 for(const b of document.querySelectorAll('[data-view]'))b.textContent={front:tr('ด้านหน้า','Front'),back:tr('ด้านหลัง','Back'),side:tr('ด้านข้าง','Side')}[b.dataset.view];
 $('#th').classList.toggle('active',state.lang==='th');$('#en').classList.toggle('active',state.lang==='en');$('#labelsToggle').setAttribute('aria-pressed',String(state.labels));
 $('#full').title=tr('เต็มหน้าจอ','Fullscreen');$('#rotateMode').title=tr('ลากเพื่อหมุนโมเดล','Drag to rotate the model');$('#moveMode').title=tr('ลากเพื่อเลื่อนมุมมองขึ้นลงซ้ายขวา','Drag to move the view freely');$('#recenter').title=tr('นำโมเดลกลับกึ่งกลางโดยคงมุมและระยะซูม','Recenter while keeping angle and zoom');
 const panNames={up:tr('เลื่อนมุมมองขึ้น','Move view up'),down:tr('เลื่อนมุมมองลง','Move view down'),left:tr('เลื่อนมุมมองซ้าย','Move view left'),right:tr('เลื่อนมุมมองขวา','Move view right')};for(const b of document.querySelectorAll('[data-pan]'))b.setAttribute('aria-label',panNames[b.dataset.pan]);
 if(!$('#resultsPanel').hidden)renderResults();setInteractionMode(state.interaction);update();
}
function persist(){try{localStorage.setItem('ceo-body-preferences',JSON.stringify({lang:state.lang,quality:state.quality}));}catch{}}
$('#th').onclick=()=>{state.lang='th';persist();localize();};$('#en').onclick=()=>{state.lang='en';persist();localize();};
$('#quality').onclick=()=>{state.quality=state.quality==='low'?'high':'low';renderer.setPixelRatio(Math.min(devicePixelRatio,state.quality==='low'?1:2));persist();localize();resize();};
$('#resultsButton').onclick=openResults;$('#resultsClose').onclick=closeResults;$('#resultsExport').onclick=exportResults;$('#resultsReset').onclick=resetResults;$('#resultsPanel').onclick=e=>{if(e.target===$('#resultsPanel'))closeResults();};
$('#search').oninput=e=>{state.query=e.target.value;renderList();};
$('#system').onchange=e=>{clearLessonState();state.system=e.target.value;state.isolated=false;openedParent=null;const p=parts.find(p=>allowed(p)&&partHasSystem(p,state.system));if(p)state.selected=p.id;update();resetCamera();};
$('#showAll').onclick=()=>{clearLessonState();state.hidden.clear();state.isolated=false;openedParent=null;cutaway=false;state.system='all';state.query='';$('#search').value='';$('#skin').checked=true;$('#bones').checked=true;$('#muscles').checked=false;state.explode=0;$('#explode').value=0;$('#explodeValue').value='0%';localize();resetCamera();};
$('#isolate').onclick=()=>{clearLessonState();openedParent=null;state.isolated=!state.isolated;state.hidden.delete(state.selected);update();if(state.isolated)focus();else resetCamera();};
$('#hide').onclick=()=>{if(state.hidden.has(state.selected))state.hidden.delete(state.selected);else state.hidden.add(state.selected);update();};
$('#focus').onclick=focus;
$('#detailsButton').onclick=()=>{clearLessonState();const p=selected();if(openedParent){state.selected=openedParent;openedParent=null;}else openedParent=p.parent||p.id;state.isolated=false;state.hidden.clear();update();focus();};
$('#cutaway').onclick=()=>{cutaway=!cutaway;const box=new THREE.Box3().setFromObject(selected().group);clipPlane.constant=box.getCenter(new THREE.Vector3()).z;applyAppearance();renderDetail();};
for(const id of ['skin','bones','muscles'])$('#'+id).onchange=update;
$('#sex').onchange=e=>{state.sex=e.target.value;if(selected().variant&&selected().variant!==state.sex)state.selected=state.sex==='female'?'uterus':'prostate';update();};
$('#explode').oninput=e=>{state.explode=Number(e.target.value)/100;$('#explodeValue').value=e.target.value+'%';};
$('#labelsToggle').onclick=()=>{state.labels=!state.labels;$('#labelsToggle').setAttribute('aria-pressed',String(state.labels));};
$('#play').onclick=()=>{state.playing=!state.playing;renderSimulation();};
$('#lessonSelect').onchange=e=>{state.lessonChoice=e.target.value;if(state.lesson)startLesson(state.lessonChoice);else renderSimulation();};
$('#lessonStart').onclick=()=>startLesson(state.lessonChoice);
$('#lessonAuto').onclick=togglePresentation;
$('#lessonSpeak').onclick=speakLesson;
$('#lessonQuiz').onclick=startQuiz;
$('#lessonPrev').onclick=()=>{stopPresentation();applyLessonStep(state.lessonStep-1,true);};
$('#lessonNext').onclick=()=>{stopPresentation();const lesson=currentLesson();if(lesson)applyLessonStep(state.lessonStep===lesson.steps.length-1?0:state.lessonStep+1,true);};
$('#lessonClose').onclick=exitLesson;
$('#quizClose').onclick=closeQuiz;
$('#quizNext').onclick=nextQuiz;
for(const id of simulationKeys)$('#'+id).onchange=e=>{state[id]=e.target.checked;if(id==='gut'&&!state.gut){for(const pid of ['small-intestine','large-intestine']){const g=byId.get(pid).group.children.find(m=>m.geometry?.type==='TubeGeometry')?.geometry;if(g?.userData.original){g.attributes.position.array.set(g.userData.original);g.attributes.position.needsUpdate=true;}for(const m of byId.get(pid).group.children.filter(m=>m.userData.restPositions)){m.geometry.attributes.position.array.set(m.userData.restPositions);m.geometry.attributes.position.needsUpdate=true;}}}renderSimulation();};
$('#speed').onchange=e=>state.speed=Number(e.target.value);
function visibleBounds(){
 root.updateMatrixWorld(true);const box=new THREE.Box3();
 for(const p of parts)if(p.group.visible)box.expandByObject(p.group,true);
 return box;
}
function setInteractionMode(mode){
 state.interaction=mode==='pan'?'pan':'rotate';
 controls.mouseButtons.LEFT=state.interaction==='pan'?THREE.MOUSE.PAN:THREE.MOUSE.ROTATE;
 controls.touches.ONE=state.interaction==='pan'?THREE.TOUCH.PAN:THREE.TOUCH.ROTATE;
 $('#scene').classList.toggle('pan-mode',state.interaction==='pan');
 $('#viewport').classList.toggle('pan-active',state.interaction==='pan');
 $('#rotateMode').setAttribute('aria-pressed',String(state.interaction==='rotate'));
 $('#moveMode').setAttribute('aria-pressed',String(state.interaction==='pan'));
}
function shiftView(direction,scale=1){
 const step=viewMoveStep(camera.position.distanceTo(controls.target))*scale;
 const delta=new THREE.Vector3();
 if(direction==='up')delta.y=step;
 else if(direction==='down')delta.y=-step;
 else{
  const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);right.y=0;
  if(right.lengthSq()<1e-6)right.set(1,0,0);else right.normalize();
  delta.copy(right).multiplyScalar(direction==='left'?-step:step);
 }
 camera.position.add(delta);controls.target.add(delta);controls.update();
}
function recenterView(){
 const box=visibleBounds();if(box.isEmpty())return;
 const center=box.getCenter(new THREE.Vector3()),offset=camera.position.clone().sub(controls.target);
 controls.target.copy(center);camera.position.copy(center).add(offset);camera.lookAt(center);controls.update();
}
function moveToRegion(region){
 if(region==='center'){recenterView();return;}
 const heights={head:16.4,chest:12.6,abdomen:9.8,pelvis:7.7,legs:3.8,feet:.7};const y=heights[region];if(y==null)return;
 const dy=y-controls.target.y;controls.target.y=y;camera.position.y+=dy;controls.update();
}
function startCameraTween(position,target,duration=720){
 cameraTween={fromPosition:camera.position.clone(),fromTarget:controls.target.clone(),toPosition:position.clone(),toTarget:target.clone(),start:performance.now(),duration};
}
function frameBox(box,direction,margin=1.16,smooth=false){
 if(box.isEmpty())return;
 const center=box.getCenter(new THREE.Vector3()),sphere=box.getBoundingSphere(new THREE.Sphere());
 const distance=sphereFitDistance(sphere.radius,camera.fov,camera.aspect,margin);
 const dir=(direction||camera.position.clone().sub(controls.target)).normalize(),position=center.clone().addScaledVector(dir,distance);
 if(smooth)startCameraTween(position,center);else{controls.target.copy(center);camera.position.copy(position);camera.lookAt(center);controls.update();}
}
function frameLessonStep(smooth=true){
 const step=currentLessonStep();if(!step)return;root.updateMatrixWorld(true);const box=new THREE.Box3();
 for(const id of step.parts){const p=byId.get(id);if(p?.group.visible)box.expandByObject(p.group,true);}
 if(box.isEmpty())return;const direction=camera.position.clone().sub(controls.target).normalize();frameBox(box,direction,step.margin||1.2,smooth);
}
function resetCamera(view='front'){
 const direction=view==='back'?new THREE.Vector3(0,0,-1):view==='side'?new THREE.Vector3(1,0,0):new THREE.Vector3(0,0,1);
 frameBox(visibleBounds(),direction,1.12);
}
$('#reset').onclick=()=>{state.explode=0;$('#explode').value=0;$('#explodeValue').value='0%';resetCamera();};
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>resetCamera(b.dataset.view);
$('#rotateMode').onclick=()=>setInteractionMode('rotate');
$('#moveMode').onclick=()=>setInteractionMode('pan');
for(const b of document.querySelectorAll('[data-pan]'))b.onclick=()=>shiftView(b.dataset.pan);
$('#recenter').onclick=recenterView;
$('#bodyRegion').onchange=e=>{if(e.target.value)moveToRegion(e.target.value);e.target.value='';};
$('#full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await app.requestFullscreen();}catch{toast(tr('เบราว์เซอร์ไม่อนุญาตให้เต็มหน้าจอ','Fullscreen is unavailable'));}};
function focus(){
 const p=selected();const direction=camera.position.clone().sub(controls.target).normalize();
 if(openedParent){root.updateMatrixWorld(true);const box=new THREE.Box3();parts.filter(x=>x.parent===openedParent&&x.group.visible).forEach(x=>box.expandByObject(x.group,true));frameBox(box,direction,1.22);return;}
 if(!p.group.visible){state.hidden.delete(p.id);state.isolated=true;update();}
 root.updateMatrixWorld(true);frameBox(new THREE.Box3().setFromObject(p.group,true),direction,1.28);
}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
controls.addEventListener('start',()=>{cameraTween=null;$('#scene').classList.add('is-orbiting');});
controls.addEventListener('end',()=>$('#scene').classList.remove('is-orbiting'));
$('#scene').addEventListener('contextmenu',e=>e.preventDefault());
$('#scene').addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});
$('#scene').addEventListener('pointercancel',()=>down=null);
$('#scene').addEventListener('pointerup',e=>{
 const end={x:e.clientX,y:e.clientY};if(!isPointerClick(down,end)){down=null;return;}down=null;
 const r=$('#scene').getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects(parts.filter(p=>p.group.visible&&(state.system!=='all'||state.isolated||p.system!=='integumentary')).map(p=>p.group),true);
 const valid=hits.filter(h=>h.object.userData.partId&&(!cutaway||clipPlane.distanceToPoint(h.point)>=0));
 const hit=valid.find(h=>byId.get(h.object.userData.partId).system!=='integumentary'&&(state.mode==='transparent'||h.object.material.opacity>.3||state.system==='skeletal'));
 const fallback=valid.find(h=>h.object.material.opacity>.01);
 if(hit||fallback)select((hit||fallback).object.userData.partId);
});
$('#scene').addEventListener('dblclick',()=>focus());
$('#scene').addEventListener('wheel',e=>{if(!e.shiftKey)return;e.preventDefault();e.stopImmediatePropagation();shiftView(e.deltaY>0?'down':'up',.6);},{capture:true,passive:false});
$('#scene').addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(currentLesson()){exitLesson();return;}state.isolated=false;openedParent=null;cutaway=false;update();resetCamera();return;}
 if(currentLesson()&&(e.key==='PageUp'||e.key==='PageDown')){e.preventDefault();const n=currentLesson().steps.length;applyLessonStep(e.key==='PageUp'?Math.max(0,state.lessonStep-1):state.lessonStep===n-1?0:state.lessonStep+1,true);return;}
 const arrows={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};if(arrows[e.key]){e.preventDefault();shiftView(arrows[e.key],.7);return;}
 if(e.key.toLowerCase()==='m'){setInteractionMode('pan');return;}if(e.key.toLowerCase()==='r'){setInteractionMode('rotate');return;}
 if(e.key==='+'||e.key==='='){camera.position.lerp(controls.target,.12);}if(e.key==='-')camera.position.sub(controls.target).multiplyScalar(1.12).add(controls.target);
});
function resize(){const r=$('#viewport').getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe($('#viewport'));
function positionLabel(el,p,offset=0){
 if(!state.labels||!p.group.visible){el.hidden=true;return;}
 const pos=p.group.position.clone();if(p.id==='skin')pos.y=14;pos.z+=.8;pos.project(camera);
 const r=$('#viewport').getBoundingClientRect();if(pos.z>1||pos.z< -1||Math.abs(pos.x)>.95||Math.abs(pos.y)>.95){el.hidden=true;return;}
 el.hidden=false;el.textContent=title(p);el.style.left=(pos.x*.5+.5)*r.width+offset+'px';el.style.top=(-pos.y*.5+.5)*r.height+'px';el.classList.toggle('active',p.id===state.selected);
}
function animate(now){
 requestAnimationFrame(animate);
 if(state.quality==='low'&&now-last<33)return;
 const dt=Math.min((now-last)/1000,.1);last=now;if(state.playing)elapsed+=dt*state.speed;
 if(state.presentation&&currentLesson()&&now>=state.presentationNextAt){const n=currentLesson().steps.length;if(state.lessonStep<n-1){applyLessonStep(state.lessonStep+1,true);state.presentationNextAt=now+9000;}else{stopPresentation();toast(tr('นำเสนอครบทุกขั้นแล้ว สามารถทำแบบทดสอบต่อได้','Presentation complete. You can continue with the quiz.'));}}
 const breathing=breathingState(elapsed);
 for(let i=0;i<parts.length;i++){
 const p=parts[i],b=p.base;
 const sign=b.x===0?(i%2?1:-1):Math.sign(b.x);
 const ex=state.explode;
 const target=b.clone();
 if(p.system!=='integumentary'){
 target.x+=sign*ex*(.7+Math.abs(b.x)*.5+(p.system==='skeletal'?.1:1.1));
 target.y+=(b.y-9)*ex*.12;
 target.z+=ex*(p.system==='skeletal'?-.9:p.system==='muscular'?1.6:1.1+(i%4)*.23);
 }
 if(p.id==='diaphragm'&&state.lungs)target.y+=breathing.diaphragmOffset;
 p.group.position.lerp(target,.16);p.group.scale.setScalar(1);
 }
 if(state.heart){const scale=heartScale(elapsed);byId.get('heart').group.scale.setScalar(scale);for(const p of parts.filter(p=>p.parent==='heart'))p.group.scale.setScalar(scale);}
 if(state.lungs){const [sx,sy,sz]=breathing.lungScale;for(const p of parts.filter(p=>['lung-left','lung-right'].includes(p.id)||['lung-left','lung-right'].includes(p.parent)))p.group.scale.set(sx,sy,sz);}
 const lessonStep=currentLessonStep();
 for(const {mesh,p,stream,phase} of bloodDots){
  mesh.visible=state.blood&&p.group.visible&&(!lessonStep||lessonStep.parts.includes(p.id));
  if(mesh.visible){const u=bloodFlowProgress(elapsed,phase,stream.rate,stream.pulsatility),t=stream.direction<0?1-u:u;mesh.position.copy(stream.curve.getPointAt(t));mesh.scale.setScalar(.86+.18*Math.sin((u+phase)*Math.PI*2)**2);}
 }
 for(const {mesh,p,path,phase} of flowDots){mesh.visible=state.gut&&p.group.visible&&(!lessonStep||lessonStep.parts.includes(p.id));if(mesh.visible)mesh.position.copy(path.getPoint((elapsed*.06+phase)%1));}
 for(const {mesh,p,path,phase} of airDots){mesh.visible=state.air&&p.group.visible&&(!lessonStep||lessonStep.parts.includes(p.id));if(mesh.visible){const inhale=(Math.sin(elapsed*Math.PI*1.1)+1)/2,t=(elapsed*.12+phase)%1;mesh.position.copy(path.getPoint(inhale>.5?t:1-t));}}
 for(const {mesh,p,path,phase} of urineDots){mesh.visible=state.urine&&p.group.visible&&(!lessonStep||lessonStep.parts.includes(p.id));if(mesh.visible)mesh.position.copy(path.getPoint((elapsed*.055+phase)%1));}
 for(const {mesh,p,path,phase} of signalDots){mesh.visible=state.signal&&p.group.visible&&(!lessonStep||lessonStep.parts.includes(p.id));if(mesh.visible)mesh.position.copy(path.getPoint((elapsed*.22+phase)%1));}
 for(const {mesh,p,path,phase} of lymphDots){mesh.visible=state.lymph&&p.group.visible&&(!lessonStep||lessonStep.parts.includes(p.id));if(mesh.visible)mesh.position.copy(path.getPoint((elapsed*.075+phase)%1));}
 // Traveling radial contraction, separate from the path markers.
 if(state.gut&&state.playing){
 for(const id of ['small-intestine','large-intestine']){
 const p=byId.get(id);
 for(const m of p.group.children.filter(m=>m.userData.detailed)){
 const a=m.geometry.attributes.position;
 if(!m.userData.restPositions)m.userData.restPositions=a.array.slice();
 const rest=m.userData.restPositions;
 for(let i=0;i<a.count;i++){const j=i*3,y=rest[j+1],wave=intestinalRadiusScale(y,elapsed);a.setXYZ(i,rest[j]*wave,y,rest[j+2]*wave);}
 a.needsUpdate=true;
 }
 const tube=p.group.children.find(m=>m.geometry?.type==='TubeGeometry');
 if(tube){
 const g=tube.geometry;if(!g.userData.original)g.userData.original=g.attributes.position.array.slice();
 const original=g.userData.original,a=g.attributes.position,segments=g.parameters.tubularSegments,radial=g.parameters.radialSegments;
 for(let s=0;s<=segments;s++){
 const t=s/segments,c=p.path.getPointAt(t),wave=intestinalTubeScale(t,elapsed);
 for(let k=0;k<=radial;k++){const i=s*(radial+1)+k,j=i*3;a.setXYZ(i,c.x+(original[j]-c.x)*wave,c.y+(original[j+1]-c.y)*wave,c.z+(original[j+2]-c.z)*wave);}
 }a.needsUpdate=true;
 }
 }
 }
 if(cameraTween){
  const t=Math.min(1,(performance.now()-cameraTween.start)/cameraTween.duration),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  camera.position.lerpVectors(cameraTween.fromPosition,cameraTween.toPosition,e);controls.target.lerpVectors(cameraTween.fromTarget,cameraTween.toTarget,e);camera.lookAt(controls.target);if(t>=1)cameraTween=null;
 }
 controls.update();renderer.render(scene,camera);
 layoutLabels();
}
function layoutLabels(){
 const items=[...labelPool];if(!important.includes(state.selected))items.push({id:state.selected,el:selectedLabel});else selectedLabel.hidden=true;
 const bounds=$('#viewport').getBoundingClientRect();const occupied=[];
 items.sort((a,b)=>(b.id===state.selected)-(a.id===state.selected));
 for(const {id,el} of items){const p=byId.get(id);positionLabel(el,p);if(el.hidden)continue;
 let y=parseFloat(el.style.top),x=parseFloat(el.style.left);
 x=Math.max(4,Math.min(bounds.width-el.offsetWidth-42,x));
 y=Math.max(78,Math.min(bounds.height-92,y));
 if(occupied.some(r=>Math.abs(r.y-y)<25&&Math.abs(r.x-x)<150)&&id!==state.selected){el.hidden=true;continue;}
 if(y>bounds.height-80&&id!==state.selected){el.hidden=true;continue;}
 el.style.left=x+'px';el.style.top=Math.min(y,bounds.height-80)+'px';occupied.push({x,y});
 }
}
$('#loading').remove();localize();initVisitorCounter($('#visitorCounter'),state.lang);resize();resetCamera();requestAnimationFrame(animate);
loadDetailedModels(parts,({completed,total,failures})=>{
 $('#modelStatus').textContent=tr('โมเดลละเอียด ','Detailed models ')+completed+'/'+total+(failures.length?tr(' · บางชิ้นใช้รูปทรงย่อ',' · Some simplified fallbacks'):'');applyAppearance();
}).then(({failures})=>{modelLoading=false;modelFailures=failures.length;$('#modelStatus').textContent=failures.length?tr('โหลดบางชิ้นไม่สำเร็จ — กดรีโหลดเพื่อลองอีกครั้ง','Some models failed — reload to retry'):tr('โมเดลกายวิภาคพร้อมแล้ว','Anatomical models ready');$('#modelStatus').classList.add('ready');});

window.addEventListener('error',()=>toast(tr('เกิดข้อผิดพลาด กรุณาโหลดหน้าใหม่','An error occurred. Please reload.')));
