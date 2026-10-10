# Faz 8 — eksik ve düzeltilmiş dersler

Dal: `Devre-Tasarim-Studyosu-1.19.1`  
Tarih: 2026-10-03

## Bulgu ve düzeltme

Ders taramasında üç takometreli bağlantı dersinin üç faz motor beslemesini kablolattığı, ancak temassız takometrenin ne kabloyla bağlandığını ne de optik ölçümünün simülasyonda desteklendiğini açıklamadığı görüldü. Bu durum öğrenciye ölçü aletinin elektrik terminaline bağlanması veya RPM ölçümünün uygulamada çalıştığı izlenimini verebilirdi.

`dist/tutorial-pedagogy.js` içindeki üç dersin açıklaması artık şu sınırları belirtiyor:

- Temassız takometre motor miline yöneltilir; elektrik terminaline bağlanmaz.
- Bağlantı adımları yalnızca üç faz motor beslemesini kapsar.
- Takometrenin optik RPM okuması simüle edilmez.
- Kullanılmayan `nonElectricalMeasurement` alanı kaldırıldı; çalışan bir ölçüm modeli varmış gibi veri taşınmıyor.

“Dijital Takometrenin Yapısı ve Çalışması” dersi bağlantısız görsel/konu dersi olarak kalır. PLC modülleri ürün/terminal tanıtımı sınırında kalır; PLC simülasyonu eklenmedi. Diğer derslerde yeni içerik gerektiren ayrı, kanıtlanmış bir konu/komponent/terminal uyuşmazlığı bulunmadı. Pnömatik ve hidrolik kapsam manifest dışı olduğu için eklenmedi.

## Doğrulama ve sınırlar

- Takometreli kaynak/outline derslerinde motor ve ölçer varlığı, ölçerin kablo uçlarına bağlanmaması ve simülasyon sınırının açıklanması regresyon kontrolüne eklendi.
- Öğretici, ders-devre ve pedagojik hedefli kontroller: **37/37 geçti**.
- `node scripts/check.cjs`: başarılı; 728 kütüphane tanımı ve 58 korumalı proje.
- `git diff --check`: temiz.
- Bu doğrulama, gerçek Windows/Edge elle kullanımını veya fiziksel takometre/motor ölçümünü kapsamaz. Motor solver'ının değerleri cihaz hassasiyetinde devir ölçümü olarak yorumlanmamalıdır.

**Faz 8 tamamlandı. Faz 9’a geçilmedi.**

## Kullanıcı isteğiyle ek ders · 2026-10-03

“Buton ile LED / lamba yakma” konusunun ilk iki sırası 24 VDC LED devresine ayrıldı:

1. NO butonla yeşil LED yakma.
2. NC buton normalde kapalıyken yanan LED’i, butona basınca söndürme.

Her iki devrede de gerçek LED modeli ve 2.7 kΩ seri akım sınırlama direnci kullanılır. Önceden var olan 230 VAC aydınlatma, 24 V ikaz lambası ve Arduino dersleri sonraki sıralara taşındı ve korundu. Beşinci sıra için Arduino’ya aktarım düzeyi eklendi; diğer ders başlıklarının sırası değişmedi. Öğretici ders dosyası için tarayıcı önbellek anahtarı yenilendi.

Doğrulama: ders-devre, Öğretici Modu ve pedagojik hedefli testler **38/38 geçti**; `node scripts/check.cjs` ve `git diff --check` başarılı. Bu içerik güncellemesi Faz 9 denetim fazını başlatmaz.
