# Devre Tasarım Stüdyosu v1.15.0

Yüklenen v1.14.0 paketi üzerine geliştirilmiştir. ZIP'i tamamen çıkarıp
`BASLAT.bat` dosyasını çalıştırın; alternatif olarak `dist/index.html` dosyasını
Chrome veya Edge ile açın. Uygulamanın çalışması için internet ve sunucu gerekmez.
Eski `.odsdevre` proje dosyaları **Aç** düğmesiyle açılabilir.

## Ölçüm atölyesi

Dashboard'a sekiz hazır örnek eklendi. Aynı dosyalar `Ornekler` klasöründedir.
Örnekler 3D malzeme görünümünde açılır; görünümü istediğiniz zaman değiştirebilirsiniz.

| Örnek | Başlangıç sonucu | Deneyebileceğiniz değişiklik |
| --- | --- | --- |
| Gentek HT-2 | 20 °C → 12 mA; %25 nem → 8 mA | Sıcaklık, nem, gösterilen kanal ve çıkış türü |
| WAZ5 | 5 V → 12 mA | 0–10 V girişini değiştirin veya dış giriş bağlayın |
| ORDEL HMT-R | PT100 50 °C → yaklaşık 119.397 Ω → 12 mA | Sıcaklık ve 4/20 mA ölçek sınırları |
| ORDEL HMT-T | K tipi 400 °C → 12 mA | TC tipi, sıcaklık ve ölçek sınırları |
| ENDA ET4420 | 25 °C ölçüm, 100 °C ayar; ısıtma açık | PT100 sıcaklığını 105 °C yapınca röle ve lamba kapanır |
| Baykon TX11 | 250 kg → 2.5 mV → 8 mA | Yük, kapasite, sıfır ve çıkış türü |
| UNI-T UT33D+ | DC 200 V kademesinde 24 V | Simülasyonda probları terminalden ayırın veya taşıyın |
| Işıklı buton | Buton ışığı açık; H1 yalnız basılıyken açık | X1/X2 lamba beslemesini kontak devresinden bağımsız kurun |

Besleme kesildiğinde aktif dönüştürücülerin çıkışları kapanır. PT100, PTC ve
NTC üzerinde sıcaklığa karşı direnç; termokuplda sıcaklık ve soğuk nokta
değerine karşı mV gösterilir. Termokupl türleri K/J/T/E/N/B/R/S için sayısal
eğriler bulunur. Türlerin sıcaklık sınırları birbirinden farklıdır.

## Cihazları kullanma

- **HT-2:** Sağdaki özelliklerden T, RH veya ikisini gösterin; çıkışı 4–20 mA,
  0–20 mA, 0–10 V veya 2–10 V seçin. Bu seçimler eğitim modelinin seçenekleridir;
  farklı gerçek ürünlerin donanım seçenekleri aynı kabul edilmemelidir.
- **HMT-R:** PT100 uçları 4–5, iki telli bağlantı köprüsü 5–6. Döngü
  besleme (+) → 2; 1 → ampermetre → besleme (−). **HMT-T:** TC 4(+)/5(−).
  Sensör seçimi donanım türünü ve üst görünüş yönünü değiştirir.
- **WAZ5:** 2(+)/3(−) gerilim girişi; 7(+)/8(−) akım çıkışı; 4/5 veya 10/11
  üzerinden 24 VDC besleme. 8540300000 modelinin dönüşümü 0–10 V → 4–20 mA'dir.
  Buradaki NC yazısı kullanılmayan terminali belirtir.
- **ENDA:** PT100 9–10 ve 8–9 köprüsü; TC 9(+)/10(−); besleme 11/12;
  SSR 4/5; DIN 6/7; ana röle 13 NC, 14 COM, 15 NO; alarm 16/17.
  Özelliklerde aç/kapa, PID, histerezis, alarm, filtre, ikinci ayar, elle güç,
  SSR, DIN işlevleri ve menü kilidi bulunur. Menü izinlerini değiştirmek için
  S.Cod 442; fabrika ayarı için S.Cod 0 kullanılır. Ön yüz tuşları da kilide uyar.
