'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Lessons=require('../dist/tutorial-source-outline.js'),Design=require('../dist/design-library.js'),Arduino=require('../dist/arduino-library.js'),Simulation=require('../dist/simulation.js'),Symbols=require('../dist/symbols.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const base=Design.extend(JSON.parse(JSON.stringify(ctx.window.COMPONENT_LIBRARY))),library=[...base,...Arduino.components.filter(a=>!base.some(b=>b.id===a.id))],byId=Object.fromEntries(library.map(d=>[d.id,d]));

test('Öğretici Modu expanded curriculum keeps every topic populated',()=>{
 assert.ok(Lessons.topics.length>=40,Lessons.topics.length);assert.ok(Lessons.lessons.length>=1000,Lessons.lessons.length);
 for(const t of Lessons.topics)assert.ok(Lessons.lessons.some(x=>x.topicId===t.topicId),t.topicId);
});

test('button and LED course puts the 24 VDC NC shutoff lesson second and keeps existing lessons',()=>{
 const finalized={window:{DTSTutorialLessons:JSON.parse(JSON.stringify(Lessons))}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),finalized);
 const ls=finalized.window.DTSTutorialLessons.lessons.filter(l=>l.topicId==='button-led');assert.equal(ls.length,5);
 assert.match(ls[0].title,/24 VDC NO buton.*LED yakma/i);assert.match(ls[1].title,/24 VDC NC buton.*LED.*söndürme/i);
 const normallyOpen=ls[0],normallyClosed=ls[1];
 assert.doesNotMatch(byId.resistor.visualInfo.model,/1\s*kΩ/i,'generic resistor artwork must not claim every resistor is 1 kΩ');
 for(const l of [normallyOpen,normallyClosed]){
  const parts=Object.fromEntries(l.project.components.map(c=>[c.id,c]));assert.equal(parts.g1.typeId,'arduino-bench-supply');assert.equal(parts.g1.dcVoltage,24);assert.equal(parts.r.typeId,'resistor');assert.equal(parts.r.resistance,2700);assert.equal(parts.l.typeId,'led');
  assert.equal(l.project.wires.length,4);assert.equal(l.steps.length,4);
  assert.ok(l.project.wires.some(w=>w.from.c==='r'&&w.from.p==='2'&&w.to.c==='l'&&w.to.p==='A'));
  assert.ok(l.project.wires.some(w=>w.from.c==='l'&&w.from.p==='K'&&w.to.c==='g1'&&w.to.p==='M'));
 }
 assert.equal(normallyOpen.project.components.find(c=>c.id==='b').typeId,'push-no');
 assert.ok(normallyOpen.project.wires.some(w=>w.from.c==='g1'&&w.to.c==='b'&&w.to.p==='13'));
 assert.equal(normallyClosed.project.components.find(c=>c.id==='b').typeId,'push-nc');
 assert.ok(normallyClosed.project.wires.some(w=>w.from.c==='g1'&&w.to.c==='b'&&w.to.p==='21'));
 assert.ok(normallyClosed.project.wires.some(w=>w.from.c==='b'&&w.from.p==='22'&&w.to.c==='r'));
 assert.match(normallyClosed.explanation,/butona basılınca.*açılır.*LED söner/i);
 assert.match(ls[2].title,/230 VAC/);assert.match(ls[3].title,/ikaz lambası/i);assert.match(ls[4].title,/Arduino/);
 const arduino=ls[4],arduinoParts=Object.fromEntries(arduino.project.components.map(c=>[c.id,c]));
 assert.equal(arduino.project.components.length,5);assert.equal(arduino.project.wires.length,8);assert.equal(arduino.steps.length,8);
 assert.equal(arduinoParts.ps.dcVoltage,5);assert.equal(arduinoParts.r.resistance,220);assert.equal(arduinoParts.r.typeId,'resistor');
 assert.ok(arduino.project.wires.some(w=>w.from.c==='uno'&&w.from.p==='D13'&&w.to.c==='r'&&w.to.p==='1'));
 assert.ok(arduino.project.wires.some(w=>w.from.c==='ps'&&w.from.p==='P'&&w.to.c==='btn'&&w.to.p==='VCC'&&w.role==='DC+'));
 assert.ok(!arduino.project.wires.some(w=>w.from.c==='ps'&&w.to.c==='btn'&&w.role==='+24V'));
 assert.ok(arduino.project.wires.some(w=>w.from.c==='r'&&w.from.p==='2'&&w.to.c==='led'&&w.to.p==='A'));
 assert.match(arduino.summary,/5 V.*D2.*D13.*220 Ω/i);assert.match(arduino.explanation,/D2.*D13.*220 Ω/i);assert.doesNotMatch(arduino.explanation,/24 V|2\.7 kΩ/i);
 assert.ok(arduino.concepts.some(x=>/D2/.test(x)));assert.ok(arduino.concepts.some(x=>/D13/.test(x)));assert.ok(arduino.concepts.some(x=>/5 V/.test(x)));
 assert.equal(ls[0].safety,'');assert.equal(ls[1].safety,'');assert.match(ls[2].safety,/230 VAC/);assert.equal(ls[3].safety,'');assert.equal(ls[4].safety,'');
});

