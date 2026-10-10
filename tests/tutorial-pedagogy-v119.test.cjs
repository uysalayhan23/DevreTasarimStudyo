'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Simulation=require('../dist/simulation.js');

function finalLessons(){
 const base=require('../dist/tutorial-lessons.js');
 const expanded=require('../dist/tutorial-expanded-lessons.js');
 const outlined=require('../dist/tutorial-source-outline.js');
 const ctx={window:{DTSTutorialLessons:outlined}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),ctx);
 return ctx.window.DTSTutorialLessons;
}
function runtimeLibrary(){
 const ctx={window:{}};
 for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),ctx);
 return ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY);
}
const Lessons=finalLessons(),library=runtimeLibrary(),byId=Object.fromEntries(library.map(d=>[d.id,d]));

test('all final tutorial lessons pass the beginner pedagogy review',()=>{
 assert.ok(Lessons.lessons.length>=1500,Lessons.lessons.length);
 assert.equal(Lessons.pedagogy.reviewedLessons,Lessons.lessons.length);
 for(const l of Lessons.lessons){
  assert.equal(l.pedagogyReview?.reviewed,true,l.id);
  assert.equal(l.pedagogyReview?.noSubstitute,true,l.id);
  assert.ok(l.learningGoal?.length>20,l.id+' learning goal');
  assert.ok(Array.isArray(l.beginnerSteps)&&l.beginnerSteps.length>=4,l.id+' beginner steps');
  assert.ok(Array.isArray(l.materials),l.id+' materials');
  assert.equal(l.materials.length,l.project.components.length,l.id+' material explanations');
  for(const m of l.materials){assert.ok(m.label,l.id+' material label');assert.ok(m.why?.length>15,l.id+' '+m.typeId+' material why')}
 }
});


test('guided demo lessons keep rebuild steps after the final pedagogy pass without converting conceptual boards',()=>{
 for(const l of Lessons.lessons){
  const wires=l.project?.wires||[],guided=l.kind==='wiring'||l.project?.tutorialLesson?.phase==='demo';
  if(!guided)continue;
  assert.ok(wires.length>0,l.id+' guided lesson needs wires');
  assert.equal(l.kind,'wiring',l.id+' guided lesson kind');
  assert.equal(l.steps.length,wires.length,l.id+' guided step/wire mismatch');
  for(let i=0;i<wires.length;i++){
   assert.deepEqual(JSON.parse(JSON.stringify(l.steps[i].from)),JSON.parse(JSON.stringify(wires[i].from)),l.id+' step '+i+' from');
   assert.deepEqual(JSON.parse(JSON.stringify(l.steps[i].to)),JSON.parse(JSON.stringify(wires[i].to)),l.id+' step '+i+' to');
   assert.ok(l.steps[i].hint,l.id+' step '+i+' hint');
   assert.ok(l.steps[i].why,l.id+' step '+i+' why');
  }
 }
 const first=Lessons.byId['button-led-1'];assert.ok(first);assert.equal(first.project.tutorialLesson.phase,'demo');assert.equal(first.project.wires.length,4);assert.equal(first.steps.length,4);assert.equal(first.kind,'wiring');
 const conceptual=Lessons.byId['dc-circuits-src-01'];if(conceptual&&conceptual.project.wires.length&&conceptual.project.tutorialLesson?.phase!=='demo')assert.notEqual(conceptual.kind,'wiring');
});

