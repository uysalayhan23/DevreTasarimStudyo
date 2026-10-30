'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Runtime=require('../dist/ladder-runtime.js');
const E=require('../dist/ladder-editor.js');
const F=require('../dist/fbd-view.js');
const T=require('../dist/ladder-toolbox.js');
const lim={inputCount:6,outputCount:4};
const sample=(names=['R1','R2','R3'])=>({version:1,rungs:names.map((id,i)=>({
 id,paths:[[{type:'NO',ref:'I'+(i+1)}]],coil:{type:'OUT',ref:'Q'+(i+1)}
}))});
function app(){
 const a={id:'A',typeId:'cpu',ladderProgram:sample(),plcProgram:'dts-ladder-v1'};
 const project={components:[a]};let doc,overlay;
 const btn={dataset:{},listeners:{},isConnected:true,addEventListener(n,f){this.listeners[n]=f},focus(){}};
 const parse=html=>{
  const data={},match=(name)=>new RegExp('(?:^|\\s)'+name+'="([^"]*)"').exec(html)?.[1]||'';
  for(const m of html.matchAll(/data-([a-z-]+)="([^"]*)"/g))
   data[m[1].replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=m[2];
  const n={dataset:data,inside:true,id:match('id'),tabIndex:0,hidden:false,
   disabled:/(?:\s)disabled(?:\s|>)/.test(html),
   getAttribute(){return null},closest(){return null},focus(){doc.activeElement=n}};
  return n;
 };
 const modal={inside:true,focus(){doc.activeElement=modal}};
 overlay={hidden:true,handlers:{},html:'',nodes:[],
  set innerHTML(v){this.html=v;this.nodes=[...v.matchAll(/<(?:button|input|select)\b[^>]*>/g)].map(m=>parse(m[0]))},
  get innerHTML(){return this.html},
  setAttribute(){},addEventListener(n,f){this.handlers[n]=f},
  contains(n){return n?.inside===true},
  querySelector(n){return n==='.dts-ladder-dialog'?modal:n==='.dts-ladder-advanced'?{open:false}:
    n==='.dts-ladder-rungs'?{scrollTop:0}:{focus(){}}
  },
  querySelectorAll(n){return n==='button,select,input'?this.nodes:[]}
 };
 doc={activeElement:btn,body:{appendChild(){}},createElement(){return overlay},
  getElementById(id){return id==='dtsLadderBtn'?btn:id==='scene'?{addEventListener(){}}:
   id==='simulateBtn'?{disabled:false}:null}};
 const cpu={pins:[
  ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
 ]};
 const editor={byId:{cpu},getProject(){return project},running:false,toast(){}};
 const env={document:doc,DTSEditor:editor,setInterval(){return 1},clearInterval(){}};
 const deps={'./ladder-runtime.js':{...Runtime,supportedPLC(){return true}},
  './ladder-toolbox.js':T,'./fbd-view.js':F,'./ladder-diagram.js':{render:()=>'<svg/>'},
  './ladder-monitor.js':{markup:()=>'',snapshot:()=>({})},
  './ladder-program-io.js':{},'./ladder-examples.js':{list:()=>[]},
  './ladder-timer-guide.js':{markup:()=>''}};
 const m={exports:{}};new Function('module','require','window',
  fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8'))(m,n=>deps[n]||{},env);
 btn.listeners.click();
 const find=(action,rung)=>overlay.nodes.find(n=>n.dataset.action===action&&n.dataset.rungId===rung);
 const click=(action,rung)=>{const el=find(action,rung);assert.ok(el,action+' '+rung);assert.equal(el.disabled,false);
  el.focus();overlay.handlers.click({target:{closest:q=>q==='[data-action]'?el:null}});
 };
 const activate=node=>{assert.ok(node);node.focus();overlay.handlers.click({target:{closest:q=>q==='[data-action]'?node:null}})};
 const undo=()=>{const node=doc.activeElement;overlay.handlers.keydown({key:'z',ctrlKey:true,altKey:false,metaKey:false,shiftKey:false,target:node,preventDefault(){},stopPropagation(){}})};
 return {click,find,doc,a,overlay,activate,undo};
}
test('LAD: Ctrl+Z after moving a rung keeps focus on its own remove-contact',()=>{
 const u=app();u.click('move-rung-up','R2');
 const contact=u.overlay.nodes.find(n=>n.dataset.action==='remove-contact'&&n.dataset.rungId==='R2');
 assert.equal(contact.dataset.r,'0');
 contact.focus();u.undo();
 assert.equal(u.doc.activeElement.dataset.rungId,'R2');
 assert.equal(u.doc.activeElement.dataset.action,'remove-contact');
 assert.equal(u.doc.activeElement.dataset.r,'1');
 assert.deepEqual(u.a.ladderProgram,sample());
});
test('LAD: identity persists for both input selector and the output command',()=>{
 const u=app();u.click('move-rung-up','R2');
 const current=u.overlay.nodes.find(n=>n.dataset.field==='contact-ref'&&n.dataset.rungId==='R2');
 const output=u.overlay.nodes.find(n=>n.dataset.field==='coil-type'&&n.dataset.rungId==='R2');
 assert.ok(current&&output);
 assert.equal(current.dataset.r,'0');
 const x=E.focusKey(current);
 assert.equal(E.focusKey({dataset:{...current.dataset,r:'1'}}),x);
 assert.notEqual(E.focusKey({dataset:{...current.dataset,rungId:'R1'}}),x);
});
test('FBD: Ctrl+Z after moving a rung preserves its NO/NC button focus',()=>{
 const u=app();
 u.activate(u.overlay.nodes.find(n=>n.dataset.action==='toggle-diagram'));
 u.click('move-rung-up','R2');
 const polarity=u.overlay.nodes.find(n=>n.dataset.fbdToggleContact==='0:0:0'&&n.dataset.rungId==='R2');
 assert.ok(polarity);polarity.focus();u.undo();
 assert.equal(u.doc.activeElement.dataset.rungId,'R2');
 assert.equal(u.doc.activeElement.dataset.fbdToggleContact,'1:0:0');
 assert.deepEqual(u.a.ladderProgram,sample());
});
test('FBD: Ctrl+Z from contact deletion button targets the same moved rung',()=>{
 const u=app();
 u.activate(u.overlay.nodes.find(n=>n.dataset.action==='toggle-diagram'));
 u.click('move-rung-up','R2');
 const btn=u.overlay.nodes.find(n=>n.dataset.fbdStructure==='remove-contact'&&n.dataset.rungId==='R2');
 assert.ok(btn);btn.focus();u.undo();
 assert.equal(u.doc.activeElement.dataset.rungId,'R2');
 assert.equal(u.doc.activeElement.dataset.fbdPosition,'1:0:0');
});
test('FBD: contact address and coil editors have stable identity after reordering',()=>{
 const u=app();u.activate(u.overlay.nodes.find(n=>n.dataset.action==='toggle-diagram'));u.click('move-rung-up','R2');
 for(const field of ['fbdContactRef','fbdToggleContact','fbdPosition','fbdCoilField']){
  const el=u.overlay.nodes.find(n=>n.dataset[field]&&n.dataset.rungId==='R2');
  assert.ok(el,'missing tagged '+field);
  const old=E.focusKey(el);
  const shifted={...el.dataset,r:'1'};
  if(shifted.fbdContactRef)shifted.fbdContactRef='1'+shifted.fbdContactRef.slice(shifted.fbdContactRef.indexOf(':'));
  if(shifted.fbdToggleContact)shifted.fbdToggleContact='1'+shifted.fbdToggleContact.slice(shifted.fbdToggleContact.indexOf(':'));
  if(shifted.fbdPosition)shifted.fbdPosition='1'+shifted.fbdPosition.slice(shifted.fbdPosition.indexOf(':'));
  assert.equal(E.focusKey({dataset:shifted}),old);
  assert.notEqual(E.focusKey({dataset:{...el.dataset,rungId:'R1'}}),old);
 }
});
test('LAD/FBD structural edit preferred positional focus remains backward compatible',()=>{
 const u=app();u.activate(u.overlay.nodes.find(n=>n.dataset.action==='toggle-diagram'));
 const plus=u.overlay.nodes.find(n=>n.dataset.fbdStructure==='add-path'&&n.dataset.rungId==='R2');
 assert.ok(plus);plus.focus();
 u.overlay.handlers.click({target:{closest:q=>q==='[data-fbd-structure]'?plus:null}});
 assert.equal(u.doc.activeElement.dataset.rungId,'R2');
 assert.equal(u.doc.activeElement.dataset.fbdStructure,'add-contact');
 assert.equal(u.doc.activeElement.dataset.fbdPosition,'1:1:0');
 assert.deepEqual(u.a.ladderProgram,sample());
});
test('native scan still respects Network order; changes remain unsaved until Save',()=>{
 const program={version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q2'}}]};
 const moved=E.editNetworkOrder(program,'up',1,lim);assert.equal(moved.ok,true);
 assert.equal(Runtime.scan(program,{I1:true},{},20,lim).outputs.Q2,true);
 assert.equal(Runtime.scan(moved.program,{I1:true},{},20,lim).outputs.Q2,false);
 assert.deepEqual(program.rungs.map(x=>x.id),['R1','R2']);
});
test('FBD render tags only supported controls, while invalid programs fail closed',()=>{
 const good=F.render({id:'R7',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TON',ref:'T1',presetMs:1000}}, {index:2,limits:lim});
 const relevant=[...good.matchAll(/<(?:button|select|input)\b[^>]*data-(?:fbd|action)[^>]*>/g)];
 assert.ok(relevant.length>=8);
 for(const el of relevant)assert.ok(el[0].includes('data-rung-id="R7"'));
 const invalid=F.render({id:'R7',paths:[[]],coil:{type:'TON',ref:'T1',presetMs:0}}, {index:2,limits:lim});
 assert.match(invalid,/geçersiz taslak/);
});
