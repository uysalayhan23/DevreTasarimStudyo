# Devre Tasarım Stüdyosu v1.9.0

ZIP'i yeni bir klasöre tamamen çıkarın ve **BASLAT.bat** dosyasını açın. Kurulum ve internet gerekmez. Önceki projeler `.odsdevre` dosyalarıyla açılabilir.

## Pano

- 14 hazır renk, ayrıca seçilen kablo için serbest renk seçici ve 0,25–240 mm² kesit girişi.
- Renk ve kesit kabloya özeldir; elektriksel hat kimliği renk değişince değişmez. Aynı hatta farklı renk ve kesitler kullanılabilir.
- Kabloyu seçince çıkan tutamaçlarla güzergâhı sürükleyin. Uç bağlantıları korunur. Otomatik güzergâha dönebilirsiniz.
- Kablo kanalını seçip **Kanal kapağını kapat/aç** düğmesini kullanın. Kapak alttaki kabloları gizler, bağlantıları silmez.
- Kütüphaneden **Kablo Giriş Rekoru** ve **Kablo Spirali** ekleyin. Kabloyu seçip aksesuarı belirleyin ve **İçinden geçir** düğmesine basın. Aksesuarı taşıyınca kablo güzergâhı onu izler. Güzergâhı elle sürüklemek aksesuar takibini kaldırır.
- Besleme malzemesinin montaj yeri **Pano dışı besleme** olabilir. Pano çevresinde 180 mm dış alan kullanılabilir.

## Sensörler

- Aktif dijital sensörler ve iki aktif analog sensör 24 VDC ile çalışır. Dijital sensörlerde PNP/NPN seçilebilir.
- Besleme uçlarına AC bağlantısı çizim sırasında reddedilir; içe aktarılan uygunsuz beslemelerde çıkış devreye girmez.
- 24 V uçları ters bağlanıp simülasyon başlatılırsa alev/patlama gösterimi ve uyarı çıkar; sensör ve ona bağlı kablolar silinir. Geri al geçmişinden de arızalı sensör kaldırılır; yeni sensör eklemek gerekir.
- Analog seviye sensöründe Setateknik ürün görselinin şamandırası sürüklenir. En alt/orta/üst: **4/12/20 mA** veya **0/5/10 V**. Sağ menüden çıkış türünü seçin.
- Doğrusal Konum Sensörü – Lineer Potansiyometre: hareketli çubuk, 0–10 V sayısal gösterge ve hareketli şema sürgüsü.
- NTC, PTC ve termokuplda sıcaklık değiştirilebilir; direnç/gerilim değeri gösterilir. NTC, PTC ve termokupl ürün fotoğrafları eklendi.
- NTC: örnek 10 kΩ/B3950 modeli. PTC: örnek 1 kΩ artan eğri. Termokupl: 25 °C referanslı yaklaşık 41 µV/°C modeli. Bunlar ürün kalibrasyon tabloları değildir. Pasif sıcaklık elemanları 24 V ile beslenen dijital sensörlerden ayrıdır.
- Analog değerler sensör üzerinde hesaplanıp gösterilir; bu sürüm genel analog devre çözücüsü veya PLC analog giriş yürütücüsü içermez.

## Röleler

- Gecikmeli kontak kütüphanede tek giriş altında: sağ menüden çekmede/bırakmada gecikme, NO/NC ve süre seçimi. Eski ayrı tipler eski dosyaların açılması için saklanır.
- Zaman rölesi bobinleri saniye/dakika ile gerçek geçen süreyi kullanır.
- Darbe rölesi her yeni yükselen darbede durum değiştirir; buton bırakılınca durumunu korur.
- Flaşör rölesi ayarlanan aralıklarla açılıp kapanır.
- Darbe/flaşör ve mevcut koruma elemanları eklenirken bağlı yardımcı kontak oluşturulur. Şemada ayrı taşınır; malzeme görünümünde gövde üstündeki terminallere taşınır. Şemaya dönünce önceki konumunu hatırlar. Uç kimlikleri ve kablolar korunur.
- Darbe/flaşör görselleri Finder belgelerinden önden görünüme uyarlanmıştır; üretici fotoğrafının birebir kopyası olarak sunulmaz.
- SSR üzerinde INPUT/OUTPUT, 3+/4− kontrol ve 1/2 yük terminalleri gösterilir. Fotek SSR-40DA fotoğrafıyla terminal konumları eşleştirildi. Simülasyon, kutba duyarlı 3–32 VDC girişli ideal izole anahtar modelidir; sıfır geçişi, kaçak akım, ısınma ve AC yük elektroniğini ayrıntılı çözmez.

## Henüz tamamlanmayan belgeye bağlı istekler

**mkş.pdf, aar.pdf ve gkr.pdf mevcut klasörlerde bulunamadı.** Bu nedenle motor koruma şalterinin son sayfa sembolü, aşırı akım rölesinin istenen 1–3–5 / 2–4–6 ve test/reset içermeyen belgeye özel gövdesi, aşırı gerilim rölesinin belgeye göre ana uçları ve açma eşikleri tamamlanmadı. Bu üç öğenin mevcut modeli geçerlidir; PDF'ye birebir uygun oldukları iddia edilmez. Gerilim rölesine açıkça istenen **3 COM / 1 NO / 2 NC** değiştirici yardımcı kontak eklendi; ana rölenin belgeye özgü ölçüm davranışı hâlâ bekliyor.

## Örnekler

`Ornekler` klasöründe v1.9 adını taşıyan altı dosya vardır: darbe rölesi, flaşör, çekmede gecikme, bırakmada gecikme, 24 V analog sensörler ve rekor/kanal kapağı/spiral panosu. **Aç** düğmesiyle yükleyin.

Kaynak ve görsel üretim bilgileri: `GORSEL_KAYNAKLARI_v1.9.0.md`. Test özeti: `DOGRULAMA_v1.9.0.json`.
