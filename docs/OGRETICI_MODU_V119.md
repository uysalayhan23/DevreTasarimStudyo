# Öğretici Modu · v1.19.0

## Amaç

Dashboard içindeki **ÖĞRETİCİ MODU**, mevcut Kumanda Devreleri, Tesisat/Dağıtım ve Arduino kütüphanelerini yeni bir paralel uygulamaya kopyalamadan kullanır. Normal editör, normal örnekler, simülasyon, kütüphane ve proje kaydetme yolları korunur.

Öğretici akış:

1. Öğrenci önce eksiksiz çalışan örnek devreyi görür.
2. Sağdaki öğretici panelde devrenin amacı, çalışma prensibi, temel kavramlar ve gerekiyorsa güvenlik notu gösterilir.
3. **Devreyi yeniden kur** seçildiğinde yalnız kablolar kaldırılır; malzemeler ve yerleşimleri korunur.
4. Sıradaki iki terminal turuncu ışıkla yanıp söner ve aralarında hafif hareketli yön oku belirir.
5. Öğrenci tek bir terminalden diğer terminale tek kablo çeker.
6. Bağlantı editörün normal kablo motoruna eklenmeden önce öğretici motor tarafından doğrulanır.
7. Yanlış terminal/bağlantı eklenmez; anında açıklayıcı geri bildirim verilir ve aynı iki terminal yeniden gösterilir.
8. Doğru bağlantı kabul edilir, neden doğru olduğu açıklanabilir ve bir sonraki terminal çifti gösterilir.
9. Son kablo tamamlandığında devre tamamlandı durumu, akış animasyonu ve simülasyonu çalıştırma seçeneği gösterilir.

## Öğrenme tasarımı

Dört uygulama seviyesi aynı konuda kademeli destek azaltma (fading) uygular:

- **1 · Rehberli:** bağlantı cümlesi ve neden açıklaması açıktır.
- **2 · Uygulama:** terminal vurgusu + kısa yönlendirme vardır.
- **3 · Pekiştirme:** iki terminal vurgulanır; ayrıntılı ipucu isteğe bağlıdır.
- **4 · Ustalık:** minimum metinle bağımsız kurulum hedeflenir.

Bu sıra, öğrencinin önce tamamlanmış bir worked example görüp ardından desteğin kademeli azaltılması ve bağımsız problem çözmeye geçmesi yaklaşımını izler. Yanlış kablo doğrudan devreye işlenmeden anında geri bildirim verilir.

Pedagojik referans:
- Education Endowment Foundation — *Working with worked examples – Simple techniques to enhance their effectiveness* (FAME: Fading, Alternating, Mistakes, Explanation).
- Education Endowment Foundation — *Supporting pupils with worked examples*.

## Kapsam

18 konu × 4 uygulama = **72 öğretici devre**:

1. Buton ile LED / lamba
2. Buton ile röle
3. Röle ile mühürleme
4. Zaman rölesi ile flip-flop ışık
5. Komütatör ile iki lamba
6. Vaviyen
7. Vaviyen + ara vaviyen
8. 1 / 2 / 3 butonlu zil
9. Kumanda devresi kombinasyonları
10. 4–20 mA loop
11. Loop-powered
12. Aktif / pasif analog bağlantı
13. PNP / NPN
14. Endüktif / kapasitif sensör
15. Sourcing / sinking
16. Open collector
17. BERO
18. İki farklı DC güç kaynağı

Tesisat örneklerinde alternatif gerilim gerektiğinde `supply-1p` kullanılır. Arduino örneğinde kütüphanedeki ayarlı masa tipi DC güç kaynağı kullanılır. Kumanda/sensör devrelerinde mevcut 24 VDC kaynakları ve gerçek kütüphane terminalleri kullanılır.

## Teknik doğrulama referansları

- Pepperl+Fuchs, 3-wire DC sensors: PNP = sourcing, yük çıkış ile L− arasına; NPN = sinking, yük çıkış ile L+ arasına.
- Omega / Analog Devices 4–20 mA kaynakları: seri loop topolojisi; 250 Ω üzerinde 4–20 mA → yaklaşık 1–5 V.
- Analog Devices 2-wire current-loop transmitter kaynakları: iki telli loop-powered transmitter aynı iki iletken üzerinden beslenir ve ölçüm akımını düzenler.
- Siemens endüktif BERO uygulama notları: HF osilatör/bobin alanı metal hedefle sönümlenir; elektronik bunu anahtarlama durumuna çevirir.

## Koruma ve uyumluluk

- Öğretici proje normal starter proje korumasını kullanmaz; bunun yerine `tutorialLesson` oturumu kullanır.
- Öğretici oturumu sırasında malzeme silme, taşıma, döndürme, çoğaltma ve özellik düzenleme kapalıdır.
- Yalnız sıradaki terminal-terminal kablo bağlantısı kabul edilir.
- Öğretici oturumları normal kullanıcı proje taslağı listesine otomatik kaydedilmez.
- Dashboarda dönüşte öğretici panel/animasyon sınıfları temizlenir.
- Mevcut simülasyon butonu renk ve çalışma kuralı değiştirilmez.
- Mevcut kütüphane, Arduino KY-040, V20, ACS800, HCFA, DOLD ve standart starter proje yolları değiştirilmez.

## Dosyalar

- `dist/tutorial-lessons.js` — 18 konu / 72 ders ve gerçek terminal adımları.
- `dist/tutorial-mode.js` — ders tarayıcısı, yeniden-kur akışı, doğrulama, ilerleme ve geri bildirim.
- `dist/tutorial.css` — dashboard, öğretici panel, terminal pulse ve yön animasyonları.
- `tests/tutorial-mode-v119.test.cjs` — ders sayısı, cihaz/pin geçerliliği ve editör hook regresyonları.
