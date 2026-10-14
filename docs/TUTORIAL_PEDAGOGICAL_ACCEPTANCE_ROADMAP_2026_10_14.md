# 2026-10-14 — Derinlemesine Öğretim ve Görsel Kabul Programı

## Güncel kesin durum

Tam müfredat **1.655 ders**. Yalnız daha önce kabul edilen **136 rich** ders; geri kalan **1.519** ders otomatik kaynak rehberli olup `fullyRich=false` ve `pedagogicalAcceptance=false`. 1.519/1.519 kaynak denetimi **anlatım kalitesi veya öğrenci öğrenmesi kabulü değildir**. Önceki 722 kablolu native solver stabilitesi 35 hedefsiz sensör + 7 reaktif davranış REVIEW durumlarını kapatmaz. Gerçek Windows/`file:///` görsel onay açık.

## Zorunlu ders-bazlı kabul ölçütü

1. **Amaç ve gerçek hayat davranışı:** öğrenci devrenin neyi algıladığını, kontrol ettiğini, dönüştürdüğünü veya ölçtüğünü açıklayabilmeli; genel “elemanlar kullanılır” cümlesi yeterli değil.
2. **Şema ile başlık uyumu:** başlıktaki NTC/LDR/opamp/role vb. gerekli elemanlar gerçekten `project.components` içinde bulunmalı; önemli kontrol uçları gerçek `project.wires` ile bağlanmalı. Başlığa uysun diye doğrulanmadan sensör eklenmez.
3. **Gerçek terminaller ve fonksiyon:** enerji kaynağı → besleme pinleri → giriş/bölücüler → kıyas/geri besleme → çıkış/yük → dönüş noktaları ve ölçüm pinleri gerçek adlarıyla açıklanmalı.
4. **Hesap ve geçiş davranışı:** kaynakça/ürün/simülasyon değerleriyle temellendirilen formül, eşik, beklenen **iki farklı çalışma durumu**, ölçüm yöntemi; belirsiz fiziksel değerler UNKNOWN/REVIEW olarak kalmalı.
5. **Öğrenci deneyi ve ölçme:** ilk durum, öğrencinin değiştireceği gerçek sanal kontrol, beklenen çıkış, ölçüm, karşılaştırma ve yanlış sonuç durumunda ipucu.
6. **Sayfa ve görsel QA:** yüzer pencerede tekrarlayan paragraf yok, 13–14 px okunabilirlik, sahne ve terminali örtmeyen mevcut boyut, yatay taşma/üst üste binme/prob bağlantısı, kaydırma, dar ekran, `file:///` Windows gerçek UI kabulü. Bunların hiçbiri tek başına statik kaynak PASS ile kapanmaz.
7. **Kilit sürekliliği:** 136 rich kabulü, kaydedilmiş projeler, 4 dashboard kartı, gerçek ölçüler ve terminal geometrisi, eski migration verisi korunur; kaynak ID/terminal migration yapılmadan yeniden adlandırılmaz.

## Pilot MQ-07/MQ-05/MQ-12 — opamp-apps-src-08

Kullanıcı ekranında **NTC’li karşılaştırıcı** dersi RV1 potansiyometreyle üretildiği için ders başlığı/cihaz uyuşmazlığı bulundu. Mevcut, daha önce kullanılmış `resistiveSensorComparatorProject` şablonu ile özgün `sensor-ntc` modelinin 24 VDC ve LM358P pin 8,4,3,2,1 üzerinden kullandığı proje hedeflendi. `R2=R3=10 kΩ` referans bölücüsü 12 V; `NTC/R1` sensör bölücüsü giriş gerilimini üretir. 15→25→35 °C giriş karşılaştırmasında özgün V8 solver düşük→eşik→yüksek çıkışı izler. Metinler baştan sona amaç→terminaller→12 V hesabı→NTC değişimi→OUT gerilimi→öğrenci görevi düzeninde yazıldı. `physicalTestAccepted=false`, `pedagogicalAcceptance=false` korundu. Bağımsız kullanıcı/Windows QA tamamlanmadan FINAL verilmez.

## Geniş müfredat için kabul durumu

Her ders için `titleVsPhysicalPart`, `terminalMap`, `causeAndEffect`, `measurableOutput`, `lessonText`, `layout`, `sourceRegression` alanları tek tek PASS/REVIEW/N/A ile takip edilecek. Bölüm bölüm ilerle: öncelik P1 gerçek başlık-devre uyuşmazlığı; ardından 1.519 otomatik metnin konuya özgü anlatımı; sonra 1.655 sayfa UX kabulü. Tekil pilot tamamlanması, bütün derslerin düzeltildiği anlamına gelmez. Ajan zinciri MQ-07 lider → MQ-05 çapraz → MQ-12 V8/Node kanıt → MQ-13 repo süreklilik → MQ-00. Actions kullanılmayacak, `[skip ci]`.

## 2026-10-14 — MQ-07 tam müfredat semantik kalite tabanı (kapanış değil)

