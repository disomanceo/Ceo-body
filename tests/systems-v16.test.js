import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy} from '../src/anatomy.js';
import {partHasSystem} from '../src/anatomy-schema.js';
import {lessons} from '../src/lesson-data.js';

const {parts}=buildAnatomy();
const byId=new Map(parts.map(p=>[p.id,p]));
const count=id=>parts.filter(p=>partHasSystem(p,id)).length;

test('v1.6 muscular model adds head/neck, rotator cuff, posture, hip and ankle muscles',()=>{
  for(const id of ['masseter-1','temporalis-1','sternocleidomastoid-1','serratus-anterior-1','erector-spinae-1','supraspinatus-1','infraspinatus-1','teres-minor-1','subscapularis-1','brachialis-1','forearm-extensors-1','iliopsoas-1','gluteus-medius-1','sartorius-1','adductors-1','soleus-1','fibularis-longus-1'])assert.ok(byId.has(id),id);
  assert.ok(count('muscular')>=60);
  assert.ok(lessons.muscular.steps.length>=11);
});

test('v1.6 original major muscles have specific actions rather than generic system text',()=>{
  const expected={
    'biceps-1':'elbow',
    'triceps-1':'elbow',
    'deltoid-1':'abduct',
    'quadriceps-1':'knee',
    'gastrocnemius-1':'plantar'
  };
  for(const [id,word] of Object.entries(expected))assert.ok(byId.get(id).desc[1].toLowerCase().includes(word),`${id}:${byId.get(id).desc[1]}`);
});

test('v1.6 skull and pelvis expose major component bones',()=>{
  for(const id of ['frontal-bone','parietal-bone-1','temporal-bone-1','occipital-bone','sphenoid-bone','ethmoid-bone','zygomatic-bone-1','maxilla-1','nasal-bone-1','ilium-1','ischium-1','pubis-1'])assert.ok(byId.has(id),id);
  assert.ok(lessons.skeletal.steps.length>=9);
  assert.equal(byId.get('frontal-bone').parent,'skull');
  assert.equal(byId.get('ilium-1').parent,'hip-1');
});
