/* Two real 1N4148 DC-clipper lessons: explain the exact native pot sweep.
 * Preserve already wired source, diode polarity and AC-waveform pending status. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._clipperDcSweepBatchAI)return;
const rows=[
 ['039','SOURCE_WIRED_CLIPPER_WAVE_PENDING','Diyotlu kırpıcıda RV1 ayarı değiştikçe çıkış neden hep aynı oranda yükselmez?'],
 ['042','SOURCE_WIRED_CLIPPER_EXERCISE_PENDING','Diyotlu kırpma temrininde D1 iletime geçince çıkışın davranışı nasıl değişir?']
];
for(const [suffix,status,question] of rows){
 const id='electronic-component-basics-outline-'+suffix,l=L.byId[id],p=l?.project,
   expected=[['g1','supply-dc-plus'],['rv','potentiometer'],
     ['rin','resistor'],['d1','1n4148-do35'],['load','resistor'],
     ['ref1','resistor'],['ref2','resistor'],['v1','meter-voltmeter']],
   norm=(a,b)=>[a,b].sort().join('~'),
   edges=['g1.P>rv.1','rv.3>g1.M','rv.2>rin.1','rin.2>d1.A',
     'rin.2>load.1','load.2>g1.M','g1.P>ref1.1',
     'ref1.2>ref2.1','ref2.2>g1.M','d1.K>ref1.2',
     'rin.2>v1.1','v1.2>g1.M'].map(x=>norm(...x.split('>'))).sort(),
   present=p?.wires?.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort();
 if(!l||l.topicId!=='electronic-component-basics'||l.kind!=='wiring'||
    p?.components?.length!==8||p?.wires?.length!==12||l.steps?.length!==12||
    l.pedagogyReview?.titleTopologyStatus!==status||
    l.pedagogyReview?.physicalAcceptance!==false||
    l.pedagogyReview?.nativeDynamicAcceptance!==false||
    l.pedagogyReview?.windowsVisualAcceptance!==false||
    expected.some(([name,type])=>p.components.find(c=>c.id===name)?.typeId!==type)||
    edges.some((x,i)=>x!==present[i]))
   throw Error('Protected 1N4148 DC clipper source differs '+id);
 const locked=JSON.stringify([p,l.steps,l.materials,l.kind,l.pedagogyReview?.titleTopologyStatus]);
 l.quiz={question,
   options:['D1 anot-katot yolu belirli eşikte ileri iletir ve çıkışı sınırlar.',
      'Potansiyometre sadece diyotun rengini değiştirir.',
      'Sanal voltmetre otomatik olarak gerçek AC osiloskop sayılır.'],
   answer:0,
   why:'Giriş RV1/2 ve R1 üzerinden çıkışa gelir. D1/A çıkışta, D1/K R3–R4 referansındadır. Yük yükselirken ileten diyot çıkışın daha fazla yükselmesini sınırlar; ölçülen referans da yüklenebilir.'};
 l.summary='Gerçek 12 bağlantılı sanal 1N4148 kırpıcıda RV1 giriş ayarıyla DC çıkışı karşılaştır. D1 iletime girince çıkış sınırlanır; gerçek AC dalga ölçülmedi.';
 l.explanation='Bir ses seviyesini ayarlamak gibi düşün: RV1 giriş gerilimini değiştirir. '+
   'R1 akımı sınırlar, R3/R4 diyotun referansını oluşturur. '+
   'V1, uygulamanın mevcut native düğüm çözümünden DC çıkış gerilimini okur. '+
   'RV1 %10, %50 ve %90 konumlarını karşılaştırırken D1 in iletime geçtiği durumu ayırt et. '+
   'Diyot ve referans bölücüsü ideal sert 12,7 V kelepçe değildir; yükleme sonucu değeri değişebilir. '+
   'Bu deneme yalnız DC taramadır; osiloskop sinüsü, gerçek 1N4148 eğrisi, fiziksel ölçüm ve Windows kabulü değildir.';
 l.learningGoal='Gerçek 1N4148 A/K, RV1 sürgüsü, 22 kΩ giriş ve sanal voltmetreyle DC kırpma davranışını ölçümden ayırabilmek.';
 l.beginnerSteps=['RV1/2 sürgüsünden R1 üzerinden D1/A çıkış düğümüne giden kabloyu bul.',
   'D1/K ile R3–R4 ortak referansını ve V1 in çıkış/GND bağlantısını takip et.',
   'RV1 %10, %50 ve %90 konumlarında uygulamanın DC V1 değerini karşılaştır.',
   'D1 iletimde değilken çıkışın, iletimdeyken sınırlamanın nasıl değiştiğini açıkla.',
   'Native DC sonucu, gerçek AC kırpılmış dalga veya kalibre edilmiş voltmetre sonucu sanma.'];
 l.pedagogyReview={...l.pedagogyReview,
   sourceCircuitPreserved:true,nativeDcClipperSweepTargetedPass:true,
   nativeDcClipperModel:'native-wired-1N4148-pot-controlled-DC-clipper',
   dcTransferAcceptance:'TARGETED_NATIVE_3_POSITIONS_ONLY',
   acWaveformAcceptance:false,physicalAcceptance:false,
   windowsVisualAcceptance:false,nativeDynamicAcceptance:false,
   independentPedagogicalAcceptance:false};
 if(locked!==JSON.stringify([p,l.steps,l.materials,l.kind,l.pedagogyReview.titleTopologyStatus]))
   throw Error('Physical source graph or wave status changed '+id);
}
L._clipperDcSweepBatchAI=true;
})(typeof window==='undefined'?globalThis:window);