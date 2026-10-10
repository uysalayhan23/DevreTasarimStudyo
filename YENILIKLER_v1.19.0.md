# Devre Tasarım Stüdyosu v1.19.0

## Başlangıç

v1.19.0 geliştirme hattı, v1.18.0 golden sürümünün sabit commit'i `e00b6fcf0ea3eb721eae8285beb7052573b61373` üzerinden birebir oluşturuldu.

Bu ilk v1.19.0 durumunda elektriksel davranış, kütüphane, hazır örnekler, pano rotaları, ölçüm modeli, PLC sınırları veya sürücü eğitim modelleri değiştirilmedi. Yalnız sürüm kimliği, geliştirme dalı politikası ve bu dala ait test otomasyonu başlangıcı güncellendi.

## Golden v1.18.0

- `main` ve `golden/v1.18.0` geliştirme için kullanılmaz.
- Golden referans: `e00b6fcf0ea3eb721eae8285beb7052573b61373`.
- v1.18.0 tarihsel doğrulama/test dosyaları değiştirilmez.
- Sunucu tarafı branch-protection/ruleset ancak GitHub repo ayarlarından uygulanabilir; bağlı araç bunu yazamadığı için uygulanmış sayılmaz.

## Aktif geliştirme

Bu sohbetten sonraki geliştirmeler, kullanıcı açıkça başka bir karar vermedikçe `v1.19.0` dalında yapılır.


## Görsel arayüz iyileştirmesi

- UI'ye hafif 3D/kabartma hissi veren, yalnız CSS tabanlı görsel katman eklendi.
- Butonlarda hafif gölge, üst parlaklık ve basma hissi; kart/panellerde katman derinliği; giriş alanlarında hafif iç gölge kullanıldı.
- Elektriksel davranış, simülasyon, proje verisi, eleman kimlikleri ve yerleşim mantığı değiştirilmedi.
- Değişiklik ayrı commit olarak tutulur; istenirse bu commit geri alınarak önceki düz görünüme dönülebilir.


## Premium 3D arayüz geçişi

- Ana dashboard, çalışma alanı, araç çubukları, kütüphane, özellik paneli, kartlar, sekmeler, giriş alanları, kaydırıcılar ve durum çubuğu için daha bütünlüklü endüstriyel 3D yüzey dili uygulandı.
- Butonlarda yüzey parlaması, alt gölge, fiziksel basma hissi ve durumlara göre farklı derinlikler eklendi.
- Pano çalışma alanı, modal pencereler, V20 ve ACS800 parametre ekranları aynı görsel dile yaklaştırıldı.
- Güvenlik uyarılarının renk ve okunabilirlik önceliği korunmuştur.
- Değişiklik yalnız CSS ve sürüm notundan oluşur; simülasyon ve elektriksel davranış değiştirilmemiştir.
- Bu görsel geçiş ayrı commit olarak tutulduğu için istenirse tek başına geri alınabilir.


## Buton okunabilirliği ve simülasyon renkleri

- Metalik/3D yüzey korunurken buton yazılarının kontrastı yükseltildi.
- Açık metalik butonlarda koyu ve net metin; koyu/renkli butonlarda beyaz metin kullanıldı.
- Simülasyon hazır/bekleme durumunda metalik yeşil, simülasyon çalışırken metalik kırmızı olarak sabitlendi.
- PLC içeren ve simülasyona izin verilmeyen durumdaki devre dışı buton güvenlik/işlev göstergesi olarak gri bırakıldı.
- Değişiklik yalnız CSS görsel durumlarını etkiler; simülasyon mantığı değiştirilmedi.


## Açılıp kapanabilen Özellikler paneli

- Sağdaki Özellikler paneli masaüstünde kullanıcı isteğiyle tamamen kapatılabilir.
- Panel kapandığında orta çalışma alanı boşalan sağ alanı kullanacak şekilde genişler.
- Sağ kenarda metalik "Özellikler" açma sekmesi görünür; buradan panel tekrar açılır.
- Dar ekranlarda mevcut kayan panel davranışı korunur ve aynı aç/kapat kontrolü kullanılır.
- Bir eleman seçildiğinde dar ekranda Özellikler panelinin otomatik açılması korunmuştur.
- Değişiklik proje/simülasyon verisini etkilemez; yalnız panel görünürlüğü ve yerleşim davranışıdır.


