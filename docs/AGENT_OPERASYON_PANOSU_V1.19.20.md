# v1.19.20 — AGENT OPERASYON PANOSU

## ZORUNLU SÜREÇ — HER İŞTE

**Lider uzman → Çapraz uzman → MQ-12 Test → MQ-13 Repo Süreklilik → MQ-00 Teknik Direktör**

Protokol: `V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md`
Tek backlog: `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md`

## Teknik Direktör aktif takım standardı

Her aktif WP için görünür ekip kaydı zorunludur:

`MQ-00 Teknik Direktör → Lead → CrossCheck → MQ-12 → MQ-13 → MQ-00 karar`

İlgili ek uzmanlar WP risk alanına göre atanır.

Orkestrasyon: `V1.19.20_TECHNICAL_DIRECTOR_ORCHESTRATION_LOCKED.md`

## Sıradaki başlangıç

**WP-001 / MQ-P0-001 — Physical Dimension / Digital Twin Schema**

Durum: **READY_FOR_AUDIT**

## Aktif

| ID | Öncelik | Hat | Lider | Durum | Konu |
|---|---|---|---|---|---|
| WP-001 | P0 | HAT-A | MQ-02 | AUDIT | Fiziksel ölçü / digital twin şeması |
| WP-002 | P0 | HAT-A | MQ-04 | AUDIT | Terminal coordinate contract |

## Sıradaki

| ID | Öncelik | Hat | Lider | Durum | Konu |
|---|---|---|---|---|---|
| WP-003 | P1 | HAT-A | MQ-01/MQ-03 | BACKLOG | Front-view / asset sınıflandırması |
| WP-004 | P0/P1 | HAT-B | MQ-05/MQ-06 | BACKLOG | Simülasyon + akım/enerji yönü |
| WP-005 | P1 | HAT-C | MQ-07/MQ-08 | BACKLOG | Öğretici + MEB audit |
| WP-006 | P0 | HAT-D | MQ-11/MQ-12 | BACKLOG | Save/load + migration regresyonu |

## Kilitler

- Aynı anda en fazla 2 bağımsız write package.
- Şu an aktif iki paket read-only AUDIT aşamasındadır.
- Üretim koduna kaynak doğrulamasız fiziksel ölçü yazılmaz.
- main / v1.19.0 / v1.19.1 değiştirilemez.
- Geçici branch yok.
- Her DONE için G0–G8 zorunlu.


## Sürekli destek rolü — MQ-13

| Ajan | Bağlı olduğu lider | Çalışma biçimi | Sorumluluk |
|---|---|---|---|
| MQ-13 GitHub Süreklilik / Repo Organizasyonu | MQ-00 Teknik Direktör | Sürekli, yatay, varsayılan non-blocking | Dosya-klasör düzeni, branch/commit/Actions sağlığı, çalışma devamlılığı, durum/kanıt izlenebilirliği |

MQ-13 normal iş paketlerini durdurmaz. Kritik repo bütünlüğü riski yoksa düzeltme/önerileri ilgili çalışma paketine veya backlog'a ekler.


## MASTER QUALITY AUDIT v2 sonrası backlog

| ID | Öncelik | Hat | Lider | Durum | Konu |
|---|---|---|---|---|---|
| WP-007 | P0 | HAT-B/C | MQ-05/MQ-06/MQ-07 | BACKLOG | Signed akım/enerji akışı ve öğretici animasyonu |
| WP-008 | P0 | HAT-A | MQ-02/MQ-03/MQ-04 | BACKLOG | Kapak/plate 3B collision ve clearance |
| WP-009 | P1 | HAT-A | MQ-01/MQ-03/MQ-09 | BACKLOG | Asset orientation/sourceStatus/exact-family audit |
| WP-010 | P1 | HAT-C | MQ-08 | BACKLOG | MEB resmi metadata / kazanım / prerequisite |
| WP-011 | P1 | HAT-D | MQ-11/MQ-12 | BACKLOG | Versioned project migration chain |
| WP-012 | P1 | HAT-D | MQ-10/MQ-12 | BACKLOG | Gerçek browser / visual regression gate |
| WP-013 | P1 | HAT-D | MQ-12/MQ-13 | BACKLOG | CI G1–G4 kalite validatorları |
| WP-014 | P1 | HAT-D | MQ-13 | BACKLOG | Sürüm/doküman/default-branch/GitHub süreklilik temizliği |
| WP-015 | P1/P2 | HAT-A | MQ-02/MQ-04 | BACKLOG | Pano clearance/bend radius/duct fill/BOM mühendislik katmanı |

