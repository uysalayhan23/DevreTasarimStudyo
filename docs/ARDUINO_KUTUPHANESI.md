# Arduino Kütüphanesi v1.19

Bu belge Arduino Atölyesi için eklenen elektronik/hobi elemanlarının pin ve görünüm esaslarını özetler. PDF veri sayfalarının kendileri repoya kopyalanmaz; yalnız gerekli pin/paket/temel değer bilgileri bileşen tanımına işlenir.

## Görünüm kuralı

Arduino Atölyesi bileşenleri iki ayrı görünüm taşır:

- **Şema / devre sembolü:** kablolama, terminal adı ve elektriksel bağlantı için sade işlevsel sembol.
- **3D / 2.5D malzeme görünümü:** gerçek parçayı ayırt etmeyi kolaylaştıran ölçeklenebilir SVG malzeme görünümü.

Her iki görünüm aynı pin kimliklerini kullanır. Eleman büyütülüp küçültüldüğünde malzeme görünümü ve pinler birlikte ölçeklenir.

## Kullanıcı dokümanlarından eklenen elemanlar

### BC327

- Tür: PNP BJT
- Veri sayfasındaki pin sırası: **1 Collector, 2 Base, 3 Emitter**
- VCEO: 45 V
- Sürekli kolektör akımı: 800 mA
- Kütüphane kimliği: `arduino-bc327`

### BD139

- Tür: NPN BJT
- Kullanılan BD139 dokümanındaki paket: **TO-126**
- Dokümandaki pin sırası: **1 Emitter, 2 Collector, 3 Base**
- VCEO: 80 V
- Kolektör akımı: 1.5 A
- Kütüphane kimliği: `arduino-bd139`

### BD140

- Tür: PNP BJT
- Kullanılan ST dokümanındaki paket adı: **SOT-32**
- ST dokümanındaki iç şema pinleri: **1 Base, 2 Collector, 3 Emitter**
- |VCEO|: 80 V
- |IC|: 1.5 A
- Kütüphane kimliği: `arduino-bd140`

BD139 ile BD140 için yüklenen dokümanların pin sıraları aynı değildir; proje tanımları kaynak dokümanı sessizce “düzeltmeden” ayrı ayrı korur.

### TLP521 ailesi

- TLP521-1: 1 kanal, DIP-4
- TLP521-2: 2 kanal, DIP-8
- TLP521-4: 4 kanal, DIP-16
- Fototransistör kolektör-emitter gerilimi: 55 V minimum
- İzolasyon gerilimi: 2500 Vrms minimum
- Kanal pinleri veri sayfasındaki Anot / Katot / Emitter / Collector sırasına göre ayrı ayrı tanımlanır.

## Ek temel elektronik / Arduino parçaları

- Ayarlanabilir DC güç kaynağı, 0–30 VDC ve 0–5 A kullanıcı ayarı
- 1 kΩ ve 220 Ω direnç
- 100 nF seramik kondansatör
- 100 µF elektrolitik kondansatör
- 1N4148 ve 1N4007 diyot
- 0.91" 128x32 SSD1306 I2C sarı OLED LCD
- Ana kütüphanedeki Direnç, Potansiyometre, Kondansatör, Diyot, Köprü Redresör ve Toprak sembolleri Arduino çalışma alanında da erişilebilir.

## Simülasyon kapsamı

Bu elemanlar doğru pinli ve kablolanabilir eğitim elemanlarıdır. BJT ve optokuplörler için tam SPICE seviyesinde analog karakteristik/ısı modeli bu kütüphane eklemesinin parçası değildir. Arduino çalışma zamanı geliştirilirken gerekli dijital/analog eğitim davranışları ayrıca bağlanacaktır.


## UNO R3 resmi referansı ve breadboard

- UNO R3 malzeme görünümü, Arduino'nun resmi `UNO R3` ürün sayfası ve `A000066 Full Pinout` belgesi referans alınarak yerel SVG olarak yeniden çizilir; dış ağ görseli çalışma anında yüklenmez.
- A000066 pinout belgesindeki kullanıcı başlıkları korunur: D0–D13, A0–A5, SDA/SCL, AREF, GND, IOREF, RESET, 3V3, 5V, VIN ve ICSP başlıkları.
- A4/SDA, A5/SCL ve ana ATmega328P ICSP sinyalleri, breadboard/kablo ağı açısından karşılık gelen UNO terminallerine bağlanır.
- Breadboard, 30 kolon x A–J deliklerinden ve üst/alt güç raylarından oluşan kablolanabilir eğitim modelidir. A–E ve F–J beşli grupları kendi kolonlarında elektriksel olarak ortaktır; güç rayları kendi satırlarında süreklidir.
- Breadboard terminal yazıları gizlidir; bağlantı delikleri doğrudan kablo hedefidir.

Referans: Arduino UNO R3 hardware page ve A000066 Full Pinout (CC BY-SA 4.0).


