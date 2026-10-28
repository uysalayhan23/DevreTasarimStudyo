'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/symbols.js'),fs=require('node:fs'),path=require('node:path'),d={w:100,h:80,pins:[{id:'A',x:100,y:15}]};
test('rendered 3D corners and cable obstacles agree at all rotations',()=>{
 for(const scale of [.1,.25,1,2,3,4,Infinity])for(const rotation of [0,90,180,270]){
  const c={x:17,y:33,rotation,materialScale:scale};
  const corners=[[0,0],[100,0],[100,80],[0,80]].map(([x,y])=>S.terminalPosition(c,d,{x,y}));
  const b=S.materialBounds(c,d,7);
  assert.equal(b.left,Math.min(...corners.map(p=>p.x))-7);
  assert.equal(b.right,Math.max(...corners.map(p=>p.x))+7);
  assert.equal(b.top,Math.min(...corners.map(p=>p.y))-7);
  assert.equal(b.bottom,Math.max(...corners.map(p=>p.y))+7);
 }
});
test('legacy oversized and undersized scales use the visible bounding box',()=>{
 assert.deepEqual(S.materialBounds({x:10,y:20,materialScale:4},d),{left:10,right:310,top:20,bottom:260});
 assert.deepEqual(S.materialBounds({x:10,y:20,materialScale:.1},d),{left:10,right:35,top:20,bottom:40});
});
test('invalid legacy scale cannot make routing box infinite or negative',()=>{
 for(const scale of [null,-4,0,Infinity,'bad']){
  assert.deepEqual(S.materialBounds({x:10,y:20,materialScale:scale},d),{left:10,right:110,top:20,bottom:100});
 }
});
test('ordinary unscaled rotated device routing remains unchanged',()=>{
 assert.deepEqual(S.materialBounds({x:12,y:30,rotation:90,materialScale:1},d,7),{left:15,right:109,top:13,bottom:127});
});
test('routed geometry, terminal anchors and clamp overlay share canonical scale',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(source,/function componentObstacles\(\)\{[^\n]*Symbols\.materialBounds\(c,materialDefinition\(c,byId\[c\.typeId\]\),GRID\*\.7\)/);
 assert.match(source,/if\(d\.kind==='clamp-meter'\)[\s\S]{0,300}?const scale=Symbols\.materialScale\(c\);/);
 assert.match(source,/return Symbols\.terminalPosition\(c,d,p\);/);
});