Ayrıntılı kanıt ve öncelik: `docs/MASTER_QUALITY_AUDIT_V2.md`.


## MASTER QUALITY AUDIT v3 — çapraz doğrulama ek işleri

| ID | Öncelik | Lider | Durum | Konu |
|---|---|---|---|---|
| WP-016 | P1 Audit | MQ-01/MQ-03 | BACKLOG | Tüm aktif binary assetlerin front/perspective/isometric piksel audit'i |
| WP-017 | P1 | MQ-13/MQ-12 | BACKLOG | Repo lock tamper-resistance / checker-workflow integrity |
| WP-018 | P2 | MQ-13/MQ-12 | BACKLOG | Docs-only fast CI, code değişiminde full CI |
| WP-019 | P2 | MQ-12/MQ-13 | BACKLOG | Runtime Windows package explicit allowlist |
| WP-020 | P1/P2 | MQ-01/MQ-09/MQ-13 | BACKLOG | Asset sourceAuthority + provenance/license metadata |

V3 ayrıntısı: `docs/MASTER_QUALITY_AUDIT_V3_AGENT_CROSSCHECK.md`.


## 2026-10-04 · WP-001 / WP-002 aktif çalışma kaydı

### WP-001 / MQ-P0-001 — Physical Dimension / Digital Twin Schema
Durum: **FIXING — M1/M2 ALTYAPI KABUL, KAPSAMA AÇIK**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-02
- CrossCheckAgents: MQ-01, MQ-03, MQ-04, MQ-11
- TestAgent: MQ-12
- RepoContinuityAgent: MQ-13
- Kabul edilen altyapı:
  - merkezi physical product registry,
  - component → product mapping ayrımı,
  - verified / approximate veri ayrımı,
  - mountingType / allowedPanelMounts,
  - panel geometry staging,
  - legacy pano geometrisini sessizce yeniden boyutlandırmama.
- İlk verified ürünler: Siemens 3RT2016-1BB41, Weidmüller 2466870000, Rittal 3241100, Siemens V20 6SL3210-5BB21-5UV1, SICK WTB4-3P2161.
- Ürün kapsamı tamamlanmadığı için MQ-P0-001 **DONE değildir**.

### WP-002 / MQ-P0-002 — Terminal Coordinate Contract
Durum: **FIXING — CONTRACT FOUNDATION KABUL, ANCHOR KAPSAMA AÇIK**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-04
- CrossCheckAgents: MQ-03, MQ-02
- TestAgent: MQ-12
- RepoContinuityAgent: MQ-13
- Commit: `4bdfcf90210a27a100df1c1e6b31b9700125dda4`
- CI run: `37206171985` → SUCCESS.
- Kabul edilen sözleşme:
  - schematic pin ile physical terminal anchor ayrıldı,
  - visualMatchStatus ve terminalGeometryStatus ayrı tutuluyor,
  - exact görsel olmadan terminalGeometryStatus=verified geçersiz,
  - verified anchor yalnız panelGeometryStatus=ready olduğunda kablo endpointini değiştirir,
  - diğer tüm cihazlar explicit approximate fallback kullanır.
- Henüz hiçbir ürünün physical terminal anchor'ı verified yapılmadı; gerçek terminal konumu uydurulmadı.
- MQ-P0-002 **DONE değildir**; exact ürün görseli + teknik terminal kaynağı ile anchor kapsamı gerekir.

### MQ-12 kanıtı
- WP-001/M2 düzeltme run `37205273860` → SUCCESS.
- WP-002 contract run `37206171985` → SUCCESS.
- Windows launcher smoke → SUCCESS.
- Repo lock / syntax / smoke / tam regresyon / Windows package → SUCCESS.

