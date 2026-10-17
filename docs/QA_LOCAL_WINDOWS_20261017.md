# 2026-10-17 — Yerel Windows Node regresyon kanıtı (açık)

## Kaynak ve kapsam

- Kullanıcı laptopunda `main` commit `98771a167856e27d19e9591ec7eafac1fcf290c4` ile `node scripts/check.cjs` ve `node scripts/run-tests.cjs` çalıştırdı. Tam TAP kullanıcı tarafından sohbet ortamına iletildi; kişisel Windows dosya yolları repoya eklenmedi.
- Ortam: Windows, Node.js v22.14.0. Geliştirme belgesindeki öneri Node.js 24; sürüm farkının testlere etkisi henüz karşılaştırılmadı.
- Kaynak kontrolü: version=1.19.20, syntaxFiles=422, localDependencies=106, libraryDefinitions=729, protectedProjects=58. **Kaynak kontrolü başarılı.** Bu sayılar `QA.catalog()` içindeki katalog sayımıyla aynı envanter değildir.
- Tam Node TAP: 1792 test; 1680 PASS, 112 FAIL; 0 skipped/cancelled; 510218.3803 ms (~8 dk 30 sn). **Tam regresyon FAIL / NOT_ACCEPTED**; Windows kullanıcı arayüzünün ve fiziksel donanımın kabul testi değildir.

## İlk teşhis — 112 başarısız test, 69 test dosyası

Aşağıdaki gruplama TAP hata metinlerine dayalı **ön tanıdır**, farklı kök nedenleri kanıtlayıp kapatmaz:

| Ön grup | Test | Bulgular |
| --- | ---: | --- |
| Eski sabit envanter/senaryo sayıları | 39 | 722/730, 940/949, 532/535, 35/30, 47/34 beklentileri; gerçek kayıp mı eski test mi araştırılmalı. |
| Öğretici yükleme/önbellek ve içerik sözleşmeleri | 34 | Eski JS revizyon dizeleri, yükleme sırası ve SC238–251 kaynak topolojisi beklentileri; hepsi yalnız cache sorunu sayılmaz. |
| VM realm kaynaklı görünüşte eşit nesneler | 7 | `deepStrictEqual` prototip farkı olasılığı; içerik eşitliğini normalize ederek tekrar sınanmalı. |
| Windows Python başlatıcısı | 3 | `python3 scripts/package.py --list` Windows üzerinde Python bulunamadı; Python kurulumunu da kontrol etmek gerekir. |
| Diğer davranış/sözleşme/çalıştırma | 29 | Sensör modeli ve native kabul, UI ve elektriksel davranış, test dosyası erken çıkışı, golden kaynak farklılığı, tam QA kapısı vb. |

## Öncelikli açık riskler

1. `tutorial-native-solver-golden-v11920.test.cjs`: `sensor-analog-apps-src-03` kaynak bileşen ve kabloları golden beklentisinden farklı. Ölçüm probu ekleme geçmişiyle birlikte incelenecek; özgün doğrulanmış veriye doğrudan geri dönülmeyecek.
2. `qa-mq12-sensor-model-compatibility-v11920.test.cjs`: `sensor-analog-apps-src-08` için `Unexpected physical model` hatası. `qa-mq12-sensor-electrical-contract-v11920.test.cjs` ve `qa-mq12-interface-model-gaps-v11920.test.cjs` dosyaları da süreç hatasıyla bitmiş; hedefli yeniden çalıştırma gerekir.
3. `qa-full-windows-v11920.test.cjs`: `Missing full QA gate full_node`; tek tık QA giriş/kapı sözleşmesi kontrol edilmeli.
4. `installation-v118.test.cjs`: zil/kapı serbest bırakma ve gerçek arayüz etkileşimleri; salt test sayısı sorunu olduğu varsayılmamalı.
5. `runtime-package-v11920.test.cjs`: Windows Python komutu taşınabilirliği sorunu; Python varlığı ayrı kanıt gerektirir.

## Kaynak düzeltmeleri (tam regresyon tekrar test edilmedi)

