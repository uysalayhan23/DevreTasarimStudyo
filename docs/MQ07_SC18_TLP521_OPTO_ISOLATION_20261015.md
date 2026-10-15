# MQ-00 / MQ-07 — SC18 TLP521-1 optokuplör sanal sağlamlık gözlemi
2026-10-15 · Tek repo `uysalayhan23/DevreTasarimStudyo` · dal `main`

**Durum: IMPLEMENTED / hedefli yalıtılmış JS testleri 9/9 PASS / tam Node + Windows UI NOT_RUN / MQ-00 REVIEW (DONE değil).**

## Eski durum ve dersin yeni kapsamı
- SC18’in depodaki gerçek başlığı **“Optokuplör sağlamlık kontrolü”**. Önceki sahne hiç kablo içermeyen referans `quiz` durumundaydı. TLP521-1’in giriş/çıkış izolasyonu veya gerçek işlevini göstermiyordu.
- Yeni 7 telli **yalnızca yazılımsal 5 V çift beslemeli** eğitim devresinde gerçek katalog kimlikli `arduino-tlp521-1` DIP-4 parçası kullanılıyor. Katalog pinleri **1=LED anodu, 2=LED katodu, 3=fototransistör emitter, 4=collector**. Ürünün hazır orthographic DIP-4 temsilî görünümü ve mevcut kütüphane uç koordinatları korunmuştur.
- Giriş tarafı yalnız G1 kaynağı, SG butonu, RIN 1 kΩ ve U1 LED uçlarından; çıkış tarafı ayrı G2 kaynağı, ROUT 4.7 kΩ ve U1 fototransistör uçlarından oluşur. G1/M ile G2/M veya başka giriş ve çıkış elektrik hatları **birbirine bağlanmaz**.
- Kablosuz kart yerine kullanıcı yeniden bağlantı kurma adımlarına sahip kablolu `wiring` dersi eklenmiştir. Açık kablolara göre izole yazılım çalışma modeli oluşturulmuştur; gerçek fiziksel donanım yönergesi değildir.

## MQ-05 hesap modeli
- `Simulation.solveSc18OptocouplerCycle` yalnız SC18 proje ID/sahne ID için çalışır. Mevcut genel `solve` stabilite/kısa-devre değerlendirmesini korur; **giriş/çıkış netleri ortak olduğunda davranış fail-closed** olur.
- Ayrı terminal ağları, her sanal kaynak ve her giriş/çıkış kablosunun fiziksel elektriksel sürekliliği denetlenir.
- LED ileri düşümü **1.2 V yalnız eğitsel varsayım**; sanal CTR **0.50 yani %50**; sanal VCE(sat) **0.2 V**. Bunlar Toshiba TLP521-1 için üretici tarafından onaylı gerçek çalışma eğrileri ve izolasyon dayanım testi değildir.
- G1/G2 = 5 V, RIN=1 kΩ, ROUT=4.7 kΩ ile SG OFF durumunda LED akımı 0, kollektor akımı 0, kolektör ~5 V; SG ON durumunda LED 3.8 mA, kollektor yaklaşık 1.021 mA ve VCE ~0.2 V; SG OFF’a dönüşte çıkış açık konuma döner.
- Girişte veya çıkışta kablo koparılırsa fototransistör yük akımı sıfırdır. Giriş/çıkış arasında herhangi bir galvanik bağ denenirse izolasyon doğrulanmaz ve yük kapalı kalır. Sanal CTR ayarı çıkış akımına sayısal olarak etki eder.
- Öğretici panelinde SG aç/kapat düğmeleri ve ayrı LED/fototransistör mA değerleri ile kolektör gerilimi, durum ve izolasyon göstergeleri vardır.

## MQ-12 kanıtı
- `tests/qa-mq07-sc18-tlp521-isolated-v11920.test.cjs`: **9/9 PASS**, güncel GitHub dosyalarının çalıştırıldığı yalıtılmış V8 ortamında. Standart Node modüllerinin test/require arayüzleri ve genel çevre alt modülleri bu test ortamında benzetilmiştir.
- Kontroller: TLP521 DIP-4 fiziksel pin kimliği ve 7 terminal hattı; hazır orthographic art ve motorsuz sembol; SG OFF→ON→OFF; örnek CTR değişimi; 7 ayrı kopuk kablo; giriş/çıkış arasında 3 çapraz kablo ihlali; geçersiz 230 V/sayısal olmayan kaynak, direnç ve CTR ayarları; STOP/reset; SC11–SC17 sabit kontratları.
- **1.655 derslik kaynak dizisi yüklendi.** Bu, bütün derslerin çalıştırıldığı anlamına gelmez.
- **NOT_RUN**: gerçek tüm Node runner `scripts/check.cjs` / `scripts/run-tests.cjs`, 1.655 dersin tamamının tarayıcı/regresyon koşumu, Windows `file:///` uygulama açılışı, fiziksel mm ölçek ve uç tıklanabilirliği, gerçek TLP521 cihazın CTR ve izolasyon dayanım laboratuvar testi.
- Dolayısıyla ekrandaki sanal ON/OFF sonucu gerçek parça için “SAĞLAM” tanısı değildir. Gerçek cihaz sağlığı ve güvenlik kabulü ayrı uzman/test gerektirir.

## Kabul zinciri / sıradaki ders
MQ-07 ders lideri → MQ-04 TLP521 pin sırası/izolasyon → MQ-05 iki bağımsız güç ağı ve fototransistör davranışı → MQ-03 ürün ortografik görünümü → MQ-12 hedefli yalıtılmış test → MQ-13 `main`/`[skip ci]`/Actions yok → MQ-00 **REVIEW**.

SC11–SC17’nin çalışan sahneleri değiştirilmedi. SC19 sıradaki iş: **Opto-triyakla triyak sürülmesi**; optik aktarım, güç kolu ve ayrı zamanlama/çalışma kaynakları karıştırılmayacak. Şebeke donanımı oluşturulmayacak.
