# Siemens LOGO! Soft Comfort V7 / V8.2.1 — DTS Ladder Teknik Referansı
**İnceleme:** 27 Ekim 2026 · **Kaynak:** kullanıcının doğrudan yüklediği iki Windows kurulum dosyası · **Yöntem:** yalnız pasif/statik analiz; EXE çalıştırılmadı.

> **Ana yönlendirme:** Bu belge DTS için özgün bir Ladder editörü ve eğitim simülatörü geliştirmeye rehberdir. Siemens'e ait binary, kaynak kodu, logoları veya örnek projeleri depoya kopyalama. Kullanıcı ders onarımı talep etmedikçe ders dosyalarına dokunma. Ders değişikliği istendiğinde önce [ders kayıt dosyasını](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md) oku.

## İncelenen yüklemeler ve doğrulanabilir bulgular

| Dosya | Boyut | SHA-256 | İnceleme |
|---|---:|---|---|
| `Step1_SetupLOGOSoftComfort7x64.exe` | 62.092.209 bayt | `0c8ac1fcd1c69d902ccaeada3fba6bb32f88d86773105b39cab760cfbb1f459d` | Windows PE32 kurulum kabuğu; 'Advanced Installer' imzeleri var; dış veri katmanı, kurulu yazılım çalıştırılmadı |
| `Step2_LOGO_Upgrade_V8.2.1_For_Windows64.exe` | 165.043.940 bayt | `25321bf98816bcc2dec9b492a5403fc5ae90b4a08d873e9639504e64c78c0acd` | Windows PE32 kurulum kabuğu, InstallAnywhere/ZeroG izleri, gömülü ZIP veri katmanları ve JRE |

**Önemli:** PE32 kabuk, içerideki kurulu uygulamanın 32 bit olduğunu kanıtlamaz; her iki dosya adı 64-bit Windows kurulumu içindir. Dosya hash'leri yüklenen kopyaları tanımlar; dijital imza ya da zararsızlık garantisi değildir. Kurulumlar çalıştırılmadığı için tam sürüm/çalışma performansı ve GUI akışı Windows üzerinde doğrulanmış değildir.

### Step2 gömülü örnek ve kaynak envanteri

Kurulumdaki `InstallerData/Disk1/InstData/Resource1.zip` adlı iç katmanda **157 arşiv girdisi** (klasörler dâhil) görüldü:
- **51 adet `.lsc` LOGO! proje örneği**.
- **47 adet PDF örnek açıklaması**.
- **23 adet JAR**, geri kalan dosyalarda DLL, özellik/kurulum dosyaları ve yardımcı kaynaklar var.
- Mevcut örnek konular arasında **Interlocking circuit**, **Traffic signals**, **Controlling 2 outputs with one pushbutton**, **Control of pump pairs**, **Control system for 4 conveyor belts, connected in series**, **Correct scaling of a 4-20mA sensor**, **Closed-loop control and pulse width modulation**, **Shift register**, **Silo-filling system**, **Bell system for schools** yer alıyor.

Örnek `.lsc` dosyalarının ilk baytları `AC ED 00 05`, yani **Java nesne serileştirme akışına** karşılık geliyor. Birkaç örnekte proje modeli ve grafik bileşen sınıf adları yer alıyor. Bu format doğrudan JSON/XML gibi işlenebilir kabul edilmemeli; DTS'nin ilk sürümü için **Siemens .lsc import/export uyumluluğu iddia edilmemeli**. Siemens sınıfları/özel dosya biçimini yeniden üretme yoluna gitmek yerine işlevsel olarak eşdeğer, özgün DTS şeması kullanılmalı. Kaynak örneklerin gerçek simülasyon sonuçları çalıştırılarak karşılaştırılmadı.

## Resmi kaynaklarla doğrulanan LOGO! işlevleri

- Siemens LOGO! Soft Comfort LAD (Ladder Diagram) ve FBD (Function Block Diagram) düzenleyicileri ve kullanıcı fonksiyonu UDF sunar.
- **Offline simülasyon** PC içinde, fiziksel LOGO! PLC olmadan kullanıcı tarafından ayarlanan sanal girişlerle çalışır.
- **Online test** farklıdır: program bir gerçek LOGO! modülünde çalışır, yazılım durumları izler. DTS'nin ilk hedefi yalnız **offline eğitim simülasyonu**dur; gerçek Siemens donanımına bağlanma ve program indirme yoktur.
- Simülasyon sırasında mantıksal 0/1 bağlantı durumları, değişken/veri tabloları, zaman sınırları ve analog trendler gösterilebilir. Bu işlevler DTS'de özgün görünüm olarak uygulanabilir.
- Siemens LAD↔FBD dönüşümünde her yapı birebir karşılık bulmayabilir; DTS'de dönüşüm ancak işlevsel eşdeğerlik testleriyle açılmalıdır.

