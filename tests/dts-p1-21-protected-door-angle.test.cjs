'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Panel=require('../dist/panel.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/panel-editor.js'),'utf8');
const start=source.indexOf("  $('#panelDoorAngle').oninput=e=>{");
const end=source.indexOf("  $('#panelToggleDoor').onclick=()=>{",start);
assert.ok(start>=0&&end>start,'Real door-angle handlers must exist');
const handlers=source.slice(start,end);
function fixture({editable=true,snapshot=true,active=true,angle=105}={}){
 const panel={width:600,height:800,depth:220,doorAngle:angle,items:[],wires:[],rails:[],ducts:[]};
 const ui={'#panelDoorAngle':{value:angle},'#panelDoorValue':{textContent:angle+'°'}};
 const state={editable,snapshot,active,undo:0,saves:0,renders:[],toasts:[]};
 const E={snapshot:()=>{state.undo++;return state.snapshot},scheduleSave:()=>{state.saves++},toast:m=>state.toasts.push(m)};
 const wire=new Function('$','editable','active','P','panel','E','render','cancelAnimationFrame','selected',
    'let angleBefore=null,doorFrame=null;\n'+handlers+'\nreturn {getBefore:()=>angleBefore};');
 const obj=wire(k=>ui[k],()=>state.editable,()=>state.active,Panel,()=>panel,E,v=>state.renders.push(v),()=>{},new Set());
 return {p:panel,ui,state,obj,input(value){ui['#panelDoorAngle'].value=value;ui['#panelDoorAngle'].oninput({target:ui['#panelDoorAngle']})},change(){ui['#panelDoorAngle'].onchange()}};
}
test('P1-21 negative: protected panel refuses door slider input and restores visual thumb',()=>{
 const f=fixture({editable:false,snapshot:false});f.input(75);
 assert.equal(f.p.doorAngle,105);assert.equal(Number(f.ui['#panelDoorAngle'].value),105);
 assert.equal(f.ui['#panelDoorValue'].textContent,'105°');assert.equal(f.state.undo,0);
 f.change();assert.equal(f.state.saves,0);
});
test('P1-21 negative: safety lock raised during drag prevents subsequent change without new snapshot',()=>{
 const f=fixture();f.input(110);assert.equal(f.p.doorAngle,110);assert.equal(f.state.undo,1);
 f.state.editable=false;f.input(120);
 assert.equal(f.p.doorAngle,110);assert.equal(Number(f.ui['#panelDoorAngle'].value),110);
 assert.equal(f.state.undo,1);
});
test('P1-21 negative: readonly transition mid-gesture cannot mutate the project on repeated input',()=>{
 const f=fixture();f.input(110);f.state.editable=false;
 for(const angle of [115,120,80])f.input(angle);
 assert.equal(f.p.doorAngle,110);assert.equal(Number(f.ui['#panelDoorAngle'].value),110);
});
test('P1-21 negative: rejected history snapshot restores thumb without advancing angle',()=>{
 const f=fixture({editable:true,snapshot:false});f.input(95);
 assert.equal(f.p.doorAngle,105);assert.equal(Number(f.ui['#panelDoorAngle'].value),105);
 assert.equal(f.state.undo,1);f.change();assert.equal(f.state.saves,0);
});
test('P1-21 positive: editable panel still updates angle with one snapshot and final save',()=>{
 const f=fixture();f.input(110);f.input(115);f.change();
 assert.equal(f.p.doorAngle,115);assert.equal(f.state.undo,1);assert.equal(f.state.saves,1);
 assert.deepEqual(f.state.renders,[false,false,undefined]);
});
test('P1-21 positive: inactive workspace still ignores slider input',()=>{
 const f=fixture({active:false});f.input(92);
 assert.equal(f.p.doorAngle,105);assert.equal(f.state.undo,0);
});
test('P1-21 positive: readonly restored to editable starts a fresh guarded edit',()=>{
 const f=fixture({editable:false,snapshot:false});f.input(95);f.state.editable=true;f.state.snapshot=true;f.input(95);f.change();
 assert.equal(f.p.doorAngle,95);assert.equal(f.state.undo,1);assert.equal(f.state.saves,1);
});

test('P1-21 negative: unlock after interrupted slider gesture takes a fresh undo snapshot',()=>{
 const f=fixture();f.input(110);f.state.editable=false;f.input(120);f.state.editable=true;f.input(115);f.change();
 assert.equal(f.p.doorAngle,115);assert.equal(f.state.undo,2);assert.equal(f.state.saves,1);
});
