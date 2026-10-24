/* SC307 only: a real KM auxiliary NO contact gates K1 forward coil.
   Prevents motor starting before START and restarting when STOP is released.
   This remains an educational virtual timing model, not electrical safety certification. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sc307MasterGuard)return;
const l=L.byId['motor-sequence-src-07'];
if(!l||l.kind!=='wiring'||l.pedagogyReview?.titleTopologyIssue!=='TIMED_FORWARD_REVERSE_NATIVE_PENDING'||
 l.project.components.length!==18||l.project.wires.length!==33||
 !l.project.components.some(c=>c.id==='master'&&c.ref==='KM')||
 !l.project.components.some(c=>c.id==='enable'&&c.ref==='KM')||
 l.project.components.some(c=>c.id==='armedForward'))
 throw Error('SC307 protected timed motor source changed; no blind replacement');
const clone=x=>JSON.parse(JSON.stringify(x)),p=clone(l.project);
const old=p.wires.findIndex(w=>w.from?.c==='lockR'&&w.from?.p==='22'&&
 w.to?.c==='ktFStop'&&w.to?.p==='21');
if(old<0)throw Error('SC307 original ungated forward coil connection missing');
p.wires.splice(old,1);
const part={id:'armedForward',typeId:'contact-no',x:980,y:825,rotation:0,ref:'KM',
 label:'KM · ileri hareket izni',state:false,address:'',note:'',
 tutorialPurpose:'START sonrası KM ana rölesi çekince K1 ileri bobinine izin veren NO kontak; STOP bırakılınca açık kalır.'};
p.components.push(part);
const W=(id,a,ap,b,bp,why)=>({id,from:{c:a,p:ap},to:{c:b,p:bp},
 color:'#e53935',role:'L1',size:'1.5',points:[],
 tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
p.wires.push(
 W('sc307-km-guard-1','lockR','22','armedForward','13',
  'Geri yönden kilit açıldığında bile KM çalışma izni yoksa ileri bobin enerjilenemez.'),
 W('sc307-km-guard-2','armedForward','14','ktFStop','21',
  'KM izni ve KT1 gecikmeli NC birlikte K1 ileri kontaktörünü besler.'));
if(p.components.length!==19||p.wires.length!==34||
 new Set(p.wires.map(w=>w.id)).size!==34)
 throw Error('SC307 master forward guard source invalid');
p.projectId='tutorial-session-source-'+l.id;p.name='Öğretici · '+l.title;
p.tutorialLesson={id:l.id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
l.project=p;l.kind='wiring';l.workspaceMode=p.workspaceMode;
l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
 hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,
 label:c.label||c.ref,why:c.tutorialPurpose||'Kumanda veya motor güç devresindeki görevini incele.'}));
l.summary='KM START ile izin verir: K1 ileri, 3 saniye sonra 1 saniyelik boş geçiş ve K2 geri. STOP sonrası otomatik başlama yok.';
l.explanation='Bir aracın önce ileri, sonra geri hareket ettiğini düşün. START düğmesi KM ana çalışma rölesini açar; KM izin vermeden ileri K1 kontaktörü çalışmaz. İlk üç saniye ileri çalışır. KT1 süresi dolunca K1 bırakır; KT2 bir saniyelik boş geçişten sonra geri K2 kontaktörünü çalıştırır. STOP hem KM iznini hem zaman rölelerini bırakır. STOP’u yeniden bıraktığında araç kendiliğinden harekete geçmez. Bu sanal elektriksel kontrol örneğidir; gerçek motorun mekanik duruş süresi veya fiziksel güvenlik uygunluğu kanıtı değildir.';
l.beginnerSteps=[
 'Başlangıçta START’a dokunma: KM izni olmadığı için K1, K2 ve motor durmalıdır.',
 'START’a bas: KM ve K1 birlikte çekerek motoru ileri yönde başlatır.',
 'START’ı bırak: KM mühürlenir; üç saniye boyunca ileri çalışma sürer.',
 'Üç saniye dolunca KT1 ileri bobini bırakır. KT2 bir saniyelik boş geçiş sayar; iki kontaktör aynı anda çalışmaz.',
 'KT2 süresi sonunda K2 geri komutunu verir. STOP’a basıp bırakınca yeni START olmadan motor yeniden çalışmaz.'
];
l.pedagogyReview={...l.pedagogyReview,componentIds:p.components.map(c=>c.typeId),
 nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false};
l.learningSupport={...l.learningSupport,sc307MasterGuard:'km-no-forward-permission-v1',
 nativeAcceptanceRequired:true,mechanicalTravelAcceptance:false};
l.sc307MasterGuard='km-no-forward-permission-v1';L._sc307MasterGuard=true;
})(typeof window==='undefined'?globalThis:window);
