# Güncel durum ve bilinen sınırlar

## v1.19.20 güncel kalite durumu

- Aktif çalışma dalı: `v1.19.20`.
- Release/UI/launcher kimliği v1.19.20 ile eşitlenmektedir; paket adı `APP_VERSION` üzerinden türetilir.
- Signed akım/enerji yönü, kapak sweep/clearance, asset source/orientation, MEB evidence, versioned migration, gerçek browser smoke, CI G1–G4 kalite kapıları, repo-integrity ve runtime package allowlist altyapıları uygulanmıştır.
- Physical product kapsamı ve gerçek terminal merkez koordinatları kaynak doğrulaması gerektiren açık kalite alanlarıdır; doğrulanmamış geometri verified yapılmaz.
- Güncel başarı/başarısızlık sayısı sabit belge değeri değildir; her HEAD için GitHub Actions sonucu otoritedir.
- GitHub Actions dakika tasarrufu politikası: `v1.19.20` push'ları artık otomatik workflow başlatmaz. `check.yml` yalnız `workflow_dispatch` veya ilgili pull request doğrulamasında çalışır; normal geliştirme önce hedefli/statik kontrollerle ilerler, Actions yalnız anlamlı kilometre taşında elle çalıştırılır.
- 2026-10-05 itibarıyla tam CI doğrulaması stale `work-v11920-batch` branch'i izinli branch kilidini bozduğu için fast-gate aşamasında blokludur. Bu branch `v1.19.20`'nin gerisinde ve benzersiz commitsizdir; mevcut GitHub bağlantısında branch silme aksiyonu bulunmadığından burada kaldırılamamıştır.


## Sürüm dalları

- **Golden v1.18.0:** `main` → sabit referans `e00b6fcf0ea3eb721eae8285beb7052573b61373`. Geliştirme için kullanılmaz.
- **Tamamlanmış referans sürümler:** `v1.19.0`, `v1.19.1` → değiştirilmez.
- **Aktif kalite/geliştirme:** `v1.19.20`.
- GitHub depo ayarında default branch hâlâ `main` olduğu için Code → Download ZIP doğrudan kullanılırsa golden v1.18.0 gelir; güncel kullanıcı paketi için Actions runtime artifact'ı veya açıkça `v1.19.20` dalı kullanılmalıdır.
- Server-side ruleset/branch protection bu özel repo koşulunda etkin değildir; repo lock/integrity kontrolleri CI içinde defense-in-depth sağlar.

## Tarihsel başlangıç sürümü kaydı (v1.18.0)

- Uygulama: **v1.18.0**, son tamamlanan Windows paketi.
- Kaynak ZIP: `Devre_Tasarim_Studyosu_v1.18.0_Windows.zip`, 84.068.506 bayt.
- SHA-256: `ca3590cfc66f8b9e10114acddd38de337f1828d593abd4c4849dcb8e6c8efcf8`.
- Paket içeriği: 537 dosya, 103.904.441 açılmış bayt; tümü ilk GitHub aktarımında korunur.
- Kütüphane: genişletme sonrasında 722 tanım. Bunların tümü sayısal olarak simüle edilen ayrı fiziksel ürünler değildir.
- Korunan hazır proje: 58 dosya; dashboardda ayrıca dondurulan hazır tanımlar.
- v1.18.0 kaydı: **255 test geçti**, 0 başarısız/atlanmış. Kanıt: `DOGRULAMA_v1.18.0.json`, `tests/SONUC_v1.18.0.tap`. Yeni aktarım doğrulaması ayrıca `docs/GITHUB_AKTARIM_DOGRULAMA.json` içinde kaydedilir.

## Mevcut ana kapsam

Dashboard, özel açılış uyarısı, üç çalışma alanı, yerel klasör/dosya açma-kaydetme, favoriler, şema/3D görünümler, taşınabilir notlar, elektriksel hat kimlikleri, 20 renk, serbest ölçü probları, motor/sensör davranışları, pano yerleşimi ve kablolama, V20 ve ACS800 eğitim sürücüleri, yeni tesisat/zil sembolleri ve hazır örnek koruması bulunur.

v1.18.0'ın son davranışları: çarpılma uyarısında simülasyon sürer; her temas yeniden uyarır; kullanıcı durdurmadan kablo/yerleşim değişmez; cihaz kumandaları açık kalır. Pano kabloları birbirlerinin rotasını değiştirmez.

## Tamamlanmış gibi gösterilmeyecek işler

