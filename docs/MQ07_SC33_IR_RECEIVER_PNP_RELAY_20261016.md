# MQ-00 → MQ-07 → MQ-05/MQ-09 → MQ-12 → MQ-13 → MQ-00 · SC33 IR alıcı optik PNP röle/yük (2026-10-16)

Repo: `uysalayhan23/DevreTasarimStudyo`, dal `main`. **13/13 hedefli izole gerçek JS simülasyon PASS; MQ-00 REVIEW, fiziksel DONE değil.**

## Bulgu ve hedefli çözüm

`sensor-analog-apps-src-14` başlangıçta gerçek katalogdan 5 ürün ve 7 terminal kablosuyla zaten PNP BK→K1 bobin, K1 13/14 NO→H1 yük zincirini içeriyordu; ancak B1 `sensing` alanı olmadığı için kullanıcı tarafından sürüklenebilen optik hedef yoktu. Manuel `state` değişimine bağımlılık, IR alıcının ışık algılama koşulunu öğretmiyordu. Bu nedenle **genel simülasyon veya katalog değiştirilmedi**. Yalnız SC33 B1 için plastik sanal hedef, başlangıç 80 mm, 40 mm sanal eşik, 6 mm hizalama toleransı ve dinamik optik yakınlık eklendi. İlgili pedagojik neden–sonuç, fail-closed örnekleri ve fiziksel kalibrasyon sınırı güncellendi. 5 ürün/7 kablo/7 rehber adımı korundu.

Terminal zinciri: G1 24 VDC P→B1 BN, M→B1 BU; B1 PNP BK→K1 A1, K1 A2→M. K1 NO 13/14 kapanınca G1 P→13→14→H1 X1→H1 X2→M hattındaki sanal H1 yanar. Burada PNP çıkışı bobini doğrudan süren **sanal sürücü** olarak görev yapar; gerçek çıkış akım sınırı, koruma diyodu ve ayrı gerçek IR verici/alıcı veya demodülasyon sınanmadı.

## MQ-12 gerçek kaynak testi

Özgün `dist/library.js` ve 949 ürüne uzanan tasarım katalog uzantıları, `probe-leads.js`, `components.js`, `sensors.js`, `thermal.js`, `device-behavior.js`, `incremental-encoder.js`, `instruments.js`, `multimeter.js`, `current-model.js`, `simulation.js` V8 izole ortamında (yalnız ilgisiz cihazlara stublar) kullanıldı. 13/13 sonuç: uzakta/2 mm içinde/40 mm sınırında/41 mm dışarıda; sıvı hedef ve 7 mm yanlış hizalama; BN, BU, BK, K1 A2, H1 X2 açık kablo; 0 V ve 12 V kaynak. Optik hedef yakın fakat BK açıkken **sensör ON, bobin OFF, lamba OFF**; yük hattı açıkken **bobin ON, lamba OFF**. Gerçek katalog terminal kimlikleri eşleşti. Müfredat 1.655 derste sadece SC33 değişikliğiyle yüklendi.

**Sınır:** Kaydedilen Node hedef test dosyası tam Node çalışma ortamında burada çalıştırılmadı. Windows `file:///` görsel test, gerçek IR verici/alıcı optiği, ürün menzili/taşıyıcı frekans, K1 bobin/PNP akım limiti ve fiziksel güvenlik kabulü NOT_RUN. Enerji/power/metre/sahadaki cihaz başarısı iddia edilmez. Fiziksel kabul false; MQ-00 REVIEW.

GitHub Actions kullanılmaz; atomik `[skip ci]` değişikliği, force push/geçici branch yoktur. Sonraki aday `sensor-analog-apps-src-15` güneş pili uygulaması: bağlantısız kavram başlığının gerçek PV davranışını yeniden değerlendirme.
