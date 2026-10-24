/* SC263 timed-stop virtual motor: K0 command seal, KT1 on-delay NC, K1 main motor.
   STOP resets command immediately. Simulation example, never an emergency stop. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._sc263OnDelayMotor)return;
const l=L.byId['motor-direct-power-src-09'],donor=L.byId['motor-direct-power-src-05'];
if(!l||!donor)throw Error('SC263 or DOL reference missing');
if(l.sc263Sc282Story!=='20261024-sc263-sc282-1'||
 l.learningSupport?.topicTopologyMismatchReview!=='ON_DELAY_STOP_USES_STAR_DELTA_SOURCE_PENDING'||
 l.pedagogyReview?.titleTopologyIssue!=='ON_DELAY_MOTOR_CONTROL_NATIVE_PENDING'||
 !['coilStar','coilDelta'].every(id=>l.project.components.some(c=>c.id===id)))
 throw Error('SC263 mismatch/source version changed');
const src=donor.project,clone=v=>JSON.parse(JSON.stringify(v));
const required=[['g1','supply-3p'],['stop','push-nc'],['start','push-no'],['coil','coil-contactor'],['hold','contact-no'],['main','main-contact'],['motor','motor-3p']];
if(src.components.length!==7||src.wires.length!==13||
 !required.every(([id,type])=>src.components.some(c=>c.id===id&&c.typeId===type)))
 throw Error('Protected DOL source changed');
const p=clone(src),get=id=>p.components.find(c=>c.id===id);
p.projectId='tutorial-session-source-'+l.id;p.name='Öğretici · '+l.title;
p.tutorialLesson={id:l.id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
get('coil').ref='K0';get('coil').label='K0 · kumanda rölesi';
get('hold').ref='K0';get('hold').label='K0 · mühürleme NO';
const C=(id,typeId,x,y,ref,label,extra={})=>({id,typeId,x,y,rotation:0,ref,label,state:false,address:'',note:'',...extra});
p.components.push(
 C('kt','coil-delay-on',950,565,'KT1','KT1 · 3 saniyelik düz zaman rölesi',
  {delayValue:3,delayUnit:'s',tutorialPurpose:'K0 isteğiyle sayar, süre sonunda zamanlı NC kontağı açtırır.'}),
 C('runNO','contact-no',960,800,'K0','K0 NO · motor izni'),
 C('timeNC','contact-nc',1130,800,'KT1','KT1 NC · süre sonunda açar'),
 C('coilM','coil-contactor',1390,680,'K1','K1 · motor güç kontaktörü'));
const W=(n,a,ap,b,bp,hint,why,color='#e53935',role='L1')=>({
 id:'sc263-delay-'+n,from:{c:a,p:ap},to:{c:b,p:bp},color,role,
 size:'1.5',points:[],tutorialHint:hint,tutorialWhy:why});
p.wires.push(
 W(1,'coil','A1','kt','A1','K0/A1 → KT1/A1','K0 komutuyla zaman rölesi saymaya başlar.'),
 W(2,'kt','A2','g1','N','KT1/A2 → N','Zaman rölesi dönüş yolu.','#1e88e5','N'),
 W(3,'g1','L1','runNO','13','L1 → K0 NO/13','Motor izni yalnız K0 komutundan geçer.'),
 W(4,'runNO','14','timeNC','21','K0 NO/14 → KT1 NC/21','Komut, normalde kapalı zaman kontağından geçer.'),
 W(5,'timeNC','22','coilM','A1','KT1 NC/22 → K1/A1','Süre dolunca KT1 NC açılır, K1 bobini bırakır.'),
 W(6,'coilM','A2','g1','N','K1/A2 → N','K1 bobin dönüş yolu.','#1e88e5','N'));
if(p.components.length!==11||p.wires.length!==19||new Set(p.wires.map(w=>w.id)).size!==19)
 throw Error('SC263 motor timed-stop graph invalid');
l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,
 why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref,
 why:c.tutorialPurpose||'Sanal motor kumanda örneğindeki görevini incele.'}));
l.summary='S1 ile başlayan sanal motor, KT1 üç saniyeyi sayınca durur. STOP zaman komutunu sıfırlar.';
l.explanation='Bir havalandırma fanının üç saniye çalışmasını düşün. S1 START, K0 kumanda rölesini mühürler. K0 hem KT1 sayımını başlatır hem K1 motor kontaktörüne izin verir. Süre dolunca KT1/21–22 normalde kapalı kontağı açılır ve motor durur. S0 STOP kumandayı hemen keser; yeniden başlamak için önce komut sıfırlanır. Bu gerçek şebeke veya acil durdurma güvenliği değil, yalnız sanal eğitim devresidir.';
l.learningGoal='K0 mühürlemesini, KT1 zamanlı NC kontağını, K1 motor kontaktörünü ve STOP ile sıfırlama davranışını ayırt etmek.';
l.beginnerSteps=[
 'START’a bas: K0 mühürlenir, K1 motoru çalıştırır ve KT1 saymaya başlar.',
 'START’ı bırak: K0 mühürlemesi motoru çalışır tutar.',
 'Üç saniye dolunca KT1/21–22 açılır; K1 bırakır ve motor durur.',
 'STOP’a bas: K0 ve KT1 komutu sıfırlanır; STOP bırakılınca motor yeniden kendiliğinden başlamaz.',
 'Yeniden START ile çalıştır; sanal faz kablosu koparılırsa motorun çalışmadığını gözle.'
];
l.quiz={question:'Üç saniye dolunca sanal motoru hangi eleman durdurur?',
 options:['KT1/21–22 zamanlı NC kontağı','Fazların yer değiştirmesi','K1 ana kontağının kısa devresi'],
 answer:0,why:'KT1/21–22 açılır, K1 bobini bırakır ve motor ana güç kontakları açılır.'};
l.pedagogyReview={...l.pedagogyReview,componentIds:p.components.map(c=>c.typeId),
 titleTopologyStatus:'SCOPED_SOURCE_REPAIRED',titleTopologyIssue:null,
 nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false};
l.learningSupport={...l.learningSupport,
 previousTopologyMismatch:'ON_DELAY_STOP_USES_STAR_DELTA_SOURCE_PENDING',
 topicTopologyMismatchReview:'SCOPED_ON_DELAY_GRAPH_REPAIRED',nonWorkingDiagramWarning:false,
 nativeAcceptanceRequired:true,sc263ScopedMotorStop:'on-delay-3s-k0-kt1-k1-v1'};
l.sc263OnDelayMotor='on-delay-3s-k0-kt1-k1-v1';
L._sc263OnDelayMotor=true;
})(typeof window==='undefined'?globalThis:window);
