# MQ-00 / MQ-07 — SC13 SCR DC tetikleme ve akım tutma · 2026-10-15

Repo: uysalayhan23/DevreTasarimStudyo, main.
Status: **IMPLEMENTED / isolated solver verification PASS / full QA REVIEW**.

## Teknik düzeltme
- Ders: `electronic-switching-src-13`, Tristörün DC'de tetiklenmesi.
- SC11 MOSFET/DC motor ve SC12 PWM IGBT dimmer devreleri değiştirilmedi; AC/triyak dersleri ayrı sırada.
- SC13 özgün 6 kablolu devre ve TYN612RG fiziksel ürün kimliği korunarak `q1.mq07ScrHoldLesson` ile dar kapsamlı native SCR DC tutma modeli etkinleştirildi.
- Solver gate–katot gerilimini kapı direnci üzerinden gerçek nodal sayısal ağda örnekler; butonun yalnız durumunu okumaz. Sınırlı modelde SCR tetiklenmesi için sanal eşik G-K ≥0.7 V kullanılır.
- Anot–katot iletimini korumak için dirençli yükün hesaplanan akımı gerçek katalog alanındaki sanal `holdingCurrent` değerini karşılamalıdır. Gate darbesi kesilince akım yetiyorsa latch devam eder; güç yolu koparılıp akım eşiğin altına düşünce latch temizlenir ve yeniden bağlanması yeni gate darbesi gerektirir.
- STOP/simülasyon temizliği latch ve geçici akım verilerini temizler. Fiziksel kalibrasyon (gate trigger current, termal, dinamik geçiş ve üretici holding-current eğrisi) **kabul edilmiş değildir**.

## İzole çalıştırılmış test kanıtı
Gerçek `dist/thermal.js`, `sensors.js`, `components.js`, `device-behavior.js`, `current-model.js`, `simulation.js` kodu bir JS çalışma ortamında çalıştırıldı. Erişilemeyen donanım/arayüz alt modülleri izole edildi.
- İlk gate OFF: lambada 0 A, latch OFF.
- Gate ON: sayısal G-K 12 V, 120 Ω eğitim yükü akımı 0.1 A, SCR/lamba ON, latch ON.
- Gate bırakılmış: G-K 0 V fakat 0.1 A anot yük akımı nedeniyle latch ve lamba ON.
- Yalnız gate kablosunun kesilmesi latch’i düşürmedi.
- H1→A, Q1/K→G1/M veya G1/P→H1 bağlantısı kesildi: yük 0 A, latch OFF; güç yolu tekrar kapatıldığında yeni gate tetiklemesi olmadan devre kendiliğinden başlamadı.
- Geçerli SCR öğretici kaynak, solver ve hedef test dosyalarının JS sözdizimi PASS.

`tests/qa-mq07-sc13-scr-holding-latch-v11920.test.cjs` altı ayrı kabul akışını Node test senaryolarıyla denetlemek üzere eklendi. **Tam Node koşumu, 1.655 ders regresyonu ve Windows UI görsel kabulü çalıştırılmadı**; bunlara PASS verilmedi.

## MQ-00 kabul kararı
MQ-05 solver, MQ-07 öğretici içeriği, MQ-12 hedefli izole test gözlemi, MQ-13 repo sürekliliği. **SC13 REVIEW**, fiziksel/Windows/bağımsız pedagojik kapılar açık. Gerçek donanım bağlantı yönergesi değil, yalnız düşük gerilimli sanal model.

GitHub Actions kullanılmadı; commitler `[skip ci]`, dal `main`, force-push yok. Sıradaki ders SC14: Tristörün durdurulması.
