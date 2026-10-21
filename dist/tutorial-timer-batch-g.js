/* MQ-07: four model-backed flasher lessons, source terminal wiring unchanged. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._timerBatchG)return;
const rows=[["timer-flipflop-1",1,1,"1 saniye yeşil / 1 saniye kırmızı flaşör","Yeşilin 1 s, kırmızının 1 s yandığı çevrim toplam kaç saniyedir?",["2 saniye","1 saniye","0,5 saniye"]],["timer-flipflop-2",0.5,1.5,"0,5 saniye yeşil / 1,5 saniye kırmızı flaşör","Yeşil 0,5 s, kırmızı 1,5 s yanıyorsa yeşilin yanma oranı kaçtır?",["%25","%50","%75"]],["timer-flipflop-3",1.5,0.5,"1,5 saniye yeşil / 0,5 saniye kırmızı flaşör","Yeşil 1,5 s, kırmızı 0,5 s yanıyorsa yeşilin yanma oranı kaçtır?",["%75","%25","%50"]],["timer-flipflop-4",1,1,"Zaman rölesinde NO/NC kontakların karşıtlığı","NO kontak kapalıyken aynı KT1’in NC kontağı hangi durumdadır?",["Açık","Kapalı","Seri direnç"]]];
const teachingById={
 'timer-flipflop-1':{
  summary:'Yeşil ve kırmızı lambalar birer saniye arayla sırayla yanar. İki durumun birlikte bir çevrim oluşturduğunu göreceksin.',
  goal:'Yeşilin 1 saniye, kırmızının 1 saniye yanmasını izleyerek 2 saniyelik flaşör çevrimini açıklayabilmek.',
  explanation:'KT1 zaman rölesi sürekli beslenir; lambalar ise onun iki ayrı yardımcı kontağından beslenir. Modelin ilk 1 saniyesinde NO kontak kapalıdır: yeşil yanar, NC kontak açık olduğu için kırmızı söner. Sonraki 1 saniyede kontaklar yer değiştirir; yeşil söner, kırmızı yanar. Ardından aynı sıra yeniden başlar. Bir çevrim yalnız yeşilin yanma süresi değildir: 1 saniye yeşil + 1 saniye kırmızı = 2 saniyedir.',
  task:'Simülasyonu başlat; lambaların sırasını izle. Başlangıçtan sonraki 0,2 saniyede yeşilin, 1,2 saniyede kırmızının, 2,1 saniyede yeniden yeşilin yanmasını bekle. Yeşilin iki kez yanmaya başlaması arasındaki süreyi açıkla.',
  steps:['KT1 bobin beslemesini ve lambaların ayrı kontak yollarını bul.','Simülasyonu başlatmadan ilk yanacak lambayı tahmin et.','Yeşil → kırmızı → yeşil sırasını izle.','Yeşil ve kırmızının birer saniyelik sürelerini toplayarak çevrimi bul.','NO kontak kapandığında NC kontağın neden açık olduğunu anlat.'],
  why:'Bir tam çevrim, yeşilin 1 saniyelik yanma süresi ile kırmızının 1 saniyelik yanma süresinin toplamıdır: 1 + 1 = 2 saniye.'
 },
 'timer-flipflop-2':{
  summary:'Yeşil kısa, kırmızı daha uzun yanar. Toplam çevrim değişmeden yanma oranının nasıl değiştiğini inceleyeceksin.',
  goal:'Yeşilin 0,5 saniye, kırmızının 1,5 saniye yanmasını karşılaştırıp yeşilin çevrimin %25’inde yandığını açıklayabilmek.',
  explanation:'Bu kez NO kontağın kapalı kaldığı süre 0,5 saniyedir; bu sırada yeşil lamba yanar. Sonraki 1,5 saniyede NO açılır, NC kapanır ve kırmızı yanar. Çevrim yine 2 saniyedir, fakat iki lambanın yanma süreleri eşit değildir. Yeşilin yanma oranını bulmak için kendi yanma süresini toplam çevrime böl: 0,5 / 2 = 0,25, yani %25. Burada açık kalma oranı denince yeşilin yanması veya flaşör çıkışının etkinliği kastedilir; NO kontağın açık olması değil.',
  task:'Simülasyonda kısa yeşil ve uzun kırmızı evrelerini karşılaştır. Başlangıçtan 0,2 saniye sonra yeşil, 0,6 ve 1,6 saniye sonra kırmızı beklenir. 0,5 saniyeyi 2 saniyelik çevrime bölerek yeşilin yanma oranını bul.',
  steps:['KT1’de 0,5 saniye etkin ve 1,5 saniye pasif sürelerini incele.','Hangi lambanın daha uzun yanacağını tahmin et.','Simülasyonda kısa yeşil ve uzun kırmızı evrelerini izle.','Toplam çevrimi 0,5 + 1,5 işlemiyle bul.','Yeşilin yanma süresini çevrime böl; sonucu yüzdeyle anlat.'],
  why:'Toplam çevrim 0,5 + 1,5 = 2 saniyedir. Yeşil 0,5 saniye yanar: 0,5 / 2 × 100 = %25.'
 },
 'timer-flipflop-3':{
  summary:'Bu kez yeşil uzun, kırmızı kısa yanar. Önceki devreyle aynı çevrim süresinde farklı yanma oranını karşılaştıracaksın.',
  goal:'Yeşilin 1,5 saniye, kırmızının 0,5 saniye yanmasını karşılaştırıp yeşilin çevrimin %75’inde yandığını açıklayabilmek.',
  explanation:'KT1’in etkin evresi 1,5 saniyeye çıkarılmıştır. Bu evrede NO kontak kapalıdır ve yeşil lamba yanar. Ardından 0,5 saniyelik pasif evrede NO açılır, NC kapanır ve kırmızı yanar. Çevrim 1,5 + 0,5 = 2 saniye olarak kalır. Yeşilin yanma oranı 1,5 / 2 = 0,75, yani %75’tir. Sürenin uzun olması kontağın daha fazla akım taşıdığı anlamına gelmez; burada karşılaştırılan yanma süresidir.',
  task:'Simülasyonda yeşilin kırmızıdan uzun yandığını gözlemle. Başlangıçtan 0,6 saniye sonra yeşil, 1,6 saniye sonra kırmızı beklenir. Önceki 0,5/1,5 ayarıyla toplam çevrimi ve yeşilin yanma oranını karşılaştır.',
  steps:['KT1’in 1,5 ve 0,5 saniyelik sürelerini bul.','Yeşilin mi kırmızının mı uzun yanacağını tahmin et.','Simülasyonu başlat ve iki evrenin süresini karşılaştır.','1,5 + 0,5 ile çevrimi, 1,5 / 2 ile yeşilin yanma oranını bul.','Önceki derste çevrim aynıyken hangi sürenin değiştiğini anlat.'],
  why:'Çevrim 1,5 + 0,5 = 2 saniyedir. Yeşilin yanma oranı 1,5 / 2 × 100 = %75 olur.'
 },
 'timer-flipflop-4':{
  summary:'Bir NO ve bir NC kontak aynı flaşör tarafından yönetilir. İki lambanın neden birlikte değil sırayla yandığını açıklayacaksın.',
  goal:'Aynı KT1 referansındaki NO ve NC kontakların karşıt durumlarını iki lambanın dönüşümlü yanmasıyla açıklayabilmek.',
  explanation:'KT1 bobini ile iki yardımcı kontak aynı referansı taşır. Modelin etkin evresinde NO kapanır ve yeşil yanar; NC açıldığı için kırmızı söner. Pasif evrede NO açılır, NC kapanır; bu kez kırmızı yanar. Bobinin beslemesi bu sırada kesilmez: değişen, zaman modelinin kontaklara verdiği durumdur. Bu ideal modelde iki lamba aynı anda yanmaz; her birinin besleme yolu karşıt kontak durumuna bağlıdır.',
  task:'KT1 bobinini, NO 13–14 ve NC 21–22 kontaklarını bul. Simülasyonda yeşil yanarken kırmızının, kırmızı yanarken yeşilin durumunu karşılaştır. Bir kontak kapandığında diğerinin neden açıldığını açıkla.',
  steps:['Bobin ile NO ve NC kontakların aynı KT1 referansını taşıdığını bul.','Yeşilin NO, kırmızının NC üzerinden beslendiğini takip et.','Simülasyonu başlat; yeşil yanarken iki kontağın durumunu karşılaştır.','Kırmızı yanmaya başladığında kontakların nasıl değiştiğini anlat.','Bobinin sürekli beslenmesi ile çıkışın dönüşümlü değişmesini birbirinden ayır.'],
  why:'Aynı KT1 tarafından yönetilen kontaklar karşıt durumdadır. NO kapandığında NC açılır; böylece yeşil beslenirken kırmızının yolu kesilir.'
 }
};
const materialPurpose={
 g1:'KT1 bobinine ve iki lamba koluna 24 VDC besleme sağlar.',
 t:'A1/A2 uçlarından sürekli beslenen flaşördür; ayarlı sürelerle aynı KT1 referansındaki kontakları değiştirir.',
 no:'KT1’in etkin evresinde 13–14 arasında kapanır; yeşil lambanın yolunu tamamlar.',
 nc:'KT1’in etkin evresinde 21–22 arasında açılır; pasif evresinde kapanıp kırmızı lambayı besler.',
 g:'NO kontak kapalıyken yanan yeşil lambadır; flaşörün etkin evresini gösterir.',
 r:'NC kontak kapalıyken yanan kırmızı lambadır; flaşörün pasif evresini gösterir.'
};
for(const [id,on,off,heading,question,options] of rows){
 const teaching=teachingById[id],goal=teaching.goal,task=teaching.task;
 const lesson=L.byId[id];if(!lesson||lesson.topicId!=='timer-flipflop')throw Error('Timer lesson not found: '+id);
 const p=lesson.project,t=p?.components?.find(c=>c.id==='t'&&c.typeId==='coil-flasher');
 const g=p?.components?.find(c=>c.id==='g'&&c.typeId==='lamp-green'),r=p?.components?.find(c=>c.id==='r'&&c.typeId==='lamp-red');
 if(!t||!g||!r||lesson.steps?.length!==p.wires?.length||p.wires.length!==8)throw Error('Timer physical graph missing: '+id);
 t.flashOn=on;t.flashOff=off;
 lesson.designStandard='rich-reference-v1';lesson.learningGoal=goal;lesson.summary=teaching.summary;
 lesson.explanation=teaching.explanation+' Yalnız sanal devre ve zaman modeli gözlemlenir; gerçek enerjili ekipmana müdahale edilmez.';
 lesson.measurementUpgrade={heading,goal,task,question,options,timingModel:true,onSeconds:on,offSeconds:off};
 lesson.beginnerSteps=[...teaching.steps];
 lesson.materials=lesson.materials.map(m=>({...m,why:materialPurpose[m.componentId]||m.why}));
 lesson.quiz={question,options:[...options],answer:0,why:teaching.why};
 lesson.pedagogyReview={...lesson.pedagogyReview,previousVersion:lesson.pedagogyReview?.version||null,version:'v1.19.20-timer-batch-g',reviewed:true,codeImplemented:true,visualAcceptance:false,timingModel:'DTSDeviceBehavior.timed + Simulation.solve',preserveSourceWires:true};
}
L._timerBatchG=true;
})(typeof window==='undefined'?globalThis:window);
