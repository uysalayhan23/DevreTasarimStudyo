# ABB ACS800 R5 — Devre Tasarım Stüdyosu v1.17.0

## Başlangıç

ZIP’i tamamen çıkarın, **BASLAT.bat** dosyasını açın. Dashboardda **ABB ACS800 R5 · sürücü atölyesi → Panel ve yön** örneğini seçin. Simülasyonu açıp sürücünün **I** düğmesine basın. 1480 rpm referansıyla yaklaşık 20 saniyede 50 Hz’e ulaşır. **O** durdurur, **→ / ←** yön seçer.

Malzeme kütüphanesinde **Sürücüler → ABB ACS800 · R5** bulunur. Sürücüyü seçtiğinizde yan menüdeki **ACS800 Parametreler** düğmesi açılır; cihazın **PAR** düğmesi de aynı pencereyi açar. Üç sekme vardır: çalışma ekranı, parametreler, RMIO bağlantıları. Parametre numarasını arama kutusuna yazabilirsiniz.

### Modelin seçimi

Yüklenen fotoğrafın adı `R5 Frame acs800-04-0100-3.png` olmasına rağmen ABB donanım kılavuzunun **110. sayfasında 0100-3, R6** olarak verilmiştir. Bu uygulamada istenen **R5** gövdesi için **ACS800-04-0075-3** esas alınmıştır: 380/400/415 V, hafif aşırı yükte 75 kW / 141 A; ağır hizmette 45 kW / 100 A. Sürekli akım 145 A, maksimum akım 170 A’dır.

Yüklenen görsel gövde referansıdır; R5’in alt güç klemensleri kılavuz sayfa 71’e göre vektör olarak çizilmiştir. Bu görünüm birebir R5 ürün fotoğrafı diye sunulmaz. RMIO soketleri fotoğraftaki bağlantı sırasına yerleştirilmiştir; güç/RMIO kabloları bu soketlere bağlanır. Üretici isimleri bağlantı rehberinde, soketin üzerinde bekletildiğinde ve şema görünümünde gösterilir. Malzeme görünümündeki küçük numaralar aynı blok içindeki terminal numaralarıdır.

## Güç ve RMIO uçları

R5 güç klemensleri soldan sağa: **PE – U1 – V1 – W1 – [boşluk] – R− – UDC+/R+ – UDC− – U2 – V2 – W2 – PE**. UDC+ ve R+ tek fiziksel sokettir. Giriş faz sırasını değiştirmek bu doğrultuculu sürücünün motor yönünü değiştirmez; çıkış fazları veya yön komutu değişir.

| Blok / uç | İşlev |
|---|---|
| X20:1 / :2 | −10 V referans / AGND |
| X21:1 / :2 | +10 V referans / AGND |
| X21:3 / :4 | AI1+ / AI1−, diferansiyel −10…+10 V, >200 kΩ |
| X21:5 / :6 | AI2+ / AI2−, 0/4–20 mA, 100 Ω |
| X21:7 / :8 | AI3+ / AI3−, 0/4–20 mA, 100 Ω |
| X21:9 / :10 | AO1+ / AO1−, 0/4–20 mA |
| X21:11 / :12 | AO2+ / AO2−, 0/4–20 mA |
| X22:1…:6 | DI1…DI6 |
| X22:7 / :8 | +24VD, aynı dahili besleme |
| X22:9 | DGND1: DI1–DI4 ortak |
| X22:10 | DGND2: DI5–DI6 ve DIIL ortak |
| X22:11 | DIIL, başlatma kilidi |
| X23:1 / :2 | +24V / GND, yardımcı besleme giriş/çıkışı |
| X25:1 / :2 / :3 | RO1 NC / C / NO |
| X26:1 / :2 / :3 | RO2 NC / C / NO |
| X27:1 / :2 / :3 | RO3 NC / C / NO |

Analog kanalların dönüş uçları bağımsızdır. **AI1− kendiliğinden AGND’ye bağlanmaz.** Fabrikadaki X22:8–X22:11 DIIL köprüsü ve DGND1–DGND2 J1 köprüsü başlangıçta takılıdır. RMIO sekmesinden enerji kesikken kaldırılabilir. J1 kaldırılırsa DI1–DI4 grubunun dönüşünü ayrıca bağlamak gerekir. DIIL köprüsü kaldırıldığında kilit sinyali ayrıca bağlanmalıdır.

