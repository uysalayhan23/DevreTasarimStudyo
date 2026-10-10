# Güncel kurallar, kilitler ve istisnalar

Temel davranış: golden v1.18.0, 28 Eylül 2026 GitHub aktarımı. v1.19.0 ve v1.19.1 tamamlanmış referans sürümlerdir. Aktif geliştirme ve kalite dalı yalnız v1.19.20'dir. Bunlar mevcut kullanıcı kararlarını ve uygulama davranışını koruma notlarıdır. Sonraki açık kullanıcı isteği bir davranışı değiştirebilir; değişiklik ilgili kod/test/belgede birlikte yapılır. Dosya izinleri ya da GitHub dal koruması yerine geçmez.

## 1. Hazır örnek koruması

- Dashboard örnek tanımları iç içe `Object.freeze` ile dondurulur. Örneğin çalışan kopyası `defaultTemplate: {id, readOnly: true}` taşır. Paketteki 58 `.odsdevre` dosyası da korunur.
- İnceleme, kamera, yakınlaştırma ve simülasyon serbesttir. Yapısal, özellik, not/etiket ve pano düzenlemeleri engellenir; kullanıcıya **Farklı Kaydet** gösterilir.
- Başarılı Farklı Kaydet yeni `projectId` üretir, `sourceExample` kaynağı saklar, yalnız yeni kopyadaki `defaultTemplate` kaldırılır. Dosya gerçekten yazılmadan etkin örnek düzenlenebilir hale gelmez.
- İptal, disk/yazma hatası veya reddedilen izin korumayı kaldırmaz. İndirme yönteminde tarayıcının indirmeyi bitirdiği doğrulanamaz; özgün örnek kilitli kalır, indirilen kopya Dosyadan Aç ile açılır.
- Özgün dosya veya başka bir korunan örnek, Farklı Kaydet hedefi seçilse bile üzerine yazılamaz. Korunan örnekler otomatik taslakla değiştirilmez.
- Geçici simülasyon durumu durdurmada/ana sayfaya dönüşte başlangıca döner. Korunan örnekten Farklı Kaydet başlangıç devresini kopyalar.
- Kullanıcının kişisel ve koruma etiketi taşımayan eski projeleri salt okunur yapılmaz. Koruma uygulama içindedir; işletim sistemi dosyası ayrıca dışarıdan değiştirilebilir.

Kod: `dist/project-store.js`, `dist/studio.js`, `dist/app.js`, `dist/panel-editor.js`. Test: `tests/protected-examples-v118.test.cjs`, `tests/project-store.test.cjs`.

## 2. Simülasyon ve elektrik uyarısı

- Uygulama açılışında Yakub'a özel uyarı; dashboardda elektrik levhası ve kalıcı güvenlik metni bulunur. “Bir daha gösterme” yalnız açılış mesajıdır; dashboarddan yeniden açılabilir.
- Simülasyon çalışırken **normal devre kablosuna, terminale, ek noktasına ve kablo düzenleme tutamaçlarına doğrudan temas** canlı düzenleme uyarısı verir; ancak işlem engellenmez ve simülasyon otomatik durmaz.
- `electricalTouch()` artık bloklayan güvenlik modalı açmaz; durum çubuğu/toast ile uyarır ve devre düzenlemesinin devam etmesine izin verir.
- Düzenlenebilir projelerde simülasyon sürerken eleman ekleme/silme, kablo bağlama/ayırma, güzergâh düzenleme, taşıma, özellik değiştirme, geri al/yinele yapılabilir. Her yapısal değişiklikten sonra simülasyon yeni devre durumuna göre yeniden çözülür.
- Etkileşimli kumanda elemanları simülasyonda normal tıklamayla çalışmaya devam eder; bunları fiziksel olarak taşımak için **Alt+sürükle** kullanılır.
- Hazır/salt-okunur örneklerin yapısal koruması devam eder. Simülasyonda canlı düzenleme izni bu korumayı kaldırmaz.
- Kısa devre, kararsız devre veya sürücünün kendi arızası gibi mevcut arıza davranışları farklıdır; “dokununca durmasın” isteği bunları kaldırmaz.
- Gerçek cihazın enerjisini kesme, boşalma süresi ve gerilimsizliği ölçme bu yazılımdaki düğmeyle gerçekleşmez.

Kod: `dist/app.js` (`guardEdit`, `electricalTouch`), `dist/safety.js`, `dist/studio.js`. Test: `tests/live-touch-v118.test.cjs`, `tests/v20-interface.test.cjs`, `tests/acs800-interface.test.cjs`.

