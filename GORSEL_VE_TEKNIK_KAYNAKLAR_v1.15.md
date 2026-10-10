# v1.15 görsel ve teknik kaynakları

Bağlantı ve sayısal davranış için üretici belgeleri; görünüş için mevcut ürün
fotoğrafları ve kullanıcının paylaştığı önceki çalışma kullanılmıştır. Marka
isimleri ürünleri tanımlar; üretici onayı veya sertifikasyonu belirtilmez.

| Cihaz | Teknik kaynak | Görselin niteliği |
| --- | --- | --- |
| Gentek HT-2 | [Gentek ürün sayfası](https://www.gentekelektronik.com/urun/4-20-ma-cikisli-filitreli-gostergeli-sicaklik-nem-transmitteri) | Paylaşılan önceki çalışmadan ön görünüş uyarlaması |
| ORDEL HMT-R | [Ürün](https://ordel.com.tr/urun/hmt-r), [KK_134_3_TR kılavuzu](https://www.ordel.com.tr/upload/KK_134_3_TR_HMT-R.pdf), bağlantı çizimi s. 2 | Paylaşılan çalışmadan üst görünüş uyarlaması |
| ORDEL HMT-T | [Kullanım kılavuzu](https://ordel.com.tr/pdf/kilavuz/HMT-T%20Kullan%C4%B1m%20K%C4%B1lavuzu.pdf), bağlantı çizimi s. 2 | HMT ailesi; tür değişiminde 90° yönlendirme |
| WAZ5 8540300000 | [Weidmüller ürün kaydı](https://eshop.weidmueller.com/tr/waz5-vcc-0-10v4-20ma/p/8540300000) ve paylaşılan çalışma içindeki terminal belgesi | Paylaşılan çalışmadan ön görünüş uyarlaması |
| ENDA ET4420 | [Ürün](https://enda.com/automation/temperature-controllers/et4420/), [ETx420 kılavuzu](https://enda.com/en/automation/temperature-controllers/et4420/etx420.pdf) | Paylaşılan çalışmadan ön görünüş uyarlaması; ekran ve tuşlar etkileşimlidir |
| UNI-T UT33D+ | [Üretici seri sayfası](https://meters.uni-trend.com/product/ut33plus-series/), [Türkiye ürün sayfası](https://www.unitturkiye.com/urun/unit-ut33d-600v-10a-dijital-multimetre) | Önceki çalışmada verilen ürün fotoğrafı; ekran ve komütatör katmanı eklenmiştir |
| Baykon TX11 | [Ürün](https://www.baykon.com/tr/urun/tx11-analog-transmitter/), [üretici broşürü](https://my.baykon.com/downloadfile-baykon-tx11-analog-transmitter-brosur-1501202409320862930.pdf) | Paylaşılan çalışmadan ön görünüş uyarlaması; dış sayısal kutu eğitim göstergesidir |
| Tense TTK-12.5-400V | [Ürün sayfası](https://tense.com.tr/tr/urunler/125kvar-trifaze-alcak-gerilim-guc-kondansatoru-ttk-12-5-400v/) | Önceki çalışmada verilen ürün fotoğrafı |
| Termokupllar | [NIST ITS-90 veritabanı](https://its90.nist.gov/), Monograph 175 tabloları | K/J/T/E/N/B/R/S polinomları; soğuk nokta farkı |

## PLC fotoğrafları

`tools/v115/photo-data.json` her kayıt için yerel dosyayı, fotoğrafın ait olduğu
model/aileyi, kaynak sayfayı ve perspektif dönüşümünün dört köşesini içerir.
`dist/plc-photo-data.js` bunun çevrimdışı çalışma kaydıdır.

- Omron CP1E ve CP2E fotoğrafları [Omron ürün kataloğundan](https://industrial.omron.eu/en/products/cp2e)
  alınmıştır. Tek fotoğrafın birden fazla elektriksel varyantta kullanımı ayrıca işaretlenmiştir.
- Siemens fotoğrafları önceki pakette bulunan üretici/distribütör ürün görselleridir.
- GMTCNT GLC ve GXM fotoğrafları önceki paketteki [GMTCNT](https://gmtcontrol.com/en/)
  ürün görselleridir. WebP dosyalarından bazıları uyumluluk için PNG'ye çevrilmiştir.
- Delta DVP12SE ve DVP26SE fotoğrafları kullanıcının paylaştığı çalışma içinden alınmıştır.
- Donanım terminal kimlikleri ve I/O ayrımı v1.14'ün belgeli 146 kaydına dayanır;
  ilgili donanım kaynakları `YENILIKLER_v1.14.0.md` içinde korunmuştur.

Bir aile fotoğrafı aynı görünüşün tüm model kodlarında birebir doğru olduğu
anlamına gelmez. Görsel düzeltme, terminal koordinat katmanından bağımsızdır.
Kaynak URL'leri bilgi amaçlıdır; uygulama açılırken bu adreslerden dosya indirmez.
