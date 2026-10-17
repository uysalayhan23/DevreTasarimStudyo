# Devre Tasarım Stüdyosu — geliştirme kuralları

Bu depo Ayhan Uysal'ın oğlu Yakub için geliştirdiği Türkçe, çevrimdışı eğitim uygulamasıdır. Mevcut uygulamayı koruyarak küçük ve ilgili değişiklikler yapın. Kullanıcının güncel açık talimatı bu belgelerden önce gelir; çelişki varsa eski kuralı sessizce doğru kabul etmeyin.

## Güncel aktif repo/dal ve tarihsel referanslar (2026-10-11)

- Kullanıcının 2026-10-10 sonrasında verdiği açık talimata göre **tek aktif repo `uysalayhan23/DevreTasarimStudyo`, tek aktif çalışma dalı `main`**. Önceki belgelerde `main` dalını salt okunur ve `v1.19.20` dalını tek yazılabilir dal gösteren ifadeler **tarihsel talimattır**, bu repodaki güncel yönlendirme değildir.
- Önceki v1.18.0 golden sabit commit `e00b6fcf0ea3eb721eae8285beb7052573b61373` tarihsel geri dönüş referansıdır; bu referansı, `v1.19.0` ve `v1.19.1` dallarını değiştirmeyin. Yeni `main` HEAD geçmiş golden SHA ile aynıymış gibi raporlamayın.
- `v1.19.20` etiketli kilitli **teknik kalite standartları, çalışma uzayı, testler, ajan akışı ve tek backlog** yeni `main` dalında aynen uygulanmaya devam eder. Dokümanlardaki tarihsel dal adları teknik kilitlerin kaldırılması anlamına gelmez.
- **GitHub Actions kullanıcının ayrı açık izni olmadan kesinlikle çalıştırılmaz**; `workflow_dispatch`, rerun, Actions dakika harcatan başka tetikleme yapılmaz. Commit mesajlarında `[skip ci]` kullanılır. Mevcut workflow dosyalarını tetiklemek amacıyla değiştirmeyin.
- Normal ChatGPT + GitHub çalışma yöntemi geçerlidir; Codex/Work Mode kullanılmaz. Rutin okuma, inceleme, küçük güvenli değişiklik, test, commit ve push için tekrar onay istenmez; doğrulanmamış PASS/DONE kaydı verilmez.
- Force-push ve gereksiz geçici `ci/*`, `debug/*`, `agent/*`, `tmp/*` dalları açılmaz. GitHub sunucu koruma ayarı uygulanmamışsa yalnız dosya içi 'lock' ile korunduğu iddia edilmez.

## Zorunlu durum bildirimi ve devam kontrolü (2026-10-17)

