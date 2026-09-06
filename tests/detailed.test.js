import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {buildAnatomy} from '../src/anatomy.js';
import {detailedAssetCount,detailedChildCount,detailedGroupCount,loadDetailedModels} from '../src/detailed-models.js';
test('Detailed assets load, preserve part mapping and retain finite geometry',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async(url)=>{try{const b=await fs.readFile(new URL('../public'+url,import.meta.url));return new Response(b);}catch{return new Response('',{status:404});}};
 try{
 const {parts}=buildAnatomy();let last;
 const result=await loadDetailedModels(parts,p=>last=p);
 assert.deepEqual(result.failures,[]);assert.equal(last.completed,last.total);
 const detailed=parts.filter(p=>p.detailed);assert.equal(detailed.length,detailedGroupCount+detailedChildCount);
 for(const p of detailed){assert.ok(p.group.children.some(o=>o.userData.detailed));for(const m of p.group.children.filter(o=>o.userData.detailed)){
 assert.equal(m.userData.partId,p.id);for(const n of m.geometry.attributes.position.array)assert.ok(Number.isFinite(n),p.id);
 m.geometry.computeBoundingBox();const span=m.geometry.boundingBox.max.distanceTo(m.geometry.boundingBox.min);assert.ok(span<(p.id==='skin'?25:8),p.id);
 }}
 for(const id of ['tricuspid','mitral','pulmonary-valve','right-upper-lobe','left-lower-lobe','duodenum','jejunum','ileum'])assert.ok(parts.find(p=>p.id===id).detailed);
 }finally{globalThis.fetch=original;}
});
test('Failed downloads report explicit fallbacks instead of aborting the scene',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>new Response('',{status:503});
 const errors=console.error;console.error=()=>{};
 try{const {parts}=buildAnatomy();const result=await loadDetailedModels(parts,()=>{});assert.equal(result.failures.length,detailedGroupCount);assert.ok(parts.every(p=>p.group.children.length));}
 finally{globalThis.fetch=original;console.error=errors;}
});
test('Every packaged optimized BodyParts3D asset is wired into the detailed mapping',async()=>{
 const files=await fs.readdir(new URL('../public/models/',import.meta.url));
 assert.equal(files.filter(name=>name.endsWith('.bin')).length,detailedAssetCount);
});
