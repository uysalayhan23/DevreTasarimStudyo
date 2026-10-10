# SINAMICS V20 · v1.16.0 kullanım rehberi

Model: **Siemens 6SL3210-5BB21-5UV1**, 1,5 kW, 7,8 A, tek faz 200–240 V giriş, üç faz 230 V çıkış. Uygulamadaki mevcut terminal kimlikleri korunur; eski projeler açılırken eski hız/kumanda ayarları yeni parametrelere aktarılır.

## İlk deneme

1. Dashboard → **SINAMICS V20 · sürücü atölyesi → Panel ve rampalar**.
2. **SİMÜLE ET** düğmesine basın. Sürücünün ekranında HAZIR görünür.
3. V20 üzerindeki yeşil **I** düğmesine basın. Motor 35 Hz hedefine hızlanır.
4. V20'yi seçin; sağdaki **V20 Parametreler** düğmesine basın. Cihazın **M** tuşu da aynı pencereyi açar.
5. Çalışma ekranında frekans, çıkış gerilimi, DC bara, tahmini motor akımı/devir, AI1/AI2, AO1 ve DI/DO durumlarını izleyin.
6. **Yön** düğmesi motoru rampayla yavaşlatır, sıfırdan geçirir ve ters yönde hızlandırır. **Durdur** P1121 rampasını kullanır. **OFF2** sürücü çıkışını hemen keser; mekanik serbest dönme bu modelde hesaplanmaz.

Sürücü çalışırken parametre penceresi açık kalabilir. Canlı değiştirilebilen parametreler belirtilmiştir; motor/komut kaynağı gibi duruş gerektiren ayarlar çalışırken reddedilir. P0003 = 1 standart, 2 genişletilmiş, 3 uzman erişimi açar. Daha yüksek erişim isteyen grupta doğrudan erişim açma düğmesi bulunur.

## Kumanda ve bağlantılar

| Uç | İşlev |
| --- | --- |
| L1, L2/N, PE | Tek faz 200–240 V AC ve koruma iletkeni |
| U, V, W, PE2 | Üç faz motor çıkışı ve koruma iletkeni |
| DC+, DC− | DC bara; normal durumda yaklaşık girişin √2 katı |
| 1 | 10 V potansiyometre referansı |
| 2 / 3 | AI1 / AI2 |
| 4 / 5 | AO1 akım çıkışı / analog 0 V |
| 6 / 7 | P+ / N− RS485; haberleşme bu sürümde emüle edilmez |
| 8 / 9 / 10 / 11 | DI1 / DI2 / DI3 / DI4 |
| 12 | DIC; dijital giriş ortak ucu |
| 13 / 13b | Aynı +24 V kontrol beslemesinin iki bağlantı noktası |
| 14 / 14b | Aynı 0 V kontrol dönüşünün iki bağlantı noktası |
| 15 / 16 | DO1+ / DO1−, izole transistör çıkışı |
| 17 / 18 / 19 | DO2 NC / NO / ortak, kuru röle kontağı |

**Cn002 PNP:** 12 → 14; 13 → çalıştır anahtarı → 8; 13 → yön anahtarı → 9. **NPN:** 12 → 13; anahtarlar 8/9 uçlarını 14'e bağlar. DIC dönüşü yoksa girişler çalışmaz. DI3 hata onayı, DI4 ileri JOG'dur.

Potun dış uçları 1 ve 5'e, orta ucu 2'ye bağlanır. Hesap gerçek direnç bölücüsünü ve AI giriş yükünü içerir; potun yönü dış uçların bağlantısına bağlıdır. Mevcut analog seviye, konum ve ultrasonik sensör çıkışları da AI girişlerine bağlanabilir.

**AI akım modu:** P0756[0/1] = 3, P0757 = 4, P0759 = 20 ile 4–20 mA ve kopukluk izleme kullanılır. Akım girişi 235 Ω kabul edilir. AI1 ayrıca bipolar gerilimi kabul eder. Analog referans P2000 üzerinden frekansa ölçeklenir.

