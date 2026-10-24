/* SC263–282: protected motor-curriculum learning corrections; virtual simulation only. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._sc263Sc282Stories)return;
const stories=["Geri sayımı olan bir fanı düşün. Düz zaman rölesi komuttan sonra gecikerek kontak değiştirir. Bu sayfanın motor devresi yıldız/üçgen geçiş şablonunu kullanıyor; zaman ayarlı durdurma işlevi henüz doğrulanmış değildir.", "Bir havalandırma fanının kapatma komutundan sonra kısa süre daha dönmesini düşün. Ters zaman rölesi bırakma anından sonraki gecikmeyle çalışır; sanal zaman eğrisi ayrıca kanıt ister.", "Bir yürüyen bandın uca geldiğinde durup geri dönmesini istiyorsun. Hız referansı ile sınır anahtarının yön emri farklı işlerdir; bu kartta henüz sınır anahtarı kablosu bulunmuyor.", "Bir makineyi aynı düğmeye basarak sırayla çalıştırıp durdurmayı düşün. Darbe rölesinin önceki durumunu saklayıp saklamadığını ayrıca kontrol etmek gerekir.", "Bir pompa zorlandığında koruma elemanı kumandayı kesmeli. Termik korumayı motor yük yolundan ayrı düşün; gerçek aşırı yük davranışı hâlâ incelemede.", "Bir konveyör sağa ve sola hareket etsin istiyorsun. İki yönün aynı anda seçilmesini önlemek için kilitleme davranışı önemlidir; sanal eşzamanlı komut güvenliği ayrıca test edilir.", "Motor beklenmedik ölçüde akım çektiğinde aşırı yük korumasının komutu kesmesi beklenir. Başlatma sonucu tek başına korumanın doğrulandığını göstermez.", "Bir fabrikanın üç fazlı motorunda faz sırası yanlışsa hareket yönü değişebilir. Faz koruma rölesinin kararını gerçek hata senaryosuyla doğrulamadan PASS verme.", "Bir motorlu araba iki uç arasında gidip gelsin. Sınır anahtarı bilgisi dönüş komutuna etki eder; yalnız ilk çalıştırmanın görülmesi otomatik geri dönüş kanıtı değildir.", "Bir PLC buton bilgisini okuyup kontaktöre komut verebilir. Çıkışın açılmasıyla PLC programının gerçek koruma mantığını ayrı ayrı değerlendirmek gerekir.", "Yıldız/üçgen paket şalterinin konumunu değiştirirken motorun sanal durumunu izle. 0, yıldız ve üçgen ayrı konumlardır; fiziksel kurulum burada amaç değildir.", "Büyük bir motorun ilk kalkışını hafifletmek için yıldızdan üçgene geçişi düşün. Kontaktör ve zaman rölesinin birbirini kilitlemesi gerekir; gecikme sonucu ayrıca ölçülmeli.", "Otomatik yıldız/üçgen devrede gösterge lambaları hangi kademenin seçildiğini anlatır. Sıralama ve karşılıklı kilit davranışı sanal zaman taramasıyla kanıtlanmalı.", "Yumuşak yol verici motorun kalkışını yönetir. Bu görsel yalnız bileşenlerin tanıtımıdır; bağlantısız karttan akım eğrisi çıkarılmaz.", "Ototrafoyla yol vermede ilk anda farklı gerilim basamağı seçilebilir. Bu kart gerçek kablolanmış motor veya ölçülmüş kalkış değildir.", "Bir motorun ilk anda akımını sınırlamak için seri direnç fikrini düşün. Direncin devreden nasıl çıktığı burada bağlanmamıştır; sanal bir tam yol verme iddiası yoktur.", "Dahlander motorunda düşük devir için sargı gruplaması değişir. Parça çizimi gerçek düşük devir bağlantısının ölçüldüğü anlamına gelmez.", "Aynı Dahlander motorun yüksek devir seçimini düşün. Düşük ve yüksek konumun mekanik/kumanda kilidi bu kartta kablolanmamıştır.", "Bir fanın önce düşük, sonra yüksek devire geçmesini düşün. Geçiş zamanı ve kilitleme koşulları olmadan bu kart bir otomatik devre değildir.", "Hem ileri-geri hem iki devir seçimi olan bir motor hayal et. Komutların birbiriyle çakışmasını engelleyen mantık olmadan bu kart çalışır kumanda sayılamaz."];
if(stories.length!==20)throw Error('SC263–282 stories missing');
for(let i=0;i<20;i++){
 const id=i<10?'motor-direct-power-src-'+String(i+9).padStart(2,'0'):
                  'motor-start-speed-src-'+String(i-9).padStart(2,'0');
 const l=L.byId[id];if(!l)throw Error('Missing canonical motor lesson '+id);
 const wired=i!==2&&i<13;
 if(wired){if(l.kind!=='wiring'||l.project.wires.length===0||l.steps.length!==l.project.wires.length)
  throw Error('Missing protected wired motor source '+id);
 }else if(l.kind!=='quiz'||l.project?.referenceOnly!==true||l.project.wires.length||l.steps.length)
  throw Error('Reference-only motor card replaced '+id);
 if(l.pedagogyReview?.physicalAcceptance===true)throw Error('Unverified motor visual acceptance '+id);
 l.explanation=stories[i]+' '+l.explanation;
 l.beginnerSteps=['Günlük örnek: '+stories[i],...(l.beginnerSteps||[])];
 l.sc263Sc282Story='20261024-sc263-sc282-1';
 if(i===0){
  if(!l.project.components.some(c=>c.id==='coilStar')||!l.project.components.some(c=>c.id==='coilDelta')||
   l.pedagogyReview?.titleTopologyIssue!=='ON_DELAY_MOTOR_CONTROL_NATIVE_PENDING')
    throw Error('SC263 topic mismatch evidence changed');
  l.learningSupport={...(l.learningSupport||{}),nonWorkingDiagramWarning:true,
   nativeAcceptanceRequired:true,topicTopologyMismatchReview:'ON_DELAY_STOP_USES_STAR_DELTA_SOURCE_PENDING'};
 }
}
L._sc263Sc282Stories=true;
})(typeof window==='undefined'?globalThis:window);
