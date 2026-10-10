# Geliştirme ve teslim yöntemi

## Başlangıç ve süreklilik

Bu GitHub deposu sonraki geliştirmelerin ortak kaynağıdır. **v1.18.0 golden sürümü `main` üzerinde sabit tutulur; `v1.19.0` ve `v1.19.1` tamamlanmış referanslardır; aktif kalite/geliştirme dalı yalnız `v1.19.20`'dir. Referans dallara geliştirme commit'i gönderilmez.** Önce `AGENTS.md`, güncel durum ve ilgili kuralları okuyun; sonra görevle ilgili dosya/testleri açın. Uzun sohbetin veya geçici çalışma dizininin hâlâ mevcut olduğunu varsaymayın. Kullanıcı yeni yerel sürüm verirse hangi sürümden devam edildiğini karşılaştırıp kayda geçirin; eski ZIP ile yeni kullanıcı çalışmasını ezmeyin.

Mevcut davranışı koruyan küçük değişiklikler yapın. Büyük teknoloji geçişi, zorunlu sunucu veya uygulamanın yeniden yazılması bu aktarımın parçası değildir. Açıklamalar Türkçe, öğrencinin kullanabileceği kadar sade olmalı. Teknik ayrıntı geliştirici belgesinde kalır.

## Çalıştırma ve test

Son kullanıcı: `BASLAT.bat` veya `dist/index.html`. Geliştirici: Node.js 24 ve Python 3.12+. npm kurulumu gerekmez.

```sh
node scripts/check.cjs
node scripts/run-tests.cjs
```

Tek bir davranış için, örneğin:

```sh
node --test tests/live-touch-v118.test.cjs tests/protected-examples-v118.test.cjs
node --test tests/panel-route-independence.test.cjs
```

`run-tests.cjs` mevcut test dosyalarını kendisi listeler; Windows kabuğunun yıldız genişletmesine ihtiyaç duymaz. `build/tests.tap` son çalışmanın çıktısıdır. Testler gerçek uygulama olaylarını `tests/helpers/offline-dom.cjs` üzerinden de çalıştırır. Bu, gerçek tarayıcı yerleşimi veya Windows testi değildir.

Görünüm değişirse mümkün olan ortamda gerçek tarayıcı veya gerçek SVG çizicisiyle görsel kontrol yapın. Yapılmayan Windows/Edge kontrolünü yapılmış diye yazmayın. Gereksiz aynı testi defalarca çalıştırmayın; ilgili değişiklik ve teslim kapısı için yeterli doğrulama yapın.

İsteğe bağlı yerel HTTP önizleme:

```sh
node scripts/preview.cjs
```

Adres `http://127.0.0.1:8765`tir. Bu geliştirme yardımıdır; normal kullanım için sunucu zorunlu değildir.

## Proje verisi ve uyumluluk

- Yeni model/terminal kimliği eklerken eski dosyaların kablo referanslarını koruyun. Gerekli göç açık, testli ve geri okunabilir olmalıdır.
- `_` önekli çalışma alanları geçicidir. Kayıt temizlemesi `project-store.js` içinde yapılır.
- Hazır dosyaları bir kullanıcı projesi gibi açıp üzerine kaydetmeyin. Bilinçli örnek güncellemesi gerekiyorsa tanım/dosya/test birlikte ve koruma işareti korunarak güncellenir.
- `docs/MIGRATION_SOURCE.json` başlangıç sürümünün değişmez dosya özetidir. Sonraki kod değişikliği bu kayıtla birebir eşit kalmak zorunda değildir; bu dosyayı yeni sürümün doğrulaması gibi kullanmayın.

## GitHub yöntemi

