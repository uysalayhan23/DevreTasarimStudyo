# MQ-07 — 10 gerçek kablolu dersin anlatımı uygulamada düzeltildi (2026-10-14)

Bu değişiklik **yalnız rapor değil, kullanıcı arayüzünün okuduğu gerçek `dist/tutorial-pedagogy.js` ders kaynak metinleridir**. `main` başlangıç SHA: `6cd3525bbecde2e8824aa22ca3a8d49b4c2d7683`.

**Düzeltilen ilk 10 otomatik şablon dersi:** `installation-grounding-src-01`, `installation-grounding-src-02`, `installation-systems-src-02`, `installation-systems-src-03`, `installation-systems-src-04`, `installation-systems-src-05`, `installation-systems-src-06`, `installation-systems-src-08`, `installation-systems-src-09`, `installation-systems-src-10`.

Her ders için "Bu ders ne işe yarar?" (`summary`), "Nasıl çalışır?" (`explanation`), `learningGoal`, beş somut sanal `beginnerSteps`, şemaya dayalı `materials.why` baştan yazıldı. Kaynak beslemesi, gerçek terminal adları, faz/nötr veya sinyal yolunun neden-sonucu, yalnız mümkün olduğunda varsayımlı hesap ve gözlemlenecek öğrenci deneyi açıklandı. Şebeke üzerinde fiziksel bağlantı talimatı değil, sadece sanal devre öğretimidir.

## Kaynak kısıtları ve iki önemli REVIEW

- `installation-systems-src-04` "Ara vaviyen ile üç noktadan kontrol": modelde **yalnız iki vaviyen** vardır. Ara vaviyen eksik. Yanlış üç nokta çalışması öğretmek yerine mevcut durumu açıkça belirtir; topoloji değişimi ve gerçek simülasyon kabulü beklenir.
- `installation-systems-src-06` "İki/üç butonlu zil": modelde **tek B1** vardır. İkinci/üçüncü buton yok. Mevcut tek butonun işlevi açıklanır, çok butonlu işlev kabul edilmez.
- Diğer sekiz dersin anlatımı gerçek bileşen/terminal çizimine bağlandı; Windows UI ve bağımsız pedagojik kabul yine OPEN.
- Korunan kablolar ve modeller değişmedi; 136 rich kabul ve NTC pilot korunur.

## Çalıştırılmış QA

Özgün kaynakların bellek içi V8 koşusu: 1.655 ders, 136 rich, 1.519 Batch N, 939 katalog, **722/722 başlangıç solver stabil**; 7.250 eleman ve 16.478 kablo ucu denetlendi. Eksik tanım/terminal, kısa devre, blokaj, osilasyon, istisna **0**. Batch N kaynak testi **1.519/1.519 PASS**, 2.085 bağlantı gözlemi.

Yeni `tests/qa-mq07-wired-first-ten-v11920.test.cjs` özgün 2 callback'i V8 uyarlamasında **2/2 PASS**; `node --test` çalıştırılmadı. Şablon özet **523→513**, açıklama **350→340**, tekrar eden açılış **644→634**, genel malzeme gerekçesi **715→706**. Bu sayıların azalması tam pedagojik kabul anlamına gelmez.

**MQ-00:** İlk 10 metin kaynağı güncellendi, iki başlık-topoloji uyuşmazlığı REVIEW, geri kalan 1.509 otomatik ders anlatımı ve gerçek Windows/Edge arayüz QA OPEN. GitHub Actions kullanılmadı, `[skip ci]`.
