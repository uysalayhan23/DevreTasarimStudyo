# DTS — Arayüz ve Kullanım Kolaylığı Rakip İncelemesi (27.10.2026)

> Kullanıcının yeni ana önceliği ders taraması değil, **uygulamanın daha güzel, hızlı ve sezgisel olmasıdır**. Bu belge araştırma/öneri kaydıdır; kullanıcı derslere geri dönerse **önce** [Ders Durum ve Devam Protokolü](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md) okunur. Kullanıcı açıkça istemeden ders onarım seferberliğini başlatma.

## Kaynaklar ve kanıt seviyesi

1. Simurelay Microsoft Store ID `9mwmfj4l40g1`, resmi mağaza bağlantısı: https://apps.microsoft.com/detail/9mwmfj4l40g1?hl=tr-TR&gl=TR . Microsoft Store'un web sürümü JS gerektiriyor; ürün adı **Simurelay** doğrulandı. iOS sürüm değişiklik kayıtlarında 2025 arayüz yenilemesi, gelişmiş kablo etkileşimi, çoklu seçim, çoğaltma, Undo/Redo, filtreli kütüphane, "Fit to Content", hızlı zoom, performans iyileştirmesi belirtiliyor: https://apps.apple.com/us/app/simurelay/id1580180864 . Aynı özelliklerin Windows sürümünde birebir aynı yapıda bulunduğu ayrıca canlı test edilmedi.
2. EduVolt Designer **2.2.10**, kullanıcının ChatGPT Kütüphanesindeki `EduVolt_Designer_Setup_2.2.10.exe` (35,467,035 bayt); SHA-256: `a6bdb531df75a79006e8e128f9f9afed34f34fc61db3636750f3bea7ffc67809`. **Yalnız statik inceleme:** PE32 Windows 32-bit kurulum kabuğu, Inno Setup izleri, PE sürüm kaydında `CompanyName=EduVolt Academy`, `ProductName=EduVolt Designer`, `ProductVersion=2.2.10`. EXE çalıştırılmadı, paket içi GUI henüz çıkarılıp işletilmedi. Dolayısıyla birebir runtime UX iddiası yok.
3. Üretici EduVolt resmi tanıtımı: https://eduvoltacademy.com/software/ , https://eduvoltacademy.com/ — sonsuz tuval, PDF/PNG/JPG/Excel aktarımı, IEC etiketleri, canlı simülasyon, EVC kütüphanesi, Windows/Android, gerçek bileşen görünümü, LOGO! ladder, fiziksel terminalli motorlar (üretici beyanı).
4. EduVolt EVC Editor incelenebilir arayüz: https://eduvoltacademy.com/wp-content/eduvolt-tools/evc-editor.html?plan=free — isim/görsel/terminal rehberli akış; fit, ızgara, snap, yakınlaştırma, resim düzenleme ve terminal düzeni. EVC Editor açık uyarısı: özel bileşenler akıllı bağlantı yapabilir ama henüz simülasyona katılmayabilir. **DTS'de de katalog eklenen öğe elektriksel modeli kanıtlanmadan simüle edilebilir gösterilmez.**

## DTS'de zaten bulunanlar — yeniden yazma

GitHub `main` üzerinde `dist/index.html`, `dist/app.js`, `dist/styles.css`, `dist/studio.css`, `AGENTS.md` kaynaklarında doğrulananlar: kütüphane arama ve kategori/marka filtreleri, favori bileşenler, Undo/Redo (Ctrl+Z/Ctrl+Y), Tümünü Seç, şemayı yakınlaştırma ve **Sayfaya sığdır** (`fitBtn`), IEC/malzeme görünümü, öğretici konu arama, durum/uyarı panelleri, gerçek terminal kontrolleri, Edge/offline çalışma, hazır örnek koruması. Rakiplerden kopyalamak amacıyla bu işlevleri ikinci kere yazma.

## Gerçekten değer katabilecek UI/UX değişiklikleri

