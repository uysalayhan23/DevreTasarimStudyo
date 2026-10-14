# 2026-10-14 — Derinlemesine Öğretim ve Görsel Kabul Programı

## Güncel kesin durum

Tam müfredat **1.655 ders**. Yalnız daha önce kabul edilen **136 rich** ders; geri kalan **1.519** ders otomatik kaynak rehberli olup `fullyRich=false` ve `pedagogicalAcceptance=false`. 1.519/1.519 kaynak denetimi **anlatım kalitesi veya öğrenci öğrenmesi kabulü değildir**. Önceki 722 kablolu native solver stabilitesi 35 hedefsiz sensör + 7 reaktif davranış REVIEW durumlarını kapatmaz. Gerçek Windows/`file:///` görsel onay açık.

## Zorunlu ders-bazlı kabul ölçütü

1. **Amaç ve gerçek hayat davranışı:** öğrenci devrenin neyi algıladığını, kontrol ettiğini, dönüştürdüğünü veya ölçtüğünü açıklayabilmeli; genel “elemanlar kullanılır” cümlesi yeterli değil.
2. **Şema ile başlık uyumu:** başlıktaki NTC/LDR/opamp/role vb. gerekli elemanlar gerçekten `project.components` içinde bulunmalı; önemli kontrol uçları gerçek `project.wires` ile bağlanmalı. Başlığa uysun diye doğrulanmadan sensör eklenmez.
3. **Gerçek terminaller ve fonksiyon:** enerji kaynağı → besleme pinleri → giriş/bölücüler → kıyas/geri besleme → çıkış/yük → dönüş noktaları ve ölçüm pinleri gerçek adlarıyla açıklanmalı.
4. **Hesap ve geçiş davranışı:** kaynakça/ürün/simülasyon değerleriyle temellendirilen formül, eşik, beklenen **iki farklı çalışma durumu**, ölçüm yöntemi; belirsiz fiziksel değerler UNKNOWN/REVIEW olarak kalmalı.
5. **Öğrenci deneyi ve ölçme:** ilk durum, öğrencinin değiştireceği gerçek sanal kontrol, beklenen çıkış, ölçüm, karşılaştırma ve yanlış sonuç durumunda ipucu.
6. **Sayfa ve görsel QA:** yüzer pencerede tekrarlayan paragraf yok, 13–14 px okunabilirlik, sahne ve terminali örtmeyen mevcut boyut, yatay taşma/üst üste binme/prob bağlantısı, kaydırma, dar ekran, `file:///` Windows gerçek UI kabulü. Bunların hiçbiri tek başına statik kaynak PASS ile kapanmaz.
7. **Kilit sürekliliği:** 136 rich kabulü, kaydedilmiş projeler, 4 dashboard kartı, gerçek ölçüler ve terminal geometrisi, eski migration verisi korunur; kaynak ID/terminal migration yapılmadan yeniden adlandırılmaz.

## Pilot MQ-07/MQ-05/MQ-12 — opamp-apps-src-08

Kullanıcı ekranında **NTC’li karşılaştırıcı** dersi RV1 potansiyometreyle üretildiği için ders başlığı/cihaz uyuşmazlığı bulundu. Mevcut, daha önce kullanılmış `resistiveSensorComparatorProject` şablonu ile özgün `sensor-ntc` modelinin 24 VDC ve LM358P pin 8,4,3,2,1 üzerinden kullandığı proje hedeflendi. `R2=R3=10 kΩ` referans bölücüsü 12 V; `NTC/R1` sensör bölücüsü giriş gerilimini üretir. 15→25→35 °C giriş karşılaştırmasında özgün V8 solver düşük→eşik→yüksek çıkışı izler. Metinler baştan sona amaç→terminaller→12 V hesabı→NTC değişimi→OUT gerilimi→öğrenci görevi düzeninde yazıldı. `physicalTestAccepted=false`, `pedagogicalAcceptance=false` korundu. Bağımsız kullanıcı/Windows QA tamamlanmadan FINAL verilmez.

## Geniş müfredat için kabul durumu

Her ders için `titleVsPhysicalPart`, `terminalMap`, `causeAndEffect`, `measurableOutput`, `lessonText`, `layout`, `sourceRegression` alanları tek tek PASS/REVIEW/N/A ile takip edilecek. Bölüm bölüm ilerle: öncelik P1 gerçek başlık-devre uyuşmazlığı; ardından 1.519 otomatik metnin konuya özgü anlatımı; sonra 1.655 sayfa UX kabulü. Tekil pilot tamamlanması, bütün derslerin düzeltildiği anlamına gelmez. Ajan zinciri MQ-07 lider → MQ-05 çapraz → MQ-12 V8/Node kanıt → MQ-13 repo süreklilik → MQ-00. Actions kullanılmayacak, `[skip ci]`.

## 2026-10-14 — MQ-07 tam müfredat semantik kalite tabanı (kapanış değil)

- Güncel `main` HEAD `349fcefd3e748cccb2c71f5cc1f671085eb3d6ed` özgün kaynaklarından V8 ile **1.655/1.655 ders tarandı**. **523 şablon özet, 350 şablon çalışma açıklaması, 644 birbirini tekrarlayan giriş, 715 derste en az bir genel malzeme gerekçesi** tespit edildi. Başlık NTC iken kablolu şemada NTC olmayan ders **0** (önceki `opamp-apps-src-08` pilot onarımından sonra). Bu gruplar kesişir; **toplanmaz**.
- Yeni fail-closed semantik envanter: `scripts/qa-tutorial-pedagogical-depth-v11920.cjs`, negatif örnekleri de doğrulayan `tests/qa-tutorial-pedagogical-depth-v11920.test.cjs`. V8 test uyarlamasında **2/2 PASS**; **gerçek Node `--test` çalıştırılmadı**. Envanter `evidence/mq07_pedagogical_semantic_baseline_20261014.json` içine kaydedildi.
- **Derslerin pedagojik kabulü 1.519 REVIEW**, Windows sayfa/terminal görünürlüğü ve bağımsız öğrenme QA hâlâ **OPEN**. Bu QA'nın PASS olan testleri, ders içeriklerine onay vermez.
- Düzeltme sırası: (1) başlık–fiziksel eleman/topoloji uyuşmazlığı; (2) kaynaklı neden-sonuç/pin-geri besleme/ölçüm anlatımı; (3) gerçek Windows `file:///` sayfa akışı, prob/scroll/taşma; (4) ilgili ders için MQ-07→MQ-05→MQ-12→MQ-13→MQ-00 kapıları. Mevcut NTC pilotu tekrar onarılmaz; 136 rich ve kanonik örnekler korunur.
