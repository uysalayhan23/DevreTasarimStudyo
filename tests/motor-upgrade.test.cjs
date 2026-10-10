const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const V20=require('../dist/v20.js');
const Sim=require('../dist/simulation.js'),Symbols=require('../dist/symbols.js'),Components=require('../dist/components.js');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../dist/library.js'),'utf8'),ctx);
const lib=Symbols.prepareLibrary(ctx.window.COMPONENT_LIBRARY),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
test('shipped examples use valid ports and run their intended control circuits',()=>{
 const path=require('node:path'),folder=path.join(__dirname,'../Ornekler');
 for(const name of fs.readdirSync(folder).filter(n=>n.endsWith('_v1.8.odsdevre'))){
  const p=JSON.parse(fs.readFileSync(path.join(folder,name),'utf8')),defs=Object.fromEntries(p.components.map(c=>[c.id,byId[c.typeId]]));
  for(const w of p.wires)for(const e of [w.from,w.to])assert.ok(defs[e.c]?.pins.some(pin=>pin.id===e.p),name+': '+e.c+'.'+e.p);
  if(name.startsWith('Sinamics')){const motor=p.components.find(c=>c.id==='m1');p.components.find(c=>c.id==='s1').state=true;assert.equal(Sim.solve(p,byId,{now:0}).shortCircuit,false);Sim.solve(p,byId,{now:10000});assert.equal(motor._active,true);assert.equal(motor._spin,1);p.components.find(c=>c.id==='s2').state=true;Sim.solve(p,byId,{now:10000});Sim.solve(p,byId,{now:30000});assert.equal(motor._spin,-1)}
  if(name.startsWith('Yildiz')){const sw=p.components.find(c=>c.id==='s1'),motor=p.components.find(c=>c.id==='m1');for(const position of [1,2]){sw.position=position;assert.equal(Sim.solve(p,byId).shortCircuit,false);assert.equal(motor._active,true)}}
 }
});
function circuit(type='motor-y-d',mode='external'){
 const s={id:'s',typeId:type==='motor-1p'?'supply-1p':'supply-3p'},m={id:'m',typeId:type,motorConnection:mode,windingConnection:'external'};
 const p={components:[s,m],wires:[],junctions:[]};
 const wire=(a,b,owner='s')=>p.wires.push({id:'w'+p.wires.length,from:{c:owner,p:a},to:{c:'m',p:b}});
 return {s,m,p,wire,solve:()=>Sim.solve(p,byId)};
}
test('all six phase permutations work with both star and delta; every transposition reverses',()=>{
 const seqs=[['L1','L2','L3',1],['L2','L3','L1',1],['L3','L1','L2',1],['L1','L3','L2',-1],['L2','L1','L3',-1],['L3','L2','L1',-1]];
 for(const mode of ['star','delta'])for(const [a,b,c,spin] of seqs){
  const t=circuit('motor-y-d',mode);[a,b,c].forEach((p,i)=>t.wire(p,['U1','V1','W1'][i]));
  assert.equal(t.solve().shortCircuit,false);assert.equal(t.m._active,true);assert.equal(t.m._spin,spin);
 }
});
test('unbridged six-lead motor stops; external star and delta work and broken winding stops',()=>{
 const t=circuit();['L1','L2','L3'].forEach((p,i)=>t.wire(p,['U1','V1','W1'][i]));t.solve();assert.equal(t.m._active,false);
 t.wire('U2','V2','m');t.wire('V2','W2','m');t.solve();assert.equal(t.m._active,true);
 t.p.wires.pop();t.solve();assert.equal(t.m._active,false);
 t.p.wires=t.p.wires.slice(0,3);for(const [a,b] of [['U1','W2'],['V1','U2'],['W1','V2']])t.wire(a,b,'m');
 t.solve();assert.equal(t.m._active,true);assert.equal(t.m._motorConnection,'delta');
 t.m.motorConnection='star';assert.equal(t.solve().shortCircuit,true);assert.equal(t.m._active,false);
});
test('single phase reverses for either one winding swap, not both, and needs auxiliary winding',()=>{
 for(const main of [false,true])for(const aux of [false,true]){
  const t=circuit('motor-1p');t.wire('L',main?'N':'U');t.wire('N',main?'U':'N');
  t.solve();assert.equal(t.m._active,false);
  t.wire('L',aux?'Z2':'Z1');t.wire('N',aux?'Z1':'Z2');t.solve();assert.equal(t.m._active,true);assert.equal(t.m._spin,main===aux?1:-1);
 }
});
test('motor terminals retain legacy IDs and use opposing rows',()=>{
 for(const [id,top,bottom] of [['motor-y-d',['U1','V1','W1'],['U2','V2','W2']],['motor-dahlender',['U','V','W'],['X','Y','Z']]]){
  const d=byId[id];for(const pin of top)assert.equal(d.pins.find(p=>p.id===pin).side,'top');for(const pin of bottom)assert.equal(d.pins.find(p=>p.id===pin).side,'bottom');
 }
 assert.equal(Components.deviceColor({deviceColor:'red" onclick="bad'},byId['lamp-green']),'#20b26b');
 assert.match(Symbols.markup(byId['lamp-green'],{deviceColor:'#123456',_active:true}),/#123456/);
});
test('Dahlander high speed requires the first winding group bridged and keeps phase direction',()=>{
 const t=circuit('motor-dahlender');['L1','L2','L3'].forEach((p,i)=>t.wire(p,['X','Y','Z'][i]));t.solve();assert.equal(t.m._active,false);
 t.wire('U','V','m');t.wire('V','W','m');t.solve();assert.equal(t.m._active,true);assert.equal(t.m._motorSpeed,'high');assert.equal(t.m._spin,1);
 [t.p.wires[0].from.p,t.p.wires[2].from.p]=[t.p.wires[2].from.p,t.p.wires[0].from.p];t.solve();assert.equal(t.m._spin,-1);
});
test('legacy V20 project keeps terminal IDs and migrates controls to the ramped drive',()=>{
 const t=circuit('motor-3p','delta');t.s.typeId='supply-1p';const v={id:'v',typeId:'sinamics-v20-1p'};t.p.components.push(v);
 const wire=(a,p,b,q)=>t.p.wires.push({id:'w'+t.p.wires.length,from:{c:a,p},to:{c:b,p:q}});
 wire('s','L','v','L1');wire('s','N','v','N');['U','V','W'].forEach(p=>wire('v',p,'m',p));Sim.solve(t.p,byId,{now:0});assert.equal(t.m._active,false);
 wire('v','13','v','8');Sim.solve(t.p,byId,{now:1000});assert.equal(t.m._active,false);
 wire('v','12','v','14');Sim.solve(t.p,byId,{now:1000});Sim.solve(t.p,byId,{now:11000});assert.equal(t.m._active,true);assert.equal(t.m._spin,1);
 wire('v','13','v','9');Sim.solve(t.p,byId,{now:11000});Sim.solve(t.p,byId,{now:31000});assert.equal(t.m._spin,-1);
 V20.set(v,'P1040',0);Sim.solve(t.p,byId,{now:31000});Sim.solve(t.p,byId,{now:41000});assert.equal(t.m._active,false);
 t.p.wires=t.p.wires.filter(w=>!(w.to.c==='v'&&w.to.p==='N'));Sim.solve(t.p,byId,{now:42000});assert.equal(v._v20.powered,false);
});
test('star/delta packet selects mutually exclusive real motor connections',()=>{
 const t=circuit(),sw={id:'p',typeId:'packet-star-delta',position:0};t.p.components.push(sw);
 for(const p of ['L1','L2','L3'])t.p.wires.push({from:{c:'s',p},to:{c:'p',p}});
 for(const p of ['U1','V1','W1','U2','V2','W2'])t.wire(p,p,'p');
 for(const [position,active,mode] of [[0,false,'incomplete'],[1,true,'star'],[2,true,'delta'],[0,false,'incomplete']]){sw.position=position;assert.equal(t.solve().shortCircuit,false);assert.equal(t.m._active,active);assert.equal(t.m._motorConnection,mode);}
});
