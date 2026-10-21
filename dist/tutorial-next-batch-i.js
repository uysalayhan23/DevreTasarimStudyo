/* MQ-07 — Batch I: canonical control and instrument loop lessons. Original graphs are immutable. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._nextBatchI)return;
const specs={
 'control-combinations':[
  ['Kumanda kombinasyonu: mühürleme','Start/Stop yolunun yardımcı NO kontak üzerinden tutma işlevini incele.','Mühürleme hangi elemanla sağlanır?',['Rölenin yardımcı NO kontağı','Stop butonunu iptal ederek','Nötr ile fazı birleştirerek']],
  ['Röle üzerinden sinyal lambası','Bobin devresiyle yardımcı kontaktaki ayrı lamba devresini ayırt et.','Röle yardımcı kontağı neyi kontrol eder?',['Ayrı yük akım yolunu','Kaynak frekansını','Bütün kablo renklerini']],
  ['PNP sensör röle ve lamba','Sanal PNP algılama sinyaliyle röle bobini ve lamba arasındaki nedenselliği izle.','PNP çıkışı algılandığında nereye kumanda eder?',['Röle bobinine','Koruma toprağının kesilmesine','Besleme geriliminin iki katına']],
  ['Kontaktör üzerinden çalışma göstergesi','Start ve Stop komutlarıyla kontaktörün yardımcı NO durumunu yorumla.','Çalışma göstergesi neden yanar?',['Yardımcı NO kontak kapanıp devresini tamamlar','Kontaktörün etiketi değişir','Stop sürekli açık kalır']]
 ],
 'loop-420':[
  ['4–20 mA kapalı döngü','Transmitter, ampermetre ve sanal 24 V kaynağın tek kapalı döngüdeki görevini ayırt et.','Akım ölçeri devreye nasıl dahil ederiz?',['Seri akım yolunda','Rastgele açık uçta','Yalnız lambaya paralel']],
  ['4–20 mA üzerinde 250 Ω yük','Sanal dirençte akımın yük gerilimiyle ilişkisini gözlemle.','250 Ω üzerinde 20 mA için ideal gerilim kaçtır?',['5 V','20 V','0,05 V']],
  ['Loop dönüş yolunu tanı','LOOP+ ve LOOP− uçlarının seri akım çevriminde neden birlikte bulunması gerektiğini açıkla.','Dönüş hattı açılırsa devre için ne söylenebilir?',['Kapalı akım yolu kalmaz','Akım kesin iki katına çıkar','Kaynak başka hatta dönüşür']],
  ['4–20 mA ve 1–5 V ölçek','Sanal 250 Ω alıcı yükünde akım ve gerilim eşleşmesini yorumla.','250 Ω üzerinde 4 mA için ideal gerilim kaçtır?',['1 V','4 V','24 V']]
 ],
 'loop-powered':[
  ['İki telli loop besleme','İki telli transmitterin besleme ve sinyal akımını aynı iki uçtan taşıdığını öğren.','Loop-powered vericide kaç işlevsel loop iletkeni vardır?',['İki','Dört','Sıfır']],
  ['Loop-powered 250 Ω yük','Transmitterin seri döngüsünde 250 Ω yükün nasıl kullanıldığını gözlemle.','Yük neden akım döngüsünde seri olur?',['Aynı akımın akması için','Beslemeyi kısa devre etmek için','Topraklamayı çıkarmak için']],
  ['Loop kaynak ve alıcı yönü','Kaynağın pozitif ucundan başlayıp LOOP+ / LOOP− üzerinden dönüş yolunu takip et.','Transmitterin loop girişine hangi hat gelir?',['Beslemenin pozitif yolu','Koruma iletkeni','Boşta bırakılmış prob']],
  ['Loop gerilim düşümü','250 Ω yükte sanal loop akımıyla yük gerilimini karşılaştır.','20 mA ve 250 Ω için gerilim nedir?',['5 V','1 V','250 V']]
 ],
 'active-passive':[
  ['Pasif verici ve kaynak','Pasif loop elemanı için ayrı 24 V kaynağın rolünü anlat.','Pasif loop için akımı sağlayan nedir?',['Harici döngü beslemesi','Yalnız ölçü aleti ekranı','Koruma topraklaması']],
  ['Pasif döngü ve seri yük','Yük direnci ve ampermetrenin aynı akım yoluna etkisini açıkla.','Aynı seri loop üzerinden hangi nicelik ortak geçer?',['Akım','Her elemanın uç gerilimi','Her elemanın direnci']],
  ['Aktif dönüştürücü çıkışı','Aktif dönüştürücünün kendi beslemesiyle sinyal çıkışını ayır.','Aktif analog çıkışın rolü nedir?',['Döngü akımını sürmek','Zorunlu ikinci aktif kaynağı seri bağlamak','Ampermetreyi atlamak']],
  ['Aktif/pasif ölçüm karşılaştırması','Sanal WAZ5 beslemesini ve OUT+/OUT− alıcı döngüsünü ayrı izle.','Aktif çıkış ile alıcı arasında ne korunur?',['Tamamlanmış seri ölçüm yolu','Kaynakların kısa devresi','Serbest uçtan okuma']]
 ]
};
const copy=o=>JSON.parse(JSON.stringify(o));
for(const [topic,rows] of Object.entries(specs)){
 for(let i=0;i<rows.length;i++){
  const id=topic+'-'+(i+1),l=L.byId[id],r=rows[i];
  if(!l||l.topicId!==topic||!l.project||!l.project.wires?.length||!l.project.components?.length)throw Error('Missing canonical circuit '+id);
  const ids=new Set(l.project.components.map(c=>c.id)),wireKeys=new Set(l.project.wires.map(w=>JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p])));
  if(!Array.isArray(l.steps)||l.steps.length!==l.project.wires.length)throw Error('Original guided step mismatch '+id);
  for(const w of l.project.wires)if(!ids.has(w.from?.c)||!ids.has(w.to?.c))throw Error('Invalid canonical component '+id);
  for(const s of l.steps)if(!wireKeys.has(JSON.stringify([s.from?.c,s.from?.p,s.to?.c,s.to?.p])))throw Error('Invalid canonical guided step '+id);
  const [heading,goal,question,answers]=r;
  const task='Yalnız sanal simülasyonda gerçek kaynak devresini gözlemle: '+goal+' Gerçek terminal etiketlerini izleyerek devreyi yeniden kur; doğrulanmamış ölçüm değerini gerçekleşmiş gibi kabul etme.';
  l.designStandard='rich-reference-v1';l.learningGoal=goal;l.summary=goal;l.explanation=task;
  l.measurementUpgrade={heading,goal,task,question,options:copy(answers),simulationOnly:true,sourceCircuitPreserved:true};
  l.beginnerSteps=['Devredeki gerçek sanal elemanları ve terminalleri tanı.','Kaynak devresindeki mevcut bağlantıları izle.',goal,'Mevcut bağlantıları yeniden kur.', 'Simülasyonda gözlemini yap ve soruyu cevapla.'];
  l.quiz={question,options:copy(answers),answer:0,why:goal};
  l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-next-batch-i',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,sourceCircuitPreserved:true};
 }
}

/* Pedagojik açıklamalar: SC034–041; yalnız gerçek ders içeriği. */
const lessonDetails={
  "control-combinations-1": {
    "goal": "Başlat butonunu bıraktığında K1 rölesinin kendi yardımcı kontağı sayesinde neden çalışmaya devam ettiğini anla.",
    "task": "Sanal devrede önce S1 Başlat'a bas; K1 bobini çalıştığında K1'in 13–14 mühürleme kontağının Start yoluna paralel ikinci yol oluşturduğunu izle. S1'i bırakınca tutma yolunun görevini, S0 Durdur'a basınca bu yolun nasıl kesildiğini karşılaştır.",
    "question": "S1 bırakıldığında K1 bobininin enerjili kalmasını hangi bağlantı sağlar?",
    "options": [
      "Stop çıkışından K1/13–14 üzerinden bobine giden paralel yol",
      "S0 Durdur butonunun sürekli basılı kalması",
      "Bobin dönüşünü kaynağın pozitif ucuna bağlamak"
    ],
    "points": [
      "S0/21–22 normalde kapalı Stop yoludur.",
      "S1/13–14 ile K1/13–14 bobinin A1 ucuna paralel yollar açar.",
      "K1/A2, G1/M dönüş ucuna bağlıdır."
    ],
    "steps": [
      "G1, S0, S1, K1 yardımcı kontağı ve bobini tanı.",
      "Sanal Başlat'a basıp K1'in tutma yolunu izle.",
      "Başlat'ı bırak ve rölenin durumunu gözlemle.",
      "Durdur'a basıp tutmanın neden sona erdiğini anlat.",
      "Altı kabloyu gerçek terminal adımlarıyla yeniden kur."
    ]
  },
  "control-combinations-2": {
    "goal": "Röle bobininin kumanda yolu ile lambanın ayrı yük yolunun nasıl birlikte çalıştığını öğren.",
    "task": "Sanal S1 butonuna basınca K1 bobininin enerjilenmesini ve K1'in 13–14 NO kontağının H1 lambasının ayrı besleme yolunu kapatmasını izle. Buton bırakıldığında lamba yolunu tekrar gözlemle; burada mühürleme kontağı bulunmadığını ayırt et.",
    "question": "H1 lambasının ayrı besleme kolunu hangi röle uçları açıp kapatır?",
    "options": [
      "K1/13–14 yardımcı NO kontağı",
      "K1/A1–A2 bobin uçları doğrudan",
      "G1/M'nin yerine geçen buton"
    ],
    "points": [
      "S1/13–14, K1/A1 bobin girişini kumanda eder.",
      "K1/A2, G1/M'ye döner.",
      "Ayrı lamba kolunda G1/P→K1/13–14→H1/X1→H1/X2→G1/M bulunur."
    ],
    "steps": [
      "S1 butonu ile K1 bobininin yolunu tanı.",
      "Ayrı K1/13–14–H1 lamba yolunu göster.",
      "Sanal S1'e basarken bobin ve lambayı birlikte izle.",
      "S1'i bırakınca NO kontağının durumunu karşılaştır.",
      "Altı bağlantıyı devrenin kendi uçlarıyla yeniden kur."
    ]
  },
  "control-combinations-3": {
    "goal": "PNP endüktif sensörün çıkışının röle bobinine, röle kontağının ise ayrı lambaya kumanda ettiğini anla.",
    "task": "Sanal B1 sensörünün kahverengi BN besleme, mavi BU dönüş ve siyah BK PNP çıkış uçlarını ayırt et. Sanal algılama durumunu değiştirirken BK'den K1/A1'e giden sinyal yolunu, ardından K1/13–14 üzerinden H1 lambasının yük yolunu izle. Desteklenmeyen algılamayı gerçekleşmiş sayma.",
    "question": "PNP sensörün BK ucundan çıkan sanal kumanda hattı nereye gider?",
    "options": [
      "K1/A1 bobin girişine",
      "H1/X2 dönüş ucuna",
      "G1/M'nin yerine"
    ],
    "points": [
      "B1/BN G1/P'ye, B1/BU G1/M'ye bağlıdır.",
      "B1/BK yalnız K1/A1'e kumanda sinyali taşır.",
      "K1'in NO 13–14 kontağı H1 için ayrı G1/P besleme yolu oluşturur."
    ],
    "steps": [
      "B1 sensörünün BN, BU ve BK uçlarını tanı.",
      "Sanal algılama hedefini ve K1 bobin yolunu izle.",
      "K1 NO kontağından H1'e giden ayrı yolu göster.",
      "Simülasyonun desteklediği durumu gözlemle; desteklenmeyeni varsayma.",
      "Yedi gerçek terminal bağlantısını yeniden kur."
    ]
  },
  "control-combinations-4": {
    "goal": "Start/Stop mühürlemeli kontaktörün çalışmasını ve H1 çalışma göstergesinin neden yandığını açıkla.",
    "task": "Sanal S1 Başlat'a basınca K1 kontaktör bobininin, ardından mühürleme kontağının ve ayrı çalışma lambası kontağının durumunu izle. Başlat'ı bıraktığında tutma yolunu; S0 Durdur'a bastığında hem bobinin hem H1 lambasının durumunu karşılaştır.",
    "question": "H1 çalışma göstergesi kontaktör çalışırken hangi yol üzerinden beslenir?",
    "options": [
      "G1/P→K1'in ayrı NO 13–14 kontağı→H1→G1/M",
      "Yalnız Start butonuna paralel olmayan açık uçtan",
      "K1 bobininin A2 terminalinden doğrudan"
    ],
    "points": [
      "S0/21–22 ile S1/13–14, K1 bobininin kumanda yolundadır.",
      "K1 mühürleme kontağı Start'a paralel tutma yoludur.",
      "Diğer K1 NO kontağı, H1 çalışma lambasının ayrı kolundadır."
    ],
    "steps": [
      "S0 ve S1'in kontaktör bobinine uzanan yolunu bul.",
      "K1 mühürleme kontağını ayrı gösterge kontağından ayır.",
      "Sanal Başlat ve Durdur komutlarını sırayla dene.",
      "H1 göstergesinin bobinle aynı durumu izlemesini yorumla.",
      "Dokuz kabloyu değiştirmeden terminal adımlarıyla yeniden kur."
    ]
  },
  "loop-420-1": {
    "goal": "İki telli 4–20 mA vericinin hem besleme hem ölçüm akımını tek kapalı devrede taşıdığını öğren.",
    "task": "Sanal G1 24 V kaynağından B1 vericinin 2 ucuna, B1/1'den P1 ampermetrenin 1 ucuna ve P1/2'den G1/M'ye dönen üç kabloyu takip et. Ampermetrenin neden seri olduğunu açıkla; gerçek ölçüm değeri doğrulanmamışsa sayısal sonuç varsayma.",
    "question": "Bu üç bağlantılı akım döngüsünde P1 ampermetre nereye yerleştirilmiştir?",
    "options": [
      "B1/1 ile G1/M arasındaki seri dönüş yoluna",
      "G1/P ile G1/M arasına doğrudan paralel",
      "B1'in dışındaki açık bir uca"
    ],
    "points": [
      "G1/P, B1'in 2 ucuna gider.",
      "B1/1 çıkışı P1/1 ampermetre girişine gider.",
      "P1/2, G1/M'ye dönerek çevrimi tamamlar."
    ],
    "steps": [
      "G1 24 V kaynak, B1 verici ve P1 ampermetreyi tanı.",
      "Üç bağlantının tek bir kapalı akım yolu olduğunu izle.",
      "P1'in seri ölçüm yerini göster.",
      "Sanal simülasyon sonucunu, varsa doğrulanmış ölçüm olarak değerlendir.",
      "Üç terminal bağlantısını yeniden kur."
    ]
  },
  "loop-420-2": {
    "goal": "4–20 mA döngüsündeki 250 Ω yük üzerinde akıma bağlı gerilim oluştuğunu kavra.",
    "task": "Sanal akım yolunda B1 verici, P1 ampermetre ve R1 250 Ω yükün seri olduğunu izle. İdeal V=I×R ilişkisiyle 4 mA için 1 V, 20 mA için 5 V hesapla; simülatörün bu değerleri gerçekten ürettiğini kanıtsız söyleme.",
    "question": "İdeal 20 mA akım 250 Ω üzerinden geçerse gerilim kaç volt olur?",
    "options": [
      "5 V",
      "1 V",
      "24 V"
    ],
    "points": [
      "G1/P→B1/2 ile döngü başlar.",
      "B1/1→P1/1→P1/2→R1/1 tek seri yoldur.",
      "R1/2, G1/M'ye döner; 250 Ω için ideal 4–20 mA karşılığı 1–5 V'tur."
    ],
    "steps": [
      "B1, P1 ve R1'in ayrı görevlerini tanı.",
      "Dört bağlantılı kapalı çevrimi izle.",
      "4 mA×250 Ω ve 20 mA×250 Ω hesaplarını yap.",
      "Beklenen ideal değeri simülasyondan ayrı tut.",
      "Dört kabloyu değiştirmeden yeniden kur."
    ]
  },
  "loop-420-3": {
    "goal": "Akım döngüsünde kaynaktan vericiye, ölçere ve dönüş ucuna kadar kesintisiz bir yolun neden gerektiğini gör.",
    "task": "Sanal G1/P→B1/2→B1/1→P1/1→P1/2→G1/M yolunu izle. Dönüş kablosu olmazsa ideal kapalı çevrimin tamamlanamayacağını düşün; uygulama desteklemiyorsa kabloyu gerçekten söküp ölçüm sonucu uydurma.",
    "question": "P1/2 ile G1/M arasındaki bağlantının görevi nedir?",
    "options": [
      "Döngünün dönüş yolunu tamamlamak",
      "Vericinin ikinci güç kaynağını oluşturmak",
      "Ölçüm cihazını paralel yüke çevirmek"
    ],
    "points": [
      "B1'in iki ucu seri loop yolundadır.",
      "P1/1 ve P1/2 akımı seri yol üzerinde ölçer.",
      "P1/2→G1/M dönüş kablosu olmadan kapalı akım çevrimi kurulmaz."
    ],
    "steps": [
      "G1/P'den B1/2'ye giden hattı bul.",
      "B1/1'den P1/1'e uzanan akım yolunu izle.",
      "P1/2→G1/M dönüş hattının görevini anlat.",
      "Sanal devrenin desteklenen durumunu gözlemle.",
      "Üç kabloyu orijinal terminal dizilişinde yeniden kur."
    ]
  },
  "loop-420-4": {
    "goal": "4–20 mA döngüsündeki 250 Ω yükün ideal 1–5 V karşılığını yorumla.",
    "task": "Sanal B1 verici, P1 ampermetre ve R1 250 Ω direnç seri bağlıdır. İdeal olarak 4 mA×250 Ω=1 V ve 20 mA×250 Ω=5 V olduğunu karşılaştır; bu değerlerin gerçek native ölçümle doğrulanması ayrı iştir.",
    "question": "250 Ω ideal alıcı yükünde 4 mA akım kaç volta karşılık gelir?",
    "options": [
      "1 V",
      "5 V",
      "24 V"
    ],
    "points": [
      "G1/P→B1/2 verici beslemesidir.",
      "B1/1→P1/1→P1/2→R1/1 ölçüm ve yük yoludur.",
      "R1/2→G1/M dönüşüdür; gerilim ideal olarak akımla orantılıdır."
    ],
    "steps": [
      "G1/B1/P1/R1 elemanlarını bul.",
      "Dört kabloyla kurulan tek seri yolu izle.",
      "4 mA için 1 V, 20 mA için 5 V ilişkisini hesapla.",
      "İdeal hesap ile doğrulanmış simülasyon sonucunu ayır.",
      "Dört bağlantıyı tekrar kurup soruyu yanıtla."
    ]
  }
};
for(const [id,detail] of Object.entries(lessonDetails)){
  const l=L.byId[id];
  if(!l||!l.project||l.steps.length!==l.project.wires.length)throw Error('Missing canonical teaching lesson '+id);
  l.learningGoal=detail.goal;
  l.summary=detail.goal;
  l.explanation=detail.task+' Bu ders yalnız sanal eğitim ortamında uygulanır.';
  l.measurementUpgrade={...l.measurementUpgrade,goal:detail.goal,task:detail.task,question:detail.question,options:copy(detail.options),observationPoints:copy(detail.points)};
  l.beginnerSteps=copy(detail.steps);
  l.quiz={question:detail.question,options:copy(detail.options),answer:0,why:detail.goal};
}
/* SC042–049: distinct loop-powered and active/passive teaching content. */
const laterLessonDetails={
  "loop-powered-1": {
    "goal": "İki telli B1 vericinin aynı seri yol üzerinden hem sanal 24 V besleme aldığını hem 4–20 mA ölçüm akımı oluşturduğunu anla.",
    "task": "G1/P kaynağından B1/2 ucuna, B1/1'den P1 ampermetreye ve oradan G1/M'ye uzanan üç bağlantıyı izle. Besleme ile sinyal için ayrı bir ikinci kablo çifti varmış gibi düşünme.",
    "question": "B1 iki telli vericinin bu dersindeki toplam döngü uçları hangileridir?",
    "options": [
      "B1/1 ve B1/2",
      "B1/7 ve B1/8",
      "B1/A1 ve B1/A2"
    ],
    "points": [
      "G1/P, B1/2 terminaline bağlanır.",
      "B1/1, P1/1 ampermetre girişine gider.",
      "P1/2, G1/M dönüş yolunu kapatır."
    ],
    "steps": [
      "G1, B1 ve P1'i tanı.",
      "B1'in yalnız 1 ve 2 döngü uçlarını bul.",
      "Kaynak, verici ve ölçeri sırasıyla izle.",
      "Sanal gözlemdeki ölçümle ideal 4–20 mA bilgisini ayır.",
      "Üç bağlantıyı olduğu gibi yeniden kur."
    ]
  },
  "loop-powered-2": {
    "goal": "İki telli verici döngüsünde R1 250 Ω alıcı yükünün P1 ile aynı seri akım yolunda olduğunu gör.",
    "task": "B1 vericiden çıkan yolun önce P1 ampermetreye, sonra R1 direncine ve G1/M dönüşüne ulaştığını takip et. R1'in yük görevi ile P1'in ölçüm görevini ayırt et; gerçek çıktı değerini doğrulanmadan varsayma.",
    "question": "Bu devrede P1/2 terminalinden çıkan kablo hangi uca gider?",
    "options": [
      "R1/1",
      "B1/2",
      "G1/P"
    ],
    "points": [
      "G1/P → B1/2, vericinin besleme girişidir.",
      "B1/1 → P1/1 ve P1/2 → R1/1 aynı seri yoldur.",
      "R1/2 → G1/M dönüş bağlantısıdır."
    ],
    "steps": [
      "B1, P1 ve R1'in görevlerini belirle.",
      "P1/2'den R1/1'e giden hattı bul.",
      "R1/2'nin kaynak dönüşünü tamamladığını göster.",
      "İdeal 4 mA × 250 Ω hesabıyla 1 V'u ilişkilendir.",
      "Dört kanonik kabloyu yeniden kur."
    ]
  },
  "loop-powered-3": {
    "goal": "İki telli akım döngüsünde doğru besleme yönünü terminal bağlantılarından okuyabil.",
    "task": "G1/P'den B1/2'ye uzanan besleme hattını, B1/1'den P1/1'e giden ölçüm hattını ve P1/2→G1/M dönüşünü izle. Elektriksel terminal kimliğini, cihaz üzerindeki LOOP+ / LOOP− kavramıyla karıştırmadan gerçek numaralı uçları kullan.",
    "question": "Sanal G1/P pozitif kaynağı bu devrede hangi B1 ucuna bağlanır?",
    "options": [
      "B1/2",
      "P1/2",
      "G1/M"
    ],
    "points": [
      "G1/P, vericinin B1/2 terminaline gider.",
      "B1/1, P1/1'e bağlıdır.",
      "P1/2, G1/M'ye dönerek seri yolu tamamlar."
    ],
    "steps": [
      "G1/P ve G1/M'yi ayırt et.",
      "Pozitif hattan B1/2'ye bağlantıyı takip et.",
      "B1/1–P1/1 ölçüm yolunu izle.",
      "P1/2–G1/M dönüşünü göster.",
      "Üç kabloyu terminallerine göre yeniden kur."
    ]
  },
  "loop-powered-4": {
    "goal": "250 Ω dirençli iki telli verici döngüsünde akım ile ideal yük gerilimi arasındaki ilişkiyi kur.",
    "task": "B1, P1 ve R1'in seri yolunu izle. R1=250 Ω olduğu için ideal 4 mA akımın 1 V, 20 mA akımın 5 V oluşturduğunu hesapla. Simülatörün tam ölçümünü ayrıca doğrulamak gerekir.",
    "question": "20 mA akım R1=250 Ω üzerinden geçerse ideal gerilim kaç olur?",
    "options": [
      "5 V",
      "1 V",
      "20 V"
    ],
    "points": [
      "G1/P → B1/2, B1/1 → P1/1 verici ve ölçü yoludur.",
      "P1/2 → R1/1 ve R1/2 → G1/M yük dönüşüdür.",
      "250 Ω için ideal 4–20 mA aralığı 1–5 V'a karşılık gelir."
    ],
    "steps": [
      "G1, B1, P1 ve R1'i tanı.",
      "Dört seri bağlantıyı takip et.",
      "4 mA için 1 V değerini hesapla.",
      "20 mA için 5 V değerini hesapla.",
      "İdeal sonucu gerçek simülasyon kabulünden ayrı tut."
    ]
  },
  "active-passive-1": {
    "goal": "Harici G1 24 V kaynağıyla beslenen pasif iki telli verici döngüsünü tanı.",
    "task": "Sanal B1 vericiye G1/P hattının nereden ulaştığını ve B1/1 çıkışının P1 ampermetreden G1/M'ye nasıl döndüğünü izle. Pasif döngü elemanının kendi başına ikinci bir bağımsız 24 V kaynağı gibi çalıştığını söyleme.",
    "question": "Bu devrede B1 vericiyi besleyen harici kaynak hangisidir?",
    "options": [
      "G1 24 VDC kaynağı",
      "P1 ampermetre ekranı",
      "İkinci bir seri aktif verici"
    ],
    "points": [
      "G1/P → B1/2 verici besleme koludur.",
      "B1/1 → P1/1 seri ölçüm yoludur.",
      "P1/2 → G1/M harici kaynağın dönüşüdür."
    ],
    "steps": [
      "G1 harici kaynak ve B1 vericiyi ayırt et.",
      "G1/P'den B1/2'ye gelen yolu izle.",
      "P1 ampermetrenin seri konumunu göster.",
      "P1/2–G1/M dönüşünü takip et.",
      "Üç kabloyu değişmeden yeniden kur."
    ]
  },
  "active-passive-2": {
    "goal": "Pasif döngüde P1 ampermetre ile R1 250 Ω alıcı yükün aynı seri akımı taşıdığını anla.",
    "task": "G1/B1/P1/R1 tek seri yolunu göster. P1 ölçer, R1 ise 250 Ω yük görevi görür. Akım ortak olsa da her elemanın üzerindeki gerilimin aynı olmak zorunda olmadığını ayırt et.",
    "question": "Bu seri devrede P1 ve R1 üzerinden geçen ortak büyüklük hangisidir?",
    "options": [
      "Aynı döngü akımı",
      "Her elemanın direnç değeri",
      "Her elemanın uç gerilimi"
    ],
    "points": [
      "B1/1 → P1/1 ile akım ölçme kolu başlar.",
      "P1/2 → R1/1 yük direncine gider.",
      "R1/2 → G1/M seri dönüş yoludur."
    ],
    "steps": [
      "B1 verici, P1 ölçer ve R1 yükü tanı.",
      "P1/2 ile R1/1 arasındaki bağlantıyı takip et.",
      "Seri akımın tüm elemanlardan geçtiğini açıkla.",
      "250 Ω üzerindeki ideal gerilim hesabını yap.",
      "Dört bağlantıyı yeniden kur."
    ]
  },
  "active-passive-3": {
    "goal": "Aktif WAZ5 U1 dönüştürücünün beslemesiyle 4–20 mA çıkış döngüsünü birbirinden ayır.",
    "task": "Sanal G1/P–U1/10 ve U1/11–G1/M hatlarını yalnız cihaz beslemesi olarak izle. Ölçüm için U1/7 çıkışı P1/1'e, P1/2 ise U1/8 dönüşüne bağlıdır. Aynı çıkış döngüsüne ikinci bir aktif akım kaynağı eklenmiş gibi anlatma.",
    "question": "Bu WAZ5 devresinde P1 ampermetre hangi uçların oluşturduğu çıkış döngüsündedir?",
    "options": [
      "U1/7 ve U1/8",
      "U1/10 ve U1/11",
      "G1/P ve G1/M doğrudan"
    ],
    "points": [
      "U1/10 ve U1/11, harici 24 VDC beslemesidir.",
      "U1/7 → P1/1 aktif 4–20 mA çıkış yoludur.",
      "P1/2 → U1/8 çıkış döngüsünün dönüşüdür."
    ],
    "steps": [
      "G1 ile U1/10–11 besleme kablolarını bul.",
      "U1/7 ve U1/8 çıkış uçlarını ayırt et.",
      "P1 ampermetrenin yalnız çıkış döngüsünde yer aldığını göster.",
      "Besleme ve ölçüm yollarını sanal ortamda ayrı izle.",
      "Dört kabloyu terminallere göre yeniden kur."
    ]
  },
  "active-passive-4": {
    "goal": "Aktif dönüştürücü çıkışının pasif alıcıyla tek kapalı ölçüm döngüsü kurması gerektiğini öğren.",
    "task": "G1/P–U1/10 ve U1/11–G1/M, WAZ5 beslemesini oluşturur. U1/7–P1/1 ve P1/2–U1/8 ise ayrı kapalı ölçüm çıkışıdır. İki aktif çıkışı birbiriyle bağlamayı öğretme; sanal örnekte tek aktif verici ve pasif ölçer vardır.",
    "question": "Sanal WAZ5 devresindeki akım çıkışının kapalı dönüş hattı hangisidir?",
    "options": [
      "P1/2 → U1/8",
      "P1/2 → G1/P",
      "U1/10 → P1/1"
    ],
    "points": [
      "U1/10–11, G1 24 VDC besleme çiftidir.",
      "U1/7 ve U1/8 dönüştürücünün ölçüm çıkış çiftidir.",
      "P1/1–P1/2 ampermetre uçları bu çıkışa seri bağlanır."
    ],
    "steps": [
      "G1 ve U1'in besleme terminallerini belirle.",
      "WAZ5 çıkış uçları U1/7–8'i bul.",
      "P1'in giriş ve dönüş yolunu takip et.",
      "İkinci aktif akım kaynağı olmadığını açıkla.",
      "Dört gerçek bağlantıyı aynı şekilde yeniden kur."
    ]
  }
};
for(const [id,detail] of Object.entries(laterLessonDetails)){
  const l=L.byId[id];
  if(!l||!l.project||l.project.wires.length!==l.steps.length)throw Error('Missing physical loop lesson '+id);
  l.learningGoal=detail.goal;l.summary=detail.goal;
  l.explanation=detail.task+' Bu ders yalnız sanal eğitim ortamında uygulanır.';
  l.measurementUpgrade={...l.measurementUpgrade,goal:detail.goal,task:detail.task,question:detail.question,options:copy(detail.options),observationPoints:copy(detail.points)};
  l.beginnerSteps=copy(detail.steps);
  l.quiz={question:detail.question,options:copy(detail.options),answer:0,why:detail.goal};
}
L._nextBatchI=true;
})(typeof window==='undefined'?globalThis:window);