- Güncel `main` HEAD `349fcefd3e748cccb2c71f5cc1f671085eb3d6ed` özgün kaynaklarından V8 ile **1.655/1.655 ders tarandı**. **523 şablon özet, 350 şablon çalışma açıklaması, 644 birbirini tekrarlayan giriş, 715 derste en az bir genel malzeme gerekçesi** tespit edildi. Başlık NTC iken kablolu şemada NTC olmayan ders **0** (önceki `opamp-apps-src-08` pilot onarımından sonra). Bu gruplar kesişir; **toplanmaz**.
- Yeni fail-closed semantik envanter: `scripts/qa-tutorial-pedagogical-depth-v11920.cjs`, negatif örnekleri de doğrulayan `tests/qa-tutorial-pedagogical-depth-v11920.test.cjs`. V8 test uyarlamasında **2/2 PASS**; **gerçek Node `--test` çalıştırılmadı**. Envanter `evidence/mq07_pedagogical_semantic_baseline_20261014.json` içine kaydedildi.
- **Derslerin pedagojik kabulü 1.519 REVIEW**, Windows sayfa/terminal görünürlüğü ve bağımsız öğrenme QA hâlâ **OPEN**. Bu QA'nın PASS olan testleri, ders içeriklerine onay vermez.
- Düzeltme sırası: (1) başlık–fiziksel eleman/topoloji uyuşmazlığı; (2) kaynaklı neden-sonuç/pin-geri besleme/ölçüm anlatımı; (3) gerçek Windows `file:///` sayfa akışı, prob/scroll/taşma; (4) ilgili ders için MQ-07→MQ-05→MQ-12→MQ-13→MQ-00 kapıları. Mevcut NTC pilotu tekrar onarılmaz; 136 rich ve kanonik örnekler korunur.

## 2026-10-14 — MQ-07 ilk 10 şablon kablolu ders için terminal-bağlamlı anlatım (kaynak QA)

- `main` 3ae62f2e1f4ab68a07936637be5c66a7162c00cd tabanında ilk 10 şablon kablolu dersin **yalnız summary/explanation/learningGoal/beginnerSteps/materials/pedagogyReview alanları** zenginleştirildi: installation-grounding-src-01, installation-grounding-src-02, installation-systems-src-02, installation-systems-src-03, installation-systems-src-04, installation-systems-src-05, installation-systems-src-06, installation-systems-src-08, installation-systems-src-09, installation-systems-src-10.
- Ders başına amaç, mevcut gerçek şema uçları, besleme/dönüş, neden-sonuç, doğrulanabilir sayısal hesap veya belirsizlik sınırı, sanal öğrenci görevi. `installation-systems-src-04` **ara vaviyen eksik** ve `installation-systems-src-06` **ikinci/üçüncü buton eksik** → başlık/topoloji `REVIEW`; şema otomatik değiştirilmedi.
- MQ-05/MQ-12 özgün V8: **4/4 yeni regresyon** ve **1.655/1.655 kaynak, 722/722 solver başlangıç, 10/10 üç faz kararlı, 5/5 kumandalı sanal tepki/geri dönüş**; kalan beş pasif/referans senaryoya sahte yük yanıtı PASS verilmedi. Kaynak terminal eksik/kısa devre/blocked 0. **136 rich tamamen aynı, 1.655 projenin kabloları/bileşenleri aynı**, değişen içerik ID yalnız 10.
- MQ-07 semantik envanter: genel özet **523→513**, genel açıklama **350→340** (diğer 1.519 ders için nihai pedagojik kabul hâlâ açık). Batch N **1.519/1.519 kaynak QA** korunur. Windows `file:///` / gerçek fiziksel ürün/bağımsız öğretmen kabulü **NOT_RUN/REVIEW**.
- QA kanıtı: `evidence/mq07_first10_wired_depth_20261014.json`; kalıcı test `tests/qa-mq07-first10-pedagogical-v11920.test.cjs`. MQ-07 lider → MQ-05 kaynak → MQ-12 V8 test → MQ-13 136 rich/canonical kilit → MQ-00 **SOURCE PASS, FINAL OPEN**. Actions 0; commit `[skip ci]`.


## 2026-10-14 — 001–200 gerçek ders metni / bir devre onarımı

- İlk **200 ders** tarandı; mevcut **101 rich** ve önceden düzeltilmiş **10 kablolu + 1 NTC** anlatımı korundu. **88 dersin uygulamanın gerçek `dist/tutorial-pedagogy.js` dosyasında** `summary`, `explanation`, `learningGoal`, `beginnerSteps` ve eleman görevleri yenilendi: **30 gerçek kablolu + 58 kavramsal/referans ders**.
- `opamp-apps-src-07` başlık/LDR uyumsuzluğu gerçek `ldr-gl5528` sensörü, 10 kΩ bölücü, 12 V LM358P karşılaştırıcı ağını kullanacak biçimde değiştirildi. `opamp-apps-src-08` önceki NTC onarımı korundu.
- MQ-12 özgün GitHub kaynaklarıyla V8: **1655/1655 ders, 722/722 özgün solver başlangıcı PASS**, katalog **939**, eksik tür/terminal/blocked/kısa devre/kararsız **0**; eski ilk10 sınıflandırma 10/10, stabilite 10/10, response 8/8 ve seal-in restoration REVIEW, Batch N **1519/1519 kaynak PASS** korundu. Son HEAD gerçek `node --test`, Windows `file:///` görsel ve kullanıcı kabulü **NOT_RUN**.
- **64 ders REVIEW:** devresi olmayan **58 konu dersi**, zamanlama kanıtı, piezo sensörü, dimmer güç katı ve iki bağımsız op-amp girişi gibi diğer eksikler. Bunların teknik devre/çizim tamamlanmışlığı iddia edilemez. **Grup 001–200 henüz tam teslim değil**. Diğer 200 gruba geçişte bu açıklar ayrı P1 kalemleri olarak tutulmalı.
- Kalıcı test `tests/qa-mq07-batch-001-200-v11920.test.cjs` ve QA kanıtı `evidence/mq07_batch_001_200_20261014.json`. Actions 0, commit `[skip ci]`.