- Kullanıcıya belirsiz ve ucu açık bir “devam ediyorum / yapacağım” mesajı bırakmak yasaktır. Her çalışma yanıtında **(1) ŞU AN yapılan somut iş, (2) tamamlanan kanıt/commit, (3) kullanıcıdan istenen tek net işlem veya “Şu an senden hiçbir şey istemiyorum”, (4) DURUM: ÇALIŞIYORUM / BEKLEMEDEYİM / TAMAMLANDI / ENGEL VAR** açıkça yazılır. İşin kapsamını (tek düzeltme, 200 derslik paket, tam regresyon) birbirine karıştırmayın.
- Gerçek GitHub araç çağrısı veya test yürütülmüyorsa **arka planda çalışılıyormuş gibi konuşulmaz**: açıkça “BEKLEMEDEYİM — yeni kullanıcı komutu gelene kadar işlem yok” denir. Yanıt bittiğinde sessizce saatlerce sürecek otomatik geliştirme vaadinde bulunulmaz; sohbet dışı arka plan faaliyeti yoksa yok denir.
- Çok adımlı görevde başlarken ne yapılacağı ve bitiş ölçütü söylenir; işlem sürerken gerçekten yapılan somut işler hakkında kısa güncellemeler verilir. “Bir sonraki adım” ile “şu an yapıyorum” birbirinden ayrılır. Başarılı commit + kaynak kontrolü tamamlanmış ama Windows native test koşulmamışsa **KOD KAYDEDİLDİ / WINDOWS TESTİ BEKLENİYOR** diye belirtilir; PASS söylenmez.
- Her çalışma **turunun sonunda**, kullanıcıya **kısa ve tek başına kullanılabilir devam prompt'u** verilir ve sohbet arayüzü destekliyorsa gerçekten çalışan **“Devam et”** butonu yerleştirilir. Buton bir sonraki mesaj olarak prompt'u gönderir; kendiliğinden arka plan görevi başlatmaz. İş tümüyle bittiyse sıradaki görevi açıklar; kullanıcı kararı olmadan otomatik başlatmaz.
- Son satırda yanlış anlaşılmayacak şekilde **“Şu anda beklemedeyim; Devam et dediğinde [somut sıradaki iş] ile devam edeceğim.”** veya araç çağrısı gerçekten sürüyorsa **“Şu anda [somut iş] üzerinde çalışıyorum; senden [istek/yok]”** bildirilir.
- 200'er derslik geliştirmede kullanıcıdan her küçük commit için Windows CMD çıktısı istenmez. Yalnızca paket bitiminde tek toplu komut ve gerektiğinde kısa görsel kontrol sorulur; kritik engel bunun istisnasıdır. **İş gerçekten yürütülmüyorsa “200 dersi düzeltiyorum” diye sürekli çalışma izlenimi verilmez.** Teknik kilitler, `main`, `[skip ci]`, Actions yasağı ve kanıtsız kabul etmeme politikası aynen korunur.

## Yeni oturumda

1. `git status` ile mevcut kullanıcı değişikliklerini görün; silmeyin veya üzerine yazmayın.
2. `docs/DURUM_VE_SINIRLAR.md` ve `docs/KURALLAR_VE_KILITLER.md` okuyun.
3. `docs/PROJE_HARITASI.md` üzerinden yalnız ilgili kaynak ve test dosyalarını açın. Bütün görselleri/PDF'leri her görevde yeniden okumayın.
4. `docs/TALEPLER_VE_KARARLAR.md` geçmiş kararları; `docs/GELISTIRME.md` çalışma ve paketleme yöntemini içerir.

## Korunacak temel davranışlar

- Hazır örnekler salt okunurdur. Yalnızca başarılı **Farklı Kaydet** yeni kimlikle düzenlenebilir kopya açar. İptal/hata/indirme belirsizliği özgün örneğin kilidini kaldırmaz. Örneği kaydetmek için `defaultTemplate` silerek kilit atlamayın.
- Simülasyon çalışırken düzenlenebilir projede eleman/kablo/yerleşim/özellik değişiklikleri canlı yapılabilir ve simülasyon yeni devreye göre yeniden çözülür. Kablo/terminal teması bloklayan modal açmaz; görünür canlı-düzenleme uyarısı verir. Etkileşimli cihaz normal tıklamayla çalışır, simülasyonda fiziksel taşıma için Alt+sürükle kullanılır. Hazır örnek koruması devam eder.
- Arduino bulunan projede bağımsız küçük Serial Monitor çalışma alanını kapatmadan açılabilir; simülasyon sırasında canlı çıktı, baud, gönderme ve temizleme işlevleri korunur.
- Farklı besleme hatlarını doğrudan birleştirmeyin. Silinmiş son kablo rengin kullanım kilidini bırakır. Pano kablo renkleri, EX/SIG ve prob renkleri özel kurallara tabidir; ayrıntıları kurallar belgesindedir.
- Panoda bir kabloyu seçmek/taşımak/silmek diğer kabloları yeniden yönlendirmez. Kablolar aynı kanalda üst üste geçebilir. ACS800/TX11 bağlantıları görselin üstünde, problar en üstte görünür.
- Model, terminal ve proje kimliklerini uyumluluk göçü olmadan değiştirmeyin. Görsel değişiklik elektriksel davranışı kendiliğinden değiştirmez. Tek bir çizici kütüphane ve çalışma alanında tutarlı kullanılmalıdır.
- `BASLAT.bat` → `dist/index.html` çevrimdışı başlangıcı korunur. CDN, zorunlu sunucu, dış font veya internet gerektiren çalışma bağımlılığı eklemeyin.
- **KİLİTLİ dashboard yapısı:** dört ana kart (Kumanda, Tesisat/Dağıtım, Pano, Arduino) birlikte korunur. Merkezi dashboard event-delegation, launcher paket doğrulaması ve görünür başlangıç-hatası mekanizması kullanıcı açıkça istemeden değiştirilmez veya kaldırılmaz.
- Üretici firmware'inin tamamını, PLC program yürütmeyi veya tüm CAD modellerini destekliyormuş gibi göstermeyin. Gerçek kapsamı ve doğrulama sınırlarını açık yazın.

