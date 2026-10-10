# Devre Tasarım Stüdyosu v1.18.0

ZIP dosyasını yeni bir klasöre tamamen çıkarın ve **BASLAT.bat** dosyasını açın. Paket tek başına çalışır; önceki sürümü kurmanız gerekmez. Kendi proje dosyalarınızı **Aç** ile kullanabilirsiniz.

## Simülasyonda temas uyarısı

Kabloya, terminale veya kablo ek noktasına doğrudan dokunulduğunda çarpılma uyarısı açılır. **Simülasyon otomatik durmaz.** Uyarıyı kapatınca çalışmaya devam eder; sonraki her temasta yeniden uyarır. Açılış mesajındaki “Bir daha gösterme” tercihi bu uyarıyı kapatmaz.

Bağlantı eklemek, silmek veya yerleşimi değiştirmek için üst çubuktan **Simülasyonu Durdur** düğmesine basın. Çalışırken cihaz seçme, buton/şalter kullanma, sürücü kumandaları, sensör hedefleri ve izole ölçüm probları mevcut davranışlarını korur.

## Hazır örneklerin korunması

Dashboarddaki ve bu paketin `Ornekler` / `Kaydedilen_Projeler` klasörlerindeki hazır örnekler **salt okunur** açılır. İnceleme, yakınlaştırma ve simülasyon kullanılabilir; düzenleme girişiminde açıklama ve **Farklı Kaydet** seçeneği gösterilir.

- Başarıyla kaydedilen kopya yeni proje kimliğiyle açılır ve düzenlenebilir.
- Kaydetme iptal edilirse veya yazma başarısız olursa özgün örnek kilitli kalır.
- Uygulama, Farklı Kaydet sırasında başka bir korunan örneğin üzerine yazılmasını da engeller.
- Tarayıcı dosya kaydetme penceresini desteklemiyorsa kopya indirilir. İndirdiğiniz kopyayı **Dosyadan Aç** ile açın; özgün örnek açıkken düzenleme izni verilmez.
- Hazır örnekteki geçici simülasyon durumları durdurulduğunda başlangıç durumuna döner. Farklı Kaydet, örneğin başlangıç devresini kopyalar.

Koruma uygulama içindeki işlemler içindir; Windows dosya izinlerini değiştirmez. Kullanıcının kendi projeleri salt okunur yapılmaz.

## Semboller ve malzeme görselleri

**Tesisat ve Dağıtım Devreleri Tasarımı** alanındaki kütüphaneyi kullanın. Favoriler mevcut şekilde çalışır.

| Eleman | Değişiklik |
|---|---|
| Komütatör | Gönderilen çift kontaklı açık şema; iki tuş ayrı ayrı kumanda edilir. |
| Ara vaviyen / permütatör | Daire içindeki dört uç ve çapraz yollar; kesişimde elektriksel birleşim yoktur. Konuma göre çapraz/düz bağlantı gösterilir. |
| Elektronik zil | Kitap sayfa 142'deki iki üst uçlu açık şema ve beyaz elektronik zil gövdesi. |
| Zil butonu, light buton | Sayfa 142 açık şemaları; momentary kontak ve ürün biçiminden uyarlanan malzeme çizimleri. |
| İkili zil butonu | Ayrı ayrı basılan iki bağımsız kontak. Ortak besleme istenirse devrede kabloyla köprülenir. |
| Kapı otomatiği | K.O. açık şeması; enerjilenince hareket eden kilit dili. |
| Bir fazlı fiş | FAR yassı topraksız fiş referansından iki kutuplu çizim. Eski PE bağlantılı fişler ayrı topraklı varyanta taşınır. |
| E27 duy | Muhafazalı duy, bağlantı kablosu ve tavan rozansı. |
| Data / telefon / TV prizi | RJ45 Cat6, RJ11 Cat3 ve TV–SAT bağlantı ağızları; mevcut beyaz çerçeveli kütüphaneye uyumlu çizimler. |

Yeni zil grubu **Zil ve kapı otomatiği** altında bulunur. İstenmeyen sigorta, buat ek yeri, besleme, zil trafosu ve diyafon türleri bu gruba eklenmedi; önceki kütüphane kayıtları korundu.

Gönderilen semboller seçili TSE/IEC/ANSI kütüphanelerinde aynı kullanıcı referansı olarak gösterilir. Bunlar için ayrıca ANSI standardına uygunluk iddiası yapılmaz. Görseller fotoğraf veya üretici CAD modeli değil, ürün biçimlerinden uyarlanmış yerel SVG çizimleridir; çevrimdışı ve beyaz arka zemin olmadan çalışır.

Kaynaklar: **GORSEL_KAYNAKLARI_v1.18.0.md**. Önceki ACS800, V20, pano kablolama ve kablo güzergâhı özellikleri korunur.
