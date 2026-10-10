/* MQ-07 / Sensor Batch J. Educational metadata only; preserve canonical electrical topology. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sensorBatchJ)return;
const specs={
 'pnp-npn': ['PNP ve NPN sensör çıkışlarını karşılaştır','PNP çıkış yükü pozitif yönden beslerken NPN çıkış yük akımını 0 V tarafına çeker.','PNP yükü hangi hatta döner?',['0 V','Koruma toprağı','Başka kaynağın fazına']],
 'inductive-capacitive':['Endüktif ve kapasitif algılama','Sanal metal/yaklaşım algılama ile kapasitif algılama arasındaki kullanım farkını öğren; seçili sensörün çıkış türünü kontrol et.','Bir sensörün PNP/NPN çıkışı hangi bilgiyle doğrulanır?',['Model ve terminal tanımı','Yalnız kasanın rengi','Kablo uzunluğu']],
 'source-sink':['Sourcing ve sinking yük bağlantısı','Sourcing çıkışın yüke pozitif akım yolu, sinking çıkışın yük için 0 V yönünde dönüş sağladığını ayırt et.','NPN sinking yük nerede beslenir?',['Yükün diğer ucundan +24 V ile','Koruma topraklamasından','Bağlantısız bırakılarak']],
 'open-collector':['Open collector ve pull-up','Open collector çıkışın yalnız akım çekebildiğini, pull-up direncinin de pasif çıkışı tanımlı bir seviyede tutabildiğini gözlemle.','Pull-up direncinin görevi nedir?',['Açık çıkış için tanımlı yüksek seviye sağlamak','Sensörü AC kaynağa dönüştürmek','Ölçüm probunu devreden çıkarmak']]
};
const clone=v=>JSON.parse(JSON.stringify(v));
for(const [topic,config] of Object.entries(specs)){
 for(let n=1;n<=4;n++){
  const id=topic+'-'+n,lesson=L.byId[id];if(!lesson||lesson.topicId!==topic)throw Error('Sensor lesson not found '+id);
  const p=lesson.project,components=p?.components,wires=p?.wires,steps=lesson.steps;
  if(!Array.isArray(components)||!Array.isArray(wires)||!Array.isArray(steps)||!wires.length||wires.length!==steps.length)throw Error('Canonical graph unavailable '+id);
  const ids=new Set(components.map(c=>c.id));
  const keys=new Set(wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p])));
  for(const w of wires){if(!ids.has(w.from?.c)||!ids.has(w.to?.c))throw Error('Missing component '+id);}
  for(const s of steps){if(!keys.has(JSON.stringify([s.from?.c,s.from?.p,s.to?.c,s.to?.p])))throw Error('Invalid guided terminal '+id);}
  const sensor=components.find(c=>c.id==='s'),lamp=components.find(c=>c.id==='h');
  if(!sensor||!lamp||!wires.some(w=>w.from?.c==='g1'&&w.from?.p==='P'&&w.to?.c==='s'&&w.to?.p==='BN')||!wires.some(w=>w.from?.c==='s'&&w.from?.p==='BU'))throw Error('Source sensor terminals missing '+id);
  const expected=topic==='open-collector'&&n>=3?6:4;
  if(wires.length!==expected)throw Error('Unexpected sensor wiring '+id);
  const pnp=!!wires.find(w=>w.from?.c==='s'&&w.from?.p==='BK'&&w.to?.c==='h');
  const task='Yalnız sanal devrede '+sensor.label+' ile '+lamp.label+' bağlantısını incele. BN ve BU besleme, BK sinyal yoludur. '+(pnp?'BK → lamba X1 ve lamba X2 → 0 V PNP kaynak yoludur.':'Lamba X1 → +24 V ve lamba X2 → BK NPN dönüş yoludur.')+' Sanal algılama durumunu değiştir, gerçek solver sonucu doğrulanmadan yandığını varsayma.';
  const goal=config[1];
  lesson.designStandard='rich-reference-v1';lesson.learningGoal=goal;lesson.summary=goal;
  lesson.explanation=task+' Gerçek enerjili bağlantı yapılmaz.';
  lesson.measurementUpgrade={heading:config[0]+' · '+n+'. uygulama',goal,task,question:config[2],options:clone(config[3]),simulationOnly:true,canonicalCircuitPreserved:true,sourceSensorId:sensor.typeId,pnp};
  lesson.beginnerSteps=['BN, BU ve BK terminallerini bul.','Sanal yükün pozitif ve dönüş yollarını izle.',task,'Kanonik devreyi rehberli adımlarla yeniden kur.','Simülasyonun sonucunu gözlemle ve soruyu cevapla.'];
  lesson.quiz={question:config[2],options:clone(config[3]),answer:0,why:goal};
  lesson.pedagogyReview={...lesson.pedagogyReview,previousVersion:lesson.pedagogyReview?.version||null,version:'v1.19.20-sensor-batch-j',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true,sourceStatus:'canonical-graph-not-runtime-verified'};
 }
}
L._sensorBatchJ=true;
})(typeof window==='undefined'?globalThis:window);
