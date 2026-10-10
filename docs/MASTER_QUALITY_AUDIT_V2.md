# MASTER QUALITY AUDIT v2 — v1.19.20

Durum: **KAPSAMLI GÖZDEN GEÇİRME TAMAMLANDI — DÜZELTME BACKLOG'U AÇIK**  
Tarih: 2026-10-04  
Baş Ajan / Teknik Direktör: MQ-00  
GitHub süreklilik: MQ-13  
Aktif dal: `v1.19.20`  
İncelenen HEAD: `a39e1aaf1b1328489eea95d3a508f82e7c1700a6`

## 0. Doğrulanmış sağlam taban

- Son GitHub Actions run: `37196915999` → SUCCESS.
- Tam regresyon: **455 / 455 geçti**.
- `scripts/check.cjs`: 157 JS/CJS dosyası, 95 yerel bağımlılık, 728 final kütüphane tanımı, 58 korunan proje doğrulandı.
- Windows launcher `cmd.exe` smoke testi geçti.
- Paket CRC ve çıkarılan dosya SHA-256 doğrulaması geçti.
- Branch yapısı: yalnız `main`, `v1.19.0`, `v1.19.1`, `v1.19.20`.
- Pano koordinat sistemi fiilen mm tabanlı; kamera zoomu kayıtlı fiziksel koordinatı değiştirmiyor.

Bu sonuçlar kodun mevcut regresyon setine göre kararlı olduğunu gösterir; aşağıdaki kalite açıklarını geçersiz kılmaz.

---

# P0 — KRİTİK / RELEASE BLOCKER

## MQ-P0-001 — Gerçek ürün bazlı fiziksel ölçü sistemi yok

**Kanıt**
- `dist/panel.js::spec(d)` cihaz ölçülerini ürün datasheet'inden değil kategori/ID kalıplarından türetiyor.
- Örnek fallbackler: buton/lamba 32×32×50, klemens 8×50×45, kontaktör 45×85×75, sürücü 100×180×150, genel fallback 70×85×55.
- Baz kütüphane 702 tanım içeriyor; `widthMm/heightMm/depthMm` alanı **0**.
- Final runtime kütüphane 728 tanım.

**Risk**
Gerçek pano alanı, DIN rayı yerleşimi, çakışma, kablo çıkış konumu ve ürünler arası ölçek güvenilir değil.

**Düzeltme**
Merkezi digital twin fiziksel metadata: `widthMm/heightMm/depthMm/mountingType/sourceStatus/sourceRef`; legacy fallback açıkça `approximate`.

---

## MQ-P0-002 — Terminal pano geometrisi yaklaşık gövde ölçüsüne bağlı

**Kanıt**
`dist/panel-wiring.js::ports()` terminali `pin.x/d.w*item.w` ve `pin.y/d.h*item.h` ile ölçekliyor.

**Risk**
Yaklaşık cihaz boyutu kullanıldığında terminal de fiziksel gerçek yerinden sapabilir.

**Düzeltme**
Terminal koordinat sözleşmesi: mm tabanlı veya normalize + doğrulanmış physical frame; asset/pin/hitbox/pano aynı referans sisteminde.

---

## MQ-P0-003 — Öğretici akım/enerji yönü uygulanmış değil

**Kanıt**
- `dist/tutorial-mode.js`: `function flow(project){clearHighlights()}` — davranış yok.
- `dist/tutorial.css`: tüm `.wire.energized` çizgileri aynı `stroke-dashoffset:-44` animasyonunu kullanıyor.
- `dist/simulation.js` kablolarda yalnız `w._active` ve `w._fault` tutuyor; kablo başına signed current / flow direction yok.
- Mevcut öğretici testi enerji akışının davranışını değil yalnız CSS tokenlarının varlığını kontrol ediyor.

**Risk**
Mühürleme/geri besleme gibi devrelerde öğrenci gerçek enerji yönünü göremez; yön animasyonu pedagojik olarak yanlış/eksik olabilir.

**Düzeltme**
Solver'dan kablo başına signed akım veya kaynak→yük yön bilgisi üret; render/CSS yönünü bu veriden türet; mühürleme ters besleme golden testi ekle.

---

## MQ-P0-004 — Gerçek pano için 3B/kapak çarpışma güvenliği eksik

**Kanıt**
- Pano çakışma kontrolü aynı yüzeyde 2B bounding box kontrolü yapıyor.
- Dokümante mevcut sınır: kapak derinliği çarpışma hesabı yok.
- Kapak cihazının arka derinliği ile iç plaka cihazı/kanal/ray karşılaşması kontrol edilmiyor.

