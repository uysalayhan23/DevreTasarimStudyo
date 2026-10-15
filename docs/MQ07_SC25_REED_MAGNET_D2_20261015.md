# MQ-00 / MQ-07 SC25 — Reed KY-021 magnet / UNO D2 (2026-10-15)

**Kod eklendi / izole V8 hedefli kaynak QA PASS / MQ-00 REVIEW (NOT DONE).** Repo `uysalayhan23/DevreTasarimStudyo`, dal `main`.

## Hata ve düzeltme

Özgün 3 bileşenli / 5 kablolu sanal Reed dersi Arduino UNO D2 dijital okumasını sadece daha önce saklanan `state` alanından hesaplıyordu. Mıknatıs sürgüsünün (reedMagnet 0–100) güncel konumu, eskimiş state ile uyuşmazsa yanlış okuma oluşuyordu. Ayrıca sensör VCC / GND kablosu çıkarıldığında veya masa kaynak gerilimi 0 V yapıldığında Arduino hala HIGH okuyabiliyordu. İzole eski kaynak V8 testinde 80 mıknatıs/stale:false için D2=0, 0 mıknatıs/stale:true için D2=1, kaynağı kesilen stale:true için D2=1 gözlendi.

`dist/arduino-runtime.js` ile `dist/simulation.js` içine yalnız `mq07ReedDigitalModel===true` bayrağı olan `arduino-reed` için özel sayısal model eklendi. Hedef KY-021 materyal görselinde zaten %65 eşik olduğundan bu sanal eşik korunur. ≥65 yakın mıknatıs -> HIGH, diğerleri -> LOW; yalnız 5 V sanal masa kaynağı ve UNO 5V/GND ile aynı elektriksel düğümlerde güç ve şase varsa geçerli. Sensör DO ve UNO D2 farklı elektriksel noktalardır: DO kablosu açık ise sensör HIGH üretebilir fakat D2 girişine bu sinyal ulaşmaz. Gerçek cihaz NC/NO ve pull-up polaritesi modellenmiş sayılmaz.

SC25 dersinin orijinal 3 parça / 5 kablo / 5 adımı korunur. `reedMagnet=0`, `state=false`, `ps.dcVoltage=5`, UNO sketch `digitalRead(2)` ve pedagojik 8 adımlı açıklama güncellendi. Diğer `arduino-reed` örneklerinde opt-in yoksa özgün `state` tabanlı çalışma değişmez.

## MQ-12 denetimi

Özgün Arduino katalog, Arduino örnekleri, incremental-encoder, thermal, device-behavior, current-model; güncel Arduino runtime ve simulation kaynakları V8 izole ortamında çalıştırıldı, ilgisiz cihazlar stub. 13 ayrı mıknatıs/supply/kablo/kilitli-state senaryosu PASS; aynı çalışma projesinde 0→80→20→100→0 mıknatıs geçişleri D2 0→1→0→1→0 PASS; bayraksız eski Reed durumunu koruma kontrolü PASS. Müfredat 1.655 ders olarak yüklenip yalnız `sensor-analog-apps-src-06` değişikliğinin gerçekleştiği karşılaştırıldı.

**Yalnız hedefli izole JS kanıtıdır:** Node `tests/qa-mq07-sc25-reed-magnet-d2-v11920.test.cjs` test kaynağı eklendi ancak tam Node/1.655 ders regresyonu ve Windows `file:///` görsel/etkileşimli testi bu oturumda çalıştırılmadı. Fiziksel ürün datasheet polaritesi, manyetik alan şiddeti, mekanik/elektriksel gerçek kontak zıplaması, pull-up güvenliği veya donanım kalibrasyonu doğrulanmadı. Fiziksel kabul false.

MQ-07 → MQ-05/09 çapraz kaynak → MQ-12 hedefli QA → MQ-13 repo sürekliliği → MQ-00 REVIEW. SC11–SC24, gerçek mm ve ortografik kilitler korundu. Actions çalıştırılmadı; commit `[skip ci]`. Sıradaki kaynak `sensor-analog-apps-src-07` Hall sensör uygulaması.
