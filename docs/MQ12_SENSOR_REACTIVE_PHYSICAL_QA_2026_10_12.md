# MQ-12 physical compatibility QA — sensor and reactive evidence (2026-10-12)

Read-only verification using the original user-uploaded repository ZIP and native Node.js solver. **This is not an approval to alter locked/canonical lesson diagrams, or to claim physical device/UI acceptance.**

## Baselines preserved

| Gate | Verified |
| --- | --- |
| Curriculum / wired lessons | 1,655 / 722 |
| Wired classification | 722/722 (456 controlled, 67 unsupported, 199 passive, 0 missing) |
| Independent electrical stability | 2,166/2,166 PASS |
| Control-profile stability | 2,052/2,052 PASS |
| Response | 421 PASS / 35 REVIEW |
| Restoration | 414 PASS / 42 REVIEW |
| Node regression suite (38 existing + 5 new) | **43/43 PASS** |
| Batch N source QA | **1,519/1,519 PASS; 0 issues** |
| Overall MQ-12 behavior | **REVIEW** |

## 35 missing-target sensor lessons

Run `node scripts/qa-mq12-sensor-polarity-v11920.cjs` to reproduce the full per-lesson ledger.

- **35/35** currently lack a modeled physical target. Do not add a guessed metal target to all cases, and do not mark any synthetic target fixture as canonical PASS.
- **1 confirmed direct-load topology mismatch:** `dual-dc-2` feeds lamp X1 from G2.P, lamp X2 to sensor BK, common 0 V between G1 and G2. This is **NPN/sinking** topology but the placed `proximity` component defaults to **PNP/sourcing**. In a clone-only test, NPN switches the lamp OFF→ON→OFF while unchanged PNP does not. Reconcile the *physical product type* and the locked lesson connections before editing either.
- **1 explicit title/polarity conflict:** `open-collector-1` names NPN but the placed `proximity` sensor is PNP. Review intended wiring/product/title as one canonical decision.
- **8 topic/model conflicts:** lessons describing *piezo, weight, temperature/thermal, ultrasonic or chemical* sensors currently place a generic **inductive `proximity`** sensor. The detector may respond to a synthetic metal target but that does **not** demonstrate the real lesson's physical mechanism. Investigate model/template fidelity first. The 8 IDs are `sensor-analog-apps-src-08`, `sensor-analog-apps-outline-047`, `sensor-analog-apps-outline-048`, `sensor-analog-apps-outline-085`, `sensor-analog-apps-outline-089`, `sensor-analog-apps-outline-105`, `sensor-analog-apps-outline-121`, `sensor-analog-apps-outline-138`.
- These flags can overlap. Only simple **direct BK→lamp** loads with a grounded supply return are assigned a proven required PNP/NPN polarity; relay circuits and ambiguous topologies do not receive speculative polarity claims.

## Seven native RC/RL restoration reviews

Run `node scripts/qa-mq12-reactive-time-constants-v11920.cjs` to reproduce the measured values with 100 ms native numerical steps from 0 to 10 s (**707 stable solver phases**, canonical lessons unchanged).

- **4 capacitor lessons:** series charge resistor 10 kΩ and capacitor 100 µF give nominal **R·C=1 s** during charging. When the momentary button opens, the disconnected charging path does **not** imply that the capacitor is perfectly isolated: the native voltmeter model has **10 MΩ input impedance**, creating a very slow discharge path **τ ≈ 10 MΩ × 100 µF = 1,000 s**. The native numerical trace fell from approximately **7.606 V at 0.4 s** to **7.533 V at 10 s**, with measured off-state τ ≈ **1,000.05 s**. Restoration therefore correctly remains **REVIEW**, not FAIL or PASS. Previous “no discharge route” wording is superseded by this high-impedance instrument finding.
- **3 inductive lessons:** 2 H reactor and 100 Ω resistor give nominal **L/R = 0.02 s**. Their native meter currents approached zero by the 10-second window; a separate release-time tolerance and real instrument acceptance policy is still required before upgrading restoration.
- **Do not conflate:** a virtual solver sample schedule with actual hardware time calibration, or numerical stability with verified discharge safety.

## Reproduction and guardrails

```sh
node scripts/qa-mq12-sensor-polarity-v11920.cjs
node scripts/qa-mq12-reactive-time-constants-v11920.cjs
node --test tests/qa-mq12-physical-evidence-v11920.test.cjs
```

The new 5-test suite passed using the native implementation and unmodified canonical objects; combined with the prior 38 tests **43/43 PASS**. The detailed evidence is also available as a JSON report in this conversation. No GitHub Actions executed and commits use `[skip ci]`.

