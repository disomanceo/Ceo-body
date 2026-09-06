import * as THREE from 'three';
import {extendedMappings} from './extended-mappings.js';
const basicMappings=[
 ['heart',['FMA7274']],['lung-right',['FMA7333','FMA7383','FMA7337']],['lung-left',['FMA7370','FMA7371']],
 ['liver',['FMA7197']],['stomach',['FMA7148']],['pancreas',['FMA7198nsn']],['kidney--1',['FMA7204']],['kidney-1',['FMA7205']],
 ['spleen',['FMA7196']],['bladder',['FMA15900']],['gallbladder',['FMA7202']],['esophagus',['FMA7131']],['trachea',['FMA7394']],
 ['small-intestine',['FMA7206','FMA7207','FMA7208']],['large-intestine',['FMA14543nsn']],
 ['mandible',['FMA52748']],['humerus--1',['FMA23130']],['humerus-1',['FMA23131']],['femur--1',['FMA24474']],['femur-1',['FMA24475']]
];
const mappings=[...new Map([...basicMappings,...extendedMappings]).entries()];
export const detailedGroupCount=mappings.length;
const children={
 'heart':[['tricuspid','FMA7234'],['mitral','FMA7235'],['pulmonary-valve','FMA7246']],
 'lung-right':[['right-upper-lobe','FMA7333'],['right-middle-lobe','FMA7383'],['right-lower-lobe','FMA7337']],
 'lung-left':[['left-upper-lobe','FMA7370'],['left-lower-lobe','FMA7371']],
 'small-intestine':[['duodenum','FMA7206'],['jejunum','FMA7207'],['ileum','FMA7208']]
};
export const detailedChildCount=Object.values(children).reduce((sum,items)=>sum+items.length,0);
export const detailedAssetCount=new Set([
 ...mappings.flatMap(([,ids])=>ids),
 ...Object.values(children).flat().map(([,asset])=>asset)
]).size;
export async function loadDetailedModels(parts,onProgress){
 const lookup=new Map(parts.map(p=>[p.id,p])),cache=new Map();
 async function geometry(id){
 if(!cache.has(id))cache.set(id,(async()=>{
 const r=await fetch('/models/'+id+'.bin');if(!r.ok)throw Error(id+': '+r.status);
 const b=await r.arrayBuffer(),v=new DataView(b),count=v.getUint32(0,true),indices=v.getUint32(4,true);
 if(b.byteLength!==8+count*12+indices*4)throw Error('Invalid mesh '+id);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(b,8,count*3).slice(),3));g.setIndex(new THREE.BufferAttribute(new Uint32Array(b,8+count*12,indices).slice(),1));
 g.rotateX(-Math.PI/2);g.computeVertexNormals();g.computeBoundingBox();return g;
 })());return (await cache.get(id)).clone();
 }
 function replace(p,geometries,transform){
 const old=[...p.group.children].filter(o=>o.userData.partId);
 const color=old.find(o=>o.material?.color)?.material.color.clone()||new THREE.Color('#cba192');
 for(const o of old){p.group.remove(o);o.geometry?.dispose();o.material?.dispose();}
 for(const g of geometries){g.translate(-transform.center.x,-transform.center.y,-transform.center.z);g.scale(...transform.scale.toArray());g.translate(...transform.localCenter.toArray());g.computeVertexNormals();
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color,roughness:.57,side:THREE.DoubleSide}));m.userData.partId=p.id;m.userData.detailed=true;p.group.add(m);}
 p.detailed=true;
 }
 let completed=0,failures=[];const jobs=[...mappings];
 async function worker(){while(jobs.length){const [id,ids]=jobs.shift(),p=lookup.get(id);if(!p)continue;
 try{
 const gs=await Promise.all(ids.map(geometry)),source=new THREE.Box3();for(const g of gs)source.union(g.boundingBox);
 const target=new THREE.Box3();p.group.children.filter(o=>o.userData.partId).forEach(o=>{o.updateMatrix();o.geometry.computeBoundingBox();target.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrix));});const size=target.getSize(new THREE.Vector3()),srcSize=source.getSize(new THREE.Vector3());
 const tf={center:source.getCenter(new THREE.Vector3()),scale:size.divide(srcSize),localCenter:target.getCenter(new THREE.Vector3())};
 replace(p,gs,tf);
 for(const [childId,asset]of children[id]||[]){
 const c=lookup.get(childId),g=await geometry(asset);
 // Share the parent's fit so adjoining lobes remain aligned.
 g.translate(-tf.center.x,-tf.center.y,-tf.center.z);g.scale(...tf.scale.toArray());g.translate(...tf.localCenter.clone().add(p.base).sub(c.base).toArray());
 const old=[...c.group.children];old.forEach(o=>{c.group.remove(o);o.geometry?.dispose();o.material?.dispose();});
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:gs[0]&&p.group.children.find(o=>o.userData.detailed).material.color,roughness:.57,side:THREE.DoubleSide}));m.userData.partId=c.id;m.userData.detailed=true;c.group.add(m);c.detailed=true;
 }
 }catch(e){failures.push(id);console.error('Model load failed',id,e);}
 completed++;onProgress({completed,total:mappings.length,failures});
 }}
 await Promise.all([worker(),worker(),worker()]);
 return {completed,failures};
}