## Koyu metalik butonlarda metin kontrastı

- Koyu metalik butonların yazıları açık beyaz tona alınarak okunabilirlik yükseltildi.
- Üst araç çubuğu, birincil butonlar, aktif pano kontrolleri, aktif marka filtreleri, Özellikler açma sekmesi ve sürücü pencerelerindeki koyu kontroller kapsandı.
- Metalik yüzey ve gölge yapısı korunmuştur.
- Simülasyon butonunun renk, yazı veya durum görünümüne bu değişiklikte dokunulmamıştır.


## Kablo güzergâhını doğrudan sürükleme

- Devre tasarımında kablonun yatay/dikey parçasını doğrudan tutup sürükleme davranışı görünür hale getirildi; dikey parça sağ/sol, yatay parça yukarı/aşağı taşınır.
- Pano tasarımına kablo gövdesinden doğrudan güzergâh sürükleme eklendi. Önce küçük bir sürükleme eşiği aşılır; yalnız seçmek için tıklamak güzergâhı değiştirmez.
- Terminale bağlı ilk/son kısa çıkış parçaları sabit tutulur; kablonun bağlı olduğu terminaller değişmez.
- Tek kablo düzenlenir; diğer pano kablolarının kayıtlı güzergâhları değiştirilmez.
- Rekor/spiral gibi bir aksesuar tarafından yönlendirilen kablo elle sürüklenirse yalnız o kablo manuel güzergâha geçer.
- Değişiklik ayrı commit olarak tutulur ve istenirse tek başına geri alınabilir.


## Açılış güvenlik butonu yazı rengi

- Açılış güvenlik mesajının altındaki onay butonunun yazısı koyu renge alındı.
- Butonun metalik yapısı ve diğer kontroller değiştirilmedi.


## Kabloyla birlikte ek noktası taşıma

- Devre tasarımında sürüklenen yatay/dikey kablo parçası doğrudan bir ek noktasına bağlıysa ek noktası da aynı eksende kabloyla birlikte taşınır.
- Ek noktasına bağlı diğer dalların elektriksel bağlantısı korunur; yalnız geometrileri yeni ek noktası konumuna göre yeniden çizilir.
- İç segmentlerde veya ek noktasına bağlı olmayan kablolarda önceki sürükleme davranışı değişmez.
- Escape/iptal durumunda hem kablo güzergâhı hem ek noktası eski konumuna döner; Undo ile işlem tek adımda geri alınır.


## Ek noktası için akıllı kablo uzatma

- Kablo parçası bir ek noktasına bağlıyken ek noktası artık her sürüklemede zorla taşınmaz.
- Ek noktasına bağlı diğer kollar, ek noktası hareket ettiğinde düz kalabilecek yöndeyse ek noktası kabloyla birlikte taşınır.
- Ek noktasını taşımak başka bir dalı gereksiz kıracaksa ek noktası yerinde kalır; yalnız sürüklenen kabloya 90° geçişli kısa uzatma eklenir.
- Böylece özellikle yatay parçayı yukarı/aşağı sürüklerken ortak ek noktası yüzünden diğer kabloların kırılması azaltılır.
- Elektriksel ortaklık, terminal bağlantıları, Undo ve Escape geri alma davranışları korunur.


## Metalik buton metin kontrastı düzeltmesi

- Üst araç çubuğundaki açık metalik düğmelerin yazıları koyu renge alındı.
- Gerçekten koyu yüzeyli düğmelerde açık/beyaz yazı korunur.
- Açılış güvenlik onay düğmesindeki koyu yazı tercihi korunmuştur.
- Simülasyon düğmesinin renkleri, yazısı ve durum görünümü bu değişiklikte değiştirilmedi.


## Panel ampermetre / voltmetre canlı ekranı ve kütüphane temizliği