## Çalışma yöntemi

- İlgili davranış testlerini çalıştırın; teslim edilecek paket için mevcut tam regresyon komutu `node scripts/run-tests.cjs`dir. Sırf uygulamayı tekrar eden test eklemeyin. Düzeltmede gerçek hata koşulunu doğrulayın.
- `node scripts/check.cjs` yerel bağımlılıkları, sözdizimini, kütüphane kimliklerini ve örnek kilitlerini kontrol eder. `python3 scripts/package.py` Windows uyumlu ZIP üretip çıkarılan dosyaların özetlerini doğrular.
- Test geçsin diye varsayılan örnek korumasını kaldırmayın; düzenleme testinde `Projects.editableCopy` ile kişisel kopya kullanın.
- Kullanıcı değişikliklerini koruyun. Başkasının yeni commit'ini ezmeyin; force-push kullanmayın. Boş depoya ilk aktarım tamamlandıktan sonra güncel dalı okuyup küçük ve açıklayıcı commit'ler hazırlayın.
- Yeni davranış/karar varsa ilgili kurallar, durum ve sürüm notunu da güncelleyin. Bitmemiş işi bitmiş diye kaydetmeyin. DOM testi, gerçek Windows/Edge görsel testi değildir.
- Türkçe, kısa ilerleme ve sonuç mesajları kullanın. Rutin ve zaten yetkilendirilmiş işler için tekrar onay istemeyin. Erişim eksikliğinde hangi somut adımın yapılamadığını söyleyin.
- v1.19.20 için kullanıcı çok ajanlı kalite takımını açıkça yetkilendirmiştir. `V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md` ve `docs/AGENT_TEAM_V1.19.20.md` zorunlu çalışma modelidir. Read-only audit hatları paralel olabilir; aynı dosyaya yazan işler seri yürütülür ve Baş Ajan entegrasyonu olmadan iş kapatılmaz.

Bu dosya uygulama içindeki kilitleri belgeler; GitHub dal koruması veya Windows dosya izni oluşturmaz.


- Arduino gelişmiş donanım regresyonu: LCD1602/I2C, 7-segment, SG90, Stepper/A4988/NEMA17, HW-131, NE555 ve HC-05/HC-06 davranışları `tests/arduino-advanced-hardware-v119.test.cjs` ile korunur. Görsel yenileme bu runtime davranışlarını kaldırmamalıdır.

## v1.19.20 MASTER QUALITY AGENT LOCK

- Bu dalda Master Quality Agent Program **LOCKED** durumundadır.
- Normal ChatGPT sohbeti + GitHub dışında çalışma ortamına geçilmez; Codex ve Work Mode kullanılmaz.
- Geçici `ci/*`, `debug/*`, `agent/*`, `tmp/*` branch oluşturulmaz.
- GitHub Actions **çalıştırılmaz**; yalnız kullanıcının ayrı açık izniyle ilerlenebilir. Güncel çalışma dalı `main`dir.
- Fiziksel ürün verisi uydurulmaz; üretici/CAD/katalog kaynak önceliği uygulanır.
- Gerçek pano ölçeği için doğrulanmış mm ölçüleri, ortografik karşıdan görünüm ve terminal geometrisi release kriteridir.
- P0/P1 kalite sorunları raporla bırakılmaz; güvenli ve uygulanabilir ise BUL → DÜZELT → TEST → REGRESYON → MASTER ONAY döngüsü tamamlanır.
- Uzman ajan yaptığı işi tek başına DONE ilan edemez.
- Üst kurallar: `V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md` ve `docs/AGENT_TEAM_V1.19.20.md`.