- `d2ade4c` — `scripts/run-tests.cjs` için TAP çıktısı canlı akacak, `build/tests.tap` saklanacak ve çıkış kodu iletilecek. Ayrı Node.js 22 geçme/kalma fikstürleriyle sınandı; gerçek 1792 test yeniden çalıştırılmadı.
- `e3e7d5f` — `tests/runtime-package-v11920.test.cjs` Windows'ta `py -3` ve yedek Python çalıştırıcılarını deneyecek. Sahte `package.py --list` fikstürüyle yerel smoke test yapıldı; gerçek Windows/Python testi bekleniyor.

## Kabul ve koruma

- Tam regresyon: **FAIL (112 açık)**. Native simülasyon, golden uygunluğu, üretici fiziksel ve Windows/Edge uçtan uca kabul: **NOT_ACCEPTED**.
- Test beklentileri yalnız yeşil sonuç üretmek için düşürülmeyecek; kaynakta gerçek devre kaybı olasılığı dışlanmadan sabit sayılar yenilenmeyecek.
- Bir sonraki çalışma: yüksek riskli native sensör/golden/UI sorunlarını kök neden açısından ayrıştır; ortam farkını ve Python'u hedefli test et; MQ-00 → lider/çapraz → MQ-12 → MQ-13 → MQ-00 kanıt zinciri olmadan DONE verme.
- Tek repo `uysalayhan23/DevreTasarimStudyo`, tek `main`; `[skip ci]`, Actions yok, force-push yok. `BASLAT.bat` doğrudan `file:///.../dist/index.html` başlangıcı, golden ölçüler, terminal kimlikleri ve dört kartlı dashboard korunur.

## Hedefli Windows tekrar testi — 2026-10-17

- Kullanıcının paylaştığı gerçek Windows CMD ekran görüntüsü: `node --test tests/qa-full-windows-v11920.test.cjs tests/qa-mq05-pwm-generator-output-v11920.test.cjs tests/runtime-package-v11920.test.cjs`.
- **10 tests / 10 pass / 0 fail / 0 skipped**, `duration_ms 1746.5656`, Node.js v22.14.0. Üç kapsam: Windows full-QA *statik sözleşme* kontrolleri (4), PWM1 bağlantılı yük için gerçek Node/solver testleri (3), Python çalıştırıcılı runtime paket *manifest listeleme* testleri (3).
- Windows'ta Python başlatıcısı veya yedek komutlardan en az biriyle `package.py --list` başarıyla çalıştı; bu tam ZIP üretimi, Windows browser QA veya donanım kabulü değildir.
- Bu sonuçlar `a28c5ee` Windows QA alan adı, `e3e7d5f` Python çağırma uyumu ve `62287df` içindeki PWM1 karşılaştırması için hedefli tekrar kanıtıdır. `62287df` içinde değiştirilmiş diğer test dosyaları ayrıca ölçülmedi.
- Daha eski `98771a1` tabanlı **1792 / 1680 PASS / 112 FAIL** tam regresyon hâlâ son ölçülmüş *tam* sonuçtur; yeni HEAD üzerinde tam regresyon sayısı bilinmiyor. Yanlışlıkla 112 sorunun kapandığı iddia edilmez.
- Sonraki hedef: sensör/golden/öğretici kaynak farklılıklarını düşük maliyetli hedefli gerçek Node testleriyle ayrıştırmak; yeni commitlerde `[skip ci]`, Actions yok.

## Sensör kaynak ve LDR ölçüm testlerinin takip düzeltmeleri (yeniden test bekliyor)

