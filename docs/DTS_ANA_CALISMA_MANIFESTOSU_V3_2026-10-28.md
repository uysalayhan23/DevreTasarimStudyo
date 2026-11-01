# DTS ANA ÇALIŞMA MANİFESTOSU V3 — EduVolt Windows kanıtlarıyla birleştirilmiş

**Tarih:** 28.10.2026  
**Depo:** `uysalayhan23/DevreTasarimStudyo` / `main`  
**Hüküm:** Bu belge, eski 24 maddeyi izlenebilir biçimde koruyan DTS V2 görev sırasının Windows EduVolt karşılaştırmasıyla güncellenmiş çalışma manifestosudur. GitHub `main` ve kaynak belgeler her tur yeniden okunur. Bu belgenin oluşturulması herhangi bir DTS kodunun PASS/COMPLETE olduğu anlamına gelmez.

## 1. Kanıt sınırı ve EduVolt gözlemleri

Yüklenen `EduVolt_Inceleme_Raporu.pdf`, `EduVolt_Test_Loglari.txt`, `EduVolt_DTS_Karsilastirma.csv`, `EduVolt_Ekran_Kanitlari.zip` ve `EduVolt_Acik_Isler.md` incelendi. Gerçek Windows incelemesi **EduVolt Designer 2.2.10 Free** üzerinde ayrı test projesinde yapıldı: **11 PASS / 3 REVIEW / 2 NOT_RUN** (16 gözlem). PASS sadece EduVolt'ta gözlenen özel adımın kanıtıdır, DTS için PASS sayılamaz. PDF dışa aktarımının fiili üretimi kanıtlandı; PNG/JPG yalnız menü seçeneği, XLSX/ileri kalite Pro kısıtlı. Free sürümde fiziksel montaj Pro yükseltmeye yönlendirdi. Gerçek PLC simülasyonu ve FBD yapılmadı. Ctrl+Z/Ctrl+D ve bobin yerleştirme doğrulanamadı; Undo/Redo araç çubuğunda çalıştı. Test projesi .evd kaydedildi. Kanıt arşivinde E01–E32 görselleri ve KANIT_LISTESI.txt bulunuyor; ürün resimleri kaynak varlık olarak alınmayacak.

| Gözlem | Gerçek kanıt | DTS V3 görevi | Sınır |
|---|---|---|---|
| O01–02 | Free 2.2.10, ayrı proje .evd kaydı PASS | P7-04, P8-01 | DTS kayıt testi yerine geçmez |
| O03 | LOGO! 230RCE, 19 terminal görüntüsü PASS | P2-01, P4-01, P5-02 | DTS CPU 1211C ile aynı model değildir |
| O04, O06 | NO kontak ve araç çubuğu Undo/Redo PASS | P1-03, P1-08 | DTS davranışı ayrıca test edilir |
| O05 | Bobin ekleme REVIEW | P1-03, P1-04 | EduVolt kusuru kesinleşmedi |
| O07 | FBD NOT_RUN | P2-03 | EduVolt FBD destek iddiası çıkarılamaz |
| O08 | Görsel kablo çizimi PASS | P3-01, P6-01 | Elektriksel çalışması NOT_RUN |
| O09 | Nesne taşıma ve kablonun geometriyi izlemesi PASS | P3-02, P6-01 | DTS görsel hedefi, piksel kabulü ayrı |
| O10 | Fiziksel montaj Free'de Pro kapısı REVIEW | P6-03, P8-02 | Pro özellikleri test edilmedi |
| O11 | PLC/L-N blok görselleri ve terminal sayısı PASS | P4-01, P5-03 | Görseli kopyalama/lisans çıkarımı yok |
| O12–13 | Toolbar Undo/Redo PASS; Ctrl+Z/Ctrl+D REVIEW | P1-08, P3-02 | Odak ve kısayol testi gerekli |
| O14–15 | .evd kayıt, gerçek filigranlı PDF PASS | P7-03, P7-04 | PNG/JPG NOT_RUN; XLSX Pro sınırı |
| O16 | Tam PLC simülasyonu NOT_RUN | P2-02, P8-04 | DTS fiziksel solver testi ayrı |

