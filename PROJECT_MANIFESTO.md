# Devre Tasarım Stüdyosu — Kalıcı Çalışma Anayasası (2026-10-23)

**Tek yetkili repo/dal:** `uysalayhan23/DevreTasarimStudyo` / `main`. Bu belge `AGENTS.md` ve `docs/KURALLAR_VE_KILITLER.md` ile birlikte okunur; kilitleri gevşetmez. Kullanıcının yeni açık talimatı önceliklidir.

## Amaç
1.686 dersin **teknik olarak doğru ve pedagojik olarak öğretici** olması. Amaç rapor hazırlamak veya yalnız PASS yazmak değil, kaynak hatasını **bulmak → gerçekten düzeltmek → pozitif/negatif hedefli testle kanıtlamak → [skip ci] ile main'e teslim etmek → kabul ve ilerleme kaydını güncellemek**tir.

## Oturum açılış zorunluluğu
1. Canlı `main` HEAD ve yazma erişimini doğrula; yerel ZIP/checkout ile SHA farkını kontrol et.
2. `AGENTS.md`, bu belge, `ACCEPTANCE_PROTOCOL.md`, `NEXT_TASK.md`, `LESSON_PROGRESS.json` ve `LESSON_EVIDENCE.jsonl` oku. Var olmayan kaydı var sayma.
3. Önceki PASS ve HOLD kayıtlarını koru. Mevcut testleri baştan koşturma; yalnız açık kusuru hedefle.
4. `NEXT_TASK.md` içindeki işe devam et; görev gerçekten bitmeden başka dersi tamamlandı sayma.
5. Önceki sohbetlerin kendi başına güvenilir kabul kanıtı olmadığını, SHA ve native test kanıtının esas olduğunu unutma.

## Dersin gerektirdiği kalite
- **Teknik:** gerçek katalog pinleri, devre topolojisi, bağlantı/terminal eşleşmesi, simülasyon dinamiği, ölçü aleti pozitif ve negatif davranışı; 3D/fiziksel görsel gerektiren derslerde ölçek, terminal-kablo hizası ve gerçek görsel doğrulaması.
- **Pedagojik:** sade, samimi, doğal, hikâye gibi; öğrencinin neyi, neden ve nasıl yaptığını açıklayan kısa adımlar; monoton/robotik metin yok. Kavramsal kartı çalışan kablolu devre diye sunma.
- **Doğrulama:** çalıştırılmamış native testi PASS, görülmemiş Windows/Edge görünümünü kabul, eksik dosyayı onarılmış ilan etme.
- **İlerleme:** ekran sayacı ile kanıt defterini karıştırma. Önceden bildirilen 77/1686 *tarihsel sıralı ilerleme göstergesidir*; 77 ders için bağımsız yeni sertifikasyon değildir. Artış ancak kabul kanıtıyla olur.

## Çözüm zorunluluğu — sonsuz döngü yasağı
- FAIL → kök neden; kod / test beklentisi / kaynak eksikliği ayrımı; küçük gerçek onarım; yeniden hedefli test.
- Aynı değişikliği kanıtsız yineleme. Her deneme yeni hipotez ve kanıt taşımalı.
- En çok **3 anlamlı farklı onarım yaklaşımı**; bu sayı yüzeysel tekrar veya test sayısı değil.
- Üç deneme sonuç vermezse açık blocker, yapılan denemeler, elde edilen test kanıtı ve yeniden açma koşulunu kaydet; sahte PASS/COMPLETE yok.
- Güvenli uygulanabilir farklı yöntem/kanıt çıkarsa tekrar aç. Engelli tek ders bağımsız kalan 1.685 dersi durdurmaz; sıralı görev kuyruğunda blocker'ı kaybetme.
- İlerleme için testleri gevşetme, korumalı kabloları sessizce değiştirme, kabul şartını atlama. Eksik test ve fiziksel kabul ayrı izlenir.

## Korunacak kilitler
Golden, AGENTS.md, BASLAT.bat (`file:///dist/index.html` çevrimdışı), NE555 ve iki-BD139, SC119–123 HOLD, SC128/131 native pending, SC256/262, SC387, Arduino D2/A0, TDA2030/TDA7293, bütün önceki PASS ve kabul edilmiş kaynaklar, Edge/3D kabul; Miller/Boot Strobe REVIEW. GitHub Actions, Work/Codex, force-push, geçici dal, rapor-only commit ve gereksiz QA tekrarları yasak.

## Her dersin rapor biçimi
Ders kimliği ve gerçek değişen dosyalar; teknik ve pedagojik sonuç; hedefli pozitif/negatif native kanıt; tam canlı HEAD ve uzak blob SHA; kabul/engel; **tamamlanan / 1686, yüzde, kalan**; kullanıcıdan gerçekten beklenen tek şey (yoksa 'Senden hiçbir işlem beklemiyorum'). Arka planda çalışma iddiası yoktur.
