# MQ-00 / MQ-07 SC30 — LDR kontrollü 12 VDC lineer dimmer (2026-10-15)

Repo `uysalayhan23/DevreTasarimStudyo` · dal `main`. **Hedefli izole gerçek kaynak JS/V8: 9/9 senaryo PASS. MQ-00 REVIEW — fiziksel/AC kabul değil.**

## Elektriksel fark: DC lineer karartma, AC triyak dimmer değil

Önceki SC30 kodunda sanal GL5528 LDR + 10 kΩ bölücü gate'i, MOSFET'in Q1 G/D/S lineer kanal modelini, 12 V/120 Ω dirençli H1 yükünü gerçekten çözen kaynak zaten mevcuttu. Bu çalışma kaynak davranışını değiştirmedi; doğru olmayan **+24V kablo rolleri** yalnız ders özelinde uygulamanın desteklediği **DC+** rolüne dönüştürüldü. Ayrıca `pedagogyReview.componentIds` önceki kaynak LM358P/prob katalog kimlikleri yerine mevcut beş fiziksel bileşenle eşleştirildi; artık sahnede bulunmayan LM358P paket meta verisi kaldırıldı. SC11–SC29 dahil diğer müfredat sahneleri değişmedi.

Kontrol kolu: 12 VDC G1/P → LDR B1/1–2 → 10 kΩ R1/1–2 → G1/M; ortak düğüm → Q1/G. Ayrı güç kolu: G1/P → H1/X1–X2 → Q1/D–S → G1/M. Nominal tam yük 12 V / 120 Ω = 0,100 A, Pmax = 1,2 W. LDR için ışık arttıkça direnç düşer, gate gerilimi ve sayısal çözücüden türetilen H1 gücü artar. Bu yalnız düşük gerilimli **DC MOSFET lineer eşdeğeridir**; AC şebeke, triyak ateşleme açısı, gerçek dimmer EMC ve fiziksel güç elemanı SOA/soğutma modeli yoktur.

## MQ-12 izolasyon kanıtı

949 kayıtlı **gerçek repo katalog tanımı** ile güncel `components.js`, `sensors.js`, `device-behavior.js`, `current-model.js`, `simulation.js` ve diğer ana simülasyon modülleri V8 çalışma ortamında (ilgili olmayan sürücü modülleri stub) çalıştırıldı:

| Koşul | Gate V | H1 akım A | H1 güç W | H1 model parlaklığı |
| --- | ---: | ---: | ---: | ---: |
| 0,1 lux | 0,484 | 0,0000012 | ~0 | ~%0 |
| 1 lux | 1,721 | 0,0000012 | ~0 | ~%0 |
| 10 lux | 4,800 | 0,0350 | 0,147 | %12,25 |
| 100 lux | 8,716 | 0,08395 | 0,846 | %70,48 |
| 1000 lux | 10,962 | 0,09917 | 1,180 | %98,35 |
| 1000 lux, gate kablosu açık | 0 | 0,0000012 | ~0 | ~%0 |
| 1000 lux, güç yolu açık | 10,962 | 0 | 0 | %0 |
| 1000 lux, 0 V kaynak | 0 | 0 | 0 | %0 |
| 1000 lux, 5 V kaynak | 4,568 | 0,01337 | 0,02146 | %1,79 |

9/9 vaka çözücüde kararlı, blokajsız ve kısa devresizdir; lux–güç sıralaması monotondur. 1,2 μA ideal açık MOSFET sayısal kaçak, fiziksel sürücü kaçak kabulü değildir. Parlaklık güç-normalize edilmiş model yüzdesidir; insan gözü/lümen kalibrasyonu yoktur.

Önceden bulunan `tests/qa-mq07-ldr-linear-dimmer-v11920.test.cjs` testinin SC30 ile ilgisiz eski 940/733/47 sabit müfredat değerleri hedefli SC30 koruma koşullarına dönüştürüldü. **Tam Node 1655 ders QA, tarayıcı/Windows file:/// görsel QA, fiziksel MOSFET ısıl/SOA QA ve AC dimmer QA NOT_RUN.** `QA.audit()` global PASS verdiği iddia edilmez. Fiziksel kabul false; **MQ-00 REVIEW**.

MQ-07 → MQ-05 → MQ-09 → MQ-12 hedefli JS kaynak QA → MQ-13 safe [skip ci] GitHub → MQ-00 REVIEW. Actions çalıştırılmadı.

Sıradaki ders: `sensor-analog-apps-src-12` (IR verici–alıcı uygulaması).
