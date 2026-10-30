'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Runtime=require('../dist/ladder-runtime.js');
const freshProgram=(two=false)=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 ...(two?[{id:'R2',paths:[[]],coil:{type:'NOP',ref:''}}]:[])
]});
function setup(){
 const a={id:'PLC-A',typeId:'cpu',ladderProgram:freshProgram(),plcProgram:'dts-ladder-v1'};
 const b={id:'PLC-B',typeId:'cpu',ladderProgram:freshProgram(true),plcProgram:'dts-ladder-v1'};
 const project={components:[a,b]};
 const btn={dataset:{},listeners:{},isConnected:true,addEventListener(ev,fn){this.listeners[ev]=fn},focus(){}};
 const overlay={hidden:true,handlers:{},innerHTML:'',
  setAttribute(){},addEventListener(ev,fn){this.handlers[ev]=fn},
  contains(node){return node?.inside===true},
  querySelector(){return{focus(){},scrollTop:0,open:false}},
  querySelectorAll(){return[]}};
 const doc={activeElement:btn,body:{appendChild(){}},
  createElement(){return overlay},
  getElementById(id){return id==='dtsLadderBtn'?btn:id==='simulateBtn'?{disabled:false}:id==='scene'?{addEventListener(){}}:null}};
 const cpu={name:'CPU',pins:[{id:'IN',signalType:'DI'},{id:'OUT',signalType:'DO'}]};
 const editor={running:false,byId:{cpu},getProject(){return project},toast(){}};
 const Ladder={...Runtime,supportedPLC:()=>true};
 const deps={
  './ladder-runtime.js':Ladder,
  './ladder-diagram.js':{render:()=>'<svg aria-label="ladder" />'},
  './ladder-monitor.js':{snapshot:()=>({}),markup:()=>''},
  './ladder-program-io.js':{},
  './ladder-examples.js':{list:()=>[]},
  './fbd-view.js':{refsFor:()=>['Q1','Q2'],render:()=>'<svg aria-label="fbd" />'},
  './ladder-toolbox.js':{tools:[]},
  './ladder-timer-guide.js':{markup:()=>''}
 };
 const root={document:doc,DTSEditor:editor,setInterval:()=>1,clearInterval(){}};
 const module={exports:{}};
 const source=fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8');
 new Function('module','require','window',source)(module,n=>deps[n]||{},root);
 function click(action,r=0){
  const b={inside:true,dataset:{action,r:String(r)}};
  overlay.handlers.click({target:{closest:sel=>sel==='[data-action]'?b:null}});
 }
 function choose(id){overlay.handlers.change({target:{id:'dtsLadderTarget',value:id,dataset:{}}})}
 function visible(){
  return [...overlay.innerHTML.matchAll(/<article class="dts-ladder-rung[^"]*"([^>]*)>/g)]
   .map(m=>!/\bhidden\b/.test(m[1]));
 }
 function expanded(){
  return overlay.innerHTML.split('<article class="dts-ladder-rung').slice(1)
   .map(x=>!x.includes('<div class="dts-ladder-network-body" hidden'));
 }
 return {a,b,project,overlay,open:root.DTSLadderEditor.open,click,choose,visible,expanded};
}
test('a newly opened PLC starts with all Networks visible',()=>{
 const t=setup();t.open('PLC-B');
 assert.deepEqual(t.visible(),[true,true]);
});
test('copy in focused single-Network mode reveals safe NOP duplicate',()=>{
 const t=setup();t.open('PLC-A');t.click('focus-network',0);t.click('copy-rung',0);
 assert.deepEqual(t.visible(),[false,true]);
 assert.match(t.overlay.innerHTML,/Network 2/);
 assert.deepEqual(t.a.ladderProgram,freshProgram());
});
test('undo after copying a focused Network never leaves an invisible workspace',()=>{
 const t=setup();t.open('PLC-A');t.click('focus-network',0);t.click('copy-rung',0);
 t.click('undo');assert.deepEqual(t.visible(),[true]);assert.deepEqual(t.a.ladderProgram,freshProgram());
});
test('redo reintroduces the duplicate without hiding valid Networks',()=>{
 const t=setup();t.open('PLC-A');t.click('focus-network',0);t.click('copy-rung',0);
 t.click('undo');t.click('redo');assert.deepEqual(t.visible(),[true,true]);
});
test('a different PLC clears both prior single-view focus and collapsed branches',()=>{
 const t=setup();t.open('PLC-A');t.click('focus-network',0);t.click('toggle-network',0);
 t.choose('PLC-B');assert.deepEqual(t.visible(),[true,true]);assert.deepEqual(t.expanded(),[true,true]);
});
test('reselecting the same PLC preserves its focus and collapsed branches',()=>{
 const t=setup();t.open('PLC-B');t.click('focus-network',1);t.click('toggle-network',1);
 assert.deepEqual(t.visible(),[false,true]);assert.deepEqual(t.expanded(),[true,false]);
 t.choose('PLC-B');assert.deepEqual(t.visible(),[false,true]);assert.deepEqual(t.expanded(),[true,false]);
});
test('moving a focused rung retains focus by rung ID rather than its old position',()=>{
 const t=setup();t.open('PLC-B');t.click('focus-network',1);t.click('move-rung-up',1);
 assert.deepEqual(t.visible(),[true,false]);assert.deepEqual(t.b.ladderProgram,freshProgram(true));
 t.click('move-rung-down',0);assert.deepEqual(t.visible(),[false,true]);
});
test('deleting focused rung falls back to a visible remaining Network',()=>{
 const t=setup();t.open('PLC-B');t.click('focus-network',1);t.click('remove-rung',1);
 assert.deepEqual(t.visible(),[true]);assert.deepEqual(t.b.ladderProgram,freshProgram(true));
});
test('copying and undoing an address-free rung does not energize PLC outputs',()=>{
 const t=setup();t.open('PLC-B');t.click('focus-network',1);t.click('copy-rung',1);
 assert.deepEqual(t.visible(),[false,false,true]);
 t.click('undo');assert.deepEqual(t.visible(),[true,true]);
 const memory={};
 const out=Runtime.scan(t.b.ladderProgram,{I1:false},memory,100,{inputCount:1,outputCount:1});
 assert.equal(out.ok,true);assert.equal(out.outputs.Q1,false);
});
