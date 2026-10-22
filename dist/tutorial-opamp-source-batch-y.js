/* SC165–181: source-specific LM358P educational questions; preserve native graphs. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._opampSpecificTeachingBatchY)return;
const specs=[
['01',10,15,'Eviren AC yükselteçte giriş sinyali değişirken çıkışın küçük işaret yönü nasıldır?',
 ['12 V orta referans çevresinde ters yönde değişir','Girişin her değişimini aynı yönde izler','Her durumda 24 V üzerinde kalır'],
 'R1=10 kΩ ve R2=47 kΩ için ideal küçük işaret kazancı −4,7’dir; sanal LM358P besleme sınırları aşılmaz.',
 ['Sanal sinyal üretecini ve U1 LM358P giriş/çıkışlarını bul.','Giriş direnciyle geri besleme direncinin görevlerini karşılaştır.','İdeal −4,7 kazancın yalnız besleme sınırları içinde anlamlı olduğunu açıkla.']],
['02',10,16,'Eviren DC yükselteçte potansiyometre gerilimi artarsa çıkış ne yönde değişmeye eğilimlidir?',
 ['12 V referansa göre ters yönde; sınırda doyuma girebilir','Her zaman aynı yönde ve sınırsız artar','Doğrudan röle kontaklarına dönüşür'],
 'Bu sanal devrede R2/R1=47k/10k olup ideal fark kazancı negatiftir. Çıkış, tek beslemenin izin verdiği aralıkla sınırlıdır.',
 ['Sanal giriş potansiyometresini, 12 V orta referansı ve U1 çıkışını tanı.','Potansiyometrenin iki konumunda çıkışın girişe göre yönünü karşılaştır.','İdeal kazanç ile besleme sınırını birbirine karıştırma.']],
['03',8,12,'Evirmeyen AC yükseltecin R1=10 kΩ ve R2=47 kΩ ile ideal kazancı yaklaşık kaçtır?',
 ['Pozitif 5,7','Negatif 4,7','Sıfır'],
 'İdeal kapalı çevrim kazancı 1+R2/R1’dir. Bu katsayı yalnız lineer çalışma bölgesindeki sanal küçük işaret için geçerlidir.',
 ['Sanal FG1 işaretinin U1 IN+ tarafına geldiğini gör.','Çıkıştan IN− girişine dönen R2 geri beslemesini R1 ile karşılaştır.','1+47/10 hesabının neden pozitif kazanç verdiğini anlat.']],
['04',8,13,'Evirmeyen DC yükselteçte giriş 24 V besleme sınırına yaklaşırsa ne olur?',
 ['İdeal 5,7 kazanç artık sınırsız uygulanamaz; çıkış doyuma yaklaşır','Çıkış besleme geriliminin katlarca üzerine kesin çıkar','Op-amp kendiliğinden AC kaynağa dönüşür'],
 'Evirmeyen ideal kazanç 1+47k/10k’dır; gerçek/sanal op-amp çıkışı 0–24 V kaynak sınırını aşmış sayılmaz.',
 ['Sanal DC potu ve U1 IN+ girişini tanı.','R1/R2 geri beslemesinin kazancı nasıl belirlediğini karşılaştır.','Büyük girişlerde ideal formülün fiziksel sınıra takıldığını açıkla.']],
['05',6,10,'Gerilim izleyicide çıkışın IN− girişine geri bağlanması neyi sağlar?',
 ['İdeal olarak çıkışın IN+ girişini izlemesini, yaklaşık birim kazançla','Sinyali daima −5,7 ile terslemeyi','Bir kondansatör olmadan zamana bağlı gecikme üretmeyi'],
 'Gerilim izleyici bir gerilim artırıcı değildir; sanal tamponda hedef Vout≈Vin davranışıdır.',
 ['Sanal potansiyometrenin U1 IN+ girişini bul.','U1 OUT ile IN− arasındaki doğrudan geri beslemeyi tanı.','Giriş ve çıkışın yaklaşık eşit olmasını açıkla; çıkış sınırları korunur.']],
['06',8,13,'LM358P sanal karşılaştırıcısında IN+ gerilimi 12 V referansın üzerine geçerse ne beklenir?',
 ['Çıkışın yüksek duruma yönelmesi','Çıkışın her durumda referansı sıfırlaması','İki girişin fiziksel olarak kısa devre olması'],
 'Bu modelde R3/R4 eşit dirençler yaklaşık 12 V referans üretir ve girişler karşılaştırılır. Sayısal üretici doğruluğu iddia edilmez.',
 ['Sanal giriş potansiyometresi ile iki eşit referans direncini ayır.','U1 IN+ ve IN− girişlerinin neyi karşılaştırdığını gör.','Giriş referansın altına ve üstüne geçtiğinde çıkışın durumunu karşılaştır.']],
['07',9,14,'LDR üst kolda ve 10 kΩ direnç alt koldayken ışık artarsa U1 IN+ düğümü nasıl etkilenir?',
 ['LDR direnci azaldığından IN+ gerilimi yükselmeye eğilimlidir','IN+ zorunlu olarak 0 V’a kısa devre olur','LDR, Hall etkili manyetik sensöre dönüşür'],
 'Sanal 24 V LDR bölücüsü ve 12 V referans ayrı işlevlerdir. Bu konu ışığa bağlı eşik karşılaştırmasıdır.',
 ['B1 LDR ve R1 direnç bölücüsünü bul.','R2/R3 referansı ile sensörün U1 IN+ gerilimini karşılaştır.','Aydınlık arttığında sensör direnci ve eşik kararının yönünü açıkla.']],
['08',9,14,'NTC ısındıkça direnci azalırsa sanal karşılaştırıcı giriş gerilimi ne yönde değişebilir?',
 ['Üst kol NTC–alt kol direnç bölücüsünde IN+ yükselmeye eğilimlidir','NTC’nin BN/BU/BK PNP uçları ortaya çıkar','12 V referans kendiliğinden yok olur'],
 'Bu ders NTC sıcaklığına bağlı direnç değişimini ve LM358P girişlerinin karşılaştırılmasını anlatır; ürün kalibrasyonu yapılmış değildir.',
 ['B1 NTC’nin sıcaklığa duyarlı direncini tanı.','10 kΩ alt kol ve 12 V referansın farklı görevlerini ayırt et.','İki sanal sıcaklıkta eşik üstü/altı durumu kavramsal olarak karşılaştır.']],
['09',9,17,'Sanal op-amp gecikmeli açma deneyinde çıkış neden hemen değişmeyebilir?',
 ['C1 şarj olurken eşik gerilimine ulaşması zaman aldığı için','Op-amp içindeki röle kontağı beklendiği için','RC elemanları saniyeleri otomatik ölçüp onayladığı için'],
 'R–C birikimi ile karşılaştırıcının referans geçişi aynı şey değildir. Native gecikme süresinin dinamik kabulü hâlâ açıktır.',
 ['Sanal S1 komutunu, C1 zamanlama elemanını ve U1 referansını tanı.','Şarj gerilimi eşik altındayken ve aştıktan sonraki beklenen farkı açıkla.','Gerçek gecikme süresi test edilmeden kesin saniye verme.']],
['10',9,17,'Sanal gecikmeli durma devresinde düğme bırakıldıktan sonra hangi değişim önemlidir?',
 ['C1 geriliminin yavaş boşalıp karşılaştırma eşiğinin altına düşmesi','Kondansatörün sürekli 24 V üretmesi','Çıkışın her zaman gecikmesiz sıfırlanması'],
 'RC boşalma eğilimi gecikmeli kapanmayı açıklar, fakat dinamik zaman kabulü ve gerçek cihaz doğruluğu tamamlanmış değildir.',
 ['Sanal butonu, C1 ve R boşalma yolunun görevini ayır.','C1 geriliminin eşik üzerindeyken ve altındayken beklenen kararı tartış.','Gerçek geçiş zamanını ölçülmüş gibi anlatma.']],
['11',13,21,'Sanal iki girişli çıkarıcıda temel olarak hangi bilgi elde edilmeye çalışılır?',
 ['İki giriş geriliminin farkına bağlı bir çıkış','İki girişin yalnız çarpımına bağlı bir çıkış','Girişleri otomatik olarak şebeke fazına dönüştüren çıkış'],
 'RV1 ve RV2 iki ayrı sanal giriştir. LM358P fark devresinin sonucu geri besleme ve referansa bağlıdır; gerçek doğruluk kabulü değildir.',
 ['İki sanal potansiyometreyi ayrı iki giriş olarak tanı.','R direnç ağı ile U1 geri beslemesinin çıkarma görevini incele.','A/B girişlerini eşitleyip farklılaştırmanın beklenen etkisini açıklamaya çalış.']],
['12',12,20,'Sanal iki girişli eviren toplayıcıda iki girişin görevi nedir?',
 ['Geri besleme ve referans üzerinden çıkışa birlikte katkı vermek','Sadece motorun yönünü seçmek','Op-amp beslemesini ortadan kaldırmak'],
 'Bu devrede iki ayrı sanal girişin etkisi 12 V orta referansa göre birleştirilir. Gerçek kazanç/kalibrasyon sonucu garanti değildir.',
 ['RV1 ve RV2 adlı iki sanal girişi bul.','Giriş dirençleriyle geri besleme elemanının farklı görevini anlat.','Girişlerden biri değiştiğinde birleşik çıkışın yönünü karşılaştır.']],
['13',10,16,'Op-amp türev alıcıda giriş yolundaki kondansatör hangi değişime duyarlılık sağlar?',
 ['Giriş geriliminin zamana göre değişim hızına','Sadece sabit DC değerine sonsuz kazançla','Röle bobininin fiziksel dönüş yönüne'],
 'İdeal türev devresinde çıkış, girişin değişim hızından etkilenir. Geçiş cevabı ve gerçek analog bant sınırları ayrı doğrulama ister.',
 ['Girişteki C1 kondansatörü ile geri besleme direncini ayır.','Sabit giriş ile hızlı değişen giriş için beklenen çıkış farkını düşün.','Ölçülmemiş geçiş sürelerini kesin sonuç olarak yazma.']],
['14',10,16,'Op-amp integral alıcıda geri besleme kondansatörünün temel görevi nedir?',
 ['Giriş etkisini zaman boyunca biriktiren bir çıkış değişimi oluşturmak','Tek başına AC şebeke frekansını ayarlamak','İntegral almayı yalnız giriş kondansatörüyle yapmak'],
 'İdeal integratörde geri besleme C1 üzerindeki yük zamanla birikir; sanal besleme sınırları aşılmaz ve dinamik kabul ayrı konudur.',
 ['Girişteki direnç ile geri beslemedeki C1 kondansatörünü karşılaştır.','Sabit girişin çıkışı zaman içinde nasıl değiştirebileceğini düşün.','Uzun sürede doyum ve fiziksel model sınırlarını göz önünde bulundur.']],
['15',8,16,'Sanal hassas yarım dalga doğrultmaçta op-amp geri beslemesine diyot eklenmesinin amacı nedir?',
 ['Küçük sinyalde sıradan diyot ileri düşümünün etkisini azaltabilmek','AC dalganın her iki yarısını hiçbir kayıp olmadan güçlendirmek','Op-amp’i kondansatörle şarj kontrol cihazına dönüştürmek'],
 'LM358P ve 1N4148 devresi hassas doğrultma ilkesini temsil eder; AC dalga ve DC aktarımının dinamik kabulü hâlâ açık.',
 ['Sanal U1 LM358P ve D1 1N4148’in görevlerini ayır.','Normal diyot ileri gerilim etkisi ile op-amp geri besleme fikrini karşılaştır.','Kabulü açık AC dalga sonucunu ölçülmüş gibi sunma.']],
['17',10,16,'Op-amp Schmitt tetikleyicide pozitif geri besleme neden kullanılır?',
 ['Çıkış durumuna bağlı iki farklı anahtarlama eşiği oluşturabilmek','Tüm eşikleri tek bir değerde sabitlemek','Bütün dirençleri kısa devre ederek gecikme üretmek'],
 'Pozitif geri besleme histerezis oluşturur; yalnız nominal şema, gerçek eşik kalibrasyonu veya üretici kabulünün yerine geçmez.',
 ['Giriş potansiyometresini ve pozitif geri besleme direncini bul.','Yükselen ve düşen girişte farklı eşik fikirlerini karşılaştır.','Histerezis için sayısal kabul olmadan kesin eşik değeri iddia etme.']]
];
const expectedPartCounts=[10,10,8,8,6,8,9,9,9,9,13,12,10,10,8,10];
const expectedWireCounts=[15,16,12,13,10,13,14,14,17,17,21,20,16,16,16,16];
for(let i=0;i<specs.length;i++){
const [num,partCount,wireCount,question,options,why,steps]=specs[i],id='opamp-apps-src-'+num,lesson=L.byId[id];
if(!lesson||lesson.topicId!=='opamp-apps'||lesson.kind!=='wiring'||lesson.project.components.length!==partCount||lesson.project.wires.length!==wireCount||lesson.steps.length!==wireCount)throw Error('Protected LM358P lesson graph changed: '+id);
if(partCount!==expectedPartCounts[i]||wireCount!==expectedWireCounts[i])throw Error('Internal spec mismatch '+id);
if(!lesson.project.components.some(c=>c.typeId==='lm358p-dip8'))throw Error('Required real LM358P catalog missing '+id);
if(lesson.pedagogyReview?.physicalAcceptance===true||lesson.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
const prior=lesson.quiz?.question||'';
if(!(/^Bu derste sinyal işleme için merkezde hangi eleman bulunur\?$/.test(prior)||
 /^Bu derste ekrandaki malzemeler neden özellikle seçildi\?$/.test(prior)||
 /^“.+” konusunda hangi temel teknik ilke doğrudur\?$/.test(prior)))throw Error('Existing specific quiz must be preserved '+id);
const graph=JSON.stringify(lesson.project),guided=JSON.stringify(lesson.steps),review=JSON.stringify(lesson.pedagogyReview);
lesson.quiz={question,options:[...options],answer:0,why};
lesson.beginnerSteps=[...steps];
if(JSON.stringify(lesson.project)!==graph||JSON.stringify(lesson.steps)!==guided||JSON.stringify(lesson.pedagogyReview)!==review)throw Error('Protected source modified '+id);
}
L._opampSpecificTeachingBatchY=true;
})(typeof window==='undefined'?globalThis:window);