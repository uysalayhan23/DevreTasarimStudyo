/* SC249–257: source-specific NE555, filter and amplifier conceptual teaching. No wiring changes. */
(function(root){
'use strict';const L=root.DTSTutorialLessons;if(!L||L._conceptBatchAF)return;
const rows=[
['068','arduino-ne555,arduino-resistor-1k,arduino-capacitor-100u','555’li kararsız osilatörde tekrarlama neye dayanır?',['Zamanlama kondansatörünün uygun R yollarından sürekli dolup boşalmasına','Sembollerin yan yana durmasına','Kondansatörün kendi kendine enerji üretmesine'],'NE555 astable RC ve deşarj yoluyla zamanlanır. Bu kartta çalışan osilatör, kablo veya frekans ölçümü yoktur.',['Sürekli yanıp sönen ışığın RC zamanlamasını düşün.','Kablosuz NE555, R, C referansını çalışan devre sayma.']],
['069','arduino-ne555,arduino-resistor-1k,arduino-capacitor-100u','555’li PWM’de duty oranı neyi belirtir?',['Bir periyotta çıkışın ON kalma süresinin toplam süreye oranını','Mutlaka 50 Hz olmayı','Gerçek 230 VAC çıkış ölçümünü'],'PWM duty ile frekans farklıdır. Burada bağlı ayar ağı veya ölçülmüş dalga yoktur.',['Bir lambanın yanma ve sönük kalma sürelerini karşılaştır.','Frekansı duty oranıyla karıştırma; kartı çalışan PWM sayma.']],
['070','arduino-ne555,arduino-resistor-1k,arduino-capacitor-100u','555 tek kararlı devrede tetikten sonra ne beklenir?',['Süreli bir darbe ve ardından ilk duruma dönüş','Tetik olmadan kesintisiz salınım','Sürekli iki bellek durumu arasında gidip gelme'],'Tek kararlı 555 için tetikleme ve zamanlama bağlantısı gerekir. Kart bunları kurmaz ve darbe ölçmez.',['Tek tetiklemeden sonra duran bir zamanlayıcı düşün.','Monostable ile sürekli astable davranışı ayır.']],
['071','arduino-ne555,arduino-resistor-1k,arduino-capacitor-100u','555 çift kararlı modelin ayırt edici işlevi nedir?',['SET/RESET komutuyla durum seçip korumak','Kendiliğinden her saniye salınmak','Bağlantısız C ile otomatik bellek oluşturmak'],'Çift kararlı davranış için doğru SET/RESET kontrolü gerekir; bu malzeme kartı bellek devresi değildir. Gösterilen C bistable için zorunlu zamanlama kanıtı değildir.',['Bir komutla açılıp başka komutla kapanan sanal durum belleğini düşün.','Bistable ve astable farkını öğren; bağlı devre gösterilmediğini belirt.']],
['072','lm358p-dip8,resistor,capacitor','Alçak geçiren filtre öncelikle hangi frekansları azaltır?',['Yüksek frekansları','Düşük frekansları','Tüm frekansları eşit'],'Aktif alçak geçiren filtre için uygun op-amp beslemesi, R-C ve geri besleme bağlantısı gerekir. Bu kartta kesim ölçümü yoktur.',['Tizleri azalan bir ses kaydını düşün.','Kablosuz LM358P/R/C materyalini çalışan devre diye gösterme.']],
['073','lm358p-dip8,resistor,capacitor','Yüksek geçiren filtre hangi bileşenleri azaltır?',['Düşük frekans ve DC yakınını','Yalnız yüksek frekansları','Tüm sinyali eşit'],'Aktif yüksek geçiren için bağlı R-C ve op-amp ağı gerekir. Bu kartta kesim ve kazanç ölçülmemiştir.',['Düşük frekanslı uğultuyu azaltmayı düşün.','LM358P/R/C kartının bağlantısız olduğunu belirt.']],
['074','lm358p-dip8,resistor,capacitor','Bant geçiren filtre hangi frekansları seçer?',['Alt ve üst kesim sınırları arasını','Yalnız DC bölgesini','Her frekansı aynı kazançla'],'İki kesim sınırını gerçek frekans seçici ağ belirler; bu referansta bağlı filtre ve ölçülmüş bant yoktur.',['Sadece seçili ses aralığını duymayı düşün.','Kartta bağlı frekans seçici olmadığını açıkla.']],
['075','lm358p-dip8,resistor,capacitor','Bant durduran/çentik filtre hangisini bastırır?',['Seçili frekans bandını','Bant dışındaki her sinyali','Yalnız besleme etiketini'],'Gerçek notch/twin-T ağında seçili R-C bağlantısı gerekir. Bu kart bağlı veya ölçülmüş çentik değildir.',['Dar bir uğultuyu bastırmayı hayal et.','Bant geçiren ve durduran kavramlarını ayırt et; bağlı devre sanma.']],
['076','lm358p-dip8,resistor,capacitor','Başlığı transistörlü yükselteç olan bu kartın aktif öğesi hangisidir?',['LM358P op-amp; bağlı ayrık transistör yükselteci yoktur','Bağlı iki BD139 güç katı','Ölçülmüş hoparlör çıkışı'],'Başlık transistörlü yükselteç olsa da kart LM358P/R/C malzemelerini gösterir; ayrı transistör katı ve ölçülmüş ses gücü yoktur.',['Ses yükseltecinde giriş, kazanç ve çıkışı ayırt et.','LM358P kartını kurulmuş transistörlü amplifikatör sanma.']]
];
for(const [suffix,typesText,question,options,why,guide] of rows){
 const id='oscillator-filter-apps-outline-'+suffix,l=L.byId[id],types=typesText.split(',');
 if(!l||l.topicId!=='oscillator-filter-apps'||l.kind!=='quiz'||l.project?.referenceOnly!==true||
 l.project?.wires?.length!==0||l.steps?.length!==0||l.project?.components?.length!==types.length||
 l.project.components.some((c,i)=>c.typeId!==types[i]))throw Error('Source concept differs '+id);
 for(const k of ['nativeDynamicAcceptance','frequencyResponseAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])if(l.pedagogyReview?.[k]===true)throw Error('Accepted source protected '+id);
 if(l.quiz?.question!=='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?'||
 l.quiz?.answer!==0||l.quiz?.options?.length!==3)throw Error('Already personalized '+id);
 const before=JSON.stringify([l.project,l.steps,l.materials,l.kind,l.title]);
 l.quiz={question,options:[...options],answer:0,why};l.beginnerSteps=[...guide];l.explanation=why+' '+l.explanation;
 l.pedagogyReview={...l.pedagogyReview,sourceQuizVersion:'v1.19.20-concept-af',sourceCircuitPreserved:true,
 nativeDynamicAcceptance:false,frequencyResponseAcceptance:false,physicalAcceptance:false,
 windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
 if(before!==JSON.stringify([l.project,l.steps,l.materials,l.kind,l.title]))throw Error('Source modified '+id);
}
L._conceptBatchAF=true;
})(typeof window==='undefined'?globalThis:window);