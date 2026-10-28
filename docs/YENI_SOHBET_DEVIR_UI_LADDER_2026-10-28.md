# DTS UI/UX + PLC Ladder — Yeni sohbete eksiksiz devir
**Son güncelleme:** 28 Ekim 2026  
**Aktif GitHub repo/dal:** [uysalayhan23/DevreTasarimStudyo](https://github.com/uysalayhan23/DevreTasarimStudyo) / `main`  
**Bu belge hazırlanırken canlı HEAD:** `5acb3e4b4180c3c787d46eb802a63393cc9307a7`; **her yeni işlemden önce tekrar canlı HEAD al**.  
**Kapsam:** Bu sohbetin UI/UX, Siemens LOGO! tarzı özgün Ladder, Simurelay/EduVolt karşılaştırması, kabul kuralları ve saatlik otomasyonu.

## 1. Kullanıcının ana isteği ve çalışma biçimi

- **24 maddelik ürün geliştirme planı** tamamlanana kadar kullanıcıdan 'devam' beklemeden mümkün olduğunca ilerle. Normal sohbetten verilen `devam et` komutları saatlik çalışmadan bağımsız ek işlem başlatabilir.
- Tüm işler **tespit et → gerçek kaynakta onar/geliştir → hedefli pozitif-negatif test et → yalnız kanıtlananı `[skip ci]` ile `main` dalına gönder → uzak HEAD/blob SHA doğrula** şeklinde ilerler.
- **Work/Codex, GitHub Actions, force-push, geçici dal yok**. Eski testler ve tamamlanmış düzeltmeler tekrarlanmaz. CI çalıştırmak için izin verilmedi. `NOT_RUN` hiçbir zaman `PASS` değildir.
- Windows'ta `BASLAT.bat` Microsoft Edge içinde `file:///.../dist/index.html` açar. **Yerel sunucu yok; çevrimdışı açılma korunacak.**
- Golden, mevcut PASS/HOLD/REVIEW, NE555/BD139, tüm native modeller, 2D/3D fiziksel terminal ve kablo konumu, ekran ölçeği korunur. Kullanıcı Node/PowerShell testi istenmesini istemiyor; gerçek Edge/Windows testi yapılmadıysa `REVIEW`.
- **Dersler ayrı iş akışı:** 1686 benzersiz kayıt; eski 2082 QA raporu 1822 PASS / 260 FAIL tarihsel teknik borç. Bağımsız COMPLETE kabulünü değiştirme. Kullanıcı yeni ders onarımı istediğinde önce [DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md) oku. SC1194 solar şarj/fiziksel kablolama benzeri kanıt eksikleri HOLD/REVIEW; sahte devre veya sahte native simülasyon kurma.

## 2. Zorunlu kaynak dosyaları

1. [AGENTS.md](../AGENTS.md): ana repo ve teknik güvenlik/kalite kilitleri.
2. [DTS_UX_PLC_24_ADIMLIK_YOL_HARITASI.md](DTS_UX_PLC_24_ADIMLIK_YOL_HARITASI.md): 24 görevin **en son tamam/kısmi/açık durumunu** gösteren canlı referans; bu devir dosyasındaki sabit tarihten daha güncel olabilir.
3. [PLANNER_UI_LADDER_GUNCEL_2026-10-28.md](PLANNER_UI_LADDER_GUNCEL_2026-10-28.md): teknik testler, desteklenen PLC ve kabul kilitleri.
4. [LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md](LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md): Siemens LOGO! yazılım kurulumlarının **statik** incelemesi, 10 Ladder mimari görevi ve örnek kabul senaryoları.
5. [ARAYUZ_REFERANS_2026-10-27.md](ARAYUZ_REFERANS_2026-10-27.md): Simurelay ve EduVolt karşılaştırması, arayüz fikirleri.
6. [DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md): yalnız ders konusu tekrar açılınca.

## 3. Bu sohbette alınan ürün kararları

- **Üç çalışma modu:** Standart, Simülasyon Odak (sol kütüphane ve sağ özellikler geçici daralır/gizlenir) ve Tam Sayfa. Tek düğme/Esc ile eski kullanıcı düzenine dön; çizimdeki bileşen-kablo ölçeklerini değiştirme.
- **Ladder IDE:** Kullanıcı PLC'ye program yazabilmeli, fiziksel DTS sanal girişleriyle program taraması çalışmalı, çıkışlar gerçek DTS sanal yükleri etkilemeli. IEC benzeri özgün Network çizimi: L1/L2 dikey raylar, beyaz ızgara, yatay rung çizgileri, NO/NC, seri/paralel dallar, mühürleme, Q bobini, TON/TOF/TP ve CTU/CTD blokları, Network açıklaması, yalnız gerçek hesaplanan sinyale göre yeşil vurgular. Kontağa/bobine tıklayarak düzenleme, Undo/Redo, kaydet/aç, sanal I/O izleme. **Siemens'in telifli UI, örnek proje, binary veya .lsc formatını kopyalama.**
- **Siemens LOGO! V7 + V8.2.1 yüklenen setup'lar:** çalıştırmadan statik incelendi. Yükseltme paketinde **51 .lsc, 47 PDF, 23 JAR** örneği görüldü. `.lsc` Java serileştirmesi izi taşıyor; DTS tarafında Siemens .lsc import/export uyumluluğu iddia edilmez. Kullanıcının gönderdiği üç Ladder görseli bu konuşmaya aittir; **yeni sohbette otomatik yeniden eklenmiş kabul etme**. Görsel konseptleri burada metin olarak korunmuştur.
- **EduVolt Designer** `EduVolt_Designer_Setup_2.2.10.exe` statik incelendi (Inno Setup, EduVolt Academy, 2.2.10); çalıştırılmış ürün GUI testi yapılmadı. Kullanıcı bilgisayarında kurulu olduğunu belirtti. EduVolt bileşen seçim ve LOGO benzeri Ladder kolaylığından örnek al; klonlama yapma.
- **Simurelay** Windows Store ürün sayfası: https://apps.microsoft.com/detail/9mwmfj4l40g1?hl=tr-TR&gl=TR . Kolay, sade çizim ve kontrollü simülasyon ilkeleri düşünülür, birebir özellik garantisi verilmez.
- **703 katalog** gerçek simülasyon referansıdır. Doğrulanmış ilk PLC: `plc-hw-6es7211-1ae40-0xb0` Siemens CPU 1211C DC/DC/DC (bu bir LOGO! cihazı değildir). Bu modelin sanal terminal/çıkış-besleme/lamba durumunda **7/7 hedefli `Simulation.solve`** vakası geçmişti. Diğer PLC modellerini kanıt olmadan serbest bırakma.
- Sanal PLC Q=1 mantık çıkışı, yük kablosu veya besleme kopuksa **lambanın fiziksel olarak aktif olduğu** anlamına gelmez; simülasyonda ayrım korunur. Gerçek Siemens donanımı, online kontrol, fiziksel güvenlik, bina tesisatı kullanımına yönelik üretim yazılımı desteği **yok**.

## 4. Şimdiye kadar gerçek kaynakta eklenenler

- Ctrl/Cmd+K kütüphane arama, panel görünüm ve otomatik simülasyon odak modu, tam sayfa/geri dönüş.
- Dosya / Düzenle / Görünüm olarak gruplandırılmış üst araç çubuğu.
- `dist/ladder-runtime.js`: V1 özgün Ladder Boolean taraması, NO/NC, OUT, SET/RESET, TON/TOF/TP, CTU/CTD ve M/T/C adresleri. `dist/plc-runtime.js` entegrasyonu yalnız desteklenen modelde.
- `dist/ladder-editor.js`, `dist/ladder-diagram.js`, `dist/ladder-monitor.js`: görsel rung, canlı yol izleme, tıklanabilir kontak/bobin, Network açıklaması, geçerli program/simülasyon farkı, taslak Undo/Redo ve modal tuş odağı.
- `dist/ladder-program-io.js`: güvenli özgün `.dtsladder` JSON dışa/içe aktarımı; içe alınan program **taslak** olarak açılır. `File.text()` sırasında PLC veya proje değişirse yanlış uygulama engellenir.
- `dist/component-brief.js`: seçili katalog cihazı için model/marka/gerçek terminal kısa özeti.
- `dist/material-list.js`: çevrimdışı CSV malzeme listesi, gerçek katalog adet/referans; PDF/PNG kısmı henüz ayrı.
- `dist/wire-diagnostics.js`: kayıp bileşen, hatalı terminal/düğüm gibi gerçek yapısal kablo referanslarını tespit etme; çizimde ilgili kabloyu **salt okunur** vurgulama.
- En yeni saatlik görev commitleri `9d06175927f10756fb7d49bf8ef2027651cf9d37` (kablo vurgulama) ve `5acb3e4b4180c3c787d46eb802a63393cc9307a7` (bağımsız sanal PLC operatör I/O paneli) — gelecekte daha yeni HEAD varsa ondan devam et.
- Kod için hedefli JS/V8 doğrulamaları vardır; **tam Node.js test paketi ve gerçek Edge/Windows görsel testi bazı işler için hâlâ REVIEW/NOT_RUN**. Hiçbir 24 plan maddesi yalnız göründüğü için otomatik COMPLETE yapılmaz.

## 5. Güncel 24 maddelik plan ve eksikler

Sabit sıra: (01) üç görünüm, (02) simülasyonda kütüphane daralt, (03) özellikler paneli geri yükle, (04) tam sayfa/Esc, (05) panel kontrolleri, (06) sade araç çubuğu, (07) hızlı arama, (08) responsive ve tercihleri saklama; (09) görsel Ladder, (10) NO/NC ve bobin, (11) zamanlayıcı/sayaç/bellek, (12) gerçek PLC I/O, (13) tarama + `Simulation.solve`, (14) canlı Ladder sinyali, (15) program kaydet/aç/örnekler; (16) seçili cihaz bilgi kartı, (17) aktif elektrik yolu, (18) hatalı bağlantı rehberi ve çizimde işaretleme, (19) 2D/3D terminal devamlılığı, (20) PDF/PNG/malzeme listesi, (21) özel bileşen editörü, (22) Hızlı Başla, (23) FBD, (24) sanal operatör paneli.

**Açık kalan büyük başlıklar:** Gerçek Edge `file:///` kabulü, Ladder görsel ergonomisi ve daha zengin editör etkileşimi, başka kanıtlı PLC modelleri, tam zamanlayıcı/sayaç regresyonu, dinamik aktif enerji yolları, PDF/PNG çıktıları, güvenli görsel bileşen editörü, FBD, Hızlı Başla deneyimi. 18/20/24 kısmi ilerledi; **en güncel durum için 24 maddelik yol haritası okunur**. Kullanıcının cihazında Windows/Edge testi yapılmış gibi rapor verme.

## 6. Otomatik görev ve sohbet taşıma — ÇOK ÖNEMLİ

- Eski etkin görev: **DTS 24 Adım Geliştirme**, `jawbone_id=6ae17637890c819183b867d003e92edd`, **saatte bir**, zaman dilimi **Europe/Istanbul**. 20 dakikaya düşürme isteği olmuştu; sistemin desteklediği en hızlı aralık **1 saat**.
- Bu görev mevcut/eski sohbetin `conversation_id` bilgisine bağlı. **Mevcut otomasyonun bağlı olduğu sohbeti `update` ile değiştirmek için desteklenen bir alan yok.** Dolayısıyla otomasyonun raporlarını doğrudan yeni sohbette almak için geçiş yapmak gerekir.
- **Yeni sohbetin ilk mesajı açıkça şunu istemelidir:** (1) canlı GitHub/main ve bu devir dokümanı ile 24 maddeyi oku, (2) **aynı saatlik promptu yeni sohbet içinde yeni otomasyon olarak oluştur**, (3) **yeni otomasyonun oluştuğunu doğruladıktan sonra** eski `6ae17637890c819183b867d003e92edd` görevini `is_enabled=false` yap; aksi halde eskisini etkin bırak, (4) iki görev aynı anda etkin kalmasın; eskiyi yeni çalışmadan önce durdurmak için güvenli geçiş sırası ve güncel HEAD kontrolü uygula.
- **Şu an eski görevi durdurma**: kullanıcı yeni sohbeti açıp devir işlemini başlatana kadar saatlik çalışmaya devam etmeli. Yeni sohbet açmak/ilk mesajı göndermek kullanıcı etkileşimi gerektirir; asistan yeni sohbeti kendi başına oluşturamaz.
- Yeni otomasyonun her turu GitHub `main` HEAD, `AGENTS.md`, bu dosya ve güncel roadmap'i okumalı; kanıtlı kaynak/test onarımı `[skip ci]` ile `main` + uzak blob SHA doğrulaması yapmalı; Work/Codex/Actions/force-push yok, eski kabul kilitleri korunur, kullanıcıdan komut istenmez. Tüm maddeler **gerçekten** bitip kabul edilince görevi durdurur; bitmemiş işi COMPLETE saymaz.
