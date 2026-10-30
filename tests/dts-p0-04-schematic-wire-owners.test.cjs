'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function base(){
  return {version:7,name:'P0-04 schematic integrity',workspaceMode:'control',
    components:[{id:'a',typeId:'resistor'},{id:'b',typeId:'lamp'}],
    junctions:[{id:'j',x:10,y:20}],
    wires:[{id:'w',from:{c:'a',p:'1'},to:{j:'j'},color:'red'}]};
}
function parseWith(change){
  const p=base();change(p);return Projects.parse(JSON.stringify(p));
}
test('existing component to junction cable keeps color and endpoints',()=>{
  assert.deepEqual(parseWith(()=>{}).wires[0],base().wires[0]);
});
test('component to component and junction to junction remain valid',()=>{
  assert.equal(parseWith(p=>{p.wires[0].to={c:'b',p:'1'}}).wires.length,1);
  assert.equal(parseWith(p=>{p.wires[0].from={j:'j'}}).wires.length,1);
});
test('legacy numeric component IDs are normalized before owner check',()=>{
  const p=parseWith(p=>{p.components[0].id=1;p.wires[0].from.c=1});
  assert.equal(p.wires[0].from.c,'1');
});
test('projects without wires or junctions remain valid',()=>{
  assert.equal(parseWith(p=>{p.wires=[];p.junctions=[]}).wires.length,0);
  assert.equal(parseWith(p=>{p.wires[0].to={c:'b',p:'1'};delete p.junctions}).wires.length,1);
});
test('panel workspace is independent of schematic endpoints',()=>{
  const p=parseWith(p=>{p.wires=[];p.panel={items:[],wires:[]}});
  assert.equal(p.panel.items.length,0);
});
for(const [name,change] of [
  ['deleted source component',p=>{p.wires[0].from.c='gone'}],
  ['deleted destination component',p=>{p.wires[0].to={c:'gone',p:'1'}}],
  ['deleted source junction',p=>{p.wires[0].from={j:'gone'}}],
  ['deleted destination junction',p=>{p.wires[0].to.j='gone'}],
  ['empty junction collection',p=>{p.junctions=[]}],
  ['missing junction collection',p=>{delete p.junctions}],
  ['blank terminal',p=>{p.wires[0].from.p=' '}],
  ['ambiguous endpoint',p=>{p.wires[0].from.j='j'}]
])test('rejects '+name+' before reopening project',()=>{
  assert.throws(()=>parseWith(change),/kablo uç referansı geçersiz/);
});
test('in-memory validation rejects missing owners without mutating project',()=>{
  const p=base();p.wires[0].from.c='gone';const before=JSON.stringify(p);
  assert.throws(()=>Projects.validate(p),/kablo uç referansı geçersiz/);
  assert.equal(JSON.stringify(p),before);
});
test('existing valid route and bounded junction geometry are unchanged',()=>{
  const p=parseWith(p=>{p.wires[0].points=[{x:2,y:3}];p.junctions[0].x=100000});
  assert.equal(p.wires[0].points[0].x,2);
  assert.equal(p.junctions[0].x,100000);
});
