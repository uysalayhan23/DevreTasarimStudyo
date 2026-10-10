const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../dist/device-behavior.js'),Sim=require('../dist/simulation.js'),Symbols=require('../dist/symbols.js'),A=require('../dist/assemblies.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const lib=Symbols.prepareLibrary(ctx.window.COMPONENT_LIBRARY),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
test('material float travels only along the visible rod at both ends and midpoint',()=>{
 const M=require('../dist/materials.js');for(const [position,offset] of [[0,89],[50,19],[100,-51]])assert.ok(M.markup(byId['sensor-level-analog'],{id:'level',analogPosition:position}).includes(`transform="translate(0 ${offset})"`));
});
test('v1.9 examples load with valid endpoints and expected initial simulation states',()=>{
 const path=require('node:path'),dir=path.join(__dirname,'../Ornekler'),files=fs.readdirSync(dir).filter(f=>f.endsWith('_v1.9.odsdevre'));assert.equal(files.length,6);
 for(const file of files){const p=JSON.parse(fs.readFileSync(path.join(dir,file)));if(p.workspaceMode==='panel'){const P=require('../dist/panel.js'),W=require('../dist/panel-wiring.js');P.normalize(p.panel,byId);for(const w of p.panel.wires)assert.ok(W.routes(p.panel,byId,w).length);continue}for(const w of p.wires)for(const end of [w.from,w.to]){const c=p.components.find(c=>c.id===end.c);assert.ok(c&&byId[c.typeId].pins.some(pin=>pin.id===end.p),file)}const result=Sim.solve(p,byId,{now:0});assert.equal(result.stable,true,file);assert.equal(result.shortCircuit,false,file);if(file.startsWith('Analog'))for(const c of p.components.filter(c=>c.id.startsWith('b')))assert.equal(c._active,true,file);else assert.equal(p.components.find(c=>c.id==='h1')._active,false,file)}
});
test('changing an associated contact to NC keeps its real wire ends valid in material view',()=>{
 const t=circuit('coil-flasher');t.c.x=t.c.y=100;A.add(t.p,t.c,byId[t.c.typeId],byId,()=> 'aux');const aux=t.p.components.at(-1);t.wire('P','13','s','aux');t.wire('M','14','s','aux');require('../dist/components.js').changeContactType(t.p,aux,'contact-nc',byId);A.sync(t.p,byId,'material');const d=A.definition(byId[aux.typeId],aux,'material');for(const w of t.p.wires)assert.ok(d.pins.some(p=>p.id===w.to.p));assert.deepEqual(Object.values(aux.physicalLabels),['15','16']);
});
function circuit(type){const s={id:'s',typeId:'supply-dc-plus'},c={id:'c',typeId:type,ref:'K1'},p={components:[s,c],wires:[],junctions:[]};return {s,c,p,wire:(a,b,x='s',y='c')=>p.wires.push({id:'w'+p.wires.length,from:{c:x,p:a},to:{c:y,p:b}}),solve:(now=0)=>Sim.solve(p,byId,{now})}}
test('24 V polarity gates sensor output; reversed and AC supplies are classified separately',()=>{
 const t=circuit('proximity');t.c.state=true;t.wire('P','BN');t.wire('M','BU');assert.deepEqual(t.solve().damaged,[]);assert.equal(t.c._active,true);
 t.p.wires.forEach(w=>w.from.p=w.from.p==='P'?'M':'P');assert.deepEqual(t.solve().damaged,['c']);assert.equal(t.c._active,false);
 t.s.typeId='supply-1p';t.p.wires[0].from.p='L';t.p.wires[1].from.p='N';assert.deepEqual(t.solve().damaged,[]);assert.equal(t.c._sensorSupply,'invalid');assert.equal(t.c._closed,false);
});
test('level and position have exact linear endpoints and midpoint; temperature trends match sensor principles',()=>{
 for(const [position,current,voltage] of [[0,4,0],[50,12,5],[100,20,10]]){assert.equal(B.output({analogPosition:position},byId['sensor-level-analog']).value,current);assert.equal(B.output({analogPosition:position,analogMode:'voltage'},byId['sensor-level-analog']).value,voltage);assert.equal(B.output({analogPosition:position},byId['sensor-linear-position']).value,voltage)}
 assert.ok(B.output({temperature:80},byId['sensor-ntc']).value<B.output({temperature:25},byId['sensor-ntc']).value);assert.ok(B.output({temperature:80},byId['sensor-ptc']).value>B.output({temperature:25},byId['sensor-ptc']).value);assert.equal(B.output({temperature:25},byId.thermocouple).value,0);
});
test('on delay, off delay and minutes are driven by elapsed simulation time',()=>{
 for(const [type,unit,end] of [['coil-delay-on','sec',2000],['coil-delay-on','min',120000]]){const t=circuit(type);t.c.delayValue=2;t.c.delayUnit=unit;t.wire('P','A1');t.wire('M','A2');t.solve(0);assert.equal(t.c._active,false);t.solve(end-1);assert.equal(t.c._active,false);t.solve(end);assert.equal(t.c._active,true)}
 const t=circuit('coil-delay-off');t.c.delayValue=2;t.wire('P','A1');t.wire('M','A2');t.solve(0);assert.equal(t.c._active,true);t.p.wires=[];t.solve(100);assert.equal(t.c._active,true);t.solve(2099);assert.equal(t.c._active,true);t.solve(2100);assert.equal(t.c._active,false);
});
test('impulse relay toggles once on each rising edge and retains output after release',()=>{
 const t=circuit('coil-pulse');t.wire('P','A1');t.wire('M','A2');const wires=[...t.p.wires];t.solve(0);assert.equal(t.c._active,true);t.solve(500);assert.equal(t.c._active,true);t.p.wires=[];t.solve(600);assert.equal(t.c._active,true);t.p.wires=wires;t.solve(700);assert.equal(t.c._active,false);t.solve(800);assert.equal(t.c._active,false);
});
test('flasher runs periodic on/off intervals and resets when power is removed',()=>{
 const t=circuit('coil-flasher');t.wire('P','A1');t.wire('M','A2');for(const [time,on] of [[0,true],[999,true],[1000,false],[1999,false],[2000,true]]){t.solve(time);assert.equal(t.c._active,on)}t.p.wires=[];t.solve(2100);assert.equal(t.c._active,false);
});
test('SSR input is polarity sensitive and switches isolated output',()=>{
 const t=circuit('solid-state-relay');t.wire('P','3+');t.wire('M','4−');t.solve();assert.equal(t.c._active,true);assert.equal(JSON.stringify(Sim.conductingPairs(t.c,byId[t.c.typeId],new Map([['@c',true]]),new Set())),JSON.stringify([['1','2']]));t.p.wires[0].from.p='M';t.p.wires[1].from.p='P';t.solve();assert.equal(t.c._active,false);
});
test('automatic auxiliary contact preserves schematic position, wires and reference across material switching',()=>{
 const t=circuit('coil-pulse');t.c.x=100;t.c.y=100;A.add(t.p,t.c,byId[t.c.typeId],byId,()=> 'aux');const aux=t.p.components.at(-1);assert.equal(aux.auxFor,t.c.id);const position={x:aux.x,y:aux.y};t.wire('P','13','s',aux.id);const before=JSON.stringify(t.p.wires);A.sync(t.p,byId,'material');assert.equal(aux.x,100);assert.ok(!Symbols.markup(byId[aux.typeId],aux,{mode:'material'}).includes('material-art'));t.c.x=200;A.sync(t.p,byId,'material');assert.equal(aux.x,200);A.sync(t.p,byId,'iec');assert.deepEqual({x:aux.x,y:aux.y},position);assert.equal(JSON.stringify(t.p.wires),before);
});
