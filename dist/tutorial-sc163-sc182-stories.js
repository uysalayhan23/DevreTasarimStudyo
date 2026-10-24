/* SC163–182: twenty topic-specific stories while preserving accepted native circuits. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sc163Sc182Stories)return;
const items=[
['sensor-analog-apps-src-21','Akşam bahçedeki lamba yansın istiyorsun. Panel gündüz enerji üretir, pil depolar, ışık algılayıcı ise lambanın ne zaman yanacağını belirler. Şimdilik bu bir kablosuz kavram kartıdır.'],
['sensor-analog-apps-src-22','Konveyördeki kutu ışık huzmesini kestiğinde optik sensör karar verir. Röle, sensör bilgisini lamba gücüne aktarır; hedef uzaklaştığında kontak açılır. Gerçek ışın mesafesi ölçülmüş değildir.'],
['opamp-apps-src-01','Mikrofonun küçük AC sinyalini büyütmek istiyorsun. Eviren bağlantıda sinyal orta referansa göre ters döner; geri besleme dirençleri ideal kazancı sınırlar.'],
['opamp-apps-src-02','Bir potansiyometreyle DC girişini yavaşça artır. Eviren yükseltecin çıkışı orta referansa göre ters yöne gider; kaynağın izin verdiği gerilimin ötesine çıkamaz.'],
['opamp-apps-src-03','Sensörden gelen küçük AC dalgayı aynı yönde büyütmeyi düşün. Evirmeyen giriş sinyali taşır; geri besleme kazancı belirler.'],
['opamp-apps-src-04','DC sensör çıkışını evirmeyen yükseltece verince çıkışın yönü korunur. Yükseltme oranı dirençlerle seçilir ama gerçek besleme sınırı değişmez.'],
['opamp-apps-src-05','İki devre arasına bir tampon koyduğunu düşün. Gerilim izleyici çıkışını eviren girişe geri bağlar; amacı gerilimi katlamak değil girişin izini sürmektir.'],
['opamp-apps-src-06','Bir termostatın eşik kararını hayal et. Karşılaştırıcı iki giriş gerilimini kıyaslayıp çıkışını yüksek veya düşük duruma yöneltir.'],
['opamp-apps-src-07','Gün ışığı artarken LDR direnci değişir. Gerilim bölücüsü bu değişimi karşılaştırıcıya taşır; lambanın durumunu belirleyen eşik ayrıca kontrol edilir.'],
['opamp-apps-src-08','Fırın ısındıkça NTC direnci azalabilir. Karşılaştırıcı ham sıcaklık değerini değil, NTC gerilim bölücüsünün oluşturduğu işareti izler.'],
['opamp-apps-src-09','Bir devrenin açılmasını biraz geciktirmek istiyorsun. Kondansatör şarj olurken gerilim eşik seviyesine yaklaşır; gerçek süre yalnız grafikle doğrulanabilir.'],
['opamp-apps-src-10','Kapatma komutundan sonra lambanın kısa bir süre daha açık kaldığını düşün. RC boşalma yolu ile karşılaştırıcının kapama eşiği birlikte rol oynar.'],
['opamp-apps-src-11','İki sensörün ölçümleri arasındaki küçük farkı bulmak istiyorsun. Çıkarıcı, direnç oranları uygun olduğunda iki girişin farkına tepki verir.'],
['opamp-apps-src-12','İki ayrı sensör işaretini bir çıkışta topladığını düşün. Toplayıcıda giriş dirençleri, referans ve geri besleme iki işaretin payını belirler.'],
['opamp-apps-src-13','Bir giriş işareti hızla değiştiğinde türev alıcının tepkisi artabilir. Kondansatör girişte, direnç geri beslemede farklı görevler üstlenir.'],
['opamp-apps-src-14','Sabit bir girişin zaman boyunca etkisini biriktirmek istiyorsun. İntegratörün geri besleme kondansatörü çıkışın zamanla nasıl değiştiğini belirler.'],
['opamp-apps-src-15','Zayıf bir AC dalganın yalnız bir yarısını ayırmayı düşün. Hassas doğrultucuda LM358P ile 1N4148 geri beslemesi diyot düşümünü azaltmaya yardımcı olur; kaynak dinamik kabulü hâlâ açıktır.'],
['opamp-apps-src-16','Kalabalık bir fabrikada iki ölçüm telinde ortak gürültü oluştuğunu düşün. Üç op-amp kanalı küçük farkı büyütmek için kurulur; CMRR sonucu henüz ölçülmemiştir.'],
['opamp-apps-src-17','Bir rölenin eşik çevresinde sürekli titremesini önlemeyi düşün. Pozitif geri beslemeli Schmitt düzeni yükselirken ve düşerken farklı eşikler oluşturabilir; iki eşiğin native ölçümü ayrıca gerekir.'],
['oscillator-filter-apps-src-01','Bir radyo devresinin sürekli titreşmesi için LC rezonansı ve geri beslemeyi hayal et. Colpitts iki kondansatörlü bölücü kullanır; bu kartta bağlı, çalışan osilatör bulunmuyor.']
];
const quiz={
 'sensor-analog-apps-src-21':['Güneş pilli bahçe aydınlatmasında hangi görevin ayrı bir denetimi gerekir?',['Pilin güvenli şarjının ve ışığa göre lambanın kontrolü.','Paneli doğrudan pilin her koşulda güvenli şarjı saymak.','Kablo olmadan şarj akımını ölçülmüş kabul etmek.']],
 'sensor-analog-apps-src-22':['Optik sensör hedefi gördüğünde sanal lambayı hangi yol çalıştırır?',['Sensör BK çıkışı röle bobinini, röle 13/14 kontağı lambayı sürer.','BK ucundan doğrudan 230 V şebeke akar.','Röle kontağı ve sensör beslemesi gereksizdir.']],
 'oscillator-filter-apps-src-01':['Colpitts osilatör geri beslemeyi hangi ağdan alır?',['İki kondansatörlü kapasite bölücüsü ve LC rezonans ağından.','Yalnız bir röle bobininden.','Tek başına DC pili osilasyon olarak kabul ederek.']]
};
if(items.length!==20)throw Error('SC163-182 exact lesson count changed');
for(const [id,story] of items){
 const l=L.byId[id];if(!l)throw Error('Missing SC163-182 lesson: '+id);
 l.explanation=story+' '+l.explanation;
 l.beginnerSteps=['Günlük örnek: '+story,...(l.beginnerSteps||[])];
 if(quiz[id]&&/konusunda hangi temel teknik ilke doğrudur\?/.test(l.quiz?.question||'')){
  const [question,options]=quiz[id];l.quiz={question,options:[...options],answer:0,why:options[0]};
 }
 l.sc163To182Story='20261024-sc163-sc182-1';
}
L._sc163Sc182Stories=true;
})(typeof window==='undefined'?globalThis:window);
