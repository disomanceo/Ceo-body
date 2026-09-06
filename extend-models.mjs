import fs from 'node:fs/promises';
import {buildAnatomy} from './src/anatomy.js';
const repo='https://api.github.com/repos/Kevin-Mattheus-Moerman/BodyParts3D',headers={'User-Agent':'Ceo-body anatomical education'};
const commit=await (await fetch(repo+'/commits/main',{headers})).json();if(!commit.sha)throw Error('Cannot resolve model source');
const source='https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/'+commit.sha+'/';
const [tree,txt,composite]=await Promise.all([
 fetch(repo+'/git/trees/'+commit.sha+'?recursive=1',{headers}).then(r=>r.json()),
 fetch(source+'assets/BodyParts3D_data/parts_list_e.txt').then(r=>r.text()),
 fetch(source+'assets/BodyParts3D_data/composite_parts.txt').then(r=>r.text())]);
const entries=txt.trim().split(/\r?\n/).map(l=>l.split('\t'));
const normalize=s=>s.toLowerCase().replace(/[–-]/g,' ').replace(/\s+/g,' ').trim();
const names=new Map(entries.map(([id,name])=>[normalize(name||''),id]));
const available=new Map(tree.tree.filter(x=>x.path.endsWith('.stl')).map(x=>[x.path.split('/').pop().replace('.stl',''),x.size]));
const groups=new Map();for(const line of composite.trim().split(/\r?\n/).slice(1)){const [parent,pn,child]=line.split('\t');if(!groups.has(parent))groups.set(parent,[]);if(available.has(child))groups.get(parent).push(child);}
const ord=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth'];
const overrides={brain:'cerebral hemisphere',brainstem:'brainstem',skull:'neurocranium',skin:'skin',cerebellum:'cerebellum',sacrum:'sacrum',coccyx:'coccyx'};
const mappings=[];const all=new Set();
for(const p of buildAnatomy().parts){
 if(p.parent)continue;
 let name=overrides[p.id]||p.en.toLowerCase();
 const vertebra=p.id.match(/^vertebra-([CTL])(\d+)$/);
 if(vertebra){const [,v,n]=vertebra;name=n==='1'&&v==='C'?'atlas':n==='2'&&v==='C'?'axis':ord[Number(n)-1]+' '+({C:'cervical',T:'thoracic',L:'lumbar'}[v])+' vertebra';}
 const rib=p.id.match(/^rib-(-?1)-(\d+)$/);if(rib)name=(rib[1]==='1'?'left':'right')+' '+ord[Number(rib[2])-1]+' rib';
 const id=names.get(normalize(name));if(!id)continue;
 const ids=available.has(id)?[id]:[...new Set(groups.get(id)||[])];
 if(!ids.length)continue;
 // Keep the expanded dataset focused on skeletal, muscle, head and envelope upgrades.
 if(!['skeletal','muscular','nervous','integumentary','sensory','endocrine','lymphatic'].includes(p.system))continue;
 if(ids.length>65)continue;
 mappings.push([p.id,ids]);ids.forEach(id=>all.add(id));
}
await fs.mkdir('assets/source-models',{recursive:true});await fs.mkdir('public/models',{recursive:true});
const manifest={revision:commit.sha,source,license:'CC-BY-SA-2.1-JP',mappings,models:[]};
const queue=[...all];let done=0;
async function job(){while(queue.length){const id=queue.shift();const out='assets/source-models/'+id+'.stl';
try{await fs.access(out);}catch{const response=await fetch(source+'assets/BodyParts3D_data/stl/'+id+'.stl');if(!response.ok)throw Error(id+' '+response.status);await fs.writeFile(out,Buffer.from(await response.arrayBuffer()));}
const b=await fs.readFile(out),n=b.readUInt32LE(80),step=id==='FMA7163'?2:1.15,cells=new Map(),points=[],indices=[],faces=new Set();
for(let t=0;t<n;t++){const tri=[];for(let k=0;k<3;k++){const j=84+t*50+12+k*12,p=[b.readFloatLE(j),b.readFloatLE(j+4),b.readFloatLE(j+8)],key=p.map(v=>Math.round(v/step)).join(',');let idx=cells.get(key);if(idx===undefined){idx=points.length/3;cells.set(key,idx);points.push(...p);}tri.push(idx);}if(new Set(tri).size!==3)continue;const key=[...tri].sort((a,b)=>a-b).join(',');if(faces.has(key))continue;faces.add(key);indices.push(...tri);}
const data=Buffer.alloc(8+points.length*4+indices.length*4);data.writeUInt32LE(points.length/3,0);data.writeUInt32LE(indices.length,4);points.forEach((v,i)=>data.writeFloatLE(v,8+i*4));indices.forEach((v,i)=>data.writeUInt32LE(v,8+points.length*4+i*4));
await fs.writeFile('public/models/'+id+'.bin',data);
manifest.models.push({id,sourceTriangles:n,triangles:indices.length/3,bytes:data.length,clusteringMm:step});done++;if(done%10===0)console.log(done+'/'+all.size+' models');
}}
await Promise.all([job(),job(),job()]);
await fs.writeFile('public/models/extended-manifest.json',JSON.stringify(manifest,null,2));
await fs.writeFile('src/extended-mappings.js','export const extendedMappings = '+JSON.stringify(mappings)+';\n');
console.log(JSON.stringify({groups:mappings.length,assets:all.size,bytes:manifest.models.reduce((s,m)=>s+m.bytes,0),mapped:mappings.map(x=>x[0])}));
