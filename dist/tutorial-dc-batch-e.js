/* MQ-07: six DC-circuits reference lessons, including a physically solved 2S2P battery exercise. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._dcBatteryBatchE)return;
const clone=x=>JSON.parse(JSON.stringify(x)),data=[["01","Doğru akımın yönünü ve kullanımını deneyle","Doğru akım kaynağının +/0 V kutuplarını, 100 Ω yükü ve voltmetrede prob terslenince oluşan işareti açıkla.","24 V kaynağın çıkışı, R1 yükü, aynı düğüm ve ters prob yönünde ölç; I=V/R hesabını yap.","100 Ω yükte 24 V için ideal akım kaç A?",["0,24 A","2,4 A","24 A"]],["02","DC kaynakla kapalı enerji yolunu kur","+24 V ile yükün bağlantısının tek başına yeterli olmadığını, 0 V dönüşü olmadan kapalı devre oluşmayacağını öğren.","Önce doğru terminal bağlantılarını incele, sonra Devreyi yeniden kur ile +24 V → R1 → 0 V güzergâhını tamamla.","Devreyi kapatmak için hangi bağlantı gerekir?",["Yük dönüşünün kaynak 0 V ucuna bağlanması","PE üzerinden rastgele dönüş","Yalnız +24 V kablosu"]],["03","İki pili seri bağlayıp 3 V ölç","İki ayrı 1,5 V hücrede −→+ seri köprüyü ve toplam gerilim hesabını öğren.","Seri köprüyü kur, pillerin tek tek 1,5 V ve paket dış uçlarında 3 V olduğunu UNI-T ile ölç.","İki 1,5 V pil seri bağlanınca toplam kaç V olur?",["3 V","1,5 V","0,75 V"]],["04","İki pili paralel bağlayıp gerilimi karşılaştır","Aynı kutupların ortaklanmasıyla paralel hücrelerin neden ideal olarak 1,5 V verdiğini öğren.","İki hücrenin + uçlarını, sonra − uçlarını birleştir; yükte ve her hücrede yaklaşık 1,5 V ölç.","Aynı iki 1,5 V pil paralel olduğunda dış uçlarda kaç V vardır?",["1,5 V","3 V","0 V"]],["05","İki seri kolu paralel bağla — 2S2P","Bir kolda iki adet 1,5 V hücrenin seri gerilimini toplayıp eş iki seri kolu paralel bağlamanın 3 V kaynak oluşturduğunu öğren.","İlk ve ikinci seri köprüyü kur; +/+ ve −/− ortak raylarını oluştur; 100 Ω yükte UNI-T ile 3 V ve ideal 30 mA ilişkisini doğrula.","Eş iki seri 3 V kolu paralel bağlanırsa paket gerilimi kaç V olur?",["3 V","6 V","1,5 V"]],["06","Ohm kanununu ölçerek uygula","Kaynak gerilimi ve R1 değeri değiştiğinde ampermetreyle okunan akımın I=V/R hesaplamasını izlediğini öğren.","6/12/18/24 V ve 120/240/470 Ω simülasyon seçeneklerini dene; A1 seri akımı ile V1 paralel gerilimini karşılaştır.","24 V ve 120 Ω için ideal akım kaç A?",["0,20 A","2 A","0,02 A"]]];
const W=(a,ap,b,bp,role,why,n)=>({id:'dce-'+n,from:{c:a,p:ap},to:{c:b,p:bp},role,color:role==='0V'?'#111827':role==='SERIES'?'#f59e0b':'#e53935',size:'1.5',points:[],tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
function combined(l){
 const p=clone(l.project),source=L.byId['dc-circuits-src-03']?.project;if(!source)throw Error('Canonical serial-pair voltage laboratory missing');
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
 l.pedagogyReview={version:'v1.19.20-dc-batch-e',reviewed:true,codeImplemented:true,visualAcceptance:false,canonicalContinuity:true};
}
L._dcBatteryBatchE=true;
})(typeof window==='undefined'?globalThis:window);
