'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Panel=require('../dist/panel.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/panel-editor.js'),'utf8');
const start=source.indexOf("  $('#panelDoorAngle').oninput=e=>{");
const end=source.indexOf("  $('#panelToggleDoor').onclick=()=>{",start);
assert.ok(start!==-1&&end>start,'Real door angle input/change handlers are available');
assert.match(source,/if\(properties\)engineeringSummary\(p,closure\)/,'Actual render() gates engineering checks on full render');
const handlers=source.slice(start,end);
function fixture({angle=105,active=true,snapshot=true,blocked=false}={}){
 const p={width:600,height:800,depth:220,doorAngle:angle,items:[],rails:[],ducts:[],wires:[]};
 const ui={'#panelDoorAngle':{value:angle},'#panelDoorValue':{textContent:String(angle)+'°'}};
 const calls={renders:[],saves:0,snapshots:0,toasts:[],cancels:0,engineeringAngle:angle};
 const $=key=>ui[key];
 const render=(properties=true)=>{calls.renders.push(properties);if(properties)calls.engineeringAngle=p.doorAngle};
 const E={snapshot(){calls.snapshots++;return snapshot},scheduleSave(){calls.saves++},toast(s){calls.toasts.push(s)}};
 const wrapP={doorClearance: blocked? ()=>({ok:false,collision:{doorId:'door',plateId:'plate'},reason:'Kapak çakışması'}):Panel.doorClearance};
 const create=new Function('$','active','P','panel','E','render','cancelAnimationFrame','selected',
  'let angleBefore=null,doorFrame=null;\n'+handlers+'\nreturn {getAngleBefore:()=>angleBefore};');
 const state=create($,()=>active,wrapP,()=>p,E,render,()=>{calls.cancels++},new Set());
 const input=value=>{ui['#panelDoorAngle'].value=value;ui['#panelDoorAngle'].oninput({target:ui['#panelDoorAngle']})};
 const change=()=>ui['#panelDoorAngle'].onchange();
 return {p,ui,calls,input,change,state};
}
test('P1-20 negative: finished door angle gesture refreshes the engineering summary',()=>{
 const f=fixture();f.input(110);
 assert.equal(f.p.doorAngle,110);
 assert.equal(f.calls.engineeringAngle,105,'Fast input deliberately defers engineering checks');
 f.change();
 assert.equal(f.calls.engineeringAngle,110,'Engineering status must reflect committed door angle');
 assert.deepEqual(f.calls.renders,[false,true]);
 assert.equal(f.calls.saves,1);
});
test('P1-20 positive: many rapid slider inputs do not trigger heavy engineering checks',()=>{
 const f=fixture();for(const a of [106,107,109,112])f.input(a);
 assert.deepEqual(f.calls.renders,[false,false,false,false]);
 assert.equal(f.calls.snapshots,1);
 f.change();
 assert.deepEqual(f.calls.renders,[false,false,false,false,true]);
 assert.equal(f.calls.engineeringAngle,112);
});
test('P1-20 negative: each completed slider gesture refreshes summary exactly once',()=>{
 const f=fixture();f.input(110);f.change();f.input(115);f.change();
 assert.equal(f.calls.engineeringAngle,115);
 assert.equal(f.calls.renders.filter(Boolean).length,2);
 assert.equal(f.calls.snapshots,2);
 assert.equal(f.calls.saves,2);
});
test('P1-20 negative: a rejected undo snapshot does not schedule a fake save or mutate angle',()=>{
 const f=fixture({snapshot:false});f.input(110);f.change();
 assert.equal(f.p.doorAngle,105);
 assert.equal(f.calls.saves,0);
 assert.equal(f.calls.engineeringAngle,105);
});
test('P1-20 negative: inactive workspace change cannot schedule a save',()=>{
 const f=fixture({active:false});f.input(110);f.change();
 assert.equal(f.p.doorAngle,105);
 assert.equal(f.calls.saves,0);
});
test('P1-20 positive: unsafe closing attempt is rejected before changing real door angle',()=>{
 const f=fixture({blocked:true});f.input(90);f.change();
 assert.equal(f.p.doorAngle,105);
 assert.equal(f.ui['#panelDoorAngle'].value,105);
 assert.equal(f.calls.engineeringAngle,105);
 assert.ok(f.calls.toasts.some(s=>/çakışması/.test(s)));
});
test('P1-20 positive: no extra engineering scans before change event',()=>{
 const f=fixture({angle:100});f.input(105);
 assert.equal(f.calls.renders.filter(Boolean).length,0);
 assert.equal(f.calls.saves,0);
});
test('P1-20 positive: standalone change without a preceding valid input does not persist a phantom edit',()=>{
 const f=fixture();f.change();
 assert.equal(f.calls.saves,0);
 assert.equal(f.calls.renders.length,0);
});
