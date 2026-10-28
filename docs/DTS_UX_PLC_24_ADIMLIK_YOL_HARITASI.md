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
| 15 | Ladder kaydet/aç/örnek program kütüphanesi | **KISMİ/KOD**: DTS `.dtsladder` dosyası ve **dört özgün hedefli native testli örnek** (Start/Stop, TON, CTU, ileri/geri kilit) editörde yalnız taslağa yüklenir; Windows Edge / dosya seçici kabulü açık |

## Paket C — Devre deneyimi (5 madde)

| No | Özellik | Durum |
| --- | --- | --- |
| 16 | Bileşene tıklayınca kısa görev/terminal/parametre kartı | **KISMİ/KOD**: katalog ad/model/kind/gerçek ilk 8 terminal özeti; dinamik parametre öğreticisi ve Edge görsel kabulü açık |
| 17 | Simülasyon durumu ve aktif enerji yollarını daha anlaşılır göster | **KISMİ**: eski DTS enerji yolu göstergeleri mevcut; tutarlı yeni UX ayrı |
| 18 | Yanlış bağlantıyı kaynak/terminal üzerinde açıkla | **KISMİ/KOD**: salt okunur kablo ucu/katalog terminali ve silinmiş bileşen referansı taraması, sorun adıyla rapor; fiziksel kablo davranışı / ekran üstü vurgulama açık |
| 19 | 2D/3D arasında terminal/kablo sürekliliği | **MEVCUT/REVIEW**: eski özellik, Windows piksel kabulü ayrı |
| 20 | PDF/PNG ve malzeme listesiyle proje teslimi | **KISMİ/KOD**: çevrimdışı CSV malzeme listesi; gerçek katalog miktarı ve referanslar; PDF/PNG, Windows Edge kabulü açık |

## Paket D — Gelişmiş üretkenlik (4 madde)

| No | Özellik | Durum |
| --- | --- | --- |
| 21 | Görsel bileşen editörü, terminal koordinatları ve katalogya kontrollü ekleme | **PLAN** |
| 22 | Hızlı Başla / Hazır Örnek / Öğretici başlangıç akışı | **KISMİ**: dashboard mevcut, yeniden tasarım açık |
| 23 | FBD editörü, Ladder ile işlevsel eşdeğerlik | **KISMİ/KOD**: LAD/FBD arasında aynı native Ladder programını gösteren alternatif AND/OR/NOT blok görünümü; tıklanabilir bloklar mevcut alanları düzenler, bağımsız FBD dosyası/sürükle-bırak ve Edge kabulü açık |
| 24 | Sanal operatör paneli ve canlı PLC I/O ekranı | **KISMİ/KOD**: ayrı açılıp kapanan salt okunur sanal PLC I/O paneli, birden fazla native onaylı PLC seçimi, kaynaklı sinyal durumu; giriş zorlama/cihaz kontrolü yok, Windows/Edge kabulü açık |

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

### 28 Ekim — Ladder modalı simülasyon başlatma düğmesinin 300 ms güncelleme kusuru

**Somut kusur:** İlk çizimde kayıtlı Ladder için etkin görünen `Simüle et`, 300 ms izleme yenilemesinde `liveSaved` (yalnız çalışan simülasyonda true) ile denetlendiği için simülasyon kapalıyken yanlışlıkla devre dışı kalıyordu. `dist/ladder-editor.js` zamanlayıcı yolunda mevcut `canStartLadder` kapısı tekrar kullanıldı; kaydedilmemiş taslak, devre kilidi, başka program ve devre dışı native simülasyon için negatif kapılar korunur. `tests/dts-ladder-editor-smoke.test.cjs` dosyasına iki hedefli pozitif/negatif test eklendi. **Bu turda V8 üzerinde gerçek kaynakla 8/8 izole JS testi PASS; Node/Windows Edge görsel ve native entegrasyon bu turda NOT_RUN/REVIEW.** 09/13/14 numaralı maddeler hâlâ KISMİ; bağımsız COMPLETE verilmedi.

### 28 Ekim — tarama anı sinyali ve enerjisiz PLC izlemesi

