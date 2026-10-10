# Öğretici müfredatı — 1.655 derslik konu-bazlı kalite matrisi

**10 Ekim 2026 · GitHub main gerçek müfredat üretici zinciri.** Bu rapor 43 kategori ve 1.655 dersin durumunu repo verisinden otomatik toplar. `rich-reference-v1` etiketi kod şablon kapsamıdır; kullanıcı görsel/Windows ve pedagojik son kabulü değildir.

Kod kapsamı: **136/1655**, henüz zengin kod formatına yükseltilmemiş: **1519**. Bunların içinde 45/45 elektriksel ölçme dersi rich kod olarak kayıtlı; 10/10 Doğru akım dersi de rich. Çok sayıda sıradan quiz/wiring başlığı hâlen detaylı uygulama ve gerçek devre tasarımı bekliyor.

Çalışma sırası: (1) **Doğru akım 10/10 kod doğrulaması tamam; ekran QA açık**, (2) diğer Temel Elektrik ve tesisat konuları, (3) elektronik ölçme/anahtarlama/sensör ve dijital mantık, (4) motor/pano/PLC, (5) tüm konu başlıklarının gerçek görsel, simülasyon, pedagojik ve Windows kullanıcı kabulü. İlerleme gerçek repo kanıtına göre kaydedilir.

| Konu kimliği | Ders | Rich kod | Kalan | Kablolu | Etkileşimli | Soru/quiz | İlk başlık |
|---|---:|---:|---:|---:|---:|---:|---|
| `motor-direct-power` | 260 | 0 | 260 | 259 | 0 | 1 | Motor etiketi ve klemens kutusu |
| `installation-systems` | 150 | 0 | 150 | 21 | 0 | 129 | Adi anahtarlı aydınlatma |
| `sensor-analog-apps` | 142 | 0 | 142 | 46 | 0 | 96 | NTC ile sıcaklıkta çalışan devre |
| `workshop-safety-mechanics` | 141 | 0 | 141 | 7 | 0 | 134 | Atölye ve iş güvenliği kuralları |
| `electronic-component-basics` | 130 | 0 | 130 | 7 | 0 | 123 | 1.1. ARIZA ARAMA YÖNTEMLERİ |
| `electronic-switching` | 91 | 0 | 91 | 25 | 0 | 66 | Röle uçlarının bulunması |
| `oscillator-filter-apps` | 85 | 0 | 85 | 7 | 0 | 78 | Colpitts osilatör |
| `panel-power-systems` | 72 | 0 | 72 | 0 | 0 | 72 | Pano bağlantı şemasının çizilmesi |
| `plc-hardware-programming` | 61 | 0 | 61 | 7 | 0 | 54 | PLC tanımı ve röleli sistemle karşılaştırma |
| `opamp-apps` | 55 | 0 | 55 | 47 | 0 | 8 | Eviren yükselteç AC giriş |
| `digital-logic-apps` | 50 | 0 | 50 | 0 | 0 | 50 | AND (VE) kapısı |
| `motor-start-speed` | 50 | 0 | 50 | 41 | 0 | 9 | Yıldız-üçgen paket şalterle yol verme |
| `installation-grounding` | 47 | 0 | 47 | 4 | 0 | 43 | Temel topraklama iletkeni bağlantısı |
| `measurement-workshop` | 45 | 45 | 0 | 21 | 24 | 0 | Voltmetre ile gerilim ölçümü |
| `digital-sequential-apps` | 40 | 0 | 40 | 0 | 0 | 40 | RS flip-flop |
| `microcontroller-apps` | 32 | 0 | 32 | 0 | 0 | 32 | İlk program ve dijital çıkış LED |
| `vfd-servo-control` | 30 | 0 | 30 | 0 | 0 | 30 | Frekans invertörünün temel yapısı ve parametreleri |
| `motor-braking` | 24 | 0 | 24 | 24 | 0 | 0 | Frenleme sisteminin amacı ve çeşitleri |
| `motor-special` | 22 | 0 | 22 | 20 | 0 | 2 | Bir fazlı yardımcı sargılı asenkron motor |
| `circuit-simulation-pcb` | 19 | 0 | 19 | 0 | 0 | 19 | 4. ÖĞRENME BİRİMİ 4.1. ELEKTRONİK DEVRE SİMÜLASYON YAZILIMI |
| `dc-circuits` | 10 | 10 | 0 | 7 | 2 | 1 | Doğru akım ve kullanım alanları |
| `motor-sequence` | 10 | 0 | 10 | 10 | 0 | 0 | İki motorun sıralı çalıştırılması |
| `number-systems` | 8 | 0 | 8 | 0 | 0 | 8 | 6.1.1. Sayı Sistemleri |
| `button-led` | 5 | 5 | 0 | 5 | 0 | 0 | 24 VDC NO buton ile yeşil LED yakma |
| `button-relay` | 4 | 4 | 0 | 4 | 0 | 0 | 24 V buton-röle bobini |
| `seal-in` | 4 | 4 | 0 | 4 | 0 | 0 | Start/Stop ile temel mühürleme |
| `timer-flipflop` | 4 | 4 | 0 | 4 | 0 | 0 | 1 s / 1 s flip-flop |
| `commutator` | 4 | 4 | 0 | 4 | 0 | 0 | İki ayrı tavan lambası |
| `two-way` | 4 | 4 | 0 | 4 | 0 | 0 | İki noktadan tavan lambası |
| `intermediate` | 4 | 4 | 0 | 4 | 0 | 0 | Üç noktadan aydınlatma |
| `bells` | 4 | 4 | 0 | 4 | 0 | 0 | 1 buton + 1 zil |
| `control-combinations` | 4 | 4 | 0 | 4 | 0 | 0 | Start/Stop mühürleme |
| `loop-420` | 4 | 4 | 0 | 4 | 0 | 0 | 2 telli transmitter + ampermetre |
| `loop-powered` | 4 | 4 | 0 | 4 | 0 | 0 | İki telli loop-powered transmitter |
| `active-passive` | 4 | 4 | 0 | 4 | 0 | 0 | Harici beslemeli pasif loop |
| `pnp-npn` | 4 | 4 | 0 | 4 | 0 | 0 | PNP sensör → 0 V’a bağlı yük |
| `inductive-capacitive` | 4 | 4 | 0 | 4 | 0 | 0 | PNP endüktif metal algılama |
| `source-sink` | 4 | 4 | 0 | 4 | 0 | 0 | Sourcing PNP çıkış |
| `open-collector` | 4 | 4 | 0 | 4 | 0 | 0 | NPN open collector yük sürme |
| `bero` | 4 | 4 | 0 | 4 | 0 | 0 | BERO tipi PNP endüktif yaklaşım |
| `motor-forward-reverse` | 4 | 4 | 0 | 4 | 0 | 0 | İleri/geri · çapraz elektriksel kilitleme |
| `motor-star-delta` | 4 | 4 | 0 | 4 | 0 | 0 | Manuel yıldız/üçgen paket şalter |
| `dual-dc` | 4 | 4 | 0 | 4 | 0 | 0 | İki tamamen izole DC devre |

