# Faz 0 — başlangıç durumu

- Tarih: 2026-10-01
- Dal: `Devre-Tasarim-Studyosu-1.19.1`
- Başlangıç HEAD: `5f0dcb7b8a6b972224f73194db3c2924b1ffbf3d`
- Başlangıç çalışma ağacı: temiz
- Kilitli iş sırası manifesti: `V1.19.0_IS_SIRASI_MANIFESTO_LOCKED.md` mevcut
- Doğrulama komutu: `node scripts/run-tests.cjs`
- Sonuç: 255 geçti, 0 başarısız, 0 atlandı
- Node.js: `v22.14.0` (depo belgelerindeki öneri `24`)
- Faz 0 sırasında ders/devre kaynaklarında değişiklik yapılmadı.

Bu kayıt, Faz 0 başlangıç denetimini belgeler. Faz 1'e geçiş için kullanıcı kontrolü ve açık onay gerekir.

## 1.19.1 doğru tabanla tekrar denetim · 2026-10-03

- Kapsam başlangıcı: `Devre-Tasarim-Studyosu-1.19.1`, v1.19.0 içeriğinin eklendiği `50c6bebd08b49080e7241f0631d522a9c0140809` commit'i.
- Önceki 2026-10-01 başlangıç kaydı `main`/v1.18 tabanında olduğu için v1.19.1 için geçerli temel kabul edilmez.
- Bu doğru tabandaki ilk tam regresyon çalışması 427 testten 344 geçti, 83 başarısız verdi. Başarısızlıkların ortak nedeni birleştirme sırasında `simulation.js` ağ çözücüsünde tanımsız `now` değişkeninin kullanılmasıydı.
- Kök neden Faz 3 düzeltmesinde giderildi. Düzeltilmiş tam regresyon: 427 test, 379 geçti, 48 başarısız.
- Aynı tam paket temiz `origin/v1.19.0` üzerinde 423 test, 344 geçti, 79 başarısız verdi. Başarısız test adlarının tümü bu tabanda da başarısızdı; 1.19.1’de 31 taban başarısızlığı artık geçiyor, yeni eklenen dört Faz 3 RLC/diyot testi de geçiyor. Yeni başarısız test yok.
- 48 kalan başarısızlık devralınan v1.19.0 bulgularıdır; hedefli dashboard/öğretici/ders paketindeki sonuç 24/32’dir. Bu sonuçlar tam paket temiz geçti anlamına gelmez.
- v1.19.0 kaynaklarının birleştirilmesinden sonra başlangıç ağacı temizdi. Faz 0 incelemesinde ders/devre kaynaklarına yeni değişiklik eklenmedi.