**Risk**
Ekranda geçerli görünen pano fiziksel olarak kapanmayabilir veya imalatta cihazlar çarpışabilir.

**Düzeltme**
Plate/door 3B hacimleri, kapak açı süpürme hacmi, montaj derinliği ve güvenli boşluk kontrolü.

---

# P1 — YÜKSEK ÖNCELİK

## MQ-P1-001 — Merkezi digital twin kaydı ve kaynak doğrulama durumu yok

Baz kütüphanede:
- 702 tanım,
- brand: 401,
- model: 702,
- herhangi bir source/symbolSource/technicalSource/datasheet alanı: 163,
- physical mm alanı: 0,
- sourceStatus: 0.

Bilgi kütüphane, asset manifestleri, özel modüller ve belgeler arasında dağınık.

**Düzeltme:** tek merkezi/yan kayıt digital twin registry + migration-safe ID ilişkisi.

---

## MQ-P1-002 — Görsel front-view / perspektif / sourceStatus metadata standardı yok

- Ürün ve PLC asset manifestlerinde `orientation`, `widthMm`, `heightMm`, `depthMm`, `sourceStatus` yok.
- PLC manifest: 202 kayıt; 89 exact, 113 family eşleşme; 114 kayıtta part number yok.
- Ürün manifest: 8 kayıt; yalnız 1 explicit exact match.
- Piksel bazlı ortografik/front-view uygunluğu manifestten otomatik doğrulanamıyor.

**Düzeltme:** `viewType: front|top|isometric|perspective`, exact/family/representative, sourceStatus, physical dimensions; ardından görsel audit.

---

## MQ-P1-003 — Pano render'ında ürün görseli non-uniform scale ile bozulabilir

`panel.js` native materyali `scale(w/d.w, h/d.h)` ile bağımsız X/Y ölçekliyor.

**Risk**
Gerçek fiziksel en-boy oranı ile çizim en-boy oranı farklıysa ürün görünümü esner/sıkışır.

**Düzeltme**
Doğrulanmış fiziksel frame + aspect-safe front asset + crop/letterbox/anchor standardı.

---

## MQ-P1-004 — “3D” malzeme yapısı çoğunlukla gerçek ürün geometrisi değil

Panel ürünleri esas olarak 2D ön yüzün düzleme yerleştirilmesi + genel derinlik/extrusion mantığı ile çiziliyor; tüm ürünlerde üretici CAD/collider yok.

**Düzeltme**
Gerçek CAD zorunlu olmayan ama ölçü-doğru 2.5D standardı; kritik cihazlarda gerçek depth/profile/collider.

---

## MQ-P1-005 — MEB uyumu makinece doğrulanabilir değil

Tutorial dosyalarında:
- `MEB` metadata alanı yok,
- ders başına resmi kazanım kodu yok,
- dal bilgisi yok,
- prerequisite/ön koşul alanı yok,
- sourceStatus/sourceUrl yok.

Kaynak başlıkları mevcut fakat resmi müfredat izlenebilirlik zinciri eksik.

**Düzeltme**
Her ders için `meb.area/branch/module/outcome/source/version/prerequisites/status`.

---

## MQ-P1-006 — Gerçek tarayıcı / görsel regresyon testi yok

- Mevcut DOM testleri gerçek Edge/Chrome layout testi değil.
- Windows launcher smoke testinde `DTS_LAUNCHER_TEST=1` kullanıldığı için tarayıcı açılmaz.
- Görsel front-view, terminal hizası, dashboard taşması, responsive davranış piksel/gerçek browser düzeyinde otomatik kapıda değil.

**Düzeltme**
Offline gerçek browser smoke + seçili golden screenshot/geometry testleri; launcher gerçek açılış için kontrollü test.

---

## MQ-P1-007 — G0–G8 kalite kapılarının çoğu CI tarafından uygulanmıyor

CI bugün:
- dal/hash kilidi,
- syntax,
- local dependency,
- library ID/pin uniqueness,
- örnek koruması,
- 455 test,
- paket doğrulaması
yapıyor.

Ancak otomatik olarak doğrulanmayanlar:
- fiziksel mm/sourceStatus,
- front-view orientation,
- exact/family kalite,
- terminal mm doğruluğu,
- MEB mapping,
- enerji yönü,
- gerçek browser görsel kabul.

**Düzeltme**
Yeni kalite validatorları: digital twin schema, source gate, asset gate, tutorial curriculum gate, signed-flow golden tests.

---

## MQ-P1-008 — v1.19.20 branch'i uygulama/paket kimliği olarak hâlâ v1.19.1

