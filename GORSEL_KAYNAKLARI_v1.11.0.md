# v1.11 görsel ve bağlantı kaynakları

## Ürün fotoğrafları

- Hoparlör: [Visaton FRS 8](https://www.visaton.de/en/products/drivers/fullrange-systems/frs-8-4-ohm), `speaker-v111.jpg`.
- Buzzer: [Sonitron SXL](https://www.sonitron.be/products/sxl-series/), `buzzer-v111.png`; birleşik fotoğrafın önden gösterilen bölümü kullanılır.
- Siren: [Klaxon Master Blaster](https://www.klaxonsignals.com/product-page/master-blaster), `siren-v111.jpg`.
- İhbar/alarm: [Klaxon Sonos Sounder Beacon](https://www.klaxonsignals.com/product-page/sonos-sounder-beacon-1), `alarm-v111.jpg`.
- NH bıçaklı sigorta: [istenen Tumpa ürün sayfası](https://tumpaelektrik.com/bicakli-sigorta-ve-yuk-ayirici/siemens-3na3820-sigorta-busonu-nh-bicakli-50a-boy-000), `nh-reference-v111.png`. Sayfa başlığı 50 A iken sağlanan fotoğrafın baskısı farklıdır; fotoğraf NH gövdesi için temsili kullanılır, baskı değeri simülasyon anma akımı değildir.

Fotoğraflar görsel referanstır; sesli elemanların simülasyon beslemesi ve tonu, fotoğraftaki ürünün tam elektriksel modeli iddiası taşımaz.

## İzometrik olmayan görsel uyarlamalar

Aşağıdaki beş PNG, ürün fotoğrafları referans alınarak imagegen ile üretildi. Bunlar üretici teknik çizimleri değildir. Kaynak görüntülerin önden/üstten uyarlamaları, kodla çizilmiş terminaller ve ayrı hareketli parçalarla birleştirilmiştir.

- [Tense FS-R](https://tense.com.tr/tr/urunler/faz-sirasi-rolesi-fs-r/): `fsr-front-v111.png`, önden.
- [Tense FKV-03](https://tense.com.tr/tr/urunler/faz-koruma-rolesi-fkv-03/): `fkv-front-v111.png`, önden.
- [Siemens 3NP1133-1CA10](https://tumpaelektrik.com/bicakli-sigorta-ve-yuk-ayirici/siemens-3np1133-1ca10-nh-bicakli-yuk-kesici-160a): `nh-holder-front-v111.png`, 3NP1 ailesi için temsili önden uyarlama. Üretilen resimdeki küçük ürün baskısı birebir sipariş numarası olarak kullanılmaz. Devre üç kutuplu NH00/NH000 tutucu olarak tanımlıdır.
- [Weidmüller WSI 6 1011000000](https://www.endustriyelmarket.com/weidmuller-1011000000-wsi-6-05-6-mm%C2%B2-g20-sigorta-w-serisi-ray-klemens): `wsi-top-v111.png`, üstten; sigorta taşıyıcısı ayrıca hareket eder.
- [EMAS 10 kΩ potansiyometre](https://zeybekmarket.com/potansiyometre-10k-ohm): `pot-front-v111.png`, önden; düğme ayrı döner, azami değer kullanıcı tarafından değiştirilebilir.

Direnç, 150 mH bobin, mekanik kollar, şalter mandalları ve Metop ön yüzü kod ile çizilmiştir. Genel sensörler mevcut endüktif şalter varlığını, PT100 ve termokupl mevcut ortak prob varlığını kullanır. Önceki sürümlerin görsel kaynakları ilgili v1.9/v1.10 belgelerinde korunur.

## Bağlantı ve davranış belgeleri

- [Metop Paket Şalter Serisi 2018 kataloğu, PDF s.9](https://www.serer.com.tr/uploads/catalogs/files/metop-2018.pdf): MT031 yıldız–üçgen. Üretici kataloğunun bayi üzerindeki kopyası kullanıldı. Fiziksel çiftler 1–2, 3–4, 5–6, 7–8, 9–10, 11–12, 13–14, 15–16. Y konumunda 1–2, 5–6, 7–8, 11–12, 13–14; Δ konumunda 1–2, 3–4, 5–6, 9–10, 13–14, 15–16 kapanır. Sabit köprüler 2–4, 3–7, 6–10, 9–11, 13–15, 8–12, 12–16.
- [Tense DK-004-7 bağlantı kılavuzu](https://tense.com.tr/wp-content/uploads/2021/02/doc_tr-fk-fkv-x4trpdf-products-2019-12-04-2b7d0abc3a2fee20298817a7ec66daf4-1.pdf): FS-R, FKV-03, 3×380 VAC+N, faz sırası ve FKV gerilim toleransı. İşlev açıklamasına göre sağlıklı 2–3, hatalı 2–1 bağlantısı kullanılır.
- [Siemens 3NP1133-1CA10 veri sayfası](https://support.industry.siemens.com/teddatasheet/?caller=SIOS&format=pdf&language=en&mlfbs=3NP1133-1CA10): üç kutuplu 160 A, NH00/NH000.
- [Siemens 3NP1 sistem kılavuzu](https://cache.industry.siemens.com/dl/files/690/33515690/att_98112/v1/System_Manual_3NP1_3ZX1012-0NP10-1AC1_en-US.pdf): sigortalı yük ayırıcı ailesi.
- [DwyerOmega: 2, 3 ve 4 telli RTD bağlantıları](https://www.dwyeromega.com/en-us/resources/rtd-2-3-4-wire-connections): kablo direnci ve kompanzasyon prensibi.

Dosyalar çevrimdışı kullanım için pakettedir; bu bağlantılar kaynak izlenebilirliği içindir.