test('dual DC lessons preserve intended isolation or shared-reference topology exactly',()=>{
 const islandCount=l=>{const ids=new Set(l.project.components.map(c=>c.id)),adj=new Map([...ids].map(id=>[id,[]]));for(const w of l.project.wires){adj.get(w.from.c).push(w.to.c);adj.get(w.to.c).push(w.from.c)}const pending=new Set(ids);let islands=0;while(pending.size){islands++;const first=pending.values().next().value,q=[first];pending.delete(first);while(q.length){const a=q.shift();for(const b of adj.get(a)||[])if(pending.delete(b))q.push(b)}}return islands};
 const isolated=Lessons.byId['dual-dc-1'],relay=Lessons.byId['dual-dc-3'],shared=Lessons.byId['dual-dc-2'],sensor=Lessons.byId['dual-dc-4'];
 for(const l of [isolated,relay]){assert.ok(l);assert.equal(l.kind,'wiring');assert.equal(l.project.intentionalElectricalIslands,2);assert.equal(l.steps.length,l.project.wires.length);assert.equal(islandCount(l),2)}
 for(const l of [shared,sensor]){assert.ok(l);assert.equal(l.kind,'wiring');assert.ok(!l.project.intentionalElectricalIslands);assert.equal(islandCount(l),1)}
 assert.match(isolated.title,/izole DC devre/i);assert.match(relay.title,/röle.*izolasyon/i);
});

test('Arduino button-to-LED transfer lesson teaches its real 5 V circuit and current limit',()=>{
 const l=Lessons.lessons.find(x=>x.id==='button-led-5');assert.ok(l);
 assert.equal(l.project.components.find(c=>c.id==='ps').dcVoltage,5);
 assert.equal(l.project.components.find(c=>c.id==='r').resistance,220);
 assert.ok(l.project.wires.some(w=>w.from.c==='uno'&&w.from.p==='D13'&&w.to.c==='r'));
 assert.ok(l.project.wires.some(w=>w.from.c==='btn'&&w.from.p==='SIG'&&w.to.c==='uno'&&w.to.p==='D2'));
 assert.match(l.explanation,/D2.*D13.*220 Ω/i);assert.doesNotMatch(l.explanation,/24 V|2\.7 kΩ/i);
 assert.match(l.learningGoal,/D2.*D13.*220 Ω/i);assert.match(l.beginnerSteps.join(' '),/5 V.*D2.*220 Ω/i);
 assert.ok(l.materials.some(x=>/220 Ω/.test(x.label)));
});

test('all post-pedagogy lesson devices and wiring endpoints exist in the actual runtime library',()=>{
 for(const l of Lessons.lessons){
  for(const c of l.project.components)assert.ok(byId[c.typeId],l.id+' missing component '+c.typeId);
  for(const w of l.project.wires||[])for(const end of ['from','to']){
   const ep=w[end],c=l.project.components.find(x=>x.id===ep.c);
   assert.ok(c,l.id+' '+w.id+' '+end+' component '+ep.c);
   const d=byId[c.typeId];assert.ok(d.pins.some(p=>p.id===ep.p),l.id+' '+c.typeId+' has no terminal '+ep.p);
  }
 }
});

test('source lesson explanations and learning goals name their actual materials and avoid generic templates',()=>{
 for(const l of Lessons.lessons.filter(x=>/-src-|-outline-/.test(x.id))){
  const labels=l.project.components.map(c=>String(c.label||c.ref||'').trim()).filter(x=>x.length>3);
  assert.doesNotMatch(l.explanation,/Bu derste yalnız|Bu derste .* için gerekli elemanlar kullanılır|konuya özgü gerçek R\/L\/C\/BJT davranışıyla/i,l.id+' generic explanation');
  if(labels.length){
   assert.ok(labels.some(x=>l.summary.toLocaleLowerCase('tr-TR').includes(x.toLocaleLowerCase('tr-TR'))),l.id+' summary is detached from materials');
   assert.ok(labels.some(x=>l.explanation.toLocaleLowerCase('tr-TR').includes(x.toLocaleLowerCase('tr-TR'))),l.id+' explanation is detached from materials');
   assert.ok(labels.some(x=>l.learningGoal.toLocaleLowerCase('tr-TR').includes(x.toLocaleLowerCase('tr-TR'))),l.id+' learning goal is detached from materials');
  }
  if(l.project.components.some(c=>/^plc-|^plc-hw/.test(c.typeId)))assert.match(l.explanation,/PLC programı.*simüle edilmez|PLC program yürütmesi.*kapsamında değildir|PLC programı çalıştırılmaz|PLC programı burada çalıştırılmaz/i,l.id+' PLC simulation claim');
 }
});

