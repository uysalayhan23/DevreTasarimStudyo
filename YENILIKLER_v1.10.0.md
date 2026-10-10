# Devre Tasarım Stüdyosu 1.10.0

17 Eylül 2026

- Analog seviye şamandırası ve doğrusal konum çubuğu ürün görseli üzerinde sürüklenebilir. Seviye çıkışı 4–20 mA veya 0–10 V, doğrusal potansiyometre 0–10 V olarak konumla değişir. Şema görünümünde de sürükleme denetimleri vardır.
- Ultrasonik sensör Wenglor U1KT003 ürün görselini kullanır. Anahtarlama modelinde 30–400 mm aralık, kör bölge, hedef uzaklığı ve yankı süresi gösterilir. Analog eğitim uyarlamasında hareketli hedef 4–20 mA / 0–10 V çıkışını değiştirir.
- Termik röle, istenen sayfanın ikinci fotoğrafıdır. NC kontak 95–96, NO kontak 97–98 vidalarına yerleştirilir. Yardımcı kontak görünüm değiştirirken ana gövdeye oturur; kablo bağlantıları korunur.
- DC bobinde röle ve soket birleştirilmiş önden görünüm kullanılır. Üst sıra NO (14/24/34/44), ikinci sıra NC (12/22/32/42), bobinin altında A2/A1 ve en altta COM (11/21/31/41) vidaları bulunur. İstendiği gibi bobin kaydında yalnız A1 ve A2 elektriksel bağlantı noktasıdır; diğer sıralar görsel terminal düzenidir.
- Çekmede ve bırakmada gecikmeli bobinlerde Tense ERV-03 ve ERV-DG referanslarından hazırlanmış önden görünümler vardır.
- Jog butonu başlangıç butonuyla aynı gövdeyi kullanır; NO/NC çiftleri üst ve alt dört terminaldedir. Rengi özelliklerden seçilir.
- Kalıcı butonun beyaz çizgili mandalı etkinleşince 45° döner.
- 1, 2 ve 3 çıkışlı seçiciler ayrı kütüphane kayıtlarıdır. Kademe sayısı 1–12 arasında ayarlanır. Numaralar ve çıkış uçları birlikte değişir. Simülasyonda 0 → 1 → … → N → 0 döngüsü izlenir; yalnız seçilen NO çıkışı COM'a bağlanır. Bağlı bir çıkış kaldırılmadan önce kablosu ayrılmalıdır.
- Aç–kapa şalterleri ve üç fazlı paket şalter ortak, izometrik olmayan görünümdedir. 1–2, 3–4, 5–6 çiftleri birbirinden yalıtılmış NO kontaklardır.
- Lambaların, LED'lerin ve flaşörlü uyarıcıların rengi değiştirilebilir.
- Flaşör ve flaşörlü ikaz lambasında yanma/sönme süreleri ayrı ayrı, saniye olarak ayarlanır. Enerji kesilince söner; yeniden enerji verilince çevrim baştan başlar.
- Hoparlör, buzzer, ihbar/alarm ve siren etkinleşince çevrimdışı Web Audio sesi üretir. Güç kesilmesi, simülasyonun durdurulması, sessize alma ve arka plana geçiş sesi keser.

## Deneme

ZIP'i yeni bir klasöre tamamen çıkarıp `BASLAT.bat` dosyasını açın. Dashboard üzerindeki dört yeni örnek düğmesiyle özellikleri deneyebilirsiniz. Aynı örnekler `Ornekler` klasöründe `.odsdevre` dosyaları olarak bulunur.

Analog örnekte **Simüle et** düğmesine basın ve şamandırayı/çubuğu sürükleyin. Sesli uyarı örneğinde her cihazın üzerindeki kalıcı mandal kendi devresini açıp kapatır. Ses için üst çubuktaki **Ses açık** seçeneğini kullanın.

## Model kapsamı

U1KT003 gerçek üründe iki anahtarlama çıkışına ve IO-Link'e sahiptir; analog çıkışlı model değildir. Programdaki analog sürümü eğitim uyarlamasıdır. Uzaklık–yankı hesabında yaklaşık 343 m/s ses hızı kullanılır; ortam sıcaklığı ve yüzey fiziği çözülmez. Mevcut 24 V sensör besleme kuralı korunur.

PT570110 (110 VDC, dört kontak grubu) ve PT78730 (üç kontak grubu, 11 pin) gerçek donanımda eşleşen bir takım değildir. Son kullanıcı tarifi doğrultusunda soket görseli 4 NO + 4 NC + 2 bobin + 4 COM olmak üzere 14 terminalli temsili bir düzen olarak hazırlanmıştır; PT78730'un birebir kopyası değildir. Ürün fotoğraflarındaki gerçek gerilim ve süre işaretleri, programın genel eğitim zamanlayıcısının sınırlarını değiştirmez.

Analog çıkış değeri sensörün sayısal modelinde ve üzerindeki göstergede hesaplanır. Bu sürüm genel bir analog devre çözücüsü veya PLC analog giriş dönüştürücüsü içermez. Önceki sürümün diğer eğitim modeli sınırları devam eder.