- `c92174c`: `tests/qa-mq07-ldr-linear-dimmer-v11920.test.cjs` eski testinde 100 lux örneğinin güç/akımı, aynı testte son işlenen 1000 lux örneğindeki lamba gerilimiyle çarpılıyordu. `step()` artık her lux örneğinde lamba gerilimini yakalar; `P = I × V` kıyaslaması **aynı örnek** üzerinde kalır. Gerçek solver ve devre kodu değişmedi. Bu hedefli native test **NOT_RUN**.
- `8df4105` + `b40bb58`: salt okunur model uyumluluk denetimi artık onarılmış `sensor-analog-apps-src-08` sanal piezo örneği gibi kaynaklarda eski zorunlu `proximity` yer tutucusu yerine **gerçek katalog kaynak modelini** inceler. Rapor `sourceModelAligned`, `virtualSourceAlignedCount` ve kalan `topicMismatchCount` değerlerini ayırır. `physicalAccepted=0`, `canAutoReplace=false`, `fullAcceptance=REVIEW` korunur; test katalog sayımı ve kablolu ders bazını en son gerçek kaynak envanterine göre kontrol eder. Bu denetimin gerçek Node koşumu **NOT_RUN**.
- `scripts/qa-mq12-sensor-electrical-contract-v11920.cjs` ve `scripts/qa-mq12-interface-model-gaps-v11920.cjs` hâlâ eski tüm derslerin `proximity` ve `arduino-bench-supply` içerdiği varsayımını kullanır; gerçek düzeltilmiş piezo/yük hücresi derslerinin yeni arayüz ve besleme sözleşmesi incelenmeden **OPEN / NOT_ACCEPTED** kalırlar.
- Yeni commitler yalnız hedefli test ve salt okunur QA betiklerini etkiler; `dist/`, `BASLAT.bat`, golden fixture ve uygulama solver'ı **değiştirilmedi**. 1792 tam regresyon için son ölçülmüş değer önceki `1680 PASS / 112 FAIL` olup yeni HEAD'e taşınmış PASS olarak gösterilemez.

## Hedefli LDR ve sensör modeli native 8/8 — 2026-10-17

- Kullanıcının Windows CMD'de paylaştığı özgün çıktı: `node --test tests/qa-mq07-ldr-linear-dimmer-v11920.test.cjs tests/qa-mq12-sensor-model-compatibility-v11920.test.cjs`.
- **8 test, 8 PASS, 0 FAIL, 0 skipped**, süre `2708.2741 ms`; LDR/MOSFET kaynak topolojisi ve native lux→yük davranışı, kopuk gate/yük fail-closed, SC30 kapsam sınırı, sekiz sensör kaynak model kökeni, piezo/load-cell/termal/kimyasal terminal uygunluğu, ultrasonik 4 pin/3 pin ayrımı, kaynak mutate edilmemesi kanıtlandı.
- Çıktıdan önceki `git rev-parse --short HEAD` satırı **`e42f2bc`** gösteriyor; ancak başarılı testlerin isimleri ve önceki hata kodlarının ortadan kalkması `f4c67b2d` içinde bulunan yeni test kaynaklarıyla uyuşuyor. Bu komutlar arasında bir Pull yapılmış veya dosyalar güncellenmiş olabilir. **Test anındaki HEAD doğrudan kanıtlanmadı**; sürümü varsayma. Kaynak içerik açısından hedefli native PASS kanıtı geçerlidir.
- Bu rapor, `c92174c` test-ölçüm eşleştirmesi ve `8df4105`/`b40bb58` sanal piezo kaynak tanıma çalışmalarına yönelik koşum kanıtıdır. Üretici/gerçek fiziksel kabul, tam 1792 regresyon, Windows/Edge görsel ve golden termokupl kabulü **OPEN / NOT_ACCEPTED**.
- Tam regresyon için son bilinen sonuç hâlâ eski `98771a1` üzerinde **1680 PASS / 112 FAIL**; yeni HEAD üzerinde tam test koşumu yok.

## Onarılmış sensör kaynaklarına uyarlanmış iki eski MQ-12 QA kapısı

