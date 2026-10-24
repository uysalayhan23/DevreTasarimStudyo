/* Scoped ideal 2-threshold Schmitt teaching for pre-wired electronic basics 046.
 * Existing source topology unchanged; no LM358 physical or Windows acceptance. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._schmittIdealHysteresisBatchAJ)return;
const existing=L.byId['electronic-component-basics-outline-046'];
if(existing?.project?.components?.find(c=>c.id==='u1')?.typeId==='lm358p-dip8'){
 const p=existing.project;
 const terminalLinks=[['g1','P','u1','8'],['g1','M','u1','4'],['v1','1','u1','1'],
  ['ref1','2','u1','2'],['r1','2','u1','3'],['u1','1','r2','1'],['r2','2','u1','3']];
 const has=(a,pa,b,pb)=>p.wires.some(w=>
  (w.from.c===a&&w.from.p===pa&&w.to.c===b&&w.to.p===pb)||
  (w.to.c===a&&w.to.p===pa&&w.from.c===b&&w.from.p===pb));
 if(existing.kind!=='wiring'||p.components.length!==8||p.wires.length!==14||
 existing.steps?.length!==14||!terminalLinks.every(e=>has(...e))||
 existing.pedagogyReview?.noSubstitute!==true||
 existing.pedagogyReview?.nativeDynamicAcceptance!==false)
  throw Error('Unknown LM358 DIP8 Schmitt topology');
 L._schmittIdealHysteresisBatchAJ=true;
 L._schmittDIP8PhysicalPreserved=true;
 return;
}
const id='electronic-component-basics-outline-046',l=L.byId[id],p=l?.project,
  types=[['g1','supply-dc-plus'],['u1','lm358p-opamp-a'],
    ['in','potentiometer'],['r1','resistor'],['r2','resistor'],
    ['v1','meter-voltmeter'],['ref1','resistor'],['ref2','resistor']],
  wires=['g1.P>u1.V+','g1.M>u1.V-','v1.1>u1.OUT','v1.2>g1.M',
    'in.1>g1.P','in.3>g1.M','g1.P>ref1.1','ref1.2>ref2.1',
    'ref2.2>g1.M','ref1.2>u1.IN-','in.2>r1.1',
    'r1.2>u1.IN+','u1.OUT>r2.1','r2.2>u1.IN+'],
  norm=(x,y)=>[x,y].sort().join('~'),
  expected=wires.map(w=>norm(...w.split('>'))).sort(),
  actual=p?.wires?.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort();
if(!l||l.topicId!=='electronic-component-basics'||l.kind!=='wiring'||
   p.components?.length!==8||p.wires?.length!==14||l.steps?.length!==14||
   l.pedagogyReview?.titleTopologyStatus!=='SOURCE_WIRED_OPAMP_SCHMITT_THRESHOLDS_PENDING'||
   !['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance',
     'independentPedagogicalAcceptance'].every(k=>l.pedagogyReview[k]===false)||
   types.some(([name,type])=>p.components.find(c=>c.id===name)?.typeId!==type)||
   expected.some((w,i)=>w!==actual[i]))
  throw Error('Protected Schmitt source changed '+id);
const previous=JSON.stringify([p,l.steps,l.materials,l.kind,l.title]);
l.quiz={
 question:'Schmitt tetikleyicide aynı giriş seviyesinde, girişin önceki yönüne göre çıkış neden değişebilir?',
 options:['R2 pozitif geri beslemesi farklı açılma ve kapanma eşikleri oluşturur.',
  'U1 in iki girişi birbirinden tamamen bağımsız besleme kaynaklarıdır.',
  'R2 kaldırıldığında histerezis artar.'],
 answer:0,
 why:'R1=10 kΩ giriş ve R2=47 kΩ pozitif geri besleme, 12 V sanal referansa göre iki ayrı eşik oluşturur. Native sanal modelde yükselen giriş yaklaşık 14,55 V, düşen giriş yaklaşık 9,87 V eşiğini kullanır; bu değerler fiziksel LM358 üretici ölçümü değildir.'
};
l.summary='Gerçek LM358P A kanalı ve 14 katalog terminal kablosuyla sanal Schmitt karşılaştırıcısı. Native ideal model iki ayrı eşik ve önceki durumu saklayan histerezis gösterir.';
l.explanation='Bir anahtarın çok küçük giriş dalgalanmalarıyla sürekli açılıp kapanmasını istemezsin. '+
 'Bu yüzden R1 üzerinden gelen ayarlı giriş, R2 üzerinden çıkıştan aldığı pozitif geri beslemeyle birlikte karşılaştırılır. '+
 'R3/R4 orta noktasında yaklaşık 12 V referans vardır. '+
 'Sanal modelin varsaydığı 0,02 V düşük ve 22 V yüksek çıkış sınırlarında R1=10 kΩ, R2=47 kΩ ile iki ideal eşik yaklaşık 14,55 V ve 9,87 V olur. '+
 'Girişi önce artır, sonra azalt: bu iki eşik arasında devre son durumunu korur. '+
 'Bu sonuç gerçek native kaynak bağlantılarına bağlı eğitsel durumlu modeldir; fiziksel LM358 doyum gerilimleri, gecikme, üretici toleransları, gürültü davranışı, Windows görüntüsü veya bağımsız cihaz kabulü değildir.';
l.learningGoal='Katalog LM358P besleme, IN+/IN− ve OUT terminalleriyle iki farklı eşik oluşturan R1/R2 pozitif geri beslemesini anlamak.';
l.beginnerSteps=[
 'U1/V+ ve U1/V− sanal beslemesini, R3/R4 orta referansını ve RV1 sürgüsünü bul.',
 'RV1/2 → R1 → U1/IN+ yolunu ve U1/OUT → R2 → U1/IN+ pozitif geri beslemesini izle.',
 'RV1 ayarını önce yüksek yüzde değerinden düşük yüzdeye indirirken sanal çıkış geçişini izle.',
 'Ardından yüzdeyi yeniden artır: geçişin aynı yerde olmadığını fark et.',
 'Native ideal histerezis değerlerini gerçek LM358P donanım eşikleri ya da fiziksel güvenlik kabulü sayma.'
];
l.pedagogyReview={...l.pedagogyReview,
 sourceCircuitPreserved:true,schmittIdealNativeTargetedPass:true,
 schmittIdealModel:'native-wired-ideal-LM358-Schmitt-hysteresis',
 schmittPhysicalThresholdAcceptance:false,nativeDynamicAcceptance:false,
 physicalAcceptance:false,windowsVisualAcceptance:false,
 independentPedagogicalAcceptance:false};
if(previous!==JSON.stringify([p,l.steps,l.materials,l.kind,l.title]))
 throw Error('Schmitt physical graph or locked materials changed');
L._schmittIdealHysteresisBatchAJ=true;
})(typeof window==='undefined'?globalThis:window);