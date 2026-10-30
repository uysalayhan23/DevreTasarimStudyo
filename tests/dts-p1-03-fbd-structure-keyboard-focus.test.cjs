'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const E=require('../dist/ladder-editor.js'),F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const lim={inputCount:6,outputCount:4};
const program=()=>({version:1,rungs:[{id:'R1',paths:[
 [{type:'NO',ref:'I1'}],[{type:'NC',ref:'I2'},{type:'NO',ref:'I3'}]
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
test('all FBD structure buttons have restorable positional focus identities',()=>{
 for(const op of ['add-contact','add-contact-before','remove-contact','add-path','remove-path']){
  const pos=op.endsWith('path')?'0:0':'0:0:0';
  assert.equal(E.focusKey({dataset:{fbdStructure:op,fbdPosition:pos}}),'fbd-structure:'+op+':'+pos);
 }
});
test('insert-before focuses newly inserted contact operand',()=>{
 const h=ui();assert.equal(h.edit('add-contact-before','0:1:0').fbdContactRef,'0:1:0');
});
test('append serial contact focuses the new last operand',()=>{
 const h=ui();assert.equal(h.edit('add-contact','0:1:1').fbdContactRef,'0:1:2');
});
test('removing a middle contact selects the surviving contact',()=>{
 const h=ui();assert.equal(h.edit('remove-contact','0:1:0').fbdContactRef,'0:1:0');
});
test('removing final contact focuses the safe empty-path + Seri action',()=>{
 const h=ui(),f=h.edit('remove-contact','0:0:0');
 assert.equal(f.fbdStructure,'add-contact');assert.equal(f.fbdPosition,'0:0:0');
 assert.deepEqual(h.plc.ladderProgram,program());
});
test('adding parallel branch directs keyboard to the new empty OR branch',()=>{
 const h=ui(),f=h.edit('add-path','0:0');
 assert.equal(f.fbdStructure,'add-contact');assert.equal(f.fbdPosition,'0:1:0');
});
test('removing last parallel branch returns to same Network header',()=>{
 const h=ui(),f=h.edit('remove-path','0:1');
 assert.equal(f.action,'focus-network');assert.equal(f.rungId,'R1');
});
test('after FBD structural edits Undo restores original saved program',()=>{
 const h=ui();h.edit('remove-contact','0:0:0');h.press('undo');
 assert.deepEqual(h.plc.ladderProgram,program());
});
test('FBD branch/contact validation prevents invalid deletion or hidden write',()=>{
 const p=program(),original=JSON.stringify(p);
 assert.equal(F.editStructure(p,'remove-path','0:9',lim).ok,false);
 assert.equal(F.editStructure(p,'remove-contact','0:0:99',lim).ok,false);
 assert.equal(JSON.stringify(p),original);
});
test('a contact-deleted open path never energizes the native Q output',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const cleared=F.editStructure(p,'remove-contact','0:0:0',lim);
 assert.equal(cleared.ok,true);
 assert.equal(L.scan(cleared.program,{I1:true},{},100,lim).outputs.Q1,false);
});
test('helper rejects malformed structural positions',()=>{
 for(const invalid of ['','00:0','0:0:','0:NaN','9007199254740992:0'])
  assert.equal(E.fbdStructureNextFocus(program(),'add-path',invalid),'');
});
test('a last remaining FBD path cannot be deleted',()=>{
 const p=program(),one=F.editStructure(p,'remove-path','0:1',lim);
 assert.equal(one.ok,true);assert.equal(F.editStructure(one.program,'remove-path','0:0',lim).ok,false);
});
