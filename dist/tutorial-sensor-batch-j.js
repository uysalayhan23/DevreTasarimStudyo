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
  // Open-collector variants have different canonical electrical topologies.
  // 1/2 have no R1. 3 has a PNP sourcing output with R1 from + to BK,
  // creating a possible resistor-fed H1 path independently of sensor output.
  // 4 has NPN sinking and R1 in parallel with the indicator load.
  // Never teach all four as a verified, identical NPN pull-up circuit.
  const collector=topic==='open-collector';
  const collectorNotes=collector?[
    null,
    {goal:'Bu PNP sourcing sensör BK üzerinden yüke pozitif yol sağlar; devrede ayrıca R1 pull-up direnci yoktur.',
     question:'Birinci sanal devrede bağımsız R1 pull-up direnci bulunur mu?',
     options:['Hayır, yalnız PNP çıkış ve gösterge yükü bulunur','Evet, iki adet R1 vardır','R1 nötr ile koruma toprağı arasındadır'],
     note:'Bu varyant NPN sinking bağlantısıyla aynı kabul edilmez.'},
    {goal:'NPN sinking BK çıkışı, + beslemeye bağlı gösterge yükünün dönüş yolunu anahtarlar; ayrıca bağımsız R1 direnci yoktur.',
     question:'İkinci varyantta NPN sensörün BK ucu aktifken hangi hattı tamamlar?',
     options:['Yükün 0 V dönüş yolunu','Koruma topraklamasını','Kaynağın AC frekansını'],
     note:'Gösterge yükü pozitif beslemeye bağlıdır; bağımsız R1 pull-up yoktur.'},
    {goal:'Üçüncü varyant PNP sensing çıkışı kullanır. + besleme ile BK arasındaki R1, sensörden bağımsız olarak H1 göstergesine dirençli besleme yolu oluşturabilir; bu devre doğrulanmış NPN pull-up örneği değildir.',
     question:'PNP üçüncü varyantında R1 neden kaynak düzeltmesi gerektirir?',
     options:['Sensör kapalı olsa da R1 üzerinden H1 yüküne akım yolu oluşabilir','R1 iki nötrü otomatik ayırır','R1 besleme gerilimini kendiliğinden sıfırlar'],
     note:'Kanonik şemadaki PNP + R1 paralel besleme yolu fiziksel açıdan yeniden gözden geçirilmeli; H1 çıkışı gerçek solver ile sınanmadan kabul edilmez.',
     correction:true},
    {goal:'Dördüncü varyant NPN sinking sensördür; H1 yükü ve R1 aynı + besleme ile BK düğümüne paralel bağlıdır. Bu, yalnız dijital giriş pull-up direncinden oluşan devre değildir.',
     question:'Dördüncü varyantta R1 ve H1 nasıl konumlanır?',
     options:['+ besleme ile BK arasında paralel kollardır','Biri diğerinin içindedir','Aynı kablonun iki ucu olarak kısa devredir'],
     note:'R1 varlığı gösterge yükünün etkisini ortadan kaldırmaz.'}
  ][n]:null;
  if(collector&&((n>=3)!==components.some(c=>c.id==='r'&&c.typeId==='resistor')))
    throw Error('Open collector R1 topology mismatch '+id);
  const goal=collectorNotes?.goal||config[1];
  const question=collectorNotes?.question||config[2];
  const options=collectorNotes?.options||config[3];
  const specificTask=task+(collectorNotes?' '+collectorNotes.note:'');
  lesson.designStandard='rich-reference-v1';lesson.learningGoal=goal;lesson.summary=goal;
  lesson.explanation=specificTask+' Gerçek enerjili bağlantı yapılmaz.';
  lesson.measurementUpgrade={heading:config[0]+' · '+n+'. uygulama',goal,task:specificTask,question,options:clone(options),simulationOnly:true,canonicalCircuitPreserved:true,sourceSensorId:sensor.typeId,pnp,sourceCorrectionRequired:!!collectorNotes?.correction};
  lesson.beginnerSteps=['BN, BU ve BK terminallerini bul.','Sanal yükün pozitif ve dönüş yollarını izle.',specificTask,'Kanonik devreyi rehberli adımlarla yeniden kur.','Simülasyonun sonucunu gözlemle ve soruyu cevapla.'];
  lesson.quiz={question,options:clone(options),answer:0,why:goal};
  lesson.pedagogyReview={...lesson.pedagogyReview,previousVersion:lesson.pedagogyReview?.version||null,version:'v1.19.20-sensor-batch-j',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true,sourceCorrectionRequired:!!collectorNotes?.correction,sourceStatus:collectorNotes?.correction?'canonical-graph-physical-review-required':'canonical-graph-not-runtime-verified'};
 }
}
L._sensorBatchJ=true;
})(typeof window==='undefined'?globalThis:window);
