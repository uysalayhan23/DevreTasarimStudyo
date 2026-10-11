# MQ-05 Windows canlı simülasyon kabul testi

Bu paket, **BASLAT.bat** ve uygulamanın `file:///.../dist/index.html` başlatma yapısından bağımsız bir QA aracıdır. GitHub Actions tetiklemez. Chromium'un geçici 127.0.0.1 QA sunucusu yalnız ekran görüntüsü testi içindir; normal uygulama başlatıcısı değişmez.

## Tek tıkla çalıştırma

1. GitHub `uysalayhan23/DevreTasarimStudyo` reposunun **güncel main** dalından **Code → Download ZIP** ile arşivi indirin; tamamını **yeni, boş bir klasöre** çıkarın. ZIP'in içinden çalıştırmayın.
2. Windows bilgisayarda **Node.js 22 veya üzeri**, **Google Chrome veya Microsoft Edge** kurulu olsun.
3. Proje ana klasöründe **QA_MQ05_CALISTIR.bat** dosyasına çift tıklayın. Yönetici yetkisi gerekmez.
4. Sonunda **build/QA_MQ05_SONUC_YYYYMMDD_HHMMSS.zip** dosyasını, sonuç FAIL olsa bile, bu sohbete yükleyin.

## Test kapsamı

- `scripts/qa-mq05-windows-v11920.ps1`: 18 kalıcı Node test dosyasını gerçek `node --test` ile çalıştırır; sonuç başarısızsa Chromium PASS verilmez.
- `scripts/browser-mq05-live-v11920.cjs`: gerçek Chrome DevTools Protocol oturumunda uygulamayı yükler; güvenlik onayını geçer; aşağıdaki etkileşimleri ve görsel kanıtları çalıştırır:
  - **Mühürleme devresi (seal-in-1):** START'ın gerçek fare basımıyla bobini çalıştırması, bırakıldığında mühürlemenin devamı ve STOP basıldığında bobinin bırakması. Her adımda ekrandan PNG ve devre durumunu alır.
  - **UT33D+ multimetre / serbest problar:** kırmızı ve siyah probların başlangıçta serbest olması, gerçek fare sürüklemesiyle terminallere yerleşmesi, devre kablo topolojisi değişmeden yaklaşık 24 V DC ölçmesi.
  - **UT200A pens ampermetre:** AC besleme, 230 Ω yük üzerinden iletkene bağlı çenenin kabloyu bölmeden yaklaşık 1 A ölçmesi; cihaz göstergesi ve gerçek proje durumu.
  - **AC/DC akım yönleri:** ters çizilmiş DC besleme telinde hesaplanan -1 yönün SVG `flow-reverse` sınıfında görünmesi; AC mühürlemede yönün AC olarak gösterilmesi ve START basılı paralel kollardaki belirsizliğin korunması.
- `scripts/qa-mq05-artifact-verify-v11920.cjs`: kaydedilen `report.json` ve PNG görüntülerini dosya varlığı, PNG CRC/IDAT yapısı, ölçü, bayt uzunluğu ve SHA-256 açısından tekrar kontrol eder. Başarılıysa `verification.json` ve `checksums.sha256` üretir.
- Her aşama için ayrı stdout/stderr günlükleri ve hata varsa `failure-*.png`, `report.json`, `verification.failure.json`; kaynak SHA-256 değerleri `source-hashes.json`; genel sonuç `run-summary.json`. Bütün bunlar **başarısız testte de** ZIP'e eklenir.

Tarayıcı koşusunun otomatik süre sınırı 900 saniyedir. Yazılım bir adımda başarısızsa ekran görüntüsü ve hata mesajı saklanır; hiçbir FAIL yanlışlıkla PASS yapılmaz.

## Kabul sınırı

Yeni QA'nın **Windows üzerinde gerçek Chromium koşusu henüz yapılmadı**; Linux kaynak sözdizimi ve mevcut simülasyon fixture hesapları önceden denetlendi. İlk kullanıcı ZIP'i gelince sorunlar kanıta göre düzeltilir. Önceden kabul edilen **H–L 64/64 ders, 100/100 PNG** sonuçlarına dokunulmaz. MQ-05 yalnız gerçek Windows uçtan uca kanıtıyla değerlendirilecek; MQ-00 nihai proje kabulü diğer kapılar kapanmadan açık kalır.
