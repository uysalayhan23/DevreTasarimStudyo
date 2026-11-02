'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const M=require('../dist/ladder-monitor.js');
const F=require('../dist/fbd-view.js');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',signalType:'POWER',label:'1M'},{id:'X12:1',signalType:'POWER',label:'3L+'},{id:'X12:2',signalType:'POWER',label:'3M'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
function setup(){
 const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const scan=L.scan(program,{I1:true,I2:false,I3:false,I4:false,I5:false,I6:false},{},100,{inputCount:6,outputCount:4});
 assert.equal(scan.ok,true);
 const c={id:'CPU-A',typeId:cpu.id,plcProgram:'dts-ladder-v1',ladderProgram:program,
  _dtsLadderMemory:scan.memory,_dtsLadderTraces:scan.traces,
  _plcRuntime:{powered:true,program:'dts-ladder-v1',
   inputs:Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DI').map((p,i)=>[p.id,i===0])),
   outputs:Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DO').map((p,i)=>[p.id,i===0]))}};
 const project={components:[c]};
 const editor={running:true,getProject:()=>project,byId:{[cpu.id]:cpu},guardEdit:()=>true};
 const button={dataset:{},addEventListener(){},focus(){}};
 const simButton={disabled:false};
 const focus={matches:s=>s.includes('data-fbd-contact-ref'),tagName:'SELECT'};
 const status={textContent:''},value={textContent:''};
 const hot=[];
 const diagram={dataset:{},contains:e=>e===focus,
  set innerHTML(html){this.html=html;hot.length=0;for(const _ of html.matchAll(/\bdts-fbd-on\b/g))hot.push({on:true})},
  get innerHTML(){return this.html||''},
  querySelectorAll(selector){return selector==='.dts-fbd-on'?hot.filter(x=>x.on).map(x=>({classList:{remove:()=>{x.on=false}}})):[]},
  get hotCount(){return hot.filter(x=>x.on).length},
  setMarkup(html){this.innerHTML=html}};
 const rung={classList:{toggle(){}},querySelector(s){
  if(s==='[data-diagram]')return diagram;
  if(s==='[data-monitor="status"]')return status;
  if(s==='[data-monitor="value"]')return value;
  return null;}};
 const hud={dataset:{},innerHTML:''};
 const simAction={disabled:false,textContent:''};
 const dialog={focus(){}};
 let overlay, tick;
 const doc={activeElement:focus,body:{appendChild(el){overlay=el}},
  getElementById(id){return id==='dtsLadderBtn'?button:id==='simulateBtn'?simButton:null},
  createElement(){return {dataset:{},hidden:true,handlers:{},setAttribute(){},
   addEventListener(name,fn){this.handlers[name]=fn},contains(){return true},
   querySelectorAll(s){return s==='.dts-ladder-rung'?[rung]:[]},
   querySelector(s){return s==='.dts-ladder-dialog'||s==='#dtsLadderTarget'?dialog:
    s==='#dtsLadderLivePanel'?hud:s==='[data-action="toggle-sim"]'?simAction:null},
   set innerHTML(html){this.html=html;if(html.includes('dts-fbd-view')){
    diagram.setMarkup(F.render(program.rungs[0],{index:0,live:true,
      pathStates:scan.traces[0].pathStates,coilValue:true,limits:{inputCount:6,outputCount:4}}));
   }},get innerHTML(){return this.html||''}}}};
 const originalSet=globalThis.setInterval,originalClear=globalThis.clearInterval;
 globalThis.setInterval=fn=>{tick=fn;return 1};globalThis.clearInterval=()=>{};
 try{
  assert.equal(E.init(doc,editor),true);
  assert.equal(globalThis.DTSLadderEditor.open(),true);
  const action={dataset:{action:'toggle-diagram'}};
  overlay.handlers.click({target:{closest:s=>s==='[data-action]'?action:null}});
  assert.ok(diagram.hotCount>0,'Real FBD renderer must start energized');
  assert.equal(M.snapshot(c,cpu,true,true).live,true);
  return {c,cpu,diagram,tick,focus,status,doc,restore(){globalThis.DTSLadderEditor.close();globalThis.setInterval=originalSet;globalThis.clearInterval=originalClear}};
 }catch(err){globalThis.setInterval=originalSet;globalThis.clearInterval=originalClear;throw err}
}
for(const [name,damage] of [
 ['PLC power loss',c=>c._plcRuntime.powered=false],
 ['scan failure',c=>c._dtsLadderError='Invalid scan'],
 ['missing physical I2 memory',c=>delete c._dtsLadderMemory.values.I2],
 ['contradictory Q1 telemetry',c=>c._plcRuntime.outputs['X12:3']=false]
])test('P0-02 FBD focused operand clears stale live paths on '+name,()=>{
 const x=setup();try{
  const focused=x.doc.activeElement;
  damage(x.c);
  assert.equal(M.snapshot(x.c,x.cpu,true,true).live,false);
  x.tick();
  assert.equal(x.diagram.hotCount,0,'Focused FBD field must not freeze stale green signals');
  assert.equal(x.doc.activeElement,focused,'The active FBD input must retain focus');
  assert.equal(x.diagram.innerHTML.includes('dts-fbd-contact-ref'),true,'Draft field must remain intact');
 }finally{x.restore()}
});
test('P0-02 valid FBD trace stays energized and repaints after fault is resolved',()=>{
 const x=setup();try{
  assert.equal(x.diagram.hotCount,2);
  x.tick();assert.equal(x.diagram.hotCount,2,'Healthy live signal must stay visible');
  x.c._plcRuntime.powered=false;x.tick();assert.equal(x.diagram.hotCount,0);
  x.c._plcRuntime.powered=true;
  x.doc.activeElement={matches:()=>false};
  x.tick();assert.equal(x.diagram.hotCount,2,'Healthy scan must repaint after focus leaves');
  assert.equal(x.status.textContent,'AKTİF');
 }finally{x.restore()}
});
