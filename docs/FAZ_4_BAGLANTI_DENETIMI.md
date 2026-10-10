# Faz 4 — devre bağlantıları denetimi

## 1.19.1 doğru taban ek denetimi · 2026-10-03

İlk 58 proje dosyası v1.18 kapsamındadır; v1.19.0 tabanındaki 72 temel öğretici bağlantı dersinin ve kaynak-outline derslerinin yerini tutmaz. `tests/lesson-circuit-audit-v119.test.cjs` ile doğru tabanda bağlantı grupları, kablo/terminal eşleşmesi, komponent türü ve ders başlığı tarandı. Hedefli paket temiz v1.19.0 tabanında da 24/32 verdi; mevcut test denetimleri arasında bağlantısız gruplar, IGBT ürün görünümü beklentisi ve anlamsal tekrar uyarıları bulunuyor. Bunlar tabandan devralınmış bulgulardır; “devrelerin tamamı doğrulandı” sonucu çıkarılamaz. Faz 3 zaman değişkeni regresyonu ayrıca düzeltildi ve tam paket sonucu Faz 0 kaydına eklenecek.

Bu ek yapısal/test denetimini kaydeder; 72 dersin her birini Windows/Edge arayüzünde tek tek çalıştırma veya fiziksel donanım testi yapıldığı anlamına gelmez. Hedefli dört dosyalı test paketi 24/32 geçti; temiz v1.19.0 karşılaştırması da 24/32 verdi. Başarısız test adları kaynak tabanındaki başarısızlıklarla aynıdır. Tam 1.19.1 paketi 427 testte 379/48 sonucunu verdi; temiz v1.19.0 tabanı 423 testte 344/79 verdi ve 48 kalan başarısızlığın tüm adları v1.19.0’da da başarısızdı. Bu nedenle 1.19.1’e yeni bağlantı regresyonu eklenmedi; fakat devralınan denetimler temizlenmediğinden Faz 4’ün “tüm devreler çalışır” koşulu tamamlanmış sayılmaz.

> **Taban düzeltme notu (2026-10-03):** Aşağıdaki 58 proje sayımı v1.18.0/main tabanındaki ilk 1.19.1 dalına aittir. Dala v1.19.0'daki Arduino ve genişletilmiş ders/proje dosyaları sonradan eklendiği için bu sayım güncel envanter olarak kullanılmamalıdır. `tests/lesson-circuit-audit-v119.test.cjs` güncel dalda da çalıştırıldı; başarısız denetimler temiz v1.19.0 tabanında da aynıdır, bu nedenle bu eski 58-proje raporu onları kapsamaz.

## Sonuç

- Dal: `Devre-Tasarim-Studyosu-1.19.1`
- Denetim tarihi: 2026-10-03
- Dayanak: Faz 1 envanteri, Faz 2 ders/devre denetimi ve Faz 3 sonunda dalda bulunan proje/kütüphane içerikleri.
- `Ornekler/` içindeki 55 ve `Kaydedilen_Projeler/` içindeki 3 dosyanın tamamı tarandı: 58 proje, 485 yerleştirilmiş eleman ve 455 açık kablo.
- Proje verileri, yayımlanmış komponent kütüphanesi ve tesisat uzantısıyla karşılaştırıldı.
- Eksik komponent türü, geçersiz pin, bulunamayan kablo ucu, junction veya bozuk bağlantı hedefi bulunmadı.
- Altı prob hedefi de var olan komponent ve pinlere çözülüyor.
- Faz 1 ve Faz 2’deki devre amacı, pin eşleşmesi, besleme ve polarite incelemesinde bağlantı hatası bulunmamıştı. Bu denetimde ders/devre kaynaklarını değiştirmeyi gerektiren yeni bir hata çıkmadı.

## Bağlantısız görünen öğeler

Otomatik uç denetimi, kablosuz katalog ve tanıtım sayfalarındaki elemanları da listeler. Kaynağa göre bunlar devre bağlantısı beklemeyen örneklerdir: PLC ve sensör ürün koleksiyonları, komponent/sembol görselleri, pano yerleşimi ve NTC/PT100/termokupl görsel-parametre örnekleri.

İşlevsel devrelerdeki istisnalar ayrıca doğrulandı:

- `Trafo_Guc_Kaynagi.odsdevre` içindeki H2, “Bağlantısız: sönük kalır” etiketiyle özellikle açık bırakılmıştır; H1 ise 24 V çıkışına bağlıdır.
- `UT33D_Hareketli_Problar_v1.15.odsdevre` içindeki kaynak, iki probun `probeTarget` alanlarıyla + ve 0 V uçlarına bağlıdır. Bu dinamik ölçüm hedefleri kablo listesinde yer almaz; multimetre uçları problara bağlıdır.
- `Kobastar_SB2_Yuk_Hucresi_v1.12.odsdevre` içinde EX beslemesi ile SIG ölçüm döngüsünün dört bağlantısı mevcuttur.

Bağlantısız ürün gösterimleri devre hatası sayılmadı. Mevcut ders amacı ve devre bağlantısı arasındaki denetim Faz 2 raporunda korunmuştur.

## Doğrulama yöntemi ve sınırlar

- Her kablo ucunun bir proje elemanına/pine veya tanımlı junction’a karşılığı kontrol edildi.
- Her eleman türü ve pin, çalışma dalındaki komponent tanımlarında arandı. Tesisat uzantısındaki türler de denetime katıldı.
- Multimetre prob hedefleri ayrı bağlantı ilişkisi olarak doğrulandı.
- Denetim veri ve bağlantı yapısı üzerindedir; gerçek donanım ölçümü yapılmadı. Faz 4 kapsamında kaynak devrelerde değişiklik gerekmedi.
- Faz 3 sonunda 259/259 test geçmiştir; Faz 4’te test paketi yeniden çalıştırılmadı.

## Faz durumu

İlk Faz 4 bağlantı denetimi tamamlandı fakat v1.18 tabanına özgü 58 proje kapsamındadır; sonraki v1.19.0 dosyalarının yerini tutmaz.

## 1.19.1 ders-devre düzeltmesi · 2026-10-03

Doğru v1.19.0 tabanı üzerine taşınan dersler ve kaynak-outline dersleri yeniden denetlendi. Başlıktaki cihaz ile malzeme eşleşmesi, gerçek bağlantılı derslerde kablo/terminal bütünlüğü, direnç-kondansatör-bobin değerleri ve ölçüm yöntemi kontrol edildi.

- “Kondansatörlü motorlar” kaynak dersi; motor, tek faz AC beslemesi ve yardımcı sargı kondansatörüyle eşleştirildi. Başka bir yön değiştirme devresinin içeriği devralınmıyor.
- Soft-starter, oto trafo, Dahlander, MOSFET ve VFD başlıklarında kaynak motor devresi başlığa uymuyorsa korunmuyor; ilgili gerçek cihaz veya temsili ders malzemesi gösteriliyor.
- Multimetre/LCR ile direnç ölçümü enerjisiz ölçüm olarak gösteriliyor. Kaynak beslemesi ve seri ölçer içeren hatalı şablon kaldırıldı.
- PLC ürün/giriş/çıkış dersleri, istek doğrultusunda görsel/ürün tanıtımı olarak kalıyor. PLC simülasyonu veya ayrı güç/kumanda adalarını zorla birleştiren bağlantı eklenmedi.
- Faz 5’teki yarı iletken paketleri temsili fiziksel görünüm olarak tanımlı; denetim, ürün CAD’i iddiası yerine kütüphane kaydı, pinler ve fiziksel gösterim işaretini kontrol ediyor.
- Pnömatik/hidrolik kapsam manifest dışı olduğundan kaynak başlık denetimi bunu zorunlu ders alanı saymıyor; öğretici çıktısında bulunmadığı ayrıca kontrol ediliyor.

Doğrulama: `tests/tutorial-pedagogy-v119.test.cjs`, `tests/lesson-circuit-audit-v119.test.cjs` ve `tests/tutorial-mode-v119.test.cjs` **35/35 geçti**. `node scripts/check.cjs` **728 kütüphane tanımı ve 58 korumalı projeyle başarılı**; `git diff --check` temiz. Bu kontroller veri tabanlı yapısal/öğretici denetimidir; fiziksel donanım veya tüm devrelerin gerçek zamanlı Windows/Edge simülasyon denemesi değildir. PLC modülleri görsel amaçlıdır.

**Faz 4 tamamlandı.** Değişiklikler bu fazın ayrı checkpoint’inde kaydedildi. Faz 5’e geçiş için kütüphane ve simülasyon kontrolleri ayrı yürütülecektir.
