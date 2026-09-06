import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy} from '../src/anatomy.js';
import {partHasSystem} from '../src/anatomy-schema.js';
import {lessons} from '../src/lesson-data.js';

const {parts}=buildAnatomy();
const byId=new Map(parts.map(p=>[p.id,p]));
const inSystem=id=>parts.filter(p=>partHasSystem(p,id));

test('v1.3 nervous system includes central, autonomic and peripheral teaching anatomy',()=>{
  assert.ok(inSystem('nervous').length>=45);
  for(const id of ['frontal-lobe-1','parietal-lobe-1','temporal-lobe-1','occipital-lobe-1','thalamus','hypothalamus','corpus-callosum','midbrain','pons','medulla','trigeminal-nerve-1','vagus-nerve-1','brachial-plexus-1','radial-nerve-1','median-nerve-1','ulnar-nerve-1','lumbar-plexus-1','sacral-plexus-1','femoral-nerve-1','sciatic-nerve-1','tibial-nerve-1','common-fibular-nerve-1','sympathetic-chain-1'])assert.ok(byId.has(id),id);
  assert.ok(lessons.nervous.steps.length>=9);
});

test('v1.3 sensory system includes selectable eye, ear, smell and taste components',()=>{
  assert.ok(inSystem('sensory').length>=35);
  for(const id of ['cornea-1','iris-1','lens-1','retina-1','optic-nerve-1','ear-canal-1','tympanic-membrane-1','malleus-1','incus-1','stapes-1','cochlea-1','semicircular-canals-1','vestibule-1','vestibulocochlear-nerve-1','olfactory-bulb-1','olfactory-epithelium-1','taste-buds'])assert.ok(byId.has(id),id);
  assert.ok(lessons.sensory.steps.length>=10);
});

test('New nervous and sensory teaching geometry is finite and selectable',()=>{
  for(const id of ['thalamus','hypothalamus','sciatic-nerve-1','cornea-1','cochlea-1','taste-buds']){
    const p=byId.get(id);assert.ok(p?.group.children.length,id);
    p.group.traverse(o=>{if(!o.isMesh)return;const values=o.geometry.attributes.position.array;for(const n of values)assert.ok(Number.isFinite(n),id);});
  }
});
