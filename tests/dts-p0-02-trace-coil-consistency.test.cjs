'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),M=require('../dist/ladder-monitor.js'),E=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4};
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},{id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
const rung=(paths,coil)=>({id:'R1',paths,coil});
const trace=(states,value,ref='Q1')=>({id:'R1',coil:ref,active:states.some(Boolean),pathStates:states,value});
function checked(r,t){
 const p={version:1,rungs:[r]};
 assert.equal(L.validate(p,limits).ok,true);
 const state={powered:true,program:'dts-ladder-v1',
  inputs:Object.fromEntries(d.pins.filter(x=>x.signalType==='DI').map(x=>[x.id,false])),
  outputs:Object.fromEntries(d.pins.filter(x=>x.signalType==='DO').map(x=>[x.id,false]))};
 const cpu={plcProgram:'dts-ladder-v1',ladderProgram:p,_plcRuntime:state,_dtsLadderTraces:[t]};
 return {io:M.snapshot(cpu,d,true,true),
  row:E.monitorRows(p,p,[t],true,'dts-ladder-v1',true,null,'dts-ladder-v1')[0]};
}
function deny(r,t){
 const {io,row}=checked(r,t);assert.equal(io.live,false);
 assert.equal(row.pathStates,null);assert.equal(row.value,null);assert.equal(row.active,false);
}
function allow(r,t){
 const {io,row}=checked(r,t);assert.equal(io.live,true);
 assert.deepEqual(row.pathStates,t.pathStates);assert.equal(row.value,t.value);
}
test('P0-02 rejects forged energized empty Ladder branch',()=>deny(rung([[]],{type:'OUT',ref:'Q1'}),trace([true],true)));
test('P0-02 rejects forged live empty parallel branch',()=>deny(rung([[{type:'NO',ref:'I1'}],[]],{type:'OUT',ref:'Q1'}),trace([false,true],true)));
test('P0-02 rejects OUT true on inactive path',()=>deny(rung([[{type:'NO',ref:'I1'}]],{type:'OUT',ref:'Q1'}),trace([false],true)));
test('P0-02 rejects OUT false on active path',()=>deny(rung([[{type:'NO',ref:'I1'}]],{type:'OUT',ref:'Q1'}),trace([true],false)));
test('P0-02 rejects NOP writing true',()=>deny(rung([[{type:'NO',ref:'I1'}]],{type:'NOP',ref:''}),trace([true],true,'')));
test('P0-02 accepts native OUT energized',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]],{type:'OUT',ref:'Q1'});
 allow(r,L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0]);
});
test('P0-02 accepts native OUT deenergized',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]],{type:'OUT',ref:'Q1'});
 allow(r,L.scan({version:1,rungs:[r]},{I1:false},{},10,limits).traces[0]);
});
test('P0-02 accepts native NOP with energized input but no output',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]],{type:'NOP',ref:''});
 allow(r,L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0]);
});
test('P0-02 keeps pending TON input visible',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]],{type:'TON',ref:'T1',presetMs:100});
 allow(r,L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0]);
});
test('P0-02 keeps valid SET latch after input drops',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]],{type:'SET',ref:'Q1'}),p={version:1,rungs:[r]},mem={};
 L.scan(p,{I1:true},mem,10,limits);const t=L.scan(p,{I1:false},mem,20,limits).traces[0];
 assert.equal(t.value,true);allow(r,t);
});
test('P0-02 keeps truly open branch with false native trace',()=>{
 const r=rung([[]],{type:'OUT',ref:'Q1'});
 allow(r,L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0]);
});

test('P0-02 malformed saved contact path fails closed without throwing',()=>{
 const broken=rung([null],{type:'OUT',ref:'Q1'}),t=trace([false],false);
 const program={version:1,rungs:[broken]};
 const state={powered:true,program:'dts-ladder-v1',
  inputs:Object.fromEntries(d.pins.filter(p=>p.signalType==='DI').map(p=>[p.id,false])),
  outputs:Object.fromEntries(d.pins.filter(p=>p.signalType==='DO').map(p=>[p.id,false]))};
 const cpu={plcProgram:'dts-ladder-v1',ladderProgram:program,_plcRuntime:state,_dtsLadderTraces:[t]};
 assert.equal(M.snapshot(cpu,d,true,true).live,false);
 const row=E.monitorRows(program,program,[t],true,'dts-ladder-v1',true,null,'dts-ladder-v1')[0];
 assert.equal(row.value,null);
});
