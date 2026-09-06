import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonOrder} from '../src/lesson-data.js';
import {createQuiz,getQuiz,quizLength,quizzes,scoreQuiz} from '../src/quiz-data.js';

test('Every guided lesson has a bilingual six-question bank',()=>{
  assert.equal(Object.keys(quizzes).length,12);
  for(const id of lessonOrder){
    const quiz=getQuiz(id);assert.equal(quiz.length,6,id);assert.equal(quizLength(id),5,id);
    for(const [i,q] of quiz.entries()){
      assert.ok(q.q[0]&&q.q[1],`${id}:${i}:question`);
      assert.equal(q.options.length,4,`${id}:${i}:options`);
      assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,`${id}:${i}:answer`);
      assert.ok(q.explain[0]&&q.explain[1],`${id}:${i}:explain`);
      for(const option of q.options)assert.ok(option[0]&&option[1],`${id}:${i}:option`);
    }
  }
});

test('Random quiz draws five unique questions from each six-question bank',()=>{
  for(const id of lessonOrder){
    const quiz=createQuiz(id,5,()=>0.37);
    assert.equal(quiz.length,5,id);
    assert.equal(new Set(quiz).size,5,id);
    for(const q of quiz)assert.ok(getQuiz(id).includes(q),id);
  }
});

test('Quiz scoring is deterministic and bounded',()=>{
  for(const id of lessonOrder){
    const quiz=getQuiz(id),perfect=quiz.map(q=>q.answer),wrong=quiz.map(q=>(q.answer+1)%4);
    assert.equal(scoreQuiz(id,perfect),quiz.length,id);
    assert.equal(scoreQuiz(id,wrong),0,id);
    assert.equal(scoreQuiz(id,[]),0,id);
  }
  assert.deepEqual(getQuiz('missing'),[]);
});
