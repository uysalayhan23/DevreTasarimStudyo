# v1.14.0 — PLC ön görünüşleri, ilk grup

Bu sürüm PLC isteğinin tamamını bitirmez. Aşağıdaki 146 donanım varyantının
üretici çizimlerinden uyarlanan, izometrik olmayan SVG ön görünüşlerini içerir.
Görseller ürün fotoğrafı değildir; kütüphanede “Temsili görsel” olarak belirtilir.

| Aile | Ayrı donanım kaydı |
| --- | ---: |
| Omron CP1E | 66 |
| Omron CP2E | 39 |
| Siemens S7-1200, 40 serisi standart CPU'lar | 13 |
| GMTCNT GLC | 8 |
| GMTCNT GXM | 15 |
| Delta DVP-SE | 5 |

Besleme, röle/NPN/PNP çıkışı ve giriş/çıkış sayısı farklı olan doğrulanmış
ürünler ayrı model kodlarıyla seçilir. Her varyantın kendi klemens sıralaması
ve ortak uçları vardır. Boş klemens yuvaları bağlantı noktası oluşturmaz.

CP1E yenilenen S/S1 modellerindeki geniş ortak uçlar, S1 RS-485 portu,
NA20 analog uçları; S7-1217C diferansiyel çiftleri; GXM tartım modüllerinin
altı telli bağlantıları ayrı tanımlanmıştır.

DVP12SE giriş ve çıkışları sağ tarafta iki bankadır. DVP26SE girişleri solda,
çıkışları sağdadır. Alt yüzdeki besleme ve COM2 uçları, ön yüz klemensiymiş
gibi gösterilmez: “ALT YÜZ BAĞLANTILARI” başlıklı yardımcı şeritte sunulur.
Bu şerit fiziksel kasanın parçası veya birebir alt görünüş değildir.

Eski model kimlikleri, mevcut projelerdeki kablo uçlarını korumak için
tutulmuştur. Yeni eklemelerde yeni model kodlarını kullanın. Önceki projeler
kendiliğinden yeni terminal kimliklerine dönüştürülmez.

## Kullanım

PLC / Otomasyon sekmesini ve 3D malzeme görünümünü seçin. Tam ürün koduyla
arama yapın. Sağdaki “Eleman boyutu (%)” alanı ve 90° döndürme kullanılabilir.
`Ornekler` klasöründeki dört `v1.14.odsdevre` dosyası model karşılaştırmalarıdır.
PLC bulunan projelerde program yürütme/simülasyon desteği hâlâ yoktur.

## Henüz tamamlanmayan kapsam

Siemens S7-1200 genişleme/iletişim modülleri, eski ve emniyet CPU çeşitleri;
S7-1500, S7-300, ET200; Delta SS2, SA2, SX2, EH3, ES3, AS, AH ve genişlemeler;
Omron CP1L, CP1W, CJ, NX/NJ ailelerinin bütün donanım varyantları ve birebir
klemens yerleşimleri için çalışma devam etmelidir. Bu ailelerde önceki
görseller korunur. 146 sayısı bütün üreticilerin eksiksiz ürün kataloğu değildir.

## Kaynaklar

- [Omron CP1E ürün listesi](https://www.ia.omron.com/products/family/2064/lineup.html), W479-E1-08 donanım kılavuzu, bölüm 3.
- [Omron CP2E ürün listesi](https://www.ia.omron.com/products/family/3777/lineup.html), W613-E1-03 donanım kılavuzu, bölüm 3.
- Siemens S7-1200 System Manual V4.2.3, A5E02486680-AL, s. 1365–1426.
- [GMTCNT kılavuzları](https://en.gmtcontrol.com/en/user-manuals/), GLC ve GXM Rev.4; üretici model fotoğrafları.
- [Delta DVP-0360030-01, 2021-11-04](https://www.fabelec.cl/storage/products/archives/Delta_PLC_DVP_SE_I_TSE.pdf), s. 1–4; üretici kılavuzunun distribütör kopyası.
