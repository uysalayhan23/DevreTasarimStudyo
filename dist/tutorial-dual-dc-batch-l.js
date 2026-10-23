/* MQ-07 Batch L: dual DC supply pedagogical overlays, no rewiring of canonical circuits. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._dualDcBatchL)return;
const rows=[
 ['Bağımsız iki DC kaynak','İki ayrı kaynağın pozitif ve dönüş uçlarını birbirine karıştırmadan iki izole yükü gözlemle.','İzole iki devrede dönüş hatları nasıl kalır?',['Her kaynak kendi dönüşüne bağlı','Pozitifler doğrudan birleştirilir','İki kaynak paralel kısa devre edilir']],
 ['Ortak 0 V ile sinyal paylaşımı','Sanal G1 sensörü ve G2 yükünün ortak 0 V referansı sayesinde aynı kontrol sinyalini nasıl paylaşabildiğini kavra.','Ortak referans için hangi terminaller bağlanır?',['G1/M ve G2/M','G1/P ve G2/P','G1/P ve G2/M']],
 ['Kuru kontakla kaynak izolasyonu','G1 kumandasının röleyi çalıştırdığı ve K1 kuru kontağının G2 yükünü ayrı devreden kontrol ettiği yolu izle.','Kuru kontak neden yararlıdır?',['İki beslemeyi galvanik açıdan ayırarak kontrol aktarabilir','İki pozitif kaynağı birleştirir','Her iki kaynağın gerilimini artırır']],
 ['NPN sensör ve ortak sıfır volt','Sanal NPN sensörün G1 kaynağından beslendiğini, G2 yükünü ise ortak 0 V üzerinden kontrol ettiğini açıkla.','NPN çıkışındaki yük hangi kaynaktan beslenir?',['G2 pozitif hattından','Sensör gövdesinden','Koruma toprağından']]
];
const stories=[
 {
  "summary": "İki DC kaynağın her biri kendi devresini besliyor.",
  "goal": "Birbirine bağlanmadan çalışan iki ayrı kaynak yolunu ayırt edeceksin.",
  "story": "Yan yana iki küçük sanal lamba düşün. Birini G1, diğerini G2 çalıştırıyor. Birinci lambanın akımı G1'e, ikinci lambanınki G2'ye dönüyor. Yan yana durmaları kablolarının birleştiği anlamına gelmiyor.",
  "task": "Her kaynağın gidiş ve dönüş hattını ayrı izle. Arada ortak kablo görüyor musun?",
  "steps": [
   "G1'in yükünü bul.",
   "G1'in dönüş yolunu takip et.",
   "G2 için de aynısını yap.",
   "İki kaynak arasında kablo olmadığını gözlemle."
  ],
  "why": "Her kaynağın kendi kapalı akım yolu vardır. Bir kaynağın artı ucunu ötekinin dönüşüne rastgele bağlamak, bu iki ayrı devre örneğinin amacı değildir."
 },
 {
  "summary": "Ortak 0 V noktası iki cihazın sinyal paylaşmasını kolaylaştırıyor.",
  "goal": "G1/M ve G2/M'nin ortaklaşmasının nedenini fark edeceksin.",
  "story": "Bir sensörün başka bir cihaza haber verdiğini düşün. Sensörü G1, diğer taraftaki yükü G2 besliyor. Bu sanal örnekte iki cihaz aynı 0 V referansını kullanıyor. Böylece sensörün çıkış sinyali G2 tarafındaki yük için anlam kazanıyor. Ancak iki gerçek kaynağın 0 V uçları her zaman birleştirilmez; kaynakların bağlantıya uygunluğu ve elektriksel güvenliği ayrıca doğrulanmalıdır.",
  "task": "G1/M ile G2/M arasındaki hattı bul ve sinyali izle.",
  "steps": [
   "İki kaynağın M uçlarını bul.",
   "Ortak 0 V kablosunu izle.",
   "Sensörü ve G2 tarafındaki yükü bul.",
   "Ortak referansın neden gerekli olduğunu anlat."
  ],
  "why": "Ortak 0 V, sinyal seviyelerini iki cihaz için karşılaştırılabilir yapar."
 },
 {
  "summary": "Röle, ayrı iki besleme arasında komut aktarabiliyor.",
  "goal": "Bobin ve kuru kontağın farklı devrelerde görev yaptığını göreceksin.",
  "story": "Bir odadaki düğmenin başka odadaki sanal lambayı yönettiğini hayal et. G1 rölenin bobinini çalıştırıyor. K1'in kuru kontağı ise G2 ile beslenen lambayı açıp kapatıyor. K1 kontağı G2 devresini açıp kapatırken G1 beslemesinin artı veya eksi hattı G2 hattına taşınmıyor. Bu, röle kontaklarıyla aktarılan bir anahtarlama komutudur; gerçek rölenin yalıtım ve kontak sınırları ayrıca kontrol edilmelidir.",
  "task": "Önce G1'in röle bobinini, sonra K1 kontağının G2 yükünü nasıl kontrol ettiğini izle.",
  "steps": [
   "G1 tarafındaki bobini bul.",
   "G2 tarafındaki yükü bul.",
   "K1 kontağının yerini izle.",
   "Sanal röleyi değiştirip yükü gözlemle."
  ],
  "why": "Kuru kontak, bobinin besleme gerilimini ikinci devreye taşımadan anahtarlama yapar."
 },
 {
  "summary": "NPN sensör, yükün 0 V'a dönüş yolunu kontrol ediyor.",
  "goal": "Yükün G2'den, sensörün ise G1'den beslendiğini göreceksin.",
  "story": "Bir makinede parça algılayan sanal sensör düşün. G1 sensörü, G2 ise lambayı besliyor. NPN çıkışı iletken olunca lambanın akımı ortak 0 V noktasına geri dönebiliyor. Sensör lambaya G1'in artı ucunu vermiyor; dönüş yolunu açıp kapatıyor.",
  "task": "G2'nin artı ucundan yüke giden ve NPN çıkışından geri dönen yolları karşılaştır.",
  "steps": [
   "G1 ile beslenen sensörü bul.",
   "G2 ile beslenen yükü bul.",
   "Ortak 0 V hattını takip et.",
   "Sanal algılama durumunda yükü gözlemle."
  ],
  "why": "NPN çıkış dönüş hattını anahtarlar; yükün pozitif beslemesi G2'den gelir."
 }
];
for(let n=1;n<=4;n++){
 const l=L.byId['dual-dc-'+n],r=rows[n-1];if(!l||l.topicId!=='dual-dc'||!l.project?.wires||!l.project?.components)throw Error('Missing canonical dual dc '+n);
 const p=l.project,expected=[4,5,6,5][n-1],ids=new Set(p.components.map(c=>c.id));
 if(p.wires.length!==expected||l.steps?.length!==expected)throw Error('Incorrect dual DC graph '+n);
 const wireKeys=new Set(p.wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p])));
 for(const w of p.wires)if(!ids.has(w.from.c)||!ids.has(w.to.c))throw Error('Missing canonical component '+n);
 for(const s of l.steps)if(!wireKeys.has(JSON.stringify([s.from.c,s.from.p,s.to.c,s.to.p])))throw Error('Noncanonical guided terminal '+n);
 if(n===1||n===3){if(p.intentionalElectricalIslands!==2)throw Error('Missing explicit isolation '+n)}
 if(n===2||n===4){if(!p.wires.some(w=>w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='g2'&&w.to.p==='M'))throw Error('Missing common reference '+n)}
 const [heading,_oldGoal,question,options]=r,story=stories[n-1];
 l.designStandard='rich-reference-v1';l.summary=story.summary;l.learningGoal=story.goal;
 l.explanation=story.story+' Bu yalnız sanal eğitim örneğidir.';
 l.measurementUpgrade={heading,goal:'Sanal devrede şimdi ne oluyor?',task:story.task,question,options:[...options],simulationOnly:true,preserveCanonical:true};
 l.beginnerSteps=[...story.steps];
 l.quiz={question,options:[...options],answer:0,why:story.why};
 l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'20261022-dual-dc-stories2',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true};
}
L._dualDcBatchL=true;
})(typeof window==='undefined'?globalThis:window);