## 3. Hat kimliği, kablo rengi ve kalınlığı

- L1/L2/L3/N/PE, DC kutupları ve ayrı kaynağın çıkış kimliği renk etiketinden bağımsız elektriksel bilgidir. Farklı besleme hatlarının doğrudan birleşmesi reddedilir.
- Hatta bağlanan terminal/kablo, hattın adını ve renk tercihini devralır. Bağlantı silinince terminal geçici bağlı kimliği bırakır; başka kablo bağlanabilir.
- Kullanılan rengin hat kilidi, o renk artık hiçbir normal devre kablosunda kullanılmıyorsa bırakılır. Eski proje yüklenirken kullanılmayan kilitler temizlenir.
- Normal kabloya başka hatta kilitli rengi atamak reddedilir. Yan menüdeki **Rengin hattı** işlemi ise mevcut hattın kablolarını uygun başka renge taşıyarak yeniden atama yapabilir; fiziksel bağlantıyı ve gerçek hat kimliğini değiştirmez. Bu iki işlem karıştırılmamalıdır.
- Yan menüde 20 renk vardır; gri de bulunur. Renk başına kesit/görünen kalınlık orantılı yönetilir. **Gerilim / kullanım** yazısı etikettir; kaynak gerilimini değiştirmez.
- TX11 ve Kobastar SB2'nin EX+/EX−, S+/S− veya SIG+/SIG− hatlarında renk serbesttir; klemens üzerinden geçişte de korunur. Bunlar genel renk kilidi oluşturmaz.
- PNP sensör çıkışı pozitif, NPN çıkışı negatif hat renk tercihine uyar. Besleme ve algılama yokken renk seçimi çıkış enerjisi oluşturmaz.
- **Pano istisnası:** bağlı kablonun rengi/kesiti bağımsız seçilebilir; diğer kablolar değişmez. Farklı kaynak hatlarını birleştirme koruması yine vardır.
- **Prob istisnası:** kırmızı/siyah ölçü kablosu devre hattının kimliği/rengi olarak kullanılmaz.

Kod: `dist/conductors.js`, `dist/probe-leads.js`, `dist/panel-wiring.js`, `dist/app.js`. Test: `tests/conductors-sensors.test.cjs`, `tests/leads-v1151.test.cjs`, `tests/instruments-lines-v1152.test.cjs`, `tests/panel-wiring.test.cjs`.

## 4. Pano ve kablo güzergâhı

- Ray veya kablo kanalı eklerken boş yer aranmaz; nesne hemen eklenip seçilir. Kullanıcı sonra taşır. Bu istisna normal cihaz yerleşiminin bütün sınırlarını kaldırmaz.
- Rayla birlikte üstündeki cihazlar ve kablo uçları taşınır. Ray silinirse cihazlar aynı konumda montaj plakasında kalır, kablolar kopmaz. Cihaz silinirse bağlı kablolar kaldırılır.
- Bir kablonun seçimi, taşınması, rota düzenlemesi, silinmesi veya listedeki sırası diğer kabloların rotasını değiştirmez. Aynı kablo kanalında çok sayıda kablo aynı çizgi üzerinden geçebilir; kabloları birbirinden kaçırma/dağıtma zorlaması yoktur.
- Terminal referansları ve elle konmuş rota noktaları kayıtta korunur. Kamera, zoom ve kapak açısı elektriksel bağlantı veya kayıtlı rota koordinatını değiştirmez.
- Kapağa ve iç plakaya bağlanan kablolarda menteşe geçiş kıvrımı korunur. Uç değiştirme iptali eski kabloyu bırakır.
- Metal uç + yalıtımlı yüksük görüntüsü otomatik çizilir. ACS800 ve TX11'e bağlı kablolar malzeme görüntüsünün altında kaybolmaz. Seçili pano kablosu üstte çizilir; problar genel en üst katmandadır.
- Pano araç çubuğu üstte yatay tek satır, grupları gölgeli ayraçlıdır; dar ekranda yatay kaydırılır.
- Pano fiziksel yerleşim/kablolama alanıdır; elektriksel simülasyon Kumanda/Tesisat şemasındadır.

Kod: `dist/panel.js`, `dist/panel-editor.js`, `dist/panel-wiring.js`, `dist/app.js`. Test: `tests/panel-route-independence.test.cjs` (24 kablo aynı kanalda), `tests/panel-wiring.test.cjs`, `tests/panel-workspaces.test.cjs`, `tests/interface-v1171.test.cjs`.