| Alan | Gerçek sınır / kalan iş |
| --- | --- |
| PLC | Program/ladder yürütme ve PLC devresi simülasyonu yoktur; PLC/görsel I/O içeren şemanın elektriksel simülasyonu engellenir. |
| PLC görselleri | Her varyantın birebir fotoğrafı/terminal baskı hizası tamamlanmış değildir. Bazıları aile/varyant veya temsili görüntüdür. v1.14 ilk 146 varyant çalışması tam üretici kataloğu anlamına gelmez; v1.15 kapsam notları geçerlidir. |
| Sürücüler | V20 ve ACS800 belgelere dayanan davranış modelleridir. Tam üretici firmware emülasyonu, gerçek PWM/DTC fiziği ve tüm parametreler yoktur. Desteklenen işlevler iki sürücü kılavuzunda ayrı belirtilir. |
| Haberleşme | PLC programı, USS/Modbus/fieldbus/DDCS ve gerçek cihaz bağlantısı bu eğitim modelinde yoktur. Çizilmiş terminal haberleşme emülasyonu demek değildir. |
| Motor / ölçüm | Bazı akım, tork, güç ve hızlar tahminidir. Gerçek elektromanyetik geçici rejim, kayma, atalet, rejenerasyon ve bütün koruma eğrileri hesaplanmaz. |
| Pano | 3D gövde/kapak, yerleşim/kablolama ve temel kapak sweep/clearance çarpışma denetimi vardır. Tüm ürünler üretici CAD'i değildir; sac işleme, delik/imalat çıktısı, tam üretici collider/termal/servis mühendisliği tamamlanmış sayılmaz. Pano alanında elektriksel simülasyon yoktur. |
| Bina tesisatı | Çizim/bağlantı olarak işaretlenen kayıtların sayısal modeli yoktur. Kesit, seçicilik/koruma koordinasyonu ve mevzuata uygunluk hesabı yapılmaz. |
| Analog cihazlar | ENDA PID/ayar modeli eğitim içindir; tam firmware değildir. Termal proses kendiliğinden oluşmaz. DIN 43710 L termokupl eğrisi doğrulanmadığı için pasiftir. |
| Sensör/görsel | Bazı analog seçenekler eğitim uyarlamasıdır (ör. Wenglor U1KT003 fiziksel üründe analog çıkış değildir). Yerel çizim/fotoğraf uyarlaması birebir CAD olarak adlandırılmaz. |
| Dosyalar | İlk klasör erişimi kullanıcı/tarayıcı izni ister. Tarayıcı taslağı bilgisayardaki proje dosyasının yerine geçmez. |
| Tarayıcı doğrulaması | CI gerçek Chrome/Chromium ile dashboard, editör, pano ve öğretici visual smoke çalıştırır; ayrıca Windows `cmd.exe` launcher smoke vardır. Bunlar gerçek kullanıcı Windows/Edge kabul testinin ve fiziksel donanım kontrolünün yerine geçmez. |
| Kaynak ekler | Son dağıtım arşivi tüm geçmiş sohbet eklerinin arşivi değildir. Dahil PDF'ler ve yalnız atıf bulunan belgeler `KAYNAK_BELGELER.md` içinde ayrılır. |

## Belge uyuşmazlıkları

Eski kullanım/sürüm dosyaları baytları korunarak aktarıldı; tarihsel açıklamaları hâlâ içerebilir. `KULLANIM.txt` içindeki 493 kütüphane sayısı geçmiş sürüme aittir. `V20_KILAVUZU.md` son paragrafındaki yapısal düzenlemenin simülasyonu durdurduğu cümlesi güncel davranış değildir: v1.18'de işlem engellenir, simülasyon sürer. Güncel açıklama `KURALLAR_VE_KILITLER.md` ve `YENILIKLER_v1.18.0.md` içindedir.

## Tarihsel GitHub aktarım kaydı

Aşağıdaki kayıt ilk GitHub aktarım dönemine aittir ve güncel CI/release durumu değildir. GitHub aktarımı `75def69f909b621023299443ee4bb9e76d45b53f` commit'iyle tamamlandı. 553 dosyanın uzak Git nesne özetleri yerel kopyayla eşleşti; özel depo görünürlüğü korundu. İlk Actions çalışması [36419601539](https://github.com/uysal23/Devre-Tasarim-Studyosu/actions/runs/36419601539), runner atanıp herhangi bir adım çalışmadan başarısız oldu. İş günlüğü oluşmadı; ayrıntılı neden bu oturumda okunamadı. Kota/ödeme veya başka bir hesap sorunu olduğu **varsayılmamalı**, Actions açıklamasından doğrulanmalı. Yerel 255 test ve Windows ZIP çıkarma/özet kontrolleri başarılıdır. Hesap/runner sorunu çözüldüğünde aynı workflow elle yeniden çalıştırılabilir; repo görünürlüğünü değiştirmek bu işin parçası değildir.

GitHub taşıması sırasında yeni elektriksel özellik istenmedi; çalışma kaynakları ve kuralları korumaya yöneliktir. Yeni bir geliştirme isteğinde önce güncel dal/commit ve kullanıcı değişiklikleri incelenir. Yukarıdaki açık alanlar, kullanıcı öncelik vermeden tamamlandı diye işaretlenmez veya geniş çaplı yeniden yazım gerekçesi yapılmaz.

## 2026-10-03 · 1.19.1 taban düzeltmesi

- 1.19.1 dalı ilk oluşturulduğunda `main` dalındaki v1.18.0 projesi + manifestten türemişti; Arduino Atölyesi, Arduino IDE ve Öğretici Modu bu başlangıç ağacında yoktu.
- Kullanıcının uyarısı üzerine GitHub'daki `v1.19.0` dalı salt okunur alınıp `Devre-Tasarim-Studyosu-1.19.1` dalına birleştirildi. `v1.19.0` dalına commit veya dosya gönderilmedi; kilitli dal aynı bırakıldı.
- `dist/index.html` artık v1.19.0'daki dashboard kartlarını ve ilgili çalışma alanlarını içerir. Dal geçmişi artık `v1.19.0` tabanını da kapsar; manifest korunmuştur.
- `node scripts/check.cjs`: kütüphane 728 tanım, 58 korunan proje; başarılı.
- Faz 0–5 kayıtları 1.19.0 tabanı ve 1.19.0’daki Arduino/öğretici kapsamı için tekrar denetlendi; eski 31 dashboard / 58 proje sayımı güncel envanter olarak işaretlenmedi.
- Birleştirmede gelen `network()` içindeki tanımsız `now` kullanımı düzeltildi. Faz 3’te karmaşık AC fazör çözümü, DC R/C/L durumları, diyot/LED eşikleri ve köprü doğrultucu ortalama çıkışı 1.19.0’ın mevcut solver özellikleriyle birleştirildi. Dört Faz 3 hedef testi 4/4 geçti.
- Tam regresyon 1.19.1’de 427 test: 379 geçti, 48 başarısız. Temiz v1.19.0’da 423 test: 344 geçti, 79 başarısız. Başarısız test adları 1.19.1’de v1.19.0 başarısızlık kümesinin alt kümesi; yeni başarısız test yok. 1.19.1’de 31 mevcut başarısızlık artık geçiyor, ayrıca eklenen dört Faz 3 testi geçti.
- Hedefli dashboard/öğretici/ders kontrolleri 24/32 geçti; kalan sekiz test v1.19.0 tabanında da başarısız. Bu nedenle devralınmış Faz 4 ders denetimi bulguları çözülmüş değildir; Faz 4 tamamlandı sayılmaz. Gerçek Windows/Edge ve donanım doğrulaması yapılmadı.


