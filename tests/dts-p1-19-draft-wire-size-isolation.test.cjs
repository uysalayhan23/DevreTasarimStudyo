'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Wiring=require('../dist/panel-wiring.js');
const Lines=require('../dist/conductors.js');

// Bind the exact user-facing size onchange handler from the real panel editor.
// This executes its actual branching and real Wiring.setSize / Wiring.recolor.
const source=fs.readFileSync(path.resolve(__dirname,'../dist/panel-editor.js'),'utf8');
const match=source.match(/^  \$\('#panelWireSize'\)\.onchange=.+;$/m);
assert.ok(match,'The real panel size selection handler must be present');
const attachHandler=new Function('$','selectedCable','update','W','E','Lines','render','initialDraft',
  'let draft=initialDraft;\n'+match[0]+'\nreturn {getDraft:()=>draft};');
const color='#e53935';
const other='#2563eb';
function wire(id,size='1,5 mm²',shade=color){return {id,color:shade,size,styleSize:size,styleColor:shade,from:{c:'A',p:'1'},to:{c:'B',p:'2'}}}
function fixture({draft=false,selected=null,chosen='2,5 mm²'}={}){
 const p={wires:[wire('existing-1'),wire('existing-2'),wire('other-color','4 mm²',other)],colorSizes:{[color]:'1,5 mm²'},items:[],rails:[],ducts:[]};
 const ui={"#panelWireSize":{value:chosen},"#panelWireColor":{value:color}};
 const $=key=>{assert.ok(ui[key],`Unexpected selector ${key}`);return ui[key]};
 const state={snapshots:0,changed:0,renderCalls:[],mutations:0};
 let active=p;
 const initialDraft=draft?{from:{c:'A',p:'1'},points:[],color,size:'1,5 mm²'}:null;
 const update=fn=>{state.mutations++;const next=structuredClone(active);const result=fn(next)||{ok:true};if(result.ok===false)return false;state.snapshots++;state.changed++;active=next;return true};
 const r=attachHandler($,()=>selected?active.wires.find(w=>w.id===selected):null,update,Wiring,{},Lines,v=>state.renderCalls.push(v),initialDraft);
 return {p:()=>active,ui,state,fire:()=>ui['#panelWireSize'].onchange(),getDraft:r.getDraft};
}
test('P1-19 negative: draft size change must not resize existing same-color wires',()=>{
 const f=fixture({draft:true});const before=f.p().wires.map(w=>w.size);
 f.fire();assert.equal(f.getDraft().size,'2,5 mm²');assert.deepEqual(f.p().wires.map(w=>w.size),before);
});
test('P1-19 negative: drafting size choice does not alter saved global color-size preference',()=>{
 const f=fixture({draft:true});const before=structuredClone(f.p().colorSizes);
 f.fire();assert.deepEqual(f.p().colorSizes,before);
});
test('P1-19 negative: draft-only choice creates no undo snapshot or live project change',()=>{
 const f=fixture({draft:true});f.fire();assert.equal(f.state.snapshots,0);assert.equal(f.state.changed,0);assert.equal(f.state.mutations,0);
});
test('P1-19 positive: draft path refreshes visual preview without saving',()=>{
 const f=fixture({draft:true});f.fire();assert.deepEqual(f.state.renderCalls,[false]);
});
test('P1-19 negative: active selected old wire is not resized while draft is open',()=>{
 const f=fixture({draft:true,selected:'existing-1'});f.fire();assert.equal(f.p().wires[0].size,'1,5 mm²');assert.equal(f.getDraft().size,'2,5 mm²');
});
test('P1-19 positive: selected existing wire (no draft) still changes just that wire',()=>{
 const f=fixture({selected:'existing-1'});f.fire();assert.equal(f.p().wires[0].size,'2,5 mm²');assert.equal(f.p().wires[1].size,'1,5 mm²');assert.equal(f.p().wires[2].size,'4 mm²');assert.equal(f.state.snapshots,1);
});
test('P1-19 positive: global size setting with no draft still adjusts existing same-color wires',()=>{
 const f=fixture();f.fire();assert.deepEqual(f.p().wires.map(w=>w.size),['2,5 mm²','2,5 mm²','4 mm²']);assert.equal(f.p().colorSizes[color],'2,5 mm²');assert.equal(f.state.snapshots,1);
});
test('P1-19 positive: repeated draft choices only update the temporary planned size',()=>{
 const f=fixture({draft:true});f.fire();f.ui['#panelWireSize'].value='6 mm²';f.fire();assert.equal(f.getDraft().size,'6 mm²');assert.equal(f.p().wires[0].size,'1,5 mm²');assert.equal(f.state.snapshots,0);
});