- Kütüphanedeki panel ampermetre ve voltmetre, simülasyon çalışırken hesaplanan gerçek ölçüm değerini kendi ekranının üzerinde gösterir.
- Aktif ölçüm ekranı yeşil aydınlatmalı LCD görünümündedir; simülasyon durunca ölçüm verisi temizlendiği için aydınlatmalı canlı ekran kapanır.
- Küçük akımlar mA, küçük gerilimler mV olarak ölçeklenerek okunabilir gösterilir; normal değerlerde A ve V kullanılır.
- Ohm metre ve Enstrümantasyon Sensörü kullanıcı kütüphanesinden kaldırıldı.
- Eski kayıtlı projelerin bozulmaması için bu iki malzemenin dahili tanımları korunur; yalnız yeni malzeme kütüphanesinde gösterilmez.


## Dashboard, kütüphane sekmeleri ve panel metre ekran hizası

- Üstteki Dashboard düğmesinin yazısı koyu renge alındı; diğer üst araç çubuğu düğmelerine dokunulmadı.
- Elektrik ile PLC / Otomasyon kütüphane sekmeleri esnek genişlik ve yazı boyutu kullanır; panel genişliğine göre birlikte büyüyüp küçülür ve metin düğme içinde kalır.
- Ampermetre/voltmetre canlı ölçüm katmanı, açıklama katmanından çıkarılıp doğrudan panel metre malzeme görselinin içine taşındı.
- Canlı LCD alanı orijinal ekran bölgesi içinde kırpılır; cihaz büyütülüp küçültüldüğünde ve döndürüldüğünde malzemeyle birlikte ölçeklenip hareket eder.
- Simülasyon düğmesinin görünümü değiştirilmedi.


## Otomatik taslak kaydı ve sayfa kapatma koruması

- Yapısal devre/pano değişiklikleri kullanıcı Kaydet düğmesine basmadan otomatik olarak tarayıcı taslağına yazılır.
- Otomatik kayıt gecikmesi 350 ms olarak ayarlandı; sekme/sayfa kapanırken son taslak ayrıca senkron olarak yazılır.
- Dosya kopyasına ayrıca kaydedilmemiş bir değişiklik varsa tarayıcının standart sayfadan ayrılma uyarısı etkinleşir.
- Tarayıcı güvenlik modeli nedeniyle kapanış penceresinin düğme metinleri uygulama tarafından "Kaydet / Kaydetme" şeklinde özelleştirilemez; kullanıcı sayfada kalırsa Kaydet ile .odsdevre dosyasına yazabilir.
- Başarılı Kaydet / Farklı Kaydet işleminden sonra dosya-değişiklik uyarısı temizlenir.


## Arduino Atölyesi · temel çalışma alanı

- Dashboard'a dördüncü çalışma alanı olarak Arduino Atölyesi eklendi.
- Arduino UNO R3 ile geniş bir hobi kütüphanesi eklendi: LED/RGB LED, direnç, buton, potansiyometre, LDR, LM35, toprak/yağmur/gaz/ses/alev sensörleri, PIR, reed, DHT11, HC-SR04, joystick, encoder, buzzer, SG90, röle, DC/step motor, L298N, LCD/OLED/7-segment/NeoPixel, keypad, RTC, MPU6050, microSD, nRF24L01 ve HX711.
- Arduino malzemeleri kendi çalışma alanında ayrı tutulur; Arduino UNO ayrıca Kumanda Devreleri alanında da kullanılabilir.
- Arduino UNO ve modüller için ölçeklenebilir SVG malzeme görselleri eklendi.


## KİLİTLİ · buton kontrast politikası

- Simülasyon butonunun mevcut yeşil/kırmızı metalik görünümü kilitlendi; genel buton renk düzenlemelerinin dışında tutulur.
- Açık metalik butonlarda koyu, koyu butonlarda açık yazı zorunlu arayüz kuralı olarak belgelendi.
- Dashboard butonu, üst araçlardan yalnız hafifçe ayrılan düşük doygunluklu çelik-mavi/teal metalik tona geçirildi; koyu yazı kontrastı korundu.
- Bu kural Arduino ve daha sonra eklenecek bütün yeni modül butonları için de geçerlidir.


## Arduino kütüphanesi · şema + 3D/2.5D görünüm ve elektronik parçalar