| Öncelik | İyileştirme | Neden | Kabul kapısı |
| --- | --- | --- | --- |
| P0 | **Hızlı kütüphane araması** (Ctrl/Cmd+K; Esc temizle; görünür kısayol) | Çok bileşenli katalogda tek hareketle öğe bulma | Kısayol yalnız editörde çalışır; modal, dashboard ve metin girişi korunur; devreye dokunmaz |
| P0 | Görev odaklı küçük araç çubukları: Seç / Bağla / Simüle et / Ölç | Karmaşık üst araç çubuğunun öğrenme yükünü azaltma | Mevcut komut ve keyboard davranışları korunur |
| P0 | Seçili bileşen üzerinde sade özet paneli: görev, gerçek terminaller, parametre, yalnız desteklenen simülasyon | Malzeme kütüphanesinden doğrudan anlamlı düzenlemeye geçiş | Yanlış katalog pini/model üretme yok |
| P1 | Sol kütüphane ve sağ özellikler paneli için açık/daralt hızlı kontrolü, odak modu | Küçük ekranlarda şemaya daha çok alan | 3D/şema koordinatları, pano ölçekleri korunur |
| P1 | Şemadaki bağlantı hataları için kaynağa götüren açıklama, önerilen güvenli düzeltme | Kullanıcı neyi yanlış yaptığını görür | Sadece gerçek simülatör ve katalog kanıtıyla hata |
| P1 | Şema + malzeme görünümü arasında süreklilik gösteren animasyonsuz/az hareketli geçiş | 2D/3D uç yerlerini karşılaştırma | Gerçek terminal-kablo koordinatları piksel kontrolü; motion-reduce |
| P1 | Şemayı dışa aktarırken okunur önizleme, proje özeti, malzeme listesi | EduVolt'un dokümantasyon akışına benzer fayda | Mevcut kaydetme/export kilitleri ve offline kullanım |
| P2 | Yeni bileşen ekleme sihirbazı (görsel, terminal koordinatları, yalnız çizim vs native model) | EVC Editor'daki kademeli UX yaklaşımı | Gerçek katalogya kontrollü ekleme; simülasyonu olmayan model işaretlenir |
| P2 | Proje başlangıcında "Hızlı başla / Hazır örnek / Öğretici" rehberli seçim | Yeni kullanıcının ilk dakikalarını sadeleştirme | Golden, projeler ve kayıtlar dokunulmaz |

## Rakipte güçlü görünen, ancak DTS'ye doğrudan kopyalanmaması gerekenler

- **Simurelay**: Odaklı sade şema alanı ve az dikkat dağıtan araç çubuğu yararlı; DTS'nin zengin pedagojisinden veya katalog kapsamından feragat edilmemeli. Arayüz yeniliği gerçek simülasyon doğruluğu kanıtı değildir.
- **EduVolt**: Sonsuz tuval ve terminal görsel araçları çekici; DTS'nin sabit fiziksel referansları, 3D terminal/kablo hizası ve örnek kilitleri zarar görmemeli. Gerçek katalog modelini doğrulamadan "her öğe simüle edilir" denmemeli. Lisans/sunum modeli aynen kopyalanmaz.
- Karşılaştırmada performans kazancı, FPS veya fiziksel doğruluk üstünlüğü ölçülmedi; bu yönlerden "daha hızlı/daha doğru" iddiası kurulmaz.

## İlk uygulanabilir dilim

`dist/library-search-ux.js`: Editör açıkken **Ctrl+K / Cmd+K** kütüphane aramasına odaklanır, yazı seçer. Arama alanında **Esc** sorguyu temizler ve mevcut filtreleme `input` olayını çalıştırır; boşken alanı bırakır. Dashboard, güvenlik ekranı, açık modal ve başka metin düzenleyicileri korunur. Bu iş yalnız UI'dır; elektriksel model, ders kimliği, fiziksel ölçüm, Golden, kabul manifestoları ve `BASLAT.bat` değişmez. Test dosyası: `tests/library-search-ux.test.cjs`. Windows/Edge gerçek görsel kabulü ayrıca gereklidir.

Sıradaki adım: mevcut topbar için yerleşim haritası ve 2D/3D ayrımını koruyan, dar ekranda alan kazandıran panel ergonomisi prototipi; yalnız hedefli UI test + görsel REVIEW, kesinlikle ders veya simülasyon PASS beyanı yok.

## PLC Ladder için yeni teknik referans

27 Ekim 2026'da yüklenen **LOGO! Soft Comfort V7 + V8.2.1** kurulumlarının statik incelemesi, dosya parmak izleri, 51 `.lsc` + 47 PDF örneği, özgün DTS Ladder mimarisi ve kabul senaryoları [LOGO! statik inceleme ve Ladder planında](LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md) kayıtlıdır. Ladder geliştirmesine başlamadan bu belge okunmalı; henüz gerçek PLC/Siemens dosya uyumluluğu varmış gibi davranılmamalıdır.
