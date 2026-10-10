# Devre Tasarım Stüdyosu v1.13.0

- Reed NO/NC takımları: Erpilsan MR-228B fotoğrafındaki kablolu gövde ve kablosuz mıknatıs ayrıldı. Mıknatısı fareyle yaklaştırıp uzaklaştırın; bağlı devrede kontak durumu değişir. Konum, ölçek ve dönüşle uyumlu olarak kaydedilir; geri alma ve sürüklemeyi iptal etme desteklenir.
- MR-228B asıl ürün NO'dur. NC kütüphane seçeneği aynı gövdeyi kullanan eğitim varyantıdır. Varsayılan 10 mm eşik eğitim ayarıdır; üreticinin doğrulanmış algılama mesafesi olarak sunulmaz. Sağ menüden mesafe, eşik, algılama yönü ve otomatik hareket değiştirilebilir. Reed kuru kontak olduğundan ayrı sensör beslemesi gerekmez.
- Otomatik sigorta/devre kesicilerde 1P/2P/3P Siemens 5SL6116-7, 5SL6216-7, 5SL6316-7 üretici fotoğrafları kullanılır. Tek kutuplu ayırıcı Siemens 5TL1163-0, üç kutuplu termik-manyetik Siemens 3RV2011-1JA10 fotoğrafını kullanır. 1P termik-manyetik için tek kutuplu Siemens 5SL fotoğrafı kullanılır. Üretici fotoğrafları yerel olarak saklanır; mandal/kol hareketleri SVG katmanlarıdır. Mevcut bağlantı ve kontak işlevleri korunur; fotoğraf değişimi fiziksel koruma eğrisi modeli eklemez.
- Mekanik kilitleme, mekanik kumanda ve NO/NC sınır anahtarlarında istenen SEM 121 fotoğrafı kullanılır. Makaralı kol gövdeden bağımsız 90° sağa döner.
- Sigortalı klemens gruplarında 40 birim hatve, 38 birim gövde genişliği: arada yalnız 2 birim boşluk kalır. 1–6 klemens seçimi, ayrı açma/kapama ve terminal kimlikleri korunur.
- NTC sıcaklık çubuğu ve Ω göstergesi, termokupla aynı PT100 görseli ve mevcut terminalleri, Kobastar SB2 yük oku/kg/mV davranışı korunmuştur.

## Kullanım

ZIP'i yeni bir klasöre tamamen çıkarıp `BASLAT.bat` dosyasını çalıştırın. Başlıkta v1.13.0 görünmelidir. Başlangıç sayfasındaki **Reed mıknatıs takımı** ve **Siemens ve mekanik görseller** örnekleri yeni işlevleri gösterir. Önceki **NTC ve sıcaklık probları** ile **Kobastar SB2 yük hücresi** örnekleri de pakettedir.

SB2 nominal modeli: `mV = 2 × uyartım(V) × yük / kapasite`. Örneğin 10 V uyartım, 1000 kg kapasite ve 500 kg yükte SIG+ / SIG− farkı 10 mV olur. Sensörün yayınlanan nominal duyarlılığı 2 mV/V'dir. [Kobastar teknik özellikleri](https://kobastar.com/tr/product-details/sb2-lama-tip-paslanmaz-load-cell/).

Reed davranışı, yakın mıknatısın kontağı çalıştırması ve mıknatıs uzaklaşınca normal durumuna dönmesi ilkesine dayanır. [Deeter çalışma prensibi](https://www.deeterelectronics.com/reed-switch-how-it-works/).

Fotoğraf kaynakları `GORSEL_KAYNAKLARI_v1.13.0.md`, otomatik test ve tarayıcı doğrulamaları `DOGRULAMA_v1.13.0.json` dosyasındadır.