## 5. Ölçü aletleri ve analog ölçüm

- 24 V güç kaynağının L/N girişleri 220 V AC faz/nötrüne bağlanabilir; iki uçtan besleme tamamlanmadan 24 V çıkışı oluşmaz.
- UNI-T kırmızı probu aynı anda yalnız **bir** yuvaya bağlıdır: VΩmA veya 10A. Yuva değişimi var olan kabloyu taşır, ikinci kablo oluşturmaz. Eski çift bağlantılar güvenli göçle tekilleştirilir.
- Prob gövdeleri ve kalın kırmızı/siyah kablolar grid ve devre engellerinden bağımsız, geniş kıvrımlı ve en üsttedir. Hareketleri cihazları ve normal kabloları yerinden oynatmaz.
- Prob ucu terminale, ek noktasına veya normal kablonun herhangi bir yerine temasla ölçer. Asıl kablo bölünmez. Prob uzaklaşınca veya hedef kablo silinince temas kalkar.
- mA/mV/kΩ/MΩ kademeleri gösterim ölçeğini doğru çevirir: 20 mA → **20.000 mA**; kademe değişimi eski HOLD değerini temizler.
- Yanlış yuva, enerjili direnç ölçümü ve paralel akım ölçümü uyarıları korunur. Gerilim paralel, akım seri bağlanan eğitim modeliyle ölçülür.
- TX11: 0–10 V için V/G, akım için I/G; T/R köprüsü gerilim seçebilir. Uyartım ve yük hücresi sinyal bağlantısı gerekir. Serbest renk seçimi besleme ihtiyacını kaldırmaz.

Kod: `dist/probe-leads.js`, `dist/multimeter.js`, `dist/current-model.js`, `dist/instruments.js`, `dist/instrument-ui.js`. Test: `tests/probe-interface-v1151.test.cjs`, `tests/instruments-lines-v1152.test.cjs`, `tests/interface-v1152.test.cjs`.

## 5a. Yarı iletken komponentler

- BJT, MOSFET, IGBT, SCR, TRIAC, DIAC ve işlemsel yükselteçlerin fiziksel çizimi temsili paket; üretici ürünü/CAD'i değildir. Şema sembolü pin kimlikleriyle eşleşmelidir.
- Kütüphanedeki DC VBE/VGS/VGE eşikleri ve açık anahtar dirençleri ideal eğitim değeridir; gerçek ürün seçimi ve güvenli tasarım hesabı için kullanılamaz. AC anahtarlama dalga biçimi çözülmez.
- SCR/Triac mandallanması/AC komütasyonu ve DIAC AC kırılma/histerezisi yoktur. OP-AMP yalnız ideal DC açık çevrim karşılaştırıcıdır; analog yükselteç kararlılığı iddiası yoktur.
- Ayrıntılı mevcut model kapsamı `docs/FAZ_5_KOMPONENT_KUTUPHANESI.md` içinde tutulur.

## 6. Sürücü ve cihaz menü kilitleri

| Cihaz | Korunacak davranış | Kod / rehber |
| --- | --- | --- |
| V20 | Parametre yan menü düğmesi ve M tuşu; P0003 erişim seviyeleri; duruş gerektiren parametre çalışırken değişmez; P0010 ≠ 0 normal çalışmayı engeller; P3900 devreye almayı tamamlar | `dist/v20.js`, `dist/v20-ui.js`, `V20_KILAVUZU.md` |
| V20 | DIC dönüşü olmadan DI çalışmaz. AO1 akım çıkışıdır. DO2 kuru kontak, enerji kaynağı değildir. Şebeke kesilince çıkışlar kapanır | aynı |
| ACS800 | R5 için ACS800-04-0075-3; fotoğraf adındaki 0100-3 kılavuzda R6'dır. Güç ve RMIO uçları R5 eşlemesine uyar | `dist/acs800-terminals.json`, `dist/acs800-art.js`, `ACS800_KILAVUZU.md` |
| ACS800 | Grup 16 parametre kilidi ve **358** açma kodu; yerel kontrol kilidi, RUN ENABLE ve DIIL davranışı; J1/DIIL fiziksel köprüleri yalnız simülasyon duruyorken değişir | `dist/acs800.js`, `dist/acs800-ui.js` |
| ACS800 | REMOTE ve harici komut kaynağında cihaz STOP tuşu yerel STOP gibi çalışmaz; üstteki simülasyon Durdur her zaman ayrı işlemdir. 10.03 FORWARD iken DI2 yönü değiştirmez; REQUEST gerekir | aynı |
| ACS800 | AI1− AGND'ye kendiliğinden bağlanmaz; analog dönüşler bağımsız. AO1/AO2 akım çıkışı; RO1–3 kuru kontak. Besleme yokken sahte çıkış üretmez | aynı |
| ENDA ET4420 | Menü izinleri için S.Cod **442**, fabrika ayarı için **0**; ön yüz tuşları da menü kilidine uyar | `dist/instruments.js`, `dist/instrument-ui.js`, `YENILIKLER_v1.15.0.md` |
| Klemens / şalter | Kablolu terminal sırası veya kademe kaldırılmadan önce kablo ayrılmalıdır; mevcut bağlantılar sessizce silinmez | `dist/app.js`, `dist/components.js` |

