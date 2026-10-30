'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js'),FBD=require('../dist/fbd-view.js');
const src=(type='TON',two=false)=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 ...(two?[{id:'R2',paths:[[{type:'NO',ref:'I2'}]],
   coil:type==='TON'?{type:'TON',ref:'T1',presetMs:250}:type==='TOF'?{type:'TOF',ref:'T1',presetMs:250}:
    type==='TP'?{type:'TP',ref:'T1',presetMs:250}:{type:'OUT',ref:'Q2'}}]:[])
]});
function ui({type='TON',two=true,view='ladder',running=false}={}){
 const saved=src(type,two),plc={id:'PLC-A',typeId:'cpu',ladderProgram:structuredClone(saved),plcProgram:'dts-ladder-v1'};
 const project={components:[plc]};const button={dataset:{},listeners:{},isConnected:true,addEventListener(k,f){this.listeners[k]=f},focus(){}};
 let doc;const notices=[];
 const create=html=>{
  const data={};
  for(const m of html.matchAll(/data-([a-z-]+)="([^"]*)"/g))
   data[m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=m[2];
  const item={dataset:data,inside:true,id:(/\sid="([^"]+)"/.exec(html)||[])[1]||'',
   disabled:/\sdisabled(?:\s|>|$)/.test(html),hidden:false,tabIndex:0,
   getAttribute(){return null},closest(){return null},focus(){doc.activeElement=item}};
  return item;
 };
 const dialog={inside:true,focus(){doc.activeElement=dialog}};
 const overlay={hidden:true,listeners:{},nodes:[],
  set innerHTML(value){this.nodes=[...value.matchAll(/<(?:button|input|select)\b[^>]*>/g)].map(m=>create(m[0]))},
  setAttribute(){},addEventListener(k,fn){this.listeners[k]=fn},contains(item){return item?.inside===true},
  querySelector(selector){return selector==='.dts-ladder-dialog'?dialog:
   selector==='.dts-ladder-rungs'?{scrollTop:0}:
   selector==='.dts-ladder-advanced'?{open:false}:{focus(){}}},
  querySelectorAll(selector){return selector==='button,select,input'?this.nodes:[]}
 };
 doc={activeElement:button,body:{appendChild(){}},createElement(){return overlay},
  getElementById(id){return id==='dtsLadderBtn'?button:
   id==='simulateBtn'?{disabled:false}:id==='scene'?{addEventListener(){}}:null}};
 const catalog={pins:[...Array.from({length:6},(_,i)=>({id:'DI'+i,signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'DO'+i,signalType:'DO'}))]};
 const editor={running,byId:{cpu:catalog},getProject(){return project},toast(m){notices.push(m)}};
 const root={document:doc,DTSEditor:editor,setInterval(){return 1},clearInterval(){}};
 const deps={
  './ladder-runtime.js':{...Ladder,supportedPLC:()=>true},
  './fbd-view.js':FBD,
  './ladder-diagram.js':{render(){return '<svg/>'}},
  './ladder-monitor.js':{snapshot(){return {}},markup(){return ''}},
  './ladder-toolbox.js':{tools:[]},
  './ladder-timer-guide.js':{markup(){return ''}},
  './ladder-examples.js':{list(){return []}},
  './ladder-program-io.js':{}
 };
 const m={exports:{}};
 new Function('module','require','window',
  fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8'))(
   m,n=>deps[n]||{},root);
 button.listeners.click();
 function buttonFor(action,r='0'){
  return overlay.nodes.find(n=>n.dataset.action===action&&n.dataset.r===r);
 }
 function trigger(item){
  assert.ok(item,'missing button');
  item.focus();
  overlay.listeners.click({target:{closest(selector){return selector==='[data-action]'?item:null}}});
 }
 if(view==='fbd')trigger(overlay.nodes.find(n=>n.dataset.action==='toggle-diagram'));
 return {overlay,doc,saved,plc,editor,notices,buttonFor,trigger,focus:()=>doc.activeElement?.dataset||{}};
}
test('LAD TON block removal focuses NOP command in the SAME second Network',()=>{
 const x=ui(),item=x.buttonFor('remove-output','1');
 assert.ok(item);x.trigger(item);
 assert.equal(x.focus().field,'coil-type');assert.equal(x.focus().r,'1');
 assert.deepEqual(x.plc.ladderProgram,x.saved);
});
test('FBD TON block removal focuses NOP type select, not removed button',()=>{
 const x=ui({view:'fbd'}),item=x.buttonFor('remove-output','1');
 assert.ok(item);x.trigger(item);
 assert.equal(x.focus().fbdCoilField,'type');assert.equal(x.focus().r,'1');
 assert.deepEqual(x.plc.ladderProgram,x.saved);
});
test('FBD TOF and TP removal preserve matching type focus',()=>{
 for(const type of ['TOF','TP']){
  const x=ui({type,view:'fbd'});x.trigger(x.buttonFor('remove-output','1'));
  assert.equal(x.focus().fbdCoilField,'type');
  assert.equal(x.focus().r,'1');
 }
});
test('LAD output coil removal keeps focus on its NOP replacement',()=>{
 const x=ui({type:'OUT'});x.trigger(x.buttonFor('remove-output','1'));
 assert.equal(x.focus().field,'coil-type');assert.equal(x.focus().r,'1');
});
test('FBD output coil removal keeps focus on its NOP replacement',()=>{
 const x=ui({type:'OUT',view:'fbd'});x.trigger(x.buttonFor('remove-output','1'));
 assert.equal(x.focus().fbdCoilField,'type');assert.equal(x.focus().r,'1');
});
test('native removal has no writable output and never changes the saved original',()=>{
 const program=src('TON',true),E=require('../dist/ladder-editor.js');
 const result=E.removeOutput(program,1,{inputCount:6,outputCount:4});
 assert.equal(result.ok,true);
 assert.deepEqual(result.program.rungs[1].coil,{type:'NOP',ref:''});
 assert.deepEqual(program,src('TON',true));
 const scan=Ladder.scan(result.program,{I1:false,I2:true},{},100,{inputCount:6,outputCount:4});
 assert.equal(scan.ok,true);assert.equal(scan.outputs.Q1,false);
 assert.equal(scan.memory.values.T1,false);
});
test('Undo and Redo restore the prior timer with no saved-program mutation',()=>{
 const x=ui();x.trigger(x.buttonFor('remove-output','1'));
 const undo=x.overlay.nodes.find(n=>n.dataset.action==='undo');assert.ok(undo);x.trigger(undo);
 const redo=x.overlay.nodes.find(n=>n.dataset.action==='redo');assert.ok(redo);x.trigger(redo);
 assert.deepEqual(x.plc.ladderProgram,x.saved);
});
test('simulation running rejects forced removal without changing saved PLC',()=>{
 const x=ui({running:true}),item=x.buttonFor('remove-output','1');assert.ok(item);
 x.trigger(item);assert.deepEqual(x.plc.ladderProgram,x.saved);
 assert.ok(x.notices.some(m=>m.includes('simülasyonu durdur')));
});
