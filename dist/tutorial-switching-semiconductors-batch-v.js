/* SC135–142: precise learner-facing checks for existing low-voltage virtual circuits. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._switchingSemiconductorsBatchV)return;
const scenarios=[
['12',6,9,'REVIEW_DC_PWM_IGBT_DIMMER_NOT_AC_PHASE',
'Bu dersin sanal ışık kısması neyi değiştiriyor?',
['12 V DC yükün PWM ile açık kaldığı zaman payını','230 V AC faz açısını doğrudan','IGBT yerine röle bobininin direncini'],
'Bu modelde PWM1, IGBT gate sürmesini örnekler. Parlaklık oranı sanaldır; AC faz dimmeri değildir.',
'Bir lambanın ışığını azaltmak istiyorsun. Bu sanal deneyde PWM, lambaya verilen açık-kapalı süre oranını değiştiriyor; gerçek bir AC dimmer kurmuyoruz.',
['Sanal G1, PWM1, Q1 (G/C/E) ve H1 yükünü bul.','Duty %0 ve %100 durumlarını, ardından %50 değerini karşılaştır.','Yalnız uygulamanın gösterdiği normalize parlaklığı yorumla; gerçek ürün performansı sayma.']],
['13',5,6,'VIRTUAL_DC_SCR_GATE_SOURCE_ALIGNED',
'SCR gate butonunu bıraktıktan sonra yük neden çalışmaya devam edebilir?',
['Anot akımı tutma eşiğinin üzerinde kalabildiği için','Gate ve anot her zaman aynı terminal olduğu için','Röle kontağı kendiliğinden kapandığı için'],
'SCR için gate tetiklemesi ile anot–katot üzerinden devam eden ana akım farklı işlevlerdir.',
'Kısa bir tetikleme düşün: S1 bırakıldığında bile sanal H1 ışığının yanmaya devam etmesi mümkün. Çünkü SCR için önemli olan yalnız gate değil, devam eden anot akımıdır.',
['S1 gate butonunu, Q1/G ve Q1/A–K yolunu ayırt et.','Sanal S1 basılı ve serbest hallerinde SCR/lamba durumunu izle.','Gözlemi sanal tutma davranışı olarak yorumla, gerçek üretici eşiği kabul etme.']],
['14',6,7,'DC_SCR_LATCH_ANODE_STOP_RETRIGGER_REQUIRED',
'SCR tetiklendikten sonra sanal SP STOP ne yapar?',
['Yükün anot akım yolunu keserek SCR tutmasını sonlandırır','Yalnız gate butonunun etiketini değiştirir','SCR’yi enerji vermeden yeniden tetikler'],
'SP ana akım yolunu açar; tekrar kapanması tek başına SCR’ye yeni gate tetiklemesi vermez.',
'Bir anlık SG tetiklemesinden sonra H1 yanıyor. SP STOP ile akım yolunu kestiğinde ışık sönüyor; yeniden yanması için yalnız STOP’u bırakmak yetmiyor.',
['SG gate ile SP STOP’un farklı görevlerini ayırt et.','Sanal SG bas/bırak → SP durdur → SP bırak sırasını karşılaştır.','Yeniden iletim için ayrıca gate komutu gerekip gerekmediğini gözlemle.']],
['15',5,7,'REVIEW_ISOLATED_AC_SCR_WAVE',
'Bu sanal AC SCR deneyinde hangi yarım periyot iletim gösterebilir?',
['Tetiklemeden sonraki uygun pozitif yarım periyot','Her zaman negatif yarım periyot','Gate verilmeden her iki yarım periyot'],
'Model tek yönlü SCR ve sıfır geçişini gösterir; sanal AC1 yalnız yalıtılmış 12 V RMS kaynaktır.',
'AC eğrisi yukarı çıkarken SCR uygun tetiklemeden sonra iletebilir. Sıfır geçişini ve negatif yarım periyodu da izle; burada yalnız yalıtılmış yazılım kaynağı var.',
['Sanal AC1, tetikleyici TRG1 ve Q1 SCR uçlarını tanı.','Pozitif/negatif yarım periyot ve sıfır geçişini karşılaştır.','RMS sonucunu yalnız mevcut sanal dalga modeli için kullan.']],
['16',6,7,'REVIEW_LOW_VOLTAGE_DC_TRIAC_HOLDING',
'DC triyak gate butonu bırakıldığında neden iletim sürebilir?',
['Ana akım tutma eşiğinin üzerinde kaldığı ve doğal sıfır geçişi olmadığı için','Triyakın güç uçları röle bobinine dönüştüğü için','DC kaynak her yarım periyotta sıfırdan geçtiği için'],
'Bu 12 V sanal DC örneğinde SG tetikler; SP ana akımı kesince triyak söner ve tekrar gate gerekir.',
'SG’ye kısa basınca sanal triyak iletime geçiyor. DC’de doğal sıfır geçişi olmadığı için SG’yi bırakmak yeterli değil; SP STOP ana akımı kesiyor.',
['Q1/MT1–MT2 güç yolunu ve Q1/G gate yolunu ayır.','SG bas/bırak, SP durdur ve yeniden tetikleme durumlarını gözlemle.','Üretici tutma akımı veya gerçek cihaz sağlamlık sonucu çıkarma.']],
['17',5,7,'REVIEW_ISOLATED_AC_TRIAC_DUAL_HALF',
'Sanal triyaklı AC dimmer SCR deneyinden hangi yönüyle ayrılır?',
['Uygun tetiklemeyle iki AC yarım periyodunda da iletim gösterebilir','Yalnız tek pozitif yarım periyotta çalışır','Gate yerine fiziksel PE iletkenini kullanır'],
'BTA16 sanal modeli pozitif ve negatif yarım periyotları içerir; üretici dört çeyrek kalibrasyonu değildir.',
'Aynı lambanın pozitif ve negatif yarım periyottaki davranışına bak. Sanal triyak, SCR’den farklı olarak her iki yarım periyotta anahtarlama gösterebilir.',
['Sanal AC1, TRG1, Q1/MT1–MT2–G ve H1’i bul.','Tetikleme açısını değiştirip her iki yarım periyodu gözlemle.','Değişen RMS değerini sanal modelin sonucu olarak yorumla.']],
['18',6,7,'REVIEW_TLP521_OPTICALLY_ISOLATED_SIM',
'Sanal TLP521-1 dersinde giriş ve çıkış neden ayrı kaynaklara bağlı?',
['LED giriş devresiyle fototransistör çıkış devresi ayrı alanlar olduğu için','İki kaynağın nötrleri mutlaka kısa devre edilmek zorunda olduğu için','Röle bobinini iki parçaya bölmek için'],
'G1 giriş LED’ini, G2 çıkış kolektör direncini besler. Yazılımsal ayrım gerçek izolasyon testinin yerine geçmez.',
'Bir düğmeyle ışık göndermiş gibi düşün: U1 içinde giriş LED’i sanal çıkış fototransistörünü etkiliyor, ama iki devrenin beslemeleri ayrı kalıyor.',
['U1’in 1/2 LED ve 4/3 fototransistör uçlarını tanı.','Sanal SG bas/bırak durumlarında kolektör gerilimi değişimini izle.','Bu gözlemi fiziksel izolasyon veya cihaz sağlamlık belgesi sayma.']],
['19',10,14,'REVIEW_ISOLATED_OPTO_TRIAC_AC_FLASHER',
'Bu sanal flaşör devresinde MOC3021’in görevi nedir?',
['5 V kontrol sinyalini optik anahtarlamayla ayrı 12 V AC tetikleme tarafına aktarmak','AC yükün güç kaynağını tek başına oluşturmak','Flaşörün yerine mekanik röle takmak'],
'MOC3021 sanal opto-triyak kontrolüdür; BTA16 ayrı AC yük yolunu anahtarlar. Gerçek yalıtım performansı test edilmemiştir.',
'Bir tarafta sanal 5 V zamanlayıcı, öbür tarafta 12 V AC lamba var. MOC3021 kontrolü aradaki sanal optik yoldan aktarırken BTA16 yükü anahtarlıyor.',
['T1/RIN/U1 kontrol yoluyla AC1/H1/Q1 yük yolunu ayrı ayrı bul.','Duty %0 ve %50 durumlarını; artı/eksi yarım periyotları karşılaştır.','Sanal flaşör sonucunu gerçek izolasyon ya da ürün uygunluğu sayma.']]
];
for(const [suffix,partCount,wireCount,status,question,options,why,story,steps] of scenarios){
const id='electronic-switching-src-'+suffix,l=L.byId[id];
if(!l||l.topicId!=='electronic-switching'||!l.project||l.kind!=='wiring')throw Error('Missing electronic source '+id);
if(l.designStandard==='rich-reference-v1'||l.pedagogyReview?.simulationAcceptance===true)continue;
if(l.pedagogyReview?.titleTopologyStatus!==status||l.project.components.length!==partCount||l.project.wires.length!==wireCount||l.steps.length!==wireCount)throw Error('Protected semiconductor topology changed '+id);
const oldQuestion='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?';
if(l.quiz?.question!==oldQuestion||l.quiz?.answer!==0)throw Error('Source-specific quiz already exists '+id);
const original=JSON.stringify(l.project),originalSteps=JSON.stringify(l.steps);
const ids=new Map(l.project.components.map(c=>[c.id,c]));
for(const w of l.project.wires)if(!ids.has(w.from.c)||!ids.has(w.to.c))throw Error('Incomplete virtual endpoint '+id);
l.quiz={question,options:[...options],answer:0,why};
l.beginnerSteps=[...steps];
l.explanation=story+' '+l.explanation;
l.pedagogyReview={...l.pedagogyReview,sourceSpecificQuizVersion:'v1.19.20-semiconductor-batch-v',sourceCircuitPreserved:true,
    independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
if(original!==JSON.stringify(l.project)||originalSteps!==JSON.stringify(l.steps))throw Error('Canonical semiconductor circuit altered '+id);
}
L._switchingSemiconductorsBatchV=true;
})(typeof window==='undefined'?globalThis:window);