- Arduino kütüphanesindeki Arduino UNO ve hobi modülleri için özel devre/şema sembol katmanı eklendi; malzeme görünümü ayrı 3D/2.5D SVG görünümünü korur.
- Arduino çalışma alanında ana kütüphanedeki temel Direnç, Potansiyometre, Kondansatör, Diyot, Köprü Redresör ve Toprak elemanları da kullanılabilir.
- Ayarlanabilir masa tipi DC güç kaynağı eklendi; 0–30 VDC çıkış ve 0–5 A akım limiti Özellikler panelinden ayarlanır.
- 0.91" 128x32 SSD1306 I2C Sarı OLED LCD eklendi; GND / VCC / SCL / SDA pinleri ve sarı ekranlı malzeme görünümü vardır.
- Yüklenen dokümanlara göre BC327 PNP, BD139 NPN, BD140 PNP ve TLP521-1 / TLP521-2 / TLP521-4 optokuplörleri eklendi.
- BC327 doküman pinleri 1=C, 2=B, 3=E; BD139 doküman pinleri 1=E, 2=C, 3=B; BD140 ST doküman pinleri 1=B, 2=C, 3=E olarak ayrı ayrı korunur.
- TLP521 ailesinde DIP-4 / DIP-8 / DIP-16 kanal pinleri dokümandaki Anot, Katot, Emitter ve Collector sırasına göre tanımlandı.
- 100 nF seramik ve 100 µF elektrolitik kondansatör, 1 kΩ direnç, 1N4148 ve 1N4007 diyot da Arduino elektronik grubuna eklendi.


## UNO R3 resmi pinout referansı + breadboard

- Arduino UNO R3 3D/2.5D görünümü, resmi UNO R3 ürün sayfası ve A000066 Full Pinout referansı ile yeniden çizildi; uygulama çevrimdışı kaldığı için dış görsel çağrısı yapılmaz.
- D0–D13, A0–A5, SDA/SCL, AREF, IOREF, RESET, 3V3, 5V, GND, VIN ve iki ICSP başlığı dahil terminal noktaları kablo bağlantısına açık bırakıldı.
- Arduino kütüphanesine 830 nokta sınıfında breadboard eklendi. A–E / F–J kolon bağlantıları ve güç rayları kablo ağına gerçek bağlantı grubu olarak tanımlandı.


## Gömülü Arduino IDE + 68 resmi Built-in Example başlığı

- Sol kütüphane paneline gömülü Arduino IDE açma düğmesi eklendi.
- IDE; kart seçme, program adı, satır numaralı sketch editörü, eğitim doğrulaması, karta yükleme, programlı kart kaydetme ve Seri Monitör içerir.
- Arduino Built-in Examples sayfasındaki 68 örnek başlığın tamamı 10 resmi kategori altında çevrimdışı indekse eklendi.
- UNO R3 dışındaki Mega, native USB ve ISP odaklı örnekler uyumluluk etiketiyle referans modunda ayrılır; uygulama bunları yanlış biçimde UNO R3'te tam simüle edilmiş gibi göstermez.
- Arduino Atölyesi’nde örnek açıldığında uygun eğitim devresi otomatik hazırlanır; dış donanım gerektirmeyen veya kart-özel örneklerde UNO/breadboard referans çalışma alanı açılır.
- Programlı Arduino UNO, isim ve sketch ile yerel kütüphaneye kaydedilebilir ve Kumanda Devreleri alanındaki Arduino sekmesinden tekrar eklenebilir.


## Resmi Arduino örnekleri · orijinal kod + Farklı Kaydet koruması

- Önceden eğitim motoruna uyarlanmış örnek kod dizini yerine Arduino'nun resmi kaynak depolarından alınan orijinal `.ino` içerikleri kullanılıyor.
- Toplam **109 resmi sketch** çevrimdışı IDE indeksine alındı: Arduino Built-in Examples ile UNO/AVR standart EEPROM, SPI, SoftwareSerial, Wire ve resmi Servo, LiquidCrystal, Stepper, SD kütüphane örnekleri.
- Resmi örnek açıldığında editör ve program adı salt okunurdur; kaynak depo, dosya yolu ve lisans bilgisi IDE'de gösterilir.
- Resmi örnek doğrudan UNO karta yüklenebilir ve mevcut simülasyon motorunda denenebilir.
- Düzenleme girişimi, hazır devre örnekleriyle aynı mantıkta koruma penceresi açar; **Farklı Kaydet** tamamlanmadan kod düzenlenemez.
- Farklı kaydedilen çalışma kopyası isimlendirilir, yerel Programlı Arduino Kartlarım alanına kaydedilir ve bundan sonra düzenlenebilir.


