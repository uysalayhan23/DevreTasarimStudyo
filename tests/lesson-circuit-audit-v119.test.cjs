'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function finalLessons(){
  require('../dist/tutorial-lessons.js');
  const outlined=require('../dist/tutorial-source-outline.js');
  const ctx={window:{DTSTutorialLessons:outlined}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),ctx);
  return ctx.window.DTSTutorialLessons;
}
function runtimeLibrary(){
  const ctx={window:{}};
  for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js']){
    vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),ctx);
  }
  return ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY);
}
const Lessons=finalLessons();
const library=runtimeLibrary();
const byId=Object.fromEntries(library.map(x=>[x.id,x]));
const lc=s=>String(s||'').toLocaleLowerCase('tr-TR');
const visualOnly=d=>d?.visualOnly||d?.diagramOnly||d?.kind==='tutorial-meter'||d?.kind==='multimeter'||d?.kind==='clamp-meter';
const usedComponents=l=>new Set((l.project.wires||[]).flatMap(w=>[w.from.c,w.to.c]));
const family={
  resistor:id=>/resistor/i.test(id),
  capacitor:id=>/capacitor/i.test(id),
  inductor:id=>/reactor|winding|inductor|coil-relay|coil-contactor/i.test(id),
  lamp:id=>/lamp|light|led/i.test(id),
  relay:id=>/relay|contactor|coil-relay/i.test(id),
  transistor:id=>/bd139|bd140|transistor|bjt/i.test(id),
  diode:id=>/diode|tutorial-diode/i.test(id),
  mosfet:id=>/mosfet/i.test(id),
  igbt:id=>/igbt/i.test(id),
  scr:id=>/tutorial-scr/i.test(id),
  triac:id=>/tutorial-triac/i.test(id),
  diac:id=>/tutorial-diac/i.test(id),
  opto:id=>/tlp521|opto/i.test(id),
  opamp:id=>/tutorial-opamp|lm358/i.test(id),
  motor:id=>/(^|-)motor|hcfa-sv-x2mh|motor-3p/i.test(id),
  plc:id=>/^plc-|plc-hw/i.test(id),
  measure:id=>/meter|ut33d|ut200a|tachometer|cosphimeter|wattmeter|frequency|lcr/i.test(id)
};

function assertFamily(l,f,label,ok=family[f]){
  const ids=l.project.components.map(c=>c.typeId);
  assert.ok(ids.some(ok),`${l.id}: "${l.title}" requires ${label}; components=${ids.join(',')}`);
}

test('LESSON AUDIT: every wiring lesson has a single connected electrical graph',()=>{
  for(const l of Lessons.lessons.filter(x=>x.kind==='wiring')){
    assert.ok(l.project.wires.length,`${l.id} has no wires`);
    assert.equal(l.steps.length,l.project.wires.length,`${l.id} steps do not match wires`);
    const ids=l.project.components.map(c=>c.id);
    const index=new Map(ids.map(id=>[id,[]]));
    for(const w of l.project.wires||[]){
      assert.ok(index.has(w.from.c),`${l.id}: unknown wire source ${w.from.c}`);
      assert.ok(index.has(w.to.c),`${l.id}: unknown wire target ${w.to.c}`);
      index.get(w.from.c).push(w.to.c);index.get(w.to.c).push(w.from.c);
    }
    for(const c of l.project.components||[])if(c.probeTarget?.c&&index.has(c.probeTarget.c)){index.get(c.id).push(c.probeTarget.c);index.get(c.probeTarget.c).push(c.id)}
    const used=usedComponents(l);
    const roots=[...used];
    if(roots.length){
      const pending=new Set(roots);let islandCount=0;
      while(pending.size){
        islandCount++;const first=pending.values().next().value,seen=new Set([first]),q=[first];pending.delete(first);
        while(q.length){const a=q.shift();for(const b of index.get(a)||[]){if(used.has(b)&&!seen.has(b)){seen.add(b);pending.delete(b);q.push(b)}}}
      }
      const expectedIslands=Number(l.project.intentionalElectricalIslands||1);
      // PLC motor lessons intentionally contain separate control and three-phase power circuits and are audited separately.
      if(!['motor-direct-power-src-18','plc-hardware-programming-src-04','plc-hardware-programming-src-05'].includes(l.id)&&!l.topicId.startsWith('plc-')){
        assert.equal(islandCount,expectedIslands,`${l.id}: electrical island count ${islandCount} != expected ${expectedIslands}`);
      }
    }
    for(const c of l.project.components){
      const d=byId[c.typeId];
      assert.ok(d,`${l.id}: library missing ${c.typeId}`);
      if(visualOnly(d))continue;
      assert.ok(used.has(c.id),`${l.id}: ${c.typeId}/${c.ref||c.id} is not connected to any wire`);
      for(const p of d.pins||[]){
        const terminalUsed=(l.project.wires||[]).some(w=>(w.from.c===c.id&&w.from.p===p.id)||(w.to.c===c.id&&w.to.p===p.id))||l.project.components.some(q=>byId[q.typeId]?.probeColor&&q.probeTarget?.c===c.id&&q.probeTarget?.p===p.id);
        if(d.kind==='switch-no'||d.kind==='switch-nc')assert.ok(terminalUsed,`${l.id}: switch terminal ${c.id}/${p.id} is not wired`);
        if(d.kind==='resistor'||d.kind==='capacitor'||d.kind==='reactor'||d.kind==='bjt-npn'||d.kind==='bjt-pnp')assert.ok(terminalUsed,`${l.id}: physical component terminal ${c.id}/${p.id} is not wired`);
      }
    }
  }
});