**AO1 yalnız akım çıkışıdır.** 4 ile 5 arasındaki döngüye ampermetreyi seri bağlayın. P0771 izlenen değeri, P0777/8/9 ve P0780 ölçeği belirler. Varsayılan 0–20 mA; P0778 = 4 ile 4–20 mA. 4/5'e 500 Ω direnç bağlandığında direnç üzerindeki gerilim 0–10 V olabilir. Açık devre/yük gerilimi 10 V ile sınırlanır.

DO1'i harici DC kaynağı ve yükle seri bağlayın. DO2 enerji kaynağı değildir: 19 ortak ucuna besleme bağlayın, yükü 18 veya 17 üzerinden sürün. Varsayılan DO1 çalışmayı, DO2 sağlıklı durumu gösterir; arızada DO2 bırakır. P0748 tersleme yapar.

## Kullanılabilen makrolar ve parametreler

| Makro | Uygulama |
| --- | --- |
| Cn001 | Ön panel / MOP hız referansı |
| Cn002 | İki telli PNP/NPN ve AI1 referansı |
| Cn003 | Üç doğrudan sabit hız; seçilen değerler toplanır |
| Cn004 | Dört bit ile 15 sabit hız seçimi |
| Cn005 | Sabit hız etkin değilken AI1 referansı |
| Cn006 | Üç telli ON/OFF butonları ve MOP artır/azalt |
| Cn007 | Üç telli ileri/geri butonları ve AI1 referansı |
| Cn008 | PID: AI1 referans, AI2 geri besleme |
| Cn009 | PID: sabit referanslar, AI2 geri besleme |

P0700 komut kaynağı, P0701–704 dijital giriş işlevleri, P0727 kumanda yöntemi, P0731/732 çıkış işlevleri; P0756–761 analog giriş, P0771–780 analog çıkış; P1000 hız kaynağı, P1001–1015 sabit hızlar; P1040/1047/1048 MOP; P1058–1061 JOG; P1080/1082 min./maks. hız, P1110 negatif referans kilidi; P1120/1121/1135 rampalar; P1300 doğrusal/karesel V/f; P2000/2001/2002 ölçekler ve P2200/2201–2203/2280/2285 PID pencereden ayarlanır.

Rampalar P1082 maksimum frekansına göre hesaplanır. 50 Hz maksimum ve 10 s rampada 25 Hz'e ulaşmak 5 s sürer. OFF3 hızlı duruşta başlangıç yuvarlatmasının toplam süre etkisi 1,1 × P1135 ile temsil edilir. Frekansla birlikte motor yön göstergesinin animasyon hızı da değişir; bu görsel, gerçek devirde bir stroboskop değildir.

P0010 ≠ 0 iken normal çalışma engellenir. **P3900 = 3** düğmesi devreye almayı tamamlar. Fabrika dönüşü için duruşta P0010 = 30 seçip **P0970 = 1** düğmesine basın. Modelde yalnız tek motor/kumanda veri seti vardır.

## Arıza denemeleri

- **F1:** Çalışma komutu varken U/V/W çıkışlarını kısa devre yapacak bağlantı.
- **F2 / F3:** Yüksek/düşük giriş gerilimi.
- **F4:** Çalışma ekranındaki eğitim sıcaklığını 100 °C veya üstüne getirin.
- **F5 / F11:** Eğitim yükünü artırarak sürücü I²t birikimi / motor akım sınırı.
- **F80:** İzlenen analog girişin sinyalini kesin.
- **F85:** Harici arıza işlevli dijital girişin NC sinyalini kesin.

