'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-11',lesson=L.byId[id];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
function frame(project,duty,now){
 part(project,'pwm1').dutyPercent=duty;
 const result=Native.solve(project,defs,{now});
 return {result,pwmHigh:!!part(project,'pwm1')._pwmHigh,mosfet:!!part(project,'q1')._mosfetOn,
  motor:!!part(project,'m1')._active,direction:part(project,'m1')._spin};
}
test('SC11 has canonical motor and G/D/S wired terminals, no fake RPM claims',()=>{
 assert.equal(lesson.kind,'wiring');
 assert.equal(part(lesson.project,'q1').typeId,'irf540n-mosfet');
 assert.equal(part(lesson.project,'m1').typeId,'motor-dc');
 assert.equal(part(lesson.project,'pwm1').typeId,'virtual-pwm-generator-v1');
 assert.equal(part(lesson.project,'sw'),undefined);
 for(const pin of ['V+','GND','OUT'])assert.ok(defs['virtual-pwm-generator-v1'].pins.some(p=>p.id===pin));
 assert.equal(lesson.pedagogyReview.mq05PwmVirtual.realRpmModel,false);
 const names=lesson.project.wires.map(w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p);
 for(const wire of ['g1/P>pwm1/V+','pwm1/GND>g1/M','pwm1/OUT>rg/1','rg/2>q1/G','q1/S>g1/M','g1/P>m1/+','m1/−>q1/D'])assert.ok(names.includes(wire),wire);
});
test('PWM1 OUT is electrical, has no SHAFT and is never classed as a motor',()=>{
 const Encoder=require('../dist/incremental-encoder.js');
 const Symbols=require('../dist/symbols.js');
 const pwm=clone(defs['virtual-pwm-generator-v1']);
 const motor=clone(defs['motor-dc']);
 assert.ok(motor,'DC motor baseline must remain available');
 Encoder.installMechanicalPins([pwm,motor]);
 assert.equal(Encoder.isMotorDef(pwm),false);
 assert.equal(Encoder.isMotorDef(motor),true);
 assert.deepEqual(pwm.pins.map(p=>p.id).sort(),['GND','OUT','V+']);
 assert.ok(!pwm.pins.some(p=>p.mechanical||p.id==='SHAFT'));
 assert.equal(pwm.pins.find(p=>p.id==='OUT').mechanical,undefined);
 assert.equal(pwm.mechanicalShaft,undefined);
 assert.ok(motor.pins.some(p=>p.id==='SHAFT'&&p.mechanical===true));
 assert.equal(Symbols.motionMarkup(pwm,{id:'pwm1'}),'');
 assert.ok(Symbols.motionMarkup(motor,{id:'m1'}).includes('motion-indicator'));
});
test('native solver handles PWM OFF/ON phases and no fabricated motor RPM',()=>{
 const p=clone(lesson.project);
 for(const [duty,time,on] of [[0,0,false],[50,0,true],[50,.75,false],[100,.75,true],[0,1,false]]){
  const x=frame(p,duty,time);
  assert.equal(x.result.stable,true);
  assert.equal(x.result.blocked,false);
  assert.equal(x.result.shortCircuit,false);
  assert.equal(x.pwmHigh,on);
  assert.equal(x.mosfet,on);
  assert.equal(x.motor,on);
  assert.equal(part(p,'m1')._motorRPM,undefined);
 }
});
test('broken G, D or motor path fails motor drive, not animation-only',()=>{
 for(const edge of [['rg','q1'],['m1','q1'],['g1','m1'],['g1','pwm1'],['pwm1','rg']]){
  const p=clone(lesson.project);
  p.wires=p.wires.filter(w=>!(w.from.c===edge[0]&&w.to.c===edge[1]));
  const x=frame(p,100,0);
  assert.equal(x.result.stable,true);
  assert.equal(x.motor,false);
 }
});
test('PWM source is fail-closed when its power, GND or OUT wire is removed',()=>{
 for(const [from,to] of [['g1','pwm1'],['pwm1','g1'],['pwm1','rg']]){
  const p=clone(lesson.project);
  p.wires=p.wires.filter(w=>!(w.from.c===from&&w.to.c===to));
  const x=frame(p,100,0);
  assert.equal(part(p,'pwm1')._pwmSupplyValid,from==='pwm1'&&to==='rg',from+'>'+to);
  if(from!=='pwm1'||to!=='rg')assert.equal(x.pwmHigh,false);
  assert.equal(x.motor,false,from+'>'+to);
 }
});
test('invalid duty commands stay OFF in native solver',()=>{
 for(const duty of [-1,101,NaN]){
  const p=clone(lesson.project);const x=frame(p,duty,0);
  assert.equal(x.pwmHigh,false);
  assert.equal(x.motor,false);
 }
});
test('PWM1 terminals occupy a consistent non-overlapping component envelope',()=>{
 const d=defs['virtual-pwm-generator-v1'];
 assert.equal(d.kind,'pwm-generator');
 assert.equal(d.virtualInstrument,true);
 assert.ok(d.w>0&&d.h>0);
 const pins=['V+','GND','OUT'].map(id=>d.pins.find(p=>p.id===id));
 assert.ok(pins.every(Boolean));
 for(const p of pins){assert.ok(p.x>=0&&p.x<=d.w);assert.ok(p.y>=0&&p.y<=d.h);}
 assert.equal(pins[0].side,'left');
 assert.equal(pins[1].side,'left');
 assert.equal(pins[2].side,'right');
 assert.ok(Math.abs(pins[0].y-pins[1].y)>20);
});
test('missing or nonnumeric PWM settings fail closed',()=>{
 for(const setting of [{dutyPercent:null},{dutyPercent:'100'},{frequencyHz:null},{frequencyHz:'1000'},{dutyPercent:undefined}]){
  const p=clone(lesson.project);
  Object.assign(part(p,'pwm1'),setting);
  const result=Native.solve(p,defs,{now:0});
  assert.equal(result.shortCircuit,false);
  assert.equal(part(p,'pwm1')._pwmSupplyValid,false);
  assert.equal(!!part(p,'pwm1')._pwmHigh,false);
  assert.equal(!!part(p,'m1')._active,false);
 }
});
test('PWM1 uses a dedicated visible front rather than fallback material body',()=>{
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
 const source=fs.readFileSync(path.join(__dirname,'../dist/design-visuals.js'),'utf8');
 const w={DTSInstallation:{material(){return null}}};
 vm.runInNewContext(source,{window:w});
 const definition=defs['virtual-pwm-generator-v1'];
 const svg=w.DTSDesignVisuals.markup(definition,{id:'pwm1',dutyPercent:50,frequencyHz:1000,_pwmSupplyValid:true,_pwmHigh:true});
 for(const token of ['PWM GENERATOR','DUTY 50%','FREQ 1000 Hz','V+','GND','OUT','VIRTUAL'])
  assert.ok(svg.includes(token),'PWM1 face missing '+token);
 assert.ok(!svg.includes('data-material="design-' + definition.id + '"')||svg.includes('PWM GENERATOR'));
 const materialSource=fs.readFileSync(path.join(__dirname,'../dist/materials.js'),'utf8');
 assert.match(materialSource,/d\.kind==='pwm-generator'[^\n]*Design\.markup\(d,c\)/);
});
test('whole original curriculum and catalog remain available',()=>{
 const a=QA.audit({L,defs,Simulation:Native});
 assert.equal(a.total,1655);
 assert.equal(a.definitionCount,941);
 assert.equal(a.withWires,733);
 assert.equal(a.stable,733);
 assert.equal(L.mq07Batch200.reviewIds.length,47);
 for(const k of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','shortCircuits','blocked','unstable','errors','duplicateIds'])assert.deepEqual(a[k],[],k);
});