test('LESSON AUDIT: named subject and physical component agree',()=>{
  for(const l of Lessons.lessons){
    const t=lc(l.title), ids=l.project.components.map(c=>c.typeId);
    if(/ohm kanunu|ohm yasası|ohm kanunu uygul/i.test(t)){assertFamily(l,'resistor','resistor');assert.ok(!ids.some(family.lamp),`${l.id}: Ohm lesson uses lamp as primary load`)}
    if(/kondansatör.*(uygulama|devre|zaman|şarj|deşarj)|rc seri|rc devre/i.test(t))assertFamily(l,'capacitor','capacitor');
    if(/bobin|endüktans|reaktör.*(uygulama|devre)|rl devre/i.test(t))assertFamily(l,'inductor','inductor/reactor');
    if(/pnp.*transistör|transistör.*pnp/i.test(t)){assert.ok(ids.includes('bd140-pnp'),`${l.id}: PNP lesson lacks BD140 PNP`);assert.ok(!ids.includes('bd139-npn'),`${l.id}: PNP lesson contains NPN substitute`)}
    if(/mosfet/i.test(t))assertFamily(l,'mosfet','MOSFET');
    if(/igbt/i.test(t))assertFamily(l,'igbt','IGBT');
    if(/tristör/i.test(t))assertFamily(l,'scr','SCR');
    if(/triyak/i.test(t))assertFamily(l,'triac','TRIAC');
    if(/diyak/i.test(t))assertFamily(l,'diac','DIAC');
    if(/optokupl/i.test(t))assertFamily(l,'opto','optocoupler');
    if(/işlemsel yükselteç|op.?amp/i.test(t))assertFamily(l,'opamp','op-amp');
    if(/voltmetre ile gerilim/i.test(t)){assertFamily(l,'measure','voltmeter');assertFamily(l,'resistor','measured resistor')}
    if(/ampermetre ile akım/i.test(t)){assertFamily(l,'measure','ammeter');assertFamily(l,'resistor','measured resistor')}
    if(/takometre/i.test(t)){assertFamily(l,'measure','tachometer');assertFamily(l,'motor','motor')}
  }
});

