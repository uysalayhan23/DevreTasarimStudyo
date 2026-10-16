# MQ-00 → MQ-07 SC32 — Sensör kumanda test devresi (16 Ekim 2026)

**Durum:** Yalnız orijinal JS/V8 yalıtılmış kaynak testi PASS; MQ-00 REVIEW (fiziksel veya tam uygulama kabulü değildir).

## Bulgular ve en dar düzeltme

`sensor-analog-apps-src-13` zaten 949 parçalık gerçek katalogdan `arduino-bench-supply`, `proximity`, `coil-relay`, `contact-no`, `lamp-green` bileşenlerini ve BN/BU/BK/A1/A2/13/14/X1/X2 terminallerini doğru bağlar. Eski başlangıçta sensörde `sensing` alanı olmadığından gerçek metal hedef yakınlık deneyi yerine saklanan `state` manuel durumu kullanılıyordu. Önceden kaynakta çalışan `CCSSensors.detect` ile `CCSSimulation` değiştirilmedi; yalnız SC32 kaynak dersindeki sensöre `sensing={target:'metal',range:4,distance:8,offset:0,face:'right',auto:false}` atandı. 4 mm örnek eğitim eşiğidir ve fiziksel ürün ölçüm veya üretici datasheet menzili değildir. SC32'nin 5 parça / 7 kablo / 7 adım yapısı korunur.

## MQ-12 hedefli kaynak testleri

Orijinal 949 katalog ürünlü `dist/library.js`, katalog uzantıları ve gerçek `probe-leads.js`, `components.js`, `sensors.js`, `thermal.js`, `device-behavior.js`, `incremental-encoder.js`, `instruments.js`, `multimeter.js`, `current-model.js`, `simulation.js` modülleri; ilgisiz sürücü/PLC araçları V8 stub'ları ile izole yürütüldü. Kaynak sensör OFF başlangıç; metal 2 mm ve 4 mm ON; 5 mm OFF; plastik ve yanlış hizalama OFF; BN, BU, BK, K1 A2, yük dönüş yolu kopukluğu ve 0/12 V yanlış beslemeler **14/14 hedef senaryo PASS**. Kablo BK kopuksa B1 algılar ama K1 ve H1 çalışmaz; lamba kablosu kopuksa K1 enerjili kalır ancak H1 OFF olur. Aynı devrede 8→2→5→4→8→0→10→3 mm canlı hareket ve eski targetsız state fallback PASS.

1.655 kaynağın tamamı güncel overlay ile V8 yüklenip başlangıca karşı karşılaştırıldı; yalnız SC32 kaynak dersi değişti. SC11–SC31 ile önceki LDR DC lineer dimmer vs AC triac ayrımı ve golden kurallar değişmedi.

Eklenen `tests/qa-mq07-sc32-inductive-pnp-control-v11920.test.cjs` bağımsız yerel Node çalıştırma içindir. **Tam Node paketi, browser/Windows `file:///` etkileşimli görsel test, doğrulanmış fiziksel manyetik menzil, ürün elektrik akımı veya saha kabulü çalıştırılmadı.** MQ-00 REVIEW; fiziksel kabul `false`.

MQ-07 lider → MQ-05/MQ-09 çapraz → MQ-12 izolasyon test kanıtı → MQ-13 GitHub kaynak kapsamı → MQ-00 REVIEW. Actions çalıştırılmadı, `[skip ci]`. Sıradaki SC33 `sensor-analog-apps-src-14` IR alıcıyla yük kontrolü.
