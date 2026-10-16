'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');

test('MQ-07 SC38 AC non-inverting LM358 source graph and limits',()=>{
 const L=QA.curriculum(),defs=QA.catalog();
 const lesson=L.byId['opamp-apps-src-03'];
 assert.ok(lesson,'SC38 must exist');
 assert.match(lesson.title,/evirmeyen.*AC giriş/i);
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project,parts=new Map(p.components.map(c=>[c.id,c]));
 for(const [id,type] of [['g1','supply-dc-plus'],['u1','lm358p-opamp-a'],
  ['in','arduino-signal-generator'],['r1','resistor'],['r2','resistor']]){
  assert.equal(parts.get(id)?.typeId,type,id);
  assert.ok(defs[type],type);
 }
 assert.equal(parts.get('r1').resistance,10000);
 assert.equal(parts.get('r2').resistance,47000);
 const edges=new Set(p.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join(':')));
 for(const edge of ['in:OUT:u1:IN+','in:GND:g1:M',
  'u1:IN-:r1:1','r1:2:g1:M','u1:OUT:r2:1','r2:2:u1:IN-'])
  assert.ok(edges.has(edge),edge);
 assert.match(lesson.explanation+' '+lesson.learningGoal,/AC|kazanç|geri besleme/i);
});