**Yeni doğrulanmış kod kapsamı:** 45 elektriksel ölçme + 10 doğru akım + 5 buton/LED + 4 buton/röle + 4 mühürleme + 4 zaman rölesi = **72 ders**. Son 13 kontrol dersi için özgün kablo dizileri birebir korundu ve konuya özel açıklama ile soru eklendi. Başlıkların görsel/Windows ve kullanıcı pedagojik kabulü açık kalır. Zaman rölesi 4/4 sanal titreşim modelleri 1/1, 0,5/1,5 ve 1,5/0,5 saniye olarak düzeltildi. Sıradaki konular tesisat anahtar devreleri, güvenli sanal zil ve 4–20 mA, ardından motor kumanda senaryolarıdır.

**Kabul uyarısı:** Bir derse yalnız `designStandard` eklemek kabul değildir. Gerçek devre, görsel, ölçüm/model kaynağı, uygulama adımı ve çocukların anlayacağı neden-sonuç açıklaması mevcut değilse pedagojik DONE sayılmaz. Ders düzeyindeki ekran kabulü ve gerçek donanım ön görünüşü özel QA gerektirir. Üretim GitHub Actions kullanmadan, commitlerde `[skip ci]` kuralıyla yürütülür.


## 2026-10-10 — Batch H, 16 tesisat dersi (kod yükseltmesi; kabul açık)

Komütatör 4/4, vaviyen 4/4, ara vaviyen 4/4 ve zil 4/4 derslerinin kaynak kablo, komponent ve adım tanımları değiştirilmeden `dist/tutorial-installation-batch-h.js` öğretim açıklamaları ve konu kontrolü eklendi. Ders sayısı 1.655; rich kod kapsamı 88/1.655; kalan 1.567. Bu değer yalnız **kod kapsamıdır**, gerçek simülasyon/pedagojik/Windows kabulü değildir.

MQ-07 (lider) öğretim metnini, MQ-04 (çapraz) terminal koruma şartını, MQ-12 test kapsamını, MQ-13 modül/yükleme ve repo sürekliliğini takip eder; MQ-00 nihai kabulü **AÇIK** bırakır. `tests/tutorial-installation-batch-h-v11920.test.cjs` dört Node test tanımı içerir: müfredat/kapsam, 16 devrenin bileşen-kablo-adım değişmezliği, konuya göre kablo sayıları ve yükleme zinciri. Testler kaynak depoya işlendi ancak mevcut ortamda gerçek GitHub HEAD dosyalarıyla Node koşturma kanıtı alınamadı; dolayısıyla **TEST PASS, elektriksel anahtar durumları ve 16/16 simülasyon kabulü verilmez**. Anahtarların dört olası konumu, ara vaviyen çaprazlama, buton bas/bırak ve sanal zil davranışı gerçek solver çalışmasıyla ayrıca doğrulanmalıdır. Gerçek Windows/Edge görsel kabulü de açıktır. GitHub Actions çalıştırılmadı; commitler `[skip ci]`.


## 2026-10-10 — Batch I, kontrol ve analog loop (kaynak kod ilerleme, kabul açık)

`dist/tutorial-next-batch-i.js` ile 4 kumanda kombinasyonu, 4 adet 4–20 mA loop, 4 loop-powered ve 4 aktif/pasif örneği için ayrı amaç, görev ve konu sorusu yazıldı. Kablolar, komponentler ve guided steps kasıtlı olarak değiştirilmedi. `tests/tutorial-next-batch-i-v11920.test.cjs` Node regresyonu eklendi; **bu oturumda gerçek Node testi ve elektriksel solver çalışma kanıtı elde edilemedi**. Bu nedenle henüz PASS veya MQ-00 DONE değil; gerçek simülasyon, terminal geometri, Windows file launch ve pedagojik kabul açıklığı sürüyor. İlgili lider MQ-07; çapraz MQ-04/MQ-05, test MQ-12, repo MQ-13, nihai MQ-00. Kod kapsamı 104/1655, henüz rich olmayan 1551. GitHub Actions çalıştırılmadı; commit `[skip ci]`.


