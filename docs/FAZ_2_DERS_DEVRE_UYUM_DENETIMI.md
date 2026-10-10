# Faz 2 — ders/devre uyum denetimi

## 1.19.1 doğru taban denetimi · 2026-10-03

Önceki tablo v1.18 tabanındaki derslerle sınırlıydı. 1.19.0 tabanı eklendikten sonra 72 temel Öğretici Modu bağlantı dersi ve yeni kaynak/Arduino alanları ayrıca denetlendi. Hedefli dashboard/öğretici/ders testleri toplam 24/32 geçti; aynı testler temiz v1.19.0 tabanında da 24/32 verdi. Bu eşitlik yeni bir gerileme olmadığını gösterir, ancak 8 başarısız denetimi “uyumlu” saydırmaz. Mevcut başarısızlıklar arasında eğitim devrelerinde kopuk gruplar, IGBT için ürün görseli beklentisi, RLC konu eşleşmeleri ve anlamsal tekrar kümeleri bulunur. Bunlar ayrı bulgu olarak Faz 4/5 denetiminde takip edilir.

Öğretici kaynak kapsam belgesinde pnömatik/hidrolik kaynak başlıkları da listelenmişken kilitli manifest bunları kapsam dışı bırakır. Kaynak listelenmesi tek başına yeni interaktif pnömatik/hidrolik ders ekleme izni değildir; bu nedenle burada yeni ders kapsamı oluşturulmadı.

## Sonuç

- Dal: Devre-Tasarim-Studyosu-1.19.1
- Denetim başlangıcı: Faz 1 envanter commit'i 2ef0a8aea18660b6db0d630b8e0df8ffae4a8971
- İncelenen kapsam: ana ekrandaki 31 ders/atölye tanımı ve Faz 1'de listelenen 26 ek arşiv örneği.
- Faz 2 kapsamında doğrulanmış bir yanlış komponent seçimi, başlığa ters düşen bağlantı veya farklı bir devre amacına dönüşmüş örnek bulunmadı. Bu nedenle ders/devre kaynak dosyalarında değişiklik yapılmadı.
- Eksik ders amacı/açıklaması olarak Faz 1'de işaretlenen 10 ana ekran kaydı Faz 2'de devre hatası sayılmadı. Bu eksikler Faz 6 — ders açıklamaları aşamasında ele alınacak.
- Pano şablonları ile komponent gösterim örneklerinde elektrik kablosu bulunmaması içerikleriyle uyumlu: bunlar elektrik devresi çalıştırma dersi değil, yerleşim veya malzeme görünümüdür. Öğretim hedefi eksikliği Faz 1 kaydında korunmuştur.

## Ana ekrandaki ders/devre eşleşmeleri