## Arduino Atölyesi · v1.19 geliştirme sınırı

- Arduino kütüphanesinde devre/şema sembolü ile 3D/2.5D malzeme görünümü ayrı katmanlardır; terminal/pin kimlikleri iki görünümde aynıdır.
- Kullanıcının sağladığı BC327, BD139, BD140 ve TLP521 veri sayfalarından yalnız gerekli pin/temel elektriksel kimlikler türetilmiştir; PDF dosyaları projeye kopyalanmamıştır.
- BC327/BD139/BD140/TLP521 elemanları bu aşamada doğru pinli, kablolanabilir eğitim elemanlarıdır. Tam analog yarı iletken karakteristik/ısı modeli henüz gerçek cihaz SPICE modeli olarak uygulanmış sayılmaz.
- 0.91" SSD1306 128x32 Sarı OLED ve ayarlanabilir DC güç kaynağı Arduino kütüphanesinde görsel/kablolanabilir elemandır; OLED protokolünün ve güç kaynağının ayrıntılı elektronik modeli Arduino simülasyon motoru tamamlanırken genişletilecektir.


- UNO R3 görseli resmi Arduino kaynağının terminal yerleşimini referans alan yerel vektör yeniden çizimidir; Arduino marka görseli ağdan kopyalanarak çalışma zamanında çağrılmaz.
- Breadboard bağlantı modeli eğitim amaçlıdır: orta kanal iki tarafı ayırır; her kolonda A–E ve F–J beşli grupları ortaktır, güç rayları satır boyunca süreklidir. Farklı fiziksel breadboard modellerinde güç rayı kesintileri değişebileceğinden gerçek donanım ayrıca kontrol edilmelidir.


## Arduino IDE / örnek simülasyonu sınırı

- Gömülü Arduino IDE bir **eğitim IDE’sidir**; gerçek AVR-GCC, Arduino CLI veya fiziksel karta USB yükleme motoru değildir.
- 68 resmi Built-in Example başlığının tamamı uygulamada erişilebilir. Ancak UNO R3 donanımına ait olmayan Mega çoklu UART, native-USB Keyboard/Mouse ve ISP gibi örnekler açıkça uyumluluk/reference modunda etiketlenir.
- Yerleşik yorumlayıcı temel Arduino I/O ve zamanlama komutlarını simüle eder. Tam C++ dili, tüm Arduino çekirdek API'si ve üçüncü parti kütüphaneler eksiksiz emüle edilmiş sayılmaz.
- Arduino çalışma alanı tamamen çevrimdışı çalışır; resmi docs sayfaları çalışma zamanında zorunlu değildir.


## Arduino resmi örnek kaynak/simülasyon durumu

- IDE içindeki resmi örnekler kaynak depodaki gerçek `.ino` metnidir; uygulama bunları eğitim amacıyla yeniden yazılmış kod diye sunmaz.
- Resmi kodu açabilme ve UNO'ya yükleyebilme, her örneğin yerleşik sanal çalışma zamanı tarafından eksiksiz yürütüldüğü anlamına gelmez.
- Temel UNO I/O, zamanlama, ton, bazı Servo ve temel kontrol örnekleri simülasyon motorunda çalıştırılabilir. EEPROM, SPI, Wire/I²C, SD, LiquidCrystal, Stepper, SoftwareSerial, USB HID ve ileri C++ özellikli örneklerin bir bölümü halen kısmi/reference kapsamındadır.
- Kullanıcı yine de bu örnekleri orijinal haliyle inceleyebilir ve Farklı Kaydet sonrasında kendi kopyasında geliştirebilir.


## UNO R3 A000066 görsel/pinout doğruluğu

- UNO R3 kart yerleşimi için kaynak önceliği: kullanıcının sağladığı `A000066-cad-files.zip/UNO-TH_Rev3e.brd`, `A000066-full-pinout.pdf`, `A000066-datasheet.pdf` ve `A000066-schematics.pdf`.
- Kartın bağlantı terminalleri CAD'deki gerçek header koordinatlarına göre ölçeklenir. Böylece malzeme görünümündeki kablo hedefi ile görünen header deliği aynı noktadadır.
- Görsel, bu kaynaklardan türetilmiş yerel SVG yeniden çizimidir; birebir fotoğraf dokusu değildir. Elektriksel pin işlevi ve fiziksel terminal konumu görsel ayrıntıdan daha yüksek önceliklidir.
- CIPO/COPI isimleri resmi güncel pinout'a göre kullanılır; MISO/MOSI eski adları açıklama içinde eş anlamlı olarak gösterilir.


## Arduino Serial / HC-05 / LCD sınırları

- LCD 2×16 modeli, HD44780/LiquidCrystal eğitim davranışını ve ekrandaki karakterleri simüle eder; gerçek LCD'nin hassas zamanlama, özel CGRAM karakterleri ve analog VO kontrast devresi tam elektriksel model değildir.
- HC-05 sanal modeli UART/SPP veri akışı, temel AT komutları, baud ve STATE durumunu simüle eder. RF yayılımı, eşleşme kriptografisi ve Bluetooth protokol yığını bit seviyesinde emüle edilmez.
- PC dış dünya bağlantısı isteğe bağlı Web Serial köprüsüdür. Tarayıcı/işletim sistemi desteği ve kullanıcının port izni gerekir. Fiziksel HC-05 veya başka Bluetooth SPP cihazı işletim sisteminde sanal seri port olarak görünmüyorsa web uygulaması onu bu yolla açamaz.
- Web Bluetooth BLE/GATT içindir; HC-05 Classic SPP için doğrudan Web Bluetooth yolu kullanılmaz.
- Gerçek fiziksel seri/Bluetooth cihazına interaktif bağlantı bu geliştirme ortamında doğrulanmış sayılmaz; kod yolu ve sanal çift yönlü veri testleri doğrulanmıştır.


