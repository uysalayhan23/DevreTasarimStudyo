# MQ-12 — Üretici ve simülasyon arayüzü eksiklerinin kanıtlı envanteri (2026-10-13)

**Karar: fiziksel kabul REVIEW.** Yalnız sanal simülasyon, katalog metaverisi ve resmî üretici dokümanları incelendi. Kilitli/kabul edilmiş ders, kablo, malzeme görseli, panel ölçeği ve başlatıcı değiştirilmedi. GitHub Actions kullanılmadı.

## Tekrar çalıştırılabilir kaynak denetimi

- \`node scripts/qa-mq12-interface-model-gaps-v11920.cjs\` — kaydı \`build/qa-mq12-interface-model-gaps.json\` dosyasına yazar.
- \`node --test tests/qa-mq12-interface-model-gaps-v11920.test.cjs tests/qa-mq12-small-batches-v11920.test.cjs\` — **13/13 PASS** (8 yeni üretici/model koruması + 5 mevcut küçük-batch regresyonu) gerçek Node.js v22 çalıştırması.
- İki yeni dosya **tam olarak test edilen ZIP çalışma kopyasının Git blob SHA içeriğiyle eşleşecek şekilde** GitHub'a kaydedildi.
- Aynı ZIP üzerinde bağımsız \`qa-tutorial-1655-simulation-v11920.cjs\` **1.655 ders / 722 kablolu devre QA PASS**, \`qa-tutorial-722-sequential-v11920.cjs\` **2.166/2.166 elektriksel solver fazı kararlı PASS**, Batch N \`qa-tutorial-practice-1519-v11920.cjs\` **1.519/1.519 kaynak QA PASS** çalıştırıldı.
- **Test senaryoları arasında 35 V üst sınırını aşan yalnız test kopyası vardır ve bu durumda kabul REVIEW kalır. Önceki 63/63 Node sonucunun kapsamı önceki çalışma turuna aittir; bu turda güncel HEAD üzerindeki tüm 63 test bir arada çalıştırılmadı.** Bu nedenle bu değişikliklerin "yeni tam-suite 70/70 PASS" olduğu ileri sürülmez.
- 35 fiziksel algılama hedefi tanımlanmamış sensör ve 7 reaktif restoration REVIEW dersinin kapsamı korunur. Pasif/stability-only veya desteklenmeyen kumanda sonuçları bir davranış PASS'i değildir.

## U1KT003 ve somut sesli ikaz ürünü

| Fiziksel ürün | Üreticinin teyit ettiği değer | Eğitim yazılımındaki açık kapı |
|---|---|---|
| wenglor **U1KT003** | 18–30 V DC; iki anahtarlama çıkışı; çıkış başına azami **100 mA**; ayarlanabilir PNP/NPN, NO/NC; M12 dört pin | Derslerdeki 24 V bu aralığın içinde. **Ürün özelinde gerçek çıkış ayarı**, anahtarlanan bobin/yük akımı ve BK/WH ataması teyit edilmeden fiziksel kabul verilmez |
| Schneider Electric **XB5KSB** buzzer | **24 V AC/DC ±%10**; belirtilen akım tüketimi **≤28 mA**, 22 mm panel tipi | Fiziksel ürün adayı bulunmuştur. Ancak katalogdaki \`buzzer\` malzemesi yalnız \`1/2\` uçlu genel/temsilî modeldir: XB5KSB'nin terminal düzeni/ürün geometrisiyle **birebir eşlendiği doğrulanmamıştır** |
| Kobastar **SB2** yük hücresi | **10 V** önerilen / **15 V** azami uyartım, nominal **2 mV/V** köprü sinyali | Diferansiyel sinyal işleme, ölçüm aralığı, çıkıştan röle kumandasına dönüşüm doğrulanmalı |
| MQ-2 elektronik sensör modülü | **5 V** modül beslemesi ve analog/dijital çıkış seçenekleri | Mevcut 24 V PNP anahtarlama şablonunun yerine doğrudan takılacak eşdeğer parça değildir |

**Çok önemli:** XB5KSB için 28 mA değeri ile U1KT003 için 100 mA sınırının karşılaştırılması **tek başına bir kablo şemasının veya gerçek ürün uyumunun onayı değildir**. Mevcut röle bobininin katalog kaydında doğrulanmış akım tüketimi, buzzer'ın mevcut katalog kaydında üretici anma gerilimi yoktur. Üretici çıkışındaki gerilim düşümü ve gerçek terminal eşleşmesi ayrıca kabul kapısıdır.

## Gerçekte var olan ve eksik kalan simülasyon davranışları

- **Yük hücresi:** \`dist/device-behavior.js\` içindeki \`load-cell\` modeli zaten çalışır. Kanonik katalog modelinde 10 V uyartımla nominal 2 mV/V oranı kullanılarak **tam yükte 20 mV**, yarım yükte **10 mV** değerleri hesaplandı. **Eksik olan:** üretici doğrulamalı diferansiyel ölçüm/karar ve gerçek röle/PLC arabirimi.
- **Sıcaklık (NTC/PT100):** çalışan analog direnç modelleri var. NTC modelinin sanal değeri 25°C'de **10.000 Ω**, 35°C'de **yaklaşık 6.506 Ω**; PT100 modeli 25°C'de **yaklaşık 109,735 Ω**, 35°C'de **yaklaşık 113,608 Ω** hesapladı. Bunlar **sanal model sayıları**, gerçek parça kalibrasyonu değil. Eşik/kontrol arayüzü doğrulaması ayrı bekliyor.
- **Piezo:** katalogdaki \`tutorial-piezo\` yalnız gösterim amaçlı, titreşim/sinyal fiziği modeli yok.
- **MQ-2:** \`arduino-mq2\` Arduino analog bileşen işaretidir. \`Device.output\` genel dalı hem MQ-2 hem de piezo için **5 V** gösterebilir; bu rakamlar **fiziksel algılama çıktısı olarak geçerli sayılmamalı**. Gerçek ölçüm/kontrol yolu ayrıca modellenmeden kabul REVIEW.
- Sekiz uyumsuz dersin **8/8'inde kanonik kaynaklar 24 V** gösteriyor; hiçbirine varsayımsal fiziksel hedef eklenmedi. Yeni QA \`physicallyApproved:false\` durumunu sistematik korur.

## Üretici kanıt adresleri

- wenglor U1KT003: https://www.wenglor.com/en/Sensors/Ultrasonic-Sensors/Ultrasonic-Distance-Sensors/Distance-Sensor/p/U1KT003
- Schneider XB5KSB resmî PDF: https://iportal.se.com/Contents/docs/SQD-XB5KSB.PDF
- Kobastar SB2 teknik PDF: https://kobastar.com/wp-content/uploads/2024/03/Datasheet-SB2.pdf
- Olimex SNS-MQ2 ürün bilgisi: https://www.olimex.com/Products/Components/Sensors/Gas/SNS-MQ2/

**Sonraki güvenli kapsam:** Önce ürünlerin gerçek terminal/simülasyon arayüzünü kanonik şema değiştirmeyen *standalone fixture* içinde ayrıştır; ardından uygun ölçümden kumandaya dönüşüm ve tam HEAD regresyonunu ayrı doğrula. Kullanıcıdan yerel test veya Actions istenmez.

## Güncel kaynak sürümü eşlemesi

Bu turun sonunda yüklenen eski ZIP'in `dist/simulation.js`, `dist/tutorial-lessons.js` ve `dist/tutorial-sensor-batch-j.js` dosyaları, önceki doğrulanmış [skip ci] değişiklikleri uygulanarak **GitHub HEAD blob SHA değerleriyle birebir eşitlendi**. `dist/device-behavior.js`, `dist/library.js`, `dist/design-library.js`, `dist/tutorial-source-outline.js` ve tam QA kaynak yükleyicisinin de Git blob eşitliği kontrol edildi. Bu eşleşen modüllerle **13/13 Node testi yeniden PASS**; 1.655/1.655 kaynak QA, 2.166/2.166 temel solver kararlılığı ve Batch N 1.519/1.519 kaynak QA yeniden PASS. Eski bağımsız üç aşama raporundaki sekiz restoration REVIEW sonucu açık kaldı. Genel davranış kabulü REVIEW durumundadır.


## 2026-10-13 follow-up: actually executed combined Node QA and virtual comparator guard

**Verified baseline at this turn:** the ZIP snapshot was overlaid with GitHub-verified source file versions. In particular, \`tests/qa-tutorial-722-sequential-v11920.test.cjs\` was refreshed from GitHub and the blob SHA matched \`18754b5a8fca0a7a0d6ec318a5907204c60f782d\`. The older ZIP's test improperly expected eight existing restoration REVIEW records to be zero; the GitHub version checks that they remain REVIEW without claiming an electrical solver fault.

**Actually executed in a single real Node.js v22 \`node --test\` run:** **51/51 PASS, 0 FAIL**, covering the available MQ-12 small-batch, manufacturer interface, 722 sequential, five new virtual decision, four new sonic voltage-margin, 1,655-curriculum and Batch N regressions. Complete live test log and source/Bach N audits are provided as conversation downloadable artifacts.

**Limit:** This did **not** re-execute the entire historical 63-plus-eight test collection. The uploaded older ZIP lacks several later test/runner files and external GitHub raw download is unavailable in this runtime. Previous full-suite PASS counts are historical; **do not certify 71/71 PASS** from this run.

- Native curriculum QA: **1,655 lessons; 722 wired; 0 missing definitions; 0 blocked/short circuit; PASS**.
- Native sequential solver: **722 × 3 = 2,166 stable phases**; remaining **eight baseline restoration REVIEW** entries. This is electrical stability PASS, not behavior-closure PASS.
- Batch N source QA: **1,519/1,519 PASS; zero issues**, 525 wired, 923 reference-only, 71 reference-with-wires and 2,085 observations.
- Native transfer functions: \`load-cell\` with 10 V excitation gives **0/10/20 mV** for 0/500/1000 kg virtual examples; NTC resistance decreases with temperature and PT100 increases. A **standalone virtual threshold example** checks units and refuses malformed thresholds. It **does not** simulate or approve an actual differential amplifier, ADC, temperature controller, PLC, relay or physical load.
- \`tutorial-piezo\` and \`arduino-mq2\` fall through a generic \`Device.output\` 5 V graphical value. This **is not a validated piezo vibration or MQ-2 gas concentration transfer function**. Both remain virtual decision \`null\` and \`physicalAcceptance:'REVIEW'\`.
- 35 original sensor targets and seven reactive restoration cases remain open. Canonical graphs, identities, assets, terminal positions and launch path were not edited.

### Additional physical buzzer acceptance issue — upper bound

The U1KT003 manufacturer's switching output voltage drop is specified **< 2.5 V** and output limit **100 mA**. Schneider XB5KSB is nominal **24 V ± 10%**, ≤ **28 mA**. With a 24 V nominal supply, the calculated worst-case lower-bound output is **24 − 2.5 = 21.5 V**, while the sounder's lower rated supply limit is **21.6 V**. A small **−0.1 V worst-case margin** means the datasheet limits alone cannot *guarantee* a direct output-voltage match, even though the current limits look favorable. The actual output drop at 28 mA may be smaller; no incompatibility or failure was proven, only insufficient worst-case acceptance evidence. The simulator's generic \`buzzer\` terminal \`1/2\` mapping still has not been verified against the Schneider product; relay coil loading and NO/NC settings need independent confirmation.

Source of manufacturer electrical figures:
- https://www.wenglor.com/en/Sensors/Ultrasonic-Sensors/Ultrasonic-Distance-Sensors/Distance-Sensor/p/U1KT003
- https://iportal.se.com/Contents/docs/SQD-XB5KSB.PDF

New reproducible files:
- \`scripts/qa-mq12-analog-decision-guard-v11920.cjs\`
- \`tests/qa-mq12-analog-decision-guard-v11920.test.cjs\`
- \`scripts/qa-mq12-sonic-headroom-v11920.cjs\`
- \`tests/qa-mq12-sonic-headroom-v11920.test.cjs\`

All four GitHub file content blob SHAs were verified against the actual tested working copies. All commits \`[skip ci]\`; **no GitHub Actions**.
