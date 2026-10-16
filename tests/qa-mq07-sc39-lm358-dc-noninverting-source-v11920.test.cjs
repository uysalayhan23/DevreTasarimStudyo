'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
test('MQ07 SC39 non-inverting LM358 DC source topology',()=>{
 const L=QA.curriculum(),p=L.byId['opamp-apps-src-04'].project;
 const by=new Map(p.components.map(c=>[c.id,c]));
 assert.equal(by.get('u1').typeId,'lm358p-dip8');
 assert.equal(by.get('in').typeId,'potentiometer');
 assert.equal(by.get('r1').resistance,10000);
 assert.equal(by.get('r2').resistance,47000);
 const wires=p.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join(':'));
 for(const edge of ['in:2:u1:3','u1:2:r1:1','r1:2:g1:M','u1:1:r2:1','r2:2:u1:2'])assert.ok(wires.includes(edge),edge);
});
