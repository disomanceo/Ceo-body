import test from 'node:test';
import assert from 'node:assert/strict';
import {bloodFlowProgress,breathingState,heartScale,intestinalRadiusScale,intestinalTubeScale} from '../src/physiology.js';

test('Heart contraction remains bounded and returns to rest',()=>{
  assert.equal(heartScale(0),1);
  for(let t=0;t<=20;t+=0.01){const s=heartScale(t);assert.ok(s<=1&&s>=0.86,`heart scale ${s} at ${t}`);}
});

test('Breathing remains bounded and diaphragm offset cannot drift',()=>{
  for(let t=0;t<=30;t+=0.02){
    const b=breathingState(t);
    assert.ok(b.phase>=0&&b.phase<=1);
    assert.ok(b.diaphragmOffset<=0&&b.diaphragmOffset>=-0.1600001);
    assert.ok(b.lungScale[0]>=1&&b.lungScale[0]<=1.0650001);
    assert.ok(b.lungScale[1]>=1&&b.lungScale[1]<=1.0250001);
    assert.ok(b.lungScale[2]>=1&&b.lungScale[2]<=1.0550001);
  }
});

test('Intestinal teaching animation only produces gentle contractions',()=>{
  for(let t=0;t<=10;t+=0.05){
    for(let y=-3;y<=3;y+=0.1){const s=intestinalRadiusScale(y,t);assert.ok(s>=0.975&&s<=1);}
    for(let p=0;p<=1;p+=0.02){const s=intestinalTubeScale(p,t);assert.ok(s>=0.91&&s<=1);}
  }
});

test('Blood-flow progress stays continuous and bounded under pulsatile motion',()=>{
  let previous=bloodFlowProgress(0,0.17,0.22,0.55);
  for(let t=0.002;t<=8;t+=0.002){
    const current=bloodFlowProgress(t,0.17,0.22,0.55);
    assert.ok(current>=0&&current<1);
    const forward=(current-previous+1)%1;
    assert.ok(forward<0.02,`blood particle jumped ${forward} at ${t}`);
    previous=current;
  }
});