### MQ-13 repo sonucu
- Aktif dal yalnız `v1.19.20`.
- `main`, `v1.19.0`, `v1.19.1` referansları değişmedi.
- Yeni geçici branch oluşturulmadı.


## 2026-10-04 · WP-017 / WP-018 / WP-019 çalışma kaydı

### WP-017 — Repo lock integrity
Durum: **IMPLEMENTED — FINAL COMBINED CI VALIDATING**

- Server-side branch protection/ruleset bu özel repo koşulunda erişilebilir değildir.
- `scripts/check-v11920-integrity.cjs` immutable commit baseline ile checker/workflow bütünlüğünü doğrular.
- Korunan CI güvenlik sınırı:
  - `scripts/check-v11920-lock.cjs`
  - `scripts/check-v11920-integrity.cjs`
  - `scripts/ci-scope-v11920.cjs`
  - `scripts/check-docs-fast-v11920.cjs`
  - `.github/workflows/check.yml`
- Güncel baseline: `2a03cd850b533bffcf00af86ffeb870104efc02c`.
- Baseline pin commit: `62ddeb7df078125aee6585a6b50a0de6e237cc67`.
- Server-side protection olmadığı için bu katman kriptografik yetki kontrolü değildir; yanlış/drift commitlerini güçlü biçimde yakalayan defense-in-depth kontroldür.

### WP-018 — Docs-only fast CI
Durum: **IMPLEMENTED — LIVE GATE VALIDATING**

- `fast-gate` her push/PR'da repo lock + docs bütünlüğü + değişiklik kapsamını çalıştırır.
- Yalnız `docs/**` ve `V1.19.20_*.md` değişiklikleri docs-only sayılır.
- Runtime, test, script, launcher, örnek/proje, workflow ve diğer değişiklikler full regression + Windows package çalıştırır.
- Concurrency anahtarı commit SHA bazlıdır; yeni docs-only run, bekleyen/running full run'ı silemez.
- Bu operasyon panosu commit'i canlı docs-only gate kanıtı olarak kullanılacaktır.

### WP-019 — Runtime Windows package allowlist
Durum: **IMPLEMENTED — FULL CI VALIDATING**

- Commit: `1952cbf5d7858cb9d61fe109184d6f1ff508ed23`.
- Runtime paket artık explicit allowlist kullanır.
- Dahil: launcher, `dist/**`, kullanıcı örnek/projeleri, KULLANIM/README, ACS800/V20 kullanıcı kılavuzları, iki ABB PDF ve `third_party/**` lisansları.
- Hariç: `tests/**`, `scripts/**`, `tools/**`, `docs/**`, `.github/**`, ajan belgeleri ve tarihsel doğrulama/listeler.
- `python3 scripts/package.py --list` ZIP üretmeden manifest sözleşmesini test eder.


## 2026-10-04 · WP-014 çalışma kaydı

### WP-014 — Sürüm kimliği / current-truth / repo süreklilik temizliği
Durum: **IMPLEMENTED — FULL CI VALIDATING; DEFAULT BRANCH SETTING OPEN**

- TechnicalDirector: MQ-00
- LeadAgent: MQ-13
- CrossCheckAgents: MQ-10, MQ-11, MQ-12
- Release identity:
  - `APP_VERSION = 1.19.20`,
  - dashboard/topbar = `v1.19.20`,
  - `BASLAT.bat`, `BASLAT.html`, `KULLANIM.txt` = `v1.19.20`,
  - Windows ZIP adı runtime `APP_VERSION` üzerinden türetilir.
