# MQ-07 / MQ-12 / MQ-13 — SC34 Güneş Pili kaynak eşleştirmesi (2026-10-16)

Repo: `uysalayhan23/DevreTasarimStudyo`, dal `main`.
Tek birleşik backlog: `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` (bu dosya bağımsız backlog değildir).

## Gözlem ve değişiklik

SC34 `sensor-analog-apps-src-15` başlığı `34. TEMRİN Güneş Pili Uygulaması`. Kaynakta genel `sensorProject()` eşlemesi `güneş pili` ifadesini tanımadığından, ders güneş hücresi yerine ilgisiz proximity/capacitive/optik algılama kartına düşüyordu.

`dist/tutorial-pedagogy.js::explicitTitleProject()` içinde yalnız bu ders için
`tutorial-solar-cell`, `unit-ut33d-plus`, `resistor` referans panosu seçildi.
Bilinçli olarak `topicBoard` / `referenceOnly` tutuldu: kablolu, akım/gerilim çözen PV devresi veya I-V eğrisi henüz mevcut değildir. Fotovoltaik üretim, yük altında ölçüm ve gerçek cihaz doğruluğu varmış gibi sunulamaz.

MQ-12 hedefli kaynak testi: `tests/qa-mq07-sc34-photovoltaic-source-v11920.test.cjs`; 1.655 ders kimliği, SC34 başlığı, kartın kablosuz/referans niteliği, doğru üç malzeme ve gerçek katalog varlığı beklentileri. **Test dosyası oluşturuldu ama Node çalışma ortamında çalıştırılmadı — NOT_RUN.** Gerçek tarayıcı, Windows file:/// görüntüsü, elektriksel PV davranışı ve fiziksel kabul NOT_RUN.

## Kapanış

- MQ-07 kaynak düzeltmesi: COMMITTED.
- MQ-12 test tanımı: COMMITTED; yürütme kanıtı bekliyor.
- MQ-13: yalnız `main`, küçük `[skip ci]` commitler; Actions tetiklenmedi.
- MQ-00 kararı: **REVIEW / NOT_DONE**. Sonraki turda önce Node hedef testi çalıştır; ardından mümkünse PV fiziksel veri kaynağı ve ölçüm semantiği kanıtlanarak ayrı kabul işi aç.
