# MQ-00 SC34–SC38 Node yürütme ve kaynak sınırları — 2026-10-16

Aktif repo: `uysalayhan23/DevreTasarimStudyo`, dal `main`. Ana backlog `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md`; bu dosya yeni backlog değildir.

## Gerçek yürütme kanıtı / engel
- Yerel ortam: `node -v` → `v22.16.0`.
- `git ls-remote https://github.com/uysalayhan23/DevreTasarimStudyo.git HEAD` → `Could not resolve host: github.com` (DNS).
- Yerel `/mnt/data` altında tam kaynak ağacı yok; yalnız SC37 test dosyasının kopyası bulunuyor. `node --check` bu kopya için exit 0 döndü. Bu sadece JS sözdizimi kontrolüdür; test koşulmadı.
- Bu yüzden SC34–SC38 Node kaynak regresyonu, SC35 Arduino ses→D2→D9→buzzer OFF/ON/OFF, SC36–SC38 gerçek solver dalga biçimi ölçümü ve Windows acceptance: **NOT_RUN / NOT_PASS**.
- GitHub Actions çalıştırılmadı.

## MQ-07 / MQ-05 / MQ-12 SC38
`opamp-apps-src-03` AC evirmeyen LM358P dersinde sinyal kaynağı → IN+, R1=10 kΩ ile IN−→0 V ve R2=47 kΩ ile OUT→IN− negatif geri besleme topolojisi kaynakta tanımlı. İdeal doğrusal ve doygunluk-dışı kazanç `1+47/10=5.7`. Tek beslemeli op-amp ortak-mod ve çıkış salınımı nedeniyle gerçek AC davranışı bu matematikten otomatik PASS değildir.
Kaynak-topoloji test dosyası `tests/qa-mq07-sc38-lm358-ac-noninverting-source-v11920.test.cjs` oluşturuldu, **NOT_RUN**.

## MQ-13 / MQ-00 kararı
Yalnız `main` ve `[skip ci]` içerikli commitler; golden referanslar, mevcut devreler, simulator ve workflowlar değiştirilmedi. Bağımsız test çalıştırılmadan MQ-12 PASS veya MQ-00 DONE verilemez. **MQ-00 REVIEW / NOT_DONE**. 
