# H–L 64 ders — Windows tek tıkla görsel QA

Bu araç yalnızca kalite testidir; uygulamanın **BASLAT.bat** başlatıcısını ve **file:///dist/index.html** açılışını değiştirmez. **GitHub Actions çalıştırmaz.** Chromium testi geçici olarak bilgisayar üzerinde yalnızca QA için 127.0.0.1 üzerinde yerel bir HTTP adresi kullanır; uygulama başlatma yöntemi yine file:/// şeklindedir.

## Kullanım

1. GitHub `uysalayhan23/DevreTasarimStudyo` reposunun güncel **main** ZIP arşivini indirip tamamını boş bir klasöre çıkartın. ZIP'in içinden BAT çalıştırmayın.
2. Windows bilgisayarda **Node.js 22 veya daha yeni** ve **Google Chrome ya da Microsoft Edge** kurulu olmalı. Gerektiğinde CHROME_BIN çevre değişkeniyle alternatif Chromium çalıştırılabilir dosyası verilebilir.
3. Proje ana klasöründeki **QA_HL64_CALISTIR.bat** dosyasına çift tıklayın. Yönetici yetkisi veya GitHub Actions gerekmez.
4. Testler bitince proje içindeki **build/QA_HL64_SONUC_YYYYMMDD_HHMMSS.zip** dosyasını bu sohbete yükleyin. **Başarısız olsa dahi** bu ZIP dosyasını yükleyin.

## Araç neler yapar?

- 10 kalıcı Node test dosyasını `node --test --test-reporter=tap` ile doğrudan çalıştırır. PASS olmayan testte Chromium'a geçmez; hata çıktıları saklanır.
- Node başarılıysa, `scripts/browser-visual-hl-v11920.cjs` ile Chromium üzerinde **16 konu × 4 ders = 64 dersi** açar. 16 konu için köşe/taşıma, küçültme/geri açma ve pencere boyutu testlerini çalıştırır.
- **Beklenen 100 ekran görüntüsü**: 64 ders + 16 köşe + 16 panel + 4 genel ekran. `report.json` içindeki dosya yolu, PNG yapısı, ölçüler, dosya boyutu ve SHA-256 denetlenir.
- `scripts/qa-hl64-artifact-verify-v11920.cjs` kaydedilmiş `report.json` dosyasını yeniden okur, gerçek ekran görüntüsü dosyalarını doğrular ve yalnız bütün koşullar sağlandığında `verification.json` ve `checksums.sha256` oluşturur.
- Sonuç ZIP'i, `node-tests.stdout.log`, `node-tests.stderr.log`, `chromium-hl64.stdout.log`, `chromium-hl64.stderr.log`, `artifact-verification.stdout.log`, `artifact-verification.stderr.log` (ilgili aşama çalışmışsa), `run-summary.json`, `source-hashes.json`, `README.txt` ve varsa `browser-visual-hl/` çıktılarını kapsar.
- Eski `build/browser-visual-hl` kalıntılarını Chromium testinden önce temizler; böylece önceki çalıştırmanın PNG'leri yeni koşuya karışmaz.

## Kabul kuralı

**MQ-00 otomatik kapanmaz.** `run-summary.json` durumunun PASS olması için Node, Chromium ve bağımsız kanıt doğrulama süreçlerinin üçü de 0 koduyla çıkmalıdır. JSON raporunda gerçek 64 dersin ve tam 100 PNG'nin karşılıklı SHA-256/boyut eşleşmesi gösterilmelidir. Hata veya erişim kısıtı varsa ZIP'de raporlanır, sonuç FAIL kalır. Çıktıyı paylaştıktan sonra MQ-12 → MQ-10 → MQ-00 incelemesi yapılır.

Not: Bu betik Windows PowerShell 5.1 ve Node.js 22+ için hazırlanmıştır; ilk tam Windows/Chromium çalıştırması henüz kullanıcı bilgisayarında doğrulanmış değildir.
