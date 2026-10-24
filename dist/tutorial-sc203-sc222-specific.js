/* SC203-222: first review true identities, preserve previously repaired SC206-211 source and pedagogy. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._sc203Sc222Specific)return;
const covered=['oscillator-filter-apps-src-22','oscillator-filter-apps-src-23','oscillator-filter-apps-src-24',
 ...Array.from({length:6},(_,i)=>'oscillator-filter-apps-src-'+String(i+25).padStart(2,'0')),
 ...Array.from({length:11},(_,i)=>'digital-logic-apps-src-'+String(i+1).padStart(2,'0'))];
if(covered.length!==20||new Set(covered).size!==20)throw Error('SC203-222 curriculum shifted');
const protectedAudio=new Set(Array.from({length:6},(_,i)=>'oscillator-filter-apps-src-'+String(i+25).padStart(2,'0')));
const story={
 'oscillator-filter-apps-src-22':'Mahalle radyosuna ses gönderen vericiyi düşün. FM, bilgiye göre taşıyıcının frekansını değiştirir. Bu sayfada RF güç ve yayın ölçümü yapılmadı.',
 'oscillator-filter-apps-src-23':'Arabada radyo kanalı seçtiğini düşün. Alıcı önce RF istasyonunu ayırır, sonra frekans değişiminden sesi geri kazanır. Bağlı alıcı ve anten ölçümü yok.',
 'oscillator-filter-apps-src-24':'Mikrofon sinyali çok küçük olabilir. LM358P ön yükseltecinde kuplaj kondansatörü ve orta referans işareti besleme aralığında tutar; çıkışın gerçek dinamiği ayrıca ölçülmelidir.',
 'digital-logic-apps-src-01':'İki güvenlik anahtarı da açık değilse makine başlamasın. AND kapısında çıkış yalnız iki giriş de 1 olduğunda 1 olur.',
 'digital-logic-apps-src-02':'Kapıyı iki ayrı düğmeden açtığını düşün. OR kapısı girişlerden en az biri 1 olduğunda çıkışı 1 yapar.',
 'digital-logic-apps-src-03':'Karanlıkta yanan ışığı düşün. NOT kapısı giriş 0 iken çıkış 1, giriş 1 iken çıkış 0 verir.',
 'digital-logic-apps-src-04':'Veriyi başka bir devreye taşımak istiyorsun. Üç durumlu buffer giriş seviyesini koruyabilir; etkinleştirme kapalıyken çıkışı yüksek empedanslıdır.',
 'digital-logic-apps-src-05':'İki koşul birlikte sağlandığında uyarıyı susturmak istiyorsun. NAND çıkışı ancak iki giriş de 1 olduğunda 0 olur.',
 'digital-logic-apps-src-06':'İki algılayıcı da sessizken bir göstergenin yanmasını düşün. NOR çıkışı ancak iki giriş de 0 olduğunda 1 olur.',
 'digital-logic-apps-src-07':'İki anahtarın farklı konumlarda olmasını istiyorsun. XOR girişler farklıysa 1, aynıysa 0 üretir.',
 'digital-logic-apps-src-08':'İki anahtar aynı konumdayken lamba yansın. XNOR, eşit girişler için 1 verir; karşıt girişler için 0.',
 'digital-logic-apps-src-09':'Birden çok alarmdan hangisine öncelik vereceğini düşün. Öncelikli kodlayıcı en yüksek öncelikli etkin girişin kodunu üretir; SN74HC148 girişleri aktif düşüktür.',
 'digital-logic-apps-src-10':'Üç bitlik seçimle sekiz çıkıştan birini seçmek istediğini düşün. SN74HC138 etkinleştirilince seçili Y çıkışı aktif düşük olur.',
 'digital-logic-apps-src-11':'Sayısal bir saatte 7 segment ekranı düşün. CD4511 BCD girişlerini uygun segment sürme bilgisine dönüştürür; bu kartta entegre ile ekran henüz kablolanmadı.'
};
const quiz={
 'oscillator-filter-apps-src-22':['FM vericide ses bilgisi taşıyıcıya nasıl aktarılır?',['Taşıyıcının anlık frekansı bilgiye göre değiştirilerek','Taşıyıcı şebeke gerilimine bağlanarak','Antenin rengi değiştirilerek'],'FM’de modüle edilen büyüklük taşıyıcının frekansıdır.'],
 'oscillator-filter-apps-src-23':['FM alıcı seçilen radyo istasyonundaki bilgiyi nasıl geri kazanır?',['RF seçimi ardından frekans değişimini demodüle ederek','Yalnız anten sembolünü görerek','Besleme olmadan hoparlörde ses üreterek'],'Alıcıda kanal seçimi ve FM demodülasyonu gerekir.']
};
for(const id of covered){
 const l=L.byId[id];if(!l)throw Error('Missing source '+id);
 if(protectedAudio.has(id))continue;
 const isPreamp=id==='oscillator-filter-apps-src-24';
 if(isPreamp ? (l.kind!=='wiring'||l.project.wires.length!==18) :
   (l.kind!=='quiz'||l.project.wires.length!==0||l.steps.length!==0))throw Error('Unexpected source graph '+id);
 const note=story[id];if(!note)throw Error('Missing distinct story '+id);
 l.explanation=note+' '+l.explanation;
 l.beginnerSteps=['Günlük örnek: '+note,...(l.beginnerSteps||[])];
 if(quiz[id]){
  const expected='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?';
  if(l.quiz?.question!==expected)throw Error('Preserve already specialized FM question: '+id);
  const [question,options,why]=quiz[id];l.quiz={question,options,answer:0,why};
 }
 l.sc203Sc222Specific='20261024-sc203-sc222-1';
}
L._sc203Sc222Specific=true;
})(typeof window==='undefined'?globalThis:window);