test('button and LED lessons show terminal-aligned resistor leads and carry simulated current through the LED',()=>{
 const resistor=JSON.parse(JSON.stringify(byId.resistor));Symbols.prepareLibrary([resistor]);
 const art=Symbols.markup(resistor,{id:'r1',resistance:2700},{mode:'material'});
 assert.equal(resistor.pins[0].x,resistor.pins[1].x);assert.equal(resistor.pins[0].x,resistor.w/2);assert.equal(resistor.pins[0].y,0);assert.equal(resistor.pins[1].y,resistor.h);
 assert.match(art,/M30 0V20M30 80V100/);assert.match(art,/2\.7 kΩ/);assert.doesNotMatch(art,/1 kΩ/);
 const lesson=id=>JSON.parse(JSON.stringify(Lessons.lessons.find(x=>x.id===id).project));
 const no=lesson('button-led-1'),noButton=no.components.find(c=>c.id==='b'),noResistor=no.components.find(c=>c.id==='r'),noLed=no.components.find(c=>c.id==='l');
 Simulation.solve(no,byId);assert.equal(noLed._active,false);noButton.state=true;Simulation.solve(no,byId);assert.equal(noLed._active,true);assert.ok(noLed._currentValue>.001);assert.equal(noResistor._active,true);assert.equal(no.wires[2]._active,true);noButton.state=false;Simulation.solve(no,byId);assert.equal(noLed._active,false);assert.equal(no.wires[2]._active,false);
 const nc=lesson('button-led-2'),ncButton=nc.components.find(c=>c.id==='b'),ncLed=nc.components.find(c=>c.id==='l');
 Simulation.solve(nc,byId);assert.equal(ncLed._active,true);assert.ok(ncLed._currentValue>.001);ncButton.state=true;Simulation.solve(nc,byId);assert.equal(ncLed._active,false);assert.equal(ncLed._currentValue,0);
});

test('all tutorial circuits use existing library devices and real terminal ids',()=>{
 for(const l of Lessons.lessons){
  const ids=new Set(l.project.components.map(c=>c.id));assert.equal(ids.size,l.project.components.length,l.id+' component ids');
  assert.ok(l.project.components.length>=3,l.id);assert.equal(l.project.wires.length,l.steps.length,l.id+' steps');
  for(const c of l.project.components)assert.ok(byId[c.typeId],l.id+' missing '+c.typeId);
  for(const [i,s] of l.steps.entries()){
   for(const ep of [s.from,s.to]){
    assert.ok(ep.c&&ep.p,l.id+' step '+i+' terminal-to-terminal only');
    const c=l.project.components.find(x=>x.id===ep.c);assert.ok(c,l.id+' '+ep.c);
    assert.ok(byId[c.typeId].pins.some(p=>p.id===ep.p),l.id+' '+c.typeId+' / '+ep.p);
   }
   assert.ok(s.hint&&s.why,l.id+' step '+i+' teaching text');
  }
  assert.ok(['demo','quiz'].includes(l.project.tutorialLesson.phase),l.id+' tutorial phase');assert.ok(l.summary);assert.ok(l.explanation);assert.ok(l.concepts.length);
 }
});

