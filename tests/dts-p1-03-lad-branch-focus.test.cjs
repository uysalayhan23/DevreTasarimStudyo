'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Runtime=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4};
const sample=()=>({version:1,rungs:[{id:'R1',paths:[
 [{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}],[{type:'NO',ref:'I3'}]
],coil:{type:'OUT',ref:'Q1'}}]});
function setup(){
 const component={id:'P1',typeId:'cpu',ladderProgram:sample(),plcProgram:'dts-ladder-v1'};
 const project={components:[component]};
 const btn={dataset:{},events:{},isConnected:true,addEventListener(t,f){this.events[t]=f},focus(){}};
 let doc;
 function node(html){
  const dataset={};
  for(const m of html.matchAll(/data-([a-z-]+)="([^"]*)"/g))
   dataset[m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=m[2];
  const result={dataset,id:(/\sid="([^"]+)"/.exec(html)||[])[1]||'',inside:true,
   hidden:false,tabIndex:0,disabled:/\sdisabled(?:\s|>|$)/.test(html),
   getAttribute(){return null},closest(){return null},focus(){doc.activeElement=result}};
  return result;
 }
 const dialog={inside:true,focus(){doc.activeElement=dialog}};
 const overlay={hidden:true,events:{},nodes:[],html:'',
  set innerHTML(html){this.html=html;this.nodes=[...html.matchAll(/<(?:button|input|select)\b[^>]*>/g)].map(m=>node(m[0]))},
  get innerHTML(){return this.html},
  setAttribute(){},addEventListener(t,f){this.events[t]=f},contains(n){return n?.inside===true},
  querySelector(s){return s==='.dts-ladder-dialog'?dialog:
   s==='.dts-ladder-rungs'?{scrollTop:0}:s==='.dts-ladder-advanced'?{open:false}:{focus(){}}},
  querySelectorAll(s){return s==='button,select,input'?this.nodes:[]}
 };
 doc={activeElement:btn,body:{appendChild(){}},createElement(){return overlay},
  getElementById(s){return s==='dtsLadderBtn'?btn:s==='simulateBtn'?{disabled:false}:
   s==='scene'?{addEventListener(){}}:null}};
 const cpu={pins:[...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
 const editor={running:false,byId:{cpu},getProject(){return project},toast(){}};
 const deps={'./ladder-runtime.js':{...Runtime,supportedPLC:()=>true},
  './ladder-toolbox.js':require('../dist/ladder-toolbox.js'),
  './fbd-view.js':require('../dist/fbd-view.js'),
  './ladder-monitor.js':{snapshot(){return {}},markup(){return ''}},
  './ladder-diagram.js':{render(){return '<svg/>'}},
  './ladder-timer-guide.js':{markup(){return ''}},
  './ladder-examples.js':{list(){return []}},'./ladder-program-io.js':{}};
 const env={document:doc,DTSEditor:editor,setInterval(){return 1},clearInterval(){}};
 const module={exports:{}};
 new Function('module','require','window',fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8'))(
  module,n=>deps[n]||{},env);
 btn.events.click();
 function find(action,p='',c=''){
  return overlay.nodes.find(n=>n.dataset.action===action&&n.dataset.r==='0'&&
   (p===''||n.dataset.p===String(p))&&(c===''||n.dataset.c===String(c)));
 }
 function press(action,p='',c=''){
  const element=find(action,p,c);
  assert.ok(element,'Missing '+action+':'+p+':'+c);
  assert.equal(element.disabled,false);
  element.focus();
  overlay.events.click({target:{closest:s=>s==='[data-action]'?element:null}});
  return doc.activeElement?.dataset||{};
 }
 return {press,find,focused:()=>doc.activeElement?.dataset||{},overlay,component,project};
}
test('LAD deleting middle branch returns keyboard focus to same Network',()=>{
 const x=setup();const focused=x.press('remove-path',1);
 assert.equal(focused.action,'focus-network');
 assert.equal(focused.rungId,'R1');
 assert.equal(x.find('remove-path',1)!=null,true); // old third branch now uses index 1
 assert.deepEqual(x.component.ladderProgram,sample());
});
test('LAD deleting final branch does not focus absent path',()=>{
 const x=setup();const focused=x.press('remove-path',2);
 assert.equal(focused.action,'focus-network');assert.equal(focused.rungId,'R1');
});
test('LAD adding parallel path focuses new branch plus Seri',()=>{
 const x=setup();const f=x.press('add-path');
 assert.equal(f.action,'add-contact');assert.equal(f.r,'0');assert.equal(f.p,'3');
});
test('LAD appending series contact focuses newly added operand',()=>{
 const x=setup();const f=x.press('add-contact',1);
 assert.equal(f.field,'contact-ref');assert.equal(f.p,'1');assert.equal(f.c,'1');
});
test('LAD removing final series contact focuses safe empty path control',()=>{
 const x=setup();const f=x.press('remove-contact',1,0);
 assert.equal(f.action,'add-contact');assert.equal(f.p,'1');
 assert.deepEqual(x.component.ladderProgram,sample());
});
test('LAD removing one of two contacts focuses surviving contact',()=>{
 const source=sample();
 source.rungs[0].paths[1].push({type:'NC',ref:'I4'});
 const cut=E.removeContact(source,0,1,0,limits);
 assert.equal(cut.ok,true);
 assert.equal(E.ladStructureNextFocus(cut.program,'remove-contact',0,1,0),'field:contact-ref:0:1:0');
 assert.equal(cut.program.rungs[0].paths[1][0].ref,'I4');
});
test('invalid actions and coordinates cannot make a misleading focus target',()=>{
 const p=sample();
 for(const [action,r,i,j] of [['add-path',-1,0,0],['remove-path',NaN,0,0],
  ['add-contact',0,9,0],['remove-contact',0,0,-1],['unknown',0,1,0]]){
  assert.equal(E.ladStructureNextFocus(p,action,r,i,j),'');
 }
});
test('serial and parallel edits preserve native output semantics and undo history',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const added=E.addSafeParallelPath(p,0,limits);
 assert.equal(added.ok,true);assert.deepEqual(added.program.rungs[0].paths[1],[]);
 const scan=Runtime.scan(added.program,{I1:false},{},100,limits);
 assert.equal(scan.ok,true);assert.equal(scan.outputs.Q1,false);
 const cleared=E.removeContact(p,0,0,0,limits);
 assert.equal(cleared.ok,true);assert.deepEqual(cleared.program.rungs[0].paths,[[]]);
 assert.equal(Runtime.scan(cleared.program,{I1:true},{},200,limits).outputs.Q1,false);
 const history=E.createDraftHistory(p);history.push(added.program);
 assert.deepEqual(history.undo(),p);assert.deepEqual(history.redo(),added.program);
});
test('LAD structural edits never modify the saved CPU program without Save',()=>{
 const x=setup();x.press('add-path');x.press('add-contact',0);x.press('remove-path',1);
 assert.deepEqual(x.component.ladderProgram,sample());
});
test('LAD structural helper restores same-rung header after path deletion',()=>{
 const p=sample(),d=E.removeParallelPath(p,0,1,limits);
 assert.equal(d.ok,true);
 assert.equal(E.ladStructureNextFocus(d.program,'remove-path',0,1,NaN),'action:focus-network:R1::');
});