- `b215222`/`1e01766`: `qa-mq12-sensor-electrical-contract` salt-okunur denetimi ve testi, varsayılan bütün dersler `arduino-bench-supply` + `proximity` şablonudur beklentisini kaldırır. Gerçek kaynak modelini veya yokluğunu raporlar; 24 V iddiasında uygun kaynak yoksa `CLAIMED_24V_SOURCE_MISSING` ve `TUTORIAL_24V_EFFECTIVE_SUPPLY_MISMATCH` blokajları korunur. `dropInApproved=false`, `physicalAccepted=0`, `fullAcceptance=REVIEW` değişmedi. Yeni native Node sonucu **NOT_RUN**.
- `4128dfe`/`ca6a6eb`: `qa-mq12-interface-model-gaps` kaynakta mevcut piezo/load-cell bileşenini tanır, 24 V kaynağı bulunmayan sanal pasif piezo dersinde `canonicalVoltage=null` raporlar; `VIRTUAL_PIEZO_TRANSIENT_UNCALIBRATED` olarak kalibrasyonsuz sanal davranış sınırını belirtir, `physicallyApproved=false` ve `overallAcceptance=REVIEW` korunur. Yeni native Node sonucu **NOT_RUN**.
- Bu kaynak/test onarımları mevcut QA envanterinin güncel topolojiyi yanlış reddetmesini amaçlar; gerçek fiziksel güvenilirlik, üretici terminal eşlemesi, golden termokupl, 1792 tam regresyon ve gerçek Windows GUI QA **OPEN**.

## Gerçek Windows sensör arayüzü 11/12 ve 35→30 envanter ayrımı

- Kullanıcının `3227dcb` HEAD ile aynı komutta doğruladığı gerçek Windows/Node 22.14.0 sonucu: `node --test tests/qa-mq12-sensor-electrical-contract-v11920.test.cjs tests/qa-mq12-interface-model-gaps-v11920.test.cjs` → **12 toplam / 11 PASS / 1 FAIL**, `2806.1138 ms`. Başarısız olan tek test `35 unconfigured sensor stimuli and seven reactive gates remain unresolved`; denetim güncel kaynak için `unconfiguredSensorLessons=30` döndürdü, eski sabit beklenti `35`. Bu test ilk sayı kontrolünde kesildiği için **7 reaktif kapının bu çalışmadaki assertion sonucu kanıtlanmış değil**; diğer testlerde fiziksel kabul verilmedi.
- GitHub geçmişinde `35` test beklentisi 2026-10-13'te eklendi (`5c6f70eb`); güncel kaynak sonucu `30` (2026-10-17). Bu yalnız **envanter sayısı farkı**, beş sensörün gerçekten onarıldığına ilişkin kanıt değildir. Herhangi bir kanonik devre veya sensör ölçümü bu adımda değiştirilmedi.
- `86a7042` salt-okunur QA raporu `unconfiguredSensorLessonIds` adlı sıralı kimlik listesini de verir. `b266ba4` testinde güncel **30 açık** ID'nin benzersiz, sıralı ve gerçekten kablolu/uyaranı eksik `proximity` ya da `autonics-pr12-npn` kaynakları olduğu denetlenir; **7 reaktif kapı**, `overallAcceptance=REVIEW`, sekiz fiziksel onay `false` olarak kontrol edilmeye devam edilir. Değişen envanterin kabul kriterini gizlemesi engellenir.
- `86a7042`/`b266ba4` için yeni gerçek native koşum **NOT_RUN**; tam regresyonun son ölçülen değeri hâlâ eski HEAD'deki **1680 PASS / 112 FAIL**. Golden/üretici/Windows browser QA **OPEN**.

## Windows 104b863 sensör envanteri hedefli tekrar — 8/8 PASS

- Kullanıcının tek CMD çağrısıyla doğruladığı commit `git rev-parse --short HEAD` = `104b863`; `node --test tests/qa-mq12-interface-model-gaps-v11920.test.cjs` sonucu **8/8 PASS, 0 FAIL, 0 skipped**, `2670.2193 ms` (Windows / Node.js v22.14.0).
- Güncel 30 yapılandırılmamış sensör dersinin kimlikleri tek tek izlenebilir; 7 reaktif QA kapısı açık kalır. Ultrasonik 35 V olumsuz fikstürü gerilim sınırı dışında bulunur ve kanonik ders değiştirilmez. Üretici/fiziksel kabul **REVIEW / NOT_ACCEPTED**.
- Bu hedefli koşum yalnız `104b863` sürümünün ilgili 8 testini doğrular; eski `98771a1` tam regresyonun **1680 PASS / 112 FAIL** sonucunu güncel sürümde yeniden ölçmüş saymayız.
- MQ-12/MQ-13 kanıtı: kullanıcı konsolundaki native Node TAP. MQ-00 kararı: sensör envanter QA'nın bu dar kapsamı **PASS**, 30 dersin fiziksel/reaktif kabulü ve bütün 1792 testlik kapı **OPEN**.