**Somut kusur:** Önceki rung Q1 kontağını okurken Q1=0 olmasına rağmen, daha sonraki rung Q1'i 1 yapınca SVG önceki yolu yanlış yeşil gösterebiliyordu. TON/RESET giriş etkinliği ile gerçek bobin/blok çıkışı da ayrıştırılmamıştı. CPU beslemesi yokken sanal Ladder taraması iz ve bellek oluşturabiliyordu.

**Onarım:** `ladder-runtime.js` her network için gerçek tarama anı `pathStates` izini üretir. `ladder-editor.js` yalnız kaydedilmiş programın izini gösterir; `ladder-diagram.js` gerçek giriş yolunu ve çıkış durumunu ayrı renklendirir. `plc-runtime.js` enerjisiz CPU'da taramayı durdurup bellek/izleri temizler; `ladder-monitor.js` I/O durumunu gizler. Fiziksel çıkış bankı beslemesi ile CPU mantık çıkışı ayrımı korunur.

**Kanıt:** Yeni `tests/dts-ladder-trace-power-regression.test.cjs` dosyası 7 hedefli vaka içerir; aynı 7 vaka değiştirilmiş gerçek kaynakla V8'de çalıştırıldı. **Node.js dosya çalıştırması ve Windows/Edge/3D kabulü NOT_RUN/REVIEW.** Maddeler 11/13/14/17/24 hâlâ KISMİ; Golden/HOLD/1686 ders etkilenmedi.

### 28 Ekim — Asenkron Ladder dosyası içe aktarma kimlik kapısı

**Somut kusur:** `File.text()` beklenirken Ladder penceresinde PLC değiştirildiğinde geç gelen dosya sonucu yeni PLC'nin taslağına yazılabiliyordu. **Onarım:** İçe aktarma başındaki PLC nesnesi, proje nesnesi ve terminal sınırı sabitlenir; dosya okunduktan sonra hâlâ aynı PLC ve aynı açık pencere değilse hiçbir program değiştirilmez ve anlaşılır iptal mesajı gösterilir. İçe aktarma zaten kaydedilmiş programa doğrudan müdahale etmez. `tests/dts-ladder-import-context.test.cjs` eklendi. Yalnız hedefli V8 JS davranış testi; Node/Windows görsel kabulü REVIEW.

### 28 Ekim — Çevrimdışı CSV malzeme listesi

Şema `project.components` ve gerçek katalog `byId` alanları kullanılarak malzemeler tür kimliğine göre sayılır, katalog model/marka ve varsa referanslar kaydedilir. Fiyat, fiziksel uygunluk ve çalışır devre iddiası üretilmez. CSV'de formül hücresi enjeksiyonuna karşı güvenli metin kaçışı kullanılır. `dist/material-list.js` ve hedefli testleri eklendi. PDF/PNG ayrı açık; Windows/Edge görsel ve gerçek indirme testi REVIEW.

### 28 Ekim — Kaynak temelli bağlantı denetimi

`dist/wire-diagnostics.js` gerçek şemadaki kabloların `from/to` uçlarını `project.components`, `junctions`, `byId` katalog terminal kimlikleriyle karşılaştırır. Silinmiş bileşen, olmayan terminal/düğüm, eksik uç, aynı uç bağlantısı gibi doğrulanabilir referans sorunlarını gösterir. **Kabloları veya simülasyonu otomatik değiştirmez.** Sonuçta sorun yoksa yalnız kimliklerin tanındığını söyler; güvenli/devre çalışır/elektriksel doğru iddiası vermez. Madde 18 KISMİ; terminal vurgusu, Windows Edge ve fiziksel kabul ayrı.

### 28 Ekim — Kablo teşhisinden çizimdeki kabloya görsel yönlendirme

18 numaralı bağlantı denetimi geliştirildi: gerçek `data-wire` SVG kimliği üzerinden ilgili kablo, çizimde geçici turuncu kesik çizgili vurguyla işaretlenir. Sonuç listesindeki kablo kimliği düğmesine tıklamak yalnız o kabloyu vurgular; eşleşen çizim düğümü yoksa yanlış başarı bildirmez. `wire-diagnostics.js` salt okunur DOM sınıfı değiştirir, model, gerçek tel rengi, bağlantı veya native `Simulation.solve` durumuna dokunmaz. Tanınan uçlar elektriksel doğruluk veya güvenlik kabulü değildir. Hedefli pozitif/negatif V8 mantık kontrolleri; Windows/Edge görsel kabulü **REVIEW**.

