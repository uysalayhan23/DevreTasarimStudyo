/* LM358P / 1N4148 precision rectifier: focused native DC transfer lesson.
 * The 14-wire exercise and original 16-wire source stay unchanged.
 * DC potentiometer sweep is NOT measured sine-wave half-wave rectification. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._precisionRectifierDcBatchAK)return;
const id='opamp-apps-outline-043',l=L.byId[id],p=l?.project;
const expected=[['g1','supply-dc-plus'],['rv1','potentiometer'],
 ['r3','resistor'],['r4','resistor'],['u1','lm358p-dip8'],
 ['d1','1n4148-do35'],['r5','resistor'],['v1','meter-voltmeter']];
const wireList=['g1.P>rv1.1','rv1.3>g1.M','rv1.2>u1.3','g1.P>r3.1',
 'r3.2>r4.1','r4.2>g1.M','g1.P>u1.8','g1.M>u1.4',
 'u1.1>d1.A','d1.K>u1.2','d1.K>r5.1','r5.2>r3.2',
 'd1.K>v1.1','v1.2>r3.2'];
const norm=(x,y)=>[x,y].sort().join('~'),
 wanted=wireList.map(s=>norm(...s.split('>'))).sort(),
 actual=p?.wires?.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort();
if(!l||l.topicId!=='opamp-apps'||l.kind!=='wiring'||
   p?.components?.length!==8||p?.wires?.length!==14||l.steps?.length!==14||
   expected.some(([name,type])=>p.components.find(c=>c.id===name)?.typeId!==type)||
   wanted.some((v,i)=>v!==actual[i])||
   l.pedagogyReview?.titleTopologyStatus!=='SOURCE_WIRED_PRECISION_RECTIFIER_DYNAMIC_PENDING'||
   l.pedagogyReview?.sourceReusedFrom!=='opamp-apps-src-15'||
   !['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance',
      'independentPedagogicalAcceptance'].every(k=>l.pedagogyReview[k]===false))
  throw Error('Protected LM358P rectifier lesson baseline differs '+id);
const old=JSON.stringify([p,l.steps,l.materials,l.kind,l.title]);
l.quiz={
 question:'Sanal hassas doğrultucuda RV1 girişi 12 V referansın altına indiğinde 1N4148 ne yapar?',
 options:['Diyot iletime geçebilir ve referansa göre pozitif çıkış oluşur.',
  'LM358P besleme terminalleri yer değiştirir.',
  'Devre kesinlikle 230 V AC sinüs üretir.'],
 answer:0,
 why:'RV1, LM358P pin 3 girişini ayarlar. U1 pin 1, D1 anodunu sürer; katot pin 2 geri beslemesine bağlıdır. Gerçek native DC çözümde giriş düştüğünde diyot iletir ve referansa göre pozitif çıkış gözlenir.'};
l.summary='Gerçek 14 uç bağlantılı LM358P/1N4148 sanal doğrultucuda native DC giriş-çıkış taraması yap. AC yarım dalga ve fiziksel kabul henüz yok.';
l.explanation='Bir sinyalin yalnız bir yönünü seçmek için op-amp ve diyotu birlikte kullanırız. '+
 'RV1 sürgüsü LM358P pin 3 girişini ayarlar; pin 1 çıkışı 1N4148 anoduna gider. '+
 'Diyot katodu pin 2 negatif geri beslemesine, 100 kΩ yüke ve V1 ölçüm ucuna bağlıdır. '+
 'R3/R4 yaklaşık 12 V orta referans oluşturur. Sanal DC taramasında RV1 yüzde 90, 75, 60, 50, 40, 25 ve 10 değerlerini karşılaştır. '+
 'Örnek native modelde ilk dört ayarda diyot kesimde ve referansa göre çıkış sıfıra yakınken, son üç ayarda iletim ve pozitif çıkış görülür. '+
 'Bu DC örneğidir; çalışan AC sinüs doğrultma dalgası, üretici diyot hassasiyeti, fiziksel LM358 performansı veya Windows kabulü kanıtlanmış değildir.';
l.learningGoal='LM358P 1/2/3/4/8, 1N4148 anot-katot ve orta referansa göre V1 çıkışını native DC sonucuyla ayırt etmek.';
l.beginnerSteps=[
 'G1 sanal beslemesini ve R3/R4 referansını bul.',
 'RV1/2 → U1/3 girişini ve U1/1 → D1/A → D1/K → U1/2 geri besleme yolunu incele.',
 'RV1 ayarını yüzde 90 dan 10 a indirerek native DC çıkışı karşılaştır.',
 'Diyotun iletime geçtiği yerde V1 değerinin neden yükseldiğini açıkla.',
 'Bu denemeyi AC yarım dalga veya fiziksel doğrultucu kabulü sanma.'
];
l.pedagogyReview={...l.pedagogyReview,
 sourceCircuitPreserved:true,nativePrecisionRectifierDcSweepPass:true,
 nativeDcRectifierModel:'native-wired-LM358-1N4148-precision-rectifier-DC',
 nativeDcRectifierScope:'TARGETED_POT_SWEEP_10_25_40_50_60_75_90',
 acHalfWaveAcceptance:false,physicalAcceptance:false,
 nativeDynamicAcceptance:false,windowsVisualAcceptance:false,
 independentPedagogicalAcceptance:false};
if(old!==JSON.stringify([p,l.steps,l.materials,l.kind,l.title]))
 throw Error('Existing real terminal graph / materials changed '+id);
L._precisionRectifierDcBatchAK=true;
})(typeof window==='undefined'?globalThis:window);