import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy} from '../src/anatomy.js';
import {partHasSystem} from '../src/anatomy-schema.js';
import {lessons} from '../src/lesson-data.js';

const {parts}=buildAnatomy();
const byId=new Map(parts.map(p=>[p.id,p]));
const count=id=>parts.filter(p=>partHasSystem(p,id)).length;

test('v1.4 integumentary model exposes skin layers, appendages, glands and receptors',()=>{
  for(const id of ['epidermis','dermis','hypodermis','hair-shaft','hair-follicle','sebaceous-gland','sweat-gland','arrector-pili','cutaneous-receptor','cutaneous-vessel','nail-plate'])assert.ok(byId.has(id),id);
  assert.ok(count('integumentary')>=12);
  assert.ok(lessons.integumentary.steps.length>=8);
});

test('v1.4 endocrine model includes parathyroids, adrenal layers and pancreatic islets',()=>{
  for(const id of ['thyroid-isthmus','parathyroid-1-1','parathyroid--1-2','adrenal-cortex-1','adrenal-medulla-1','pancreatic-islet-3'])assert.ok(byId.has(id),id);
  assert.ok(count('endocrine')>=25);
  assert.ok(lessons.endocrine.steps.length>=9);
});

test('v1.4 lymphatic model includes transport ducts, limb vessels and immune tissues',()=>{
  for(const id of ['thoracic-duct','right-lymphatic-duct','cisterna-chyli','palatine-tonsil-1','popliteal-nodes-1','upper-limb-lymphatics-1','lower-limb-lymphatics-1','mesenteric-node-3','intestinal-lacteals','red-bone-marrow'])assert.ok(byId.has(id),id);
  assert.ok(count('lymphatic')>=25);
  assert.ok(lessons.lymphatic.steps.length>=10);
});

test('v1.4 cross-system teaching structures retain multi-system membership',()=>{
  assert.ok(partHasSystem(byId.get('cutaneous-receptor'),'sensory'));
  assert.ok(partHasSystem(byId.get('cutaneous-vessel'),'circulatory'));
  assert.ok(partHasSystem(byId.get('intestinal-lacteals'),'digestive'));
  assert.ok(partHasSystem(byId.get('red-bone-marrow'),'skeletal'));
  assert.ok(partHasSystem(byId.get('pancreatic-islet-3'),'digestive'));
});
