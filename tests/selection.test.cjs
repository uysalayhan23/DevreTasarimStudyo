const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js'),V=require('../dist/viewport.js');
const byId={wide:{w:80,h:40},small:{w:40,h:40}};
function fixture(){return {
  components:[{id:'a',typeId:'wide',x:100,y:100,rotation:90,ref:'K1',labelPositions:{ref:{x:7,y:9}}},{id:'b',typeId:'small',x:300,y:200},{id:'c',typeId:'small',x:700,y:500}],
  junctions:[{id:'internal',x:260,y:180},{id:'shared',x:480,y:220}],
  wires:[{id:'ab',from:{c:'a',p:'A1'},to:{c:'b',p:'L'},points:[{x:220,y:160}]},{id:'aj',from:{c:'a',p:'A2'},to:{j:'internal'},points:[]},{id:'jb',from:{j:'internal'},to:{c:'b',p:'N'},points:[]},{id:'bs',from:{c:'b',p:'L'},to:{j:'shared'},points:[{x:400,y:220}]},{id:'sc',from:{j:'shared'},to:{c:'c',p:'L'},points:[]}]
}}
test('marquee hit detection follows rotated bodies and works in all drag directions at any camera zoom',()=>{
  const p=fixture(),camera={x:-320,y:170,zoom:.4};
  const a={x:125,y:90},b={x:150,y:170};
  const world=q=>V.toWorld(camera,{x:q.x*camera.zoom+camera.x,y:q.y*camera.zoom+camera.y});
  assert.deepEqual(S.inBox(p.components,byId,world(a),world(b)),['a']);
  assert.deepEqual(S.inBox(p.components,byId,world(b),world(a)),['a']);
  assert.deepEqual(S.inBox(p.components,byId,{x:102,y:110},{x:110,y:120}),[]);
  assert.deepEqual([...S.clicked(['a'],'b',true)],['a','b']);
  assert.deepEqual([...S.clicked(['a','b'],'a',true)],['b']);
  assert.deepEqual([...S.clicked(['a','b'],'b')],['a','b']);
  assert.deepEqual([...S.clicked(['a'],'c')],['c']);
});
test('moving a selection keeps internal wires and junctions together while external branches stay connected',()=>{
  const p=fixture(),before=structuredClone(p),routes={ab:[{x:100,y:100},{x:220,y:100},{x:220,y:200},{x:300,y:200}]};
  const plan=S.beginMove(p,['a','b'],byId,routes);S.applyMove(plan,{x:60,y:30});
  assert.deepEqual(p.junctions,[{id:'internal',x:320,y:210},{id:'shared',x:480,y:220}]);
  assert.deepEqual(p.components[2],before.components[2]);
  assert.deepEqual(p.components[0].labelPositions,{ref:{x:before.components[0].labelPositions.ref.x+60,y:before.components[0].labelPositions.ref.y+30}},'Custom annotation moves with its selected device');
  assert.equal(p.components[1].x-p.components[0].x,200);
  assert.deepEqual(p.wires[0].points,[{x:280,y:130},{x:280,y:230}]);
  assert.deepEqual(p.wires[3],before.wires[3]);
  for(let i=0;i<p.wires.length;i++){assert.deepEqual(p.wires[i].from,before.wires[i].from);assert.deepEqual(p.wires[i].to,before.wires[i].to)}
  S.applyMove(plan,{x:20,y:-10});assert.equal(p.components[0].x,120,'Repeated movement uses the original anchor');
  S.restore(plan);assert.deepEqual(p,before,'Escape restores the exact project including auto/manual routing');
});
test('selecting the whole circuit moves all branches without changing connectivity or saved labels',()=>{
  const p=fixture(),before=structuredClone(p),plan=S.beginMove(p,p.components.map(c=>c.id),byId);
  S.applyMove(plan,{x:-70,y:80});
  assert.equal(p.junctions[1].x,410);
  for(let i=0;i<p.wires.length;i++)assert.deepEqual(p.wires[i].points,before.wires[i].points.map(q=>({x:q.x-70,y:q.y+80})));
  const saved=JSON.parse(JSON.stringify(p));assert.deepEqual(saved,p);
  assert.deepEqual(saved.components[0].labelPositions,{ref:{x:before.components[0].labelPositions.ref.x-70,y:before.components[0].labelPositions.ref.y+80}},'Custom annotation remains anchored relative to the moved device');
});
test('one shared grid displacement constrains every selected body to the sheet without spreading the group',()=>{
  const p=fixture(),plan=S.beginMove(p,['a','b'],byId);
  assert.deepEqual(S.constrain(plan,17,26),{x:20,y:30});
  const delta=S.constrain(plan,-999,-999);S.applyMove(plan,delta);
  for(const c of p.components.slice(0,2)){const b=S.bounds(c,byId[c.typeId]);assert.ok(b.left>=0&&b.top>=0);assert.ok(c.x%10===0);assert.ok(c.y%10===0)}
  assert.equal(p.components[1].x-p.components[0].x,200);
});


test('client-to-world keeps marquee origin under the pointer after viewport scroll',()=>{
  const camera={x:24,y:24,zoom:.5},rect={left:120,top:80},scroll={x:180,y:90};
  const e={clientX:420,clientY:330};
  const p=V.clientToWorld(camera,e,rect,scroll);
  assert.deepEqual(p,{x:912,y:632});
  const noScroll=V.clientToWorld(camera,e,rect,{x:0,y:0});
  assert.deepEqual(noScroll,{x:552,y:452});
  assert.notDeepEqual(p,noScroll,'scroll offset must affect world coordinates');
});