test('tutorial wiring engine is connected without replacing standard editor behavior',()=>{
 const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8');
 for(const token of ['wireGuardEdit','DTSTutorialMode?.beforeWire','DTSTutorialMode?.afterWire','DTSTutorialMode?.sync'])assert.ok(app.includes(token),token);
 for(const token of ['Devreyi yeniden kur','beforeWire','afterWire','tutorial-next-port','dts-tutorial-progress-v119','ensureGuidedLesson','stepsFromWires'])assert.ok(mode.includes(token)||css.includes(token),token);
 assert.ok(html.includes('id="tutorialDashboard"'));assert.ok(html.includes('id="tutorialCoach"'));assert.ok(html.includes('tutorial-bootstrap.js'));assert.ok(!html.includes('<script src="tutorial-lessons.js'));assert.ok(!html.includes('<script src="tutorial-mode.js'));
});

test('loading a lesson clears the previous project simulation status',()=>{
 const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
 assert.match(app,/running=false;setStatus\('Hazır'\);cancelPressedControls\(\)/);
});

test('guided learning progressively fades hints but always keeps immediate feedback and terminal highlighting',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8');
 assert.match(mode,/l\.variant<=2/);assert.match(mode,/lastFeedback='✓ Doğru bağlantı/);assert.match(mode,/yanıp sönen/);
 assert.match(css,/tutorial-port-pulse/);assert.match(css,/tutorial-energy-flow/);assert.match(css,/body\.tutorial-active \.wire\.energized/);assert.match(css,/prefers-reduced-motion/);
});


test('latched tutorial circuits always include a Stop button and can be cycled repeatedly',()=>{
 const latched=Lessons.lessons.filter(l=>{
  const hold=l.project.components.find(c=>c.id==='hold'&&c.typeId==='contact-no'),start=l.project.components.find(c=>c.id==='start'&&c.typeId==='push-no'),coil=l.project.components.find(c=>c.id==='coil'&&['coil-relay','coil-contactor','coil-relay-dc'].includes(c.typeId));
  return !!(hold&&start&&coil&&l.project.wires.some(w=>((w.from.c===hold.id&&w.from.p==='14')||(w.to.c===hold.id&&w.to.p==='14'))&&((w.from.c===coil.id&&w.from.p==='A1')||(w.to.c===coil.id&&w.to.p==='A1'))));
 });
 assert.ok(latched.length>=4,'expected latching lessons');
 for(const l of latched){
  const stop=l.project.components.find(c=>c.typeId==='push-nc');assert.ok(stop,l.id+' must include Stop');
  const start=l.project.components.find(c=>c.typeId==='push-no'),coil=l.project.components.find(c=>['coil-relay','coil-contactor','coil-relay-dc'].includes(c.typeId));
  assert.ok(start&&coil,l.id+' needs Start and coil');
  assert.ok(l.project.wires.some(w=>w.from.c===stop.id||w.to.c===stop.id),l.id+' Stop must be wired');
 }
 const seals=Lessons.lessons.filter(l=>l.topicId==='seal-in');assert.equal(seals.length,4);
 for(const l of seals)assert.match(l.explanation,/STOP.*tekrar tekrar|tekrar tekrar.*STOP/i);
});

test('tutorial lessons live behind a dedicated dashboard button and properties stay usable',()=>{
 const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8');
 assert.match(html,/data-open-tutorial/);assert.match(html,/id="tutorialDashboard"[^>]*hidden/);assert.match(html,/data-tutorial-back/);
 assert.match(mode,/function openHub/);assert.match(mode,/function closeHub/);assert.match(mode,/data-open-tutorial/);assert.match(mode,/setTimeout\(\(\)=>openHub\(\),40\)/);
 assert.match(css,/tutorial-page-open/);assert.match(css,/resize:both/);assert.match(css,/tutorial-float-bar/);
 assert.match(css,/body\.tutorial-active #propertiesPanel\{pointer-events:auto!important;opacity:1!important\}/);
 assert.match(app,/tutorialPropertyPass/);assert.match(app,/armTutorialPropertyEdit/);
});

test('completed tutorial circuits explicitly allow repeated simulated operation',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8');
 assert.match(mode,/istediğiniz kadar tekrar kullanabilirsiniz/);
 assert.match(mode,/STOP butonu devreyi bırakır/);
});


