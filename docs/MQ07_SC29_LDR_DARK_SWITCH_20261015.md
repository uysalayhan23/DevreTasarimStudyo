# MQ-00 / MQ-07 SC29 — GL5528 LDR ile karanlıkta sanal 24 V yük anahtarlama (2026-10-15)

Repo `uysalayhan23/DevreTasarimStudyo`, `main`. **Gerçek JavaScript kaynaklı izole V8 QA PASS, MQ-00 REVIEW — fiziksel DONE değil.**

## Kök neden

Özgün SC29 9 katalog bileşeni / 12 kabloyla GL5528 üst kol, R1 10 kΩ alt kol, R2/R3 12 V eşik, LM358P ve UT33D+ ölçümünden oluşuyor fakat karanlıkta çalışan **yük veya yük anahtarı yoktu**. B1/2 duyarlık düğümü U1 pin 3 IN+ olduğu için karanlıkta düşük sensör geriliminde çıkış LOW, aydınlıkta HIGH oluyordu: başlıkla tersdi. Tarihsel SC30 DC lineer LDR dimmer, SC20 NTC ve SC21 PTC devreleri değiştirilmedi.

## Noktasal SC29 düzeltmesi

Sensör düğümü U1 pin 2 IN−; R2/3 referansı U1 pin 3 IN+ olarak yönlendirildi. Orijinal gerçek 24 V G1 kaynağı, GL5528, LM358P PDIP8, UT33D+ ve iki prob korundu. 4 fiziksel katalog bileşeni (RG 10 kΩ, RP 10 kΩ, IRF540N Q1, 240 Ω sanal H1) ile 7 tam terminal kablosu eklendi: U1/1→RG→Q1/G, RG/RP gate pull-down, G1/P→H1/X1→H1/X2→Q1/D→Q1/S→G1/M. Nihai 13 malzeme / 19 kablo / 19 rehber adımı.

`dist/simulation.js` N-kanal gate algılayıcıya yalnız `mq07LdrDarkSwitch===true` opt-in ile hali hazırdaki **gerçek nodal numeric örnekleme** eklendi; diğer MOSFET gate yöntemleri, NTC/PTC bayrakları ve solver korunur. Sayısal çözümde 0.1/1/5/10 lux karanlık ON (~0.100 A); 30/50/100/1000 lux aydınlık OFF; 24 V kaynak 0 V olursa, Q1 gate, H1 kablosu veya LM358P besleme kablosu çıkarılırsa OFF. Karanlıkta gerçek sanal kapı yaklaşık 10,996 V (karşılaştırıcı çıkışından 10 kΩ/10 kΩ bölücü). Model LDR eşiği yaklaşık 19,66 lux değerindedir; **üretici onaylı lux kalibrasyonu değildir**.

## MQ-12 ve kalan engeller

949 gerçek katalog tanımı, orijinal `dist/current-model.js` dahil özgün numerik simülasyon; `dist/simulation.js` yalnız 3 hedefli satır değiştirilerek izole V8'de denendi. 12 hedefli giriş (8 aydınlık seviyesi + 4 güç/gate/yük kopukluğu) PASS; kaynak 1655 ders yeniden yüklendi ve yalnız SC29 değişti. Tarihsel SC11–SC28 kayıtları ve `SC30` dimmer korunur. Ayrı `tests/qa-mq07-sc29-ldr-dark-switch-v11920.test.cjs` Node yerel hedefli test olarak eklendi; **gerçek Node tam suite ve Windows file:/// UI koşulmadı**.

Gerçek GL5528 sensör partisi/gamma, LM358P çıkış akımı sınırı, IRF540N ısınması/anahtarlama, histerezis, yük/koruma ve sensör terminal açık devre güvenliği fiziksel doğrulanmadı. Tam analog SPICE ve gerçek pano donanımı için PASS iddia edilmez. Fiziksel kabul FALSE; MQ-00 REVIEW.

Ajan zinciri: MQ-07 ders → MQ-05/09 elektronik ve katalog çapraz kontrolü → MQ-12 kaynağa dayalı elektriksel QA → MQ-13 main/lock kanıtı → MQ-00 REVIEW. GitHub Actions kullanılmadı; commit `[skip ci]`. **Sıradaki** `sensor-analog-apps-src-11` LDR kontrollü dimmer.