## Golden fixture kaynak incelemesi — termokupl / PT100, kabul bekliyor

- `tests/fixtures/tutorial_native_solver_golden_v11920.json` içindeki 90 golden proje hâlâ salt okunur/korumalı tutuluyor. `sensor-analog-apps-src-03` tarihsel termokupl grafiği 3 bileşen/4 kablo; `dist/tutorial-pedagogy.js` bunun üzerine yeni sanal UT33D+, iki prob, iki ölçüm bağlantısı, soğuk referans ve K tipi ayarları eklemiş. Güncel grafikte eski 3 ana bileşen ve 4 ana bağlantının kimlikleri sabit değil: `W()` sıra sayacı `pgw...` kimliklerini yeniden üretir; orijinal TAP örneği `pgw43436–43439` yerine `pgw43476–43479` göstermiştir.
- PT100 `sensor-analog-apps-src-04` dersinde üretici/uygulama öğretimine özgü üç terminal yeniden eşlemesi (A→10, B1→8, B2→9) açık kaynakta belgelenmiş; golden anlık görüntüsü eski A→8, B1→9, B2→10 değerlerini saklıyor. **Bu farkı sessizce kabul etmek ya da referansı üzerine yazmak yasak.** Kaynak değişiminin doğrulaması ve diğer 88 kayıt için kapsamlı golden regresyon hâlâ gerekir.
- Salt kablo sayaç kimlikleriyle sabit terminal referansları birbirinden ayrılmalı; sensör sanal kabul sınırı fiziksel ürün kalibrasyonunu kapsamaz. Golden ve gerçek solver 90 proje testi hâlâ **OPEN / NOT_ACCEPTED**.

## Golden 90 ders denetiminde kontrollü kaynak ayrıştırması — native tekrar bekliyor

- `f2c3425`/`4dc4da5` ile `tests/tutorial-native-solver-golden-v11920.test.cjs` yalnızca daha güçlü kontrollü karşılaştırma için değiştirildi. Tarihsel 90 proje ve `tests/fixtures/tutorial_native_solver_golden_v11920.json` **değiştirilmedi**.
- `dist/tutorial-pedagogy.js` içinde `W()` bağlantı kimliklerini artan `pgw<digits>` sayacıyla yeniden üretir. Yeni test her projede bağlantı kimliklerinin mevcut/tekil olmasını ve `pgw` olmayan kalıcı kimliklerin birebir korunmasını zorunlu tutar; yalnız üretilmiş `pgw` numara değerini normalleştirir. **Malzeme ID'si, terminal ucu, bağlantı rolü/renk/diğer metadata, konum, malzeme özellikleri ve 90 proje grafiği** sıkı karşılaştırmada kalır.
- Termokupl SC22 için sadece 3 yeni ölçüm elemanı (UT33D+, 2 prob), 2 kablo ve açık kaynakta tanımlı K/25 °C ayarları istisnadır. Yeni eleman türleri, prob geometrisi/konumu, terminal hedefleri, polarite, ölçüm kablosu rolü/renk/açıklaması ayrıca tam doğrulanır; eski 3 ana bileşen ve 4 ana kablo strict golden temelinde korunmak zorundadır.
- PT100 SC23 için yalnız belgelenmiş üç sanal terminal düzeltmesi (A→10, B1→8, B2→9) ve PT100 ölçüm ayarları istisnadır; eski kaynak alt grafiği/proje metadata'sı karşılaştırılır. Bu **gerçek donanım kablo önerisi veya üretici fiziksel doğrulaması değildir**.
- Golden testinin hâlihazırdaki Node/Windows sonucu **NOT_RUN / NOT_ACCEPTED**. Herhangi başka golden kayıt farkı veya solver istikrarsızlığı görülürse FAIL olarak kalacak. Tam 1792 testin güncel HEAD sonucu hâlâ bilinmiyor.