- **MQ-13 GitHub Süreklilik, Repo Organizasyonu ve Çalışma Kalitesi Ajanı** takımın kalıcı destek üyesidir. MQ-00 Baş Ajan / Teknik Direktör ile uyumlu çalışır; repo dosya-klasör düzeni, branch/commit/Actions sağlığı, karar/durum belgelerinin devamlılığı ve bir sonraki çalışma turunun izlenebilirliğinden sorumludur.
- MQ-13 normal geliştirme akışına gereksiz onay kapısı eklemez ve rutin GitHub işlerini bloke etmez. Kritik olmayan organizasyon önerilerini iş akışını kesmeden kaydeder.
- MQ-13 yalnız yanlış dal, kilitli referans değişikliği, veri/dosya kaybı, kırık import/path, paket dışı kalma veya geri dönüşü zor repo bütünlüğü riski gibi gerçek kritik sorunları MQ-00'a yükseltir.
- Dosya taşıma, silme veya yeniden adlandırmada ilgili import, asset referansı, paketleme, test ve eski proje etkisi kontrol edilmeden geniş repo reorganizasyonu yapılmaz.



## Zorunlu v1.19.20 ajan çalışma protokolü

- Bundan sonraki tüm teknik işler `V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md` metodunu uygular.
- Zorunlu sıra: lider uzman → çapraz uzman → MQ-12 test kanıtı → MQ-13 GitHub/repo süreklilik → MQ-00 Baş Ajan/Teknik Direktör kararı.
- Bu zincir tamamlanmadan hiçbir P0/P1/P2 çalışma paketi DONE yapılamaz.
- Tek birleşik düzeltme/backlog kaynağı `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` dosyasıdır.
- Yeni bulgu mevcut kök nedenle aynıysa yeni ID açılmaz; mevcut kayda eklenir.
- MQ-13 rutin çalışmayı bloke etmez; repo sürekliliğini destekler ve yalnız kritik bütünlük riskini MQ-00'a yükseltir.


## Teknik Direktör yönetimli aktif ajan orkestrasyonu

- MQ-00, tüm çalışma paketlerinde Teknik Direktördür.
- `V1.19.20_TECHNICAL_DIRECTOR_ORCHESTRATION_LOCKED.md` zorunlu orkestrasyon kuralıdır.
- Ajan takımı planlama, audit, design review, uygulama, crosscheck, test, regresyon, repo review ve master review boyunca etkin kullanılır.
- Her önemli işte minimum aktif ekip: MQ-00 + lider uzman + farklı risk alanından çapraz uzman + MQ-12 + MQ-13.
- Etkilenen başka alan varsa ilgili uzman ajan da sürece dahil edilir.
- Gereksiz ajan kalabalığı ve tekrar analiz oluşturulmaz; Teknik Direktör en etkili uzman kombinasyonunu seçer.
- Katılım ve kanıt kaydı bulunmadan DONE kararı verilemez.


## Ortak çalışma uzayı / görsel ölçek kilidi

- `V1.19.20_VISUAL_WORKSPACE_MANIFESTO_LOCKED.md` görsel üretim ve fiziksel ölçek için zorunlu üst sözleşmedir.
- Kanonik uzay: 2800 × 1800 scene-unit = 1400 × 900 mm; oran 2 scene-unit/mm.
- Kumanda, tesisat/elektrik ve Arduino aynı çalışma uzayı ve aynı fiziksel oranı kullanır.
- Pano mm-native kalır; ortak uzayla kıyaslandığında 1 mm = 2 scene-unit dönüşümü kullanılır.
- Görsel ajanları yalnız container/SVG kutusunu değil, asset içindeki görünen ürün gövdesini de fiziksel frame'e göre doğrulamak zorundadır.
- Mantıksal alt parçalar bağımsız fiziksel ürün ölçüsü uyduramaz; primary physical component proxy'si olarak işaretlenir.
