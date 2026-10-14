# Zil Devreleri — Zorunlu Trafolu Model / BELL_TRANSFORMER_V1

**KİLİTLİ / 2026-10-14 / `main`**. Önceki kullanıcı kararı gereği tüm zil eğitim devrelerinde trafo zorunludur; trafosuz doğrudan şebeke fazı ve nötrü çağrı butonuna veya zile götüren örnek **reddedilir**.

## Öğrenciye gösterilecek güvenli sanal model
- **TR1 — yalıtılmış 12 V AC zil trafosu**. Şebeke primeri program içinde kapalı sanal kaynaktır; şebekeye ait dışarıdan kablo bağlanabilen uç **yoktur**.
- Görünen devre, yalnız TR1'in S1/S2 **12 VAC yalıtılmış sekonderinden** beslenen, normalde açık çağrı butonları ve Z1 zilini içerir. Her buton bağımsız bir çağrı noktasıdır; basılınca Z1 etkinleşir, bırakılınca durur.
- **Öğrenci uyarısı:** “Zil devresinde doğrudan şebeke fazı kullanılmaz; yalıtılmış uygun zil trafosu gereklidir.” Bu konu gerçek şebeke üzerinde uygulama talimatı değildir.
- Bir, iki, üç ve dört çağrı butonlu derslerde aynı model zorunludur. Dördüncü ışıklı etiketli butonda yalnız NO 13/14 kontağı simüle edilir; ışık sistemi uydurulmaz.
- Eski saklanan projeler şema/terminal kimliği sessizce değiştirilerek göç ettirilmez. Doğrudan şebekeli eski zil projesi simülasyon tarafından **BLOCKED + açık trafo uyarısı** ile reddedilir.

## Teknik kanıt ve kabul
- Makinece okunabilir kanonik sözleşme: `docs/BELL_TRANSFORMER_MODEL_LOCKED.json`.
- Bütün zil derslerinde `bell-transformer` olup olmadığını, doğrudan fazın reddini, izole sekonder topolojisini ve her butonun OFF→ON→OFF solver davranışını `scripts/qa-bell-transformer-v11920.cjs` ve `tests/qa-bell-transformer-v11920.test.cjs` test eder.
- **Kabul sınırı:** 12 VAC bu uygulamanın **sanal model** değeridir; üretici anma sertifikası değildir. Tam Node/Windows görünüm, gerçek fiziksel tesisat, ürün sertifikasyonu ve bağımsız pedagojik kabul ayrı OPEN/REVIEW kalır.
- Gelecek 200'lü gruplarda zil devresi varsa bu manifest olmadan yeni ders FINAL kabul edilemez.
- Korunan değerler: kaynak başlık/ID'leri, 136 rich ders, kanonik buton 13/14 davranışı, 4. buton NO modu; gerçek ölçüler, golden kilitler ve launcher. GitHub Actions kullanılmaz. Commitlerde `[skip ci]`.
