/* MQ-07 Batch L: dual DC supply pedagogical overlays, no rewiring of canonical circuits. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._dualDcBatchL)return;
const rows=[
 ['Bağımsız iki DC kaynak','İki ayrı kaynağın pozitif ve dönüş uçlarını birbirine karıştırmadan iki izole yükü gözlemle.','İzole iki devrede dönüş hatları nasıl kalır?',['Her kaynak kendi dönüşüne bağlı','Pozitifler doğrudan birleştirilir','İki kaynak paralel kısa devre edilir']],
 ['Ortak 0 V ile sinyal paylaşımı','Sanal G1 sensörü ve G2 yükünün ortak 0 V referansı sayesinde aynı kontrol sinyalini nasıl paylaşabildiğini kavra.','Ortak referans için hangi terminaller bağlanır?',['G1/M ve G2/M','G1/P ve G2/P','G1/P ve G2/M']],
 ['Kuru kontakla kaynak izolasyonu','G1 kumandasının röleyi çalıştırdığı ve K1 kuru kontağının G2 yükünü ayrı devreden kontrol ettiği yolu izle.','Kuru kontak neden yararlıdır?',['İki beslemeyi galvanik açıdan ayırarak kontrol aktarabilir','İki pozitif kaynağı birleştirir','Her iki kaynağın gerilimini artırır']],
 ['NPN sensör ve ortak sıfır volt','Sanal NPN sensörün G1 kaynağından beslendiğini, G2 yükünü ise ortak 0 V üzerinden kontrol ettiğini açıkla.','NPN çıkışındaki yük hangi kaynaktan beslenir?',['G2 pozitif hattından','Sensör gövdesinden','Koruma toprağından']]
];
for(let n=1;n<=4;n++){
 const l=L.byId['dual-dc-'+n],r=rows[n-1];if(!l||l.topicId!=='dual-dc'||!l.project?.wires||!l.project?.components)throw Error('Missing canonical dual dc '+n);
 const p=l.project,expected=[4,5,6,5][n-1],ids=new Set(p.components.map(c=>c.id));
 if(p.wires.length!==expected||l.steps?.length!==expected)throw Error('Incorrect dual DC graph '+n);
 const wireKeys=new Set(p.wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p])));
 for(const w of p.wires)if(!ids.has(w.from.c)||!ids.has(w.to.c))throw Error('Missing canonical component '+n);
 for(const s of l.steps)if(!wireKeys.has(JSON.stringify([s.from.c,s.from.p,s.to.c,s.to.p])))throw Error('Noncanonical guided terminal '+n);
 if(n===1||n===3){if(p.intentionalElectricalIslands!==2)throw Error('Missing explicit isolation '+n)}
 if(n===2||n===4){if(!p.wires.some(w=>w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='g2'&&w.to.p==='M'))throw Error('Missing common reference '+n)}
 const [heading,goal,question,options]=r,task=goal+' Sanal devreyi yeniden kurarken yalnız işaretli terminalleri kullan. Gerçek elektrik devresinde uygulama yapma.';
 l.designStandard='rich-reference-v1';l.learningGoal=goal;l.summary=goal;l.explanation=task;
 l.measurementUpgrade={heading,goal,task,question,options:[...options],simulationOnly:true,preserveCanonical:true};
 l.beginnerSteps=['Her iki sanal kaynağın P ve M uçlarını ayrı ayrı işaretle.','Sensör, buton, röle veya yükün terminal adlarını tanı.',task,'Kanonik bağlantıları rehberle yeniden kur.','Sanal durumları gözlemle ve soruyu cevapla.'];
 l.quiz={question,options:[...options],answer:0,why:goal};
 l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-dual-dc-batch-l',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true};
}
L._dualDcBatchL=true;
})(typeof window==='undefined'?globalThis:window);
