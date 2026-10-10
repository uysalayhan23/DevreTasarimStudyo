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