## Dashboard açılış kilitlenmesi düzeltmesi

- Arduino kütüphanesi entegrasyonunda `renderLibrary()` içindeki iki kart olay bağlayıcısında tek-eleman seçicisi yanlışlıkla kullanıldığı için açılış JavaScript'i kesiliyordu.
- Kütüphane kartları yeniden çoklu seçici ile bağlanıyor; `DTSEditor` ve dashboard olayları normal şekilde kurulabiliyor.
- Düzeltme yalnız başlangıç/kütüphane olay bağlama hatasını giderir; Simülasyon butonunun görünümü ve davranışı değiştirilmedi.


## Arduino UNO R3 görseli ve pinout'u A000066 CAD'e göre yeniden düzenlendi

- UNO R3 kart boyutu ve terminal konumları, kullanıcının sağladığı `UNO-TH_Rev3e.brd` Eagle CAD dosyasındaki fiziksel koordinatlardan yeniden çıkarıldı.
- Önceki temsili yerleşimde alt kenarda bulunan D0/D1 dahil tüm dijital header artık gerçek karttaki gibi üst kenarda ve doğru sırada.
- SCL/SDA, AREF, GND, D13–D0; POWER/IOREF/RESET/3V3/5V/GND/VIN; A0–A5 ve iki ayrı 3x2 ICSP başlığı fiziksel yerlerine taşındı.
- 3D/2.5D görünüm; USB-B, DC jack, RESET, ATmega16U2, ATmega328P DIP, kristal, regülatör, elektrolitik kapasitörler, ICSP başlıkları ve L/TX/RX/ON LED'leriyle A000066 top-view yapısına göre yeniden çizildi.
- IEC kart sembolü de aynı A000066 pinout düzenini kullanacak şekilde top-view pinout sembolüne çevrildi.
- UNO için 2.54 mm header aralığından türetilen hassas terminal koordinatları artık genel 10 px grid'e yuvarlanmıyor; diğer elemanların grid davranışı değişmedi.


## LCD 2×16 + HC-05 + gerçekçi Serial Monitor

- LCD 16×2 elemanı tam 16 pinli HD44780 bağlantısına yükseltildi ve `LiquidCrystal` komutları ekrandaki iki satıra yansıtıldı.
- Resmi LiquidCrystal HelloWorld örneği otomatik LCD + kontrast potu devresiyle açılıp sanal ekranda çalışacak hale getirildi.
- HC-05 Bluetooth Classic SPP modülü EN/VCC/GND/TXD/RXD/STATE terminalleriyle kütüphaneye eklendi; 3D/2.5D ve şema görünümü vardır.
- `SoftwareSerial` RX/TX, çift yönlü byte akışı, baud uyuşmazlığı ve temel HC-05 AT komutları simüle edilir.
- Resmi SoftwareSerialExample açılırken HC-05 otomatik eklenir ve örnekteki SoftwareSerial baud'u devreye aktarılır.
- Serial Monitor'e baud seçimi, LF/CR/CR+LF satır sonları, gönderme, temizleme, `available/read/peek/readStringUntil/parseInt` ve temel `serialEvent` desteği eklendi.
- HC-05 için sanal eş cihaz terminali ve tarayıcı destekliyorsa Web Serial üzerinden **PC Bluetooth / COM** köprüsü eklendi.
- Simülasyon butonunun kilitli yeşil/kırmızı görünümüne dokunulmadı.


## HC-05 sağ panel çalışma notu

- HC-05 seçildiğinde sağ Özellikler panelinde **HC-05 Çalışma Notu** düğmesi görünür.
- Düğme; normal UART/SoftwareSerial bağlantısı, IDE'de çalıştırma, baud eşleştirme, AT/KEY modu, fiziksel 3.3 V RXD uyarısı, PC Bluetooth/SPP sanal COM köprüsü ve hızlı arıza kontrolünü tek pop-up içinde gösterir.
- Not penceresi yalnız yardım katmanıdır; HC-05 çalışma mantığını veya Simülasyon butonunu değiştirmez.


## Dashboard / atölye açılış regresyonu düzeltmesi