## 2. Öncelikli ve kilitli çalışma sırası (39 iş)

**Durum kodları:** `PASS` yalnız kapsamı açık kanıt, `KISMİ` bazı kaynak/testler var ama tamamı değil, `REVIEW` görsel/harici doğrulama bekliyor, `HOLD` teknik/izin kilidi, `NOT_RUN` test koşulmadı, `PLAN` henüz testli uygulama yok. Başlangıç durumları son GitHub kaynaklarına göre yeniden doğrulanmalıdır.

| ID | Somut iş / kapsam | Eski 24 madde | Başlangıç durumu / kabul kapısı |
|---|---|---|---|
| P0-01 | PNG/PDF dış kaynak, CSS url ve SVG veri güvenliği | 20 | KISMİ; saldırı/izinli içerik pozitif-negatif regresyonu |
| P0-02 | PLC tarama hatasında güvenli Q ve yanıltıcı canlı LAD/FBD izinin sıfırlanması | 11,14,17,23 | KISMİ; hata/normal karşıt test |
| P0-03 | Readonly örnek, taslak NOP/BOŞ, Undo/Redo ve program-yük kilidi | 09,15 | KISMİ; kaldırma/geri alma/readonly karşıt test |
| P0-04 | `file:///` çevrimdışı kayıt ve proje bütünlüğü | 15,20 | KISMİ; bozuk/veri kaybı/geri yükleme testleri |
| P1-01 | Üç çalışma görünümü ve panel tercihlerini geri yükleme | 01–05,08 | KOD/TEST; Windows Edge REVIEW |
| P1-02 | Araç çubuğu, Ctrl/Cmd+K arama ve dar ekran | 06–07 | KISMİ; klavye odağı, tıklama, Edge REVIEW |
| P1-03 | Ladder network/rung paleti, sürükle-bırak, seri/paralel, kopyalama/sıralama | 09–10 | KISMİ; UI + native Boolean pozitif-negatif |
| P1-04 | Her kontak ve bobini güvenle sil/yeniden ekle; NOP/BOŞ | 09,11,23 | Hedefli test kaydı var; yeni kusur yoksa tekrar etme |
| P1-05 | I/Q/M/T/C adres görünürlüğü ve çakışma | 09,11–12 | KISMİ; aynı adres/yanlış referans testleri |
| P1-06 | TON/TOF/TP, CTU/CTD, SET/RESET kenar ve reset senaryoları | 11 | KISMİ; sanal zaman/karşıt durum testleri |
| P1-07 | Gerçek aktif rung, timer/sayaç süreleri, enerji yolu izleme | 14,17 | KISMİ; stale sinyal ve doğru iz karşıt testleri |
| P1-08 | Uygulanan program/taslak ayrımı, Undo/Redo, `.dtsladder`, örnekler | 15 | KISMİ; odak/Ctrl+Z/Y/S, import/kayıt güvenliği |
| P2-01 | Katalog PLC modelleriyle gerçek I/O/terminal sözleşmesi | 12 | Tek CPU 1211C hedefli PASS; diğerleri REVIEW |
| P2-02 | Gerçek 703 katalog ve özgün `Simulation.solve`, kopuk kablo | 13 | 7/7 hedefli tek model kanıtı; kapsam genişletme REVIEW |
| P2-03 | FBD blok düzenleme, LAD ile aynı mantık ve iz | 23 | KISMİ; eşdeğerlik, fail-safe, Edge testleri |
| P2-04 | Sanal operatör/I/O paneli ve güvenli izleme | 24 | KISMİ; destekli model, stale state, Edge REVIEW |
| P3-01 | Akıllı terminal yakalama/snap ve kablo kimliği | 18–19 | PLAN/KISMİ; uç/terminal pozitif-negatif |
| P3-02 | Hizala/dağıt/kilitle/çoğalt/döndür ve bağlı kablo geometrisi | 08,19 | KISMİ/REVIEW; Undo/Redo ve geometri testleri |
| P3-03 | IEC cihaz/kablo etiketi, çapraz referans, bağlantı listesi | 18,20 | PLAN; referans tutarlılığı ve CSV doğrulama |
| P3-04 | Kablo hata noktası ve salt-okunur görsel işaret | 18 | KISMİ; sağlam/bozuk kablo karşıt test |
| P4-01 | 703 malzemenin ID, üretici, model, varlık, sembol, terminal envanteri | Yeni | PLAN; 703 kayıt kapsama ve kimlik bütünlüğü |
| P4-02 | EXACT/FAMILY/REPRESENTATIVE/GENERIC/MISSING/REVIEW sınıflama | Yeni | PLAN; kaynak/lisans kanıtı zorunlu |
| P4-03 | Motor, sensör, VFD/softstarter, siren, şalter/RCD görsel eşleşmesi | Yeni | PLAN; model bazlı fiziksel karşılaştırma |
| P4-04 | ABB ACS800 R5, Finder 80/20, seviye, NTC ve termokupl | Yeni | PLAN; üretici belgesi, ölçü/terminal |
| P5-01 | Üretici kaynak, ortografik ölçü ve lisans doğrulama | Yeni | PLAN; telif/attribution ve offline kontrol |
| P5-02 | Özgün IEC sembolleri, terminal numarası ve geometrisi | Yeni | PLAN; semantik ve render karşıt test |
| P5-03 | Yalnız doğrulanmış özgün/izinli ürün görseli onarımı | Yeni | PLAN; gerçek model ve 2D/3D bağ doğrulama |
| P5-04 | Özel bileşen taslağından kontrollü katalog ekleme | 21 | KISMİ; bozuk giriş/özgün katalog sözleşmesi |
| P6-01 | 2D/3D terminal kimliği ve kablo uç koordinat eşitliği | 19 | REVIEW; Windows gerçek görsel kabul |
| P6-02 | Normal malzeme < kablo < ölçüm ve prob katman sırası | 19–20 | KISMİ; SVG/PNG/PDF katman testleri |
| P6-03 | mm ölçeği, dönüşüm/döndürme, Windows 3D piksel kabul | 19 | REVIEW; gerçek Windows kanıtı |
| P7-01 | Cihaz kısa bilgi, parametreler ve doğal Türkçe pedagojik açıklama | 16 | KISMİ; katalog temelli UI test |
| P7-02 | Hızlı Başla ve dört sabit Dashboard atölyesi | 22 | KISMİ; salt-okunur örnek ve yol testi |
| P7-03 | PDF/PNG/JPG/CSV/Excel çıktı kalitesi ve offline güvenliği | 20 | KISMİ; PNG/PDF hedefli test, gerçek Edge REVIEW |
| P7-04 | Not/görsel, otomatik kayıt ve güvenli geri açma | 15,20,22 | PLAN/KISMİ; proje bütünlüğü ve Undo/Redo |
| P8-01 | Edge `file:///` gerçek pencere/klavye/görsel kabulü | 01–24 | REVIEW; kanıtsız PASS yasak |
| P8-02 | Gerçek 3D terminal/ölçek/montaj kabulü | 19 | REVIEW; Free EduVolt Pro özelliği test edilmedi |
| P8-03 | 260 tarihsel FAIL ve 1686 ders ayrı teknik borç yönetimi | Yeni | HOLD/REVIEW; eski kabul ve COMPLETE değişmez |
| P8-04 | Gerçek Siemens LOGO, PLC donanımı, IEC lisansı ve üretici kapsamı | 12,13,23 | HOLD/REVIEW; simülasyon donanım testi değildir |

