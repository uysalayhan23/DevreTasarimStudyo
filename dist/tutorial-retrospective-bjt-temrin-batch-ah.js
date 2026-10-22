/* SC242–248: two-BD139 retrospective graph repair; preserve canonical originals.
 * Opt-in simulator already models exact source graph; no analog/hardware claims. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._retrospectiveBjtTemrinBatchAH)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const rows=[["065","040","06","SOURCE_WIRED_MONOSTABLE_NATIVE_IDEAL",13,21,"mq07StandaloneBjtMonostable","Tek kararlı iki-BD139 devresinde S1 tetiklendiğinde ne olur?",["Q1 kısa süreli iletime geçer, ideal RC süresi sonunda Q2 kararlı duruma döner.","Devre iki SET/RESET durumunu sürekli saklar.","Herhangi bir tetik olmadan periyodik salınım sürer."],"S1 tetik yolu, C1 ve RB2 zamanlamasıyla sanal yaklaşık 693 ms tek darbe verir. Fiziksel BD139 zaman eğrisi ölçülmemiştir."],["066","041","07","SOURCE_WIRED_BISTABLE_NATIVE_IDEAL",13,20,"mq07StandaloneBjtBistable","Çift kararlı iki-BD139 devresinde SET bırakıldığında ne olur?",["Çapraz bağlı Q1/Q2 son durumu RESET gelinceye kadar saklar.","Her 693 ms de çıkış kendiliğinden tersine döner.","SET düğmesi bırakılınca iki transistör de kaybolur."],"İki ayrı S1 SET/S2 RESET yolu, çapraz C-B dirençli iki BD139 kolu üzerinden ideal sanal durum belleği üretir. Gerçek metastabilite kabulü yoktur."],["067","042","08","SOURCE_WIRED_CROSS_RC_NATIVE_IDEAL",9,14,"mq07StandaloneBjtAstable","Kararsız iki-BD139 devresinde Q1 ve Q2 nasıl çalışır?",["Çapraz C1/C2 ile dönüşümlü iletime geçerler.","Sadece SET düğmesine basılınca iki kalıcı durum saklarlar.","Tek direnç kesin 100 kHz salınım üretir."],"5 V sanal RC modelde Q1/Q2 dönüşümlü iletime geçer, örnek 10 kΩ ve 100 µF için 0,721 Hz ideal hız görülür. Fiziksel SPICE kabulü değildir."]];
const updated=[];
for(const [suffix,ss,sc,status,parts,wires,flag,question,options,why] of rows){
 const id='oscillator-filter-apps-outline-'+suffix,srcId='oscillator-filter-apps-outline-'+ss;
 const target=L.byId[id],src=L.byId[srcId],old=target?.project,p0=src?.project;
 if(!target||!src||target.topicId!=='oscillator-filter-apps'||
    target.kind!=='wiring'||old?.referenceOnly===true||
    old?.components?.length!==8||old?.wires?.length!==8||target.steps?.length!==8||
    old.components.filter(c=>c.typeId==='bd139-npn').length!==1||
    old.components.some(c=>c.typeId==='capacitor')||
    target.pedagogyReview?.titleTopologyStatus!=='REVIEW'||
    target.pedagogyReview?.titleTopologyIssue!=='SINGLE_BD139_SWITCH_NOT_MULTIVIBRATOR'||
    !['nativeDynamicAcceptance','physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance'].every(k=>target.pedagogyReview[k]===false)||
    src.kind!=='wiring'||p0?.referenceOnly===true||src.pedagogyReview?.titleTopologyStatus!==status||
    p0?.components?.length!==parts||p0.wires?.length!==wires||src.steps?.length!==wires||
    p0.components.filter(c=>c.typeId==='bd139-npn'&&c[flag]===true).length!==2||
    new Set(p0.components.map(c=>c.id)).size!==parts||
    new Set(p0.wires.map(w=>w.id)).size!==wires||
    p0.wires.some(w=>!p0.components.some(c=>c.id===w.from?.c)||!p0.components.some(c=>c.id===w.to?.c)))
  throw Error('Locked BJT source/target shape mismatch '+id);
 const protect=JSON.stringify([src.project,src.steps,src.materials,src.quiz,src.pedagogyReview]);
 const p=clone(p0);p.projectId=old.projectId;p.name=old.name;
 p.tutorialLesson={...(p.tutorialLesson||{}),...(old.tutorialLesson||{}),
    id,topicId:target.topicId,phase:'demo',step:0};
 target.project=p;target.workspaceMode=p.workspaceMode;target.kind='wiring';
 target.steps=clone(src.steps);target.materials=clone(src.materials);
 target.quiz={question,options:[...options],answer:0,why};
 target.summary='Gerçek katalog B/C/E uçlarıyla bağlı sanal iki-BD139 temrini. '+src.summary;
 target.explanation=why+' Kablolar korunan '+srcId+' kaynak grafiğiyle birebir aynıdır. '+src.explanation;
 target.learningGoal=src.learningGoal;
 target.beginnerSteps=ss==='040'?
   ['S1 tetik, Q1/Q2 ve 100 µF C1 ile RB2 zamanlama yolunu bul.','Butona kısa basıp bırak; sanal darbe bitiminde kararlı kola dönüşü incele.','İdeal 693 ms değerini gerçek fiziksel ölçüm sayma.']:
   ss==='041'?
   ['S1 SET ve S2 RESET butonlarını iki ayrı transistör kolunda bul.','SET bırakıldığında sanal bellek durumunu ve RESET ile değişimini izle.','Çapraz geri beslemeyi fiziksel kilitli kabul olarak gösterme.']:
   ['Karşılıklı C1/C2 zamanlama yollarını ve Q1/Q2 kolektör dirençlerini bul.','Sanal dönüşümlü iletimi ve yaklaşık 0,721 Hz ideal sonucu incele.','Gerçek BD139 salınımı veya fiziksel doğrulama iddia etme.'];
 target.safety='Yalnız sanal 5 V düşük gerilimli eğitim modeli; fiziksel güvenlik, SPICE veya cihaz kabulü değildir.';
 target.pedagogyReview={...target.pedagogyReview,
    titleTopologyStatus:status,titleTopologyIssue:null,
    sourceReusedFrom:srcId,sourceCircuitPreserved:false,
    mq07RetrospectiveBjtRepair:'SC242_248_ACTUAL_TWO_BJT_TERMINALS',
    componentIds:p.components.map(c=>c.typeId),terminalGrounded:true,
    nativeIdealVirtualAcceptance:true,nativeDynamicAcceptance:false,
    physicalAcceptance:false,windowsVisualAcceptance:false,
    independentPedagogicalAcceptance:false};
 if(protect!==JSON.stringify([src.project,src.steps,src.materials,src.quiz,src.pedagogyReview])||
    JSON.stringify(target.project.components)!==JSON.stringify(src.project.components)||
    JSON.stringify(target.project.wires)!==JSON.stringify(src.project.wires)||
    target.steps.length!==wires||target.project.components.filter(c=>c.typeId==='bd139-npn').length!==2)
  throw Error('Source graph not preserved '+id);
 updated.push(id);
}
if(Array.isArray(L.mq07Batch200?.reviewIds)){
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>!updated.includes(x.id));
 L.mq07Batch200.circuitRepairs=[...new Set([...(L.mq07Batch200.circuitRepairs||[]),...updated])];
}
L._retrospectiveBjtTemrinBatchAH=true;
})(typeof window==='undefined'?globalThis:window);