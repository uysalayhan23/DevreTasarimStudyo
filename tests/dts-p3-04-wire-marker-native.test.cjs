'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Audit=require('../dist/wire-diagnostics.js');
const Simulation=require('../dist/simulation.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const catalog=QA.catalog();
const lesson=QA.curriculum().byId['electronic-switching-src-06'];
test('P3-04 device-identity issue cannot highlight same-named healthy wire',()=>{
 const p=structuredClone(lesson.project), original=JSON.stringify(p);
 p.components.push({...p.components[0]});
 const report=Audit.scan(p,catalog);
 assert.ok(report.issues.some(i=>i.kind==='duplicate-component-id'));
 const names=report.issues.filter(i=>i.kind==='duplicate-component-id').map(i=>i.wire);
 const toggles=[];
 const scene={querySelectorAll:()=>names.map(wire=>({dataset:{wire},classList:{toggle:(cls,active)=>toggles.push(active)}}))};
 assert.equal(Audit.mark(scene,report),0);assert.deepEqual(toggles,[false]);
 assert.equal(JSON.stringify(lesson.project),original);
});
test('P3-04 genuine invalid catalog terminal highlights wire without changing solver or wiring',()=>{
 const p=structuredClone(lesson.project), before=JSON.stringify(p.wires);
 const good=Simulation.solve(p,catalog,{now:1000});assert.equal(good.stable,true);
 const w=p.wires[0];assert.ok(w);const id=w.id;w.from={...w.from,p:'__BAD_P3_04__'};
 const report=Audit.scan(p,catalog);assert.ok(report.issues.some(i=>i.kind==='unknown-pin'&&i.wire===id));
 let marked=false;const scene={querySelectorAll:()=>[{dataset:{wire:id},classList:{toggle:(_,v)=>{marked=v}}}]};
 assert.equal(Audit.mark(scene,report),1);assert.equal(marked,true);
 assert.equal(JSON.stringify(p.wires[0].from),JSON.stringify(w.from));
 assert.notEqual(JSON.stringify(p.wires),before);
});