Bu kodlar cihazların eğitim menü kodlarıdır, hesap parolası değildir. Gerçek firmware'in bütün parametreleri uygulanmış değildir. Testler: `tests/v20*.test.cjs`, `tests/acs800*.test.cjs`, `tests/instruments-v115.test.cjs`.

## 7. Motor, sensör ve görsel kuralları

- Üç faz motor yönü faz sırasının paritesine bağlıdır: herhangi iki fazın yerini değiştirmek yönü ters çevirir; yalnız L1–L2 değişimine bağlanmaz. Yıldız/üçgen bağlantısı iç klemens veya devrede kontaktörle kurulabilir; açık sargı yolu motoru çalıştırmaz.
- Altı uçlu motorlarda üst/alt terminal grupları ve eski terminal kimlikleri korunur. Bir fazlı motorda ana **veya** yardımcı sargının tek başına terslenmesi yönü değiştirir; ikisini birden terslemek değiştirmez. Öğretici notlar ve şema/3D yön okları korunur.
- Sensörün hedef malzemesi, algılama mesafesi/yüzü ve hareketi cihaz menüsündedir. İndüktif/kapasitif/optik tür koşulları ve besleme gereksinimi korunur. Algılama ışığı/animasyonu gerçek aktif durumu izler.
- Başlat/durdur butonları ve sinyal lambalarında seçilebilir renk; sinyal lambasında enerjiye bağlı ışık; kontaktörün üzerine istenmeyen yardımcı kontak görseli eklenmemesi korunur.
- PLC yalnız Siemens, Delta, Omron, GMTCNT marka gruplarında sunulur. PLC filtreleri Elektrik kütüphanesinde görünmez. Ön görünüşler izometrik yapılmaz; terminal isim, sayı, tür ve konumları kayıtlı modele bağlıdır. Aile/temsili görsel, birebir fotoğraf diye etiketlenmez.
- Komütatör iki bağımsız kontak; ara vaviyende kesişim birleşim değildir. Zil grubu kitap s.142 **açık şemalarını** kullanır. İstenmeyen ilave zil grubu elemanları eklenmez. Eski topraklı fiş `plug-1p-earthed` göçüyle PE kablosunu korur.
- Malzeme ve şema görüntülerinde portların tıklanabilir noktası görsel bağlantıya uymalı; görsel üstünde kablo gizlenmemelidir.
- Arduino UNO R3'e bağlı kablolar malzeme görünümünde kart gövdesinin altında kaybolmaz; kartı kesen kablo bölümü üst katmanda yeniden çizilir.
- Arduino çalışma alanındaki veya doğrudan Arduino kartına bağlı kablolarda güzergâh tutamacı serbest XY sürüklenebilir. Uçlar bağlı kalır; rota grid/90° mantığıyla sürüklenen noktadan yeniden geçirilir. Genel Kumanda/Tesisat kablo davranışı bu istisna nedeniyle değiştirilmez.

Testler: `tests/motor-upgrade.test.cjs`, `tests/conductors-sensors.test.cjs`, `tests/plc-hardware-v114.test.cjs`, `tests/installation-v118.test.cjs`.

## 8. Dosya, düzenleme ve arayüz sınırları

