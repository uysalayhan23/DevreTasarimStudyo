/* MQ-07: six DC-circuits reference lessons, including a physically solved 2S2P battery exercise. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._dcBatteryBatchE)return;
const clone=x=>JSON.parse(JSON.stringify(x)),data=[["01","Doğru akımın yönünü ve kullanımını deneyle","Doğru akım kaynağının +/0 V kutuplarını, 100 Ω yükü ve voltmetrede prob terslenince oluşan işareti açıkla.","24 V kaynağın çıkışı, R1 yükü, aynı düğüm ve ters prob yönünde ölç; I=V/R hesabını yap.","100 Ω yükte 24 V için ideal akım kaç A?",["0,24 A","2,4 A","24 A"]],["02","DC kaynakla kapalı enerji yolunu kur","+24 V ile yükün bağlantısının tek başına yeterli olmadığını, 0 V dönüşü olmadan kapalı devre oluşmayacağını öğren.","Önce doğru terminal bağlantılarını incele, sonra Devreyi yeniden kur ile +24 V → R1 → 0 V güzergâhını tamamla.","Devreyi kapatmak için hangi bağlantı gerekir?",["Yük dönüşünün kaynak 0 V ucuna bağlanması","PE üzerinden rastgele dönüş","Yalnız +24 V kablosu"]],["03","İki pili seri bağlayıp 3 V ölç","İki ayrı 1,5 V hücrede −→+ seri köprüyü ve toplam gerilim hesabını öğren.","Seri köprüyü kur, pillerin tek tek 1,5 V ve paket dış uçlarında 3 V olduğunu UNI-T ile ölç.","İki 1,5 V pil seri bağlanınca toplam kaç V olur?",["3 V","1,5 V","0,75 V"]],["04","İki pili paralel bağlayıp gerilimi karşılaştır","Aynı kutupların ortaklanmasıyla paralel hücrelerin neden ideal olarak 1,5 V verdiğini öğren.","İki hücrenin + uçlarını, sonra − uçlarını birleştir; yükte ve her hücrede yaklaşık 1,5 V ölç.","Aynı iki 1,5 V pil paralel olduğunda dış uçlarda kaç V vardır?",["1,5 V","3 V","0 V"]],["05","İki seri kolu paralel bağla — 2S2P","Bir kolda iki adet 1,5 V hücrenin seri gerilimini toplayıp eş iki seri kolu paralel bağlamanın 3 V kaynak oluşturduğunu öğren.","İlk ve ikinci seri köprüyü kur; +/+ ve −/− ortak raylarını oluştur; 100 Ω yükte UNI-T ile 3 V ve ideal 30 mA ilişkisini doğrula.","Eş iki seri 3 V kolu paralel bağlanırsa paket gerilimi kaç V olur?",["3 V","6 V","1,5 V"]],["06","Ohm kanununu ölçerek uygula","Kaynak gerilimi ve R1 değeri değiştiğinde ampermetreyle okunan akımın I=V/R hesaplamasını izlediğini öğren.","6/12/18/24 V ve 120/240/470 Ω simülasyon seçeneklerini dene; A1 seri akımı ile V1 paralel gerilimini karşılaştır.","24 V ve 120 Ω için ideal akım kaç A?",["0,20 A","2 A","0,02 A"]]];
const W=(a,ap,b,bp,role,why,n)=>({id:'dce-'+n,from:{c:a,p:ap},to:{c:b,p:bp},role,color:role==='0V'?'#111827':role==='SERIES'?'#f59e0b':'#e53935',size:'1.5',points:[],tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
function combined(l){
 const p=clone(l.project),source=L.byId['dc-circuits-src-03']?.project;if(!source)throw Error('Canonical serial-pair voltage laboratory missing');
 // Repair only the known four-item placeholder, retaining the six authored 2S2P wires.
 if(!['pg0','pg1','pg2','pg3'].every(id=>p.components.some(c=>c.id===id&&c.typeId==='tutorial-battery'))){
  const placeholder=new Set(['g1','b','r','l']);
  if(p.components.length!==4||p.wires.length!==4||!p.components.every(c=>placeholder.has(c.id)))
   throw Error('Unknown 2S2P source: leave source untouched');
  p.components=[
   {id:'pg0',typeId:'tutorial-battery',ref:'BT1',label:'A kolu birinci pil',x:140,y:150,rotation:0,cellVoltage:1.5},
   {id:'pg1',typeId:'tutorial-battery',ref:'BT2',label:'A kolu ikinci pil',x:140,y:540,rotation:0,cellVoltage:1.5},
   {id:'pg2',typeId:'tutorial-battery',ref:'BT3',label:'B kolu birinci pil',x:515,y:150,rotation:0,cellVoltage:1.5},
   {id:'pg3',typeId:'tutorial-battery',ref:'BT4',label:'B kolu ikinci pil',x:515,y:540,rotation:0,cellVoltage:1.5},
   {id:'pg4',typeId:'resistor',ref:'R1',label:'100 Ω yük',x:925,y:390,rotation:0,resistance:100}
  ];
 }
 for(const [id,pack,i] of [['pg0','PACK-A',0],['pg1','PACK-A',1],['pg2','PACK-B',0],['pg3','PACK-B',1]]){
  const cell=p.components.find(c=>c.id===id);if(!cell||cell.typeId!=='tutorial-battery')throw Error('Missing cell '+id);
  cell.cellVoltage=1.5;cell.seriesPackId=pack;cell.seriesIndex=i;cell.tutorialPurpose='Sanal '+pack+' seri hücre '+(i+1)+' · 1,5 V';
 }
 const load=p.components.find(c=>c.id==='pg4');if(!load||load.typeId!=='resistor')throw Error('R1 load unavailable');
 load.resistance=100;load.tutorialPurpose='3 V/100 Ω = 30 mA ideal yük akımı; hücrelerde farklı kimya veya eşit olmayan voltaj kullanılmaz.';
 p.wires=[
  W('pg0','−','pg1','+','SERIES','Birinci seri kol; dış gerilim 1,5+1,5=3 V',1),
  W('pg2','−','pg3','+','SERIES','İkinci seri kol; dış gerilim 1,5+1,5=3 V',2),
  W('pg0','+','pg2','+','+3V','Eş seri kolların dış pozitifleri ortak',3),
  W('pg1','−','pg3','−','0V','Eş seri kolların dış negatifleri ortak',4),
  W('pg0','+','pg4','1','+3V','3 V kaynak yükün girişine bağlanır',5),
  W('pg4','2','pg1','−','0V','Yük dış negatif raya döner',6)
 ];
 const probes=source.components.filter(c=>['v1','v1-red','v1-black'].includes(c.id)).map(clone);
 for(const c of probes){c.y-=50;if(c.probeTarget)c.probeTarget.c=c.id==='v1-red'?'pg0':'pg1'}
 p.components.push(...probes);
 p.wires.push(...source.wires.filter(w=>w.probeLead).map(clone));
 p.junctions=[];delete p.referenceOnly;
 p.tutorialExplore={type:'battery-series-parallel-rich',simulationOnly:true,topology:'2S2P',expectedVoltageV:3,expectedCurrentA:.03};
 return p;
}
const friendly=[
 {
  "summary": "Doğru akımın yönünü, 24 V kaynağı ve voltmetreyle birlikte keşfediyoruz.",
  "goal": "Bir yükün neden akım çektiğini ve probları ters çevirince ölçüm işaretinin neden değiştiğini anlayacaksın.",
  "story": "Bir el fenerinin pili gibi G1 sanal kaynağı da belirli kutuplara sahip. Kaynağın P ve M uçlarını bul, R1 yükünü izle, sonra ölçüm problarını karşılaştır.",
  "steps": [
   "G1'in P ve M uçlarını bul.",
   "R1 üzerindeki gerilimi gözlemle.",
   "Probları aynı düğüme taşıyıp ölç.",
   "Probları ters çevirip işareti karşılaştır."
  ]
 },
 {
  "summary": "Bir DC devresi yalnız gidiş kablosuyla çalışmaz; dönüş yolu da gerekir.",
  "goal": "Kaynak, yük ve dönüş hattının kapalı bir akım yolu oluşturduğunu göreceksin.",
  "story": "G1'in artı ucunu R1'e bağladığını düşün. Peki akım nereye dönecek? Yükün diğer ucunu G1'in M noktasına bağlayan sanal yolun neden gerektiğine bakalım.",
  "steps": [
   "G1'in artı ve 0 V uçlarını tanı.",
   "R1'in iki terminalini bul.",
   "Devredeki kapalı dönüş yolunu izle.",
   "Kaynak ve yük gerilimlerini sanal multimetrede karşılaştır."
  ]
 },
 {
  "summary": "İki 1,5 V pili seri bağlayınca toplam gerilim yaklaşık 3 V olur.",
  "goal": "Seri köprüyü ve paketin dış uçlarını bulup gerilimlerin nasıl toplandığını ölçeceksin.",
  "story": "El fenerine iki pil koyduğunu düşün. Bir pilin eksi ucuyla öbürünün artı ucu birleşince tek bir seri yol oluşur. Önce pilleri tek tek, sonra paketin dış uçlarını ölç.",
  "steps": [
   "İki pilin artı ve eksi uçlarını bul.",
   "Aradaki seri köprüyü incele.",
   "Her hücreyi ayrı ölç.",
   "Paketi dış uçlarından ölç ve değerleri topla."
  ]
 },
 {
  "summary": "İki eş pili paralel bağlayınca gerilim yaklaşık 1,5 V kalır.",
  "goal": "Ortak artı ve eksi hatlarını bulup neden gerilimin toplanmadığını göreceksin.",
  "story": "İki eş pilin artı uçlarını aynı noktada, eksi uçlarını da başka bir noktada birleştirdiğini düşün. Bu sanal pakette iki pil aynı gerilimi paylaşıyor; seri devre gibi 3 V üretmiyor.",
  "steps": [
   "İki pilin artı uçlarını bul.",
   "Ortak eksi bağlantısını incele.",
   "Pilleri tek tek ölç.",
   "Ortak uçları ölçüp seri devreyle karşılaştır."
  ]
 }
];
for(const [suffix,heading,goal,task,question,options] of data){
 const id='dc-circuits-src-'+suffix,l=L.byId[id];if(!l||l.topicId!=='dc-circuits')throw Error('DC lesson missing: '+id);
 if(suffix==='05'){
  l.project=combined(l);l.kind='wiring';l.steps=l.project.wires.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,role:w.role,color:w.color,size:w.size}));
 }
 l.designStandard='rich-reference-v1';l.measurementUpgrade={heading,goal,task,question,options,dcStudy:true};
 l.summary=goal;l.learningGoal=goal;l.explanation=task+' Bu bölüm yalnız sanal düşük gerilimli elektrik laboratuvarıdır.';
 l.beginnerSteps=['Önce kutupları ve kullanılan bileşenleri öğren.','Devreyi çalıştırmadan sonucu tahmin et.',task,'Probu taşı, ölçümün neden değiştiğini açıkla.','Devreyi yeniden kur ve konu kontrolünü cevapla.'];
 l.quiz={question,options,answer:0,why:goal};
 l.materials=l.project.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref||c.id,why:c.tutorialPurpose||'Sanal ders malzemesi'}));
 if(Number(suffix)<=4){const f=friendly[Number(suffix)-1];l.summary=f.summary;l.learningGoal=f.goal;l.explanation=f.story+' Bu yalnız sanal eğitim örneğidir.';l.beginnerSteps=[...f.steps]}
 if(suffix==='05'){
  l.summary='Dört pilin iki seri kolunu paralel birleştirerek 3 V sanal paket elde ediyoruz.';
  l.learningGoal='İki adet 3 V seri kolun paralel bağlandığında toplam gerilimin neden 3 V kaldığını ve 100 Ω yükte ideal 30 mA akımı açıklayacaksın.';
  l.explanation='Dört pilin olduğunu düşün: ilk ikisi bir sıra, diğer ikisi ikinci sıra. Her sıranın gerilimi 1,5 + 1,5 = 3 V. İki sıranın artı ve eksi uçlarını ortaklaştırınca gerilim yine 3 V kalır. 100 Ω yük için beklenen akım 30 mA olur. Bu yalnız sanal örnektir.';
  l.beginnerSteps=['İlk iki pilin seri köprüsünü bul.','İkinci seri kolun köprüsünü bul.','İki kolun ortak artı ve eksi bağlantılarını izle.','3 V / 100 Ω hesabını yap.'];
  if(!l.project.components.some(c=>c.typeId==='unit-ut61e-plus'||c.typeId==='unit-ut33d-plus'||c.typeId==='multimeter'))
   l.measurementUpgrade.task='Sanal devrede dört pili ve 100 Ω yükü izle; 3 V ve 30 mA ideal değerlerini hesapla. Bu proje henüz bağlı bir ölçü aleti içermediğinden cihaz okuması doğrulanmış değildir.';
 }
 if(suffix==='06'){
  l.summary='Gerilimi ya da direnci değiştirince akımın nasıl değiştiğini keşfediyoruz.';
  l.learningGoal='Ohm Kanunu ile 24 V ve 120 Ω için ideal 0,20 A akımı bulabileceksin.';
  l.explanation='Sanal bir deney masasında önce kaynağın gerilimini, sonra R1 direncini değiştiriyoruz. Aynı dirençte daha yüksek gerilim daha yüksek akım demek. Aynı gerilimde direnç büyürse akım azalır. Beklenen sonucu hesapla ve çalışan sanal ölçüm varsa karşılaştır.';
  l.beginnerSteps=['24 V ve 120 Ω için akımı tahmin et.','Gerilimi değiştirip ideal akımı hesapla.','Direnci değiştirip sonucu karşılaştır.','Çalışan sanal ölçüm yoksa hesapla ölçümü eşit sayma.'];
 }
 l.pedagogyReview={version:'v1.19.20-dc-batch-e',reviewed:true,codeImplemented:true,visualAcceptance:false,canonicalContinuity:true};
}
L._dcBatteryBatchE=true;
})(typeof window==='undefined'?globalThis:window);
