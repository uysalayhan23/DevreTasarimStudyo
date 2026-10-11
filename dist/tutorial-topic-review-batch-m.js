(function enhance(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._topicReviewBatchM)return;
const rules={
'motor-direct-power':['Motorun güç devresi, kumanda devresi ve koruma işlevleri ayrı değerlendirilir.','Kontaktör bobini motor koruması yerine geçer.','Her motor klemensi aynı amaçla kullanılır.'],
'installation-systems':['Faz anahtarlama, nötr dönüşü ve PE koruması farklı görevler üstlenir.','PE her durumda nötr olarak kullanılabilir.','Yük dönüş hattı gerekli değildir.'],
'sensor-analog-apps':['Sensörün giriş/çıkış ve besleme uçları modelinin terminal tanımıyla doğrulanır.','PNP ve NPN her zaman aynı bağlanır.','Sensör uçları gövde renginden belirlenir.'],
'workshop-safety-mechanics':['Riskler değerlendirilmeden enerjili veya hareketli gerçek donanımda deneme yapılmaz.','Koruma koşulları eğitimde gereksizdir.','Enerji durumu kontrol edilmez.'],
'electronic-component-basics':['Bileşenin uçları, görevi ve sınırları gerçek teknik tanımla karşılaştırılır.','Aynı gövdeli her parça aynı pin işlevindedir.','Kondansatör ve direnç aynıdır.'],
'electronic-switching':['Anahtarlama bileşeninin kumanda ve yük uçları ayrı işlevlerle incelenir.','Röle bobini doğrudan yük çıkışıdır.','NO ve NC aynı başlangıç durumundadır.'],
'oscillator-filter-apps':['Osilatör üretimi ve filtrenin frekansa bağlı aktarımı farklı işlevlerdir.','Her filtre kendi başına osilatördür.','Filtre davranışı frekansa bağlı değildir.'],
'panel-power-systems':['Güç, kumanda ve PE bağlantıları ayrı güvenlik/yerleşim koşullarıyla değerlendirilir.','PE normal yük akımının dönüşüdür.','Terminal yerleşimi kontrol edilmez.'],
'plc-hardware-programming':['PLC girişleri durum algılar; çıkışları uygun yük veya sürücüye kumanda eder.','Her PLC girişi bir güç çıkışıdır.','PLC adresleri programda önemsizdir.'],
'opamp-apps':['İşlemsel yükselteç çıkışı besleme, giriş ve geri besleme ilişkisine bağlıdır.','İşlemsel yükselteç çıkışı sınırsızdır.','Artı ve eksi girişler daima aynıdır.'],
'digital-logic-apps':['Kapı çıkışı, girişler ve doğruluk tablosuyla belirlenir.','AND ile OR her zaman aynı sonucu verir.','Girişler çıkışı etkileyemez.'],
'motor-start-speed':['Yol verme ve hız kontrolü motorun ve sürücünün sınırlarına göre seçilir.','Motor etiketi önemli değildir.','Motor hızı yalnız buton sayısıyla belirlenir.'],
'installation-grounding':['PE koruma içindir; normal dönüş iletkeni olarak kullanılmaz.','PE daima faz yerine geçer.','Eşpotansiyel bağlantı motoru hızlandırır.'],
'digital-sequential-apps':['Ardışıl devrelerde saklanan durum veya saat işareti çıkışı etkileyebilir.','Ardışıl devre durum saklayamaz.','Flip-flop kombinasyonel kapıyla her zaman aynıdır.'],
'microcontroller-apps':['Giriş/çıkış ve besleme pinleri gerilim sınırı ve ortak referansla incelenir.','Her GPIO sınırsız güç verir.','Ortak referans gereksizdir.'],
'vfd-servo-control':['Frekans sürücüsü ile geri beslemeli servo kontrolü farklı görevler üstlenebilir.','Servo geri beslemesi her zaman gereksizdir.','Motor ve sürücü sınırları kontrol edilmez.'],
'motor-braking':['Frenleme yöntemi yük enerjisi ve motor/sürücü sınırlarıyla değerlendirilir.','Motor her zaman anında durur.','Frenleme enerji dönüşümüyle ilişkisizdir.'],
'motor-special':['Özel motorların terminal ve sürme koşulları kendi modeline göre belirlenir.','Her motorun pinleri lamba ile aynıdır.','Motor türü sürücüyü etkilemez.'],
'circuit-simulation-pcb':['Şema, net listesi ve PCB izlerinin elektriksel bağlantıları tutarlı olmalıdır.','PCB izi şemadan tamamen bağımsızdır.','Yalnız görünüm kısa devre testidir.'],
'motor-sequence':['Sıralı kumandada ön koşullar ve kilitlemeler ayrı sınanır.','Zıt iki kontaktörün eşzamanlı çalışması daima uygundur.','Aşamaların geri bildirimle ilişkisi yoktur.'],
'number-systems':['Taban dönüşümü, sayı değerini ve basamak ağırlıklarını korur.','Her tabanın basamak ağırlığı aynıdır.','Dönüşüm sayı değerini rastgele değiştirir.']
};
const generic=new Set(['Bu derste ekrandaki malzemeler neden özellikle seçildi?','Motor dersinde yük olarak hangi eleman gösterilmelidir?','Bu derste incelenen eleman türü hangisidir?','Bu derste sinyal işleme için merkezde hangi eleman bulunur?','PLC dersinde elektriksel karar/lojik işlemi yapan temel cihaz hangisidir?','PE koruma iletkeninin temel görevi nedir?','Motor hızını frekans değiştirerek kontrol eden cihaz hangisidir?','Servo sisteminde motor hareketini kontrollü yapan ana ikili hangisidir?','Paralel kollarda ortak olan büyüklük hangisidir?']);
const seen=new Set(),stats={version:'topic-review-m1',scanned:0,replaced:0,richUntouched:0,keptNonGeneric:0,missingRules:[],byTopic:{}};
for(const lesson of L.lessons){
 if(lesson.designStandard==='rich-reference-v1'){stats.richUntouched++;continue}
 stats.scanned++;
 if(!generic.has(lesson.quiz?.question)){stats.keptNonGeneric++;continue}
 const options=rules[lesson.topicId];if(!options){stats.missingRules.push(lesson.id);continue}
 const title=String(lesson.title||lesson.topic||lesson.id).trim();
 let question='“'+title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(seen.has(question))question='“'+title+'” ('+lesson.id+') konusunda hangi teknik ilke doğrudur?';
 seen.add(question);
 lesson.quiz={question,options:[...options],answer:0,why:'İlgili temel ilke: '+options[0]+' Bu soru bir fiziksel testin veya özgün kaynak ayrıntılarının yerine geçmez.'};
 lesson.topicReview={version:stats.version,scope:'topic-check-only-not-rich-acceptance',sourceLesson:lesson.id,simulationAcceptance:false,visualAcceptance:false,sourceCircuitPreserved:true};
 stats.replaced++;stats.byTopic[lesson.topicId]=(stats.byTopic[lesson.topicId]||0)+1;
}
L.topicReviewBatchM=stats;L._topicReviewBatchM=true;
})(typeof window==='undefined'?globalThis:window);
