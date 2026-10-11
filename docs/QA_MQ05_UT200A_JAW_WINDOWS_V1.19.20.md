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

## Kabul sınırı

Yeni UT200A kodunun GitHub sözdizimi ve Windows başlatıcı/test sözleşmesi statik olarak denetlenmiştir; **henüz gerçek Windows Chromium koşusu yapılmamıştır.** Bu nedenle fiziksel pens çene uçtan uca kabulü şu an **OPEN** kalır. Görsel çene açıklığı, gerçek donanımın mekanik ölçümünün değil, simülasyondaki çene durumunun göstergesidir. Kullanıcının ZIP çıktısı gelince test sonucu kanıta göre işlenecektir.
