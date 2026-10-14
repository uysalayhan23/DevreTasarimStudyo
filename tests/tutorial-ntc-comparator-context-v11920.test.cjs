'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
function target(){return QA.curriculum().byId['opamp-apps-src-08'];}
function hasWire(p,c1,p1,c2,p2){return p.wires.some(w=>w.from?.c===c1&&w.from?.p===p1&&w.to?.c===c2&&w.to?.p===p2);}
test('NTC comparison lesson has real thermistor and correct 8/4/2/3 pins',()=>{
 const l=target(),p=l.project,types=new Set(p.components.map(c=>c.typeId));
 assert.ok(types.has('sensor-ntc'));assert.ok(types.has('lm358p-dip8'));assert.ok(!types.has('potentiometer'));
 for(const [c1,p1,c2,p2] of [['g1','P','u1','8'],['g1','M','u1','4'],['s1','2','u1','3'],['r2','2','u1','2']])assert.ok(hasWire(p,c1,p1,c2,p2),c1+'/'+p1+' → '+c2+'/'+p2);
 assert.equal(p.components.find(c=>c.id==='r1').resistance,10000);
 assert.equal(p.components.find(c=>c.id==='r2').resistance,10000);
 assert.equal(p.components.find(c=>c.id==='r3').resistance,10000);
});
test('real native solver: 15C low, 35C high around the 12V reference',()=>{
 const l=target(),defs=QA.catalog(),arr=[];
 for(const temp of [15,25,35]){
  const p=structuredClone(l.project);p.components.find(c=>c.typeId==='sensor-ntc').temperature=temp;
  const result=Simulation.solve(p,defs,{now:1000});
  assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,'temp '+temp);
  const op=p.components.find(c=>c.id==='u1')._opampChannels['1'];
  arr.push({temp,voltage:op.output,diff:op.diff});
 }
 assert.ok(arr[0].voltage<1,JSON.stringify(arr));
 assert.ok(Math.abs(arr[1].diff)<.15,JSON.stringify(arr));
 assert.ok(arr[2].voltage>20&&arr[2].voltage<24,JSON.stringify(arr));
});
test('causal explanation, guide and fail-closed teaching status are preserved',()=>{
 const l=target();assert.ok(l.summary.includes('NTC'));
 for(const key of ['pin 8','pin 2','pin 3','12 V','R_NTC','OUT'])assert.ok(l.explanation.includes(key),key);
 assert.ok(l.beginnerSteps.length>=5);
 assert.ok(l.practiceGuide.steps.some(x=>x.includes('15 °C')&&x.includes('35 °C')));
 assert.equal(l.practiceGuide.pedagogicalAcceptance,false);
 assert.equal(l.practiceGuide.physicalTestAccepted,false);
 assert.notEqual(l.designStandard,'rich-reference-v1');
});
