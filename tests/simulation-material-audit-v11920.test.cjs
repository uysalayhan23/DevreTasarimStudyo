'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const Simulation=require('../dist/simulation.js');
const PLCRuntime=require('../dist/plc-runtime.js');
const Front=require('../dist/plc-front.js');

function finalLessons(){
  require('../dist/tutorial-lessons.js');
  const outlined=require('../dist/tutorial-source-outline.js');
  const ctx={window:{DTSTutorialLessons:outlined}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),ctx);
  return ctx.window.DTSTutorialLessons;
}
function runtimeLibrary(){
  const ctx={window:{}};
  for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])
    vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),ctx);
  const lib=ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY);
  const Arduino=require('../dist/arduino-library.js');
  for(const d of Arduino.components||[])if(!lib.some(x=>x.id===d.id))lib.push(d);
  return lib;
}
const Lessons=finalLessons(),library=runtimeLibrary(),byId=Object.fromEntries(library.map(d=>[d.id,d]));
const clone=v=>JSON.parse(JSON.stringify(v));

test('simulation audit: every wiring lesson resolves all material definitions and never hits a global solver block',()=>{
  const wiring=Lessons.lessons.filter(l=>l.kind==='wiring');
  assert.ok(wiring.length>=600,'expected the full wiring curriculum');
  for(const l of wiring){
    for(const c of l.project.components)assert.ok(byId[c.typeId],l.id+': missing '+c.typeId);
    const project=clone(l.project);let result;
    assert.doesNotThrow(()=>{result=Simulation.solve(project,byId,{now:1000})},l.id+': solver threw');
    assert.equal(result.blocked,false,l.id+': simulation was globally blocked');
  }
});

test('simulation audit: thermal lesson materials have live solver models',()=>{
  const behavior=fs.readFileSync(require.resolve('../dist/device-behavior.js'),'utf8');
  const numeric=fs.readFileSync(require.resolve('../dist/current-model.js'),'utf8');
  const sim=fs.readFileSync(require.resolve('../dist/simulation.js'),'utf8');
  const instruments=fs.readFileSync(require.resolve('../dist/instruments.js'),'utf8');
  for(const id of ['sensor-ntc','sensor-ptc']){assert.ok(byId[id],id);assert.ok(behavior.includes(id),id+' behavior');assert.ok(numeric.includes(id),id+' numeric model')}
  assert.ok(byId['sensor-pt100']?.ptWires>=3,'PT100 live RTD wiring model missing');
  assert.match(instruments,/PT100 bağlantısı/);
  assert.ok(byId.thermocouple,'thermocouple missing');assert.match(sim,/Passive thermocouples produce an EMF/);
});

test('PLC lessons: START latches DQ, STOP releases it, contactor and motor follow',()=>{
  const l=Lessons.byId['plc-hardware-programming-src-12'],p=clone(l.project);
  const plc=p.components.find(c=>c.id==='plc'),start=p.components.find(c=>c.id==='start'),stop=p.components.find(c=>c.id==='stop'),coil=p.components.find(c=>c.id==='coil'),motor=p.components.find(c=>c.id==='motor');
  let r=Simulation.solve(p,byId,{now:0});
  assert.equal(r.blocked,false);assert.equal(plc._plcRuntime?.powered,true);assert.equal(plc._plcRuntime?.outputs?.['X12:3'],false);
  start.state=true;r=Simulation.solve(p,byId,{now:100});
  assert.equal(r.stable,true);assert.equal(plc._plcRuntime.outputs['X12:3'],true);assert.equal(coil._active,true);assert.equal(motor._active,true);
  start.state=false;r=Simulation.solve(p,byId,{now:200});
  assert.equal(plc._plcRuntime.outputs['X12:3'],true);assert.equal(coil._active,true);
  stop.state=true;r=Simulation.solve(p,byId,{now:300});
  assert.equal(plc._plcRuntime.outputs['X12:3'],false);assert.equal(coil._active,false);assert.equal(motor._active,false);
});

test('PLC timed-stop lesson turns the first output off after the configured teaching interval',()=>{
  const l=Lessons.byId['plc-hardware-programming-src-21'],p=clone(l.project);
  const plc=p.components.find(c=>c.id==='plc'),start=p.components.find(c=>c.id==='start');
  start.state=true;Simulation.solve(p,byId,{now:100});
  assert.equal(plc._plcRuntime?.program,'timed-stop');assert.equal(plc._plcRuntime.outputs['X12:3'],true);
  start.state=false;Simulation.solve(p,byId,{now:2000});assert.equal(plc._plcRuntime.outputs['X12:3'],true);
  Simulation.solve(p,byId,{now:3200});assert.equal(plc._plcRuntime.outputs['X12:3'],false);
});

