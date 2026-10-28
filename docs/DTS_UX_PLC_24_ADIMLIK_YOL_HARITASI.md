# DTS UI/UX + PLC Ladder — 24 Adımlık Canlı Geliştirme Planı
**28 Ekim 2026 · Depo:** `uysalayhan23/DevreTasarimStudyo` · **Aktif dal:** `main`

**Öncelik:** Arayüzde kullanım kolaylığı, tam sayfa ve simülasyon odak görünümü, özgün ve sanal PLC Ladder programlama. Kullanıcının açık yeni talebi olmadan geniş ders taramasını başlatma. Ders değişikliği istenirse ilk olarak [ders arşivi](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md) okunur. Önce [AGENTS.md](../AGENTS.md), [Ladder incelemesi](LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md) ve [güncel teknik gelişmeler](PLANNER_UI_LADDER_GUNCEL_2026-10-28.md) okunur.

**Durum terminolojisi:** `KOD/TEST` işlevin kodu ve adı geçen hedefli test tamamlandı; **Windows Edge/3D/pedagojik tam kabul değildir.** `KISMİ` başlangıç altyapısı mevcut, bütün kabul maddesi tamamlanmadı. `MEVCUT` daha eski DTS özelliği. `PLAN` henüz uygulanmadı. `REVIEW` kullanıcı/gerçek görsel kabulü açık. PASS yalnız gerçekte koşulan testin kapsamını ifade eder.

## Paket A — Çalışma alanı (8 madde)

| No | Özellik | Durum ve kanıt |
| --- | --- | --- |
| 01 | Standart / Simülasyon Odak / Tam Sayfa görünüm | **KOD/TEST**: `ea96daf90d`; 18/18 izolasyon UI testi, Windows görsel REVIEW |
| 02 | Simülasyon başlarken kütüphaneyi daralt | **KOD/TEST**: `dist/workspace-modes.js` |
| 03 | Özellikler panelini gizle ve önceki düzeni geri getir | **KOD/TEST**: panel snapshot + restore |
| 04 | Tam sayfa / standart düğmesi, Esc ile çıkış | **KOD/TEST**: CSS fallback, Fullscreen API; Edge REVIEW |
| 05 | Yan panelleri kullanıcının isteğiyle aç/kapat | **MEVCUT**: `collapseLibrary`, `applyPropertiesVisibility` |
| 06 | Sade, gruplandırılmış üst araç çubuğu | **KOD / REVIEW**: Dosya, Düzenle, Görünüm grupları; eski ID'ler korunur, dar ekranda kaydırılır; Windows görsel kabulü açık |
| 07 | Ctrl/Cmd+K hızlı kütüphane araması; Esc ile temizle | **KOD/TEST**: `67547c6ba4`, 15 hedefli mantık kontrolü |
| 08 | Dar ekran ergonomisi, odak modu, tercihleri koruma | **KISMİ**: simülasyon snapshot, tam responsive Windows REVIEW |

## Paket B — PLC Ladder (7 madde)

| No | Özellik | Durum ve kanıt |
| --- | --- | --- |
| 09 | PLC üzerinde görsel Ladder editörü | **KISMİ**: `64bc88b835`, rung/kontak/bobin kontrol ekranı; sürükle-bırak, Edge REVIEW |
| 10 | NO/NC, seri/paralel, bobin | **KOD/TEST**: `82c84733fab`, hedefli Boolean native test |
| 11 | TON/TOF/TP/SET/RESET/CTU/CTD ve M bitleri | **KISMİ**: sanal çalışma motorunda temelleri var; tüm karşıt/kenar/reset vakaları için ek regresyon açık |
| 12 | Ladder I1/Q1 adreslerini gerçek katalog terminalleriyle eşleştirme | **KOD/TEST (tek model)**: `plc-hw-6es7211-1ae40-0xb0` |
| 13 | Ladder tarama ve özgün `Simulation.solve` ile fiziksel devre | **KOD/TEST (tek model)**: 703 katalog 7/7 hedefli gerçek native sanal sahne |
| 14 | Canlı Ladder sinyal/aktif kontak/timer/sayaç izleme | **KISMİ**: rung aktivite işareti var; tam mantık yolu, timer değeri ve UI testleri açık |
| 15 | Ladder kaydet/aç/örnek program kütüphanesi | **KISMİ**: `ladderProgram` proje nesnesine kaydedilir ve JSON temizlemede korunur; gelişmiş örnek/ithal/ihracat ve Windows yeniden açma testi açık |

