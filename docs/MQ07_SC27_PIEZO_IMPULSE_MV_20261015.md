# MQ-00 / MQ-07 SC27 — Piezo iki elektrotlu sanal darbe ve UT33D+ mV ölçümü (2026-10-15)

Repo: `uysalayhan23/DevreTasarimStudyo`, dal `main`. MQ-00 **REVIEW / fiziksel kabul yok**. GitHub Actions çalıştırılmadı; `[skip ci]`.

## Bulgular

Mevcut ders özgün kayıttan dönüştürülmüş iki elektrotlu `tutorial-piezo`, R1=1 MΩ, UT33D+ DCV 200mV ve iki hedefli probtan oluşuyordu (5 fiziksel/sanal katalog bileşeni, 4 kablo). Gerçek `dist/simulation.js`, `dist/device-behavior.js` ve `dist/current-model.js` içinde darbe özelliği ve elektromotor gerilim çözümü hali hazırda çalışıyordu. İzole gerçek kaynak testi: 100 mV (0ms), 50,57 mV (150ms), 10,30 mV (500ms), 1,06 mV (1000ms), 0 mV (1601ms). Red/black fiş kablosu kopuk -> OL, prob teması kopuk -> 0 mV, ters prob -> −100 mV. R1 kablosu kopuk olsa bile ideal geçici EMK sürer; bu **fiziksel R-C piezo modeli değil**.

Ancak `dist/app.js` içinde `piezoTapAt` değerini kullanıcı etkileşimiyle güncelleyen bir Piezo kontrolü ve bu geçici olayı düzenli örnekleyen zamanlayıcı yoktu. Sayfa öyküsü “Sanal darbe uygula” dese de kullanıcı bunu uygulayamıyordu.

## Dar kapsamlı değişiklik

- `dist/symbols.js`: yalnız `tutorial-piezo` bileşeninde `mq07PiezoTapUi=true` varsa **Sanal darbe uygula** SVG denetimi çizer.
- `dist/app.js`: sadece `project.tutorialLesson.id==='sensor-analog-apps-src-08'` çalıştırılan simülasyonunda bu kontrollü sanal eylem `performance.now()` ile `piezoTapAt` atar; düzenlenemez hazır örnek kilidini veya kabloları değiştirmez. Örnekleme 1600 ms boyunca 50 ms aralıkla otomatik yenilenir ve son sıfır değeri okunur. Simülasyon kapalıysa önce başlatma uyarısı gösterir.
- `dist/tutorial-pedagogy.js`: yalnız SC27, `mq07PiezoTapUi` opt-in bayrağı, eğitim adımları, mV gerilimi, prob polaritesi, ölçüm kopuklukları ve sınırlamalar; 5 bileşen/4 kablo/4 adım korunur.

## MQ-12 hedefli kanıt ve sınırlar

Gerçek original catalogue + native JS simülasyonundaki gerilim zamana göre azalma ve kırık prob/polarite senaryoları izole V8 ortamında denetlendi. 1655 müfredat eski/yeni karşılaştırmasında yalnız `sensor-analog-apps-src-08` değişti. `dist/app.js` ve `dist/symbols.js` JS parse denetimi ve SC27'ye özel kontrol dizeleri doğrulandı. Hedefli Node regresyon dosyası `tests/qa-mq07-sc27-piezo-impulse-mv-v11920.test.cjs` eklenmiştir, **Node tam test paketi veya Windows Edge/Chrome görsel-etkileşimli test çalıştırılmadı**. Piezo kapasitesi, kuvvet-hassasiyeti, gerçek R1 yüklü RC sönümü, fiziksel kalibrasyon ve gerçek UT33D+ örnekleme dinamiği doğrulanmış değildir.

MQ-07 → MQ-05/MQ-09 çapraz kaynak → MQ-12 hedefli JS QA → MQ-13 repo ana dal sürekliliği → MQ-00 REVIEW. SC11–SC26, locked ölçek/terminal/ortografik ve mevcut ders kayıtları korunmuştur. Sıradaki `sensor-analog-apps-src-09` Yük hücresi / load cell.
