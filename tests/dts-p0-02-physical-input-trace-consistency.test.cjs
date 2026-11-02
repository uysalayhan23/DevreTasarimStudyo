'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8');
const program=(paths,coil={type:'OUT',ref:'Q1'})=>({version:1,rungs:[{id:'R1',paths,coil}]});
const NO=ref=>({type:'NO',ref}),NC=ref=>({type:'NC',ref});
function runtime(ladder){const module={exports:{}};vm.runInNewContext(source,{module,exports:module.exports,require(){return ladder}});return module.exports;}
function run(p,inputs,mutate,previous={}){
 const scanner={...Ladder,scan(...args){const result=Ladder.scan(...args);assert.equal(result.ok,true);mutate?.(result);return result;}};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p,_dtsLadderMemory:previous,_dtsLadderTraces:[{id:'old',active:true}]};
 const out=runtime(scanner).program(c,inputs.map(value=>({value})),[{id:'X12:3'}],1000);
 return {c,out};
}
function forge(r,active){r.traces[0].pathStates[0]=active;r.traces[0].active=active;r.traces[0].value=active;r.outputs.Q1=active;r.memory.values.Q1=active;}
for(const [name,p,inputs,mutate] of [
 ['NO false forged true',program([[NO('I1')]]),[false],r=>forge(r,true)],
 ['NC true forged true',program([[NC('I1')]]),[true],r=>forge(r,true)],
 ['NO true forged false',program([[NO('I1')]]),[true],r=>forge(r,false)],
 ['mixed I/M false forged true',program([[NO('I1'),NO('M1')]]),[false],r=>forge(r,true)],
 ['parallel I false forged true',program([[NO('I1')],[NO('I2')]]),[false,false],r=>{r.traces[0].pathStates=[true,false];r.traces[0].active=true;r.traces[0].value=true;r.outputs.Q1=true;r.memory.values.Q1=true;}],
 ['memory input falsified',program([[NO('I1')]]),[false],r=>{r.memory.values.I1=true;}]
])test('reject contradictory scan: '+name,()=>{
 const {c,out}=run(p,inputs,mutate);
 assert.equal(out.outputs['X12:3'],false);
 assert.equal(c._dtsLadderMemory,undefined);
 assert.equal(c._dtsLadderTraces.length,0);
 assert.match(c._dtsLadderError,/geçersiz/i);
});
for(const [name,p,inputs,expected] of [
 ['NO energized',program([[NO('I1')]]),[true],true],
 ['NO open',program([[NO('I1')]]),[false],false],
 ['NC closed',program([[NC('I1')]]),[false],true],
 ['NC open',program([[NC('I1')]]),[true],false],
 ['parallel true',program([[NO('I1')],[NO('I2')]]),[false,true],true],
 ['mixed M false',program([[NO('I1'),NO('M1')]]),[true],false]
])test('preserve real scan: '+name,()=>{
 const {c,out}=run(p,inputs);
 assert.equal(out.outputs['X12:3'],expected);
 assert.equal(c._dtsLadderError,undefined);
});
