# MQ-00 / MQ-07 SC22 — K tipi termokupl mV ölçümü (2026-10-15)

**Karar: Kaynak düzeltmesi ve izole V8 hedef testi PASS; MQ-00 REVIEW (NOT DONE).**
Repo: uysalayhan23/DevreTasarimStudyo; dal main; GitHub Actions kullanılmadı.

Önceki sahnede termokupl, ET4420 ve sanal besleme 3 bileşen / 4 tel idi. ET4420 sıcaklık PV okurken bir UNI-T UT33D+ milivolt ölçümü yoktu. SC22 için UT33D+ DCV 200mV ve iki fiziksel sanal prob eklenmiştir; yeni toplam 6 bileşen / 6 kablo / 6 adım. Yalnız SC22 probunda mq07ThermocoupleMeterProbe opt-in sayısal yol bulunur; SC11–SC21 ve diğer sahnelerin davranışı değişmez.

Özgün thermal.js, device-behavior.js, instruments.js, current-model.js, multimeter.js ve simülasyon kaynakları izole V8 koşumunda doğrulandı. 25°C = 0mV, 100°C = yaklaşık +3,096mV (UT33D+ ekranı 3,100), 200°C = yaklaşık +7,138mV (ekran 7,100). ET4420 PV sırasıyla 25/100/200°C. Sanal prob terslenince voltmetre işareti değişir; sensör kutupları ters/açık ise kontrolör hata verir. Controller output displayOnly biçiminde tutulur.

Test sınırları: İzole JS testinde ilgisiz cihaz adaptörleri ve katalog girişlerinin minimal karşılıkları kullanıldı. Gerçek tam katalog Node/1655 regresyonu ve Windows file:/// görsel denetim koşulmadı. Fiziksel ürün/üretici/soğuk birleşim hassasiyeti kabul edilmedi.

MQ-07 uzman → MQ-05 sayısal çözüm → MQ-09 katalog ve terminaller → MQ-12 hedefli test → MQ-13 main/[skip ci] → MQ-00 REVIEW. Ayrı kaynak Node testi tests/qa-mq07-sc22-thermocouple-mv-v11920.test.cjs. Sonraki: sensor-analog-apps-src-04 PT100.