## 2026-10-10 — Batch J, sensör dersleri

4 PNP/NPN + 4 endüktif/kapasitif + 4 source/sink + 4 open-collector kaynak dersine kanonik devreye dokunmayan amaç, adım ve soru eklendi. Rich kod hedefi 120/1655; 1535 ders hâlâ eski formatta. MQ-07 lider, MQ-04 çapraz terminal kontrol, MQ-05 elektriksel simülasyon, MQ-12 test, MQ-13 GitHub süreklilik ve MQ-00 son kabul zinciri geçerlidir. `tests/tutorial-sensor-batch-j-v11920.test.cjs` eklendi ancak Node/gerçek solver çalıştırıldığına dair kanıt yoktur. Özellikle PNP/NPN farklı sensör modelindeki algılama, NC/NO ve açık kolektör durumları doğrulanmadığı için simulationAcceptance=false ve visualAcceptance=false korunur. Actions kullanılmadı, `[skip ci]`.


## 2026-10-10 — Batch K BERO ve motor kumanda kod kapsamı

BERO 4, motor ileri/geri 4, yıldız/üçgen 4 (toplam 12) dersin mevcut komponent, bağlantı ve terminal adımları değiştirilmeden konuya özel sanal öğrenme hedefleri ve sorular eklendi. Kod kapsamı 132/1655; kalan 1523. MQ-07 lider, MQ-04/MQ-05 çapraz inceleme, MQ-12 test, MQ-13 süreklilik ve MQ-00 son karar. `tests/tutorial-motor-batch-k-v11920.test.cjs` iki Node test tanımı içerir ancak **Node ve solver bu turda çalıştırılmadı**. Kontaktör kilitleme, faz sırası ve yıldız-üçgen geçişi gerçek simülasyonda doğrulanmadı; görsel ve simülasyon kabulü false. Geliştirme tamamlandı etiketi yalnız kod kapsamını belirtir. GitHub Actions kullanılmadı; commit `[skip ci]`.


## 2026-10-10 — Batch L, Dual-DC (kod tamamlandı; test kabulü açık)

İki izole DC, ortak referans, kuru kontakla izolasyon ve NPN ile G2 yük kontrolünden oluşan 4 canonical dersin bileşen, bağlantı ve guided step kayıtları değiştirilmeden zenginleştirildi. `tests/tutorial-dual-dc-batch-l-v11920.test.cjs` iki Node test tanımı eklendi. Kapsam 136/1655, kalan 1519. MQ-07 lider, MQ-04/MQ-05 çapraz, MQ-12 regresyon, MQ-13 süreklilik, MQ-00 kabul. GitHub yerel klonlaması DNS hatasıyla bloklandı; **H–L son HEAD Node suite, elektriksel solver, Windows Edge görsel acceptance RUN/PASS değildir**. Yalnız mevcut kaynak ve loader bağımlılıkları gözden geçirildi. Testler ayrı koşulmadıkça simulationAcceptance=false/visualAcceptance=false. Actions kullanılmadı; `[skip ci]`.


## 2026-10-10 — H–L gerçek regresyon kapısı ve motor elektriksel kilit denetimi

**MQ-00: OPEN / TEST DEFINED, NOT EXECUTED.** Son `main` kaynağındaki `motorForwardReverseCircuit` ve `motorStarDeltaCircuit` gözle incelendi: STOP iki yönün önünde; ileri/geri birbirinin NC yardımcı kontak kilidine bağlı; ileri ana güç U/V/W, geri ana güçte iki faz yer değiştiriyor. Otomatik yıldız/üçgen devresinde zaman NC/NO, K2/K3 çapraz NC kilitleri, yıldız ortak üç çıkış ve üçgen W2/U2/V2 faz eşleşmeleri tanımlıdır. Bu **kaynak denetimi**, solver davranışını ispatlamaz.

`tests/tutorial-motor-physical-regression-v11920.test.cjs` dört test ekler: 4 ileri/geri kablo/stop/interlock/faz eşleşmesi, 3 otomatik yıldız-üçgen interlock/geçiş güç bağlantısı, 4 ileri/geri rest-state solver, 4 yıldız/üçgen rest-state solver. **H–L mevcut Node testleri ve bu dört yeni test güncel HEAD için çalıştırılmadı**, hiçbirine PASS verilmedi. Geri-yön motor dönüşü, START/STOP, mühürleme, faz geçişi, K2/K3 eşzamanlı kapama ve fiziki Windows/Edge görünümü halen açık. Kaynakta kanıtlanmış elektriksel kök neden bulunmadan kilitli devre bağlantıları değiştirilmedi. MQ-07 öğretim, MQ-05 elektrik, MQ-04 terminal çapraz doğrulama, MQ-12 test, MQ-13 repo, MQ-00 kararı. Actions çalıştırılmadı; `[skip ci]`.


## 2026-10-10 — Motor canlı sekans QA girişimi (Actions yok)