- **UT33D+:** Döner anahtarın çevresine tıklayarak kademe seçin; HOLD ve ışık
  düğmelerini kullanın. Cihaz eklendiğinde iki kablolu prob da gelir. Simülasyonda
  prob gövdesini tutup bir terminale yaklaştırınca temas eder; uzaklaştırınca
  temas kesilir. Kablo probu takip eder. Esc hareketi geri alır. NCV konumunda
  cihazın üst kısmını enerjili AC terminaline yaklaştırın. Yanlış yuva, enerjili
  direnç ölçümü ve paralel akım ölçümü için uyarı gösterilir.
- **TX11:** EX+/EX− uyartım, S+/S− loadcell sinyali, I/V/G analog çıkış
  uçlarıdır. kg ve analog değer kutuları simülasyon göstergesidir; gerçek TX11
  üzerinde LCD bulunduğu anlamına gelmez.

## Kütüphane ve görseller

- İstenen eski/tekrarlanan kayıtlar yeni ekleme listesinden kaldırıldı;
  eski projelerin açılabilmesi için tanımları saklandı. Röle ve mA/V Sinyal
  Dönüştürücü adları düzenlendi.
- Geçiş klemensinde 1–12 bağımsız sıra; ek noktasında 2–12 çıkış seçilebilir.
  Kablolu bir sıra yanlışlıkla kaldırılamaz. Sayı seçenekleri kartları çoğaltmaz.
- Işıklı butona bağımsız X1/X2 uçları eklendi. Lamba rengi değiştirilebilir.
  Seçici butonda ön kolun 90° hareketi kullanılır.
- Tense TTK-12.5-400V görünüşü ve üst bağlantıları eklendi.
- v1.14'teki 146 belgeli PLC kaydının gövdesi özgün aile ürün fotoğrafından
  alınan ön yüz uyarlamasını kullanır. Ön yüz perspektifi SVG ile düzeltilir;
  modele özgü bağlantı katmanı ayrıca çizilir. Kütüphane ve projede aynı çizici
  kullanılır. DVP-SE alt yüz bağlantıları ayrı, başlıklı şeritte kalır.

## Açık kalan sınırlar

**Bütün modellerin birebir ürün fotoğrafları tamamlanmış değildir.** PLC
fotoğraflarında röle/transistör veya kanal sayısı farklı varyantlar aynı aile
fotoğrafını kullanabilir; kartta “Aile / varyant görseli” yazması bu nedenledir.
Fotoğrafın üzerindeki baskıyla ayrı terminal katmanının konumu her modelde
birebir örtüşmez. Önceki 146 kayıt dışındaki PLC ailelerinin mevcut görünüşleri
korunur. PLC programı yürütülmez; PLC içeren devreler simüle edilmez.

Gentek, ORDEL, WAZ5, ENDA ve Baykon için önceki paylaşılan çalışmadan alınan
ön görünüş uyarlamaları kullanıldı. Bunların tamamı doğrulanmış ham üretici
fotoğrafı olarak sunulmamaktadır. Görsel ve teknik kaynaklar ayrı dosyadadır.

ENDA kontrolü eğitim amaçlı bir davranış modelidir; gerçek cihaz firmware'inin
birebir kopyası değildir. PID ve otomatik ayar modellenmiştir; haberleşme yoktur.
DIN 43710 L tipi için doğrulanmış sayısal eğri eklenmediğinden bu seçim pasiftir.
Gerçek bir termal proses kendiliğinden oluşturulmaz; sensör sıcaklığı ayrıca
değiştirilir. Akım/gerilim modeli ağırlıkla dirençli, durağan devreler içindir;
reaktif geçici rejim ve gerçek cihaz doğruluk sınıfı hesabı yapmaz. Analog akım
çıkışlarının açık devre gerilimi eğitim modelinde 24 V ile sınırlandırılır.

## Doğrulama

188 otomatik testin tamamı geçti. Ölçüm sonuçları, bağlantı kimlikleri,
örnek devreler, prob sürükleme, kaydetme/yeniden açma ve önceki düzenleme
işlevleri kapsandı. Örnek cihazlar gerçek SVG çizicisinden görüntülenerek
incelendi. Bu oturumda Windows üzerinde Chrome/Edge çalıştırılmadı;
DOM olay testleri tarayıcı yerleşim testinin yerine geçmez.

Kayıt: `DOGRULAMA_v1.15.0.json` ve `final-v115-all.txt`.