- Program adı ve üç çalışma alanı korunur. Tesisat malzemeleri Kumanda kütüphanesine karıştırılmaz. Favoriler sarı yıldızlıdır; grup menüsünde en üstte, Türkçe alfabetik ve çalışma alanına uygun süzülür. Kullanım alanı filtresi yeniden eklenmez.
- Not metni sayfada görünür ve taşınır; **Notu sayfada göster** kutusu metni silmeden görünürlüğü değiştirir. Konum/görünürlük/metin kaydedilir. Neon enerji göstergesi duruşta kalkar.
- Seçim, Delete, çoklu taşıma, geri al/yinele korunur. Klavye işlemleri metin girişini yanlışlıkla silme işlemine çevirmemelidir.
- Eski `.odsdevre`, `.dtsproj`, `.json` projeleri doğrulanır/göç ettirilir. Bilinmeyen malzeme veya bozuk veri hata verir; kaynak dosya otomatik değiştirilmez.
- Dosya başka uygulamada değişmişse üzerine yazılmaz; Farklı Kaydet önerilir. Yeni dosya adı çakışırsa numaralı yeni ad kullanılır. Geçici `_` alanları kayıttan temizlenir.
- Uygulama düzeyinde proje boyutu 20 MB, eleman 10.000, kablo 40.000 sınırları vardır; bunlar tarayıcı eğitimi sınırlarıdır, üretici donanım sınırı değildir. Kodun metin uzunluğu/bayt kontrolü uygulandığı giriş yoluna göre farklı olabilir.
- Tarayıcı klasör/dosya izni atlanmaz. Taslak kaydı gerçek bilgisayar dosyasına kaydetme değildir. API olmayan ortamda dosya seçme/indirme yedeği korunur.
- Uygulama tamamen yerel açılabilir. `dist/index.html` yükleme sırası, yerel resim/JS/CSS bağımlılıkları ve sürüm uyumluluğu korunur.

Kod: `dist/studio.js`, `dist/project-store.js`, `dist/workspaces.js`, `dist/catalog.js`, `dist/labels.js`, `dist/selection.js`, `dist/viewport.js`. Testler aynı adlar ve `notes`, `interface`, `app-flow` gruplarındadır.


## 9. KİLİTLİ arayüz kuralı · buton rengi ve yazı kontrastı

- **Simülasyon butonunun görünümüne dokunulmaz.** Simülasyon kapalıyken mevcut yeşil, simülasyon çalışırken mevcut kırmızı görünüm; metalik yapı, yazı rengi ve durum kontrastı korunur.
- Açık / açık-metal yüzeyli butonlarda yazı **koyu renk** olmak zorundadır. Açık yüzey üzerinde beyaz veya çok açık yazı kullanılmaz.
- Koyu renkli butonlarda yazı **açık renk** olmak zorundadır. Koyu yüzey üzerinde koyu yazı kullanılmaz.
- Hover, active, disabled ve pressed durumları da aynı kontrast ilkesini bozamaz.
- **Dashboard** butonu diğer üst araçlardan hafifçe ayrılabilir; ancak fark cırtlak/parlak olmayacak, mevcut endüstriyel metalik tema içinde düşük doygunluklu bir ton kullanılacaktır.
- Yeni eklenecek Arduino, IDE, pano, sürücü veya başka modül butonları da bu açık-yüzey/koyu-yazı ve koyu-yüzey/açık-yazı kuralına uymalıdır.
- Bu kontrast kuralı kullanıcı tarafından kilitlenmiştir; sonraki görsel düzenlemelerde sessizce değiştirilemez.

Kod: `dist/studio.css` ve ilgili modül CSS dosyaları. **İstisna:** `.simulate` kendi özel durum renklerini korur ve genel kontrast düzeltmelerine dahil edilmez.


## 10. KİLİTLİ Arduino resmi örnek koruması

- Arduino'nun resmi Built-in Example ve standart kütüphane örnekleri IDE'de **orijinal kaynak koduyla salt okunur** açılır.
- Resmi örnek **UNO karta yüklenebilir, devresi kurulabilir, test edilebilir ve desteklenen kapsamda simüle edilebilir**; salt-okunurluk simülasyonu engellemez.
- Resmi örneğin kodu veya program adı doğrudan değiştirilemez ve özgün örnek üzerine kaydedilemez.
- Kullanıcı düzenleme girişiminde bulunursa Kumanda Devre Tasarımı'ndaki hazır örnek davranışıyla aynı mantıkta **Hazır Arduino örneği korunuyor** sorgusu açılır.
- Kullanıcı ancak **Farklı Kaydet** ile isimlendirilmiş kendi çalışma kopyasını oluşturduktan sonra kodu değiştirebilir.
- Farklı Kaydet iptal edilirse özgün örnek ve kart programı değişmez.
- Düzenlenebilir kopya, kaynak resmi örneğin kimliğini yalnız referans/izlenebilirlik amacıyla taşır; koruma bayrağını taşımaz.
- Simülasyon butonunun kilitli görünüm politikası bu özellik nedeniyle değiştirilemez.


