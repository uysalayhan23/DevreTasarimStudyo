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

/* SC070–073 motor reversal: circuit-specific virtual lessons; no field wiring. */
const motorReversalDetails={
  "motor-forward-reverse-1": {
    "goal": "İleri/geri kontaktörlerinin çapraz NC kilitleme ve mühürleme mantığını öğren.",
    "task": "Sanal S1 İleri komutuyla K1 bobini çalışır; K1/13–14 mühürleme kontağı S1 bırakıldığında K1'i tutar. K1'in 21–22 NC kilidi K2 Geri yolunu keser. S0 Stop iki bobini bırakır; sanal S2 Geri seçilince motorun U ile W fazları yer değiştirir.",
    "question": "K1 İleri çalışırken S2 Geri komutu neden K2'yi çalıştırmaz?",
    "answers": [
      "K1'e bağlı 21–22 NC kilit K2 bobin yolunu kestiği için",
      "S2 gerilimi iki katına çıkardığı için",
      "Motorun PE ucu yön değiştirdiği için"
    ],
    "obs": [
      "S0/21–22 ortak Stop kumandasıdır.",
      "K1/13–14 ve K2/13–14, ilgili Start butonuna paralel mühürleme kontağıdır.",
      "K1'in NC kilidi K2 bobin yolundadır; K2'nin NC kilidi K1 bobin yolundadır.",
      "İleri L1/L2/L3→U/V/W, geri L3/L2/L1→U/V/W."
    ],
    "steps": [
      "Sanal S0, S1, S2 ile iki kontaktörün bobinini bul.",
      "S1'i sanal olarak basıp bırak, K1 mühürlemesini izle.",
      "K1 çalışırken S2 komutunu dene ve kilidi gözlemle.",
      "S0 ile durdurup S2'yle geri dönüşü gözlemle.",
      "26 kablolu devreyi değiştirmeden uçlarını takip et."
    ]
  },
  "motor-forward-reverse-2": {
    "goal": "Mühürlemeli ileri/geri kumandasında H1 yeşil ve H2 kırmızı yön lambalarının bobinlere bağlılığını anla.",
    "task": "Sanal K1 İleri bobini enerjilenince K1/A1'e bağlı H1 yeşil yanar; K2 Geri bobininden beslenen H2 kırmızı söner. Stop her iki bobini ve lambayı bırakır. Karşılıklı NC kilit iki yönü birlikte çalıştırmaz.",
    "question": "Sanal K2 Geri bobini çalışırken hangi yön lambası yanar?",
    "answers": [
      "H2 kırmızı",
      "H1 yeşil",
      "İki lamba birlikte"
    ],
    "obs": [
      "H1/X1, K1/A1 düğümüne; H1/X2, G1/N'ye bağlıdır.",
      "H2/X1, K2/A1 düğümüne; H2/X2, G1/N'ye bağlıdır.",
      "İleri K1 ve geri K2 bobinleri ayrı mühürlenir.",
      "Geri ana kontakta motorun ilk ve üçüncü fazları yer değiştirir."
    ],
    "steps": [
      "Sanal K1/K2 ve H1/H2 göstergelerini tanı.",
      "İleri komutunda H1'i izle.",
      "Start bırakılınca K1 mühürlemeyi gözlemle.",
      "Stop sonrası Geri komutunda H2'yi izle.",
      "30 mevcut kablonun bobin ve gösterge uçlarını kontrol et."
    ]
  },
  "motor-forward-reverse-3": {
    "goal": "Geri yönde L1 ve L2 fazlarının yer değiştirildiğini sanal motor yönünden öğren.",
    "task": "K1 İleri ana kontağı G1/L1–L2–L3'ü motor U–V–W'ye taşır. K2 Geri ana kontağı ilk iki fazı çaprazlar: motorun U–V–W uçları L2–L1–L3 olur. S0 Stop, NC kilitler ve mühürleme bu sanal seçimi güvenli sırada tutar.",
    "question": "Üçüncü motor varyantında Geri yön için hangi iki fazın yeri değişir?",
    "answers": [
      "L1 ve L2",
      "L1 ve L3",
      "L2 ve L3"
    ],
    "obs": [
      "İleri: L1→U, L2→V, L3→W.",
      "Geri: L2→U, L1→V, L3→W.",
      "İki kontaktör birlikte çekmez.",
      "PE ucu koruma bağlantısıdır; faz değişiminde kullanılmaz."
    ],
    "steps": [
      "Sanal K1'in U/V/W faz sırasını incele.",
      "K2 Geri yolunda ilk iki fazın çaprazlandığını göster.",
      "Stop araya girerek sanal İleri/Geri komutlarını karşılaştır.",
      "NC kilidi ve mühürlemeyi gözlemle.",
      "26 devre kablosunu değiştirmeden fazları takip et."
    ]
  },
  "motor-forward-reverse-4": {
    "goal": "İlk iki fazın çaprazlandığı ileri/geri devrede yön lambalarıyla kilitleme ve mühürlemeyi birlikte yorumla.",
    "task": "Sanal K1 İleri ve K2 Geri kontaktörleri karşılıklı NC kontakla kilitlenir; K2 Geri ana kontağında L1 ve L2 yer değiştirir. K1/A1'e bağlı H1 yeşil, K2/A1'e bağlı H2 kırmızı gösterge seçilen yönü bildirir. S0 Stop tüm bobinleri ve göstergeleri bırakır.",
    "question": "Dördüncü varyantta K1 İleri bobini mühürlenmişken hangi gösterge yanar?",
    "answers": [
      "H1 yeşil",
      "H2 kırmızı",
      "İki gösterge aynı anda"
    ],
    "obs": [
      "İleri: L1/L2/L3→U/V/W.",
      "Geri: L2/L1/L3→U/V/W.",
      "H1/X1→K1/A1, H2/X1→K2/A1; X2 dönüşleri G1/N'dir.",
      "NC çapraz kilit iki kontaktörün birlikte çekmesini önler."
    ],
    "steps": [
      "Sanal Stop/İleri/Geri komutlarını tanı.",
      "İleri çalışırken H1 ile mühürleme durumunu izle.",
      "K1 açıkken Geri komutunda kilidi kontrol et.",
      "Stop sonrası Geri komutunda H2'yi izle.",
      "30 kablolu devrede faz, bobin ve gösterge bağlantılarını göster."
    ]
  }
};
for(const [id,t] of Object.entries(motorReversalDetails)){
 const l=L.byId[id],expectedWires=id.endsWith('-2')||id.endsWith('-4')?30:26;
 if(!l||l.project?.wires?.length!==expectedWires||l.steps?.length!==expectedWires)throw Error('Motor graph altered: '+id);
 l.learningGoal=t.goal;l.summary=t.goal;
 l.explanation=t.task+' Bu bir sanal eğitim uygulamasıdır, gerçek elektrik tesisatı uygulama yönergesi değildir.';
 l.measurementUpgrade={...l.measurementUpgrade,goal:t.goal,task:t.task,question:t.question,options:copy(t.answers),observationPoints:copy(t.obs),simulationOnly:true,canonicalCircuitPreserved:true};
 l.beginnerSteps=copy(t.steps);
 l.quiz={question:t.question,options:copy(t.answers),answer:0,why:t.goal};
}
L._motorBatchK=true;
})(typeof window==='undefined'?globalThis:window);