- Cache revision uygulama semver'inden ayrıldı; index bağımlılıklarında `?rev=20261004-wp014` kullanılıyor.
- Stale `#newBtn` / `version:6` üretim yolu kaldırıldı; topbar Yeni işlemi canonical `DTSEditor.create(...)` API'sine bağlandı. Güncel proje schema sürümü `CURRENT_VERSION=7`.
- `README.md`, `docs/GELISTIRME.md`, `docs/DURUM_VE_SINIRLAR.md` current-truth olarak `v1.19.20` ile eşitlendi.
- Tarihsel kök kayıtları taşınmadan `docs/HISTORY_INDEX.md` altında ayrıştırıldı; eski path/hash referansları kırılmadı.
- Docs-only run `37229956872` → **SUCCESS**; full jobs doğru biçimde skipped.
- Full validation run `37229922561`: fast-gate, G1–G4, Windows launcher ve gerçek browser visual smoke **SUCCESS**; tam regresyon + ZIP bu kayıt anında devam ediyor.
- Ara browser run `37229815142` Chrome `DevToolsActivePort` startup timeout nedeniyle fail oldu; aynı kod ailesindeki sonraki browser smoke başarılı olduğundan uygulama assertion hatası değildir.
- Repo ayarı hâlâ `default_branch=main`. Mevcut GitHub bağlantısında repository-settings mutation aksiyonu yok; bu nedenle ayar değiştirilmiş sayılmaz. Kullanıcıya görünür mitigation: README/DURUM içinde güncel kaynak için açıkça `v1.19.20` dalı veya Actions runtime artifact yönlendirmesi.


## 2026-10-06 · P0 Windows launcher düzeltmesi

- TechnicalDirector: MQ-00
- LeadAgent: MQ-11
- CrossCheckAgents: MQ-12, MQ-13
- Kullanıcı kanıtı: çıkarılmış Windows paketinde `BASLAT.bat` çalışıyor fakat uygulama açılmıyor.
- Kök neden: `explorer.exe` çağrısının 0 exit code'u yanlışlıkla browser-launch başarısı kabul ediliyordu; ayrıca workflow'un `DTS_LAUNCHER_TEST=1` smoke modu launcher tarafından okunmuyordu.
- Uygulama: Explorer yolu kaldırıldı; Edge/Chrome explicit discovery + doğrudan varsayılan HTML fallback'i geri getirildi; test modu gerçek launch'tan önce fail-safe kapı oldu.
- MQ-12: yeni `tests/windows-launcher-v11920.test.cjs` launcher contract/regresyon kilidi eklendi.
- MQ-13: yalnız `v1.19.20` değiştirildi; geçici branch ve Actions çalıştırılmadı; commit `[skip ci]` ile oluşturuldu.
- Durum: **IMPLEMENTED — gerçek kullanıcı Windows/Edge tekrar denemesi bekleniyor; sonraki toplu G7'de Windows launcher smoke tekrar çalıştırılacak.**


## 2026-10-06 — Section 2 continuation audit

- **3RV2011-1JA10:** exact-model real imagery was re-confirmed from an additional supplier source, alongside the already-qualified RS / MT24 / Eletrosul candidates. The normal-chat execution environment still cannot transport the external binary into the repository. The product therefore remains fail-closed and is **not** promoted; no family/shared substitute is accepted.
- **PROtop 2466870000:** official exact manufacturer STEP / DXF / DWG identities remain confirmed. GitHub exact filename searches for `2466870000.stp`, `2466870000.step`, `2466870000.dxf`, and `2466870000.prj` returned no usable CAD mirror. Terminal-center geometry therefore remains unverified and the next active work item is manufacturer CAD byte acquisition + parse.
- No GitHub Actions run was requested; Section 2 remains open with only these two external-byte blockers.


## 2026-10-06 — Section 2 FINAL CLOSURE

- **3RV2011-1JA10:** promoted. User-supplied exact Siemens product evidence plus manufacturer orthographic CAD front closes the visual/panel gate; 45 × 97 mm panel frame and independently verified main-terminal geometry remain locked.
- **Weidmüller PRO TOP1 120W 24V 5A / 2466870000:** promoted. User-supplied exact `2466870000_DXF.zip` was parsed successfully; the archive contains front/back/top/bottom/left/right exact DXF views. Runtime `P/M/L/N` terminal anchors are now bound to measured physical terminal rows and normalized to the official 35 × 130 mm panel frame with 0.5 mm geometry tolerance.
- PROtop runtime anchors: `P=(5.7,3.8) top`, `M=(16.0,3.8) top`, `L=(12.0,124.8) bottom`, `N=(17.2,124.8) bottom`. Physical output row is `+ + / - - -`; input row is `L/N/PE`.
- Selection 2 closure snapshot: **10/10 promoted, 0 blocked, 0 invalid**.
- Evidence record: `evidence/selection2/weidmuller-2466870000-dxf-terminal-evidence.json`.
- No GitHub Actions run was requested. Static branch consistency audit found no remaining PROtop fail-closed assertions in the updated Section 2 / physical-metadata regression contracts.


