/* MQ-07 Batch K: BERO and motor controls: teaching metadata only; electrical graphs immutable. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._motorBatchK)return;
const rows={
 'bero':['BERO temassız endüktif algılama','Sanal BERO sensöründe BN pozitif, BU sıfır volt ve BK çıkış uçlarını ayırt et. Algılama ve yük akım yolunu takip et.','BERO yaklaşım sensörünün temel işlevi nedir?',['Metali temassız algılamak','Besleme frekansını değiştirmek','Motor faz sırasını ters çevirmek']],
 'motor-forward-reverse':['Motor ileri ve geri yön kumandası','Sanal ileri ve geri kontaktörlerinin karşılıklı kilitlemesini, STOP işlevini ve mühürleme yolunu gözlemle. İki kontaktörün aynı anda çekili kalmaması gerektiğini açıkla.','İleri ve geri kontaktörleri neden kilitlenir?',['Eşzamanlı kapanmayı engellemek için','Motor hızını iki katına çıkarmak için','Nötr ile PE yi birleştirmek için']],
 'motor-star-delta':['Motor yıldız/üçgen geçişi','Altı uçlu motorun sanal yıldız ve üçgen bağlantısını, zamanlama ve karşılıklı kilitleme ilkesini incele. Gerçek elektrik tesisatında uygulama yapma.','Yıldız ve üçgen kontaktörleri neden birlikte etkin olmamalıdır?',['Kısa devre tehlikesi doğurabileceği için','Motor etiketi kaybolduğu için','Buton rengi değiştiği için']]
};
const copy=x=>JSON.parse(JSON.stringify(x));
for(const [topic,cfg] of Object.entries(rows))for(let n=1;n<=4;n++){
 const id=topic+'-'+n,l=L.byId[id];if(!l||l.topicId!==topic)throw Error('Missing canonical '+id);
 const p=l.project;if(!p?.components?.length||!p.wires?.length||l.steps?.length!==p.wires.length)throw Error('Invalid graph '+id);
 const ids=new Set(p.components.map(c=>c.id)),wireKeys=new Set(p.wires.map(w=>JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p])));
 for(const w of p.wires)if(!ids.has(w.from?.c)||!ids.has(w.to?.c))throw Error('Broken component '+id);
 for(const st of l.steps)if(!wireKeys.has(JSON.stringify([st.from?.c,st.from?.p,st.to?.c,st.to?.p])))throw Error('Broken step '+id);
 const goal=cfg[1],task='Yalnız sanal çalışma alanında '+goal+' '+n+'. uygulamanın mevcut kaynak devresini ve terminal adımlarını izle; gerçek solver sonucu ölçülmeden çıktıyı geçmiş kabul etme.';
 l.designStandard='rich-reference-v1';l.learningGoal=goal;l.summary=goal;l.explanation=task;
 l.measurementUpgrade={heading:cfg[0]+' · '+n+'. uygulama',goal,task,question:cfg[2],options:copy(cfg[3]),simulationOnly:true,canonicalCircuitPreserved:true};
 l.beginnerSteps=['Gerçek sanal malzemelerin terminal adlarını tanı.','Mevcut kablo bağlantılarının izleğini göster.',task,'Kanonik devre bağlantılarını rehberle yeniden kur.','Sanal simülasyon sonucunu doğrula ve konu sorusunu yanıtla.'];
 l.quiz={question:cfg[2],options:copy(cfg[3]),answer:0,why:goal};
 l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-motor-batch-k',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,sourceCircuitPreserved:true};
}
L._motorBatchK=true;
})(typeof window==='undefined'?globalThis:window);
