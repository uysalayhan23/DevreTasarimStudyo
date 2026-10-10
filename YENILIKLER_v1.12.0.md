# v1.12.0 — NTC, PT100 ve Kobastar SB2

ZIP'i yeni klasöre çıkarıp `BASLAT.bat` dosyasını açın. Dashboard'da **NTC ve sıcaklık probları** ile **Kobastar SB2 yük hücresi** örnekleri bulunur.

## NTC

Sensörün sağındaki turuncu sıcaklık çubuğunu fareyle yukarı/aşağı sürükleyin. Sıcaklık −50…150°C arasında değişir; yanında sıcaklık, altında küçük kutuda Ω değeri görünür. 25°C'de 10 kΩ, B=3950 K eğitim modeli korunmuştur. Sıcaklık arttıkça direnç azalır. Sağ menüdeki sıcaklık alanı aynı değeri kontrol eder. Çubuk odaklıyken ok tuşlarıyla da ayarlanabilir.

## PT100

PT100'ün 2, 3 ve 4 telli modelleri ile termokupl tek ortak fotoğraf çizim yolunu kullanır. Üç telli PT100'ün A, B1 ve B2 terminalleri, konumları ve elektriksel bağlantı mantığı korunmuştur. Kaydedilmiş kabloların terminal kimlikleri değişmedi.

## Yük hücresi

Kobastar SB2 ürün fotoğrafı kullanılır. Lamanın serbest ucundaki turuncu oka bir kez basmak kapasitenin %1'i kadar yük ekler. Basılı tutmak yükü artırmaya devam eder. Aşağı sürüklemek artırır, yukarı sürüklemek azaltır. Fare bırakılınca uygulanan ağırlık korunur. Sağ menüde **Yükü kaldır** düğmesi ağırlığı sıfırlar. Kapasite 100, 200, 500, 1000, 2000 veya 5000 kg seçilebilir; yük 0–kapasite aralığında tutulur.

Alt kutuda kilogram ve **SIG+ − SIG−** fark gerilimi gösterilir. Simülasyonda EX+ ve EX− uçları beslenmeden mV çıkışı oluşmaz. Kütüphanedeki **Yük Hücresi Beslemesi · 10 VDC** elemanı 5–15 V arasında ayarlanabilir. Örnek devrede bu kaynak ve SIG uçlarına bağlı voltmetre hazırdır. Voltmetre gerçek bağlı terminallerden fark gerilimini okur; ölçüm uçlarını ters bağlamak işareti değiştirir.

Üretici nominal hassasiyeti 2 mV/V olduğundan kullanılan ilişki:

`SIG farkı (mV) = 2 (mV/V) × uyartım (V) × ağırlık (kg) / kapasite (kg)`

1000 kg kapasiteli hücreye 10 V uygulandığında:

| Ağırlık | SIG+ − SIG− |
|---:|---:|
| 0 kg | 0 mV |
| 250 kg | 5 mV |
| 500 kg | 10 mV |
| 1000 kg | 20 mV |

5 V beslemede aynı yük için çıkış yarıya iner. Üreticinin 15 V azami uyartım sınırını aşan besleme geçersiz gösterilir; 24 V kaynağını doğrudan EX uçlarına bağlamak çıkış üretmez. Simülasyon dururken kutu **Önizleme: 10 V uyartım** varsayımını açıkça belirtir.

Bu, nominal doğrusal ve yüksüz ölçüm modelidir. Sıfır balans hatası, ısıl sapma, histerezis, kablo direnci ve 350 Ω çıkış direncinin ölçü cihazıyla yüklenmesi modellenmez. Ağırlık ve sıcaklık ayarları kaydetme/yeniden açma ve geri alma işlemlerinde korunur.

## Kaynak

[Kobastar SB2 ürün sayfası](https://kobastar.com/tr/product-details/sb2-lama-tip-paslanmaz-load-cell/): 2,00 ±0,005 mV/V nominal hassasiyet; önerilen 10 VDC, azami 15 VDC; 0,1–5 ton kapasite seçenekleri. Yukarıdaki tablo bu nominal değerlerden hesaplandı.

[Kullanılan ürün fotoğrafı](https://kobastar.com/wp-content/uploads/2026/02/KOBASTAR-SB2-700x350.webp), paket yolu: `dist/assets/products/kobastar-sb2-v112.webp`. Fotoğraf düzenlenmeden, hareketli ok ayrı SVG öğesi olarak eklenmiştir.