## 2026-10-06 — Profile/CAD + Digital Twin consolidation başlangıcı

- **Active package:** MQ-P1-004 / WP-008 profile/CAD runtime collider coverage.
- **Lead:** MQ-03 · **CrossCheck:** MQ-02/MQ-04 · **MQ-12:** profile/collision + Digital Twin contracts · **MQ-13:** repo continuity · **MQ-00:** coverage açık.
- **PROtop 2466870000:** exact user-supplied six-view DXF package profile evidence olarak yükseltildi. Exact top-view main-body silueti resmi 35 × 125 mm X/Z frame'e normalize edildi; `colliderStatus: verified-profile`, `colliderMethod: exact-cad-top-view-convex-profile`.
- **Runtime:** `panel.js::plateSection` ve `doorSection` artık verified collider profile polygonlarını gerçekten tüketiyor. Sadece status etiketi verilmesi verified collision confidence için yeterli değil; geometry array zorunlu.
- **Digital Twin:** ham kaynak fotoğraf audit orientation'ı ile aktif runtime visual orientation/policy ayrıldı. Derived-front ve sensor-flex runtime gerçeği artık unified registry'de eski perspective source audit'i tarafından yanlış bloke edilmiyor.
- **V20:** profile evidence verified, fakat raw profile polygon/mesh collision runtime'a henüz taşınmadığı için `colliderStatus: conservative-envelope` korunuyor.

- **3RV profile cross-check:** user-supplied exact `G_NSA0_XX_93051V.dxf` SHA-256 `1a498a463cf58d2406ef86cbe1f3b2dc6f0301312344c35498336f57db8178b3`; `10000_FRONT` = 45 × 97 mm, `11000_LEFT` = 96.9 × 97 mm. Product profile is verified; collider remains conservative because no exact top-view X/Z polygon is supplied.
- Evidence record: `evidence/selection2/siemens-3rv2011-1ja10-profile-evidence.json`.

- **MQ-12 static:** değişen runtime ve test dosyaları syntax-parse temiz. Actions çalıştırılmadı; `[skip ci]` korunuyor.
- **Next:** profile/CAD coverage'da güvenilir ham polygon/mesh kanıtı bulunan sonraki ürünü entegre et; ardından P0-001 local/regression hazırlığı → G7 preparation sırasına geç.


## 2026-10-06 — MQ-12 / MQ-13 regression preparation checkpoint

- Profile/CAD + Digital Twin write package current HEAD öncesi statik doğrulandı.
- Syntax-parse temiz: `dist/physical-metadata.js`, `dist/panel.js`, `dist/digital-twin.js`, `tests/physical-metadata-v11920.test.cjs`, `tests/panel-clearance-v11920.test.cjs`, `tests/digital-twin-v11920.test.cjs`.
- MQ-13 branch inventory temiz: yalnız `main`, `v1.19.0`, `v1.19.1`, `v1.19.20`; geçici branch yok.
- Locked ref current inventory: `main=e00b6fcf...`, `v1.19.0=6846c6ee...`, `v1.19.1=68372f80...`; aktif write yalnız `v1.19.20`.
- PROtop: `profileStatus=verified`, `colliderStatus=verified-profile`; exact CAD profile runtime collision consumer'a bağlı.
- 3RV: `profileStatus=verified`, `colliderStatus=conservative-envelope`; top-view X/Z polygon olmadığı için fail-closed.
- Digital Twin: runtime visual policy ile source-photo audit ayrımı regression contract'a bağlandı.
- **Durum:** VERIFY / REGRESSION PREP. Actions çalıştırılmadı. Sonraki adım kabul edilmiş sıraya göre **G7 preparation**, ardından anlamlı toplu **full G7**, sonra MQ-00 final review.


## 2026-10-06 — G7 preparation / protected baseline refresh

