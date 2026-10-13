'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {run,DECISION}=require('../scripts/qa-mq12-analog-decision-guard-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),original=JSON.stringify(L.lessons),r=run({L,defs});
test('native load cell mV-to-virtual-comparator scales with weight, no physical approval',()=>{
 assert.deepEqual(r.load.samples.map(x=>x.value),[0,10,20]);
 assert.deepEqual(r.load.virtualDecision,[false,false,true]);
});
test('real NTC and PT100 transfer direction can be observed without altering a relay',()=>{
 assert.ok(r.ntc.samples[0].value>r.ntc.samples[2].value);
 assert.ok(r.pt100.samples[0].value<r.pt100.samples[2].value);
 assert.deepEqual(r.ntc.virtualDecision,[false,false,true]);
 assert.deepEqual(r.pt100.virtualDecision,[false,false,true]);
});
test('unit mismatches and invalid thresholds fail closed',()=>{
 assert.equal(DECISION([{value:5,unit:'V'}],'mV',12,'above'),null);
 assert.equal(DECISION([{value:5,unit:'mV'}],'mV',NaN,'above'),null);
 assert.equal(DECISION([],'mV',12,'above'),null);
});
test('piezo and MQ2 fallback never count as physical sensing',()=>{
 assert.equal(r.piezo.genericFallback.value,5);assert.equal(r.mq2.genericFallback.value,5);
 assert.equal(r.piezo.virtualDecision,null);assert.equal(r.mq2.virtualDecision,null);
});
test('1,655 lessons, 722 wired, no canonical changes and no physical acceptance',()=>{
 assert.equal(r.lessons,1655);assert.equal(r.wired,722);assert.equal(r.defs,939);
 assert.equal(r.canonicalChanges,0);assert.equal(r.physicalAcceptance,'REVIEW');
 assert.equal(JSON.stringify(L.lessons),original);
});