test('motor forward/reverse lessons include Stop, two latches, cross electrical interlocks and a real phase reversal',()=>{
 const ls=Lessons.lessons.filter(l=>l.topicId==='motor-forward-reverse');assert.equal(ls.length,4);
 for(const l of ls){
  const c=l.project.components,w=l.project.wires;
  for(const id of ['stop','startF','startR','holdF','holdR','lockF','lockR','coilF','coilR','mainF','mainR','motor'])assert.ok(c.some(x=>x.id===id),l.id+' '+id);
  assert.equal(c.find(x=>x.id==='stop').typeId,'push-nc');
  assert.equal(c.find(x=>x.id==='lockF').typeId,'contact-nc');assert.equal(c.find(x=>x.id==='lockF').ref,'K1');
  assert.equal(c.find(x=>x.id==='lockR').typeId,'contact-nc');assert.equal(c.find(x=>x.id==='lockR').ref,'K2');
  assert.ok(w.some(x=>x.from.c==='holdF'&&x.to.c==='coilF'));assert.ok(w.some(x=>x.from.c==='holdR'&&x.to.c==='coilR'));
  const reverse=w.filter(x=>x.from.c==='mainR'&&x.to.c==='motor').map(x=>[x.from.p,x.to.p]);
  assert.equal(reverse.length,3,l.id+' reverse power legs');
  assert.ok(reverse.some(([from,to])=>({2:'U',4:'V',6:'W'}[from]!==to)),l.id+' must transpose phases');
 }
});

test('star/delta lessons include manual packet practice and automatic K1-K2-K3 timer interlocking',()=>{
 const ls=Lessons.lessons.filter(l=>l.topicId==='motor-star-delta');assert.equal(ls.length,4);
 const manual=ls.find(l=>l.variant===1);assert.ok(manual.project.components.some(c=>c.typeId==='packet-star-delta'));assert.ok(manual.project.components.some(c=>c.typeId==='motor-y-d'));
 for(const l of ls.filter(x=>x.variant>1)){
  const c=l.project.components,w=l.project.wires;
  for(const id of ['stop','start','hold','coilMain','timer','timerNC','timerNO','lockDelta','lockStar','coilStar','coilDelta','main','star','delta','motor'])assert.ok(c.some(x=>x.id===id),l.id+' '+id);
  assert.equal(c.find(x=>x.id==='stop').typeId,'push-nc');assert.equal(c.find(x=>x.id==='timer').typeId,'coil-delay-on');
  assert.equal(c.find(x=>x.id==='lockDelta').ref,'K3');assert.equal(c.find(x=>x.id==='lockStar').ref,'K2');
  assert.ok(w.some(x=>x.from.c==='star'&&x.from.p==='2'&&x.to.c==='star'&&x.to.p==='4'),l.id+' star bridge 2-4');
  assert.ok(w.some(x=>x.from.c==='star'&&x.from.p==='4'&&x.to.c==='star'&&x.to.p==='6'),l.id+' star bridge 4-6');
  for(const [from,to] of [['2','W2'],['4','U2'],['6','V2']])assert.ok(w.some(x=>x.from.c==='delta'&&x.from.p===from&&x.to.c==='motor'&&x.to.p===to),l.id+' delta '+from+'-'+to);
 }
});


test('source curriculum covers uploaded electrical, electronics, automation, installation and sensor domains',()=>{
 for(const id of ['dc-circuits','measurement-workshop','installation-grounding','installation-systems','electronic-switching','sensor-analog-apps','opamp-apps','oscillator-filter-apps','digital-logic-apps','digital-sequential-apps','microcontroller-apps','motor-direct-power','motor-start-speed','motor-braking','motor-special','motor-sequence','plc-hardware-programming','vfd-servo-control','panel-power-systems','workshop-safety-mechanics']){
  const ls=Lessons.lessons.filter(x=>x.topicId===id);assert.ok(ls.length>=8,id+' '+ls.length);assert.ok(ls.every(x=>x.sourceDocs?.length),id+' source docs');
 }
 assert.ok(Lessons.sourceExpansion?.sources?.length>=15);
});