Nedeni giderdikten sonra **Hata onayı**, BOP **OK** veya hata onayına atanmış DI kullanılır. Sonra yeni çalıştırma komutu gerekir. Arıza, çalışma çıkışını ve motoru durdurur; DO2 arıza sinyalini devreye aktarır. Şebeke tamamen kesildiğinde ekran ve çıkışlar enerjisiz olur. Fiziksel DC bara boşalma süresi modellenmez.

## Modelin kapsamı

Bu, Siemens belgelerine dayanan **eğitim simülasyonudur; gerçek cihazın tüm firmware'inin birebir emülasyonu değildir**. PLC'ler önceki sürümdeki gibi yalnız çizim içindir. USS/Modbus haberleşmesi, tüm BICO bağlantıları, birden fazla veri seti, uygulama makroları, otomatik motor tanıma, gelişmiş frenleme/otomatik yeniden başlatma ve ayrıntılı PWM, kayma, atalet, rejenerasyon hesabı yoktur. Motor akımı ve devir göstergeleri tahminidir. Tek bir yıldız/üçgen motor için seri faz ampermetresi de aynı tahmini akımı okur; açık motor sargıları akım çekmez. Motor etiketi parametreleri modelde saklanır; nominal akım/yük ve frekans/anma devri üzerinden basitleştirilmiş hesap yapılır. Fiziksel koruma sınırlarının tamamı emüle edilmez.

## Simülasyonda dokunma davranışı

Cihaz gövdelerine tıklayıp seçebilir, özelliklerini inceleyebilir; buton, şalter, potansiyometre, sensör hedefi, cihaz tuşları ve ölçü aletini kullanabilirsiniz. Çarpılma uyarısı **devre kablosu, ek noktası veya terminale doğrudan temasta** her temasta açılır; simülasyon çalışmaya devam eder. Bağlantıları düzenlemek için üst çubuktan simülasyonu kendiniz durdurun. İzole ölçü probunu gövdesinden tutup ölçüm noktasına taşıma ve prob kablosunu düzenleme serbesttir. Devreye eleman ekleme/silme gibi yapısal düzenlemeler simülasyonu durdurur; bunlarda çarpılma pop-up'ı açılmaz.

## Kaynaklar

Kullanıcının yüklediği yerel PDF'ler esas alınmıştır. Sayfa numaraları basılı sayfadır; gerektiğinde fiziksel PDF sayfası ayrıca belirtilmiştir.

- `6SL3210-5BB21-5UV1_datasheet_tr_en.pdf`, s.1–2: hedef ürün, giriş/çıkış ve akım/güç bilgileri.
- `109740243_SINAMICS-V_at_3rd-party-PLC_FAQ_tr.pdf`, s.3–4, 8, 13: PNP/NPN ve kontrol terminalleri.
- `Siemens_Sinamics_V20_Devreye_Alma_Klavuzu.pdf`, s.4–19: BOP, hızlı devreye alma, makrolar ve analog/dijital G/Ç.
- `Sinamics_V20.pdf`, 09/2014: BOP, bağlantı makroları, parametre ve arıza bölümleri; eski proje bağlantılarının karşılaştırılması.
- `v20_getting_started_400v__230v_en-US_en-US.pdf`, 11/2012, s.19–31: sistem bağlantıları, terminaller ve BOP.
- `V20_op_instr_0520_en-US.pdf`, 05/2020: s.46–47 terminaller; s.59 ekran; s.71–81 makrolar; s.229–240 DI/DO ve analog; s.259–262 frekans/rampa; s.341 ve sonrası arızalar. Bu dosyada fiziksel PDF sayfası basılı sayfadan iki fazladır.
- `V20_cmpct_op_instr_0321_en-US.pdf`, 03/2021, s.1–3: makrolar, P1000/1080/1082/1120/1121 ve devreye almanın bitirilmesi.

Gerçek devre üzerinde çalışmadan önce enerji kesilmeli; enerjisizlik yetkin kişi tarafından doğrulanmalıdır. Yazılımdaki DURDUR düğmesi gerçek panonun enerjisini kesmez.