## 2026-10-14 — İlk 200 devamı: gerçek üç noktadan aydınlatma ve trafolu zil pedagojisi

- **Gerçek uygulama düzeltmesi:** `installation-systems-src-04` artık `intermediate-1` kanonik sanal devresindeki **2 vaviyen + 1 ara vaviyen + 7 kabloyu** kullanır. Önceki 2 anahtarlı/5 kablolu yanlış çizim kaldırıldı. Öğrenci metninde G1/L → S1/11, S1/12→S2/1, S1/14→S2/3, S2/2→S3/12, S2/4→S3/14, S3/11→H1/X1, H1/X2→G1/N yolu; düz/çapraz geçiş ve üç anahtarın ayrı ayrı H1'i değiştirmesi açıklanır. Yalnız sanal laboratuvardır; gerçek şebeke kablolaması öğretilmez.
- **Zil standardı korunup anlatım geliştirildi:** `installation-systems-src-05` ve `-06` için TR1, B1–B3 ve Z1 malzemelerinin gerçek sanal görevleri ve trafo devre dışıyken beklenen davranış açıklandı. `BELL_TRANSFORMER_V1` kilitli JSON/MD dosyaları değişmedi; yalıtılmış 12 VAC S1/S2, direkt şebekeden beslemeyi engelleyen uyarı ve üç çağrı noktası korunuyor. Eski MQ-07 testlerinde düzeltmeden önceki fazlı zil/eksik anahtar beklentileri güncel devrelere göre düzeltildi.
- **MQ-05/MQ-12 gerçek özgün V8 koşusu:** 13/13 seçilmiş QA callback PASS; 1.655 ders, 722/722 kablolu ilk solver kararlı, 940 katalog, eksik terminal/kısa devre/blokaj 0; üç noktadan kontrol **8/8 anahtar kombinasyonu kararlı**, her bir S1/S2/S3 değiştirme H1'i tersine çeviriyor; trafolu zil **15/15 devre, 38/38 faz PASS**; Batch N **1.519/1.519 kaynak PASS**. **Tam Node `--test` veya Windows UI koşusu yapılmadı**.
- MQ-07→MQ-05→MQ-12→MQ-13→MQ-00: hedef kaynak düzeltmesi V8 PASS; bağımsız pedagojik/Windows/fiziksel ürün kabulü REVIEW. Önceki ilk-200'ün **64 ayrıca kaydedilmiş teknik REVIEW** kalemi tek onarımla kapatılmış sayılmadı. Kanıt: `evidence/mq07_three_point_and_bell_continuity_v8_20261014.json`. GitHub Actions 0, `[skip ci]`.


## 2026-10-14 — İlk 200 gerçek devre düzeltmesi: tek anahtarlı aydınlatma

- `installation-systems-src-01` önce 4 malzemenin kablosuz panosuydu; şimdi gerçek sanal kaynak G1, koruma anahtarı Q1, adi aç/kapa S1 ve H1 armatürü **4 doğrulanmış terminal kablosuyla** devre oluşturuyor. Öğrenci anlatımı neden-sonuç, kontrol/protection ayrımı ve 4 durumlu gözlemle gerçek uygulama kaynağında yenilendi.
- **MQ-05 V8 özgün kaynak:** tek anahtar OFF→ON→OFF ve sanal koruma açma senaryoları **4/4 kararlı**, lamba yalnız koruma kapalı ve S1 kapalı konumdayken etkin. Tüm 1.655 ders, 940 malzeme, **723/723 kablolu ilk durum PASS**, eksik malzeme/kısa devre/blocked **0**.
- **BELL_TRANSFORMER_V1 kilidi korunur:** 15/15 sanal zil dersi, 38/38 çalışma durumu PASS, doğrudan şebeke fazı zil ve butona bağlanmaz. Manifest JSON/MD değiştirilmedi.
- İlk 200 grubunun açık teknik sayısı **64 → 63**. Grubun tamamı veya Windows/native Node testi PASS kabul edilmez; pedagojik ve görsel bağımsız kabul REVIEW sürer. QA: `tests/qa-mq07-single-switch-lighting-v11920.test.cjs`. Actions 0, `[skip ci]`.