Node v22.16.0 ve Git v2.47.3 yerel ortamda kullanılabilir; ancak `git ls-remote https://github.com/uysalayhan23/DevreTasarimStudyo.git HEAD` DNS `Could not resolve host: github.com` döndürdü. Bu nedenle güncel GitHub HEAD'in tam çalışma kopyası çekilip Node ile H–L/motor testleri yürütülemedi. GitHub bağlayıcısından kaynak okunarak test kapsamı genişletildi: `tests/tutorial-motor-physical-regression-v11920.test.cjs` artık **6 test tanımı** içerir; yeni iki test `Simulation.solve` ile ileri→mühürleme→STOP→geri ve yıldız→zaman sınırı→üçgen→STOP dizilerinde karşıt bobinlerin eşzamanlı `_active` olmamasını/shortCircuit olmamasını denetlemeyi amaçlar. Bu testler **henüz çalışmadı, PASS değil**. Güncel kodda kanıtlanmış kök neden olmadan kilitli motor wiring veya runtime değiştirilmedi. MQ-05 lider, MQ-04 çapraz, MQ-12 test, MQ-13 repo ve MQ-00 kalite kapısı OPEN. `Actions` tetiklenmedi, `[skip ci]`.


## 2026-10-10 — Actions onaylı ilk canlı regresyon kanıtı

Kullanıcının bu oturumda verdiği açık Actions izniyle `motor-qa-once.yml` özel `main` test workflow'u çalıştırıldı. Run 38070814263: 18 test, 15 PASS / 3 FAIL; üç hata Batch J sensör BN terminal yönünü yanlış denetleyen koşuldan kaynaklandı. `dist/tutorial-sensor-batch-j.js` denetimi gerçek canonical `g1/P → s/BN` yönüne düzeltildi; commit `2a83b7e`. Run **38070861990**, `main` SHA `84023be5185ee312fa8ab38567807377d34d6843`: **18/18 PASS, 0 FAIL**. Link: https://github.com/uysalayhan23/DevreTasarimStudyo/actions/runs/38070861990 . H–L kaynak değişmezliği ve motorun mevcut kontrol/regresyon testleri başarıyla yürütüldü. Bu başarı tüm durum kombinasyonlarının fiziksel kesinliğini, Windows görsel QA'sını veya kapsam dışı tam suite'i kapsamaz; MQ-00 son sistem kabulü hâlâ açık. Bu kayıt commit'i `[skip ci]` kullanır; tekrar Actions tetiklemez.


## 2026-10-10 — MQ-00 H–L post-PASS statik / Windows görsel kapsam denetimi

**Korunan regresyon kanıtı:** Actions run 38070861990, commit 84023be5, 18/18 PASS; yeni Actions tetiklenmedi. Sonraki dokümantasyon ve regresyon-koruma değişiklikleri için tekrar Node veya görüntü PASS iddia edilmez.

**İncelenen kod:** `BASLAT.bat`, `scripts/browser-visual-v11920.cjs`, `dist/tutorial-mode.js`, H–L lazy modülleri. Başlatıcı `file:///.../dist/index.html` ile dosya açıyor, localhost başlatıcısı eklenmedi. Mevcut Chromium browser-visual script'i test amaçlı geçici HTTP sunucusu açıp dört genel yüzeyin (dashboard, editör, pano, öğretici konu ana sayfası) geometrisini ve ekran görüntüsünü denetler. Bu test *Windows file launcher* veya H–L derslerinin tek tek render, probe, motor zaman serisi, gövde/terminal gerçek ölçeği ve öğretim kabulü yerine geçmez.

**MQ-12 kapsam testi:** `tests/tutorial-hl-visual-contract-v11920.test.cjs` eklendi: file launcher sözleşmesi, browser test kapsam sınırı ve H–L yükleme sırası. Bu yeni test bu oturumda **çalıştırılmadı**, PASS verilmez. MQ-13 dosyaların `main` dalında bulunmasını sağlar; MQ-00 gerçek Windows/Edge file launch, 136 rich dersin tek tek pedagojik görsel denetimi ve kapsam dışı elektriksel geçiş senaryolarını **OPEN** tutar. Kaynakta kanıtlanmış yeni runtime hatası görülmediğinden canonical/simülasyon devre bağlantılarına müdahale edilmedi. Tüm commitler `[skip ci]`, Actions sıfır yeni run.


## 2026-10-10 — H–L 64 ders ayrı acceptance gate (Actions'sız)

Korunan başarılı kanıt: GitHub Actions run **38070861990**, commit **84023be5**, **18/18 PASS**. Bu önceki sonuç yeni HEAD üzerindeki diğer testlerin de geçtiğini kanıtlamaz. H–L kapsamı 16+16+16+12+4 = **64 ders**. `tests/tutorial-hl-64-lesson-acceptance-v11920.test.cjs` yeni üç Node test tanımı içerir: tüm 64 dersin öğretim içeriği, komponent/kablo/adım terminal eşleşmeleri ve false kalan görsel/simülasyon acceptance bayrakları; 64 projede `Simulation.solve` başlangıç durumunda kısa devre/blocked kontrolü; öğreticide ders açma, açıklama/quiz ve lazy-load zinciri. **Bu üç test henüz çalıştırılmamıştır**. Eklenen regresyon, gerçek tarayıcı ekran görüntüsünün veya Windows Edge `file:///` başlatma kabulünün yerini tutmaz. Genel `scripts/browser-visual-v11920.cjs` yalnız dashboard/editor/panel/tutorial hub ekranlarını kapsar; 64 ayrı dersin gerçek görsel QA'sı açık kalır. MQ-07 pedagog, MQ-05 simülasyon, MQ-04 terminal kontrol, MQ-12 test, MQ-13 sürüm bütünlüğü rollerinde kod kanıtı izlenir; **MQ-00 genel kabul OPEN**. Bu aşamada kanıtlanmış yeni runtime kök nedeni görülmedi, kanonik kablolar değiştirilmedi. Bu değişiklik için Actions yeniden çalıştırılmadı, `[skip ci]`.


