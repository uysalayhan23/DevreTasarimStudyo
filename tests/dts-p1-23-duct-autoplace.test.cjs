'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Panel=require('../dist/panel.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/panel-editor.js'),'utf8');
const checkStart=source.indexOf('  function checkDuct(p,d){'),checkEnd=source.indexOf('  function addAccessory(',checkStart);
const addStart=source.indexOf('  function addDuct(){'),addEnd=source.indexOf('  function removeSelected()',addStart);
assert.ok(checkStart>=0&&checkEnd>checkStart&&addStart>checkStart&&addEnd>addStart,'test real production panel-editor functions');
const checkDuct=new Function('P',source.slice(checkStart,checkEnd)+';return checkDuct')(Panel);
const makeAdd=new Function('P','update','checkDuct','showInterior','selected',source.slice(addStart,addEnd)+';return addDuct');
function fixture({width=600,height=800,items=[],ducts=[]}={}){
 let p={width,height,depth:220,doorAngle:105,rails:[],items,ducts,wires:[]};
 let saves=0,shows=0,errors=[],selected=new Set();
 function update(mutator){const candidate=structuredClone(p);const result=mutator(candidate)||{ok:true};if(result.ok===false){errors.push(result.reason);return false}p=candidate;saves++;return true}
 const add=makeAdd(Panel,update,checkDuct,()=>{shows++},selected);
 return {add,get p(){return p},get saves(){return saves},get shows(){return shows},get errors(){return errors}};
}
const bounds=d=>({x:d.x,y:d.y,w:d.vertical?d.width:d.length,h:d.vertical?d.length:d.width});
const overlap=(a,b)=>Panel.overlap(bounds(a),bounds(b),0);
const item=(x,y,w=50,h=70,mount='plate')=>({id:'part-'+x+'-'+y,x,y,w,h,depth:30,mount,typeId:'contactor'});

test('P1-23 negative: clicking Add Duct twice makes two separately visible channels',()=>{
 const f=fixture();f.add();f.add();assert.equal(f.p.ducts.length,2);
 assert.equal(overlap(f.p.ducts[0],f.p.ducts[1]),false,'second channel must not obscure first');
});
test('P1-23 negative: five successive Add Duct operations never stack channels',()=>{
 const f=fixture();for(let i=0;i<5;i++)f.add();assert.equal(f.p.ducts.length,5);
 for(let i=0;i<f.p.ducts.length;i++)for(let j=i+1;j<f.p.ducts.length;j++)assert.equal(overlap(f.p.ducts[i],f.p.ducts[j]),false,`duct ${i+1}/${j+1} overlap`);
});
test('P1-23 negative: Add Duct finds another free lane if default lane intersects an item',()=>{
 const f=fixture({items:[item(545,150,40,80)]});f.add();assert.equal(f.p.ducts.length,1);
 assert.equal(Panel.overlap(bounds(f.p.ducts[0]),f.p.items[0],0),false);
 assert.equal(f.saves,1);
});
test('P1-23 positive: initial empty panel keeps historical first right-side default',()=>{
 const f=fixture();f.add();assert.deepEqual({x:f.p.ducts[0].x,y:f.p.ducts[0].y,width:f.p.ducts[0].width,length:f.p.ducts[0].length,vertical:f.p.ducts[0].vertical},{x:550,y:40,width:30,length:720,vertical:true});
});
test('P1-23 negative: all available lanes occupied fails without adding a phantom duct or Undo item',()=>{
 const f=fixture({width:200,height:200,items:[item(20,60,160,70)]});f.add();
 assert.equal(f.p.ducts.length,0);assert.equal(f.saves,0);assert.equal(f.shows,0);
 assert.ok(f.errors.length&&/kanal|alan|yer/i.test(f.errors[0]));
});
test('P1-23 positive: a door-mounted item does not block a plate duct',()=>{
 const f=fixture({items:[item(545,100,40,80,'door')]});f.add();
 assert.equal(f.p.ducts[0].x,550);
});
test('P1-23 positive: accessory placement remains independent of cable channel spacing',()=>{
 const f=fixture({ducts:[{id:'g',kind:'gland',x:550,y:40,width:30,length:50,vertical:true}]});f.add();
 assert.equal(f.p.ducts.length,2);assert.equal(f.p.ducts[1].x,545);
});
test('P1-23 positive: all successful Add Duct operations produce one Undo save and focus update each',()=>{
 const f=fixture();f.add();f.add();assert.equal(f.saves,2);assert.equal(f.shows,2);assert.deepEqual(f.errors,[]);
});
test('P1-23 positive: placement uses the validated dimensions and preserves selected object IDs',()=>{
 const f=fixture();f.add();f.add();for(const d of f.p.ducts){assert.ok(checkDuct(f.p,d).ok);assert.equal(typeof d.id,'string');assert.ok(d.id.startsWith('duct-'))}
 assert.notEqual(f.p.ducts[0].id,f.p.ducts[1].id);
});
test('P1-23 positive: selected device prevents overlap but unchanged component data is retained',()=>{
 const original=item(540,80,40,80),f=fixture({items:[original]});f.add();assert.deepEqual(f.p.items,[original]);
 assert.equal(f.p.ducts.length,1);assert.equal(f.saves,1);
});
