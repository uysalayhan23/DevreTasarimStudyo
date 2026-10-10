# Arduino görsel ve davranış kaynakları · v1.19.0

Bu dosya Arduino Atölyesi'ndeki fiziksel görsel ve davranış yenilemelerinin referans haritasıdır. Çalışma zamanında internet bağlantısı gerekmez; görseller yerel SVG/2.5D yeniden çizimlerdir, kaynak sayfalardaki fotoğraflar doğrudan kopyalanmaz.

- Mete Hoca · 37 Parça Sensör Seti: https://www.metehoca.com/akademi/arduino-37-parca-sensor-seti-nasil-kullanilir-aciklama-ve-ornek-arduino-kodu-234/
- HW-131 Breadboard Güç Modülü: https://www.metehoca.com/akademi/elektronik-akademi/hw-131-breadboard-guc-modulu-nasil-kullanilir-919/
- A4988 + 28BYJ-48: https://www.metehoca.com/akademi/arduino-modul/a4988-step-motor-surucu-modulu-28byj-48-ile-nasil-kullanilir-1147/
- 28BYJ-48 + ULN2003: https://www.metehoca.com/akademi/arduino-modul/28byj-48-step-motor-ve-uln2003-surucu-modulu-arduino-ile-nasil-kullanilir-833/
- Robo90 · A4988 + NEMA17: https://blog.robo90.com/a4988-ve-arduino-ile-nema-17-step-motor-kullanimi/
- Ahmet Kemal Yıldız · Step motorlar: https://www.ahmetkemalyildiz.com.tr/16-arduino-ile-motor-kontrolu-step-motorlar/
- Ahmet Kemal Yıldız · HC-05/HC-06: https://www.ahmetkemalyildiz.com.tr/17-arduino-ile-bluetooth-iletisimi-hc-05-veya-hc-06/
- Ahmet Kemal Yıldız · SG90 servo: https://www.ahmetkemalyildiz.com.tr/7-arduino-ile-servo-motor-kontrolu/
- Ahmet Kemal Yıldız · Potansiyometre + servo: https://www.ahmetkemalyildiz.com.tr/8-potansiyometre-ile-servo-motor-kontrolu/
- Kullanıcının sağladığı `SG90-datasheet.pdf`: 9 g sınıfı, yaklaşık 180°, 4.8 V, servo PWM/darbe bilgileri ve turuncu/kırmızı/kahverengi kablo bilgileri.
- TI NE555 ürün/datasheet: TRIG ≈ VCC/3, THRES ≈ 2VCC/3, RESET önceliği, astable/monostable çalışma.
- TI PCF8574 ürün/datasheet: 8-bit I2C I/O genişletici; LCD backpack modelinin I2C/parallel köprüsü için referans.

Not: Bazı üçüncü taraf sayfalar otomatik web erişiminde engellenebilir. Bu durumda kullanıcı tarafından verilen URL, görünür görseller ve erişilebilen üretici/alternatif teknik kaynaklar birlikte kullanılır; doğrulanmayan ayrıntı birebir üretici özelliği diye sunulmaz.


## 2026-09-29 · Ortografik gerçek ürün referansları

- Arduino UNO R3 üst görünüş: Arduino Official Store ürün fotoğrafı ve top-down board görünümü.
- A4988: Pololu A4988 carrier top-view ve ölçü çizimleri.
- HC-SR04: üst görünüş modül fotoğrafları; iki ultrasonik transdüser ve 4-pin header yerleşimi.
- L298N: üst görünüş modül fotoğrafları; orta heatsink, mavi screw terminal blokları ve kontrol headerları.
- NEMA17: ön görünüş ürün fotoğrafları; kare flanş, dört montaj deliği ve merkez mil.
- 28BYJ-48 + ULN2003: üst görünüş motor + sürücü kartı fotoğrafları.
- HC-SR501 PIR: üst görünüş beyaz Fresnel lensli modül.
- KY-015 DHT11, KY-023 joystick ve daha önce kaydedilmiş KY-0xx modülleri: üst/ön görünüş fotoğraf referansları.
- MPU6050/GY-521, DS3231, microSD, nRF24L01 ve HX711 için yaygın top-view breakout düzenleri kullanıldı.

Uygulama içine üçüncü taraf fotoğraf dosyası gömülmez; bu kaynaklar geometrik/fiziksel referans olarak kullanılır. Çevrimdışı kütüphanedeki varlıklar yerel SVG yeniden çizimleridir.


## 2026-09-29 · Motor / Bluetooth / optokuplör fiziksel referans yenilemesi

- 130-size DC hobby motor: Adafruit ve 130-size ürün/ölçü referanslarındaki gümüş metal gövde, arka plastik kapak, mil ve iki lehim terminali esas alındı.
- NEMA 17: 42×42 mm ön flanş, dört montaj deliği, merkez mil ve dört kablo çıkışı esas alındı.
- SG90: TowerPro üretici ölçüleri (23×12,2×29 mm sınıfı), şeffaf mavi gövde, montaj kulakları, beyaz spline/horn, ön etiket ve üç kablo referans alındı.
- HC-05: ZS-040 kart formu, altı pin STATE/RXD/TXD/GND/VCC/EN-KEY, PCB anteni, BC417 ve buton/LED yerleşimi referans alındı.
- HC-06: JY-MCU/HC-06 kart formu, dört pin VCC/GND/TXD/RXD ve PCB anteni referans alındı.
- TLP521-1/2/4: Toshiba datasheet top-view pin düzeni ve gerçek bej DIP paket fotoğrafları referans alındı.
- Ayrı PCF8574 backpack artık normal LCD1602'nin 16-pin VSS–K headerına kabloyla bağlanabilir ve `LiquidCrystal_I2C` runtime bu yolu çözebilir.


- Motorobit · Ağırlık Sensörü 20 kg Loadcell: 20 kg kapasite, yaklaşık 80 × 12.7 × 12.7 mm alüminyum gövde, nominal 1.0 ±0.15 mV/V çıkış ve HX711 ile kullanım referansı.


- Analog Devices / Maxim MAX481/MAX483/MAX485/MAX487–MAX491/MAX1487 datasheet: MAX485 DIP-8 top-view pin sırası, 5 V besleme, DE ve /RE kontrolü, A/B yarı-dupleks RS-485 davranışı ve 2.5 Mbps sınıfı veri yolu referansı.


## 2026-09-30 · DIP/SPDIP lojik entegre referansları

Yeni entegrelerde dış ağ görseli çalışma zamanında çağrılmaz. Paket görünümü, gerçek ürün fotoğraflarındaki siyah DIP/SPDIP gövde biçimi ile üretici veri sayfalarındaki top-view pinout birleştirilerek yerel SVG olarak yeniden çizilmiştir.

- CD4511BE: TI CD4511B datasheet terminal assignment; kullanıcının verdiği Build Electronic Circuits IC-4511 sayfasındaki DIP-16 ürün/kullanım referansı.
- SN74HC595N: Texas Instruments SN74HC595 datasheet, PDIP-16 top-view pinout.
- CD4017BE: Texas Instruments CD4017B datasheet, decoded decade counter PDIP-16 pinout.
- MCP23017-E/SP: Microchip MCP23017 datasheet, 28-pin SPDIP pinout ve I²C register yapısı.
- MAX7219CNG: Analog Devices MAX7219/MAX7221 datasheet, 24-pin DIP pin configuration ve serial register yapısı.
- MAX232N: Texas Instruments MAX232 datasheet, 16-pin PDIP pinout ve çift EIA/TIA-232 driver/receiver yapısı.