## 2026-10-10 — H–L 64 ders benzersizlik / görsel QA kapısı (Actions'sız)

`main` başındaki 18/18 PASS kanıtı: run 38070861990, test edilen SHA 84023be5; bu başarı yeni HEAD üzerinde testlerin çalıştığını kanıtlamaz. Yerel Node 22.16.0 mevcut fakat `git ls-remote` GitHub DNS erişimi veremediği için tam repo/solver çalışma kopyası kurulamadı. Yeni 64 ders kabul testinin kaynak denetiminde **başlıkta benzersizlik istenmesine rağmen projenin benzersiz ID kontrolü eksikti**; `tests/tutorial-hl-64-lesson-acceptance-v11920.test.cjs` içine 64 benzersiz ders kimliği, 64 benzersiz proje kimliği ve wire/step eşleşmesinde tekrar eksikliği kontrolleri eklendi. Commit `6dee6de4`, `[skip ci]`.

MQ-07/MQ-04: ders adımları ve 64 canonical proje kimliği için doğrulama kodu mevcut. MQ-05/MQ-12: 64 proje başlangıç `Simulation.solve` testi yazılmış fakat **bu yeni testte fiili RUN/PASS yok**; durum kombinasyonları, buton ve motor geçişlerinin tamamı doğrulanmış sayılamaz. MQ-10: tarayıcı görsel smoke dashboard/pano/editör/öğretici hub ile sınırlı; 64 dersin tek tek screenshot, fiziksel prob etkileşimi ve Windows Edge `file:///` kabul kanıtı mevcut değil. MQ-13 repo dosyaları güncellendi. **MQ-00 FINAL OPEN**. Bu turda hiçbir Actions run tetiklenmedi, uygulama canonical/simulation kaynakları değiştirilmedi.


## 2026-10-10 — H–L 64 ders ekran bazlı gerçek tarayıcı test tasarımı

`script/browser-visual-v11920.cjs` ana smoke testine dokunmadan ayrı `scripts/browser-visual-hl-v11920.cjs` eklendi: Chromium/CDP tabanlı kontrol, 64 H–L dersi sırayla `data-tutorial-open` üzerinden açmak, gerçek `tutorialLesson.id` doğrulamak, görünür viewport/SVG içerik sayısı, devre bileşenleri/kablolar, kullanıcı gizlemişse yeniden açılan öğretici panel, öğretici metninin görünürlüğü ve 64 ayrı PNG ekran görüntüsü ile JSON raporunun `build/browser-visual-hl` içinde saklanmasını hedefler. Otomatik açılış ve iç içe yükleme sırası kaynakta incelendi; bu kodun gerçek Chromium çalıştırması ve JSON/PNG artefaktları **henüz mevcut değil**, dolayısıyla gerçek görsel PASS verilmez. Ayrıca `Simulation.solve` için yazılmış 64 ders başlangıç testi ayrı Node testi olup, tüm switch geçişleri veya fiziksel akım yönlerini kapsamaz. MQ-10/MQ-07/MQ-05/MQ-12 kabul kapıları OPEN, MQ-13 dosya/commit kontrolü var, **MQ-00 OPEN**. Eski Actions 18/18 PASS run 38070861990 korunur; bu turda Actions çalıştırılmadı. Tüm commitlerde `[skip ci]`.


## 2026-10-10 — H–L Chromium görsel testi: kaynakta kanıtlanan iki API hatası

64 derslik Chromium testi `scripts/browser-visual-hl-v11920.cjs` incelendi. İlk sürüm tüm dersler için dashboard'da `[data-tutorial-open]` düğmesi arıyordu; filtre/sayfalama durumunda bir dersin listede olmaması yanlış test FAIL doğurabilir. Ayrıca `window.DTSTutorialBootstrap.ensure()` bulunmayan bir API çağrısıydı. Doğrudan uygulamanın mevcut `DTSTutorialMode.open(id)` ve `openHub()` API'leri kullanılarak iki test-script hatası giderildi (commit `e64051e`). **Uygulama canonical projeleri, devre bağlantıları ve motor solver değiştirilmedi.** Yerel Node ve `/usr/bin/chromium` bulundu, ancak `git ls-remote` DNS çözümleyemedi; tam GitHub kaynaklarını yerel çalışma alanına çekmeden ekran/simülasyon çalıştırmak mümkün olmadı. Bu nedenle 64 dersin PNG ve tarayıcı kabul raporları oluşturulmuş değildir; **MQ-00 OPEN**. Önceki Actions run `38070861990` üzerindeki 18/18 PASS yalnız o SHA için geçerlidir. Yeni Actions çalıştırılmadı, commit `[skip ci]`.


## 2026-10-10 — H–L Chromium script gerçek sözdizimi hatası ve Actions'sız kanıt

