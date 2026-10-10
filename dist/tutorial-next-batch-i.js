/* MQ-07 — Batch I: canonical control and instrument loop lessons. Original graphs are immutable. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._nextBatchI)return;
const specs={
 'control-combinations':[
  ['Kumanda kombinasyonu: mühürleme','Start/Stop yolunun yardımcı NO kontak üzerinden tutma işlevini incele.','Mühürleme hangi elemanla sağlanır?',['Rölenin yardımcı NO kontağı','Stop butonunu iptal ederek','Nötr ile fazı birleştirerek']],
  ['Röle üzerinden sinyal lambası','Bobin devresiyle yardımcı kontaktaki ayrı lamba devresini ayırt et.','Röle yardımcı kontağı neyi kontrol eder?',['Ayrı yük akım yolunu','Kaynak frekansını','Bütün kablo renklerini']],
  ['PNP sensör röle ve lamba','Sanal PNP algılama sinyaliyle röle bobini ve lamba arasındaki nedenselliği izle.','PNP çıkışı algılandığında nereye kumanda eder?',['Röle bobinine','Koruma toprağının kesilmesine','Besleme geriliminin iki katına']],
  ['Kontaktör üzerinden çalışma göstergesi','Start ve Stop komutlarıyla kontaktörün yardımcı NO durumunu yorumla.','Çalışma göstergesi neden yanar?',['Yardımcı NO kontak kapanıp devresini tamamlar','Kontaktörün etiketi değişir','Stop sürekli açık kalır']]
 ],
 'loop-420':[
  ['4–20 mA kapalı döngü','Transmitter, ampermetre ve sanal 24 V kaynağın tek kapalı döngüdeki görevini ayırt et.','Akım ölçeri devreye nasıl dahil ederiz?',['Seri akım yolunda','Rastgele açık uçta','Yalnız lambaya paralel']],
  ['4–20 mA üzerinde 250 Ω yük','Sanal dirençte akımın yük gerilimiyle ilişkisini gözlemle.','250 Ω üzerinde 20 mA için ideal gerilim kaçtır?',['5 V','20 V','0,05 V']],
  ['Loop dönüş yolunu tanı','LOOP+ ve LOOP− uçlarının seri akım çevriminde neden birlikte bulunması gerektiğini açıkla.','Dönüş hattı açılırsa devre için ne söylenebilir?',['Kapalı akım yolu kalmaz','Akım kesin iki katına çıkar','Kaynak başka hatta dönüşür']],
  ['4–20 mA ve 1–5 V ölçek','Sanal 250 Ω alıcı yükünde akım ve gerilim eşleşmesini yorumla.','250 Ω üzerinde 4 mA için ideal gerilim kaçtır?',['1 V','4 V','24 V']]
 ],
 'loop-powered':[
  ['İki telli loop besleme','İki telli transmitterin besleme ve sinyal akımını aynı iki uçtan taşıdığını öğren.','Loop-powered vericide kaç işlevsel loop iletkeni vardır?',['İki','Dört','Sıfır']],
  ['Loop-powered 250 Ω yük','Transmitterin seri döngüsünde 250 Ω yükün nasıl kullanıldığını gözlemle.','Yük neden akım döngüsünde seri olur?',['Aynı akımın akması için','Beslemeyi kısa devre etmek için','Topraklamayı çıkarmak için']],
  ['Loop kaynak ve alıcı yönü','Kaynağın pozitif ucundan başlayıp LOOP+ / LOOP− üzerinden dönüş yolunu takip et.','Transmitterin loop girişine hangi hat gelir?',['Beslemenin pozitif yolu','Koruma iletkeni','Boşta bırakılmış prob']],
  ['Loop gerilim düşümü','250 Ω yükte sanal loop akımıyla yük gerilimini karşılaştır.','20 mA ve 250 Ω için gerilim nedir?',['5 V','1 V','250 V']]
 ],
 'active-passive':[
  ['Pasif verici ve kaynak','Pasif loop elemanı için ayrı 24 V kaynağın rolünü anlat.','Pasif loop için akımı sağlayan nedir?',['Harici döngü beslemesi','Yalnız ölçü aleti ekranı','Koruma topraklaması']],
  ['Pasif döngü ve seri yük','Yük direnci ve ampermetrenin aynı akım yoluna etkisini açıkla.','Aynı seri loop üzerinden hangi nicelik ortak geçer?',['Akım','Her elemanın uç gerilimi','Her elemanın direnci']],
  ['Aktif dönüştürücü çıkışı','Aktif dönüştürücünün kendi beslemesiyle sinyal çıkışını ayır.','Aktif analog çıkışın rolü nedir?',['Döngü akımını sürmek','Zorunlu ikinci aktif kaynağı seri bağlamak','Ampermetreyi atlamak']],
  ['Aktif/pasif ölçüm karşılaştırması','Sanal WAZ5 beslemesini ve OUT+/OUT− alıcı döngüsünü ayrı izle.','Aktif çıkış ile alıcı arasında ne korunur?',['Tamamlanmış seri ölçüm yolu','Kaynakların kısa devresi','Serbest uçtan okuma']]
 ]
};
const copy=o=>JSON.parse(JSON.stringify(o));
for(const [topic,rows] of Object.entries(specs)){
 for(let i=0;i<rows.length;i++){
  const id=topic+'-'+(i+1),l=L.byId[id],r=rows[i];
  if(!l||l.topicId!==topic||!l.project||!l.project.wires?.length||!l.project.components?.length)throw Error('Missing canonical circuit '+id);
  const ids=new Set(l.project.components.map(c=>c.id)),wireKeys=new Set(l.project.wires.map(w=>JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p])));
  if(!Array.isArray(l.steps)||l.steps.length!==l.project.wires.length)throw Error('Original guided step mismatch '+id);
  for(const w of l.project.wires)if(!ids.has(w.from?.c)||!ids.has(w.to?.c))throw Error('Invalid canonical component '+id);
  for(const s of l.steps)if(!wireKeys.has(JSON.stringify([s.from?.c,s.from?.p,s.to?.c,s.to?.p])))throw Error('Invalid canonical guided step '+id);
  const [heading,goal,question,answers]=r;
  const task='Yalnız sanal simülasyonda gerçek kaynak devresini gözlemle: '+goal+' Gerçek terminal etiketlerini izleyerek devreyi yeniden kur; doğrulanmamış ölçüm değerini gerçekleşmiş gibi kabul etme.';
  l.designStandard='rich-reference-v1';l.learningGoal=goal;l.summary=goal;l.explanation=task;
  l.measurementUpgrade={heading,goal,task,question,options:copy(answers),simulationOnly:true,sourceCircuitPreserved:true};
  l.beginnerSteps=['Devredeki gerçek sanal elemanları ve terminalleri tanı.','Kaynak devresindeki mevcut bağlantıları izle.',goal,'Mevcut bağlantıları yeniden kur.', 'Simülasyonda gözlemini yap ve soruyu cevapla.'];
  l.quiz={question,options:copy(answers),answer:0,why:goal};
  l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-next-batch-i',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,sourceCircuitPreserved:true};
 }
}
L._nextBatchI=true;
})(typeof window==='undefined'?globalThis:window);