## Kablolu kumanda

Factory makrosunda **X22:7 → çalıştır anahtarı → X22:1**, **X22:7 → yön anahtarı → X22:2** bağlayın. Yön değiştirmek için **10.03 = REQUEST** gerekir; fabrika değeri FORWARD olduğunda DI2 yönü değiştirmez. **LOC/REM** ile REMOTE seçin.

Potansiyometrenin dış uçları X21:1 ve X21:2’ye, orta ucu X21:3’e bağlanır. X21:4 dönüşünü X21:2’ye bağlayın. AI2 veya AI3 için ilgili +/− çiftine akım döngüsü bağlayın. **13.06 veya 13.11 = 4 mA**, ilgili giriş için 4–20 mA alt ölçeğini seçer.

**REMOTE durumunda, komut kaynağı klemenslerse panelin STOP tuşu devreyi durdurmaz.** Kablolu STOP’u veya LOC/REM ile yerel kumandayı kullanın. Bu ayrım kılavuzdaki gerçek davranıştır. Simülasyonu tamamen durduran üst menü düğmesi her zaman kullanılabilir.

DIIL açıldığında 21.09’a göre serbest veya acil rampalı duruş uygulanır; kilit geri geldiğinde yeniden START gerekir. RUN ENABLE, 16.01 ve 21.07’ye göre ayrıca değerlendirilir. İki telli harici START açık kalırsa normal bir arıza resetinden sonra yeniden çalışabilir. Üç telli girişte bir START darbesi gerekir.

## Parametreler ve ölçüm

**105 parametre** uygulanmıştır; penceredeki her seçim ilgili model davranışına bağlıdır. Parametreler ve kullanıcı makroları proje dosyasına kaydedilir. Geçici çalışma durumu kaydedilmez.

| Grup | Eğitim modelinde uygulanan davranış |
|---|---|
| 10 | EXT1/EXT2, iki/üç telli START/STOP, yön izni, JOG |
| 11 | Panel rpm/Hz veya %, EXT1/EXT2 seçimi, AI1/AI2/AI3, bipolar/joystick, analog toplam/fark/çarpım/min/max, dijital artır/azalt |
| 12 | 15 sabit hız ve dijital bit seçimi; Scalar modda kılavuzdaki hız sınırlaması |
| 13 | 0/2 V, 0/4 mA alt aralıklar, ölçek, filtre, tersleme |
| 14 | RO1–RO3 işlevleri ve açma/kapama gecikmeleri; gerçek kuru kontak devreleri |
| 15 | Bağımsız AO1/AO2 akım çıkışları, minimum, filtre, ölçek ve tersleme |
| 16 | Çalışma izni, parametre kilidi, 358 kilit açma kodu, reset kaynağı, yerel kilit, harici RMIO beslemesi |
| 20 | Hız/frekans sınırları ve model akım sınırı |
| 21–22 | Serbest/rampalı duruş, DIIL davranışı, iki rampa seti, acil rampa |
| 30 | Analog sinyal kaybı ve harici arıza |
| 40 | PID kazanç, integral, türev/filtre, hata tersleme, ACT1/ACT2 işleme |
| 99 | Factory, Hand/Auto, PID, Sequential, kullanıcı makroları, DTC hız modeli / Scalar V/f, motor etiket verileri |

Çalışma ekranında frekans, tahmini hız/akım/tork/güç, DC bara, giriş/çıkış gerilimi, analog kanallar, dijital girişler ve röleler görülür. **01.08 giriş gerilimi, 01.09 çıkış gerilimidir.** AI1/AI2/AI3 değerleri kablolar ve giriş dirençleri üzerinden çözülür. Motor fazları arasındaki AC gerilim ve bir fazdaki seri akım mevcut ölçü aletleriyle okunur.

AO1/AO2 **akım çıkışıdır**. mA aletini seri bağlayın. 500 Ω direnç üzerinde 20 mA, 10 V üretir; 4 mA alt değer seçilirse alt noktada 2 V görülür. Donanım yük sınırı <700 Ω’dur; model 14 V uyumluluk sınırı kullanır. Besleme yoksa analog/dijital çıkışlar enerji üretmez. Harici X23 beslemesi RMIO’yu açık tutabilir; şebeke yoksa motor çıkışı çalışmaz.

