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
  // 1/2 have no R1. 3 has PNP sourcing and a 10 kΩ BK-to-0 V pull-down;
  // 4 has NPN sinking and a 1 kΩ BK-to-+24 V pull-up parallel to H1.
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
    {goal:'Üçüncü varyantta PNP sourcing sensör BK çıkışıyla H1 yükünü besler. 10 kΩ R1, BK çıkışını algılama yokken 0 V seviyesinde tutan pull-down direncidir.',
     question:'Üçüncü varyantta 10 kΩ R1 direnci hangi hatlar arasında bulunur?',
     options:['BK ve 0 V arasında','BK ve +24 V arasında','Koruma toprağı ve nötr arasında'],
     note:'Güncel 10 kΩ BK → 0 V pull-down direnci korunur. Önceki yanlış 1 kΩ +24 V → BK bağlantısı kaldırıldı. Güncel gerçek kaynak kodunun solver denetiminde sensör OFF: H1 0 mA, ON: H1 24 mA ve R1 2,4 mA ölçüldü. Bu, sanal model sonucudur; gerçek donanımın ölçümü değildir.'},
    {goal:'Dördüncü varyant NPN sinking sensördür; H1 yükü ve R1 aynı + besleme ile BK düğümüne paralel bağlıdır. Bu, yalnız dijital giriş pull-up direncinden oluşan devre değildir.',
     question:'Dördüncü varyantta R1 ve H1 nasıl konumlanır?',
     options:['+ besleme ile BK arasında paralel kollardır','Biri diğerinin içindedir','Aynı kablonun iki ucu olarak kısa devredir'],
     note:'R1 varlığı gösterge yükünün etkisini ortadan kaldırmaz.'}
  ][n]:null;
  if(collector&&((n>=3)!==components.some(c=>c.id==='r'&&c.typeId==='resistor')))
    throw Error('Open collector R1 topology mismatch '+id);
  if(collector&&n===3){
    const r=components.find(c=>c.id==='r');
    if(r?.resistance!==10000||!wires.some(w=>w.from?.c==='g1'&&w.from?.p==='M'&&w.to?.c==='r'&&w.to?.p==='1')||
      !wires.some(w=>w.from?.c==='r'&&w.from?.p==='2'&&w.to?.c==='s'&&w.to?.p==='BK'))
      throw Error('PNP pull-down source graph mismatch '+id);
  }
  const goal=collectorNotes?.goal||config[1];
  const question=collectorNotes?.question||config[2];
  const options=collectorNotes?.options||config[3];
  const specificTask=task+(collectorNotes?' '+collectorNotes.note:'');
  lesson.designStandard='rich-reference-v1';lesson.learningGoal=goal;lesson.summary=goal;
  lesson.explanation=specificTask+' Gerçek enerjili bağlantı yapılmaz.';
  lesson.measurementUpgrade={heading:config[0]+' · '+n+'. uygulama',goal,task:specificTask,question,options:clone(options),simulationOnly:true,canonicalCircuitPreserved:true,sourceSensorId:sensor.typeId,pnp,sourceCorrectionRequired:!!collectorNotes?.correction};
  lesson.beginnerSteps=['BN, BU ve BK terminallerini bul.','Sanal yükün pozitif ve dönüş yollarını izle.',specificTask,'Kanonik devreyi rehberli adımlarla yeniden kur.','Simülasyonun sonucunu gözlemle ve soruyu cevapla.'];
  lesson.quiz={question,options:clone(options),answer:0,why:goal};
  lesson.pedagogyReview={...lesson.pedagogyReview,previousVersion:lesson.pedagogyReview?.version||null,version:'v1.19.20-sensor-batch-j2',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true,sourceCorrectionRequired:!!collectorNotes?.correction,sourceSolverVerified:collector&&n===3,sourceStatus:collector&&n===3?'source-solver-checked-windows-acceptance-open':'canonical-graph-not-runtime-verified'};
 }
}

