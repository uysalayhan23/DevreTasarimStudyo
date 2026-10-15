# MQ-00 / MQ-07 SC26 — Hall PNP +24 V / röle NO / H1 lamba (2026-10-15)

Repo `uysalayhan23/DevreTasarimStudyo`, dal `main`. **Hedefli izole gerçek kaynak V8 testi PASS; MQ-00 REVIEW (NOT DONE)**.

## Somut bulgu

Özgün 5 bileşen ve 7 sanal bağlantı, doğru PNP röle/lamba topolojisini içerir; ancak Hall ürün katalog ilkesi `sensorPrinciple='magnetic'` iken `CCSSensors.supported()` yalnız indüktif/kapasitif/optik/ultrasonik modelleri tanıdığından sanal magnet hedefi algılanmıyordu. Manyetik algılama modeli etkin olmadığında eski `state=true` manuel durumu enerjiyi tetikleyebiliyordu. Kullanıcı yalnız Hall SC26 manyetik hedefiyle dinamik çalışmayı istedi.

## Hedefli düzeltme

`dist/sensors.js` Hall `magnetic` sensör tipi için algılama desteği ve yalnız `target='magnet'` kabulünü ekler; Hall magnet hedefi için ortografik vektör N/S sürükleme simgesi sağlar. 10 mm menzil ve 6 mm hizalama toleransı **eğitim simülasyonu parametreleridir; gerçek ürün datasheet mesafesi değil**. Sensör hedefi verilmemiş tarihsel Hall örnekleri eski `state` fallback davranışını korur.

`dist/tutorial-pedagogy.js` yalnız `sensor-analog-apps-src-07` için 20 mm uzak varsayılan magnet hedefi, PNP polaritesi, 24 V `arduino-bench-supply` kaynağı ve amaç/öğrenme/test adımlarını doğru kaydeder. Özgün 5 ürün, 7 kablo, 7 adım korunur. Gerçek topoloji: G1 P/M → Hall BN/BU; BK → K1 A1 ve A2 → M; G1 P → K1 NO 13/14 → H1 X1/X2 → G1 M. **Genel DC kaynak modeline müdahale edilmedi**: bu dersteki gerçek `arduino-bench-supply` zaten `dcVoltage=24` ve `0 V` durumlarını özgün çözücüyle karşılar.

## MQ-12 gerçek hedefli test kanıtı

Özgün 949 girişli ürün kataloğu ve `components.js`, güncellenmiş `sensors.js`, `thermal.js`, `device-behavior.js`, `probe-leads.js`, `incremental-encoder.js`, `current-model.js`, özgün `simulation.js` V8 izole koşumda (ilgisi olmayan diğer aygıt modülleri stub) çalıştırıldı.

12/12 senaryo: mıknatıs uzak/yakın/10 mm sınırında/dışında, plastik hedef reddi, kötü hizalama, sensör BN/BU kabloları kopukluğu, BK kopukluğunda Hall algılıyor ama röle/lamba OFF, 0 V ve 12 V sanal kaynakta OFF, H1 yük yolu kopukluğunda bobin ON fakat lamba OFF. Beş aşamalı 20→5→18→7→20 mm döngü doğru; hedef yokken tarihsel manuel state fallback korunur. Müfredat 1.655 olarak yüklendi, yalnız SC26 içeriği değişti.

**Sınırlar:** Ayrı `tests/qa-mq07-sc26-hall-pnp-relay-lamp-v11920.test.cjs` gerçek Node hedefi için eklendi ancak bu oturumda tam Node/Windows `file:///`/UI regresyonu koşulmadı. Gerçek Hall ürün manyetik hassasiyeti, mT, sigorta/bobin bastırma, lamba yük akımı ve fiziksel üretici/ürün güvenlik kabulü yapılmadı. Physical Acceptance false; MQ-00 REVIEW.

Uzman zinciri: MQ-07 → MQ-05/MQ-09 → MQ-12 gerçek kaynak QA → MQ-13 repo sürekliliği → MQ-00 REVIEW. SC11–SC25 ve teknik kilitler korundu. GitHub Actions kullanılmaz, `[skip ci]`. Sıradaki: `sensor-analog-apps-src-08` Piezo sensör uygulaması.