**Kanıt**
- `APP_VERSION='1.19.1'`
- dashboard/topbar v1.19.1
- `studio.js` v1.19.1
- `BASLAT.bat` v1.19.1
- `KULLANIM.txt` v1.19.1
- son Actions paketi: `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip`

**Sonuç**
`v1.19.20` dalından üretilen artifact kendini v1.19.1 olarak tanıtıyor.

**Düzeltme**
Release/version policy belirle; aktif kalite dalı kullanıcıya indirilebilir sürüm ise tüm sürüm yüzeylerini atomik güncelle ve version test ekle.

---

## MQ-P1-009 — Güncel dokümantasyonda branch/sürüm/çalışma alanı çelişkileri var

Örnek:
- README aktif dalı v1.19.0 diyor.
- README “üç çalışma alanı” diyor; uygulamada Kumanda/Tesisat/Pano/Arduino + Öğretici kartı var.
- GELISTIRME, silinmiş `golden/v1.18.0` dalını ve v1.19.0 aktif dalını anlatıyor.
- GELISTIRME Actions'ı main push olarak anlatıyor; gerçek workflow v1.19.20.
- TALEPLER eski uzun adlı 1.19.1 branch'i aktif gibi kaydediyor.
- DURUM içinde eski 427 test / 48 fail ve Faz 10 açık anlatımları güncel durumla yan yana duruyor.

**Risk**
Yeni oturum/ajan yanlış dala veya eski çalışma yöntemine dönebilir.

**Düzeltme**
“current truth” bölümlerini tek kaynağa indir; tarihsel kayıtları açık ARCHIVE/HISTORY etiketiyle ayır.

---

## MQ-P1-010 — Save/load migration sürüm bazlı değil

- Proje formatı runtime'da `version:7`.
- `normalizeLegacy()` şekil/alias bazlı ad-hoc dönüşüm yapıyor; `version` değerine göre migration chain yok.
- `app.load` sonunda `p.version=7` yazıyor.
- Digital twin/panel schema değişiklikleri için kontrollü vN→vN+1 migration tablosu bulunmuyor.

**Risk**
Yeni physical metadata eklenirken eski projelerde sessiz veri kaybı/yanlış varsayım riski.

**Düzeltme**
Versioned migrations + fixture matrisi + round-trip tests.

---

## MQ-P1-011 — GitHub kilit alarmı anlık değil

Workflow yalnız `v1.19.20` push ve PR'larında tetikleniyor.

**Risk**
`main`, `v1.19.0` veya `v1.19.1` yanlışlıkla değiştirilirse veya fazladan branch açılırsa hata bir sonraki v1.19.20 run'ına kadar görülmeyebilir.

**Düzeltme**
Kilitli branch push'larında da alarm workflow çalıştır; server-side protection mümkün olmadığından tespit süresini azalt.

---

## MQ-P1-012 — Varsayılan GitHub branch `main` = eski v1.18.0

Repo default branch: `main`.

**Risk**
Repo sayfasını açan veya branch seçmeden Code → Download ZIP yapan kişi eski golden v1.18.0'ı indirir.

**Düzeltme seçenekleri**
1. Default branch'i `v1.19.20` yap, `main` golden olarak sabit kalmaya devam etsin; veya
2. repo açıklaması + README'de çok görünür “güncel dal v1.19.20” yönlendirmesi.

---

## MQ-P1-013 — Pano mühendislik kontrolleri gerçek imalat için eksik

Mevcut modelde doğrulanmayan/hesaplanmayan alanlar:
- kablo minimum bend radius,
- kanal doluluk kapasitesi,
- kablo demeti/segregasyon,
- cihaz üretici minimum clearance,
- terminal servis alanı,
- ısı yayılımı/ventilasyon,
- kapak arkası clearance,
- kablo uzunluğu/BOM,
- delik/kesim/montaj çıktısı.

**Düzeltme**
Gerçek pano hedefi için aşamalı engineering constraints katmanı.

---

# P2 — ORTA / MİMARİ BORÇ / KAPSAM

## MQ-P2-001 — Kütüphane monolitik ve audit maliyeti yüksek

`dist/library.js` yaklaşık 1.8 MB ve yüzlerce tanımı tek dosyada tutuyor.

**Düzeltme**
ID'leri bozmadan sidecar digital twin metadata ve jenerasyon/validation; geniş riskli refactor yapma.

---

## MQ-P2-002 — Stale/dead “Yeni proje” handler'ı

