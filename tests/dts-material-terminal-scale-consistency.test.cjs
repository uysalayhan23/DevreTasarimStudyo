'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('../dist/symbols.js'),d={w:100,h:80,pins:[{id:'A',x:100,y:15}]};
test('normal scaling preserves material pin geometry',()=>{
 assert.deepEqual(S.terminalPosition({x:70,y:100,materialScale:1.5},d,d.pins[0]),{x:220,y:122.5});
});
test('too-large stored scale matches visual max of 3',()=>{
 assert.equal(S.materialScale({materialScale:4}),3);
 assert.deepEqual(S.terminalPosition({x:0,y:0,materialScale:4},d,d.pins[0]),{x:300,y:45});
});
test('too-small stored scale matches visual min 0.25',()=>{
 assert.equal(S.materialScale({materialScale:.1}),.25);
 assert.deepEqual(S.terminalPosition({x:10,y:20,materialScale:.1},d,d.pins[0]),{x:35,y:23.75});
});
test('rotated device and cable endpoint use identical world rotation',()=>{
 const c={x:70,y:80,rotation:90,materialScale:2},p=d.pins[0],q=S.rotatedPoint(p,d,90);
 assert.deepEqual(S.terminalPosition(c,d,p),{x:70+q.x*2,y:80+q.y*2});
});
test('invalid legacy scales do not yield NaN or Infinity',()=>{
 for(const materialScale of [-4,0,null,Infinity,'invalid']){
  const c={x:12,y:16,materialScale};
  assert.equal(S.materialScale(c),1);
  assert.deepEqual(S.terminalPosition(c,d,d.pins[0]),{x:112,y:31});
 }
});
test('core endpoint, clip and pointer code use shared effective geometry',()=>{
 const a=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(a,/function portPosition\(c,d,p\)\{\s*d=materialDefinition\(c,d\);p=d\.pins\.find\(q=>q\.id===p\.id\)\|\|p;\s*return Symbols\.terminalPosition\(c,d,p\)/);
 assert.match(a,/const d=materialDefinition\(c,byId\[c\.typeId\]\),scale=Symbols\.materialScale\(c\),corners=/);
 assert.match(a,/function componentLocalPoint\(c,d,e\)\{const p=worldPoint\(e\),scale=Symbols\.materialScale\(c\)/);
 assert.match(a,/function clampJawPoint\(c,d\)\{return Symbols\.terminalPosition\(c,d,/);
});
test('offline symbols load before app using updated local revision',()=>{
 const h=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(h,/src="symbols\.js\?rev=20261028-consistent-material-scale1"/);
 assert.match(h,/src="app\.js\?rev=20261028-consistent-material-scale1"/);
 assert.ok(h.indexOf('src="symbols.js?rev=')<h.indexOf('src="app.js?rev='));
});