**Birinci kaynak adayları:** `dist/ladder-editor.js`, `dist/ladder-runtime.js`, `dist/ladder-diagram.js`, `dist/ladder-monitor.js`, `dist/plc-runtime.js`, `dist/project-png.js`, `dist/project-print.js`, `dist/workspace-modes.js`, `dist/materials.js`, `dist/material-assets.js`, `dist/product-assets.js`, `dist/product-assets-v110.js`, `dist/plc-assets.js`, `dist/physical-metadata.js`, `dist/symbols.js`; gerçek dosya varlığı ve son değişim her tur doğrulanır.

## 3. Çalışma ve kabul protokolü

1. Her tur `main` canlı HEAD, `AGENTS.md`, güncel 24 yol haritası, Ladder devir/güncel belge, malzeme manifestosu, üretici gap, kurallar/durum/proje haritası, talepler/kararlar ve bu çalışma manifestosu incelenir. Eski sonuç güncel kaynağı geçersiz kılamaz.
2. P0 içindeki gerçekten açık ve kanıtlanan ilk kusurdan başla, ardından P1, P2, P3, P4, P5, P6, P7, P8. Bağımlılıklar sebebiyle önce gerekli kontrol yapılabilir. Önceden hedefli PASS ise kaynak ve testleri tekrar etme.
3. Her kayıt: `ID | eski madde | kaynak | mevcut kusur | durum | öncelik | düzeltme | pozitif-negatif test | kabul kriteri | bağımlılık | HOLD/REVIEW | gerçek HEAD/blob SHA` olarak takip edilir. Yeni incelemede açık olmayan kayıt üzerine keyfi commit yapılmaz.
4. Kanıtlı onarım akışı: tespit et → gerçek kaynakta düzelt → özgün `Simulation.solve` / 703 katalog ve hedefli pozitif-negatif doğrula → **yalnız PASS** `[skip ci]` ile doğrudan `main` teslim et → gerçek uzak HEAD ve blob SHA doğrula. Rapor-only commit yok. Parallel main değişikliği ezilmez; Actions/Work/Codex/force-push/geçici dal yok.
5. Eski Golden/PASS/HOLD/REVIEW, SC1194 HOLD, Siemens V20, NE555/BD139, readonly hazır örnekler, `BASLAT.bat` Edge `file:///`, çevrimdışı çalışma, 4 atölye, 703 katalog, 1686 ders, gerçek terminal/ölçek ve pano çizim katmanları değişmez. Görsel yenileme elektriksel sözleşmeyi kendiliğinden değiştirmez.
6. EduVolt gözlemi DTS testi yerine geçmez. Kaynak lisansı ve resmî teknik belge olmadan başka üretici/modelin fotoğrafı alınmaz. IEC referansı için bağımsız özgün sembol üretilir; telifli ikili/kod/UI kopyalanmaz.
7. Windows/Edge/3D gerçek testi yoksa `REVIEW`; `NOT_RUN` asla `PASS` değil. Kullanıcıdan her tur 'devam', ZIP veya PowerShell istenmez. Gerektiğinde bloke olan iş kaydedilip bağımsız sıradaki göreve geçilir. Her tur kısa HEAD, ID, değişen kaynaklar, hedefli test sayısı/türü, commit+blob, PASS/REVIEW/HOLD, sonraki ID raporu verilir.
8. Otomasyon: yalnız mevcut **DTS Ana İş Listesi V2** saatlik görevini kullan; paralel çakışan geliştirme görevi açma. Her çalışmada bu manifestin 39 ID'sinden sıradaki açık işi seç. Tüm kabul kapıları gerçek kanıtla kapanmadan otomatik görevi tamamlandı diye durdurma.

