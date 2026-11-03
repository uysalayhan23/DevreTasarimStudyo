'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const P=require('../dist/panel.js');
const editor=fs.readFileSync(path.resolve(__dirname,'../dist/panel-editor.js'),'utf8');
const begin=editor.indexOf('  function checkDuct(p,d){');
const end=editor.indexOf('\n  function addAccessory(',begin);
assert.ok(begin>=0&&end>begin,'Read the real panel-editor duct placement validator');
const checkDuct=vm.runInNewContext('('+editor.slice(begin,end).trim()+')',{P});
const D=({id='duct-1',x=160,y=150,width=30,length=160,vertical=false,kind}={})=>({id,x,y,width,length,vertical,...(kind?{kind}:{})});
const item=({id='part-1',x=100,y=100,w=100,h=80,mount='plate'}={})=>({id,typeId:'device',ref:'D1',mount,x,y,w,h,depth:30});
function board(items=[item()],ducts=[D()]){return {width:600,height:800,depth:220,doorAngle:105,rails:[],ducts,items,wires:[]}}
const check=(p,d=p.ducts[0])=>checkDuct(p,d);

test('P1-18 NEGATIVE: existing plate item cannot be covered by moved duct',()=>{
 const p=board();p.ducts[0].x=145;p.ducts[0].y=130;
 assert.equal(P.check(p,item({id:'new',x:150,y:150,w:40,h:40})).ok,false,'Native item-on-duct gate must still work');
 assert.equal(check(p).ok,false,'The inverse duct-on-item move must be rejected');
});
test('P1-18 NEGATIVE: cable duct cannot cover rail mounted device',()=>{
 const p=board([item({mount:'rail',x:170,y:170,w:40,h:65})],[D({x:150,y:160})]);
 assert.equal(check(p).ok,false);
});
test('P1-18 NEGATIVE: vertical cable duct cannot cover mounting plate device',()=>{
 const p=board([item({x:230,y:140,w:85,h:95})],[D({x:245,y:100,width:30,length:180,vertical:true})]);
 assert.equal(check(p).ok,false);
});
test('P1-18 POSITIVE: physically separated duct is allowed',()=>{
 const p=board([item()],[D({x:300,y:300})]);assert.equal(check(p).ok,true);
});
test('P1-18 POSITIVE: duct may touch but not intersect device footprint',()=>{
 const p=board([item({x:100,y:100,w:100,h:80})],[D({x:200,y:100})]);
 assert.equal(check(p).ok,true);
});
test('P1-18 POSITIVE: door-mounted device is on separate mounting surface',()=>{
 const p=board([item({mount:'door',x:160,y:150,w:70,h:70})],[D({x:160,y:150})]);
 assert.equal(check(p).ok,true);
});
test('P1-18 POSITIVE: external power supply is not a plate obstacle',()=>{
 const p=board([item({mount:'external',x:160,y:150,w:70,h:70})],[D({x:160,y:150})]);
 assert.equal(check(p).ok,true);
});
test('P1-18 POSITIVE: cable entry gland keeps existing placement rule',()=>{
 const p=board([item()],[D({x:150,y:130,kind:'gland',width:30,length:50})]);
 assert.equal(check(p).ok,true);
});
test('P1-18 POSITIVE: original pane boundary and measurements remain enforced',()=>{
 assert.equal(check(board([],[D({x:0})])).ok,false);
 assert.equal(check(board([],[D({width:5})])).ok,false);
 assert.equal(check(board([],[D({x:Infinity})])).ok,false);
});
test('P1-18 INTEGRATION: both form edits and drag use the same check',()=>{
 assert.match(editor,/return checkDuct\(next,d\)/);
 assert.match(editor,/result=checkDuct\(next,d\)/);
});
test('P1-18 INTEGRATION: Add Duct validates placement BEFORE it inserts an overlapping duct',()=>{
 const start=editor.indexOf('  function addDuct(){'),end=editor.indexOf('\n  function removeSelected',start);
 assert.ok(start>=0&&end>start);
 const add=editor.slice(start,end);
 assert.ok(add.indexOf('checkDuct(p,d)')>=0);
 assert.ok(add.indexOf('checkDuct(p,d)')<add.indexOf('p.ducts.push(d)'));
});