`main` üzerindeki `scripts/browser-visual-hl-v11920.cjs` kontrolünde iki kod dışı literal `\\n` tespit edildi (Chromium turunun `{` başlangıcı ile sayaçtan sonraki `}`); bunlar Node sözdizimi hatası oluşturuyordu. GitHub commit `359c30f` ile gerçek satır sonlarına dönüştürüldü. Düzeltilmiş içeriğin shebang satırı hariç JavaScript parser `new Function(...)` ile **sözdizimi PASS** sonucu elde edildi; bu yalnız parser kanıtıdır, Node/CDP runtime PASS değildir. Ortamda Node v22.16.0 ve `/usr/bin/chromium` bulunuyor, fakat `git ls-remote` GitHub DNS çözemiyor; tam dist checkout olmadan tarayıcı testi yürütülmedi, 64 PNG/JSON kanıtı üretilmedi. Önceki H–L 18/18 PASS Actions run `38070861990` değişmeden korunuyor. MQ-12 kaynak sözdizimi kontrolü PASS, MQ-10 gerçek tarayıcı kabulü OPEN, MQ-05 canlı simülasyon kabulü OPEN ve **MQ-00 FINAL OPEN**. Kullanıcı talimatına göre yeni Actions çalıştırılmadı. `[skip ci]`.


## 2026-10-10 — 64 H–L tarayıcı açılışı: deterministik hazır olma kontrolü

Chromium audit betiği uygulamanın `DTSTutorialMode.open(id)`, `DTSTutorialMode.openHub()` API'leri, `#tutorialCoach`, `#tutorialCoachReopen`, `#workspace`, `#viewport` ve `tutorialLesson.id` alanlarıyla çapraz denetlendi. Ders sonrasında yalnız 160 ms bekleme kullanılması geç render durumunda sahte FAIL olasılığı oluşturuyordu. `scripts/browser-visual-hl-v11920.cjs` artık ID, viewport ve SVG hazır olmasını en fazla 40 x 100 ms poll ederek doğrular; commit `e4e7f14` (`[skip ci]`). GitHub'dan yeniden okunan güncel betiğin shebang sonrası JS parse kontrolü **PASS**. Yerel `node -v` 22.16.0; Chromium `/usr/bin/chromium` mevcut, fakat `git ls-remote` erişiminde **Could not resolve host: github.com**; tam uygulama dist dosyaları olmadan gerçek browser execution yapılmadı. **64/64 screenshot PASS değil, 64 ders simülasyon kabulü de OPEN**. Geçmiş bağımsız Actions run 38070861990 18/18 PASS korunur; yeni Actions çalıştırılmadı. MQ-12 parser PASS, MQ-10 browser OPEN, MQ-05 simulation OPEN, MQ-00 FINAL OPEN.


## 2026-10-10 — H–L Chromium hata kanıtı saklama (MQ-00)

`script/browser-visual-hl-v11920.cjs` incelendi: öğretici panel metni yetersiz olunca `assert()` ekran görüntüsü alınmadan devreyi kesiyordu ve `report.json` yalnız tam başarı durumunda yazılıyordu. `scripts/browser-visual-hl-v11920.cjs` dosyasında her dersin PNG kaydı panel assert'ından önceye alındı, exception halinde `report.failure.message/stack` ve başarılı önceki ders kayıtlarını içeren `build/browser-visual-hl/report.json` yazımı eklendi (commit `3418d55`). Bağlayıcı üzerinden güncel dosya tekrar okundu; JavaScript parser **PASS**, hata yakalama ve PNG sırası statik olarak doğrulandı. Gerçek Node 22.16.0 ve Chromium `/usr/bin/chromium` var ancak `git ls-remote https://github.com/uysalayhan23/DevreTasarimStudyo.git HEAD` hâlen `Could not resolve host: github.com`; tam checkout yok, 64 gerçek ekran testi çalıştırılmadı. Önceki bağımsız H–L 18/18 PASS run 38070861990 korundu. MQ-12 statik syntax PASS; MQ-10 gerçek görsel QA **OPEN**, MQ-05 dinamik simülasyon **OPEN**, **MQ-00 FINAL OPEN**. Actions çalıştırılmadı; `[skip ci]`.


## 2026-10-10 — H–L öğretici panel etkileşimleri (16 konu x 4 ders)

`dist/tutorial-mode.js` içindeki gerçek seçiciler `.tutorial-float-bar`, `[data-tutorial-coach-minimize]`, `#tutorialCoachReopen`, `#tutorialCoach` ve pointerdown/move/up handlerları çapraz incelendi. `scripts/browser-visual-hl-v11920.cjs` üzerinde her 16 konunun ilk dersinde küçültme, büyütme, pointer sürükleme, kapatma ve yeniden açma kontrolleri eklendi; tüm 64 dersin screenshot/coach kontrolleri korunur. Commit `e5bedc3` `[skip ci]`. Güncel betik GitHub'dan tekrar okunarak JS parser kontrolünden **PASS** aldı. Test yazımı gerçek Chromium etkileşimi/64 PNG çalıştırması demek değildir: DNS engeli nedeniyle repo yerel Chromium ortamına çekilemedi. Önceki Actions 18/18 PASS run `38070861990` yalnız eski SHA kanıtıdır. MQ-12 parser PASS; MQ-10 panel gerçek browser/PNG **OPEN**; MQ-05 solver genel kabul **OPEN**; MQ-00 **FINAL OPEN**. Yeni Actions çalıştırılmadı.


## 2026-10-10 — H–L panel drag gerçek fare protokolü denetimi

