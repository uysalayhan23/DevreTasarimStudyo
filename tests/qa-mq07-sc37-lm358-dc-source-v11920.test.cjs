'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');

test('MQ-07 SC37 DC inverting LM358 topology and honest acceptance boundaries',()=>{
 const L=QA.curriculum(),defs=QA.catalog();
 const lesson=L.byId['opamp-apps-src-02'];
 assert.ok(lesson,'SC37 must exist');
 assert.match(lesson.title,/eviren.*DC giriş/i);
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project;
 const parts=new Map(p.components.map(c=>[c.id,c]));
 for(const [id,type] of [['g1','supply-dc-plus'],['u1','lm358p-opamp-a'],['in','potentiometer'],['r1','resistor'],['r2','resistor'],['ref1','resistor'],['ref2','resistor']]){
  assert.equal(parts.get(id)?.typeId,type,id);
  assert.ok(defs[type],type);
 }
 assert.equal(parts.get('r1').resistance,10000);
 assert.equal(parts.get('r2').resistance,47000);
 const edges=new Set(p.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join(':')));
 for(const edge of ['in:2:r1:1','r1:2:u1:IN-','u1:OUT:r2:1','r2:2:u1:IN-','ref1:2:u1:IN+','in:1:g1:P','in:3:g1:M'])assert.ok(edges.has(edge),edge);
 assert.match(lesson.explanation+' '+lesson.learningGoal,/12 V|referans|geri besleme/i);
});