- G2 stale native-orthographic-only panel-ready check corrected to consume unified Digital Twin runtime visual policy truth.
- G1 now reports policy-aware active anchors + verified profile/collider coverage.
- Protected change protocol completed:
  - BOOTSTRAP atomik commit: `75b7b4bafc64466baa6c211f3d7c89505d790f07`
  - PIN commit: `a03a2d5432b6f02661734a0132900cf55739322b`
- MQ-13 protected-file normalization audit: **8/8 BASELINE MATCH**.
- Quality-gates syntax: **OK**.
- **Durum:** G7_PREPARED. Actions tasarrufu nedeniyle henüz run yok. Sıradaki tek Actions kullanımı: toplu full G7 milestone; başarı sonrası MQ-00 final review.


## 2026-10-06 — Full G7 dispatch blocker

- Target HEAD: `97429b591d3bfd902e6ae7a1860d2d6876dfc42b`.
- Workflow `.github/workflows/check.yml` yalnız `pull_request -> v1.19.20` ve `workflow_dispatch` ile tetiklenir; push trigger kullanıcı politikası gereği kapalıdır.
- Current connected GitHub toolset yeni `workflow_dispatch` başlatma aksiyonu sunmuyor. Temporary validation branch/PR açmak repo branch-lock politikasını ihlal edeceği için kullanılmadı.
- GitHub API current HEAD workflow query sonucu: **0 run**.
- Container fallback denemesi GitHub DNS erişimi olmadığı için repo clone aşamasında durdu; hosted G7 yerine sahte/local başarı raporlanmadı.
- Protected baseline hazırlığı temiz: BOOTSTRAP `75b7b4bafc64466baa6c211f3d7c89505d790f07`, PIN `a03a2d5432b6f02661734a0132900cf55739322b`, protected set 8/8 baseline match.
- **MQ-00 decision:** `BLOCKED` — code/profile/Digital Twin preparation complete; final DONE requires one actual full G7 run at current `v1.19.20` HEAD (or a later HEAD that contains the same changes).


## 2026-10-06 — Actions-free G7-equivalent static audit after repository migration

- **TechnicalDirector:** MQ-00
- **Lead:** MQ-13 (repo continuity) + MQ-12 (validation evidence)
- **Cross-check:** MQ-02/MQ-03/MQ-11
- New repository migration continuity defect was found and repaired without weakening locks: copied G0 workflow still referenced source-repo immutable SHAs that were absent from the target repo.
- Locked history restored in target repo:
  - `main=aa62ddeb68de4211d66e92ecc8e0adebc3f901fa`, exact old-main tree 553/553,
  - `v1.19.0=faeef90ef3ed037c71a1715610ee0f9d33913aa4`, exact tree 614/614,
  - `v1.19.1=ddd822ea124072a43a6a7bd501b73290110e3480`, exact tree 635/635.
- Active `v1.19.20` source tree remains 691/691 exact against the migrated source snapshot.
- G0 workflow was re-pinned to target-repo immutable SHAs; integrity baseline is `7d1ef9cf39ebf6de2614ad7423551c64ea35a5cc`.
- Protected set normalized audit: **8/8 MATCH**; all four LOCKED policy blobs unchanged.
- Static quality evidence at current migrated code truth:
  - G1: **10 products / 11 mappings / 8 verified terminal geometries / 3 verified profiles / 1 verified-profile collider**.
  - G2: **Selection 2 = 10/10 promoted, 0 blocked, 0 invalid/blocker rows**.
  - G3: verified MEB source metadata remains separated from unverified app learning goals; no false official outcome promotion found.
  - G4: signed-flow golden suite source and runtime contract present; executable run pending.
  - Runtime package allowlist: **492** entries; all mandatory launcher/runtime/example/license/PDF files present.
  - Test corpus: **77 `.test.cjs` files**, including quality-gates, repo-lock, runtime-package, Windows launcher, browser visual, signed-flow, migration and physical-metadata contracts.
  - Windows launcher static contract: smoke gate before launch; no `explorer.exe`; Edge/Chrome + default HTML fallback preserved.
