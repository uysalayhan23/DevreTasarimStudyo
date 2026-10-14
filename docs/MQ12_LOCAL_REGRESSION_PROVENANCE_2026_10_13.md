# MQ-12 — Gerçek Node regresyon yürütmesi ve ZIP kaynak bütünlüğü (2026-10-13)

**Kapanış statüsü: REVIEW / INCOMPLETE.** Bu rapor yalnız gerçekten çalıştırılmış Node testlerine PASS verir. Kullanıcının yüklediği eski \`DevreTasarimStudyo-main(2).zip\` arşivinin eksik GitHub testi otomatik indirilemediği için, önceki 63+8 paketinin tamamına **71/71 PASS verilmemiştir**. GitHub Actions **kullanılmadı**.

## Çalıştırılmış kaynak ve regresyon kanıtları

- Node.js **v22.16.0** üzerinde **tek \`node --test\` komutunda 56/56 PASS, 0 FAIL**. Kaynaklar: 15 ilgili eski/ders/regresyon dosyasından 53 gerçek Node testi ve yeni ZIP bütünlüğü testinden 3 gerçek Node testi.
- Bağımsız orijinal solver \`qa-tutorial-722-sequential-v11920.cjs audit()\`: **722/722 classification**, 722 başlangıç + 722 kumanda + 722 geri dönüş = **2.166/2.166 kararlı çözüm**, sıfır solver hatası, sıfır eksik katalog tanımı. Eski bağımsız denetimdeki **sekiz restoration REVIEW**, davranış kapanışının ayrı kanıtıdır.
- \`qa-tutorial-1655-simulation-v11920.cjs\`: **1.655 ders / 722 kablolu ders**, kaynak QA **PASS**, 0 kısa devre, 0 eksik tanım, 0 geçersiz kablo ucu.
- \`qa-tutorial-practice-1519-v11920.cjs\`: **1.519/1.519 PASS**, 0 kaynak sorunu; 525 kablolu, 923 referans, 71 kablolu referans, 2.085 pedagojik gözlem.
- Gerçek kaynakta **35 fiziksel hedefi tanımsız sensör** ve **7 reaktif ders** hâlâ mevcut; sensör fiziksel / restoration kabulü **REVIEW**. \`dual-dc-2\` NPN, \`open-collector-1\` PNP kaynak düzeltmeleri korundu. Analog sanal karar ve buzzer gerilim payı regresyonları PASS, **fiziksel ürün/terminal onayı değil**.
- Güncel \`dist/simulation.js\`, \`dist/tutorial-lessons.js\`, \`dist/tutorial-sensor-batch-j.js\` ve \`tests/qa-tutorial-722-sequential-v11920.test.cjs\` içerikleri, ZIP üzerine daha önce onaylanmış \`main\` değişiklikleri uygulanarak GitHub **blob SHA** değerleriyle birebir doğrulandı.

## Eski ZIP'in eksik test kaynakları — yanlış PASS'i engelleyen kalıcı koruma

\`node scripts/qa-mq12-complete-local-suite-v11920.cjs --check\` komutu ve \`tests/qa-mq12-complete-local-suite-v11920.test.cjs\` dosyası eklendi. Yeni kontrolün **3/3 Node testi PASS**: eksik test dosyasını ve eksik çalıştırıcıyı ayrı saptayıp, hiç yürütülmemiş testin PASS sayılmasını engeller.

Eski yüklenen ZIP ile arşivden gelen daha yeni analog/buzzer kaynaklarının birleştirildiği yerel ortamda:

| Beklenen dosya tipi | Bulunan | Eksik |
|---|---:|---:|
| MQ-12 tam regresyon dosyaları | 6/19 | **13** |
| İlgili bağımsız çalıştırıcılar | 3/9 | **6** |

Bu dosyaların GitHub'da mevcut olduğu ayrıca doğrulandı, fakat mevcut araç bağlantısının GitHub kaynağını doğrudan yerel diske indirme yolu bulunmadığı için eski ZIP'e bütünüyle aktarılamadı. Kalan kaynaklar gelmeden **tam 63+8 kapısı INCOMPLETE** kalmalı. Eksik dosyaları otomatik izleyen yeni araç ileride bir bütün ZIP veya desteklenen dosya aktarım ortamında tam Node paketini kendisi çalıştırır ve **en az 71 gerçek PASS** olmadan PASS döndürmez.

**Not:** 56/56 sonucu mevcut 16 dosyalık seçili Node yürütmesine aittir; önceki 63+8 test paketinin tamamıyla aynı şey değildir. Tam fiziksel simülasyon/UI/panel onayı veya elektriksel güvenlik uygunluğu değildir.

Dosyalar, yüklenen konuşma arşivinden çıkartılan gerçek Node test günlükleri ve ayrı JSON QA çıktılarıyla desteklenmiştir; kullanıcıdan yerel işlem istenmemiştir. Kanonik dersler ve LOCK kayıtları değiştirilmemiştir. Tüm GitHub commitleri **[skip ci]** ile gerçekleştirilmiştir.


## 2026-10-14 — fail-closed `--check` confirmation

A user-supplied, older ZIP source snapshot is not equivalent to the current GitHub `main`. The complete native MQ-12 regression source inventory remains mandatory before asserting full-suite success.

- Fixed `scripts/qa-mq12-complete-local-suite-v11920.cjs --check`: when any test or runner file is absent, exit code is nonzero and reported status is `INCOMPLETE`. When all files are present, report `SOURCES_PRESENT_UNTESTED`, **never** `PASS` without executing tests.
- Added a real process-spawn regression exercising check-mode exit semantics and ensuring `executed=false` and `passed=null` for inventory-only checks.
- The complete-local-suite test file was reconstructed from the verified GitHub source and executed under Node v22.16.0 against the 2026-10-12 ZIP snapshot: **4/4 Node tests PASS**, 0 failures. The original snapshot had only 4/19 required regression test files and 1/9 required runners; its `--check` returned **exit 1 / INCOMPLETE**.
- Independently ran the ZIP's original 722-lesson native solver audit: **2,166/2,166 stable**, 722/722 classified, 0 solver failures, with **8 legacy restoration REVIEW** preserved. This does not supersede the corrected live `main` diagnostics of **35 sensor + 7 reactive = 42 behavior REVIEW**.
- Executed the original ZIP's four-file selected Node suite: **23/24 PASS, 1 FAIL**; its *old* `qa-tutorial-722-sequential-v11920.test.cjs` incorrectly expects the eight known restoration reviews to equal zero. GitHub `main` has the fixed fail-closed test. Do not turn this stale-snapshot test failure into a new solver defect or claim this selected suite passed.
- Batch N independent source audit: **1,519/1,519 PASS** with 2,085 observations and 0 issues.

**Acceptance:** the complete 19-test-source/9-runner package has **not** been executed from this older ZIP; the full-suite status remains **INCOMPLETE**. Sensor physics and reactive restoration remain **REVIEW**. No GitHub Actions; GitHub commits use `[skip ci]`.