test('Ohm Law lessons use a resistor experiment, never lamp or pushbutton placeholders',()=>{
 const lessons=Lessons.lessons.filter(l=>/ohm kanunu/i.test(l.title));assert.ok(lessons.length>=1,lessons.length);
 for(const l of lessons){
  const ids=l.project.components.map(c=>c.typeId);
  for(const id of ['arduino-bench-supply','resistor','unit-ut33d-plus'])assert.ok(ids.includes(id),l.id+' '+id);
  assert.ok(l.project.components.filter(c=>c.typeId==='unit-ut33d-plus').length>=2,l.id+' current and voltage instruments');
  assert.ok(!ids.some(id=>/lamp|light|push|button/.test(id)),l.id+' unrelated load/control '+ids.join(','));
  assert.equal(l.kind,'wiring',l.id);assert.equal(l.steps.length,l.project.wires.length,l.id);
  assert.match(l.summary,/direnç/i);assert.match(l.learningGoal,/ampermetre.*seri|seri.*ampermetre/i);
 }
});

test('remaining Kirchhoff lessons produce the stated current and voltage measurements after DC topic trim',()=>{
 const solvedKirchhoff=Lessons.lessons.filter(l=>/kirchhoff|kirchoff|kirşof/i.test(l.title));assert.ok(solvedKirchhoff.length>=1);
 for(const l of solvedKirchhoff){
  const result=Simulation.solve(l.project,byId,{now:0});assert.equal(result.stable,true,l.id);assert.equal(result.blocked,false,l.id);assert.equal(result.shortCircuit,false,l.id);
 }
 for(const l of solvedKirchhoff){
  const c=Object.fromEntries(l.project.components.map(x=>[x.id,x]));
  for(const id of ['at','a2','a3','v0','v1','v2']){assert.equal(c[id].typeId,'unit-ut33d-plus',l.id+' UNI-T '+id);assert.equal(c[id]._meter.warning,'',l.id+' '+id+' range/jack warning');}
  assert.equal(c.at.meterPosition,10,l.id+' total current 200 mA range');assert.equal(c.a2.meterPosition,10,l.id+' branch current range');assert.equal(c.a3.meterPosition,10,l.id+' branch current range');assert.equal(c.v0.meterPosition,2,l.id+' 2 V DC burden-voltage range');assert.equal(c.v1.meterPosition,3,l.id+' 20 V DC range');assert.equal(c.v2.meterPosition,3,l.id+' 20 V DC range');
  assert.ok(Math.abs(c.at._meter.value-(c.a2._meter.value+c.a3._meter.value))<0.001,l.id+' KCL');
  assert.ok(Math.abs(c.v0._meter.value+c.v1._meter.value+c.v2._meter.value-24)<0.02,l.id+' KVL including ammeter burden');
 }
});

