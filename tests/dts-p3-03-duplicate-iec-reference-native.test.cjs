'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Connection=require('../dist/connection-list.js');
const Catalog=QA.catalog(),lesson=QA.curriculum().byId['electronic-switching-src-06'];
const fresh=()=>JSON.parse(JSON.stringify(lesson.project));
const topology=p=>JSON.stringify(p.wires.map(w=>({id:w.id,from:w.from,to:w.to})));
test('P3-03 valid unique references preserve actual native circuit connections',()=>{
 const p=fresh(),before=topology(p),a=Connection.audit(p,Catalog);
 assert.equal(a.ok,true);assert.ok(a.rows.length>0);
 const solved=Simulation.solve(p,Catalog,{now:1000});
 assert.equal(solved.stable,true);assert.equal(solved.blocked,false);
 assert.equal(topology(p),before);
});
test('P3-03 duplicate IEC reference blocks ambiguous CSV while native circuit topology stays unchanged',()=>{
 const p=fresh();p.components.find(c=>c.id==='s1').ref=p.components.find(c=>c.id==='g1').ref;
 const before=topology(p),a=Connection.audit(p,Catalog);
 assert.equal(a.ok,false);assert.match(a.errors.join(' '),/Tekrarlı IEC cihaz referansı/);
 assert.deepEqual(a.rows,[]);
 const solved=Simulation.solve(p,Catalog,{now:1000});
 assert.equal(solved.stable,true);assert.equal(solved.blocked,false);
 assert.equal(topology(p),before);
});
