const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),Sim=require('../dist/simulation.js');
const ctx={window:{DTSStarterProjects:{}}};for(const file of ['library','starter-v115'])vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file+'.js'),'utf8'),ctx);
const by=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d])),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
test('eight packaged examples retain valid terminals and reach the documented measurements',()=>{
 const expected={ht2115:{it:.012,irh:.008},waz115:{i:.012},rtd115:{i:.012},tc115:{i:.012},tx115:{i:.008}};
 for(const [name,example]of Object.entries(ctx.window.DTSStarterProjects)){
  const p=JSON.parse(JSON.stringify(example));assert.equal(p.components.some(c=>!by[c.typeId]),false,name);
  for(const wire of p.wires)for(const end of [wire.from,wire.to]){const c=p.components.find(c=>c.id===end.c);assert.ok(by[c.typeId].pins.some(pin=>pin.id===end.p),`${name}: ${end.c}/${end.p}`)}
  assert.equal(Sim.solve(p,by,{now:0}).stable,true,name);
  for(const c of p.components)if(c._instrument)assert.equal(c._instrument.error,'',name+': '+c.id);
  for(const [id,value]of Object.entries(expected[name]||{}))near(p.components.find(c=>c.id===id)._currentValue,value);
  if(name==='meter115')near(p.components.find(c=>c.id==='m')._meter.value,24);
  if(name==='enda115'){assert.equal(p.components.find(c=>c.id==='h')._active,true);p.components.find(c=>c.id==='r').temperature=105;Sim.solve(p,by,{now:1000});assert.equal(p.components.find(c=>c.id==='h')._active,false)}
  if(name==='lit115'){const b=p.components.find(c=>c.id==='b'),h=p.components.find(c=>c.id==='h');assert.equal(b._lampActive,true);assert.equal(h._active,false);b.state=true;Sim.solve(p,by,{now:1000});assert.equal(h._active,true)}
 }
});