test('measurement lessons use UNI-T instruments, physical probes, and a simulated UT200A clamp',()=>{
 const find=re=>Lessons.lessons.filter(l=>re.test(l.title));
 for(const l of find(/voltmetre ile gerilim ölçümü/i)){const ids=l.project.components.map(c=>c.typeId);assert.ok(ids.includes('unit-ut33d-plus'),l.id);assert.ok(ids.includes('resistor'));assert.ok(ids.includes('arduino-bench-supply'));assert.ok(ids.includes('test-probe-red')&&ids.includes('test-probe-black'),l.id+' physical probes');assert.match(l.explanation,/voltmetre.*paralel|gerilim.*paralel/i,l.id)}
 for(const l of find(/ampermetre ile akım ölçümü/i).filter(l=>!/pens/i.test(l.title))){const ids=l.project.components.map(c=>c.typeId);assert.ok(ids.includes('unit-ut33d-plus'),l.id);assert.ok(ids.includes('resistor'));assert.ok(ids.includes('arduino-bench-supply'));assert.ok(ids.includes('test-probe-red')&&ids.includes('test-probe-black'),l.id+' physical probes')}
 for(const l of find(/pens ampermetre/i)){const ids=l.project.components.map(c=>c.typeId),cl=l.project.components.find(c=>c.typeId==='unit-ut200a');assert.ok(cl,l.id);assert.ok(ids.includes('resistor'),l.id);assert.ok(!ids.includes('meter-ammeter'),l.id+' clamp meter must not be a series ammeter');assert.equal(l.kind,'wiring',l.id);assert.ok(l.project.wires.some(w=>w.id===cl.clampedWireId),l.id+' clamped conductor');assert.equal(cl.meterPosition,1,l.id+' 2 A AC range');assert.match(l.explanation,/yaklaşık 1 A RMS|1 A RMS/i,l.id);assert.doesNotMatch(l.explanation,/sayısal okuması simüle edilmez/i,l.id)}
 for(const l of find(/wattmetre.*kosinüsfimetre/i)){const ids=l.project.components.map(c=>c.typeId);assert.ok(ids.includes('tutorial-wattmeter'),l.id);assert.ok(ids.includes('tutorial-cosphimeter'),l.id);assert.ok(ids.includes('motor-1p'),l.id);assert.match(l.explanation,/güç katsayısı/i,l.id);assert.match(l.explanation,/simüle edilmez/i,l.id)}
 for(const l of find(/multimetre.*direnç|direnç.*multimetre/i)){const ids=l.project.components.map(c=>c.typeId);assert.ok(ids.includes('unit-ut33d-plus'),l.id);assert.ok(ids.includes('resistor'),l.id)}
 for(const l of find(/takometre/i)){const ids=l.project.components.map(c=>c.typeId);assert.ok(ids.some(x=>/tachometer/.test(x)),l.id);assert.ok(ids.some(x=>/motor/.test(x)),l.id);assert.ok(!l.project.wires.some(w=>w.from.c==='t1'||w.to.c==='t1'),l.id+' non-contact instrument must not be wired')}
 for(const l of find(/lcr metre/i))assert.ok(l.project.components.some(c=>c.typeId==='tutorial-lcr-meter'),l.id);
});

test('Phase 10 keeps only the first ten DC analysis lessons and removes generic A/V placeholders',()=>{
 const dc=Lessons.lessons.filter(l=>l.topicId==='dc-circuits');assert.equal(dc.length,10);
 for(const l of Lessons.lessons){
  const ids=l.project.components.map(c=>c.typeId);
  assert.ok(!ids.some(id=>['meter-ammeter','meter-a','meter-voltmeter','meter-v'].includes(id)),l.id+' generic meter '+ids.join(','));
 }
});

test('every wired UT33D+ lesson meter has red and black probe bodies and lead wiring',()=>{
 for(const l of Lessons.lessons.filter(x=>x.kind==='wiring')){
  for(const m of l.project.components.filter(c=>c.typeId==='unit-ut33d-plus')){
   const red=l.project.components.find(c=>c.id===m.id+'-red'),black=l.project.components.find(c=>c.id===m.id+'-black');
   assert.ok(red&&red.typeId==='test-probe-red',l.id+' '+m.id+' red probe');
   assert.ok(black&&black.typeId==='test-probe-black',l.id+' '+m.id+' black probe');
   const redJack=m.meterPosition===9?'10A':'V';
   assert.ok(l.project.wires.some(w=>((w.from.c===m.id&&w.from.p===redJack&&w.to.c===red.id&&w.to.p==='PLUG')||(w.to.c===m.id&&w.to.p===redJack&&w.from.c===red.id&&w.from.p==='PLUG'))),l.id+' '+m.id+' red lead');
   assert.ok(l.project.wires.some(w=>((w.from.c===m.id&&w.from.p==='COM'&&w.to.c===black.id&&w.to.p==='PLUG')||(w.to.c===m.id&&w.to.p==='COM'&&w.from.c===black.id&&w.from.p==='PLUG'))),l.id+' '+m.id+' black lead');
  }
 }
});

