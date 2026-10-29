'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Watch=require('../dist/ladder-watch.js');
const L=require('../dist/ladder-runtime.js');
const w=global.window;global.window=global;require('../dist/library.js');global.window=w;
const defs=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const d=defs['plc-hw-6es7211-1ae40-0xb0'];
const program={version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'},comment:'Başlat ve güvenlik kontağı'},
 {id:'R2',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'CTU',ref:'C1',preset:2}},
 {id:'R3',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q2'}}
]};
const limits={inputCount:6,outputCount:4};
function make(){
 const cpu={id:'cpu',typeId:d.id,plcProgram:'dts-ladder-v1',ladderProgram:structuredClone(program)};
 const proj={components:[cpu],wires:[],junctions:[]};const editor={byId:defs,getProject:()=>proj,running:true};let memory={};
 const step=(I1=false,I2=false,broken=false)=>{
  if(broken)cpu._dtsLadderTraces=[{id:'R1',coil:'Q9',pathStates:[true],active:true,value:true}];
  else{const scan=L.scan(cpu.ladderProgram,{I1,I2},memory,1,limits);assert.equal(scan.ok,true);cpu._dtsLadderMemory=scan.memory;cpu._dtsLadderTraces=scan.traces;}
  cpu._plcRuntime={powered:true,program:'dts-ladder-v1',inputs:Object.fromEntries(d.pins.filter(p=>p.signalType==='DI').map((p,i)=>[p.id,i===0?I1:i===1?I2:false])),outputs:Object.fromEntries(d.pins.filter(p=>p.signalType==='DO').map((p,i)=>[p.id,broken?true:!!memory.values?.['Q'+(i+1)]]))};
  return Watch.read(editor,cpu.id);
 };
 return {cpu,proj,editor,step};
}
test('catalog 703 and verified CPU gate unchanged',()=>{assert.equal(global.COMPONENT_LIBRARY.length,703);assert.equal(L.supportedPLC(d),true)});
test('read-only window rejects unsupported PLC and never treats it as live',()=>{
 const a=make();a.proj.components[0].typeId='lamp-red';const s=Watch.read(a.editor,'cpu');assert.equal(s.live,false);assert.equal(s.cpu,undefined);
});
test('input I1 press turns its NO contact green using authentic Ladder scan',()=>{
 const a=make();const before=a.step(false,false);assert.equal(before.live,true);assert.equal(Watch.contactState(program.rungs[0].paths[0][0],before.values,before.live),false);
 const after=a.step(true,false);assert.equal(after.live,true);assert.equal(after.rows[0].active,true);
 const html=Watch.markup(after);assert.match(html,/class="dts-watch-contact is-on" data-ref="I1"/);assert.match(html,/class="dts-watch-result is-on"/);
});
test('I1 releasing removes green; distinct inputs remain independently readable',()=>{
 const a=make();a.step(true,false);const after=a.step(false,false);
 assert.match(Watch.markup(after),/class="dts-watch-contact is-off" data-ref="I1"/);
 assert.equal(after.rows[0].value,false);
});
test('NO and NC independently show electrical conduction',()=>{
 const a=make();const v=a.step(true,true);
 assert.equal(Watch.contactState({type:'NO',ref:'I1'},v.values,v.live),true);
 assert.equal(Watch.contactState({type:'NC',ref:'I2'},v.values,v.live),false);
 assert.equal(v.rows[0].active,false);
 const html=Watch.markup(v);assert.match(html,/class="dts-watch-contact is-on" data-ref="I1"/);assert.match(html,/class="dts-watch-contact is-off" data-ref="I2"/);
});
test('counter C1 and physical Q2 follow separate rising edges',()=>{
 const a=make();let r=a.step(false,false);r=a.step(true,false);a.step(false,false);r=a.step(true,false);
 assert.equal(r.rows[1].count,2);assert.equal(r.rows[2].value,true);assert.match(Watch.markup(r),/C1/);assert.match(Watch.markup(r),/Sayaç 2\/2/);
});
test('power loss refuses every green input and output despite stale memory',()=>{
 const a=make();const r=a.step(true,false);a.cpu._plcRuntime.powered=false;
 const fail=Watch.read(a.editor,'cpu');assert.equal(fail.live,false);assert.equal(Watch.contactState({type:'NO',ref:'I1'},fail.values,fail.live),null);
 assert.doesNotMatch(Watch.markup(fail),/dts-watch-result is-on/);
});
test('stopped simulation has no false live states',()=>{
 const a=make();a.step(true,false);a.editor.running=false;const r=Watch.read(a.editor,'cpu');assert.equal(r.live,false);assert.match(Watch.markup(r),/Simülasyon kapalı/);
});
test('invalid or unsaved program never displays positive values',()=>{
 const a=make();a.step(true,false);a.cpu.ladderProgram={version:1,rungs:[]};assert.equal(Watch.read(a.editor,'cpu').live,false);
});
test('partial or foreign coil trace is rejected without stale green',()=>{
 const a=make();a.step(true,false,true);const r=Watch.read(a.editor,'cpu');assert.equal(r.live,false);assert.doesNotMatch(Watch.markup(r),/dts-watch-result is-on/);
});
test('readonly renderer escapes user comments and refuses HTML injection',()=>{
 const a=make();a.cpu.ladderProgram.rungs[0].comment='<img src=x onerror=alert(1)>';const view=a.step(true,false);
 const html=Watch.markup(view);assert.doesNotMatch(html,/<img/);assert.match(html,/&lt;img/);
});
test('open parallel paths/outputs never invent a live current path',()=>{
 const a=make();a.cpu.ladderProgram.rungs[0].paths=[[]];const r=a.step(true,false);assert.equal(r.rows[0].active,false);
 assert.match(Watch.markup(r),/Boş · açık devre/);assert.doesNotMatch(Watch.markup(r),/class="dts-watch-result is-on"><small>OUT<\/small><strong>Q1/);
});
