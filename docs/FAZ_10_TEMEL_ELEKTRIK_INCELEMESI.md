# Faz 10 · Temel Elektrik ders incelemesi

Tarih: 2026-10-03  
Durum: İnceleme sürüyor; Faz 10 tamamlanmış sayılmaz.

## Kapsam ve bulgular

Öğretici çalışma alanındaki **Temel Elektrik** grubunda 76 ders kaydı incelendi. Son devre üretiminden sonra 18 ders kablolu ve simülasyona açık, 58 ders bağlantısız görsel/kavram çalışma alanıdır. Kablolu 18 dersin tamamı simülatör çözücüsünde kararlı sonuç verdi; engellenmiş çözüm veya kısa devre sonucu çıkmadı.

Bulunan ve düzeltilen uyumsuzluklar:

- “Seri, Paralel ve Karışık Devrelerde Ohm Kanunu” tek dirençli basit devreyi gösteriyordu. Devre artık R1 seri, R2 ve R3 paralel; toplam akımı ölçen ampermetre ve R1/paralel kol gerilimlerini ölçen voltmetrelerle kuruluyor.
- Kirchhoff derslerinde UNI-T UT33D+ ölçü aletleri gerçek devreye bağlandı: A0/A2/A3 DCA 200 mA, V0 DCV 2 V, V1/V2 DCV 20 V. Akım denetimi A0 ≈ A2+A3; gerilim çevrimi ise ampermetrenin seri iç direncinden doğan düşümü de içeren V0+V1+V2 ≈ 24 V olarak ölçülür. Simülatör değerleri yaklaşık A0=102,8 mA, A2=61,6 mA, A3=41,1 mA, V0≈0,10 V, V1=10,28 V ve V2=13,62 V.
- Ohm Kanunu, karışık direnç devresi ve temel ölçüm derslerinde UNI-T UT33D+ gerçek devre ölçüm modeli kullanır. Akım için DCA kademesi ve doğru kırmızı prob yuvası; gerilim için uygun DCV kademesi ve ölçüm elemanına paralel bağlantı açıklama, kablo ve simülatör modeliyle eşleştirilmiştir.
- Pens ampermetre örneği sıradan ampermetreyi seri bağlıyordu. Gerçek pens ampermetreyle değiştirildi; iletkeni pens içine alma yöntemi anlatılıyor, sayısal ölçümün simüle edilmediği belirtiliyor.
- Frekansmetre, wattmetre, kosinüsfimetre ve takometre derslerinde çözücünün desteklemediği sayısal ölçüm varmış izlenimi kaldırıldı. Çalışma alanları doğru bağlantı yöntemini anlatan görsel/kavram dersleri olarak işaretlendi ve sınırlama açıkça yazıldı.

## Doğrulama

- `tests/tutorial-pedagogy-v119.test.cjs` ve `tests/lesson-circuit-audit-v119.test.cjs`: 21/21 başarılı. Testler UNI-T cihaz türü, kademe, prob girişi/bağlantı uyarısı, KCL ve ampermetre yükünü içeren KVL çevrimini denetler.
- `node scripts/check.cjs`: başarılı.
- Temel Elektrik grubundaki tüm kablolu dersler simülatörde tek tek çözüldü: 18/18 kararlı, 0 engellenmiş, 0 kısa devre.
- Gerçek Windows/Edge kullanıcı akışında 76 dersin her biri açılıp elle kontrol edilmedi. Bu nedenle Faz 10 ve son kullanıcı onay noktası açık kalır.

## 2026-10-03 · Faz 10 ölçüm revizyonu — UT200A ve fiziksel problar

- Kullanıcı kararıyla **“Doğru akım kaynakları, Ohm ve devre analizi”** konusu ilk 10 dersle sınırlandı; 11. ders ve sonrasındaki kayıtlar nihai Öğretici Modu listesinden çıkarılır.
- Genel `meter-ammeter` / `meter-voltmeter` yer tutucuları Faz 10 son geçişinde UNI-T cihazlarına dönüştürülür. DC akım ve AC/DC gerilim ölçümlerinde **UNI-T UT33D+** kullanılır; kablolu derslerde kırmızı ve siyah prob gövdeleri, prob kabloları ve gerçek ölçüm temas noktaları bulunur.
- UT33D+ AC akım ölçmediği için AC akım derslerinde yanlış kademe uydurulmaz; **UNI-T UT200A** pens ampermetre kullanılır.
- UT200A eğitim modeli üretici kapsamına göre 2/20/200 A AC pens kademelerini; problarla 600 V AC/DC, 20 kΩ, diyot/süreklilik; HOLD ve arka aydınlatmayı içerir. 600 A pens kademesi UT200A'ya eklenmemiştir.
- Pens ölçümünde devre kablosu elektriksel olarak bölünmez. Cihaz sürüklenirken çene uygun normal iletkene yaklaşınca açılır; bırakıldığında tek iletkeni kavrayıp o iletkenin çözücüdeki AC akımını okur. DC iletkende UT200A pensinden sahte sayısal akım gösterilmez.
- UT200A ve UT33D+ ortak ölçüm araçları olarak Kumanda/Elektronik/Ölçüm/Pano/Otomasyon/Motor alanlarında ve Arduino/PLC kütüphane filtrelerinde erişilebilir tutulur.
- Otomatik doğrulama için `tests/clamp-meter-v119.test.cjs` eklendi ve Öğretici/Faz 10 testleri yeni prob ve UNI-T politikasına göre güncellendi.

