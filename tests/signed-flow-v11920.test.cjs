const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Sim=require('../dist/simulation.js'),Symbols=require('../dist/symbols.js');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),context);
const lib=Symbols.prepareLibrary(JSON.parse(JSON.stringify(context.window.COMPONENT_LIBRARY)));
const byId=Object.fromEntries(lib.map(d=>[d.id,d]));

function circuit(){
  const project={components:[],wires:[],junctions:[]};
  const add=(typeId,id,ref=id)=>{const c={typeId,id,ref,state:false,x:0,y:0,rotation:0};project.components.push(c);return c};
  const wire=(a,p,b,q)=>{const w={id:'w'+project.wires.length,from:{c:a.id,p},to:{c:b.id,p:q},color:'#e53935',role:'CONTROL',points:[]};project.wires.push(w);return w};
  return {project,add,wire,solve:o=>Sim.solve(project,byId,o)};
}

test('numeric solver exposes signed terminal current without changing positive measurement magnitude',()=>{
  const t=circuit(),s=t.add('supply-dc-plus','s'),r=t.add('resistor','r');r.resistance=120;
  const feed=t.wire(s,'P',r,'1'),ret=t.wire(r,'2',s,'M');t.solve();
  assert.ok(r._currentValue>.19&&r._currentValue<.21);
  assert.equal(feed._flowMode,'dc');assert.equal(feed._flowCertainty,'exact');assert.equal(feed._flowDirection,1);
  assert.ok(feed._flowMagnitude>.19&&feed._flowMagnitude<.21);
  assert.equal(ret._flowDirection,1);assert.ok(ret._flowMagnitude>.19&&ret._flowMagnitude<.21);
});

test('wire orientation sign follows stored from-to order while current magnitude stays positive',()=>{
  const t=circuit(),s=t.add('supply-dc-plus','s'),r=t.add('resistor','r');r.resistance=240;
  const feed=t.wire(r,'1',s,'P');t.wire(s,'M',r,'2');t.solve();
  assert.ok(r._currentValue>.09&&r._currentValue<.11);
  assert.equal(feed._flowDirection,-1);assert.equal(feed._flowCertainty,'exact');assert.ok(feed._flowMagnitude>.09);
});

test('seal-in feedback is ambiguous while parallel and unique after Start release',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),start=t.add('push-no','start','S2'),stop=t.add('push-nc','stop','S0'),coil=t.add('coil-relay','coil','K1'),hold=t.add('contact-no','hold','K1');
  const w0=t.wire(s,'L',stop,'21'),w1=t.wire(stop,'22',start,'13'),w2=t.wire(start,'14',coil,'A1'),w3=t.wire(coil,'A2',s,'N'),w4=t.wire(stop,'22',hold,'13'),w5=t.wire(hold,'14',coil,'A1');
  t.solve();assert.equal(coil._active,false);
  start.state=true;t.solve();assert.equal(coil._active,true);assert.equal(hold._closed,true);
  for(const w of [w1,w2,w4,w5]){assert.equal(w._flowCertainty,'ambiguous',w.id);assert.equal(w._flowDirection,0,w.id)}
  assert.equal(w0._flowMode,'ac');assert.equal(w3._flowMode,'ac');
  start.state=false;t.solve();assert.equal(coil._active,true);assert.equal(hold._closed,true);
  for(const w of [w4,w5]){assert.equal(w._flowCertainty,'directional',w.id);assert.equal(w._flowActive,true,w.id);assert.notEqual(w._flowDirection,0,w.id);assert.equal(w._flowMode,'ac',w.id)}
  assert.equal(w1._flowActive,false);assert.equal(w2._flowActive,false);
  stop.state=true;t.solve();assert.equal(coil._active,false);assert.ok([w0,w3,w4,w5].every(w=>!w._flowActive));
});

test('UI direction classes come from runtime flow and AC is not rendered as one-way DC',()=>{
  const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/styles.css'),'utf8'),tutorial=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
  assert.match(app,/function flowClass\(w\)/);for(const token of ['flow-forward','flow-reverse','flow-ac','flow-ambiguous'])assert.ok(app.includes(token),token);
  assert.match(css,/wire-energy-forward/);assert.match(css,/wire-energy-reverse/);assert.match(css,/wire-energy-ac/);
  assert.match(tutorial,/tutorial-energy-flow-reverse/);assert.match(tutorial,/tutorial-energy-flow-ac/);assert.match(html,/signed-flow\.js/);
});
