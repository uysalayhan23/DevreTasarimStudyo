/* SC106–111: de-energized protection concepts, not field tests or safety certification. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._installationSafetyBatchR)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const C=(id,typeId,x,y,label)=>({id,typeId,x,y,rotation:0,ref:id.toUpperCase(),label});
const P=(id,title,goal,parts,edges,question,choices,note)=>({id,title,goal,parts,edges,question,choices,note});
const specs=[
 P('installation-grounding-src-05','Motor gövdesi ve PE',
  'Motorun metal gövdesi koruma iletkenine bağlanır; üç fazın çalışma akımı PE üzerinden dönmez.',
  [C('earth','ground',90,170,'PE referansı'),C('bar','bar-pe',360,180,'Koruma barası'),C('motor','motor-3p',760,165,'Motor gövdesi · PE')],
  [['earth','PE','bar','1'],['bar','2','motor','PE']],
  'Motor gövdesinin PE bağlantısı neden ayrı tutulur?',
  ['Gövdeyi koruma sistemine bağlamak için','Motorun hızını ayarlamak için','Üç fazın normal akımını taşımak için'],
  'Bu çizim koruma etkinliğini, kesici açma süresini veya gövde gerilimini hesaplamaz.'),
 P('installation-grounding-src-06','Prizde L, N ve PE ayrımı',
  'Prizde L, N ve PE farklı görevler üstlenir; topraklama temasının sağlamlığı yalnız görünüşle anlaşılmaz.',
  [C('earth','ground',85,160,'PE referansı'),C('xt','terminal-pe',360,170,'PE geçişi'),C('socket','socket-power',760,170,'Priz · L, N, PE')],
  [['earth','PE','xt','1'],['xt','2','socket','PE']],
  'Prizin PE ucunun sağlamlığı hakkında hangisi doğrudur?',
  ['Yalnız sanal çizim veya gözle bakmak yeterli değildir','N ucunu PE saymak yeterlidir','Prizin rengi elektriksel test yerine geçer'],
  'Canlı prizde ölçüm veya kabloya dokunma yönergesi verilmez; uygun testleri yetkili uzman yapar.'),
 P('installation-grounding-src-07','Topraklama direnci: ölçüm kavramı',
  'Topraklama direnci, koruma düzeninin değerlendirilmesinde önemlidir; bir çizgiyi bağlamak gerçek ölçüm değildir.',
  [C('earth','ground',105,175,'Topraklama referansı'),C('xt','terminal-pe',440,175,'Kontrol noktası · PE')],
  [['earth','PE','xt','1']],
  'Bu sanal çizim hangi sonucu verebilir?',
  ['Yalnız bağlantının kavramsal yerini gösterir','Topraklama direncini ohm cinsinden ölçer','Tesisatı güvenli ilan eder'],
  'Gerçek ölçüm özel cihaz, yöntem ve uzman değerlendirmesi gerektirir; burada direnç değeri üretilmez.'),
 P('installation-grounding-src-08','Yalıtkanlık direnci: ayrım kavramı',
  'Yalıtkanlık kontrolü, çalışma iletkenleriyle dokunulabilir bölümler arasındaki istenmeyen iletkenliği araştırır.',
  [C('pebar','bar-pe',105,170,'Ayrı PE noktası'),C('socket','socket-power',520,170,'Priz · L, N, PE')],
  [['pebar','1','socket','PE']],
  'Bir PE bağlantısı çizilince yalıtkanlık ölçümü yapılmış olur mu?',
  ['Hayır; bu yalnız sembolik bağlantıdır','Evet; her zaman sonsuz direnç çıkar','Evet; PE ucu ölçüm cihazının yerini tutar'],
  'Bu ders yüksek gerilimli test gerilimi uygulamaz, yalıtkanlık sonucu veya güvenlik kabulü üretmez.'),
 P('installation-grounding-src-09','Yıldırımdan korunma iniş yolu',
  'Yıldırımdan korunma sisteminde yakalama bölümü, iniş iletkeni ve topraklama düzeni birlikte değerlendirilir.',
  [C('head','terminal-pe',100,150,'Yakalama ucu · sembol'),C('down','terminal-pe',390,165,'İniş iletkeni · sembol'),C('earth','ground',790,175,'Topraklama referansı')],
  [['head','1','down','1'],['down','2','earth','PE']],
  'Yıldırımdan korunma çiziminden ne anlaşılır?',
  ['Güzergâhın kavramsal bölümleri','Gerçek yıldırım akımına dayanma garantisi','Her bina için aynı ölçüde yeterli koruma'],
  'Terminal simgeleri gerçek paratoner ürün modeli değildir; yıldırım akımı, ayırma mesafesi ve performans hesaplanmaz.'),
 P('installation-grounding-src-10','Kaçak akım koruması ve PE',
  'Kaçak akım koruma düzeni faz ve nötr akımlarının farkını izler; PE ayrı bir koruma yoludur.',
  [C('earth','ground',90,175,'PE referansı'),C('bar','bar-pe',350,175,'Ayrı PE barası'),C('socket','socket-power',770,175,'Priz · PE / L / N')],
  [['earth','PE','bar','1'],['bar','2','socket','PE']],
  'Kaçak akım koruma düzeni hangi büyüklüğü izler?',
  ['Faz ile nötrden geçen akımların farkını','PE iletkeninin rengini','Prizin toplam kablo uzunluğunu'],
  'RCD cihazı bu şemada modellenmez; açma akımı/süresi, test düğmesi ve koruma uygunluğu simüle edilmez.')
];
for(const spec of specs){
 const l=L.byId[spec.id],old=l?.project;
 if(!old||old.components?.length!==6||old.wires?.length!==6||!['push-no','coil-relay','contact-no','lamp-red'].every(t=>old.components.some(c=>c.typeId===t)))
  throw Error('Non-placeholder or missing grounding lesson: '+spec.id);
 const parts=spec.parts,ids=new Set(parts.map(c=>c.id));
 if(ids.size!==parts.length)throw Error('Duplicate component in '+spec.id);
 const wires=spec.edges.map(([a,p,b,q],index)=>{
  if(!ids.has(a)||!ids.has(b))throw Error('Missing endpoint in '+spec.id);
  return {id:'safety-r-'+spec.id.slice(-2)+'-'+(index+1),from:{c:a,p},to:{c:b,p:q},color:'#16a34a',role:'PE',size:'2.5',points:[],tutorialHint:'Sanal koruma güzergâhında '+a+'/'+p+' ve '+b+'/'+q+' noktalarını bul.',tutorialWhy:'Bu kablo yalnız kavramsal bir koruma güzergâhını gösterir; ölçüm veya koruma testi değildir.'};
 });
 const project=clone(old);delete project.intentionalElectricalIslands;
 l.project={...project,components:parts,wires,junctions:[],colorRoles:{...(project.colorRoles||{}),'#16a34a':'PE'},tutorialLesson:{...(old.tutorialLesson||{}),phase:'quiz'},tutorialExplore:{type:'unpowered-protection-concept',simulationOnly:true,protectivePerformanceModelled:false,devicePerformanceModelled:false}};
 l.kind='quiz';l.steps=[];
 l.summary=spec.goal;l.learningGoal=spec.goal;
 l.explanation=spec.title+': '+spec.goal+' '+spec.note+' Bu enerjisiz sanal bir gösterimdir.';
 l.safety='Gerçek tesisat bağlantısı, enerjili priz ölçümü veya koruma testi yapılmaz. Bu kavramları gerçek ortamda yalnız yetkili kişiler değerlendirir.';
 l.beginnerSteps=['Şemadaki PE bağlantısını ve ayrı kalan uçları tanı.','Bu konuyla ilgili hangi davranışın burada modellenmediğini öğren.','Soruyu yanıtla; sanal çizimi gerçek güvenlik testiyle karıştırma.'];
 l.materials=parts.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,why:'Yalnız kavramsal, enerjisiz gösterim.'}));
 l.quiz={question:spec.question,options:spec.choices,answer:0,why:spec.goal};
 l.pedagogyReview={...(l.pedagogyReview||{}),reviewed:true,codeImplemented:true,simulationOnly:true,simulationAcceptance:false,visualAcceptance:false,protectivePerformanceModelled:false,sourceStatus:'unpowered-protection-concept'};
}
L._installationSafetyBatchR=true;
})(typeof window==='undefined'?globalThis:window);
