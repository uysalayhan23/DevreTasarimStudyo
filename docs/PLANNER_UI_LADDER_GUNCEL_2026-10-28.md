# DTS — 28 Ekim 2026 Arayüz / Ladder Güncel Teslimat ve Açık İşler

**Ana çalışma:** `uysalayhan23/DevreTasarimStudyo` `main` • normal GitHub API, [skip ci], Actions/force-push yok.

Ders arşivi için önce [DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md); Ladder referansı için [LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md](LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md) okunur.

## Teslim edilen yeni paketler

1. **Çalışma alanı:** Standart / otomatik Simülasyon Odak / Tam sayfa. Simülasyon sırasında paneller otomatik daralır, durunca önceki kullanıcı panel tercihi geri gelir. Tam sayfa düğmesi / Esc; CSS fallback ile file:/// uyumunu gözetir. Uzak commit: `ea96daf90dfb54654879f409ed2ec449f5e3a874`. UI mantığı hedefli **18/18** kontrol; Windows Edge/3D görsel kabulü **REVIEW**.
2. **Özgün DTS Ladder çekirdeği:** `dist/ladder-runtime.js`, açık opt-in `plcProgram='dts-ladder-v1'`. Seri/paralel NO/NC, OUT/SET/RESET, TON/TOF/TP/CTU/CTD; gerçek `plc-runtime.js` üzerinden katalog DO pinlerine eşleştirme ve hatalı programda çıkışları kapatma; eski PLC program modları kilitli. Uzak commit: `82c84733fabcf28da61318e84bf6514e643a86d1`. İzole hedefli mantık/PLC testleri **20/20**; tam orijinal `Simulation.solve` elektriksel entegrasyon kabulü ayrıca gerekir.
3. **Görsel Ladder arayüzü:** PLC'yi seçerek `▤ PLC Ladder` aç; rung/seri-paralel kontak ve bobin/TON vb. düzenle; sanal giriş/çıkış gerçek katalog pinine sıra ile eşleşir. Hazır Start/Stop rung'u, projeye kaydet, simülasyon sırasında izleme hazırlığı. Mevcut proje saklama `DTSProjects.clean` ile ek `ladderProgram` nesnesini korur. Hedefli sözdizimi/model testi; Windows/Edge görsel kullanım ve gerçek projede tekrar açma **REVIEW**. Siemens kod/proje kopyalanmadı.

## Kalan kabul kapıları ve iyileştirmeler

- Hedefli tam `Simulation.solve` + gerçek 703 katalog ile Ladder buton/çıkış sahnesi; gerçek pozitif/negatif ve kablo kopması kontrolleri.
- Windows Edge `file:///` görsel kontrol: panel restore, gerçek tarayıcı fullscreen izin/escape, araç çubuğu dar ekran ergonomisi, Ladder modal güvenlik ve odak.
- Ladder'da bellek/timer karşıt çıkış kilidi ve sanal devre durumları; öğretici doğal Türkçe, sinyal izleme netlikleri.
- Serbest Ladder editörü için Undo/Redo, program aktarımı ve örnek kütüphanesi; sadece kanıtlı devreler.
- Ayrı UI paketleri: üst araç çubuğunu gruplama, bileşen mini bilgi, hata noktasını gösterme, PDF/PNG/malzeme dışa aktarımı, terminal tabanlı bileşen editörü, FBD.
- **Bağımsız COMPLETE sayacı değişmedi.** Ladder yeni ve farklı bir modüldür; eski 1686 dersin PASS/HOLD/REVIEW sınıflaması otomatik değişmez.

## Kesin koruma kuralları

Golden/complete dersler ve SC1194 HOLD; mevcut 703 katalog; `BASLAT.bat`, `file:///...` Edge, gerçek terminal/kablo 3D ölçeği, `Simulation.solve`, hazır şablonların readonly/Farklı Kaydet özelliği. Geçerli olmayan Ladder programları simülasyon izni alamaz. Siemens LOGO'ya cihaz bağlantısı, Siemens .lsc içe aktarma, endüstriyel güvenlik/yetkilendirme **YOK**.

### 28 Ekim 2026 — Native doğrulama ve model sınırı

Özgün `CCSSimulation.solve` + gerçek 703 katalog ile **kullanıcı kütüphanesinde seçilebilir** Siemens `plc-hw-6es7211-1ae40-0xb0` (CPU 1211C DC/DC/DC) modelinde 7/7 hedefli sanal fiziksel çıkış doğrulandı: tam kablolu ON; I1 kopuk, CPU +24V kopuk, CPU M kopuk, çıkış bankı güç kopuk, Q1→lamba kopuk ve lamba 0V dönüş kopuk durumlarında lamba OFF. Kesik yük kablosu durumunda PLC mantığı Q1=1 kalabilir ancak lamba enerjilenemez; farklı ölçümler birbirine karıştırılmaz. Diğer katalog PLC cihazlarının Ladder simülasyonu `supportedPLC` kapısıyla kanıt bekler; eski programlara dokunulmaz. Gerçek donanım/Edge/3D ayrıca REVIEW.
