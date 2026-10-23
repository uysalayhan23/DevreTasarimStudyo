# Güncel sıradaki teknik görev — 2026-10-23

Aktif depo/dal: `uysalayhan23/DevreTasarimStudyo` / `main`. Her oturumda önce gerçek HEAD'i doğrula.

## Korunacak tamamlanmış çalışma
SC078–081'in mevcut native ve pedagojik kazanımlarını koru; geçtiği bildirilen testleri sebepsiz yeniden çalıştırma. Ders kaydı `LESSON_PROGRESS.json` içinde dört ayrı `REVIEW` olarak takip edilir. `verifiedCompleteCount=0` yalnız yeni kanıt defterine aktarılan tam sertifikaları ifade eder; tarihsel 77 dersi silmez. Uygulamadaki öğrenci uygulama tamamlama sayacı da bu geliştirme sayacından farklıdır.

## Sıradaki gerçek işlemler
1. SC078–081 için tamamlanmamış **Chrome/3D terminal ve kablo geometrisi kabulü**: kullanıcının Windows uygulaması `file:///.../dist/index.html` ile açılabiliyor. Gerçek görsel/DOM kanıtı ve kaynak geometrisiyle kabulü bitir; kusuru gerçekten düzeltmeden PASS yazma.
2. `dist/tutorial-mode.js` öğretici arama iyileştirmesini (`502275c7...`) koru; **güncel** uygulamada “Bağımsız iki DC kaynak” aramasının doğru dersleri döndürdüğünü doğrula.
3. Tam kabul olunan her dersin kanıtını `LESSON_EVIDENCE.jsonl` ile `LESSON_PROGRESS.json` dosyalarına işle, `node scripts/lesson-acceptance-gate.cjs` ile kontrol et; öğrenci ekran sayacını yapay olarak değiştirme. İlk sıralı artış yalnız SC078 COMPLETE olduğunda 78/1686 olur.
4. Bağımsız teknik sıradaki konu `dc-circuits-src-01` (82. sıradaki ders); aktif teknik incelemeye oradan devam edebilirsin. Önceki açık REVIEW'ları unutma.

## Yasaklar
Actions, Work/Codex, force-push, geçici dal, golden/PASS/HOLD bozulması, eski QA tekrarı, kanıtsız COMPLETE ve rapor-only commit yok. Yalnız gerçek onarım ve çalışan kabul mekanizması değişikliği `[skip ci]` ile doğrudan `main` dalına. İş sonunda gerçek HEAD, uzak blob SHA, doğrulanmış tam kabul sayısı ve kullanıcıdan beklenen tek işlemi açıkça bildir.