**Faz 10 durumu değişmedi:** teknik doğrulamalar tamamlanmış olsa bile gerçek Windows/Edge kullanıcı akışı ve kullanıcı kabulü olmadan Faz 10 tamamlandı sayılmaz.

## Hedefli CI doğrulaması · 2026-10-03

- Çalışma dalı: `Devre-Tasarim-Studyosu-1.19.1`
- Doğrulanan HEAD: `c47c88e6606e7d2422657ad6f3ff4ed70d6ffb5d`
- GitHub Actions run: `37150406898`
- Sonuç: **başarılı**
- Kapsam: UT200A pens ampermetre, UT33D+ fiziksel problar, ilk 10 DC dersi kuralı, genel A/V yer tutucularının kaldırılması, ders-kütüphane eşleşmesi, Öğretici Modu ve Tesisat regresyonları, Windows paket doğrulaması.
- Bu teknik doğrulama kullanıcı kabulünün yerine geçmez. Gerçek Windows/Edge kullanıcı akışı ve kullanıcı onayı açık kalır.

## 2026-10-04 · Tam regresyon kapanışı

- Son çalışma HEAD'i: `ef52e3e6162c4c0f26ce9744ade580ce54fd957b`.
- Hedefli canlı-simülasyon doğrulaması: GitHub Actions `37177860496` — **success**.
- Tam depo regresyonu: GitHub Actions `37177923235` — **success**.
- Test özeti: **448 / 448 geçti, 0 hata**.
- Sözdizimi/yerel bağımlılık kontrolü, ilk açılış smoke testi ve Windows ZIP doğrulaması da aynı koşuda başarılıdır.
- Otomatik teknik hata kalmadı. Açık kalan Faz 10 maddesi gerçek Windows/Edge görsel-etkileşimli kullanıcı incelemesi ve kullanıcı kabulüdür.


## 2026-10-04 · Gerçek kullanıcı bulgusu — dashboard / eski projeler

Kullanıcı incelemesinde iki bloklayıcı sorun bulundu:

1. Dashboardda **Arduino Atölyesi** ve **Öğretici Modu** görünmüyordu.
2. Daha önce oluşturulan projeler açılmıyor; ekran önceden seçilmiş proje klasörü için izin yenilemesi istiyordu.

Yapılan düzeltmeler:

- `studio.js` açılış bütünlük denetimi eksik Arduino/Öğretici kartlarını ve gerekli Öğretici dashboard kabuğunu geri yükler.
- Dashboard çekirdek varlık revizyonları `1.19.1` olarak yenilendi ve stale/mixed paket riskine karşı `BASLAT.bat` doğrulaması genişletildi.
- Proje klasörü izni beklerken son taranmış proje kartları korunur; kullanıcı kartı tıkladığında dosya sistemi izni aynı kullanıcı hareketinde yeniden istenir.
- Eski DTS proje kayıtları eksik/eski alan yapıları için açılıştan önce normalize edilir.
- Yeni regresyonlar dashboard self-repair, Öğretici/Arduino görünürlüğü, eski proje biçimi ve klasör izni sonrası yeniden açmayı kapsar.

Doğrulama:

- Hedefli run: `37185993148` — **success**.
- Tam depo run: `37187619842` — **451 test / 451 başarılı / 0 başarısız**.
- Doğrulanan kod HEAD'i: `208312dd8228df9fe6b2c3f1f21362297bf65f0b`.

**Faz 10 hâlâ açıktır.** Kullanıcı gerçek Windows/Edge ortamında güncel paketle Arduino ve Öğretici kartlarının göründüğünü ve önceki projelerin açıldığını doğrulamadan Faz 10 tamamlanmış kabul edilmez.


## 2026-10-04 · Kontrol Noktası 10

Kullanıcının **“faz11 i yap”** talebi Faz 10 kullanıcı kabulü ve bir sonraki faza geçiş onayı olarak kaydedildi.

**Faz 10 durumu: KABUL EDİLDİ**

Sonraki çalışma yalnız kilitli manifestte tanımlanan **Faz 11 — Son Regresyon / Build** kapsamındadır.
