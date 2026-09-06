import fs from 'node:fs/promises';
const base='https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/main/';
const headers={'User-Agent':'Ceo-body educational model importer'};
const tree=await (await fetch('https://api.github.com/repos/Kevin-Mattheus-Moerman/BodyParts3D/git/trees/main?recursive=1',{headers})).json();
const files=new Map(tree.tree.map(x=>[x.path,x]));
await fs.mkdir('public/models',{recursive:true});
const ids=['FMA7274','FMA7333','FMA7337','FMA7370','FMA7371','FMA7383','FMA7197','FMA7148','FMA7198nsn','FMA7204','FMA7205','FMA7196','FMA15900','FMA7202','FMA7131','FMA7394','FMA7206','FMA7207','FMA7208','FMA14543nsn','FMA52748','FMA23130','FMA23131','FMA24474','FMA24475','FMA7098','FMA7101','FMA7096','FMA7097','FMA7234','FMA7235','FMA7246'];
const result=[];
for(const id of ids){const path='assets/BodyParts3D_data/stl/'+id+'.stl';if(!files.has(path)){result.push({id,missing:true});continue;}
const out='public/models/'+id+'.stl';try{await fs.access(out);}catch{const r=await fetch(base+path,{headers});if(!r.ok)throw Error(id+' HTTP '+r.status);await fs.writeFile(out,Buffer.from(await r.arrayBuffer()));}
const b=await fs.readFile(out);const n=b.readUInt32LE(80);const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let t=0;t<n;t++)for(let k=0;k<3;k++)for(let a=0;a<3;a++){const v=b.readFloatLE(84+t*50+12+k*12+a*4);min[a]=Math.min(min[a],v);max[a]=Math.max(max[a],v);}
result.push({id,triangles:n,min,max});console.log(id+' '+n+' triangles');
}
await fs.writeFile('public/models/source-manifest.json',JSON.stringify({source:base,revision:tree.sha,license:'CC-BY-SA-2.1-JP',attribution:'BodyParts3D, (c) The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan',models:result},null,2));
console.log(JSON.stringify(result));