test('motor control source lessons include real three-phase power wiring and dedicated power explanations',()=>{
 const motor=Lessons.lessons.filter(x=>['motor-direct-power','motor-forward-reverse','motor-star-delta','motor-start-speed','motor-sequence'].includes(x.topicId)&&x.kind!=='quiz');
 assert.ok(motor.length>=25);
 for(const l of motor){
  assert.ok(l.powerExplanation,l.id+' power explanation');
  const p=l.project,hasMotor=p.components.some(c=>['motor-3p','motor-y-d','motor-dahlender'].includes(c.typeId));
  if(hasMotor){
   assert.ok(p.wires.some(w=>['L1','L2','L3'].includes(w.from.p)||['L1','L2','L3'].includes(w.to.p)),l.id+' phase power');
   assert.ok(p.wires.some(w=>w.from.p==='PE'||w.to.p==='PE'),l.id+' PE');
  }
 }
});

test('tutorial UI renders dynamic per-topic totals, quiz interaction, source scope and motor power guidance',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
 assert.match(mode,/topicDone\+'\/\'\+ls\.length/);assert.match(mode,/data-tutorial-quiz/);assert.match(mode,/Motor güç bağlantısı nasıl yapıldı/);assert.match(mode,/Kaynak kapsamı/);
 assert.doesNotMatch(html,/tutorial-expanded-lessons\.js/);assert.match(mode,/ensureCurriculumLoaded/);assert.match(mode,/tutorial-expanded-lessons\.js/);assert.match(mode,/tutorial-source-outline\.js/);
});


test('every parsed source-outline heading is represented by an interactive lesson or merged source lesson',()=>{
 const c=Lessons.sourceOutlineCoverage;assert.ok(c);assert.ok(c.outlineEntries>=900,c.outlineEntries);assert.equal(c.added+c.merged,c.outlineEntries);
 assert.ok(c.totalLessons>=1000,c.totalLessons);assert.ok(c.sources.length>=15,c.sources.length);
 const outline=Lessons.lessons.filter(x=>x.sourceOutline);assert.ok(outline.length>=600,outline.length);
 for(const l of outline){assert.ok(['quiz','wiring'].includes(l.kind),l.id);assert.ok(l.sourceDocs.length,l.id);assert.ok(l.quiz,l.id)}
});


