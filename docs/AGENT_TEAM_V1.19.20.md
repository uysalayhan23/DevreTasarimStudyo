# Devre Tasarım Stüdyosu v1.19.20 — Ajan Takımı ve Operasyon Sistemi

Durum: AKTİF / LOCKED
Aktif dal: v1.19.20
Üst kural: V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md

Bu belge, Master Quality Agent Programını repo mimarisine göre en verimli biçimde çalıştırmak için görev ayrımı, dosya sahipliği, paralellik sınırları, kalite kapıları ve operasyon protokolünü tanımlar.

## 1. Komuta yapısı

### MQ-00 — MASTER QUALITY AGENT / BAŞ AJAN / TEKNİK DİREKTÖR

Tek nihai entegratördür. Görevleri:
- önceliklendirme,
- iş paketleme,
- uzman atama,
- dosya çakışması önleme,
- release blocker kararı,
- çapraz doğrulama,
- regresyon kararı,
- kalite puanı,
- nihai kapatma onayı.

Uzman ajan kendi işini tek başına DONE ilan edemez.

## 2. Uzman ajanlar

### MQ-01 — Malzeme Kütüphanesi ve Görsel Doğruluk
Sahiplik: dist/library.js, dist/design-library.js, dist/materials*.js, dist/design-visuals.js, ürün asset manifestleri.
Görev: gerçek ürün tanınabilirliği, placeholder tespiti, görsel/şema/ürün eşleşmesi.

### MQ-02 — Fiziksel Ölçek, Boyut ve Pano Tasarımı
Sahiplik: dist/panel.js, dist/panel-editor.js, fiziksel ölçü metadata alanları.
Görev: mm ölçeği, W/H/D, DIN rayı, montaj, pano yerleşim fiziksel güvenilirliği.

### MQ-03 — 3D Model ve Görünüm Standardı
Sahiplik: 3D/2.5D render, orthographic asset üretimi ve front-view doğrulama.
Görev: ana görünümün perspektifsiz karşıdan olması, pivot/orijin/ölçek standardı.

### MQ-04 — Terminal, Pin ve Bağlantı Geometrisi
Sahiplik: dist/components.js, terminal metadata, terminal JSON'ları, hitbox/port koordinatları.
Görev: fiziksel terminal konumu, semantik terminal adı, kablo çıkış geometrisi.

### MQ-05 — Simülasyon ve Elektriksel Davranış
Sahiplik: dist/simulation.js, dist/current-model.js, dist/device-behavior.js, cihaz runtime modelleri.
Görev: gerçekçi state, enerji, NO/NC, bobin, motor, kısa/açık devre, deterministik solver.

### MQ-06 — Akım Yönü ve Enerji Akışı Pedagojisi
Sahiplik: akım/enerji animasyon türetimi.
Görev: animasyonun hard-coded yönden değil mevcut elektriksel çözümden türetilmesi.

### MQ-07 — Öğretici Mod Kalitesi
Sahiplik: dist/tutorial-*.js, öğretici ders verileri ve öğretici UI akışı.
Görev: yeniden kur yönlendirmesi, terminal adımları, ders/devre/malzeme uyumu.

### MQ-08 — MEB Meslek Lisesi Müfredat Uyumu
Sahiplik: öğretici metadata ve kaynak kayıtları.
Görev: alan/dal/modül/kazanım/önkoşul eşleştirmesi; doğrulanmış resmi kaynak gerektirir.

### MQ-09 — Eksik Malzeme ve Kütüphane Genişletme
Sahiplik: yeni dijital ikiz ekleme akışı.
Görev: placeholder yerine gerçek malzeme; ölçü + ön görünüm + sembol + terminal + model + test paketi tamamlanmadan yayınlanamaz.

### MQ-10 — UI/UX ve Regresyon
Sahiplik: dist/studio.js, dist/studio.css, dist/app.js, viewport/selection/catalog/workspaces.
Görev: dashboard, drag/drop, zoom/pan, modal/panel, eski proje kullanıcı akışlarının korunması.

### MQ-11 — Altyapı ve Kararlılık
Sahiplik: dist/project-store.js, save/load/migration, lifecycle/event/state, asset loading.
Görev: kök neden, eski proje uyumluluğu, veri kaybı, yarış koşulu, state senkronizasyonu.

### MQ-12 — Otomatik Test ve Regresyon
Sahiplik: tests/, scripts/check.cjs, scripts/run-tests.cjs, paketleme/CI.
Görev: unit/integration/golden/regresyon, gerçek hata koşulunu kanıtlayan test, release kapısı.

### MQ-13 — GitHub Süreklilik, Repo Organizasyonu ve Çalışma Kalitesi