**Next acceptance blockers:** confirm the 8 lesson-topic sensor models, resolve `dual-dc-2` and `open-collector-1` product/diagram polarity, supply grounded physical stimuli for the 35 targets, and define suitable restoration tolerance/measurement semantics for the 7 reactive examples. Keep all 42 distinct behavior REVIEW lessons open until independently justified.


## 2026-10-13 — Kanonik sensör ürün ve öğretim başlığı uzlaştırması

Bu bölüm önceki "1 kutup bağlantı uyuşmazlığı / 1 başlık uyuşmazlığı" tespitinin **güncel çözüm durumudur**; yukarıdaki kayıtlar tarihsel başlangıç kanıtıdır.

- **\`dual-dc-2\` — DÜZELTİLDİ (ürün kutuplaması):** \`dualDcCircuit(v===1)\` üreticisi, üç uçlu eski \`proximity\` PNP ürünü yerine mevcut katalogdaki \`autonics-pr12-npn\` NPN sensörünü yerleştirir. G1/G2 ortak 0 V kablosu, G2 pozitif besleme → H1 → BK dönüş yolu, BN/BU uçları ve tüm 5 rehberli kablo **korundu**. Sadece \`s\` ürün tipi ve bileşenin açıklayıcı etiketi değişti. Orijinal devre klonunda sanal metal hedefi uzak→yakın→uzak sürüldüğünde **NPN OFF→ON→OFF**, kasıtlı PNP kontrol örneğinde ise **OFF→OFF→OFF** elde edildi. Kanonik sensörün fiziksel hedefi **hâlâ tanımsız**; fiziksel uyarım kabulü REVIEW.
- **\`open-collector-1\` — DÜZELTİLDİ (başlık):** önceki başlık NPN diyordu; ancak kanonik şema, \(K1) MQ kalite kilit kaydı, ve Batch J açıklaması açıkça PNP kaynak/sourcing ürününe dayanıyor. Başlık **"PNP sourcing sensörle yük sürme"** olarak düzeltildi. Sensör modeli, kablolar, pinler, 2–4. varyantlar ve kabul kilitleri değiştirilmedi. Batch J 3. varyanttaki doğrulanmış \`10 kΩ BK → 0 V pull-down\` değeri öğretim metninde görünür hale getirildi; R1 devresi zaten doğruydu.
- **Sekiz ayrı konu/model uyuşmazlığı — REVIEW:** piezo, ağırlık, sıcaklık/ısı, ultrasonik ve kimyasal sensör başlıklarında **endüktif proximity** şablonu bulunuyor. İlgili sekiz dersin kablo veya ürünleri otomatik değiştirilmedi; uygun üretici özellikleri, terminal eşlemesi ve eğitim senaryosu seçimi gereklidir.
- **35 fiziksel hedefi eksik sensör** ve **7 RC/RL restoration REVIEW** açık tutuldu; hiçbir kanonik derse tahmini hedef, sanal model sonucu için gerçek donanım kabulü veya uydurma boşalma yolu eklenmedi.
- **Yeniden yürütülen kaynak doğrulamaları:** orijinal 82 MB ZIP'den alınan tam 1.655 dersin kaynak QA'sı PASS, Batch N 1.519/1.519 kaynak QA PASS (0 issue), 722 kablolu dersin **2.166/2.166 gerçek solver aşaması kararlı**. Dokuz geri dönüş veya diğer davranış REVIEW kayıtları, sırf kararlılık nedeniyle PASS sayılmaz.
- **Gerçek Node testleri:** bu değişiklik özelindeki iki yeni regresyon dosyasındaki **6/6 test**, kaynakla ilgili önceki sensör/open-collector testlerindeki **8/8 test**, ayrı bağımsız 722 × 3 faz denetimi **1/1 test** olmak üzere **15/15** PASS. Önceki **43/43** geniş regresyon sonucu önceki commitlerin tarihsel kanıtıdır; bu güncel GitHub HEAD'de **tam 43 test tekrar yürütülmedi**, tüm-suite PASS iddiası oluşturulmaz.
- İşlemler GitHub normal sohbet bağlantısından, tüm commitlerde \`[skip ci]\`, GitHub Actions **kullanılmadan** tamamlandı.

**Sıradaki kabul:** 35 fiziksel uyarımı gerçek materyal/proximity sensör ilkesiyle tanımla, sekiz başlık/model uyumsuzluğunu ayrı uzman değerlendirmesine al, 7 reaktif devre için kabul toleranslarını ve süreleri belirle, tam HEAD Node regresyonunu çalıştır; Windows file:/// UX kabulünü ayrıca yap.
