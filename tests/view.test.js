import test from 'node:test';
import assert from 'node:assert/strict';
import {isPointerClick,sphereFitDistance,viewMoveStep} from '../src/view-utils.js';

test('Camera framing distance keeps the model centered and fully inside the limiting FOV',()=>{
  const landscape=sphereFitDistance(9,35,16/9,1.12);
  const portrait=sphereFitDistance(9,35,9/16,1.12);
  assert.ok(landscape>9);
  assert.ok(portrait>landscape);
  assert.equal(sphereFitDistance(0,35,1,1.12),0.8);
  assert.equal(sphereFitDistance(1,0,1,1.12),0.8);
});

test('Pointer drag threshold separates orbit gestures from deliberate clicks',()=>{
  assert.equal(isPointerClick({x:100,y:100},{x:104,y:104}),true);
  assert.equal(isPointerClick({x:100,y:100},{x:108,y:100}),false);
  assert.equal(isPointerClick(null,{x:100,y:100}),false);
});

test('View navigation step scales with zoom without becoming too small or too large',()=>{
  assert.equal(viewMoveStep(0),0.35);
  assert.equal(viewMoveStep(1),0.35);
  assert.ok(viewMoveStep(10)>0.35&&viewMoveStep(10)<2.2);
  assert.equal(viewMoveStep(100),2.2);
});