### 28 Ekim — bağımsız sanal PLC operatör paneli (24)

DTS üst barına `▣ PLC I/O` eklendi. Pencere editörden bağımsız açılır/kapanır; yalnız `ladder-runtime.supportedPLC` kapısından geçmiş gerçek katalog cihazları listeler. Giriş/çıkışlar `ladder-monitor.snapshot` ve orijinal `_plcRuntime` durumuyla canlı, simülasyon kapalı/CPU enerjisiz/yanlış Ladder modunda bilinmiyor olarak gösterilir. Panel PLC girişlerini zorlamaz, gerçek donanım ile iletişim kurmaz. Dashboard'a geçerken kapanır; yalnız açıkken 350 ms günceller. **KOD / hedefli izole test; Windows/Edge görsel REVIEW.**

### 28 Ekim — dört özgün testli Ladder hazır örneği

`dist/ladder-examples.js` kaynak kodunda dört özgün derslik V1 programı bulunur: I1/I2 Start–Stop mühürleme; I1→TON T1 1500ms→Q1; CTU C1 üç darbe, I2 RESET C1, Q1; I1/I3 ileri-geri Q1/Q2 sanal karşılıklı kilitleme, I2 durdurma. `Ladder.validate` giriş/çıkış sayısına göre örnek seçimini kısıtlar. `dist/ladder-editor.js` örnek düğmesi yalnız aktif PLC taslağını değiştirir; kalıcı değişiklik için mevcut proje kilitlerini kullanan Kaydet gerekir. Bu kod gerçek Siemens LOGO binary/.lsc örneklerinden türetilmiş bir aktarım değildir. **Bu turdaki JS izole native tarama pozitif/negatif kontrolleri** raporlandı; Windows/Edge ve bağımsız gerçek elektriksel kabul ayrıca REVIEW.

### 28 Ekim — TP (darbe zamanlayıcı) erken yeniden tetikleme onarımı

**Somut kusur:** `dist/ladder-runtime.js` içindeki sanal TP zamanlayıcısı, 100 ms darbe sürerken giriş 10 ms'de bırakılıp 20 ms'de tekrar yükseldiğinde `pulseStart` değerini 20 ms'ye taşıyarak darbenin süresini istemeden uzatıyordu. Bu, özgün DTS V1'deki IEC benzeri TP tek darbe beklentisine aykırıydı.

**Onarım:** Yeni yükselen kenar yalnız önceki TP darbesi bitmişse yeni darbe başlatır; giriş darbe sırasında bırakılıp tekrar verilirse süre uzamaz. Süre sonunda giriş hâlâ yüksekse kendiliğinden yeni darbe oluşmaz; yeni yükselen kenar gerekir. Sanal saat geriye dönerse gelecekteki başlangıç belleği temizlenir. TON, TOF, CTU, CTD, PLC katalog modeli ve fiziksel çıkış eşlemesi değiştirilmedi.

**Kanıt:** Kaynaktaki hata önce gerçek Node 22 testinde yeniden üretildi (**1 FAIL, 2 PASS**); onarımdan sonra yeni `tests/dts-ladder-tp-nonretrigger.test.cjs` **5/5 PASS**, daha önce var olan `dts-ladder-ctd-regression.test.cjs` **4/4 PASS** ve `dts-ladder-output-safety.test.cjs` **4/4 PASS**, toplam **13/13 hedefli Node testi PASS**. Gerçek Windows/Edge görsel ve tüm `Simulation.solve` entegrasyonu bu turda **NOT_RUN/REVIEW**; madde **11 KISMİ**, 24 maddelik tam kabul veya 1686 ders COMPLETE sayacı değişmedi.

### 28 Ekim — Gerçek tarama verisine bağlı FBD blok görünümü

`dist/fbd-view.js` yalnız Ladder V1 rung'larını alternatif AND/OR ve ters kontak (NOT) blokları olarak gösterir. Tıklanan kontak ve bobin mevcut Ladder editöründeki ilgili alana yönlendirilir. Yeşil durumlar `pathStates` ve `coilValue` tarama izinden gelir; yeni bir hesaplama/sahte elektrik modeli oluşturulmaz. Geliştirme **KISMİ**; Windows/Edge ve serbest FBD düzenleme kabulü açık.