**Dış kaynaklar (kamuya açık tanımlar):**
- https://sieportal.siemens.com/en-hr/products-services/10029112
- https://support.industry.siemens.com/cs/attachments/109768852/Help_en-US.pdf (V8.2.1 kullanıcı yardımı)
- https://www.siemens.com/tr-tr/products/logo/software/ (ilerideki V9 özellikleri ayrı nesil olarak ele alınmalı)

## DTS özgün Ladder mimarisi: 10 maddelik yeni yapılacaklar

| No | Yapılacak iş | Kanıt / kabul şartı | Durum |
|---|---|---|---|
| L01 | PLC seçiliyken **Ladder Programla** düğmesi ve ayrı editör penceresi | Diğer DTS çalışma alanları, `BASLAT.bat`, offline Edge korunur | PLAN |
| L02 | Bağımsız proje verisi: `rungs`, contacts, coils, branches, operands, instruction IDs | Kaydet/aç/undo/redo ve şema tutarlılığı testi | PLAN |
| L03 | NO, NC, seri/paralel, standart çıkış bobini | Her biri gerçek Boolean pozitif/negatif test | PLAN |
| L04 | SET/RESET, bellek bitleri ve ayrık tarama çevrimi | Latch/reset, güç başlangıcı ve bellek senaryoları | PLAN |
| L05 | TON, TOF, TP, sayıcı CTU/CTD, kenar algılama | Simülasyon saatiyle zaman ve sıfırlama senaryoları | PLAN |
| L06 | I1..In/Q1..Qn ve iç M bitlerini **gerçek DTS sanal PLC uçlarıyla** eşleştirme | `Simulation.solve` özgün katalog terminalleri; geçersiz adres blokajı | PLAN |
| L07 | Giriş değişimi → Ladder scan → çıkış → bağlı sanal cihaz → tekrar çözücü döngüsü | Birbiriyle tutarlı örnek, tutarsız/bozuk bağlantı negatif testleri | PLAN |
| L08 | Canlı izleme: lojik akış, 0/1, timer/sayaç, force olmayan kontrollü sanal giriş | Gösterilen durum gerçek hesaplanan durumdan türemeli; dekoratif animasyon olmamalı | PLAN |
| L09 | Program kaydetme, açma, sürümleme; kullanıcının özel örneklerini hazır örneklerden ayırma | Golden/readonly/Farklı Kaydet kuralları | PLAN |
| L10 | İleri aşama: FBD, online benzeri **yalnız sanal** izleme ve proje aktarım biçimi | LAD/FBD eşdeğerliği; Siemens dosya uyumluluğu ayrı lisans/teknik inceleme | PLAN |

## Kullanıcı kabulüne uygun hedefli sanal örnekler

1. **Start/Stop + mühürleme:** start sonrası Q1 tutar; stop, bağlantı kopması ve yeniden başlatma durumları doğru davranır.
2. **İleri/geri elektriksel kilitleme:** sanal iki çıkış aynı anda aktif olamaz; hata durumları test edilir.
3. **Zamanlayıcı:** TON gecikmesi, TOF gecikmesi, durdurma sonrası zaman sıfırlama; kontrollü sanal saat.
4. **Sayaç ve sıra:** CTU/CTD/sıralı konveyör gibi eğitim örneklerinde reset ve adım doğrulaması.
5. **Trafik ışığı:** durum geçişleri ve çıkış çakışmalarına yönelik sanal güvenlik testi.
6. **4–20mA sensör:** yalnız doğru katalogya bağlı sanal akım/analog ölçekleme modeli varsa hesaplama; aksi halde REVIEW.

**Yüklenen Siemens örneklerini olduğu gibi import edip DTS içinde çalıştırmak veya PDF/projeleri GitHub'a kopyalamak bu planın parçası değildir.** Örnek konuları özgün DTS sahnelerinde bağımsız olarak geliştir.

## Öncelik sırası / çalışma kararı

- **Önce UI:** Standart, Simülasyon Odak, Tam Sayfa; panellerin geçici kapanması ve özgün tercihlerin geri gelmesi.
- **Sonra PLC çekirdeği:** L01–L07, donanım üzerinden değil gerçek DTS native simülasyonu ile hedefli test.
- **Sonra öğretici ve izleme:** L08–L09; bileşen açıklamaları kısa, anlaşılır Türkçe.
- **En son ileri FBD:** L10, ayrı kabul.

Sadece kaynak denetimi ve teknik plan üretildi. **DTS Ladder runtime implementasyonu / native simülasyon PASS / Windows görsel kabulü / gerçek LOGO! donanım desteği bu inceleme ile tamamlanmış sayılmaz.** GitHub commit ve dosya SHA yalnız belgenin teslimini kanıtlar.
