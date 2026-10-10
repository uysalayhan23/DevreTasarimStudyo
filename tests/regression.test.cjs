const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const Sim=require('../dist/simulation.js');
const Symbols=require('../dist/symbols.js');
const View=require('../dist/viewport.js');
const Components=require('../dist/components.js');
const Materials=require('../dist/materials.js');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),context);
const lib=Symbols.prepareLibrary(JSON.parse(JSON.stringify(context.window.COMPONENT_LIBRARY)));
const byId=Object.fromEntries(lib.map(d=>[d.id,d]));
function circuit(){
  const project={components:[],wires:[],junctions:[]};
  const add=(typeId,id,ref=id)=>{const c={typeId,id,ref,x:40,y:40,rotation:0,label:byId[typeId].name,state:false};project.components.push(c);return c};
  const wire=(a,p,b,q)=>{const w={id:'w'+project.wires.length,from:{c:a.id,p},to:{c:b.id,p:q},color:'#e53935',points:[]};project.wires.push(w);return w};
  const solve=(options)=>Sim.solve(project,byId,options);
  return {project,add,wire,solve};
}
test('open switch, missing return, PE and identical phase cannot energize a lamp',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),sw=t.add('selector-no','sw'),h=t.add('lamp-green','h');
  t.wire(s,'L',sw,'13');t.wire(sw,'14',h,'X1');const ret=t.wire(h,'X2',s,'N');
  t.solve();assert.equal(h._active,false);
  sw.state=true;t.solve();assert.equal(h._active,true);
  sw.state=false;t.solve();assert.equal(h._active,false);
  sw.state=true;ret.to.p='PE';t.solve();assert.equal(h._active,false);
  ret.to.p='L';t.solve();assert.equal(h._active,false);
  ret.to.p='N';t.project.wires.pop();t.solve();assert.equal(h._active,false);
});
test('same reference closes NO, opens NC, and returns on coil power loss',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),sw=t.add('selector-no','sw'),k=t.add('coil-contactor','k','K1');
  const no=t.add('contact-no','no',' k1 '),nc=t.add('contact-nc','nc','K1'),other=t.add('contact-no','other','K2');
  const on=t.add('lamp-green','on'),off=t.add('lamp-red','off');
  t.wire(s,'L',sw,'13');t.wire(sw,'14',k,'A1');t.wire(k,'A2',s,'N');
  for(const [contact,lamp,a,b] of [[no,on,'13','14'],[nc,off,'21','22']]){t.wire(s,'L',contact,a);t.wire(contact,b,lamp,'X1');t.wire(lamp,'X2',s,'N')}
  t.solve();const before=Symbols.markup(byId[no.typeId],no);
  assert.equal(no._closed,false);assert.equal(nc._closed,true);assert.equal(off._active,true);
  sw.state=true;assert.equal(t.solve().stable,true);
  assert.equal(k._active,true);assert.equal(no._closed,true);assert.equal(nc._closed,false);assert.equal(other._closed,false);
  assert.equal(on._active,true);assert.equal(off._active,false);assert.notEqual(Symbols.markup(byId[no.typeId],no),before);
  sw.state=false;t.solve();assert.equal(k._active,false);assert.equal(no._closed,false);assert.equal(nc._closed,true);assert.equal(on._active,false);
});
test('main contactor is open without K1 and needs three distinct motor phases',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),sw=t.add('selector-no','sw'),k=t.add('coil-contactor','k','K1'),main=t.add('main-contact','main','K1'),m=t.add('motor-3p','m');
  const incoming=[];
  for(let i=0;i<3;i++){incoming.push(t.wire(s,['L1','L2','L3'][i],main,['1','3','5'][i]));t.wire(main,['2','4','6'][i],m,['U','V','W'][i])}
  t.wire(s,'L1',sw,'13');t.wire(sw,'14',k,'A1');t.wire(k,'A2',s,'N');
  t.solve();assert.equal(m._active,false);assert.equal(main._closed,false);
  sw.state=true;t.solve();assert.equal(m._active,true);assert.equal(main._closed,true);
  incoming[1].from.p='L1';incoming[2].from.p='L1';t.solve();assert.equal(m._active,false);
});
test('start/stop self holding survives Start release and drops on Stop',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),start=t.add('push-no','start'),stop=t.add('push-nc','stop'),k=t.add('coil-relay','k','K1'),hold=t.add('contact-no','hold','K1');
  t.wire(s,'L',stop,'21');t.wire(stop,'22',start,'13');t.wire(start,'14',k,'A1');t.wire(k,'A2',s,'N');
  t.wire(stop,'22',hold,'13');t.wire(hold,'14',k,'A1');
  t.solve();assert.equal(k._active,false);
  start.state=true;t.solve();assert.equal(k._active,true);
  start.state=false;t.solve();assert.equal(k._active,true);
  stop.state=true;t.solve();assert.equal(k._active,false);
  stop.state=false;t.solve();assert.equal(k._active,false);
});
test('relay chain longer than five stages converges and releases fully',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),sw=t.add('selector-no','sw');t.wire(s,'L',sw,'13');let last={c:sw,p:'14'};
  const chain=[];
  for(let i=0;i<12;i++){const k=t.add('coil-relay','k'+i,'K'+i),n=t.add('contact-no','n'+i,'K'+i);t.wire(last.c,last.p,k,'A1');t.wire(k,'A2',s,'N');t.wire(s,'L',n,'13');last={c:n,p:'14'};chain.push(k)}
  sw.state=true;assert.equal(t.solve().stable,true);assert.ok(chain.every(c=>c._active));
  sw.state=false;assert.equal(t.solve().stable,true);assert.ok(chain.every(c=>!c._active));
});
for(const [type,input,output] of [['smps',['L','N'],['P','M']],['transformer',['1','2'],['3','4']],['autotransformer',['1','2'],['3','4']],['rectifier',['~1','~2'],['+','−']]]){
  test(type+' requires both input terminals; its output is never an independent source',()=>{
    const t=circuit(),s=t.add('supply-1p','s'),sw=t.add('selector-no','sw'),device=t.add(type,'d'),h=t.add('lamp-green','h');
    t.wire(device,output[0],h,'X1');t.wire(h,'X2',device,output[1]);t.solve();assert.equal(device._active,false);assert.equal(h._active,false);
    t.wire(s,'L',sw,'13');t.wire(sw,'14',device,input[0]);const ret=t.wire(device,input[1],s,'N');
    t.solve();assert.equal(h._active,false);
    sw.state=true;assert.equal(t.solve().stable,true);assert.equal(device._active,true);assert.equal(h._active,true);
    sw.state=false;t.solve();assert.equal(device._active,false);assert.equal(h._active,false);assert.ok(t.project.wires.slice(0,2).every(w=>!w._active));
    sw.state=true;ret.to.p='PE';t.solve();assert.equal(device._active,false);assert.equal(h._active,false);
  });
}
test('cascaded transformer and power supply lose their outputs when primary is disconnected',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),tr=t.add('transformer','tr'),ps=t.add('smps','ps'),h=t.add('lamp-green','h');
  const supply=t.wire(s,'L',tr,'1');t.wire(tr,'2',s,'N');t.wire(tr,'3',ps,'L');t.wire(tr,'4',ps,'N');t.wire(ps,'P',h,'X1');t.wire(ps,'M',h,'X2');
  t.solve();assert.equal(h._active,true);t.project.wires=t.project.wires.filter(w=>w!==supply);t.solve();
  assert.ok([tr,ps,h].every(c=>!c._active));
});
test('all coil and load variants stay off with zero or one supply wire',()=>{
  for(const d of lib.filter(d=>Sim.coils.has(d.kind)||['lamp','led','buzzer','siren','flasher','motor','motor-dc','sensor','detector'].includes(d.kind))){
    const t=circuit(),s=t.add('supply-1p','s'),c=t.add(d.id,'c');t.solve();assert.equal(c._active,false,d.id);
    t.wire(s,'L',c,d.pins[0].id);t.solve();assert.equal(c._active,false,d.id+' single wire');
  }
});
test('separate secondary supplies cannot be mixed as a phantom return',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),a=t.add('smps','a'),b=t.add('smps','b'),h=t.add('lamp-green','h');
  for(const ps of [a,b]){t.wire(s,'L',ps,'L');t.wire(s,'N',ps,'N')}
  t.wire(a,'P',h,'X1');t.wire(b,'M',h,'X2');t.solve();assert.equal(h._active,false);
});
test('cable branches are electrical connections; matching colors alone are not',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),h=t.add('lamp-green','h');t.project.junctions.push({id:'j',x:200,y:100});
  t.project.wires.push({id:'wa',from:{c:s.id,p:'L'},to:{j:'j'}},{id:'wb',from:{j:'j'},to:{c:h.id,p:'X1'}});t.wire(h,'X2',s,'N');
  t.solve();assert.equal(h._active,true);t.project.wires.shift();t.solve();assert.equal(h._active,false);
});
test('PLC and generic PLC I/O clear stale states without blocking independent circuits',()=>{
  for(const id of ['plc-0-0','plc-io-symbol']){
    const t=circuit(),h=t.add('lamp-green','h');h._active=true;
    const plc=t.add(id,'plc'),result=t.solve();
    assert.equal(result.blocked,false,id+' must not disable the circuit');
    assert.equal(result.stable,true,id+' converges');
    assert.equal(h._active,false,id+' clears stale lamp');
    assert.equal(plc._active,false,id+' stays inactive without a supply');
    if(byId[id].isPLC){
      assert.equal(plc._plcRuntime.powered,false,id+' PLC not powered');
      assert.ok(Object.values(plc._plcRuntime.outputs).every(value=>value===false),id+' outputs cannot energize without supply');
    }
  }
});
test('short circuits stay off; an NC feedback loop advances without blocking other branches',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),h=t.add('lamp-green','h');t.wire(s,'L',s,'N');t.wire(s,'L',h,'X1');t.wire(s,'N',h,'X2');
  assert.equal(t.solve().shortCircuit,true);assert.equal(h._active,false);
  const r=circuit(),src=r.add('supply-1p','s'),k=r.add('coil-relay','k','K1'),nc=r.add('contact-nc','nc','K1'),independent=r.add('lamp-green','independent');
  r.wire(src,'L',nc,'21');r.wire(nc,'22',k,'A1');r.wire(k,'A2',src,'N');
  r.wire(src,'L',independent,'X1');r.wire(independent,'X2',src,'N');
  const states=[];
  for(let i=0;i<6;i++){
    const result=r.solve();assert.equal(result.stable,false);assert.equal(result.blocked,false);assert.equal(result.oscillating,true);
    assert.deepEqual(result.cyclingRefs,['K1']);assert.equal(independent._active,true);states.push(k._active);
  }
  assert.deepEqual(states,[true,false,true,false,true,false]);
  Sim.clear(r.project);assert.ok(r.project.components.every(c=>!c._active));
});
test('screenshot circuit seals after changing K1 NC to NO, including its parallel power supply',()=>{
  const t=circuit(),s=t.add('supply-1p','source','S3'),start=t.add('push-no','start','S2'),hold=t.add('contact-nc','hold','k1');
  const k=t.add('coil-contactor','coil','K1'),ps=t.add('smps','ps','S1'),h=t.add('lamp-red','lamp','H1');
  const feed=t.wire(s,'L',start,'13');t.wire(start,'13',hold,'21');t.wire(start,'14',hold,'22');
  t.wire(start,'14',k,'A1');t.wire(k,'A1',ps,'N');t.wire(s,'N',k,'A2');t.wire(k,'A2',ps,'L');
  t.wire(ps,'M',h,'X1');t.wire(ps,'P',h,'X2');
  assert.equal(t.solve().oscillating,true);
  start.state=true;assert.equal(t.solve().stable,true);assert.equal(h._active,true);
  start.state=false;assert.equal(t.solve().oscillating,true);
  assert.equal(Components.changeContactType(t.project,hold,'contact-no',byId),true);
  t.solve({reset:true});assert.equal(k._active,false);assert.equal(h._active,false);
  start.state=true;assert.equal(t.solve().stable,true);assert.equal(k._active,true);
  start.state=false;
  for(let i=0;i<20;i++){assert.equal(t.solve().stable,true);assert.ok([k,ps,h].every(c=>c._active));assert.equal(hold._closed,true)}
  t.project.wires=t.project.wires.filter(w=>w!==feed);t.solve();assert.ok([k,ps,h].every(c=>!c._active));
  t.project.wires.push(feed);t.solve();assert.ok([k,ps,h].every(c=>!c._active));
});
test('NO/NC type conversion preserves endpoint positions, both wire directions, routes and names',()=>{
  for(const rotation of [0,90,180,270]){
    const t=circuit(),s=t.add('supply-1p','s'),c=t.add('contact-nc','c',' k1 '),h=t.add('lamp-green','h');c.rotation=rotation;c.label='Mühürleme';
    const a=t.wire(s,'L',c,'21'),b=t.wire(c,'22',h,'X1');a.points=[{x:80,y:160}];b.points=[{x:80,y:220}];
    const before=JSON.parse(JSON.stringify(t.project)),positions=byId[c.typeId].pins.map(p=>Symbols.rotatedPoint(p,byId[c.typeId],rotation));
    assert.equal(Components.changeContactType(t.project,c,'contact-no',byId),true);
    assert.equal(a.to.p,'13');assert.equal(b.from.p,'14');assert.equal(c.ref,' k1 ');assert.equal(c.label,'Mühürleme');
    assert.deepEqual(byId[c.typeId].pins.map(p=>Symbols.rotatedPoint(p,byId[c.typeId],rotation)),positions);
    assert.deepEqual(t.project.wires.map(w=>w.points),before.wires.map(w=>w.points));
    assert.equal(Components.changeContactType(t.project,c,'contact-nc',byId),true);assert.deepEqual(t.project.wires,before.wires);
    assert.equal(Components.changeContactType(t.project,h,'contact-no',byId),false);
  }
});
test('every library preview uses the complete canvas geometry including PLCs, terminals and labels',()=>{
  for(const d of lib){
    const c={id:'x',ref:Symbols.referencePrefix(d)+'1',label:d.name,state:false,rotation:0,_active:false};
    const clean=s=>s.replace(/data-(analog|temperature|load)-handle="[^"]*"/g,'data-$1-handle="ID"').replace(/data-sensor-target="[^"]*"/g,'data-sensor-target="ID"').replace(/reed-magnet-[^" )]+/g,'reed-magnet-ID').replace(/level-[^" ]+/g,'level-ID');assert.ok(clean(Symbols.preview(d)).includes(clean(Symbols.markup(d,c))),d.id);
    assert.equal((Symbols.preview(d).match(/class="port-group"/g)||[]).length,d.pins.length,d.id);
    assert.ok(!/undefined|NaN/.test(Symbols.markup(d,c)),d.id);
  }
});
function checkTextRotations(markup,id){
  const stack=[0];let count=0;
  for(const match of markup.matchAll(/<(\/?)([\w-]+)\b([^>]*?)(\/?)>/g)){
    const [,close,tag,attrs,self]=match;
    if(close){if(tag==='g')stack.pop();continue}
    const own=[...attrs.matchAll(/rotate\(([-\d.]+)/g)].reduce((s,m)=>s+Number(m[1]),0),angle=stack.at(-1)+own;
    if(tag==='text'){assert.equal(((angle%360)+360)%360,0,id+' '+attrs);count++}
    if(tag==='g'&&!self)stack.push(angle);
  }
  assert.ok(count>0,id);
}
test('every text is upright and every pin stays on the grid in all four orientations',()=>{
  for(const d of lib)for(const rotation of [0,90,180,270]){
    const c={rotation,ref:'K1',label:'Test açıklaması',state:false};const m=Symbols.markup(d,c);
    checkTextRotations(m,d.id+'/'+rotation);
    for(const p of d.pins){
      const pos=Symbols.rotatedPoint(p,d,rotation);
      if(String(d.physicalScaleSource||'').startsWith('workspace-space-v1:')){
        assert.ok(Number.isFinite(pos.x)&&Number.isFinite(pos.y),d.id+' physically verified terminal');
      }else{assert.ok(Number.isInteger(pos.x/10),d.id);assert.ok(Number.isInteger(pos.y/10),d.id)}
      assert.ok(m.includes('cx="'+pos.x+'" cy="'+pos.y+'"'),d.id)
    }
  }
});
test('pan supports positive and negative X and Y; zoom preserves the anchor world point',()=>{
  const start={x:0,y:0,zoom:1};
  for(const [dx,dy] of [[400,0],[-400,0],[0,400],[0,-400],[250,-250]]){const v=View.panFrom(start,dx,dy);assert.equal(v.x,dx);assert.equal(v.y,dy)}
  const v={x:-315,y:220,zoom:.8},anchor={x:430,y:190},world=View.toWorld(v,anchor);
  for(const z of [.2,.4,1,1.8]){const n=View.zoomAt(v,z,anchor),point=View.toWorld(n,anchor);assert.ok(Math.abs(point.x-world.x)<1e-8);assert.ok(Math.abs(point.y-world.y)<1e-8)}
});
test('every contact-bearing library item switches a real lamp in NO and NC modes',()=>{
  const definitions=lib.filter(d=>Components.contactGroups(d).length&&!d.fuseSlots&&!['phase-monitor','nh-holder'].includes(d.kind));
  assert.ok(definitions.length>35);
  for(const d of definitions)for(const group of Components.contactGroups(d).filter(g=>!g.inverseOf&&!g.fixed))for(const mode of (d.selectorSteps||d.rotaryIsolator||d.positions?['NO']:['NO','NC'])){
    const t=circuit(),s=t.add('supply-dc-plus','source'),c=t.add(d.id,'device','K1'),lamp=t.add('lamp-green','lamp');
    c.delayValue=0;Components.setContactMode(t.project,c,mode,byId,group.id);
    const npn=group.powered&&d.outputType==='NPN';
    t.wire(s,npn?'M':'P',c,group.a);t.wire(c,group.b,lamp,'X1');t.wire(lamp,'X2',s,npn?'P':'M');
    let actuator=c;
    if(d.followDevice==='thermal')actuator=t.add('overload','thermal','K1');
    if(Sim.followers.has(d.kind)){
      actuator=t.add('selector-no','trigger');const coil=t.add('coil-relay','coil','K1');
      t.wire(s,'P',actuator,'13');t.wire(actuator,'14',coil,'A1');t.wire(coil,'A2',s,'M');
    }
    if(d.kind==='ssr'){actuator=t.add('selector-no','trigger');t.wire(s,'P',actuator,'13');t.wire(actuator,'14',c,'3+');t.wire(s,'M',c,'4−')}
    if(group.powered)t.wire(c,npn?'BN':'BU',s,npn?'P':'M');
    t.solve();assert.equal(lamp._active,mode==='NC',d.id+'/'+group.id+'/'+mode+' rest');
    actuator.state=true;if(group.position!==undefined)c.position=group.position;
    if(d.reedSensor)c.sensing={distance:5,range:10,offset:0};
    if(group.positions)c.position=group.positions[0];
    t.solve();assert.equal(lamp._active,mode==='NO',d.id+'/'+group.id+'/'+mode+' operated');
  }
});
test('each contactor pole and overload auxiliary pair can have a separate mode',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),main=t.add('main-contact','main','K1'),over=t.add('overload','over');
  Components.setContactMode(t.project,main,'NC',byId,'3-4');Components.setContactMode(t.project,over,'NO',byId,'aux');
  const a=t.add('lamp-green','a'),b=t.add('lamp-red','b');
  t.wire(s,'L',main,'1');t.wire(main,'2',a,'X1');t.wire(a,'X2',s,'N');
  t.wire(s,'L',main,'3');t.wire(main,'4',b,'X1');t.wire(b,'X2',s,'N');t.solve();
  assert.equal(a._active,false);assert.equal(b._active,true);assert.equal(over._contactStates.aux,false);
  assert.equal(Components.contactSummary(main,byId[main.typeId]),'2NO + 1NC');
  assert.equal(Components.pinLabel(over,byId.overload,byId.overload.pins.find(p=>p.id==='95')),'97');
  over.state=true;t.solve();assert.equal(over._contactStates.aux,true);assert.equal(over._contactStates['1-2'],false);
});
test('changeover settings always preserve complementary throws',()=>{
  for(const id of ['contact-both','push-both','float'])for(const mode of ['NO','NC']){
    const t=circuit(),c=t.add(id,'device');Components.setContactMode(t.project,c,mode,byId);
    for(const actuated of [false,true]){
      const states=Components.contactStates(c,byId[id],actuated);
      assert.notEqual(states.main,states.other,id+'/'+mode);assert.equal(Number(states.main)+Number(states.other),1);
    }
  }
});
test('NC sensor output is gated by its supply even when no target is detected',()=>{
  const t=circuit(),s=t.add('supply-dc-plus','s'),c=t.add('proximity','sensor'),h=t.add('lamp-green','h');
  Components.setContactMode(t.project,c,'NC',byId);
  t.wire(s,'P',c,'BN');t.wire(c,'BK',h,'X1');t.wire(h,'X2',s,'M');t.solve();assert.equal(h._active,false);
  const ret=t.wire(c,'BU',s,'M');t.solve();assert.equal(h._active,true);
  c.state=true;t.solve();assert.equal(h._active,false);
  c.state=false;t.project.wires=t.project.wires.filter(w=>w!==ret);t.solve();assert.equal(h._active,false);
});
test('NO/NC configuration persists without changing wires, geometry, rotation or control mode',()=>{
  for(const d of lib.filter(d=>Components.contactGroups(d).length)){
    const t=circuit(),c=t.add(d.id,'c','S7'),s=t.add('supply-1p','s');c.rotation=270;c.x=120;c.y=330;c.label='Özel açıklama';
    const g=Components.contactGroups(d)[0];t.wire(s,'L',c,g.a);t.wire(c,g.b,s,'N');
    const wires=JSON.stringify(t.project.wires),savedGeometry=JSON.stringify([c.typeId,c.x,c.y,c.rotation,c.ref,c.label,d.pins,d.controlMode]);
    Components.setContactMode(t.project,c,'NO',byId);Components.setContactMode(t.project,c,'NC',byId);
    assert.equal(JSON.stringify(t.project.wires),wires,d.id);
    assert.equal(JSON.stringify([c.typeId,c.x,c.y,c.rotation,c.ref,c.label,d.pins,d.controlMode]),savedGeometry,d.id);
    const restored=JSON.parse(JSON.stringify(t.project)).components[0];
    const expected=d.selectorSteps||d.rotaryIsolator||d.positions?'NO':d.fuseSlots||['phase-monitor','nh-holder'].includes(d.kind)?g.normal:'NC';assert.equal(Components.contactMode(restored,d,g),expected);Sim.clear(t.project);assert.equal(Components.contactMode(c,d,g),expected);
  }
});
test('all library records have local 3D assets and the library and sheet share the complete material drawing',()=>{
  const files=new Set();
  for(const d of lib){
    const c={ref:Symbols.referencePrefix(d)+'1',label:d.name,state:false,rotation:0,_active:false},asset=Materials.assets[Materials.family(d,c)];
    if(d.materialSymbol||d.designMaterial)assert.ok(Materials.markup(d,c).includes('design-'+d.id),d.id);
    else if(!asset){
      const rendered=Symbols.markup(d,c,{mode:'material'});
      assert.match(rendered,/class="material-layer\b/,d.id+' requires a material render');
      const refs=[...rendered.matchAll(/href="assets\/products\/([^"?]+)(?:\?[^"?]*)?"/g)].map(x=>x[1]);
      for(const file of refs)assert.ok(fs.existsSync(path.join(__dirname,'../dist/assets/products',file)),d.id+' missing product art '+file);
      assert.ok(refs.length>0||String(d.physicalScaleSource||'').includes('logical-proxy')||d.instrument,d.id+' no catalog asset or validated renderer source');
    }else {assert.ok(asset,d.id);files.add(asset.file)}
    const markup=Symbols.markup(d,c,{mode:'material'});assert.ok(Symbols.preview(d,'material').includes(markup),d.id);
    if(d.id==='sinamics-v20-1p'){
      const overlay=Symbols.markup(d,c,{mode:'material',wireOverlayOnly:true});
      assert.equal((overlay.match(/class="port-group/g)||[]).length,d.pins.length,d.id);
    }else assert.equal((markup.match(/class="port-group/g)||[]).length,d.pins.length,d.id);
    assert.ok(!/undefined|NaN|https?:\/\//.test(markup),d.id);
  }
  for(const file of files)assert.ok(fs.statSync(path.join(__dirname,'../dist',file)).size>1000,file);
  for(const asset of Object.values(Materials.assets)){
    const r=asset.bounds;assert.ok(r.x>=0&&r.y>=0&&r.width>0&&r.height>0);assert.ok(r.x+r.width<=asset.atlasWidth&&r.y+r.height<=asset.atlasHeight);
  }
});
test('switching IEC and material drawings preserves simulation state and exact terminal positions in every orientation',()=>{
  for(const d of lib)for(const rotation of [0,90,180,270]){
    const c={id:'c',rotation,ref:'K1',label:'Açıklama',state:true,_active:true,contactModes:{main:'NC'}},before=JSON.stringify(c);
    const a=Symbols.markup(d,c,{mode:'iec'}),b=Symbols.markup(d,c,{mode:'material'});checkTextRotations(b,d.id+'/material/'+rotation);
    for(const p of d.pins){const pos=Symbols.rotatedPoint(p,d,rotation),md=require('../dist/assemblies.js').definition(d,c,'material'),mp=md.pins.find(q=>q.id===p.id),mpos=Symbols.rotatedPoint(mp,md,rotation),needle='cx="'+pos.x+'" cy="'+pos.y+'"',mneedle='cx="'+mpos.x+'" cy="'+mpos.y+'"';assert.ok(a.includes(needle)&&b.includes(mneedle),d.id)}
    assert.equal(JSON.stringify(c),before,d.id);
  }
  const d=byId['lamp-red'];assert.equal(Materials.family(d,{_active:false}),'incandescent-bulb-off');assert.equal(Materials.family(d,{_active:true}),'incandescent-bulb-on');
});