MQ-04/MQ-10 kaynak çapraz kontrolü, `dist/tutorial-mode.js` içinde `pointerdown` sonrası `.tutorial-float-bar.setPointerCapture(pointerId)` kullanıldığını, önceki 64 ders Chromium testinin ise `new PointerEvent` sentetik olaylarında kaydı olmayan pointerId=71 ürettiğini gösterdi. Bu yöntem gerçek CDP mouse yerine pointer capture reddi veya sahte FAIL oluşturabilir. `scripts/browser-visual-hl-v11920.cjs` içinde küçültme/büyütme DOM kontrolleri korunup sürükleme `Input.dispatchMouseEvent` gerçek Chromium mouseMoved/mousePressed/mouseMoved/buttons=1/mouseReleased dizisine taşındı; sonrasında panelin yer değiştirmesi, kapatılması ve yeniden açılması doğrulanır (commit `71daaa7`, `[skip ci]`). Güncel kaynak GitHub'dan tekrar okunarak JavaScript parser kontrolü **PASS**; gerçek Chromium çalıştırması yapılmadığından panel davranışı **PASS iddia edilmez**. Screenshot raporlama ve önceki Actions run `38070861990` 18/18 PASS kanıtı korunur. MQ-12 source syntax PASS, MQ-10 canlı panel QA OPEN, MQ-05 simülasyon QA OPEN, MQ-00 FINAL OPEN. Bu turda GitHub Actions tetiklenmedi.


## 2026-10-10 — H–L panel sınırları ve etkileşim kanıtı

64 derslik `scripts/browser-visual-hl-v11920.cjs` üzerinde CDP mouse sürüklemesinden sonra panelin viewport sınırları daha önce denetlenmiyordu. Her 16 konunun ilk dersinde `r.left >= 7`, `r.top >= 57`, `r.right <= innerWidth+1`, `r.top <= innerHeight-48+1` sınır kontrolleri ve sürükleme/kapatma/açma sonunda ayrı `hl-panel-<id>.png` ekran görüntüsü eklendi (commit `a5ec387`, `[skip ci]`). Güncel GitHub kaynağı tekrar okunarak shebang çıkarılmış JavaScript parser **PASS**, screenshot ve bounded check yerleşimi statik olarak doğrulandı. Gerçek Chromium çalıştırması ve screenshot dosyaları mevcut değildir; tarayıcıda panel boyutu/fiziksel kullanıcı QA'sı PASS sayılamaz. Geçmiş 18/18 PASS run 38070861990 korunur, Actions çalıştırılmadı. MQ-10 / MQ-05 / MQ-00 **OPEN**.


## 2026-10-10 — H–L Chromium dört köşe, panel yüksekliği ve screenshot hata kaydı

`script/browser-visual-hl-v11920.cjs` gözden geçirildi: önceki bounded testi `r.top` sınırını tekrar kullanıyor, gerçek alt kenarı `r.bottom` ile doğrulamıyordu; ayrıca yalnız tek yönde sürükleme deneniyordu. `scripts/browser-visual-hl-v11920.cjs` içinde her konu grubunun ilk dersine CDP mouse üzerinden dört köşe sürükleme uç noktaları, her deneme sonunda `left/top/right/bottom` sınır ve boyut raporu, `r.bottom <= innerHeight+1` kontrolü eklendi (commit `70ad85d`). Küçültülmüş ve geri büyütülmüş gerçek DOM yükseklikleri karşılaştırılıp `minimizedHeight < restoredHeight` şartı eklendi (commit `d84b91a`). Screenshot CDP hataları dosya adıyla birlikte throw edildiğinden mevcut `catch` kısmi JSON raporunda hangi görselin başarısız olduğunu saklayabilir. Güncel dosya tekrar okunarak JavaScript sözdizimi **PASS**; gerçek CDP/Chromium uygulama çalıştırması yapılmadı, dört köşe/64 ders görsel PASS iddia edilmez. Eski run 38070861990 18/18 PASS kanıtı korunur. MQ-12 statik PASS; MQ-10 canlı Chromium OPEN; MQ-05 simülasyon OPEN; **MQ-00 FINAL OPEN**. Actions sıfır, commitler `[skip ci]`.


## 2026-10-10 — H–L dört köşe CDP hedefleri ve başarısızlık ekran görüntüsü

`main` Chromium kaynağında köşe stres testi ±5000 piksel gibi viewport dışındaki CDP fare hedeflerini kullanıyordu. Gerçek görünür mouse move ile uyumlu olması için köşeler `(1,1)`, `(viewport.width-2,1)`, `(1,viewport.height-2)` ve `(viewport.width-2,viewport.height-2)` olarak değiştirildi. Köşe sınır assert'ı başarısız olduğunda PNG kanıtı kaybolmasın diye `hl-corners-<id>.png` screenshot ve referansı assert öncesine taşındı; mevcut kısmi JSON hata yakalama korunur (commit `10103c6`, `[skip ci]`). GitHub'dan yeni içerik okunarak shebang harici JS parser **PASS** ve screenshot/assert sırası statik doğrulandı. Bu bir gerçek Chromium/64 ders/Windows PASS değildir. Eski 18/18 PASS yalnız önceki Actions run `38070861990` kanıtıdır. MQ-10 gerçek tarayıcı ve MQ-05 solver canlı kabul **OPEN**, MQ-00 **FINAL OPEN**. Bu turda Actions çalıştırılmadı.


## 2026-10-10 — H–L gerçek panel taşması + PNG/konum kontratı