| ID | Başlık | Devre/komponent eşleşmesi | Faz 2 sonucu |
|---|---|---|---|
| acs800panel | ACS800 · Panel ve yön | 3 faz besleme → ACS800 R5 → motor; PE bağlantıları da mevcut | Uyumlu |
| acs800pot | ACS800 · RMIO ve potansiyometre | Sürücü, DI1/DI2 seçicileri ve AI1 potansiyometresi; nottaki pin adları bağlantılarla eşleşiyor | Uyumlu |
| acs800current | ACS800 · 4–20 mA ve röleler | Sensör AI2'ye, ampermetreler AO çıkışlarına, lamba röle kontağına bağlı | Uyumlu |
| acs800pid | ACS800 · PID kontrol | Potansiyometre AI1 referansı, sensör AI2 geri beslemesi; motor sürücü çıkışında | Uyumlu |
| v20bop | V20 · Panel ve rampalar | Tek faz beslemeli V20 ve üç faz motor; kumanda panel üzerinden | Uyumlu |
| v20pot | V20 · Potansiyometre ile hız | AI1 potansiyometre ve yön/çalıştırma seçicileri sürücüye bağlı | Uyumlu |
| v20npn | V20 · NPN kumanda | NPN giriş açıklaması, DIC beslemesi ve DI kumanda bağlantılarıyla uyumlu | Uyumlu |
| v20current | V20 · 4–20 mA ve AO1 ölçümü | Sensör AI girişinde; ampermetre AO çıkışında; motor sürücüye bağlı | Uyumlu |
| ht2115 | Gentek · sıcaklık ve nem | Beslemeli sıcaklık/nem sensörünün iki mA çıkışı ayrı ampermetrelerde | Uyumlu |
| waz115 | WAZ5 · V → mA | 0–10 V girişli dönüştürücü ve 4–20 mA çıkış ampermetresi | Uyumlu |
| rtd115 | ORDEL · PT100 döngüsü | PT100 iki telli girişte; dönüştürücü çıkışı akım ölçüm döngüsünde | Uyumlu |
| tc115 | ORDEL · termokupl döngüsü | K tipi termokupl doğru polarite pinleriyle sıcaklık dönüştürücüsüne bağlı | Uyumlu |
| enda115 | ENDA · sıcaklık kontrolü | PT100 kontrolör girişinde; röle çıkışı ısıtma lambasına bağlı | Uyumlu |
| tx115 | Baykon · kg → mA | Yük hücresi uyarımı ve sinyal uçları göstergeye; akım çıkışı ampermetreye bağlı | Uyumlu |
| meter115 | UNI-T · hareketli problar | Problar multimetrenin V/COM yuvalarında; hedefleri 24 V beslemenin uçlarında | Uyumlu |
| lit115 | Işıklı buton · bağımsız lamba | Buton kontağı H1'i, X1/X2 uçları buton aydınlatmasını besliyor | Uyumlu |
| control | Başlat / durdur ve mühürleme | Durdurma, başlatma ve K1 mühürleme kontağı bobin devresine; ayrı 24 V lamba devresi mevcut | Uyumlu; açıklama Faz 6'da |
| building | Vavien aydınlatma | İki vavien anahtarı gezgin uçlarla bağlı; armatür nötrü kaynağa dönüyor | Uyumlu; çalışma tablosu Faz 6'da |
| panel | Raylı eğitim panosu | Elektrik şeması yok; ray, kanal ve pano elemanları fiziksel yerleşim şablonu | Devre dersi değil; yerleşim örneği |
| analog110 | Analog sensör çubukları | Besleme, seviye/konum/ultrasonik analog sensörlerine gidiyor | Konu ve malzeme eşleşiyor; hedef/ölçüm açıklaması Faz 6'da |
| selector110 | Seçici ve üç lamba | 3 konumlu seçici çıkışları üç ayrı gösterge lambasına bağlı | Konu ve bağlantı eşleşiyor; konum tablosu Faz 6'da |
| sounds110 | Flaşör ve sesli uyarılar | Kumanda, flaşör, ışıklı ve sesli uyarı elemanları aynı gösterim devresinde | Konu ve malzemeler eşleşiyor; senaryo açıklaması Faz 6'da |
| temperature112 | NTC ve sıcaklık probları | Elektrik kablosu yok; NTC, PT100 ve termokuplun görsel/parametre davranışı gösteriliyor | Devre dersi değil; PT100/TC açıklaması Faz 6'da |
| load112 | Kobastar SB2 yük hücresi | Uyarım kaynağı EX uçlarında, SIG çıkışları voltmetrede; 0 kg başlangıcı nottaki ölçekle çelişmiyor | Uyumlu |
| reed113 | Reed mıknatıs takımı | NO ve NC reed elemanları ayrı lamba devrelerinde gösteriliyor | Uyumlu |
| visuals113 | Siemens ve mekanik görseller | Kablo yok; adlandırılan ürün ve mekanik malzemeler tanıtım görünümünde | Devre dersi değil; öğretim hedefi Faz 6'da |
| visuals111 | v1.11 malzemeler | Kablo yok; elektrik malzemeleri ve sensör/sürücü yardımcıları kataloğu | Devre dersi değil; öğretim hedefi Faz 6'da |
| ct111 | Akım trafosu | Primer yük yolu seri; sekonder ampermetre CT'nin S1/S2 uçlarında | Uyumlu |
| phase111 | Faz röleleri | Üç faz ölçüm uçları ve röle kontakları gösterge lambalarına bağlı | Uyumlu |
| fuses111 | Sigortalar ve NH | Üç ayrı sigortalı yol ve NH tutucu/kapak işlevi yük göstergeleriyle eşleşiyor | Uyumlu |
| visuals110 | Yeni ürün görselleri | Kablo yok; başlıkta belirtilen ürün ve kumanda malzemeleri tanıtım görünümünde | Devre dersi değil; öğretim hedefi Faz 6'da |

## Arşiv örnekleri ve tekrar adayları

26 ana ekrana bağlı olmayan proje dosyasında Faz 1'de doğrulanan komponent türleri ve pin eşleşmeleri korundu; kaynak açıklaması olmayan malzeme katalogları devre hatası olarak sınıflandırılmadı. Akım ölçümü, motor yol verme, zaman rölesi ve sensör örneklerinin isimleri ile bağlı komponentleri birbiriyle çelişmiyor.

Faz 7 için daha önce kaydedilen konu yakınlıkları bu fazda birleştirilmedi: analog sensör örnekleri, V20 potansiyometre örnekleri, hareketli prob/24 V prob örnekleri ve TX11 gerilim-akım ölçümleri. Amaç ve işlem adımları eşdeğer olduğu kanıtlanmadan tekrar kararı verilmeyecek.

## Kontrol dayanakları

- Faz 1'de bütün elektrik modelleri varsayılan durumda kararlı çözüldü; kısa devre oluşmadı. Komponent kimlikleri ve kablo pinleri kütüphaneyle eşleşti.
- Faz 0'da var olan tam test paketi 255/255 geçti. Davranışla ilgili mevcut kapsama örnekleri: tests/devices-v111.test.cjs, tests/devices-v112.test.cjs, tests/examples-v115.test.cjs, tests/v20.test.cjs ve tests/acs800.test.cjs.
- Faz 2 sırasında yeni test eklenmedi ve testler yeniden çalıştırılmadı; kaynak içerikleri değişmedi.

## Faz durumu

Faz 2 tamamlandı ve kullanıcı kontrolünü bekliyor. Faz 1'de belirlenen açıklama eksikleri Faz 6'ya, konu benzerlikleri Faz 7'ye bırakıldı. Bu kayıttan sonra Faz 3'e geçiş için kullanıcı onayı gerekir.

