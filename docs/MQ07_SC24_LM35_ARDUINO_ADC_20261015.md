# MQ-00 / MQ-07 SC24 — LM35 Arduino A0 sıcaklık ve analog gerilim QA (2026-10-15)

Repo uysalayhan23/DevreTasarimStudyo · main. **Ders kaynağı implemented, 10/10 izole V8 hedef koşulu PASS; MQ-00 REVIEW (NOT DONE).**

## Hata

Önceki LM35 / TMP36 katalog girdisi arduinoRole=temperature kullanıyordu. ArduinoRuntime.temperature dalı sıcaklığı genel `round((t+40)/165*1023)` ölçeğine koyuyor ve analogRead sıcaklık–gerilim ölçeğine uymuyordu. İzole eski motorla 0/25/50/100 °C -> ADC 248/403/558/868 ölçüldü. Mevcut elektriksel simülasyon `arduino-lm35` sensörünün gerçek AO voltajını sıcaklıktan üretmiyordu. Başlangıç grafında P/M → LM35 VCC/GND ve UNO 5V/GND, AO→A0 kabloları doğruydu; bunlar korundu.

## Hedefe özgü düzeltme

Yalnız `sensor-analog-apps-src-05` içinde LM35 bileşeni `mq07Lm35Model=true`, sensör sıcaklığı `arduinoValue=25`, sanal masa kaynağı `dcVoltage=5` ve UNO’ya `analogRead(A0)` ile ideal `adc / 1023 * 5 * 100` °C kodu eklendi. `dist/arduino-runtime.js` bu opt-in için gerçek kablo grafında eş 5V/0V netlerini ve ayrı 5 V sanal kaynak beslemesini doğrular; doğru ise LM35 `Vout=t×0.010 V` ve UNO A0 10-bit ADC kodunu hesaplar; açık besleme/ortak GND veya 4 V kaynakta ADC 0 kabul eder. Başka analog, sıcaklık, DHT sensörlerinin kaynak davranışına dokunulmaz. `dist/simulation.js` yine yalnız bu opt-in sensör için gerçek analog net AO seed ve `_mq07Lm35AnalogV` hesabı üretir.

## MQ-12 kanıtı

Orijinal `arduino-library.js`, `arduino-examples.js`, `incremental-encoder.js`, güncellenmiş `arduino-runtime.js`, `thermal.js`, `device-behavior.js`, `current-model.js` ve güncellenmiş `simulation.js` izole JavaScript V8 çalıştırmasında ilgisiz aygıt stublarıyla koşuldu. 0/25/50/100/125 °C -> 0/0.25/0.50/1.00/1.25 V, A0 ADC 0/51/102/205/256; tam Arduino sketch decoder yaklaşık 0/24.927/49.853/100.196/125.122 °C. Açık LM35 VCC/GND/AO ve 0 V/4 V besleme, geçerli sıcaklık veremedi. Toplam 10/10 hedefli senaryo geçti; tüm kaynaklar V8 yüklenip 1.655 dersin sadece SC24 kaydının değiştiği karşılaştırıldı.

Eklenen `tests/qa-mq07-sc24-lm35-arduino-adc-v11920.test.cjs`, tam kataloğu kullanarak gelecekte Node hedef regresyonu için hazırdır. **Tam yerel Node test paketi, Windows file:/// UI, fiziksel/üretici ADC doğruluğu, gerçek analog gürültü, güç kaynağı toleransı ve gerçek donanım güvenlik QA çalıştırılmadı**. MQ-00 kararını DONE olarak işaretleme.

MQ-07 (ders) → MQ-05 (analog çözüm) / MQ-09 (Arduino pin kimliği) → MQ-12 (hedefli kaynak QA) → MQ-13 (GitHub koruması) → MQ-00 REVIEW. SC11–SC23, gerçek mm/orthographic teknik kilitleri ve Actions yasağı korunmuştur. Commit `[skip ci]`. Sıradaki: sensor-analog-apps-src-06 (Reed kontak uygulaması).
