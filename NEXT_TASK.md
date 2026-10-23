# Sıradaki Gerçek İş — 2026-10-23

## Başlangıç noktası
Depo: `uysalayhan23/DevreTasarimStudyo` — dal: `main`.
Son bu plan öncesi doğrulanmış HEAD: `2634580e82bc18620d828181565b3f04b638d753` (yeni çalışma başında CANLI HEAD mutlaka yeniden doğrulanır).
Ekranda bildirilen sıralı pedagojik ilerleme: **77 / 1686** (%4,6, tarihsel gösterge; bağımsız kanıt sayısı değil).

## Önce yapılacak
**78. ders — Bağımsız iki DC kaynak.** Eldeki kaynakta iki bağımsız devre, dört kablo/adım ve hedefli testte 3/4 geçtiği raporlanmış; başarısız testin eski yükleyici sürüm adına bağlı olduğu ileri sürülmüş. Bunları doğrulanmış nihai kabul yerine *yeniden incelenecek somut hipotez* olarak ele al.

1. Testin gerçek hata nedenini izole et; eski test beklentisi ise düzelt ve hedefli Node.js testini tekrar çalıştır.
2. İki farklı DC kaynağın elektriksel ayrılığı, yanlış bağlantı negatif testi, şema/3D uyumu, pedagojik hikâye ve dört öğretici adımı doğrula; kanıtla.
3. Gerçek kod/devre/pedagoji hatalarını küçük onarımlarla düzelt; en çok üç farklı kanıtlı yaklaşım.
4. Zorunlu kapılar PASS ise kanıtı ekle, COMPLETE ve ilerlemeyi **78/1686** yap; mevcut sayaç gerçekten güncellenebiliyor mu ayrıca incele. Eksik kapı varsa REVIEW/BLOCKED kaydet, bağımsız sıradaki işe geç.
5. Sonraki dersler: 79 → 80 → 81; ardından öğretici sıra. Tamamlanmış PASS'ları sebepsiz yeniden test etme.

## Rapor ve kısıtlar
Her ders sonunda gerçek değişiklik, test, tam HEAD, uzak blob SHA, açık kusur, ilerleme sayısı ve senden beklenenler. Golden, BASLAT.bat, AGENTS, kablolu 3D/Edge kabul, tüm HOLD/PASS/REVIEW kilitlerini koru. Actions/Work/Codex/force-push/geçici dal/rapor-only commit yok.
