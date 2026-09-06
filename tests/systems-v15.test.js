import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy} from '../src/anatomy.js';
import {partHasSystem} from '../src/anatomy-schema.js';
import {lessons} from '../src/lesson-data.js';
const {parts}=buildAnatomy();const byId=new Map(parts.map(p=>[p.id,p]));const count=s=>parts.filter(p=>partHasSystem(p,s)).length;

test('v1.5 digestive pathway spans oral cavity through anus with accessory ducts',()=>{
 for(const id of ['oral-cavity','parotid-gland-1','submandibular-gland-1','sublingual-gland-1','upper-incisors','pharynx','cecum','ascending-colon','transverse-colon','descending-colon','sigmoid-colon','anal-canal','anus','common-bile-duct','pancreatic-duct'])assert.ok(byId.has(id),id);
 assert.ok(count('digestive')>=35);assert.ok(lessons.digestive.steps.length>=11);
});

test('v1.5 urinary model includes kidney layers and nephron teaching anatomy',()=>{
 for(const id of ['renal-cortex-1','renal-medulla-1','renal-pelvis-1','renal-pyramid-1-1','renal-calyces-1','nephron','glomerulus','bowman-capsule','proximal-tubule','loop-henle','distal-tubule','collecting-duct'])assert.ok(byId.has(id),id);
 assert.ok(count('urinary')>=25);assert.ok(lessons.urinary.steps.length>=10);
});

test('v1.5 respiratory model reaches bronchioles, alveoli and pleura',()=>{
 for(const id of ['pharynx','epiglottis','pleura-1','bronchioles-1','alveolar-sac-1','alveolus-1-1','maxillary-sinus-1','frontal-sinus-1'])assert.ok(byId.has(id),id);
 assert.ok(count('respiratory')>=30);assert.ok(lessons.respiratory.steps.length>=9);
});

test('v1.5 circulation includes coronary, conduction and distal vessel teaching paths',()=>{
 for(const id of ['pericardium','myocardium','endocardium','sa-node','av-node','bundle-his','purkinje-network','left-coronary-artery','right-coronary-artery','great-cardiac-vein','coronary-sinus','superior-vena-cava','inferior-vena-cava','subclavian-artery-1','radial-artery-1','ulnar-artery-1','common-iliac-artery-1','common-iliac-vein-1','anterior-tibial-artery-1','posterior-tibial-artery-1'])assert.ok(byId.has(id),id);
 assert.ok(count('circulatory')>=60);assert.ok(lessons.circulation.steps.length>=12);
 for(const id of ['left-coronary-artery','superior-vena-cava','radial-artery-1','common-iliac-vein-1'])assert.ok(byId.get(id).flowPaths?.length,id);
});
