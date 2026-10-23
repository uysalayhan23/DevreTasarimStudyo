# Ders Kabul ve Sınırlı Onarım Protokolü

## Kabul durumları
- `UNVERIFIED`: kayıt/tarihsel beyan var, güncel kabul kanıtı yok.
- `IN_PROGRESS`: gerçek kaynak hedefli inceleniyor.
- `BLOCKED`: denemeler veya erişim engeli belgeli; otomatik sıralı ilerleme bağımsız işe geçer.
- `REVIEW`: teknik kısmi PASS ama pedagojik, görsel, üretici veya native zorunlu kapı açık.
- `COMPLETE`: ilgili dersin **bütün uygulanabilir zorunlu kapıları** kanıtlı; açık zorunlu kapı yok.

## Zorunlu kapılar
1. **Kimlik**: lesson ID, kaynak yolu ve başlangıç/son Git blob SHA.
2. **Gerçek topoloji**: katalog pinleri, terminal/3D görsel (gerekiyorsa), bağlantı ve öğretici adım eşleşmesi.
3. **Gerçek davranış**: en az bir normal pozitif ve bir uygun negatif hedefli test; native gerekli ise Node.js native sonucu.
4. **Pedagoji**: sade Türkçe, amaç, kurulum, beklenen sonuç, neden-sonuç, yanlış bağlama uyarısı.
5. **Koruma**: yalnız etkilenen kaynaklar, önceki PASS/Golden/kilitler değişmedi.
6. **Teslim**: gerçek değişiklik varsa `[skip ci]` commit, ardından canlı HEAD ve değişen blob SHA. Değişiklik gerekmeyen doğrulanmış ders de kanıtla COMPLETE olabilir; rapor-only commit yapılmaz.
7. **Görsel / fiziksel**: gerçekten gerekiyorsa somut ekran/terminal hizası kanıtı; erişilemiyorsa `REVIEW`, sahte PASS yok.

## Mecburi hata çözme
Her FAIL için bir kök neden hipotezi yaz, en küçük gerçek onarımı uygula, spesifik pozitif/negatif testleri çalıştır; FAIL sürerse hipotezi ve çözüm yaklaşımını değiştir. En fazla üç **anlamlı farklı** deneme. Aynı testi/aynı yamanın sonucunu değişiklik olmadan tekrarlama. Sonrasında `BLOCKED`, deneme listesi, gerçek engel ve yeniden açma koşulu kaydet. Yeni somut kanıt veya farklı güvenli yöntem varsa tekrar aç. Bir engel tüm müfredatı durdurmaz; ancak bloke dersi asla COMPLETE sayma.

## Kanıt ve ilerleme bütünlüğü
`LESSON_PROGRESS.json` salt manifestodur; uygulamanın fiilî ekran sayacı ayrı kaynak olabilir. Ekran sayacını değiştiren gerçek kod bulunmadan otomatik senkronize olduğu iddia edilmez. `LESSON_EVIDENCE.jsonl` eklemeli kanıt kayıtları içerir. `scripts/lesson-acceptance-gate.cjs` yalnız açık belgeli kanıtları COMPLETE kabul eder ve bozuk ilerleme/kanıt kayıtlarını reddeder. Testleri veya kabul verilerini PASS'e zorlayarak ilerleme sayılarını yükseltmek yasaktır.
