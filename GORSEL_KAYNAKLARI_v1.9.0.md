# v1.9 görseller ve davranış kaynakları

Ürün fotoğrafları yerel pakettedir; çalışma sırasında internetten indirilmez. Ürün fotoğrafı, ayrıntılı bir elektriksel model veya üretici onayı anlamına gelmez.

| Öğe | Yerel dosya | Kaynak |
|---|---|---|
| Seviye | `dist/assets/products/level-reference-v19.jpg` | [Setateknik](https://www.setateknik.com/urun/sivi-seviye-sensoru) |
| NTC | `dist/assets/products/ntc-reference-v19.jpg` | [Ürün](https://www.kombitesisatmarket.com/universal-kombi-ntc-isi-sensoru), [istenen çalışma prensibi](https://maker.robotistan.com/ntc-negative-temperature-coefficient-nedir-nasil-calisir-ne-ise-yarar/) |
| PTC | `dist/assets/products/ptc-reference-v19.png` | [EMKO üretici veri sayfası, s.1](https://asset.conrad.com/media10/add/160267/c1/-/en/001273956DS00/karta-katalogowa-1273956-czujnik-temperatury-emko-ptc-m6l40k15-50-do-130-c-ptc.pdf), [istenen prensip](https://www.dxmht.com/tr/article/ptc-sensor-understanding-applications.html). RS ürün sayfası açılamadığı için aynı EMKO modelinin üretici PDF'si kullanıldı. |
| Termokupl | `dist/assets/products/tc-reference-v19.jpg` | [EMKO TCK/TCKT](https://www.emkoelektronik.com.tr/en/products/tck-terminal-block-type-tckt-with-transmitter), [istenen prensip](https://www.rst-elektronik.com/blog/termokupl-nedir) |
| SSR | `dist/assets/products/ssr-reference-v19.jpg` | [Fotek SSR-40DA ürün fotoğrafı](https://www.biltekelektrik.com/urun/fotek-ssr40da-serisi-332vdc-giris24380vac-cikis-40a-solid-state-relay/), [istenen prensip](https://blog.direnc.net/solid-state-role-ssr-nedir-nasil-calisir/) |
| Zaman/flaşör | `dist/assets/products/finder80-front-v19.png` | [Finder 80 serisi üretici PDF'si](https://cdn.findernet.com/app/uploads/S80EN.pdf), s.3 fotoğrafından uyarlama |
| Darbe rölesi | `dist/assets/products/finder20-front-v19.png` | [Finder 20 serisi üretici PDF'si](https://cdn.findernet.com/public/attachments/20/EN/S20EN.pdf), s.3 fotoğrafından uyarlama |

## Üretilen görseller

Araç: yerleşik **image_gen.imagegen**, CLI kullanılmadı. Finder görselleri referanstan uyarlanmış eğitim görselleridir; üzerlerindeki küçük yazılar teknik veri kaynağı değildir. PNG çıktıları opak arka plan içerdiğinden uygulamada SVG siluet kırpmasıyla yalnızca ürün gösterilir. Fotoğraf dosyalarının kendilerinin alfa kanallı olduğu iddia edilmez.

İstem setinin özeti:

1. Finder 80.01 referans ürün fotoğrafını devre eğitim yazılımında kullanılacak gerçekçi, tam önden ortografik görünüme dönüştür. İzometrik açı ve yan yüz olmasın. Gövde, ayar düğmeleri, etiketler ve terminal sırası korunsun. Saydam arka plan, ek nesne veya gölge olmasın.
2. Finder 20.21 referans ürün fotoğrafını aynı şekilde tam önden ortografik görünüme dönüştür. Gövde ve mevcut terminal dizilimini koru; yan yüz ve perspektif olmasın. Saydam arka plan iste. Ürün tek başına, eksiksiz ve kadraj içinde olsun.

PTC görseli üretici PDF'sindeki gömülü fotoğrafın çıkarılmasıdır; yapay zekâ ile yeniden üretilmemiştir. Diğer ürün fotoğraflarında yerel SVG kırpma sınırları ve elektriksel terminaller kod içinde ayrı tutulur.
