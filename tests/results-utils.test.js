import test from 'node:test';
import assert from 'node:assert/strict';
import {attemptPercent,bestAttempt,resultsCsv,summarizeHistories} from '../src/results-utils.js';

test('Result percentages compare legacy three-question and new five-question attempts fairly',()=>{
  const history=[{score:4,total:5,at:'2026-09-06T10:00:00.000Z'},{score:3,total:3,at:'2026-09-05T10:00:00.000Z'}];
  assert.equal(attemptPercent(history[0]),80);
  assert.equal(attemptPercent(history[1]),100);
  assert.equal(bestAttempt(history),history[1]);
});

test('Teacher analytics summarizes attempted systems, attempts and average percentage',()=>{
  const rows=[
    {id:'a',title:'A',history:[{score:5,total:5,at:'2026-09-06T09:00:00.000Z'},{score:4,total:5,at:'2026-09-06T08:00:00.000Z'}]},
    {id:'b',title:'B',history:[{score:3,total:5,at:'2026-09-06T10:00:00.000Z'}]},
    {id:'c',title:'C',history:[]}
  ];
  const summary=summarizeHistories(rows);
  assert.equal(summary.attemptedSystems,2);
  assert.equal(summary.totalSystems,3);
  assert.equal(summary.totalAttempts,3);
  assert.equal(summary.average,80);
  assert.equal(summary.latest.id,'b');
});

test('CSV export contains BOM, headings and every attempt',()=>{
  const rows=[{id:'nervous',title:'Nervous system',history:[{score:4,total:5,at:'2026-09-06T10:00:00.000Z'},{score:3,total:3,at:'2026-09-05T10:00:00.000Z'}]}];
  const csv=resultsCsv(rows,'en');
  assert.ok(csv.startsWith('\ufeff'));
  assert.ok(csv.includes('"System"'));
  assert.ok(csv.includes('"Nervous system"'));
  assert.ok(csv.includes('"80"'));
  assert.ok(csv.includes('"100"'));
  assert.equal(csv.split('\r\n').length,3);
});
