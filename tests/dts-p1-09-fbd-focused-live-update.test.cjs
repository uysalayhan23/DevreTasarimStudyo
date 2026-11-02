'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Module=require('node:module'),path=require('node:path');
const L=require('../dist/ladder-runtime.js'),F=require('../dist/fbd-view.js');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',signalType:'POWER',label:'1M'},{id:'X12:1',signalType:'POWER',label:'3L+'},{id:'X12:2',signalType:'POWER',label:'3M'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
function setup(input=true){
 const clone=x=>JSON.parse(JSON.stringify(x));
 const c={id:'CPU-A',typeId:cpu.id,plcProgram:'dts-ladder-v1',ladderProgram:clone(program),_plcRuntime:{powered:true,program:'dts-ladder-v1'}};
 function scan(energized){
  const result=L.scan(program,{I1:energized,I2:false,I3:false,I4:false,I5:false,I6:false},{},100,{inputCount:6,outputCount:4});
  assert.equal(result.ok,true);c._dtsLadderMemory=result.memory;c._dtsLadderTraces=result.traces;
 }
 scan(input);
 const project={components:[c]},editor={running:true,getProject:()=>project,byId:{[cpu.id]:cpu},guardEdit:()=>true};
 const monitor={snapshot:()=>({live: c._plcRuntime.powered&&c._dtsLadderTraces!==undefined, inputs:[],outputs:[]}),markup:()=>'<span>LIVE</span>'};
 const editorPath=path.resolve(__dirname,'../dist/ladder-editor.js');const mod=new Module(editorPath,module);mod.filename=editorPath;mod.paths=Module._nodeModulePaths(path.dirname(editorPath));
 const originalRequire=mod.require.bind(mod);
 mod.require=(request)=>request==='./ladder-monitor.js'?monitor:originalRequire(request);
 mod._compile(require('node:fs').readFileSync(editorPath,'utf8'),editorPath);
 const E=mod.exports;
 const button={dataset:{},addEventListener(){},focus(){}},simButton={disabled:false};
 const focus={tagName:'SELECT',matches:s=>s.includes('data-fbd-contact-ref'),focus(){doc.activeElement=this}};
 let repaintCount=0;
 function item(on){return {hot:on,classList:{toggle(name,value){if(name==='dts-fbd-on')this.owner.hot=!!value},remove(name){if(name==='dts-fbd-on')this.owner.hot=false}}};}
 function hotItem(on){const obj={hot:!!on};obj.classList={toggle(name,value){if(name==='dts-fbd-on')obj.hot=!!value},remove(name){if(name==='dts-fbd-on')obj.hot=false}};return obj}
 const diagram={dataset:{},lines:[],coils:[],contains:el=>el===focus,
  set innerHTML(html){repaintCount++;this.html=html;
   this.lines=[...html.matchAll(/<div class="dts-fbd-line( dts-fbd-on)?"/g)].map(m=>hotItem(!!m[1]));
   this.coils=[...html.matchAll(/<span class="dts-fbd-coil( dts-fbd-on)?"/g)].map(m=>hotItem(!!m[1]));
  },get innerHTML(){return this.html||''},
  querySelectorAll(q){if(q==='.dts-fbd-line')return this.lines;
   if(q==='.dts-fbd-coil')return this.coils;
   if(q==='.dts-fbd-on')return [...this.lines,...this.coils].filter(x=>x.hot);
   return []}};
 const status={textContent:''},value={textContent:''};
 const rung={classList:{toggle(){}},querySelector(q){return q==='[data-diagram]'?diagram:q==='[data-monitor="status"]'?status:q==='[data-monitor="value"]'?value:null}};
 const hud={dataset:{},innerHTML:''},simAction={disabled:false,textContent:''},dialog={focus(){}};
 let overlay,tick;
 const doc={activeElement:focus,body:{appendChild(el){overlay=el}},getElementById(id){return id==='dtsLadderBtn'?button:id==='simulateBtn'?simButton:null},
  createElement(){return {dataset:{},hidden:true,handlers:{},setAttribute(){},addEventListener(name,fn){this.handlers[name]=fn},contains(){return true},
   querySelectorAll(q){return q==='.dts-ladder-rung'?[rung]:[]},
   querySelector(q){return q==='.dts-ladder-dialog'||q==='#dtsLadderTarget'?dialog:q==='#dtsLadderLivePanel'?hud:q==='[data-action="toggle-sim"]'?simAction:null},
   set innerHTML(html){this.html=html;if(html.includes('dts-fbd-view')){
    const tr=c._dtsLadderTraces?.[0];diagram.innerHTML=F.render(program.rungs[0],{index:0,live:true,pathStates:tr?.pathStates,coilValue:tr?.value,limits:{inputCount:6,outputCount:4}});
   }},get innerHTML(){return this.html||''}}}};
 const oldSet=globalThis.setInterval,oldClear=globalThis.clearInterval;
 globalThis.setInterval=fn=>{tick=fn;return 1};globalThis.clearInterval=()=>{};
 try{assert.equal(E.init(doc,editor),true);assert.equal(globalThis.DTSLadderEditor.open(),true);
  overlay.handlers.click({target:{closest:q=>q==='[data-action]'?{dataset:{action:'toggle-diagram'}}:null}});
  assert.equal(diagram.lines.length,1);assert.equal(diagram.coils.length,1);doc.activeElement=focus;
  return {c,scan,tick,diagram,focus,doc,status,repaints:()=>repaintCount,
   restore(){globalThis.DTSLadderEditor.close();globalThis.setInterval=oldSet;globalThis.clearInterval=oldClear}};
 }catch(ex){globalThis.setInterval=oldSet;globalThis.clearInterval=oldClear;throw ex}
}
test('P1-09 native negative: active contact turns OFF while FBD operand remains focused',()=>{
 const x=setup(true);try{
  assert.equal(x.diagram.lines[0].hot,true);assert.equal(x.diagram.coils[0].hot,true);
  const count=x.repaints();x.scan(false);x.tick();
  assert.equal(x.diagram.lines[0].hot,false,'Focused FBD path must immediately turn off');
  assert.equal(x.diagram.coils[0].hot,false,'Focused FBD output must immediately turn off');
  assert.equal(x.doc.activeElement,x.focus,'Must preserve keyboard focus');
  assert.equal(x.repaints(),count,'Do not destroy the focused FBD select');
  assert.equal(x.status.textContent,'Pasif');
 }finally{x.restore()}
});
test('P1-09 native positive: inactive contact turns ON while FBD operand remains focused',()=>{
 const x=setup(false);try{
  assert.equal(x.diagram.lines[0].hot,false);assert.equal(x.diagram.coils[0].hot,false);
  const count=x.repaints();x.scan(true);x.tick();
  assert.equal(x.diagram.lines[0].hot,true);assert.equal(x.diagram.coils[0].hot,true);
  assert.equal(x.repaints(),count);assert.equal(x.doc.activeElement,x.focus);
 }finally{x.restore()}
});
test('P1-09 native negative: invalid live trace clears focused FBD energized style',()=>{
 const x=setup(true);try{
  assert.equal(x.diagram.lines[0].hot,true);x.c._dtsLadderTraces=null;x.tick();
  assert.equal(x.diagram.lines[0].hot,false);assert.equal(x.diagram.coils[0].hot,false);
  assert.equal(x.doc.activeElement,x.focus);
 }finally{x.restore()}
});
test('P1-09 native positive: live trace still updates after releasing FBD field focus',()=>{
 const x=setup(true);try{
  x.doc.activeElement={matches:()=>false};x.scan(false);const count=x.repaints();x.tick();
  assert.equal(x.diagram.lines[0].hot,false);assert.equal(x.diagram.coils[0].hot,false);
  assert.ok(x.repaints()>count,'Redraw is allowed once focus leaves');
 }finally{x.restore()}
});
