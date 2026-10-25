/* SC379 only: independent 24 VDC relay seal-in practice. No mains/motor.
 * START energizes K1, K1 NO 13/14 seals, STOP NC 21/22 drops relay.
 * K1 second NO 13/14 drives H1 indication; virtual study only. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sc379RelaySeal)return;
const l=L.byId['motor-direct-power-outline-019'];
if(!l||l.kind!=='wiring'||l.project?.components?.length!==7||l.project?.wires?.length!==13||
   l.pedagogyReview?.titleTopologyIssue!=='CONTACTOR_SEAL_IN_NOT_STANDALONE_RELAY'||
   !l.project.components.some(c=>c.id==='main'&&c.typeId==='main-contact')||
   !l.project.components.some(c=>c.id==='motor'&&c.typeId==='motor-3p'))
 throw Error('SC379 protected relay lesson/source REVIEW changed');
const clone=x=>JSON.parse(JSON.stringify(x)),p=clone(l.project);
const C=(id,typeId,x,y,ref,label,why)=>({id,typeId,x,y,rotation:0,ref,label,state:false,address:'',note:'',tutorialPurpose:why});
const W=(n,a,ap,b,bp,hint,why,color='#e53935',role='CONTROL')=>({
 id:'sc379-relay-'+n,from:{c:a,p:ap},to:{c:b,p:bp},color,role,size:'1.5',points:[],tutorialHint:hint,tutorialWhy:why});
p.workspaceMode='control';p.projectId='tutorial-session-source-'+l.id;
p.name='Öğretici · '+l.title;
p.tutorialLesson={id:l.id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
p.components=[
 C('g','supply-dc-plus',80,120,'G1','24 VDC sanal kaynak','Düşük gerilimli sanal deney beslemesi; şebeke veya gerçek pano değildir.'),
 C('stop','push-nc',200,290,'S0','STOP · NC 21–22','Normalde kapalı STOP, hem ilk START hem K1 mühürleme kolunu keser.'),
 C('start','push-no',410,260,'S1','START · NO 13–14','K1 bobinini ilk kez enerjilendirir.'),
 C('hold','contact-no',410,430,'K1','K1 · mühürleme NO 13–14','K1 çekince START bırakıldığında bobini tutar.'),
 C('coil','coil-relay',740,350,'K1','K1 · röle bobini A1/A2','Bağımsız röle bobini; kontaktör veya motor değildir.'),
 C('signalNO','contact-no',800,630,'K1','K1 · lamba NO 13–14','İkinci yardımcı kontak, röle çektiğinde H1 lambasını besler.'),
 C('lamp','lamp-green',1060,650,'H1','H1 · röle çalışma göstergesi','K1 aktifken yanan 24 V sanal gösterge.')
];
p.wires=[
 W(1,'g','P','stop','21','G1 +24 V → S0/21','Besleme ilk önce NC STOP üzerinden geçer.'),
 W(2,'stop','22','start','13','S0/22 → S1/13','START için yalnız STOP sonrasında izin vardır.'),
 W(3,'start','14','coil','A1','S1/14 → K1/A1','START röle bobinine ilk enerjiyi verir.'),
 W(4,'coil','A2','g','M','K1/A2 → G1 0 V','Bobinin eksiksiz dönüş yoludur.','#1e88e5','0V'),
 W(5,'stop','22','hold','13','S0/22 → K1 NO/13','K1 mühürlemesi STOP sonrasından beslenir.'),
 W(6,'hold','14','coil','A1','K1 NO/14 → K1/A1','START bırakıldığında röle tutma kolu.'),
 W(7,'g','P','signalNO','13','G1 +24 V → K1 gösterge NO/13','Ayrı NO kontak lamba kolunu besler.'),
 W(8,'signalNO','14','lamp','X1','K1 NO/14 → H1/X1','K1 çekince H1 yanar.'),
 W(9,'lamp','X2','g','M','H1/X2 → G1 0 V','Lamba akımının dönüşüdür.','#1e88e5','0V')
];
if(p.components.length!==7||p.wires.length!==9||new Set(p.wires.map(w=>w.id)).size!==9)
 throw Error('SC379 relay graph incomplete');
l.project=p;l.kind='wiring';l.workspaceMode=p.workspaceMode;
l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
 hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref,
 why:c.tutorialPurpose}));
l.summary='Bağımsız K1 rölesi START ile çekip kendi NO kontağıyla mühürlenir; STOP tüm kumandayı keser. H1 rölenin durumunu gösterir.';
l.explanation='Bir çalışma lambasını tek tuşla açıp açık tutmak istediğini düşün. S1 START’a kısa basınca K1 rölesi çeker. K1’in yardımcı NO kontağı kapanıp buton bırakıldıktan sonra da röleyi tutar. Aynı rölenin ikinci NO kontağı H1 lambasını yakar. S0 STOP’a basınca mühürleme yolu kesilir; STOP’u bıraksan bile yeni START olmadan lamba yanmaz. Bu yalnız 24 V sanal röle devresidir; üç faz motor ve gerçek pano güvenliği değildir.';
l.learningGoal='Röle bobini A1/A2, START NO 13–14, STOP NC 21–22, mühürleme ve gösterge yardımcı kontağının görevlerini açıklamak.';
l.beginnerSteps=[
 'S1 START’a bas; K1 bobini ve H1 gösterge lambası birlikte etkinleşir.',
 'S1’i bırak: K1 mühürleme NO kontağı kapalı kalır, H1 yanmaya devam eder.',
 'S0 STOP’a bas: K1 ve H1 bırakır.',
 'STOP’u bırak: kendiliğinden çalışma olmaz, tekrar START gerekir.',
 'K1/A2 dönüş kablosunu sanal olarak ayırırsan röle ve H1 çalışamaz.'
];
l.quiz={question:'START bırakılınca K1 rölesinin çekili kalmasını hangi bağlantı sağlar?',
 options:['K1 NO 13–14 mühürleme kontağı','Üç fazlı motor güç kontağı','Sadece H1 lamba çıkışı'],
 answer:0,why:'K1 bobini kendi NO kontağı üzerinden STOP sonrasında beslenir.'};
l.pedagogyReview={...l.pedagogyReview,
 componentIds:p.components.map(c=>c.typeId),
 previousTitleTopologyIssue:'CONTACTOR_SEAL_IN_NOT_STANDALONE_RELAY',
 titleTopologyStatus:'REVIEW',titleTopologyIssue:'RELAY_SEAL_IN_NATIVE_VISUAL_PENDING',
 nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false};
l.learningSupport={...l.learningSupport,sc379RelaySeal:'24v-relay-k1-no-hold-v1',
  physicalAcceptanceRequired:true,nativeAcceptanceRequired:true};
l.sc379RelaySeal='24v-relay-k1-no-hold-v1';L._sc379RelaySeal=true;
})(typeof window==='undefined'?globalThis:window);