- Current repo-write HEAD after documentation record: `eb0fbe803d16b7f932f297d6e7ab3d4bda439d17`.
- Actions usage: **none**; migration repair + audit commits use `[skip ci]`.
- **MQ-12:** STATIC PASS / EXECUTION PENDING.
- **MQ-13:** PASS — migration continuity repaired.
- **MQ-00:** BLOCKED only on executable evidence: full regression, G1–G4 actual execution, browser smoke, package ZIP build/extract/hash, and real Windows cmd.exe acceptance.


## 2026-10-06 — Historical execution evidence narrowing

- Source repo nearest complete green run: **37311847588 @ 8b37af601a899d41c193bcf037deb49d0f2d121a**.
- Run result: fast-gate SUCCESS; validate-and-package SUCCESS; browser-visual-smoke SUCCESS; real Windows launcher smoke SUCCESS.
- validate-and-package green steps include G1–G4, full regression and Windows ZIP build/extract verification.
- This historical green is not promoted to current-HEAD full PASS because 44 files changed afterward (41 validation/runtime relevant).
- Dependency-aware carry-forward:
  - G3 contract/dependencies unchanged → historical execution-backed PASS retained.
  - G4 solver core + signed-flow golden suite + g4 runner unchanged; app.js diff is outside signed-flow class logic → strong historical execution evidence retained, current rerun preferred.
  - G1/G2 changed → current execution pending.
  - Browser runtime changed → current execution pending.
  - BASLAT.bat changed → real Windows current execution pending.
  - package.py unchanged but packaged bytes changed → current ZIP build/extract/hash pending.
- Source run **37452013760 @ cca96b...** failed only at fast-gate and skipped downstream jobs; it is not treated as a runtime failure. Target-repo migration G0 continuity defect has already been repaired.
- **MQ-12 status:** partial execution evidence recovered; remaining current-head execution scope is G1/G2 + full regression + browser + package + Windows launcher. G3 is execution-backed; G4 is execution-backed historically with current rerun preferred.


## 2026-10-06 — Current-head G1/G2/G3 Actions-free execution closure

- **Lead:** MQ-12 · **Cross-check:** MQ-13/MQ-02/MQ-03.
- Current target-repo modules were executed directly in-memory; no GitHub Actions run was started.
- First G1 execution exposed a real `photoeye` Digital Twin validator drift: physical truth used the approved `connectorized-external` terminal state, but `DigitalTwin.validate()` allowed only `verified|unverified`.
- Fix: `f1e27b439f27785079f7cf59824604c59b6d6554`.
- Regression lock: `a3582cb572fd38580f10e53068457bb2235cee1b` adds explicit SICK connectorized external Digital Twin coverage.
- **G1 current execution: PASS** — 10 products, 11 mappings, 10 verified dimensions, 8 verified terminal geometries, 8 active anchor-eligible mappings, 3 verified profiles, 1 verified-profile collider, 11 Digital Twin records, 0 invalid.
- **G2 current execution: PASS** — 8/8 critical product orientation audit, Selection 2 10/10 promoted, 0 blocked, 0 invalid. Unknown license/usage-right fields remain explicit, not fabricated.
- **G3 current execution: PASS** — 1655 lessons, 1219 source-verified, 260 partial, 176 unverified, 0 invalid, 0 falsely verified official outcomes.
- **G4:** unchanged solver core/golden suite retains historical execution-backed evidence; current full Node test-runner execution remains pending.
- Remaining executable closure scope: full Node regression harness, current browser visual smoke, current ZIP build/extract/hash, real Windows launcher acceptance, then MQ-00 final review.


## 2026-10-06 — Project migration current execution

- Actions-free in-memory execution completed for `tests/project-migration-v11920.test.cjs` contract logic against current target-repo files.
- Migration registry: `MIN_SUPPORTED_VERSION=5`, `CURRENT_VERSION=7`, contiguous migrations `5→6→7`.
- Shipped fixtures executed successfully: v5 `K1_S2_Muhurleme`, v6 `Ileri_Geri_Motor_v1.6.3`, v7 `220V_24V_Esnek_Prob_v1.15.1`.
- All three preserve circuit structure/connectivity and current-schema clean/parse round-trip semantics.
- Recognizable unversioned legacy payload migrates through explicit v5 baseline to v7 without mutating input.
- Unsupported v4, future v8 and invalid schema values remain fail-closed.
- Current `dist/app.js` still routes direct load, cached load and imported values through shared `DTSProjects.migrate` / `CURRENT_VERSION` paths.
- **Result: CURRENT EXECUTION PASS.**


