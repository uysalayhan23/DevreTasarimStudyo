/* SC235–241 · conceptual FM and oscillator study cards; no virtual RF broadcast or wired solver claim. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._modulationConceptBatchAD)return;
const specs=[
 ['054','MODULATION_DEMODULATION_RF_CHAIN_UNWIRED',['tutorial-rf-transmitter','tutorial-rf-receiver','arduino-signal-generator'],
  'Modülasyon ve demodülasyonun görevleri nasıl farklıdır?',
  ['Vericide bilgi bir taşıyıcıya işlenir; alıcıda taşınan bilgi geri elde edilir.','Modülasyon, kablosuz elemanları doğrudan devreye bağlamaktır.','Demodülasyon, taşıyıcı frekansını her zaman sıfıra düşürmektir.'],
  'Bu kartta RF verici, alıcı ve bilgi işareti sembolleri yalnız referanstır; gerçek sinyal aktarımı veya ölçümü yoktur.',
  ['Bir mesajı taşıyıcıyla göndermek ve alıcıda mesajı yeniden okumak arasındaki farkı düşün.','Verici, alıcı ve bilgi işareti öğelerini ayrı tanı; aralarında henüz kablo bulunmadığını gör.','Bu konuyu doğrulanmış RF yayın veya demodülasyon deneyi diye anlatma.']],
 ['055','FM_TRANSMITTER_DEVIATION_UNWIRED',['tutorial-rf-transmitter','arduino-signal-generator'],
  'FM vericisinde bilgi işareti taşıyıcıda hangi özelliği değiştirir?',
  ['Taşıyıcının anlık frekansını.','Yalnız taşıyıcının kablo rengini.','Bütün taşıyıcıyı daima sabit DC gerilime dönüştürür.'],
  'FM, frekans değişimiyle bilgi taşır; gösterilen iki referans arasında çalışan verici veya ölçülmüş frekans sapması yoktur.',
  ['Bir melodinin bilgisi frekans değişimine kodlanmış gibi düşün.','FM verici bloğu ile bilgi sinyali kaynağını ayır.','Bağlantısız karttan yayın gücü veya ölçülmüş frekans sapması çıkarma.']],
 ['056','FM_TRANSMITTER_EXERCISE_UNWIRED',['tutorial-rf-transmitter','arduino-signal-generator'],
  'Bir FM verici temrininde çıktının gerçekten doğrulanması için ne gerekir?',
  ['Bağlı, uygun bir eğitim modeli ve ölçülebilir taşıyıcı-frekans değişimi.','Ekranda yalnız FM verici sembolünün bulunması.','İki malzemenin birbirine kablosuz görünmesi.'],
  'Bu temrin sayfasındaki öğeler bağlantısızdır. Yayın, gerçek RF sinyal üretimi veya üretici uygunluğu kabul edilmemiştir.',
  ['Temrinin amacıyla ekrandaki iki malzeme referansını karşılaştır.','Kablolama ve ölçüm olmadığı için uygulamanın henüz çalışır devre olmadığını belirle.','İlerideki doğrulamada frekans değişiminin ölçülmesi gerektiğini kavramsal olarak öğren.']],
 ['057','FM_RECEIVER_DISCRIMINATOR_UNWIRED',['tutorial-rf-receiver','arduino-signal-generator'],
  'FM alıcıda bilgi sinyaline ulaşmak için hangi işlemler gerekir?',
  ['İstenen taşıyıcıyı seçip frekans değişimindeki bilgiyi demodüle etmek.','Bir motorun hızını rastgele değiştirmek.','Alıcı sembolüne bakarak çıkış sesini ölçülmüş saymak.'],
  'Alıcıda kanal seçimi ve demodülasyon ayrı görevlerdir; bu kartta çalışan RF alıcı yolu yoktur.',
  ['Radyo istasyonunu seçmekle yayındaki bilgiyi çözmeyi farklı adımlar olarak düşün.','Alıcı bloğunu ve test/sinyal öğesini yalnız referans olarak incele.','Gerçek alıcı duyarlılığı, çıkış sesi veya spektrum ölçüldüğünü iddia etme.']],
 ['058',null,['tutorial-rf-receiver','arduino-signal-generator'],
  'FM alıcı uygulama kartında hangi sonuç henüz doğrulanamaz?',
  ['Bağlı alıcı, demodülatör ve ölçüm olmadığından gerçek çözülmüş ses/sinyal.','Alıcı bloğunun bir referans malzeme olduğu.','İki öğe arasında kablo bulunmadığı.'],
  'Temrin adının bulunması çalışır FM alıcı devresi olduğu anlamına gelmez; ölçülmüş demodülasyon çıkışı henüz yoktur.',
  ['Bir radyo alıcısının istasyonu seçip bilgiyi çıkarması gerektiğini hatırla.','Bu kartta yalnız alıcı ve test sinyali referansları bulunduğunu gör.','Gerçek devre ve ölçüm olmadan alım başarılı kabul edilmez.']],
 ['059',null,['lm358p-dip8','resistor','capacitor'],
  'Bir osilatörün kendi kendine sürdürülen sinyal üretmesi için ne gerekir?',
  ['Uygun aktif kazanç ile doğru fazda geri besleme sağlayan kapalı devre.','Bir direnç ve kondansatörün şemada yan yana gösterilmesi.','Tek başına bir filtre sembolünün bulunması.'],
  'LM358P, R ve C burada referanstır. Besleme, geri besleme ve çıkış ölçümü yapılmadan osilatör çalışıyor denemez.',
  ['Filtre başka bir sinyalin frekanslarını seçerken osilatörün sinyal ürettiğini düşün.','LM358P ile R-C öğelerini ayırt et; kartın hiç kablolanmadığını kontrol et.','Salınım için kapalı aktif çevrim gerektiğini kendi cümlenle anlat.']],
 ['060',null,['arduino-bd139','reactor','capacitor'],
  'Colpitts osilatörde iki kondansatörün temel görevi nedir?',
  ['C1 ve C2 birlikte kapasitif geri besleme bölücüsünü oluşturabilir.','Tek bir bobinin fiziksel rengini değiştirmek.','Kondansatörlerin tüm uçlarını bağlamadan salınımı kanıtlamak.'],
  'Kartta C1 ve C2 artık ayrı 10 nF örnek bileşenlerdir. Gerçek Colpitts salınımı için aktif kutuplama, kapalı geri besleme, besleme ve ölçüm gerekir; hiçbir terminal henüz bağlanmamıştır.',
  ['Bobinin rezonans ağındaki görevini, C1/C2 kapasitif bölücü görevinden ayır.','İki kondansatörü ayrı malzeme olarak bul; 10 nF yalnız eğitsel örnektir.','Bu kartın kablosu olmadığından hesaplanmış salınım veya fiziksel BD139 kabulü çıkarma.']]
];
for(const [suffix,issue,types,question,options,why,steps] of specs){
 const id='oscillator-filter-apps-outline-'+suffix,l=L.byId[id];
 if(!l||l.topicId!=='oscillator-filter-apps'||l.kind!=='quiz'||l.project?.referenceOnly!==true||
    l.project?.components?.length!==types.length||l.project?.wires?.length!==0||l.steps?.length!==0)
   throw Error('Concept card topology changed '+id);
 if(l.project.components.some((c,i)=>c.typeId!==types[i]))throw Error('Concept material source changed '+id);
 if(issue){
   if(l.pedagogyReview?.titleTopologyIssue!==issue||l.pedagogyReview?.titleTopologyStatus!=='REVIEW')
     throw Error('Previously open modulation issue unexpectedly resolved '+id);
   for(const k of ['nativeDynamicAcceptance','frequencyResponseAcceptance','modulationRuntimeAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
     if(l.pedagogyReview?.[k]!==false)throw Error('Existing acceptance lock changed '+id);
 }else if(l.pedagogyReview?.independentPedagogicalAcceptance===true||l.pedagogyReview?.physicalAcceptance===true)
   throw Error('Reference-only acceptance unexpectedly changed '+id);
 const oldQuestion='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(l.quiz?.question!==oldQuestion||l.quiz?.answer!==0||l.quiz?.options?.length!==3)
   throw Error('Previously specialized concept question - preserve '+id);
 if(suffix==='060'){
   const oldCap=l.project.components[2],p=l.project;
   if(oldCap?.typeId!=='capacitor'||p.components.some(c=>c.id==='colpitts-c2')||
      l.materials.length!==3||!l.materials.some(m=>m.componentId===oldCap.id))
     throw Error('Colpitts concept source cannot be repaired safely: '+id);
   const oldFirstTwo=JSON.stringify(p.components.slice(0,2));
   oldCap.ref='C1';oldCap.label='C1 · örnek 10 nF';
   oldCap.capacitance=10e-9;
   oldCap.tutorialPurpose='İlk Colpitts kapasitif geri besleme bölücü elemanı; değer yalnız kavramsal örnektir.';
   const second={id:'colpitts-c2',typeId:'capacitor',x:790,y:170,rotation:0,
      ref:'C2',label:'C2 · ikinci örnek 10 nF',state:false,address:'',note:'',
      capacitance:10e-9,
      tutorialPurpose:'İkinci Colpitts kapasitif geri besleme bölücü elemanı; kablo ve salınım modeli henüz yoktur.'};
   p.components.push(second);
   l.materials=l.materials.map(m=>m.componentId===oldCap.id?
      {...m,label:oldCap.label,why:oldCap.tutorialPurpose}:m);
   l.materials.push({componentId:second.id,typeId:second.typeId,
      label:second.label,why:second.tutorialPurpose});
   l.pedagogyReview={...l.pedagogyReview,componentIds:p.components.map(c=>c.typeId)};
   l.explanation+=' C1 ve C2 örnek kondansatörler kartta ayrı bulunur; bağlantı, ölçüm ve gerçek osilasyon yoktur.';
   if(JSON.stringify(p.components.slice(0,2))!==oldFirstTwo||p.wires.length!==0||
      p.referenceOnly!==true||l.steps.length!==0)
     throw Error('Colpitts concept repair modified protected source: '+id);
 }
 const original=JSON.stringify([l.project,l.steps,l.kind,l.materials,l.pedagogyReview]);
 l.quiz={question,options:[...options],answer:0,why};
 l.beginnerSteps=[...steps];
 if(original!==JSON.stringify([l.project,l.steps,l.kind,l.materials,l.pedagogyReview]))
   throw Error('Source graph / acceptance modified '+id);
}
L._modulationConceptBatchAD=true;
})(typeof window==='undefined'?globalThis:window);