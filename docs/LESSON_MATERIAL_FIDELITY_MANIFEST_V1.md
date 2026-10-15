# MQ-00 / MQ-07 — Zorunlu ders malzemesi eşleme manifestosu v1
Tarih: 2026-10-15. Kapsam: 1.655 öğretici ders, atölye kütüphaneleri ve serbest çalışma.

## Değiştirilemez kurallar
1. **Başlık → gerçek devre**: Her ders için başlık, kazanım, kaynak/üretici, zorunlu eleman listesi, pinler, elektriksel işlev, bağlantılar, ölçüm noktaları, öğretici açıklaması ve serbest çalışma erişimi eşleşmeden işlevsel ders olarak kabul edilmez.
2. **İkame yasaktır**: Eksik op-amp yerine 4–20 mA transmitter; triyak yerine sıradan anahtar; türev alıcı yerine döngü ampermetresi vb. kullanılamaz. Sıradan anahtar/direnç/lamba gerçek konudaki destekleyici yük/kontrol parçası ise bulunabilir, ancak asıl elemanın yerine asla geçemez.
3. **Kütüphanede yoksa**: Üreticinin orijinal veri sayfasından tam model, parça numarası, paket, boyut, ortografik önden görünüş, pin/terminal dizilimi ve gerekirse üretici simülasyon modelini araştır. Kaynak URL ve sürümünü manifestte kaydet. Doğrulanmamış pin/ölçü uydurma.
4. **Ekle ve aç**: Kaynakları doğrulanan her yeni ürün işlevsel simülasyon ve 3D ön görünüş gereklerini karşılayacak biçimde ilgili atölye/elektronik kütüphanesine eklenmeli; `tutorialOnly` ile gizlenmemeli. Serbest çalışma alanında yerleştirilebilir ve terminal bağlantıları erişilebilir olmalıdır. Salt sanal eğitim bileşeni `Sanal` olarak açık etiketlenir ve gerçek ürüne eşdeğer sayılamaz.
5. **Özgün solver**: Dersin ana işlevi solver tarafından hesaplanmıyorsa `NO_WIRED_CIRCUIT/REVIEW` korunur; sahte bağlantı, keyfi animasyon veya doğrulanmamış fiziksel sonuç üretilmez.
6. **Kabul kapıları**: Ders özelinde devre-görsel eşleşmesi + malzeme kaydı + terminaller + simülasyon senaryoları + öğrenci açıklamaları + Windows UI görsel kabulü. Eksik herhangi bir kapı için FINAL/PASS yasak.
7. **200 derslik üretim hattı**: Her 200 ders taranır, hatalı olanlar gerçek uygulama dosyalarında onarılır, kapsamı kanıtlananlar commit edilir; rapor tek başına teslimat değildir. Actions yok; `[skip ci]`, main, force-push yok.

## Doğrulanmış üretici dayanakları
- Texas Instruments LM358 / LM358B veri sayfası: https://www.ti.com/lit/ds/symlink/lm358b.pdf — 8 pinli paket A kanalı OUT=1, IN−=2, IN+=3, V−=4, V+=8. Bu numaralar fiziksel paket ve üretici varyantı bağlamında kontrol edilmeli.
- STMicroelectronics BTA16 veri sayfası: https://www.st.com/resource/en/datasheet/bta16.pdf — G, A1/MT1, A2/MT2 terminalleri; paket varyantına göre üretici çizimi doğrulanmalı.

## Hata tespitleri / engeller
- `opamp-apps-src-01..17`: `dist/tutorial-expanded-lessons.js` önce hepsini `loop-420-4` devre şablonundan oluşturuyordu. Bu yanlış eşleme kaldırıldı ve derslerin ilk grafiği konuya ait referans malzemeleriyle kuruldu. Gerçek bağlantılı varyant yalnız ayrı hedef onarım tarafından konur.
- `electronic-switching-src-16`: basit DC kapı-eşik triyak demonstrasyonu gerçek AC faz dimmer değildir; sıradan butonlu yük gösterimi asıl dersin çift yönlü anahtarlama işlevini karşılamaz. Dersin işlevsel kabulü açıktır.
- `mq07-scr-virtual`, `mq07-triac-virtual`, `mq07-igbt-virtual` genel elektronik kütüphanede serbest çalışma için görünür yapıldı; bunlar **ürün görseli / gerçek üreticiye bağlı fiziksel model değildir**. Üretici kalibrasyonu, ön görünüm, gerçek boyut ve motor/AC sürüşleri bekler.