## Paket C — Devre deneyimi (5 madde)

| No | Özellik | Durum |
| --- | --- | --- |
| 16 | Bileşene tıklayınca kısa görev/terminal/parametre kartı | **PLAN** |
| 17 | Simülasyon durumu ve aktif enerji yollarını daha anlaşılır göster | **KISMİ**: eski DTS enerji yolu göstergeleri mevcut; tutarlı yeni UX ayrı |
| 18 | Yanlış bağlantıyı kaynak/terminal üzerinde açıkla | **PLAN** |
| 19 | 2D/3D arasında terminal/kablo sürekliliği | **MEVCUT/REVIEW**: eski özellik, Windows piksel kabulü ayrı |
| 20 | PDF/PNG ve malzeme listesiyle proje teslimi | **PLAN** |

## Paket D — Gelişmiş üretkenlik (4 madde)

| No | Özellik | Durum |
| --- | --- | --- |
| 21 | Görsel bileşen editörü, terminal koordinatları ve katalogya kontrollü ekleme | **PLAN** |
| 22 | Hızlı Başla / Hazır Örnek / Öğretici başlangıç akışı | **KISMİ**: dashboard mevcut, yeniden tasarım açık |
| 23 | FBD editörü, Ladder ile işlevsel eşdeğerlik | **PLAN** |
| 24 | Sanal operatör paneli ve canlı PLC I/O ekranı | **PLAN** |

## Zorunlu teknik dosyalar ve gerçek teslimat özeti

| Paket | Doğrulanmış `main` commit | Teknik test |
| --- | --- | --- |
| UI 3 modu | `ea96daf90dfb54654879f409ed2ec449f5e3a874` | 18/18 UI davranışı, Windows/Edge REVIEW |
| Ladder sanal çekirdek | `82c84733fabcf28da61318e84bf6514e643a86d1` | 20/20 izole mantık/PLC program testi |
| Görsel Ladder editörü | `64bc88b83574410acf48d47b0dfe843c247a46e5` | 6/6 UI source/helper kontrolü, Windows/Edge REVIEW |
| Katalog modeli doğrulaması | `14d56cc36339501f2a73e9eee783754e75f6c7a4` | 703 gerçek katalog 7/7 native, 8/8 ek donanım gate kontrolü |
| Native regresyon dosyaları | `db18e5fe9ca268d841bbf0d34163f1ae592beb46` | `tests/dts-ladder-native-703.test.cjs` ve UI smoke; CI/Actions kullanılmadı |

**Elektriksel gerçek:** Yük kablosu veya çıkış bankı koparsa PLC'nin sanal mantıksal çıkışı doğru biçimde Q1=1 kalabilir, buna rağmen yük **enerjilenmemelidir**; simülasyonda bu ayrım kanıtlandı. Kanıtsız diğer PLC modellerinin Ladder çalıştırması korumalı; yalnız doğrulanmış 703 katalog modeli seçilebilir. Bu bir eğitim simülasyonudur; gerçek Siemens PLC donanımına program göndermez.

## Kalanların gece güvenli öncelik sırası

