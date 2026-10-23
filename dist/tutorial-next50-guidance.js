/* SC122–171: non-destructive individual lesson guidance; no topology edits. */
(function(root){'use strict';const L=root.DTSTutorialLessons;if(!L||L._next50Guidance)return;
const ids=["installation-systems-src-11","installation-systems-src-12","electronic-switching-src-01","electronic-switching-src-02","electronic-switching-src-03","electronic-switching-src-04","electronic-switching-src-05","electronic-switching-src-06","electronic-switching-src-07","electronic-switching-src-08","electronic-switching-src-09","electronic-switching-src-10","electronic-switching-src-11","electronic-switching-src-12","electronic-switching-src-13","electronic-switching-src-14","electronic-switching-src-15","electronic-switching-src-16","electronic-switching-src-17","electronic-switching-src-18","electronic-switching-src-19","sensor-analog-apps-src-01","sensor-analog-apps-src-02","sensor-analog-apps-src-03","sensor-analog-apps-src-04","sensor-analog-apps-src-05","sensor-analog-apps-src-06","sensor-analog-apps-src-07","sensor-analog-apps-src-08","sensor-analog-apps-src-09","sensor-analog-apps-src-10","sensor-analog-apps-src-11","sensor-analog-apps-src-12","sensor-analog-apps-src-13","sensor-analog-apps-src-14","sensor-analog-apps-src-15","sensor-analog-apps-src-16","sensor-analog-apps-src-17","sensor-analog-apps-src-18","sensor-analog-apps-src-19","sensor-analog-apps-src-20","sensor-analog-apps-src-21","sensor-analog-apps-src-22","opamp-apps-src-01","opamp-apps-src-02","opamp-apps-src-03","opamp-apps-src-04","opamp-apps-src-05","opamp-apps-src-06","opamp-apps-src-07"];
const titles=["Anten tesisatı temel bağlantısı","Akıllı ev aydınlatma ve güneşlik kontrolü","Röle uçlarının bulunması","Röle ile mühürleme","Röle ile motor yönü değiştirme","Transistörün anahtar olarak kullanımı","Transistörün potansiyometre ile anahtarlanması","Zaman gecikmeli çalışan transistör devresi","Zaman gecikmeli duran transistör devresi","Transistörlü Schmitt Trigger","FET’li zaman gecikmeli duran devre","MOSFET sağlamlık kontrolü","MOSFET ile DC motor hız kontrolü","IGBT ile dimmer","Tristörün DC’de tetiklenmesi","Tristörün durdurulması","Tristörün AC’de çalışması","Triyakın DC’de çalışması","Triyaklı dimmer","Optokuplör sağlamlık kontrolü","Opto-triyak ile flaşör","NTC ile sıcaklıkta çalışan devre","PTC ile sıcaklıkta çalışan devre","Termokupl uygulaması","PT100 uygulaması","LM35 sıcaklık uygulaması","Reed röle uygulaması","Hall sensörü uygulaması","Piezo sensörlü devre","Ağırlık sensörü / load cell","LDR ile karanlıkta çalışan devre","LDR kontrollü dimmer","IR alıcı-verici","Sensör kumanda test devresi","IR alıcıyla yük kontrolü","Güneş pili uygulaması","Alkışla çalışan devre","Sensörlerde enerji dönüşümü","Otomobillerde kullanılan sensörler","Sıcaklık ölçümünde sensör seçimi","Hall etkili sensör yapımı","Güneş pilli bahçe aydınlatma ve şarj sensörü","Optik sensör yapımı","Eviren yükselteç AC giriş","Eviren yükselteç DC giriş","Evirmeyen yükselteç AC giriş","Evirmeyen yükselteç DC giriş","Gerilim izleyici","İşlemsel yükselteçli karşılaştırıcı","LDR’li karşılaştırıcı"];
for(let i=0;i<50;i++){
 const id=ids[i],l=L.byId[id];if(!l||l.title!==titles[i])throw Error('SC'+(122+i)+' lesson identity mismatch '+id);
 const category=i<2?'Tesisat':i<21?'Elektronik anahtarlama':i<43?'Sensör':'İşlemsel yükselteç';
 const visualAccepted=l.pedagogyReview?.visualAcceptance===true;
 const nativeAccepted=l.pedagogyReview?.simulationAcceptance===true;
 // The guidance accompanies accepted content; do not replace protected project, quiz, lessons or existing PASS status.
 l.learningSupport={...l.learningSupport,
  version:'20261023-next50-guidance1',
  theme:category,
  focus:l.title,
  questions:['Bu düzenek hangi işlevi yerine getirir?','Katalog terminali, besleme ve ölçüm referansı uygun mu?','Normal ve hatalı bağlantı durumunda hangi sonuç beklenir?'],
  reflection:'Örnekte '+l.title.toLocaleLowerCase('tr-TR')+' konusunu ele alıyoruz. Önce elemanın görevini anlat, sonra doğru referansı ve beklenen sonucu kontrol et.',
  visualAcceptanceRequired:!visualAccepted,
  nativeAcceptanceRequired:!nativeAccepted,
  sourceCircuitPreserved:true,
  nonWorkingDiagramWarning:!!l.project?.referenceOnly||l.kind==='quiz'
 };
}
L._next50Guidance=true;
})(typeof window==='undefined'?globalThis:window);
