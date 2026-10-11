# UT200A fiziksel çene — MQ-05 Windows Chromium kabulü

Bu QA, mevcut MQ-05 **110/110 Node, 4/4 gerçek Chromium ve 12/12 PNG** kabulünün üzerine eklenmiş **ayrı** bir fiziksel pens çene testidir. H–L 64/64 ders, 100/100 PNG kabul kayıtları ve uygulamanın `BASLAT.bat` → `file:///dist/index.html` başlatma politikası değiştirilmez. GitHub Actions kullanılmaz.

## Tek tıkla kullanım

1. `uysalayhan23/DevreTasarimStudyo` → `main` → **Code → Download ZIP** üzerinden güncel arşivi indirin.
2. ZIP'i yeni, boş bir klasöre **tamamen çıkarın**. Node.js 22 veya üzeri, Chrome ya da Edge yüklü olmalıdır.
3. Proje ana klasöründeki **`QA_MQ05_UT200A_CALISTIR.bat`** dosyasını çift tıklayarak başlatın. Yönetici erişimi ve GitHub Actions gerekmez.
4. Başarılı veya başarısız sonuçta `build/QA_MQ05_UT200A_SONUC_YYYYMMDD_HHMMSS.zip` dosyasını sohbete yükleyin.

## Gerçek kabul dizisi

`scripts/qa-mq05-ut200a-windows-v11920.ps1`, 18 eski MQ-05 Node dosyasını ve **yeni UT200A test dosyasını** (19 dosya) çalıştırır. Node başarılıysa `scripts/browser-mq05-ut200a-jaw-v11920.cjs` gerçek Chromium'u başlatır.

- AC besleme ve 230 Ω yüke ait **iki kablolu gerçek çalışan simülasyon** açılır. UT200A başlangıçta kabloya bağlı değildir; sürükleme sırasında cihaz OFF konumundadır, böylece açık çenede yanlış uyarı penceresi oluşmaz.
- Tarayıcı gerçek fare olaylarıyla UT200A'yı, iletkenin ekran üzerinde hesaplanan orta noktasına taşır. Çenenin dünya/ekran koordinatları ayrı hesaplanır; gövde ortası değil **çene merkezi** hedeflenir.
- Kabloya yaklaşırken geçici `_clampJawOpen` durumu, SVG'nin `data-clamp-jaw-state=open` işareti ve açık çene göstergesi denetlenir; henüz `clampedWireId` oluşmamalıdır.
- Fare bırakılınca çenenin kapanması, **w1 kablosuna gerçek snap**, `clampT`, ekran üzerinde çene-kablo mesafesinin en fazla 18 piksel olması ve kablo topolojisinin **2 kablo olarak korunması** doğrulanır.
- UT200A'nın mevcut özellik panelindeki gerçek ACA kademe seçimi kullanılır. Sonrasında ölçüm durumu `warning='' `, `unit='A'` ve **1,000 A ±0,04 A** şartını sağlamalıdır.

Beklenen dört gerçek PNG: `jaw-before-drag.png`, `jaw-open-over-live-wire.png`, `jaw-snapped-closed.png` ve `jaw-current-ac-1a.png`. Başarısızlık halinde `jaw-failure-diagnostic.png` ile `report.json` mümkünse korunur.

`scripts/qa-mq05-ut200a-jaw-verify-v11920.cjs`, kaydedilmiş raporu ve dört PNG'yi **PNG CRC/IDAT, 1440×1000 boyut, bayt uzunluğu ve SHA-256** ile tekrar doğrular. Başarı için `verification.json` ve `checksums.sha256` üretilmelidir. Hata halinde `verification.failure.json`, Node/Chromium stdout-stderr ve `run-summary.json` ZIP'e girer. Chromium süresi 900 saniyeyle sınırlanır.

## Güncel kabul sınırı — 2026-10-11

**Durum: OPEN — düzeltme sonrası gerçek Windows/Chromium yeniden testi bekleniyor.** Önceki açıklamanın "hiç gerçek Windows koşusu yapılmadı" ifadesi artık güncel değildir.

- Kullanıcının gönderdiği gerçek Windows QA ZIP'i `QA_MQ05_UT200A_SONUC_20261011_200708.zip` raporunda **120/120 Node PASS**, Chromium **FAIL (exit 1)**. Üç PNG dosyasının CRC/boyut/SHA kontrolü başarılıdır; bu, dört aşamalı çene kabulünün geçtiği anlamına gelmez.
- Gerçek tarayıcı gözlemi: pens sürükleniyor, ancak çene kablo üstünde açılamıyor ve snap gerçekleşmiyor; çene-kablo uzaklığı ~70,84 px. Kablo hedefi yönlendirme sırasında zıplıyor.
- Kök neden: `dist/app.js` içindeki `componentObstacles()` pens ampermetreyi kablo rotasını etkileyen engel olarak görüyordu. Bu, pens yaklaştıkça kabloyu başka yere yönlendirip yakalama hedefini oynatıyordu.
- Düzeltme mevcut `main` üzerinde: `clamp-meter` fiziksel ölçüm aracı kabloyu iten engeller dışında tutuldu; önceki kabul edilmiş diğer cihaz engelleri korunur. İlgili regresyon testi eklendi. Önceki kaynak izolasyonunda 4/4 ve yerel uygun test ağacında 27/27 geçti; bu sonuçlar güncel HEAD'in tam Node + Windows testi değildir.
- Somut kanıt: [evidence/mq05_ut200a_windows_20261011_200708.json](../evidence/mq05_ut200a_windows_20261011_200708.json). En son kanıtın başarısızlık durumu hiçbir belgede PASS/DONE'a çevrilemez.

**Kalan kalite kapıları:** Güncel `main` ZIP'ini Windows'ta çıkarıp `QA_MQ05_UT200A_CALISTIR.bat` çalıştırmak; gerçek fare sürüklemesinde açık çene, w1'e snap, 1 A AC, değişmeyen iki kablo, 4 ayrı gerçek PNG ve SHA/CRC artefakt doğrulamasını birlikte görmek. Ardından MQ-12 kanıtı, MQ-13 depo bütünlüğü ve MQ-00 nihai kabulü kaydedilmeli. Kullanıcının açık izni olmadan Actions kullanılmaz; `BASLAT.bat` sunucusuz `file:///` davranışı değiştirilmez.