test('source-outline titles cannot silently fall back to unrelated component families',()=>{
 const family={
  button:id=>/push-|button|wall-switch|selector|operator|mushroom/.test(id),
  contactor:id=>/contactor|main-contact|coil-contactor|packet-star-delta/.test(id),
  motor:id=>/(^|-)motor|hcfa-sv-x2mh/.test(id),
  plc:id=>/^plc-|plc-hw/.test(id),
  servo:id=>/hcfa-sv-x2e|servo/.test(id),
  resistor:id=>/resistor/.test(id),
  capacitor:id=>/capacitor/.test(id),
  diode:id=>/diode|tutorial-diode/.test(id),
  measure:id=>/meter|ut33d|ut200a|tachometer|cosphimeter|wattmeter|frequency|lcr/.test(id)
 };
 const rules=[
  [/buton/i,'button'],[/kontaktör/i,'contactor'],
  [/(^|[^a-zçğıöşü])motor([^a-zçğıöşü]|$)|asenkron motor|senkron motor/i,'motor'],
  [/\bplc\b/i,'plc'],[/servo/i,'servo'],
  [/\bdirenç\b/i,'resistor'],[/kondansatör/i,'capacitor'],[/\bdiyot\b/i,'diode'],
  [/(ampermetre|voltmetre|wattmetre|frekansmetre|multimetre|takometre|lcr)/i,'measure']
 ];
 const skip=(title,f)=>{const t=title.toLocaleLowerCase('tr-TR');return f==='motor'&&/senkron sayıcı|asenkron sayıcı/.test(t)||f==='resistor'&&/topraklama direnci|yalıtkanlık direnci|sargı direnç/.test(t)};
 for(const l of Lessons.lessons.filter(x=>x.sourceOutline)){
  const ids=l.project.components.map(c=>c.typeId);
  for(const [re,f] of rules)if(re.test(l.title)&&!skip(l.title,f))assert.ok(ids.some(family[f]),l.id+' title requires '+f+': '+l.title+' :: '+ids.join(','));
 }
});

test('electronics and automation source titles are bound to their named devices',()=>{
 const rules=[
  [/mosfet/i,id=>/tutorial-mosfet/.test(id),'MOSFET'],
  [/[iı]gbt/i,id=>/tutorial-igbt/.test(id),'IGBT'],
  [/tristör/i,id=>/tutorial-scr/.test(id),'SCR'],
  [/triyak/i,id=>/tutorial-triac/.test(id),'TRIAC'],
  [/diyak/i,id=>/tutorial-diac/.test(id),'DIAC'],
  [/optokupl/i,id=>/tlp521|opto/.test(id),'optocoupler'],
  [/\b555\b|ne555/i,id=>/ne555/.test(id),'NE555'],
  [/işlemsel|op.?amp/i,id=>/tutorial-opamp|lm358/.test(id),'opamp'],
  [/flip.?flop/i,id=>/tutorial-ff-/.test(id),'flipflop'],
  [/lm35/i,id=>/lm35/.test(id),'LM35'],
  [/pt100/i,id=>/pt100/.test(id),'PT100'],
  [/termokupl/i,id=>/thermocouple/.test(id),'thermocouple'],
  [/dahlander/i,id=>/dahlender/.test(id),'Dahlander'],
  [/soft starter/i,id=>/softstarter/.test(id),'softstarter'],
  [/oto ?trafo|ototrafo/i,id=>/autotransformer/.test(id),'autotransformer'],
  [/frekans (invert|konvert)|\bvfd\b|invertör/i,id=>/vfd|sinamics-v20/.test(id),'VFD']
 ];
 for(const l of Lessons.lessons.filter(x=>/-src-|-outline-/.test(x.id))){
  const ids=l.project.components.map(c=>c.typeId);
  for(const [re,ok,name] of rules)if(re.test(l.title))assert.ok(ids.some(ok),l.id+' '+name+' :: '+ids.join(','));
 }
});


