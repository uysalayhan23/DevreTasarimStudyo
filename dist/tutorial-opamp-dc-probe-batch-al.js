/* SC350-363 real DIP-8 follower B termination + scoped ideal DC follower/comparator.
 * Preserve all previous accepted source graphs, physical and manufacturer pending. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._opampDcProbeBatchAL)return;
const copy=x=>JSON.parse(JSON.stringify(x));
const rows=[["029","VOLTAGE_FOLLOWER_NATIVE_PENDING","follower","Gerilim izleyicide U1 çıkışını U1 IN− girişine geri bağlamamızın amacı nedir?",["Çıkışın giriş gerilimini ideal olarak birim kazançla izlemesi.","U1 beslemesini kesmek.","Çıkışı girişten her durumda 100 kat büyütmek."]],["030","FOLLOWER_PRACTICE_NATIVE_PENDING","follower","Gerilim izleyici temrininde RV1 ayarlanırken V1 neyi izlemelidir?",["LM358P IN+ girişini, ideal sanal çıkış sınırları içinde.","Her koşulda sıfır volt.","Yalnız kaynak akımını."]],["031","COMPARATOR_THRESHOLD_NATIVE_PENDING","comparator","LM358 karşılaştırıcıda RV1 giriş gerilimi 12 V referansı geçtiğinde ne olur?",["Çıkışın sanal düşük/yüksek durumu değişir.","Devre mutlaka histerezis üretir.","U1 eviren girişi beslemeden ayrılır."]],["032","COMPARATOR_PRACTICE_NATIVE_PENDING","comparator","Karşılaştırıcı temrininde çıkış geçişi hangi düğüme göre incelenir?",["U1/2 üzerindeki R3–R4 orta noktasındaki yaklaşık 12 V referansa göre.","Yalnız U1 boşta kalan B kanalına göre.","Multimetrenin kırmızı kablo rengine göre."]]];
const followers=['g1.P>u1.8','g1.M>u1.4','in.1>g1.P',
  'in.3>g1.M','in.2>u1.3','u1.1>u1.2',
  'v1.V>v1-red.PLUG','v1.COM>v1-black.PLUG'];
const comparators=['g1.P>u1.8','g1.M>u1.4','in.1>g1.P',
  'in.3>g1.M','g1.P>ref1.1','ref1.2>ref2.1',
  'ref2.2>g1.M','ref1.2>u1.2','in.2>u1.3',
  'v1.V>v1-red.PLUG','v1.COM>v1-black.PLUG',
  'u1.5>g1.M','u1.7>u1.6'];
const norm=(a,b)=>[a,b].sort().join('~');
for(const [suffix,issue,kind,question,options] of rows){
 const id='opamp-apps-outline-'+suffix,l=L.byId[id],p=l?.project,
  count=kind==='follower'?8:13,
  expect=(kind==='follower'?followers:comparators).map(s=>norm(...s.split('>'))).sort(),
  got=p?.wires?.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort(),
  byName=name=>p?.components?.find(c=>c.id===name),
  parts=kind==='follower'?6:8,
  partTypes=[['g1','arduino-bench-supply'],['u1','lm358p-dip8'],
   ['in','potentiometer'],['v1','unit-ut33d-plus'],
   ...(kind==='comparator'?[['ref1','resistor'],['ref2','resistor']]:[]),
   ['v1-red','test-probe-red'],['v1-black','test-probe-black']];
 if(!l||!p||l.topicId!=='opamp-apps'||l.kind!=='wiring'||
   l.pedagogyReview?.titleTopologyStatus!=='REVIEW'||
   l.pedagogyReview?.titleTopologyIssue!==issue||
   !['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance',
     'independentPedagogicalAcceptance'].every(k=>l.pedagogyReview[k]===false)||
   p.referenceOnly===true||p.components.length!==parts||
   p.wires.length!==count||l.steps?.length!==count||
   partTypes.some(([name,type])=>byName(name)?.typeId!==type)||
   got.length!==expect.length||got.some((e,i)=>e!==expect[i])||
   byName('v1-red')?.probeTarget?.c!=='u1'||
   byName('v1-red')?.probeTarget?.p!=='1'||
   byName('v1-black')?.probeTarget?.c!=='g1'||
   byName('v1-black')?.probeTarget?.p!=='M'||
   Number(byName('in')?.potMax)!==10000||
   byName('v1')?.meterPosition!==4)
   throw Error('Locked LM358 lesson source/probe mismatch '+id);
 const protectedOriginal=JSON.stringify([p.components,l.materials,l.title]);
 if(kind==='follower'){
   if(p.wires.some(w=>['5','6','7'].includes(w.from?.c==='u1'?w.from.p:w.to?.c==='u1'?w.to.p:'')))
      throw Error('Duplicate B channel wire '+id);
   p.wires.push(
    {id:'al-'+suffix+'-b5',from:{c:'u1',p:'5'},to:{c:'g1',p:'M'},
     color:'#111827',role:'0V',size:'1.5',points:[],
     tutorialHint:'U1/5 → G1/M',
     tutorialWhy:'Kullanılmayan gerçek LM358P B kanalının pozitif girişi 0 V referansındadır.'},
    {id:'al-'+suffix+'-b76',from:{c:'u1',p:'7'},to:{c:'u1',p:'6'},
     color:'#43a047',role:'SIGNAL',size:'1.5',points:[],
     tutorialHint:'U1/7 → U1/6',
     tutorialWhy:'Kullanılmayan B kanalı çıkışı eviren girişe geri beslenerek açıkta bırakılmaz.'}
   );
   l.steps=p.wires.map(w=>({from:copy(w.from),to:copy(w.to),
      hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 }
 l.quiz={question,options:[...options],answer:0,why:kind==='follower'
   ?'U1 pin 3, RV1 sürgüsünden gelen gerilimi alır. U1 pin 1 doğrudan pin 2 ye döner; ideal sanal DC tampon giriş seviyesini takip eder. Gerçek LM358 çıkış doyumu ölçülmedi.'
   :'U1 pin 3 RV1 girişini, pin 2 R3/R4 yaklaşık 12 V referansını görür. Çıkış pin 1 açık döngü karşılaştırmasında düşük veya yüksek olur; pozitif geri besleme yok, histerezis deneme.'};
 l.summary=kind==='follower'
   ?'Gerçek LM358P PDIP-8 izleyici A kanalı ve düzgün sonlandırılan boş B kanalıyla sanal ideal DC birim kazanç; gerçek ürün kabulü pending.'
   :'Gerçek LM358P pinli 12 V eşik karşılaştırıcısı; sanal UNI-T DC voltmetreyle düşük/yüksek çıktı taraması, gerçek üretici ve donanım kabulü pending.';
 l.explanation=kind==='follower'
   ?'RV1 ayarını değiştirdiğinde U1/3 giriş gerilimi de değişir. U1/1 çıkışı U1/2 eviren girişine doğrudan geri bağlıdır; sanal ideal tampon bu gerilimi sınırlar içinde takip eder. Kullanılmayan B kanalının pin 5 girişi 0 V a ve 7 çıkışı 6 girişine bağlandı. UNI-T kırmızı prob U1/1 de, siyah prob G1/M de; DCV 200 kademesi seçili. Giriş ile çıkışı karşılaştır; ideal sayısal sonuç LM358P bant genişliği, offseti, tam rail çıkışı, Windows veya fiziksel kabul değildir.'
   :'İlk olarak G1 sanal beslemesinin 24 V, R3/R4 orta noktasının yaklaşık 12 V olduğunu izle. RV1 sürgüsü LM358P U1/3 girişine gider; R3/R4 orta noktası U1/2 girişidir. Giriş referansı geçince U1/1 çıkışı düşükten yükseğe geçer. UNI-T kırmızı prob U1/1, siyah prob 0 V noktasındadır. B kanalı 5 ve 7→6 ile önceden korunmuştur. Bu ders Schmitt değildir: ayrı yükselen/düşen eşik veya fiziksel üretici doğruluğu kanıtlamaz.';
 l.learningGoal=kind==='follower'?'LM358P A kanalı negatif geri beslemeyi ve giriş/çıkış DC takibini gerçek UNI-T prob hedefleriyle ayırmak.':'LM358P pin 3 girişini, pin 2 referansını ve pin 1 çıkışını sanal DCV ölçümüyle kıyaslamak.';
 l.beginnerSteps=kind==='follower'?[
  '24 V sanal kaynağı ve U1/8–U1/4 besleme pinlerini bul.',
  'RV1/2 → U1/3 ve U1/1 → U1/2 kablolarını izle.',
  'Kullanılmayan U1/5 → 0 V ve U1/7 → U1/6 bağlantılarını kontrol et.',
  'UNI-T kırmızı probun U1/1 ve siyah probun 0 V noktasını gösterdiğini incele.',
  'RV1 ayarını değiştir, giriş ve sanal ideal çıkışı karşılaştır; donanım kabulü sayma.'
 ]:[
  'G1 24 V, R3/R4 referans orta noktası ve U1/2 girişini bul.',
  'RV1/2 sürgüsünden U1/3 girişine giden gerçek kabloyu takip et.',
  'UNI-T DCV 200 kademesinde U1/1 çıkışını 0 V a göre ölç.',
  'RV1 yüzde 65, 50 ve 35 konumlarında sanal eşik geçişini incele.',
  'Bu açık döngü karşılaştırıcısına Schmitt histerezisi ya da fiziksel kabul verme.'
 ];
 l.pedagogyReview={...l.pedagogyReview,
    componentIds:p.components.map(c=>c.typeId),
    terminalGrounded:true,sourceGraphUpdated:kind==='follower',
    nativeIdealOpampDcTargetedPass:true,
    nativeIdealOpampDcModel:kind==='follower'?'native-wired-ideal-LM358-DIP8-follower':'native-wired-LM358-DIP8-comparator-DC',
    voltageMeasurement:'UT33D_DC_200_PROB_TARGETS',
    nativeDynamicAcceptance:false,manufacturerLimitsAcceptance:false,
    physicalAcceptance:false,windowsVisualAcceptance:false,
    independentPedagogicalAcceptance:false};
 if(protectedOriginal!==JSON.stringify([p.components,l.materials,l.title])||
    p.wires.length!==(kind==='follower'?10:13)||l.steps.length!==p.wires.length||
    !['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance'].every(k=>l.pedagogyReview[k]===false))
    throw Error('Physical/pedagogical gate changed '+id);
}
L._opampDcProbeBatchAL=true;
})(typeof window==='undefined'?globalThis:window);