## 11. KİLİTLİ v1.19.0 dashboard ve yerel başlatma yapısı

- Dashboardda dört ana çalışma alanı birlikte korunur: **Kumanda Devreleri Tasarımı**, **Tesisat ve Dağıtım Devreleri Tasarımı**, **Pano Tasarımı**, **Arduino Atölyesi**.
- Bu dört karttan hiçbiri kullanıcı açıkça istemeden kaldırılmaz, gizlenmez, yeniden eski üç-kart yapısına döndürülmez veya başka bir başlangıç akışıyla değiştirilmez.
- Kart açılışı `#dashboard` üzerindeki merkezi event-delegation üzerinden yapılır; sessizce çalışmayan tekil `onclick` yapısına geri dönülmez.
- `BASLAT.bat` yalnız aynı paketteki `dist/index.html` dosyasını açar ve açmadan önce Arduino dashboard işaretini ve güncel `studio.js` denetleyicisini doğrular.
- Eski/eksik/karışmış paket tespit edilirse tarayıcıda ölü dashboard açmak yerine görünür hata verilir.
- Başlangıç bağımlılıklarından biri yüklenemezse dashboard üzerinde **STÜDYO BAŞLATILAMADI** uyarısı görünür; hata sessizce yutulmaz.
- Dashboard asset cache revision koruması sürdürülür. Mevcut doğrulanmış revision: `r20260929-photoortho3`.
- Bu yapı kullanıcı tarafından **kilitlenmiştir**. Sonraki geliştirmelerde ancak kullanıcının açık talebiyle değiştirilebilir; Arduino, IDE, pano veya başka özellik eklerken bu başlangıç yapısı bozulamaz.

Kod: `BASLAT.bat`, `dist/index.html`, `dist/studio.js`, `dist/studio.css`. Test: `tests/dashboard-workshops-v119.test.cjs`.


## 12. KİLİTLİ canlı düzenleme + bağımsız Serial Monitor

- Arduino bulunan projede üst araç çubuğundaki **Serial Monitor** düğmesi IDE modalını açmadan küçük yüzen monitörü açar.
- Yüzen Serial Monitor devre çalışma alanını kapatmaz; simülasyon çalışırken çıktı canlı izlenir, baud seçilebilir, RX verisi gönderilebilir ve çıktı temizlenebilir.
- Pencere başlığından taşınabilir ve masaüstünde yeniden boyutlandırılabilir. Birden fazla Arduino varsa izlenecek kart seçilebilir.
- IDE kapalı olsa bile yüzen Serial Monitor çalışmaya devam eder. Dashboarda dönülünce kapanır.
- Simülasyon sırasında düzenlenebilir devreye müdahale etme hakkı bu özellik ile birlikte kilitlidir; kullanıcı açıkça istemeden tekrar “önce simülasyonu durdur” kilidine dönülmez.


## 13. Arduino gelişmiş donanım davranışları

- LCD 2×16 paralel HD44780 ve LCD 2×16 + PCF8574 I2C birleşik modülü ayrı elemanlardır; ayrıca bağımsız I2C backpack kütüphanede bulunur. `LiquidCrystal_I2C` yolu A4/SDA ve A5/SCL bağlantısını, adresi ve backlight durumunu kontrol eder.
- 1 haneli 7-segment A–G/DP pinlerini ve ortak katot/anot seçimini gerçek dijital çıkış seviyelerinden üretir.
- SG90 horn açısı `Servo.write()` ve `writeMicroseconds()` komutlarını izler; 0–180° hareket görünür.
- 28BYJ-48 + ULN2003, Arduino `Stepper` kütüphanesini; A4988 + NEMA17 ise STEP/DIR, MS1–MS3 ve temel `AccelStepper` hareket komutlarını izler. A4988 motor hareketi için lojik ve motor besleme bağlantıları gerekir.
- HW-131 ON/OFF, sol/sağ ray 5 V / 3.3 V / OFF seçimi, kaynak varlığı ve doğrudan ray-GND kısa devresi durumunu izler.
- NE555 eğitim modeli TRIG/THRES/RESET lojik modu, astable ve monostable RC zamanlamasını uygular. Bu model SPICE düzeyinde analog yarıiletken simülasyonu değildir.
- HC-05 ve HC-06 aynı UART/SPP veri motorunu kullanır; HC-05 master/slave + KEY/AT kapsamındadır, HC-06 yalnız slave olarak modellenir.
- Bu davranışlar Arduino kütüphanesinin regresyon taban çizgisidir; sonraki görsel değişiklikler çalışma mantığını sessizce kaldıramaz.


