# Öğretici müfredatı — 1.655 derslik konu-bazlı kalite matrisi

**10 Ekim 2026 · GitHub main gerçek müfredat üretici zinciri.** Bu rapor 43 kategori ve 1.655 dersin durumunu repo verisinden otomatik toplar. `rich-reference-v1` etiketi kod şablon kapsamıdır; kullanıcı görsel/Windows ve pedagojik son kabulü değildir.

Kod kapsamı: **88/1655**, henüz zengin kod formatına yükseltilmemiş: **1567**. Bunların içinde 45/45 elektriksel ölçme dersi rich kod olarak kayıtlı; 10/10 Doğru akım dersi de rich. Çok sayıda sıradan quiz/wiring başlığı hâlen detaylı uygulama ve gerçek devre tasarımı bekliyor.

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
| `control-combinations` | 4 | 0 | 4 | 4 | 0 | 0 | Start/Stop mühürleme |
| `loop-420` | 4 | 0 | 4 | 4 | 0 | 0 | 2 telli transmitter + ampermetre |
| `loop-powered` | 4 | 0 | 4 | 4 | 0 | 0 | İki telli loop-powered transmitter |
| `active-passive` | 4 | 0 | 4 | 4 | 0 | 0 | Harici beslemeli pasif loop |
| `pnp-npn` | 4 | 0 | 4 | 4 | 0 | 0 | PNP sensör → 0 V’a bağlı yük |
| `inductive-capacitive` | 4 | 0 | 4 | 4 | 0 | 0 | PNP endüktif metal algılama |
| `source-sink` | 4 | 0 | 4 | 4 | 0 | 0 | Sourcing PNP çıkış |
| `open-collector` | 4 | 0 | 4 | 4 | 0 | 0 | NPN open collector yük sürme |
| `bero` | 4 | 0 | 4 | 4 | 0 | 0 | BERO tipi PNP endüktif yaklaşım |
| `motor-forward-reverse` | 4 | 0 | 4 | 4 | 0 | 0 | İleri/geri · çapraz elektriksel kilitleme |
| `motor-star-delta` | 4 | 0 | 4 | 4 | 0 | 0 | Manuel yıldız/üçgen paket şalter |
| `dual-dc` | 4 | 0 | 4 | 4 | 0 | 0 | İki tamamen izole DC devre |

**Yeni doğrulanmış kod kapsamı:** 45 elektriksel ölçme + 10 doğru akım + 5 buton/LED + 4 buton/röle + 4 mühürleme + 4 zaman rölesi = **72 ders**. Son 13 kontrol dersi için özgün kablo dizileri birebir korundu ve konuya özel açıklama ile soru eklendi. Başlıkların görsel/Windows ve kullanıcı pedagojik kabulü açık kalır. Zaman rölesi 4/4 sanal titreşim modelleri 1/1, 0,5/1,5 ve 1,5/0,5 saniye olarak düzeltildi. Sıradaki konular tesisat anahtar devreleri, güvenli sanal zil ve 4–20 mA, ardından motor kumanda senaryolarıdır.

**Kabul uyarısı:** Bir derse yalnız `designStandard` eklemek kabul değildir. Gerçek devre, görsel, ölçüm/model kaynağı, uygulama adımı ve çocukların anlayacağı neden-sonuç açıklaması mevcut değilse pedagojik DONE sayılmaz. Ders düzeyindeki ekran kabulü ve gerçek donanım ön görünüşü özel QA gerektirir. Üretim GitHub Actions kullanmadan, commitlerde `[skip ci]` kuralıyla yürütülür.


## 2026-10-10 — Batch H, 16 tesisat dersi (kod yükseltmesi; kabul açık)

Komütatör 4/4, vaviyen 4/4, ara vaviyen 4/4 ve zil 4/4 derslerinin kaynak kablo, komponent ve adım tanımları değiştirilmeden `dist/tutorial-installation-batch-h.js` öğretim açıklamaları ve konu kontrolü eklendi. Ders sayısı 1.655; rich kod kapsamı 88/1.655; kalan 1.567. Bu değer yalnız **kod kapsamıdır**, gerçek simülasyon/pedagojik/Windows kabulü değildir.

MQ-07 (lider) öğretim metnini, MQ-04 (çapraz) terminal koruma şartını, MQ-12 test kapsamını, MQ-13 modül/yükleme ve repo sürekliliğini takip eder; MQ-00 nihai kabulü **AÇIK** bırakır. `tests/tutorial-installation-batch-h-v11920.test.cjs` dört Node test tanımı içerir: müfredat/kapsam, 16 devrenin bileşen-kablo-adım değişmezliği, konuya göre kablo sayıları ve yükleme zinciri. Testler kaynak depoya işlendi ancak mevcut ortamda gerçek GitHub HEAD dosyalarıyla Node koşturma kanıtı alınamadı; dolayısıyla **TEST PASS, elektriksel anahtar durumları ve 16/16 simülasyon kabulü verilmez**. Anahtarların dört olası konumu, ara vaviyen çaprazlama, buton bas/bırak ve sanal zil davranışı gerçek solver çalışmasıyla ayrıca doğrulanmalıdır. Gerçek Windows/Edge görsel kabulü de açıktır. GitHub Actions çalıştırılmadı; commitler `[skip ci]`.
