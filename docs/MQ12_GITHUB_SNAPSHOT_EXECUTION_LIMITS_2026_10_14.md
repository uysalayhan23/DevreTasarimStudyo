# MQ-12 — GitHub kaynağıyla first-10 native solver yürütme değerlendirmesi (2026-10-14)

**Repo:** `uysalayhan23/DevreTasarimStudyo` · **Dal:** `main` · **İncelenen HEAD:** `3ba745d4c35a9e3440281f67b4b932bff5b9bc3b`  
**Karar:** `SOURCES_VERIFIED / EXECUTION_BLOCKED / BEHAVIOR_REVIEW`. Bu incelemede **GitHub Actions kullanılmadı**. **Yeni native Node veya tam V8 solver testi çalıştırılmadı; yeni PASS verilmedi.**

## Korunan önceki kanıt

Önceki test kayıtları değiştirilmedi: `tests/qa-mq12-small-batches-v11920.test.cjs` içinde **beş regresyon senaryosu**; ilk 10 gerçek kablolu dersin sınıflandırması **10/10**, üç faz kararlılığı **10/10**, kumanda yanıtı **8/8**, geri dönüş **7 PASS + seal-in-1 REVIEW**. `seal-in-1` START bırakıldıktan sonra mühürleme devresinin enerjili kalması beklenen davranıştır; dört ayrı seal-in testinde STOP ile enerjinin kesilmesi beklenir. Bu sayılar **önceki kanıtlardır**, mevcut HEAD'in bu oturumdaki yeniden yürütmesi değildir. Kaynak: `tests/qa-mq12-native-first-ten-v11920.test.cjs`, `scripts/qa-mq12-small-batches-v11920.cjs`, `docs/MQ12_LOCAL_REGRESSION_PROVENANCE_2026_10_13.md`.

Batch N **1.519/1.519 kaynak rehber QA**, 525 rehberli sanal kablo, 923 kablosuz referans, 71 kablolu referans ve 2.085 kaynakla eşleşen bağlantı gözlemi; önceki kabul kaydında **PASS**. Bu, fiziksel donanım/pedagojik kullanım/UI tam kabulü değildir ve burada tekrar yürütülmedi. Kanıt: `evidence/mq12_722_seq_mq07_1519_practice_20261012.json`, `tests/qa-tutorial-practice-1519-v11920.test.cjs`.

Genel 722-ders davranış kabulündeki **35 sensör + 7 RC/RL = 42 REVIEW** korunur. Önceden doğrulanmış 2.166/2.166 kararlı solver ve 105/105 sensör, 707/707 reaktif faz, fiziksel ürün/geri dönüş kabulünün yerine geçmez.

## Bağımlılık zinciri ve aktarım seçenekleri

- **Özgün test zinciri:** `tests/qa-mq12-native-first-ten-v11920.test.cjs` → `scripts/qa-mq12-small-batches-v11920.cjs` → `scripts/qa-tutorial-1655-simulation-v11920.cjs` → `dist/simulation.js`, `dist/tutorial-source-outline.js`, `dist/library.js`, katalog uzantıları ve kronolojik öğretici overlay modüllerini. `qa-tutorial-1655-simulation` Node `fs/path/vm` ile depo içi kaynakları okur; düzinelerce JS modülünü sırayla birleştirir. Devre solver'ı Node/CommonJS bağımlılıkları kullanır.
- **Tek snapshot/arşiv (tercih edilen):** Aynı `main` SHA'sının eksiksiz kaynak arşivi bir Node çalışma ortamına tek defada aktarılabilirse modüller ayrı ayrı elle indirilmeden özgün QA koşturulabilir. GitHub bağlantısının burada kullanılabilen `fetch`/blob/contents işlemleri UTF-8 kaynak okur; ZIP/tarball gibi ikili arşivi yerel çalışma dizinine aktaramaz. Çalışma ortamından `git ls-remote` ve HTTP çekme DNS erişimi de başarısızdır. **Bu oturumda uygulanamadı.**
- **Git trees + blob SHA:** GitHub commit ağacı dosya listesi, SHA ve yol eşitliği için uygundur; dosya gövdesini veya çalışan Node `require/fs/vm` çözümlemesini tek başına sağlamaz. Eksiksiz bağımlılıkları tek paket gibi yürütmeye yeterli değildir. **Yalnız kaynak envanteri.**
- **Bellek içi V8 modül yükleyicisi:** Kaynak gövdeleri tek tek toplanıp bellek içinde CommonJS/Node API taklidi kurulabilir. Bu, tam gerçek Node `fs/path/vm` davranışına eşit kabul edilemeyeceği ve büyük katalog dosyalarını yine ayrı aktaracağı için **orijinal native Node kabulüne alternatif değil**. Çalıştırılmadı.
- **GitHub Actions / yeni workflow:** Yasak; kullanılmadı. GitHub API'nin salt kaynak çağrıları Node testi veya gerçek Windows tarayıcısı çalıştırmaz.

