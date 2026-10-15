# MQ-00 / MQ-07 SC21 — PTC ile sıcaklıkta çalışan devre · 2026-10-15

**IMPLEMENTED / izole V8 hedefli kaynak QA PASS / MQ-00 REVIEW (NOT DONE).** Repo uysalayhan23/DevreTasarimStudyo main.

Önceki 9 bileşen/12 kablolu sensör+LM358P karşılaştırıcı dersinde yük yoktu. PTC SC21 hedefinde R1 10 kΩ → 2 kΩ, LM358P IN+ (pin 3) 12 V referans, IN− (pin 2) PTC alt düğüm olarak terslendi. Bu, PTC direnci artarken ısıtma eşiği üzerinde çıkışın yükselmesini sağlar. RG/RP 10k/10k gate sınırlayıcı, fiziksel kimlikli IRF540N G/D/S ve ayrı H1 240 Ω sanal yük eklendi; artık 13 bileşen/19 kablo/19 adım.

**Kaynak V8 örnek:** 35 °C PTC ≈1,284 kΩ, H1 OFF; 65 °C PTC ≈2,718 kΩ, H1 ON ≈100 mA; 35 °C OFF. Teorik eşik yaklaşık 52,7 °C. Sadece özgün thermal.js, device-behavior.js, current-model.js, güncel simulation.js ve minimal doğru model/stub ile hedefli deneme; tam Node suite, 1.655 dersin bağımsız elektriksel testleri, gerçek Windows file:/// UI ve üretici fiziksel/ısıl testleri ÇALIŞTIRILMADI. Doğrulama test kaynağı tests/qa-mq07-sc21-ptc-temperature-switch-v11920.test.cjs.

MQ-07/MQ-05/MQ-09 → MQ-12 → MQ-13 → MQ-00 REVIEW. SC11–SC20 kayıtları ve golden kilitleri korunur; Actions yok, [skip ci]. Sıradaki aday: sensor-analog-apps-src-03 (termokupl) — gerçek canlı baseline incelenmeli.