1. Önce yeni Ladder kaynaklarının güncel GH HEAD ve blob SHA'sını teyit et, tüm eski 1686 dersi yeniden tarama.
2. `tests/dts-ladder-native-703.test.cjs`, `tests/dts-ladder-editor-smoke.test.cjs`, `tests/workspace-modes-ui.test.cjs` ve uygun eski PLC testlerinden yalnız hedefli olanları gerçek Node ile doğrula. **NOT_RUN = PASS değil.**
3. Karşıt Timer/counter kenarı, PLC besleme kesme, sanal I/O model sınırları ve Ladder canlı izleme; kusur varsa küçük gerçek kaynak onarımı.
4. Ardından 06, 08, 14, 15, 16 gibi yüksek değerli UX maddeleri; modal, kaydetme/undo, kullanıcı sayfa düzeni ve güvenilir çalışma alanı.
5. Windows/Edge `file:///` ile gerçek tam ekran/panel dönüşü ve Ladder modalının görsel kabulü yalnız gerçekten çalıştırıldıysa PASS.
6. Sadece kanıtlı gerçek değişiklik `[skip ci]` ile `main`, uzak HEAD/blob SHA doğrula. `BASLAT.bat`, 3D ölçek, Golden, PASS/HOLD/REVIEW, 703 katalog ve bağımsız COMPLETE kilitleri korunur.

**Önceki 1686 ders ilerleme sayacı ile bu 24 maddelik ürün planını birleştirme.** Yeni plan maddesi tamamlandığında burada ilgili test/commit ve kabul seviyesi açıkça güncellenecek.

## 28 Ekim — Ladder görsel ağ editörü (görsel referanslar)

Kullanıcının gönderdiği üç LAD örneğinin soyut ilkeleri kullanılarak (görseller/Siemens kaynakları depoya kopyalanmadan) özgün DTS şeması geliştirildi: beyaz 20 px grid, L1/L2 rayları, network/rung numarası, yatay NO/NC sembolleri, paralel yollar, Q bobini, TON/TOF/TP/CTU/CTD fonksiyon blokları; simülasyon yürürken yalnız doğrulanmış, kaydedilmiş program ve gerçek hafıza bitleri üzerinden yeşil tam yol gösterimi. SVG görseli gerçek rung yapısından üretilir, düzenleme alanları ve undo/redo korunur. **Durum:** Madde 09 görsel yaklaşım KISMİ/KOD; Windows Edge görsel ve erişilebilir düzenleme kabulü REVIEW. 

### 28 Ekim — tıklanabilir rung + sanal PLC I/O paneli

Yeni SVG kontak ve bobin sembolleri klavye (Enter/Space) ve fare ile kendi düzenleme alanına odaklanır. Ladder penceresi içinde gerçek sanal CPU DI/DO durumunu sadece **kayıtlı program eşleşiyorsa ve simülasyon çalışıyorsa** gösteren, yazı/renk destekli I/O izleme paneli bulunur. Etkin olmayan veya farklı taslakta değerler `—` gösterilir; `Q` mantıksal çıkışı bir yükün gerçekten enerjilendiği anlamına gelmez. Düzenlemeler simülasyon sırasında kaydedilmez, simülasyon başlat/durdur düğmesi mevcut DTS `simulateBtn` yolunu kullanır. **Durum:** madde 09, 14, 24 üzerinde KISMİ ilerleme; Windows/Edge/3D kabul REVIEW.

**Hedefli çalıştırma-kapısı onarımı:** Ladder modalindeki Simüle et düğmesinin önceki kodunda `live` değişkeni yalnız `running=true` iken doğru olduğundan kaydedilmiş programdan simülasyon başlatılamıyordu. Ayrı `canStartLadder` kapısı, kayıtlı program eşleşmesi ve mevcut `#simulateBtn.disabled` durumu üzerinden bu sorunu düzeltiyor. Boş taslak/kayıtsız değişiklik/PLC kilidi negatif kontrolleri korunur. Windows Edge kabulü açık.

### Network açıklaması ve görsel rung başlıkları

Her Ladder ağında isteğe bağlı 100 karakterlik açıklama desteklenir; proje nesnesiyle birlikte kaydedilir, Ctrl+Z/ileri al ile geri alınabilir, SVG üstünde Network başlığının yanında güvenli kaçışla gösterilir. Açıklama mantık hesabının operandı değildir, 100 karakter üstü veya metin dışı içeriği doğrulama kapısı reddeder. **KOD + hedefli mantık testi; gerçek Windows/Edge görsel kabulü REVIEW.**