## Ayrı kapı raporları

- `evidence/mq12_first10_20261014_classification.json`
- `evidence/mq12_first10_20261014_stability.json`
- `evidence/mq12_first10_20261014_response.json`
- `evidence/mq12_first10_20261014_restoration.json`

Her raporda **`executed=false`, `passed=null`, `executionStatus=NOT_EXECUTED`** zorunlu. Eski sonuçlar yalnız `historicalBaseline` alanındadır; bugünkü çalışma sonucu yerine geçmez.

## Tekrar yürütme protokolü (çalıştırılmadı)

Tam, SHA eşit kaynak ağacının **desteklenen çalıştırılabilir ortama** alınması halinde MQ-12'nin standart Node 22+ girişleri: `node --test tests/qa-mq12-small-batches-v11920.test.cjs tests/qa-mq12-native-first-ten-v11920.test.cjs`, `node scripts/qa-mq12-small-batches-v11920.cjs 0 10`, `node scripts/qa-tutorial-practice-1519-v11920.cjs`; tam 19-test/9-runner kapısı için `scripts/qa-mq12-complete-local-suite-v11920.cjs`. Küçük-batch CLI, kasıtlı REVIEW nedeniyle çıkış kodu 1 döndürebilir; bu bir solver çökmesiyle karıştırılmamalı. Yalnız `--check` çıktısı `SOURCES_PRESENT_UNTESTED` sayılır. Sayısal/elektriksel raporlar ancak gerçek komut çıktısından tekrar üretilmeli.

## MQ-00 / ajan zinciri

**Lider incelemesi:** QA/katalog çalışma bağımlılıkları belirlendi. **Çapraz denetim:** Eski ZIP'in güncel `main` eşitliği yok; kaynak bulundu diye PASS denmemeli. **MQ-12:** güncel SHA'da test **NOT_EXECUTED**. **MQ-13:** mevcut dal `main`, golden/canonical/uygulama dosyaları değiştirilmeyecek, yalnız kanıt+backlog kaydı. **MQ-00:** `BLOCKED` (icra ortamı / source transferi), tam davranış kabulü `REVIEW`. G0/G1 kaynak bulunabilirliği doğrulandı; G6/G7/G8 **açık**.

**Devam koşulu:** Kullanıcıdan yerel işlem veya GitHub Actions istenmeden, yalnız gerçekten aktarılmış eksiksiz SHA eşit Node kaynak ağacı bulunursa first-10 özgün testleri ve ayrı dinamik raporlar yeniden çalıştırılacak. Kaynak bulunamazsa sayısal kabul ileri taşınmayacak.



## 2026-10-14 — GitHub blob→V8 kaynak aktarımı çözüldü (önceki aktarım engeli tarihsel)

- **51 özgün GitHub SHA eşit kaynak** (üç ara Git blob paketi + `tutorial-lessons.js`) çağrı sınırı korunarak, geçici bellek içi V8 ortamında çalıştırıldı; kaynak ve kanonik ders dosyaları değiştirilmedi. `evidence/mq12_first10_20261014_v8_execution.json` bireysel kaynak SHA ve yürütme envanterini tutar.
- Özgün 939 ürünlük katalog + `Simulation.solve` + `qa-mq12-small-batches-v11920.cjs`: **classification 10/10**, **stability 10/10 (30 faz)**, **response 8/8**; `button-led-5` ve `button-relay-4` desteklenmeyen Arduino kontrolü olarak ayrı sınıflandırıldı; **restoration 7 PASS / `seal-in-1` REVIEW**.
- Özgün iki test dosyasının 5+2 gerçek callback'i V8 içerisinde temel `node:test` ve `assert` uyum katmanıyla yürütüldü: **7/7 PASS**. Dört mühürleme devresinin START→HOLD→STOP/OFF davranışı doğrulandı. **Bu `node --test` değildir.** Tam HEAD Node 19+9 regression kapısı ve Windows/Chromium testleri açık.
- Batch N öz kaynak QA yeniden **1.519/1.519 PASS**; 525 kablolu rehber, 923 kablosuz referans, 71 kablolu referans, 2.085 gerçek kanonik bağlantı gözlemi ve 0 hata; gerçek pedagojik/Windows kabulü değildir.
- Dört ayrı `evidence/mq12_first10_20261014_*.json` artık `EXECUTED_ORIGINAL_GITHUB_SOURCE_V8` taşıyor ve önceki `historicalBaseline`'ı koruyor. Genel davranışta **35 sensör + 7 reaktif = 42 REVIEW** açık. MQ-00 hedef V8 kapısı yürütüldü, genel kabul REVIEW. Actions 0, `[skip ci]`.
