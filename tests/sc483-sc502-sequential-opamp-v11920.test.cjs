'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),catalog=QA.catalog();
const ids=["opamp-apps-outline-025","opamp-apps-outline-026","opamp-apps-outline-027","opamp-apps-outline-028","opamp-apps-outline-029","opamp-apps-outline-030","opamp-apps-outline-031","opamp-apps-outline-032","sensor-analog-apps-outline-054","sensor-analog-apps-outline-055","opamp-apps-outline-033","opamp-apps-outline-034","opamp-apps-outline-035","opamp-apps-outline-036","opamp-apps-outline-037","opamp-apps-outline-038","opamp-apps-outline-039","opamp-apps-outline-040","opamp-apps-outline-041","opamp-apps-outline-042"];
const expected={"opamp-apps-outline-025":"Bu kez potansiyometreyi küçük adımlarla değiştir: eviren LM358 girişine göre çıkışın ters yönlü değişimini gözle; sanal besleme sınırını unutma.","opamp-apps-outline-026":"Evirmeyen devrede U1 pin 3 girişini, pin 2 geri beslemesini izle. Önce girişin gerçek gerilimini, sonra çıkışın nasıl büyüdüğünü karşılaştır.","opamp-apps-outline-027":"FG1’in 20 Hz sinüsünü U1 pin 3’e bağladığında çıkış da değişir. UNI-T DCV anlık değer gösterir; bunu doğrudan AC RMS ölçümü sayma.","opamp-apps-outline-028":"Bir DC giriş seç, U1 pin 3 ile çıkış pin 1’i karşılaştır. Geri besleme kazancı yükseltir ama çıkış besleme sınırını aşamaz.","opamp-apps-outline-029":"İzleyici katının numarası basit: çıkış pin 1 tekrar pin 2’ye döner. Giriş ile çıkışı karşılaştır; katın amacı gerilimi katlamak değil.","opamp-apps-outline-030":"Bu temrinde U1 pin 1→2 geri beslemesini bul. Giriş değişince çıkışın onu neden izlediğini ölçüm sonucundan anlat.","opamp-apps-outline-031":"Karşılaştırıcıda pin 2 sabit eşik, pin 3 değişen giriş olsun. Giriş eşiği geçtiğinde U1 çıkışının neden yön değiştirdiğini gözle.","opamp-apps-outline-032":"Önce referans bölücüsünü bul, sonra giriş tarafını değiştir. Eşik üstü ve altındaki iki sanal çıkış durumunu yan yana düşün.","sensor-analog-apps-outline-054":"LDR’ye düşen ışığı değiştirdiğini düşün: ışıkla direnci, onunla pin 3 gerilimini takip et. Pin 2 referansı ile karşılaştır.","sensor-analog-apps-outline-055":"NTC ısındığında direnci değişir: 15 °C ile 35 °C çıkışlarını karşılaştır. IN− referans kablosu koparsa HIGH sonucunu doğru kabul etme.","opamp-apps-outline-033":"S1’e bastığında C1 hemen dolmaz. U1, kondansatör gerilimi referansı geçene kadar bekler; ON gecikmesini bu geçiş üzerinden gözle.","opamp-apps-outline-034":"S1’i bıraktığında C1 enerjisini yavaşça boşaltır. U1 çıkışı referans altına düşünce değişir; OFF gecikmesinin sebebi budur.","opamp-apps-outline-035":"İki ayrı DC giriş kullan: yalnız birini değiştirip U1 çıkışına bak. Fark yükselteci toplamı değil iki girişin farkını işler.","opamp-apps-outline-036":"Çıkarıcı temrininde önce iki DC girişi eşitle, ardından birini değiştir. Farkın çıkışta hangi yönde göründüğünü not et.","opamp-apps-outline-037":"Toplayıcıya gelen iki girişin her biri kendi 10 kΩ yolundan akar. Birini değiştirirken diğerini sabit tut ve çıkış etkisini karşılaştır.","opamp-apps-outline-038":"İki girişli toplayıcıyı adım adım oku: önce yalnız A, sonra yalnız B değişsin. Çıkışın sanal 24 V sınırı içinde kalmasına dikkat et.","opamp-apps-outline-039":"Giriş gerilimi aniden değişince kondansatör kısa süre akım taşır. Türev alıcıda sürekli seviye yerine değişim anının etkisini ara.","opamp-apps-outline-040":"Türev alıcı temrininde basamak giriş ve giriş kondansatörü birlikte çalışır. Çıkışın kalıcı bir DC kazanç üretmesini bekleme.","opamp-apps-outline-041":"İntegral alıcıda C1 geri besleme yolundadır. Sabit girişin çıkışı bir anda değil zaman içinde nasıl değiştirebildiğini incele.","opamp-apps-outline-042":"Bu integratör uygulamasında R1 akım yolunu, C1 birikimi belirler. Zamana bağlı sanal çıkışı incele; tam donanım kabulü verme."};
const clone=x=>JSON.parse(JSON.stringify(x));
const by=p=>Object.fromEntries(p.components.map(c=>[c.id,c]));
test('SC483–502 sequential wired pedagogy keeps exact source graph and pending acceptance',()=>{
 assert.equal(L.lessons.length,1655);
 assert.deepEqual(Array.from(L.lessons.slice(482,502),l=>l.id),ids);
 for(const id of ids){
  const lesson=L.byId[id],p=lesson.project;
  assert.equal(lesson.kind,'wiring',id);
  assert.ok(p.wires.length>0&&p.components.length>0,id);
  assert.equal(p.tutorialLesson?.id,id,id);
  assert.equal(lesson.practiceGuide?.method,'virtual-circuit-check',id);
  assert.equal(lesson.practiceGuide?.steps?.[0],expected[id],id);
  assert.equal(lesson.pedagogyReview?.windowsVisualAcceptance,false,id);
  assert.equal(lesson.pedagogyReview?.physicalAcceptance,false,id);
  assert.equal(lesson.pedagogyReview?.independentPedagogicalAcceptance,false,id);
  assert.equal(lesson.steps?.length,p.wires.length,id);
 }
});
test('SC492 NTC comparison responds to temperature and refuses a disconnected reference',()=>{
 const original=L.byId['sensor-analog-apps-outline-055'].project,was=JSON.stringify(original);
 const run=(temp,broken)=>{
  const p=clone(original),parts=by(p);parts.s1.temperature=temp;
  if(broken){const before=p.wires.length;p.wires=p.wires.filter(w=>!((w.from?.c==='r2'&&w.to?.c==='u1'&&w.to?.p==='2')||(w.to?.c==='r2'&&w.from?.c==='u1'&&w.from?.p==='2')));assert.equal(before-p.wires.length,1)}
  const state=Simulation.solve(p,catalog,{now:500});
  assert.equal(state.stable,true);assert.equal(state.blocked,false);assert.equal(state.shortCircuit,false);
  return parts.v1._meter?.value;
 };
 assert.ok(run(15,false)<1,'15°C LOW');assert.ok(run(35,false)>15,'35°C HIGH');
 assert.ok(run(15,true)<1,'broken reference LOW');assert.ok(run(35,true)<1,'broken reference must not claim HIGH');
 assert.equal(JSON.stringify(original),was);
});
test('SC495–498 source-wired difference/summer responds to input and broken lead',()=>{
 for(const id of ['opamp-apps-outline-035','opamp-apps-outline-036','opamp-apps-outline-037','opamp-apps-outline-038']){
  const original=L.byId[id].project;
  function run(pos,cut){const p=clone(original),c=by(p);c.in.potentiometer=pos;
   if(cut){const before=p.wires.length;p.wires=p.wires.filter(w=>!(w.from?.c==='r1'&&w.to?.c==='u1'&&['2','3'].includes(w.to?.p)));assert.ok(p.wires.length<before,id+' input wire exists');}
   const state=Simulation.solve(p,catalog,{now:1000});assert.equal(state.stable,true);assert.equal(state.blocked,false);assert.equal(state.shortCircuit,false);
   return c.v1._meter?.value;
  }
  const lower=run(10,false),upper=run(75,false),broken=run(35,true),base=run(35,false);
  assert.ok(Number.isFinite(lower)&&Number.isFinite(upper)&&Math.abs(lower-upper)>5,id+' DC input sweep');
  assert.ok(Number.isFinite(broken)&&Math.abs(broken-base)>1,id+' open input distinguishes healthy circuit');
 }
});
