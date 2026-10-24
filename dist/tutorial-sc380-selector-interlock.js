/* SC380 only: actual catalog 3-position selector and two NC cross-interlocks.
 * 0=OFF, 1=K1 forward, 2=K2 reverse, 3=unused/OFF.
 * Virtual electrical behavior only; no physical mechanical interlock approval. */
(function(root){'use strict';
 const L=root.DTSTutorialLessons;if(!L||L._sc380SelectorInterlock)return;
 const l=L.byId['motor-direct-power-outline-020'];
 if(!l||l.kind!=='wiring'||l.project?.components?.length!==7||l.project?.wires?.length!==18||
    l.pedagogyReview?.titleTopologyIssue!=='INDEPENDENT_NC_MECHANICAL_INTERLOCK_PENDING'||
    l.pedagogyReview?.motorReversalAcceptance!==true)
   throw Error('SC380 protected selector source or REVIEW state changed');
 const clone=x=>JSON.parse(JSON.stringify(x)),p=clone(l.project),get=id=>p.components.find(c=>c.id===id);
 if(!get('selector')||get('selector').typeId!=='selector-3'||
    !get('coil1')||get('coil1').ref!=='K1'||!get('coil2')||get('coil2').ref!=='K2')
   throw Error('SC380 catalog selector/K1/K2 source changed');
 const erase=(a,ap,b,bp)=>{
   const i=p.wires.findIndex(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
   if(i<0)throw Error('SC380 old control wire missing: '+a+'/'+ap);
   p.wires.splice(i,1);
 };
 erase('selector','13','coil1','A1');
 // The original reverse coil is wrongly on catalog position 3 (pin 15).
 // Position 2 is pin 14; connect its command through K1 NC below.
 erase('selector','15','coil2','A1');
 const C=(id,ref,x,y,label)=>({id,typeId:'contact-nc',x,y,rotation:0,ref,label,state:false,address:'',note:''});
 p.components.push(
  C('lockF','K1',700,745,'K1 NC · geri yön elektriksel kilidi'),
  C('lockR','K2',700,880,'K2 NC · ileri yön elektriksel kilidi'));
 const W=(n,a,ap,b,bp,why)=>({id:'sc380-interlock-'+n,from:{c:a,p:ap},to:{c:b,p:bp},
  color:'#e53935',role:'L1',size:'1.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
 p.wires.push(
  W(1,'selector','13','lockR','21','Seçici konum 1, K2/21–22 NC üzerinden K1 ileri komutunu verir.'),
  W(2,'lockR','22','coil1','A1','K2 aktifse ileri K1 bobini enerjilenemez.'),
  W(3,'selector','14','lockF','21','Seçici konum 2, K1/21–22 NC üzerinden K2 geri komutunu verir.'),
  W(4,'lockF','22','coil2','A1','K1 aktifse geri K2 bobini enerjilenemez.'));
 if(p.components.length!==9||p.wires.length!==20||
    new Set(p.wires.map(w=>w.id)).size!==20)
   throw Error('SC380 electrical interlock source invalid');
 p.projectId='tutorial-session-source-'+l.id;
 p.name='Öğretici · '+l.title;
 p.tutorialLesson={id:l.id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
 l.project=p;l.kind='wiring';l.workspaceMode=p.workspaceMode;
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,
   label:c.label||c.ref,why:c.id==='lockF'||c.id==='lockR'?
   'Diğer yönün bobini çektiğinde NC kontak açılır; iki yönün aynı anda çalışmasını engelleyen sanal elektriksel kilit.':
   'Devrenin sanal motor kumandası içindeki terminal görevi.'}));
 l.summary='S1 seçicinin 0 konumu kapalı, 1 konumu ileri (K1), 2 konumu geri (K2); 3 konumu kullanılmaz. İki NC kontak birbirine karşı elektriksel kilit oluşturur.';
 l.explanation='Bir motorun iki yöne dönebildiği sanal bir kumandayı düşün. Seçiciyi 1 konumuna getirince K1 ileri kontaktörü çalışır. 0 konumunda motor durur. Seçiciyi 2 konumuna getirince K2 geri kontaktörü çalışır. K1 ve K2 birbirinin 21–22 NC yardımcı kontağından geçer: birisi aktifse diğeri aynı anda kumanda alamaz. Üçüncü konum bu devrede kullanılmıyor. Bu örnek elektriksel terminal mantığını gösterir; gerçek kontaktörlerin mekanik kilidi, güvenli yön değiştirme bekleme süresi veya şebeke uygunluğu kabulü değildir.';
 l.beginnerSteps=[
  'S1 seçicinin 0 konumunda motorun durduğunu gözle.',
  '1 konumuna geçince K1 ileri bobininin ve ana güç kontaklarının devreye girdiğini izle.',
  '0 üzerinden 2 konumuna geçince K2 geri bobini çalışır; K1 çalışmaz.',
  'K1/21–22 ve K2/21–22 NC yardımcı kilitlerini incele: karşı yön etkinse bobin yolu açılır.',
  '3 konumu kullanılmıyor. Çıkış kumanda kablosu koparsa o yöndeki kontaktör çalışamaz.'
 ];
 l.pedagogyReview={...l.pedagogyReview,
  componentIds:p.components.map(c=>c.typeId),
  titleTopologyStatus:'SCOPED_ELECTRICAL_INTERLOCK_REPAIRED',
  titleTopologyIssue:'MECHANICAL_INTERLOCK_STILL_PENDING',
  independentElectricalInterlockAcceptance:false,
  nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false};
 l.learningSupport={...l.learningSupport,
  previousSelectorTerminalMismatch:'POSITION_2_WRONGLY_USED_PIN_15',
  sc380ElectricalInterlock:'selector-3-pos2-pin14-two-nc-v1',
  nativeAcceptanceRequired:true,physicalMechanicalInterlockPending:true};
 l.sc380ElectricalInterlock='selector-3-pos2-pin14-two-nc-v1';
 L._sc380SelectorInterlock=true;
})(typeof window==='undefined'?globalThis:window);
