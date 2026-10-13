# MQ-12 — Üretici kaynaklı sensör arayüzü kabul kapısı (2026-10-13)

**Statü: REVIEW, fiziksel kabul verilmedi.** Yalnız ZIP'deki gerçek kaynaklar, GitHub'a SHA eşit olarak yüklenen yürütücü ve resmi üretici/katalog bilgilerinden üretilmiş *salt-okunur* denetimdir. Devre şemaları, kanonik kilitler, 1.655 ders, 35 sensör hedefi ve yedi reaktif senaryo değiştirilmedi.

## Gerçek elektriksel kaynak değeri: 24 V — önemli düzeltme

\`arduino-bench-supply\` genel katalog varsayılanı **5 V** olmasına rağmen sekiz sorunlu **kanonik dersin her biri kendi devre bileşeninde \`dcVoltage:24\` tanımlar**. Bu nedenle "bu sekiz derste solver beslemesi 5 V" yorumu **yanlıştır**. Test doğrudan \`lesson.project.components[].dcVoltage\` değerini okuyarak **8/8 = 24 V** ve "kablo açıklamaları +24 V" ile **0 uyumsuzluk** doğrular.

Üretici kanıtları, *ürün özelliklerini* doğrular; devreye otomatik gerçek donanım kabulü vermez:

| Fiziksel model | Üretici kanıtı | Mevcut katalog / kanonik kabul |
| --- | --- | --- |
| wenglor U1KT003 | 18–30 V DC; iki PNP anahtarlama çıkışı, 100 mA/çıkış sınırı; 30–400 mm; M12, 4 pin; ayarlanabilir NO/NC | \`ultrasonic-switch\` BN/BU/BK/WH. Dersin 24 V beslemesi **uyumlu**. Kesin çıkış ayarı, röle bobin akımı ve buzzer anma gerilimi **kanıtsız**. |
| Kobastar SB2 | Dört telli sensör; EX+/EX− uyartım, SIG+/SIG− ölçüm uçları; köprü ölçüm sinyali | \`load-cell\` doğrudan üç telli PNP yerine konamaz. Uygun ölçüm/sinyal işleme arayüzü eksik. |
| MQ-2 modül | Üretici/ürün özelliklerinde 5 V elektronik besleme ve analog çıkış | \`arduino-mq2\` VCC/AO/GND; mevcut 24 V röle-sensör şablonunun yerine **doğrudan yerleştirilemez**. |

Kaynaklar:
- wenglor resmî U1KT003: https://www.wenglor.com/en/Sensors/Ultrasonic-Sensors/Ultrasonic-Distance-Sensors/Distance-Sensor/p/U1KT003
- Kobastar SB2 PDF: https://kobastar.com/wp-content/uploads/2024/03/Datasheet-SB2.pdf
- Olimex MQ-2 modül: https://www.olimex.com/Products/Components/Sensors/Gas/SNS-MQ2/

## Sekiz kanonik ders için yürütülebilir kapı

\`node scripts/qa-mq12-sensor-electrical-contract-v11920.cjs\` tam 1.655 dersin içinden sekiz konu uyumsuzluğunu bulur; **kaynağın gerçek beslemesini**, +24 V eğitim açıklamalarını, bağlı BN/BU/BK uçlarını ve katalog adaylarının birebir terminal eşdeğerliğini denetler. Açık kabul nedenlerini her derse ayrı kaydeder. **8/8 fiziksel kabul REVIEW, 0 otomatik değiştirme**. Ürün sözleşmesi olmayan adaylara anma değeri uydurulmaz.

Özellikle ultrasonik + buzzer dersindeki açık kapılar: buzzer anma gerilimi, sensörün anahtarladığı gerçek bobin akımı, buzzer \`X1/X2→1/2\` şema geçişi ve üreticideki NO/NC parametre ayarının dersle eşleşmesi. \`ultrasonic-switch\` 24 V'a uygun bir **adaydır**, ancak fiziksel kabul tamamlanmış değildir. Geçici NO/NC ve buzzer testleri kanonik devrede değil, kaynak klonunda çalıştırıldı.

## Yürütülen doğrulama ve değişiklik sınırı

- **63/63 Node test PASS**: önceki 59 + yeni dört elektriksel sözleşme regresyonu. Gerçek Node.js v22 üzerinde çalıştırıldı; 0 FAIL.
- **1.655/1.655 ders kaynak QA PASS**; **722/722 sınıflandırma**, temel **2.166/2.166 kararlılık PASS**.
- **Batch N 1.519/1.519 rehber QA PASS, 0 sorun**.
- Yeniden çalıştırılan REVIEW tanısı: **35 fiziksel hedefi eksik sensör**, **7 reaktif dersin 707/707 kararlı fazı**, **421 response PASS / 35 REVIEW**, **414 restoration PASS / 42 REVIEW**, **42 farklı davranış REVIEW**.
- Yeni script ve test dosyalarının **GitHub blob SHA** değerleri yerel gerçek test dosyalarının Git blob hash'leriyle eşleştirildi.
- **Herhangi bir kanonik ders veya katalog malzemesi değiştirilmedi.** Kaydedilen eklemeler yalnız \`scripts/\`, \`tests/\` ve bu teknik rapordur. Actions kullanılmadı; commitlerde \`[skip ci]\`.

## Sonraki kapı

İlk olarak U1KT003 sensörü ve gerçek buzzer için üretici ürün numarası, DC anma gerilimi ve bobin/yük akımını kanıtla. Ardından sekiz farklı fiziksel konu için doğru algılama/ara cihaz davranışını mevcut simülasyon motorunun destekleyip desteklemediğini uzman QA ile değerlendir. Uygun veri olmadan fiziksel terminal düzeni veya kanonik bağlantı değiştirme.
