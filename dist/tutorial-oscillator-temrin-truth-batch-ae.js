/* SC242-248: correct oscillator TEMRIN source claims without modifying native or locked two-BD139 models. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._oscillatorTemrinTruthBatchAE)return;
const rows=[
 ['061',['arduino-bd139','reactor','capacitor'],
  'Hartley osilatöründe geri besleme ne üzerinden alınır?',
  ['Tapli veya manyetik kuplajlı endüktans üzerinden','Colpitts gibi yalnız iki kondansatör bölücüsü üzerinden','Bobin ve transistör simgeleri bağlantısızken doğrudan çıkıştan'],
  'Hartley geri beslemesi endüktiftir. Bu kartta tek bobin, bir kondansatör ve BD139 gösterilir; tap/kuplaj veya tamamlanmış osilatör devresi yoktur.',
  ['Hartley için rezonans tankını ve endüktif geri besleme tap noktasını kavramsal olarak ayır.','Ekrandaki üç parçanın bağlantısız olduğunu gör; buradan ölçülmüş frekans çıkarma.']],
 ['062',['hc49-4mhz-crystal','arduino-bd139','arduino-capacitor-100n'],
  'Kristal osilatörde kararlı bir sinyal üretimi için kristalin yanında ne gerekir?',
  ['Uygun sürücü, geri besleme ve yük şartları','Kristalin bağlantısız durması','Üzerindeki 4 MHz yazısının ölçülmüş çıkış sayılması'],
  'Kuvars kristal frekans seçen rezonatördür; bu kartta bağlantılı sürücü, yük kapasitesi veya ölçülmüş 4 MHz dalga yoktur.',
  ['HC49 kristali, BD139 ve kondansatörü birer katalog referansı olarak tanı.','Kristalin üzerinde yazan değeri gerçek çıkış ölçümüyle karıştırma.']],
 ['063',['lm358p-dip8','resistor','capacitor'],
  'RC faz kaymalı osilatörde salınım için R-C elemanlarına ek olarak ne gerekir?',
  ['Faz ve kazanç koşulunu sağlayan aktif geri besleme çevrimi','Kablolanmadan yalnız LM358P resmine bakmak','Bir direnci tek başına enerji kaynağı olarak saymak'],
  'RC faz kayması tek başına periyodik çıkış değildir. Burada yalnız LM358P, R ve C katalog öğeleri var; bağlantı veya faz/kazanç ölçümü yok.',
  ['RC ağının faz etkisini, aktif yükseltecin gerekli çevrim kazancından ayır.','Bu kartın bağlı üç kademeli RC osilatör şeması olmadığını öğren.']],
 ['064',['lm358p-dip8','resistor','capacitor'],
  'Wien köprü osilatöründe RC köprüsü hangi amaçla kullanılır?',
  ['Uygun frekans çevresinde seçici geri besleme oluşturmak','Harici besleme olmadan kendi başına güç üretmek','Tüm frekanslarda aynı genlik kararlılığını garanti etmek'],
  'Wien köprüsünde seri/paralel RC oranı frekans seçer; aktif kazanç ve genlik denetimi gerekir. Bu kartta ikisi de bağlı ve ölçülmüş değildir.',
  ['Wien köprüsünün frekans seçme işlevini, yükseltecin kazanç görevinden ayır.','Görünen R/C/LM358P referansını çalışan sinüs osilatörü kabul etme.']],
 ['065',['arduino-bench-supply','push-no','resistor','bd139-npn','resistor','unit-ut33d-plus','test-probe-red','test-probe-black'],
  'Bu sanal şema neden gerçek bir tek kararlı multivibratör deneyini göstermiyor?',
  ['Yalnız bir BD139, buton ve dirençli anahtarlama yolu içeriyor; zamanlama RC ve ikinci transistor yok.','Yalnız bir butona basmak otomatik 693 ms tek darbe üretir.','Voltmeter takılı olması ikinci kararlı durum üretir.'],
  'Kaynak bağlantıları tek BD139 anahtarı gösterir; RC zamanlaması ve iki-BJT geçici darbe düzeni yok. Önceki kilitli iki-BD139 tek kararlı sanal model ayrı derstedir; buraya aktarılmamıştır.',
  ['Sanal S1 bırakılmış ve basılmışken Q1 anahtarlama farkını incele.','Bu örnekte ikinci BD139 ve zamanlama kondansatörü bulunmadığını belirle.','Tek kararlı multivibratör için geçici darbe ve kararlı duruma dönüşün ayrıca gerektiğini öğren.']],
 ['066',['arduino-bench-supply','push-no','resistor','bd139-npn','resistor','unit-ut33d-plus','test-probe-red','test-probe-black'],
  'Bu şema neden çift kararlı multivibratörün SET/RESET belleğini kanıtlamaz?',
  ['Tek BD139 ve tek buton vardır; ikinci durum kolu ve çapraz geri besleme bulunmaz.','Tek buton bırakılınca her zaman iki farklı kalıcı bellek durumu oluşur.','Voltmetrenin V/COM uçları iki transistor gibi görev yapar.'],
  'Kaynak, yalnız BD139 butonlu anahtarlama örneğidir. SET/RESET ve iki transistorlu bellek topolojisi bulunmaz; kilitli iki-BD139 çift kararlı dersine dokunulmamıştır.',
  ['Sanal butonun Q1 üzerindeki bas-bırak etkisini, durum saklamayla karıştırma.','SET/RESET ve çapraz bağlı ikinci aktif kola neden ihtiyaç olduğunu kavramsal olarak açıkla.','Bu karttan gerçek bistable bellek kabulü çıkarma.']],
 ['067',['arduino-bench-supply','push-no','resistor','bd139-npn','resistor','unit-ut33d-plus','test-probe-red','test-probe-black'],
  'Bu tek BD139 şeması neden kendiliğinden çalışan kararsız multivibratör değil?',
  ['İkinci transistor ve çapraz RC geri besleme olmadan periyodik salınım ağı yoktur.','Her 1 kΩ direnç 0,721 Hz dalga üretir.','Tek buton otomatik ikinci bir kapasitör oluşturur.'],
  'Kaynakta tek BD139, bir buton ve iki direnç bulunur: periyodik iki-BJT osilatör veya ölçülmüş dalga yoktur. Kilitli sanal iki-BD139 kararsız model başka derstedir.',
  ['Q1 anahtarlama davranışıyla iki transistörün dönüşümlü anahtarlamasını ayır.','İkinci BD139 ve çapraz zamanlama kondansatörünün eksikliğini belirle.','Önceden doğrulanmış ideal iki-BD139 frekansını bu farklı kaynağın ölçümü gibi sunma.']]
];
for(const [suffix,types,question,options,why,guide] of rows){
 const id='oscillator-filter-apps-outline-'+suffix,l=L.byId[id];
 if(!l||l.topicId!=='oscillator-filter-apps'||!l.project||l.project.components.length!==types.length||
    l.project.components.some((c,i)=>c.typeId!==types[i]))throw Error('Oscillator source changed '+id);
 const concept=Number(suffix)<=64,wires=concept?0:8;
 if(l.project.wires.length!==wires||l.steps?.length!==wires||
  l.kind!==(concept?'quiz':'wiring')||
  (concept&&l.project.referenceOnly!==true)||(!concept&&l.project.referenceOnly===true))
   throw Error('Source graph/lesson kind unexpectedly changed '+id);
 if(!concept){
  if(l.project.components.filter(c=>c.typeId==='bd139-npn').length!==1||
     l.project.components.some(c=>c.typeId==='capacitor'||c.typeId==='arduino-capacitor-100n'||c.typeId==='arduino-capacitor-100u'))
    throw Error('Previously repaired two-BD139 source: do not overwrite '+id);
 }
 const generic='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(l.quiz?.question!==generic||l.quiz?.answer!==0||l.quiz?.options?.length!==3)
   throw Error('Source quiz already customized '+id);
 if(l.pedagogyReview?.nativeDynamicAcceptance===true||l.pedagogyReview?.physicalAcceptance===true||
    l.pedagogyReview?.independentPedagogicalAcceptance===true)throw Error('Accepted source: preserve '+id);
 const protectedData=JSON.stringify([l.project,l.steps,l.materials,l.kind,l.title,l.topicId]);
 l.quiz={question,options:[...options],answer:0,why};
 l.beginnerSteps=[...guide];
 l.explanation=why+' '+l.explanation;
 if(!concept){
  l.summary='Bu dersin başlığı multivibratör temrinidir; ancak kayıtlı sanal şema yalnız tek BD139 ve butonlu bir anahtarlama devresidir. Zamanlama darbesi, iki kararlı bellek veya sürekli osilasyon bu şemada doğrulanmamıştır.';
 }else{
  l.summary='Bu Hartley/kristal/RC/Wien osilatör temrininin bu sayfası yalnız katalog malzemelerini karşılaştırır; bağlı osilatör ve ölçülmüş çıkış yoktur. '.replace('Hartley/kristal/RC/Wien',suffix==='061'?'Hartley':suffix==='062'?'kristal':suffix==='063'?'RC faz kaymalı':'Wien köprü')+l.summary;
 }
 l.pedagogyReview={...l.pedagogyReview,titleTopologyStatus:'REVIEW',
  titleTopologyIssue:concept?'NO_WIRED_OSCILLATOR':'SINGLE_BD139_SWITCH_NOT_MULTIVIBRATOR',
  nativeDynamicAcceptance:false,physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,
  sourceTruthQuizVersion:'v1.19.20-oscillator-temrin-ae',sourceCircuitPreserved:true};
 if(protectedData!==JSON.stringify([l.project,l.steps,l.materials,l.kind,l.title,l.topicId]))
  throw Error('Oscillator graph/locked resource modified '+id);
}
L._oscillatorTemrinTruthBatchAE=true;
})(typeof window==='undefined'?globalThis:window);