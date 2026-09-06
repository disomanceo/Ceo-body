import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy,systems} from '../src/anatomy.js';
import {partHasSystem,partSystems,teachingField,validateAnatomyParts} from '../src/anatomy-schema.js';
import {lessonOrder,lessons} from '../src/lesson-data.js';

const {parts}=buildAnatomy();
const byId=new Map(parts.map(p=>[p.id,p]));
const systemIds=Object.keys(systems);

test('Anatomy schema exposes valid multi-system memberships',()=>{
  assert.deepEqual(validateAnatomyParts(parts,systemIds),[]);
  for(const p of parts){
    assert.ok(Array.isArray(p.systems)&&p.systems.length>=1,p.id);
    assert.equal(p.systems[0],p.system,p.id);
    assert.equal(new Set(p.systems).size,p.systems.length,p.id);
  }
});

test('Cross-system structures are discoverable in every teaching system',()=>{
  const expected={
    pancreas:['digestive','endocrine'],
    tongue:['digestive','sensory'],
    'nasal-cavity':['respiratory','sensory'],
    'ovary-1':['reproductive','endocrine'],
    'testis-1':['reproductive','endocrine'],
    spleen:['lymphatic','circulatory']
  };
  for(const [id,ids] of Object.entries(expected)){
    const p=byId.get(id);assert.ok(p,id);
    for(const system of ids)assert.equal(partHasSystem(p,system),true,`${id}:${system}`);
    assert.deepEqual(partSystems(p),ids,id);
  }
});

test('Every selectable structure has bilingual teaching metadata in four dimensions',()=>{
  for(const p of parts){
    for(const key of ['function','location','relations','clinical']){
      const value=teachingField(p,key);
      assert.ok(value[0]&&value[1],`${p.id}:${key}`);
    }
  }
});

test('Every guided lesson still references real anatomy IDs after schema enrichment',()=>{
  for(const lessonId of lessonOrder){
    for(const step of lessons[lessonId].steps){
      for(const id of step.parts)assert.ok(byId.has(id),`${lessonId}:${step.id}:${id}`);
    }
  }
});

test('Sex variants remain explicit and valid',()=>{
  for(const p of parts)if(p.variant)assert.ok(['female','male'].includes(p.variant),p.id);
});
