/* Source-based questions for SC143 NTC, SC153 LDR dimmer, SC154 optical sensor. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sensorSourceBatchW)return;
const rows=[
 {suffix:'01',graph:'NTC_THERMAL_LOADED_SWITCH_SOURCE_ALIGNED',parts:13,wires:19,
  required:['sensor-ntc','lm358p-dip8','irf540n-mosfet','standard-light'],
  summary:'B1 NTC ısınırken hangi sanal değişimi gözlemlemeyi beklersin?',
  options:['NTC direnci düşer, LM358P eşik geçildiğinde H1 yanabilir.','NTC otomatik olarak PNP üç telli sensöre dönüşür.','Sensör direnci ile referans gerilimi her koşulda aynı kalır.'],
  why:'Bu dersin yazılımsal modeli NTC ve R1 bölücüsünü 12 V referansla karşılaştırır. 15 °C ile 35 °C sanal durumlarını karşılaştır; değerler gerçek cihaz garantisi değildir.',
  steps:['Önce B1 NTC ile R1 direncinin giriş bölücüsünü, R2/R3 ile oluşturulan referansı ayırt et.','Sanal sıcaklık 15 °C iken H1 gözlemini not et; ardından 35 °C için karşılaştır.','U1 çıkışı ile Q1 yük yolunun ayrı işlevlerini açıkla.','Gerçek LM358P/IRF540N sıcaklık ve akım sınırlarının bu deneyle doğrulanmadığını unutma.']},
 {suffix:'11',graph:'VIRTUAL_DC_LINEAR_DIMMER_SOURCE_ALIGNED',parts:5,wires:7,
  required:['ldr-gl5528','resistor','mosfet-n','standard-light'],
  summary:'Sanal LDR devresinde ışık arttığında lambanın gücü neden artabilir?',
  options:['LDR direnci azalır, Q1 gate gerilimi yükselir ve sanal DC lamba akımı artar.','Devre kendiliğinden AC faz açısı dimmerine dönüşür.','LDR koruma toprağını enerji kaynağı olarak kullanır.'],
  why:'12 VDC sanal GL5528 bölücüsü gate gerilimini etkiler. H1 için çizilen parlaklık gerçek lümen veya fiziksel MOSFET gücü kabulü değildir.',
  steps:['B1 LDR, R1 ve Q1 sanal kontrol bloğuyla H1 yükünü ayrı ayrı tanı.','Sanal 0,1 lux ile 100 ve 1000 lux durumlarında parlaklık eğilimini karşılaştır.','Bu örneğin DC lineer kontrol olduğunu, AC şebeke dimmeri olmadığını açıkla.','Gerçek IRF540N ısınması ve ürün performansı için onay verilmediğini not et.']},
 {suffix:'12',graph:'VIRTUAL_OPTICAL_SOURCE_ALIGNED',parts:5,wires:7,
  required:['sensor-through-beam','coil-relay','contact-no','lamp-green'],
  summary:'Sanal optik sensör hedefi 80 mm yerine 2 mm yakında gördüğünde ne beklenir?',
  options:['PNP BK çıkışı K1 rölesini kumanda eder; H1 göstergesi yanabilir.','Gerçek ayrı verici/alıcı çiftinin fiziksel uygunluğu kanıtlanır.','B1 sensör beslemesi kapalıyken K1 yine kesin çalışır.'],
  why:'Bu sanal B1 modeli 40 mm algılama sınırına göre hedef varlığını gösterir. Gerçek gönderici/alıcı çifti ve üretici performansı modellenmemiştir.',
  steps:['B1 sanal optik modülünü, K1 bobinini ve H1 göstergeyi ayırt et.','Sanal hedefin 80 mm uzak ve 2 mm yakın olduğu iki durumu karşılaştır.','B1 sinyalinin K1 yardımcı kontağı üzerinden H1 gösterimini nasıl etkilediğini anlat.','Tek sanal sensörün iki gerçek fiziksel modülün doğrulanmış yerini tutmadığını hatırla.']}
];
for(const row of rows){
 const id='sensor-analog-apps-src-'+row.suffix,lesson=L.byId[id];
 if(!lesson||lesson.topicId!=='sensor-analog-apps'||lesson.kind!=='wiring')throw Error('Sensor source not found '+id);
 if(lesson.designStandard==='rich-reference-v1'||lesson.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
 const project=lesson.project;
 if(lesson.pedagogyReview?.titleTopologyStatus!==row.graph||
    project?.components?.length!==row.parts||project?.wires?.length!==row.wires||
    lesson.steps?.length!==row.wires)throw Error('Canonical graph unexpectedly changed '+id);
 for(const type of row.required)if(!project.components.some(c=>c.typeId===type))throw Error('Expected sensor device not found '+id+'/'+type);
 const expected='“'+lesson.title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(lesson.quiz?.question!==expected||lesson.quiz?.answer!==0||
    !Array.isArray(lesson.quiz.options)||lesson.quiz.options.length!==3)
   throw Error('Specific source quiz already present '+id);
 const oldProject=JSON.stringify(project),oldSteps=JSON.stringify(lesson.steps);
 lesson.quiz={question:row.summary,options:[...row.options],answer:0,why:row.why};
 lesson.beginnerSteps=[...row.steps];
 lesson.pedagogyReview={...lesson.pedagogyReview,specificQuizVersion:'v1.19.20-sensor-source-batch-w',
  sourceCircuitPreserved:true,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 if(oldProject!==JSON.stringify(lesson.project)||oldSteps!==JSON.stringify(lesson.steps))
   throw Error('Sensor virtual circuit changed '+id);
}
L._sensorSourceBatchW=true;
})(typeof window==='undefined'?globalThis:window);