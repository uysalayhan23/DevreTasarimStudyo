'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const L=require('../dist/ladder-runtime.js'),T=require('../dist/ladder-toolbox.js'),F=require('../dist/fbd-view.js');
function ui(){
 const original={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const c={id:'PLC1',typeId:'cpu',ladderProgram:structuredClone(original),plcProgram:'dts-ladder-v1'};
 const project={components:[c]},btn={dataset:{},handlers:{},isConnected:true,addEventListener(name,fn){this.handlers[name]=fn},focus(){}};
 let doc;
 function el(markup){
  const data={};for(const m of markup.matchAll(/data-([a-z-]+)="([^"]*)"/g))
   data[m[1].replace(/-([a-z])/g,(_,ch)=>ch.toUpperCase())]=m[2];
  const node={dataset:data,id:(/\sid="([^"]*)"/.exec(markup)||[])[1]||'',inside:true,disabled:/\sdisabled(?:\s|>|$)/.test(markup),
   hidden:false,tabIndex:0,getAttribute(){return null},closest(){return null},focus(){doc.activeElement=node}};
  return node;
 }
 const dialog={inside:true,focus(){doc.activeElement=dialog}},overlay={hidden:true,handlers:{},controls:[],
  set innerHTML(v){this.controls=[...v.matchAll(/<(?:button|select|input)\b[^>]*>/g)].map(m=>el(m[0]))},
  setAttribute(){},addEventListener(name,fn){this.handlers[name]=fn},contains(n){return !!n?.inside},
  querySelector(q){return q==='.dts-ladder-dialog'?dialog:q==='.dts-ladder-rungs'?{scrollTop:0}:
   q==='.dts-ladder-advanced'?{open:false}:{focus(){}}},
  querySelectorAll(q){return q==='button,select,input'?this.controls:[]}
 };
 doc={activeElement:btn,body:{appendChild(){}},createElement(){return overlay},
  getElementById(id){return id==='dtsLadderBtn'?btn:id==='scene'?{addEventListener(){}}:
   id==='simulateBtn'?{disabled:false}:null}};
 const cpu={pins:[
  ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
 ]};
 const messages=[],editor={running:false,byId:{cpu},getProject(){return project},toast(msg){messages.push(msg)}};
 const root={document:doc,DTSEditor:editor,setInterval(){return 1},clearInterval(){}};
 const deps={'./ladder-runtime.js':{...L,supportedPLC:()=>true},
  './ladder-toolbox.js':T,'./fbd-view.js':F,'./ladder-diagram.js':{render:()=>'<svg/>'},
  './ladder-monitor.js':{snapshot:()=>({}),markup:()=>''},
  './ladder-timer-guide.js':{markup:()=>''},
  './ladder-examples.js':{list:()=>[]},'./ladder-program-io.js':{}};
 const module={exports:{}};
 new Function('module','require','window',fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8'))(
  module,name=>deps[name]||{},root);
 btn.handlers.click();
 const click=(node,which)=>overlay.handlers.click({target:{closest:s=>s===which?node:null}});
 function select(tool){
  const node=overlay.controls.find(x=>x.dataset.toolId===tool);
  assert.ok(node,'missing palette tool '+tool);node.focus();click(node,'[data-tool-id]');
  return doc.activeElement?.dataset||{};
 }
 function drop(data){
  const node={dataset:data,inside:true};
  click(node,'[data-drop-kind]');
  return doc.activeElement?.dataset||{};
 }
 return {select,drop,focus:()=>doc.activeElement?.dataset||{},original,plc:c,messages};
}
test('NO palette selection keeps the selected tool keyboard focus',()=>{
 const x=ui();assert.equal(x.select('NO').toolId,'NO');
});
test('NC selection and deselection never move focus to dialog root',()=>{
 const x=ui();assert.equal(x.select('NC').toolId,'NC');
 assert.equal(x.select('NC').toolId,'NC');
});
test('timer palette button preserves its own keyboard focus',()=>{
 const x=ui();assert.equal(x.select('TON').toolId,'TON');
});
test('adding serial contact focuses its newly created operand and never commits saved PLC',()=>{
 const x=ui();x.select('NO');const focus=x.drop({dropKind:'contact',r:'0',p:'0',i:'1'});
 assert.equal(focus.field,'contact-ref');assert.equal(focus.c,'1');
 assert.deepEqual(x.plc.ladderProgram,x.original);
});
test('inserting before the first contact focuses its actual operand',()=>{
 const x=ui();x.select('NC');const focus=x.drop({dropKind:'contact',r:'0',p:'0',i:'0'});
 assert.equal(focus.field,'contact-ref');assert.equal(focus.c,'0');
 assert.deepEqual(x.plc.ladderProgram,x.original);
});
test('TON palette drop focuses new T operand, without altering saved OUT',()=>{
 const x=ui();x.select('TON');const focus=x.drop({dropKind:'coil',r:'0'});
 assert.equal(focus.field,'coil-ref');assert.equal(focus.r,'0');
 assert.equal(x.plc.ladderProgram.rungs[0].coil.type,'OUT');
});
test('whole-Network contact insertion focuses first-branch appended operand',()=>{
 const x=ui();x.select('NO');const focus=x.drop({dropKind:'network',r:'0'});
 assert.equal(focus.field,'contact-ref');assert.equal(focus.p,'0');assert.equal(focus.c,'1');
});
test('a missing contact path is rejected without altering the saved PLC',()=>{
 const x=ui();x.select('NO');
 x.drop({dropKind:'contact',r:'0'});
 assert.ok(x.messages.length>0);
 assert.deepEqual(x.plc.ladderProgram,x.original);
});
