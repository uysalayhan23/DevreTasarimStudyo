const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Actuation=require('../dist/actuation.js');
const Audio=require('../dist/audio.js');
const Sim=require('../dist/simulation.js');
const Symbols=require('../dist/symbols.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../dist/library.js'),'utf8'),context);
const byId=Object.fromEntries(Symbols.prepareLibrary(context.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
function clock(){
  let t=0,id=0;const frames=new Map(),timers=new Map();
  const advance=ms=>{const end=t+ms;for(;;){const entry=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!entry)break;timers.delete(entry[0]);t=entry[1].at;entry[1].fn()}t=end};
  return {now:()=>t,frame:fn=>{frames.set(++id,fn);return id},cancelFrame:key=>frames.delete(key),later:(fn,ms)=>{timers.set(++id,{fn,at:t+ms});return id},cancelLater:key=>timers.delete(key),
    paint:()=>{advance(16);const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(t))},advance};
}
function harness(){
  const time=clock(),visual=[],edges=[];let allowed=true;
  const controls=Actuation.create({...time,valid:()=>allowed,visual:(id,down)=>visual.push([time.now(),id,down]),commit:(id,value)=>edges.push([time.now(),id,value])});
  return {time,visual,edges,controls,stop:()=>{controls.cancelAll();allowed=false}};
}
test('each quick tap paints a press before the electrical edge and produces a bounded contact pulse',()=>{
  const {time,visual,edges,controls}=harness();
  for(let n=0;n<8;n++){
    const start=time.now(),job=controls.press('S1');controls.release(job);
    assert.deepEqual(visual.at(-1),[start,'S1',true]);assert.equal(edges.length,n*2);
    time.paint();assert.equal(edges.length,n*2);time.paint();time.advance(84);assert.equal(edges.length,n*2);
    time.advance(1);assert.deepEqual(edges.at(-1),[start+117,'S1',true]);
    time.advance(55);assert.deepEqual(edges.at(-1),[start+172,'S1',false]);
  }
  assert.equal(visual.filter(v=>v[2]).length,8);
});
test('overlapping rapid taps are not lost; holding, release and cancellation cannot leave a stale edge',()=>{
  const {time,edges,controls,stop}=harness();
  const a=controls.press('S1');controls.release(a);const b=controls.press('S1');controls.release(b);
  time.paint();time.paint();time.advance(200);
  assert.deepEqual(edges.map(e=>e[2]),[true,false,true,false]);
  const hold=controls.press('S1');time.paint();time.paint();time.advance(500);
  assert.equal(edges.at(-1)[2],true);controls.release(hold);controls.release(hold);time.advance(1);assert.equal(edges.at(-1)[2],false);
  controls.press('S1');const count=edges.length;stop();time.paint();time.paint();time.advance(1000);assert.equal(edges.length,count);
});
test('selector clicks are delayed once and stay latched after pointer release',()=>{
  const {time,edges,controls}=harness();
  const job=controls.press('S3',false);controls.release(job);assert.equal(edges.length,0);
  time.paint();time.paint();time.advance(200);assert.deepEqual(edges.map(e=>e[2]),['toggle']);
});
function circuit(){
  const p={components:[],wires:[]};
  const add=(typeId,id)=>{const c={typeId,id,ref:id,state:false};p.components.push(c);return c};
  const wire=(a,x,b,y)=>p.wires.push({id:'w'+p.wires.length,from:{c:a.id,p:x},to:{c:b.id,p:y}});
  return {p,add,wire,solve:()=>Sim.solve(p,byId)};
}
test('a painted quick Start tap seals a real contactor circuit; Stop drops it and remains released',()=>{
  const {p,add,wire,solve}=circuit(),source=add('supply-1p','G1'),start=add('push-no','S2'),stop=add('push-nc','S0'),coil=add('coil-contactor','K1'),hold=add('contact-no','aux');hold.ref='k1';
  wire(source,'L',stop,'21');wire(stop,'22',start,'13');wire(stop,'22',hold,'13');wire(start,'14',coil,'A1');wire(hold,'14',coil,'A1');wire(source,'N',coil,'A2');solve();
  const time=clock(),displayed=new Set();
  const gate=Actuation.create({...time,visual:(id,down)=>{if(down)displayed.add(id)},commit:(id,value)=>{assert.ok(displayed.has(id));p.components.find(c=>c.id===id).state=value;solve()}});
  const s=gate.press(start.id);gate.release(s);assert.equal(coil._active,false);
  time.paint();time.paint();time.advance(200);assert.equal(start.state,false);assert.equal(coil._active,true);
  const z=gate.press(stop.id);gate.release(z);time.paint();time.paint();time.advance(200);assert.equal(stop.state,false);assert.equal(coil._active,false);
});
test('three-phase direction follows phase order and stops on lost phase; DC follows polarity',()=>{
  const {p,add,wire,solve}=circuit(),source=add('supply-3p','G1'),motor=add('motor-3p','M1');
  wire(source,'L1',motor,'U');wire(source,'L2',motor,'V');wire(source,'L3',motor,'W');solve();assert.equal(motor._spin,1);
  p.wires[0].from.p='L2';p.wires[1].from.p='L1';solve();assert.equal(motor._spin,-1);
  motor.rotation=90;solve();assert.equal(motor._spin,-1);
  motor.direction='ccw';solve();assert.equal(motor._spin,1);
  p.wires.pop();solve();assert.equal(motor._active,false);assert.equal(motor._spin,0);
  const dc=circuit(),battery=dc.add('supply-dc-plus','G2'),dm=dc.add('motor-dc','M2');dc.wire(battery,'P',dm,'+');dc.wire(battery,'M',dm,'−');dc.solve();assert.equal(dm._spin,1);
  dc.p.wires[0].from.p='M';dc.p.wires[1].from.p='P';dc.solve();assert.equal(dm._spin,-1);
  Sim.clear(dc.p);assert.equal(dm._spin,0);
});
test('sound state groups one coil and its followers into one clack; disconnected motors make no hum',()=>{
  const p={components:[{id:'a',ref:' k1 ',typeId:'coil-contactor',_active:true},{id:'b',ref:'K1',typeId:'main-contact',_active:true},{id:'c',typeId:'motor-3p',_active:false},{id:'d',typeId:'motor-1p',_active:true}]};
  const state=Audio.state(p,byId,true);assert.equal(state.contactors.size,1);assert.equal(state.motors,1);
  assert.equal(Audio.state(p,byId,false).motors,0);
});
test('Autonics NPN outputs sink to BU and need both supply wires before operating a load',()=>{
  const {p,add,wire,solve}=circuit(),dc=add('supply-dc-plus','G1'),sensor=add('autonics-pr12-npn','B1'),lamp=add('lamp-green','H1');
  sensor.state=true;wire(dc,'P',sensor,'BN');wire(dc,'M',sensor,'BU');wire(dc,'P',lamp,'X1');wire(sensor,'BK',lamp,'X2');
  solve();assert.equal(lamp._active,true);assert.equal(sensor._contactStates.output,true);
  p.wires.splice(1,1);solve();assert.equal(lamp._active,false);assert.equal(sensor._contactStates.output,false);
});
function audioContext(){
  const playing=new Set(),nodes=[];let instance;
  const param=()=>({value:0,setValueAtTime(v){this.value=v},exponentialRampToValueAtTime(v){this.value=v},linearRampToValueAtTime(v){this.value=v},setTargetAtTime(v){this.value=v},cancelScheduledValues(){}});
  class Context{
    constructor(){instance=this;this.currentTime=0;this.sampleRate=8000;this.state='running';this.destination={};}
    node(kind){const node={kind,gain:param(),frequency:param(),Q:param(),connect(){},disconnect(){this.disconnected=true},start(){playing.add(this)},stop(t=0){this.end=t},getChannelData(){return new Float32Array(4000)}};nodes.push(node);return node}
    createGain(){return this.node('gain')}createOscillator(){return this.node('oscillator')}createBufferSource(){return this.node('buffer')}createBiquadFilter(){return this.node('filter')}createBuffer(){return this.node('noise')}
    resume(){this.state='running';return Promise.resolve()}close(){this.state='closed';return Promise.resolve()}
    advance(t){this.currentTime+=t;for(const n of [...playing])if(n.end!==undefined&&n.end<=this.currentTime){playing.delete(n);n.onended?.()}}
  }
  return {Context,playing,nodes,advance:t=>instance.advance(t)};
}
test('offline audio starts once per transition, mutes, and cleans repeated motor loops',()=>{
  const engine=audioContext(),audio=Audio.create({AudioContext:engine.Context}),p={components:[]};assert.equal(audio.unlock(),true);
  const coil={id:'c',ref:'K1',typeId:'coil-contactor',_active:true},motor={id:'m',typeId:'motor-3p',_active:true};p.components=[coil,motor];
  audio.sync(p,byId,true);const created=engine.nodes.length;audio.sync(p,byId,true);assert.equal(engine.nodes.length,created);
  engine.advance(.3);assert.equal(engine.playing.size,3);
  audio.setEnabled(false);engine.advance(.2);assert.equal(engine.playing.size,0);
  audio.setEnabled(true);assert.equal(engine.playing.size,3);
  for(let n=0;n<12;n++){audio.sync(p,byId,false);engine.advance(.3);assert.equal(engine.playing.size,0);audio.sync(p,byId,true);engine.advance(.3);assert.equal(engine.playing.size,3)}
  audio.sync(p,byId,false);engine.advance(.3);assert.equal(engine.playing.size,0);
  assert.ok(engine.nodes.filter(n=>['oscillator','buffer'].includes(n.kind)).every(n=>n.disconnected));audio.dispose();
});
