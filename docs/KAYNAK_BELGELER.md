# Teknik ve görsel kaynakların konumu

İlk GitHub aktarımı **son çalışan v1.18.0 dağıtım paketinin bütün içeriğini** korur. Bu paket geçmiş sohbete yüklenen her PDF'nin bir arşivi değildir. Eksik PDF varmış gibi bağlantı üretmeyin; yeniden inceleme gerekiyorsa gerçek dosyayı kullanıcıdan veya doğrulanmış üretici kaynağından alın.

## Depoda bulunan dayanaklar

| Dosya / klasör | İçerik |
| --- | --- |
| `Belgeler/ABB_ACS800_HW_RevF.pdf` | ABB 3AFE68372984 Rev F donanım kılavuzu |
| `Belgeler/ABB_ACS800_FW_RevL.pdf` | ABB 3AFE64527592 Rev L standart kontrol programı |
| `Belgeler/v1.18_referanslar/` | Kullanıcının komütatör/ara vaviyen çizimleri, zil açık şeması ve kütüphane önizlemesi |
| `dist/assets/` | Yerel ürün ve PLC resimleri, atlaslar, manifestler |
| `GORSEL_KAYNAKLARI_*.md`, `GORSEL_VE_TEKNIK_KAYNAKLAR_v1.15.md` | Üretici/ürün URL'leri ve görsel uyarlama açıklamaları |
| `URUN_GORSEL_KAYNAKLARI.txt`, `SEMBOL_KAYNAKLARI.txt`, `SEMBOL_ESLESTIRMELERI.json` | Sembol ve ürün kaynak/eşleştirme kayıtları |
| `V20_KILAVUZU.md`, `ACS800_KILAVUZU.md` | Terminal, parametre, model sınırları ve kaynak sayfa atıfları |
| `tools/plc-v114/`, `tools/v115/` | Model/veri üretiminde kullanılan yardımcı dosyalar |

## Önceki isteklerde adı geçen kaynaklar

EET2025TA1005; EET2025PP1232 (s.136–138); EET2025KP1115 (s.117, sensör bölümü için yazım ayrıca EET2025KP111 olarak geçmiş); EET2025PA1113; EET2025KKA1008 (s.25, 38, 76–81, 93–150); ASENKRON.pdf; TEMEL ELEKTRİK-ELEKTRONİK 9 (s.142).

PLC: Siemens S7-1200 Catalog Pages / Easy Book / System Manual; Delta DVP katalogları ve ES2/EX2/EC5/SS2/SA2/SX2/SE/SE2 kılavuzları; DVP-SE; Omron CP1E/CP1L/CP1H/CP2E katalogları, W479/W462/W613. Donanım/kod varyantları ayrı kontrol edilmelidir; aile fotoğrafı terminal doğruluğunun kanıtı değildir.

V20: 6SL3210-5BB21-5UV1 veri föyü; 109740243 üçüncü parti PLC bağlantı FAQ; Türkçe devreye alma kılavuzu; 2014 Operating Instructions; 2012 Getting Started; 05/2020 Operating Instructions; 03/2021 Compact Operating Instructions. Bunların kaynak sayfaları `V20_KILAVUZU.md` içinde kayıtlıdır; PDF'leri dağıtımda bulunmuyor.

Motor için kullanıcı bağlantısı: <https://otomasyonokulu.com/asenkron-motor-klemens-baglantilari/>. Yeni teknik değişiklikte önce üretici/kitap kaynağı ve doğru model/sayfa doğrulanır; görselden kesin terminal işlevi uydurulmaz.

Ürün çizimleri, aile fotoğrafları ve üretici CAD'leri aynı şey değildir. Kaynaklar hak sahiplerine aittir; özel depoya aktarım bunların lisansını değiştirmez.