## 2026-09-29 · HC-05 PC köprüsü dayanıklılık kontrolü

- Web Serial üzerinden PC Bluetooth/SPP sanal COM köprüsü açıldığında seçilen HC-05 kimliği bağlantı süresince sabitlenir; başka modüle sessizce yön değiştirmez.
- Bağlantı açıkken HC-05 seçim kutusu kilitlenir. Port kapanır veya tarayıcı seri bağlantısının koptuğunu bildirirse okuyucu/yazıcı kilitleri temizlenir, bağlı durum kaldırılır ve seçim yeniden açılır.
- Bu düzeltme sanal/DOM düzeyindeki kod yolunu güçlendirir; fiziksel Windows Bluetooth SPP sürücüsü, gerçek COM portu ve HC-05 donanımı bu bulut oturumunda fiilen bağlanıp doğrulanmış sayılmaz.


## 2026-09-29 · Yerel ZIP / dashboard doğrulama koruması

- v1.19.0 `BASLAT.bat`, tarayıcıyı açmadan önce aynı klasördeki `dist/index.html` içinde Arduino Atölyesi işaretini ve `dist/studio.js` içinde güncel dashboard denetleyicisini doğrular.
- Eski v1.18 dosyalarıyla yeni v1.19 dosyaları aynı klasörde karışmışsa veya ZIP eksik çıkarılmışsa artık sessizce eski/ölü dashboard açmak yerine açık hata verilir.
- Dashboard atölye kartları tek tek bağlanan olaylar yerine kapsayıcı üzerinden event delegation ile açılır. Başlangıç bağımlılıklarından biri yüklenmezse dashboard üzerinde görünür başlangıç hatası gösterilir.
- Asset revision `r20260929-photoortho3` olarak yenilenmiştir.


## 2026-09-29 · Canlı simülasyon düzenlemesi

- Düzenlenebilir devrelerde simülasyon sırasında topoloji ve özellik düzenlemesi açıktır; değişiklikler solver'a canlı uygulanır.
- Yüzen Serial Monitor çalışma alanını kapatmadan simülasyon çıktısını izler.
- Kısa devre, model hasarı veya kararsız çözüm gibi mevcut arıza davranışları ayrı kalır; bunlar canlı düzenleme izninin kaldırdığı düzenleme kilidi değildir.


## 2026-09-29 · UNO kablo katmanı

- UNO R3 kartı ile bağlı kablolar malzeme görünümünde kartın üstünden görünür.
- Arduino kabloları serbest XY güzergâh sürükleme kullanır; genel klasik devre kablo sürükleme davranışı değiştirilmemiştir.


## 2026-09-29 · Arduino gelişmiş donanım doğrulaması

- LCD-I2C yazı/backlight, 7-segment, SG90, Stepper, A4988/NEMA17, HW-131, NE555 ve HC-06 davranış yolları runtime düzeyinde ayrı örnek projelerle çalıştırıldı.
- Resmi Stepper örnekleri: MotorKnob, stepper_oneRevolution, stepper_oneStepAtATime ve stepper_speedControl hatasız çalıştı; destek etiketi `full` olarak güncellendi.
- NE555 modeli fonksiyonel eğitim modelidir; gerçek analog komparatör/transistör iç devresinin SPICE çözümü değildir.
- HW-131 akım/ısıl modeli ayrıntılı güç elektroniği hesabı değildir; anahtar/jumper/kaynak/doğrudan kısa devre davranışı modellenir.


## 2026-09-29 · Arduino ortografik görsel yenilemesi

- Arduino Atölyesi malzeme görünümü internet/üretici ürün fotoğrafları ve teknik top/front-view kaynakları referans alınarak yerel SVG yeniden çizimlere taşındı.
- Arduino bileşenlerinde izometrik/perspektif sunum kullanılmaz; üst/ön görünüş esas alınır.
- UNO, breadboard, LCD/I2C, HC-SR04, SG90, A4988, NEMA17, 28BYJ-48/ULN2003, L298N, HC-05/HC-06, KY sensör ailesi, MPU6050, RTC, SD, nRF24, HX711, PIR, MQ2, toprak/yağmur sensörleri, keypad, NeoPixel ve küçük elemanlar için fiziksel tanınabilirlik güçlendirildi.
- Üçüncü taraf fotoğraflar runtime'a gömülmez; uygulama çevrimdışı kalır.
- Cache revision: `r20260929-photoortho3`.


## Arduino dijital entegre / ölçüm cihazı sınırı · 2026-09-30

CD4511, 74HC595 ve CD4017 için eğitim amaçlı dijital lojik; MCP23017 için temel register-seviyesi I²C; MAX7219 için temel seri register/digit RAM; MAX232 için lojik seviye ve byte-akışı modeli uygulanmıştır. Bunlar üretici silikonunun analog zamanlama, metastabilite, çıkış akımı, propagation delay, charge-pump dalgalanması veya tüm üçüncü parti Arduino kütüphanelerinin birebir emülasyonu değildir.

Sanal osiloskop eğitim amaçlı 0–5 V düğüm izleme aracıdır; gerçek prob empedansı, bant genişliği, aliasing, AC/DC coupling ve analog giriş korumasını fiziksel cihaz hassasiyetinde modellemez. Sinyal jeneratörü 0–5 V sınırında ideal kare/sinüs/üçgen kaynak üretir.


