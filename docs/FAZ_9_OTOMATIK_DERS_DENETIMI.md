# Faz 9 — otomatik ders denetimi

Dal: `Devre-Tasarim-Studyosu-1.19.1`  
Tarih: 2026-10-03

## Denetim kapsamı

Otomatik denetim dört test dosyasına ayrıldı: `tutorial-automatic-audit-v119.test.cjs`, `tutorial-mode-v119.test.cjs`, `tutorial-pedagogy-v119.test.cjs` ve `lesson-circuit-audit-v119.test.cjs`.

- **Ders varlığı ve konu:** Her kaynak konusu için ders bulunduğu; kimliklerin benzersiz, başlıkların ve temel metinlerin dolu olduğu kontrol edilir.
- **Komponent ve kütüphane:** Her ders komponentinin aktif kütüphanede yer aldığı, kablo uçlarının gerçek komponent ve pin kimliklerine çözüldüğü doğrulanır.
- **Sembol ve görsel:** 81 temel dersle kaynak/outline derslerinde kullanılan 224 ayrı komponent türünün gerçek IEC sembol çizicisi ve malzeme çizicisi çalıştırılır. Görsel-only kavram elemanlarının pinsiz olmasına izin verilir; elektrik devresi gibi davranmaları beklenmez.
- **Pin, bağlantı ve devre bütünlüğü:** Kablolu derslerde uç geçerliliği, tüm kablolar için öğretici adımı, fiziksel eleman pinlerinin kullanımı ve bağlı grafik kontrol edilir. Belirlenmiş görsel/PLC istisnaları ayrı tutulur; PLC programı simülasyonu eklenmez.
- **Fiziksel model ve konu eşleşmesi:** Başlıklardaki direnç, kondansatör, bobin, yarı iletken, ölçü aleti, motor ve benzeri aileler gerçek ders komponentleriyle eşleştirilir. R/C/L parametreleri ve solver’daki ilgili fizik denetlenir.
- **Açıklama ve tekrar:** Açıklama, hedef ve malzeme listelerinin gerçek projeye bağlılığı; yinelenen kayıtların korunma/birleştirme kararları ve kapsam dışı pnömatik/hidrolik içerik kontrol edilir.

## Bulunan ve giderilen sorun

HCFA servo sürücü ve servo motor ders kütüphanesinde tanımlı ürün görseli kimlikleri taşıyordu; ancak standart malzeme çizicisinin varlık tablosunda bu kimlikler yoktu. Bu nedenle çizim çağrısı `Missing material asset` hatası verebiliyordu. Yeni `hcfa-material-assets.js`, uygulamada zaten çevrimdışı bulunan HCFA görsel parçalarını birleştirip ürün görseli olarak malzeme çizicisine kaydeder. Script, görsel parçalar yüklendikten ve ürün varlık tablosu kurulduktan sonra, malzeme çizicisinden önce çağrılır.

Otomatik renderer testi HCFA görsellerini de yükleyerek 224 türün tamamı için sembol ve malzeme çıktısını denetler; bu hata yeniden oluşursa test başarısız olur.

## Sonuç ve sınırlar

- Dört dosyalı hedefli otomatik ders denetimi: **40/40 geçti**.
- `node scripts/check.cjs`: başarılı; 728 kütüphane tanımı ve 58 korumalı proje.
- `git diff --check`: temiz.
- Bu faz otomatik ve yapısal doğrulamadır. Tarayıcıda her dersi açıp canlı simülasyon, değer değiştirme ve ölçüm yapma Faz 10’daki kullanıcı gözünden kontrole aittir.

**Faz 9 denetimi tamamlandı; Kontrol Noktası 9 kullanıcı kabulünü bekliyor. Faz 10’a başlanmadı.**
