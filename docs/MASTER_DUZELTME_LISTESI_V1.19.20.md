# v1.19.20 — MASTER DÜZELTME LİSTESİ

Durum: **AKTİF / TEK KAYNAK / FULL G7 CLEAN / MQ-00 REVIEW COMPLETE WITH OPEN BLOCKERS**
Tarih: 2026-10-04
Aktif dal: **`main`** (`uysalayhan23/DevreTasarimStudyo`, 2026-10-10 kullanıcı kararı); `v1.19.20` eski belgelere ait tarihsel dal adıdır, güncel çalışma dalı değildir.
Kaynak auditler:
- `docs/MASTER_QUALITY_AUDIT_V2.md`
- `docs/MASTER_QUALITY_AUDIT_V3_AGENT_CROSSCHECK.md`

Bu dosya bundan sonraki kalite ve düzeltme çalışmalarının tek birleşik backlog kaynağıdır. Aynı bulgu ikinci kez yeni ID ile açılmaz; mevcut kayda kanıt eklenir.

## Öncelik anlamı

- **P0:** release blocker / gerçek pano, elektriksel doğruluk veya veri güvenliği için kritik.
- **P1:** yüksek öncelikli kalite, güvenilirlik, pedagojik veya operasyonel açık.
- **P2:** mimari borç, verim, bakım ve organizasyon iyileştirmesi.
- **AUDIT GAP:** karar vermek için henüz eksik kalan denetim.

---

# P0 — RELEASE BLOCKER

| ID | Alan | Lider | Çapraz doğrulama | Sorun | Tamamlanma ölçütü |
|---|---|---|---|---|---|
| MQ-P0-001 | Fiziksel ölçü / Digital Twin | MQ-02 | MQ-01, MQ-03, MQ-04, MQ-11, MQ-12 | Ürün bazlı gerçek W/H/D mm sistemi yok; pano ölçüsü kategori fallbacklerine bağlı. | Merkezi physical metadata + sourceStatus; doğrulanmış ürünlerde gerçek mm; legacy fallback açıkça approximate; test ve migration. |
| MQ-P0-002 | Terminal geometrisi | MQ-04 | MQ-02, MQ-03, MQ-12 | Terminal pano koordinatı yaklaşık gövde boyutuna oranlanıyor. | Terminal/asset/hitbox/pano aynı doğrulanmış fiziksel frame; golden geometry testleri. |
| MQ-P0-003 | Signed enerji/akım yönü | MQ-05, MQ-06 | MQ-07, MQ-12 | Enerjili hat animasyonu var fakat kablo başına solver-türevi signed yön yok. | Signed flow contract; mühürleme/geri besleme dahil yön golden testleri; UI yönü solver verisinden türetilir. |
| MQ-P0-004 | Pano 3B çarpışma | MQ-02, MQ-03 | MQ-04, MQ-10, MQ-12 | Door/plate derinlik ve kapanma çarpışma kontrolü yok. | Door sweep volume + depth/clearance collision; kapanmayan fiziksel pano geçersiz sayılır. |

---

# P1 — YÜKSEK ÖNCELİK

| ID | Alan | Lider | Çapraz doğrulama | Sorun / eksik | Hedef |
|---|---|---|---|---|---|
| MQ-P1-001 | Digital Twin | MQ-01/MQ-02 | MQ-04/MQ-11 | Ürün bilgisi birçok dosyaya dağılmış; merkezi kayıt yok. | ID, üretici/model, kaynak, ölçü, asset, terminal, simülasyon, kalite tek sözleşmede. |
| MQ-P1-002 | Asset standardı | MQ-01/MQ-03 | MQ-09/MQ-12 | front/top/isometric/perspective ve exact/family/representative metadata merkezi değil. | orientation + matchQuality + sourceStatus validator. |
| MQ-P1-003 | Pano render | MQ-03 | MQ-02/MQ-10 | Native görsel X/Y bağımsız scale ile esneyebilir. | Aspect-safe physical frame + crop/anchor standardı. |
| MQ-P1-004 | 2.5D/3D doğruluk | MQ-03 | MQ-02/MQ-04 | Çoğu cihaz gerçek CAD değil; genel extrusion kullanıyor. | Ölçü-doğru 2.5D minimum standardı; kritik cihazlarda gerçek profile/depth/collider. |
| MQ-P1-005 | MEB | MQ-08 | MQ-07/MQ-12 | Ders bazlı area/branch/module/outcome/prerequisite/source-status zinciri yok. | Resmi MEB metadata + kaynak/sürüm/sayfa + prerequisite doğrulaması. |
| MQ-P1-006 | Gerçek browser test | MQ-10/MQ-12 | MQ-13 | Gerçek Chrome/Edge visual regression yok. | Dashboard/editör/pano/öğretici için browser smoke + seçili golden geometry/screenshot testleri. |
| MQ-P1-007 | CI kalite kapıları | MQ-12 | Tüm uzmanlar | G1–G4 fiziksel/pedagojik kapılar otomatik değil. | Digital twin/source/asset/MEB/signed-flow validatorları CI'a eklenir. |
| MQ-P1-008 | Sürüm kimliği | MQ-10/MQ-13 | MQ-12 | v1.19.20 dalı uygulama ve ZIP'te v1.19.1 görünüyor. | APP_VERSION/UI/launcher/kullanım/paket adı atomik v1.19.20 politikasıyla eşleşir. |
| MQ-P1-009 | Doküman current-truth | MQ-13 | MQ-00/MQ-12 | README/GELISTIRME/TALEPLER/DURUM içinde eski aktif dal/test bilgileri var. | Current truth tek yerde; tarihsel içerik HISTORY/ARCHIVE olarak ayrılır. |
| MQ-P1-010 | Save/load migration | MQ-11 | MQ-12/MQ-10 | Migration şekil/alias bazlı; versioned chain yok. | vN→vN+1 migration registry + eski proje fixture/round-trip matrisi. |
| MQ-P1-011 | Kilitli dal alarmı | MQ-13 | MQ-12/MQ-00 | Eski branch değişikliği ancak sonraki v1.19.20 CI'da fark edilir. | Kilitli ref değişikliklerini en erken aşamada algılayan alarm akışı. |
| MQ-P1-012 | Default branch | MQ-13 | MQ-00 | Default `main` = v1.18.0; Code→Download ZIP yanlış sürümü verebilir. | Default-branch kararı veya çok görünür güncel dal yönlendirmesi. |
| MQ-P1-013 | Pano mühendislik kuralları | MQ-02/MQ-04 | MQ-12 | bend radius, duct fill, clearance, segregasyon, servis/termal/BOM eksik. | Aşamalı engineering constraints katmanı. |
| MQ-P1-014 | Kaynak otoritesi | MQ-01/MQ-09 | MQ-03/MQ-13 | Manufacturer ve supplier kaynakları teknik kanıt açısından ayrılmıyor. | sourceAuthority + technicalSource + sourceStatus. |
| MQ-P1-015 | Repo lock tamper-resistance | MQ-13/MQ-12 | MQ-00 | Checker/workflow aynı aktif dalda birlikte değiştirilebilir. | Server-side protection mümkünse etkinleştir; o zamana kadar checker/workflow kritik değişiklik protokolü + bağımsız baseline kaydı. |
| MQ-P1-016 | Open-collector kaynak topolojisi / ders doğruluğu | MQ-05/MQ-07 | MQ-04, MQ-12, MQ-13 | Tarihsel PNP 1 kΩ pull-up hatası kaynakta 10 kΩ BK→0 V olarak düzeltildi; gerçek solver OFF 0 mA / ON 24 mA. Eski kayıtların sessiz dönüşüm tehlikesi ayrıca denetlendi. | **KOD + KAYNAK SOLVER + READ-ONLY LEGACY UYARI STATİK PASS; GENEL DONE DEĞİL.** Eski .odsdevre kaydı bozulmadan uyarı görünür, yeni uyumluluk regresyonu H–L QA zincirine alındı. Güncel SHA-eş Node + gerçek Windows/Chromium 64 ders/100 PNG kabulü açık. |
| MQ-P1-017 | Sensör BK ölçümü / sanal prob teması | MQ-05/MQ-07 | MQ-10, MQ-12, MQ-13 | Önceki 455/456 sonucu testin metal hedefi bulunan proximity sensörünü yanlışlıkla buton gibi `state` ile tetiklemesinden kaynaklanıyordu. Özgün BK/BU prob teması zaten kanonik projede var. Hedef mesafesi 10→2→10 mm: UT33D+ sanal 0→24→0 V. | **ÖZGÜN V8 SOLVER DAVRANIŞI PASS; WINDOWS UI AÇIK.** 722 dersin 3 durumlu çözümleri 2.166/2.166 kararlı, seçilen kontrollerin çıktısı 456/456 değişti. Gerçek Chromium'da prob sürükleme/görsel/erişilebilirlik QA tamamlanmadan bütünsel DONE verilmez. |

---

# P2 — BAKIM / VERİM / MİMARİ BORÇ

| ID | Lider | Sorun | Hedef |
|---|---|---|---|
| MQ-P2-001 | MQ-11/MQ-13 | `dist/library.js` monolitik ve audit maliyeti yüksek. | ID'leri bozmadan sidecar digital twin metadata/generator/validator. |
| MQ-P2-002 | MQ-10/MQ-11 | Stale `#newBtn` handler version:6 proje oluşturuyor. | Tek createProject controller/API. |
| MQ-P2-003 | MQ-10/MQ-13 | Cache-buster etiketleri v1.19.0/v1.19.1 semver gibi karışık. | App semver ve cache revision ayrı standarda bağlanır. |
| MQ-P2-004 | MQ-13 | Root'ta tarihsel doğrulama/yenilik/final kayıtları aktif dosyalarla karışık. | Referans kırmadan archive/history index ve kontrollü organizasyon. |
| MQ-P2-005 | MQ-01/MQ-09/MQ-13 | Asset license/provenance metadata yok. | license/usageRights/attribution/retrievedAt; bilinmiyorsa UNKNOWN. |
| MQ-P2-006 | MQ-12/MQ-13 | Docs-only committe bile 455 test + Windows ZIP üretiliyor. | Fast docs/repo-integrity gate + code/assets değişiminde full CI. |
| MQ-P2-007 | MQ-12/MQ-13 | Windows runtime artifact tüm tracked geliştirme reposunu paketliyor. | Explicit runtime allowlist; source ZIP ayrı GitHub Code ZIP olarak kalır. |

---

## MQ-P1-001
Durum: **CONTRACT COMPLETE / SOURCE CONSOLIDATION INCREMENTAL**  
`dist/digital-twin.js` read-only merkezi Digital Twin sözleşmesi ürün kimliği, verified fiziksel ölçü/kaynak, asset match/orientation/provenance, terminal identity/geometry, simülasyon ve panel promotion durumunu tek kayıtta birleştirir. Selection 2 consolidation turunda 10 ürünün machine-readable queue visual match/orientation, terminalGeometry ve panelGeometryReady alanlarının runtime `physical-metadata` panel-eligible mapping'iyle birebir eşleşmesi yeni regression testiyle kilitlendi. Alt kaynakların fiziksel olarak tek dosyaya taşınması zorunlu değildir; kalan açık kapsam yeni gerçek binary/CAD/terminal evidence geldikçe registry üzerinden incremental olarak kapanır.

## MQ-P1-002
Durum: **CONTRACT DONE / CORPUS COVERAGE INCREMENTAL**  
`dist/asset-quality.js` merkezi source-asset quality sözleşmesini taşır; runtime visual truth ise artık `physical-metadata` mapping/policy ile Digital Twin içinde source audit'ten ayrı tutulur. WP-016 orientation coverage 264/264 tamamlanmıştır. Selection 2 **10/10 promoted, 0 blocked** durumundadır. Derived-front (`panel-visual-derived-front-v1`) ve sensor-flex (`sensor-visual-flex-v1`) runtime orientation'ları ham kaynak fotoğraf audit sonucunu ezmeden ayrı alanlarda korunur. PROtop exact DXF terminal geometry kullanıcı paketinden parse edilerek kapanmıştır.

## MQ-P1-014
Durum: **DONE**  
Visual/catalog kaynağı ile teknik ürün kanıtı birbirinden ayrılmıştır. `sourceAuthority` manufacturer/official-doc/authorized-distributor/supplier/other enumunu destekler; `technicalSource()` fiziksel ürün datasheet kaynağını visual source'dan ayrı taşır. Supplier görseli manufacturer teknik kanıtı gibi yükseltilmez. Kaynak yoksa/otorite belirsizse `other/unverified/missing` korunur.

## MQ-P1-003
Durum: **DONE / FULL G7 VERIFIED**  
Pano native ürün render'ındaki X/Y bağımsız ölçek kaldırıldı. `panel.js::aspectPlacement()` fiziksel mm frame'i değiştirmeden tek uniform scale ile aspect-fit uygular ve çizimi merkez anchor ile yerleştirir. Eski `scale(w/d.w, h/d.h)` yolu kaldırılmıştır. Unit/golden test ve hedefli runtime doğrulaması temizdir; current runtime HEAD `8b37af601a899d41c193bcf037deb49d0f2d121a` üzerinde full G7 run `37311847588` SUCCESS ile kapanmıştır.

## MQ-P1-004
Durum: **CONTRACT FIXED / V20 PROFILE VERIFIED / COLLIDER INTEGRATION COVERAGE OPEN**  
Verified W/H/D ölçüsü gerçek 2.5D profil/CAD collider doğrulamasıyla karıştırılmaz. Physical/Digital Twin sözleşmesinde `profileStatus`, `colliderStatus`, `colliderMethod` ve `colliderProfileXZMm` fail-closed validation altındadır. **PROtop 2466870000**, kullanıcı tarafından sağlanan exact altı görünüşlü DXF paketiyle ilk runtime `verified-profile` collider ürünü olmuştur: top-view main-body CAD silueti resmi 35×125 mm nominal X/Z frame'e normalize edilip `panel.js` door-sweep collision hesabında gerçekten tüketilir. V20 exact profile evidence verified kalır fakat raw CAD polygon/mesh runtime'a taşınmadığı için collider'ı bilinçli olarak `conservative-envelope` kalır. Diğer ürünlerde profile/CAD coverage incremental olarak açıktır. V20 ise kullanıcı tarafından sağlanan exact article CADClick dosyalarıyla: `6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF` front DIM 90.8×160.9 mm, right DIM 147 mm ve back geometry 90.8×160.9 mm doğrular; exact `6SL3210-5BB21-5UV1_3D_en.pdf` gerçek `/Subtype /U3D` stream taşır ve Top/Front/Right/Bottom/Back/Left/Isometric CAD view'larını içerir. DXF SHA-256 `323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd`, 3D PDF SHA-256 `edefd2605c6e4e8367e834922f3ab0bee7abbcc48f1e7f3b38462d11640bc778`, decoded U3D stream SHA-256 `d3915b3bbe9f4bc48724cf66f8770afbb16b1a555c6c6047431b1c5808d9a60c` olarak kayıtlıdır. Bu nedenle V20 runtime/Digital Twin `profileStatus: verified` durumuna yükseltildi. Ancak mevcut door-sweep collision kodu CAD polygon/U3D mesh tüketmeyip yalnız rectangular W/H/depth envelope kullandığından `colliderStatus: conservative-envelope` bilinçli olarak korunur; `verified-profile` collider ancak CAD geometry gerçekten collision runtime'a entegre edildiğinde kullanılacaktır.

## MQ-P1-008
Durum: **DONE**  
APP_VERSION/UI/dashboard/HTML launcher/BASLAT.bat/KULLANIM.txt/Windows package adı `v1.19.20` kimliğinde hizalanmıştır. Runtime package adı `dist/app.js` içindeki APP_VERSION'dan türetilir; sürüm kimliği ayrı cache revision alanlarından ayrıdır.

## MQ-P1-009
Durum: **DONE**  
README ve `docs/DURUM_VE_SINIRLAR.md` güncel çalışma gerçeğini taşır; tarihsel kayıtlar current truth gibi sunulmaz. 2026-10-05 Actions politikası değişikliği sonrası README'deki eski “her committe CI” ifadesi de manuel kilometre taşı / PR politikasına düzeltilmiştir.

Kanıt:
- WP-014 validation CI: run `37230148221` SUCCESS @ `d662f3690b4197519ce268e0c4aca4f9d5f937cb`
- Güncel README Actions policy düzeltmesi: `8829cb8d7a0a666a774657b573f74ac9e3bb3fb3`

## MQ-P1-006
Durum: **DONE**  
Gerçek Chrome/Chromium dashboard-editor-pano-öğretici visual smoke runner ve golden geometry bounds CI'a bağlıdır. Browser job ayrı artifact üretir ve geçmiş protected baseline run'ında başarıyla tamamlanmıştır.

Kanıt:
- Browser visual CI: run `37227639023` SUCCESS @ `7ba82db3743f7dfcb3a70258cb3252a406bde970`

## MQ-P1-007
Durum: **DONE / DIGITAL TWIN INTEGRATED / FULL G7 VERIFIED**  
G1–G4 master quality runner CI'da ayrı adım olarak çalışır: G1 physical/terminal + unified Digital Twin contract, G2 asset source/orientation, G3 MEB, G4 signed-flow. Digital Twin registry G1'e dahildir. Selection 2 + runtime visual policy + profile/collider quality-gate konsolidasyonu sonrası protected integrity baseline iki aşamalı BOOTSTRAP→PIN protokolüyle `75b7b4bafc64466baa6c211f3d7c89505d790f07` commit'ine yeniden pinlenmiştir. Current runtime HEAD `8b37af601a899d41c193bcf037deb49d0f2d121a` üzerinde manuel full G7 run `37311847588` SUCCESS: fast-gate, G1–G4, first-launch smoke, tüm regresyon, Windows ZIP/extraction, browser visual smoke ve Windows launcher smoke temizdir.

## MQ-P1-005
Durum: **DONE**  
Lesson-level MEB contract uygulanmıştır: area/branch/module/outcome/source/version/prerequisite alanları machine-verifiable biçimde üretilir. Resmi MEB/EBA kaynakları ayrı source registry'de tutulur; generic veya birebir doğrulanmamış ders adları `unverified/partial` kalır. Uygulama learningGoal alanı resmi MEB kazanımı gibi sunulmaz; official outcome verification yoksa code/text boş ve status unverified kalır. WP-010 testleri daha sonraki tam regresyon run'ında CI altyapı düzeltmesi sonrası geçmiştir.

Kanıt:
- WP-010 test commit: `25312d39439215e4373d34d919ab846cbd2e0064`
- Full-history CI düzeltmesi sonrası SUCCESS: run `37226577693` @ `9d94501c17ff6921ea875455f0a02ba942256393`

## MQ-P1-010
Durum: **DONE**  
Versioned project migration registry `project-store.js` içinde contiguous v5→v6→v7 zinciriyle uygulanmıştır. Eski shipped fixture'lar migration + structural-preservation + round-trip testlerinden geçer; unsupported eski/future schema sessizce dönüştürülmez.

Kanıt:
- WP-011 regression CI: run `37226947925` SUCCESS @ `36d9d6e1ba87d6174e0b6981a4ab06650afd81ce`

## MQ-P1-011
Durum: **REPO-INTERNAL GUARD DONE / AUTONOMOUS REMOTE ALARM OPEN**  
Workflow fast-gate her doğrulamada kilitli `main/v1.19.0/v1.19.1` SHA'larını ve izinli branch listesini kontrol eder; immutable baseline integrity checker kritik workflow/checker dosyalarını commit digest ile korur. 2026-10-05 branch cleanup sonrası izinli branch inventory tam olarak dört dala indi ve rerun fast-gate SUCCESS ile guard'ın yeniden geçtiği kanıtlandı. Ancak push-trigger kullanıcı talimatıyla kapalı olduğundan kilitli branch dışarıdan değişirse bağımsız/anlık GitHub alarmı kendiliğinden çalışmaz; sonraki PR/manual validation bunu yakalar. Bu nedenle repo-içi koruma tamam, autonomous remote alarm kapsamı açıktır.

## MQ-P1-012
Durum: **BLOCKED BY GITHUB REPOSITORY SETTING ACTION**  
Gerçek repo metadata'sı `default_branch: main` göstermektedir. README güncel `v1.19.20` dalına geçişi açıkça uyarır; ancak GitHub bağlantısı repo-settings/default-branch update aksiyonu sunmadığı için default branch bu oturumda değiştirilemez. Hesap bağlantısı admin yetkisi raporlasa da kullanılabilir connector aksiyonları bu yazmayı desteklemiyor. `main` golden kilidi bozulmaz.

## MQ-P1-015
Durum: **IMMUTABLE BASELINE PROTOCOL DONE / SERVER-SIDE PROTECTION OPEN**  
Protected workflow/checker/browser/golden dosyaları immutable commit baseline hash'leriyle doğrulanır; workflow credentials read-only ve full-history checkout zorunludur. 2026-10-06 runtime visual policy + profile/collider G1/G2 güncellemesi iki aşamalı BOOTSTRAP→PIN protokolüyle atomik olarak uygulanmış ve baseline `75b7b4bafc64466baa6c211f3d7c89505d790f07` commit'ine pinlenmiştir. Önceki `d5f68849...` baseline tarihsel olarak superseded kabul edilir. 2026-10-05 governance recheck'te branch-protection endpoint'i integration administration erişimi olmadığı için `403 Resource not accessible by integration` döndürdü; repository rulesets endpoint'i ise mevcut GitHub planı/private-repo koşulunda `403 Upgrade to GitHub Pro or make this repository public` döndürdü. Bu nedenle server-side branch/ruleset enforcement repo-içi baseline guard ile ikame edilmiş durumda ve dış platform kapsamı açık kalır.


2026-10-05 current-HEAD manuel G7 run `37307752725` fast-gate integrity adımında, `scripts/quality-gates-v11920.cjs` current hash'inin eski immutable baseline ile uyuşmaması nedeniyle fail etti. Protected kalite-gate değişikliği geri alınmadı; resmi BOOTSTRAP→PIN protokolü uygulanarak yeni baseline `d5f68849c6322e54f17a0d9faa2b3eab531818de` commit'ine pinlendi (`2b8a5f7d...`). Bu run downstream doğrulamaya geçemedi; yeni HEAD için yeniden manuel G7 gereklidir.
## MQ-P2-006
Durum: **DONE**  
CI scope classifier docs-only değişiklikleri fast gate'e, runtime/quality değişikliklerini full regression/package/browser/Windows yollarına ayırır. Kullanıcının Actions dakika politikası nedeniyle normal push otomasyonu ayrıca kapatılmış; PR veya manuel kilometre taşı doğrulaması korunmuştur.

## MQ-P2-007
Durum: **DONE**  
Windows runtime ZIP explicit allowlist kullanır; tests/scripts/tools/docs/.github ve geliştirme/audit payload'ı son kullanıcı paketine alınmaz. Paket manifesti, CRC, extracted byte hashes ve launcher smoke doğrulaması vardır.

Kanıt:
- Full regression + Windows ZIP + Windows launcher SUCCESS: run `37226577693` @ `9d94501c17ff6921ea875455f0a02ba942256393`
- Branch-policy cleanup proof: run `37272112342` attempt 2 — fast-gate/browser/Windows SUCCESS; regression reached 555/557 before two test-harness failures.
- Repo metadata 2026-10-05: `default_branch=main`; branch inventory temiz — yalnız `main`, `v1.19.0`, `v1.19.1`, `v1.19.20` mevcut.

## MQ-P1-013
Durum: **DONE / ADVISORY ENGINEERING LAYER**  
Aşamalı pano mühendislik katmanı uygulanmıştır: BOM, doğrulanmış input gerektiren duct-fill, bend-radius, service-clearance, üretici montaj clearance denetimi, segregasyon advisory sınıfı, termal yük envanteri ve door-clearance özeti tek audit raporunda birleşir. Kanıtı olmayan kapasite/servis/termal/mevzuat bilgisi uydurulmaz; segregasyon `training-advisory`, enclosure thermal compliance ise doğrulanmış enclosure/ambient verisi yoksa `unknown` kalır. WP-015 katmanı daha sonraki tam CI run'ında G1–G4, tüm regresyon, browser visual smoke, Windows ZIP ve launcher smoke ile başarıyla doğrulanmıştır.

Kanıt:
- Full validation CI: run `37232638076` SUCCESS @ `a36dcfbe1b7dcbd88b69e5043dc9f01b98118492`

## MQ-P2-001
Durum: **DONE / SIDECAR DIGITAL TWIN**  
`dist/library.js` ID ve davranış sürekliliği için yerinde bırakılmıştır; audit maliyetini azaltan sidecar `dist/digital-twin.js` merkezi ürün/fizik/asset/terminal/simülasyon/kalite görünümünü üretir ve validator sağlar. Monolitik library fiziksel olarak parçalanmadan hedeflenen sidecar metadata/generator/validator mimarisi tamamlanmıştır.

## MQ-P2-002
Durum: **DONE**  
Yeni proje oluşturma yolu tek merkezî `window.DTSEditor.create(mode,...)` controller'ına bağlıdır. `#newBtn` inline eski schema üretmez; merkezî create yolu `version:7` oluşturur. Stale `version:6` handler'ın geri gelmesini engelleyen `tests/project-create-v11920.test.cjs` eklendi.

Kanıt:
- Regression lock: `fcfcf56c8928f3d6c5e47d7d8f4fbb61cf4f9c84`

## MQ-P2-003
Durum: **DONE**  
Uygulama sürüm kimliği ile cache revision ayrılmıştır. `dist/app.js` `APP_VERSION='1.19.20'` taşırken statik asset cache-buster'ları semver gibi davranmayan tarih/work-package `rev=20261004-wp014...` biçimindedir. Cache revision değişikliği uygulama semver'i değiştirmez.

## MQ-P2-004
Durum: **DONE / REFERENCE-SAFE HISTORY INDEX**  
Root'taki tarihsel `DOGRULAMA_v*`, `DOSYA_LISTESI_v*`, `YENILIKLER_v*`, `final-v*` ve eski görsel kaynak kayıtları referans kırmamak için taşınmadan `docs/HISTORY_INDEX.md` altında archive/tarihsel olarak sınıflandırılmıştır. Güncel gerçek kaynaklar README, DURUM, GELISTIRME ve master backlog olarak ayrı tanımlıdır. Ayrım regression testiyle kilitlenmiştir.

Kanıt:
- History index: `fbfbaabec733916be45f133bbf17a57c9136e9d6`
- Regression lock: `f4c15363f6f911168ff93a1570fe549d8a527338`

## MQ-P2-005
Durum: **DONE / UNKNOWN ALLOWED BY CONTRACT**  
Asset provenance/license sözleşmesi `licenseStatus`, `usageRights`, `attributionRequired`, `retrievedAt` ve `provenanceStatus` alanlarını taşır. Kanıt bulunmayan görseller için değerler açıkça `unknown`/partial kalır; hak veya provenance uydurulmaz. WP-016 pixel-orientation audit 264/264 tamamlanmıştır; kalan source/provenance ve exact/family riskleri machine-readable audit kuyruğunda açık tutulur.

## MQ-13 FINAL REPO CONTINUITY AUDIT
Durum: **DONE / REPO CONTINUITY CLEAN WITH DECLARED PLATFORM LIMITS**  
Tarih: 2026-10-05

MQ-13 final kontrol sonucu:
- Aktif çalışma dalı yalnız `v1.19.20`; final runtime validation anchor HEAD `8b37af601a899d41c193bcf037deb49d0f2d121a`.
- Branch inventory yalnız `main`, `v1.19.0`, `v1.19.1`, `v1.19.20`; stale `work-v11920-batch` silinmiştir.
- Kilitli eski refler değişmemiştir: `main=e00b6fcf0ea3eb721eae8285beb7052573b61373`, `v1.19.0=6846c6ee7df1c2f194eabf4fd58035d4423e8508`, `v1.19.1=68372f8018b28efe04a505792c41f12c8159376c`.
- Repo-integrity / izinli branch fast-gate final run içinde SUCCESS.
- Import/path/package zinciri full G7 içinde doğrulandı; Windows ZIP + extraction ve Windows launcher smoke SUCCESS.
- Browser visual smoke SUCCESS; current runtime test/regresyon zinciri SUCCESS.
- Runtime package explicit allowlist kullanmaya devam eder; docs/tests/scripts geliştirme payload'ı son kullanıcı ZIP'ine sızdırılmaz.
- Current-truth ve operasyon devam noktası bu master backlog içinde günceldir.
- GitHub platform sınırlamaları açıkça korunur: default branch hâlâ `main`; branch-protection/ruleset server-side enforcement connector/plan erişimiyle kapatılamamıştır. Bunlar MQ-P1-012 ve MQ-P1-015 altında açık kalır.

Kanıt:
- Full G7: run `37311847588` SUCCESS @ `8b37af601a899d41c193bcf037deb49d0f2d121a`.
- Final branch inventory: yalnız dört izinli branch; protected flag server-side olarak false.
- Repository permission bağlantısı: admin/maintain/push/pull/triage mevcut.

### Selection 2 front-candidate qualification audit — 2026-10-05
- 3RT: e-parts exact direct image artık high-resolution web byte/pixel seviyesinde açıldı; `3RT2016-1BB41` marking okunaklı, yüz straight-on ve anlamlı side/top depth face yok. Visual orientation şartı web-pixel düzeyinde kapanmıştır. GitHub bağlantısında base64 blob oluşturma yolu bulundu; fakat dış image byte'ı execution ortamına transfer edilemediği için original binary repo'ya yazılamadı. Bu nedenle tek açık gate repo-level binary + provenance'dır. Shared GitHub mirror family görseli reddedilmeye devam eder.
- 3RV: Maschinenteil24 exact direct image artık web byte/pixel seviyesinde açıldı; `3RV2011-1JA10` marking görünür, cihaz straight-on front ve anlamlı side face yok. Güçlü exact orthographic-front candidate doğrulandı. Fakat original binary repo'ya taşınamadığı için provenance gate açık; GitHub mirror binary de 3RV6011-1JA10 ile shared olduğundan reddedilir. Terminal-center geometry verified; tek gerçek blocker repo-level visual acquisition.
- 5TL: önceki exact ürün fotoğrafı perspective kaldı; fakat TIM exact `5TL1163-0` ürün sayfası galerisinde yeni straight-on/orthographic-front aday bulundu. Sayfa manufacturer index'i ve galeri açıklamaları exact ürünü gösteriyor, ancak erişilebilir görsel çözünürlüğünde model marking bağımsız olarak okunaklı değil ve original binary repo'ya alınamadı. Bu nedenle exact-page association tek başına image-level exactness sayılmadı. Terminal-center geometry verified; visual replacement gate açık.
- PROtop: üç exact Weidmüller DAM asset'i pixel seviyesinde incelendi; product photo exact marking taşıyor fakat three-quarter/perspective, diğerleri circuit diagram + derating graph. Exact datasheet `Drawings` sayfası mekanik/dimensioned terminal çizimi içermiyor. Yeni turda eShop `Downloads & links` üzerinden official STEP/DWG/DXF linkleri doğrudan takip edildi: STEP sunucusu `application/step`, DWG ve DXF linkleri `application/zip` binary yanıtı veriyor. Böylece exact CAD dosyalarının gerçekten canlı olduğu kesinleşti; blocker artık CAD varlığı değil, web katmanının binary MIME'ı modele aktarmaması ve execution container'ın DAM DNS'ini çözememesi nedeniyle byte transport/geometry validation. DigiKey manufacturer-provided `2466870000 STP` bunu ayrıca bağımsız doğruluyor. PARTcommunity preview family/shared kaldığı için visual promotion sağlamaz.
- Rittal: exact official PDF contains a real product photo, but orthographic qualification could not be established at pixel level.
- SICK: exact WTB4-3P2161 photos found, but side/three-quarter.
- V20: terminal geometry exact `6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF` ile verified kalır; 90.8×160.9 mm front frame ve ±0.5 mm terminal-center anchor'ları authoritative kaynaktır. Kullanıcının bu turda seçtiği 1086×1448 RGBA front görseli kanonik runtime görseli yapıldı. Ana front frame `x=140..947, y=18..1448` crop ile 807×1430 px'e ayrıldı, 280×496 WebP türevine çevrildi ve exact 90.8×160.9 mm gövde oranına bağlandı. Source SHA-256 `a9a7b7d93f82dd7e81be67d807df718f484aa0b881beb0b562f3838a1b38a9d2`; repo WebP SHA-256 `c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667`; Git blob `47ea4bedb7153891a2ccee88e31ad3285e59dcc3`; runtime path `dist/assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp`. Exact product kimliği Siemens exact CAD/DXF + önceki Gümrük Sepeti same-gallery `6SL3210-5BB21-5UV1 / 1.5 kW` nameplate zinciriyle korunur. Physical terminal grouping görüntü düzenine ve Siemens FSAA–FSAD kılavuzuna göre `upperControl=13,13b,14,14b,12,15,16`, `lowerControl=1–11`, `relay=17–19`; güç giriş/çıkış sıraları ayrı tutulur. Runtime body 90.8×160.9×147 mm, `panelGeometryReady=true`; V20 PROMOTED.
- Shared/family mirror binaries are now regression-locked as non-promotable evidence.

## MQ-00 MASTER REVIEW — 2026-10-05
Durum: **REVIEW COMPLETE / CORE RUNTIME G7 CLEAN / RELEASE CLOSURE BLOCKED BY DECLARED OPEN EVIDENCE & GOVERNANCE ITEMS**

G0–G8 kararı:
- **G0 Repo/Dal/Süreklilik: PASS** — MQ-13 final repo audit temiz; stale branch yok, eski kilitli refler değişmedi.
- **G1 Kaynak: PASS WITH OPEN COVERAGE** — kaynak otoritesi sözleşmesi çalışıyor; kanıtsız alanlar fail-closed/unknown kalıyor. 51 source-review pending açık backlog'dur.
- **G2 Fiziksel: PASS WITH OPEN PRODUCT EVIDENCE** — Physical Digital Twin çekirdeği ve güvenli fallback sözleşmesi doğrulandı; Selection 2'de 4 ürün PROMOTED, 6 ürün BLOCKED. 3RV ve 5TL terminal-center geometry resmi orthographic drawing'lerden; V20 terminal-center geometry exact article DXF'den ve exact front visual Gümrük Sepeti same-gallery provenance ile panel-ready duruma getirildi. Terminal-center evidence açık kalan tek Selection 2 ürünü artık PROtop'tur.
- **G3 Elektrik: PASS** — signed-flow, terminal sözleşmeleri ve ilgili elektriksel regresyon temizdir.
- **G4 Pedagoji: PASS** — MEB/source-status/prerequisite kalite kapıları temizdir.
- **G5 UI/Dosya: PASS** — browser visual smoke, first-launch ve Windows launcher smoke temizdir.
- **G6 Hedef test: PASS** — yeni kök nedenleri yakalayan hedefli testler ve Selection 2 fail-closed kilitleri mevcuttur.
- **G7 Tam regresyon: PASS** — run `37311847588` current runtime HEAD üzerinde tamamen SUCCESS.
- **G8 MQ-00 Master onay: CONDITIONAL / CONTINUE** — çekirdek runtime kalite zinciri DONE kabul edilir; ancak aşağıdaki açıklar nedeniyle tüm `v1.19.20` programı release-closed sayılmaz.

Açık zorunlu işler:
1. **Selection 2:** 3RT, 3RV, 5TL, PROtop, Rittal, SICK, V20 için exact/orthographic/provenance ve ürün-bazlı kanıt blocker'ları; machine-readable queue fail-closed.
2. **MQ-P0-002:** PROtop terminal-center mm evidence coverage. 3RV, 5TL ve V20 kapanmıştır; V20 exact article DXF ile verified durumdadır.
3. **MQ-P1-001 / MQ-P1-002:** Digital Twin/source ve asset/source/provenance coverage incremental kapanışı.
4. **MQ-P1-004:** V20 exact CAD profile evidence verified; kalan ürünlerde profile evidence coverage ve tüm cihazlarda gerçek CAD profile/mesh collider runtime entegrasyonu açık. `conservative-envelope` yalnız runtime gerçek profile tüketene kadar korunur.
5. **MQ-AUDIT-GAP-001 / WP-016:** pixel orientation 264/264 tamam; source/identity review açık.
6. **MQ-P1-011:** autonomous remote alarm platform kapsamı açık.
7. **MQ-P1-012:** default branch `main` kalıyor; connector repo-setting write aksiyonu yok.
8. **MQ-P1-015:** server-side branch protection/ruleset açık; repo içi immutable baseline guard aktif.

MQ-00 kararı:
**CORE RUNTIME = DONE / FULL G7 VERIFIED. PROGRAM = CONTINUE, NOT RELEASE-CLOSED.**
Bir sonraki çalışma noktası yeni genel refactor değil; fail-closed açık evidence/governance maddelerini sırayla kapatmaktır. Selection 2 ürün dönüşümü machine-readable queue sırasıyla sürer ve kanıt gelmeyen ürün promote edilmez.

# AUDIT GAP

| ID | Lider | Eksik denetim | Kapanış ölçütü |
|---|---|---|---|
| MQ-AUDIT-GAP-001 / WP-016 | MQ-01/MQ-03 | **PIXEL ORIENTATION AUDIT COMPLETE / SOURCE & IDENTITY REVIEW OPEN.** `scripts/visual-corpus-audit-v11920.cjs` tüm aktif PLC/product/material manifestlerini ve physical componentMap'teki manifest-dışı sidecar assetleri tek audit kuyruğunda toplar. Mevcut corpus: 264 kayıt; 264/264 pixel-audited, 0 pixel-audit pending; V20 exact front provenance kapanışı sonrası 50 source-review pending; 163 exact-model risk. PLC corpus 202/202, product manifest 8/8, mapped-sidecar 6/6 ve material atlas 48/48 pixel-orientation coverage tamamlanmıştır. Görsel değiştirme işi Selection 2 olarak zorunlu iş sırasının en sonunda kalır; bu aşamada yalnız source/provenance ve exact/family/representative kimlik riskleri açıktır. Pano mapped-sidecar coverage 6/6 pixel-audited durumundadır. | Her aktif asset pixel seviyede sınıflandırılmış, source/provenance durumu kayıtlı ve yanlışlar P0/P1 olarak iş paketlenmiş. |

---

# BİLİNEN KAPSAM SINIRLARI — BUG DEĞİL

| ID | Kapsam |
|---|---|
| MQ-LIM-001 | PLC ladder/program runtime ve fieldbus/Modbus/USS/DDCS tam emülasyon yok. |
| MQ-LIM-002 | PLC görsellerinin tamamı birebir varyant değildir; family match kayıtları vardır. |
| MQ-LIM-003 | V20/ACS800 tam firmware/PWM/DTC fizik emülasyonu değildir. |
| MQ-LIM-004 | Yarı iletken modellerinin bir bölümü ideal eğitim modelidir; tam analog/SPICE davranışı değildir. |
| MQ-LIM-005 | Arduino runtime tam C++/Core/tüm üçüncü parti kütüphane emülasyonu değildir. |
| MQ-LIM-006 | Bina tesisatında kesit/seçicilik/koruma koordinasyonu/mevzuat hesabı tam mühendislik hesabı değildir. |

Bu sınırlar gizlenmez; profesyonel hedef genişletilirse ayrı roadmap maddesine dönüştürülür.

---

# ZORUNLU İŞ SIRASI

## Dalga 1 — P0 temel
1. MQ-P0-001 Physical Digital Twin schema.
2. MQ-P0-002 Terminal coordinate contract.
3. MQ-P0-003 Signed current/energy flow.
4. MQ-P0-004 Door/plate 3B collision.

## Dalga 2 — P1 veri ve kaynak
5. MQ-P1-001, 002, 003, 004, 014.
6. WP-016 full visual corpus audit.
7. MQ-P1-005 MEB.
8. MQ-P1-010 migration.

## Dalga 3 — Test/release/GitHub
9. MQ-P1-006, 007.
10. MQ-P1-008, 009.
11. MQ-P1-011, 012, 015.
12. MQ-P2-006, 007.

## Dalga 4 — Profesyonel pano ve bakım
13. MQ-P1-013.
14. MQ-P2-001…005.

## Selection 2 · Dalga 5 güncel ürün dönüşüm durumu
Machine-readable source of truth: `docs/SELECTION2_PRODUCT_REPLACEMENT_QUEUE_V1.19.20.json`.

Durum: **CLOSED-COMPLETE — 10/10 promoted, 0 blocked, 0 invalid.**

- Siemens 5SL 1P/2P/3P, 3RT2016-1BB41, 3RV2011-1JA10, 5TL1163-0, Weidmüller PROtop 2466870000, Rittal 3241100, SICK WTB4-3P2161 ve SINAMICS V20 6SL3210-5BB21-5UV1 Selection 2 promotion kapılarını geçmiştir.
- Exact identity/provenance, kabul edilmiş runtime visual policy, verified fiziksel frame ve gereken terminal/connector geometry birbirinden bağımsız tutulur.
- PROtop son blocker'ı kullanıcı tarafından sağlanan exact `2466870000_DXF.zip` ile kapanmıştır; L/N/P/M runtime terminal anchor'ları exact DXF'ten mm olarak doğrulanmıştır.
- 3RV exact Siemens TIF + manufacturer CAD front ile, 3RT/Rittal/PROtop accepted derived-front policy ile, SICK sensor-flex policy ile kapanmıştır.
- Selection 2 kapanışı profile/CAD işini otomatik kapatmaz. Sıradaki aktif kalite paketi **MQ-P1-004 profile/CAD runtime collider coverage**'dır.
- Profile/CAD ilk runtime entegrasyonu: PROtop exact top-view DXF → normalized 35×125 mm X/Z collider profile → `panel.js` door-sweep consumer → `colliderStatus:'verified-profile'`.
- V20 `profileStatus:'verified'` fakat collider halen `conservative-envelope`; raw CAD profile/mesh collision runtime'a taşınmadan yükseltilmez.

## Dalga 5 — En son görsel birebirlik / orthographic ürün dönüşümü
15. Mevcut normal iş akışı ve önceki dalgalar tamamlandıktan sonra pano ürünlerini tek tek gerçek, birebir model eşleşmeli, dış kaynak/provenance kayıtlı, izometrik olmayan `orthographic-front` görsellerle değiştir/doğrula.
16. Bu son dalgada öncelik sırası: Siemens 5SL ailesi → 3RT → 3RV → 5TL → Weidmüller PROtop → Rittal → SICK → SINAMICS V20.
17. Bu dalga Selection 1 kapsamındaki panel geometry promotion / terminal-CAx / manufacturer-clearance / G7 zincirinin önüne alınmaz; yalnız mevcut iş sırasının sonunda başlatılır.

## Başlangıç çalışma paketi

**İlk teknik paket: WP-001 / MQ-P0-001 — Physical Dimension / Digital Twin Schema.**

Bu paket doğrudan üretici ölçülerini rastgele koda yazmakla başlamaz. Önce:
1. mevcut veri alanları haritalanır,
2. schema önerisi hazırlanır,
3. MQ-04 terminal etkisini kontrol eder,
4. MQ-11 migration etkisini kontrol eder,
5. MQ-12 test planını oluşturur,
6. MQ-13 dosya yerleşimi ve repo sürekliliğini kontrol eder,
7. MQ-00 tasarımı onayladıktan sonra uygulama başlar.


# AKTİF İLERLEME

## MQ-P0-001
Durum: **DONE / FULL G7 VERIFIED**  
Merkezi physical metadata, sourceStatus/sourceAuthority, verified ürünlerde gerçek W/H/D mm, güvenli staged panel geometry ve legacy approximate fallback uygulanmıştır. Selection 2 terminal/profile/Digital Twin consolidation turları sonrası runtime queue/mapping senkronu regression testine bağlanmıştır; doğrulanmamış ürünlere ölçü veya terminal koordinatı uydurulmaz. Repo-hygiene blocker 2026-10-05 tarihinde kullanıcı tarafından `work-v11920-batch` branch'i silinerek kaldırıldı. GitHub branch inventory artık yalnız `main`, `v1.19.0`, `v1.19.1`, `v1.19.20` içeriyor ve üç kilitli eski ref beklenen SHA'larda. Branch-policy yüzünden düşen Actions run `37272112342`, attempt 2 olarak yeniden çalıştırıldı: `fast-gate` SUCCESS, G1–G4 SUCCESS, first-launch smoke SUCCESS, browser visual smoke SUCCESS ve gerçek Windows launcher smoke SUCCESS oldu. Regresyon 557 testin 555'ini geçirdi; iki failure üretim davranışından değil `tests/physical-metadata-v11920.test.cjs` içindeki test-harness hatalarından kaynaklandı (`requiredClearanceMm` clone mutation derinlik varsayımı ve eski testte `spec` initialization sırası). Güncel HEAD'de harness ayrıca Selection 2 sonrası 5SL terminal/orientation gerçeğiyle senkronize edilerek `8cecd264...` commit'inde düzeltildi; Rittal photo-evidence semantiği de queue/test arasında `91e59d57...` + `cfd20b39...` ile uzlaştırıldı. Güncel test dosyaları syntax-parse temizdir. Ardışık harness/expectation düzeltmeleri sonrası current runtime HEAD `8b37af601a899d41c193bcf037deb49d0f2d121a` üzerinde full G7 run `37311847588` tamamen SUCCESS sonuçlandı. Böylece Physical Digital Twin çekirdek sözleşmesi, migration/regresyon, browser/Windows smoke ve runtime package zinciri MQ-P0-001 kapsamında kapanmıştır. Ürün bazlı eksik terminal/profile/source coverage ayrı açık kayıtlar olan MQ-P0-002, MQ-P1-001/002/004 ve Selection 2 altında fail-closed kalır.


2026-10-05 panel-oran örneği sonrası ölçek sözleşmesi düzeltildi: doğrulanmış manufacturer W/H/D artık `panelGeometryStatus: staged` olsa bile yeni pano yerleşiminde gerçek mm footprint olarak kullanılır; terminal/visual gate staged kalmaya devam eder. Eski kaydedilmiş projeler sessizce yeniden boyutlandırılmaz. `Panel.proportionAudit()` serialized `w/h/depth` ile doğrulanmış fiziksel W/H/D'yi karşılaştırır ve tolerans dışı `wrong-uniform-scale` / `distorted-aspect` kayıtlarını raporlar. Repo içindeki `03_Egitim_Panosu.odsdevre` fixture'ında legacy MCB, PROtop SMPS ve contactor boyut farkları bu audit ile yakalanır.

2026-10-05 kullanıcı `Malzeme test.odsdevre` + ekran görüntüsü audit sonucu: dosya `workspaceMode: control`, 69 component ve explicit `materialScale` değeri olmadan kaydedilmiş. Control/material renderer varsayılan `materialScale=1` altında component `d.w/d.h` şematik kutularını fiziksel boyutmuş gibi kullandığı için gerçek ürün oranları bozuluyor. Ölçülen örnekler: 1P MCB 4.44/1.11 scene-unit-per-mm (x/y), 3P MCB 2.22/1.11, 3RV 3.11/1.24, 3RT main-contact 2.67/1.72, V20 2.89/2.38. Bu yalnız uniform scale sorunu değil; aspect distortion da var. `Physical.materialScaleAudit()` ve `materialScaleCoverage()` eklendi; verified physical W/H ile control-material scene W/H karşılaştırması machine-readable `distorted-aspect` sonucu üretiyor. 2026-10-05 ikinci aşamada `Physical.materialDefinition()` + `app.js` render/port/obstacle/local-point entegrasyonu eklendi. Verified industrial ürünler material görünüşte kanonik `2 scene-unit/mm` ölçeğine normalize edilir; kaydedilmiş JSON konumu/ölçeği mutate edilmez ve explicit kullanıcı `materialScale` değeri bunun üstünde uniform çarpan olarak kalır. Kullanıcı `Malzeme test.odsdevre` fixture'ı 69 component / 0 explicit materialScale içerir; bu dosyada K3/K4, S17/S18/S19, S20, S21 ve S23 olmak üzere 8 verified ürün yeni normalization kapsamına girer. Örnek normalize envelope'lar: 1P MCB 36×180, 2P 72×180, 3P 108×180, 5TL 36×179.6, 3RV 90×194, 3RT 90×116, V20 181.6×321.8 scene-unit. Panel proportion audit ile control/material proportion audit ayrı sözleşmeler olarak korunur; unverified fiziksel ölçüler uydurulmaz ve özel instrument/PLC/Arduino sınıfları verified physical contract gelene kadar fail-closed bırakılır. Normalization sonrası legacy yerleşim çakışmaları `Physical.materialLayoutAudit()` ile ayrıca denetlenir; kullanıcı fixture'ında S18 3P MCB ile S19 2P MCB arasında 8×180 scene-unit overlap tespit edilir. Runtime material görünüşe geçişte/proje açılışında kullanıcıya uyarı verir fakat x/y koordinatlarını otomatik değiştirmez. V20 material görünüşünde kanonik ürün fotoğrafı ayrı body/backdrop katmanında tutulur; normal kablolar bu gövdenin üstünde, terminal hotspot/pin/etiket ve görünmez BOP etkileşim alanları kabloların üstünde render edilir. Opt-in `wireOverBody` sözleşmesi tekrar kullanılabilir ortak katman mekanizmasıdır; IEC görünüş davranışı korunur.
## MQ-P0-002
Durum: **CONTRACT DONE / EVIDENCE COVERAGE OPEN**  
Physical terminal anchor sözleşmesi tamamlanmış ve fail-closed doğrulama korunur. Siemens 5SL 1P/2P/3P ve 3RT terminal geometry mm anchor'ları verified durumundadır. 3RV2011-1JA10 ana terminalleri exact Siemens orthographic drawing + 45×97 mm body ile ±1.5 mm toleransta; 5TL1163-0 1/2 terminalleri official front drawing + 18×89.8 mm body ile ±2 mm toleransta verified durumdadır. V20 için kullanıcı tarafından sağlanan exact CADClick `6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF` doğrudan parse edildi: exact article title block, `mm [in]` unit ve 90.8×160.9 mm front body frame doğrulandı; SHA-256 `323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd`. Power + user terminal merkezleri (`1–11`, `13/13b`, `14/14b`, `12`, `15–19`, `L1`, `N/L2`, `PE`, `U/V/W`, `DC-/DC+`, `PE2`) exact vector centers üzerinden `exact-article-2d-dxf-mm-coordinate-extraction` yöntemiyle ±0.5 mm toleransta verified edildi. V20 exact Gümrük Sepeti front visual artık repo binary + provenance ile runtime'a bağlıdır; `visualMatchStatus: exact`, `orthographic-front` ve exact DXF terminal geometry birlikte active terminal anchors/panel promotion'ı açar. V20 terminal ve visual blocker'ları kapanmıştır. Selection 2 terminal-center blocker'ı kalmamıştır: PROtop exact `2466870000_DXF.zip` parse edilmiş, runtime L/N/P/M anchor'ları exact DXF fiziksel terminal satırlarına bağlanmıştır. Koordinat uydurulmaz; yeni ürünler aynı fail-closed sözleşmeyle incremental ilerler.

## MQ-P0-003
Durum: **DONE**  
Solver-türevi signed terminal currents, KCL tabanlı signed wire flow, runtime/UI entegrasyonu, DC forward/reverse ve AC bidirectional animasyonları ile mühürleme/geri besleme golden testleri uygulanmıştır.

## MQ-P0-004
Durum: **DONE**  
Door sweep volume + depth/clearance collision, unsafe door-closing UI guard ve golden clearance testleri uygulanmıştır.

### Selection 1 · Panel geometry promotion evidence matrisi
- **Siemens 5SL6116-7 / mcb-1p:** ürün W/H/D ve installation depth verified; exact + orthographic-front mevcut; terminal kimliği verified; terminal merkezleri Siemens orthographic dimensional drawing'den kaynaklı ve ±1 mm toleransla `terminalGeometryStatus: verified`. Teknik gate **ready-candidate**; gerçek `panelGeometryReady` promotion Selection 2'deki source/provenance visual işi tamamlanana kadar kapalı.
- **Siemens 3RT2016-1BB41 / main-contact:** ürün ölçüsü + clearance verified; 10 fiziksel terminal için Siemens orthographic dimensional drawing'den kaynaklı terminal geometry evidence verified. Mevcut ana asset `front-perspective`; bu nedenle active terminal anchor ve gerçek panel geometry promotion kapalı. Terminal evidence ile active anchor ayrı sözleşmelerdir.
- **Siemens 3RV2011-1JA10 / thermal-magnetic:** ürün ölçüsü/clearance ve ana terminal kimliği kanıtlı; exact Siemens orthographic drawing + 45×97 mm body scale ile ana terminal merkezleri ±1.5 mm toleransta verified. `terminalGeometryStatus: verified`; perspective görsel nedeniyle panel geometry staged kalır.
- **Siemens 5TL1163-0 / disconnect-1p:** ürün ölçüsü ve installation depth verified; exact modeli kapsayan Siemens 1P orthographic/front drawing doğrulanmış 18×89.8 mm body scale ile kullanılarak 1/2 terminal merkezleri ±2 mm toleransta verified edilmiştir: yaklaşık (9,9) mm ve (9,80.8) mm. `terminalGeometryStatus: verified`; mevcut perspective visual nedeniyle active anchor ve panel geometry promotion staged kalır.
- **Manufacturer clearance verified verdict:** 3RT/PROtop/V20 clearance metadata'sı runtime'a bağlıdır; ancak gerçek verdict için hedef ve sınırlayıcı komşu geometriler `ready + verified` olmalıdır. Mevcut gerçek ürünlerin hiçbiri bu koşulu henüz taşımadığı için gerçek proje üzerinde verified verdict üretmek **bilinçli olarak bloklu** kalır.
- Bu blocker'ı çözmek için Selection 2 öne alınmaz. Görsel birebirlik/orthographic replacement işi zorunlu iş sırasının en sonunda kalır; o dalga geldiğinde ilk gerçek `panelGeometryReady` ürün üzerinden manufacturer-clearance audit tekrar çalıştırılır.

Kanıt:
- WP-001/M2 CI: `37205273860` SUCCESS
- WP-002 contract CI: `37206171985` SUCCESS
- WP-002 consolidated terminal contract CI: `37211244972` SUCCESS @ `bd8ab192024ee6903defa442ece6a43c3115f91c`
- WP-003 signed-flow CI: `37220369262` SUCCESS @ `850f2143c950f7b50d17d651559270a8405bd821`
- WP-004 door-sweep CI: `37221208843` SUCCESS @ `b5b60ca94ec49cfa5e2198379b7635b9f89970c4`


### Selection 2 AUTO-PROGRESS checkpoint — 2026-10-06

- **V20 wire/render katmanı:** DONE. `174f0984...` ile ürün gövdesi kabloların altına, terminal/control overlay kabloların üstüne alındı; `f9b7f321...` ile body seçme/sürükleme etkileşimi korunarak backdrop click yolu kapatıldı. Yeni DOM-order regresyonu `tests/v20-interface.test.cjs` içine eklendi. GitHub Actions tetiklenmedi; commitler `[skip ci]`.
- **3RT:** BLOCKED — terminal geometry verified; qualifying exact strong-front web candidate mevcut, ancak original binary + repo provenance gate'i kapalı.
- **3RV:** BLOCKED — terminal geometry verified; exact straight-on candidate mevcut, ancak original binary + provenance repo'ya taşınamadı.
- **5TL:** BLOCKED — terminal geometry verified; exact-page orthographic candidate context mevcut fakat image-level exact identity + original binary/provenance eksik.
- **PROtop:** BLOCKED — exact official product imagery perspective; STEP/DXF varlığı verified fakat CAD bytes retrieve+validate edilemediği için terminal-center geometry unverified.
- **Rittal:** BLOCKED — dimensions/cutout/connection evidence verified; qualifying exact orthographic-front real binary yok.
- **SICK:** BLOCKED — dimensions/connector evidence verified; accessible exact real photos perspective/three-quarter.
- **MQ-00 kararı:** Selection 2 **KAPATILMADI**. Fail-closed kuralına göre 6 açık ürünün visual/provenance ve gereken terminal geometry gate'leri temizlenmeden DONE verilemez. Machine-readable queue 2026-10-06 checkpoint'iyle senkronize edildi.



### Selection 2 evidence refresh — 2026-10-06

AUTO-PROGRESS ile 3RT → 3RV → 5TL → PROtop → Rittal → SICK kaynak taraması tekrarlandı. 3RT için exact model işaretli straight-on aday, 3RV için exact model işaretli güçlü front aday bağımsız olarak yeniden doğrulandı; ikisinde de kalan blocker repo binary + provenance transferidir. 5TL exact 5TL1163-0 görseli yeniden kontrol edildi ve perspektif kaldı. PROtop exact resmi sayfa/ölçü/terminal count doğrulaması korunur; resmi ürün görseli perspective ve STEP/DXF byte geometry validation hâlâ kapalıdır. Rittal SK 3241.100 resmi ürün fotoğrafı three-quarter; SICK WTB4-3P2161 exact RS fotoğrafı side/three-quarter. Fail-closed nedeniyle bu altı ürün promote edilmedi; verified ölçü/terminal durumları gevşetilmedi.



### Selection 2 wire-layer cross-cutting gate — 2026-10-06

3RT, 3RV, 5TL, PROtop, Rittal ve SICK physical mappings ortak `wireOverBody:true` sözleşmesine alındı. Böylece bu fotoğraf tabanlı material cihazlar için runtime katman hedefi V20 ile aynıdır: **device body/photo < wires < terminal/control overlay**. Bu değişiklik yalnız render ordering sözleşmesidir; hiçbir ürünün exact/orthographic/provenance veya terminal-geometry promotion gate'i gevşetilmedi ve blocked ürünler blocked kalır.



### Selection 2 candidate refresh — 2026-10-06 round 2

Fresh public-source search found a **source-level exact straight-on front** for Siemens 3RV2011-1JA10 (visible exact article marking). This closes its source-discovery problem but not repo promotion: original binary + provenance still must be transported into the offline package. 3RT2016-1BB41 has an exact near-front candidate but a small bottom depth plane remains visible, so strict orthographic gate stays blocked. 5TL dimensions/identity remain exact but available real imagery is perspective. Rittal SK 3241.100 has a stronger near-front candidate, still with residual perspective. SICK WTB4-3P2161 has an exact side-orthographic view, but it is not the required front/lens orientation. No fail-closed gate was weakened.



### PROtop CAD metadata narrowing — 2026-10-06

PARTcommunity exact project metadata for `2466870000.prj` was re-confirmed. The CAD generator exposes exact article identity and a generated bounding envelope of approximately **34 × 131.2 × 135.4 mm**, while the official Weidmüller product catalogue continues to state **35 × 130 × 125 mm** product dimensions. This discrepancy is treated as CAD-envelope-vs-product-body context, not as a contradiction and not as a basis for fabricated terminal anchors. The public metadata does not expose terminal-center coordinates. Therefore PROtop remains fail-closed until STEP/2D CAD bytes can be transported and parsed.



### Selection 2 binary intake gate — 2026-10-06

External image/CAD bytes cannot currently be transported by the agent runtime even when public source pixels/URLs are visible. To prevent ad-hoc copying or accidental promotion, `scripts/selection2-import-asset.cjs` now provides a deterministic fail-closed intake path. Visual candidates require exact-model proof, `orthographic-front`, manufacturer/supplier authority and HTTPS provenance; PROtop CAD intake is separately scoped to exact article CAD. Imported bytes are staged under `evidence/selection2/` with SHA-256 sidecars and `status: candidate-not-promoted`. The helper never changes `panelGeometryReady` or promotion state.



### Selection 2 manufacturer-binary narrowing — 2026-10-06

The exact Siemens datasheets for **3RT2016-1BB41** and **3RV2011-1JA10** were inspected as local binaries. Their page-1 embedded product images are now SHA-256 tracked as manufacturer evidence. Both images are exact-document evidence but remain three-quarter/perspective, so neither is eligible as the runtime orthographic visual. This narrows the remaining 3RV blocker to acquisition of the already-qualified straight-on external binary; 3RT likewise keeps its strict orthographic binary gate. No promotion state or panelGeometryReady flag was changed.



### PROtop CAD mirror audit + Rittal depth gate — 2026-10-06

GitHub code search was exhausted for exact PROtop article CAD filenames (`2466870000.prj/.step/.stp/.dxf/.dwg`) and did not yield a transportable exact CAD binary. Exact PARTcommunity project identity remains verified, but terminal-center coordinates are still unavailable; terminal geometry therefore stays unverified. Rittal SK 3241.100 now also carries an explicit metadata-reconciliation gate: **107 mm installation depth** and **132 mm alternate overall-depth evidence** are not treated as interchangeable. No 3D envelope promotion will occur until exact drawing semantics reconcile those values.



### Selection 2 source-discovery progress — 2026-10-06 round 3

- **5TL1163-0:** Siemens LV10 exact 5TL1 dimensional drawings re-confirm the one-module front geometry and exact article family. This remains technical geometry evidence only; it does not satisfy the project's real-photo visual lock.
- **Rittal SK 3241.100:** a new exact strong-front supplier candidate was found. The source view is sufficiently front-oriented to become the preferred binary-acquisition target, but no runtime promotion is allowed until the original binary is stored with provenance and independently pixel-audited.
- **SICK WTB4-3P2161 / 1028099:** an exact front-lens photo was found, but visible top/side depth keeps it outside the strict orthographic-front gate.



### Sensor visual acceptance flexibility — 2026-10-06

User-approved policy change: **sensor-class products are no longer front-only**. For sensors, exact real **isometric / three-quarter** views may be accepted when they better communicate the sensing face, connector and mounting/body orientation. Exact model identity, provenance, and independently verified physical dimensions remain mandatory. This flexibility applies to sensors only; DIN protection devices, contactors, power supplies and other panel hardware retain their stricter orientation rules. SICK WTB4-3P2161 / 1028099 is now evaluated under `sensor-visual-flex-v1`.


### 5TL1163 canonical front promotion — 2026-10-06

User-supplied front asset `dist/assets/products/siemens-5tl1163-0-user-front.webp` is now the canonical material runtime visual. The optimized WebP is **180 × 898 px**, SHA-256 `a3a183eb6bf319d549536bcaac5f6a038d9a61ab843bfd168de4da8ef9e23f04`, and maps exactly to the verified Siemens **18.0 × 89.8 mm** front envelope at **10 px/mm**. Existing terminal geometry is retained at **1 = (9, 9) mm** and **2 = (9, 80.8) mm**. With front visual + verified dimensions + verified terminal geometry, 5TL is promoted and `panelGeometryReady=true`. The shared `wireOverBody` contract remains active, so wires render above the photo and terminal interaction remains above the wires.


### Non-sensor visual derivation policy — 2026-10-06

User-approved rule: for non-sensor panel hardware, a native exact orthographic-front photo remains preferred, but it is no longer mandatory when unavailable. The best exact-model **real product image** may be cropped/rectified into a **front-facing derived runtime asset**. Raw isometric/perspective source images are not used as-is for non-sensor panel hardware. Source provenance and derived-asset provenance are both recorded. Physical dimensions remain sourced from exact technical data (or an explicitly approved class reference), and terminal-center geometry remains independently verified; photo rectification must never be used to invent terminal coordinates. This policy is `panel-visual-derived-front-v1`. Sensor products continue under the separate `sensor-visual-flex-v1` policy.



### 3RV exact-front acquisition checkpoint — 2026-10-06

Exact `3RV2011-1JA10` straight-on/front sources were re-confirmed from multiple suppliers. The execution environment cannot currently resolve/fetch the image hosts (MT24, TCDN/Eletrosul, TME cloud image proxy), so no binary was silently substituted and no synthetic model label was invented. Under `panel-visual-derived-front-v1`, rectification remains allowed once exact source bytes are available. Until then, 3RV remains visually blocked only by binary transport/provenance; its verified dimensions and terminal geometry are preserved.



### SICK sensor visual gate closure — 2026-10-06

The existing exact repo binary `dist/assets/products/sick-wtb4.jpg` already has recorded RS product-page/image provenance in the product asset manifest and visibly identifies **WTB4-3P2161 / 1028099**. Under the user-approved `sensor-visual-flex-v1` policy, its informative side/three-quarter sensor view is accepted. The physical runtime gate is now policy-aware: sensor isometric/three-quarter orientation no longer creates an orthographic-front failure. SICK is **not** marked panel-ready yet because terminal/connector geometry remains unverified; that blocker is kept separate and fail-closed.


### SICK connectorized external geometry closure — 2026-10-06

The exact SICK WTB4-3P2161 datasheet verifies **16 × 39.5 × 12 mm**, **Connector M8, 3-pin**, connection diagram **Cd-045**, and pin assignment **BN/1 = L+**, **BU/3 = M**, **BK/4 = Q**. The dimensional drawing identifies callout **8 = Connection**. Because this product is an external connectorized field sensor, panel readiness now validates the connector interface rather than fabricating three separate body-terminal center coordinates. The runtime keeps per-conductor terminal anchors unverified/null while the physical product itself is promoted as panel-geometry ready.

### 3RT2016 derived-front promotion — 2026-10-06

The repository already contains an exact, single-product `3RT2016-1BB41` source binary with readable exact article marking and recorded supplier provenance. Under the user-approved `panel-visual-derived-front-v1` policy, runtime presentation now crops the visible top-depth plane from source viewBox `358 328 536 762` to front-derived viewBox `358 394 536 691`, which closely matches the verified **45 × 58 mm** front envelope without replacing product identity. Terminal centers remain sourced independently from the Siemens orthographic dimensional drawing and are not inferred from the photo. 3RT is promoted and `panelGeometryReady=true`.


### Rittal 3241100 derived-front promotion — 2026-10-06

The existing exact repo source `dist/assets/products/rittal-3241100.jpg` is reused under the user-approved **panel-visual-derived-front-v1** fallback. A front-face crop (`63 29 180 251`) is non-uniformly rectified into `dist/assets/products/rittal-3241100-derived-front.svg` at a square **255 × 255 mm** runtime face. Manufacturer installation geometry remains authoritative: **224 × 224 mm cutout**, **107 mm installation depth**, **25 mm projection/build depth**. Rittal is promoted for panel placement/rendering with `panelGeometryReady=true`; electrical terminal geometry remains independently `unverified` and no terminal coordinates are inferred from the rectified visual.



### PROtop 2466870000 derived-front visual closure — 2026-10-06

The exact repo photo `dist/assets/products/weidmuller-pro-top-2466870000.jpg` is now reused under **panel-visual-derived-front-v1**. The front/control plane is cropped from `218 86 248 690` and rectified to a **35 × 130 mm** runtime face via `dist/assets/products/weidmuller-pro-top-2466870000-derived-front.svg`. This closes the visual-orientation blocker only. PROtop remains fail-closed for panel terminal geometry: exact STEP/DXF/DWG bytes still must be retrieved and terminal-center mm coordinates parsed; no coordinates are inferred from the rectified image.



### P0 Windows launcher incident closure — 2026-10-06

Gerçek kullanıcı denemesinde `BASLAT.bat` çift tıklanınca uygulamanın açılmadığı doğrulandı. Kök neden, launcher'ın önce `explorer.exe "%LAUNCHER%"` çağırması ve Explorer'ın HTML dosyasını tarayıcıda açmadan da başarı kodu döndürebilmesiydi; batch bu kodu gerçek açılış başarısı sanıp hemen kapanıyordu. Aynı zamanda CI `DTS_LAUNCHER_TEST=1` gönderdiği halde güncel launcher bu değişkeni okumadığı için Windows smoke testi gerçek başlatma yolunu güvenilir biçimde korumuyordu.

Düzeltme: Explorer devri kaldırıldı; launcher önce kurulu Edge/Chrome yollarını ve PATH'i dener, ardından `start "" "%INDEX%"` ile Windows varsayılan HTML uygulamasına doğrudan devreder. `DTS_LAUNCHER_TEST=1` kapısı browser açılmadan önce çalışır ve `DTS_LAUNCHER_SMOKE_OK` üretir. `tests/windows-launcher-v11920.test.cjs` bu sözleşmeyi ve `explorer.exe` regresyonunu kilitler. GitHub Actions dakika tasarrufu nedeniyle bu düzeltme commit'inde workflow tetiklenmez; sonraki anlamlı toplu G7 kilometre taşında gerçek Windows smoke yeniden doğrulanacaktır.


### Profile/CAD runtime integration checkpoint — 2026-10-06

- **Lead:** MQ-03 · **Cross-check:** MQ-02/MQ-04 · **MQ-12:** contract tests · **MQ-13:** repo continuity · **MQ-00:** package remains OPEN for coverage.
- PROtop exact six-view DXF archive SHA-256 `e248de04fa18ab287e5bc3b1fb5ebd07e5e6de768af32ab30dff46aeae8f2f48`; exact top DXF SHA-256 `183feb0ba2dcc7e3adb3435035c586ebbc62e33c38dfcdc1e66f6c30baaa9a54`.
- Top-view main-body CAD profile is normalized to official 35 mm width × 125 mm depth and is now consumed by runtime door-sweep collision. Generic verified-profile support requires actual `colliderProfileXZMm`; status alone cannot claim verified collision.
- Digital Twin consolidation now separates **source image audit** from **active runtime visual orientation/policy** and carries collider method/profile geometry into the unified registry.
- **3RV2011-1JA10:** exact `G_NSA0_XX_93051V.dxf` front/left layers verify 45 × 97 × 96.9 mm profile bounds; `profileStatus: verified`. Because the package has no exact top-view X/Z collision polygon, collider remains `conservative-envelope` and no polygon is inferred.
- V20 and remaining products stay fail-closed at `conservative-envelope` until raw profile/mesh geometry is actually consumed.
- GitHub Actions intentionally not run; all commits use `[skip ci]`. Full G7 remains reserved for the later agreed milestone.


### G7 preparation checkpoint — 2026-10-06

- G2'nin eski native-orthographic-only panel-ready kontrolü kullanıcı onaylı runtime policy'lerle uyumsuzdu; full G7 öncesi düzeltildi.
- G2 panel-ready visual doğrulaması artık Digital Twin runtime truth kullanır: native `orthographic-front`, `panel-visual-derived-front-v1` ve `sensor-visual-flex-v1` kabul politikaları source audit'i silmeden doğrulanır.
- G1 raporu policy-aware active terminal-anchor sayısını, verified profile sayısını ve verified-profile collider sayısını içerir.
- Protected `scripts/quality-gates-v11920.cjs` değişikliği workflow `BOOTSTRAP` ile aynı atomik committe yapıldı: `75b7b4bafc64466baa6c211f3d7c89505d790f07`.
- PIN commit: `a03a2d5432b6f02661734a0132900cf55739322b`.
- Current protected-file set baseline normalization karşılaştırmasında **8/8 MATCH**; quality-gates syntax temiz.
- Actions henüz çalıştırılmadı. Sonraki adım artık tek anlamlı toplu **full G7 validation**; ardından MQ-00 master review.


### Full G7 dispatch blocker — 2026-10-06

Current milestone preparation is complete, but final MQ-00 DONE is intentionally withheld. The workflow only supports PR/manual dispatch; the connected GitHub action surface cannot start a new manual workflow run, and creating a temporary branch/PR would violate the locked branch policy. GitHub reports zero workflow runs for target milestone HEAD `97429b591d3bfd902e6ae7a1860d2d6876dfc42b`. A container-side full-regression fallback was attempted but the execution environment cannot resolve `github.com`, so no substitute result is claimed. Current branch has only documentation-only blocker recording changes after that milestone preparation. **State: BLOCKED solely on one actual full G7 dispatch.**


### Repository migration G0 repair + Actions-free G7-equivalent static audit — 2026-10-06

- **Active repo:** `ayhanuysal031980-crypto/Devre-Tasarim-Studyo` · **active branch:** `v1.19.20`.
- Source-to-target `v1.19.20` tree was rechecked: **691/691 blobs, 0 missing / 0 changed / 0 extra** against the source repository snapshot.
- Migration exposed a real G0/MQ-13 continuity defect: the copied workflow still pinned source-repository commit SHAs that did not exist in the new repository. This would make the fast gate fail even with correct runtime code.
- The locked historical snapshots were reconstructed in the new repository without weakening policy:
  - `main` → `aa62ddeb68de4211d66e92ecc8e0adebc3f901fa`, tree-equivalent to old golden main (**553/553, 0/0/0**),
  - `v1.19.0` → `faeef90ef3ed037c71a1715610ee0f9d33913aa4` (**614/614, 0/0/0**),
  - `v1.19.1` → `ddd822ea124072a43a6a7bd501b73290110e3480` (**635/635, 0/0/0**).
- G0 workflow branch locks were re-pinned to the new immutable repository refs. Migration baseline two-stage pin completed; current integrity baseline is `7d1ef9cf39ebf6de2614ad7423551c64ea35a5cc`.
- Current `v1.19.20` HEAD after pinning: `bf58becb61a9e52411ed2e16b5b3c4ca5d7c7065`.
- Protected integrity set: **8/8 MATCH** after normalization. Four LOCKED policy files retain their expected blob SHAs. Branch inventory is exactly `main`, `v1.19.0`, `v1.19.1`, `v1.19.20`.
- All migration-repair commits used `[skip ci]`; current HEAD has **0 Actions runs**.
- **G1 static contract audit:** PASS. Runtime metadata contains **10 products / 11 mappings**, **8 verified terminal-geometry mappings**, **3 verified profiles**, **1 verified-profile collider**; current physical-metadata regression expectations match these values.
- **G2 static contract audit:** PASS. Selection 2 queue is **10/10 promoted, 0 blocked, 0 non-empty blockers**. Runtime `panelGeometryReady` count is 10; accepted visual-policy split remains native orthographic / derived-front / sensor-flex without relaxing provenance.
- **G3 static contract audit:** PASS. Curriculum contract continues to separate verified MEB source metadata from unverified application learning goals; no unverified outcome is silently promoted to official verified outcome.
- **G4 static contract audit:** PASS for source/harness presence and signed-flow contract wiring. Executable solver golden run is still **local execution pending** because the current chat GitHub connector does not provide a shell against the private repository.
- **Runtime package static audit:** PASS. Explicit allowlist resolves to **492 runtime files**, inside the asserted 400–550 range; all required launcher/runtime/example/license/PDF entries are present. Full ZIP build/extract/hash execution remains **local execution pending**.
- **Windows launcher static audit:** PASS. `DTS_LAUNCHER_TEST` gate exists before browser launch, `explorer.exe` is absent, Edge/Chrome + `start "" "%INDEX%"` fallback and visible error path remain intact. Real `cmd.exe` execution remains **Windows acceptance pending**.
- **MQ-12 decision:** static/contract layer PASS; executable full regression + browser smoke + package execution pending.
- **MQ-13 decision:** migration continuity defect CLOSED; repo/branch/lock structure is now internally coherent in the new repository.
- **MQ-00 decision:** remains **BLOCKED**, but the blocker is now narrowed to execution evidence only: full local/hosted G7-equivalent regression, browser smoke, package build/extract verification and real Windows launcher acceptance. No unresolved static contract or migration-continuity blocker is currently known.


### Historical executable evidence cross-map — 2026-10-06

- Read-only audit of the source repository found the nearest successful full workflow run: **run 37311847588**, head `8b37af601a899d41c193bcf037deb49d0f2d121a`, conclusion **SUCCESS**.
- That run completed all four jobs successfully: fast-gate, validate-and-package, real Windows launcher smoke, and browser visual smoke. Inside validate-and-package, syntax/dependency checks, **G1–G4**, first-launch smoke, full regression, and Windows ZIP build/extract verification all completed successfully.
- The successful run artifacts still exist and are unexpired: Windows package artifact `11346388802` and browser-visual artifact `11346191969`.
- Diff from that successful head to the migrated source snapshot `cca96b8626445fc1436acfc471bd459dce897ec9` contains 44 changed files, 41 of them validation/runtime relevant. Therefore the old SUCCESS is **not** claimed as a current-HEAD full-G7 pass.
- Transferable execution evidence was narrowed by dependency/hash review:
  - **G3:** quality-gate G3 implementation and tutorial curriculum/source dependencies did not change after the successful run; historical execution evidence remains applicable to the unchanged G3 contract.
  - **G4 solver core:** `dist/simulation.js`, `dist/signed-flow.js`, and `tests/signed-flow-v11920.test.cjs` are unchanged since the successful run. `quality-gates-v11920.cjs::g4` is also unchanged. `dist/app.js` did change, but inspected diff is physical-material rendering/scale integration and does not modify the signed-flow class contract asserted by the test. Historical execution evidence is therefore retained as strong G4 evidence, while a current-HEAD rerun is still preferred before final MQ-00 closure.
  - **G1/G2:** not transferable as final execution evidence because physical metadata, Digital Twin, asset policy, Selection 2 queue, and G1/G2 gate logic changed after the successful run.
  - **Browser visual:** not transferable because runtime rendering files changed materially.
  - **Windows launcher:** not transferable because `BASLAT.bat` changed after the successful run.
  - **ZIP/package:** packaging implementation is unchanged, but packaged runtime content changed; current-content ZIP build/extract/hash remains pending.
- Source-repo run `37452013760` at `cca96b...` ended at **fast-gate failure** and skipped validate/package, browser, and Windows jobs. This does not constitute a runtime regression result. The migration-specific G0 continuity defect that would break fast-gate has since been repaired in the target repository.
- Revised execution status: **G3 = historical execution-backed PASS; G4 = historical execution-backed / current rerun preferred; G1/G2 + full regression + browser + current package + current Windows launcher = current execution pending.**


### Actions-free in-memory execution: G1/G2/G3 current-head closure — 2026-10-06

- GitHub-hosted Actions remains intentionally unused. Current repository modules were fetched from the private target repo and executed directly in the connected V8 environment with a CommonJS-compatible in-memory loader.
- First current G1 execution found a real regression: `DigitalTwin.validate()` accepted terminal geometry states only `verified|unverified`, while the already-approved SICK external sensor contract intentionally uses `connectorized-external`. This caused G1 to fail for component `photoeye` with validator reason `terminals` even though the physical/panel gate was correctly ready.
- Root cause classification: **Digital Twin enum drift**, not bad SICK physical evidence and not a reason to invent body terminal anchors.
- Fix commit: `f1e27b439f27785079f7cf59824604c59b6d6554` — validator now accepts `connectorized-external` alongside `verified|unverified`.
- Regression lock commit: `a3582cb572fd38580f10e53068457bb2235cee1b` — `tests/digital-twin-v11920.test.cjs` now explicitly requires SICK `photoeye` to validate with `connectorized-external`, no active body-anchor eligibility, panel ready/promoted, and no quality blockers.
- Re-executed current G1 result: **PASS** — products=10, mappings=11, verifiedDimensions=10, verifiedTerminalGeometry=8, activeAnchorVisualEligible=8, stagedTerminalGeometry=3, verifiedProfiles=3, verifiedProfileColliders=1, digitalTwinRecords=11, digitalTwinInvalid=0.
- Re-executed current G2 result: **PASS** — criticalProducts=8, criticalOrientationAudited=8, Selection2 total=10, promoted=10, blocked=0, invalid=0. Asset audit still reports rights conservatively (licenseUnknown=258, usageRightsUnknown=258); these are explicit unknowns, not silently promoted rights.
- Current G3 was also executed in-memory from `tutorial-lessons.js -> tutorial-expanded-lessons.js -> tutorial-source-outline.js -> tutorial-pedagogy.js -> tutorial-curriculum.js`: **PASS** — lessons=1655, sourceVerified=1219, sourcePartial=260, sourceUnverified=176, officialOutcomeVerified=0, appPrerequisites=1604, auditInvalid=0, validateInvalid=0.
- **MQ-12 status update:** G1/G2/G3 now have current-head execution evidence without Actions. G4 remains historical execution-backed plus unchanged solver/golden-test evidence; full Node runner, browser smoke, current ZIP build/extract/hash and real Windows launcher remain outside this chat execution surface.


### Current regression narrowing — migration + asset quality + Selection 2 — 2026-10-06

- `project-migration-v11920` contract was executed in-memory against current target-repo files: **PASS**. v5/v6/v7 shipped fixtures preserve circuit structure/connectivity, clean/parse round-trip succeeds, unversioned recognizable legacy migrates to v7 without input mutation, and unsupported/future/invalid schema values remain fail-closed.
- `asset-quality-v11920` core contract was executed against current manifests: **PASS**. Runtime `product-assets.js` equals canonical product manifest; product audit = 8 total / 7 exact / 1 family; PLC audit = 202 total / 88 exact / 114 family / 198 perspective / 3 orthographic-front / 1 front-perspective / 0 invalid. All generated descriptors validate; unknown rights remain explicit.
- Selection 2 replacement queue core regression was executed against current queue + physical metadata: **PASS**. Queue schema valid; promoted list exactly equals the 10-item order; blocked list empty; closure status `closed-complete`; live panelGeometryReady truth matches queue truth; PROtop terminal geometry=`verified`, SICK=`connectorized-external`, Rittal=`unverified`; closure snapshot = 10 promoted / 0 blocked / 0 invalid.
- These checks further reduce the unexecuted portion of the full Node regression harness. Remaining non-emulated coverage still requires native Node `--test` orchestration and environment-dependent browser/package/Windows surfaces.


### Browser/package/launcher current contract narrowing — 2026-10-06

- `browser-visual-contract-v11920` environment-independent contract executed against current files: **PASS**. PNG dimension parser, collapsed-card guard, real Chrome CDP requirements, fixed 1440×1000 viewport and dashboard/editor/panel/tutorial screenshot coverage all pass. No Playwright/Puppeteer/Selenium dependency is present.
- Browser runner SHA `873363d0464dd4f786871666482442912de548fd` and golden SHA `4621e04608762eb1baeedc0520fc7b2584ee00e6` are byte-identical to the last complete successful G7 run `37311847588`. The harness itself is therefore historically execution-backed and current-contract clean; current runtime rendering still requires one real Chrome/Chromium run.
- Windows launcher environment-independent contract executed against current `BASLAT.bat`: **PASS**. `DTS_LAUNCHER_TEST` and `DTS_LAUNCHER_SMOKE_OK` are present before browser launch, executable `explorer.exe` usage is absent, Edge/Chrome discovery exists, `start "" "%INDEX%"` fallback remains, and visible `:launch_error -> pause -> exit /b 7` path remains.
- `BASLAT.bat` SHA differs from the last successful Windows smoke run, so historical `cmd.exe` success is not promoted to current launcher acceptance. **Real current Windows cmd.exe acceptance remains pending.**
- Runtime-package contract was executed from the current Git tree using the same explicit allowlist rules as `scripts/package.py --list`: **PASS**, profile `runtime-allowlist-v1`, **492 files**. All required launcher/runtime/example/license/PDF entries are present; `tests/ scripts/ tools/ docs/ .github/` and locked/audit payload remain excluded.
- `scripts/package.py` SHA `f3301b7030020d1a0b9f96b78e4aa1f84eb784d3` is byte-identical to the last successful full G7 package run. Packaging algorithm is therefore historically execution-backed and current manifest contract is clean. Because packaged runtime bytes changed afterward, current ZIP create/CRC/extract/SHA verification remains pending.
- Remaining executable-only scope is now: native Node `--test` full orchestration, one current real Chrome visual smoke, one current ZIP build/CRC/extract/hash verification, and one current real Windows launcher smoke; then MQ-00 final review.


### G7 run #3 cancellation analysis + panel routing closure — 2026-10-06

- Workflow run `37509910723` on `6d10060550ff3696daec70585fe5bd60ec79baf8` was **cancelled by job timeout**, not by a regression assertion. GitHub annotation: `The job has exceeded the maximum execution time of 15m0s`.
- In that run: fast-gate PASS, G1–G4 PASS, first-launch smoke PASS, real Chrome visual smoke PASS, real Windows `cmd.exe` launcher smoke PASS. The regression process was still running when the 15-minute validate/package job limit cancelled it; ZIP verification was therefore skipped.
- Workflow hardening commit `36826116d572258f119654da8147850b152098ad`: `validate-and-package timeout-minutes` increased **15 → 30** with `[skip ci]`; no additional Actions run was started.
- The only failure from the preceding complete regression run was traced to a real panel-routing incompatibility at Siemens 3RT verified terminal A1. Verified terminal geometry placed the A1 anchor at the correct physical coordinate, while the fixed 12 mm routing stub remained 0.6 mm inside the device clearance box.
- Runtime fix `6d10060550ff3696daec70585fe5bd60ec79baf8`: terminal stubs are passed through the existing safe `escape()` routine before orthogonal routing. No physical terminal coordinate, evidence, clearance rule, or Digital Twin truth was weakened.
- Actions-free isolated execution of current `dist/panel-wiring.js`: **PASS**. A verified A1 endpoint connects successfully; one valid route is produced; source and destination terminal coordinates remain unchanged; the route exits the device envelope correctly.
- Current closure status: all known contract/runtime blockers are closed. A complete native Node `--test` rerun and current ZIP build/extract/hash remain pending only because Actions minutes are exhausted / no local shell execution surface is available in this chat.


### FINAL G7 / MQ-00 closure — 2026-10-06

- Final full GitHub Actions validation run: **37513253115** on commit `a68fe72c4502956c3fb9d1da23f0a8ae6ff663d4` — **SUCCESS**.
- Fast gate: **PASS** — repo integrity, locked-file policy, branch policy, documentation integrity, CI scope.
- G1–G4 Master Quality gates: **PASS**.
- First-launch / safety smoke: **PASS**.
- Native Node full regression: **697/697 PASS, 0 fail, 0 cancelled, 0 skipped**; duration ~670.8 s.
- Real Chrome/Chromium visual smoke: **PASS** for dashboard/editor/panel/tutorial.
- Real Windows `cmd.exe` launcher smoke: **PASS**.
- Windows package build/extract validation: **PASS**.
  - profile: `runtime-allowlist-v1`
  - files: **492**
  - bytes: **83,832,351**
  - package SHA256: `f0eb0995838ca9c76c55870609cd35ab502d01603c9294f68520922451eefd73`
  - CRC: **passed**
  - extracted file hashes: **passed**
- Final Actions artifacts:
  - Windows package artifact ID `11436637332`, uploaded size 83,808,705 bytes, artifact digest `sha256:58d70e199611248e57bdb164aeeb29f3f2d8a7950fb628d1eb7c29b91e863d9a`.
  - Browser visual artifact ID `11436820129`, artifact digest `sha256:1ec2342062b2080b8ce596a2e0600c89e83dfc4b6026b762b4306dd4e9247390`.
- The validation job timeout was hardened from 15 to 30 minutes before the final run, allowing the complete regression suite to finish.
- Temporary `push` trigger used only to start this one final run through the connected GitHub tool was removed immediately afterward. Normal workflow triggers are restored to `pull_request` + `workflow_dispatch`.
- Post-validation integrity baseline cleanup:
  - trigger-restore commit: `f18ec71686a6e198d7470885c47e8b91622fabe4`
  - final baseline pin commit: `82dde8db9346b0b50a86ce1e789c00149db2c27e`
- **MQ-12 FINAL: PASS** — executable validation complete.
- **MQ-13 FINAL: PASS** — repository continuity / locks / allowed branch structure coherent after migration and final trigger cleanup.
- **MQ-00 FINAL: PASS / CLOSED** — no known blocking regression remains for the validated v1.19.20 runtime. Any future development begins from this closed quality baseline.


## 2026-10-07 — MQ-P0-001 ORDEL HMT physical-scale correction

Durum: **DONE — TARGETED STATIC/RUNTIME CONTRACT VERIFIED**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02 (physical scale)
- CrossCheck: MQ-03 (visual/geometry)
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Component: `converter-temperature` / ORDEL HMT-R / HMT-T
- Root cause: runtime library definition had reverted to `240 × 240` scene units while the locked project scale is `2 scene-unit/mm`; this made the Ø45 mm head transmitter render as if it were 120 × 120 mm in the control-material workspace.
- Correct physical contract: **diameter = 45 mm**, radius = 22.5 mm, body frame = `45 × 45 mm`, depth/height = `20 mm`.
- Canonical runtime footprint: `90 × 90` scene units.
- Existing visual asset is preserved: `ordel-top-v115.png`.
- Terminal coordinates were scaled by the same 0.375 factor as the body, preventing image/hitbox drift.
- Manufacturer evidence: ORDEL HMT-R manual `https://www.ordel.com.tr/upload/KK_134_3_TR_HMT-R.pdf`.
- Regression locks: `tests/user-scale-only-lock-v11920.test.cjs`, `tests/physical-metadata-v11920.test.cjs`, `tests/instruments-v115.test.cjs`.
- GitHub Actions were not run; commits use `[skip ci]`.


## 2026-10-07 — Ortak çalışma uzayı ve ölçek referansı

Durum: **IMPLEMENTED — TARGETED STATIC CONTRACT ADDED; FULL G7 DEFERRED BY ACTIONS POLICY**

- TechnicalDirector: MQ-00
- Lead: MQ-02
- CrossCheck: MQ-03, MQ-04
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Kanonik çalışma uzayı: 2800 × 1800 scene-unit = 1400 × 900 mm.
- Kanonik oran: 2 scene-unit/mm; grid 10 scene-unit = 5 mm.
- Kumanda, tesisat/elektrik ve Arduino ana editörü artık `dist/workspace-space.js` sözleşmesinden ölçü alır.
- Pano mm-native kalır; çalışma uzayı fiziksel kıyas oranı 1 mm = 2 scene-unit olarak kilitlenmiştir.
- Önceki 2400 × 1500 scene-unit çalışma sınırı genişletildi; mevcut koordinatlar taşınmadı.
- WAZ5 8540300000 merkezi physical metadata: 17.5 × 92.4 × 112.4 mm; görünür asset doğrudan 35 × 184.8 scene-unit frame'e bağlandı.
- ORDEL HMT: Ø45 mm → 90 × 90 scene-unit; mevcut doğrulama korunur.
- Siemens 3RT2016-1BB41: main-contact gerçek physical component; motor-starter ve coil-contactor 90 × 116 scene-unit görünümünü main-contact üzerinden physical proxy olarak taşır ve bağımsız ürün ölçüsü iddia etmez.
- Yeni regression: `tests/workspace-space-v11920.test.cjs`; mevcut scale/physical metadata testleri güncellendi.
- GitHub Actions çalıştırılmadı; commitler `[skip ci]` ile yapıldı.


## 2026-10-07 — SSR shared-workspace scale

Durum: **DONE — TARGETED STATIC CONTRACT VERIFIED**

- Component: `solid-state-relay` / Katı Hâl Rölesi · SSR
- Kullanıcı ölçüsü: kısa kenar **45 mm**, uzun kenar **62 mm**.
- Ortak uzay oranı: **2 scene-unit/mm**.
- Runtime physical frame: **90 × 124 scene-unit**.
- Pin/terminal koordinatları gövdeyle aynı oranla yeniden ölçeklenir.
- Derinlik kullanıcı tarafından verilmediği için uydurulmaz; `physicalDimensionsMm` yalnız width/height/shape taşır.
- Mevcut görsel/simge korunur; `visualAssetPreserved=true` ölçek kilidiyle işaretlenir.
- Regression: `tests/user-scale-only-lock-v11920.test.cjs` SSR için 45×62 mm → 90×124 unit ve pin sınırı kontrolü yapar.
- GitHub Actions çalıştırılmadı; commitlerde `[skip ci]` kullanıldı.


## 2026-10-07 — Omron MY röle görseli ve ortak uzay ölçeği

Durum: **IMPLEMENTED / USER-APPROVED VISUAL**

- Röle kütüphane görseli kullanıcı tarafından seçilen Omron MY front/orthographic asset ile değiştirildi.
- Asset: `dist/assets/products/omron-my-relay-v11920.webp`.
- Fiziksel ön yüz: **21.5 × 28 mm**.
- Ortak çalışma uzayı: **43 × 56 scene-unit** (2 scene-unit/mm).
- Yalnız **A1** ve **A2** terminalleri korunur.
- A1 üst kısa kenar merkezinde, A2 alt kısa kenar merkezindedir.
- Diğer görsel terminal çıkıntıları runtime elektriksel terminali değildir ve kütüphane sözleşmesinde yoktur.
- IEC/şematik röle davranışı değiştirilmez; yeni görsel yalnız material görünümde kullanılır.
- Hedef regresyon: `tests/user-scale-only-lock-v11920.test.cjs`.
- GitHub Actions çalıştırılmadı; commitler `[skip ci]` ile oluşturuldu.


## 2026-10-07 — Kullanıcı fiziksel ölçek paketi + röle/SSR aktif LED + HCFA görsel/terminal düzeltmesi

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02 / MQ-03
- CrossCheck: MQ-04 / MQ-05 / MQ-10
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Ortak çalışma uzayı oranı değişmedi: **2 scene-unit/mm**.
- Sıcaklık Kontrol Cihazı: **48 × 48 mm → 96 × 96 scene-unit**.
- Termik Röle Yardımcı Kontağı NO/NC: **46 × 87 mm → 92 × 174 scene-unit**.
- DC Röle Bobini: **28 × 78 mm → 56 × 156 scene-unit**.
- Darbe Rölesi Bobini, Zaman Rölesi Bobini, Bırakmada Gecikmeli Bobin, Flaşör Bobini ve Çekmede Gecikmeli Bobin: **17.4 × 84 mm → 34.8 × 168 scene-unit**.
- Bütün bu scale-only düzeltmelerde pin/materialPin koordinatları gövdeyle aynı oranla ölçeklenir; görseller korunur ve fiziksel kaynak workspace-space-v1:user-locked olarak işaretlenir.
- Röle/bobin ve SSR material renderer, simülasyonun mevcut c._active state'inden beslenen **yeşil aktif LED** katmanı taşır. Pasif durumda LED koyu kalır; elektriksel solver davranışı değiştirilmez.
- HCFA drive için kullanıcı tarafından sağlanan doğru ürün görseli offline WebP olarak mevcut embedded image zincirine geçirildi; drive fiziksel ön frame'i ölçü çizimine göre **42 × 165 mm → 84 × 330 scene-unit** oldu.
- HCFA drive terminal kimlikleri korunurken görsel bağlantı bölgelerine yeniden hizalandı. CN1/CN2/CN3, RS485 ve güç/motor terminal pinleri yeni fiziksel frame sınırları içinde tutulur.
- HCFA canlı fiziksel ekran, powered/servo/running/fault/rpm/monitor state'lerini yeni görseldeki ekran bölgesine bindirir; MODE/SHIFT/UP/DOWN/SET hotspotları yeni görsele kalibre edildi.
- HCFA servo motor için kullanıcı tarafından sağlanan doğru yan görünüş görseli offline WebP olarak embedded image zincirine geçirildi.
- Servo motor görünür fiziksel frame'i ölçü çiziminden **162.2 × 60 mm → 324.4 × 120 scene-unit** olarak bağlandı. Kaydedilen boyut alt kanıtları: body 122.7 mm, front offset 6.5 mm, shaft shoulder 3 mm, shaft 30 mm / Ø14, pilot Ø50.
- Motor U/V/W/PE güç bağlantıları ile ENC bağlantısı yeni görseldeki üst konnektör bölgelerine taşındı; elektriksel pin kimlikleri değişmedi.
- Yeni HCFA WebP embedded payload audit'i: drive **11,458 byte / RIFF-WEBP**, motor **12,960 byte / RIFF-WEBP**; base64 chunk birleşimleri sırasıyla 15,280 ve 17,280 karakter olarak doğrulandı.
- Regression kaynakları güncellendi: tests/user-scale-only-lock-v11920.test.cjs ve tests/hcfa-x2e-v119.test.cjs.
- GitHub Actions çalıştırılmadı. Bu turdaki doğrulama syntax + in-memory geometry/pin bounds + embedded WebP signature/size + static runtime contract düzeyindedir; native full Node/Windows acceptance bu commit için ayrıca çalıştırılmadı.


## 2026-10-08 — Buton fiziksel ölçek ve basma çapı paketi

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02 / MQ-03
- CrossCheck: MQ-04 / MQ-10
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Ortak çalışma uzayı oranı: **2 scene-unit/mm**.
- 2 Kanallı Acil Stop, Başlat Butonu, Başlat/Durdur Butonu, Durdur Butonu, Işıklı Buton, İki El Emniyet Butonu ve Jog Butonu · 4 Uçlu: **36 × 46 mm → 72 × 92 scene-unit**.
- Bu grubun hareketli/basılan iç buton çapı: **29 mm → 58 scene-unit**.
- Acil Stop ile Mantar Buton NO/NC için gövde boyutu değiştirilmeden merkez kırmızı aktüatör çapı **40 mm → 80 scene-unit** olarak kilitlendi.
- Pin ve materialPin koordinatları gövde ölçeklemesi ile aynı X/Y oranında taşınır; elektriksel pin ID'leri korunur.
- DOLD iki kanallı acil stop ve iki-el emniyet butonu aynı fiziksel frame sözleşmesine alındı; malzeme görünümünde sırasıyla emergency-stop ve green-pushbutton assetleri kullanılır.
- Material renderer, buttonActuatorDiameterScene metadata'sını kullanarak raster kap/etkileşim bölgesini asset merkezini koruyarak gerçek scene-unit çapına çeker.
- Regression: tests/user-scale-only-lock-v11920.test.cjs + tests/dold-safety-v119.test.cjs.
- GitHub Actions çalıştırılmadı; hedef doğrulama syntax, runtime library eval, fiziksel ölçü, pin sınırı ve actuator-region contract düzeyindedir.


## 2026-10-08 — Windows BASLAT.bat açılış onarımı

Durum: **IMPLEMENTED — ACTIONS-FREE STATIC LAUNCHER VALIDATION PASS**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02
- CrossCheck: MQ-04 / MQ-10
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- BASLAT.bat artık doğrudan ham Windows dosya yolunu tarayıcıya vermek yerine BASLAT.html üzerinden file:/// URI üretir.
- Edge ve Chrome yanında Firefox da desteklenir.
- Birincil tarayıcı açılışı başarısız olursa sırasıyla Windows FileProtocolHandler, PowerShell Start-Process ve klasik START fallback zinciri denenir.
- dist/index.html, arduino-card, tutorial-card ve window.DTSStudio paket bütünlük kontrolleri korunur.
- Hata halinde CMD penceresi kapanmaz; kullanıcıya BASLAT.html hedefi ve desteklenen tarayıcılar gösterilir.
- DTS_LAUNCHER_TEST smoke kapısı tarayıcı açmadan kalır ve test sözleşmesi tests/windows-launcher-v11920.test.cjs içinde güncellenmiştir.
- GitHub Actions çalıştırılmadı. Windows üzerinde gerçek çift-tıklama kabulü bu ortamda çalıştırılamadığı için PASSED sayılmadı; statik launcher contract doğrulaması PASS.


## 2026-10-08 — ET4420 48×48 görünür yüz + alt terminal sırası düzeltmesi

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- Sıcaklık Kontrol Cihazı component fiziksel gövdesi değişmedi: **48 × 48 mm = 96 × 96 scene-unit**.
- Önceki özel ET4420 renderer sabit **240 × 240 scene-unit** fotoğraf çizdiği için görünür cihaz yaklaşık 2.5× büyük görünüyordu; bu hata giderildi.
- ENDA ET4420 ürün fotoğrafı artık doğrudan component fiziksel frame'ini kullanır: **d.w × d.h = 96 × 96**.
- Canlı PV/SP ekranı, durum LED'leri ve SET/FUNCTION/UP/DOWN hotspotları aynı 48×48 frame'e oransal ölçeklenir.
- 4–17 terminal ID'leri korunur; 14 terminalin tamamı cihaz görselinin dışına, **alt kenarda soldan sağa tek sıra** halinde taşındı.
- Pinlerin elektriksel koordinatları alt kenarda `y = d.h` ve `side = bottom` olarak kilitlendi; terminal kutuları görseli kapatmamak için fiziksel ön yüzün hemen altında render edilir.
- Görsel asset/crop korunmuştur; yalnız render boyutu ve terminal geometri yerleşimi düzeltildi.
- Regression: `tests/user-scale-only-lock-v11920.test.cjs`.
- GitHub Actions çalıştırılmadı; syntax + library runtime geometry + renderer static contract doğrulaması PASS. Gerçek Windows UI kabulü ayrıca pending.


## 2026-10-08 — 18×70 mm bobin / tek kutuplu cihaz paketi + FKV-03 + 5SL6116-7 kullanıcı görseli

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02 / MQ-03
- CrossCheck: MQ-04 / MQ-10
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Önceki ET4420 kapanışı korunur: Sıcaklık Kontrol Cihazı gerçek **48 × 48 mm → 96 × 96 scene-unit** frame'de render edilir; canlı yüz overlay'i frame ile ölçeklenir ve 14 terminal görselin altında tek yatay sıradadır.
- Darbe Rölesi Bobini, Zaman Rölesi Bobini, Flaşör Bobini, Bırakmada Gecikmeli Bobin ve Çekmede Gecikmeli Bobin: **18 × 70 mm → 36 × 140 scene-unit**.
- Tek Kutuplu Ayırıcı: **18 × 70 mm → 36 × 140 scene-unit**.
- Siemens **5SL6116-7** ile eşleşen 1P kesici entries: **18 × 70 mm → 36 × 140 scene-unit**.
- 5SL6116-7 için kullanıcı tarafından 2026-10-08 sağlanan önden/şeffaf görsel canonical runtime visual olarak assets/products/siemens-5sl6116-7-user-front-v11920.webp üzerinden kullanılır; mevcut ON/OFF simülasyon state'i korunur.
- Faz Koruma Rölesi · Tense FKV-03: **23 × 60 mm → 46 × 120 scene-unit**.
- Yardımcı Röle Bobini kullanıcının tekrar onayladığı Omron MY görselinde kalır; fiziksel gövde **21.5 × 28 mm → 43 × 56 scene-unit**, A1/A2 kısa kenarlardadır.
- Tüm scale-only işlemlerde pin/materialPin geometri oranı korunur ve pin sınırları yeni fiziksel frame içinde doğrulanır.
- Regression kaynağı: tests/user-scale-only-lock-v11920.test.cjs.
- GitHub Actions çalıştırılmadı; syntax, runtime library eval, geometry/pin bounds ve static visual-contract doğrulaması kullanıldı.


## 2026-10-08 — 5SL6316-7 + 3RV2011 kullanıcı görseli ve fiziksel ölçek kapanışı

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02 / MQ-03
- CrossCheck: MQ-04 / MQ-10
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Ortak çalışma uzayı oranı değişmedi: **2 scene-unit/mm**.
- Siemens **5SL6316-7** üç kutuplu kesici: **54 × 70 mm → 108 × 140 scene-unit**.
- Siemens **3RV2011** termik-manyetik/motor koruma şalteri: **45 × 97 mm → 90 × 194 scene-unit**.
- 3RV2011 için kullanıcının 2026-10-08 tarihinde verdiği önden ürün görseli canonical runtime material asset olarak `assets/products/siemens-3rv2011-user-front-v11920.webp` dosyasına bağlandı.
- Görsel fiziksel frame'e distortion uygulanmadan şeffaf canvas içinde kalibre edildi; runtime `physicalFrameMm:{width:45,height:97}` sözleşmesi ile render edilir.
- Mevcut 3RV terminal ID'leri ve bağlantı semantiği korunur; pinler yeni fiziksel frame'e oransal taşınır ve gövde sınırlarında doğrulanır.
- Regression kaynağı: `tests/user-scale-only-lock-v11920.test.cjs`.
- GitHub Actions çalıştırılmadı; syntax + runtime library eval + physical geometry + pin bounds + visual asset contract doğrulaması kullanıldı.


## 2026-10-08 — ET4420 iki terminal sırası düzeltmesi

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- Sıcaklık Kontrol Cihazı / ENDA ET4420 ön yüz fiziksel ölçüsü değişmedi: **48 × 48 mm → 96 × 96 scene-unit**.
- Cihaz fotoğrafı, canlı PV/SP ekranı ve tuş hotspotları mevcut 48×48 mm ön yüz kalibrasyonunda korunur.
- 14 terminal artık görselin altında **7 + 7 olacak şekilde iki ayrı yatay sıra** halinde render edilir.
- Birinci sıra terminalleri: **4–10**; ikinci sıra terminalleri: **11–17**.
- İki sıra arasında dikey boşluk vardır; terminal kutuları ve etiketleri üst üste gelmez.
- Elektriksel pin ID'leri ve bağlantı semantiği değişmedi; bağlantı anchor'ları 48×48 mm gövdenin alt kenarında korunur.
- Regression: `tests/user-scale-only-lock-v11920.test.cjs`.
- GitHub Actions çalıştırılmadı; syntax + metadata + renderer contract doğrulaması kullanıldı.


## 2026-10-08 — ET4420 gerçek port satırları + DC röle Omron görsel düzeltmesi

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED CONTRACT VALIDATION PASS**

- Screenshot auditinde ET4420'nin önceki çözümünde gerçek portlar tek sırada kalırken ayrıca ikinci bir sahte görsel terminal katmanı çizildiği doğrulandı.
- Sahte terminal katmanı kaldırıldı. ET4420'nin 14 gerçek/interaktif portu artık iki yatay sıradadır: 4–10 için y=108, 11–17 için y=130.
- ET4420 ön gövdesi 48 × 48 mm / 96 × 96 scene-unit olarak değişmeden kalır.
- Uzun fonksiyon açıklamaları signalLabel alanında korunur; çalışma alanında yalnız 4–17 terminal numaraları görünür.
- Referans ve açıklama yazıları terminal sıralarının altına taşınması için annotationBottomOffsetScene=58 kullanır.
- Screenshot'taki eski şeffaf Schrack rölesinin coil-relay-dc runtime görselinden geldiği saptandı. Bu elemanın daha önce kilitlenen 28 × 78 mm gövdesi korunarak kullanıcı onaylı Omron MY görseline geçirildi.
- coil-relay-dc A1/A2 uçları üst ve alt kısa kenarlardadır. coil-relay için 21.5 × 28 mm Omron sözleşmesi aynen korunur.
- GitHub Actions çalıştırılmadı; syntax + runtime library geometry + static renderer contract doğrulaması kullanıldı.


## 2026-10-08 — Açık görsel kapanışı · 5SL6316 / 3RV / 5TL / HCFA

Durum: **IMPLEMENTED — ACTIONS-FREE TARGETED VISUAL CONTRACT PASS**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02 / MQ-03
- CrossCheck: MQ-04 / MQ-10
- TestEvidence: MQ-12
- RepoContinuity: MQ-13
- Siemens 5SL6316-7 fiziksel frame'i 54 × 70 mm → 108 × 140 scene-unit olarak korunur. Runtime mevcut Siemens 3P family front assetini gövde oranına uygun center-crop ile kullanır; görüntü esnetilmez. Model/rating ön yüz overlay'i 5SL6316-7 / C16 / 400 V / 6 kA olarak sabitlendi.
- Siemens 3RV2011 renderer artık CAD line-art yerine kullanıcının yüklediği siemens-3rv2011-user-front-v11920.webp görselini doğrudan kullanır; 45 × 97 mm → 90 × 194 scene-unit frame ve terminal semantiği korunur.
- Siemens 5TL1163-0 için mevcut canonical siemens-5tl1163-0-user-front.webp evidence kaydı tekrar denetlendi: exact product context, orthographic-front, repo binary ve manufacturer terminal geometry mevcut. Runtime fit modu contain-no-distortion; görsel uygunluk gate'i accepted-promoted olarak kapalıdır.
- HCFA drive ve servo motor görsellerindeki preserveAspectRatio=none kaldırıldı. Her iki ürün görseli kendi piksel oranını koruyarak fiziksel frame içinde merkezlenir.
- HCFA drive canlı ekran ve MODE/SHIFT/UP/DOWN/SET hotspotları deformasyonsuz iç image box koordinatlarına yeniden map edilir. Servo motor spin/etiket overlay'leri de gerçek iç image box'a bağlanır.
- Ortak ilke: görsel değişikliğinde yalnız metadata değil runtime renderer, fiziksel frame, pin/terminal geometrisi ve state overlay birlikte doğrulanır. Fiziksel ölçek ortak çalışma uzayı referansı 2 scene-unit/mm ile hesaplanır.
- Regression: tests/user-scale-only-lock-v11920.test.cjs.
- GitHub Actions çalıştırılmadı. Syntax + runtime library metadata + renderer static contract doğrulaması kullanıldı; gerçek Windows UI kabulü ayrı pending kalır.


## 2026-10-08 — Görsel değişikliği zorunlu çalışma prensibi

Durum: **LOCKED WORKING PRINCIPLE**

Bundan sonraki her kullanıcı görsel değiştirme talimatı yalnız metadata değişikliğiyle tamamlanmış sayılmaz. Kapanış için aşağıdakilerin tamamı zorunludur:

- Kullanıcının verdiği gerçek asset repo içinde canonical runtime görsele bağlanır.
- Runtime renderer'ın gerçekten bu asseti kullandığı statik olarak doğrulanır.
- Görsel boyutu ortak çalışma uzayı referansı **2 scene-unit/mm** üzerinden kullanıcının verdiği gerçek fiziksel ölçüye bağlanır.
- Görsel aspect ratio korunur; kullanıcı ayrıca istemedikçe stretch/distortion uygulanmaz.
- pins/materialPins/terminal hotspotları yeni fiziksel frame ile birlikte hizalanır.
- Aktif/pasif state overlayleri yeni görsel koordinatlarına yeniden kalibre edilir.
- Aynı dosya adı daha önce kullanıldıysa browser/file-cache nedeniyle eski görselin kalmasını engellemek için revision/cache-bust uygulanır.
- Kullanıcı ekran görüntüsünde eski görsel görüyorsa yalnız metadata PASS yeterli değildir; gerçek runtime path, renderer önceliği ve cache zinciri ayrıca kapatılır.
- MQ-12 kanıtı runtime asset path + physical frame + terminal bounds + renderer contractı içerir.
- Gerçek Windows UI kabulü çalıştırılmadıysa PASSED denmez; pending olarak tutulur.


## 2026-10-08 — Darbe/Zaman/Flaşör gecikmeli bobinler + 1P cihazlar + 5SL + Röle runtime teslim kapanışı

Durum: **DONE — ACTIONS-FREE TARGETED RUNTIME/ASSET CONTRACT PASS**

- Ajan zinciri: MQ-00 → MQ-03/MQ-02 lider/çapraz görsel-fiziksel audit → MQ-12 targeted runtime kanıtı → MQ-13 repo sürekliliği → MQ-00 DONE.
- Ortak ölçek: **2 scene-unit/mm**.
- `coil-pulse`, `coil-timer`, `coil-flasher`, `coil-delay-off`, `coil-delay-on`: **18 × 70 mm → 36 × 140 scene-unit**, pinler frame içinde.
- `disconnect-1p`: **18 × 70 mm → 36 × 140 scene-unit**, kullanıcı kilidi verified üretici fallback'inin önünde korunuyor.
- Siemens `5SL6116-7` / `mcb-1p`: **18 × 70 mm → 36 × 140 scene-unit**; `physicalScaleSource=workspace-space-v1:user-locked`; `physical-metadata.js` verified 18×90 kaydıyla çakışmada kullanıcı kilidini fail-safe biçimde koruyor.
- Tense FKV-03 / `motor-protection-relay`: **23 × 60 mm → 46 × 120 scene-unit**, tüm terminaller frame içinde.
- Runtime cache kapanışı: `dist/index.html` gerçek `library.js?rev=20261008-user-scale-lock7` yükler; `materials-v113.js?rev=20261008-user-scale-lock12`, `materials-v115.js?rev=20261008-user-scale-lock7`, `materials.js?rev=20261008-user-scale-lock6`, `physical-metadata.js?rev=20261008-user-scale-lock6` ile zincir günceldir. Eski `library.js?rev=20261008-visual-runtime4` yolu aktif değildir.
- Siemens 5SL6116-7 canonical binary `dist/assets/products/siemens-5sl6116-7-user-front-v11920.webp`: canlı decoder kontrolünde açıldı; RIFF/WEBP VP8X+ALPH+VP8 yapısı, **126 × 490 px**, RIFF declared-length ve chunk sınırları tutarlı. Renderer `materials-v113.js` içinde aynı binary'yi `?rev=20261008-5sl6116-11` ile kullanır, `preserveAspectRatio=xMidYMid meet` ve `contain-no-distortion` korunur.
- 5SL runtime calibration metadata'sı canonical binary ile eşitlendi: `sourceCanvasPx=126×490`, `targetFrameMm=18×70`.
- “Röle” (`coil-relay` ve görünür `misc-relay`) ile `coil-relay-dc` aynı canonical `omron-my-relay-v11920.webp` assetine bağlıdır. Binary canlı decoder kontrolünde açıldı; renderer `materials-v115.js` içinde tek Omron runtime yolunu kullanır.
- Regression kilidi `tests/user-scale-only-lock-v11920.test.cjs`: fiziksel frame, user-lock source, pin bounds, cache revisions, Omron ortak asset, 5SL asset path/viewBox, 126×490 metadata ve RIFF/chunk bütünlüğünü doğrular.
- GitHub Actions çalıştırılmadı. Gerçek Windows UI kabulü bu ortamda yürütülmediği için ayrıca PASSED sayılmamıştır; bu listedeki repo/runtime/cache/asset kök nedenleri kod tarafında kapanmıştır.


## 2026-10-08 — HCFA drive terminal okunabilirlik kapanışı

Durum: **DONE — TERMINAL STRUCTURE PRESERVED / READABILITY LAYOUT APPLIED**

- Kullanıcı onaylı hedef görünüş: HCFA drive terminalleri daha seyrek ve okunabilir; sol kolon yazıları terminalin solunda, sağ kolon yazıları terminalin sağında.
- Cihaz görseli, HCFA model kimliği, fiziksel gövde **42 × 165 mm**, terminal ID'leri, elektriksel işlevler ve bağlantı semantiği değiştirilmedi.
- CN1 44 terminal olarak korunur: 22 sol + 22 sağ. X koordinatları **0 / 84** değişmedi; yalnız dikey okunabilirlik aralığı 5.0 → **5.4 scene-unit** olarak hafif açıldı.
- CN1 etiket fontu 6.2 px; sol etiketler `end` anchor ile dışarı sola, sağ etiketler `start` anchor ile dışarı sağa taşındı.
- L1/L2/L3, P/C, U/V/W, PE, CN2/CN3/CN4/CN5 alt terminallerinin terminal noktaları değiştirilmedi; yalnız labelOffset/anchor ile yazılar ilgili kenarın dışına alındı.
- `symbols.js` pin bazlı `labelAnchor` metadata'sını destekleyecek şekilde geriye uyumlu genişletildi; diğer cihazlarda metadata yoksa önceki davranış aynen sürer.
- Cache: `hcfa-library.js?rev=20261008-terminal-readable1` ve `symbols.js?rev=20261008-terminal-readable1`.
- Regression: `tests/hcfa-x2e-v119.test.cjs` terminal sayısı/ID'leri, 22+22 kolon yapısı, yeni aralık, sol/sağ anchor ve cache revizyonlarını kilitler.
- GitHub Actions çalıştırılmadı; değişiklik yalnız HCFA terminal görünüş/readability katmanıdır.


## 2026-10-08 — HCFA servodrive ürün ekranı interaktif simülasyon kapanışı

Durum: **DONE — PRODUCT-PHOTO PANEL INTERACTIVE / ACTIONS-FREE CONTRACT PASS**

- HCFA SV-X2EA040A-A ürün görseli ve terminal yapısı değiştirilmedi.
- Ürün fotoğrafındaki fiziksel panel tuşları interaktif: MODE ekran seviyesini değiştirir, SHIFT monitor seçimini ilerletir, ▲/▼ hız veya aktif pulse-test frekansını değiştirir, SET Servo ON/OFF yapar.
- Ürün görseli üzerinde ek hızlı simülasyon kontrolleri: RST, HOME ve PULSE. Bunlar mevcut `H.action()` state makinesine bağlıdır; ayrı veya sahte simülasyon yolu oluşturulmadı.
- Live display MODE ile durum → gerçek hız → hız talimatı → monitor/pulse görünümünü döndürür; fault/alarm ve enerjisiz durum önceliklidir.
- Pulse test açıldığında başlangıç frekansı 0 ise 1000 Hz atanır; ▲/▼ pulse frekansını 100 Hz adımla değiştirir. Pulse kapalı hız modunda ▲/▼ P03.03 hız talimatını 10 rpm adımla değiştirir.
- Simülasyon çalışırken HCFA panel komutları `snapshot(runtime)` üzerinden uygulanır; protected/runtime kullanımında mevcut simülasyon davranışı bozulmadan panel kontrolü mümkün olur.
- Cache revizyonları: `hcfa-x2e.js?rev=20261008-panel-interactive1` ve `hcfa-ui.js?rev=20261008-panel-interactive1`.
- Regression `tests/hcfa-x2e-v119.test.cjs`: Servo ON/OFF, Reset, Home, Pulse, hız/pulse artır-azalt, fotoğraf hitbox'ları, live display döngüsü ve cache anahtarlarını kilitler.
- GitHub Actions çalıştırılmadı; mevcut HCFA terminal/servo motor/fiziksel ölçek yapısı korunur.


## 2026-10-08 — Siemens 3RV2011-4AA10 canonical görsel + 45×97 mm runtime kapanışı

Durum: **DONE — VALID CANONICAL ASSET / USER-LOCKED PHYSICAL SCALE**

- Termik Manyetik Şalter runtime kimliği korunarak kullanıcı tarafından verilen Siemens SIRIUS 3RV2011-4AA10 tam karşıdan görsel canonical asset olarak kullanıldı.
- Önceki `siemens-3rv2011-user-front-v11920.webp` dosyası truncated idi: gerçek boyut 15.020 bayt, RIFF declared length 35.666 bayt. Bu bozuk binary tamamen değiştirildi.
- Yeni canonical WebP: **180 × 388 px**, exact **45:97** oranı, **18.932 bayt**, RIFF declared length = fiziksel dosya uzunluğu; VP8X/chunk sınırları regression ile kilitli.
- Fiziksel kütüphane ölçüsü mevcut kullanıcı kilidinde korunur: **45 × 97 mm**. Ortak uzay ölçeğinde **2 scene-unit/mm → 90 × 194 scene-unit**.
- Renderer `viewBox=0 0 180 388`, `preserveAspectRatio=xMidYMid meet`; görsel gerilmez/deforme edilmez.
- Üst ana terminaller 1/L1, 3/L2, 5/L3; alt ana terminaller 2/T1, 4/T2, 6/T3 mevcut verified anchor geometrisiyle korunur. Terminal/elektriksel yapı değiştirilmedi.
- Runtime asset revision: `siemens-3rv2011-user-front-v11920.webp?rev=20261008-3rv6`.
- Script cache: `materials-v113.js?rev=20261008-user-scale-lock13`.
- GitHub Actions çalıştırılmadı. Windows gerçek UI kabulü bu ortamda ayrıca PASSED sayılmamıştır; repo/runtime/asset sözleşmesi kapatılmıştır.


## 2026-10-08 — Proje alanı marquee/toplu seçim mouse başlangıç ofseti düzeltmesi

Durum: **DONE — SCROLL-AWARE POINTER→WORLD COORDINATES**

- Kullanıcının videosunda tekil tıklama doğruyken toplu seçim dikdörtgeninin mouse noktasının yukarı-solundan başladığı doğrulandı.
- Kök neden: `canvasPoint()` ve `worldPoint()` client koordinatını world koordinatına çevirirken scroll edilmiş `viewport.scrollLeft` / `scrollTop` değerlerini hesaba katmıyordu.
- `viewport.js` içine merkezi `clientToWorld()` eklendi. Dönüşüm: client − viewport rect + scroll offset → mevcut camera inverse.
- `app.js` içindeki hem `canvasPoint()` hem `worldPoint()` aynı scroll-aware dönüşümü kullanır. Marquee, kablo çizimi, drop/yerleştirme gibi coordinate-based akışlar aynı kaynakla tutarlı hale gelir.
- Tekil DOM hit-test, seçim üyeliği, component geometrisi, zoom/pan algoritması ve simülasyon mantığı değiştirilmedi.
- Regression `tests/selection.test.cjs`: scroll uygulanmış ve scroll uygulanmamış client→world sonuçlarını ayrı doğrular.
- Cache: `viewport.js?rev=20261008-scroll-coordinates1` ve `app.js?rev=20261008-scroll-coordinates1`.
- GitHub Actions çalıştırılmadı.


## 2026-10-08 — Tek Kutuplu Ayırıcı Siemens 5TL11631 canonical görsel kapanışı

Durum: **DONE — USER-SUPPLIED CANONICAL FRONT / SCALE LOCK PRESERVED**

- Kullanıcının yüklediği Siemens 5TL11631 tam karşıdan görsel Tek Kutuplu Ayırıcı için canonical runtime asset olarak bağlandı.
- Görseldeki şeffaf dış boşluklar temizlendi; görünür cihaz geometrisi değiştirilmeden **180 × 861 px** WebP üretildi.
- Fiziksel kullanıcı kilidi değişmedi: **18 × 70 mm → 36 × 140 scene-unit** (`2 scene-unit/mm`).
- Terminal yapısı ve elektriksel davranış değişmedi: üst terminal `1`, alt terminal `2`; mevcut pin/anchor geometrisi korunur.
- Runtime `contain-no-distortion` / `preserveAspectRatio=xMidYMid meet` kullanır.
- Asset yolu aynı canonical path üzerinde: `dist/assets/products/siemens-5tl1163-0-user-front.webp`; runtime rev `?rev=20261008-5tl5`.
- `library.js` user-approved upload kaynağını ve `runtimeVisualCalibration sourceCanvasPx=180×861 / targetFrameMm=18×70` bilgisini taşır.
- Verified üretici fizik metadata ölçüsü değiştirilmedi; yalnız asset provenance/pixel calibration yeni binary ile eşitlendi.
- Regression testi WebP RIFF/chunk bütünlüğü, 180×861 boyut, 18×70 mm user-lock, renderer path/viewBox ve cache zincirini kilitler.
- Cache: `materials-v113.js?rev=20261008-user-scale-lock14`.
- GitHub Actions çalıştırılmadı.


## 2026-10-08 — Öğretici Modu Elektrik Makineleri interaktif laboratuvarları

Durum: **DONE — TRANSFORMATÖR + MOTOR SERBEST DENEY SAYFALARI**

- Öğretici ana sayfasına mevcut ders/kablolama pedagojisini bozmadan `Etkileşimli Deney Laboratuvarları` bölümü eklendi.
- Transformatörler Laboratuvarı: primer/sekonder sarım, step-up/step-down/1:1, giriş gerilimi, frekans, VA, yük, cosφ, verim, regülasyon, nüve kesiti, Bmax, nüve kaybı ve mıknatıslanma akımı değiştirilebilir.
- Trafo sonuçları V2 ideal/yüklü, I1/I2, güç, kayıplar, regülasyon, Φmax ve B değerlerini canlı gösterir; B>Bmax doyum uyarısı verir. Simülasyonda anlık v1/v2 ve akı göstergesi hareket eder.
- Hazır trafo deneyleri: 230→24 V step-down, 230→400 V step-up, 1:1 izolasyon ve frekans düşürerek doyum gözlemi.
- Motorlar Laboratuvarı: 3~ asenkron, 3~ senkron ve DC motor; gerilim, anma gerilimi, frekans, kutup, yıldız/üçgen, cosφ, kayma, güç, yük, verim, yön, alan akısı ve anma devri değiştirilebilir.
- Motor sonuçları n_s, mil devri, kayma, akım, tork, giriş/çıkış gücü, faz gerilimi ve V/f değerlerini canlı gösterir; aşırı yük, yüksek/düşük V/f ve alan zayıflatma uyarıları vardır.
- Motor görseli simülasyonda hesaplanan hıza/yöne göre döner. Hazır deneyler: nominal 50 Hz/4 kutup, 25 Hz sabit V/f, %120 yük, yön tersleme, senkron ve DC motor.
- Her iki sayfa sanal eğitim uyarısı taşır; mevcut proje editörü, tutorial lesson verileri ve kablo yeniden-kurma motoru değiştirilmedi.
- Runtime `dist/tutorial-labs.js`; cache `tutorial-labs.js?rev=20261008-electric-machines-labs1` ve `tutorial.css?rev=20261008-electric-machines-labs1`.
- Regression `tests/tutorial-labs-v11920.test.cjs` trafo ve motor hesaplarını ve dashboard entegrasyonunu kilitler.
- GitHub Actions çalıştırılmadı.


## 2026-10-08 — Marquee seçim kutusu screen-space overlay düzeltmesi #2

Durum: **DONE — VISUAL MARQUEE DECOUPLED FROM CAMERA TRANSFORM**

- Kullanıcı ilk `scrollLeft/scrollTop` düzeltmesinden sonra kaymanın devam ettiğini bildirdi.
- Yeniden denetimde aktif CSS'in `.viewport{overflow:hidden}` kullandığı doğrulandı; dolayısıyla önceki scroll odaklı kök neden bu runtime için belirleyici değildi.
- Marquee görselinin transformed SVG `#workspace` içine eklenmesi kaldırıldı.
- Seçim kutusu artık `#viewport` üzerinde HTML overlay olarak doğrudan client/screen koordinatında çizilir. Başlangıç noktası `clientX/Y - viewport.getBoundingClientRect().left/top` ile fiziksel mouse pikseline bağlanır.
- Hangi malzemelerin seçileceği değişmedi: membership hesabı `worldPoint()` + `Selection.inBox()` ile scene/world koordinatında devam eder.
- Kamera pan/zoom, component drag, kablo çizimi ve simülasyon kodları değiştirilmedi.
- CSS `.selection-box` ekran overlay'i için `position:absolute`, `pointer-events:none`, dashed border ve z-index ile güncellendi.
- Cache: `styles.css?rev=20261008-marquee-screen-overlay1`, `app.js?rev=20261008-marquee-screen-overlay1`.
- Regression `tests/marquee-screen-overlay-v11920.test.cjs`: visual box'un workspace yerine viewport'a eklendiğini ve selection membership'in world-space kaldığını kilitler.
- GitHub Actions çalıştırılmadı.


## 2026-10-08 — Öğretici · Doğru akım ve kullanım alanları zengin interaktif ders sayfası

Durum: **DONE — REAL APP PAGE / FREE-PROBE SIMULATION LESSON**

- `Doğru akım ve kullanım alanları` generic konu panosundan çıkarıldı; özel `dcUsageProject()` ile gerçek çalışma alanına dönüştürüldü.
- Merkez devre: `1 · DC kaynak · 24 V`, `2 · Direnç yük · 100 Ω`, `3 · UNI-T UT33D+`, `4 · Kırmızı prob`, `5 · Siyah prob`.
- Kaynak ve 100 Ω direnç kapalı DC yük devresi oluşturur; teorik yük akımı Ohm Kanunuyla `24/100 = 0,24 A`.
- UNI-T başlangıçta DCV 200 V kademesinde. Kırmızı prob `VΩmA`, siyah prob `COM` girişine kabloyla bağlıdır; prob uçlarında başlangıç `probeTarget` kilidi yoktur.
- Mevcut runtime `beginProbeDrag()` kullanılır: öğrenci probu terminale, junction'a veya normal kablo üzerine serbestçe sürükleyip değdirebilir; ölçüm sonucu temas noktalarına göre değişir.
- Ders türü `explore`; generic `Devreyi yeniden kur` akışı bu sayfada kullanılmaz. Doğrudan `Simülasyonu çalıştır`, `Sonraki uygulama`, `Konu listesine dön` eylemleri sunulur.
- Sağ konu paneli istenen formatta özelleştirildi: öğrenme hedefleri, devre elemanları, 4 adımlı çalışma sırası, serbest prob bilgi kutusu, Ohm Kanunu kartı, beklenen gözlem, akım ölçümünün seri bağlantı uyarısı, DC kullanım alanları, öğrenci görevi ve açıklamalı soru.
- Ders paneli için özel responsive CSS eklendi; diğer öğretici derslerinin coach düzeni değiştirilmedi.
- Cache: `tutorial-pedagogy.js?v=1.19.20-pedagogy16`, `tutorial-mode.js?v=1.19.20-dc-usage-rich1`, `tutorial.css?rev=20261008-dc-usage-rich1`, `tutorial-bootstrap.js?rev=20261008-dc-usage-rich1`.
- Regression: `tests/tutorial-dc-usage-v11920.test.cjs`.
- GitHub Actions çalıştırılmadı.


### DC usage final acceptance lock düzeltmesi

- Canlı curriculum reconstruction ilk committen sonra özel dersin `explicitTitleProject()` içindeki genel “akım” eşleştiricisi tarafından generic panoya çevrildiğini yakaladı.
- Exact-title guard `explicitTitleProject()` başlangıcına taşındı.
- `normalizeMeters()` ve tüm genel Faz 6/QA işlemlerinden sonra final acceptance lock eklendi.
- Final lock özel `dcUsageProject()` nesnesini yeniden kurar ve `kind=explore`, `phase=explore`, `steps=[]`, 5 komponent, 24 V/100 Ω, DCV 200 V ve iki serbest prob durumunu kesinleştirir.
- `L.pedagogy.version` → `v1.19.20-pedagogy16`.
- Regression artık tutorial-lessons + expanded-lessons + pedagogy zincirini VM içinde gerçek runtime sırasıyla çalıştırıp final ders nesnesini doğrular.


## 2026-10-08 — Öğretici · DC kaynakları ve bağlantıları zengin ders yeniden tasarımı

Durum: **DONE — PREDICT → OBSERVE → MEASURE → REBUILD PEDAGOGY**

- `DC kaynakları ve bağlantıları` dersi generic öğretici metinden çıkarıldı; title-specific rich coach eklendi.
- Ders devresi: 24 VDC kaynak, 1 kΩ dirençli yük, UNI-T UT33D+ DCV 200 V, kırmızı ve siyah fiziksel prob.
- Hesap: I=24/1000=0,024 A=24 mA; P=24×0,024=0,576 W.
- Panel akışı: ders hedefi → enerji yolu/polarite → önce tahmin et → gerçek elemanlar → gerilim ölçüm mini deneyleri → Ohm/güç karşılaştırması → beklenen gözlemler → sık hatalar → gerçek kullanım alanları → öğrenci görevi → guided rebuild.
- Mini deney düğmeleri: kaynak uçlarını ölç, yük uçlarını ölç, probları tersle, probları serbest bırak. ProbeTarget'lar runtime'da değiştirilir; öğrenci daha sonra probu terminal/junction/kablo üzerine elle sürükleyebilir.
- Yeniden-kurma pedagojisi düzeltildi: fiziksel prob kabloları guided wiring adımı değildir ve rebuild sırasında korunur; öğrenci yalnız +24 V → R1 → 0 V güç yolunu kurar.
- 0 V ile PE/toprak kavramlarının otomatik olarak aynı olmadığı açıkça öğretilir; gerilim ölçümünün paralel, akım ölçümünün seri olduğu hata kartında vurgulanır.
- Cache: pedagogy17, mode `dc-source-rich2`, tutorial CSS/bootstrap `dc-source-rich2`.
- Regression: `tests/tutorial-dc-source-rich-v11920.test.cjs` runtime curriculum zincirini VM içinde baştan çalıştırarak exact lesson/project/step/probe durumunu doğrular.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Öğretici · Pillerin seri bağlanması tam ders yeniden tasarımı

Durum: **DONE — REAL BATTERY CELLS / SERIES VOLTAGE / GUIDED SIMULATION**

- Anlamsız placeholder kutu düzeni kaldırıldı; `Pillerin seri bağlanması` dersi iki işlevsel 1,5 V eğitim hücresi, 100 Ω yük, UNI-T UT33D+ ve iki fiziksel prob içeren özel çalışma alanına dönüştürüldü.
- `tutorial-battery` artık `visualOnly/diagramOnly` değildir. `kind=battery`, gerçek `+` / `−` terminalleri ve 1,5 V hücre davranışı taşır.
- Ayrı görsel dosyası üretilmedi. Pil görünümü mevcut SVG/material renderer içinde önden görülen silindirik AA hücre olarak çizilir; kutup işaretleri ve 1,5 V etiketi sahnede görünür.
- Seri paket modeli fiziksel seri köprüyü denetler. BT1/− → BT2/+ bağlantısı mevcut olduğunda iki 1,5 V kaynak aynı paket domaininde 3,0 V oluşturur.
- Yük yolu: BT1/+ → R1 · 100 Ω → BT2/−. İdeal sonuç: 3,0 V / 100 Ω = 0,03 A = 30 mA.
- UNI-T DCV 20 V kademesinde Pil 1, Pil 2 ve toplam paket için hazır prob deneyleri vardır; problar serbest bırakılıp terminal/junction/kablo üzerinde elle kullanılabilir.
- Sağ konu paneli: seri bağlantı görselleştirmesi, Vtoplam=V1+V2, aynı seri akım, Ah kapasitesi açıklaması, 4 adımlı bağlantı sırası, ölçüm mini deneyleri, beklenen gözlemler, kritik bağlantı mantığı, kullanım bağlamları, öğrenci görevi ve konu kontrolü.
- Guided rebuild üç gerçek güç bağlantısını öğretir; fiziksel prob kabloları rebuild sırasında korunur.
- Cache zinciri: `tutorial-pedagogy.js?v=1.19.20-pedagogy18`, `tutorial-mode.js?v=1.19.20-battery-series-rich1`, `tutorial.css?rev=20261008-battery-series-rich1`, `tutorial-components.js?rev=20261008-battery-series-rich1`, `materials.js?rev=20261008-battery-series-rich1`, `simulation.js?rev=20261008-battery-series-rich1`.
- Regression: `tests/tutorial-battery-series-v11920.test.cjs`; mevcut DC usage/source cache testleri yeni zincire güncellendi.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Öğretici · Pil ve akü tipleri karşılaştırmalı sanal laboratuvar

Durum: **DONE — SUPPLEMENTAL PAGE / 10-LESSON DC LOCK PRESERVED**

- Kullanıcının gönderdiği sıkışık ve generic `Pil ve akü tipleri` sayfa düzeni yeniden tasarlandı. Ayrı bir görsel üretilmedi; tüm kaynak görselleri uygulamanın mevcut SVG/material renderer'ında önden ve okunabilir biçimde çizilir.
- Resmî DC konu listesi 10 ders olarak korunur. Yeni sayfa `dc-battery-types-rich` kimliğiyle `Pillerin seri bağlanması` dersinin ardından açılan tamamlayıcı sayfadır; `L.lessons` sayısını artırmaz ve sonraki adımda `Pillerin paralel bağlanması` dersine geçer.
- Dört işlevsel kaynak eklendi: 1,5 V alkalin AA, 1,2 V NiMH AA, 3,7 V Li-ion 18650 ve 12 V kurşun-asit akü. Her biri `kind=battery` olduğundan yalnız dekor değil, simülasyonda DC kaynak olarak davranır.
- Sayfa çalışma alanında ayrıca UNI-T UT33D+ DCV 20 V, serbest kırmızı/siyah prob ve 1 kΩ sanal test yükü bulunur.
- Öğrenci tek tıkla dört kaynağın nominal gerilimini ölçebilir veya probları serbest bırakabilir.
- Sanal yük düğmeleri seçilen kaynağı 1 kΩ yüke bağlar; ideal akımlar Alkalin 1,5 mA, NiMH 1,2 mA, Li-ion 3,7 mA ve 12 V akü 12 mA olarak Ohm Kanunu ile karşılaştırılır.
- İçerik; birincil/şarj edilebilir ayrımı, nominal gerilim, Ah kapasite, Wh enerji, Wh≈V×Ah ilişkisi, tipik kullanım alanları, kimya farkları ve temel güvenlik/seçim mantığını ayrı ve geniş bloklarda öğretir.
- Sayfa karmaşıklaştırılmadan geniş karşılaştırma kartları, ölçüm paneli, sanal yük deneyi, kullanım senaryosu matrisi, güvenlik kutusu, öğrenci görevi ve konu kontrolü ile zenginleştirildi.
- Gerçek hücrelerle tehlikeli deney yönlendirmesi yapılmaz; kısa devre ve uygun olmayan şarj işlemlerinden kaçınılması açıkça belirtilir, yük deneyi sanal laboratuvarla sınırlıdır.
- Cache zinciri: `tutorial-pedagogy.js?v=1.19.20-pedagogy19`, `tutorial-mode.js?v=1.19.20-battery-types-rich1`, `tutorial.css?rev=20261008-battery-types-rich1`, `tutorial-components.js?rev=20261008-battery-types-rich1`, `materials.js?rev=20261008-battery-types-rich1`.
- Regression: `tests/tutorial-battery-types-v11920.test.cjs`; mevcut DC usage/source/series testlerinin cache beklentileri yeni zincire güncellendi.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Öğretici · Pillerin paralel bağlanması tam ders yeniden tasarımı

Durum: **DONE — REAL PARALLEL RAILS / VOLTAGE MEASUREMENT / GUIDED REBUILD**

- Generic konu kontrolü/placeholder düzeni kaldırıldı; `Pillerin paralel bağlanması` dersi iki işlevsel 1,5 V pil, 100 Ω yük, UNI-T UT33D+ ve iki fiziksel prob içeren gerçek öğretici çalışma alanına dönüştürüldü.
- Paralel bağlantı fiziksel olarak `BT1/+ → BT2/+` ortak pozitif ray ve `BT1/− → BT2/−` ortak negatif ray ile kurulur. Yük bu iki ortak ray arasına bağlanır.
- İdeal paket gerilimi seri bağlantıdaki gibi toplanmaz; yaklaşık **1,5 V** kalır. 100 Ω yükte teorik toplam akım `1,5/100 = 0,015 A = 15 mA`.
- Eş ideal hücrelerde 15 mA yükün yaklaşık 7,5 mA + 7,5 mA paylaşılabileceği kavramsal olarak açıklanır; gerçek paylaşımın iç direnç, sıcaklık ve hücre durumuna bağlı olduğu özellikle belirtilir.
- UNI-T DCV 20 V kademesinde Pil 1, Pil 2 ve çapraz ortak ray ölçümü için hazır prob seçimleri vardır; problar istenirse tekrar serbest bırakılır.
- Sağ konu paneli yeniden tasarlandı: paralel bağlantı görselleştirmesi, ortak ray mantığı, `Vpaket≈1,5 V`, `I=V/R`, seri/paralel karşılaştırması, kapasite/Ah mantığı, ideal-gerçek ayrımı, ölçüm deneyi, öğrenci görevi ve konu kontrolü.
- Guided rebuild dört gerçek güç bağlantısını sırasıyla öğretir: + ray, − ray, yük besleme ve yük dönüşü. Probe kabloları rebuild sırasında korunur.
- Sayfa gerçek hücrelerle deney yaptırmaz; uygulama içindeki sanal simülasyonla sınırlandırılır ve farklı gerilim/kimya/doluluk durumundaki hücrelerin paralel paket için uygun kabul edilmemesi açıklanır.
- Cache zinciri: `tutorial-pedagogy.js?v=1.19.20-pedagogy20`, `tutorial-mode.js?v=1.19.20-battery-parallel-rich1`, `tutorial.css?rev=20261008-battery-parallel-rich1`, `tutorial-bootstrap.js?rev=20261008-battery-parallel-rich1`.
- Regression: `tests/tutorial-battery-parallel-v11920.test.cjs`; mevcut DC usage/source/series/types testlerinin cache beklentileri yeni zincire güncellendi.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Öğretici Modu ortak referans formatı

Durum: **DONE — REFERENCE FORMAT STANDARDIZED**

- Kullanıcının sağladığı zengin öğretici ekran, bundan sonraki Öğretici Modu sayfa düzeltmeleri için ortak görsel/pedagojik referans kabul edildi.
- Standardın ayrıntıları `docs/TUTORIAL_REFERENCE_FORMAT_V1.19.20.md` içinde tanımlandı.
- İlk uygulama kümesi: `Doğru akım ve kullanım alanları`, `DC kaynakları ve bağlantıları`, `Pillerin seri bağlanması`, `Pil ve akü tipleri`, `Pillerin paralel bağlanması`.
- Bu beş sayfada ana devre alanına numaralı açıklama kartları, yan kritik-eleman kartları, kısa akış etiketi ve dört bölümlü alt öğrenme şeridi eklendi.
- Alt şerit standardı: **Soru → Kısa bilgi / bağıntı → Beklenen gözlem → Öğrenci görevi**.
- Sağdaki ders penceresi geniş ve sabit konu anlatımı paneline dönüştürülür; büyük ekranlarda özellik paneli gizlenerek çalışma alanı + konu anlatımı ikilisi önceliklendirilir.
- Sol 3D Malzeme Kütüphanesi korunur.
- Harici/generatif görsel üretilmez; mevcut gerçek kütüphane malzemeleri, SVG/material renderer ve HTML/CSS kullanılır.
- Referans overlay yalnız bu zengin format derslerinde etkinleşir; dar ekranlarda ana ders/simülasyon kullanılabilir kalacak biçimde overlay gizlenir.
- Genel interaktif soru kartı `data-reference-answer` üzerinden ders geri bildirimine bağlandı.
- Cache zinciri: `tutorial.css?rev=20261008-reference-format1`, `tutorial-bootstrap.js?rev=20261008-reference-format1`, `tutorial-mode.js?v=1.19.20-reference-format1`.
- Regression: `tests/tutorial-reference-format-v11920.test.cjs`; önceki DC usage/source/battery testlerinin cache beklentileri yeni zincire güncellendi.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Kablo çiziminde mouse/kablo güzergâhı hizalama düzeltmesi

Durum: **DONE — POINTER TIP / DRAFT WIRE ALIGNMENT**

- Kullanıcı videosunda kablo çizim önizlemesinin mouse imlecinin ucundan kaydığı doğrulandı.
- Eski `canvasPoint/worldPoint` hesabı viewport + camera + scroll değerlerini elle ters çeviriyordu. Yeni Öğretici Modu yerleşiminde, CSS transform/layout değişiklikleri ve tarayıcı ölçek koşullarında bu yöntem ekranda görülen gerçek SVG koordinatıyla ayrışabiliyordu.
- Yeni ortak `pointerWorldPoint(e)` dönüşümü önce canlı SVG `getScreenCTM().inverse()` matrisini kullanır. Böylece gerçek ekran pikselindeki pointer ucu doğrudan SVG dünya koordinatına çevrilir.
- `canvasPoint(e)` ve `worldPoint(e)` aynı dönüşümü kullanır; kablo draft önizlemesi, güzergâh noktaları, kablo segment sürükleme ve diğer pointer tabanlı etkileşimler aynı koordinat kaynağında kalır.
- Eski `Viewport.clientToWorld` dönüşümü yalnız `getScreenCTM` kullanılamazsa güvenli fallback olarak korunmuştur.
- Kablo önizleme zinciri değişmedi: `pointermove → canvasPoint → draftMouse → routePoints(...draftMouse...)`. Bu nedenle yalnız koordinat kayması düzeltilmiş, mevcut routing/guided wiring davranışı korunmuştur.
- Cache: `app.js?rev=20261008-pointer-ctm1`.
- Regression: `tests/pointer-wire-alignment-v11920.test.cjs`.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Tüm dersler / malzemeler simülasyon kapsam auditi

Durum: **DONE — PLC GLOBAL BLOCK REMOVED / LIVE PLC RUNTIME / MATERIAL COVERAGE LOCKED**

- Runtime kütüphanesi ve Öğretici Modu dersleri çapraz tarandı: 902 kütüphane kaydı, 724 bağlanabilir malzeme ve 624 wiring dersi audit kapsamına alındı.
- Kritik hata: PLC veya visual-only elemanı bulunan proje hem UI hem solver seviyesinde global olarak bloke ediliyordu. Bu engel kaldırıldı.
- `dist/plc-runtime.js` eklendi: DC/AC PLC besleme algılama, gerçek DI okuma, PNP/NPN/röle DO iletimi, START/STOP latch ve timed-stop eğitim davranışı.
- S7-1200 motor zinciri temsilî runtime doğrulamasında START → DQ → kontaktör bobini → ana kontak → motor akışı çalıştı; START bırakılınca latch korundu, STOP ile çıkış/bobin/motor kapandı.
- PLC ön yüz DI/DQ terminallerine canlı durum göstergesi eklendi.
- NTC, PTC, PT100, 2/4 telli PT100 ve termokupl mevcut canlı solver modelleri doğrulandı.
- HCFA Pulse/Direction kaynağı ve Modbus RTU masterı simülasyonda fiziksel bağlantı durumunu üretir; görsel üzerinde DRIVE LINK / LINK OK durumu gösterilir.
- Elektriksel olmayan ok/etki/radyasyon/çapraz referans türü çizim yardımcıları fiziksel simülasyon malzemelerinden ayrıldı; bu yardımcıların varlığı artık solver'ı bloke etmez.
- Yeni regression: `tests/simulation-material-audit-v11920.test.cjs`.
- Ayrıntılı rapor: `docs/SIMULATION_MATERIAL_AUDIT_V1.19.20.md`.
- Cache zinciri: `plc-runtime.js?rev=20261008-sim-audit1`, `simulation.js?rev=20261008-sim-audit1`, `plc-front.js?rev=20261008-sim-audit1`, `hcfa-ui.js?rev=20261008-sim-audit1`, `app.js?rev=20261008-sim-audit1`.
- Önceki mouse/SVG CTM kablo hizalama düzeltmesi `app.js` içinde korunmuştur.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Öğretici · Ohm Kanunu deneyi + ayarlanabilir DC kaynak standardı

Durum: **DONE — ADJUSTABLE BENCH SUPPLY / OHM LAB / GLOBAL TUTORIAL SOURCE UPGRADE**

- Kullanıcı kararı doğrultusunda öğretici derslerde generic `supply-dc-plus` sembolü kaldırıldı; mevcut ders gerilimini koruyan `arduino-bench-supply` 0–30 V ayarlanabilir masa güç kaynağına yükseltildi.
- Runtime ders ağacında artık `supply-dc-plus` kullanan öğretici proje kalmıyor. 258 adet ayarlanabilir DC kaynak kullanımı doğrulandı.
- `Ohm Kanunu deneyi` özel kabul kilidiyle yeniden kuruldu: G1 ayarlanabilir DC kaynak, A1 UNI-T akım ölçümü, R1 değiştirilebilir direnç ve V1 UNI-T paralel gerilim ölçümü.
- Başlangıç: 24 V / 120 Ω → ideal 0,20 A. Kaynak deney seçenekleri 6/12/18/24 V; direnç seçenekleri 120/240/470 Ω.
- İki UNI-T için fiziksel kırmızı/siyah problar oluşturuldu. A1 probları seri akım yoluna, V1 probları R1 uçlarına paralel temas eder.
- Sağ konu paneli Ohm Kanunu için özgün zengin laboratuvar tasarımına dönüştürüldü: canlı V/R/I/P özeti, kaynak ayarları, direnç ayarları, üç temel Ohm bağıntısı, ölçüm bağlantı mantığı, beklenen gözlem ve öğrenci görevi.
- Ortak referans sahnesine Ohm Kanunu deneyi eklendi; üst kartlar ayarlı kaynak / direnç / ampermetreyi, yan kartlar akım probu ve voltmetreyi açıklar.
- 10 derslik DC kilidi korunmuştur; `dc-circuits-src-06` aynı başlık ve konumda kalır.
- Cache zinciri: `tutorial-pedagogy.js?v=1.19.20-pedagogy21`, `tutorial-mode.js?v=1.19.20-ohm-rich1`, `tutorial.css?rev=20261008-ohm-rich1`, `tutorial-bootstrap.js?rev=20261008-ohm-rich1`.
- Regression: `tests/tutorial-ohm-rich-v11920.test.cjs`; mevcut DC/battery/reference testlerinin cache beklentileri güncellendi.
- GitHub Actions çalıştırılmadı.


## Öğretici Modu — rich-reference-v1 sabit tasarım kilidi
Durum: **LOCKED / USER DECISION / ACTIVE**

2026-10-08 kullanıcı kararıyla `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md` tüm yeni/yeniden tasarlanan Öğretici Modu ders sayfaları için zorunlu kabul standardıdır.

Zorunlu görünür bilgi: **devrenin amacı + eleman görevleri + ölçüm yöntemi + bağlantı nedeni + beklenen sonuç**. Sayfa zengin fakat sıkışık olmayacak; boş/dağınık generic görünüm kabul edilmeyecek. Ayarlanabilir güç kaynağı görseli ortak öğretici görsel dilinin parçasıdır; DC derslerinde işlevsel kaynak, AC/üç faz/pil gibi farklı kaynak fiziğine sahip derslerde ise elektriksel gerçeği bozmayan ayrıştırılmış referans kullanım kuralı geçerlidir.

İlk açık kabul referansı: **Temel Elektrik 7 · Seri Devre Analizi**. Bu ders `seriesAnalysisRich=true`, `designStandard='rich-reference-v1'` metadata'sı, özel seri-devre proje üreticisi ve zengin referans paneli ile genel şablona geri düşmeye karşı kilitlenmiştir.

## 2026-10-08 — Öğretici UI kararı: yüzer konu anlatımı + aç/kapa sağ panel + Temel Elektrik 8

Durum: **DONE / LOCKED USER DECISION / SUPERSEDES FIXED RIGHT-COACH RULE**

- Önceki tarihsel kayıtta geçen “sağdaki ders penceresi geniş ve sabit konu anlatımı paneline dönüştürülür; özellik paneli gizlenir” kararı **superseded** kabul edilir.
- Güncel tek kabul gerçeği `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md` içindeki `rich-reference-v1` standardıdır.
- `Konu Anlatımı` artık bağımsız yüzer penceredir: sürüklenebilir, native yeniden boyutlandırılabilir, küçültülüp geri büyütülebilir, kapatılıp sağ panelden yeniden açılabilir.
- Konum, genişlik, yükseklik, küçültülmüş durum ve açık/kapalı tercihi `localStorage` tabanlı UI state ile korunur.
- Sağ `Özellikler` panelinin mevcut X kapatma / `Özellikler` geri-açma altyapısı korunmuş ve `rich-reference` CSS’in paneli zorla gizleyen kuralı kaldırılmıştır.
- Sağ panelde Öğretici Modu aktifken `Konu anlatımını aç/kapat` kontrolü görünür olur; konu anlatımı ve özellik paneli birbirinden bağımsızdır.
- `Temel Elektrik 8 · Paralel Devre Analizi` generic `dcNetwork(...,'parallel')` sunumundan ayrıldı ve özel `parallelAnalysisRich=true`, `designStandard='rich-reference-v1'` kabul kilidine alındı.
- Devre kabul değerleri: G1=24 V, R1=100 Ω, R2=220 Ω, `Req=68,75 Ω`, `I1=240 mA`, `I2≈109 mA`, `Itoplam≈349 mA`, `VR1=VR2≈24 V`.
- A1 toplam akımı dallanma öncesinde DCA 10 A / 10A girişiyle ölçer; 349 mA toplam akım 200 mA kademesini aşar.
- V1 DCV 200 V kademesinde R1, R2 veya kaynak uçlarına taşınabilir; üç ölçümün de yaklaşık 24 V olması beklenir.
- GitHub Actions çalıştırılmayacaktır; doğrulama statik/sözdizimi/regresyon sözleşmesi üzerinden yapılır.

## 2026-10-08 — Temel Elektrik 9 · Karışık Devre Analizi rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / BASIC ELECTRICITY 9**

- Eski `dcNetwork(...,'mixed')` generic sayfası yerine özel `dcMixedAnalysisProject()` kullanılır.
- Devre topolojisi `R1 + (R2 || R3)` olarak görsel ve pedagojik olarak açık hale getirildi.
- G1 ayarlanabilir 24 VDC kaynak; A1 DCA 200 mA toplam akım ölçümü; R1=100 Ω seri; R2=220 Ω ve R3=330 Ω paralel kollardır.
- Eski sayfadaki ikinci ayrı voltmetre kaldırıldı; tek V1 voltmetre R1 gerilimi ile paralel grup gerilimi arasında seçilebilir ölçüm yapar. Böylece devre alanındaki büyük ölçü aleti/prob kalabalığı azaltılır.
- Kabul değerleri: `R2||R3=132 Ω`, `Rtoplam=232 Ω`, `Itoplam≈103,45 mA`, `VR1≈10,34 V`, `Vpar≈13,66 V`, `I2≈62,07 mA`, `I3≈41,38 mA`.
- Pedagojik çözüm sırası: paraleli sadeleştir → seri toplam → toplam akım → gerilim paylaşımı → kol akımları → KCL/KVL kontrolü.
- Kontrol ilişkileri: `I2+I3≈Itoplam` ve `VR1+Vpar≈24 V`.
- `mixedAnalysisRich=true` ve `designStandard='rich-reference-v1'` acceptance metadata ile generic şablona geri dönüş engellenir.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standartları aynen korunur.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Temel Elektrik 10 · Kirchhoff kanunlarıyla devre kontrolü kapanışı

Durum: **DONE / LOCKED / BASIC ELECTRICITY 10**

- Eski Kirchhoff sayfasındaki çoklu A0/A2/A3/V0/V1/V2 multimetre düzeni kaldırılarak özel `dcKirchhoffControlProject()` kullanıldı.
- Yeni düzen yalnız iki UNI-T ölçü aleti kullanır: A1 seçilebilir akım ölçeri ve V1 seçilebilir gerilim ölçeri.
- A1 ölçüm seçenekleri: toplam akım ≈103,45 mA, R2 kolu ≈62,07 mA, R3 kolu ≈41,38 mA.
- V1 ölçüm seçenekleri: DCV 200 V kademesinde R1 ≈10,34 V, paralel bölüm ≈13,66 V, kaynak ≈24 V.
- A1 akım konumu değiştirildiğinde devrenin gerçek seri ölçüm yolu yeniden oluşturulur; seçilmeyen kolların doğrudan iletim yolu korunur.
- V1 fiziksel prob hedefleri seçilen ölçüm bölümünün uçlarına taşınır.
- KCL kontrolü: `103,45 ≈ 62,07 + 41,38 mA`.
- KVL kontrolü: `24 ≈ 10,34 + 13,66 V`.
- `kirchhoffControlRich=true`, `designStandard='rich-reference-v1'` ve `physicalProbes=true` ile kabul kilidi eklendi.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- GitHub Actions çalıştırılmadı.

## 2026-10-08 — Voltmetre ile gerilim ölçümü rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / VOLTAGE MEASUREMENT**

- Eski generic `dcMeasurementProject(...,'voltage')` sayfası yerine özel `dcVoltageMeasurementRichProject()` kullanılır.
- G1 ayarlanabilir 24 VDC masa kaynağı, R1=1 kΩ yük ve gerçek UNI-T UT33D+ kullanılır.
- UNI-T seçici `DCV 200 V` kademesindedir; 24 V kaynak için DCV 20 V kullanımı engellenir.
- Fiziksel kırmızı `VΩmA` ve siyah `COM` problar korunur.
- Dört interaktif prob ölçümü: R1≈+24 V, kaynak≈+24 V, aynı düğüm≈0 V, ters polarite≈−24 V.
- `voltageMeasurementRich=true`, `designStandard='rich-reference-v1'` ve `physicalProbes=true` acceptance metadata eklendi.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- GitHub Actions çalıştırılmadı.

## 2026-10-09 — Ampermetre ile akım ölçümü rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / CURRENT MEASUREMENT**

- Eski generic `dcMeasurementProject(...,'current')` sayfası yerine özel `dcCurrentMeasurementRichProject()` kullanılır.
- G1 ayarlanabilir 24 VDC masa kaynağı, R1=1 kΩ yük ve gerçek UNI-T UT33D+ kullanılır.
- UNI-T seçici `DCA 200 mA` kademesindedir; 24 mA beklenen akım için DCA 20 mA kullanımı uygun kabul edilmez.
- Fiziksel kırmızı `VΩmA` ve siyah `COM` problar korunur.
- Üç interaktif ölçüm: yük öncesi≈+24 mA, yük sonrası≈+24 mA, ters prob yönü≈−24 mA.
- Ölçüm konumu değiştirildiğinde gerçek seri akım yolu otomatik yeniden kurulur; ampermetre paralel ölçüm yolu oluşturmaz.
- `currentMeasurementRich=true`, `designStandard='rich-reference-v1'` ve `physicalProbes=true` acceptance metadata eklendi.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- GitHub Actions çalıştırılmadı.

## 2026-10-09 — Multimetre ile direnç ölçümü rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / RESISTANCE MEASUREMENT**

- Eski generic `board(...)` direnç ölçüm sayfası yerine özel `resistanceMeasurementRichProject()` kullanılır.
- Ayarlanabilir güç kaynağı görsel standardı korunur fakat G1 `OFF / 0,0 V` ve R1’den tamamen elektriksel olarak ayrıdır.
- R1=1 kΩ, M1=UNI-T UT33D+ ve seçici `Ω 2 kΩ` kademesindedir.
- Fiziksel kırmızı `VΩmA` ve siyah `COM` problar kullanılır; fazladan bağımsız prob kartları kaldırılır.
- Üç interaktif ölçüm: R1≈1,000 kΩ, prob kısa devre≈0 Ω, açık prob=OL.
- Enerjili devrede Ω ölçümü kabul edilmez; uygulamanın multimetre motorundaki mevcut güvenlik uyarısı ile pedagojik içerik aynı kurala bağlanır.
- `resistanceMeasurementRich=true`, `designStandard='rich-reference-v1'`, `physicalProbes=true`, `sourceOff=true` acceptance metadata eklendi.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- GitHub Actions çalıştırılmadı.

## 2026-10-09 — Pens ampermetre ile akım ölçümü rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / CLAMP CURRENT MEASUREMENT**

- Eski generic pens/ampermetre sayfası yerine özel `clampCurrentMeasurementRichProject()` kullanılır.
- G0 ayarlanabilir DC güç kaynağı ortak ders görseli olarak OFF/devreden ayrılmış tutulur; ölçüm devresinin kaynağı değildir.
- G1 sanal 230 VAC eğitim kaynağı ve R1=230 Ω yük ile yaklaşık 1 A RMS simülasyon devresi kurulur.
- P1 gerçek `unit-ut200a`, seçici `ACA 2 A` (`meterPosition:1`) kullanır.
- Pens başlangıçta faz iletkenini `clampedWireId` ile kavrar; faz / nötr / boşta presetleri gerçek clamp hedefini değiştirir.
- Devre kesilmez ve UT200A seri eleman gibi bağlanmaz.
- UT200A'nın mevcut simülasyon motorundaki AC-only davranışı korunur; DC iletkende pens sayısal akımı üretilmez.
- Sayfa simülasyon-only güvenlik uyarısı içerir; gerçek şebeke üzerinde uygulama talimatı değildir.
- `clampCurrentMeasurementRich=true`, `designStandard='rich-reference-v1'`, `acOnly=true` acceptance metadata eklendi.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- GitHub Actions çalıştırılmadı.

## 2026-10-09 — Frekansmetre ile frekans ölçümü UT61E+ rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / FREQUENCY MEASUREMENT**

- UT33D+ üzerinde gerçek üründe bulunmayan Hz fonksiyonu oluşturulmadı.
- Öğretici Modu için ayrı `unit-ut61e-plus` işlevsel multimetre bileşeni eklendi; cihaz UT61E+ kimliği, VΩHz/COM girişleri ve ayrı ön yüz ile gösterilir.
- Multimetre motoruna model-bazlı `Hz` ölçüm modu eklendi; UT33D+ range tablosu değiştirilmedi.
- UT61E+ Hz ölçümü `arduino-signal-generator` düşük gerilimli sanal kaynağının `generatorFrequency` değerini gerçek prob hedeflerinden okur.
- Ders özel `frequencyMeasurementRichProject()` kullanır: G0 ayarlı kaynak OFF/devreden ayrılmış, FG1 0–5 V sanal sinyal jeneratörü, M1 UT61E+ Hz.
- Presetler: 50 Hz / 1 kHz / 10 kHz; periyotlar 20 ms / 1 ms / 0,1 ms.
- `frequencyMeasurementRich=true`, `designStandard='rich-reference-v1'`, `multimeterModel='UNI-T UT61E+'`, `simulationOnly=true` acceptance metadata eklendi.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- Sayfa gerçek şebeke ölçüm talimatı içermez; düşük gerilimli simülasyon laboratuvarıdır.
- GitHub Actions çalıştırılmadı.

## 2026-10-09 — Wattmetre / cosφ dersleri enerji analizörü rich-reference-v1 kapanışı

Durum: **DONE / LOCKED / ENERGY ANALYZER POWER LAB**

- Kütüphaneye `energy-analyzer-1p` tek faz enerji analizörü ve `current-transformer-edu-1p` sanal CT eklendi.
- Analizör normal ölçüm kütüphanesinde görünür; eğitim yükü `energy-training-load-1p` yalnız öğretici senaryolarda kullanılır.
- `dist/energy-analyzer.js` ile V, I, P, Q, S, PF/cosφ, Hz ve Wh çalışma motoru eklendi.
- `current-model.js` enerji eğitim yükünü kompleks admittansla çözer; dirençli/endüktif/kapasitif presetlerde P-Q-S-PF sonuçları fiziksel olarak tutarlı üretilir.
- Analizörün sanal L-N gerilim girişi yüksek empedanslı, CT S1-S2 girişi simülasyon burden modeliyle kapalıdır.
- Wattmetre ve güç faktörü dersleri özel `energyAnalyzerPowerProject()` ile hazır devre olarak açılır.
- Kabul sonuçları: R → 230 W / 0 var / PF1,00; L → 184 W / +138 var / PF0,80; C → 184 W / −138 var / PF0,80; her üçünde S≈230 VA ve I≈1 A.
- Konu anlatımı yük presetlerini gerçek proje parametrelerine bağlar; yalnız metin değiştirmez.
- Ön yüz analizör ekranında U, I, P, Q, S, PF, Hz ve Wh birlikte gösterilir.
- Sayfa simülasyon-only uyarısı taşır; gerçek şebeke bağlantısı veya uygulama talimatı içermez.
- Yüzer/sürüklenebilir/yeniden boyutlandırılabilir Konu Anlatımı ve aç/kapa sağ panel standardı korunur.
- GitHub Actions çalıştırılmadı.


## 2026-10-10 — Yeni repo geçiş auditi + gerçek elektronik/Arduino shared kapanışı

Durum: **DONE / TARGET REPO MAIN / ACTIONS NOT USED**

- Yeni aktif çalışma reposu: `uysalayhan23/DevreTasarimStudyo`, dal: `main`.
- Repo izinleri doğrulandı: admin/maintain/push/pull/triage = true; collaborator permission = admin.
- Yeni repo 2026-10-10 05:10–05:12 UTC civarında yüklenmiş proje snapshotını içerir; önceki büyük iyileştirmelerin çoğu snapshotta mevcut bulundu.
- Korunduğu doğrulanan başlıca kapanışlar: Windows file-based launcher, Arduino Atölyesi/dashboard, V20 ve Siemens 3RV gerçek görsel katmanları, pointer/SVG kablo hizalama, PLC global simülasyon blok kaldırma, rich-reference-v1 Öğretici standardı, UT33D+/UT200A/UT61E+ ölçüm dersleri, enerji analizörü ve DC/seri/paralel/Kirchhoff kabul kilitleri.
- Eksik ana delta: gerçek elektronik komponent + Arduino shared simulation kapanışıydı.

### Bu repoya eklenen eksik delta
- `dist/electronics-ics-v11920.js`: 33 gerçek/shared elektronik komponent; PDIP, TO-220/TO-3P, TO-92, DO-35/DO-41, HC-49, elektret, hoparlör ve BPW34 paket metadata/pinout tanımları.
- `dist/digital-ic-runtime-v11920.js`: 74HC/CD40xx lojik, sequential state, MUX/decoder/encoder, ADC0804 ve DAC0808 runtime modeli.
- `dist/simulation.js`: dijital IC ağ sürüşü, state settle, J113 ve elektret transdüser entegrasyonu.
- `dist/current-model.js`: LM358 çift kanal bağımsız state, DAC0808 current-output, BPW34 photocurrent, kristal BVD eşdeğeri ve hoparlör yük modeli.
- `dist/materials.js`: realPackage tanımları için orthographic üstten paket rendererları.
- `dist/workspaces.js` + `dist/catalog.js`: `arduinoShared=true` komponentlerin Arduino Atölyesinde aynı ID/model ile görünmesi.
- `dist/tutorial-pedagogy.js`: fiziksel `tutorial-*` elektronik placeholderlarının gerçek parçalarla fail-closed remap'i; kablolu endpoint sahibi komponentler otomatik değiştirilmez.
- `tests/electronics-real-ics-v11920.test.cjs`: gerçek paket/Arduino shared + NAND/D-FF/74HC595/ADC/DAC davranış kilidi.
- Mevcut tutorial audit test yardımcıları yeni gerçek IC kütüphanesini yükleyecek şekilde güncellendi.
- Browser cache anahtarları real-ics1 olarak yenilendi.

### Actions'sız doğrulama
- Değiştirilen JS/test dosyaları sözdizimi: **PASS**.
- Gerçek/shared parça sayısı: **33**.
- Arduino workspace + catalog kabulü: **PASS**.
- SN74HC00 NAND truth-table: **PASS**.
- SN74HC74 rising-edge D-FF: **PASS**.
- SN74HC595 shift/latch: **PASS**.
- ADC0804 2,5 V / 5 V midscale: **128**, PASS.
- DAC0808 full-scale reference-current örneği: **0,99609375 mA**, PASS.
- Fiziksel tutorial placeholder offender: **0**.
- Pedagoji sürümü: `v1.19.20-pedagogy63-real-parts`.
- GitHub Actions **çalıştırılmadı**. Actions gerekirse kullanıcıdan önceden izin alınacaktır.

### Fidelity sınırı
- Modeller datasheet odaklı pinout, besleme, logic/state ve temel analog/eşdeğer davranış sağlar.
- Solver transistor-level SPICE değildir; üretim toleransı, tüm parasitikler, EMI ve tam semiconductor I-V/thermal breakdown ayrıntıları birebir fiziksel cihaz simülasyonu olarak iddia edilmez.


## 2026-10-10 — Fiziksel IC görsel standardı + LM358 ekran düzeltmesi

Durum: **DONE / LOCKED / ACTIONS NOT USED**

Kullanıcı ekran kabulü doğrultusunda entegre ve benzeri elektronik malzemeler için aşağıdaki görünüm sözleşmesi zorunludur: **arka plansız gerçek paket görünümü + üstten/orthographic yön + fiziksel bacakların görünmesi + terminal hotspotlarının gerçek bacak konumlarıyla hizalanması + işlevsel simülasyon + Arduino erişimi**. Beyaz fonlu ürün fotoğrafı/kart görünümü kabul edilmez.

### Ekran görüntüsündeki LM358 sorunu
- Kök neden: `dist/symbols.js` içinde `productVisualUrl`, fiziksel `realPackage` renderer'ından önce seçiliyordu; legacy `lm358p-opamp-a` A-kanal kaydı beyaz kart içinde harici ürün fotoğrafı gösteriyordu.
- Render önceliği değiştirildi: `realPackage → Materials.markup` artık ürün fotoğrafından önce gelir.
- Ürün fotoğrafı fallback'indeki beyaz `<rect fill="#fff">` kaldırıldı.
- Öğretici derslerde legacy `lm358p-opamp-a` kullanımı full `lm358p-dip8` fiziksel bileşenine migrate edilir.
- LM358 A-kanal bağlantıları gerçek pinlere çevrildi: **OUT=1, IN−=2, IN+=3, V−=4, V+=8**.
- Ekrandaki `Eviren yükselteç DC giriş` dersinde U1 artık `lm358p-dip8`, referans `U1`; bağlı pinler 1/2/3/4/8'dir. Kullanılmayan 5/6/7 pinleri de gerçek gövde üzerinde görünür.
- Eski kayıt `catalogHidden=true` ve `legacyAliasTo='lm358p-dip8'` olarak tutulur; eski proje dosyaları `app.js:migrateProject` içinde fiziksel DIP-8'e otomatik dönüştürülür.
- Legacy LM358 harici fotoğraf URL'si tamamen kaldırıldı.

### Diğer fiziksel elektronik görseller
- BD139 / BD140 harici beyaz-fon fotoğrafından gerçek **TO-126 orthographic** renderer'a geçirildi.
- GL5528 LDR harici fotoğraf yerine arka plansız **LDR-5MM orthographic** renderer kullanır.
- Aktif `electronics-library-v119.js` + `electronics-ics-v11920.js` içinde `productVisualUrl` bağımlılığı: **0**.

### Arduino kütüphanesi
- Mevcut Arduino parçalarının davranış/pin ID'leri değiştirilmeden fiziksel paket metadata'sı eklendi.
- Ortak paket standardına alınan Arduino ailesi: NE555P; MAX485CPA; CD4511BE; SN74HC595N; CD4017BE; MCP23017-E/SP; MAX7219CNG; MAX232N; TLP521-1/-2/-4; BC327; BD139; BD140.
- Denetlenen Arduino fiziksel paket sayısı: **14/14 PASS**.
- Her birinde `topView=true`, `orthographic=true`, `transparentBackground=true` ve her terminalde sayısal `physicalPin` vardır.
- Arduino BD139/BD140'ın eski beyaz kart + harici fotoğraf branch'i kaldırıldı.
- Genel gerçek elektronik parçaları ayrıca `arduinoShared=true` ile Arduino Atölyesinde aynı ID/simülasyon modeliyle erişilebilir kalır.

### MQ-12 Actions'sız kabul kanıtı
- Değiştirilen JS/test dosyaları sözdizimi: **PASS**.
- `Eviren yükselteç DC giriş`: U1=`lm358p-dip8`, gerçek pin endpointleri **1,2,2,3,4,8**.
- LM358 material render: `data-real-package="PDIP"` = **true**; `<image>` = **false**; beyaz kart = **false**; pin-1 işareti = **true**.
- Arduino physical package invalid: **0**.
- Aktif elektronik harici product photo dependency: **0**.
- `symbols.js` realPackage-first guard: **PASS**.
- Pedagoji sürümü: `v1.19.20-pedagogy64-real-ic-visuals`.
- Cache zinciri `real-ic-visuals1` / `real-visuals1` anahtarlarıyla yenilendi.
- GitHub Actions **çalıştırılmadı**. Native full Node/browser smoke bu turda çalıştırılmadı ve PASS sayılmadı.


## 2026-10-10 — Fotoğraf arka plan maskeleme / oran koruma MQ-00 ara kabul

Durum: **KOD DÜZELTMESİ TESLİM / 11/11 HEDEFLİ STATİK DENETİM PASS / GÖRSEL VE FİZİKSEL KABUL OPEN**.

- Dal: yeni hedef depo `uysalayhan23/DevreTasarimStudyo` / `main`. Önceki `v1.19.20` dal tanımları geçiş öncesi kaynak kurallarına aittir; mevcut golden referansları değiştirilmedi.
- MQ-03 görsel: FKV/FSR/NH render'ındaki ve ENDA/Baykon/Weidmüller ürün fotoğraf yardımcılarındaki `preserveAspectRatio="none"` kullanımı hedefli olarak `xMidYMid meet` ile değiştirildi. Siemens mevcut oran koruyan viewBox'ları muhafaza edildi. Kaynak fotoğraf binary'lerinin alfa kanalı değişmedi; maskeleme şeffaf PNG/WebP dosya üretimi gibi gösterilmez.
- Kod commitleri: `7f9854962ec5ca3564b9c98825b4b920e6f18991`, `a0d95d3259730c857de3e5dbec4ca319ae55d950`. MQ-12 regresyon test dosyası: `tests/photo-background-aspect-v11920.test.cjs`, commit `d978ffb06223b27ad4fc9bfb90399447ab4dccf1`.
- MQ-12 **hedefli statik inceleme**: GitHub `main` üzerindeki üç canlı renderer dosyasında 11 pozitif/negatif literal kod sözleşmesi kontrolü **11/11 PASS**. Bu, Node test çalıştırılması veya görsel piksel/siluet doğrulaması değildir.
- MQ-02/MQ-04 ve MQ-03 açık kabul: gerçek fotoğraf silueti, clipPath kaynak koordinatları, sahnede görünen ürünün doğrulanmış mm ölçeği ve terminal hizalaması; gerçek Windows/Edge tarayıcı kabulü ve tam `node scripts/run-tests.cjs` **NOT RUN / NOT PASSED**.
- MQ-13: hedef repo/dal ve son teslim commit zinciri doğrulandı. GitHub Actions çalıştırılmadı, commitler `[skip ci]`.
- MQ-00 kararı: **NİHAİ DONE DEĞİL**. Gerçek tarayıcı/siluet/terminal ve test çalıştırma kanıtı sağlanınca aynı başlık altında kapanış yapılacak. Bu kayıt eski backlog kimliklerini çoğaltmaz.

### 2026-10-10 — MQ-12 kod-içi gerçek renderer smoke (Actions'sız)

- Orijinal CommonJS renderer kaynakları GitHub `main` üzerinden okunup V8 JavaScript ortamında module.exports ile yüklenerek gerçek `markup(d,c)` çıktıları değerlendirildi; yalnız metin eşleştirme kullanılmadı.
- Kapsam: FKV, FSR, NH, ENDA ET4420, Baykon TX11, Weidmüller WAZ5, genel productPhoto115 ve Siemens 3RV2011-1JA10 / 5TL1163-0 / 5SL6116-7 / 5SL6316-7 / 5SL6216-7.
- İlk turda Siemens 5SL6216-7 varsayılan SVG meet değerine dayanıyordu; `dist/materials-v113.js` fallback viewBox'ına explicit `preserveAspectRatio="xMidYMid meet"` eklenerek kapatıldı (commit `13eac017087292fe52223d7d086611cc297f9527`).
- Düzeltme sonrası **12/12 renderer smoke PASS**: üretilen SVG çıktısında oran koruma, hedeflenen clip-path ve hedefin `preserveAspectRatio="none"` içermemesi denetlendi.
- Çalıştırılabilir Node testinin kaynak sözdizimi ayrıca V8 parser ile doğrulandı; test dosyası `tests/photo-background-runtime-v11920.test.cjs`, commit `240fe5c15f8f33141d0a63a8ea8caa82b7a448ed`. Bu testin Node test runner'da çalıştırıldığı iddia edilmez.
- Çalışma ortamı GitHub DNS/clone erişimi sağlamadığından tam Node `node scripts/check.cjs`, `node scripts/run-tests.cjs`, fotoğraf piksel alpha analizi ve gerçek Chrome/Edge görsel onayı **NOT RUN**. Kullanıcı Windows ZIP kabulü öncesi bunlara yanlış PASS verilmez.
- MQ-00: **KOD + HEDEFLİ RUNTIME SMOKE KABUL; NİHAİ GÖRSEL/PİKSEL + FİZİKSEL TERMİNAL + TAM TEST KAPISI AÇIK**. GitHub Actions kullanılmadı, commitler `[skip ci]`.


## 2026-10-10 — Kullanıcı ZIP'inden MQ-00 yerel kalite/regresyon denetimi

Durum: **AKTİF / KOD DÜZELTMELERİ YÜKLENDİ / HEDEFLİ TESTLER PASS / GENEL REGRESYON ve GÖRSEL KABUL OPEN / ZIP SON KULLANICI KABULÜNE HENÜZ HAZIR DEĞİL**.

Kaynak: Kullanıcının paylaştığı `DevreTasarimStudyo-main.zip` dosyası. Arşiv güvenli biçimde çıkarıldı; Node v22.16.0 kullanıldı, GitHub Actions çalıştırılmadı. Bu kullanıcı arşivi GitHub `.git` geçmişini içermediğinden lock-baseline testleri (3 hata) buradan tamamlanmış kabul edilemez. Yeni hedef repo `uysalayhan23/DevreTasarimStudyo` dal `main` kullanıldı.

### Doğrulanan kanıtlar

- `node scripts/check.cjs`: **PASS** (son yerel çalışma ağacında 215 JS dosyası sözdizimi, 106 yerel bağımlılık, 728 malzeme ve 58 korunan örnek). Bunun gerçek Windows/browser testi olmadığı korunur.
- Bounded full suite: `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs` ilk bütünleşik tur **815 TEST / 734 PASS / 81 FAIL**; logda ayrıntılar mevcut. Bu tur test harness DOM düzeltmesini içerir; **sonraki tüm düzeltmeleri içeren yeni full suite çalışması değildir**. Sonraki hedefli 19 test **19/19 PASS** (lesson-circuit 8, simulation-material 10, yeni LM358 physical step guard 1).
- Fiziksel metadata + kullanıcı ölçek kilidi hedef grubu (75 test): **57 PASS / 18 FAIL**. Eski fixture/revision karşılaştırmaları ile gerçek mm/terminal sorunları ayıklanmadığından release-ready değildir. Özellikle WAZ5, ET4420, Omron, terminal geometrisi, ölçek coverage ve 5TL asset hash iddiaları ayrıca incelenecek; doğrulanmış kanonik görsel/binary sırf test beklentisi için değiştirilmeyecektir.
- Ürün görselleri denetlendi: FKV, FSR, NH, ENDA, Baykon ve Weidmüller'in bazı kaynak PNG'leri **RGB / gerçek alfa içermiyor**. Uygulamada SVG `clipPath` maskeleme kullanılıyor; bunlar saydam kaynak asset olarak raporlanamaz. Fiziksel görünür siluet ve terminal eşleşmesi/Windows onayı açık.
- Gerçek Chromium görsel kabul denemesi bu container'da yanıt üretmedi. `BASLAT.bat` / `file:///.../dist/index.html` kilidi ve kanonik 2 scene-unit/mm sözleşmesi korunmalıdır.
- Kilitli `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md` belgesi **yüklenen ZIP ve yeni repo main içinde yok**; 10 referans-format testi kaynak dosyayı açamıyor. Elde olmayan özgün LOCKED belge uydurulmadı ve yeniden yazılmış metin kanonik original olarak sunulmadı.

### Repo üzerinde tamamlanan düzeltmeler

- `066e05415a473ec58ec67e70348bfd2e4ed4af2b`: offline test DOM `documentElement` modellenmesi, gerçek uygulama açılış testindeki harness crash kapatıldı.
- `9b32aaea8f0dc984f95aba0f296ba7c411961322`: kullanıcı kilitli fiziksel boyutlar `Symbols.prepareLibrary` aşamasında 20-unit grid'e yuvarlanmaz.
- `73f17eae22170bbff490193af49863cbc9c1f021`: fiziksel frame/pin remap için regresyon testi.
- `ce225db507f2a584b03cb82db986d7df68ba6c7e`: 5 eski aygıt/digital twin/HCFA testini güncel kanonik model ve runtime'a hizalama.
- `5d96a612e1da88e30c2c115551b5d65b0b11c602`: LM358P PDIP-8 migration gerçek devre telleri kadar öğretici `steps` terminal uçlarını da günceller; yanlış/pasif eski tutorial pin adları giderildi. Test denetimi yeni elektronik parça kimlikleri, gerçek paket görselleri, önceden takılı prob kabloları ve güncel enerji analizörü ile digital IC modellerine göre hizalandı; LM358 odaklı yeni regresyon eklendi.

### MQ-00 karar ve sonraki kapılar

- **KOD DÜZELTMELERİ MEVCUT; GENEL MQ-00 DONE DEĞİL.** Yalnız tek tek geçen doğrulamalar PASS; başarısız ve süre limitini aşan testler açık.
- Önce gerçek fiziksel/terminal hatalarını düzelt; sonra özgün LOCKED referansın eksikliğini gider; bütün testleri son GitHub HEAD'e eşit dosya ağacında tekrar çalıştır; görsel maske/siluet ve alpha denetimini tamamla; paketle; sonunda kullanıcıya yalnız gerçek Windows kabul ZIP'i sun.
- 2026-10-10 kullanıcısının kesin yasağı: GitHub Actions çalıştırılmaz; tüm commit mesajları `[skip ci]` içerir.


## 2026-10-10 — Fiziksel ölçek ve ana regresyon ikinci tur

Durum: **FİZİKSEL HEDEFLİ GRUP 75/75 PASS / KALAN GENEL REGRESYON AÇIK / ZIP SON KABULÜ HENÜZ İSTENMEYECEK**.

- Kaynak: kullanıcının yüklediği 82 MB `DevreTasarimStudyo-main.zip`. Komut: `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs`. Tam koşu, yeni fiziksel düzeltmelerin tamamının yerel kopyaya uygulanmasından sonra fakat son birkaç ek test düzenlemesinden önce yapıldı: **817 test / 764 PASS / 53 FAIL**. Bu sayı son GitHub HEAD testi olarak adlandırılmamalıdır.
- MQ-02/MQ-04: WAZ5 gerçek 8540300000 datasheet W/H/D = **17.5 × 92.4 × 112.4 mm**, kullanıcı sahne oranı **35 × 184.8 scene-unit**. Kütüphane ürünü `instrument:'waz5'` ile resmi `weid-front-v115` Digital Twin kaydına bağlandı. Yanlış/missing instrument için metadata **null** (fail-closed), ayrıca ayrı regresyon testi **1/1 PASS**. Üretici metadata karşılaştırması ile kullanıcının ayrı kilitli gösterim ölçüsü artık testte birbirine karıştırılmıyor.
- MQ-12 fiziksel metadata ve kullanıcı ölçek kilitleri: `tests/physical-metadata-v11920.test.cjs` + `tests/user-scale-only-lock-v11920.test.cjs` yerel çalıştırma **75/75 PASS**. 5TL kaynak WebP SHA-256, kayıtla hesaplanarak doğrulanır. ENDA ET4420 alt iki sıradaki gerçek terminal noktaları (y=108 ve 130) gövde sahne yüksekliği 96'dan bağımsız erişilebilir kalır; terminal hatları yapay biçimde yeniden yerleştirilmez. Kullanıcı kilitli MCB ölçülerinin üretici katalog ölçüsünden farklılığı raporda ayrıca görünür.
- MQ-04/MQ-12 pano iletken geometrisi: eski K1 `x+width*.25` yaklaşık terminal beklentisi kaldırıldı; fiziksel doğrulanmış terminal çapa noktası cihazla birlikte +25 taşınmasıyla hedefli test **PASS**.
- MQ-12 doküman sembolü ve Digital Twin hedefli testleri **15/15 PASS**. Pano uygunluğunu kanıtı olmayan WAZ5/ORDEL için sahte hazır/panel-ready sonucu verilmedi.
- MQ-12 diğer hedefli gruplar: işaretçi/marquee **7/7 PASS**; pano malzeme dahil etme ve görsel envanter **9/9 PASS**. Beklenen eski sabit cache revision'ları güncel scriptin varlığı ve eski revizyonun dönmemesi olarak sınanır.
- MQ-03 görsel envanter: **266 kayıt, 264 piksel denetimli, 2 piksel denetimi bekliyor**. Yeni `ordel-top-v115` ve `weid-front-v115` mapped sidecar'ları açık olarak gösterilir; **kaynak RGB / SVG clipPath** gerçek şeffaf asset dosyası olarak sunulmaz. Kaynak review pending **52**. Fiziksel silhouette, alfa, piksel görsel ve terminal hizası kabulü açık.
- MQ-12 açık hatlar: eksik özgün `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md`; ZIP içinde `.git` bulunmadığından 3 lock baseline testi; öğretici rich-format ve bazı eski snapshot/cache beklentileri; PLC I/O simülasyon davranışı; tam son HEAD regresyonu ve Windows/Edge gerçek kabulü.
- MQ-13 kaynak/kilit koruması: repo `uysalayhan23/DevreTasarimStudyo`, dal `main`; yalnız mevcut dalda küçük commitler; **GitHub Actions 0 çalıştırma**, commit mesajları `[skip ci]`.
- MQ-00 kararı: **HEDEFLİ FİZİKSEL DÜZELTME KABUL, PROJE NİHAİ DONE DEĞİL**. Eksik belgeyi uydurarak LOCKED orijinal gibi kaydetmeyin. Kaynak teknik kanıt ve tam regresyon tamamlanana kadar kullanıcıya son kabul ZIP'i sunmayın.


## 2026-10-10 — PLC + gerçek prob kullanılan seri/paralel öğretici kabul turu

Durum: **HEDEFLİ YEREL TESTLER PASS / GENEL REGRESYON VE SON GÖRSEL KABUL AÇIK**.

- MQ-05/MQ-12 PLC: `tests/regression.test.cjs` içindeki eski `blocked=true` beklentisi güncel PLC runtime'ın bağımsız devreleri bloke etmeyen davranışına göre düzeltildi. Enerjisiz PLC ve `plc-io-symbol` ölü çıktı üretmez, eski lamba aktivitesi sıfırlanır; gerçek `Sim.solve` testi **1/1 PASS**. Kod/simülasyon motorunun güvenlik kilidi gevşetilmedi. Commit: `3513825c261a3332dd27c34aad5f292801c9562f`.
- MQ-07/MQ-12 yönlendirmeler: `tests/tutorial-pedagogy-v119.test.cjs` artık fonksiyonel devre tellerini önceden bağlı veya öğretimde isteğe bağlı prob kablolarından ayırıyor; hayali terminali işaret eden adımlar yine engelleniyor. 1500+ ders kapsamındaki hedefli rehber test **1/1 PASS**. Commit: `83fbd0e9c012947feef45f103cd5215c095c2011`.
- MQ-07/MQ-05 fiziksel UNI-T problar: `dc-circuits-src-07` (Seri Devre Analizi) ve `dc-circuits-src-08` (Paralel Devre Analizi) laboratuvarlarında iki UT33D+ cihazın her biri artık hareket ettirilebilir bir kırmızı ve bir siyah prob taşır. Doğrudan meter-jack→devre bağlantıları gerçek prob uçlarına taşındı. Paralel devrede iki ayrı direnç girişi tek ortak düğüm ile birleştirildi; ampermetrenin siyah probu bu düğüme temas eder, yuvada çift bağlantı kalmaz. `tutorial-pedagogy.js` commit: `ebdc8bf0e2c78a5a591891573aecc0ef1eb0f61c`.
- **Gerçek simülasyon kanıtı:** Seri devre ≈74,8 mA ve ≈7,48 V; paralel devre ≈349 mA ve ≈24 V; her ikisi stable=true, shortCircuit=false, blocked=false. Voltmeter probları kaynak uçlarına taşındığında ≈24 V okunur. `tests/tutorial-analysis-physical-probes-v11920.test.cjs` 2/2 PASS, commit `b1cf21a38fb1cd3ffd738643379fd17bd44932de`. Bu gerçek `Simulation.solve` fonksiyonunu kullanır.
- MQ-07 pens ölçümü: `measurement-workshop-src-04` açılır ölçüm deneyidir (`clamp-current-measurement-rich`), eksik kablo rehberi sanılmaz; yürütülebilir ölçüm koşulu doğrulanır. Hedefli test **1/1 PASS**, commit `a2d9b85855d3af0fe736aa29aee29b1fe98c50ee`. Güncel test ayrıca kablolu UT33D+ derslerinde iki fiziksel prob varlığını **1/1 PASS** doğrular.
- Güncel yerel kaynak (kullanıcı ZIP kopyası + bu turdaki ilgili değişiklikler) üzerinde `node scripts/check.cjs` **PASS** (217 JS, 106 yerel bağımlılık, 728 malzeme, 58 korunan örnek); ders/devre/simülasyon grubu **20/20 PASS**. `check` sonucu gerçek Windows testi değildir; Github main'deki tüm dosya ağacının sıfır farkla tekrar çıkarıldığı bu turda kanıtlanmadı.
- **Açık kalanlar:** Tam 817+ regresyonun son `main` HEAD üzerinde yeniden koşulması, 2 görsel yan kayıt piksel denetimi, özgün eksik LOCKED öğretici belgesinin kurtarılması, diğer öğretici regresyon bulguları ve gerçek Windows/Edge son kabulü. Eski 764/817 tam koşu bu yeni commitlerden önceki duruma aittir; güncel geçme oranı olarak kullanılamaz.
- MQ-13: Aktif repo `uysalayhan23/DevreTasarimStudyo`, dal `main`. **GitHub Actions 0 çalıştırma**, tüm commitler `[skip ci]`.
- MQ-00 kararı: **Bu öğretici/PLC alt paketi hedefli kabul, proje genelinde DONE değil.** Kullanıcıya nihai Windows ZIP kabulü henüz istenmemelidir.


## 2026-10-10 — Öğretici regresyon yenileme, RS NAND doğruluğu ve ZIP tanı kabulü

**Durum: YEREL TARGET TESTLER PASS / GENEL REGRESYON 805/820 / 15 AÇIK, SON MQ-00 KABULÜ YAPILMADI.**

### MQ-07 / MQ-12 öğretici kanıtı
- Kullanıcının sağladığı proje ZIP'i üzerinde yerel `node --test --test-concurrency=4 tests/tutorial-*.test.cjs` çalıştırıldı: **93 toplam, 83 PASS, 10 FAIL**. Tüm 10 FAIL aynı eksik kaynak `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md` belgesinin ENOENT hatasından kaynaklandı; özgün LOCKED belge yaratılarak sahte bir PASS üretilmedi.
- Alt gruplar: eski pil/DC/Ohm cache etiketleri ve Node VM farklı realm prob karşılaştırmaları düzeltildi, **23/23 PASS**; öğretici modu içeriği son pedagogy pass üzerinden ve restore kontrolleriyle test edildi, **23/23 PASS**; RS latch fiziksel NAND kapısı ayrımı ve fiziki prob devre/ölçüm testleri korunarak `tutorial-pedagogy-v119.test.cjs` **18/18 PASS**.
- `digital-sequential-apps-src-01` ve ilgili RS konsept derslerinde SN74HC00N'nin dört NAND kapısı içerdiği, tek başına tamamlanmış RS flip-flop olmadığı ve kablolu RS devresi bulunmadığından bu derste çalışır latch simülasyonu yapılmadığı açıklandı. T/F ve diğer entegre kimlikleri değiştirilmedi.
- GitHub commitleri: `19b63e06a4dbbdda63518a531044f14d00f94215`, `39e86582d0db737f46b3e335ce460df648f3bcc0`, `549b9ecd173a8672e812f17349fafa65e759f52d`.

### MQ-03 / MQ-02 görsel ve fiziksel denetim
- ORDEL `ordel-top-v115.png` kaynak PNG **1254×1254 RGB colorType=2**; WAZ5 `weid-front-v115.png` kaynak PNG **1024×1536 RGB colorType=2**. Her ikisinin kaynak resminde alfa kanalı yoktur; SVG `clipPath` maskeleme bu gerçeklikten ayrı tutulur.
- Görsel kaynak boyutu, maskeli runtime markup ve WAZ5'in 17.5×92.4 mm fiziksel metadata'sı `tests/visual-ordel-waz5-mask-v11920.test.cjs` testinde **2/2 PASS**, commit `33043280a9448a76780b7bc320ed798bacb5c90d`. Bu testler piksel kenarı kalitesinin/ortografik görsel kabulünün tam testi değildir; mapped sidecar pixelAuditPending **2** korunur, kanıtsız verified yapılmaz.

### MQ-12 / MQ-13 bütünlük ve büyük regresyon
- `node scripts/check.cjs` **PASS**: 217 kaynak JS, 106 yerel bağımlılık, 728 kütüphane tanımı, 58 korunan örnek.
- `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs` yerel tam test: **820 toplam / 805 PASS / 15 FAIL / 0 SKIP**, yaklaşık 292 saniye. Bu tam koşudan sonra iki fiziksel sembol/asset beklentisi düzeltildi: `regression.test.cjs` testlerindeki onaylı fiziksel sub-grid pinler ve ürün fotoğrafının lokal asset referansı kontrolü; hedefli yeniden koşu **2/2 PASS**. Commit `1eb7679ec79dd273dad7f80812ea76a99f51e1e0`. Dolayısıyla 805/820 eski tam koşuya aittir, son HEAD'deki yeni tam test sonucu değildir.
- Kalan başarısızlıkların kanıtlı dağılımı: 10 eksik özgün öğretici LOCKED dosya; 3 ZIP içinde `.git` geçmişi bulunmadığı için `git show/merge-base` gerektiren repository integrity testleri; 2 sonraki hedefli yeniden koşuda düzeltilmiş önceki ölçek/asset beklentisi.
- GitHub deposu değil ZIP ağacı test edildi; korunmuş tarihsel commit geçmişi ZIP'den türetilemez. Son HEAD 820/820 PASS değildir.
- `python3 scripts/package.py --output /mnt/data/dts_diagnostic_runtime_v1.19.20.zip`: tanı paketi **503 dosya**, **84,024,362 bayt**, **ZIP CRC PASS, çıkarılan bütün dosyalarda SHA-256 PASS**. Bu tanı paketi, kullanıcıya nihai Windows kabul paketi olarak sunulmadı.
- Linux headless Chromium ile doğrudan `file:///.../dist/index.html` açılış denemesi **TIMEOUT / NOT PASSED**; Windows üzerinde gerçek UI, fiziksel ürün silueti ve terminaller son kabulü bekliyor. Localhost/HTTP başlatıcıya geçilmedi.
- GitHub API üzerinden Actions workflow run sayısı **0** görüldü. **GitHub Actions çalıştırılmadı**; tüm commitlerde `[skip ci]` korundu.

**MQ-00 kararı:** Hedefli değişiklikler kabul, GENEL DONE değil. Önce özgün LOCKED belgenin güvenilir kaynaktan kurtarılması ve Git commit geçmişi üstünde branch-lock testleri, sonra tam HEAD regresyonu ve son ZIP/Windows görsel kabulü yapılır. Kaynağı bulunmayan belgeyi yeniden yazarak eski kilidin orijinali gibi göstermeyin.


## 2026-10-10 — Yeni repo kilit referansı onarımı ve özgün öğretici belge araştırması

**MQ-00 karar:** **REPO KİLİT REFERANSI ONARIMI DOĞRULANDI; EKSİK ÖZGÜN ÖĞRETİCİ BELGE VE TÜM HEAD REGRESYONU AÇIK.**

- Hedef: `uysalayhan23/DevreTasarimStudyo` / `main`. Yeni repo, eski workflow'da belirtilen `f18ec71686a6e198d7470885c47e8b91622fabe4` commitini içermez: GitHub REST commits endpoint 422, compare endpoint 404. Bu SHA'ya dayalı bütünlük kabulü imkânsızdı.
- `V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md` için eski kilit SHA `8b19cb93b019c41e8e068d446c56f4e471489f22` yalnız **orijinal önek bölümü** ile birebir eşleşir. Sonradan eklenmiş `## ORTAK ÇALIŞMA UZAYI VE GÖRSEL ÖLÇEK KİLİDİ` bölümü korunur; tam güncel dosyanın gerçek Git blob SHA'sı `e5b60dd790e56c0e0a9c3b5dbab0a957c9144146`. Eski hashin güncel belgeyi haksız yere reddetmesi düzeltildi (`scripts/check-v11920-lock.cjs`, commit `d0187ef869b3bbf5e0f2461365e991f9029b25c4`).
- GitHub `main` üzerindeki sekiz korunan dosya güncel yeni-repo sabit geçmişine bağlandı. Workflow'da yeni immutable baseline commit `d0187ef869b3bbf5e0f2461365e991f9029b25c4`; yalnız baz SHA yazısı değiştirilerek `7088ee3e65534ead26e54f851954f7d9e52d0c5e` commitinde pinlendi. Workflow normalize karşılaştırması orijinal güvenlik sınırını gevşetmiyor.
- GitHub API `compare d0187ef...main`: `ahead=1`, `status=ahead`; baseline yeni main'in **gerçek atası**. 7 korunan dosya Git blob SHA eşit, 8. workflow kendi pin değişkeni normalize edildiğinde byte-for-byte aynı: **8/8 PASS**. Bu audit, ZIP'deki .git eksikliği nedeniyle Node `git show/merge-base` testlerinin bizzat çalıştırılmasıyla karıştırılmaz.
- Kullanıcı ZIP çalışma ağacında güncel kilit SHA ve workflow baseline düzeltmesi uygulanarak `node scripts/check-v11920-lock.cjs` **4/4 LOCK PASS**, `node --test tests/ci-fast-gate-v11920.test.cjs` **7/7 PASS**, `node scripts/check.cjs` **PASS** (218 JS, 106 yerel bağımlılık, 728 kütüphane tanımı, 58 korunan örnek). Bunlar yeni repo commit içeriklerini kapsayan kod kilidi ve hızlı kalite denetimleridir; `tests/repo-lock-integrity-v11920.test.cjs` ZIP içinde .git olmadığı için Node ile çalışmış olarak raporlanmaz.
- Eksik özgün `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md`: kullanıcı ZIP'de yok, yeni repoda `main` ve incelenen eski path geçmişinde yok. Önceki konuşma yalnız `rich-reference-v1` standardının bazı kararlarını doğrular; özgün dosyanın tam metni veya kaynağı bulunamadı. **Özgün dosya uydurulmadı; ilgili 10 test CLOSED/PASS değil.**
- GitHub Actions workflow çalıştırılmadı (GitHub `actions/runs` toplam `0`); commitler `[skip ci]`. Mevcut workflow'da eski `v1.19.20` branch referansları arşivsel kayıttır; yeni repo yalnız `main` kullanıyor. Kullanıcı izni olmadan Actions tetiklemeyecek şekilde bu turun kapsamı dışında bırakıldı.
- Sonraki kapılar: özgün öğretici lock dosyasını güvenilir kaynaktan kurtarma, tam gerçek Git checkout üzerinde üç `repo-lock-integrity` vakasını Node ile yeniden çalıştırma, `main` HEAD tam regresyonunu yenileme, görsel kenar/pixel ve Windows `file:///` nihai kabul.


## 2026-10-10 — Rich-reference sözleşmesinin kanıtlı yeniden tesisi ve 822-test regresyonu

**MQ-00: ÖĞRETİCİ BELGE ENGELİ YENİDEN TESİS EDİLEN SÖZLEŞME İLE ÇÖZÜLDÜ / YEREL GENİŞ REGRESYON 819 PASS, 3 GIT-GEÇMİŞİ ENVIRONMENT-BLOCKED / GERÇEK WINDOWS-GÖRSEL KABULÜ AÇIK.**

- Eski `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md` dosyasının birebir özgün baytları ZIP'de, yeni GitHub `main` geçmişinde ve erişilebilir kaynaklarda bulunamadı. Bu nedenle bulunan eski dosya gibi davranılmadı. Uygulamanın kendi kodu, kilit testleri ve önceki kullanıcı kararları kaynak alınarak **yeniden tesis edilmiş** bir rich-reference-v1 sözleşmesi aynı yolda açık provenance başlığıyla oluşturuldu; commit `2840f944292837546b4bb616f8976d217f96617e`. Belgenin içinde özgün kaynakla byte-for-byte eşit olmadığı açıkça yazılıdır.
- Yerel test `node --test tests/tutorial-reference-format-v11920.test.cjs`: **14/14 PASS**. GitHub'da yayımlanan yeniden tesis metni 42 temel sözleşme metin/başlık regex maddesiyle ayrıca doğrulandı: **42/42**. Bu kanıt, kayıp tarihsel metnin aynen geri getirildiği iddiasını içermez.
- Yerel güncel çalışma ağacı: kullanıcı ZIP'i + önceki çalışma turlarındaki düzeltmeler + yenilenen öğretici standardı. `node scripts/check.cjs`: **PASS**, 218 JS sözdizimi, 106 yerel bağımlılık, 728 malzeme, 58 korunan örnek. `node scripts/check-v11920-lock.cjs`: 4/4 lock PASS. `node scripts/check-docs-fast-v11920.cjs`: 35 doküman PASS. `node scripts/quality-gates-v11920.cjs`: **G1–G4 PASS**, ancak kaynak/ölçü ve resmi MEB kazanımının doğrulanması gibi rapordaki sınırlamalar korunur.
- Tam Node test çalıştırması: `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs`: **822 TOPLAM / 819 PASS / 3 FAIL / 0 SKIP**, ≈291,8 saniye. Başarısız vakalar yalnız `tests/repo-lock-integrity-v11920.test.cjs` içindedir: (1) WP-017 pinned baseline; (2) normalized workflow baseline; (3) integrity checker mutation baseline. Bu üç testin `git show` / `git merge-base` komutları kullanıcı ZIP'inde gerçek `.git` bulunmadığı için çalışmaz; ilgili testler **PASS sayılmaz**.
- Bağımsız gerçek GitHub API delili: doğrulanmış baseline `d0187ef869b3bbf5e0f2461365e991f9029b25c4` yeni `main` için atadır; 8 korunan dosyanın blob/normalize içerik karşılaştırması önceki MQ-13 turunda **8/8 PASS**. GitHub API kontrolü, 3 yerel `git` testinin çalıştırıldığının yerine geçirilmez.
- **Test kapsamı sınırı:** Yerel full run dosyaları özgün kullanıcı ZIP'i ile daha önceki yerel düzeltmelerden türemiştir; GitHub yeni `main` üzerinde cryptographic tree-equality gösterilmedi. Dolayısıyla 819/822, GitHub HEAD'de birebir test edilmiş sürüm diye sunulmaz. Ancak kaynak kodu ve yazılan commitler arasındaki hedefli test bağları ayrı kayıtlardadır.
- Görsel kaynaklarda ORDEL/WAZ5 RGB-şeffaflık sınırı, 2 mapped sidecar pixelAuditPending, üretici/CAD verisinin kısmi kapsaması ve Windows/Edge `file:///` gerçek kullanıcı görsel kabulü **AÇIK** kalır. Teknik ZIP paketinin son kullanıcıya kabul paketi olarak sunulması için bunlar ve tam HEAD eşitliği gerekir.
- GitHub Actions bu turda çalıştırılmadı; `actions/runs` = **0**, commitler `[skip ci]`. Başka dal/force-push yoktur.

**MQ-00 sonraki kapı:** son yeni-repo HEAD ile eksiksiz içerik SHA karşılaştırması veya gerçek Git checkout, korunan dal/dosya bütünlüğü testleri, ardından tam SHA-eşit kaynakta tekrar tam regresyon; görsel/terminal gerçek ekran kabulü ve en son Windows ZIP kullanıcısına test.


## 2026-10-10 — MQ-00 SHA parity ve raster kaynak kanıtı

**Durum: KOD+TEST KLASÖRÜ BİREBİR SHA EŞ / HEDEFLİ TESTLER 93/93 PASS / İKİ BELGE SÜRÜMÜ ve NATIVE GIT TESTİ AÇIK.**

- GitHub `main` HEAD `3d96a5e833528b94f2f569082e481a0638eaced2` REST `git/trees/main?recursive=1` API ile alındı: 748 ağaç girdisi (725 blob + 23 tree). Kullanıcı ZIP'inden oluşturulan çalışma kopyasının Git blob ve ağaç SHA'ları Python SHA-1 Git object contract ile hesaplandı. Yerel `build/` generated-artifact dizini kaynak denetiminden hariç tutuldu.
- Doğrudan eşleşen üst dizin Git ağaçları **10/10**: `dist`=`1c17a0e34005599df9f6b421554ac2457f7ad921`, `scripts`=`5a536753af86d58d357bd85996731cd983f713c5`, `tests`=`f298415ff5a819fb2573479b063a91053571c83b`, ayrıca `.github`, `Belgeler`, `Kaydedilen_Projeler`, `Ornekler`, `evidence`, `third_party`, `tools`. Bunlar çalışan JS ve test dosyalarının **birebir byte/hash** eşitliğidir; GitHub yeni kod yüklemesi gerektirmedi.
- Yerel test sürümü farkları `tests/physical-metadata-v11920.test.cjs`, `tests/tutorial-analysis-physical-probes-v11920.test.cjs`, `tests/user-scale-only-lock-v11920.test.cjs` dosyalarında açıklama/satır sonu/regex karakter kümesi eşdeğerliği seviyesinde bulundu. Yerel nüshalar GitHub'ın tam blob SHA'sına eşitlenerek `tests` ağaç SHA'sı **tam eşleştirildi**. Bu senkronizasyon **yalnız yerel** kopyada gerçekleştirildi, GitHub'a herhangi bir kilit gevşetme yazılmadı.
- İki doküman GitHub HEAD ile byte eşit değildir: `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` (GitHub'da sonraki kayıtlar bulunur); `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md` (iki yeniden tesis nüshası farklı). Tam GitHub repo root tree SHA eşitliği bu sebeple **henüz PASSED değil**. Güncel GitHub belgeleri otoritedir. Belge farkları gizlenmedi.
- **GitHub kod+test eşit yerel ağaç üzerinde çalıştırılan doğrulama:** `node scripts/check.cjs` **PASS** (218 JS syntax, 106 local dependencies, 728 library defs, 58 read-only examples); `node --test --test-concurrency=4 tests/physical-metadata-v11920.test.cjs tests/user-scale-only-lock-v11920.test.cjs tests/tutorial-analysis-physical-probes-v11920.test.cjs tests/tutorial-reference-format-v11920.test.cjs tests/visual-ordel-waz5-mask-v11920.test.cjs` **93/93 PASS, 0 FAIL, 0 SKIP**. Referans belgesi testleri **yerel** yeniden tesis nüshası üzerinde çalıştığından GitHub belgesiyle birebir aynı metinde yürütüldüğü iddia edilmez; GitHub belge sözleşmesi ayrıca önceki turda 42/42 metin kontrolünden geçmiştir.
- ORDEL 1254×1254, WAZ5 1024×1536, ENDA 1254×1254, Baykon 1024×1536, FKV 1024×1536, FSR 1024×1536, NH-holder 996×1580 ürün PNG'leri Pillow ile açılarak incelendi: **7/7 RGB, kaynak alfa kanalı yok**. Uygulamadaki `clipPath` şeffaf kaynak pixel alfa kanıtı değildir; piksel kenar/örtü kalitesi ve tüm cihazlarda terminal ekran hizası **OPEN** kalır.
- Yerel Linux headless Chromium `file:///` ile gerçek ekran denemesi yine **TIMEOUT / NOT PASSED**; Windows `BASLAT.bat` gerçek kullanıcı kabulünün yerini tutmaz. ZIP'de gerçek `.git` klasörü bulunmadığından 3 native Git integrity testi **NOT PASSED**; GitHub API kökenli ancestor ve 8 protected file kontrolünün ayrı kanıtları korunur.
- **MQ-00:** Kullanıcıya henüz son Windows ZIP testi istenmez. Sonraki kapı, GitHub'ın yeniden tesis belgesiyle tam SHA-eş kaynakta final Node regresyonu; native Git geçmişi testi gerçek checkout; OS/browser UI ve piksel kenar görsel kabulüdür. MQ-13: GitHub Actions **çalıştırılmadı**, commit `[skip ci]`.


## 2026-10-10 — Yüzer öğretici pencere metni okunabilirlik iyileştirmesi (MQ-07)

- Kullanıcının yeni kilitli isteği: yüzer penceredeki konu anlatımı yazıları birkaç punto büyütülecek; çalışma sahnesi daraltılmayacak.
- `dist/tutorial.css`: `#tutorialCoach` kapsamına özel gövde metni 13px; h3/h4 14px; küçük etiketler 11px; düğmeler 12px. Eski 7–11px açıklamalar daha okunabilir oldu. Pencere boyutu, drag, minimize, resize ve scroll ayarları değiştirilmedi.
- `dist/index.html`: stylesheet cache rev `20261010-coach-readable1`. `tests/tutorial-coach-readable-v11920.test.cjs`: metin, kapsam, boyut davranışları ve önbellek anahtarını doğrulayan **3/3 yerel PASS**.
- `node scripts/check.cjs`: **PASS**, 219 JS syntax, 106 local dependencies, 728 library definitions, 58 protected examples.
- `docs/TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md`: bölüm 21 ile kalıcı okunabilirlik ve çalışma alanı ilkesi eklendi.
- İlk sahne tıklamasıyla küçük açıklamaların kaybolup hover ile dönmesi **bu font değişikliğinin kapsamında değildir; henüz kapatılmadı**. Öğretim serisi 45/45 QA ve gerçek Windows/Edge ekran onayı açık; başarı uydurulmaz.
- GitHub Actions kullanılmadı, commit `[skip ci]`.



## 2026-10-10 — Öğretici bütün derslerde mikro açıklama davranışı (MQ-07 / MQ-12)

- Kullanıcı isteği: küçük prob/malzeme açıklamaları ilk sayfa açılışında görünür, ilk tıklamada gizlenir, yalnız fare ilgili gerçek elemana geldiğinde yeniden açılır ve fare ayrıldığında kapanır. Yüzer konu anlatımı aynen kalır; çalışma alanı daraltılmaz.
- `dist/tutorial-micro-hints.js` yeni ortak ve veri odaklı davranış: zengin referans sahnelerin 5 mevcut kartı korunur; diğer öğretici derslere gerçek projedeki en çok 4 malzemeden ilk tanıtım gelir. İlk tıklama sonrası yalnız `g.component` veya `g.component-backdrop` hover/focus bilgisini gösterir. Kırmızı/siyah prob eşlemesi özeldir; kaynak uydurulmaz.
- `dist/tutorial-mode.js` ve `dist/tutorial-bootstrap.js` entegrasyonu, `dist/tutorial.css` ek sınıflar, `dist/index.html` güncel CSS önbellek anahtarı. Alt soru/formül/gözlem bölümleri ve yüzer konu anlatımı etkilenmez. Yeni `tests/tutorial-micro-hints-v11920.test.cjs` regresyonu.
- Yerel güncel çalışma ağacında `node --test --test-concurrency=4 tests/tutorial-*.test.cjs`: **101/101 PASS** (önceki cache beklentileri güncel sürüme hizalandı). `node scripts/check.cjs`: **PASS** (221 JS dosyası, 106 bağımlılık, 728 malzeme, 58 örnek). Bu kanıt gerçek Windows/UI piksel kabulünün yerini tutmaz.
- Aynı standart 45/45 ölçüm dersinin dışındaki derslerin arayüz davranışına da uygulanır; bu 45 dersin özel içerik/görsel/ölçüm dönüşümünün pedagojik olarak bitirildiği iddiası değildir.
- Actions çalıştırılmadı, commit `[skip ci]`; MQ-00 nihai release kabulü açık.



## 2026-10-10 — Tüm öğretici derslerde mikro açıklama kapanış regresyonu (831 test)

**MQ-07 ortak arayüz davranışı KODLANDI ve HEDEFLİ TESTLERDE KABUL; GENEL MQ-00 SON WINDOWS/UI KABULÜ AÇIK.**

- Kullanıcı: mikro açıklama kartları ilk açılışta görünür; ilk tıklamada kalkar; fare kırmızı veya siyah proba/malzemeye geldiğinde yalnız eşleşen bilgi görünür; fare ayrılınca kapanır. `tutorialCoach`, alt öğrenci görevleri ve sağ panel korunur; çalışma sahnesi daraltılmaz.
- `dist/tutorial-micro-hints.js` ortak olay modülü, `tutorial-mode.js` senkronizasyonu, lazy-loader `tutorial-bootstrap.js`, `tutorial.css` görünürlük/tooltip kuralları, `index.html` CSS cache yenilemesi repoya işlendi; eski CSS revizyon bekleyen sekiz test dosyası güncellendi. Bütün commitlerde `[skip ci]`.
- Yerel `node --test --test-concurrency=4 tests/tutorial-*.test.cjs`: **101/101 PASS** (mikro kart testleri dahil, o koşuda 5 test). Sonrasında 45 ölçüm dersi dahil **1.655/1.655 öğretici proje kaydı** için gerçek bileşen varlığı doğrulandı ve her dersi başlangıçta gösterip ilk tıklamada gizleyen ortak kontrol 1.655 ayrı ders üzerinde hatasız çalıştırıldı. En son hedefli `tests/tutorial-micro-hints-v11920.test.cjs`: **7/7 PASS**; bu 7. test kapsamlı full run başlatıldıktan sonra eklendi, ayrı doğrulandı.
- Yerel `node scripts/check.cjs`: **PASS**, 221 JS sözdizimi, 106 local dependency, 728 library material, 58 protected examples.
- **Tam yerel regresyon** `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs`: **831 toplam / 828 PASS / 3 FAIL / 0 SKIP**, yaklaşık 286,8 saniye. Kalan üç başarısızlık yalnız `tests/repo-lock-integrity-v11920.test.cjs`: `WP-017 pinned baseline`, `workflow baseline self-reference`, `integrity checker mutation digest`. Üçü de ZIP içinde gerçek `.git` klasörü olmadığından `git merge-base`/`git show` çalıştıramıyor. **Bu üç test PASSED sayılmadı**.
- Yeni GitHub `main` üzerindeki gerçek kodlu modül ayrıca doğrudan JavaScript smoke kontrolünden geçti (ilk kart görünümü, click-dismiss, kırmızı/siyah doğru hover, mouse ayrılınca hide, lazy loader + CSS cache eşleşmesi). Bu smoke, Windows görsel kabulünün yerine geçmez. GitHub'ın gerçek commit geçmişi REST compare ile doğrulandı: `d0187ef...` baseline son `main`'in atası; ZIP'deki native Git testlerinin çalıştığı iddiası değildir.
- **Kapsam sınırı:** 1.655/1.655 ders için mikro açıklama arayüz motoru vardır; bu, 45 ölçüm dersinin veya bütün öğretici konuların özel görsel + devre + ölçüm + pedagojik dönüşümünün 45/45 nihai kabulü değildir. RGB kaynak alfa/maske görsel kalite ve Windows/Edge `file:///` son kullanıcı kabulü hâlâ AÇIK.
- GitHub Actions `actions/runs=0` doğrulandı; hiçbir Actions işlemi tetiklenmedi.

**MQ-00 kararı:** Mikro açıklama ortak davranışı kod/test düzeyinde hedefli kabul. Kullanıcıdan ZIP kabulü istenmeden önce gerçek Windows GUI ve Git geçmişi gerektiren üç native test uygun checkout üzerinde tamamlanmalıdır.


## 2026-10-10 — Ölçüm öğretimi ilk alt konu dönüşüm grubu (9 ders)

**MQ-07 dönüşüm kod aşaması:** Elektriksel ölçme ve ölçü aletleri toplamı **45 ders korunarak**, önceki 10 rich-reference laboratuvara ek olarak 9 alt konu laboratuvarı sağlandı: `outline-011`, `012`, `013`, `014`, `015`, `031`, `032`, `042`, `043`. **Gelişmiş laboratuvar kullanan ders sayısı 19/45; Windows/piksel/pedagojik tek tek nihai kabul 19/45 değildir.** Diğer 26 ders ayrı dönüşüm backlog'unda kalır.

- Özelleştirilen konular: dijital multimetrenin yapısı ve kullanımı, uygun kademe seçimi, gerilim ölçme, akım ölçme, voltmetre/ampermetreyle devre analizi ve tekrar eden uygulama başlıkları. Her birine **farklı hedef, kendi öğrenci görevi, konu kontrol sorusu, gerçek terminalden rehberli bağlantı** eklendi.
- `dist/tutorial-measurement-batch-a.js` eski pedagojik üreticiyi ve `LOCKS` içeriğini değiştirmeyen ek modüldür. Gerilim alanları `measurement-workshop-src-01`, akım alanları `measurement-workshop-src-02` kanonik onaylı devre/prob sistemlerini kopyalar. UNI-T UT33D+ ve ayarlı masa kaynağı, yük 1 kΩ; kaynak 24 V; voltmetre DCV ~24 V, ampermetre DCA ~0,024 A canlı `Simulation.solve` değerleriyle ölçülür. Kırmızı/siyah problar hareketlidir. Sahte hesaplanmış cihaz görüntüsü kullanılmaz.
- `dist/tutorial-mode.js` rich koç, preset, gerçek ölçüm, genel ilk-tıklama/hover mikro açıklamalarını bu dokuz derste de etkinleştirir. `measurementUpgradeCard` her derse özgü bilgileri ve soruları **yalnız mevcut yüzer konu anlatımı penceresinde** gösterir. `dist/tutorial.css` çalışma alanını daraltan yeni sabit panel eklemez.
- Tarayıcı önbelleğini doğru yenilemek için `dist/tutorial-bootstrap.js` tutorial-mode rev `1.19.20-measure-batch-a1` ve `dist/index.html` tutorial.css rev `20261010-measure-batch-a1`; bunları denetleyen 9 eski test dosyası güncellendi.
- MQ-12 kanıt: yüklenen proje ZIP'i temelinden oluşturulan **yerel eşdeğer modül** ve son kod düzeni üzerinde `node scripts/check.cjs` **PASS** (223 JS, 106 dependency, 728 library materials, 58 protected examples); öğretici+devre odaklı `node --test --test-concurrency=4 tests/tutorial-*.test.cjs tests/lesson-circuit-audit-v119.test.cjs` **115/115 PASS, 0 FAIL**. İlk başarısız turda eski CSS/JS cache anahtarlarının beklendiği görüldü, ardından değerler güncellenip 115/115 yeniden çalıştırıldı. GitHub'daki **gerçek** `tutorial-measurement-batch-a.js` de başlatma ve 9/9 farklı konu içeriği için JS smoke testinden geçti. **Tam HEAD regresyonu ve Windows görsel kabulü bu turda koşulmadı; PASSED ilan edilmez.**
- Yeni `tests/tutorial-measurement-batch-a-v11920.test.cjs` kanonik kaynak, 45 konu sayısı, her dokuz dersin ayırıcı kazanımı, terminal bağlantısı, gerçek `Simulation.solve` sonucu ve pencereyi büyütmeyen kartlar için guard sağlar.
- MQ-13: Yeni repo `uysalayhan23/DevreTasarimStudyo`, dal `main`; GitHub Actions çalıştırılmadı, commit mesajları `[skip ci]`.

**Sonraki gerçek iş:** 26 dönüşmemiş ders içinde sayaç/enerji, takometre, sensör, osiloskop, fiziksel ölçüm araçları ve LCR türlerini **cihazın gerçek davranışını taklit eden işlevsel laboratuvarlara** dönüştür. Sahte devre veya doğrulanmamış ölçüm sonucu üretme. Her ders için pedagojik ve görsel ekran kabulü ayrıca yapılır.


## 2026-10-10 — Ölçüm dersleri dalga biçimi ve frekans/akım uygulama grubu B

**MQ-07 DURUM: KOD DÖNÜŞÜMÜ 24/45; HEDEFLİ DERS/DEVRE TESTLERİ 120/120 PASS; Windows ve tek tek görsel/pedagojik kabul AÇIK.** Önceki 19 geliştirilmiş dersi izleyen 5 özel ders:

- `measurement-workshop-outline-016` — Osiloskop ile ölçüm yapma: düşük gerilimli sanal jeneratör, CH1/GND, kare dalga, periyot ve Vpp.
- `measurement-workshop-outline-044` — Osiloskop ile sinyal ölçümleri: frekans / zaman tabanı karşılaştırması.
- `measurement-workshop-outline-045` — Osiloskopla sinyal ölçümleri: tetikleme, doğru referans, kopuk GND durumunun neden geçerli ölçüm üretmediği.
- `measurement-workshop-outline-033` — Pens ampermetreyle akım ölçümü: zaten doğrulanmış sanal UT200A tek iletken AC RMS laboratuvarına bağlanan ders özel açıklaması ve kontrol sorusu.
- `measurement-workshop-outline-034` — Frekansmetreyle frekans ölçümü: zaten doğrulanmış sanal UT61E+ Hz laboratuvarına bağlanan T=1/f uygulaması.

**Üretim:** `dist/tutorial-measurement-batch-b.js` beş dersin her birine farklı öğrenme hedefi, görev, konu kontrol sorusu ve gerçek proje bileşenlerini bağlar. Üç osiloskop dersindeki `arduino-signal-generator` OUT→`arduino-oscilloscope` CH1 ve GND→GND gerçek devre kablolarıyla bağlıdır; yalnız sanal 0–5 V kaynak kullanılır. `dist/tutorial-mode.js` içinde 50 Hz / 1 kHz / 10 kHz presetleri, gerçek `DTSArduino.tick` sonucundan hesaplanan CH1 `_scopeStats1.freq`, `vpp`, periyot ve geçersiz GND uyarısı vardır. Ölçüm değeri yalnız statik metinden üretilmez; örneklenen dalga izi runtime'dan gelir. `tutorial.css` kontrolleri yalnız mevcut sürüklenebilir yüzer öğretim penceresine yerleştirir; çalışma sahnesi boyutunu değiştirmez.

**MQ-12 kanıt:** Yerel proje ZIP çalışma kopyası + yeni B modülü/UI: `node scripts/check.cjs` **PASS** (224 JS, 106 bağımlılık, 728 malzeme, 58 korunan proje); `node --test --test-concurrency=4 tests/tutorial-*.test.cjs tests/lesson-circuit-audit-v119.test.cjs` **120/120 PASS**, 0 FAIL. `tests/tutorial-measurement-batch-b-v11920.test.cjs` 5/5 PASS: 3×(50,1000,10000) Hz Arduino osiloskop ölçümünde sinyal frekansı doğru, genlik 5 Vpp, CH1 tetikleme geçerli; GND kaldırıldığında frekans ölçümü sahte gösterilmez; UT200A ≈1 A RMS, UT61E+ ≈1000 Hz gerçek `Simulation.solve` okuması. Kullanıcının tüm kodu son GitHub HEAD üzerinde tam regresyondan ve Windows/Edge piksel kabulünden geçmedi; bunlar **PASSED değil**. Korumalı eski dersler ve 45'lik envanter değiştirilmedi.

**21/45 henüz gelişmiş laboratuvar standardında değil:** enerji sayacı/kWh, motor devir takometresi, sensör analog ölçümü, dijital LCR, elektronik devre ölçümleri, metre/kumpas/mikrometre/lüksmetre/desibelmetre/termometre ve genel ölçüm teorisi. Özellikle enerji sayacı veya takometre için gerçek ölçüm runtime'ı doğrulanmadan başka cihazın ekranıyla sahte sonuç gösterilmeyecek. Bunlar sonraki ayrı paketlere bölünür.

MQ-13: Repo `uysalayhan23/DevreTasarimStudyo` `main`; GitHub Actions kullanılmadı. Commitlerde `[skip ci]`. MQ-00 final DONE değil; 24/45 yalnız kod düzeyinde geliştirilmiş ders kapsamıdır.


## 2026-10-10 — Ölçüm batch B son yerel 841-test regresyonu

- Özel beş ders ve güncellenen gerçek osiloskop UI/presetleri üzerine kurulu son yerel çalışma ağacı: `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs` **841 TOPLAM / 838 PASS / 3 FAIL / 0 SKIP / 289997.89 ms**. Üç başarısızlığın tümü `tests/repo-lock-integrity-v11920.test.cjs` içindeki (1) WP-017 pinned baseline, (2) normalized workflow self-reference, (3) integrity checker mutation digest vakalarıdır; kullanıcı ZIP'inde gerçek `.git` geçmişi bulunmadığından `git show/merge-base` çalışmaz. Bu üç vaka **PASS değildir**.
- Bu turdan önce, yeni `tutorial-measurement-batch-b-v11920.test.cjs` (5/5) ve diğer öğretici/lesson-circuit testleri toplam **120/120 PASS**. Tam koşuda öğretici/simülasyon için ek FAIL oluşmadı. `node scripts/check.cjs` **PASS** (225 JS dosya syntax, 106 bağımlılık, 728 malzeme, 58 korunan örnek).
- Son cache düzeltmesi: `dist/index.html` içindeki `tutorial-bootstrap.js` rev `20261010-measure-batch-b1`; eski HTML'in önbellekten geçen yükleyiciyi çağırması önlendi, 7 ilgili test mevcut sürüme hizalandı, öğretici grup yeniden **120/120 PASS**.
- Kaynak eşitliği sınırı: Yerel test ağacı kullanıcı ZIP'i üzerinde yeni modül/UI/testler uygulanarak oluşturulmuştur; GitHub son HEAD ile root-tree SHA birebir eşitliği bu turda ispatlanmadı. GitHub `main` üzerinde ayrı dosya sözdizimi/yükleme kontrolleri yapılmıştır. Yerel 838/841 sayısı **GitHub son HEAD üzerinde çalışan Actions ya da Windows testi değildir**.
- GitHub Actions tetiklenmedi; commitler `[skip ci]`. Eski Windows `BASLAT.bat` `file:///` başlatma kilidi, gerçek pano fiziksel boyutları ve kaynak maskesi kuralları korunur.
- MQ-00 final kararı: **24/45 gelişmiş ders kodu hazır; 21/45 dönüşüm bekliyor; nihai Windows/Edge görsel ve her dersin pedagojik kullanıcılı kabulü açık.** Üç native Git testi uygun checkout olmadan geçmiş sayılamaz.


## 2026-10-10 — Batch C enerji analizi ve sanal takometre laboratuvarları

**MQ-07 kod doğrulamalı durum: 27/45 gelişmiş ders; 18/45 hâlâ dönüşüm bekliyor; kullanıcı Windows görsel/pedagojik final kabulü AÇIK.**

Önceki 24/45 sayımı gerçek kod `rich-reference-v1` envanterinde yeniden kontrol edildi ve **doğrulandı**. Bu 24 içinde `measurement-workshop-outline-035`, `036`, `037` enerji analizi dersleri zaten bulunuyordu. Batch C bu üç dersin **konuya özgü amaç, uygulama ve sorularını özelleştirir** fakat üç yeni ders saymaz. Yeni gelişmiş laboratuvara dönüştürülen dersler şunlardır:
- `measurement-workshop-src-09`: Motor devir sayısının sanal temassız takometre ile ölçümü.
- `measurement-workshop-outline-023`: Takometre ölçümlerinde rpm ve tur/s ilişkisinin öğrenilmesi.
- `measurement-workshop-outline-024`: Dijital takometreyle sanal motor devri karşılaştırması.

**Teknik içerik:** `dist/tutorial-measurement-batch-c.js` bu 6 derse özgü konu hedefleri ve test soruları yükler. Enerji analizi üçlüsü mevcut doğrulanmış `energy-analyzer-1p` + sanal 230 V eğitim yükü modelini kullanır; P/Q/S/PF ve Wh hesapları `Simulation.solve` ve `_energyAnalyzer` durumundan gelir. Dirençli 230 W/0 var/PF=1, endüktif 184 W/+138 var/PF=.8, kapasitif 184 W/−138 var/PF=.8 referansları fiziksel modelle eşleşir. Sanal 1 saat sonunda dirençli 230 W yük için enerji yaklaşık 230 Wh = 0,230 kWh'dir.

Takometre laboratuvarlarında sanal `supply-3p` ile `motor-3p` güç yolunun 4 gerçek bağlantısı vardır; `tutorial-tachometer` **elektrik terminaline bağlanmaz**. Mevcut motor simülasyonunun `_motorRPM` verisine ve `_active` durumuna bağlı 750/1500/3000 rpm kontrolleri yüzer ders anlatımı penceresindedir. Besleme koparsa geçerli RPM gösterilmez. Bu okumalar **sanal motor modeli** kaynaklıdır; kalibre edilmiş bağımsız optik sensör donanımı simülasyonu olarak sunulmaz.

**MQ-12 hedefli delil:** `node scripts/check.cjs` **PASS** (227 JS syntax, 106 dependency, 728 material, 58 protected examples). `node --test --test-concurrency=4 tests/tutorial-*.test.cjs tests/lesson-circuit-audit-v119.test.cjs` **126/126 PASS**, yeni `tests/tutorial-measurement-batch-c-v11920.test.cjs` **6/6 PASS**. GitHub `main` üzerinde yeni modül/arayüz JS parse, 6 dersin kimliği, 3 enerji + 3 takometre kaynak eşlemesi, yükleyici, CSS ve buton entegrasyonu ayrıca kod-içi smoke ile doğrulandı. Bunlar Windows ekran görüntüsü onayı değildir.

**Kalan 18 ders:** gerçek enerji sayacı endeksinin modellenmesi (`src-08`, `outline-038`), sensör gerilim/sinyal ölçümü (`src-10`), LCR, uzunluk/kumpas/mikrometre, ışık/ses/sıcaklık ölçüm araçları, cihaz sınıflandırmaları ve diğer teori/elektronik ölçü başlıkları. Gerçek sensör ve cihaz modeli olmadan sahte sonuç üretilmez.

**Kilitler:** Yüzer ders penceresi, büyütülmüş yazılar, ilk tıklamayla gizlenen bağlamsal açıklamalar, sağ panel, 2 scene-unit/mm, karşıdan görünüş ve localhost'suz `BASLAT.bat` korunur. GitHub Actions tetiklenmez, bütün commitler `[skip ci]` içerir. Tam Git-history/Windows görsel kabulü ve ana MQ-00 CLOSED ayrı kapıdır.


## 2026-10-10 — Batch C tam regresyon 844/847

**MQ-12 yerel son tur:** Kullanıcının yüklediği ZIP üzerine uygulanmış C paketi ile `node --test --test-concurrency=6 --test-reporter=tap tests/*.test.cjs` sonucu **847 TOPLAM / 844 PASS / 3 FAIL / 0 SKIP**, yaklaşık 300,05 saniye. Başarısızlıkların tamamı `tests/repo-lock-integrity-v11920.test.cjs` kaynaklıdır: **WP-017 pinned baseline**, **workflow baseline self-reference**, **integrity checker mutation digest**. Kullanıcı ZIP'inde gerçek `.git` olmadığı için bunlar **PASS sayılmadı**. Öğretici, enerji analizörü, motor RPM, yüzer koç ve simülasyon testlerinde FAIL yoktur.

`node scripts/check.cjs` ayrıca **PASS** (227 JS, 106 yerel dependency, 728 malzeme, 58 korunan örnek). Hedefli `tests/tutorial-*.test.cjs` + `tests/lesson-circuit-audit-v119.test.cjs` koşusu **126/126 PASS**; C paketine özel 6 testin tamamı geçti. GitHub `main` kaynakları ayrıca JS parse/öğretici yükleme/altı ders kimliği ve enerji-takometre preset entegrasyonu açısından smoke-pass oldu.

**Kaynak sınırı:** 844/847 Node koşusu kullanıcı ZIP'i tabanlı **yerel çalışma ağacından** alındı; son GitHub HEAD root-tree SHA birebir eşleştirilip aynı tam komut GitHub checkout içinde yeniden çalıştırılmadı. Bu sebeple sonuç GitHub Actions veya Windows kullanıcı kabulü şeklinde etiketlenmez. Github Actions çalıştırılmadı, bütün commitler `[skip ci]`.

**MQ-00 güncel sonuç:** 45 derslik ölçme serisinde gerçek `rich-reference-v1` sayımı **27/45**, 18 ders dönüşüm bekliyor. Önceki 24/45 sayımı doğrudur: bu paket 3 mevcut enerji dersi özelleştirmesi + **3 yeni** takometre laboratuvarı yapmıştır. Gerçek optik sensör kalibrasyonu veya fiziksel Windows/Edge/piksel kabulü tamamlanmış değildir.


## 2026-10-10 — 45/45 ölçüm müfredatı kod kapsamı ve kaynak dürüstlüğü

**MQ-07 kod aşaması: 45/45 `rich-reference-v1` / görsel, fiziksel cihaz ve Windows son kabulü AÇIK.** Kullanıcının "tüm sıralı işleri toplu yürüt" talimatıyla eski 27/45 üzerine kalan **18 dersin tamamı** `dist/tutorial-measurement-batch-d.js` modülünde tek bir devam zinciri olarak işlendi.

- Gerçek GitHub `main` üzerinde `tutorial-lessons.js → tutorial-expanded-lessons.js → tutorial-source-outline.js → tutorial-pedagogy.js → batch A → batch B → batch C → batch D` zinciri birlikte çalıştırıldı: **1.655 ders, 45 ölçüm dersi, 45/45 rich-reference-v1, batch D 18/18, 18 farklı konu kontrol sorusu**, kod yükleme hatası sıfır.
- D laboratuvarlarının iki enerji dersi (`src-08`, `outline-038`) mevcut gerçek sanal enerji analizörü P(W)/Wh modelinin zamanlı kWh endeksini kullanır; gerçek bağımsız sayaç donanımı taklidi yapılmaz. PNP sensör dersi (`src-10`) için gerçek `CCSSensors` kontak modeline göre metal 2 mm'de **24 V**, 10 mm'de **0 V** UNI-T DCV ölçümüne uygun gerçek prob konumu, VΩmA/COM, `meterPosition=4` düzeltildi. Gereksiz ikinci prob kopyaları kaldırıldı ve yeniden kurma adımları gerçek BN/BU güç uçlarıyla eşleştirildi. Canlı sensor deneyi yerel `Simulation.solve` ile bağlantılı hedefte 24.0 V, hedef uzakta 0.0 V, çözüm stable/shortCircuit=false sonucuyla doğrulandı.
- Elektriksel ölçüm terimleri, ölçü aleti sınıfları ve elektronik dalga ölçümü başlıkları daha önce doğrulanmış UNI-T veya osiloskop devrelerinden, kendi öğrenme görevi/sorusu korunarak yararlanır.
- Metre, kumpas, mikrometre, lüks, desibel, sıcaklık ve LCR başlıklarında **kalibre donanım olmayan dürüst sanal eğitim modeline** göre senaryolar, birimler ve formüller verilir. Tam 13 workbench/ders içeriğinde 164 durum-sonuç/şema/uygun aralık kontrolü gerçek GitHub D modülü üzerinden JS ile **164/164 PASS**; her birinde model kaynağını açıklayan sınır uyarısı vardır. Üretici fotoğrafı yerine mevcut yüzer anlatımın içinde küçük SVG öğretim çizimleri bulunur; kaynak ölçüleri birebir fiziksel alet iddiası taşımaz.
- Yeni `tests/tutorial-measurement-batch-d-v11920.test.cjs`: gerçek 45 ders envanteri, 18 yeni ders, kanonik devre, enerji zaman birikimi, PNP 0/24V UNI-T, sanal fiziksel ölçüm hesapları, mikro açıklama/pencere/caching gibi **7 Node test tanımı** içerir. Bu test dosyası GitHub'a işlendi; **GitHub `main` üzerinde gerçek Node çalıştırması bu turda yapılmadı**, dolayısıyla 7/7 PASS gibi bildirilmez. V8 ile yapılan gerçek GitHub içerik testi ve yerel sensör fizik testi ayrıca yukarıda belirtilmiştir.
- Testlerdeki önceki D1 script/CSS beklentileri güncel D2 sürümüne hizalandı; `index.html` ve `tutorial-bootstrap.js` cache rev `20261010-measure-batch-d2`, `tutorial-measurement-batch-d.js` rev `1.19.20-batch-d2`. Dökümde her ders, kod kaynağı, simülasyon/hesap şeffaflığı ve açık görsel kabul bilgileri `docs/MEASUREMENT_45_LESSON_ACCEPTANCE_MATRIX_V1.19.20.md` matrisine yazıldı.
- **MQ-00 NOT DONE:** Gerçek Windows/Edge `file:///` ekran QA, üreticiye uygun fiziksel cihazların görsel doğruluğu, bağımsız gerçek lux/dB/LCR/enerji sayaç donanım modelleri, kaynak RGB maske kenarları, 3 native Git-history testleri ve güncel GitHub SHA-eş tam Node suite açık. `45/45`, **kod-içerik/etkileşim kapsamıdır**, tamamı kalibre laboratuvar ve kullanıcı nihai kabulü değildir.
- Mevcut günlük `844/847` sonucu **önceki batch C yerel ZIP ağacına aittir**; bu yeni D2 head'e mal edilmez. Actions çalıştırılmadı; commitlerde `[skip ci]`. Repo ve dal: `uysalayhan23/DevreTasarimStudyo` / `main`.

**Sonraki otomatik çalışma sırası:** 45 dersin her biri için gerçek ekran akışları/görsel kaynak QA → açık gerçek cihaz modelleri ve screenshot düzeltmeleri → mevcut motor/termal ve sensör çalışma güvenilirliği → Git geçmişi olan checkout'ta tam Node+Windows file launcher kabulü → standart modeli diğer Temel Elektrik başlıklarından başlayarak kalan öğretim müfredatına yayma. Her kapı kaynak kanıtıyla kapanır; yeniden izin istenmez ve Actions kullanımı için ayrı açık yetki şartı korunur.


## 2026-10-10 — Doğru akım kod kapsamı 10/10 ve 2S2P gerçek pil deneyleri

**MQ-07 yeni konu grubu:** `dc-circuits` bölümünde mevcut 4 rich devreye ek 6 ders `dist/tutorial-dc-batch-e.js` ile farklı öğrenme hedefi, uygulama sırası ve konu soruları taşıyan `rich-reference-v1` oldu. Gerçek Github ders üreticisi üzerinde **10/10 DC, 45/45 ölçme, toplam 55/1.655 rich kod** doğrulandı. Kalan 1.600 dersin zengin öğretim üretimi ve 55 dersin gerçek Windows/görsel kabulü henüz açık.

**Gerçek ölçüm bulgusu:** Eski seri-paralel pil kartı dört adet 1,5 V hücreyi yalnız sembolik gösteriyordu. Gerçek `Simulation.solve` deneyinde paket bilgisi olmadan kablolu 2S2P 1,5 V okunabildiği tespit edildi; her seri koldaki hücreye ayrı `seriesPackId`/index verildiğinde **3,00 V**, 100 Ω dirençte **0,030 A**, gerçek `unit-ut33d-plus` + hareketli prob bağlantısında **3,00 V DCV** doğrulandı; `blocked=false`, `stable=true`, `shortCircuit=false`. Bu teknik kimlik zorunludur; yalnız teller çizilerek 3 V sonucu uydurulamaz.

Yeni 2S2P projede 6 gerçek işlevsel kablo, 2 önceden bağlı ve serbest hareket eden UNI-T prob bağlantısı kullanılır; eski iki pilli seri/paralel canonical projeler değiştirilmez. DC-01, DC-02, DC-03, DC-04 ve DC-06 için mevcut kabul edilmiş devrelerde konuya özgü ölçüm/yeniden kurma adımları genişletildi.

**MQ-12:** Gerçek GitHub müfredatındaki dokuz kaynak modül + E zinciri JS ile yüklendi: 1.655 kurs, 45 ölçüm, 10 DC, 55 rich, altı farklı yeni DC sorusu, model paketleri ve bağlantılar için **8/8 kaynak smoke PASS**. Fiziksel 2S2P sonuçları GitHub ile SHA-eş `simulation.js`, `tutorial-components.js` ve `tutorial-pedagogy.js` kullanan yerel çalışma ağacında ölçüldü. `tests/tutorial-dc-batch-e-v11920.test.cjs` içinde **5 Node test tanımı** kaynak regresyonuna eklendi; **gerçek son GitHub HEAD'de Node suite çalıştırılmadı**, dolayısıyla bu beş test için Node PASS raporlanmaz. 
**MQ-00 NOT DONE:** Her dersin gerçek ekran/arayüz, tüm üretici front görselleri, pil klemens geometri tutarlılığı, Windows file launch, tüm SHA-eş Git testleri ve geniş öğretim dönüştürmesinin kalan 1.600 dersi açık. GitHub Actions sıfır, commitler `[skip ci]`.


## 2026-10-10 — Kontrol devreleri batch F: 13 ders, gerçek fiziksel bağlantılar korundu

**MQ-07 gelişmiş öğretim kodu kapsamı: 68/1.655; geri kalan 1.587.** Ölçme 45/45 + doğru akım 10/10 + kontrol alt gruplarında **buton/LED 5/5, buton/röle 4/4, Start/Stop mühürleme 4/4** ayrı zengin hedef ve etkileşimli konu kontrolü içerir. Bu sayılar **kod kapsamıdır, MQ-00 gerçek ekran/pedagojik nihai kabulü değildir.**

- `dist/tutorial-control-batch-f.js` kanonik 13 devrenin `project.components`, `project.wires`, `steps`, gerçek terminal ve simulator nesnelerini **değiştirmeden** ders bazlı öğrenme hedefi, beş basamaklı öğretim akışı ve birbirinden farklı 13 soru ekledi. `dist/tutorial-mode.js` mevcut `measurementUpgradeCard` yüzer öğretim penceresine bu içerikleri gösterir; sahne alanı ve mikro açıklama davranışı korunur.
- Sanal dersler arasında NO buton → direnç/LED; NC buton → LED; 24 V ikaz, 5 V Arduino D2/D13; röle bobini/NO yardımcı kontak, Arduino D8 röle; Start/Stop + kendi NO yardımcı kontağıyla tutma zinciri vardır. 230 VAC aydınlatma örneği **yalnız sanal simülasyonda** gözlenir; gerçek şebeke bağlantı talimatı verilmez.
- **GitHub kaynak kanıtı:** Son `main` üzerinde dokuz ders üretim modülü (F dahil) yüklenerek **1.655 ders, 68 rich, 13/13 kontrol rich, 13 farklı konu sorusu** doğrulandı. 13 dersin kaynak `project.wires` FNV32 özeti, kullanıcının yüklediği ZIP'deki önceki kanonik kontrol devresi kablolarıyla **13/13 birebir eşleşiyor**. Bu eski ZIP içinde kaynak bağlantıların testine ayrılmış kanıt SHA eşitliğidir; tüm ZIP'in HEAD ile eşitliği değildir.
- **MQ-12 fiziksel yerel test kanıtı:** Git blob SHA **`11de031f1700871286c2a0d1af16b6f681875f9a`** olan simülasyon çözücüsü hem mevcut GitHub `main` hem ZIP'de aynıdır. Eski ZIP'teki kanonik 13 bağlantı ağı ile `Simulation.solve`: **13/13 stabil, blocked=false, shortCircuit=false**, cihaz tanımı eksik değil. NO/NC LED ve röle durum geçişleri; dört Start → Start bırak → Stop mühürleme dizisi ayrıca doğrulandı. Bu test gerçek yeni HEAD'deki tüm dosyaların Node ile koşturulduğu iddiası değildir.
- Yeni `tests/tutorial-control-batch-f-v11920.test.cjs` içinde **6 Node test tanımı** kayıtlı: 68/1.655 kapsam, bit-düzeyi bağlantı değişmezliği, NO/NC LED, röle, dört mühürleme zinciri ve yüzer UI/cache. **Güncel HEAD üzerinde Node çalıştırıldığına dair kanıt yok; bu altı test PASSED etiketlenmez.**
- Repo yalnız `uysalayhan23/DevreTasarimStudyo`/`main`, geçici dal/force-push yok; bütün commitler `[skip ci]`, Actions tetiklemesi yapılmadı. `docs/TEACHING_1655_TOPIC_QUALITY_MATRIX_V1.19.20.md` 68/1.655 ve kalan 1.587 olarak güncellendi.

**Sıradaki otomatik sıra:** (1) `timer-flipflop` 4 ders için canlı zaman/duty simülasyonu ve özel öğretim kartları, (2) `commutator`, `two-way`, `intermediate` aydınlatma simülasyonları; (3) güvenli sanal zil devreleri ve 4–20 mA döngüleri; (4) seçilen sonraki konular ve konu matrisi; (5) gerçek HEAD eşit Node regresyonu, Windows `file:///dist/index.html` UI, gözle görülür sahne ve mikro açıklama kabulü. Tek tek geri onay isteme; GitHub Actions ise yalnız ayrı açık izinle çalıştırılabilir.


## 2026-10-10 — Zaman rölesi batch G: dört dersin gerçek süre/asimetri düzeltmesi

**MQ-07 kaynak kod kapsamı: 72/1.655, kalan 1.583.** Kontrol batch F 13/13'e ek olarak `timer-flipflop` 4/4 zengin öğretim kapsamına alındı. Toplam 17 ders iki arka arkaya iş grubunda işlendi.

- **Kök neden onarımı:** Asimetrik derslerin kanonik `coil-flasher` elemanı zaman tanımı taşımıyordu. `DTSDeviceBehavior.timed` böyle bir durumda 1/1 saniye varsayılanını kullanıyordu. `dist/tutorial-timer-batch-g.js` bu dersler için `flashOn` ve `flashOff` değerlerini sırasıyla 1/1, 0,5/1,5, 1,5/0,5 ve 1/1 saniye olarak tanımlar. **8/8 gerçek terminal kablosu** her derste değiştirilmeden korunur.
- Öğrenciye konuya özel amaç, 5 basamaklı simülasyon görevi ve farklı konu kontrolü yüzer anlatım penceresinden sunulur; çalışma alanı/mikro açıklamalar/sağ panel ve karakteristik fiziksel malzeme geometri kilitleri korunur. 230 VAC sahneler yalnız sanal yazılım devresi olarak aktarılır.
- **GitHub gerçek kaynak kontrolü:** Tüm öğretim modülleri aynı sırayla yüklendi; **1.655 ders, 72 rich, 4/4 timer, 4 farklı soru**. Dört flaşör projesinin `project.wires` özetleri karşılaştırıldı, hepsi eski kabul edilmiş kablo ağlarıyla aynı.
- **Yerel gerçek simülasyon kanıtı:** Kullanıcının ZIP'inde bulunan ve GitHub `main` ile blob SHA `11de031f1700871286c2a0d1af16b6f681875f9a` eşitliği doğrulanan `simulation.js` ile, dört flaşör kanonik devresine doğru `flashOn/flashOff` uygulanarak farklı zaman noktaları test edildi. 1/1 ve asimetrik 0,5/1,5 ile 1,5/0,5 süreçlerinde **yeşil ve kırmızı lambalar birbirinin tamamlayıcısı**, tüm kontroller stabil ve `blocked=false/shortCircuit=false`.
- `tests/tutorial-timer-batch-g-v11920.test.cjs` içinde **4 yeni Node test tanımı**; `tests/tutorial-control-batch-f-v11920.test.cjs` içinde önceki **6 yeni Node test tanımı** vardır. **Son GitHub HEAD'de bu testlerin gerçek Node koşusu henüz yok**, bu nedenle test tanımlarını `PASS` ilan etmiyoruz. Eski ZIP `.git` geçmişi içermediği ve müfredat kodu yeni HEAD'den farklı olduğu için tam suite sonuçları güncel HEAD'e taşınamaz.
- `docs/TEACHING_1655_TOPIC_QUALITY_MATRIX_V1.19.20.md` gerçek 72/1.655 kod kapsamı ve kalan 1.583 ders olacak şekilde güncellendi. MQ-00 gerçek Windows/Edge `file:///dist/index.html` görsel/pedagojik kabulü, üreticiye uygun malzeme fotoğrafları, tüm SHA-eş HEAD regresyonu ve 3 native Git-history testi açık. GitHub Actions kullanılmadı, `[skip ci]` korundu.

**Sıradaki otomatik süreç:** `commutator` → `two-way` → `intermediate` → `bells` güvenli sanal aydınlatma/zil dersleri; her derste gerçek bağlantı ve anahtar konumu doğrulanır. Sonra 4–20 mA / loop-powered / active-passive sensör ölçümleri ve diğer 43 konu. Her dilim için manifest/kapsam, QA, GitHub commit, test delili; Actions asla izinsiz değil.


## 2026-10-11 — MQ-P1-016 açıldı: open-collector-3 kaynak devresi ve H/J eğitim QA

**Durum: OPEN / MODELE DAYALI DOĞRULAMA BEKLİYOR.** Bu bulgu önceki P1 kayıtlarından farklı, somut kanonik sensör devresi kök nedenidir. İlgili öğretim metni güvenilir sınırı belirtecek şekilde güncellendi; fiziksel kaynak devre veya pinler değiştirilmedi.

- **Kanonik kanıt:** `open-collector-3` için `s=proximity` (PNP), `g1/P→r/1`, `r/2→s/BK`, `s/BK→h/X1`, `h/X2→g1/M`; `r` 1000 Ω. Yalnız kablo grafiği ve ideal direnç/yük bağlantılarına göre sensör çıkışı OFF kabul edildiğinde de kaynaktan lambaya **R1 üzerinden bir yol** bulunur. Bu, gerçek lamba parlaklığının veya solver sonucunun kanıtı değildir.
- `open-collector-1` PNP/dirençsiz, `-2` NPN/dirençsiz, `-4` NPN olup R1 ile H1 +→BK kolları paraleldir. Varyantların quiz/amaç/metinleri artık bu farklılıkları açık anlatır. `-3` için `sourceCorrectionRequired=true` ve `sourceStatus=canonical-graph-physical-review-required` işaretlendi; `simulationAcceptance=false` korundu.
- **Zil 4. varyantı:** `bells-4` kaynak devresinde B1–B3 yanında `bell-light-push` B4 de iki adet NO 13/14 teliyle dördüncü çağrı noktasıdır. Ayrı buton ışığı çıkışı yoktur; öğretim metninde B4 açıklandı, gerçekte olmayan ışık simülasyonu iddia edilmedi.
- **Çalıştırılan kaynak QA:** GitHub `main` JavaScript'inin 16 modülü V8 içinde yürütüldü: 1.655 ders, 136 `rich-reference-v1`. Kanonik karşılaştırma **Batch G sonrası, H öncesi** tabanına göre yapıldı: H–L **64/64** projenin bileşenleri, kabloları ve guided steps değişmedi; bağ/step uyuşmazlığı yok. Bu Node `--test`, gerçek Chromium veya Windows son kabulü değildir.
- **Sonraki MQ-05 görevi:** Aynı HEAD'in gerçek `Simulation.solve` ile `open-collector-3` PNP algılamayan/algılayan durumlarında R1 ve H1 akım/gerilim sonuçlarını ölç; `-1/-2/-4` kontrol grubuyla kıyasla. Kanonik şema değişikliği ancak terminal/topoloji etki denetimi, migration, uzman çapraz kontrolü ve MQ-00 kararıyla yapılır. Fiziksel ölçüm ve Node regresyonu gerçekleşmeden DONE verilmez.
- Aktif yeni repo `uysalayhan23/DevreTasarimStudyo`, çalışma dalı `main`; GitHub Actions kullanımı **yok**, `[skip ci]` geçerli.


## 2026-10-11 — MQ-P1-016 düzeltme yürütmesi: kaynak + özgün solver PASS / Windows OPEN

Önceki bölümün hata tarifi **tarihsel başlangıç kanıtıdır**; aşağıdaki düzenlemeler son güncel durumu belirtir.

- **MQ-05 doğrulanan kök neden:** Gerçek GitHub `dist/library.js` blobundan 702 özgün malzeme tanımı ve gerçek `dist/simulation.js` ile 4 open-collector projesi iki algılama durumunda çalıştırıldı. Hatalı kaynak `open-collector-3` sensör OFF: R1 üzerinden **12 mA H1** akımı, ekranda ise lamba pasifti; sensör ON: H1 **24 mA**. Diğer 3 varyantta OFF/ON anahtarlama davranışı düzgündü.
- **MQ-05 uygulama:** Yalnız `sensorCircuit(v,'open-collector')` üreticisinin 3. PNP varyantında R1, önceki `+24 V → 1 kΩ → BK` yolundan `BK → 10 kΩ → 0 V` pull-down yoluna çevrildi. `proximity` PNP ürün kimliği, H1 ve diğer kablolar, tüm ayrı projelerin kimlikleri ve diğer 3 varyant korunur. **Bu bir kasıtlı, tek-devre kanonik kaynak düzeltmesidir**; önceki 64/64 *değişmezlik* raporu yeni HEAD için birebir tüm H–L kaynaklarının aynı olduğu anlamına gelmez.
- **Gerçek ürün tanımları + solver yeniden yürütmesi:** 3. varyant **OFF H1 = 0 mA, R1 = 0 mA, lamba pasif**; **ON H1 = 24 mA, R1 = 2,4 mA, lamba aktif**. Tüm dört varyantta OFF/ON `blocked=false, stable=true, shortCircuit=false`. Bu kanıt bağlı GitHub kaynaklarının V8 içinde yürütülmesiyle alınmıştır; tam Node `--test` / Windows görsel kabulü değildir.
- **MQ-07:** Üçüncü dersin açıklaması ve quiz 10 kΩ PNP pull-down modeline taşındı. Dört varyantın PNP/NPN farkları korunur. Kaynak solver kanıtı öğretim metadata'sına işlendi; `visualAcceptance=false` ve tam `simulationAcceptance=false` Windows kapısı kapanana kadar korunur.
- **MQ-12/MQ-13:** `tests/tutorial-open-collector-pulldown-v11920.test.cjs` gerçek Node yürütmesinde özgün kütüphane/solver, OFF/ON akımları ve üç korunmuş varyantı denetlemek için eklendi. H–L Windows QA Node listesi ve SHA-256 kaynak izi buna göre güncellendi. `tutorial-lessons.js → tutorial-mode.js → tutorial-sensor-batch-j.js` ve bootstrap/index önbellek sorguları yeni sürümü zorlayacak şekilde yenilendi.
- **Açık kabul:** Yeni `main` HEAD üzerinde gerçek `node --test`, 64 H–L dersinin Chromium/Windows `file:///` ve 100 PNG kabulü, ayrıca eski kaydedilmiş `tutorial-open-collector-3` projelerinin otomatik sessiz değiştirilmemesi/migration etkisi kanıtlanmadan MQ-P1-016 **DONE** değildir. Pano gerçek ürün ölçüsü veya donanım emülasyonu kapsamında ek başarı iddiası yoktur.
- GitHub Actions kullanılmadı; bütün yeni commitler `[skip ci]`.


## 2026-10-11 — MQ-P1-016 kayıtlı eski devre uyumluluk düzeltmesi (MQ-13/MQ-10/MQ-12)

- Eski `tutorial-open-collector-3` kaynak tasarımından türetilen `.odsdevre` kopyaları, kullanıcının sahip olduğu **bağımsız proje dosyalarıdır**. Genel proje şema sürümü hâlâ v7 olduğundan böyle bir kaydı import sırasında 10 kΩ şemasına otomatik dönüştürmek **yasak**; tarihsel kaynak korunmalı.
- `dist/project-store.js` içine salt-okunur `legacyCollectorPullup(project)` ve `compatibilityWarnings(project)` eklendi. Yalnız PNP `proximity`, 1 kΩ R1, G1+/R1/BK/H1/0 V ve BN/BU besleme bağlantılarının birlikte bulunduğu **tam** eski topoloji tespit edilir. Kabloyu ters yönde kaydetmek sonucu değiştirmez. Farklı ürün veya eksik topoloji uyarı oluşturmaz.
- `dist/studio.js` eski proje açıldığında açıklayıcı uyarı gösterir; kaydedilen komponent, direnç ve kabloları **sessizce yeniden kablolamaz**. Düzeltilmiş yeni öğretici örneğe yönlendirir; kullanıcı dosyasına otomatik `migration` uygulanmaz.
- **Ek bypass kapatıldı:** Dashboard `Projeye Devam Et` ile otomatik geri yüklenen eski yerel taslak da aynı uyarıyı gösterir; yalnız Dosya Aç/disk klasörü yollarına güvenilmez. Dört dosyalı kontrol zincirinde `project-store.js`, `studio.js`, `library.js` ve genişletilmiş müfredat kaynakları QA SHA-256 izine alındı.
- `dist/index.html` üzerinden `project-store.js` ve `studio.js` önbellek sürüm sorguları güncellendi. Kaynağın tamamı `[skip ci]` commitleriyle yeni `main` dalına işlendi, Actions kullanılmadı.
- `tests/project-legacy-collector-pullup-v11920.test.cjs` eski-yeni ayırımı, ters tel uçları, kullanıcı kayıtlarının unchanged parse/roundtrip'i ve açılış uyarısı sözleşmesini kontrol eder. Windows H–L QA listesinin, SHA-256 kaynak izi listesinin ve QA sözleşme testinin içine eklendi.
- **Gerçek çalışma kanıtı:** Bağlı GitHub `main` sürümünün `project-store.js` ve kanonik `tutorial-lessons.js` dosyaları V8'de yürütüldü. Eski şema algılandı; yeni şema algılanmadı; ters uçlu eski kablolar algılandı; eksik şema algılanmadı; `Projects.parse` ve `Projects.clean` kaynak kablo/direnç verisini eşit tuttu. QA dosyalarının JavaScript sözdizimi doğrulandı. Bu **bağımsız güncel HEAD Node `--test` / gerçek Windows UI kabulü değildir**.
- **Kalan kabul:** Yeni QA Node testlerinin gerçek yürütmesi; Windows/Edge açılış modalının gerçek görüntüsü; 64 H–L ders / 100 ayrı PNG, UI ve pedagojik kabul; eski .odsdevre import + save file-on-disk davranışına ilişkin uçtan uca kanıt. Dolayısıyla MQ-P1-016 genel DONE / MQ-00 genel kapanış **açık**.


## 2026-10-11 — Tek geçişte toplu müfredat ve kalite zinciri (MQ-00)

**Aktif repo:** `uysalayhan23/DevreTasarimStudyo` · **dal:** `main` · GitHub Actions **çalıştırılmadı** · commitler `[skip ci]`.

**Tamamlanan ve gerçek kaynakta yürütülen kod değişiklikleri:**
- `dist/tutorial-topic-review-batch-m.js`: önceki 136 zengin dersle karışmadan, kalan **1.519** dersteki tekrar eden genel sorular yerine ders başlığına özgü ve **21 konu alanının teknik ilkelerine** dayalı 3 seçenekli sorular üretilir. `dist/tutorial-mode.js` yükleyicisine eklendi, bootstrap/index tarayıcı sürüm parametreleri güncellendi.
- Mevcut `1.655` dersin `136` zengin ders ile `1.519` konu kontrolü şeklindeki **kalite ayrımı korunur**. **Kanonik 0 proje değişikliği**; `source-outline`, müfredat kimlikleri, MEB metadata ve locked devreler bozulmadı.
- Bağlı GitHub `main` kaynaklarıyla 18 müfredat modülü V8 içinde gerçek sırayla yürütüldü: **1.655 ders, 1.519 farklı yeni konu sorusu, 136/136 önceki rich kayıt aynı, MEB `audit.invalid=[]`**. `meb.officialOutcomeVerified=0`; resmî kazanım doğrulanmamışsa doğrulanmış sayılmaz.
- `tests/tutorial-topic-review-batch-m-v11920.test.cjs` 1.655 içerik bütünlüğü, 1.519 soru, 136 rich korunumu, projelerin değişmezliği ve idempotence için eklendi.
- `scripts/qa-tutorial-1655-simulation-v11920.cjs` özgün katalog + gerçek `Simulation.solve` ile 1.655 dersi tek tek denetleyip **kablolu/sadece teori** sınıflarına ayıran, eksik tanımlar / devre adımları / başlangıç kısa devre / blokaj ve kararsızlığı raporlayan çalıştırılabilir fail-closed kontrolüdür. Sonuç `build/qa-tutorial-1655-simulation-report.json`. `tests/qa-tutorial-1655-simulation-v11920.test.cjs` tam Node kapısına alındı.
- `QA_TAM_PROJE_CALISTIR.bat` + `scripts/qa-full-windows-v11920.ps1` tek Windows çalıştırmasında **tüm Node testleri → 1.655 solver raporu → H–L 64 ders/100 gerçek PNG → UT200A fiziksel çene/4 PNG** zincirini fail-closed toplar. Günlükler, kaynak SHA-256, ayrı H–L/UT200A kanıt ZIP'leri ve birleşik `run-summary.json` → `build/QA_TAM_PROJE_SONUC_*.zip` içine konur. Önceden oluşturulmuş/stale ZIP'ler yeni kanıt kabul edilmez.
- `BASLAT.bat` üretim `file:///` başlangıcı, golden/locked koşullar, gerçek malzeme geometrileri, özel Windows servis yasağı ve mevcut simülasyon kabloları **değiştirilmedi**.

**Açık kalan işler / kesinlikle DONE ilan edilmeyenler:**
1. **1.519 dersin özgün, gerçek konu anlatımı, ihtiyaç duyulan fiziksel devre geliştirmesi, ölçüm/deney ve pedagojik/görsel kabulü.** Yeni soru katmanı bu 1.519 dersi `rich-reference-v1` yapmaz. Teori derslerine gerçek devre yoksa çalışma varmış gibi gösterilmez.
2. En yeni `main` HEAD'in tam **Node --test**, tüm 1.655 dersin native solver kabulu ve Windows/Edge `file:///` açılış/görsel, 64 H–L / 100 PNG, UT200A / 4 PNG birleşik kabulü. Bu oturumda GitHub DNS yerel erişimi ve gerçek Windows çalıştırma ortamı olmadığı için sonuçlar **UNVERIFIED/OPEN**; henüz gerçek ZIP kanıtı oluşturulmadı.
3. Açık kalan pano ürün W/H/D, terminal doğruluğu, donanım fiziksel model eşleme, kullanıcı akışları ve diğer MQ backlog maddeleri için bağımsız kalite kanıtları. Kapsam taranmadıkça kapatılmadı.

**MQ-00 kapanış ilkesi:** Kod yükleme/V8 kaynak başarısı ≠ tam Node testi ≠ gerçek Windows kullanıcı/görsel kabulü ≠ bütün ders içeriğinin tamamlanması. Sahte kabul sayacı artırılmayacak.


## 2026-10-12 — MQ-12 tüm 1.655 ders kaynak bütünlüğü / fail-closed doğrulama

- `main` üzerindeki 18 kanonik öğretici modülü V8'de gerçek yükleme sırasıyla çalıştırıldı: toplam **1.655**, zengin içerik **136**, konu sorusu yenilenmiş **1.519**, bağlantılı devre **722**, bağlantısız teori/konu alanı **933**.
- Yapısal denetim: **0** eksik proje, **0** tekrarlanan ders ID'si, **0** yanlış bileşen kimlikli kablo ucu, **0** müfredat rehberli-adım/kablo eşleşme hatası, MEB metadata `audit.invalid=[]`. Bu **Native Node solver/Chromium kabulü değildir**.
- Özgün 702 ürün + ilgili malzeme genişletmeleri birlikte V8'e aktarıldı; genişletilmiş katalog **939** model tanımı içerir. *Kanonik outline + pedagogy* tabanındaki 1.655 kaydın tür ve mevcut kablo terminal tanımları test edildi: eksik tür/yanlış terminal **0**. Not: Bu katalog taraması henüz son A–L müfredat katmanlarının her türlü elektriksel çıktısını kanıtlamaz.
- `scripts/qa-tutorial-1655-simulation-v11920.cjs` denetiminde önemli bir fail-open açığı kapatıldı. Önceden **bağlantısı olmayan dersler** malzeme türü doğrulanmadan atlanıyordu. Artık **her dersteki bütün malzeme tanımları**, her bağlantılı dersin gerçek bileşen **pin/terminal veya junction uçları**, her sunulan rehberli bağlantı ve teori dersinin hayalî kablo adımı içerip içermediği kontrol edilir. `tests/qa-tutorial-1655-simulation-v11920.test.cjs` buna göre güçlendirildi.
- `tests/qa-tutorial-1655-failclosed-v11920.test.cjs` dört negatif vaka için eklendi: teori dersinde eksik ürün, yanlış terminal, olmayan birleşim noktası, bağlantısız teoride hayalî kablo adımı. Buna ek olarak geçerli junction yanlış reddedilmez. Bu beş mantıksal durum özgün HEAD denetim fonksiyonu V8'de gerçekten yürütülerek **PASS** görüldü. Test, H–L Windows Node listesine ve kalite sözleşmesine de bağlandı.
- Birleşik `QA_TAM_PROJE_CALISTIR.bat` kanıt zincirindeki kaynak SHA-256 izi artık yalnız örnek dosyaları değil `dist`, `tests` ve `scripts` klasörlerinin JS/CJS ve ilgili kaynak dosyalarını kapsar.
- Makinece okunabilir V8 kanıtı: `evidence/mq12_1655_failclosed_source_20261012.json`.
- **AÇIK:** en yeni `main` SHA'da tam `node --test` yürütmesi, 1.655 dersin özgün sayısal solver koşusu, H–L Windows/Chromium 100 PNG, UT200A güncel 4 PNG, 1.519 dersin özgün fiziksel/pedagojik zenginleştirilmesi ve ilgili pano/donanım backlog işleri. Kapanış gerekmeden **PASSED veya DONE değildir**. Actions kullanılmadı; `[skip ci]` geçerli.


## 2026-10-12 — MQ-05/MQ-07/MQ-12: 1.655 ders, 2.472 özgün V8 elektriksel simülasyon ve uygulama rehberi

**Repo:** `uysalayhan23/DevreTasarimStudyo` · **dal:** `main` · Actions **kullanılmadı** · `[skip ci]`.

- **Ders içeriği (MQ-07):** `dist/tutorial-practice-guide-batch-n.js` ile daha önce `rich-reference-v1` standardında olmayan **1.519** derse, kendi başlığı/malzeme tanımı/sanal kablo uçları ile temellendirilmiş uygulama-gözlem ve teorik kontrol rehberi eklendi. Öğretici koç ekranında görünüyor. **136 rich ders korunuyor; 1.519 yeni rehbere otomatik rich veya pedagojik FINAL verilmiyor**. Rehberler bağımsız rehberli uygulama ile kablo içeren quiz/referans diyagramını ayırıyor.
- **Gerçek kök neden (MQ-05):** `installation-systems-src-08` ve `installation-systems-outline-069` bir adet `building-junction` splice nesnesinin dört terminalinden hem **L** hem **N** geçiriyordu. Kütüphanedeki `splice` türü tüm terminalleri tek iletken düğümü saydığından 2 ders gerçek `Simulation.solve` sırasında **shortCircuit=true** veriyordu. `dist/tutorial-pedagogy.js` `junctionProject` üreticisi bir buatın **iki bağımsız iletken ekini** iki ayrı, görünür sanal splice bileşeni olarak temsil edecek şekilde düzeltildi. Diğer kitaplık modelinin genel iletkenlik tanımı değiştirilmedi. `tests/tutorial-building-junction-isolation-v11920.test.cjs` yeni güvenli kaynak ve tarihsel eski kısa devreyi doğrulama sözleşmesidir.
- **Tam kaynak yürütme:** Bağlı GitHub'dan alınan **19 özgün elektriksel runtime dosyası + 10 gerçek kütüphane/üretici genişletme modülü (939 tanım) + 18 öğretici modülü**, V8 üzerinde bir araya getirilip **gerçek `Simulation.solve`** ile koşturuldu. Nihai kaynak: **1.655 ders**, **722 kablolu**, **933 bağlantısız konu çalışması**, **136 rich**, **1.519 rehber**. **722/722** başlangıç devresi ve **1.750/1.750** sanal anahtar/sensör durumu = **2.472/2.472 PASS**; eksik tanım, kısa devre, engellenmiş/kararsız çözüm ve istisna **0**. Değiştirilen sanal kumanda durumlarında **492** ayrı çıktıda gözlemlenebilir fark görüldü.
- **Bağımsız örnek kanıt:** 90 güncel kanonik devre + 252 sanal kontrol durumu, tam özgün runtime ile **342/342 PASS**. Çalışma dosyası `tests/fixtures/tutorial_native_solver_golden_v11920.json`; kalıcı Node regresyonu `tests/tutorial-native-solver-golden-v11920.test.cjs`.
- **Otomatik kabul kapısı (MQ-12):** `scripts/qa-tutorial-1655-simulation-v11920.cjs` artık hem bağlantısız tüm derslerde eksik malzemeyi, hem 722 kablolu derste gerçek terminal/bağlantı tutarlılığını, hem de osilasyonları reddeder. `scripts/qa-tutorial-1655-dynamics-v11920.cjs` asgari dinamik kapsam ve gerçek değişen çıktılar olmadan PASS ilan etmez. Her ikisi `scripts/run-tests.cjs` tarafından keşfedilen Node testlerine entegredir. Birleşik `QA_TAM_PROJE_CALISTIR.bat` Node+H–L+UT200A kanıtını tek Windows ZIP'te toplamayı sürdürür.
- **Makinece okunabilir QA kaydı:** `evidence/mq05_1655_native_v8_20261012.json` (gerçek kaynakların SHA/blob referansları, test kapsamı, önceki hatalı durum, düzeltilmiş durum ve açık kabul kapıları).

**MQ-00 karar:** Tam **V8 elektriksel başlangıç/anahtar-sensör smoke kabulü PASS**. Bunun anlamı *tüm karmaşık geçişlerin fiziksel doğruluğu, malzemelerin gerçek ölçü/terminal kabulü, Windows görsel kabulü veya 1.519 dersin uzman-pedagojik zenginleştirmesinin tamamlandığı* değildir. En güncel `main` tam `node --test`, gerçek Windows/Chromium `file:///` görsel çalıştırması ve alan uzmanı içerik kapanışı **OPEN**. Kullanıcının bilgisayarında test çalıştırma isteği yok; testlerin çalıştırılması kullanıcıya görev olarak devredilmez.


## 2026-10-12 — MQ-05 durum sürekliliği testleri / Batch N kaynak kabulü

- `dist/tutorial-practice-guide-batch-n.js` ile 1.519 dersin kanonik materyallerine dayanan sanal uygulama ve gözlem rehberleri kodlandı. Öğretici arayüze ve tarayıcı yükleme zincirine bağlandı; **136 rich dersin içeriği korunur**. İlgili `tests/tutorial-practice-guide-batch-n-v11920.test.cjs` dosyasının gerçek test fonksiyonları, GitHub kaynakları yüklenip V8 üzerinde yürütüldü: **2/2 PASS** (Node `--test` yerine kullanılan host-adapter yürütmesi).
- Önceki 722 kablolu ders için **2472 sanal başlangıç/OFF/ON** `Simulation.solve` çalıştırması kaynak kanıtı `evidence/mq05_1655_native_v8_20261012.json` altında korunur; bu kapsam **ardışık aynı proje nesnesinde OFF→ON→OFF** gözlemiyle karıştırılmaz.
- Yeni **ardışık durum testi** `scripts/qa-tutorial-1655-transitions-v11920.cjs` 722 kablolu dersteki sanal anahtar/sensörler için aynı devre örneğini art arda OFF→ON→OFF çalıştırır, kısa devre, kararsızlık, blokaj ve osilasyonları fail-closed raporlar. Test dosyası `tests/qa-tutorial-1655-transitions-v11920.test.cjs` ve negatif hata sözleşmesi `tests/qa-tutorial-1655-transitions-failclosed-v11920.test.cjs` eklendi.
- **Gerçek özgün runtime kanıtı:** `open-collector-1` – `open-collector-4` için özgün `dist/simulation.js` ve 702 gerçek ürün tanımından oluşturulmuş `byId` ile **12/12** ardışık OFF→ON→OFF çözümü V8'de **kararlı, blokajsız, kısa devresiz** geçti. Dört sanal gösterge OFF/ON/OFF değişti. PNP üçüncü ve NPN dördüncü devre modelinin örnek lamba akımı 0→24→0 mA. `tests/tutorial-open-collector-stateful-v11920.test.cjs` bunu koruyacak.
- Negatif yürütme: yeni fail-closed regresyon dosyasının gerçek iki callback'i V8'dе yürütüldü: **2/2 PASS**; kısa devre/osilasyon ve tek sahnelik sahte "1.655 PASS" reddedildi.
- Sıralı testler H–L Windows kalite listesine ve birleşik `QA_TAM_PROJE_CALISTIR.bat` kapısına bağlandı. Birleşik QA `qa-tutorial-1655-transitions-report.json` için **güncel kaynak çalışma anına ait taze ve PASS** kanıtı olmadan genel PASS vermez. GitHub Actions **0**; commitler `[skip ci]`.
- **Kapanmamış QA:** en güncel `main` üzerinde native Node `--test` ile tüm 722 kablolu dersin ardışık durum çalıştırması, gerçek Windows Chromium/Edge ekran kabulü, tüm 1.519 dersin bağımsız pedagojik uzman denetimi, diğer motor ve pano fiziksel ürün kabulü. Önceki 12 gerçek V8 çalışma, bütün 722 dersin ardışık geçişleri için PASS iddiası **değildir**.
- Kanıt dosyası: `evidence/mq05_stateful_open_collector_20261012.json`.


## 2026-10-12 — 722 ders / 2.166 gerçek V8 solver koşusu ve 1.519 rehber UI QA

- **Kaynak anlık sürümü:** `cae8645ad881bae6965c730692ead03b31e5b71d`. GitHub kaynaklarından geçici Git *blob* olarak alınan 15 çekirdek modül, eksik 3 ölçüm/termal bağımlılığı, 9 malzeme modülü, 19 ders modülü ve özgün ürün kütüphanesi (genişletilmiş **939** model tanımı) tek V8 ortamında **gerçek** `CCSSimulation.solve` ile çalıştırıldı. Bu bir uydurma/mock devre hesabı değildir, ancak Node `--test` veya Windows kullanıcı kabulü de değildir.
- **Sonuç:** **722/722 ilk durum kararlı**, **722/722 değişim/zaman ilerlemesi kararlı**, **722/722 dönüş/zaman ilerlemesi kararlı**; toplam **2.166 gerçek elektriksel çözüm**, sıfır solver istisnası, sıfır kısa devre/blokaj. 456 seçilmiş kontrol elemanından **455'inde** çıktının değiştiği doğrulandı; **266** ders kontrol yerine zaman adımlarıyla sınandı. 1 istisna `measurement-workshop-src-10`: sensör çıkışı BK ile multimetre probu görselden temas ettirilmediği için durum değişikliğinde ölçülen çıktı değişmedi. **MQ-P1-017 OPEN.**
- **Tekrar üretilebilir kaynak:** `scripts/qa-tutorial-722-sequential-v11920.cjs` ile `tests/qa-tutorial-722-sequential-v11920.test.cjs` `main` içinde eklendi. Senaryo kaynakları değiştirmeden ilk → seçilmiş sanal kontrol değişimi veya 400 ms → eski duruma dönüş veya 850 ms sıra çözümlerini yapar, rapor `build/qa-tutorial-722-sequential-report.json` olarak kaydedilir. `stabilityStatus=PASS`, `behaviorStatus=REVIEW` ayrı raporlanır; biri diğerinin yerine geçmez.
- **Pedagojik ve arayüz kaynak QA:** 1.519 rehberin tamamı denetlendi: **525** sanal rehberli kablo, **923** bağlantısız referans, **71** kablolu/problu referans. Gerçek kanonik uçlara dayalı **2.085** rehber bağlantı cümlesi eşleşti; hatalı bağlantı/boş gözlem `0`. Öğretici ekranında rehberin başlık, adım ve gözlemlerinin `esc(...)` ile kaçışlandığı ve `Yalnız sanal eğitim` uyarısıyla gösterildiği kaynak kodda doğrulandı. Metin akıcılığı için `dist/tutorial-practice-guide-batch-n.js` içindeki ikinci malzeme adımı düzeltildi. **Bu tam Chromium görsel/etkileşim veya eğitim sonucunun bağımsız pedagojik kabulü DEĞİLDİR.**
- **Yeni QA girişleri:** `scripts/qa-tutorial-practice-1519-v11920.cjs` ve regresyon testi, H–L kalite zincirine eklendi; birleşik Windows kalite aracı her iki yeni raporu taze kaynak/çalışma kanıtıyla paketler ve **davranış REVIEW devam ediyorsa genel PASS vermez**.
- Makinece okunabilir kaynak kanıtı: `evidence/mq12_722_seq_mq07_1519_practice_20261012.json`. Actions kullanılmadı, `[skip ci]` geçerli. **Açık kalmaya devam eder:** güncel HEAD tam Node, Chromium/Windows 100 PNG, UT200A son HEAD 4 PNG, gerçek sürükle-bırak prob teması/okuma, ayrıntılı fiziksel donanım/terminal kabulü ve pedagojik uzman onayı.

## 2026-10-12 — MQ-P1-017 sensör hedefi davranışı düzeltildi / görsel QA açık

- İlk `455/456` davranış sonucu **testin eksikliği** idi: ders `measurement-workshop-src-10` sensörünün `sensing.target='metal'`, `range=4 mm`, `distance=10 mm` ayarları varken `state=true` kontrolü kullanılmamalı; aktif sensörün tetikleme ölçütü sanal hedef mesafesidir.
- Kanonik devrenin UT33D+ kırmızı `probeTarget=s1/BK` ve siyah `probeTarget=s1/BU` noktaları zaten mevcuttur. Hiçbir kablo/terminal/prob koordinatı değiştirilmedi.
- Özgün `CCSSimulation.solve` ile gerçek sanal test: metal hedef `10 → 2 → 10 mm` → UT33D+ `0,0 → 24,0 → 0,0 V`, 3/3 kararlı, kısa devre yok.
- `scripts/qa-tutorial-722-sequential-v11920.cjs` artık hedef tanımlı sensörlerde `state` yerine `sensing.distance` değiştirir, çıktı imzasına `_meter.value`, `_meter.display` ve `_voltageValue` da dahil edilir. Yeniden gerçek V8 çalıştırmasında **722 × 3 = 2.166/2.166**, **456/456 seçilmiş sanal kontrol çıktı değişimi**, **0 solver istisnası**, **0 kısa devre/blokaj**.
- `tests/qa-tutorial-722-sequential-v11920.test.cjs` testine özgün UT33D+ 0/24/0 regresyonu eklendi. Makinece okunabilir `evidence/mq12_722_seq_mq07_1519_practice_20261012.json` düzeltildi.
- **AÇIK:** güncel HEAD tam Node `--test`, Windows Chromium/Edge görsel-erişilebilirlik kontrolü, kullanıcıya dönük sensör hedefi/prob sürükleme etkileşimi ve bağımsız pedagojik uzman kabulü. Sadece V8 sanal kaynak kanıtı bu kapıların yerine geçmez. Actions kullanılmadı, `[skip ci]` sürdürüldü.


## 2026-10-12 — MQ-12 çoklu-kontrol ardışık çıktı doğruluğu (ek denetim)

- Aktif repo `uysalayhan23/DevreTasarimStudyo`, `main`. GitHub Actions çalıştırılmadı; tüm değişikliklerde `[skip ci]`.
- Yeni `scripts/qa-tutorial-sequential-v11920.cjs` ve `tests/qa-tutorial-sequential-v11920.test.cjs` kablolu her dersi özgün `Simulation.solve` ile başlangıç → seçilen giriş değişimi → önceki duruma dönüş şeklinde test etmek ve bir projedeki ilk üç kontrolü sırayla sınamak için eklendi. Bu test, mevcut `qa-tutorial-722-sequential` ve `qa-tutorial-1655-transitions` koşularının tamamlayıcısıdır; çalıştırılmadan tam PASS sayılmaz. Node test koşucusu `tests/*.test.cjs` dosyalarını otomatik toplar.
- **Önemli yanlış-pozitif onarımı:** Önceden `qa-tutorial-722-sequential` çıktıları karşılaştırırken kontrolün kendi `_active/_actuated` durumunu da elektriksel yük tepkisi gibi sayabiliyordu. Artık gözlemler yalnız bağlı yük/bobin/motor/ölçü cihazlarının gerçek çıktılarından hesaplanıyor. Eski sabit `456/456` cevap kabulü kaldırıldı; gerçekte tepki üretmeyen girişler `REVIEW` olarak listeleniyor. Bir düğmenin kendi durum değişimi tek başına elektriksel fonksiyon kabulü değildir.
- **Dürüst sensör senaryosu:** Sanal hedef atanmış sensörlerin etkinliği `state` alanını zorlayarak değil, algılama mesafesi değiştirilerek test ediliyor; özgün mesafe/kontrol durumu geri getiriliyor. Test fixture'ında hedef mesafesi `10 → 2 → 10` olarak çalıştırıldı, bağlı lamba çıktı tepkisi doğrulandı, kanonik kaynak değişmedi.
- **Bu oturumda gerçekten çalıştırılan V8 örnekleri:** (1) `OFF → ON → OFF` sanal düğme; (2) yalnız düğmenin kendi iç durumunu değiştirip yüke tepki üretmeyen örnek **yanlış PASS almadı**; (3) gerçekten durum değiştiren lamba saptandı; (4) bozuk simülasyon örneği `FAULT` olarak yakalandı; (5) sensör yakın/uzak/geri dönüş örneği çalıştı; (6) pedagojik kontrol kodu gerçek `tutorial-mode.js` üzerinde uydurma terminal bağlantısını ve HTML kaçış eksikliğini reddetti. Bunlar gerçek yürütülmüş **fixture/QA fonksiyonu** kontrolleridir.
- **Açık kabul:** 722/722 özgün elektriksel projelerin tam, current-HEAD Node koşusu ve etkileşimli fiziksel fonksiyon/görsel kabulü; 1.519 rehberin tümü için öğrenci testleri ve Windows/Chromium UI doğrulaması. Bu yetkinlikte bağlı GitHub üzerinden kod okunup güncellenebiliyor, ancak yerel container GitHub DNS/ağ erişimi kapalı; kullanıcı bilgisayarında çalışma istenmiyor. Başarısı görülmeyen koşular `UNVERIFIED/OPEN` kalır.


## 2026-10-12 — Batch N pedagojik kaynak doğrulaması ve 722 ardışık solver sözleşmesi

- Aktif çalışma: `uysalayhan23/DevreTasarimStudyo` / `main`. Actions çalıştırılmadı; commitlerde `[skip ci]` var.
- Gerçek `main` JavaScript'inin 18 öğretici modülü V8 içinde yeniden yürütüldü: `1655/1655` ders, `136` dokunulmamış zengin kayıt, `1519/1519` Batch N rehberi. Eksik rehber, yanlış sınıflandırma veya `physicalTestAccepted=true` bulunmadı (**kaynak katmanı PASS**).
- Ayrım: **525** sanal bağlantı rehberi, **923** kablosuz konu/malzeme rehberi, **71** şemada kablo/ölçüm probu çizimi olsa da `reference-with-wires` olarak işaretlenen ve rehberli elektriksel kabulü olmayan konu çalışması. Toplam 1519; önceki genel 994 referans sayısı 923+71 anlamındadır.
- `tests/tutorial-practice-guide-batch-n-v11920.test.cjs` bu 525/923/71 ayrımını artık zorunlu doğrular; sahte elektriksel kabulü engeller.
- `scripts/qa-tutorial-sequential-v11920.cjs` özgün solver'da `722` kablolu dersi başlangıç → sanal kontrol değişimi → geri dönüş dizisiyle taramak üzere repoda mevcut. `tests/qa-tutorial-sequential-v11920.test.cjs` testinde artık osilasyonun sıfır olması ve sonucun yalnız `SOURCE_SEQUENCES_CHECKED_BEHAVIOR_ACCEPTANCE_OPEN` olması zorunludur. Bu statü **nihai fiziksel/öğrenme kabulü değildir**.
- **Açık:** Güncel HEAD üzerinde 722 dersin gerçek Node sayısal ardışık çalıştırması ve varsa hata düzeltmeleri; 1519 rehberin gerçek Chromium/Windows görünüm-kullanılabilirlik QA'sı. Burada kaynak/V8 kontrolü yapılmıştır; Node/Windows yürütmesi kanıtı üretilmemiştir.


## 2026-10-14 — MQ-12 GitHub snapshot aktarım engeli / first-10 dört ayrı kapı (MQ-00: BLOCKED)

- `main` HEAD `3ba745d4c35a9e3440281f67b4b932bff5b9bc3b` üzerinde GitHub kaynakları okundu; ilk 10 kablolu dersin gerçek native Node yürütmesi **bu oturumda yapılamadı**. GitHub bağlantısı ZIP/tarball ikili arşivini yerel Node dosya sistemine aktaramıyor; yerel ortamdan doğrudan GitHub DNS erişimi yok. Kaynak dosya listesi, executable solver kanıtı değildir.
- Önceki regresyon kayıtları **5/5**, first-10 **classification 10/10, stability 10/10, response 8/8, restoration 7 PASS / seal-in-1 REVIEW** ve Batch N **1.519/1.519** tarihsel kaynak QA korunur; yeni `main` koşusu olarak tekrar PASS ilan edilmedi. 35 sensör + 7 reaktif davranış **REVIEW** sürer.
- Dört ayrı fail-closed `evidence/mq12_first10_20261014_*.json` raporu bugünkü `NOT_EXECUTED` durumunu, `historicalBaseline` alanından ayırır. Aktarım stratejisi: `docs/MQ12_GITHUB_SNAPSHOT_EXECUTION_LIMITS_2026_10_14.md`.
- MQ-12 G6/G7 açık, MQ-13 süreklilik: yalnız doküman/kanıt güncellemesi, kanonik/devre/solver/launcher ve golden değişmez; MQ-00 karar `BLOCKED`. GitHub Actions yok, `[skip ci]`.

## 2026-10-14 — MQ-12 kaynak aktarımı giderildi ve ilk 10 özgün V8 solver denetimi yürütüldü

- Önceki **BLOCKED** kayıt güncellendi: 51 GitHub blob SHA kaynağı V8 belleğinde birleştirildi; 939 katalog tanımı ve 1.655/722 kanonik müfredat özgün koda dayandı.
- Yeni V8 çalıştırması: **Classification 10/10 PASS**, **Stability 10/10 PASS (30 faz)**, **Response 8/8 PASS** (2 Arduino aktüatörü kapsam dışı), **Restoration 7 PASS + seal-in-1 REVIEW**. Dört kanonik seal-in devresinde START bırakılınca HOLD, STOP ile OFF ayrıca test edildi.
- Mevcut MQ-12 5 testinin ve first-ten 2 testinin callback'leri V8 host uyarlamasıyla **7/7 PASS**. **Node `--test` koşusu değildir; tam Node 19+9 ve Windows/Edge kapıları açık.**
- Batch N **1.519/1.519 kaynak QA PASS**, 2.085 doğrulanmış rehber bağlantısı, sıfır sorun; pedagojik/ürün kabulü değildir.
- Kanıt: `evidence/mq12_first10_20261014_v8_execution.json` ve dört ayrı güncel JSON. MQ-13 süreklilik: yalnız docs/evidence, canonical, 5/5 temel kaydı, solver, launcher korunuyor. MQ-00 hedef V8 VERIFY/PASS; genel 42 açık davranış REVIEW; Actions kullanılmadı.


## 2026-10-14 — MQ-07 pedagojik kalite açığı / NTC karşılaştırıcı pilotu (OPEN: Windows + 1.518 diğer rehber)

- Kullanıcının gerçek ekran kanıtı, `opamp-apps-src-08` dersinde tekrar eden genel açıklamaların devrenin işlevini öğretmediğini ortaya koydu. Kök neden: genel opamp karşılaştırıcı şablonu NTC başlıklı derse **NTC yerine RV1 potansiyometre** koyuyordu. Hedefli onarım `dist/tutorial-pedagogy.js` içindeki bu derse özel kaynak seçimidir; diğer kanonik dersler ve rich kilitler korunur.
- Açıklama artık LM358P **8/4 besleme, 2 eviren giriş, 3 evirmeyen giriş, 1 OUT**, `R2=R3=10 kΩ` → **12 V referans**, B1 NTC/R1 → sıcaklıkla değişen gerilim ve 15 °C / 35 °C sanal ölçüm yöntemini açıklar. `tutorial-practice-guide-batch-n.js` aşamalı sanal deney ekler; UI penceresi boyutu değişmez.
- Özgün GitHub kaynaklarından V8'dе **15,25,35 °C stabil**, 35 °C'de yüksek OUT, 15 °C'de düşük OUT, 1.655 ders/722 kablo kaynak QA PASS, Batch N 1.519/1.519 kaynak PASS. Bu Node `--test`, Windows UI veya fiziksel donanım onayı değildir. Kalıcı `tests/tutorial-ntc-comparator-context-v11920.test.cjs` regresyonu eklendi; tamamlanmış çağrı testlerinin kanıtı ayrıca değerlendirilir.
- **Genel müfredat pedagojik kabulü OPEN:** 1.519 otomatik rehber hâlâ `pedagogicalAcceptance=false` / `fullyRich=false`; 136 önceki zengin ders korunur. Geniş ölçüt ve P1→toplu QA programı: `docs/TUTORIAL_PEDAGOGICAL_ACCEPTANCE_ROADMAP_2026_10_14.md`. 35 sensör + 7 reaktif davranış REVIEW ayrı açık. Actions 0, `[skip ci]`.

## 2026-10-14 — MQ-07 semantik kapsam audit: genel ders kabulü OPEN

- `main` `349fcefd3e748cccb2c71f5cc1f671085eb3d6ed` üzerinden 1.655 özgün ders V8 belleğinde işlendi. 136 eski rich kayıt korunurken diğer 1.519 dersin pedagojik kabulü açık kaldı.
- **523 generic summary, 350 generic explanation, 644 tekrar eden açıklama başlangıcı, 715 generic malzeme amacı** raporlandı; bu kümeler birbirini kapsar. NTC başlığı ile sahne elemanı uyumsuzluğu, `opamp-apps-src-08` onarımından sonra sıfır.
- Yeni kaynak denetimi `scripts/qa-tutorial-pedagogical-depth-v11920.cjs`, V8 host shim ile yürütülen **2/2** negatif/süreklilik regresyonu `tests/qa-tutorial-pedagogical-depth-v11920.test.cjs`, kanıt `evidence/mq07_pedagogical_semantic_baseline_20261014.json`.
- MQ-00 karar: **SOURCE INVENTORY DONE, pedagogical FINAL OPEN, browser/Windows OPEN**. Anlatımlar başlık bazında terminaller, elektriksel neden-sonuç, en az iki gerçek simülasyon gözlemi ve öğrenen göreviyle düzeltilmeden pedagojik PASS yok. Actions 0; kaynak/devre/solver/görsel kilitleri değiştirilmedi; `[skip ci]`.

## 2026-10-14 — MQ-07 ilk 10 şablon kablolu ders için terminal-bağlamlı anlatım (kaynak QA)

- `main` 3ae62f2e1f4ab68a07936637be5c66a7162c00cd tabanında ilk 10 şablon kablolu dersin **yalnız summary/explanation/learningGoal/beginnerSteps/materials/pedagogyReview alanları** zenginleştirildi: installation-grounding-src-01, installation-grounding-src-02, installation-systems-src-02, installation-systems-src-03, installation-systems-src-04, installation-systems-src-05, installation-systems-src-06, installation-systems-src-08, installation-systems-src-09, installation-systems-src-10.
- Ders başına amaç, mevcut gerçek şema uçları, besleme/dönüş, neden-sonuç, doğrulanabilir sayısal hesap veya belirsizlik sınırı, sanal öğrenci görevi. `installation-systems-src-04` **ara vaviyen eksik** ve `installation-systems-src-06` **ikinci/üçüncü buton eksik** → başlık/topoloji `REVIEW`; şema otomatik değiştirilmedi.
- MQ-05/MQ-12 özgün V8: **4/4 yeni regresyon** ve **1.655/1.655 kaynak, 722/722 solver başlangıç, 10/10 üç faz kararlı, 5/5 kumandalı sanal tepki/geri dönüş**; kalan beş pasif/referans senaryoya sahte yük yanıtı PASS verilmedi. Kaynak terminal eksik/kısa devre/blocked 0. **136 rich tamamen aynı, 1.655 projenin kabloları/bileşenleri aynı**, değişen içerik ID yalnız 10.
- MQ-07 semantik envanter: genel özet **523→513**, genel açıklama **350→340** (diğer 1.519 ders için nihai pedagojik kabul hâlâ açık). Batch N **1.519/1.519 kaynak QA** korunur. Windows `file:///` / gerçek fiziksel ürün/bağımsız öğretmen kabulü **NOT_RUN/REVIEW**.
- QA kanıtı: `evidence/mq07_first10_wired_depth_20261014.json`; kalıcı test `tests/qa-mq07-first10-pedagogical-v11920.test.cjs`. MQ-07 lider → MQ-05 kaynak → MQ-12 V8 test → MQ-13 136 rich/canonical kilit → MQ-00 **SOURCE PASS, FINAL OPEN**. Actions 0; commit `[skip ci]`.


## 2026-10-14 — MQ-07 ilk 10 kablolu derse GERÇEK kaynak düzeltmesi (2 REVIEW)

- `dist/tutorial-pedagogy.js` üzerinde ilk 10 şablon dersin `summary`, `explanation`, `learningGoal`, `beginnerSteps` ve `materials.why` metinleri gerçek terminaller, işlev/neden-sonuç, gerekliyse hesap, ölçüm sınırları ve öğrenci sanal deneylerine göre **fiilen değiştirildi**. Kimlikler ve bütün canonical grafikleri sabit tutuldu.
- Önemli iki açık şema uyumsuzluğu: `installation-systems-src-04` (3 noktadan kontrol için ara vaviyen eksik) ve `installation-systems-src-06` (2/3 butonlu zil başlığında yalnız 1 buton) **REVIEW**. Öğrenciye yanlış işlev öğretilmiyor.
- Gerçek özgün V8 kaynak QA: 1655 ders/722 solver stabil, 939 tanım, 7250 bileşen, 16478 terminal ucu, 0 kaynak/bağlantı hatası. Batch N 1519/1519 PASS. Yeni regresyon 2/2 V8 callback PASS. Bu Node --test veya Windows görsel kabulü değildir.
- Kanıt `evidence/mq07_wired_first10_enrichment_20261014.json`; ders düzeltme özeti `docs/MQ07_WIRED_FIRST10_ENRICHMENT_20261014.md`. Kalan 1509 otomatik ders ve 2 uyuşmazlık, Windows ve pedagojik kabul kapıları OPEN. MQ-00 pilot SOURCE UPDATED, general acceptance REVIEW. Actions 0; [skip ci].


## 2026-10-14 — MQ-07 Ders 001–200 gerçek öğretici kod teslimi / açık fiziksel dersler

- **İlk 200 ders kanonik sırayla denetlendi.** 101 kabul edilmiş rich ve önceki 10 şablon-onarım + NTC pilotu 11 ders korundu. `dist/tutorial-pedagogy.js` içerisinde **88 gerçek dersin** amaç, teknik mekanizma, gerçek terminal bağı, malzeme rolü ve öğrenci görevleri değiştirildi (**30 kablolu + 58 referans**). Ayrıca `opamp-apps-src-07` yanlış RV potansiyometresi gerçek LDR `ldr-gl5528` + karşılaştırıcı bölücüsü olarak düzeltildi; bu 1 amaçlı fiziksel şema değişikliğidir.
- Özgün 1.655 ders ve 939 ürün katalog kaynağıyla V8'dе **722/722 native solver başlangıç PASS**, 0 missing definition/unknown terminal/short circuit/blocked/unstable. İlgili **4/4 özgün Node test callback'i V8 test shim ile PASS**; **native Node --test değildir**. Batch N 1.519/1.519 kaynak QA PASS korunur.
- Kanonik proje grafikleri geçici `pgwXXXX` prob-kablo kimlikleri normalize edilerek denetlendi: **yalnız `opamp-apps-src-07` değişti**, 136 kabul edilmiş rich ders aynı. `opamp-apps-src-08` NTC pilotu ve MQ-12 first-ten kararlılığı korundu.
- **64 ders REVIEW** (58 kablosuz konu materyali ve 6 konu/gerçek davranış/topoloji eksiği). İçerik iyileştirildi diye devre/çizim/simülasyon tamamlanmış sayılmadı. **001–200 grubunun tam teslim kapısı açık**. Bir sonraki teknik alt adım, eksik 64 sahnenin şema/simülasyon onarımı; sonraki 201–400 grubu ayrıca takip edilecek.
- Tarayıcıda güncel kodun yüklenebilmesi için `tutorial-mode.js` → pedagogy, `tutorial-bootstrap.js` → mode, `index.html` → bootstrap sürüm sorguları yenilendi. UI/Windows `file:///` fiziksel/görsel kabul **NOT_RUN**; Actions **0**, commit `[skip ci]`.
- Kanıt: `evidence/mq07_batch_001_200_20261014.json`, test: `tests/qa-mq07-batch-001-200-v11920.test.cjs`, roadmap güncellendi. MQ-07 metinler kaynak PASS → MQ-05 722 ilk durum PASS → MQ-12 V8 test 4/4 → MQ-13 136 rich korunumu → MQ-00 final REVIEW.

## 2026-10-14 — MQ-07/MQ-05/MQ-12: zil devrelerinde zorunlu yalıtılmış sanal trafo (BELL_TRANSFORMER_V1)

- Kullanıcı kararı: **tüm mevcut/gelecek zil dersleri trafolu model**. Eski `G1/L→buton→Z1→G1/N` şeması öğretimden kaldırıldı. Şebeke primeri kablo bağlanamayan sanal iç modeldir; öğrencinin kullanabildiği tek kaynak, TR1 `S1/S2` **yalıtılmış sanal 12 VAC sekonderidir**. 12 VAC ürün üretici onayı değil sanal model değeridir.
- Başlık-devre uyuşmazlığı onarıldı: `installation-systems-src-06` önce tek butonluydu, şimdi **3 bağımsız paralel çağrı butonu** ile çiziliyor; 2 butonlu deneme ilk iki kolla yapılabiliyor. `bells-1..4`, `installation-systems-src-05/06` ve aynı yükü kullanan diğer öğretici şemalar trafolu modele bağlandı.
- **Fail-closed manifest**: `docs/BELL_TRANSFORMER_MODEL_LOCKED.json` + `.md`; `scripts/qa-bell-transformer-v11920.cjs` ve `tests/qa-bell-transformer-v11920.test.cjs` yeni veya eski trafosuz çizimi reddeder. Kaydedilmiş eski kullanıcı projesi sessizce değiştirilmez: simülasyon **BLOCKED** olur ve arayüzde “Zil devresinde doğrudan şebeke fazı kullanılmaz; yalıtılmış uygun zil trafosu gereklidir.” uyarısı gösterilir.
- MQ-12 **gerçek özgün V8 kaynak testleri**: **15/15 zil dersi**, **38/38 OFF/kumanda/ON fazı**, **4/4 yeni test callback'i PASS**; 1.655 müfredat, **940 genişletilmiş katalog**, **722/722 kablolu başlangıç solver PASS**, Batch N **1.519/1.519 PASS**. Node `--test`, Windows `file:///...` görsel ve fiziksel ürün kabulü **NOT_RUN/REVIEW**, tüm 001–200 grup kapanışı **PARTIAL_REVIEW**.
- MQ-13: yalnız ilgili kaynak, QA, manifest, cache ve evidence; `main` kullanılır, force push ve Actions yok, `[skip ci]`. Bir sonraki iş: ilk 200 dersin **64 açık fiziksel/başlık** sorununa gerçek onarım, ardından bir sonraki 200'e geçiş.

## 2026-10-14 — İlk 200 devamı: gerçek üç noktadan aydınlatma ve trafolu zil pedagojisi

- **Gerçek uygulama düzeltmesi:** `installation-systems-src-04` artık `intermediate-1` kanonik sanal devresindeki **2 vaviyen + 1 ara vaviyen + 7 kabloyu** kullanır. Önceki 2 anahtarlı/5 kablolu yanlış çizim kaldırıldı. Öğrenci metninde G1/L → S1/11, S1/12→S2/1, S1/14→S2/3, S2/2→S3/12, S2/4→S3/14, S3/11→H1/X1, H1/X2→G1/N yolu; düz/çapraz geçiş ve üç anahtarın ayrı ayrı H1'i değiştirmesi açıklanır. Yalnız sanal laboratuvardır; gerçek şebeke kablolaması öğretilmez.
- **Zil standardı korunup anlatım geliştirildi:** `installation-systems-src-05` ve `-06` için TR1, B1–B3 ve Z1 malzemelerinin gerçek sanal görevleri ve trafo devre dışıyken beklenen davranış açıklandı. `BELL_TRANSFORMER_V1` kilitli JSON/MD dosyaları değişmedi; yalıtılmış 12 VAC S1/S2, direkt şebekeden beslemeyi engelleyen uyarı ve üç çağrı noktası korunuyor. Eski MQ-07 testlerinde düzeltmeden önceki fazlı zil/eksik anahtar beklentileri güncel devrelere göre düzeltildi.
- **MQ-05/MQ-12 gerçek özgün V8 koşusu:** 13/13 seçilmiş QA callback PASS; 1.655 ders, 722/722 kablolu ilk solver kararlı, 940 katalog, eksik terminal/kısa devre/blokaj 0; üç noktadan kontrol **8/8 anahtar kombinasyonu kararlı**, her bir S1/S2/S3 değiştirme H1'i tersine çeviriyor; trafolu zil **15/15 devre, 38/38 faz PASS**; Batch N **1.519/1.519 kaynak PASS**. **Tam Node `--test` veya Windows UI koşusu yapılmadı**.
- MQ-07→MQ-05→MQ-12→MQ-13→MQ-00: hedef kaynak düzeltmesi V8 PASS; bağımsız pedagojik/Windows/fiziksel ürün kabulü REVIEW. Önceki ilk-200'ün **64 ayrıca kaydedilmiş teknik REVIEW** kalemi tek onarımla kapatılmış sayılmadı. Kanıt: `evidence/mq07_three_point_and_bell_continuity_v8_20261014.json`. GitHub Actions 0, `[skip ci]`.


## 2026-10-14 — İlk 200 gerçek devre düzeltmesi: tek anahtarlı aydınlatma

- `installation-systems-src-01` önce 4 malzemenin kablosuz panosuydu; şimdi gerçek sanal kaynak G1, koruma anahtarı Q1, adi aç/kapa S1 ve H1 armatürü **4 doğrulanmış terminal kablosuyla** devre oluşturuyor. Öğrenci anlatımı neden-sonuç, kontrol/protection ayrımı ve 4 durumlu gözlemle gerçek uygulama kaynağında yenilendi.
- **MQ-05 V8 özgün kaynak:** tek anahtar OFF→ON→OFF ve sanal koruma açma senaryoları **4/4 kararlı**, lamba yalnız koruma kapalı ve S1 kapalı konumdayken etkin. Tüm 1.655 ders, 940 malzeme, **723/723 kablolu ilk durum PASS**, eksik malzeme/kısa devre/blocked **0**.
- **BELL_TRANSFORMER_V1 kilidi korunur:** 15/15 sanal zil dersi, 38/38 çalışma durumu PASS, doğrudan şebeke fazı zil ve butona bağlanmaz. Manifest JSON/MD değiştirilmedi.
- İlk 200 grubunun açık teknik sayısı **64 → 63**. Grubun tamamı veya Windows/native Node testi PASS kabul edilmez; pedagojik ve görsel bağımsız kabul REVIEW sürer. QA: `tests/qa-mq07-single-switch-lighting-v11920.test.cjs`. Actions 0, `[skip ci]`.

## 2026-10-14 — MQ-07 gerçek uygulama onarımı: Röle uçlarının bulunması

- `electronic-switching-src-01` dersindeki bağlantısız iki parça yerine **7 gerçek model / 9 sanal terminal bağlantısı** ve K1 bobini, NO 13/14 ile NC 21/22 öğretimi eklendi. Korunan `button-relay-2` kabul edilmiş devresi yalnız klon kaynak olarak kullanıldı, kendisi değiştirilmedi.
- Doğrudan V8 özgün elektrik solver kontrolü: S1 OFF→ON→OFF, bobin OFF/ON/OFF, yeşil H1 OFF/ON/OFF, kırmızı H2 ON/OFF/ON. 3/3 kararlı, kısa devre/blokaj yok. Devre ve alan bazlı metin uygulamanın `dist/tutorial-pedagogy.js` dosyasında gerçekten değiştirildi.
- 1.655 ders kaynak QA PASS, kablolu 724, 136 kabul edilmiş rich ders aynı, ilk 200 teknik REVIEW **63→62**. Batch N kaynak rehber geçmiş kanıtı bozulmamalı; gerçek Node/Windows/UI/pedagoji hâlâ OPEN.
- `BELL_TRANSFORMER_V1` zil manifesti ve doğrudan faz blokajı **korundu**. Yeni regresyon testi `tests/qa-mq07-relay-terminal-v11920.test.cjs`; V8 kanıtı `evidence/mq07_relay_terminals_v8_20261014.json`. Actions yok, `[skip ci]`.


## 2026-10-14 — MQ-07 ilk 200: sensör kumanda test ve IR yük kontrolü gerçek devre onarımı

- Kullanıcı talebi üzerine **sadece rapor değil**, `dist/tutorial-pedagogy.js` uygulama kaynağında `sensor-analog-apps-src-13` ve `sensor-analog-apps-src-14` kablolu sanal eğitim devreleri düzeltildi. Her derste sensör (PNP endüktif / PNP sanal optik), 24 VDC kaynak, K1 bobin, K1 normalde açık kontak, H1 gösterge ve **7 doğru terminal bağlantısı** bulunur.
- Çocukların anlayacağı açıklamalar devrenin amacı → BN/BU besleme → BK kumanda → A1/A2 bobin → 13/14 NO yük kontağı → H1 dönüşü → OFF/ON/OFF gözlemi şeklinde yeniden yazıldı. Fiziksel ürünün kesin akım/güç/optik montaj verisi olmadığında sayı uydurulmadı.
- Gerçek GitHub kaynaklarıyla V8 özgün solver: iki ders × üç durum = **6/6 tutarlı röle/lamba fazı**. Müfredat **1655**, kablolu **724→726**, katalog **940**, kaynak başlangıç solver **726/726 PASS**, bozuk uç/kısa devre/engel/kararsızlık **0**. Aynı 1655 dersin grafiği karşılaştırıldığında yalnız bu iki ders değişti. Önceki rich **136/136** korunur.
- `BELL_TRANSFORMER_V1` kontrolü: **15 devre / 38/38 faz PASS**. Kilitli trafo manifesti değiştirilmedi. İlk 200 teknik REVIEW **62→60**; diğerleri değiştirilmeden açık. Kalıcı Node test kaynağı eklendi ancak **gerçek Node --test ve Windows/Edge sayfa koşuları çalıştırılmadı**. Pedagojik bağımsız ve gerçek fiziksel kabul **REVIEW**.
- Kanıt `evidence/mq07_sensor_low_voltage_20261014.json`. Actions kullanılmadı; `[skip ci]`.


## 2026-10-14 — İlk 200 sensör dersi ek düzeltmesi: Hall ve optik devre (60 → 58 REVIEW)

- Eşzamanlı kabul edilmiş `sensor-analog-apps-src-13` ve `-14` gerçek devre onarımları olduğu gibi korundu. Kalan `sensor-analog-apps-src-20` (Hall etkili sensör) ve `-22` (optik sensör) için `dist/tutorial-pedagogy.js` kaynak devresi ve pedagojik açıklamalar yenilendi: her birinde sanal G1/DC, B1/BN-BU-BK, K1/A1-A2 bobin, K1/13–14 NO kontak, H1/X1-X2 lamba, **5 fiziksel katalog modeli ve 7 sanal kablo**.
- V8 özgün `Simulation.solve`: iki yeni ders + korunmuş iki sensör dersi birlikte **4×3 = 12/12 OFF→ON→OFF**, aynı proje nesnesinde röle ve lamba OFF/ON/OFF. Bütün müfredat **1655 ders, 940 katalog, 728/728 bağlı ilk durum stabil**, eksik tür/terminal/short/blocked/unstable **0**, Batch N rehberi **1519/1519** kaynak. `BELL_TRANSFORMER_V1` hiç değiştirilmedi: 15 sanal zil, 38/38 faz PASS.
- İlk 200 teknik REVIEW **60→58** (turun toplamı 62→58); kalanlar gerçek topoloji/mesafe/sinyal/timing kabulü olmadan kapatılamaz. Windows `file:///...`, tam Node `--test`, bağımsız öğretmen ve fiziksel üretici kabulü hâlâ **REVIEW / NOT_RUN**. Değişikliklerde Actions yok, `[skip ci]`. Kanıt `evidence/mq07_hall_optical_two_v8_20261014.json`; test `tests/qa-mq07-hall-optical-source-v11920.test.cjs`.


## 2026-10-14 — MQ-07 first-200 P1: iki girişli çıkarıcı/toplayıcı gerçek sanal devre düzeltmesi

- `opamp-apps-src-11` (Çıkarıcı) ve `opamp-apps-src-12` (Toplayıcı) derslerinde önceden **tek RV1 girişi** vardı; gerçek uygulama kaynağı `dist/tutorial-pedagogy.js` içine ikinci bağımsız **RV2**, gerekli dirençler ve tam terminal bağlantıları eklendi. Çıkarıcı **19**, toplayıcı **18** kayıtlı sanal bağlantı; gerçek op-amp pinleri 8/4, 2/3, OUT=1 kullanılır. Dersin amacı, 12 V R3/R4 orta referansı, gerilim farkı/toplama hesabı, sanal ölçüm ve beş giriş deneyi pedagojik anlatımlara eklendi. Yalnız sanal düşük gerilim laboratuvarı; fiziksel tesisat tarifi değildir.
- MQ-05/12 **V8 özgün solver**: her iki derste **5'er farklı A/B durumu**, iki giriş de çıkışı ölçülebilir değiştiriyor, tüm durumlar stabil/short 0. İlk 200 teknik REVIEW **58→56**; bağımsız pedagojik ve Windows sayfa kabulü REVIEW/NOT_RUN.
- Tam kaynak regresyonu: **1.655 ders, 940 katalog, 728/728 kablolu ilk durum stabil, hatalı terminal/blokaj/short 0**. `BELL_TRANSFORMER_V1` trafolu zil **15 devre/38 faz PASS**, manifest JSON/MD **değişmedi**. Şebeke fazı doğrudan zil veya butona gitmemeli; sanal izole 12 VAC sekonder kullanılmalıdır.
- Batch N özgün V8 rehber kaynağı **1.519/1.519, 0 sorun PASS**. Önceden 525 kablolu/923 referans sabit sayacı artık kabul edilmiş gerçek devre onarımlarından dolayı eskimişti: güncel ayrım **531 sanal kablolu, 917 yalnız konu, 71 referans çizim**; kaynağa bağlı her rehberin terminal doğrulaması sürdürülür. Kaynak QA sayacı ve testleri güncellendi. Yeni test `tests/qa-mq07-two-input-opamp-v11920.test.cjs`; kanıt `evidence/mq07_two_input_opamp_20261014.json`. Node `--test` ve Windows GUI çalıştırılmadı; test kaynağı ileride çalıştırılmaya hazır. Actions 0, `[skip ci]`.


## 2026-10-14 — MQ-07 ilk 200 teknik onarım: IR alıcı-verici sanal optik kontrol (56→55 REVIEW)

- `sensor-analog-apps-src-12` kablosuz 3 farklı sensör panosu olmaktan çıkarıldı; korunan optik kaynak grafiğinin özgün kopyası üzerinden **B1 kızılötesi sanal optik algılayıcı, G1 24 VDC, K1 röle bobini, K1/13-14 NO kontak, H1 lamba, 7 gerçek terminalli sanal kablo** ile onarıldı. Önceki kaynak `sensor-analog-apps-src-22` değiştirilmedi. Sanal B1 tek bileşik optik modüldür, fiziksel bağımsız IR gönderici/alıcı ürün onayı değildir.
- Pedagojik anlatım gerçek terminaller BN/BU/BK, A1/A2, 13/14, X1/X2, hedef hareketi 80→2→80 mm, röle-lamba nedeni ve öğrenci deneyi üzerine **uygulama kaynak kodunda** yeniden yazıldı. Optik/üretici fiziksel kabulü açık.
- **Güncel özgün `Simulation.solve` ile V8 icrası**: 80 mm → 2 mm → 80 mm fazları 3/3 kararlı, röle/lamba OFF→ON→OFF. 1.655 ders, **729/729 kablolu başlangıç solver PASS**, 940 katalog, bozuk terminal/blocked/short/unstable 0; **136 rich** aynı.
- `BELL_TRANSFORMER_V1` manifesti **değişmedi**; yalıtılmış sanal 12 VAC sekonder modeli `Bell.audit` içinde **15/15 devre ve 38/38 durum PASS**, doğrudan fazlı zil bloğu korunuyor. Batch N QA **1.519/1.519 PASS**: 532 sanal kablolu, 916 yalnız referans, 71 referans çizim, 2114 kanonik rehber örneği, 0 sorun.
- İlk 200 açık teknik sorun **56→55**. Schmitt Trigger histerezisi aynı girişte artan/azalan eşik davranışı göstermediği için gerçeği kanıtlanmadan kapatılmadı. Node `--test`, Windows `file:///` görsel, fiziksel üretici ve bağımsız pedagojik kabul **OPEN/REVIEW**. MQ-00 kaynak V8 hedef QA PASS, grup tamamı `PARTIAL_REVIEW`. Actions 0; `[skip ci]`.

## 2026-10-15 — MQ-07 open-topology fail-closed safeguard (55 REVIEW remains)

- Çalışılan referans: `main` ve `b630a59fc12abc71cc85341129624a9ffac585aa` commit'i. İlk 200 dersin **55 açık topoloji incelemesi** özgün tarayıcı müfredatı V8 üzerinde yüklenerek nedenlere ayrıldı: **51 NO_WIRED_CIRCUIT** (bunların birinde yalnız ölçü probunun iki bağlantısı var), **2 NO_RC_TIMING_EVIDENCE**, **1 TITLE_MISSING_REQUIRED_PART**, **1 MISSING_DIMMER_POWER_STAGE**. 51 kayıt işlevsel kablo sonucu/deneyi olmayan kavramsal veya referans derslerdir; tamamlandı sayılmadı.
- Yanlış donanımın kesin örneği: `sensor-analog-apps-src-08` “Piezo sensörlü devre” başlığı altında `proximity` endüktif sensörü ve PNP röle devresi bulunuyor; **piezo elemanı yok**. `electronic-switching-src-06/07` içinde RC kondansatör/zamanlama ağı yok. `sensor-analog-apps-src-11` LDR karşılaştırıcı ve prob bağlantılarından oluşuyor; dimmer güç/anahtarlama katı yok. Bunlar gerçek devreye uygun kabul edilmedi.
- `dist/tutorial-mode.js` UI kaynağına neden-temelli `topologyReviewNotice` uyarısı eklendi. Bu dört kablolu-ama-başlık-uyumsuz ders için yönlendirilmiş yeniden kurma yolu **fail-closed** oldu; kullanıcıya İncelemede açıklaması gösterilir, kanonik eleman/kablo ve kayıtlı projeler değiştirilmez. 51 kablosuz dersin kavram içeriği erişilebilir kalır. Cache zinciri `tutorial-bootstrap.js` ve `index.html` içinde güncellendi.
- `tests/qa-mq07-open-topology-review-v11920.test.cjs` özgün ders/malzeme sözleşmesini, 55 neden envanterini, yanlış piezo eşleşmesini, dört dersin fail-closed davranışını ve sağlıklı Hall örneğinin engellenmemesini doğrulayacak şekilde eklendi; ayrıca **gerçek yerel Native Simulation.solve / QA.audit 1.655 ders, 729 kablolu** regresyonunu tanımlar. **Bu Node testi çalıştırılmadı; PASS diye raporlanmaz.**
- **MQ-12 araçsız V8 yürütme kanıtı:** özgün GitHub ders kaynağında 1.655 ders / 55 REVIEW / dört kategori; orijinal tarayıcı `tutorial-mode.js` ile dört problemli ders `allowsGuidedWiring=false`, `startRebuild` no-op ve kablolar korunuyor; düzgün Hall dersi `allowsGuidedWiring=true`. `stop()` hatalı çağrısı 0, inceleme bildirimi 4/4. Bu, **tam Node solver, Windows file:/// görsel veya öğrenci kabulü değildir**.
- **MQ-13:** yalnız `main` fast-forward; `[skip ci]`; Actions 0; korunmuş golden/teknik manifestlerde değişiklik yok. **MQ-00 karar: PARTIAL / REVIEW.** Açık 55 kabul edilen onarım sayısına indirilmedi. Sırada piezo dersinin başlıkla uyumlu gerçek sanal sensör/kablolama modeli için malzeme/terminal/solver kanıtı; ardından 2 RC ve dimmer güç katı. Kanıt gelene kadar bu dersler yeniden-kurulabilir veya DONE değildir.

## 2026-10-15 — MQ-07 piezo virtual source correction (55→54 technical REVIEW)

- `sensor-analog-apps-src-08` başlığındaki piezo sensörü olmayan endüktif `proximity` + 24 V + röle devresi çıkarıldı; `tutorial-piezo` iki elektrotlu (+/−) sanal piezo kaynağı olarak yapılandırıldı. Fiziksel ürün verisi, terminal ölçüsü veya üretici kalibrasyonu uydurulmadı. Öğretici semantik/referans kimlikleri korunur.
- `device-behavior.js` darbeyle başlayan ve 220 ms eğitim zaman sabitiyle sönümlenen geçici piezo EMK hesaplıyor. `simulation.js` bunu gerçek elektriksel düğüm çözücüsüne iki elektrottan veriyor. Sanal kaynak harici DC besleme/PNP endüktif hedef eşdeğeri değil. Dersin yük bağlantısı: B1/+ → R1/1 (1 MΩ), R1/2 → B1/−; UT33D+ DCV 200 mV, VΩmA/COM ve iki fiziksel sanal prob ucu.
- MQ-05/12 gerçek kaynak V8 hedef test kanıtı: native `Simulation.solve` ile 0/100/50,570/1,062/0 mV modeli; UT33D+ sırasıyla 0/100/50,600/1,100/0 mV. **5/5 stabil, blocked/short/oscillating 0.** Veriler üreticiden alınmış değildir; `evidence/mq07_piezo_solver_v8_20261015.json`.
- Öğretici UI içinde sanal darbe, +150 ms ve +1000 ms ölçüm kontrolleri; reaktif sinyal yalnız sanal butona basıldığında üretilir. Dersin metin/amaç/malzeme/pin açıklamaları özgün çalışır kaynakta düzeltildi. 55→54 açık inceleme; yalnız PIEZO başlık-topoloji hatası giderildi. Üretici fiziksel, Windows görsel ve bağımsız pedagojik kabul **REVIEW**.
- `tests/qa-mq07-piezo-transient-v11920.test.cjs` özgün Native solve + 1.655 tam ilk-durum regresyon testini tanımlar. Kaynak hedef V8 testleri yürütülmüştür; gerçek `node --test` veya Windows `file:///` kabulü ayrıca kanıtlanmadıkça PASSED değildir. MQ-07 lider / MQ-05 çapraz / MQ-12 kanıt / MQ-13 süreklilik / MQ-00 kapanış: kanıt kapsamıyla sınırlı. Actions 0, `[skip ci]`.

### MQ-12 / MQ-13 / MQ-00 son kabul ayrımı — Piezo (2026-10-15)

- **MQ-12 özgün kod V8 doğrulaması PASS:** tam orijinal `QA.audit` + `Simulation.solve`, katalog **940**, toplam **1655**, korunan rich **136**, topik/batch N **1519**, kablolu **729/729 stabil**, eleman **7276**, kablo ucu **16600**, eksik tanım/terminal/yönlendirilmiş adım/kısa devre/blokaj/kararsızlık/istisna **0**. Kanıt: `evidence/mq07_piezo_full_runtime_qa_20261015.json`.
- **Hedef dinamik PASS:** piezo sanal mV 0→100→50,57→1,06→0; UT33D+ 0→100→50,60→1,10→0. Beş faz stabil. Öğretici Mode V8 testinde darbe olmadan sonraki faz seçimi reddedildi; darbe ve +150/+1000 ms örnekleri native solver ile doğru işlendi, sağlam piezo yönlendirilmiş ders akışı açık.
- **MQ-13:** tek aktif `main` dalı; korunan referanslar, komponent kimlikleri ve paketleme dosyaları silinmedi; kaynak cache zinciri birlikte güncellendi. Commitler `[skip ci]`; Actions çağrısı yapılmadı.
- **MQ-00 karar:** `sensor-analog-apps-src-08` için **sanal kaynak/topoloji ve hedef V8 solver kabulü PASS**; teknik inceleme sayısı **55→54**. Tam Node `--test`, gerçek Windows `file:///` görsel öğrenci kabulü, üretici-fiziksel kalibrasyon **NOT_RUN / REVIEW**. Bu kalan kapılar DONE ilan edilmez.

## 2026-10-15 — MQ-07 BJT RC timed ON/OFF original solver repair (54→52 technical REVIEW)

- `electronic-switching-src-06` ve `electronic-switching-src-07` önce yalnız buton+transistör olan ve RC depolama içermeyen **NO_RC_TIMING_EVIDENCE** durumundaydı. Şimdi ikisinde gerçek sanal terminal ağı bulunur: G1/P → S1/13-14 → RB/1-2 → C1/1 ve Q1/B; C1/2 → G1/M; RP/1 → C1/1, RP/2 → G1/M; Q1/E → 0V, Q1/C ↔ RL/2, RL/1 → +24 V. UNI-T UT33D+ DCV 20 V, VΩmA/COM fiziksel sanal problar C1/1-C1/2 üzerindedir. Her ders **10 komponent / 12 gerçek kablo**, yanlış sahte zaman rölesi yok.
- **ON gecikme `src-06`:** RB=47 kΩ, C1=1000 µF, RP=10 kΩ. Native `Simulation.solve` ve gerçek DC kapasitör implicit-Euler modelinde, S1 250 ms'de basıldığında Q1 1250 ms boyunca OFF, 1500 ms'de ON; buton bırakılınca depolanan gerilim azalıp 5750 ms'de OFF. Bu ikinci deşarj davranışı da dürüstçe kullanıcıya gösterilir; anında OFF vaat edilmez.
- **OFF gecikme `src-07`:** RB=1 kΩ, C1=100 µF, RP=2 kΩ. S1 basıldığında Q1 250 ms'de ON; 2250 ms'de buton bırakıldıktan sonra 3000 ms'de hâlâ ON, 3250 ms'de OFF. Metrikler 250 ms sayısal örneklemeye göre raporlanır; üretici kalibrasyonu değildir.
- Öğretici UI koduna `Sıfırla → S1 bas/2 s tut → S1 bırak/süreyi izle` butonları ve C1 (V), Q1 ON/OFF, UT33D+ okuması konuldu; gerçek `CCSSimulation.solve` çalışmıyorsa işlem PASS vermez. Talimat, malzeme görevleri, neden-sonuç ve ön/son durumlar iki ders için yeniden yazıldı. Cache zinciri ve eski canonical teknik kilitler korunur.
- **MQ-12 özgün source V8 QA PASS:** 1655 ders, 136 rich, 940 tanım, **729/729 başlangıç solver kararlı**; 7280 eleman ve 16616 bağlantı ucu; eksik tanım, terminal, adım, blokaj, kısa devre, kararsızlık, istisna **0**. UI V8 üzerinden ON dersi 3/3 reset/press/release davranışı PASS; dinamik ON/OFF çözümleri gerçek solver ile geçildi. Kanıt: `evidence/mq07_rc_bjt_dynamic_v8_20261015.json`.
- **MQ-13:** tek aktif `main`, fast-forward, force-push yok, Actions kullanılmadı, tüm commitlerde `[skip ci]`. Test envanteri 52 güncel REVIEW sayacını yansıtır, `tests/qa-mq07-rc-bjt-timing-v11920.test.cjs` özgün Native solver regresyonu için hazırlanmıştır.
- **MQ-00 ayrıştırılmış karar:** iki dersin sanal RC topoloji ve dinamik solver kapısı PASS; 54→52 teknik REVIEW. Ancak üretici fiziksel donanım kalibrasyonu, Node `--test` yürütme, Windows `file:///` görsel ve bağımsız pedagojik kabul **NOT_RUN/REVIEW**; bunlar tamamlandı/DONE olarak gösterilmez. Sıradaki teknik konu: `sensor-analog-apps-src-11` LDR dimmer güç katı. 51 kablosuz referans konu da incelemede.

## 2026-10-15 — MQ-07 LDR dimmer sanal güç katı onarımı (52→51 teknik REVIEW)

- `sensor-analog-apps-src-11` başlığına uymayan yalnız LM358 karşılaştırıcı devresinin yerine kaynak denetimli **12 VDC GL5528 LDR / 10 kΩ gerilim bölücü → sanal N-kanal MOSFET gate → gerçek sanal 120 Ω H1 yük güç yolu** yerleştirildi. 5 komponent / 7 gerçek kablo: G1/P→B1/1→B1/2→R1/1→R1/2→G1/M (kontrol), B1/2→Q1/G, G1/P→H1/X1→H1/X2→Q1/D→Q1/S→G1/M (yük yolu). **Bu AC triyak faz-açısı dimmer değildir.**
- `current-model.js` yalnız `c.virtualLdrDimmer=true` kanonik dışı eğitim işaretiyle, özgün nodal gate voltajından sınırlı MOSFET kanal direnç eşdeğerini çözüme dahil eder; diğer MOSFET’lerin orijinal anahtarlama kodunu değiştirmez. `simulation.js` bu tek eğitim kanalında ideal D-S kısa yolunu devre dışı bırakır ve sanal lamba akım/gerilim/güç üzerinden nominal parlaklığı hesaplar. Faz kontrolü/PWM/SPICE ve üretici sıcaklık-güvenlik modeli **yoktur**.
- MQ-05/06 çapraz elektriksel denetim: GL5528 aydınlık arttıkça R azalır; gerçek kontrol bölücü Q1/G 0,484→4,800→8,716→10,962 V; gerçek güç yolunda H1 parlaklık %0→%12,25→%70,48→%98,35 (0,1→10→100→1000 lux). Başlangıç testlerinin tümü stabil/short=0/blocked=0, lamba gücü değişimi yalnız renk/etiket animasyonu değildir. İlgili özgün kaynak V8 raporu: `evidence/mq07_ldr_linear_dimmer_v8_20261015.json`.
- MQ-07 pedagojik metinleri ve Öğretici Modu canlı 0,1–1000 lux presetleri kontrol/güç yolunu, elektriksel yük P=VI hesabını ve fiziksel kabul sınırlamalarını gösteriyor. `tests/qa-mq07-ldr-linear-dimmer-v11920.test.cjs` özgün Native solver ve 1655/729 regresyon testini hazırlar. Bu `node --test` yürütüldü demek değildir.
- MQ-12 **V8 tam kaynak denetimi PASS:** 1655 ders, 136 rich, 940 katalog, 729/729 kablolu başlangıç kararlı; 7276 eleman/16606 terminal uç denetimi; missing/invalid/short/blocked/unstable/error=0. MQ-13: yalnız `main` fast-forward, commit `[skip ci]`, Actions tetiklemesi yok.
- MQ-00 ayrımı: LDR **sanal 12 V lineer dimmer topoloji+V8 solver PASS**; eksik güç katı teknik sorunu 52→51. Fiziksel MOSFET/termal/üretici onayı, Windows `file:///` görsel ve bağımsız pedagojik kabul **REVIEW/NOT_RUN**. Bu derse genel **DONE verilmez**. Sıradaki 51 kayıt `NO_WIRED_CIRCUIT` kaynak/konu dersleri; bunlar kablolu simülasyon kabulü değildir.

## 2026-10-15 — MQ-07 remaining 51 NO_WIRED_CIRCUIT classification + motor reversal repair

- **MQ-07 sınıflandırma:** güncel orijinal `main` içinde **51/51 quiz** ve **50/51 hiç kablosu olmayan**, **1/51 yalnız 2 prob bağlantılı** ders tespit edildi. 51'in tamamı sorgulanıp kimlik ve başlık bazında raporlandı: `docs/MQ07_51_NO_WIRE_TRIAGE_20261015.md` ve `evidence/mq07_51_no_wire_triage_20261015.json`. **14 kavramsal quiz korunur** (ders kimliği/kayıtlı malzeme ve sayfa değiştirilmez), **37 işlevsel uygulama adayı** ayrılır. Bunların **1'i sanal devre düzeyinde onarıldı**, **36'sı uygulama için sırada**. Kavramsal quizler fiziksel/sanal laboratuvar DONE ilan edilmez; mevcut REVIEW statüsü onay olmadan kapanmaz.
- **MQ-07 ilk uygulama `electronic-switching-src-03`**, önceden `quiz` ve sıfır kablo idi. Artık 24 VDC yalnız sanal G1, S1/13-14, K1 bobin A1/A2, ortak K1 referanslı K1A/K1B iki değiştirici kontak 11/13/21 ve M1/+–M1/− **6 bileşenli / 9 kablolu** gerçek bağlantı kaydı bulunuyor. NC konumunda motor polaritesi ileri, NO konumunda geri. Fiziksel tersleme zamanı, kilit/termik koruma, mekanik geçiş ve yük altında tersleme **modellenmedi**; gerçek ekipman yönergesi olarak kullanılmaz.
- **MQ-05/06 çapraz solver:** özgün `Simulation.solve` ile S1 OFF→ON→OFF→ON→OFF sonucunda K1 OFF→ON→OFF→ON→OFF, M1 `_spin` **+1→−1→+1→−1→+1**; **5/5 stabil ve kısa devresiz**. Negatif vakalar: motor ikinci kutup kablosu eksikse motor OFF; bobin beslemesi kesilirse motor geri dönmez; K1B referansı K2 ile ayrılırsa motor OFF. Her biri stabil. Öğretici Modu S1 bas/bırak kontrolü orijinal solver çağrısıyla üç kez **PASS**.
- **MQ-12 tam kaynak V8 regresyon PASS:** 1655 ders, korunan 136 rich, 940 tanım, **730/730 gerçek kablolu başlangıç çözümü stabil** (önceki 729→730), **7278 komponent**, **16624 terminal ucu**, eksik tanım/geçersiz terminal/geçersiz adım/kısa devre/blokaj/kararsızlık/exception/kopya **0**. `tests/qa-mq07-no-wire-triage-motor-direction-v11920.test.cjs` Node çalıştırılabilir kaynak regresyonunu tanımlar; mevcut ortamda **Node komutu koşulmadığı için node --test PASS diye raporlanmaz**.
- **MQ-13:** yalnız `main`, fast-forward, force push yok, eski korunmuş ders içeriklerinde gereksiz değiştirme yok. Sadece gerçekten eklenen devre nedeniyle bağlı MQ-07 sabit `729→730` ve `51→50` bekleyişleri güncellenmiştir. Commit `[skip ci]`; Actions çalıştırılmadı.
- **MQ-00 kararı:** `electronic-switching-src-03` sanal devre/topoloji/dinamik solver kapısı **PASS**; toplam **50 açık teknik REVIEW** (14 kavramsal onay bekler, 36 uygulama onarım bekler). Windows `file:///` görsel, bağımsız pedagojik ve gerçek ürün/fiziksel motor kabulü **NOT_RUN/REVIEW**. Tam DONE yok. **Sonraki aday:** `electronic-switching-src-09` FET'li gecikmeli durma (önce canlı FET-RC desteğini kanıtla; olmadan şema kabul etme).

## 2026-10-15 — MQ-07 FET'li gecikmeli durma onarımı: elektronik anahtarlama SC09 (50→49 REVIEW)

- **MQ-07 lider / MQ-05 çapraz:** `electronic-switching-src-09` “FET’li zaman gecikmeli duran devre” eski J113-JFET sembol ve tek dirençten oluşan **0 gerçek kablolu QUIZ** iken artık gerçek sanal `12 VDC G1 → S1/13–14 → RŞ 1 kΩ → C1 100 µF + Q1/G`, `RD 20 kΩ → 0 V`, `H1/X1–X2 → Q1/D–S` olan **10 komponent / 12 kablo** dersidir. C1/1-2 UNI-T UT33D+ DCV 20 V ve VΩmA/COM fiziksel sanal problarla ölçülür. Yalnız bu dersin `mq07FetRcDelay=true` modeli için N-kanal MOSFET gate-sample, özgün sayısal RC çözücüsünden alınır; diğer MOSFET’lerin anahtarlama/kitaplık modeli değiştirilmez.
- **Özgün solver dinamik deneyi:** S1 ilk 0 ms OFF; 250 ms bas → MOSFET + H1 ON (gate yaklaşık 8,275 V), 1000 ms hâlâ ON (≈11,361 V). S1 1250 ms bırakılır; 3000 ms’de H1 hâlâ ON (gate≈4,420 V); 3250 ms’de gate≈3,928 V ile eşik altına düşer, H1 OFF. **Gecikme ≈2 saniye**, örnekleme 250 ms; R×C=20 kΩ×100 µF=2 s değeri genel fiziksel OFF zamanı veya üretici ölçümü değildir.
- **MQ-05/06 olumsuz kontroller:** RC→Q1/G kablosu kesildiğinde lamba OFF; H1→Q1/D kesildiğinde lamba OFF; C1 kaldırıldığında S1 bırakıldığı aynı çözüm anında OFF; RD 10 kΩ olduğunda 2250 ms’de OFF (orijinal 3250 ms’den daha erken). Bütün test edilen anlarda original `Simulation.solve` stabil, kısa devre/blokaj/osilasyon yok. Gerçek `unit-ut33d-plus` prob uyarısı yok.
- **MQ-12 özgün kaynak V8 regresyon PASS:** 1655 ders, 136 rich, **940 tanım**, **731/731** kablolu devre başlangıcı kararlı (730→731); **7286 komponent, 16648 kablo ucu**, missing/invalid/blocked/short/unstable/exception/duplicate=0. Öğretici Modu V8 kullanım testi sırayla reset→press→release geçti, erken bas/bırak talimatına güvenli geri bildirim verdi. Yeni `tests/qa-mq07-fet-rc-delay-stop-v11920.test.cjs` gerçek Node üzerinde çalıştırılabilir özgün kaynak regresyonunu tanımlar; **node --test henüz çalıştırılmadı**. Kanıt: `evidence/mq07_fet_rc_delay_stop_v8_20261015.json`.
- **MQ-13 süreklilik:** 14 kavramsal korunmuş ders unchanged; uygulama onarım bekleyen ders sayısı 36→35; toplam açık teknik kayıt **50→49**. Eski 50/730 sayılarına kilitli MQ-07 test beklentileri yeni 49/731 kanıtına uyarlanır. Tek `main` fast-forward commit, `[skip ci]`, Actions yok, force push yok.
- **MQ-00 karar:** `electronic-switching-src-09` sanal G-D-S/RC topoloji, native gate threshold ve özgün V8 solver dinamik kabulü **PASS**. Fiziksel J113/IRF540N üretici karakteristiği, termal model, Windows `file:///` görsel öğrenci kabulü, bağımsız pedagojik kabul ve Node shell testi **NOT_RUN / REVIEW**; bunlar DONE değildir. Sonraki uygulama adayı: kalan 35 işlevsel ders içinden gerçek solver desteği açıkça gösterilen en düşük riskli dersi seç.

## 2026-10-15 — MQ-07 MOSFET sağlamlık sanal G/D/S fonksiyon denetimi (49 → 48 REVIEW)

- electronic-switching-src-10, önce NO_WIRED_CIRCUIT/quiz olan referans kartından, 12 kayıtlı bileşen ve 12 fiziksel terminal eşleşen sanal kablolu devreye dönüştürüldü. Orijinal irf540n-mosfet katalog G/D/S terminalleri; G1 12 V, S1 13–14, RG 1 kΩ, RP 100 kΩ pull-down, H1 120 Ω sanal yük ve iki UNI-T UT33D+ DCV20 ölçer ile dört sanal prob vardır.
- Ölçüm noktaları: VG/COM ve VG/VΩmA G–S, VL/COM ve VL/VΩmA H1/X1–X2. Güç yolu G1/P → H1/X1-X2 → Q1/D–S → G1/M; kontrol yolu G1/P → S1 → RG → Q1/G, RP → M. Fiziksel IRF540N datasheet SOA, body diode, Rds(on), termal veya sağlamlık garantisi yoktur.
- MQ-05/06: Simulation.solve sadece mq07MosfetHealth işaretli sanal örnekte özgün Numeric.update sampleOnly ile G–S voltajını dirençli düğümden alır; mevcut MOSFET eşik fonksiyonuna uygular. OFF→ON→OFF: VG 0→11,88→0 V, VL 0→12→0 V; H1 OFF→ON→OFF. Gate bağlantısı kopunca yük OFF kalır; sanal D-S köprüsü güç yolunu gate OFF iken çalıştırır. Bunlar kablo/topoloji kusuru simülasyonudur, gerçek cihaz arızası teşhisi değildir.
- MQ-12 kaynak kanıtı: özgün runtime V8 ile 1.655 ders, 136 rich, 940 tanım, 732/732 kararlı kablolu başlangıç çözümü, 7.296 parça ve 16.672 terminal ucu kontrol edildi; eksik tanım, hatalı pin, kısa devre, blokaj ve kararsızlık 0. UI ile OFF→ON→OFF 3/3 gerçek solver çağrısı başarılı. evidence/mq07_mosfet_health_v8_20261015.json ve tests/qa-mq07-mosfet-health-v11920.test.cjs eklendi. Ayrı node --test veya Windows file:/// görsel çalıştırılması NOT_RUN.
- MQ-13: tek main dalı, fast-forward; force push, Actions çağrısı yok; committe [skip ci]. Önceki MOSFET/FET gecikme ve LDR kapıları korunur. 49→48 teknik inceleme (NO_WIRED_CIRCUIT); kavramsal korumalı derslere dokunulmadı.
- MQ-00: sanal G/D/S bağlantı ve dinamik ölçüm modeli PASS; fiziksel gerçek IRF540N sağlamlığı, gövde diyodu ve üretici kalibrasyonu, Windows görsel/pedagojik bağımsız kabul REVIEW. Tüm ders DONE değildir.

### 2026-10-15 SC11 PWM–MOSFET–DC motor — existing MQ-05/MQ-07 REVIEW item update
- User's recorded SC11 video and root-cause analysis are tracked under existing MQ-05/MQ-07 acceptance scope, **not a new duplicate defect ID**.
- Implemented SC11-only native HIGH/LOW phase sampling at 1 kHz, connected UT33D+ G–S phase-weighted DCV, explicit invalid wire/probe/HOLD guards, and uncalibrated first-order motor visualization proportional to solver-validated conduction. Generic nominal RPM is suppressed for this one lesson; other lessons remain unchanged.
- New `tests/qa-mq07-sc11-pwm-cycle-v11920.test.cjs` is present and picked up by the local all-test script, with duty and path-disconnection cases. Edited source/test JavaScript syntax PASS; standalone PWM timing contract was executed via connected source in isolated JS runtime PASS.
- **MQ-12 original SC11 integration tests, 1,655-lesson suite, Node check, Windows Edge file:/// visual QA: NOT_RUN** (no local full checkout, GitHub DNS unavailable). No Actions invoked.
- **MQ-00 acceptance:** OPEN / REVIEW. Native electrical test evidence, measured VGS checks and Windows motor response review are required before changing this existing item to DONE; manufacturer-calibrated physical RPM/flyback/thermal claims are excluded.

#### 2026-10-15 MQ-00 / MQ-12 / MQ-13 SC11 acceptance evidence refinement
- Same existing MQ-05/MQ-07 SC11 issue, **no new defect ID**: controlled native test uncovered disconnected `PLUG↔TIP` probe contacts causing a false zero UT33D+ VGS display even though native MOSFET gate model returned ≈11.881188 V.
- `dist/simulation.js` now joins only opted-in `sc11MeasurementProbe` test leads; `dist/tutorial-pedagogy.js` marks SC11 red and black probe. Other lesson measurement leads are untouched.
- **MQ-12 limited executable evidence:** GitHub production native simulation plus 18 real modules executed in isolated V8 on an explicitly reconstructed SC11 9-component circuit. Duty 0/25/50/82/100% produced VGS 0/2.970/5.940/9.742/11.880 V and drive targets 0/25/50/82/100%. Six disconnected circuits drove target 0; invalid frequency/HOLD/disconnected probes were fail-closed; response rose and decayed without reporting real RPM.
- File: `evidence/mq07_sc11_vgs_pwm_fixture_20261015.json`. Regression assertion for opted-in probe continuity added to `tests/qa-mq07-sc11-pwm-cycle-v11920.test.cjs`.
- **MQ-12 open:** full repository authentic Node test suite, complete 1,655 lesson audit and Windows visual acceptance **NOT_RUN**. Fixture evidence is not full-product acceptance or safe motor calibration.
- **MQ-13 review:** main fast-forward with `[skip ci]`, no force-push/Actions, file paths remain stable. **MQ-00 decision:** REVIEW, no DONE until full independent Node/Windows evidence is captured.


## 2026-10-15 · MQ-07 SC16 BTA16 DC tristör/triyak dersi — açık kabul

- **Mevcut MQ-07 ilk 200 ders denetiminin alt işi; yeni bağımsız defect ID oluşturulmadı.** SC16 eski kablosuz referans kartından 7 bağlantılı, ST BTA16-600B MT1/MT2/G kimlikli, sanal 12 V DC tetikleme ve STOP deneyine dönüştürüldü.
- Öğretici modeli: SG kısa gate tetiklemesi → akım tutma; SG bırakıldığında akım devam eder; SP NC STOP ana akımı keser; SP geri kapanınca yeni tetikleme gereklidir. Tutma eşiği 30 mA yalnız sanal eğitim varsayımıdır, BTA16 üretici ölçümü değildir. Gate kablosu sonradan koptuğunda mevcut latch kaybolmaz; güç kolu koparsa kaybolur.
- BTA16 yalıtımlı TO-220AB ortografik görünümü ve 1=MT1, 2=MT2, 3=G terminal etiketleri ayrı oluşturuldu; gerçek mil/dönüş görseli yok. Üretici mm boyutlarının kesin fiziksel kabulü hâlâ açık.
- **MQ-12 hedefli çalışma:** `tests/qa-mq07-sc16-triac-dc-hold-v11920.test.cjs` gerçek GitHub kaynaklarından hazırlanmış yalıtılmış JS çalıştırmada **8/8 PASS**; `dist/tutorial-...` katmanları 1.655 ders olarak yükleniyor. **Tam Node, tüm 1.655 dersin regresyonu ve Windows kabulü NOT_RUN.**
- Ayrıntılı kanıt: `docs/MQ07_SC16_BTA16_DC_TRIAC_20261015.md`. Lider MQ-07 → bağımsız MQ-04/MQ-05/MQ-03 → MQ-12 → MQ-13 → MQ-00. **MQ-00 = REVIEW (DONE değil)**. Sıradaki SC17 AC triyak dimmer; SC11–SC15 elektriksel dersleri korunur. Actions çalıştırılmadı; `[skip ci]`.


## 2026-10-15 · MQ-07 SC17 BTA16 yalıtılmış sanal AC dimmer — açık kabul
- İlk 200 ders MQ-07 backlog alt işi; yeni defect kimliği açılmadı. SC17 eski yalnız teorik/kablosuz quiz yerine ST BTA16-600B **MT1/MT2/G**, 12 V RMS/50 Hz sanal yalıtılmış AC kaynak, ayrı iki yarım periyotlu TRG1, RG ve sanal yük ile 7 elektriksel bağlantılı ders yapıldı.
- MQ-05: pozitifte ve negatifte farklı işaretli gate darbeleri, iki yarım periyotta ayrı sıfır geçişi/kapanma, sanal tutma akımı kontrolü ve 360° dalga örneklerinden yük RMS hesaplaması. MQ-03: BTA16 yalıtımlı TO-220AB/terminal görünümü ile ayrı TRG1 ön panel; MQ-10: 0/45/90/135/170° öğretici butonları ve sağ menü faz/darbe ayarları.
- **MQ-12 sınırlı çalıştırılmış kontrol:** gerçek GitHub kaynakları üzerinden yalıtılmış JS ortamında `tests/qa-mq07-sc17-triac-ac-phase-v11920.test.cjs` **9/9 PASS**. 7 kablo kopması fail-closed, iki yarım periyot işaretli akım, invalid ayarlar, STOP reset ve SC11–SC16 geri uyumluluk dahil. Toplam 1.655 ders veri tabanı yüklenebiliyor, ancak 1.655 derslik tam simülasyon regresyonu değildir.
- **MQ-00 REVIEW:** tam Node test koşumu, Windows `file:///` kullanıcı ekranı/gerçek tıklanabilir pin bağlantısı, osiloskop entegrasyonu ve mm fiziksel üretici doğrulaması **NOT_RUN**. Gerçek BTA16 termal/IGT/holding-current fiziksel kalibrasyon PASS iddia edilmiyor.
- Kanıt kaydı: `docs/MQ07_SC17_BTA16_AC_DIMMER_20261015.md`. SC11–SC16 korunarak ilerleniyor. Sıradaki iş **SC18 optokuplör**. GitHub Actions **kullanılmadı**, commit `[skip ci]`, dal `main`.


## 2026-10-15 · MQ-07 SC18 TLP521-1 optokuplör iki bağımsız sanal besleme — açık kabul
- İlk 200 ders kalite kuyruğunun alt işi. SC18 mevcut adı **“Optokuplör sağlamlık kontrolü”**; eski kablosuz referans kartı, TLP521-1 **1=A,2=K,3=E,4=C** pinleriyle 7 ayrı kablolu 5 V giriş LED’i ve 5 V bağımsız fototransistör güç yolu olarak düzeltildi. Üretici/gerçek cihaz sağlamlığı simülasyonla kanıtlanmış değildir.
- SC18’ye özel `Simulation.solveSc18OptocouplerCycle`: iki güç alanını elektriksel olarak birbirinden bağımsız tutan terminal net kontrolü; sembolik %50 CTR / 1,2 V LED / 0,2 V VCE eğitim parametreleri; SG OFF/ON/OFF, kopuk kablo ve ortak GND hatası senaryolarında yükün kapanması. Öğretici panele giriş LED ve çıkış fototransistör akımı, kolektör voltajı ve SG butonları eklendi.
- **MQ-12 9/9 hedefli PASS:** `tests/qa-mq07-sc18-tlp521-isolated-v11920.test.cjs` güncel GitHub kaynaklarıyla yalıtılmış JS test ortamında çalıştırıldı. `1.655` derslik kaynak listesi yüklenebilir durumda. **Tam Node, Windows ekranı, tıklanabilir gerçek terminal QA’sı, üretici CTR ve fiziksel izolasyon kabulü NOT_RUN.** Sonuç **MQ-00 REVIEW**, asla DONE değil.
- Denetim dosyası: `docs/MQ07_SC18_TLP521_OPTO_ISOLATION_20261015.md`. Sıradaki SC19 opto-triyak dersi. Önceki SC11–SC17 ders kontratları korunur; `main` / `[skip ci]`, Actions yok.


## 2026-10-15 · MQ-07 SC19 Opto-triyak ile flaşör — hedefli kapanış kanıtı / açık kabul
- SC19 artık kablosuz kavram kartı değil: sanal 5 V bağımsız DC güç, 2 Hz / %50 duty T1 flaşör, MOC3021 1/2 LED ve 4/6 opto-triyak uçları, ayrı yalıtılmış 12 V RMS AC kaynak, ST BTA16-600B MT1/MT2/G güç triyak, AC yük ve sanal sınırlama/kaçak dirençleriyle 14 bağlantılı ders olarak oluşturuldu.
- Sanal optik etki dışında **DC kontrol ile AC yük ağları bağlanmıyor**; direnç üzerinden yapılan örtük köprüler de reddediliyor. Her iki yarım periyot, sanal holding-current, sıfır geçişi, iki uçlu ON/OFF flaşör ve yük dalgasından RMS hesaplaması için yalnız SC19'e özel çözüm uygulanıyor.
- MOC3021 ve T1 için üretici kalibrasyonu iddiası olmayan ayrı ortografik ön görünümler, işlevli right-sidebar duty/frekans ve öğretici panel butonları eklendi. MOC3021 fiziksel izolasyon dayanımı ve gerçek sürme devresi olarak **kabul edilmedi**.
- `tests/qa-mq07-sc19-opto-triac-flasher-v11920.test.cjs` **9/9 PASS** — gerçek repo koduyla yalıtılmış JS yürütmesi; **tam Node testleri / bağımsız 1.655 ders QA / Windows file:/// görsel kabulü / osiloskop gerçek arayüz ölçümü NOT_RUN**. Ders veri kümesi 1.655 olarak açılıyor, SC19 wiring.
- Kanıt dosyası: `docs/MQ07_SC19_OPTO_TRIAC_FLASHER_20261015.md`. MQ-07 → MQ-09 → MQ-04 → MQ-05 → MQ-03/MQ-10 → MQ-12 → MQ-13 → MQ-00: **REVIEW** (DONE değil). SC11–SC18 korunur. Sıradaki müfredat: `sensor-analog-apps-src-01` (NTC ile sıcaklıkta çalışan devre).
- GitHub Actions kullanılmadı, yalnız `main` ve `[skip ci]`, force-push/geçici branch yok.


## 2026-10-15 MQ-07 SC20 NTC ISI ANAHTARLAMA

- NTC sensör + LM358P karşılaştırıcıya IRF540N sanal yük kolu eklendi: 9/12 → 13/19 (bileşen/kablo), yalnız sensor-analog-apps-src-01.
- Kaynak V8 simülasyonunda düşük-yüksek-düşük sıcaklık ve gate/güç kopukluğu; tam Node/Windows QA **çalıştırılmadı**. MQ-00 **REVIEW**, fiziksel kabul yok.
- Ayrıntı docs/MQ07_SC20_NTC_TEMPERATURE_SWITCH_20261015.md, hedef test tests/qa-mq07-sc20-ntc-temperature-switch-v11920.test.cjs. SC11–SC19 değişmez, Actions yok, [skip ci]. Sıradaki kaynak: sensor-analog-apps-src-02.


## 2026-10-15 MQ-07 SC21 PTC ISI ANAHTARLAMA

- sensor-analog-apps-src-02: PTC algılayıcıya 2 kΩ bölücü, U1 pin 2/3 düzeltmesi, gerçek katalog IRF540N ve H1 240 Ω sanal yük, 13 bileşen/19 kablo.
- İzole V8: 35 °C OFF → 65 °C ON (~100 mA) → 35 °C OFF; gate/yük kopukluğu fail-closed. Tam Node/Windows/üretici doğrulaması çalıştırılmadı; **MQ-00 REVIEW**.
- NTC SC20, SC11–SC19, ana dal ve kilitler korunur, Actions yok, [skip ci]. Detay docs/MQ07_SC21_PTC_TEMPERATURE_SWITCH_20261015.md. Sıradaki aday sensor-analog-apps-src-03.


## 2026-10-15 MQ-07 SC22 TERMOKUPL MV OLCUMU

- sensor-analog-apps-src-03: K tipi termokupl/ET4420 3 parça 4 kablo kaynak sahnesine UT33D+ DCV 200mV ve iki sanal prob eklendi (6/6). Yalnız SC22 opt-in ölçüm sürekliliği.
- İzole V8: 25/100/200 °C -> 0/3,096/7,138 mV; PV 25/100/200 °C; ters prob işareti ters; kontrolör ters/kopuk TC girişinde hata. Tam Node/Windows QA yok, fiziksel kabul yok, MQ-00 REVIEW.
- Korunan SC11–SC21, kilitler, Actions kullanılmadı ve [skip ci]. Detay docs/MQ07_SC22_THERMOCOUPLE_MV_20261015.md. Sıradaki sensor-analog-apps-src-04 PT100.


## 2026-10-15 MQ-07 SC23 PT100 THREE WIRE

- `sensor-analog-apps-src-04` PT100 3 telli eşleme ve ET4420 sanal kontrolör kontrolü hedefli onarıldı; 3 bileşen, 5 kablo korunur. 2 telli 8–9 köprüsüyle 3 tel bütünlüğü karıştırılmaz.
- İzole özgün JS simülasyonunda PT100 0/25/100 °C → PV 0/25/100 °C, ideal 100/109,735/138,505 Ω; çift taraf kablo değişimi PASS, üç tel kopma, yanlış giriş ve besleme kopması hata, tarihsel 2 telli köprü PASS (toplam 10/10 kaynak V8 senaryosu).
- 1.655 kaynaktan yalnız SC23 değişti, SC11–SC22 ve kilitler korundu. Gerçek kablo direnç telafisi, tam Node/Windows UI QA ve fiziksel üretici kabulü YOK: **MQ-00 REVIEW**. Actions kullanılmadı, `[skip ci]`.
- Detay: `docs/MQ07_SC23_PT100_THREE_WIRE_20261015.md`; Node hedef kaynağı: `tests/qa-mq07-sc23-pt100-three-wire-v11920.test.cjs`; sonraki ders `sensor-analog-apps-src-05` LM35.
