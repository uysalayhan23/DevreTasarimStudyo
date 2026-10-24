/* SC271 only: physically wired K0 cycle permission for virtual limit-controlled travel.
   STOP must clear auto-return permission; releasing STOP must never rearm the motor.
   No mechanical travel or real emergency-stop safety is implied. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sc271StopRearmGuard)return;
const l=L.byId['motor-direct-power-src-17'];
if(!l||l.sc263Sc282Story!=='20261024-sc263-sc282-1'||
 l.pedagogyReview?.titleTopologyIssue!=='LIMIT_AUTO_RETURN_NATIVE_PENDING'||
 l.project.components.length!==21||l.project.wires.length!==38||
 l.project.components.some(c=>c.id==='armCoil'))
 throw Error('SC271 protected original limit-return circuit changed');
const clone=x=>JSON.parse(JSON.stringify(x)),p=clone(l.project);
const required=[['g1','supply-3p'],['stop','push-nc'],['startF','push-no'],
 ['startR','push-no'],['coilF','coil-contactor'],['coilR','coil-contactor'],
 ['ls1','limit-nc'],['ls2','limit-nc'],['senseF','coil-relay'],['senseR','coil-relay'],
 ['autoR','contact-nc'],['autoF','contact-nc'],['motor','motor-3p']];
if(!required.every(([id,type])=>p.components.some(c=>c.id===id&&c.typeId===type)))
 throw Error('SC271 real motor component identity mismatch');
const erase=(a,ap,b,bp)=>{
 const i=p.wires.findIndex(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
 if(i<0)throw Error('SC271 old automatic branch missing: '+a+'→'+b);
 p.wires.splice(i,1);
};
erase('lockF','22','autoR','21');
erase('lockR','22','autoF','21');
const C=(id,typeId,x,y,ref,label,purpose)=>({id,typeId,x,y,rotation:0,ref,label,state:false,address:'',note:'',tutorialPurpose:purpose});
p.components.push(
 C('armCoil','coil-contactor',890,890,'K0','K0 · hareket çevrim izni','Motor ileri/geri çalıştığında kurulan ve STOP ile sıfırlanan izin bobini.'),
 C('armSeal','contact-no',690,900,'K0','K0 NO · izin mühürleme','STOP bırakılıp yeniden START verilene kadar izin yeniden kurulmaz.'),
 C('armFromF','contact-no',470,895,'K1','K1 NO · K0 başlatma','İleri kontaktör çalışınca K0 çevrim izni kurulur.'),
 C('armFromR','contact-no',470,1000,'K2','K2 NO · K0 başlatma','Geri kontaktör çalışınca K0 çevrim izni kurulur.'),
 C('autoGateR','contact-no',1270,895,'K0','K0 NO · otomatik geri izin','K0 yoksa LS1 üzerinden otomatik geri START yolu kapalıdır.'),
 C('autoGateF','contact-no',1270,1000,'K0','K0 NO · otomatik ileri izin','K0 yoksa LS2 üzerinden otomatik ileri START yolu kapalıdır.'));
let seq=0;const W=(a,ap,b,bp,why)=>({id:'sc271-stop-rearm-'+(++seq),from:{c:a,p:ap},to:{c:b,p:bp},
 color:'#e53935',role:'L1',size:'1.5',points:[],tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
p.wires.push(
 W('stop','22','armFromF','13','STOP sonrası K1 yardımcı NO, K0 iznini başlatır.'),
 W('armFromF','14','armCoil','A1','K1 çekince K0 çevrim izni enerjilenir.'),
 W('stop','22','armFromR','13','STOP sonrası K2 yardımcı NO, K0 iznini başlatır.'),
 W('armFromR','14','armCoil','A1','K2 çekince K0 çevrim izni enerjilenir.'),
 W('stop','22','armSeal','13','K0 izin mühürlemesi STOP sonrasından beslenir.'),
 W('armSeal','14','armCoil','A1','K0 NO ile çevrim izni tutulur.'),
 W('armCoil','A2','g1','N','K0 çevrim izni bobini nötr dönüşüdür.'),
 W('lockF','22','autoGateR','13','Otomatik geri komutu yalnız K0 izniyle geçer.'),
 W('autoGateR','14','autoR','21','K0 izinli geri otomatik yol KR1 NC kontağına gelir.'),
 W('lockR','22','autoGateF','13','Otomatik ileri komutu yalnız K0 izniyle geçer.'),
 W('autoGateF','14','autoF','21','K0 izinli ileri otomatik yol KR2 NC kontağına gelir.'));
if(p.components.length!==27||p.wires.length!==47||
 new Set(p.wires.map(w=>w.id)).size!==47)throw Error('SC271 rearm protection invalid graph');
p.projectId='tutorial-session-source-'+l.id;
p.name='Öğretici · '+l.title;
p.tutorialLesson={id:l.id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
l.project=p;l.kind='wiring';l.workspaceMode=p.workspaceMode;
l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
 hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref,
 why:c.tutorialPurpose||'Sanal motor çevrimindeki terminal görevini izle.'}));
l.summary='Sanal araç sınır anahtarında yön değiştirir. S0 STOP çevrim iznini de siler; STOP bırakılınca motor kendiliğinden başlamaz.';
l.explanation='Bir taşıma aracının iki uç arasında gidip geldiğini düşün. S1 ile ileri, S2 ile geri komut verebilirsin. Sınır anahtarına gelince KR1/KR2 algı kontakları karşı yönü başlatabilir. K0 izin rölesi çevrimi hatırlar. STOP’a basınca hem motor hem K0 düşer; butonu bıraksan da yeni START olmadan araç hareket etmez. Bu yalnız sanal elektriksel kumanda modelidir; aracın fiziksel hareketi, mekanik frenlemesi ve gerçek emniyet devresi modellenmez.';
l.beginnerSteps=[
 'S1 START ile ileri çalıştır; K1 ve K0 izin rölesinin çektiğini izle.',
 'LS1 sınır anahtarını sanal olarak etkinleştir: K1 bırakır, K2 ile geri yön komutu oluşur.',
 'S0 STOP’a bas: hem motor hem K0 çevrim izni sıfırlanır.',
 'STOP’u bırak; LS1 etkin kalsa bile motorun yeniden çalışmaması gerekir.',
 'LS1’i bırakıp yeniden START ver; izin ancak yeni kullanıcı komutuyla kurulur.'
];
l.pedagogyReview={...l.pedagogyReview,componentIds:p.components.map(c=>c.typeId),
 nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false};
l.learningSupport={...l.learningSupport,sc271StopRearm:'k0-armed-auto-return-v1',
 nativeAcceptanceRequired:true,mechanicalTravelAcceptance:false};
l.sc271StopRearm='k0-armed-auto-return-v1';L._sc271StopRearmGuard=true;
})(typeof window==='undefined'?globalThis:window);