## HCFA X2E 400 W servo simülasyonu sınırı · 2026-09-30

- SV-X2EA040A-A + SV-X2MH040A-N2LN eşleşmesinin terminal/topoloji, kontrol modu, parametre, pulse/direction, Modbus RTU, dahili pozisyon, encoder ve temel alarm davranışları eğitim amaçlı fonksiyonel modeldir.
- U/V/W çıkışı uygulamanın mevcut elektrik ağına üç faz sürücü çıkışı olarak taşınır; motor hızı, yönü, pozisyonu, 17-bit encoder sayımı, yaklaşık tork/akım ve yük davranışı çözümlenir.
- Model gerçek inverterin IGBT anahtarlamasını, PWM taşıyıcı dalga biçimini, motorun dq-eksen elektromanyetik modelini, termal eşdeğer devresini, rezonans/oto-tuning ve tüm üretici parametrelerini mikro-saniye düzeyinde emüle etmez.
- Modbus eğitim modeli kılavuzdaki parametre adresleme kuralını, E000H kalıcı-adres ofsetini ve 3607H haberleşme DI yolunu uygular; fiziksel RS485 zamanlaması/hat empedansı bit seviyesinde çözülmez.
- Doküman görselleri çevrimdışı varlık olarak projeye gömülmüştür; çalışma zamanında internet erişimi gerekmez.


## 2026-10-01 · Öğretici Modu sınırı

- Öğretici Modu bağlantı eğitimi, mevcut elektrik solver'ını veya Arduino runtime'ını ikinci kez yazmaz; ders tamamlanınca aynı normal simülasyon motoru kullanılır.
- Rehberlik terminal kimlikleri üzerinden topoloji doğrular. Öğrencinin kabloyu ekranda hangi 90° güzergâhtan geçirdiği öğrenme başarısını değiştirmez; doğru iki terminalin bağlanması esastır.
- Öğretici oturumunda eleman yerleşimi kasıtlı olarak kilitlidir; amaç bağlantı sırasını öğrenmektir. Serbest tasarım için normal Kumanda/Tesisat/Arduino çalışma alanları kullanılmaya devam eder.
- 4–20 mA, PNP/NPN, sourcing/sinking, open-collector ve BERO anlatımları endüstriyel bağlantı mantığını öğretir; gerçek saha cihazında üretici terminal şeması, gerilim/akım sınırları ve güvenlik kuralları ayrıca uygulanmalıdır.
- Tesisat 230 VAC örnekleri yalnız simülasyon/eğitim içindir; gerçek enerjili devre üzerinde çalışma talimatı değildir.

## 2026-10-03 · Faz 10 Tesisat dersleri

Öğretici Modu'ndaki 16 Tesisat dersi ve 230 VAC adi anahtar dersi çözücü ile gözden geçirildi. Komütatör açıklaması tek fazlı devreyi doğru ifade edecek biçimde düzeltildi. Dördüncü zil dersindeki gösterge halkasının elektriksel olarak modellenmediği öğrenci açıklamasında belirtildi. 48 anahtar/buton durumu ve hedef regresyon grubu başarılıdır. Faz 10 genel kullanıcı kabulü henüz tamamlanmadı; [inceleme kaydı](FAZ_10_TESISAT_DERS_INCELEMESI.md).

## 2026-10-03 · Faz 10 Temel Elektrik dersleri

Temel Elektrik grubundaki 76 ders kaydı incelendi. Seri-paralel Ohm, Kirchhoff ve multimetre derslerinde UNI-T UT33D+ kademeleri, prob yuvaları ve ölçüm noktaları devreyle eşleştirildi; Kirchhoff gerilim çevriminde ampermetrenin seri iç yükü de ölçüme eklendi. Pens ampermetre, frekansmetre, wattmetre, kosinüsfimetre ve takometre örneklerinde desteklenmeyen sayısal simülasyon iddiaları kaldırıldı. 18 kablolu ders kararlı çözüldü ve hedefli 21/21 kontrol geçti; Faz 10 kullanıcı akışı ve kabulü açık kalır; [inceleme kaydı](FAZ_10_TEMEL_ELEKTRIK_INCELEMESI.md).

## 2026-10-03 · Faz 10 ölçüm revizyonu

- “Doğru akım kaynakları, Ohm ve devre analizi” konusu kullanıcı isteğiyle 10 dersle sınırlandı.
- Öğretici derslerde genel ampermetre/voltmetre yer tutucularının yerine UNI-T ölçü aletleri kullanılır; UT33D+ gereken kablolu ölçümlerde fiziksel kırmızı/siyah problar ve prob kabloları bulunur.
- UNI-T UT200A, kütüphanede gerçek simülasyon cihazı olarak eklendi. Pens akımı 2/20/200 A AC aralıklarında tek iletken üzerinden, kabloyu kesmeden hesaplanır; cihazın probla AC/DC gerilim, direnç, diyot/süreklilik, HOLD ve aydınlatma işlevleri eğitim modeli içinde desteklenir.
- UT33D+ AC akım ölçmediği için AC akım derslerinde yanlış UT33D+ kademesi gösterilmez; UT200A kullanılır.
- Faz 10 **kullanıcı kabulü hâlâ açıktır**. Windows/Edge üzerinde derslerin görsel/etkileşimli son incelemesi ve kullanıcı onayı alınmadan sonraki faza geçilmez.

## 2026-10-03 · Faz 10 hedefli CI doğrulaması

