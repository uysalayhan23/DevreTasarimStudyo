/* SC143–162: warm, topic-specific introductions and quiz repairs; canonical circuits untouched. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._sensorFirst20Stories)return;
const stories=[
 'Bir buzdolabının sıcaklığı değiştiğinde NTC direnci de değişir. Bu sanal devrede o küçük değişimin lambayı nasıl açıp kapattığını izle.',
 'Bir motorun fazla ısındığını düşün. PTC sıcaklıkla daha yüksek direnç gösterir; eşik aşılınca kontrol devresinin ne yaptığını izle.',
 'Fırının içini doğrudan göremediğini düşün. Termokuplun ürettiği çok küçük gerilim sıcaklığı anlatır; ölçümde soğuk birleşim de önemlidir.',
 'Bir üretim hattının sıcaklığını hassas izlemek istiyoruz. PT100 direnç değiştirir; üç telli ölçümün neden seçildiğini araştır.',
 'Bir odanın sıcaklığını Arduino ekranına aktardığını düşün. LM35 sıcaklığı milivolta, Arduino bu gerilimi sayıya çevirir.',
 'Kapı kapandığında mıknatısın küçük Reed kontağı etkilediğini hayal et. Sensörün tepkisiyle Arduino D2 girişinin gördüğü sinyalin aynı şey olmadığını öğren.',
 'Bir mıknatıs sensöre yaklaşınca Hall çıkışı röleyi çalıştırır. Kontrol sinyaliyle lambanın güç yolunun neden ayrı olduğunu izle.',
 'Bir yüzeye hafifçe dokunduğunda piezo eleman kısa bir gerilim darbesi üretir. Darbe sönünce sürekli besleme varmış gibi davranma.',
 'Bir tartının üzerine yük yerleştirdin. Load cell çok küçük diferansiyel sinyal üretir; gösterge bunu bir kütle değerine dönüştürür.',
 'Hava kararınca bahçe ışığının yandığını düşün. LDR ışık azalınca direnç değiştirir, karşılaştırıcı bunu bir anahtarlama kararına çevirir.',
 'Bir masa lambasının parlaklığını aydınlığa göre ayarlıyorsun. Bu örnek AC şebeke dimmeri değil, yalnız düşük gerilimli sanal DC karartmadır.',
 'Otomatik kapının ışık algılayıcısını düşün. Bu sanal optik algılama kartı, ayrı verici ve alıcının fiziksel üretim testi değildir.',
 'Üretim bandına metal parça geldiğinde sensör röleyi çeker. Sinyal ucu koparsa algılama var olsa bile lambanın yanmayacağını gözlemle.',
 'Bir nesne kızılötesi algılama bölgesine yaklaştı. Optik algılama, röle bobini ve lamba güç yolunu birbirinden ayır.',
 'Güneşli bir günde küçük bir hücrenin enerji üretmesini düşün. Açık devre gerilimi ile yüke verilen gerçek güç aynı değildir; burası ölçülmüş kablolu deney değildir.',
 'Alkış duyulduğunda zilin öttüğü bir düzenek hayal et. Sensörün dijital çıkışı Arduino girişine, Arduino komutu da sesli uyarıcıya gider.',
 'Termokupl, Hall ve piezo aynı fiziksel şeyi ölçmez. Girişteki ısı, manyetik alan veya kuvvetin hangi elektriksel işarete dönüştüğünü karşılaştır.',
 'Bir araçta tekerlek hızı ile motor sıcaklığı farklı yollarla ölçülür. Hangi sensörün hangi fiziksel büyüklüğe uygun olduğunu ayır.',
 'Sıcaklık için tek bir sensör her işe uymaz. NTC, PT100 ve termokupl arasında ölçüm aralığı ve çıkış türüne göre seçim yap.',
 'Mıknatısı sanal Hall sensörüne yaklaştırdığında röle ve lamba tepkisini izle. Bu bir yazılım bağlantı deneyidir; fiziksel Hall sensörü imalatı değildir.'
];
const quiz={
 1:['NTC ısındığında bu sanal algılama bölücüsünde ne değişir?',['NTC direnci azalır, gerilim bölücüsü karşılaştırıcı girişini değiştirir.','NTC bir şebeke gerilimi üretir.','NTC röle kontağı gibi mekanik açılır.']],
 11:['Bu dersteki LDR dimmer hangi güç yolunu öğretir?',['Düşük gerilimli DC MOSFET kontrolü ve yük gücü.','230 V AC faz açısı dimmerinin fiziksel kabulünü.','LDR ile bir motorun frekansını.']],
 12:['IR alıcı-verici başlığındaki bu sanal devre için doğru sınır hangisidir?',['Optik algılama davranışı örneklenir; ayrı fiziksel verici/alıcı kabulü yoktur.','Ayrı verici ve alıcı fiziksel olarak test edilmiştir.','Optik sensör yalnız metal algılar.']],
 15:['Güneş hücresinin açık devre gerilimi neyi tek başına göstermez?',['Yük altındaki akım ve gücü.','Hücrenin uçlarında gerilim olabileceğini.','Işığın elektriksel etki oluşturabileceğini.']],
 16:['Sanal ses sensörü DO ucundan Arduino D2 hattı koparsa ne olur?',['Arduino geçerli alkış bilgisini alamaz; buzzer kontrolü etkilenir.','Sensör kablo olmadan D2 pinini mutlaka HIGH yapar.','Buzzer şebekeden bağımsız sürekli çalışır.']],
 17:['Aşağıdaki hangi eşleştirme fiziksel etkiyi elektriksel işaretle doğru ilişkilendirir?',['Termokupl: ısı farkına bağlı küçük gerilim.','Hall sensörü: yalnız ortam sesi.','Piezo eleman: yalnız ışık şiddeti.']],
 18:['Otomobilde tekerlek dönüşünün algılanmasında hangi ilke kullanılabilir?',['Manyetik alan değişimine duyarlı Hall algılama.','Yalnız PT100 sıcaklık direnci.','Yalnız güneş pili gerilimi.']],
 19:['Geniş sıcaklık aralığında sıcak uç ölçümü için hangi sensör tipi düşünülebilir?',['Uygun tipte termokupl.','Yalnız sabit değerli direnç.','Yalnız manyetik Reed kontağı.']],
 20:['Hall sensörünün sanal PNP çıkışı BK koparsa hangi durum beklenir?',['Algılama olsa da röle bobini sürülmez, lamba yanmaz.','BK kopsa da röle daima çeker.','Hall sensörü +230 V üretir.']]
};
if(stories.length!==20)throw Error('SC143–162 story count mismatch');
for(let i=0;i<20;i++){
 const id='sensor-analog-apps-src-'+String(i+1).padStart(2,'0');
 const l=L.byId[id];if(!l||l.topicId!=='sensor-analog-apps')throw Error('Missing sensor lesson '+id);
 const story=stories[i];
 l.explanation=story+' '+l.explanation;
 l.beginnerSteps=['Önce günlük örneği düşün: '+story,...(l.beginnerSteps||[])];
 if(quiz[i+1]&&/konusunda hangi temel teknik ilke doğrudur\?/.test(l.quiz?.question||'')){
  const [question,options]=quiz[i+1];
  l.quiz={question,options:[...options],answer:0,why:options[0]};
 }
 l.sensorStoryVersion='20261024-sensor-first20-story1';
}
L._sensorFirst20Stories=true;
})(typeof window==='undefined'?globalThis:window);
