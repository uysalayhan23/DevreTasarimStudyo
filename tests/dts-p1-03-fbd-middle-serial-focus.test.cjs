'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const E=require('../dist/ladder-editor.js'),F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const lim={inputCount:6,outputCount:4};
const program=()=>({version:1,rungs:[{id:'R1',paths:[
 [{type:'NO',ref:'I1'}],[{type:'NC',ref:'I2'},{type:'NO',ref:'I3'},{type:'NC',ref:'I4'}]
],coil:{type:'OUT',ref:'Q1'}}]});
function ui(){
 const plc={id:'P1',typeId:'cpu',ladderProgram:program(),plcProgram:'dts-ladder-v1'},project={components:[plc]};
 const btn={dataset:{},handlers:{},isConnected:true,addEventListener(t,f){this.handlers[t]=f},focus(){}};
 let doc;
 function element(html){
  const dataset={};for(const m of html.matchAll(/data-([a-z-]+)="([^"]*)"/g))
   dataset[m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=m[2];
  const self={dataset,id:(/\sid="([^"]+)"/.exec(html)||[])[1]||'',inside:true,
   disabled:/\sdisabled(?:\s|>|$)/.test(html),hidden:false,tabIndex:0,
   getAttribute(){return null},closest(){return null},focus(){doc.activeElement=self}};
  return self;
 }
 const dialog={inside:true,focus(){doc.activeElement=dialog}};
 const overlay={hidden:true,handlers:{},nodes:[],
  set innerHTML(v){this.nodes=[...v.matchAll(/<(?:button|input|select)\b[^>]*>/g)].map(m=>element(m[0]))},
  setAttribute(){},addEventListener(t,f){this.handlers[t]=f},
  contains(n){return n?.inside===true},
  querySelector(q){return q==='.dts-ladder-dialog'?dialog:q==='.dts-ladder-rungs'?{scrollTop:0}:
   q==='.dts-ladder-advanced'?{open:false}:{focus(){}}
  },
  querySelectorAll(q){return q==='button,select,input'?this.nodes:[]}
 };
 doc={activeElement:btn,body:{appendChild(){}},createElement(){return overlay},
  getElementById(id){return id==='dtsLadderBtn'?btn:id==='simulateBtn'?{disabled:false}:
   id==='scene'?{addEventListener(){}}:null}};
 const pins=[
  ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
 ];
 const editor={running:false,byId:{cpu:{pins}},getProject(){return project},toast(){}};
 const env={document:doc,DTSEditor:editor,setInterval(){return 1},clearInterval(){}};
 const deps={'./ladder-runtime.js':{...L,supportedPLC(){return true}},
  './fbd-view.js':F,'./ladder-diagram.js':{render(){return '<svg/>'}},
  './ladder-monitor.js':{snapshot(){return {}},markup(){return ''}},
  './ladder-toolbox.js':{tools:[]},'./ladder-timer-guide.js':{markup(){return ''}},
  './ladder-examples.js':{list(){return []}},'./ladder-program-io.js':{}};
 const m={exports:{}};
 new Function('module','require','window',fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8'))(m,n=>deps[n]||{},env);
 btn.handlers.click();
 const action=overlay.nodes.find(n=>n.dataset.action==='toggle-diagram');assert.ok(action);
 action.focus();overlay.handlers.click({target:{closest:s=>s==='[data-action]'?action:null}});
 function edit(op,position){
  const n=overlay.nodes.find(x=>x.dataset.fbdStructure===op&&x.dataset.fbdPosition===position);
  assert.ok(n,'missing '+op+':'+position);assert.equal(n.disabled,false);
  n.focus();overlay.handlers.click({target:{closest:s=>s==='[data-fbd-structure]'?n:null}});
  return doc.activeElement?.dataset||{};
 }
 function press(name){
  const n=overlay.nodes.find(x=>x.dataset.action===name);assert.ok(n);n.focus();
  overlay.handlers.click({target:{closest:s=>s==='[data-action]'?n:null}});
 }
 return {edit,press,plc,focus:()=>doc.activeElement?.dataset||{}};
}
test('FBD UI + Önüne before middle contact focuses exact inserted operand',()=>{
 const x=ui(),focus=x.edit('add-contact-before','0:1:1');
 assert.equal(focus.fbdContactRef,'0:1:1');
 assert.equal(focus.rungId,'R1');
 assert.deepEqual(x.plc.ladderProgram,program());
});
test('FBD UI + Önüne before first contact retains first operand focus',()=>{
 const x=ui(),focus=x.edit('add-contact-before','0:1:0');
 assert.equal(focus.fbdContactRef,'0:1:0');
});
test('FBD UI + Seri appends after final contact and focuses new operand',()=>{
 const x=ui(),focus=x.edit('add-contact','0:1:2');
 assert.equal(focus.fbdContactRef,'0:1:3');
 assert.deepEqual(x.plc.ladderProgram,program());
});
test('FBD UI empty branch + Seri correctly focuses its first contact',()=>{
 const x=ui();
 assert.equal(x.edit('remove-contact','0:0:0').fbdStructure,'add-contact');
 const focus=x.edit('add-contact','0:0:0');
 assert.equal(focus.fbdContactRef,'0:0:0');
 assert.deepEqual(x.plc.ladderProgram,program());
});
test('FBD native + Seri after first contact focuses newly inserted middle index 1',()=>{
 const p=program(),original=JSON.stringify(p);
 const result=F.editStructure(p,'add-contact','0:1:0',lim);
 assert.equal(result.ok,true);
 assert.deepEqual(result.program.rungs[0].paths[1].map(c=>c.type),['NC','NO','NO','NC']);
 assert.deepEqual(result.program.rungs[0].paths[1].map(c=>c.ref),['I2','I1','I3','I4']);
 assert.equal(E.fbdStructureNextFocus(result.program,'add-contact','0:1:0'),'fbd-ref:0:1:1');
 assert.equal(L.validate(result.program,lim).ok,true);
 assert.equal(JSON.stringify(p),original);
});
test('FBD native + Seri after second contact focuses inserted middle index 2',()=>{
 const p=program(),after=F.editStructure(p,'add-contact','0:1:1',lim);
 assert.equal(after.ok,true);
 assert.deepEqual(after.program.rungs[0].paths[1].map(c=>c.ref),['I2','I3','I1','I4']);
 assert.equal(E.fbdStructureNextFocus(after.program,'add-contact','0:1:1'),'fbd-ref:0:1:2');
});
test('FBD + Önüne and + Seri native operations distinguish their positions',()=>{
 const p=program();
 const before=F.editStructure(p,'add-contact-before','0:1:1',lim);
 const after=F.editStructure(p,'add-contact','0:1:1',lim);
 assert.equal(before.ok,true);assert.equal(after.ok,true);
 assert.deepEqual(before.program.rungs[0].paths[1].map(c=>c.ref),['I2','I1','I3','I4']);
 assert.deepEqual(after.program.rungs[0].paths[1].map(c=>c.ref),['I2','I3','I1','I4']);
 assert.equal(E.fbdStructureNextFocus(before.program,'add-contact-before','0:1:1'),'fbd-ref:0:1:1');
 assert.equal(E.fbdStructureNextFocus(after.program,'add-contact','0:1:1'),'fbd-ref:0:1:2');
});
test('Native FBD middle insertion does not energize unrelated Q output',()=>{
 const p=program(),withQ2={...p,rungs:[...p.rungs,
  {id:'R2',paths:[[{type:'NO',ref:'I5'}]],coil:{type:'OUT',ref:'Q2'}}]};
 const edited=F.editStructure(withQ2,'add-contact','0:1:0',lim);
 assert.equal(edited.ok,true);
 const scan=L.scan(edited.program,{I1:false,I2:false,I3:true,I4:true,I5:true},{},100,lim);
 assert.equal(scan.ok,true);assert.equal(scan.outputs.Q1,false);assert.equal(scan.outputs.Q2,true);
});
test('Undo/Redo restores exact FBD serial order; saved program remains unchanged',()=>{
 const p=program(),result=F.editStructure(p,'add-contact','0:1:0',lim);
 assert.equal(result.ok,true);
 const h=E.createDraftHistory(p);h.push(result.program);
 assert.deepEqual(h.undo(),p);assert.deepEqual(h.redo(),result.program);
 assert.deepEqual(p,program());
});
test('Malformed and out-of-range FBD insertion targets fail closed',()=>{
 const p=program(),saved=JSON.stringify(p);
 for(const pos of ['0:1:','00:1:0','0:1:10','0:1:NaN','0:1:9007199254740992']){
  const result=F.editStructure(p,'add-contact',pos,lim);
  assert.equal(result.ok,false,pos);
 }
 assert.equal(JSON.stringify(p),saved);
});
