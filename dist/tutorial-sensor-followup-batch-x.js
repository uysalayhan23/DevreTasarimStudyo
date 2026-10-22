/* SC157–164: source-specific sensor teaching, no invented circuit acceptance. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sensorFollowupBatchX)return;
const specs=[
 {n:'15',parts:5,wires:2,kind:'quiz',title:'Güneş pili uygulaması',
 q:'Bir güneş hücresinde açık devre gerilimi ile yük bağlandığındaki gerilim aynı mıdır?',
 opts:['Her zaman değil; ışınım ve yük çalışma noktasını etkiler.','Evet, yükten bağımsız daima sabittir.','Güneş hücresi PNP yakınlık sensörüdür.'],
 why:'Buradaki güneş pili ve prob görselleri kavramsal referanstır; pil uçlarıyla tamamlanmış, ölçülmüş bir yük devresi bulunmuyor.',
 guide:['Güneş hücresini, yük direncini ve ölçüm aracını ayrı kavramlar olarak tanı.','Yalnız prob fişlerinin bağlı olmasını güneş hücresinin ölçüldüğü anlamına getirme.','Işık ve yük değişince ölçülen değerin değişebileceğini açıkla; burada sayı uydurma.']},
 {n:'16',parts:4,wires:8,kind:'wiring',title:'Alkışla çalışan devre',
 q:'Sanal ses eşiği algılandığında program, sensör DO sinyalini hangi yoldan buzzer komutuna çevirir?',
 opts:['UNO D2 girişini okuyup D9 çıkışını değiştirir.','Sensör doğrudan 230 V şebeke çıkışı üretir.','Buzzer yalnız rölenin NC kontağıyla çalışır.'],
 why:'Katalogdaki ses sensörü DO çıkışı UNO D2’ye bağlıdır; sanal UNO programı D9 üzerinden buzzer kontrol sinyali üretir. Gerçek desibel kalibrasyonu değildir.',
 guide:['5 V sanal kaynak, sensör, UNO ve buzzer görevlerini karşılaştır.','Sensör DO bilgisinin UNO D2’de okunduğunu ve D9 kontrolü ürettiğini gör.','120→800→120 sanal ses düzeyi değişimini örnek programın sonucuyla karşılaştır; gerçek mikrofon kabulü yapma.']},
 {n:'17',parts:3,wires:0,kind:'quiz',title:'Sensörlerde enerji dönüşümü',
 q:'NTC, termokupl ve piezo öğeleri hangi elektriksel değişimi örnekler?',
 opts:['Sırasıyla direnç değişimi, sıcaklık farkına bağlı gerilim ve mekanik etkiden elektriksel tepki.','Üçü de yalnız manyetik alanla PNP çıkış üretir.','Üçü de aynı sensörün farklı kablo rengidir.'],
 why:'NTC, termokupl ve piezo örnekleri farklı dönüştürme prensiplerini gösterir. Referans kartlarında çalışan ölçüm devresi yoktur.',
 guide:['NTC için direnç, termokupl için sıcaklık farkı, piezo için mekanik etki kavramlarını ayır.','Bu kartlardaki sembollerin tek başına ölçüm devresi olmadığını belirt.','Sinyalin nasıl ölçüleceği için ek devre ve üretici bilgisi gerektiğini fark et.'],
 refs:[['sensor-ntc','NTC · direnç değişimi'],['thermocouple','Termokupl · sıcaklık farkından gerilim'],['tutorial-piezo','Piezo · mekanik etkiye elektriksel tepki']]},
 {n:'18',parts:3,wires:0,kind:'quiz',title:'Otomobillerde kullanılan sensörler',
 q:'Araçta sıcaklık, hareket/konum ve yaklaşma bilgileri neden tek bir sensörle temsil edilmez?',
 opts:['Farklı fiziksel büyüklükler farklı algılama ilkeleri gerektirir.','Çünkü her sensörün çıkışı daima aynı voltajdadır.','Yalnız sensörün kasasının rengi önemlidir.'],
 why:'Hall, NTC ve endüktif sensörler yalnız algılama ilkesi örnekleridir. Belirli bir araca uygun parça veya ECU bağlantısı doğrulanmış değildir.',
 guide:['Sıcaklık için NTC, manyetik hareket/konum için Hall, metal yaklaşımı için endüktif örneği incele.','Bu genel katalog örneklerinin araç tipi veya ECU bağlantısı kabulü olmadığını ayırt et.','Gerçek araç üreticisinin elektriksel değerleri bu sayfada doğrulanmadı.'],
 refs:[['sensor-hall','Hall · manyetik hareket/konum ilkesi'],['sensor-ntc','NTC · sıcaklık algılama ilkesi'],['proximity','Endüktif · metal yaklaşma ilkesi']]},
 {n:'19',parts:3,wires:0,kind:'quiz',title:'Sıcaklık ölçümünde sensör seçimi',
 q:'NTC, PT100 ve termokupl arasındaki temel ölçüm farkı nedir?',
 opts:['NTC/PT100 direnç değişimi, termokupl sıcaklık farkına bağlı gerilim üretimi kullanır.','Hepsi üç telli PNP yaklaşım çıkışıdır.','Hepsi aynı termal eğri ve aynı pinlere sahiptir.'],
 why:'NTC ile PT100 direnç ilkesi paylaşsa da karakteristikleri farklıdır; termokuplun sinyali termoelektrik gerilimdir. Yalnız kavram görselleri vardır.',
 guide:['NTC ve PT100 direnç özelliklerini, termokuplun gerilim ilkesini karşılaştır.','Üç elemanın da kendi ölçüm katı ve bağlantı tanımı gerektiğini öğren.','Katalog görsellerinden doğruluk veya gerçek kablolu ölçüm sonucu çıkarma.'],
 refs:[['sensor-ntc','NTC · sıcaklığa bağlı direnç'],['sensor-pt100','PT100 · platin direnç'],['thermocouple','Termokupl · termoelektrik gerilim']]},
 {n:'20',parts:5,wires:7,kind:'wiring',title:'Hall etkili sensör yapımı',
 q:'Sanal mıknatıs Hall sensörüne yaklaştırıldığında H1 neden yanabilir?',
 opts:['B1 BK PNP algılama çıkışı K1 bobinini etkinleştirir; K1 NO kontağı H1 yükünü anahtarlar.','Mıknatıs doğrudan H1 için 24 V üreten pil haline gelir.','H1 yalnız sıcaklık sensörünün direnciyle çalışır.'],
 why:'Bu devre yalnız sanal manyetik algılama, K1 röle bobini ve H1 gösterge yolunu içerir; gerçek sensör tasarım/üretim deneyi değildir.',
 guide:['B1 Hall sensörü ile K1 bobinini ve H1 göstergeyi ayır.','Mıknatıs uzaktayken ve yakınken sanal algılama sonucunu karşılaştır.','K1 yardımcı kontağının ayrı yük yolunu etkilediğini gözlemle; fiziksel kabul çıkarma.']},
 {n:'21',parts:3,wires:0,kind:'quiz',title:'Güneş pilli bahçe aydınlatma ve şarj sensörü',
 q:'Bahçe ışığında güneş hücresi, pil ve lamba hangi ayrı görevleri üstlenir?',
 opts:['Üretim, depolama ve elektriksel yük görevlerini.','Üçü de şarj denetleyicisi olarak çalışır.','Güneş hücresi akü korumasını tek başına doğrular.'],
 why:'Bu kartta şarj denetleyicisi, gece/gündüz algılama ve güvenli pil yönetimi kablolanmamış veya simüle edilmemiştir.',
 guide:['Güneş pili, depolama birimi ve aydınlatma yükünün görevlerini ayırt et.','Güvenli şarj yönetimi ve gün ışığı algılamasının bu kartta gösterilmediğini belirt.','Üç referans sembolünü çalışan şarj devresi olarak kabul etme.']},
 {n:'22',parts:5,wires:7,kind:'wiring',title:'Optik sensör yapımı',
 q:'Sanal optik hedef algılama mesafesine girdiğinde yük göstergesi neden değişir?',
 opts:['B1 BK PNP sinyali K1 bobinini sürer; K1 NO kontağı H1 yolunu kapatır/açar.','Optik hedef doğrudan AC şebeke enerjisi üretir.','Sanal algılama için röle bobininin bağlantısı önemsizdir.'],
 why:'Bu birleştirilmiş sanal optik sensör ve röle örneğidir; ayrı gerçek verici/alıcı donanım çifti ve üretici testi değildir.',
 guide:['B1 optik sensör, K1 röle ve H1 göstergenin görevlerini tanı.','Sanal hedef uzaktayken ve yakındayken sensör ile lambanın durumunu karşılaştır.','Tek sanal sensör kartının gerçek fiziksel verici/alıcı çiftini doğrulamadığını fark et.']}
];
const list=[];
for(const s of specs){
 const id='sensor-analog-apps-src-'+s.n,l=L.byId[id];if(!l||l.topicId!=='sensor-analog-apps'||l.kind!==s.kind||l.title!==s.title)throw Error('Sensor lesson altered '+id);
 const p=l.project;
 if(p.components?.length!==s.parts||p.wires?.length!==s.wires||l.steps?.length!==(s.kind==='quiz'?0:s.wires))throw Error('Sensor graph size changed '+id);
 if(s.kind==='quiz'&&p.referenceOnly!==true)throw Error('Concept acceptance changed '+id);
 if(s.kind==='wiring'&&p.referenceOnly===true)throw Error('Wire lesson changed '+id);
 const expected='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(l.quiz?.question!==expected||l.quiz.answer!==0||l.quiz.options?.length!==3)throw Error('Specific quiz already exists '+id);
 const originalProject=JSON.stringify(p),originalSteps=JSON.stringify(l.steps),oldReview={...l.pedagogyReview};
 if(s.refs){
  if(s.kind!=='quiz'||p.wires.length!==0||p.components.some((c,i)=>!['proximity','capacitive-detector','photoeye'][i]||c.typeId!==['proximity','capacitive-detector','photoeye'][i]))throw Error('Concept donor unexpectedly changed '+id);
  const oldTypes=p.components.map(c=>c.typeId);
  p.components.forEach((c,i)=>{c.typeId=s.refs[i][0];c.label=s.refs[i][1]});
  l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,
   why:'Yalnız kavramsal katalog örneği; bu sayfada kablolu simülasyon, fiziksel model veya üretici testi bulunmaz.'}));
  l.pedagogyReview={...l.pedagogyReview,previousConceptComponents:oldTypes,componentIds:p.components.map(c=>c.typeId)};
 }
 l.quiz={question:s.q,options:[...s.opts],answer:0,why:s.why};
 l.beginnerSteps=[...s.guide];
 l.pedagogyReview={...l.pedagogyReview,sourceSpecificQuizVersion:'v1.19.20-sensor-followup-batch-x',
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  sourceCircuitPreserved:!s.refs,conceptualMaterialsCorrected:!!s.refs};
 if(JSON.stringify(l.steps)!==originalSteps||(!s.refs&&JSON.stringify(l.project)!==originalProject))throw Error('Protected circuit modified '+id);
 if(l.pedagogyReview.titleTopologyStatus!==oldReview.titleTopologyStatus||l.pedagogyReview.titleTopologyIssue!==oldReview.titleTopologyIssue)throw Error('Review altered '+id);
 list.push(id);
}
L._sensorFollowupBatchX=true;
L._sensorFollowupBatchXTargets=list;
})(typeof window==='undefined'?globalThis:window);