- `main` v1.18.0 golden referanstır; `v1.19.0` ve `v1.19.1` tamamlanmış sürümlerdir; geliştirme yalnız `v1.19.20` üzerinde sürer. Her işten önce hedef dal HEAD'i ve eşzamanlı değişiklikler kontrol edilir. Kullanıcı işi üzerine yazılmaz, force-push yapılmaz.
- Küçük görevler ilgili dosyalar ve açıklayıcı commit ile ilerler. Gerektiğinde ayrı dal/PR kullanılabilir; belgeler gereksiz ek onay aşaması oluşturmaz.
- API ile toplu değişiklikte önce güncel commit/tree alınır. Değişmeyen dosyaları korumak için **base tree** kullanılır; blob → tree → commit → dal güncelleme sırası izlenir. Boş ağaç yalnız ilk eksiksiz aktarım için uygundur.
- Dal güncellemesi öncesi hedefin değişmediği kontrol edilir. Eşzamanlı değişiklik varsa birleştirilir; zorla güncelleme yapılmaz.
- Gizli repo görünürlüğü değiştirilmez. Token, hesap parolası, geçici indirme bağlantısı veya ortam bilgileri repoya yazılmaz.
- GitHub API kullanımı tek başına yapay zekâ kredi indirimi garantisi değildir. Dosya haritası, dar kapsamlı okuma ve mevcut test/paket betikleri gereksiz tekrarları azaltır. Normal sohbetten yazma/test yeteneği o oturumun araç ve erişimine bağlıdır.

## Windows ZIP üretimi

```sh
python3 scripts/package.py
```

Windows: `py -3 scripts/package.py`.

1. Windows kullanıcı paketi explicit runtime allowlist kullanır: launcher, `dist/**`, gerekli kullanıcı örnek/projeleri, kullanım/kılavuz dosyaları, gerekli PDF'ler ve üçüncü taraf lisans kayıtları. `tests/**`, `scripts/**`, `tools/**`, `.github/**` ve ajan/audit belgeleri runtime ZIP'e alınmaz.
2. Tek kök klasör `Devre_Tasarim_Studyosu/`, sıkıştırma `ZIP_DEFLATED`, ZIP64 kapalı, Windows/DOS dosya özniteliği kullanılır. Symlink ve güvenli olmayan yollar kabul edilmez.
3. Oluşan ZIP'in CRC kontrolü ve yeniden çıkarılan **her dosyanın SHA-256** karşılaştırması yapılır. Başarısız paket teslim edilmiş sayılmaz.
4. Paket ve yanındaki SHA-256/JSON özeti `build/` içinde oluşur. Git'e her sürüm ZIP'ini tekrar eklemeyin; kaynaklar zaten depodadır.
5. Tamamlanan uygulama sürümünde APP_VERSION, başlık/betik sürüm etiketleri, kullanım ve sürüm notlarının tutarlılığı kontrol edilir. Yalnız GitHub taşıması uygulama sürümünü artırmaz.

`.gitattributes` ilk aktarılan 537 dosyanın baytlarını korumak için otomatik satır sonu dönüştürmesini kapatır. İleride satır sonu düzenlemesi gerekiyorsa ayrı ve açık bir değişiklik yapın.

## GitHub Actions

`Test ve Windows ZIP`: `v1.19.20` push/PR akışında önce repo-integrity, docs ve kalite fast-gate'lerini çalıştırır. Yalnız doküman değişikliklerinde hızlı kapı yeterlidir; runtime/test/script/launcher/workflow değişikliklerinde tam regresyon, gerçek browser smoke, Windows launcher smoke ve Windows runtime ZIP doğrulaması çalışır. Başarılı paket artifact olarak sunulur. Actions dakika/depolama sınırı GitHub hesabına aittir; sınırsız veya ücretsiz olduğu varsayılmaz. Workflow yalnız depo okuma izni kullanır; otomatik yayınlama, birleştirme veya repo ayarı değiştirme yapmaz.

Bağımlı action'lar 28 Eylül 2026'da doğrulanan tam commit SHA'larına sabitlenmiştir: [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), [upload-artifact](https://github.com/actions/upload-artifact). Güncelleme yapılacaksa resmi depodaki etikete karşı doğrulayın.

## Oturum sonunda

Değişen davranışı, ilgili commit'i, geçen testleri ve yapılamayan kontrolü belirtin. Yeni karar veya kalan iş varsa `DURUM_VE_SINIRLAR.md` ve ilgili kuralları güncelleyin. Bir sonraki oturum için yalnız sohbet mesajına güvenmeyin.
