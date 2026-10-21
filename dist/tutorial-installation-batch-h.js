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
  task:'Yalnız sanal 12 VAC devrede bir butona basıp bırak. Diğer çağrı noktalarını tek tek dene; hiçbirinde şebeke fazı bulunmadığını ve ortak Z1 zilinin aynı kaldığını izle.',
  question:'Paralel bağlanan zil butonlarından biri basılınca ne olur?',
  answers:['Zil için bir besleme yolu kapanır','Tüm butonlar seri hale gelir','Nötr hattı kaybolur'],
  points:['Butonun 13 ucu yalnız TR1/S1 yalıtılmış 12 VAC tarafındadır.','14 uçları zilin aynı girişine ulaşır.','Zilin dönüş ucu TR1/S2 yalıtılmış sekondere ulaşır; şebeke fazı buton/zile bağlanmaz.']
 }
};
const commutatorVariants=[
  {
    "goal": "Bir komütatörün iki ayrı koluyla H1 ve H2 lambalarını birbirinden bağımsız yönetebildiğini anla.",
    "task": "Sanal S1'in 1–2 kolunu kapatıp yalnız H1'i izle. Sonra 3–4 kolunu değiştirip H2'yi izle. İki lamba aynı kaynağı kullanır ancak anahtarlanan yolları ayrıdır.",
    "question": "S1'in 1–2 kontağı kapalı, 3–4 kontağı açıkken hangi lamba yanar?",
    "options": [
      "Yalnız H1",
      "Yalnız H2",
      "İkisi birden"
    ],
    "points": [
      "G1/L, S1'in 1 ve 3 girişlerini besler.",
      "S1/2 çıkışı H1/X1'e gider; H1/X2, G1/N'ye döner.",
      "S1/4 çıkışı H2/X1'e gider; H2/X2, G1/N'ye döner."
    ],
    "steps": [
      "G1 kaynağını, S1 komütatörünü ve iki ayrı lambayı tanı.",
      "S1'in 1–2 kolunu değiştirerek H1'i gözlemle.",
      "S1'in 3–4 kolunu değiştirerek H2'nin bağımsız olduğunu gör.",
      "Devreyi yeniden kurarken her lambanın kendi anahtarlı yolunu izle.",
      "Sanal sonucu gözlemleyip soruyu yanıtla."
    ]
  },
  {
    "goal": "H1 LED armatür ve H2 tavan lambası farklı ürünler olsa da aynı komütatörün ayrı kollarıyla kontrol edildiklerini gör.",
    "task": "Sanal devrede S1'in ilk kolunu açıp kapatarak H1 LED armatürü izle. Ardından ikinci kolu kullanıp H2 tavan lambasını dene. Hangi kolun hangi ürünü çalıştırdığını karşılaştır.",
    "question": "Bu devrede H1 LED armatürü hangi komütatör çıkışına bağlıdır?",
    "options": [
      "S1/2",
      "S1/4",
      "G1/N"
    ],
    "points": [
      "H1, LED armatürdür ve S1/2 ile anahtarlanır.",
      "H2, tavan lambasıdır ve S1/4 ile anahtarlanır.",
      "İki yükün X2 dönüş uçları G1/N'ye bağlanır."
    ],
    "steps": [
      "H1'in LED armatür, H2'nin tavan lambası olduğunu ayırt et.",
      "S1/2 yolunu izleyip LED armatürün durumunu gözlemle.",
      "S1/4 yolunu izleyip diğer lambanın durumunu gözlemle.",
      "Devreyi aynı altı bağlantıyla sanal ortamda yeniden kur.",
      "Malzeme farkının anahtarların bağımsızlığını değiştirmediğini açıkla."
    ]
  },
  {
    "goal": "Komütatörün iki kontağını ayrı ayrı değiştirerek iki lambanın dört farklı açık/kapalı durumunu incele.",
    "task": "Sanal S1'in her iki kolu açıkken lambaları gözlemle; sonra yalnız 1–2, yalnız 3–4 ve iki kol birlikte kapalı durumlarını karşılaştır. Tek koldaki değişiklik diğer lambanın anahtarlı yolunu kapatmaz.",
    "question": "S1'in iki kontağı da kapalıysa bu devrede hangi lambalar yanar?",
    "options": [
      "H1 ve H2",
      "Yalnız H1",
      "İkisi de sönük kalır"
    ],
    "points": [
      "1–2 ve 3–4 ayrı kontak çiftleridir.",
      "Birinci çift H1'in, ikinci çift H2'nin besleme yolunu kapatır.",
      "Her yükün X2 ucu ayrı kabloyla ortak N ucuna döner."
    ],
    "steps": [
      "İki anahtarlı yolun H1 ve H2'ye gittiğini göster.",
      "Her iki kol açıkken sanal sonucu gözlemle.",
      "Kolları teker teker kapatıp sonuçları karşılaştır.",
      "İki kolu birlikte kapatıp her iki yükü izle.",
      "Hangi anahtarın hangi lambayı etkilediğini kendi sözlerinle açıkla."
    ]
  },
  {
    "goal": "Komütatördeki 1–2 ve 3–4 terminal çiftlerini doğru lambayla eşleştirerek bağlantı mantığını pekiştir.",
    "task": "Sanal devreyi yeniden kurarken G1/L'den S1/1 ve S1/3'e gelen beslemeyi, S1/2'den H1/X1'e ve S1/4'ten H2/X1'e giden iki ayrı yolu takip et. Her iki lambanın X2 ucunu N dönüşünde doğrula.",
    "question": "Bu devrede S1/4 terminalinden çıkan hat nereye gider?",
    "options": [
      "H2/X1'e",
      "H1/X2'ye",
      "G1/N'ye"
    ],
    "points": [
      "S1/1 ile S1/3, G1/L üzerinden beslenir.",
      "S1/2, LED armatür H1/X1'e gider.",
      "S1/4, tavan lambası H2/X1'e gider; iki X2 ucu N'ye döner."
    ],
    "steps": [
      "G1, S1, H1 LED armatür ve H2 tavan lambasının uçlarını tanı.",
      "G1/L ile S1'in 1 ve 3 girişlerini eşleştir.",
      "S1/2–H1/X1 ve S1/4–H2/X1 yollarını sanal ortamda kur.",
      "H1/X2 ve H2/X2 dönüşlerini G1/N'ye takip et.",
      "Bağlantıdan sonra iki kolun davranışını gözlemle."
    ]
  }
];
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
  const own=topicId==='commutator'?commutatorVariants[variant-1]:null;
  if(fourthBell&&(!p.components.some(c=>c.id==='bl'&&c.typeId==='bell-light-push')||
      p.wires.filter(w=>w.from?.c==='bl'||w.to?.c==='bl').length!==2))
    throw Error('Four-button bell canonical contact graph mismatch '+id);
  const goal=fourthBell
    ?'B1, B2, B3 ve B4 olmak üzere dört bağımsız sanal çağrı butonunun aynı zili çalıştırdığını ayırt et. B4 yalnız 13/14 NO anahtar kontağıyla modellenir; bağımsız ışık devresi modellenmemiştir.'
    :(own?.goal||cfg.aim);
  const task=fourthBell
    ?'Sanal B1, B2, B3 ve B4 butonlarını sırayla basıp bırak; zili her butonun ayrı bir yoldan etkinleştirdiğini gözlemle. B4 cihazının katalog adında ışık geçse de bu projede yalnız 13/14 anahtar kontağı vardır; butonun kendi aydınlatması simüle edilmez.'
    :(own?.task||cfg.task+' Bu uygulamada '+suffix+'.');
  const question=fourthBell?'Bu sanal devrede B4 için gerçekte modellenen işlev hangisidir?':(own?.question||cfg.question);
  const answers=fourthBell?['13/14 NO butonla çağrı yolunu kapatmak','Bağımsız bir buton ışığını yakmak','Nötr hattını faza dönüştürmek']:(own?.options||cfg.answers);
  const points=fourthBell?['B1, B2 ve B3 normal çağrı butonlarıdır.','B4 de 13/14 anahtar kontağıyla dördüncü paralel çağrı noktasıdır.','B4 için ışık besleme uçları veya aydınlatma davranışı bu modelde yoktur.']:(own?.points||cfg.points);
  l.designStandard='rich-reference-v1';
  l.learningGoal=goal;l.summary=goal;
  l.explanation=task+' Yalnız sanal eğitim devresi kullanılır; gerçek enerjili tesisatta uygulama yapılmaz.';
  l.measurementUpgrade={heading:cfg.label+' · '+variant+'. uygulama',goal,task,question,options:[...answers],simulationOnly:true,canonicalCircuitPreserved:true,observationPoints:[...points],illuminatedButtonModelled:false};
  l.beginnerSteps=own?[...own.steps]:['Devrenin kaynağını, yüklerini ve anahtar uçlarını tanı.','Kanonik terminal bağlantılarını sahnede takip et.',task,'Devreyi yeniden kur özelliğiyle var olan bağlantıları yeniden oluştur.','Beklenen sonucu sanal simülasyonda gözlemle ve konu kontrolünü cevapla.'];
  l.quiz={question,options:[...answers],answer:0,why:goal};
  l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-installation-batch-h',reviewed:true,codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,preserveSourceCircuit:true,simulationOnly:true};
 }
}
L._installationBatchH=true;
})(typeof window==='undefined'?globalThis:window);