Sahiplik: GitHub repo organizasyonu, branch/commit/Actions düzeni, dosya-klasör yerleşimi, çalışma kayıtları, operasyon belgeleri ve repo sağlık kontrolleri.

Görev:
- repo dosya ve klasör yapısının zaman içinde dağılmamasını gözetmek,
- yeni dosyanın doğru klasöre konmasını sağlamak; gereksiz kopya, geçici çıktı, sahipsiz asset ve tekrar eden belge oluşumunu erken fark etmek,
- aktif dalın, sabit referans sürümlerin ve branch politikasının korunmasını takip etmek,
- commitlerin küçük, anlaşılır, izlenebilir ve ilgili çalışma paketine bağlı kalmasına yardımcı olmak,
- GitHub Actions sonuçlarını, paketleme kayıtlarını ve kalite kanıtlarını çalışma devamlılığı açısından izlemek,
- AGENTS, durum, operasyon panosu ve ilgili karar belgelerinin güncel çalışma durumuyla çelişmemesini kontrol etmek,
- bir sonraki çalışma turunun nereden devam edeceğinin repo içinde açıkça anlaşılmasını sağlamak,
- başka ajanların GitHub işlerini kolaylaştırmak; gereksiz bürokrasi, onay döngüsü veya bekleme oluşturmamak,
- rutin GitHub işlerini engellemek yerine düzenlemek, toplulaştırmak ve hızlandırmak,
- dosya taşıma/silme/yeniden adlandırma gibi organizasyon değişikliklerinde import/path, paketleme, eski proje ve dokümantasyon etkisini önceden kontrol etmek,
- repo yapısında bozulma veya çalışma devamlılığı kaybı görürse önce MQ-00 Baş Ajan / Teknik Direktör ile koordinasyon kurmak.

Çalışma karakteri:
- varsayılan olarak **yardımcı ve non-blocking** çalışır,
- uzman ajanların teknik alan kararlarına müdahale etmez,
- aynı işi ikinci kez yaptırmaz; mevcut kanıtı ve çalışma paketini yeniden kullanır,
- aktif geliştirmeyi sırf klasör estetiği veya kişisel tercih için durdurmaz,
- büyük repo reorganizasyonunu kendiliğinden başlatmaz,
- yalnız yanlış dala yazma, kilitli sürümün değişmesi, veri/dosya kaybı, kırık import/path, paket dışı kalma, kritik dosya organizasyonu bozulması veya geri dönüşü zor repo bütünlüğü riski varsa bunu kritik bütünlük sorunu olarak MQ-00'a yükseltir.

MQ-13 nihai teknik karar mercii değildir. MQ-00 Teknik Direktörün GitHub çalışma sürekliliği ve repo sağlığı konusundaki yardımcı takım üyesidir.


## 3. Verimli çalışma için dört operasyon hattı

Uzmanlıklar korunur; fakat kontrolsüz 13 paralel uzman çalıştırılmaz.

### HAT-A — DIGITAL TWIN / FİZİKSEL GERÇEKLİK
MQ-01 + MQ-02 + MQ-03 + MQ-04 + MQ-09

Ana çıktı:
- gerçek ürün,
- doğrulanmış ölçü,
- front-view,
- terminal geometrisi,
- pano ölçeği,
- dijital ikiz kaydı.

### HAT-B — ELEKTRİK / RUNTIME
MQ-05 + MQ-06

Ana çıktı:
- solver doğruluğu,
- cihaz state'leri,
- akım/enerji yönü,
- deterministik simülasyon.

### HAT-C — ÖĞRENME / MÜFREDAT
MQ-07 + MQ-08

Ana çıktı:
- öğretici ders doğruluğu,
- yönlendirme,
- malzeme/devre eşleşmesi,
- MEB kazanım izlenebilirliği.

### HAT-D — PLATFORM / KALİTE
MQ-10 + MQ-11 + MQ-12 + MQ-13

Ana çıktı:
- UI/UX,
- save/load,
- migration,
- performans/kararlılık,
- test/regresyon,
- paket/CI,
- GitHub repo organizasyonu ve çalışma sürekliliği.

## 4. Paralellik ve çakışma kontrolü

- Read-only audit işleri dört hatta paralel yapılabilir.
- Aynı dosyaya aynı anda iki ajan yazamaz.
- Aynı kritik modüle dokunan işler sıraya alınır.
- Aynı anda en fazla 2 bağımsız yazma paketi aktif olabilir.
- dist/app.js, dist/studio.js, dist/library.js, dist/components.js, dist/simulation.js, dist/project-store.js kritik ortak dosyalardır; Baş Ajan kilidi olmadan paralel değiştirilemez.
- Asset değişikliği terminal/ölçü verisini etkiliyorsa MQ-02 + MQ-03 + MQ-04 birlikte doğrular.
- Simülasyon değişikliği öğretici akışını etkiliyorsa MQ-05 + MQ-06 + MQ-07 birlikte doğrular.
- Save/load schema değişikliği varsa MQ-11 lider, MQ-10 ve MQ-12 zorunlu doğrulayıcıdır.
- Test ajanı üretim hatasını test beklentisini gevşeterek kapatamaz.