test('floating lesson coach can move, resize, close and reopen from the properties side panel',()=>{
 const enh=fs.readFileSync(require.resolve('../dist/tutorial-enhancements.js'),'utf8'),html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8');
 assert.match(html,/id="tutorialCoachPanelControl"/);assert.match(html,/id="tutorialCoachReopen"/);assert.match(html,/tutorial-bootstrap\.js/);
 assert.match(enh,/data-tutorial-float-bar/);assert.match(enh,/data-tutorial-coach-close/);assert.match(enh,/setVisible/);assert.match(enh,/LAYOUT_KEY/);
 assert.match(css,/#tutorialCoach\{[\s\S]*resize:both/);assert.match(css,/tutorial-float-bar/);assert.match(css,/tutorial-coach-panel-control/);
});

test('minimized lesson coach always keeps a working restore control',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),enh=fs.readFileSync(require.resolve('../dist/tutorial-enhancements.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8'),boot=fs.readFileSync(require.resolve('../dist/tutorial-bootstrap.js'),'utf8');
 assert.match(mode,/data-tutorial-coach-minimize/);assert.match(mode,/minimized\?'□':'−'/);assert.match(mode,/toggleCoachMinimize/);assert.match(mode,/data-tutorial-float-bar/);
 assert.match(enh,/data-tutorial-coach-minimize/);assert.match(enh,/querySelector\('\.tutorial-float-bar'\)/);assert.match(enh,/classList\.contains\('is-minimized'\)/);
 assert.match(css,/#tutorialCoach\.is-minimized\{height:46px!important/);assert.match(css,/#tutorialCoach\.is-minimized>:not\(\.tutorial-float-bar\)/);
 assert.match(boot,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-d2/);assert.match(boot,/tutorial-enhancements\.js\?v=1\.19\.20-coach-restore1/);
});

test('quiz answers randomize on lesson entry and show dash, green tick, red cross and correct answer',()=>{
 const enh=fs.readFileSync(require.resolve('../dist/tutorial-enhancements.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8');
 assert.match(enh,/function shuffled/);assert.match(enh,/quizOrder/);assert.match(enh,/tutorial-quiz-dash/);assert.doesNotMatch(enh,/String\.fromCharCode/);
 assert.match(enh,/tutorial-quiz-mark/);assert.match(enh,/✕ Yanlış cevap/);assert.match(enh,/Doğru cevap:/);assert.match(css,/tutorial-quiz-option\.correct/);assert.match(css,/tutorial-quiz-option\.wrong/);
});

test('guided terminal arrow follows live terminal geometry after resize, pan and floating-window movement',()=>{
 const enh=fs.readFileSync(require.resolve('../dist/tutorial-enhancements.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8');
 assert.match(enh,/function refreshArrow/);assert.match(enh,/function scheduleArrow/);assert.match(enh,/tutorial-next-port \.port/);assert.match(enh,/getBoundingClientRect/);assert.match(enh,/requestAnimationFrame/);assert.match(enh,/addEventListener\('resize'/);assert.match(enh,/addEventListener\('wheel'/);
 assert.match(css,/\.tutorial-link-arrow\{position:fixed/);
});


test('startup warning is isolated from every tutorial runtime except the tiny lazy bootstrap',()=>{
 const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8'),boot=fs.readFileSync(require.resolve('../dist/tutorial-bootstrap.js'),'utf8'),mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),enh=fs.readFileSync(require.resolve('../dist/tutorial-enhancements.js'),'utf8');
 assert.match(html,/tutorial-bootstrap\.js/);
 for(const file of ['tutorial-lessons.js','tutorial-mode.js','tutorial-enhancements.js','tutorial-expanded-lessons.js','tutorial-source-outline.js'])assert.doesNotMatch(html,new RegExp('<script src="'+file.replace('.', '\\.') ));
 assert.match(boot,/data-open-tutorial/);assert.match(boot,/await load\('tutorial-lessons\.js/);assert.match(boot,/await load\('tutorial-mode\.js/);assert.match(boot,/await load\('tutorial-enhancements\.js/);
 assert.match(mode,/async function ensureCurriculumLoaded/);assert.doesNotMatch(mode,/function bind\(\)\{\s*renderDashboard\(\)/);
 assert.match(enh,/function scheduleArrow/);assert.doesNotMatch(enh,/observer\.observe\(c/);assert.doesNotMatch(enh,/observer\.observe\(root\.document\.body/);
 assert.doesNotMatch(enh,/requestAnimationFrame[^\n]*refreshArrow[^\n]*requestAnimationFrame/);
});


test('tutorial rebuild never animates all wires; animation follows actual energized state',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8'),css=fs.readFileSync(require.resolve('../dist/tutorial.css'),'utf8'),app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
 assert.doesNotMatch(mode,/classList\.add\('tutorial-flow-wire'\)/);
 assert.match(css,/body\.tutorial-active \.wire\.energized/);assert.match(css,/tutorial-energy-flow/);
 assert.match(app,/classList\.toggle\('energized',!!w\._active\)/);
});


test('guided rebuild runtime defensively repairs a stale lesson whose wires exist but steps were lost',()=>{
 const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8');
 assert.match(mode,/function ensureGuidedLesson/);
 assert.match(mode,/guided=l\.kind==='wiring'\|\|l\.project\?\.tutorialLesson\?\.phase==='demo'/);
 assert.match(mode,/if\(wires\.length&&guided\)\{l\.kind='wiring';if\(!Array\.isArray\(l\.steps\)\|\|l\.steps\.length!==wires\.length\)l\.steps=stepsFromWires\(l\)\}/);
 assert.match(mode,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});