test('every wiring lesson is actually fully wired and its tutorial steps match the circuit',()=>{
 for(const l of Lessons.lessons.filter(x=>x.kind==='wiring')){
  assert.ok(l.project.wires.length>0,l.id+' has no wires');
  assert.equal(l.steps.length,l.project.wires.length,l.id+' step/wire mismatch');
  const used=new Set(l.project.wires.flatMap(w=>[w.from.c,w.to.c]));
  for(const c of l.project.components){
   const d=byId[c.typeId];
   if(d?.visualOnly||d?.diagramOnly||d?.kind==='tutorial-meter'||d?.kind==='multimeter'||d?.kind==='clamp-meter'||l.project.nonElectricalMeasurement?.some(x=>x.instrument===c.id))continue;
   assert.ok(used.has(c.id),l.id+' disconnected '+c.typeId);
  }
 }
});

test('real resistor capacitor and inductor physics are present in the numeric engine',()=>{
 const m=fs.readFileSync(require.resolve('../dist/current-model.js'),'utf8');
 assert.match(m,/\['resistor','lamp'\]/);
 assert.match(m,/capacitor-dc/);assert.match(m,/i=C·dv\/dt/);
 assert.match(m,/inductor-dc/);assert.match(m,/v=L·di\/dt/);
 assert.match(m,/Xc=1\/\(2πfC\)/);assert.match(m,/Xl=2πfL/);
});

test('R C L and BJT lessons use the named physical component instead of lamp placeholders',()=>{
 for(const l of Lessons.lessons.filter(x=>/direnç|kondansatör|bobin|endüktans|reaktör|transistör/i.test(x.title))){
  const ids=l.project.components.map(c=>c.typeId);
  if(/direnç/i.test(l.title)&&/uygulama|devre|ölçüm|ölçme|ohm/i.test(l.title)){assert.ok(ids.includes('resistor'),l.id);assert.ok(!ids.some(id=>/^lamp-|standard-light/.test(id)),l.id)}
  if(/kondansatör/i.test(l.title)&&/uygulama|devre|zaman sabiti/i.test(l.title))assert.ok(ids.some(id=>byId[id]?.kind==='capacitor'),l.id);
  if(/bobin|endüktans|reaktör/i.test(l.title)&&/uygulama|devre|alternatif akım/i.test(l.title))assert.ok(ids.some(id=>byId[id]?.kind==='reactor'||id==='winding'),l.id);
 }
 const pnp=Lessons.lessons.filter(x=>/pnp.*transistör|transistör.*pnp/i.test(x.title));
 for(const l of pnp){const ids=l.project.components.map(c=>c.typeId);assert.ok(ids.includes('bd140-pnp'),l.id);assert.ok(!ids.includes('bd139-npn'),l.id)}
 const pnpDef=byId['bd140-pnp'];assert.equal(pnpDef.kind,'bjt-pnp');assert.ok(pnpDef.productVisualUrl);for(const pin of ['B','C','E'])assert.ok(pnpDef.pins.some(p=>p.id===pin));
 const norms=fs.readFileSync(require.resolve('../dist/norms.js'),'utf8');assert.match(norms,/bjt-pnp/);
});

test('pneumatic and hydraulic content stays absent from tutorial output',()=>{
 for(const l of Lessons.lessons)assert.doesNotMatch((l.title+' '+l.topicId).toLocaleLowerCase('tr-TR'),/pnömatik|pnomatik|pneumatic|hidrolik|hydraulic/);
});

test('tutorial runtime loads outline first, then the final pedagogy pass, and renders beginner guidance',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8'),app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8'),bootstrap=fs.readFileSync(require.resolve('../dist/tutorial-bootstrap.js'),'utf8');
 const outline=mode.indexOf('tutorial-source-outline.js'),ped=mode.indexOf('tutorial-pedagogy.js');
 assert.ok(outline>=0&&ped>outline,'pedagogy must run after source outline');
 assert.match(mode,/Ders sonunda ne bileceksin/);assert.match(mode,/Bu derste kullandığımız elemanlar/);assert.match(mode,/Sıfırdan öğrenme sırası/);
 assert.match(css,/tutorial-learning-goal/);assert.match(css,/tutorial-materials/);assert.match(css,/tutorial-beginner-steps/);
 assert.match(app,/!d\.tutorialOnly/);assert.match(html,/tutorial-components\.js/);assert.match(bootstrap,/tutorial-lessons\.js\?v=1\.19\.1-dashboard3/);
});
