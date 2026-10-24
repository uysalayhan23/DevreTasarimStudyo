/* SC183–202: distinct practical introductions. Electrical sources and approvals stay locked.
 * Any reference-only lesson remains reference-only; pending native evidence remains pending. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sc183Sc202Stories)return;
const stories=[
 ['02','Bir radyonun doğru istasyona ayarlanmasını düşün. Hartley’de bobinin tap noktası geri beslemeyi paylaşır; burada parçalar yalnız referans olarak gösterilir.'],
 ['03','Bir duvar saatinin düzenli çalışmasına benzer biçimde kuvars kristal frekans seçimine yardımcı olur. Ama uygun sürücü ve ölçüm olmadan görüntüdeki kristal çalışan osilatör değildir.'],
 ['04','Bir ses tonu üretmek istediğini düşün. RC kademeleri fazı değiştirir, yükselteç de yeterli kazancı sağlamalıdır; bağlantısız öğeler kendi kendine sinüs üretmez.'],
 ['05','Sakin bir sinüs dalgası arıyorsun. Wien köprüsünün RC ağı uygun frekansı seçer; kazanç ve genlik dengesi sağlanmazsa gerçek devre kararlı salınmaz.'],
 ['06','Kapı ziline bir kez basınca kısa süreli ışık yandığını hayal et. İki BD139’lu sanal tek kararlı devrede tek bir tetik ardından başlangıç durumuna dönüş izlenir.'],
 ['07','Bir aç/kapa hafıza anahtarı düşün. SET komutu son durumu seçer, RESET geri alır. İki BD139’lu sanal çift kararlı bellekte bu farkı izle.'],
 ['08','Bir uyarı lambasının kendi kendine düzenli yanıp söndüğünü hayal et. Çapraz RC ağı iki BD139’un sırayla iletime geçmesini sağlar; gerçek fiziksel frekans ölçülmüş değildir.'],
 ['09','Ses kaydındaki çok yüksek tepe noktalarını sınırlamak istediğinde bir diyotlu kırpıcı kullanabilirsin. Referans gerilimi ile diyodun A/K yönü sınırın nerede oluşacağını etkiler.'],
 ['10','Bir dalga biçimini bozmadan yukarı taşıdığını düşün. Kenetleyici kondansatörün yükü ve diyot yönüyle DC seviyeyi kaydırabilir; gerçek geçici tepki kabulü açık.'],
 ['11','Bir yükselteçte küçücük kondansatör bazen girişe çok daha büyükmüş gibi etki eder. Miller etkisi kazançla ilişkilidir; bu sayfa bağlı devre değil kavram kartıdır.'],
 ['12','Yüksek taraftaki sürücü kısa süreli daha yüksek bir referansa ihtiyaç duyabilir. Bootstrap kondansatörü yeniden şarj olmadan bunu sınırsız sürdüremez; kart fiziksel sürücü deneyi değildir.'],
 ['13','Eşik etrafında titreyen bir lambayı düşün. LM358P Schmitt devresinin pozitif geri beslemesi iki ayrı karar seviyesi oluşturabilir; sayısal eşikler ölçülmeden PASS verilmez.'],
 ['14','Yanıp sönen bir gösterge ışığını hayal et. NE555 astable zamanlamasında kondansatör şarj ve deşarj olur; TRIG, THRES ve DISCH ayrı görev taşır.'],
 ['15','Bir sanal lambanın her çevrimde ne kadar açık kaldığını değiştiriyorsun. NE555 PWM’de iki diyot, potansiyometrenin şarj ve deşarj yollarını ayırır; duty ile frekansı karıştırma.'],
 ['16','Bir butona tek kez basınca kısa bir uyarı ışığı istediğini düşün. 555 tek kararlı bağlantıda TRIG başlatır, RC süreyi belirler; native darbe kanıtı hâlâ bekleniyor.'],
 ['17','Bir uyarıyı SET ile açıp RESET ile kapatan küçük bir bellek düşün. 555 çift kararlı davranışı otomatik osilasyon değildir; gerçek giriş-çıkış testi tamamlanmadan bellek PASS sayılmaz.'],
 ['18','Bir ses kaydındaki tiz gürültüyü azaltmayı düşün. Alçak geçiren RC ağı hızlı değişimleri süzer; LM358P izleyici katının besleme uçları ayrı kontrol edilir.'],
 ['19','Bir sensörün DC kaymasını ayıklamak istiyorsun. Yüksek geçiren filtre düşük frekansları bastırır, ancak gerçek kesim davranışını yalnız bağlantı görünümünden çıkaramazsın.'],
 ['20','Radyo gibi yalnız orta bölgedeki frekansları seçen pasif RC yolu düşün. Bu şemada op-amp yoktur; yüksek geçiş ve alçak geçiş birlikte bant oluşturur.'],
 ['21','Tek bir uğultu frekansını bastırmak için twin-T ağını düşün. Dirençli ve kapasitif T kolları birlikte çentik oluşturur; burada aktif kazanç katı bulunmuyor.']
];
const ids=stories.map(([s])=>'oscillator-filter-apps-src-'+s),expectedNoWires=new Set(['02','03','04','05','11','12']);
if(ids.length!==20||new Set(ids).size!==20)throw Error('SC183-202 identities changed');
for(const [suffix,story] of stories){
 const id='oscillator-filter-apps-src-'+suffix,l=L.byId[id];
 if(!l||l.topicId!=='oscillator-filter-apps')throw Error('Missing oscillator lesson '+id);
 const conceptual=expectedNoWires.has(suffix);
 if(conceptual){if(l.kind!=='quiz'||l.project?.referenceOnly!==true||l.project.wires.length||l.steps.length)throw Error('Conceptual source modified '+id);}
 else if(l.kind!=='wiring'||!l.project?.wires.length||l.pedagogyReview?.physicalAcceptance===true)throw Error('Wired acceptance unexpectedly changed '+id);
 if(suffix==='20'&&(!l.title.includes('pasif')||l.project.components.some(c=>/opamp/i.test(c.typeId))))throw Error('Passive RC bandpass mislabelled');
 if(suffix==='21'&&(!l.title.includes('pasif')||l.project.components.some(c=>/opamp/i.test(c.typeId))))throw Error('Passive twin-T notch mislabelled');
 l.explanation=story+' '+l.explanation;
 l.beginnerSteps=['Günlük örnek: '+story,...(l.beginnerSteps||[])];
 if(suffix==='15'&&l.quiz?.question==='“555 PWM” konusunda hangi temel teknik ilke doğrudur?')
  l.quiz={question:'NE555 PWM’de iki ayrı diyot ve potansiyometre neyi değiştirir?',
   options:['Şarj ve deşarj akım yollarını ayırarak çıkışın açık kalma oranını','Devreyi harici kristalli RF vericiye dönüştürmeyi','Çıkışın her zaman tam 50 Hz olmasını'],
   answer:0,why:'İki ters yönlü diyot potansiyometrenin farklı kollarından şarj ve deşarjı sağlar; bunun fiziksel dalga kabulü henüz yoktur.'};
 l.sc183To202Story='20261024-sc183-sc202-1';
}
L._sc183Sc202Stories=true;
})(typeof window==='undefined'?globalThis:window);