## 2026-10-06 — Current regression narrowing evidence

- **Project migration current execution:** PASS — shipped v5/v6/v7 fixtures, structural preservation, round-trip, legacy migration and unsupported-schema rejection all clean.
- **Asset quality current execution:** PASS — product manifest/runtime exact match; 8 products (7 exact / 1 family), 202 PLC assets (88 exact / 114 family), 0 invalid descriptors; conservative unknown-rights behavior preserved.
- **Selection 2 queue current execution:** PASS — 10/10 promoted, 0 blocked, 0 invalid; closure snapshot synchronized with live physical promotion truth.
- Remaining full-regression gap is now native Node test-runner orchestration plus environment-bound browser visual, package build/extract/hash and Windows launcher execution.


## 2026-10-06 — Browser/package/launcher contract narrowing

- Browser visual contract current execution: **PASS**. CDP runner/golden contract is unchanged from the last full green run; only current runtime-in-browser execution remains pending.
- Windows launcher current contract execution: **PASS**. Smoke gate precedes launch, no executable explorer.exe path, Edge/Chrome discovery + default HTML fallback + visible failure path all intact. BASLAT.bat changed after the historical green run, therefore real current cmd.exe acceptance remains pending.
- Runtime package manifest current execution: **PASS**, 492 allowlisted files, required files complete, developer/CI/docs payload excluded.
- package.py is byte-identical to the last full green run; current runtime bytes changed, therefore current ZIP create/CRC/extract/SHA evidence remains pending.
- Remaining environment-bound closure: native Node full test orchestration + real Chrome visual smoke + current ZIP byte verification + real Windows cmd.exe smoke → MQ-00 final review.


## 2026-10-06 — G7 timeout + routing closure checkpoint

- Run `37509910723` cancelled by the configured 15-minute validate/package timeout; no regression assertion caused the cancellation.
- Passed before cancellation: fast-gate, G1–G4, first-launch smoke, real Chrome visual smoke, real Windows cmd.exe launcher smoke.
- Workflow timeout hardened to **30 minutes** at `36826116d572258f119654da8147850b152098ad` with `[skip ci]`.
- Remaining prior regression failure (Siemens 3RT A1 routing) root cause closed in runtime at `6d10060550ff3696daec70585fe5bd60ec79baf8`: verified terminal stub now escapes its own device clearance box before routing.
- Isolated current-runtime execution: A1 connection **PASS**, valid route produced, physical terminal endpoints preserved.
- **MQ-12:** known blockers closed; full native Node suite + current ZIP byte verification pending external execution capacity only.
- **MQ-13:** repo continuity remains PASS.
- **MQ-00:** final sign-off still waits for one complete native regression + ZIP verification evidence; no new code blocker is known.


## 2026-10-06 — FINAL MQ-00 closure

- Final full G7 run: **37513253115 @ a68fe72c4502956c3fb9d1da23f0a8ae6ff663d4 — SUCCESS**.
- fast-gate: PASS.
- G1–G4: PASS.
- first-launch smoke: PASS.
- full native Node regression: **697/697 PASS**.
- real Chrome visual smoke: PASS.
- real Windows cmd.exe launcher smoke: PASS.
- Windows package build/extract/hash: PASS — 492 files, CRC passed, extracted hashes passed, package SHA256 `f0eb0995838ca9c76c55870609cd35ab502d01603c9294f68520922451eefd73`.
- Windows artifact ID: `11436637332`; browser artifact ID: `11436820129`.
- Temporary push trigger removed after successful run; normal pull_request + workflow_dispatch mode restored.
- Final integrity baseline cleanup: `f18ec71686a6e198d7470885c47e8b91622fabe4` → pin `82dde8db9346b0b50a86ce1e789c00149db2c27e`.
- **MQ-12: FINAL PASS.**
- **MQ-13: FINAL PASS.**
- **MQ-00: FINAL PASS / CLOSED.**
- v1.19.20 now has complete executable evidence and no known blocking regression.


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
