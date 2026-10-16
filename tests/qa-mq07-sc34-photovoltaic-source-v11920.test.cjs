'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');

test('MQ-07 SC34 photovoltaic lesson uses solar product instead of unrelated sensors',()=>{
 const L=QA.curriculum(),defs=QA.catalog();
 const lesson=L.byId['sensor-analog-apps-src-15'];
 assert.equal(L.lessons.length,1655);
 assert.ok(lesson,'SC34 lesson must exist');
 assert.match(lesson.title,/güneş pili/i);
 assert.equal(lesson.kind,'quiz','No unverified wired PV solver should be claimed');
 assert.equal(lesson.project.referenceOnly,true);
 assert.equal(lesson.project.wires.length,0);
 const types=lesson.project.components.map(c=>c.typeId);
 assert.deepEqual(types,['tutorial-solar-cell','unit-ut33d-plus','resistor']);
 for(const id of types)assert.ok(defs[id],`Catalog product missing: ${id}`);
});
