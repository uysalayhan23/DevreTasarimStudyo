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
 return {click,find,doc,a,overlay};
}
test('moving R3 into middle keeps focus on R3 up button',()=>{
 const u=app();u.click('move-rung-up','R3');
 assert.equal(u.doc.activeElement.dataset.rungId,'R3');
 assert.equal(u.doc.activeElement.dataset.action,'move-rung-up');
 assert.deepEqual(u.a.ladderProgram,sample());
});
test('moving R2 to top focuses R2 enabled workspace control',()=>{
 const u=app();u.click('move-rung-up','R2');
 assert.equal(u.find('move-rung-up','R2').disabled,true);
 assert.equal(u.doc.activeElement.dataset.rungId,'R2');
 assert.equal(u.doc.activeElement.dataset.action,'focus-network');
});
test('moving R2 to bottom focuses R2 enabled workspace control',()=>{
 const u=app();u.click('move-rung-down','R2');
 assert.equal(u.find('move-rung-down','R2').disabled,true);
 assert.equal(u.doc.activeElement.dataset.rungId,'R2');
 assert.equal(u.doc.activeElement.dataset.action,'focus-network');
});
test('focus identity follows stable rung IDs, never old list indices',()=>{
 const d=(r,id)=>({dataset:{action:'move-rung-up',r,rungId:id}});
 assert.equal(E.focusKey(d('1','R2')),E.focusKey(d('0','R2')));
 assert.notEqual(E.focusKey(d('1','R2')),E.focusKey(d('1','R1')));
});
test('all seven Network title controls carry stable rung identity',()=>{
 const u=app();
 for(const id of ['R1','R2','R3'])
  assert.equal(u.overlay.nodes.filter(n=>n.dataset.rungId===id).length,7);
});
test('Network order alters scan execution without rewriting saved draft',()=>{
 const p={version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
  {id:'R2',paths:[[{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q2'}}
 ]};
 const move=E.editNetworkOrder(p,'up',1,lim);
 assert.equal(move.ok,true);
 assert.deepEqual(move.program.rungs.map(r=>r.id),['R2','R1']);
 const old=Runtime.scan(p,{I1:true},{},10,lim),now=Runtime.scan(move.program,{I1:true},{},10,lim);
 assert.equal(old.outputs.Q2,true);assert.equal(now.outputs.Q2,false);
 assert.deepEqual(p.rungs.map(r=>r.id),['R1','R2']);
});
test('Network moves retain native Undo and Redo',()=>{
 const p=sample(),h=E.createDraftHistory(p),move=E.editNetworkOrder(p,'up',2,lim);
 assert.equal(move.ok,true);h.push(move.program);
 assert.deepEqual(h.undo(),p);assert.deepEqual(h.redo(),move.program);
 assert.equal(Runtime.validate(h.current(),lim).ok,true);
});
test('new parallel path is open and removable without output activation',()=>{
 const p=sample(['R1']),add=E.addSafeParallelPath(p,0,lim);
 assert.equal(add.ok,true);assert.deepEqual(add.program.rungs[0].paths[1],[]);
 assert.equal(Runtime.scan(add.program,{I1:false},{},10,lim).outputs.Q1,false);
 assert.deepEqual(E.removeParallelPath(add.program,0,1,lim).program,p);
});
test('serial contact insertion and removal are transactional',()=>{
 const p=sample(['R1']),add=F.editStructure(p,'add-contact-before','0:0:0',lim);
 assert.equal(add.ok,true);assert.equal(add.program.rungs[0].paths[0].length,2);
 assert.deepEqual(F.editStructure(add.program,'remove-contact','0:0:0',lim).program,p);
 assert.deepEqual(p,sample(['R1']));
});
test('removing last serial contact opens path and last branch removal fails',()=>{
 const p=sample(['R1']),cut=E.removeContact(p,0,0,0,lim);
 assert.equal(cut.ok,true);assert.deepEqual(cut.program.rungs[0].paths,[[]]);
 assert.equal(Runtime.scan(cut.program,{I1:true},{},10,lim).outputs.Q1,false);
 assert.equal(E.removeParallelPath(cut.program,0,0,lim).ok,false);
});
