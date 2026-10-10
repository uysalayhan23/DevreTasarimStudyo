# v1.10 görsel kaynakları

Erişim: 17 Eylül 2026. Yeni kaynak görselleri yerel pakete alınmıştır; çalışma sırasında internet kullanılmaz.

| Eleman | Kaynak | Uygulama |
|---|---|---|
| Ultrasonik sensör | [Wenglor U1KT003](https://www.wenglor.com/tr/Sensorler/Ultrasonik-Sensorler/Ultrasonik-mesafe-sensorleri/Mesafe-sensoru/p/U1KT003) | Gerçek ürün görselinin sensör gövdesi; mesafe/yankı eğitim modeli. |
| Ultrasonik prensip | [Robotistan](https://maker.robotistan.com/ultrasonic-sensor/) | Gidiş–dönüş süresinden uzaklık prensibi; ürün aralığı Wenglor verisidir. |
| Termik röle ve NC/NO | [Elektrik Dükkanı](https://www.elektrikdukani.com/siemens-3ua59-16-250a-termik-role3ru2116-1cb1) | Galerinin ikinci fotoğrafı; yeniden üretilmedi. 95–96 ve 97–98 fiziksel vida konumları. |
| DC röle | [PT570110](https://www.dostlarelektrik.com/pt570110-schrack.html) | Referans fotoğraf. |
| Röle soketi | [PT78730](https://tumpaelektrik.com/diger-roleler/siemens-lzspt78730-schrack-endustri-rolesi-pt-soket) | İki referanstan imagegen ile önden temsili montaj; yalnız A1/A2 kullanılır. Fiziksel ürün uyumsuzluğu sürüm notlarında açıklanmıştır. |
| Çekmede gecikme | [Tense ERV-03](https://tense.com.tr/tr/urunler/cekmede-gecikmeli-zaman-rolesi-erv-03/) | imagegen ile önden görünüm uyarlaması. |
| Bırakmada gecikme | [Tense ERV-DG](https://tense.com.tr/tr/urunler/dusmede-gecikmeli-zaman-rolesi-erv-dg/) | imagegen ile önden görünüm uyarlaması. |
| Kalıcı mandal | [Schneider XB5AD33](https://www.krcelektromarket.com/schneider-xb5ad33-mandal-buton-kalici-1-0-2-1na1na) | Önden üretilmiş gövde ve bağımsız döndürülen mandal; 0/1 eğitim davranışı. |
| Çok kademeli seçici | [Fiorsan / Metop](https://fiorsanelektrik.com/urun/8-kademeli-trifaze-pako-salter-3x20-amper/) | imagegen ile üretilmiş turkuaz kumanda; çerçeve ve değişken kademe rakamları SVG. |
| Aç–kapa / paket şalter | [Metop MT019](https://www.krcelektromarket.com/metop-mt019-3x10a-ackapa-pako-salter) | Benzer turkuaz ön yüz, 0/1 konumlu ortak şalter görseli; ayrı NO kutupları. |

Üretilen beş PNG, `dist/assets/products/*-v110.png` içindedir. Üretimde kullanılan tam istemler ve referans dosyaları `GORSEL_URETIM_ISTEMLERI_v1.10.0.json` dosyasında saklanmıştır. İstemlerde “transparent” istenmesine rağmen üretilen zaman rölelerinde kenar halesi bulunduğu için SVG dış hat kırpması uygulanmıştır. Dönen parça ayrımı SVG clipPath/mask ile yapılır; kaynak rasterlar değiştirilmez.

Son Schrack düzeltmesi `GORSEL_SCHRACK_DUZELTME_v1.10.0.json` istemiyle yapılmıştır. Kullanıcının tarif ettiği 4 NO / 4 NC / A2–A1 / 4 COM sırası ve terminal numaraları görsele işlendi. Üretilen dama desenli arka plan SVG dış hat kırpmasıyla gizlendi. Bu 14 terminalli görsel, bağlantısı verilen 11 pinli soketin birebir fotoğrafı değil, istenen dört kutuplu düzenin temsili uyarlamasıdır.

Termik ikinci fotoğrafın tam çözünürlük bağlantısı: [galeri resmi](https://cdn.qukasoft.com/f/193115/cG96WmFtNG0vcUp3SzJGdEg4MXZKZWxESUE9PQ/p/siemens-3ua59-16-250a-termik-role-3ru2116-1cb1--79425971-sw331sh332.webp).

Görseller kullanıcı tarafından belirtilen kaynaklardan kişisel eğitim projesi için alınmıştır. Ürün markaları ve özgün fotoğraflar ilgili sahiplerine aittir; bu kaynak kaydı yeniden dağıtım lisansı vermez.
