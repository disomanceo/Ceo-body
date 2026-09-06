import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAnatomy} from '../src/anatomy.js';
import {circulationLessonSteps,getLesson,lessonOrder,lessons,lessonStepAt} from '../src/lesson-data.js';

const {parts}=buildAnatomy();
const ids=new Set(parts.map(p=>p.id));

test('Guided lesson engine exposes all twelve bilingual system lessons',()=>{
  assert.deepEqual(lessonOrder,['circulation','respiratory','digestive','nervous','urinary','skeletal','muscular','endocrine','lymphatic','reproductive','sensory','integumentary']);
  assert.equal(Object.keys(lessons).length,12);
  assert.ok(circulationLessonSteps.length>=8);
  for(const id of lessonOrder){
    const lesson=getLesson(id);assert.ok(lesson,id);assert.ok(lesson.title[0]&&lesson.title[1],id);assert.ok(lesson.start[0]&&lesson.start[1],id);assert.ok(lesson.steps.length>=4,id);
    assert.ok(lesson.simulation&&typeof lesson.simulation==='object',id);
    for(const step of lesson.steps){
      assert.ok(step.id&&step.title[0]&&step.title[1],`${id}:${step.id}`);
      assert.ok(step.body[0]&&step.body[1],`${id}:${step.id}`);
      assert.ok(step.parts.length>=1,`${id}:${step.id}`);
      assert.ok(step.margin>=1&&step.margin<=1.7,`${id}:${step.id}`);
      for(const partId of step.parts)assert.ok(ids.has(partId),`${id}:${step.id}:${partId}`);
    }
  }
});

test('Lesson step lookup works for every lesson and clamps safely',()=>{
  for(const id of lessonOrder){const lesson=getLesson(id);assert.equal(lessonStepAt(id,-4).id,lesson.steps[0].id);assert.equal(lessonStepAt(id,999).id,lesson.steps.at(-1).id);}
  assert.equal(lessonStepAt(3).id,'gas-exchange');
  assert.equal(getLesson('missing'),null);
});

test('Lesson content covers major physiological routes',()=>{
  const coverage=Object.fromEntries(lessonOrder.map(id=>[id,new Set(lessons[id].steps.flatMap(s=>s.parts))]));
  for(const id of ['pulmonary-artery-1','pulmonary-vein-1','aorta','vena-cava','portal-vein'])assert.ok(coverage.circulation.has(id),id);
  for(const id of ['nasal-cavity','trachea','bronchus-1','lung-left','diaphragm'])assert.ok(coverage.respiratory.has(id),id);
  for(const id of ['tongue','esophagus','stomach','liver','pancreas','small-intestine','large-intestine'])assert.ok(coverage.digestive.has(id),id);
  for(const id of ['brain','cerebellum','brainstem','spinal-cord','eye-1','ear-1'])assert.ok(coverage.nervous.has(id),id);
  for(const id of ['kidney-1','ureter-1','bladder','urethra','renal-artery-1'])assert.ok(coverage.urinary.has(id),id);
});

test('Each animated guided lesson activates a distinct teaching simulation',()=>{
  assert.equal(lessons.circulation.simulation.blood,true);
  assert.equal(lessons.respiratory.simulation.air,true);
  assert.equal(lessons.digestive.simulation.gut,true);
  assert.equal(lessons.nervous.simulation.signal,true);
  assert.equal(lessons.urinary.simulation.urine,true);
});

test('Reproductive lesson switches between female and male teaching anatomy',()=>{
  const sexes=new Set(lessons.reproductive.steps.map(s=>s.sex));
  assert.deepEqual([...sexes],['female','male']);
  const covered=new Set(lessons.reproductive.steps.flatMap(s=>s.parts));
  for(const id of ['uterus','cervix','vulva','clitoris','prostate','penis','scrotum','epididymis-1','vas-deferens-1','seminal-vesicle-1','ejaculatory-duct-1','bulbourethral-1'])assert.ok(covered.has(id),id);
});