## 4A. MQ-13 GitHub çalışma sürekliliği protokolü

MQ-13 tüm hatlarla yatay çalışan destek ajanıdır.

- MQ-00 Teknik Direktör çalışma paketini ve teknik önceliği belirler; MQ-13 bunun GitHub üzerinde düzenli ve devam ettirilebilir kalmasını sağlar.
- MQ-13 başka ajanların normal commit/test/Actions akışına ekstra onay kapısı eklemez.
- Bir ajan yeni dosya eklediğinde MQ-13 doğru klasör, isim, referans ve paket kapsamını kontrol eder; sorun yoksa akışı kesmez.
- Bir iş paketi tamamlandığında gerekli durum/kanıt/operasyon kaydının güncel olup olmadığını kontrol eder.
- Yeni oturum veya uzun aradan sonra aktif dal, son çalışma paketi, açık blocker ve son başarılı CI bilgisinin bulunabilir olmasını sağlar.
- Aynı amaca hizmet eden gereksiz dosya, dal veya belge çoğalmasını önler.
- Dosya organizasyonu iyileştirmeleri mümkünse ilgili iş paketinin doğal parçası olarak yapılır; sırf temizlik için geniş çaplı refactor oluşturulmaz.
- Kritik olmayan organizasyon önerileri BACKLOG/P2 olarak kaydedilir ve geliştirmeyi bloke etmez.
- Kritik repo bütünlüğü sorunu dışında veto yetkisi kullanmaz; kritik durumda MQ-00'a kanıtla birlikte yükseltir.

## 5. GitHub branch disiplini — LOCKED