## 14. KİLİTLİ Arduino sensör fiziksel etkileşimleri

Yukarıdaki KY-026, DHT11, potansiyometre, HC-SR04, LM35, KY-018, KY-021, KY-040, KY-023 ve KY-016 doğrudan görsel etkileşimleri kullanıcı açıkça istemeden kaldırılmaz veya salt özellik-paneli kontrolüne geri döndürülmez. Görsel tutamaç değeri ile runtime pin değeri aynı state alanını kullanmalıdır.


## 15. KİLİTLİ Arduino fiziksel paket eşlemeleri

- DC hobby motor bağlantıları alt +/− terminallerindedir.
- BC327 / BD139 / BD140 terminalleri fiziksel alt bacak uçlarıyla hizalı kalır.
- HC-05 ZS-040, HC-06 JY-MCU, SG90 ve NEMA17 ortografik ürün formu korunur.
- TLP521-1/2/4 gerçek DIP paket görünümü ve datasheet pin sayısı korunur.
- Ayrı PCF8574 backpack, 4-pin I2C tarafına ek olarak 16-pin LCD1602 VSS–K bağlantı headerını ve ayrı-backpack runtime yolunu korur.


## 16. KİLİTLİ Arduino 20 kg loadcell davranışı

- Arduino Atölyesi'ndeki 20 kg bar loadcell, 80 × 12.7 × 12.7 mm fiziksel ürün formunda ve E+/E−/A+/A− köprü uçlarıyla bulunur.
- Loadcell yanındaki kırmızı aşağı yönlü yük oku basılı tutulduğunda veya aşağı sürüklendiğinde yük artar; yukarı sürüklendiğinde azalır. Aralık 0–20 kg'dır.
- Loadcell, HX711 modülünün E+/E−/A+/A− uçlarına bağlandığında Arduino `HX711` nesnesi üzerinden `begin`, `set_scale`, `tare`, `read`, `read_average`, `get_value`, `get_units`, `is_ready`, `power_down` ve `power_up` eğitim simülasyonunu destekler.


## 17. KİLİTLİ MAX485 davranışı

- MAX485 DIP-8 pin sırası: 1 RO, 2 /RE, 3 DE, 4 DI, 5 GND, 6 A, 7 B, 8 VCC.
- MAX485 yarı-dupleks RS-485 olarak modellenir. DE=HIGH sürücüyü etkinleştirir; /RE=LOW alıcıyı etkinleştirir.
- Aynı A/B elektriksel hattındaki MAX485'ler UART/SoftwareSerial verisini taşır; baud uyuşmazlığında mevcut seri garbling modeli uygulanır.
- Görsel izometrik değildir; gerçek DIP-8 üst görünüş korunur.


## 12. KİLİTLİ v1.19.20 Master Quality Agent çalışma kuralı

- Aktif geliştirme, kalite audit'i, düzeltme, test ve dokümantasyon yalnız `v1.19.20` dalında yapılır.
- `main`, `v1.19.0` ve `v1.19.1` referans dallardır; kullanıcı açıkça istemeden değiştirilmez.
- `V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md` ana kalite anayasasıdır.
- `docs/AGENT_TEAM_V1.19.20.md` görev ayrımı, dosya sahipliği, paralellik ve kalite kapılarını tanımlar.
- Normal sohbet + GitHub dışında çalışma ortamına geçilmez; Codex ve Work Mode kullanılmaz.
- Geçici CI/debug/agent branch oluşturulmaz. Actions aynı aktif dal veya workflow_dispatch ile çalıştırılır.
- Fiziksel ölçü, terminal, nominal değer ve ürün geometrisi güvenilir teknik kaynaksız kesin veri olarak yazılamaz.
- Ana 3D/2.5D malzeme görünümü ortografik karşıdan görünüm standardına uymalıdır; perspektif/izometrik ana görünüm release blocker'dır.
- Pano malzemelerinde birebir ürün görseli zorunludur. AI ile üretilmiş, elle çizilmiş, şematik olarak yeniden çizilmiş, aile/temsili veya farklı modele ait görsel gerçek ürün görseli yerine kullanılamaz ve `exact`/panel-ready olarak işaretlenemez.
- Panel-ready görsel promotion için haricî kaynak/provenance kaydı, birebir model eşleşmesi (`exact`) ve pixel-audited `orthographic-front` birlikte zorunludur. Üreticinin resmi ürün/image/CAx kaynağı tercih edilir; uygun karşıdan görünüş yalnız güvenilir tedarikçi kaynağında bulunuyorsa model kimliği ayrıca doğrulanır.
- Kaynağı/provenance'ı kayıtlı olmayan bir PNG/JPG/WebP, görünüşü karşıdan olsa bile panel-ready kabul edilmez. Kaynak veya orientation kanıtı eksikse durum `unverified`/blocked kalır; görsel tahmin edilmez veya yeniden çizilerek tamamlanmaz.
- Gerçek pano tasarımı amacı nedeniyle fiziksel ölçek UI kolaylığı için keyfi değiştirilemez.
- Baş Ajan onayı ve ilgili kalite kapıları geçmeden hiçbir uzman işi DONE sayılamaz.


