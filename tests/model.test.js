import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy,systems} from '../src/anatomy.js';
const {parts,root}=buildAnatomy();
test('Every selectable structure has a unique ID and bilingual teaching content',()=>{
 assert.ok(parts.length>200);
 assert.equal(new Set(parts.map(p=>p.id)).size,parts.length);
 for(const p of parts){assert.ok(p.th&&p.en&&p.desc[0]&&p.desc[1],p.id);assert.ok(systems[p.system]);assert.ok(p.group.children.length);}
});
test('All twelve body systems are represented',()=>assert.equal(new Set(parts.map(p=>p.system)).size,12));
test('Anatomical laterality and organ arrangement',()=>{
 const p=id=>parts.find(p=>p.id===id);
 assert.ok(p('lung-left').base.x>0);assert.ok(p('lung-right').base.x<0);
 assert.ok(p('heart').base.x>0);assert.ok(p('liver').base.x<0);
 assert.ok(p('diaphragm').base.y<p('lung-left').base.y);
 assert.ok(p('bladder').base.y<p('kidney-1').base.y);
 assert.ok(p('brain').base.y>p('trachea').base.y);
});
test('Female and male anatomy remain separately selectable',()=>{
 const female=parts.filter(p=>p.variant==='female'),male=parts.filter(p=>p.variant==='male');
 assert.ok(female.length>=13);assert.ok(male.length>=15);
 assert.equal(parts.find(p=>p.id==='uterus').variant,'female');
 assert.equal(parts.find(p=>p.id==='cervix').variant,'female');
 assert.equal(parts.find(p=>p.id==='vulva').variant,'female');
 assert.equal(parts.find(p=>p.id==='clitoris').variant,'female');
 assert.equal(parts.find(p=>p.id==='prostate').variant,'male');
 for(const id of ['penis','scrotum','epididymis-1','vas-deferens-1','seminal-vesicle-1','ejaculatory-duct-1','bulbourethral-1'])assert.equal(parts.find(p=>p.id===id)?.variant,'male',id);
});
test('Every mesh has finite geometry and maps back to a selectable structure',()=>{
 let meshes=0;const ids=new Set(parts.map(p=>p.id));
 root.traverse(o=>{if(!o.isMesh)return;meshes++;assert.ok(ids.has(o.userData.partId));const a=o.geometry.attributes.position.array;for(const n of a)assert.ok(Number.isFinite(n));});
 assert.ok(meshes>400);
});
test('Both intestinal animation paths remain valid throughout their length',()=>{
 for(const id of ['small-intestine','large-intestine']){
 const path=parts.find(p=>p.id===id).path;assert.ok(path.getLength()>5);
 for(let i=0;i<=100;i++)assert.ok(path.getPointAt(i/100).toArray().every(Number.isFinite));
 }
});
test('Major blood vessels expose anatomically directed flow paths',()=>{
 const vessels=['aorta','vena-cava','pulmonary-artery--1','pulmonary-artery-1','pulmonary-vein--1','pulmonary-vein-1'];
 for(const id of vessels){const p=parts.find(p=>p.id===id);assert.ok(p.flowPaths?.length,id);for(const stream of p.flowPaths){assert.ok([1,-1].includes(stream.direction));assert.ok(stream.rate>0);for(let i=0;i<=50;i++)assert.ok(stream.curve.getPointAt(i/50).toArray().every(Number.isFinite),id);}}
 assert.equal(parts.find(p=>p.id==='aorta').flowPaths[0].oxygenated,true);
 assert.equal(parts.find(p=>p.id==='pulmonary-artery-1').flowPaths[0].oxygenated,false);
 assert.equal(parts.find(p=>p.id==='pulmonary-vein-1').flowPaths[0].direction,-1);
});
test('Systemic teaching circulation reaches head, arms, kidneys, liver and legs',()=>{
 const required=['carotid-artery-1','jugular-vein-1','brachial-artery--1','brachial-vein--1','renal-artery-1','renal-vein-1','hepatic-artery','hepatic-vein','portal-vein','femoral-artery-1','femoral-vein-1'];
 for(const id of required){const p=parts.find(p=>p.id===id);assert.ok(p?.flowPaths?.length,id);}
 assert.equal(parts.filter(p=>p.flowPaths?.length).length,25);
 assert.equal(parts.find(p=>p.id==='portal-vein').flowPaths[0].color,0xa876d6);
});
test('Teaching motion paths exist for air, food, neural signal and urine',()=>{
 const p=id=>parts.find(x=>x.id===id);
 for(const id of ['trachea','bronchus--1','bronchus-1'])assert.ok(p(id).airPath?.getLength()>0,id);
 assert.ok(p('esophagus').foodPath?.getLength()>0);
 assert.ok(p('spinal-cord').signalPath?.getLength()>0);
 for(const id of ['ureter--1','ureter-1','urethra'])assert.ok(p(id).urinePath?.getLength()>0,id);
});
console.log('Ceo-body: '+parts.length+' selectable structures across '+Object.keys(systems).length+' systems');