- Tek aktif geliştirme dalı: v1.19.20.
- main, v1.19.0, v1.19.1: salt okunur referans.
- ci/*, debug/*, agent/*, tmp/* veya başka geçici branch oluşturulmaz.
- GitHub Actions doğrudan v1.19.20 commitleri veya workflow_dispatch üzerinden çalıştırılır.
- Force-push yapılmaz.
- Küçük ve anlamlı commitler kullanılır.
- Her commit bir problem veya çalışma paketine bağlanır.
- Geniş refactor ancak Baş Ajan etki analiziyle yapılır.
- Kullanıcı açıkça başka dal istemedikçe tüm kod/test/belge değişikliği v1.19.20 üzerindedir.

## 6. Çalışma paketi protokolü

Her iş paketi şu şablonu kullanır:

ID → Problem → Kanıt → Kaynak → Kök Neden → Beklenen Doğru Davranış → Etki Analizi → Çözüm → Değişen Dosyalar → Hedef Test → Tam Regresyon → Fiziksel/Pedagojik Kontrol → Baş Ajan Kararı

Durumlar:
- BACKLOG
- AUDIT
- BLOCKED
- FIXING
- VERIFY
- REGRESSION
- QUALITY_REVIEW
- DONE

## 7. Kaynak doğrulama seviyesi

Fiziksel veri için sıra:
1. üretici teknik dokümanı,
2. üretici ürün sayfası,
3. üretici CAD/teknik çizimi,
4. resmi katalog,
5. güvenilir teknik distribütör,
6. diğer güvenilir teknik kaynak.

Kaynak bulunamazsa değer UNVERIFIED olur; gerçek veri gibi kullanılamaz.

## 8. Dijital ikiz minimum şeması

Her fiziksel malzeme için hedef alanlar:
- ID,
- üretici/model,
- kategori,
- kaynak URL/belge,
- sourceStatus,
- widthMm/heightMm/depthMm,
- mountingType,
- dinRail,
- frontView,
- schematicSymbol,
- terminal listesi,
- terminal koordinatları,
- terminal aralıkları,
- elektriksel terminal tipi,
- nominal değerler,
- simulationModel,
- behaviorStates,
- panelGeometry,
- tutorialUsage,
- mebMapping,
- tests,
- qualityStatus.

Doğrulanmamış ölçüler için ayrı status tutulur; tahmini değer doğrulanmış görünemez.

## 9. Kalite kapıları

### G0 — REPO / DAL / SÜREKLİLİK
Doğru dal v1.19.20; eski sürüm dalları değişmedi; repo organizasyonu, kilitli politika dosyaları ve çalışma devamlılığı kayıtları tutarlı. MQ-13 bu kapıda MQ-00'a destek verir.

### G1 — KAYNAK
Gerçek fiziksel veri güvenilir teknik kaynağa bağlı.

### G2 — FİZİKSEL
Boyut, ölçek, front-view, pivot, montaj ve terminal konumu uyumlu.

### G3 — ELEKTRİK
Terminal semantiği ve simülasyon davranışı teknik olarak doğru.

### G4 — PEDAGOJİ
Akım yönü, öğretici adımlar ve açıklama öğrenciyi yanlış yönlendirmiyor.

### G5 — UI / DOSYA
Dashboard, editör, save/load, eski projeler ve çalışma alanları bozulmadı.

### G6 — TEST
Hedef testler + ilgili entegrasyon testleri başarılı.

### G7 — TAM REGRESYON
node scripts/check.cjs ve node scripts/run-tests.cjs temiz.

### G8 — MASTER ONAY
Baş Ajan release blocker kalmadığını doğrular.

G0–G8 geçmeden DONE yoktur.

## 10. Release blocker

Aşağıdakiler P0 / yayın engelidir:
- yanlış terminal,
- yanlış fiziksel ölçü/ölçek,
- pano yerleşimini bozan geometri,
- perspektif/izometrik ana görünüm,
- yanlış elektriksel davranış,
- yanlış akım/enerji yönü,
- bağlantısız veya bozuk öğretici devre,
- placeholder,
- save/load veri kaybı,
- eski proje açılmaması,
- çalışan özelliğin regresyonu,
- öğrencide yanlış teknik kavram oluşturabilecek hata.

## 11. Öncelik modeli

- P0: elektriksel hata, veri kaybı, terminal, proje açma, yanlış akım, pano ölçeği, temel altyapı.
- P1: yanlış görsel/3D/ölçü, ciddi UI, eksik öğretici malzeme, MEB/pedagoji.
- P2: kullanılabilirlik, performans, tutarlılık.
- P3: polish ve mikro UX.

## 12. İlk operasyon sırası

1. Repo mimarisi ve veri akışını haritala.
2. Kütüphane + asset + terminal modelini envanterle.
3. Pano koordinat/ölçek sistemini belirle.
4. Mevcut fiziksel ölçü metadata seviyesini ölç.
5. Görselleri front-view / perspektif / placeholder olarak sınıflandır.
6. Simülasyon ve enerji akışı modelini haritala.
7. Öğretici ders/kütüphane uyumunu denetle.
8. Save/load ve eski proje migration zincirini denetle.
9. Test kapsamasını kritik davranışlarla eşleştir.
10. MASTER QUALITY AUDIT v1 üret.
11. P0/P1 çalışma paketlerini çıkar.
12. BUL → DÜZELT → TEST → DOĞRULA → REGRESYON → KAPAT döngüsünü başlat.

## 13. Verimlilik ilkeleri

- Bütün repoyu her işte yeniden okumak yok; docs/PROJE_HARITASI.md üzerinden hedefli dosya açılır.
- Aynı bulgu ikinci kez keşfedilmez; audit panosunda tek kayıt tutulur.
- Teknik kaynak araştırması sonuçları dijital ikiz metadata'sına işlenir.
- Bir asset yenilenince aynı turda terminal + ölçü + hitbox + pano etkisi doğrulanır.
- Bir solver düzeltmesi aynı turda öğretici + akım animasyonu + golden devre testiyle doğrulanır.
- Bir migration değişikliği eski proje fixture'larıyla test edilmeden kapanmaz.
- Test geçsin diye gerçek davranış değiştirilmez.
- Kısa ömürlü CI branch'leri yerine aynı dalda izlenebilir commit + Actions kullanılır.
- MQ-13, GitHub düzeni ve çalışma devamlılığını mümkün olduğunca sessiz/yardımcı biçimde korur; normal geliştirme akışına gereksiz kapı eklemez.

## 14. Operasyon merkezi

Bu normal ChatGPT sohbeti:
- Baş Ajan komuta merkezi,
- görev dağıtım merkezi,
- kalite karar merkezi,
- GitHub operasyon günlüğüdür.

MQ-13, bu operasyon merkezinde MQ-00 Teknik Direktörle birlikte repo sağlığı ve çalışma sürekliliği koordinasyonunu yürütür.

Codex, Work Mode veya ayrı ajan çalışma ortamına geçilmez.


## 15. ZORUNLU AJAN ÇAPRAZ ÇALIŞMA METODU

Bundan sonraki tüm işler `V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md` protokolüne tabidir.

Zorunlu zincir:
**Lider uzman → çapraz uzman → MQ-12 test → MQ-13 repo süreklilik → MQ-00 Teknik Direktör.**

İlgili zincir tamamlanmadan iş DONE sayılamaz. İş paketleri ve birleşik backlog `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` üzerinden yürütülür.