- Güncel 1.19.1 HEAD üzerinde Faz 10'a özel doğrulama paketi geçici CI dalında çalıştırıldı.
- Başarılı adımlar: `node scripts/check.cjs`, ilk açılış smoke testi, Faz 10 hedefli regresyon testleri, Windows ZIP oluşturma ve çıkarma doğrulaması.
- Faz 10 hedefli regresyon paketi şu dosyaları kapsadı: `clamp-meter-v119`, `tutorial-pedagogy-v119`, `lesson-circuit-audit-v119`, `tutorial-automatic-audit-v119`, `tutorial-mode-v119`, `installation-tutorial-v119`.
- GitHub Actions koşusu: `37150406898` — sonuç **success**.
- Önceki tam regresyon koşusunda Faz 10 dışındaki Arduino/V20/ACS800 vb. testlerde de başarısızlıklar görüldüğü için tam depo regresyonunun tamamen temiz olduğu iddia edilmez; Faz 10'a özgü paket temizdir.
- **Faz 10 kullanıcı kabulü hâlâ açıktır.** Windows/Edge görsel ve etkileşimli kullanıcı incelemesi ile açık kullanıcı onayı olmadan Faz 10 kapatılmaz ve sonraki faza geçilmez.

## 2026-10-04 · Tam depo regresyonu temiz

- Önceki tam regresyonda görülen Arduino, V20, ACS800, HCFA, PLC, dashboard, canlı düzenleme ve test-altyapısı hataları giderildi.
- Son iki canlı simülasyon hatası için `dist/app.js` üzerinde terminal/kablo dokunuşunun simülasyon sırasında topolojiyi değiştirmeden, yeniden çizim yapmadan yalnızca engellemeyen canlı-uyarı üretmesi sağlandı; bileşen ekleme/silme canlı düzenlemede çalışmaya devam eder.
- Hedefli son doğrulama run `37177860496`: **success**.
- Güncel 1.19.1 HEAD için tam depo doğrulama run `37177923235`: **success**.
- Tam regresyon sonucu: **448 test / 448 başarılı / 0 başarısız**.
- Aynı koşuda `node scripts/check.cjs`, ilk açılış smoke testi, regresyon testleri, Windows ZIP oluşturma/çıkarma ve artifact üretimi adımlarının tamamı başarılıdır.
- Bu sonuç otomatik teknik hata setinin temiz olduğunu doğrular; ancak Faz 10 süreç kuralı gereği gerçek Windows/Edge kullanıcı incelemesi ve kullanıcı kabulü hâlâ açıktır. Kullanıcı onayı olmadan Faz 10 kapatılmaz ve Faz 11'e geçilmez.


## 2026-10-04 · Kullanıcı incelemesi — dashboard ve proje açma düzeltmesi

Gerçek Windows/Edge kullanıcı incelemesinde dashboardda yalnız ilk üç tasarım kartının görünmesi; **Arduino Atölyesi** ile **Öğretici Modu** kartlarının görünmemesi ve daha önce oluşturulmuş projelerin açılamaması bildirildi.

- Güncel kaynak `dist/index.html` beş kartı içeriyor olsa da eski/karışık dashboard kabuğu ile yeni uygulama dosyalarının birlikte açılması olasılığına karşı çalışma zamanı bütünlük denetimi eklendi. `studio.js`, eksik Arduino/Öğretici kartlarını ve Öğretici sayfa kabuğunu açılışta tamamlar.
- Dashboard, Arduino, Öğretici, proje mağazası ve çekirdek uygulama dosyalarının tarayıcı revizyonları `1.19.1` anahtarlarına yükseltildi; HTML'e yeniden doğrulama/no-cache metaları eklendi.
- `BASLAT.bat` artık hem Arduino hem Öğretici kartını doğrular ve eski/karışık paketi açmadan önce açık hata verir.
- Önceden seçilmiş proje klasörünün Edge dosya sistemi izni oturumlar arasında beklemeye düştüğünde son proje kartları kaybolmaz. Kart tıklaması veya **Klasör iznini ver ve projeleri yükle** düğmesi kullanıcı hareketi içinde izni yeniler ve aynı dosyayı açar.
- Eski proje biçimleri için uyumluluk normalizasyonu eklendi: eksik `components/wires/junctions`, eski `devices/connections` alanları, eski çalışma alanı adları ve sayısal kimlikler açılış öncesi güvenli biçime dönüştürülür.
- Hedefli CI run `37185993148`: **success**.
- Güncel kod HEAD'i `208312dd8228df9fe6b2c3f1f21362297bf65f0b` için tam depo CI run `37187619842`: **451 / 451 başarılı, 0 hata**. Sözdizimi/bağımlılık kontrolü, ilk açılış smoke testi, Windows ZIP çıkarma doğrulaması ve artifact üretimi de başarılıdır.
- Bu bulgu gerçek kullanıcı incelemesinden geldiği için Faz 10 kabul sürecinin parçasıdır. Düzeltmenin gerçek Windows/Edge akışında kullanıcı tarafından yeniden doğrulanması gerekir; bu onay alınmadan Faz 10 kapatılmaz ve Faz 11'e geçilmez.


## 2026-10-04 · Faz 10 kabulü / Faz 11 başlangıcı

- Kullanıcının **“faz11 i yap”** talebi, kilitli manifestteki Kontrol Noktası 10 için açık geçiş onayı olarak kabul edildi.
- Faz 10 durumu: **KABUL EDİLDİ**.
- Faz 11 durumu: **ÇALIŞILIYOR**.
- Faz 11 yalnız son regresyon, build, paketleme ve GitHub Actions doğrulamasını kapsar; yeni özellik eklenmez.
- Faz 11 teknik doğrulaması tamamlanınca durum **KONTROL BEKLİYOR** olarak kullanıcıya sunulacaktır. Son kullanıcı kabulü olmadan Faz 11 kapatılmaz.


## 2026-10-04 · Faz 11 son regresyon / build

