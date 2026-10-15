# MQ-00 / MQ-07 SC31 — IR sanal verici/alıcı ve PNP röle yük QA (2026-10-15)

**MQ-00 REVIEW / hedefli kaynak simülasyonu PASS, fiziksel DONE değil.** Repo `uysalayhan23/DevreTasarimStudyo`, dal `main`.

## Kök durum

SC31 `sensor-analog-apps-src-12` daha önce 5 parçalı, 7 kablolu, 7 adımlı **VIRTUAL_OPTICAL_SOURCE_ALIGNED** sahneye dönüştürülmüştü. Birleştirilmiş `sensor-through-beam` sanal optik modülü alıcı/vericinin işlevsel eğitim soyutlamasıdır. Devrede +24 V → PNP BN / BU → BK → K1 bobin → K1/13–14 NO → H1 sanal lamba bulunur. **İki ayrı fiziksel IR verici/alıcı ve gerçek optik karakteristik kesinlikle onaylanmadı.**

## Bağımsız hedefli kaynak doğrulaması

İnceleme sırasında `main` zaten SC29 + SC30 `[skip ci]` commit'lerini içeriyordu; bu iki sahneye müdahale edilmedi. Doğrulanmış özgün `dist/library.js` (703 temel gerçek ürün tanımı, hedef 5 ürün bu tabanda mevcut), `components.js`, `sensors.js`, `probe-leads.js`, `thermal.js`, `device-behavior.js`, `incremental-encoder.js`, `instruments.js`, `multimeter.js`, `current-model.js` ve `simulation.js` izole JS V8 ortamında çalıştırıldı. İlgisiz eklentiler stub ile sınırlandı.

10/10 PASS: plastik hedef 80 mm uzakta sensör/K1/H1 OFF; 2 ve 40 mm yakınlıkta ON; 41 mm ve eski `state=true` olsa bile OFF; uygun olmayan sıvı hedef veya 9 mm yanal kaçıklıkta OFF; BN/BU kopukluğunda OFF, BK kopukluğunda sensör algılıyor ama K1/H1 OFF; H1 yük yolu kopukluğunda sensör/K1 ON fakat H1 OFF. Aynı proje ardışık 80→2→75→10→80 mm uzaklıklarında K1/H1 OFF→ON→OFF→ON→OFF doğrulandı.

Hedefli devrede elektriksel veya şema hatası görülmediğinden **mevcut kaynak bileşen, pin ve global çözücüye gereksiz müdahale yapılmadı**. `tests/qa-mq07-sc31-ir-optical-pnp-v11920.test.cjs` ileride gerçek 949 ürünlük tam katalogla Node hedef QA için eklendi. Bu Node dosyası ve Windows UI / `file:///` testleri bu oturumda çalıştırılmadı; kesin bağımsız fiziksel PASS değildir.

Üretici IR yansıma/karşılıklı optik hassasiyeti, kirlilik/ışık gürültüsü, gerçek mesafe kalibrasyonu, optik güvenlik, röle/lamba akımı ve gerçek cihaz kabulü **NOT_VERIFIED**. Eski sanal sahne `physicalAcceptance=false`, `separateTransmitterReceiverVerified=false` korunur. MQ-07 → MQ-05/MQ-09 → MQ-12 izole kanıt → MQ-13 repo sürekliliği → MQ-00 **REVIEW**. SC11–SC30 ve 2800×1800 ölçek / orthographic / Windows launcher teknik kilitleri değişmedi. Actions çalıştırılmadı, `[skip ci]`.

Sonraki ders: `sensor-analog-apps-src-13` sensör kumanda test devresi (SC32).