## 3A. Kalıcı fiziksel ölçek sözleşmesi — yeni malzeme kabulünün zorunlu kuralı (2026-11-01)

**KALICI / GERİYE DÖNÜK VE İLERİYE DÖNÜK KİLİT.** Bu kural yalnız mevcut 703 katalog girdisi için değil; bir gün, bir ay veya daha sonra eklenecek **her yeni malzeme, yeni görsel, pano elemanı ve model güncellemesi** için geçerlidir. Geliştirme oturumu veya uygulama sürümü değişse bile açık kullanıcı kararı olmadan kaldırılmaz.

1. **Tek fiziksel referans mm'dir.** Devre çiziminde `dist/workspace-space.js` içindeki `SCENE_UNITS_PER_MM=2` kanonik sabittir: **2 sahne birimi = 1 mm**. Dönüşüm yalnız `sceneFromMm(mm)=2×mm` ve `mmFromScene(scene)=scene/2` sözleşmesine göre yapılır. Bu “2 ekran pikseli = 1 mm” demek değildir; kamera/zoom fiziksel ölçüyü değiştirmez.
2. **Pano yerleşiminde 1 pano koordinat birimi = 1 mm.** Pano genişliği, yüksekliği, derinliği, malzeme gövde zarfı, DIN rayı, kablo kanalı, açıklık ve mesafeler mm olarak saklanır. Devre sahnesinin 2 birim/mm katsayısı pano kayıtlarına ikinci kez uygulanmaz.
3. **Malzeme giriş şeması:** Üretici model/ürün kodu, fiziksel `widthMm/heightMm/depthMm`, ölçü kaynağı ve doğrulama durumu, montaj yönü, terminal kimliği ve üreticiye dayalı fiziksel terminal konumları (varsa) ayrı alanlardır. SVG/fotoğrafın `viewBox`, kırpma boşluğu, çizim pikseli ve etiket yerleşimi **fiziksel ölçünün kaynağı değildir**. Kaynağı doğrulanmamış ölçüler `approximate/REVIEW` kalır; fiziksel yerleşim PASS/COMPLETE ilan edilmez.
4. **Görünüş–geometri ayrımı:** SVG/fotoğraf en-boy oranı keyfî şekilde sıkıştırılmaz. Cihazın görünür gövdesi fiziksel ölçü kutusuna orantılı yerleştirilir; iç boşluk, yazı, kapak animasyonu, döndürme ve etiketler test edilir. 3NP1133'te reddedilen 0,7 yatay sıkıştırma tekrar uygulanmaz. Önceden kabul edilmiş WAZ5/MT031 görselleri ve performans korunur.
5. **Ortak terminal/kablo sözleşmesi:** Devre çizimindeki terminal noktaları, cihazın döndürülmesi ve ölçeklenmesi, pano üzerindeki terminal kimlikleri, kablo uçları ve montaj noktaları aynı fiziksel referansla kontrol edilir. Ölçek değiştirilirken sadece görsel değil, terminal ve bağlantı geometrisi de doğrulanır. Pano mm ölçüleri ve devre sahne birimleri birbirine yanlışlıkla karıştırılmaz.
6. **Yeni malzeme için zorunlu kabul kapısı:** (a) özgün üretici/model ve boyut kaynağını doğrula, (b) devre sahnesindeki mm↔sahne ve pano mm yerleşimini karşılaştır, (c) görünüş ve terminallerin pozitif/negatif native testlerini yap, (d) döndürme, kablo hizası, pano çakışması ve mevcut malzemelerle regresyonları çalıştır, (e) gereken gerçek Windows/Edge/3D kabulü yoksa REVIEW bırak. **Kanıtsız PASS yok; NOT_RUN PASS değil.** Her yeni malzeme geliştirme görevinde bu bölüm ilk kontrol listesidir.
7. **Çalışma alanı sözleşmesi:** Devre tasarımının mevcut 6400×4200 sahne alanı = 3200×2100 mm; 8× maksimum yakınlaştırma kullanıcı tarafından istenmiş ve önceki teslimatta native testle doğrulanmıştır. Yakınlaştırma, fiziksel ölçü tabanını değiştirmez. Bu sınırlar ayrıca kararlaştırılmadan yeniden daraltılmaz.

Bu sözleşmeyi uygulamak, henüz ölçüsü doğrulanmamış tüm malzemelerin otomatik olarak fiziksel PASS sayıldığı anlamına gelmez. P4-05/P6-03 mevcut ve gelecekteki her malzemenin doğrulama hattıdır.

## 4. Kalıcılık ve sürüm

Bu doküman, kullanıcının yüklediği EduVolt delilleri ve mevcut GitHub yol haritasından oluşturulmuş **V3 manifest taslağının ilk kaydıdır**. Sadece doküman değişikliği için GitHub `main` üzerinde rapor-only commit yapılmaz. Sonraki gerçek PASS kod teslimatı sırasında kanıtla birlikte repodaki `docs/` altına eklenebilir. İlgili işin kaynağı kontrol edilmeden PASS sayacı güncellenmez.