`app.js` içinde eski `#newBtn` handler'ı `version:6` proje yaratıyor. Normal akışta daha sonra `studio.js` handler'ı bunu override ediyor; bugün görünür ana hata değil fakat ölü/stale kod riski.

**Düzeltme**
Tek controller sahibi; kullanılmayan handler'ı kaldır veya ortak createProject API'sine bağla.

---

## MQ-P2-003 — Cache-buster sürüm etiketleri karışık

`dist/index.html` içinde v1.19.0/v1.19.1 revizyon etiketleri karışık. Bunların bir kısmı cache revision olarak işlevsel olsa da semver görünümü bakımda kafa karıştırıyor.

**Düzeltme**
Cache revision ile app semver'i ayrı isimlendirme standardına bağla.

---

## MQ-P2-004 — Tarihsel root dosyaları aktif dokümanlarla iç içe

Root'ta çok sayıda eski `DOGRULAMA_*`, `YENILIKLER_*`, `final-*.txt`, kaynak geçmişi var. Bunlar korunmalı tarihsel kanıt; ancak aktif çalışma dosyalarıyla aynı seviyede.

**Düzeltme**
MQ-13 kontrollü planla “archive/history index” oluşturmalı; dosyaları taşımak eski referansları kıracaksa önce sadece indeksleme/etiketleme yapılmalı.

---

# BİLİNEN KAPSAM SINIRLARI — BUG DEĞİL, PROFESYONEL HEDEF İÇİN EKSİK

## MQ-LIM-001 — PLC runtime
PLC ladder/program yürütme ve fieldbus/Modbus/USS/DDCS emülasyonu yok.

## MQ-LIM-002 — PLC görselleri
Her varyant birebir ürün fotoğrafı/terminal baskısı değil; 202 PLC assetinin 113'ü family match.

## MQ-LIM-003 — Sürücü modeli
V20/ACS800 tam firmware/PWM/DTC emülasyonu değil.

## MQ-LIM-004 — Yarı iletkenler
BJT/MOSFET/IGBT eşikleri eğitim modeli; SCR/Triac latch/AC commutation, DIAC hysteresis ve gerçek op-amp analog kararlılık modeli eksik.

## MQ-LIM-005 — Arduino runtime
Tam C++/Arduino Core ve tüm kütüphaneler emüle edilmiyor; bazı resmi örnekler reference/kısmi kapsam.

## MQ-LIM-006 — Bina tesisatı mühendislik hesabı
Kesit hesabı, seçicilik/koruma koordinasyonu ve mevzuat uygunluk hesabı yok.

Bu maddeler kullanıcıya kapsam dışı olarak açıkça gösterildiği sürece mevcut uygulamada “gizli hata” değildir; profesyonel hedef büyütülürse ayrı roadmap gerekir.

---

# ÖNERİLEN DÜZELTME SIRASI

## TUR 1 — P0 temel veri sözleşmesi
1. WP-001 Physical Dimension / Digital Twin Schema
2. WP-002 Terminal Coordinate Contract
3. WP-007 Signed Energy Flow Contract
4. WP-008 Panel 3D Collision / Clearance Contract
5. Versioned migration tasarımı

## TUR 2 — Kaynak ve görsel güvenilirlik
6. Asset orientation/sourceStatus validator
7. PLC exact/family kalite sınıflandırması
8. Ön görünüm görsel audit
9. Üretici mm verisi toplama ve kaynaklama

## TUR 3 — Öğretici / MEB
10. Signed-flow animasyonu
11. Mühürleme geri-besleme golden testi
12. MEB metadata şeması ve resmi kaynak doğrulaması
13. Ders prerequisite sırası

## TUR 4 — Release / GitHub / test
14. v1.19.20 version kimliği
15. README/GELISTIRME/TALEPLER/DURUM current-truth temizliği
16. gerçek browser visual smoke
17. CI G1–G4 validatorları
18. locked-branch anlık alarm
19. default branch / Download ZIP kullanıcı akışı kararı

## TUR 5 — Pano profesyonelleştirme
20. clearance, bend radius, duct fill, thermal/ventilation, BOM/length, manufacturing outputs.

---

# MASTER KARARI

**v1.19.20 mevcut regresyon açısından kararlı, fakat Master Quality hedefi açısından henüz release-quality değildir.**

Ana release blockerlar:
1. gerçek fiziksel ürün ölçü sistemi,
2. terminal fiziksel koordinat sözleşmesi,
3. signed akım/enerji yönü,
4. gerçek pano 3B/kapak çarpışma doğruluğu.

P1 kalite kapıları tamamlanmadan “gerçek pano tasarımına güvenilir temel” iddiası yapılmamalıdır.
