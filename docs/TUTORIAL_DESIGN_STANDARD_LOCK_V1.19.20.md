# Devre Tasarım Stüdyosu — Öğretici Tasarım Standardı v1.19.20

**KİLİTLİ / ZORUNLU / v1.19.20** · rich-reference-v1

> **Yeniden tesis / kaynak sınırı — 10 Ekim 2026:** Aynı adlı eski belgenin birebir orijinal metni yeni GitHub deposunda, kullanıcının yüklediği ZIP dosyasında ve erişilebilen geçmişte bulunamadı. Bu dosya eski belgenin ele geçirilmiş özgün kopyası değildir. İçeriği kullanıcı tarafından 8 Ekim 2026'da onaylanan zengin öğretim düzeninden, dist/tutorial-pedagogy.js, dist/tutorial-mode.js, dist/tutorial.css ve tests/tutorial-reference-format-v11920.test.cjs dosyalarındaki kilitli davranış kanıtlarından yeniden tesis edilmiştir. Kaynağı olmayan yeni teknik değer uydurulmaz. Özgün tarihsel metin daha sonra bulunursa sapmalar MQ-00 tarafından ayrıca değerlendirilir.

## 1. Kapsam ve amaç

Referans dersler öğrenen öğrencinin doğru fiziksel malzemeyi görmesini, gerçek terminalden bağlantı yapmasını ve simüle edilmiş ölçüm sonucunu anlamasını sağlamalıdır. Sadece güzel bir resim veya çalışmayan sahte ölçüm arayüzü kabul edilmez. rich-reference-v1 standardı seri, paralel, karışık devre, Kirchhoff ve elektriksel ölçüm derslerinde korunur.

## 2. Öğrencinin cevaplayacağı beş soru

Devrenin amacı nedir? Hangi eleman ne yapıyor? Ölçüm nasıl yapılır? Neden o şekilde bağlanır? Beklenen sonuç nedir? Öğrenci devreyi kullanırken bu beş açıklamaya ve gözlemlenebilir simülasyon sonuçlarına erişmelidir.

## 3. Sayfa yerleşimi

Ortada ferah, büyük ve erişilebilir bir devre alanı; üstte öğretim amacı ve hesaplanan değerler; kenarlarda ölçüm/prob yönlendirmeleri; altta numaralı **Soru, Kısa bilgi, Beklenen gözlem, Öğrenci görevi** kartları yer alır. Kartlar terminali örtmemeli, ders dar ekranlarda da kullanılabilmelidir.

## 4. Gerçek malzeme ve fiziksel boyut

Malzeme, terminal ve simülasyon modeli projedeki kanonik kimliği kullanır. Ortografik gerçek ürün görünümü, ölçülü fiziksel çerçeve ve 2 scene-unit/mm ortak çalışma ölçeği korunur. Başka ürünün görünümü, terminali veya uydurma veri kopyalanmaz.

## 5. Fiziksel prob davranışı

UNI-T ölçüm aletlerinin kırmızı ve siyah probları öğrencinin temas ettirebileceği gerçek etkileşimli uçlardır. Öğrenci probları istediği uygun düğüme taşıyarak ölçümü değiştirebilir; her prob uygun tek yuvaya bağlanır. Önceden bağlı prob kabloları öğrenciye yeni devre kurma adımı diye gösterilmez.

## 6. Gerçek bağlantı adımları

Her öğretici bağlantı adımı devrede bulunan gerçek from/to komponent-pin çiftini hedefler. Her adımda ne yapılacağı, neden yapılacağı ve doğru gözlem açıklanır. Önceden bağlı alet/ölçüm kabloları ile devrenin fonksiyonel kurulum kabloları ayırt edilir.

## 7. Elektriksel tutarlılık

Akım işareti, ölçülen gerilim, direnç ve devre durumu gerçek simülasyon çözümünden türetilir; öğretim animasyonu sonucu uydurmaz. Kullanıcının korunan hazır örnekleri değiştirilmez; başarılı Farklı Kaydet ile yeni kopya üzerinde çalışma devam eder.

## 8. Pedagoji ve öğrenci deneyi

Her ders amaç, araçların işlevi, hesap/ölçüm yöntemleri, beklenen sonuç ve öğrencinin yapabileceği güvenli simülasyon görevlerini birleştirir. Doğru elektriksel kavramlar korunur; kullanıcıya fiziksel sahada enerji kesildiği izlenimi veren yazılım kontrolü gösterilmez.

## 9. Arayüz kararlılığı

tutorial-reference-stage ve ilgili top, side, flow ve bottom alanları tutarlı tasarlanır. Sayfa değişirken dashboard, materyal seçimi, kayıt/açma ve terminal etkileşimleri bozulmamalıdır. MQ-07 pedagojik, MQ-05 simülasyon, MQ-12 test ve MQ-00 teknik kabul zinciri korunur.

## 10. Yüzer ders anlatımı penceresi

Konu anlatımı yüzer, sürüklenebilir, yeniden boyutlandırılabilir ve küçültülebilir. Kapatılan pencereler görünür panel kontrolünden tekrar açılır. Konum/boyut/durum öğretici kullanımında korunur. Devre üzerindeki terminal veya ölçüm noktalarını kalıcı olarak erişilmez yapmaz.

