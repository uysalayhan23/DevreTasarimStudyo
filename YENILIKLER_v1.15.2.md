# Devre Tasarım Stüdyosu v1.15.2

Bu paket tek başına, çevrimdışı çalışır. ZIP'i tamamen çıkarın ve `BASLAT.bat` dosyasını çalıştırın. Başlıkta v1.15.2 görünmelidir.

## Tartım göstergesi ve yük hücresi

- BAYKON TX11: Özellikler bölümünden 0–10 V seçildiğinde **V (+) ve G (−)** terminallerinden gerilim ölçülür. T–R uçlarına fiziksel köprü bağlamak da gerilim çıkışını seçer. Akım çıkışı için 4–20 mA seçin ve dış T–R köprüsünü kaldırın; **I (+) / G (−)** uçlarını kullanın.
- Besleme ve yük hücresinin dört bağlantısı tamamlanmadan çıkış oluşmaz. Kalibrasyon ve yük değeri çıkışa etki eder.
- TX11 EX+/EX−/S+/S− ile Kobastar SB2 EX+/EX−/SIG+/SIG− hatlarında renkler serbesttir. Aynı renk başka bir güç hattında kullanılıyor olsa bile bu sinyal kablolarında seçilebilir. Klemens üzerinden geçerken de bu özellik korunur.
- Tartım göstergesinin terminal kabloları 3D ürün görselinin üzerinde çizilir. Üstteki iki terminal sırasının kablo çıkışları ayrı aralıklardan geçer. Ölçüm probları en üst katmanda kalır.

## Kablo renkleri

- Yan menüde 20 hazır renk bulunur; beyaz kablo koyu kenarla görünür tutulur.
- Rengi seçip **Rengin hattı** ve **Gerilim / kullanım** seçeneklerini ayarlayın. Kullanılan bir rengi başka hatta ayırırsanız eski hattın kabloları uygun başka renge geçirilir; gerçek elektriksel bağlantı ve hat kimliği değişmez.
- Gerilim/kullanım seçimi bir kablo etiketidir. Simülasyondaki gerçek gerilimi besleme ve devre belirler.
- Farklı besleme hatlarını doğrudan birleştirme koruması korunur. Serbest EX/SIG renkleri ve ölçüm probu renkleri genel renk kilidi oluşturmaz.
- PNP sensörlerin çıkış kabloları pozitif, NPN çıkışları negatif hat rengini alır. Sensör çıkışının iletmesi için besleme ve algılama koşulları gerekir.

## UNI-T ölçü aleti

- Bir prob aynı anda yalnızca bir yuvaya bağlanır. 10A ve VΩmA girişlerine aynı anda ikinci bağlantı kurma engellenir.
- Ölçü aletini seçip **Kırmızı prob yuvası** menüsünden mevcut kabloyu VΩmA veya 10A girişine taşıyabilirsiniz. Yeni bir kablo oluşturulmaz.
- Eski projelerde aynı probdan aynı ölçü aletinin birden fazla girişine çizilmiş kablolar açılışta tek bağlantıya indirilir; seçili kademeye uygun giriş korunur. Asıl proje dosyası ancak Kaydet dediğinizde değişir.
- mA, mV, kΩ ve MΩ kademeleri doğru birim ölçeğinde gösterilir: **20.000 mA**, **5.000 mV**, **5.000 MΩ** gibi. Kademe değişimi eski HOLD değerini temizler.
- Esnek kırmızı/siyah kablolar, canlı prob hareketi ve kablo üzerinden ölçüm korunur.

## Hazır denemeler

`Ornekler` klasöründeki aşağıdaki dosyaları açıp 3D görünümde simülasyonu başlatın:

| Dosya | Başlangıç ölçümü |
|---|---|
| TX11_0_10V_Prob_Olcumu_v1.15.2.odsdevre | 500 kg → 5.00 V |
| TX11_4_20mA_Prob_Olcumu_v1.15.2.odsdevre | 1000 kg → 20.000 mA |

Yük hücresinin yükünü değiştirerek çıkışı izleyebilirsiniz. Gerilim paralel, akım seri ölçülür; örnek akım devresinde dönüş yolu ölçü aleti üzerinden tamamlanır.

## Doğrulama

Test sonuçları `DOGRULAMA_v1.15.2.json` ve `final-v1152-all.txt` dosyalarındadır. Gerçek uygulama olayları ve sayısal devre sonuçları otomatik olarak; SVG görünümü ayrıca görsel olarak kontrol edildi. Bu ortamda Windows Chrome/Edge üzerinde doğrudan çalıştırma yapılmadı. Önceki sürümün basitleştirilmiş eğitim simülasyonu korunur.