Arıza senaryoları: 2310 çıkış kısa devresi, 3210 yüksek DC bara, 3220 düşük DC bara, 3130 şebeke fazı eksikliği, 4210 sürücü termik seviyesi, 8110 analog sinyal kaybı, 9000 harici arıza. Arıza nedeni kalkmadan reset etkili olmaz. Geçmişte son 16 arıza çalışma boyunca görülebilir.

## Hazır devreler

1. **Panel ve yön:** Yerel 1480 rpm, ileri/geri, rampalı duruş. Örnekte 21.03 = RAMP; Factory fabrika değeri COAST’tur.
2. **RMIO ve potansiyometre:** Factory harici kumanda, AI1 ve bağımsız dönüşü, yön anahtarı.
3. **4–20 mA ve röleler:** AI2, bağımsız AO1/AO2 ampermetreleri, RO2 ile çalışma lambası.
4. **PID kontrol:** EXT2, AI1 referans, AI2 geri besleme, DI5 izin, DI6 START. İlk adımda integral kapalıdır; 40.13 ile açabilirsiniz.

Aynı örnekler **Ornekler** klasöründeki `.odsdevre` dosyalarından açılabilir. V20 örnekleri ve önceki devre elemanları pakette korunur.

## Modelin kapsamı

Bu bir **eğitim simülasyonudur; ABB firmware’inin tam emülasyonu değildir**. DTC burada frekans/hız ve etiket verileriyle temsil edilir. Akım, tork ve güç tahminidir; gerçek elektromanyetik motor, PWM/IGBT anahtarlaması, atalet, rejenerasyon ve termik zaman sabitleri çözülmez. Serbest duruşta elektrik çıkışı kesilir; mekanik yavaşlama modeli yoktur. PID simülasyon adımı programın zaman adımıdır, ABB’nin 12 ms iç döngüsü değildir.

ID Run, tork kontrol makrosu, fren kıyıcı/direnç dinamiği, STO/POUS opsiyon kartları, adaptif program, otomatik reset, hız denetleyicisi ince ayarı, kritik hızlar, fieldbus/DDCS/Modbus/PLC haberleşmesi ve tüm firmware parametreleri bu sürümde emüle edilmez. **R− terminali fiziksel çizim içindir; fren kıyıcı anahtarlama modeli yoktur.** Görünmeyen parametreler uygulanmış gibi gösterilmez. Şebeke faz kaybı topolojiye göre tespit edilir; DC dalgalanmasının ayrıntılı fizik modeli kullanılmaz.

## Dayanaklar

- **ABB 3AFE68372984 Rev F**, yüklenen `EN_ACS800_04_HW_F_A4.pdf`: s. 71 R5 güç sırası; s. 76 R5/R6 kontrol klemenslerinin konumu; s. 91–96 RMIO, uç adları, diferansiyel analog kanallar ve J1; s. 110 R5/R6 model ve nominal değer tablosu. Kopya: `Belgeler/ABB_ACS800_HW_RevF.pdf`.
- **ABB 3AFE64527592 Rev L**, yüklenen `EN_ACS800_Standard_FW_L.pdf`: s. 25–32 CDP 312R panel; s. 87–96 makrolar; s. 100–101 gerçek sinyaller; s. 105–138 giriş, referans, çıkış, kilit ve rampa parametreleri; s. 144 arızalar; s. 157–160 PID; s. 187–189 motor/makro; s. 240–247 hata kodları; s. 258–266 fabrika değerleri. Kopya: `Belgeler/ABB_ACS800_FW_RevL.pdf`.
- Yüklenen `R5 Frame acs800-04-0100-3.png`: değişmeden saklanan gövde referansı; RMIO bağlantı hizası. R5/R6 ayrımı yukarıda belirtilmiştir.

Gerçek sürücü üzerinde çalışmadan önce üreticinin enerji kesme, bekleme ve gerilimsizliği ölçerek doğrulama talimatları uygulanır. Uygulamadaki canlı terminal/kablo uyarısı korunur; cihaz gövdesi ve panel düğmeleri simülasyonda kullanılabilir.
