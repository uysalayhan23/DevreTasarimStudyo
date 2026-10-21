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
const twoWayVariants=[
  {
    "goal": "Bir tavan lambasının iki ayrı noktadaki S1 ve S2 vaviyenleriyle kontrol edilebildiğini gözlemle.",
    "task": "Sanal S1'i değiştirdiğinde H lambasının nasıl tepki verdiğini izle. Sonra S1'i sabit bırakıp S2'yi değiştir. İki anahtarın ortak uçları arasındaki 12 ve 14 gezgin yollarını takip et.",
    "question": "Bu devrede S2'nin 11 ortak ucundan çıkan kablo nereye gider?",
    "options": [
      "H/X1 lamba girişine",
      "Doğrudan G1/N'ye",
      "S1/11'e"
    ],
    "points": [
      "G1/L, S1/11 ortak ucuna gelir.",
      "S1/12→S2/12 ve S1/14→S2/14 gezgin hatlarıdır.",
      "S2/11, H/X1'i besler; H/X2, G1/N'ye döner."
    ],
    "steps": [
      "G1, S1, S2 ve H tavan lambasını tanı.",
      "Önce S1'in sonra S2'nin konumunu sanal olarak değiştir.",
      "12 ve 14 gezgin hatlarının iki anahtar arasındaki görevini açıkla.",
      "Beş bağlantıyı terminal uçlarından yeniden kur.",
      "İki farklı noktadan kumanda sonucunu gözlemle."
    ]
  },
  {
    "goal": "E27 duy kullanılan aydınlatmada da iki vaviyenin aynı gezgin hat mantığıyla çalıştığını anla.",
    "task": "H yükünün bu derste E27 duy olduğunu fark et. Sanal S1 ve S2'yi sırayla değiştir; 12 ve 14 arasındaki iki gezgin hattın malzeme türü değişse de aynı bağlantıyı kurduğunu gör.",
    "question": "E27 duy seçildiğinde iki vaviyen arasındaki hangi hatlar korunur?",
    "options": [
      "12–12 ve 14–14 gezgin hatları",
      "Her iki anahtarın N bağlantısı",
      "G1/N ile S1/11 arasındaki hat"
    ],
    "points": [
      "S1/12 ve S2/12, ilk gezgin yoludur.",
      "S1/14 ve S2/14, ikinci gezgin yoludur.",
      "S2/11 E27 duy H/X1'e, H/X2 ise G1/N'ye bağlanır."
    ],
    "steps": [
      "E27 duyun H olarak kullanıldığını belirle.",
      "S1/11'e gelen kaynağı ve iki gezgin yolu göster.",
      "S1 ve S2 konumlarını sırayla değiştir.",
      "Beş bağlantıyı sanal ortamda yeniden kur.",
      "Duy değişse de kumanda mantığının neden aynı kaldığını söyle."
    ]
  },
  {
    "goal": "İki gezgin hattı terminal kimlikleriyle ayırt etmeyi ve lamba durumuyla ilişkilendirmeyi öğren.",
    "task": "Sanal devrede S1/12–S2/12 yolunu birinci, S1/14–S2/14 yolunu ikinci gezgin olarak izle. S1 ve S2'nin konumlarını değiştirirken hangi yolun süreklilik sağladığına dikkat et. Belirli bir kablo rengini elektriksel kimlik sanma.",
    "question": "Bu devrede ilk gezgin hattı hangi uçları birleştirir?",
    "options": [
      "S1/12 ve S2/12",
      "S1/11 ve G1/N",
      "S2/11 ve H/X2"
    ],
    "points": [
      "12 ve 14, gezgin uç kimlikleridir; renkler tek başına terminali belirlemez.",
      "S1/12→S2/12 ve S1/14→S2/14 iki ayrı hat oluşturur.",
      "S2/11 üzerinden H/X1'e ulaşan yol tamamlanınca lamba beslenir."
    ],
    "steps": [
      "S1/11 ve S2/11 ortak uçlarını bul.",
      "12 ve 14 uçlu iki gezgin hattı birbirinden ayır.",
      "İki vaviyeni ayrı ayrı değiştirip sanal sonucu gözlemle.",
      "Devreyi aynı beş bağlantıyla yeniden kur.",
      "Lamba davranışını terminal yoluyla açıkla."
    ]
  },
  {
    "goal": "İki vaviyen ve E27 duyun beş bağlantısını bağımsız olarak yeniden kurup sonucu açıklayabil.",
    "task": "Sanal yeniden kurma adımında G1/L→S1/11, S1/12→S2/12, S1/14→S2/14, S2/11→H/X1 ve H/X2→G1/N yollarını sırasıyla kontrol et. Sonra iki anahtarı da sırayla değiştirerek H duyunu izle.",
    "question": "Besleme bu devrede ilk olarak hangi terminalden vaviyene girer?",
    "options": [
      "S1/11",
      "S1/12",
      "S2/14"
    ],
    "points": [
      "İlk vaviyenin S1/11 ucu G1/L'yi alır.",
      "Gezginler S1/12–S2/12 ve S1/14–S2/14 arasında uzanır.",
      "Son vaviyenin S2/11 ucu E27 duy H/X1'e gider."
    ],
    "steps": [
      "G1, iki vaviyen ve E27 duyun uçlarını tanı.",
      "G1/L→S1/11 bağlantısıyla başla.",
      "12 ve 14 gezginlerini ayrı ayrı tamamla.",
      "S2/11→H/X1 ve H/X2→G1/N dönüşünü kur.",
      "Sanal simülasyonda iki anahtarın da sonucu değiştirebildiğini açıkla."
    ]
  }
];
const intermediateVariants=[
  {
    "goal": "İki uç vaviyenin arasına ara vaviyen eklenince lambanın üç noktadan kumanda edilebildiğini gör.",
    "task": "Sanal S1 ve S2'yi sabit tutup ortadaki Sx ara vaviyenin konumunu değiştir. Ardından uç anahtarlardan birini değiştir. Ortadaki anahtarın iki gezgin hattın geçişini değiştirdiğini gözlemle.",
    "question": "Üç noktadan kumandada ortadaki Sx'in temel görevi nedir?",
    "options": [
      "Gezgin çiftini düz veya çapraz geçirmek",
      "Nötr gerilimini yükseltmek",
      "Lambanın gücünü değiştirmek"
    ],
    "points": [
      "G1/L, ilk vaviyen S1/11'e gelir.",
      "S1/12→Sx/1 ve S1/14→Sx/3 ara vaviyene girer.",
      "Sx/2→S2/12 ve Sx/4→S2/14 üzerinden son vaviyene ulaşır."
    ],
    "steps": [
      "S1, ortadaki Sx ve S2 anahtarlarını ayırt et.",
      "Ortadaki Sx'i sanal olarak değiştirerek lambayı izle.",
      "S1 veya S2'den birini değiştirip sonucu karşılaştır.",
      "Yedi bağlantıyı devre üzerinde takip et.",
      "Üç noktadan kontrolün ara vaviyenle mümkün olduğunu açıkla."
    ]
  },
  {
    "goal": "Ara vaviyenin düz ve çapraz geçişiyle gezginlerin yönünün nasıl değiştiğini anla.",
    "task": "Sanal S1 ve S2'yi aynı konumda tut. Sx ara vaviyenini iki konumu arasında değiştir; bir konumda gezginlerin düz, diğerinde çapraz bağlandığını fark et. Bu devrenin yükü E27 duydur.",
    "question": "Sx konumu değiştiğinde ne değişir?",
    "options": [
      "İki gezgin yolunun düz/çapraz eşleşmesi",
      "G1 kaynağının 230 VAC değeri",
      "E27 duyun terminal kimliği"
    ],
    "points": [
      "S1/12 ve S1/14, Sx/1 ve Sx/3'e girer.",
      "Sx/2 ve Sx/4, S2'nin 12 ve 14 uçlarına gider.",
      "E27 duy H/X2, anahtarlardan bağımsız olarak G1/N'ye döner."
    ],
    "steps": [
      "Sx'in iki girişini ve iki çıkışını bul.",
      "Düz geçiş ile çapraz geçişi sanal konumlarda karşılaştır.",
      "H E27 duyun durumunu gözlemle.",
      "Gezgin hatları değiştirmeden yedi bağlantıyı yeniden kur.",
      "Ara anahtarın neden üçüncü kontrol noktası olduğunu anlat."
    ]
  },
  {
    "goal": "S1, Sx ve S2 arasındaki dört gezgin terminal bağlantısını doğru eşleştir.",
    "task": "Sanal bağlantıları takip ederken S1/12'yi Sx/1'e, S1/14'ü Sx/3'e eşleştir. Sx/2'nin S2/12'ye, Sx/4'ün S2/14'e ulaştığını doğrula. Sonra üç anahtarı sırayla değiştirerek H lambasını izle.",
    "question": "Sx/4 terminalinden çıkan gezgin hattı hangi uca bağlanır?",
    "options": [
      "S2/14'e",
      "S2/11'e",
      "G1/N'ye"
    ],
    "points": [
      "S1/12→Sx/1 ilk giriş gezginidir.",
      "S1/14→Sx/3 ikinci giriş gezginidir.",
      "Sx/2→S2/12 ve Sx/4→S2/14 iki çıkış gezginidir."
    ],
    "steps": [
      "S1/11 ile G1/L kaynağını ayırt et.",
      "S1'den Sx'e giden iki gezgini bul.",
      "Sx'ten S2'ye giden iki gezgini bul.",
      "Bağlantıları gerçek dersin yedi kablosuyla yeniden kur.",
      "Sanal sonuçla doğru terminal eşleşmesini karşılaştır."
    ]
  },
  {
    "goal": "Üç anahtarlı aydınlatma yolunu yedi bağlantıyla yeniden kurup hangi anahtarın neyi değiştirdiğini açıklayabil.",
    "task": "Sanal devrede G1/L→S1/11 ile başla; iki gezgini Sx'in giriş ve çıkışlarından S2'ye taşı. Sonra S2/11→H/X1 ve H/X2→G1/N bağlantılarını tamamla. Üç anahtarı sırayla değiştirerek E27 duyun durumunu gözlemle.",
    "question": "Bu üç noktalı devrede H/X2 dönüş ucu nereye bağlanır?",
    "options": [
      "G1/N'ye",
      "Sx/1'e",
      "S1/14'e"
    ],
    "points": [
      "S1/11 besleme girişidir; S2/11 yük tarafındaki ortak uçtur.",
      "Sx/1 ve Sx/3 giriş, Sx/2 ve Sx/4 çıkış gezgin uçlarıdır.",
      "H/X1, S2/11 ile; H/X2, G1/N ile bağlantılıdır."
    ],
    "steps": [
      "İlk vaviyen, ara vaviyen ve son vaviyeni sırala.",
      "G1/L→S1/11 ve dört gezgin bağlantısını yeniden kur.",
      "S2/11→H/X1 ve H/X2→G1/N dönüşünü tamamla.",
      "Üç anahtarın her birini sanal olarak değiştir.",
      "Gözlenen lamba davranışını gezgin sürekliliğiyle açıkla."
    ]
  }
];
const bellVariants=[
  {
    "goal": "Tek bir butonun yalıtılmış sanal 12 VAC kaynakla ortak zili nasıl çalıştırdığını anla.",
    "task": "Sanal B0 butonuna basıp bırak; Z zilinin hangi durumda devreye girdiğini izle. TR1/S1'den butonun 13–14 uçları üzerinden ziline, oradan TR1/S2'ye dönen yolu tanı.",
    "question": "Tek butonlu sanal zil devresinde çağrıyı hangi eleman başlatır?",
    "options": [
      "B0 butonu",
      "İkinci bir buton",
      "G1/N hattı"
    ],
    "points": [
      "TR1/S1, B0/13 ucuna bağlıdır.",
      "B0/14, Z/1 girişine gider.",
      "Z/2 dönüşü TR1/S2 yalıtılmış sanal kaynağına bağlanır."
    ],
    "steps": [
      "TR1 sanal zil kaynağını, B0 butonunu ve Z zilini tanı.",
      "Yalnız B0'ya sanal ortamda basarak devreyi gözlemle.",
      "B0/13–14 arasındaki anahtarlanan yolu izle.",
      "Üç kabloyu var olan uçlarla yeniden kur.",
      "B0 bırakıldığında çağrı yolunun neden açıldığını açıkla."
    ]
  },
  {
    "goal": "İki ayrı çağrı butonunun paralel bağlanarak aynı sanal zili çalıştırabildiğini gör.",
    "task": "Sanal B0 butonuna basıp Z zilini izle; sonra B0'ı bırakıp B1'e bas. İkisinin de aynı Z/1 girişine ayrı birer yoldan ulaştığını karşılaştır.",
    "question": "B0 bırakılmışken B1'e basılırsa ne olur?",
    "options": [
      "B1 de Z zilini çalıştırır",
      "Z yalnız B0 ile çalışır",
      "TR1/S2 bağlantısı kaybolur"
    ],
    "points": [
      "TR1/S1 iki butonun 13 girişine ayrı kablolarla gider.",
      "B0/14 ve B1/14 aynı Z/1 girişinde birleşir.",
      "Z/2, TR1/S2 yalıtılmış sanal dönüş ucudur."
    ],
    "steps": [
      "TR1, B0, B1 ve Z'yi tanı.",
      "B0 ile B1'i sırayla sanal ortamda dene.",
      "Paralel kolların aynı Z/1 girişinde birleştiğini bul.",
      "Beş kabloyu devre üzerinde yeniden kur.",
      "İki farklı çağrı noktasının aynı zili nasıl çalıştırdığını anlat."
    ]
  },
  {
    "goal": "Üç çağrı butonunun ayrı paralel kollarının tek bir zili çalıştırdığını ve ortak dönüşü ayırt et.",
    "task": "Sanal B0, B1 ve B2 butonlarını tek tek basıp bırak. Hangi butona basılırsa basılsın aynı Z zilinin etkinleştiğini; hepsi bırakıldığında çağrı yolunun açık kaldığını gözlemle.",
    "question": "Üç buton da bırakılmışsa Z zilinin durumu ne olur?",
    "options": [
      "Çağrı yolu açık olduğundan zil çalışmaz",
      "Zil sürekli çalışır",
      "Kaynak gerilimi iki katına çıkar"
    ],
    "points": [
      "B0, B1 ve B2'nin 13 uçları TR1/S1'e bağlıdır.",
      "Üç butonun 14 çıkışları Z/1'e ayrı kollardan gelir.",
      "Z/2, TR1/S2 yalıtılmış sanal kaynağına döner."
    ],
    "steps": [
      "Üç çağrı butonunu ve ortak Z zilini tanı.",
      "B0, B1 ve B2'yi sırayla sanal olarak dene.",
      "Üç paralel kolun nerede birleştiğini göster.",
      "Yedi kablonun tamamını mevcut terminallerle yeniden kur.",
      "Hepsi bırakıldığında zilin neden durduğunu açıkla."
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
  const own=topicId==='commutator'?commutatorVariants[variant-1]:topicId==='two-way'?twoWayVariants[variant-1]:topicId==='intermediate'?intermediateVariants[variant-1]:topicId==='bells'&&variant<=3?bellVariants[variant-1]:null;
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
