# MQ-07 — SC001–SC200 tek toplu Windows/Node QA kapısı (hazırlık, çalıştırılmadı)

**Durum:** `PREPARED / NATIVE_NOT_RUN / FIRST_200_PARTIAL_REVIEW`. Bu belge, küçük GitHub commitleri arasında ayrı ayrı CMD testi istemek yerine **paket sonunda tek kanıt oturumu** hazırlamak içindir. Kaynak düzenleme veya GitHub Actions çalıştırmaz.

## Doğrulama kapsayıcısı ve mevcut risk

- `main` üzerinde [skip ci] kaynak commitlerini, `AGENTS.md`, golden/locked projeleri, kaynak motor/PLC devrelerini, offline `BASLAT.bat` ve global solver'ı koru.
- `scripts/qa-mq07-first200-live-inventory-v11920.cjs`: **yalnız kaynak envanteri**. Gerçek 200 sıra/ID, malzeme ID–tür–etiket–açıklaması, fiziksel tel uçları, katalog terminalleri, junction kimlikleri, geçersiz/çakışan `probeTarget` ve `motorPlcReview` kaynaklarına bakar. Çıktısındaki `acceptance.nativeNode: NOT_RUN` etiketi, koşulsa dahi **gerçek Node solver sonucu sayılmaz**.
- `tests/qa-mq07-first200-live-inventory-v11920.test.cjs`: 9 envanter/negatif fikstür tanımı, eski 51 referans kaydını kanonik sonuç sanmadan, SC194/195 eksik PLC işlevleriyle, etiketi yanlış ürün ve eksik/çakışan tel/junction/prob kimliklerini ayırır.
- `tests/qa-mq07-first200-motor-material-scope-v11920.test.cjs`: 5 SC126–181 motor malzemesi/gerçek terminal/yanlış başlık sınırı tanımı. Frenleme, özel motor veya ikinci motor işlevinin gerçek devreyle doğrulanmadığı bilgisini korur.
- `tests/qa-mq07-sc182-sc200-plc-scope-v11920.test.cjs`: SC182–200 PLC kaynak/program sözleşmesi; SC194 ikinci istasyon ve SC195 ters yön kontaktörü hâlâ `REVIEW`.
- `tests/qa-mq07-batch-001-200-v11920.test.cjs`: 9 SC10/36/38/114/124 ve ilk-200 içerik kapsamı tanımı. İçindeki eski 101/11/32/56/88 sayıları **ilk MQ-07 overlay aşaması için sabit kaynak sözleşmesi**; son 200 dersteki kabul/onarım sayıları değildir.
- `tests/qa-mq07-sc48-sc49-sc50-sc65-source-negative-v11920.test.cjs`: 6 özgün LM358 DIP-8, gerçek A/K diyot, RC ve pozitif geri besleme kaynak/negatif grafik tanımı.
- `tests/qa-mq07-sc48-sc65-native-dynamic-v11920.test.cjs`: 9 gerçek `Simulation.solve` aday testi. SC48 erken/geç şarj, SC49 bırakmadan 2 s sonraki yüksek çıkış ve geç OFF, 16 s entegre RC belleği, SC50 gerçek A/K ve ters çevrilmiş diyot kontrolü, SC65 karşı yön taraması ve aynı girişte farklı çıkış geçmişi. Bu dosya **adaydır** ve solver gerçek sorun nedeniyle FAIL verebilir; yeşil sonuç üretmek için eşik düşürülmez.

## Paket sonunda tek Windows CMD oturumu — ŞİMDİ ÇALIŞTIRILMAYACAK

Projenin **güncel `main` yerel kopyasında** aşağıdaki blok tek seferde kullanılabilir. `build` içindeki dosyalar yerel sonuçtur; GitHub Actions veya runner dakika kullanmaz.

