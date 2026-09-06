import fs from 'node:fs/promises';
await fs.mkdir('assets/source-models',{recursive:true});
const manifest=JSON.parse(await fs.readFile('public/models/source-manifest.json','utf8'));
for(const m of manifest.models.filter(m=>!m.missing)){
 const input='public/models/'+m.id+'.stl',b=await fs.readFile(input),n=b.readUInt32LE(80);
 const cells=new Map(),points=[],indices=[],faces=new Set(),step=.9;
 for(let t=0;t<n;t++){
 const tri=[];
 for(let k=0;k<3;k++){const j=84+t*50+12+k*12,p=[b.readFloatLE(j),b.readFloatLE(j+4),b.readFloatLE(j+8)],key=p.map(v=>Math.round(v/step)).join(',');
 let idx=cells.get(key);if(idx===undefined){idx=points.length/3;cells.set(key,idx);points.push(...p);}tri.push(idx);}
 if(new Set(tri).size!==3)continue;
 const key=[...tri].sort((a,b)=>a-b).join(',');if(faces.has(key))continue;faces.add(key);indices.push(...tri);
 }
 const out=Buffer.alloc(8+points.length*4+indices.length*4);out.writeUInt32LE(points.length/3,0);out.writeUInt32LE(indices.length,4);
 points.forEach((v,i)=>out.writeFloatLE(v,8+i*4));indices.forEach((v,i)=>out.writeUInt32LE(v,8+points.length*4+i*4));
 await fs.writeFile('public/models/'+m.id+'.bin',out);await fs.rename(input,'assets/source-models/'+m.id+'.stl');
 m.optimizedVertices=points.length/3;m.optimizedTriangles=indices.length/3;m.bytes=out.length;
}
manifest.modifications='Vertex clustering at 0.9 mm; binary indexed mesh encoding. Runtime rotates source Z-up to Y-up and fits each major organ to the teaching body. Not a scan-equivalent representation.';
await fs.writeFile('public/models/source-manifest.json',JSON.stringify(manifest,null,2));
console.log(manifest.models.filter(m=>!m.missing).length+' assets optimized; '+manifest.models.reduce((s,m)=>s+(m.bytes||0),0)+' bytes');