## Gömülü Arduino IDE ve resmi Built-in Examples

Yan kütüphane panelindeki **Arduino IDE’yi Aç** düğmesi, çalışma alanını terk etmeden gömülü IDE penceresini açar. IDE; Arduino kartı seçimi, program adı, kod editörü, satır numarası, eğitim doğrulaması, karta yükleme, programlı kart olarak kaydetme ve Seri Monitör alanlarını içerir.

Arduino'nun resmi Built-in Examples sayfasındaki 68 başlığın tamamı yerel örnek indeksine eklenmiştir:

- Basics: 6
- Digital: 9
- Analog: 6
- Communication: 12
- Control Structures: 6
- Sensors: 4
- Display: 2
- Strings: 14
- USB: 7
- Arduino ISP: 2

Örnek kodlar uygulama içinde çevrimdışı tutulur. Örnek adı ve konusu resmi Arduino indeksini izler; kod gövdeleri uygulamanın eğitim çalışma zamanına uygun, yerel örneklerdir. UNO R3 üzerinde doğrudan çalışmayan Mega, native-USB ve ISP örnekleri uyumluluk etiketiyle açıkça ayrılır.

**Simülasyon kapsamı:** Gömülü çalışma zamanı gerçek AVR-GCC/Arduino CLI derleyicisi değildir. pinMode, digitalRead/Write, analogRead/Write, delay/delayMicroseconds, tone/noTone, temel Servo, temel Serial, if/else ve temel for ifadelerinin eğitim simülasyonunu sağlar. Strings, USB HID, çoklu UART, bazı switch/while/array ve ISP örnekleri kod/reference modunda açılabilir; gerçek kart derlemesi olarak sunulmaz.

Resmi örnek indeksi: https://docs.arduino.cc/built-in-examples/


## Resmi Arduino IDE örnekleri ve salt-okunur çalışma

Uygulama artık resmi Arduino kaynaklarından alınan **109 orijinal sketch** içerir. Kaynak grupları:

- `arduino/arduino-examples`: Built-in Examples (01.Basics–09.USB ve ArduinoISP sketch'i).
- `arduino/ArduinoCore-avr`: EEPROM, SPI, SoftwareSerial ve Wire örnekleri.
- `arduino-libraries/Servo`: Servo örnekleri.
- `arduino-libraries/LiquidCrystal`: LiquidCrystal örnekleri.
- `arduino-libraries/Stepper`: Stepper örnekleri.
- `arduino-libraries/SD`: SD örnekleri.

Her kayıt kaynak depo, branch, dosya yolu ve lisans bilgisini taşır. Orijinal yorumlar ve kod gövdesi korunur.

### Koruma akışı

1. Resmi örnek IDE'de açıldığında kod alanı **salt okunur** olur.
2. Kullanıcı **Karta yükle** ile orijinal kodu sanal UNO'ya yükleyebilir.
3. Üstteki mevcut **SİMÜLE ET** düğmesiyle desteklenen kapsamda program denenebilir.
4. Kullanıcı kodu değiştirmeye veya Kaydet'e çalışırsa **Hazır Arduino örneği korunuyor** penceresi açılır.
5. **Farklı Kaydet** seçilip yeni program adı verildiğinde programın düzenlenebilir çalışma kopyası oluşturulur.
6. Bundan sonraki Kaydet işlemleri yalnız bu çalışma kopyasını günceller; resmi kaynak değişmez.

Bu davranış proje içindeki hazır kumanda örneklerinin korunma mantığıyla bilinçli olarak paraleldir.


## A000066 CAD tabanlı UNO R3 görünümü

UNO R3 kartı artık yalnız temsili bir dikdörtgen değildir. Kullanıcının sağladığı resmi A000066 kaynak seti esas alınır:

- `A000066-cad-files.zip / UNO-TH_Rev3e.brd`: fiziksel kart dış hattı, header ve ICSP koordinatları.
- `A000066-full-pinout.pdf`: terminal fonksiyonları, alternatif D14–D19 / SDA / SCL / SPI / UART adları ve güncel CIPO/COPI terminolojisi.
- `A000066-datasheet.pdf`: kart topolojisi, ana parçalar ve JANALOG/JDIGITAL tabloları.
- `A000066-schematics.pdf`: ATmega328P, ATmega16U2 ve kart iç bağlantı referansı.

### Fiziksel terminal sırası

Üst dijital header soldan sağa:
`SCL, SDA, AREF, GND, D13/SCK, D12/CIPO, D11~/COPI, D10~/SS, D9~, D8, D7, D6~, D5~, D4, D3~, D2, D1/TX, D0/RX`.

Alt POWER header soldan sağa:
`NC, IOREF, RESET, 3V3, 5V, GND, GND, VIN`.

Alt ANALOG IN header soldan sağa:
`A0/D14, A1/D15, A2/D16, A3/D17, A4/D18/SDA, A5/D19/SCL`.

ATmega328P ICSP ve ATmega16U2 ICSP başlıkları fiziksel kart üzerindeki ayrı 2x3 konumlarında tutulur. Kablo, doğrudan görünen terminal deliğine bağlanır.

Kart özelinde `preservePinGeometry` kullanıldığı için 2.54 mm header aralığı uygulamanın genel 10 px bağlantı grid'ine zorla yuvarlanmaz. Bu özel durum yalnız UNO R3 fiziksel pinout doğruluğu içindir.


## LCD 2×16 · HD44780

- Kütüphane elemanı `arduino-lcd1602`, standart 16 pinli HD44780 uyumlu ekran olarak tanımlanır:
  `VSS, VDD, VO, RS, RW, E, D0..D7, A, K`.
- 4-bit ve 8-bit `LiquidCrystal` constructor biçimleri desteklenir.
- Desteklenen eğitim davranışları: `begin()`, `setCursor()`, `print()`, `write()`, `clear()`, `home()`, `display()/noDisplay()`, `cursor()/noCursor()`, `blink()/noBlink()`.
- Simülasyon sırasında iki satırdaki 16 karakter doğrudan LCD malzeme ekranında görünür.
- Hazır LiquidCrystal devresinde RW=GND, arka aydınlatma beslemesi ve VO kontrast potansiyometresi de otomatik kurulur.

## HC-05 Bluetooth Classic SPP

- Kütüphane kimliği: `arduino-hc05`.
- Terminaller: `EN, VCC, GND, TXD, RXD, STATE`.
- Normal veri modu varsayılanı 9600 baud; AT/KEY modu 38400 baud eğitim modeli.
- Arduino tarafında hem D0/D1 donanımsal UART hem de `SoftwareSerial(rx,tx)` ile veri alışverişi yapılabilir.
- Desteklenen SoftwareSerial davranışları: `begin/end/listen`, `available/read/peek`, `print/println/write`, `readString/readStringUntil`, `parseInt`.
- AT eğitim modeli şu komutları destekler: `AT`, `AT+NAME?`, `AT+NAME=...`, `AT+UART?`, `AT+UART=...`, `AT+PSWD?`, `AT+PSWD=...`, `AT+ROLE?`.
- HC-05 özellik panelinden ad, veri baud'u, eşleşme PIN'i ve AT/KEY modu değiştirilebilir.
- STATE pini sanal bağlantı durumunu dijital giriş olarak verir.
- Gerçek donanımda HC-05 RXD lojik seviyesi için uygun seviye düşürme/uyumluluk gerekir; simülatör fiziksel 5 V → 3,3 V hasar modelini otomatik uygulamaz.

## Gerçeğe yakın Serial Monitor

IDE Serial Monitor artık ayrı baud seçimi, giriş kutusu, dört satır sonu seçeneği (yok/LF/CR/CR+LF), gönderme ve temizleme içerir.

Sanal UNO tarafında `Serial.begin/end`, `print/println/write`, `available/read/peek`, `readString/readStringUntil`, `parseInt`, `flush` ve temel `serialEvent()` akışı desteklenir. Monitör baud'u sketch'teki `Serial.begin()` değerinden farklıysa veri, gerçek UART baud uyuşmazlığını temsil edecek şekilde bozuk görünür.

## PC Bluetooth / COM dış dünya köprüsü

HC-05 panelindeki **PC Bluetooth / COM'a bağlan** düğmesi, tarayıcıda Web Serial varsa kullanıcıya sistem seri portu seçtirir. Windows'ta Bluetooth Classic SPP cihazı eşleştirildiğinde işletim sistemi bunu sanal seri port olarak sunabiliyorsa bu port seçilerek sanal HC-05 ile dış cihaz arasında çift yönlü byte köprüsü kurulabilir.

Bu, Web Bluetooth GATT bağlantısı değildir. HC-05 Bluetooth Classic SPP kullandığı için doğrudan Web Bluetooth yerine işletim sisteminin SPP / sanal COM katmanı ve Web Serial kullanılır. Port seçimi her zaman kullanıcı iznine bağlıdır. Desteklenmeyen tarayıcıda sanal HC-05 simülasyonu çalışmaya devam eder; yalnız fiziksel dış dünya köprüsü kullanılamaz.


## Sağ panel HC-05 Çalışma Notu

Çalışma alanında HC-05 seçildiğinde Özellikler panelindeki **HC-05 Çalışma Notu** düğmesi görünür. Açılan yardım penceresi şu sırayla uygulamalı kullanım özeti verir: normal veri modu kablolaması, SoftwareSerial örneği, sketch yükleme ve simülasyon, Serial Monitor baud/satır sonu kullanımı, 38400 baud AT/KEY modu, fiziksel HC-05 RXD için 3.3 V seviye uyarısı, Windows Bluetooth SPP/sanal COM + Web Serial köprüsü ve arıza kontrol listesi.
