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
