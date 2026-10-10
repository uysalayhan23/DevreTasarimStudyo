# Devre Tasarım Stüdyosu v1.16.0

- SINAMICS V20: BOP ve klemens kumandası, ileri/geri, zamanlı rampalar, JOG, sabit hızlar, analog referans, PID, AO1 ve DO1/DO2 davranışları.
- Sağdaki **V20 Parametreler** düğmesi ve cihazdaki **M** tuşundan açılan canlı çalışma/parametre/bağlantı penceresi.
- Hazır, hızlanıyor, yavaşlıyor, yön değiştiriyor, duruyor ve arıza durumları; cihazın üzerinde canlı LCD.
- Parametre doğrulaması, erişim seviyesi, duruşta değiştirilen ayarların kilidi, devreye alma ve fabrika dönüşü.
- Motor yön animasyonu frekansa göre değişir. V20 çıkış gerilimi ve AO1 akımı mevcut ölçü aletleriyle okunur.
- PNP/NPN DIC bağlantısı; AI1/AI2 gerilim veya akım; analog sensörlerin gerçek devreye etkisi.
- Simülasyonda bütün cihazlar seçilir ve kumandaları kullanılabilir. Çarpılma pop-up'ı kablo/ek noktası/terminal temaslarında çıkar. Prob ölçümü serbesttir.
- Dashboardda dört V20 atölyesi. Aynı projeler `Ornekler` klasöründe bulunur.
- v1.15.2'nin TX11, 20 kablo rengi, serbest EX/SIG renkleri, prob ve ölçüm düzeltmeleri korunur.

Açılış: ZIP'i tamamen çıkarıp **BASLAT.bat** dosyasını çalıştırın. Bu paket tek başına yeterlidir.

Kullanım ve model kapsamı: **V20_KILAVUZU.md**. Tam Siemens firmware emülasyonu, PLC/RS485 haberleşmesi ve ayrıntılı motor fiziği içermez; motor akımı/devir tahminidir.