- Dashboard kaynağında Kumanda, Tesisat, Pano ve Arduino olmak üzere dört atölye kartının tamamının mevcut olduğu doğrulandı.
- v1.19 boyunca aynı kalan asset sorgusu nedeniyle eski JS/CSS önbellekten gelebileceği için tüm `?v=1.19.0` referansları yeni build revision ile yenilendi.
- Arduino Atölyesi kartına görünürlük koruması eklendi.
- Yeni proje oluşturma akışı artık modu normalize eder, Arduino için `Arduino Projem` adını kullanır ve başarısız olursa sessizce kalmak yerine hata mesajı gösterir.
- Simülasyon butonu ve renkleri değiştirilmedi.


## Simülasyonda canlı devre düzenleme + yüzen Serial Monitor

- Simülasyon artık düzenlenebilir projeyi kilitlemez. Eleman ekleme/silme, kablo ve güzergâh düzenleme, taşıma, özellik değişikliği ve geri al/yinele sırasında simülasyon çalışmaya devam eder ve yeni topoloji yeniden çözülür.
- Kablo/terminal temasındaki güvenlik bildirimi bloklayan modal yerine görünür durum/toast uyarısıdır.
- Etkileşimli kumanda elemanları normal tıklamayla çalışmaya devam eder; simülasyon sırasında fiziksel olarak taşımak için Alt+sürükle kullanılır.
- Arduino bulunan projelerde üst çubuktan küçük, yüzen Serial Monitor açılabilir. IDE ekranını açmadan kart/baud seçimi, canlı çıktı, veri gönderme ve temizleme kullanılabilir.


## UNO kabloları üst katmanda + serbest güzergâh sürükleme

- UNO R3'e bağlı kabloların kart görselinin altında kaybolması giderildi. Kart gövdesi üzerinden geçen kablo bölümü ayrı üst katmanda yeniden çizilir; terminal hit alanları açık kalır.
- Arduino çalışma alanında ve UNO'ya bağlı kablolarda segment tutamacı artık yalnız tek eksende değil serbest XY yönünde sürüklenebilir.
- Kablo uçları bağlı kalır; sürüklenen nokta manuel güzergâh kontrol noktası olarak kaydedilir ve rota grid/90° mantığıyla yeniden çizilir.
- Kumanda/Tesisat tarafındaki mevcut tek-eksen segment sürükleme davranışı korunmuştur.


## Gelişmiş Arduino donanımları · tamamlanan paket

- **LCD 2×16:** Mavi 1602A/HD44780 görünümü ayrıntılandırıldı. Ayrı PCF8574 backpack ve birleşik LCD+I2C elemanı eklendi. `LiquidCrystal_I2C(address,cols,rows)`, `init/begin`, cursor, print/write, clear/home, display ve backlight davranışları çalışır.
- **7 segment:** A–G ve DP segmentleri Arduino çıkışlarını izler; ortak katot ve ortak anot modu desteklenir.
- **SG90:** Datasheet oranlarına dayanan mavi gövde/horn/kablo görseli ve hareketli horn eklendi. `Servo.write()` ile `writeMicroseconds()` açıyı değiştirir.
- **Stepper:** 28BYJ-48 + ULN2003 görseli ve hareketli mil eklendi. Resmi Arduino Stepper örneklerinin dördü de yorumlayıcıda çalışır; basit `#define` sabitleri desteklenir.
- **A4988 + NEMA17:** STEP yükselen kenarı, DIR, MS1/MS2/MS3 mikrostep seçimi, güç bağlantısı kontrolü ve hareketli NEMA17 mili eklendi. Temel `AccelStepper` move/moveTo/runToPosition yolu desteklenir.
- **HW-131:** Güç anahtarı, 5 V / 3.3 V / OFF jumperları, kaynak ve doğrudan kısa devre durumu çalışır.
- **NE555:** TRIG/THRES/RESET, astable ve monostable eğitim davranışı eklendi.
- **HC-05 / HC-06:** Görseller ve roller ayrıldı; HC-05 AT/KEY + master/slave, HC-06 slave; SoftwareSerial/UART/SPP ve PC COM köprüsü ortak veri motorunu kullanır.
- Cache revision: `r20260929-arduinohw3`.