test('generic PLC runtime covers PNP, NPN, relay and AC-powered relay output families',()=>{
  const pin=(id,label,block,signalType)=>({id,label,block,signalType});
  const dcBase=type=>({id:'x',isPLC:true,powerSupply:'24 VDC',outputType:type,pins:[
    pin('P','L+','PWR','POWER'),pin('M','M','PWR','POWER'),pin('I0','DI 0','IN','DI'),pin('IC','COM','IN','POWER'),
    pin('OP','L+','OUT','POWER'),pin('OC','COM','OUT','POWER'),pin('Q0','DQ 0','OUT','DO')
  ]});
  const c={id:'p'},net={voltage(_c,a,b){return (a==='P'&&b==='M')||a==='I0'}};
  for(const type of ['PNP','NPN','relay']){
    Object.keys(c).filter(k=>k.startsWith('_plc')).forEach(k=>delete c[k]);c.plcOutputs={Q0:true};
    const d=dcBase(type),s=PLCRuntime.evaluate(c,d,net,0),links=PLCRuntime.links(c,d);
    assert.equal(s.powered,true,type);assert.equal(s.outputs.Q0,true,type);
    assert.ok(links.some(([a,b])=>b==='Q0'&&(type==='PNP'?a==='OP':a==='OC')),type+' output anchor');
  }
  const ac={id:'ac',isPLC:true,powerSupply:'100–240 VAC',outputType:'relay',pins:[
    pin('L1','L1','PWR','POWER'),pin('N','L2/N','PWR','POWER'),pin('I0','0.00','IN','DI'),pin('IC','COM','IN','POWER'),pin('OC','COM','OUT','POWER'),pin('Q0','100.00','OUT','DO')
  ]};
  const acC={id:'ac1',plcOutputs:{Q0:true}},acNet={voltage(_c,a,b){return (a==='L1'&&b==='N')||a==='I0'}};
  const state=PLCRuntime.evaluate(acC,ac,acNet,0);assert.equal(state.powered,true);assert.deepEqual(PLCRuntime.links(acC,ac),[['OC','Q0']]);
});

test('library audit: superseded or pinless PLC placeholders are not offered as active simulation materials',()=>{
  const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
  assert.match(app,/!d\.superseded/);
  assert.match(app,/d\?\.isPLC&&!\(d\.pins\|\|\[\]\)\.length/);
  assert.doesNotMatch(app,/PLC \/ görsel I\/O bulunan projelerde simülasyon yapılmaz/);
  for(const d of library.filter(d=>d.isPLC&&!d.superseded))assert.ok((d.pins||[]).length,d.id+' has no connectable terminals');
});

test('PLC front view exposes live DI/DQ indication without moving physical terminals',()=>{
  const d=byId['plc-hw-6es7211-1ae40-0xb0'];
  const svg=Front.markup(d,{id:'plc',_plcRuntime:{powered:true,inputs:{'X10:7':true},outputs:{'X12:3':true}}});
  const di=d.materialPins.find(p=>p.id==='X10:7'),dq=d.materialPins.find(p=>p.id==='X12:3');assert.ok(di&&dq);
  assert.ok(svg.includes(`data-plc-terminal="X10:7" cx="${di.x}" cy="${di.y}" data-plc-live="1"`));
  assert.ok(svg.includes(`data-plc-terminal="X12:3" cx="${dq.x}" cy="${dq.y}" data-plc-live="1"`));
});

test('material audit: every connectable non-drawing material has a simulation/runtime owner',()=>{
  const Components=require('../dist/components.js');
  const sim=fs.readFileSync(require.resolve('../dist/simulation.js'),'utf8');
  const behavior=fs.readFileSync(require.resolve('../dist/device-behavior.js'),'utf8');
  const numeric=fs.readFileSync(require.resolve('../dist/current-model.js'),'utf8');
  const drawing=new Set(['linear-direction','rotative-direction','propagation-flow','energy-flow','effect','radiation','mechanical-coupling','electronics','device-box','cross-reference','wire-arrow','one-line-misc']);
  const special=new Set(['sinamics-v20-1p','abb-acs800-r5','hcfa-sv-x2ea040a-a','unit-ut33d-plus','unit-ut200a','load-cell','winding','ground','thermocouple','sensor-ntc','sensor-ptc','sensor-pt100','sensor-pt100-2wire','sensor-pt100-4wire']);
  const unsupported=[];
  for(const d of library.filter(d=>(d.pins||[]).length&&!d.diagramOnly&&!d.visualOnly&&!d.superseded)){
    if(drawing.has(d.id)||d.digitalIc&&sim.includes('d?.digitalIc')||d.arduinoOnly||d.arduinoBoard||d.isPLC||d.instrument||d.doldSafety||d.incrementalEncoder38mm||d.hcfaPulseSource||d.hcfaModbusMaster||special.has(d.id))continue;
    if(Components.contactGroups(d).length)continue;
    const k=String(d.kind||''),modeled=sim.includes("'"+k+"'")||sim.includes('"'+k+'"')||sim.includes("d.id==='"+d.id+"'")||behavior.includes(d.id)||numeric.includes(d.id)||numeric.includes("d.kind==='"+k+"'");
    if(!modeled)unsupported.push(d.id);
  }
  assert.deepEqual(unsupported,[]);
});

test('HCFA pulse and Modbus teaching devices report a live simulation link',()=>{
  const sim=fs.readFileSync(require.resolve('../dist/simulation.js'),'utf8');
  const ui=fs.readFileSync(require.resolve('../dist/hcfa-ui.js'),'utf8');
  assert.match(sim,/src\._hcfaLinkedDrive=c\.id/);
  assert.match(sim,/master\._hcfaModbusLinked=c\.id/);
  assert.match(sim,/CN4:4/);assert.match(sim,/CN5:5/);
  assert.match(ui,/DRIVE LINK/);assert.match(ui,/LINK OK/);assert.match(ui,/RS485 BEKLİYOR/);
});

test('simulation audit cache and module load order are current',()=>{
  const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
  const pos=x=>{const i=html.indexOf(x);assert.ok(i>=0,x);return i};
  assert.ok(pos('plc-runtime.js?rev=20261008-sim-audit1')<pos('simulation.js?rev=20261010-real-ics1'));
  assert.match(html,/plc-front\.js\?rev=20261008-sim-audit1/);
  assert.match(html,/app\.js\?rev=20261010-lm358-output1/);
  assert.match(html,/hcfa-ui\.js\?rev=20261008-sim-audit1/);
});
