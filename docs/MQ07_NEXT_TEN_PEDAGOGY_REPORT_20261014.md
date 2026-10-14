# MQ-07 — Sıradaki 10 kablolu dersin devreye özgü anlatım düzenlemesi (2026-10-14)

Kaynak denetim başı: `54ce6c7e7da49e7017b2dd78d79d858e8f31e769`; bu doğrulamada özgün GitHub kodu V8 üzerinde bellek içi Node fs/path/vm uyarlaması ile yürütüldü. **Node --test veya Windows/file:/// görsel kabulü yapılmadı.** Aday `dist/tutorial-pedagogy.js` blob: `fdc7e1c417a1ed933245ecb63bb03ebf516d78e9`. Kanıt: `evidence/mq07_next10_pedagogy_v8_20261014.json`.

## Gerçek kaynak düzeltmeleri

İlk on dersin daha önce yapılan metinlerini yeniden yazmak yerine **sonraki 10 şablon anlatımlı kablolu derste** `summary`, `explanation`, `learningGoal`, `beginnerSteps`, `materials.why` alanları gerçek malzeme ve terminallerle zenginleştirildi:

- `installation-systems-src-11`: anten/dağıtım kutusu/TV prizi RF hat yolu; gerçek sinyal ölçüm kabulü değil
- `installation-systems-src-12`: KNX bus ve aydınlatma aktüatörü; güneşlik motoru olmadığından **REVIEW**
- `electronic-switching-src-02`: +24 V STOP→START/yardımcı K1→bobin mühürleme, START bırakılınca tutma ve STOP ile bırakma
- `electronic-switching-src-04`: BD139 NPN B/C/E, RB=4,7 kΩ, RL=1 kΩ, teorik 24 mA üst sınırı ve kolektör ölçümü
- `electronic-switching-src-05`: potansiyometre başlığına karşın yalnız S1 buton bulundu; **REVIEW**
- `electronic-switching-src-06`: gecikmeli açma başlığına karşın RC/zamanlama ağı bulunmadı; **REVIEW**
- `electronic-switching-src-07`: gecikmeli kapama başlığına karşın RC/zamanlama ağı bulunmadı; **REVIEW**
- `sensor-analog-apps-src-01`: NTC ve LM358P giriş karşılaştırması, gerçek 10 kΩ bölücü, 12 V eşik, ölçüm ve deney
- `sensor-analog-apps-src-02`: PTC ve LM358P, yükselen direnç/düşen giriş gerilimi; eşik geçişi doğrulanmadıkça kabul açık
- `sensor-analog-apps-src-03`: termokupl mV sinyali ile ENDA ET4420 sensör ve besleme uçlarının ayrımı

Bu değişiklikler **sanal eğitim içeriğidir**, gerçek elektrik tesisatı montajı veya üretici terminal kabulü değildir.

## Yeni gerçek V8 regresyonu

- 1.655 ders / 722 kablolu / 136 korunmuş rich; **tüm hedef kanonik devreler ve rich kayıtları birebir aynı**.
- Özgün solver + 939 ürünlük katalog kaynak denetimi: 722 kablolu başlangıç durumu kararlı; eksik tanım, yanlış terminal, kısa devre, blokaj, istikrarsızlık ve istisna: **0**.
- Batch N 1.519/1.519 kaynak QA PASS; kaynakla eşleşen 2.085 kontrol; sorun 0.
- MQ-12 önceki ilk 10: classification 10/10, stability 10/10, desteklenen kumanda response 8/8, mühürleme `seal-in-1` geri dönüşü REVIEW korunur.
- Semantik kaynak taraması: genel özet **513→503**, şablon açıklama **340→330**, tekrarlanan giriş **634→624**, genel malzeme amacı **706→701**. Kalanların pedagojik kabulü henüz verilmedi.
- 4 başlık–devre eksikliği kapatılmadı. Kaydedilen projeler, gerçek malzeme ölçeği, terminaller, tüm önceki kilitler değişmedi.
- MQ-07 içerik kaynağı güncellendi; MQ-05/MQ-12 V8 kaynak regresyonu PASS. **Gerçek Node tam paket, Windows görsel UI, öğrenci pedagojik nihai kabul ve dört eksik topoloji OPEN.** GitHub Actions 0; `[skip ci]`.