## 13. KİLİTLİ GitHub süreklilik ve repo organizasyonu ajanı

- Takıma **MQ-13 — GitHub Süreklilik, Repo Organizasyonu ve Çalışma Kalitesi Ajanı** eklenmiştir.
- MQ-13, MQ-00 Master Quality Agent / Baş Ajan / Teknik Direktör ile koordineli çalışır ve onun GitHub çalışma sürekliliği yardımcısıdır.
- Görevi geliştirmeyi yavaşlatmak değil; repo dosya yapısını, branch/commit düzenini, GitHub Actions akışını, çalışma kayıtlarını ve oturumlar arası devamlılığı düzenli tutarak diğer ajanların daha verimli çalışmasını sağlamaktır.
- Varsayılan çalışma biçimi non-blocking'dir. Rutin commit, test, Actions, dosya ekleme ve uzman ajan işlerine ekstra onay katmanı eklemez.
- Kritik olmayan klasör/isim/dokümantasyon iyileştirmeleri geliştirmeyi durdurmaz; uygun iş paketine veya backlog'a kaydedilir.
- Yanlış dala yazma, kilitli sürüm/ref değişikliği, veri/dosya kaybı, kırık import/path, önemli assetin paket dışında kalması, çalışma devamlılığının kaybolması veya geri dönüşü zor repo bütünlüğü riski kritik kabul edilir ve MQ-00'a yükseltilir.
- MQ-13 kendi başına geniş repo taşıması/refactor başlatmaz. Dosya taşıma/silme/yeniden adlandırma gerektiğinde bağımlılık, test, paketleme ve geçmiş proje etkisini ilgili uzmanlarla birlikte kontrol eder.
- Tek aktif geliştirme dalı ve mevcut geçici-branch yasağı değişmez.
- Ajan takımının teknik alan sahiplikleri değişmez; MQ-13 yatay GitHub/repo destek rolüdür.


## 14. KİLİTLİ zorunlu ajan çalışma metodu

- `V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md` kullanıcı talimatıyla kalıcı çalışma yöntemi olarak kilitlenmiştir.
- Her iş: **lider uzman → çapraz uzman → MQ-12 test → MQ-13 repo süreklilik → MQ-00 nihai karar** sırasından geçer.
- Bu zincir tamamlanmadan DONE yoktur.
- G0–G8 kapıları ilgili iş için uygulanır; N/A olan kapı gerekçesiz atlanamaz.
- Tek birleşik düzeltme listesi `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` dosyasıdır.
- Bu metod kullanıcı açıkça değiştirmedikçe sonraki tüm çalışma turlarında uygulanır.


## 15. KİLİTLİ Teknik Direktör ajan orkestrasyonu

- `V1.19.20_TECHNICAL_DIRECTOR_ORCHESTRATION_LOCKED.md` kalıcı ve zorunludur.
- MQ-00 Teknik Direktör, ajan takımını bütün süreç boyunca aktif biçimde yönetir.
- Minimum aktif ekip: MQ-00 + lider uzman + farklı risk alanından çapraz uzman + MQ-12 + MQ-13.
- İlgili sistem etkisi varsa diğer uzmanlar zorunlu olarak eklenir.
- Her ajan her işe dahil edilmez; MQ-00 en etkili uzman kombinasyonunu seçer.
- Planlama → audit → design review → fixing → crosscheck → verify → regression → repo review → master review zincirinde gerekli uzman katılımı kaydedilir.
- Bu kayıt ve ilgili G0–G8 kanıtı olmadan DONE yoktur.
