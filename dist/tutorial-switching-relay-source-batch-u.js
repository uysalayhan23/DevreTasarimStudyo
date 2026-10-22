/* SC124–125: relay terminal lessons. Keep their canonical virtual wiring unchanged. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._switchingRelaySourceBatchU)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const rows=[
 {id:'electronic-switching-src-01',parts:['supply-dc-plus','push-no','coil-relay','lamp-green','contact-no'],
  goal:'Rölenin bobin uçları ile anahtarladığı kontak uçlarını birbirinden ayırt et.',
  story:'Bu sanal devrede S1 butonuna basınca K1 bobini A1–A2 üzerinden enerjilenir. Bobin çektiğinde K1 yardımcı NO kontağı 13–14 kapanır ve H1 lambasının ayrı yolu tamamlanır. S1 bırakıldığında bobin ve NO kontak eski durumuna döner. Röledeki bütün kontak çeşitleri bu örnekte gösterilmez.',
  steps:['G1 sanal 24 V kaynağı ile S1/13–14 girişini tanı.','K1/A1 ve K1/A2 bobin uçlarını gör.','K1/13–14 yardımcı NO kontağının H1 yük yolundan ayrı bir kumanda işlevi olduğunu izle.','Sanal butona basıp bırakınca bobin ve kontağın durumunu karşılaştır.'],
  question:'K1 rölesinin hangi terminal çifti bobine aittir?',
  answers:['A1 ve A2','13 ve 14','H1/X1 ve X2'],
  why:'A1–A2 bobindir. 13–14 ise bu devredeki normalde açık yardımcı kontak çiftidir.'},
 {id:'electronic-switching-src-02',parts:['supply-dc-plus','push-nc','push-no','contact-no','coil-relay'],
  goal:'Başlat butonu bırakıldıktan sonra K1 rölesinin hangi yoldan çalışmaya devam ettiğini keşfet.',
  story:'Sanal S1 Başlat butonuna kısa süre bastığında K1 bobini çeker. K1/13–14 yardımcı NO kontağı, Başlat ile paralel ikinci bir yol açar; böylece S1 bırakıldığında bobin enerjili kalabilir. S0 Durdur butonu 21–22 NC yolunu açınca hem ilk başlatma hem de mühürleme yolu kesilir.',
  steps:['S0/21–22 normalde kapalı Durdur yolunu bul.','S1/13–14 Başlat yolunu ve buna paralel K1/13–14 mühürleme yolunu karşılaştır.','K1/A1–A2 bobini ile 24 VDC kaynağın dönüş yolunu izle.','Sanal Başlat ve Durdur komutlarının farkını gözlemle.'],
  question:'Başlat butonu bırakıldığında K1 bobininin çalışmasını hangi bağlantı sürdürür?',
  answers:['K1/13–14 mühürleme kontağının paralel yolu','S0 Durdur butonunun sürekli basılı kalması','A2 bobin ucunu PE kabul etmek'],
  why:'K1 yardımcı NO kontağı kapandığında S1’e paralel tutma yolu kurulur. S0 açılırsa bu yol da kesilir.'}
];
const affected=[];
for(const r of rows){
 const l=L.byId[r.id];
 if(!l||l.topicId!=='electronic-switching'||!l.project||!Array.isArray(l.steps))throw Error('Missing relay lesson '+r.id);
 if(l.designStandard==='rich-reference-v1'||l.pedagogyReview?.simulationAcceptance===true){affected.push(r.id+':rich-preserved');continue}
 const before=JSON.stringify(l.project),p=l.project;
 if(p.components.length!==r.parts.length||p.components.some((c,i)=>c.typeId!==r.parts[i])||p.wires.length!==6||l.steps.length!==6)
  throw Error('Changed canonical relay topology '+r.id);
 const ids=new Set(p.components.map(c=>c.id));
 const stepEnds=new Set(l.steps.map(s=>JSON.stringify([s.from?.c,s.from?.p,s.to?.c,s.to?.p])));
 for(const w of p.wires){
  if(!ids.has(w.from?.c)||!ids.has(w.to?.c)||!stepEnds.has(JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p])))
   throw Error('Unmatched canonical terminal '+r.id);
 }
 l.learningGoal=r.goal;l.summary=r.goal;
 l.explanation=r.story+' Bu bir sanal bağlantı çalışmasıdır; gerçek cihazın ölçülmüş çalışma garantisi değildir.';
 l.beginnerSteps=clone(r.steps);
 l.quiz={question:r.question,options:clone(r.answers),answer:0,why:r.why};
 l.safety='Yalnız sanal 24 VDC röle devresinde çalışılır; gerçek enerjili tesisata bağlantı yapılmaz.';
 l.pedagogyReview={...(l.pedagogyReview||{}),
  version:'v1.19.20-switching-relay-batch-u',
  reviewed:true,codeImplemented:true,sourceCircuitPreserved:true,
  simulationAcceptance:l.pedagogyReview?.simulationAcceptance??false,
  visualAcceptance:l.pedagogyReview?.visualAcceptance??false};
 if(JSON.stringify(l.project)!==before)throw Error('Canonical project modified '+r.id);
 affected.push(r.id+':wiring-preserved');
}
L._switchingRelaySourceBatchU=true;
L._switchingRelayBatchUResult=affected;
})(typeof window==='undefined'?globalThis:window);