Kaynak denetiminde `dist/tutorial-mode.js` içindeki `applyCoachUi()` fonksiyonunun panel üst sınırını `(innerHeight-48)` ile sınırladığı doğrulandı. Tam boy panel için yükseklik çıkarılmadığından yüklenmiş/saklanmış bir alt konum, panelin altını ekran dışına taşırabiliyordu. Sınır gerçek panel yüksekliği (küçültülmüş durum 44 piksel) dikkate alınarak düzeltildi: commit `890c1f5` `[skip ci]`. 64 derslik Chromium betiğinde PNG denetimi tam PNG başlangıç imzasını, IHDR ve IEND işaretini doğrulayacak şekilde genişletildi; dört köşe kontrolü yalnız bounding-box içinde olmayı değil hedeflenen yatay/dikey kenara ulaşmayı da kapsar: commit `d7162f4` ve alt köşe koşulu düzeltmesi `76548a0`, `[skip ci]`. Bu kontroller ekran görüntüsünün anlamsal kalite denetimi veya CRC doğrulaması değildir. Güncel hem `dist/tutorial-mode.js` hem `scripts/browser-visual-hl-v11920.cjs` JS parser ile **PASS**; gerçek Chromium/ders ekranı/PNG oluşturma/simülasyon çalıştırması **yapılmadı**. Önceki Actions run 38070861990 18/18 PASS aynen korunur; yeni Actions sıfır. MQ-04 source defect FIXED; MQ-12 parser PASS; MQ-10 browser ve MQ-05 solver canlı kabul OPEN; **MQ-00 FINAL OPEN**.


## 2026-10-10 — H–L responsive panel / screenshot ve rapor denetimi

16 konu ilk dersinde dört köşe sürükleme ve restore/reopen testlerine ek olarak CDP `Emulation.setDeviceMetricsOverride` ile **760×640** pencere emülasyonu getirildi. Panel **normal** ve **küçültülmüş** durumda `left/top/right/bottom` ekran sınırı kontrolünden geçmek zorundadır; `finally` içinde temel 1440×1000 viewport geri yüklenir. Mevcut PNG başlık/IHDR/IEND kontrolü, 64 derslik ekran görüntüleri, başarısızlık öncesi ayrı köşe/panel PNG'leri ve kısmi `report.json` kaydı korundu. Kaynak commit `3f9bd28` `[skip ci]`; tekrar okunan JavaScript parser sonucu **PASS**. Bu kayıt yalnız kaynak/sözdizimi delilidir; gerçek Chromium yürütmesi, PNG/JSON dosyaları ve canlı 64 ders QA'sı henüz yoktur. Önceki 18/18 PASS run 38070861990 korunuyor. Actions çalıştırılmadı. MQ-12 parser PASS; MQ-10 gerçek tarayıcı OPEN; MQ-05 canlı simülasyon OPEN; **MQ-00 FINAL OPEN**.


## 2026-10-10 — Responsive küçültme sonrasında panel konumunun tekrar sınırlandırılması

Kaynak API denetimi: `dist/tutorial-mode.js` içindeki `toggleCoachMinimize()` yalnız panel tekrar büyütülürken `applyCoachUi(coach)` çağırıyordu; küçültülmüş panelin konumunun ekran değişikliği sonrası yeniden clamp edilmesi garanti değildi. `applyCoachUi` artık her iki (küçültme ve geri büyütme) durumundan sonra uygulanır; commit `4f693c0` (`[skip ci]`). Güncel değiştirilmiş JavaScript gövdesi `new Function(...)` ile sözdizim denetiminden geçti. İlgili 64 derslik Chromium betiğinde 760×640 responsive sınır denetimi, dört köşe CDP mouse kontrolleri, PNG imzası/IHDR/IEND denetimi ve hata halinde kısmi JSON raporlama tanımlı; bunlar **canlı browser PASS kanıtı değildir**. Yerel Node v22.16.0 ve `/usr/bin/chromium` mevcut; bu oturumda `git ls-remote` `Could not resolve host: github.com` sonucu verdiği için uygulama tam checkout edilip gerçek tarayıcıda çalıştırılamadı. **MQ-12 kaynak sözdizimi PASS; MQ-10 canlı görsel/PNG OPEN; MQ-05 canlı simülasyon OPEN; MQ-00 FINAL OPEN.** Önceki 18/18 PASS run 38070861990 korunuyor; Actions çalıştırılmadı.


## 2026-10-10 — Responsive panel kaynak fonksiyonu çalıştırmalı regresyon

GitHub `main` kaynağından `applyCoachUi(coach)` fonksiyonu yalıtılarak gerçek JavaScript değerlendirmesiyle 1440×1000, 760×640 ve 400×320 viewport'larında, her biri normal/küçültülmüş panel olmak üzere 6 senaryo çalıştırıldı. **Önce:** 400×320 normal panelde top=58, height=304; alt kenar 362 ve viewport 320 → **FAIL**. Nedeni `height` sınırında üstteki 58px başlık alanının hesaba katılmamasıydı. **Düzeltme:** yükseklik üst sınırı `innerHeight-66` olarak değiştirildi (commit `697fde4`, `[skip ci]`). **Sonra:** 6/6 kaynak fonksiyonu geometri denetimi PASS; 400×320 normal panel artık left=8/top=58/width=384/height=254 ve alt=312 ile ekran içinde. Bunlar mocked root/DOM style ile yürütülen gerçek JS fonksiyonu geometri denetimleridir, canlı Chromium screenshots/64 ders PASS değildir. Chromium QA'da dört köşe, küçük/normal panel, PNG IHDR/IEND, kısmi JSON hata raporu kaynak kontrolleri devam ediyor. Önceki 18/18 PASS Actions run 38070861990 korunur; bu turda Actions tetiklenmedi. MQ-12 geometri kaynağı 6/6 PASS; MQ-10 görsel ve MQ-05 canlı simülasyon OPEN; MQ-00 FINAL OPEN.