## 11. Sağ yan panel aç/kapa standardı

Sağ konu/özellik paneli kullanıcı tarafından açılır ve kapatılır. Kapalıyken çalışma sahnesi genişletilmiş kullanılabilir; panel kontrolü kaybolmaz ve diğer editör kartları etkilenmez. Küçültülen öğretim penceresiyle sağ panel birbirinden bağımsız çalışır.

## 12. Temel Elektrik 8 referans kilidi

Paralel devrede aynı gerilim farklı kollara uygulanır; akım kollara ayrılır. Eşdeğer direnç 68,75 Ω ve 24 V kaynak örneğinde **Itoplam ≈ 349 mA**; R1 kolu yaklaşık 240 mA, diğer kol yaklaşık 109 mA'dir. Öğrenci toplam akımla kol akımlarını karşılaştırır ve voltmetrenin paralel bağlandığını görür.

## 13. Temel Elektrik 9 referans kilidi

Karışık devrede önce paralel kol sadeleştirilir: **R2 || R3 = 132 Ω**. Seri 100 Ω ile toplam 232 Ω elde edilir. 24 V kaynağında **Itoplam ≈ 103,45 mA**, R1 üzerinde yaklaşık 10,34 V, paralel kolda yaklaşık 13,66 V olur. **I2 + I3 ≈ Itoplam**; kol akımları yaklaşık 62,07 ve 41,38 mA'dir.

## 14. Temel Elektrik 10 referans kilidi

Kirchhoff devre kontrolünde **Itoplam ≈ I2 + I3** ve **Vkaynak ≈ VR1 + Vparalel** gözlenir. Öğrenci tek taşınabilir ampermetre ve voltmetreyi düğümlere taşıyıp ölçüm karşılaştırması yapar; sahte veya gereksiz tekrar eden aletlerle devre kalabalıklaştırılmaz.

## 15. Voltmetre ile gerilim ölçümü referans kilidi

DCV kademe ve paralel bağlama mantığı korunur:
- R1 uçları → `≈ +24 V`
- Aynı elektriksel düğüm → `≈ 0 V`
- Ters polarite → `≈ −24 V`

Gerilim işareti prob yönüne göre değişir; alet seri akım bağlantısı gibi gösterilmez.

## 16. Ampermetre ile akım ölçümü referans kilidi

DC akımı uygun yuva ve kademe ile seri ölçülür:
- Yük öncesi → `≈ +24 mA`
- Yük sonrası → `≈ +24 mA`
- Ters prob yönü → `≈ −24 mA`

Ampermetre doğrudan kaynağa paralel bağlatılmaz; iki farklı uygun seri noktada yük akımının aynı olduğu öğretilir.

## 17. Multimetre ile direnç ölçümü referans kilidi

Ölçümden önce enerji kapalıdır; Ω ölçümünü enerjili devrede yaptıran öğretim kabul edilmez.
- R1 iki ucu → `≈ 1,000 kΩ`
- Problar aynı noktada → `≈ 0 Ω`
- Problar açık / temas yok → `OL`

## 18. Pens ampermetre ile akım ölçümü referans kilidi

UNI-T UT200A ile tek AC iletken kavranarak akım ölçülür; bu yalnız **simülasyon laboratuvarıdır**. Faz ve nötr birlikte pens içine alınıp yanlış sonuç üretilmez.
- Faz iletkeni → `≈ 1,000 A RMS`
- Nötr iletkeni → `≈ 1,000 A RMS`

## 19. Frekansmetre ile frekans ölçümü referans kilidi

Gerçek UNI-T UT61E+ frekans ölçüm işlevi kullanılır. **UT33D+ üzerine gerçekte bulunmayan sahte bir Hz kademesi eklenemez**. Simülasyon sinyal jeneratörü ile: 50 Hz = 20 ms, 1 kHz = 1 ms, 10 kHz = 0,1 ms; periyot bağıntısı T = 1/f olarak açıklanır.

## 20. Wattmetre / güç faktörü → enerji analizörü referans kilidi

Enerji analizörü, akım trafosu ve gerçek simülasyon eğitim yükü kullanılır. İşlevsiz wattmetre/cosφ placeholder öğretilmez. S=230 VA için:
- Dirençli yük: P≈230 W, Q≈0 var, PF≈1,00.
- Endüktif yük: P≈184 W, Q≈+138 var, PF≈0,80.
- Kapasitif yük: P≈184 W, Q≈−138 var, PF≈0,80.

İlgili eşitlikler P=S×PF ve Q=±√(S²−P²) olarak açıklanır. Yalnız simüle edilen davranış iddia edilir.

---


## 21. Yüzer ders anlatımı okunabilirlik ve çalışma alanı kilidi