/* SC050–SC061: actual wired PNP/NPN and NC sensor teaching distinctions. */
const sensorLessonDetails={
  "pnp-npn-1": {
    "goal": "PNP çıkışın lambaya pozitif akım yolu sağladığını gör.",
    "task": "BN +24 V, BU 0 V beslemedir. BK H1/X1'e, H1/X2 ise 0 V'a bağlıdır; sensör aktif olduğunda lambanın pozitif yolu tamamlanır.",
    "q": "PNP sensörlü lambanın dönüş ucu nereye gider?",
    "answers": [
      "G1/M (0 V)",
      "G1/P (+24 V)",
      "Koruma toprağı"
    ],
    "points": [
      "BN/BU besleme çiftini bul.",
      "BK → H1/X1 pozitif çıkışı göster.",
      "H1/X2 → G1/M dönüşünü incele."
    ]
  },
  "pnp-npn-2": {
    "goal": "NPN sensörün lambanın 0 V yönündeki dönüşünü anahtarladığını öğren.",
    "task": "H1/X1 doğrudan +24 V alır. NPN sensörün BK çıkışı, H1/X2 için anahtarlanan dönüş yoludur; PNP ile karıştırma.",
    "q": "NPN sensörlü devrede H1/X1 hangi hatta bağlıdır?",
    "answers": [
      "G1/P (+24 V)",
      "S/BK",
      "G1/M (0 V)"
    ],
    "points": [
      "Sensör BN/BU beslemesini ayırt et.",
      "G1/P → H1/X1 yolunu takip et.",
      "H1/X2 → S/BK dönüşünü göster."
    ]
  },
  "pnp-npn-3": {
    "goal": "PNP sourcing yolunu terminal etiketlerinden okuyabil.",
    "task": "S/BK çıkışı H1/X1'e pozitif yol verir. H1/X2'nin G1/M'ye dönmesiyle sensör çıkışı ve yük tamamlanır.",
    "q": "PNP sourcing bağlantısında S/BK hangi lamba ucuna gider?",
    "answers": [
      "H1/X1",
      "H1/X2",
      "G1/M"
    ],
    "points": [
      "PNP modelini doğrula.",
      "BK–X1 sourcing yolunu izle.",
      "X2–G1/M dönüşünü bul."
    ]
  },
  "pnp-npn-4": {
    "goal": "NPN sinking devresini PNP sourcing devresinden ayırt et.",
    "task": "H1'in X1 ucu +24 V'a, X2 ucu S/BK'ye bağlıdır. NPN BK çıkışı yükün dönüşünü anahtarlar; kaynaktan pozitif güç vermez.",
    "q": "NPN sinking devresinde H1/X2 nereye bağlanır?",
    "answers": [
      "S/BK",
      "S/BN",
      "G1/P"
    ],
    "points": [
      "+24 V girişini H1/X1 üzerinde bul.",
      "H1/X2–BK dönüşünü takip et.",
      "PNP örneğiyle yük yerini karşılaştır."
    ]
  },
  "inductive-capacitive-1": {
    "goal": "Endüktif PNP yaklaşım sensörünün metal algılama görevini öğren.",
    "task": "Bu endüktif sensörün hedefi metaldir. BN/BU ile beslenir; BK, H1/X1'i anahtarlar. Sanal metal hedefin mesafesini değiştirerek sensör çıktısını gözlemle.",
    "q": "Bu endüktif sensör için uygun sanal hedef hangisidir?",
    "answers": [
      "Metal",
      "Ahşap",
      "Sıvı"
    ],
    "points": [
      "Sensörün endüktif tipini doğrula.",
      "Metal hedefi sanal olarak yaklaştır.",
      "BK–H1 ve H1–0 V yollarını bul."
    ]
  },
  "inductive-capacitive-2": {
    "goal": "NPN kapasitif sensörün yük dönüşünü ve hedef çeşitliliğini tanı.",
    "task": "Kapasitif model uygun metal olmayan hedefi de algılayabilir. H1/X1 +24 V'a, H1/X2 sensörün NPN BK ucuna gider.",
    "q": "Bu NPN kapasitif bağlantıda H1'in pozitif beslemesi hangisidir?",
    "answers": [
      "G1/P → H1/X1",
      "S/BU → H1/X1",
      "G1/M → H1/X1"
    ],
    "points": [
      "Kapasitif ve endüktif algılamayı ayır.",
      "H1/X1 +24 V hattını izle.",
      "X2–BK dönüşünde NPN görevini bul."
    ]
  },
  "inductive-capacitive-3": {
    "goal": "Dört telli endüktif sensörün NO ve NC uçlarını ayırt et.",
    "task": "S'nin BK NO ve WH NC çıkışları vardır. Bu örnekte yalnız BK–H1/X1 bağlıdır; WH kullanılmadığı için ikinci çıkışta lamba davranışı test edilmiş sayılmaz.",
    "q": "Dört telli sensörün bu devrede boşta kalan çıkışı hangisidir?",
    "answers": [
      "WH (NC)",
      "BK (NO)",
      "BN (+24 V)"
    ],
    "points": [
      "BN/BU besleme çiftini tanı.",
      "BK NO çıkışının H1'e bağlantısını gör.",
      "WH NC'nin kablo bağlanmadığını doğrula."
    ]
  },
  "inductive-capacitive-4": {
    "goal": "NC kapasitif sensörün ters anahtarlama davranışını gözlemle.",
    "task": "Bu sensörün PNP BK çıkışı NC'dir. Hedef yokken H1 yolu kapalı olabilir; sanal hedef algılandığında NC açılır ve H1 söner. Hedef algısı ile kontak kapalılığını eşitleme.",
    "q": "NC kapasitif sensör hedef algılayınca lambaya ne olur?",
    "answers": [
      "NC açılır, H1 söner",
      "H1 sürekli yanar",
      "Besleme uçları yer değiştirir"
    ],
    "points": [
      "S/BN ve S/BU beslemesini incele.",
      "Hedef yokken NC çıkışını gözlemle.",
      "Hedef gelince çıkışın açılmasını izle."
    ]
  },
  "source-sink-1": {
    "goal": "PNP sourcing çıkışının yüke pozitif besleme sağladığını anla.",
    "task": "PNP sensör S/BK'den H1/X1'e pozitif yol oluşturur. H1/X2, G1/M'ye döner. Sourcing terimini bu terminal yolu üzerinden açıkla.",
    "q": "PNP sourcing BK çıkışı hangi uca bağlıdır?",
    "answers": [
      "H1/X1",
      "H1/X2",
      "G1/M"
    ],
    "points": [
      "Sourcing kavramını BK çıkışında göster.",
      "BK–H1/X1 hattını izle.",
      "H1/X2'nin G1/M dönüşünü bul."
    ]
  },
  "source-sink-2": {
    "goal": "NPN sinking sensörün yük için 0 V dönüşü oluşturduğunu öğren.",
    "task": "H1/X1 doğrudan +24 V'a gider; H1/X2, NPN BK ucuna bağlanır. BK yükün düşük tarafındaki dönüşünü anahtarlar.",
    "q": "NPN sinking BK çıkışının görevi nedir?",
    "answers": [
      "Lambanın 0 V dönüşünü anahtarlamak",
      "AC faz üretmek",
      "BN beslemesini kesmek"
    ],
    "points": [
      "G1/P–H1/X1 besleme hattını bul.",
      "H1/X2–BK dönüşünü izle.",
      "Sinking terimini dönüş yoluyla açıkla."
    ]
  },
  "source-sink-3": {
    "goal": "PNP sourcing terminal eşleşmesini NPN sinking ile karşılaştırabil.",
    "task": "PNP modelde BK–H1/X1, H1/X2–0 V bağlantıları kullanılır. Aynı kablo renkleri farklı çıkış modelini kanıtlamaz; gerçek katalog çıkış türünü esas al.",
    "q": "PNP sourcing örneğinde H1/X2 nereye döner?",
    "answers": [
      "G1/M (0 V)",
      "S/BN (+24 V)",
      "S/BK"
    ],
    "points": [
      "Sensörün PNP modelini kontrol et.",
      "BK–H1/X1 hattını izle.",
      "X2–0 V ile NPN dönüşünü karşılaştır."
    ]
  },
  "source-sink-4": {
    "goal": "NPN sinking bağlantısının uçlarını bağımsız eşleştir.",
    "task": "Bu NPN örnekte H1/X1 +24 V'a, H1/X2 ise S/BK'ye bağlıdır. Sensör aktif olduğunda BK üzerinden 0 V dönüşü tamamlanır.",
    "q": "NPN sinking devresinde +24 V doğrudan hangi lamba ucuna bağlanır?",
    "answers": [
      "H1/X1",
      "H1/X2",
      "S/BK"
    ],
    "points": [
      "NPN çıkışlı sensörü tanı.",
      "H1/X1'deki pozitif hattı bul.",
      "BK–H1/X2 dönüşünü takip et."
    ]
  }
};
for(const [id,t] of Object.entries(sensorLessonDetails)){
  const lesson=L.byId[id];
  if(!lesson||lesson.project?.wires?.length!==4||lesson.steps?.length!==4)throw Error('Sensor lesson changed: '+id);
  lesson.learningGoal=t.goal;lesson.summary=t.goal;
  lesson.explanation=t.task+' Yalnız sanal eğitim devresinde incele.';
  lesson.measurementUpgrade={...lesson.measurementUpgrade,goal:t.goal,task:t.task,question:t.q,options:clone(t.answers),observationPoints:clone(t.points)};
  lesson.beginnerSteps=['Cihazların model ve terminal adlarını tanı.',...t.points,'Sanal durumu gözlemle ve dört kabloyu yeniden kur.'];
  lesson.quiz={question:t.q,options:clone(t.answers),answer:0,why:t.goal};
}
L._sensorBatchJ=true;
})(typeof window==='undefined'?globalThis:window);