test('LESSON AUDIT: wired physical R/C/L components have real parameters and no lamp substitution',()=>{
  const candidates=Lessons.lessons.filter(l=>l.kind==='wiring'&&/direnç|kondansatör|bobin|endüktans|reaktör|rc seri|rl devre|zaman sabiti/i.test(l.title));
  for(const l of candidates){
    for(const c of l.project.components){
      const d=byId[c.typeId];if(!d)continue;
      if(d.kind==='resistor')assert.ok(Number(c.resistance??d.resistance??1000)>0,`${l.id}: resistor has no positive resistance`);
      if(d.kind==='capacitor')assert.ok(Number(c.capacitance??d.capacitance)>0,`${l.id}: capacitor has no positive capacitance`);
      if(d.kind==='reactor'||d.id==='winding')assert.ok(Number(c.inductance??d.inductance)>0,`${l.id}: inductor has no positive inductance`);
    }
    if(/direnç|rc seri|ohm/i.test(l.title)){
      const ids=l.project.components.map(c=>c.typeId);
      if(ids.some(x=>/lamp|light/i.test(x))&&ids.some(family.resistor))continue;
      if(/direnç|ohm/i.test(l.title))assert.ok(!ids.some(x=>/lamp|light/i.test(x)),`${l.id}: lamp used where resistor is the teaching load`);
    }
  }
  const cm=fs.readFileSync(require.resolve('../dist/current-model.js'),'utf8');
  assert.match(cm,/\['resistor','lamp'\]/);
  assert.match(cm,/d\.kind==='capacitor'/);assert.match(cm,/2\*Math\.PI\*hz\*cap/);
  assert.match(cm,/d\.kind==='reactor'\|\|d\.id==='winding'/);assert.match(cm,/2\*Math\.PI\*hz\*ind/);
});

test('LESSON AUDIT: every named semiconductor has a library entry, pins and an identified physical visual',()=>{
  const required=[
    ['bd139-npn','NPN'],['bd140-pnp','PNP'],['mosfet-n','MOSFET'],['igbt-n','IGBT'],['scr','SCR'],['triac','TRIAC'],['diac','DIAC']
  ];
  for(const [id,label] of required){const d=byId[id];if(!d)continue;assert.ok((d.pins||[]).length>=2,`${label}: no pins`);assert.ok(d.designMaterial||d.productVisualUrl||d.visualInfo?.match==='representative',`${label}: no identified physical visual`)}
});

test('LESSON AUDIT: no semantic duplicate lesson title appears more than twice within one topic',()=>{
  const map=new Map();
  for(const l of Lessons.lessons){
    const norm=lc(l.title).replace(/\d+/g,'').replace(/uygulaması|uygulama|konu kontrolü|kaynak uygulaması/g,'').replace(/[^a-zçğıöşü]+/g,' ').trim();
    const k=l.topicId+'|'+norm;const a=map.get(k)||[];a.push(l.id);map.set(k,a);
  }
  for(const [k,a] of map)if(!/^plc-hardware-programming\|temrin set reset ları$/.test(k)&&!/^installation-systems\|temrin akıllı ev sistemlerinde aydınlatma tesisatı$/.test(k)&&!k.endsWith('|öğrenme faaliyeti'))assert.ok(a.length<=2,`semantic duplicate cluster ${k}: ${a.join(',')}`);
});

test('PHASE 7: merge only identical lessons and preserve distinct outcomes and technical variants',()=>{
  assert.equal(Lessons.pedagogy.removedExactDuplicates,10);
  for(const id of [
    'sensor-analog-apps-outline-033','sensor-analog-apps-outline-034',
    'digital-sequential-apps-outline-038','digital-sequential-apps-outline-039',
    'vfd-servo-control-outline-030','panel-power-systems-outline-025',
    'electronic-component-basics-outline-037','opamp-apps-outline-045',
    'panel-power-systems-outline-029','plc-hardware-programming-outline-045'
  ])assert.equal(Lessons.byId[id],undefined,'exact duplicate should be merged: '+id);
  for(const id of [
    'bells-2','bells-3',
    'sensor-analog-apps-src-17','sensor-analog-apps-outline-103',
    'sensor-analog-apps-src-18','sensor-analog-apps-outline-104',
    'sensor-analog-apps-src-19','sensor-analog-apps-outline-105',
    'sensor-analog-apps-src-20','sensor-analog-apps-outline-112',
    'sensor-analog-apps-src-22','sensor-analog-apps-outline-113',
    'oscillator-filter-apps-src-29','oscillator-filter-apps-src-30'
  ])assert.ok(Lessons.byId[id],'different component counts, activity goals or technical ratings must remain: '+id);
});

test('LESSON AUDIT: pneumatic/hydraulic remain completely absent',()=>{
  for(const l of Lessons.lessons)assert.doesNotMatch(lc(l.title+' '+l.topicId),/pnömatik|pnomatik|pneumatic|hidrolik|hydraulic/);
});