```bat
git status --short
git rev-parse HEAD
if not exist build mkdir build
git rev-parse HEAD > build\qa-mq07-first200-head.txt
node scripts/check.cjs
set "MQ07_CHECK_RC=%ERRORLEVEL%"
node scripts/qa-mq07-first200-live-inventory-v11920.cjs --summary > build\qa-mq07-first200-inventory-summary.json
set "MQ07_INVENTORY_RC=%ERRORLEVEL%"
node scripts/run-tests.cjs
set "MQ07_TESTS_RC=%ERRORLEVEL%"
echo SOURCE_CHECK=%MQ07_CHECK_RC% INVENTORY=%MQ07_INVENTORY_RC% ALL_TESTS=%MQ07_TESTS_RC%
if not "%MQ07_CHECK_RC%"=="0" echo MQ07 STATUS: FAIL - kaynak kontrolu
if not "%MQ07_INVENTORY_RC%"=="0" echo MQ07 STATUS: FAIL - envanter olusturma
if not "%MQ07_TESTS_RC%"=="0" echo MQ07 STATUS: FAIL - Node regresyonu
```

**Yorumlama/kapı:** Komutlar yalnız paket sonunda tek CMD oturumunda çalıştırılacak; üç adımın `%ERRORLEVEL%` değerleri **ayrı** saklanır. Eski plan yalnız son `node scripts/run-tests.cjs` çıkışıyla bitiyordu: kaynak kontrolü veya envanter oluşturma başarısız olsa bile son süreç başarılı görünerek **sahte toplu PASS** algısı doğurabilirdi. `SOURCE_CHECK`, `INVENTORY` ve `ALL_TESTS` sonuçlarından herhangi biri sıfır değilse toplu sonuç **FAIL**; hepsi sıfır olsa bile başlık/topoloji ve Windows/Edge/üretici kapıları açık kaldıkça ilk 200 ders PASS değildir. `scripts/run-tests.cjs` mevcut tüm `tests/*.test.cjs` dosyalarını tek kez çalıştırıp `build/tests.tap` yazar ve gerçek çıkış kodunu korur. Bunun yanında `build/qa-mq07-first200-inventory-summary.json` içindeki `structuralIssuesByLesson`, `motorPlcReview`, `currentTitleReviewLessons` ve `acceptance` birlikte değerlendirilir. Başarılı `scripts/check.cjs`, bir başlangıç solver `PASS` veya hiç yapısal sorun bulunmaması **tek başına** SC001–200'ü onaylamaz.

**Güvenilir geçmiş sınırı:** `docs/QA_LOCAL_WINDOWS_20261017.md` içindeki eski tam Windows regresyonu **1792 test / 1680 PASS / 112 FAIL** idi; bu rakamlar farklı bir commitin ölçümüdür. Yeni HEAD üzerinde sonuç **bilinmiyor**. SC48/49 zamanlama, SC50 DC/AC, SC65 Schmitt, SC194/195, motor işlevi ve Windows/Edge görsel/üretici fiziksel kabulü yeni doğru bağımsız kanıt olmadan `OPEN` kalır.

## MQ-00 kapanış ölçütü

1. Repo HEAD ve yerel kirli dosyalar kaydedilecek, golden içeriklerin değiştirilmediği incelenecek.
2. Envanter/ilk-200 negatif testlerinin sonuçları gerçek çalıştırma kanıtıyla bağlanacak; **sadece** kanıtlanan test fikstür hataları/kaynak kusurları düzeltilecek.
3. Tüm Node TAP sonucu ile ilk-200 kaynak `REVIEW` nedenleri ayrı raporlanacak; tekil test PASS'i tam paket PASS sayılmayacak.
4. Görsel Windows/Edge ve üretici/elektriksel kabul bağımsız kalacak; `PARTIAL_REVIEW` yalnız kanıtla değişecek.

**Bu belge hiçbir testin çalıştırıldığı, geçtiği veya hazır olmayan bir işlevin tamamlandığı iddiasını taşımaz.**
