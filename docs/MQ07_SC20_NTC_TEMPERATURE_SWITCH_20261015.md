# MQ-00 / MQ-07 SC20 — NTC sıcaklık kontrollü yük (2026-10-15)

Repo: uysalayhan23/DevreTasarimStudyo, main. **IMPLEMENTED / isolated V8 target PASS / MQ-00 REVIEW (NOT DONE).**

SC20 özgün 9 bileşenli/12 telli karşılaştırıcı devresinde yük yoktu. LM358P DIP8 pin 8/4/2/3/1, B1 NTC, referans R2/R3, gerçek UNI-T UT33D+ ve problar korunarak RG/RP iki 10 kΩ bölücü, IRF540N G/D/S ve 240 Ω H1 sanal yük eklendi. Yeni devre 13 bileşen, 19 kablo, 19 rehber adım içerir. MOSFET gate sayısal okuması yalnız bu dersin opt-in bayrağıyla yapılır. Ayrı G1/P → H1 → Q1/D-S → G1/M güç yolu doğrulandı; op-amp yük akımını doğrudan taşımaz.

**MQ-12 sınırı:** özgün thermal.js, device-behavior.js, current-model.js ve yeni simulation.js izole V8 testinde, minimal doğru tür/pin şeması ve ilgisiz cihazlar için stub ile 15/25/35/15 °C ve kopuk gate/enerji olmak üzere 7 koşulda incelendi. 15 °C H1 OFF, 35 °C H1 ON ≈0,100 A, 15 °C OFF. Gerçek tüm katalog Node suite, Windows file:/// UI, gerçek LM358P çıkış limiti ve fiziksel üretici kalibrasyonu **çalıştırılmadı/onaylanmadı**. Gelecek Node testi: tests/qa-mq07-sc20-ntc-temperature-switch-v11920.test.cjs.

MQ-07 lider → MQ-05/MQ-09 çapraz model/ürün → MQ-12 hedef kaynak test → MQ-13 repo sürekliliği → MQ-00 REVIEW. SC11–SC19 ve diğer dersler değişmez; Actions yok ve [skip ci]. Sıradaki hedef sensor-analog-apps-src-02 PTC devresi.
