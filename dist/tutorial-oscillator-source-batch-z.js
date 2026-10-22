/* SC182–189: precise oscillator theory and virtual two-BD139 questions.
   Existing oscillator HOLD, transistor graphs, native switching and acceptance flags stay locked. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._oscillatorSourceBatchZ)return;
const lessons=[
 ['01','Colpitts osilatör',0,4,
  'Colpitts osilatörde geri besleme oranını hangi eleman grubu belirler?',
  ['LC ağındaki iki kondansatörün oluşturduğu kapasitif bölücü','Yalnız bir rölenin normalde açık kontağı','Tek başına besleme geriliminin kutbu'],
  'İki kapasitenin oranı geri beslemeyi; bobin ve eşdeğer kapasite rezonansı etkiler. Burada bağlanmış osilatör veya ölçülmüş frekans yoktur.'],
 ['02','Hartley osilatör',0,4,
  'Hartley osilatörün geri beslemesini Colpitts’ten ayıran temel parça hangisidir?',
  ['Bölünmüş/endüktif bobin yolu ya da bobin tap noktası','Colpitts tipi iki kondansatör bölücüsü','Ayrı bir dijital saat sayacı'],
  'Hartley endüktif geri besleme kullanır. Bobin ve kondansatörün şemada yan yana görünmesi salınım kanıtı değildir.'],
 ['03','Kristal osilatör',0,4,
  'Bu kristal osilatör referansında kuvars rezonatörün temel katkısı nedir?',
  ['Dar bantlı rezonansla frekans kararlılığına katkı sağlamak','Dış sürücü olmadan devreyi otomatik beslemek','Her koşulda tam 4 MHz çıkışın ölçüldüğünü kanıtlamak'],
  'Kristal uygun osilatör sürücüsü ve yük koşullarıyla kullanılır. Referans materyalinde çalışan sürücü veya ölçülmüş çıkış bulunmaz.'],
 ['04','RC faz kaymalı osilatör',0,7,
  'RC faz kaymalı osilatörün salınım koşulunda hangi iki etki birlikte gerekir?',
  ['RC kademelerinin faz kaydırması ve aktif yükseltecin yeterli çevrim kazancı','Kondansatörleri yalnız aynı sırada dizmek','Bir filtreyi çıkışa bağlamadan doğrudan ses ürettiğini varsaymak'],
  'RC ağı fazı değiştirir; aktif geri besleme döngüsünün faz ve kazanç koşulu ayrıca sağlanmalıdır. Çalışan bağlantı henüz yoktur.'],
 ['05','Wien köprü osilatörü',0,5,
  'Eşit R ve C varsayımıyla Wien köprüsü hangi özelliği seçmeye yardım eder?',
  ['Yaklaşık 1/(2πRC) frekansındaki uygun geri besleme noktasını','Herhangi bir frekansta kazançsız osilasyonu','Ölçüm yapılmadan gerçek cihazın frekans kararlılığını'],
  'Wien RC köprüsü frekans seçer. Genlik denetimi ve yeterli aktif kazanç ayrıca gerekir; bağlantılı devre yoktur.'],
 ['06','Transistörlü tek kararlı multivibratör',21,13,
  'Sanal iki-BD139 tek kararlı devrede S1 kısa tetiklemesinden sonra ne olur?',
  ['Yaklaşık 693 ms darbenin ardından devre kararlı başlangıç durumuna döner','SET ve RESET ile son durum sonsuza kadar saklanır','Q1 ve Q2 sürekli, tetiklemesiz sırayla yanar'],
  'Tek kararlı model geçici darbe üretir, tuş basılıyken kendini tekrar tetiklemez. Süre ideal RB2×C1×ln2 modelidir.',
  ['S1’in darbe tetikleyicisi olduğunu ve Q1/Q2’nin ayrı görevlerini tanı.','Sanal S1 bas/bırak sonrasında yaklaşık 693 ms geçici Q1 durumu ile Q2 kararlı durumunu karşılaştır.','Bu ideal darbe modelinin fiziksel BD139 veya SPICE doğrulaması olmadığını hatırla.']],
 ['07','Transistörlü çift kararlı multivibratör',20,13,
  'Sanal iki-BD139 çift kararlı devrede SET bırakıldığında ne gerçekleşir?',
  ['Son seçilen durum, RESET verilinceye kadar sanal bellekte kalır','Devre her 693 ms’de otomatik olarak yön değiştirir','İki buton aynı anda basıldığında gerçek cihaz güvenliği doğrulanmış olur'],
  'Çapraz bağlı iki BD139, sanal SET/RESET belleği olarak modellenir. Her iki komutun birlikte verilmesi yalnız yazılımda güvenli kapalı çıkış üretir.',
  ['Q1 ve Q2 çapraz geri besleme kollarını, S1 SET ile S2 RESET’i ayırt et.','Sanal SET bas/bırak ve RESET bas/bırak durumlarında Q1/Q2 bellek durumunu karşılaştır.','Gerçek metastabilite, üretici toleransı veya fiziksel güvenlik kabulü verilmediğini belirt.']],
 ['08','Transistörlü kararsız multivibratör',14,9,
  'Sanal iki-BD139 kararsız multivibratörde tetikleme olmadan hangi değişim görülür?',
  ['Q1 ve Q2 ideal çapraz RC zamanlamayla dönüşümlü iletime geçer','Bir kez SET basıldıktan sonra çıkış sonsuza kadar sabit kalır','İki transistör de yalnız manüel STOP ile kapanabilir'],
  'İdeal simülatörde her yarım periyot yaklaşık 693 ms, tam periyot yaklaşık 1,386 s ve frekans yaklaşık 0,721 Hz’dir.',
  ['Q1 ve Q2’nin çapraz C1/C2 yollarını ve RB1/RB2 zamanlama dirençlerini tanı.','Sanal zaman ilerledikçe Q1 ve Q2’nin dönüşümlü durumlarını izle; yaklaşık 0,721 Hz ideal frekansı yorumla.','Bu sayıları fiziksel BD139 osilasyon veya SPICE kabulü sayma.']]
];
for(const [suffix,title,wires,parts,question,options,why,steps] of lessons){
 const id='oscillator-filter-apps-src-'+suffix,l=L.byId[id];
 if(!l||l.topicId!=='oscillator-filter-apps'||l.title!==title||!l.project||l.project.wires.length!==wires||
    l.project.components.length!==parts||l.steps?.length!==(wires||0))
   throw Error('Locked oscillator source not matched '+id);
 if(wires===0){
   if(l.kind!=='quiz'||l.project.referenceOnly!==true||l.pedagogyReview?.titleTopologyIssue!=='NO_WIRED_CIRCUIT')throw Error('Unwired oscillator unexpectedly converted '+id);
 }else{
   if(l.kind!=='wiring'||l.pedagogyReview?.nativeDynamicAcceptance!==false)throw Error('Protected BD139 dynamics changed '+id);
   if(l.project.components.filter(c=>c.typeId==='bd139-npn').length!==2||
      !l.project.components.some(c=>c.mq07StandaloneBjtMonostable||c.mq07StandaloneBjtBistable||c.mq07StandaloneBjtAstable))
     throw Error('Locked two-BD139 graph absent '+id);
 }
 if(l.pedagogyReview?.physicalAcceptance!==false||
    l.pedagogyReview?.independentPedagogicalAcceptance!==false)throw Error('Unexpected acceptance change '+id);
 const generic='“'+title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(l.quiz?.question!==generic||l.quiz.answer!==0||l.quiz.options?.length!==3)
   throw Error('Existing source-specific question: preserve '+id);
 const canonicalProject=JSON.stringify(l.project),canonicalSteps=JSON.stringify(l.steps);
 l.quiz={question,options:[...options],answer:0,why};
 if(steps)l.beginnerSteps=[...steps];
 l.pedagogyReview={...l.pedagogyReview,oscillatorSourceQuizVersion:'v1.19.20-oscillator-batch-z',
  circuitPreserved:true,physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 if(JSON.stringify(l.project)!==canonicalProject||JSON.stringify(l.steps)!==canonicalSteps)
   throw Error('Oscillator electrical source changed '+id);
}
L._oscillatorSourceBatchZ=true;
})(typeof window==='undefined'?globalThis:window);