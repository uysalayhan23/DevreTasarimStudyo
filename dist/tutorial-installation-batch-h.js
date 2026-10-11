/* MQ-07 / installation batch H: lesson-only augmentation, canonical circuit graph untouched. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._installationBatchH)return;
const topics={
 commutator:{
  label:'Komütatör ile iki bağımsız lamba',
  aim:'Bir mekanizma içindeki iki ayrı kontağın iki farklı lambayı bağımsız kontrol ettiğini gör.',
  task:'Sanal devrede birinci ve ikinci kontağı sırayla değiştir. Yalnız ilgili lambanın durumunu izle; iki yükün dönüşleri ayrı kablolarla N ucuna ulaşır.',
  question:'Komütatörün iki çıkışı neyi sağlar?',
  answers:['İki lambayı bağımsız kumanda etmeyi','İki kaynağı kısa devre etmeyi','Nötrü faza çevirmeyi'],
  points:['S1/1 ve S1/3 iki giriş koludur.','S1/2 yalnız H1 yönündeki anahtarlanan yolu taşır.','S1/4 yalnız H2 yönündeki anahtarlanan yolu taşır.']
 },
 'two-way':{
  label:'İki noktadan vaviyen aydınlatma',
  aim:'İki vaviyendeki ortak uçlarla iki gezgin hattın lambanın durumunu nasıl değiştirdiğini anla.',
  task:'Sanal iki vaviyeni sırayla değiştir. S1/11 girişini, iki gezgin 12/14 hattını ve son ortak uçtan lambaya giden yolu takip et.',
  question:'Vaviyenlerin arasındaki iki hat ne olarak adlandırılır?',
  answers:['Gezgin hatlar','İki ayrı nötr','Koruma topraklaması'],
  points:['İlk vaviyen ortak ucu faz girişidir.','12 ve 14 iki gezgin yoldur.','Son vaviyenin 11 ortak ucu lambaya gider.']
 },
 intermediate:{
  label:'Üç noktadan ara vaviyen aydınlatma',
  aim:'Ortadaki ara vaviyenin gezgin çiftini düz ya da çapraz geçirerek yolu değiştirdiğini keşfet.',
  task:'Sanal ilk ve son vaviyeni sabit bırak; ortadaki anahtarı değiştirerek lambayı gözle. Sonra uç vaviyenlerden birini değiştirip yeniden dene.',
  question:'Ara vaviyen konumu değişince hangi bağlantı değişir?',
  answers:['Gezgin çiftinin düz/çapraz sürekliliği','Nötr geriliminin frekansı','Lambanın anma gücü'],
  points:['S1/12 ve S1/14 ara anahtara girer.','Ara anahtarın 2 ve 4 çıkışları son vaviyene gider.','Nötr hattı anahtarlardan geçmeden lambaya döner.']
 },
 bells:{
  label:'Paralel butonlarla çağırma zili',
  aim:'Herhangi bir normalde açık butonun ortak elektronik zili çalıştıran sanal yolu kapatmasını açıkla.',
  task:'Sanal çağrı butonlarından birine basıp bırak. Ardından diğer butonları tek tek dene; butonların neden birbirinden bağımsız olduğunu gözlemle.',
  question:'Paralel bağlanan zil butonlarından biri basılınca ne olur?',
  answers:['Zil için bir besleme yolu kapanır','Tüm butonlar seri hale gelir','Nötr hattı kaybolur'],
  points:['Butonun 13 ucu ortak besleme tarafıdır.','14 uçları zilin aynı girişine ulaşır.','Zilin dönüş ucu N hattına gider.']
 }
};
function endpoint(w){return JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p]);}
for(const [topicId,cfg] of Object.entries(topics)){
 for(let variant=1;variant<=4;variant++){
  const id=topicId+'-'+variant,l=L.byId[id];
  if(!l||l.topicId!==topicId||!Array.isArray(l.project?.components)||!Array.isArray(l.project?.wires)||!l.project.wires.length)throw Error('Missing canonical installation circuit '+id);
  const p=l.project,ids=new Set(p.components.map(c=>c.id)),wires=new Set(p.wires.map(endpoint));
  if(!Array.isArray(l.steps)||l.steps.length!==p.wires.length)throw Error('Wiring steps mismatch '+id);
  for(const w of p.wires)if(!ids.has(w.from?.c)||!ids.has(w.to?.c))throw Error('Broken component reference '+id);
  for(const step of l.steps)if(!wires.has(endpoint(step)))throw Error('Noncanonical guided step '+id);
  const count=topicId==='commutator'?6:topicId==='two-way'?5:topicId==='intermediate'?7:null;
  if(count!==null&&p.wires.length!==count)throw Error('Unexpected topology '+id);
  const suffix=variant===1?'önce temel durumu gözle':variant===2?'ikinci malzeme varyantını karşılaştır':variant===3?'iki farklı anahtar konumunu karşılaştır':'bağlantıyı yeniden kurarak sonucu açıkla';
  // B4 is a fourth, distinct call input. Its catalog name says "light",
  // but this canonical two-pin device models only its NO 13/14 contact.
  const fourthBell=topicId==='bells'&&variant===4;
  if(fourthBell&&(!p.components.some(c=>c.id==='bl'&&c.typeId==='bell-light-push')||
      p.wires.filter(w=>w.from?.c==='bl'||w.to?.c==='bl').length!==2))
    throw Error('Four-button bell canonical contact graph mismatch '+id);
  const goal=fourthBell
    ?'B1, B2, B3 ve B4 olmak üzere dört bağımsız sanal çağrı butonunun aynı zili çalıştırdığını ayırt et. B4 yalnız 13/14 NO anahtar kontağıyla modellenir; bağımsız ışık devresi modellenmemiştir.'
    :cfg.aim;
  const task=fourthBell
    ?'Sanal B1, B2, B3 ve B4 butonlarını sırayla basıp bırak; zili her butonun ayrı bir yoldan etkinleştirdiğini gözlemle. B4 cihazının katalog adında ışık geçse de bu projede yalnız 13/14 anahtar kontağı vardır; butonun kendi aydınlatması simüle edilmez.'
    :cfg.task+' Bu uygulamada '+suffix+'.';
  const question=fourthBell?'Bu sanal devrede B4 için gerçekte modellenen işlev hangisidir?':cfg.question;
  const answers=fourthBell?['13/14 NO butonla çağrı yolunu kapatmak','Bağımsız bir buton ışığını yakmak','Nötr hattını faza dönüştürmek']:cfg.answers;
  const points=fourthBell?['B1, B2 ve B3 normal çağrı butonlarıdır.','B4 de 13/14 anahtar kontağıyla dördüncü paralel çağrı noktasıdır.','B4 için ışık besleme uçları veya aydınlatma davranışı bu modelde yoktur.']:cfg.points;
  l.designStandard='rich-reference-v1';
  l.learningGoal=goal;l.summary=goal;
  l.explanation=task+' Yalnız sanal eğitim devresi kullanılır; gerçek enerjili tesisatta uygulama yapılmaz.';
  l.measurementUpgrade={heading:cfg.label+' · '+variant+'. uygulama',goal,task,question,options:[...answers],simulationOnly:true,canonicalCircuitPreserved:true,observationPoints:[...points],illuminatedButtonModelled:false};
  l.beginnerSteps=['Devrenin kaynağını, yüklerini ve anahtar uçlarını tanı.','Kanonik terminal bağlantılarını sahnede takip et.',task,'Devreyi yeniden kur özelliğiyle var olan bağlantıları yeniden oluştur.','Beklenen sonucu sanal simülasyonda gözlemle ve konu kontrolünü cevapla.'];
  l.quiz={question,options:[...answers],answer:0,why:goal};
  l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-installation-batch-h',reviewed:true,codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true,simulationOnly:true};
 }
}
L._installationBatchH=true;
})(typeof window==='undefined'?globalThis:window);