- Faz 10 kullanıcı geçiş onayıyla **KABUL EDİLDİ** durumuna alındı.
- Faz 11 kapsamında yeni özellik eklenmeden eski/yeni testler, ders/kütüphane/simülasyon regresyonları, build, Windows paketleme ve GitHub Actions doğrulandı.
- Paket sürüm denetiminde `APP_VERSION` ve `KULLANIM.txt` 1.19.1 ile eşitlendi.
- Final GitHub Actions run `37189269404`: **success**.
- Tam regresyon: **451 / 451 başarılı, 0 hata**.
- Windows paketi: `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip`.
- ZIP: 635 kaynak dosyası, 84,668,739 byte, SHA256 `6a793d0b925f5b6784f7c87077a7f66f791297c9311680be1b76a7c0f33b3f22`.
- CRC ve çıkarılan dosya hash doğrulaması başarılıdır.
- Artifact `Devre-Tasarim-Studyosu-Windows`, ID `11298685776` olarak üretildi.
- Kilitli `v1.19.0` dalı değiştirilmedi.
- **Faz 11 durumu: KONTROL BEKLİYOR.** Son kullanıcı kabulü olmadan `KABUL EDİLDİ` yapılmaz.


## 2026-10-04 · Faz 11 kullanıcı bulgusu — yeniden kur yönlendirmesi

- Gerçek kullanıcı kontrolünde **Buton ile LED / lamba yakma · 1** dersinde “Devreyi yeniden kur” sonrasında terminal-terminal rehber başlamadı ve alt çubuk `Bağlantı 0 / 0` gösterdi.
- Kök neden, son pedagojik normalizasyonun eski temel demo derslerinde `kind` alanı boşken mevcut rehber `steps` listesini silmesiydi.
- Rehberli kablolu ders sınıflandırması düzeltildi; `steps` gerçek kablolardan korunuyor/yeniden üretiliyor. Çalışma zamanına da eski/stale rehber verisini kablolardan onaran savunma eklendi.
- İki DC kaynaklı izolasyon derslerinin bilinçli elektrik adaları da audit için doğru biçimde tanımlandı.
- Hedefli Öğretici/pedagoji/devre-audit run `37192886772`: **47 / 47 başarılı, 0 hata**.
- Güncel kod HEAD'i `d0d523dbaa67ba5e25224427b5d7e4c7d375c651` için tam Faz 11 run `37192774170`: **success**.
- Tam regresyon: **454 / 454 başarılı, 0 hata**.
- Windows paketi: `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip`; 635 dosya, 84,671,038 byte, SHA256 `623e0bc530b106cdfd8254cdba13c869add64cf105936ddd029885fc17ed8ea8`.
- ZIP CRC ve çıkarılan dosya hash doğrulaması başarılı; artifact ID `11299852031`.
- Kilitli `v1.19.0` dalı değiştirilmedi.
- **Faz 11 durumu: KONTROL BEKLİYOR.** Kullanıcı gerçek Windows/Edge akışında yeniden-kurma yönlendirmesini doğrulamadan Faz 11 kabul edilmiş sayılmaz.


## 2026-10-04 · Windows BASLAT.bat kullanıcı bulgusu

- GitHub kaynak ZIP'inden `BASLAT.bat` ile uygulamanın açılmaması kullanıcı tarafından bildirildi.
- Kaynak ZIP'in içinden doğrudan BAT çalıştırılması artık algılanır ve **Tümünü ayıkla / Extract All** talimatı verilir.
- `BASLAT.bat` Edge → Chrome → Windows varsayılan HTML uygulaması sırasıyla güvenli başlatma dener; hata halinde `dist\index.html` yolunu gösterir.
- Alternatif kök başlatıcı `BASLAT.html` eklendi.
- CI'ye gerçek `windows-latest` / `cmd.exe` launcher smoke testi eklendi.
- Final run `37194288287`: **success**; Windows launcher job ve normal paketleme job'u ikisi de başarılı.
- Tam regresyon: **455 / 455 başarılı, 0 hata**.
- Yeni v1.19.1 ZIP: 636 dosya, 84,674,296 byte, SHA256 `3433fce9323713d1ff7ded56bc5e3b83f0703b1d300671eac2428a01dd97bfba`; artifact ID `11300362804`.
- Faz 11 **KONTROL BEKLİYOR**; gerçek kullanıcı Windows açılışı yeniden doğrulanmalıdır.


## 2026-10-04 · Faz 11 kabulü ve branch sadeleştirme

- Kullanıcı Faz 11'i açıkça tamamlanmış kabul etti; Faz 11 durumu **KABUL EDİLDİ**.
- GitHub'daki 44 branch güvenli biçimde incelendi. Geçici `ci/*` dallarındaki ayrık commitler yalnız test koşucusu, geçici debug testleri veya CI tetik dosyalarıydı; korunması gereken ayrı uygulama özelliği bulunmadı.
- Kalıcı branch yapısı üç dala indirildi: `main` = v1.18.0 golden, `v1.19.0` = tamamlanmış ara sürüm, `v1.19.1` = güncel sürüm.
- `main` HEAD: `e00b6fcf0ea3eb721eae8285beb7052573b61373`.
- `v1.19.0` HEAD değişmeden `6846c6ee7df1c2f194eabf4fd58035d4423e8508` olarak korundu.
- Branch temizlik GitHub Actions run'ı `37195483833` başarıyla tamamlandı; tek kullanımlık workflow daha sonra kaldırıldı.


## 2026-10-04 · v1.19.20 Master Quality Agent Program başlangıcı

- Yeni aktif kalite/geliştirme dalı `v1.19.20`, tamamlanmış `v1.19.1` dalından oluşturuldu.
- `main`, `v1.19.0` ve `v1.19.1` referans sürümler olarak korunur.
- Kullanıcının Master Quality Agent Programı `V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md` altında LOCKED olarak kaydedildi.
- Ajan sorumluluk matrisi, dört operasyon hattı, tek-yazar dosya disiplini, G0–G8 kalite kapıları ve geçici branch yasağı `docs/AGENT_TEAM_V1.19.20.md` içinde tanımlandı.
- Bu sürümde kalite programı yalnız raporlama yapmayacak; P0/P1 sorunları kanıt → kök neden → düzeltme → test → regresyon → Master onay döngüsüyle ele alınacaktır.