**Kullanıcı kararı (10 Ekim 2026):** Yüzer konu anlatımı penceresindeki küçük açıklama yazıları birkaç punto büyütülür. Açıklama gövdesi yaklaşık **13 px**, bölüm başlıkları **14 px**, kısa yardımcı etiketler **11–12,5 px** düzeyinde okunabilir kalır. Bu, eski 7–11 px düzeyindeki metinlerden belirgin bir iyileştirmedir.

- Yalnız `#tutorialCoach` içindeki metinler etkilenir. Sahne üzerindeki küçük mikro açıklamalar ve sağ özellik paneli bu tipografi değişikliğinden etkilenmez.
- **Pencerenin genişliği, yüksekliği, pozisyonu artırılmaz.** Mevcut sürükle, yeniden boyutlandır, küçült/büyüt ve dikey içerik kaydırma kuralları korunur.
- Öğrenciye devreyi kurup ölçüm yapacağı yeterli boş sahne bırakılır; açıklamalar taşarsa pencereyi büyütmek yerine pencerenin kendi kaydırma alanı kullanılır.
- **Akıllı mikro açıklama kuralı ayrı kalite kapısı olarak açıktır:** İlk açılışta görünme, ilk sahne tıklamasında gizlenme, malzemeye hover ile geri görünme ve fare ayrıldığında yeniden gizlenme; yüzer ders penceresini kapatmaz.
- MQ-12 kontrolü pencere davranışı, seçicilerin kapsamı ve önbellek sürümünün güncelliğini kapsar; Windows ekran denetimi olmadan tüm dersler nihai görsel kabul almış sayılmaz.

## MQ-00 kaynak/provenans ve kapanış kuralı

Bu dosya **yeniden tesis edilmiş bir kilit sözleşmesidir; özgün tarihsel metnin birebir kopyası olarak sunulamaz**. Mevcut kod ve kabul testlerinden doğrulanan maddeleri işler, başka kilitleri gevşetmez. Orijinal metin ortaya çıkarsa karşılaştırma yapılır. Bu dokümanın regresyon testlerini geçmesi, gerçek Windows/Edge görüntü kabulünün veya bütün sistem testlerinin geçtiğini tek başına kanıtlamaz. GitHub Actions çalıştırılmayacak ve commitlerde [skip ci] kullanılacaktır.

## 22. Tüm derslerde bağlamsal mikro açıklamalar — 2026-10-10

Mikro açıklama davranışı yalnız özel ölçüm derslerinde değil **tüm öğretici derslerde** ortak olarak kullanılır. Sayfa ilk açıldığında, zengin referans derslerde mevcut beş numaralı kart; diğer derslerde gerçek devre elemanlarından elde edilen en fazla dört kısa tanıtım görünür. Öğrencinin sayfaya ilk tıklaması bunları gizler. Fare bir probun veya malzemenin üzerine gelince yalnız o malzemenin açıklaması gösterilir ve fare ayrıldığında kaybolur. Aynı SVG bileşeni içindeki alt parçalar arasında geçiş gereksiz titremeye neden olmaz.

Kırmızı ve siyah prob açıklamaları karışmaz; açıklamalar malzeme ve mevcut ders bilgisinden türetilir, fiziksel olmayan veri uydurulmaz. Aynı ders içindeki yeniden çizimler ilk tıklama durumunu sıfırlamaz; yeni ders açılışında ilk tanıtım geri gelir. Mikro açıklamalar imleç olaylarını yakalamaz (`pointer-events:none`); çalışma alanının boyutunu değiştirmez. Yüzer konu anlatımı penceresi, alt soru/formül/gözlem kartları, sağ panel ve simülasyon davranışları aynı kalır.

`dist/tutorial-micro-hints.js` ortak olayları yönetir; `tests/tutorial-micro-hints-v11920.test.cjs` ilk gösterim, gizleme, hover ve ders değişimi korumasını test eder. Bu genel davranışın tamamlanması, 45 dersin özel pedagojik içerik ve görsel kalite kabulünün tamamlandığı anlamına gelmez. Windows görsel kabulü ayrı kalite kapısıdır.



## 23. Ölçme öğretiminde başlık bazında zengin laboratuvarın genişletilmesi

Ölçme ve ölçü aletleri bölümündeki her başlık kendi kazanımına göre farklı öğrenci görevi, doğru prob yuvası ve kademe, gerçek devre/ölçüm değeri, birden fazla deney noktası, kendi konu kontrolü ve adım adım yeniden kurma içermelidir. Doğrulanmış kanonik gerilim/akım laboratuvarının kullanılmasına izin verilir; ancak dersin özgün hedefi ve neden açıklaması korunmalıdır. Başka bir dersten yalnız görüntü veya başlık kopyalamak tamamlanmış öğretim sayılmaz.

Yüzer ders penceresi 13–14 px okunabilirliği ve serbest sürükleme/küçültme davranışını korur. İlk tıklamada gizlenen, hover ile açılan küçük kartlar sahnede sürekli alan kaplamaz. Dokuz alt konu için `tutorial-measurement-batch-a.js` ve `tutorial-measurement-batch-a-v11920.test.cjs` güvenlik ağıdır. Kod düzeyinde zengin laboratuvar bulunması, Windows görsel kabulünün tamamlandığı anlamına gelmez.