## 2026-10-04 · MQ-13 GitHub süreklilik ve repo organizasyonu ajanı

- Kullanıcı talebiyle ajan takımına **MQ-13 — GitHub Süreklilik, Repo Organizasyonu ve Çalışma Kalitesi Ajanı** eklendi.
- MQ-13, MQ-00 Baş Ajan / Teknik Direktörle uyumlu yatay destek rolüdür.
- Sorumluluk: repo dosya/klasör organizasyonu, branch/commit/Actions düzeni, kalite kanıtlarının izlenebilirliği, durum ve operasyon belgelerinin güncelliği ve sonraki çalışma turunun repo üzerinden kesintisiz sürdürülebilmesi.
- Rol varsayılan olarak non-blocking tanımlandı; diğer ajanların rutin GitHub işlerine ek onay veya gereksiz bürokrasi getirmez.
- Sadece yanlış dal, kilitli ref değişikliği, veri/dosya kaybı, kırık path/import, paket dışı kritik dosya ve geri dönüşü zor repo bütünlüğü sorunları MQ-00'a kritik olarak yükseltilir.
- docs/AGENT_TEAM_V1.19.20.md, AGENTS.md ve kilit kuralları bu rolle eşitlendi.


## 2026-10-04 · MASTER QUALITY AUDIT v2

- Kapsamlı kalite gözden geçirmesi `docs/MASTER_QUALITY_AUDIT_V2.md` olarak kaydedildi.
- Son CI run `37196915999`: 455/455 regresyon, package hash/CRC ve Windows launcher smoke başarılı.
- Buna rağmen dört P0 release blocker doğrulandı: gerçek ürün mm veri sistemi, terminal fiziksel koordinat sözleşmesi, signed enerji/akım yönü, pano kapak/plate 3B collision/clearance.
- P1 backlog: digital twin kaynak statüsü, asset front-view/exact-family kalite, MEB metadata, gerçek browser görsel test, G1–G4 CI validatorları, v1.19.20 sürüm kimliği, versioned migration, doküman/GitHub devamlılık temizliği.
- Uygulama mevcut regresyon açısından kararlı; Master Quality hedefi açısından henüz release-quality kabul edilmez.


## 2026-10-04 · MASTER QUALITY AUDIT v3 — ajan çapraz doğrulaması

- V2 bulguları MQ uzmanlık hatlarıyla ikinci kez çapraz denetlendi.
- Dört P0 bulgu aynen doğrulandı; geri çekilen P0 olmadı.
- Signed-flow bulgusu daha kesin ifade edildi: energized animasyon vardır, fakat solver-türevi signed yön bilgisi yoktur.
- Yeni bulgular: asset source authority/provenance sınıflandırması, repo-lock tamper-resistance sınırı, docs-only full CI verimsizliği ve runtime paketin tüm tracked repo dosyalarını taşıması.
- Tüm binary assetlerin piksel düzeyinde front-view audit'i henüz tamamlanmadığı için WP-016 ayrı audit işi olarak açıldı.
- Bundan sonraki kalite standardı: uzman → çapraz uzman → MQ-12 test kanıtı → MQ-13 repo süreklilik → MQ-00 nihai karar.


## 2026-10-04 · Zorunlu ajan çalışma metodunun kilitlenmesi

- V2 ve V3 kalite sonuçları `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` altında tek backlogta birleştirildi.
- Bundan sonraki zorunlu süreç `V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md` olarak repo içinde kilitlendi.
- Kalıcı sıra: lider uzman → çapraz uzman → MQ-12 test → MQ-13 repo süreklilik → MQ-00 Teknik Direktör.
- İlgili G0–G8 kalite kapıları tamamlanmadan iş DONE yapılamaz.
- İlk teknik çalışma paketi WP-001 / MQ-P0-001 Physical Dimension / Digital Twin Schema olarak sırada tutulur.


## 2026-10-04 · Teknik Direktör yönetimli aktif takım modeli

- Kullanıcı talebiyle ajan takımının yalnız kontrol aşamalarında değil tüm çalışma sürecinde aktif kullanılması kalıcı kural haline getirildi.
- MQ-00 Teknik Direktör doğru uzman kombinasyonunu seçer ve işi koordine eder.
- Minimum aktif ekip: MQ-00 + lider uzman + çapraz uzman + MQ-12 + MQ-13.
- Alan etkisine göre MQ-01…MQ-11 arasındaki diğer uzmanlar eklenir.
- Zorunlu orkestrasyon `V1.19.20_TECHNICAL_DIRECTOR_ORCHESTRATION_LOCKED.md` altında kilitlenmiştir.


## 2026-10-04 · WP-001 M1/M2 ve WP-002 contract foundation

- Physical product registry ve component→product mapping eklendi.
- Verified fiziksel ölçüler ile aktif panel layout geometrisi ayrıldı; terminal/render hazır olmayan ürünler staged kalır.
- V20 6SL3210-5BB21-5UV1 ölçüsü Siemens ürün verisiyle 90×160×147 mm olarak düzeltildi.
- Physical terminal anchor sözleşmesi eklendi; exact visual şartı kod seviyesinde doğrulanıyor.
- Mevcut ürünlerden hiçbiri fiziksel terminal anchor bakımından verified yapılmadı; terminal konumu uydurulmadı.
- WP-001 ve WP-002 ana P0 kayıtları kapsam tamamlanana kadar açık kalır.
- Son doğrulanan run: `37206171985` → SUCCESS.
