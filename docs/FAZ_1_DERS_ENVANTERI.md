# Faz 1 — ders ve eğitim örneklerinin envanteri

> **Doğru taban kapsam eki (2026-10-03):** Bu raporun ilk envanter bölümü `main`/v1.18 tabanındaki 31 dashboard kaydı ve 58 `.odsdevre` dosyasını kapsar; 1.19.1’in güncel envanterinin tamamı değildir. v1.19.0’dan gelen Arduino Atölyesi/IDE kaynakları ve Öğretici Modu da dashboardda ayrı eğitim alanlarıdır. Öğretici Modu temelinde 18 konu × 4 seviye = 72 bağlantı dersi bulunur; ayrıca 15 kaynak için içindekiler/temrin kapsamı `dist/tutorial-source-outline.js` ile eklenir. Arduino atölye bileşenleri ile resmi örnek kataloğu ilgili `dist/arduino-*.js` kaynaklarında tutulur. Bu ek, 1.19.0 kaynak kapsamını envantere katar; eski 31/58 sayımını güncel toplam gibi göstermemek gerekir.

## Kapsam ve yöntem

- Uygulamanın ana ekrandaki **31** atölye/örnek girişini ve bunların dist/starter*.js tanımlarını inceledim.
- Ornekler/ içindeki **55** ve Kaydedilen_Projeler/ içindeki **3** .odsdevre dosyasını taradım; toplam **58** proje dosyasıdır.
- 31 ana ekran kaydının 32 proje dosyasıyla yapısal eşleşmesi var: mühürleme devresi üç yerde (ana ekran, Ornekler/K1_S2_Muhurleme.odsdevre, Kaydedilen_Projeler/01_Kumanda_Muhurleme.odsdevre); vavien ve pano örnekleri de kaydedilmiş proje dosyalarında eşleşiyor. Böylece **26 ek arşiv örneği** kalıyor.
- 31 ana ekran tanımı ve 58 proje dosyası kütüphane karşılıkları, pin referansları ve bağlantılar açısından denetlendi. Elektrik modeli bulunan 30 ana ekran örneği ile 56 proje dosyasının tümü varsayılan durumda kararlı çözüldü ve kısa devre üretmedi. Kalan bir atölye ve iki dosya yalnız pano yerleşimi içerdiğinden elektriksel çözüm uygulanmadı; pano malzeme türleri de kütüphanede bulundu.
- Komponent görevleri, adları/etiketleri ve mevcut note metinleri doğrudan proje verisinden aktarıldı. Ayrı öğrenme amacı/ders açıklaması alanı yok. Böyle alan bulunmayan kayıtlarda öğrenme kazanımı uydurmadım; eksikliği işaretledim.
- Simülasyon çıktısı yalnız varsayılan durum ve t=0 için kaydedildi. Beklenen deney adımları ve ölçüm değerleri, kaynakta varsa komponent notundan alındı. Dış donanım, Windows/Edge veya gerçek elektriksel ölçüm yapılmadı.

## Sonuç özeti — 31 ana ekran dersi

| Sınıflandırma | Adet | Dayanak |
|---|---:|---|
| UYUMLU | 21 | Komponent/pin eşleşmeleri doğru, varsayılan çözüm kararlı ve kısa devresiz; mevcut ders notları konuya özgü kullanım/ölçüm bilgisini veriyor. |
| DÜZELTİLMELİ | 10 | Öğrenme amacı veya beklenen sonuç açıklanmamış; yahut tanıtım/şablon kaydında kablo/öğretici içerik yok. |
| EKSİK MALZEME | 0 | Tüm başvurulan komponent kimlikleri mevcut. |
| BAĞLANTI HATASI | 0 | Statik pin denetiminde yanlış pin bulunmadı; varsayılan çözümde kısa devre/kararsızlık yok. |
| KONU TEKRARI | 0 | 31 ana ekran başlığı arasında birebir aynı tanım yok. Mühürleme dosyası kopyaları ayrıca belirtilmiştir. |


### Varsayılan ölçüm çıktıları

| Atölye | Simülatörün varsayılan göstergesi |
|---|---|
| Akım trafosu 100/5 | 10 A birincil akımdan 0,5 A ikincil akım |
| Gentek HT2 | 20 °C → 12 mA; %25 RH → 8 mA |
| WAZ5 | 5 V → 12 mA |
| ORDEL PT100 | 50 °C → yaklaşık 12 mA |
| ORDEL K tipi termokupl | 400 °C → yaklaşık 12 mA |
| Baykon TX11 | 250 kg → 8 mA |
| Kobastar SB2 | Başlangıçta 0 kg → 0 mV; kaynak notu 500 kg → 10 mV, 1000 kg → 20 mV der |
| UNI-T UT33D+ | Mevcut örnek denetimi DC 200 V kademesinde 24 V okumasını doğruluyor |

Bu okumalar Faz 0 temelindeki mevcut test ve solver denetimlerine dayanır. Ölçüm atölyelerinin notlarında belirtilen kullanıcı eylemleri uygulanmadan dinamik senaryo sonucu sayılmaz. Kobastar yük hücresi tests/devices-v112.test.cjs, analog ölçümler tests/examples-v115.test.cjs ve akım trafosu tests/devices-v111.test.cjs içinde açıkça kontrol edilir.
## Ana ekrandaki 31 kayıt

### acs800panel — ACS800 · Panel ve yön

- **Konu / kazanım:** ACS800 · Panel ve yön. Kaynak notlarının açıkladığı hedef: Simülasyonu açın. Panelde I ile başlatın. 20 saniyede 50 Hz. → / ← ile yön değiştirin. Yan menü > ACS800 Parametreler > 22.02 / 22.03 ile rampaları değiştirin. Bu örnekte 21.03=RAMP; Factory varsayılanı COAST.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ACS800_R5_Panel_ve_Yon_v1.17.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 3 Faz Besleme; etiketi: “3~ 400 V”
- M1 (motor) — 3 Faz Motor; etiketi: “400 V Y · 75 kW”; kayıtlı ayar: {"motorConnection":"star"}
- U1 (acs) — ABB ACS800 · R5; etiketi: “ABB ACS800 R5 · 75 kW”; kayıtlı ayar: {"acs800":"model ayarı; 105 parametre, çalışma=false, yerel=true"}
  Açıklama: Simülasyonu açın. Panelde I ile başlatın. 20 saniyede 50 Hz. → / ← ile yön değiştirin. Yan menü > ACS800 Parametreler > 22.02 / 22.03 ile rampaları değiştirin. Bu örnekte 21.03=RAMP; Factory varsayılanı COAST.
- **Kablo bağlantıları:**
- wire0: G1.L1 → U1.U1
- wire1: G1.L2 → U1.V1
- wire2: G1.L3 → U1.W1
- wire3: U1.U2 → M1.U
- wire4: U1.V2 → M1.V
- wire5: U1.W2 → M1.W
- wire6: G1.PE → U1.PE
- wire7: U1.PE2 → M1.PE
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- U1: “Simülasyonu açın. Panelde I ile başlatın. 20 saniyede 50 Hz. → / ← ile yön değiştirin. Yan menü > ACS800 Parametreler > 22.02 / 22.03 ile rampaları değiştirin. Bu örnekte 21.03=RAMP; Factory varsayılanı COAST.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### acs800pot — ACS800 · RMIO ve potansiyometre

- **Konu / kazanım:** ACS800 · RMIO ve potansiyometre. Kaynak notlarının açıkladığı hedef: REMOTE · Factory. Başlat anahtarını açın. Potun orta ucu X21:3; AI1− ucu X21:4 ayrıca AGND’ye bağlı. DI2 yön seçer. RMIO bağlantıları sekmesinden fabrika DIIL köprüsünü inceleyin.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ACS800_R5_RMIO_Potansiyometre_v1.17.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 3 Faz Besleme; etiketi: “3~ 400 V”
- M1 (motor) — 3 Faz Motor; etiketi: “400 V Y · 75 kW”; kayıtlı ayar: {"motorConnection":"star"}
- U1 (acs) — ABB ACS800 · R5; etiketi: “ABB ACS800 R5 · 75 kW”; kayıtlı ayar: {"acs800":"model ayarı; 105 parametre, çalışma=false, yerel=false"}
  Açıklama: REMOTE · Factory. Başlat anahtarını açın. Potun orta ucu X21:3; AI1− ucu X21:4 ayrıca AGND’ye bağlı. DI2 yön seçer. RMIO bağlantıları sekmesinden fabrika DIIL köprüsünü inceleyin.
- RUN (run) — Seçici Anahtar; etiketi: “Başlat / Durdur · DI1”
- REVERSE (reverse) — Seçici Anahtar; etiketi: “Yön · DI2”
- POT (pot) — Analog Potansiyometre; etiketi: “1 kΩ · AI1”; kayıtlı ayar: {"potentiometer":50,"potMax":1000}
- **Kablo bağlantıları:**
- wire0: G1.L1 → U1.U1
- wire1: G1.L2 → U1.V1
- wire2: G1.L3 → U1.W1
- wire3: U1.U2 → M1.U
- wire4: U1.V2 → M1.V
- wire5: U1.W2 → M1.W
- wire6: G1.PE → U1.PE
- wire7: U1.PE2 → M1.PE
- wire8: U1.X22:7 → RUN.13
- wire9: RUN.14 → U1.X22:1
- wire10: U1.X22:7 → REVERSE.13
- wire11: REVERSE.14 → U1.X22:2
- wire12: U1.X21:1 → POT.1
- wire13: U1.X21:2 → POT.3
- wire14: POT.2 → U1.X21:3
- wire15: U1.X21:4 → U1.X21:2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- U1: “REMOTE · Factory. Başlat anahtarını açın. Potun orta ucu X21:3; AI1− ucu X21:4 ayrıca AGND’ye bağlı. DI2 yön seçer. RMIO bağlantıları sekmesinden fabrika DIIL köprüsünü inceleyin.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### acs800current — ACS800 · 4–20 mA ve röleler

- **Konu / kazanım:** ACS800 · 4–20 mA ve röleler. Kaynak notlarının açıkladığı hedef: AI2 4–20 mA, 12 mA → 750 rpm. AO1 hız; AO2 motor akımı. Yeşil lamba RO2 NO (X26:3) üzerinden yanar. Giriş sinyali kesilirse 8110 arızasını ve RESET davranışını inceleyin.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ACS800_R5_4_20mA_ve_Roleler_v1.17.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 3 Faz Besleme; etiketi: “3~ 400 V”
- M1 (motor) — 3 Faz Motor; etiketi: “400 V Y · 75 kW”; kayıtlı ayar: {"motorConnection":"star"}
- U1 (acs) — ABB ACS800 · R5; etiketi: “ABB ACS800 R5 · 75 kW”; kayıtlı ayar: {"acs800":"model ayarı; 105 parametre, çalışma=false, yerel=false"}
  Açıklama: AI2 4–20 mA, 12 mA → 750 rpm. AO1 hız; AO2 motor akımı. Yeşil lamba RO2 NO (X26:3) üzerinden yanar. Giriş sinyali kesilirse 8110 arızasını ve RESET davranışını inceleyin.
- RUN (run) — Seçici Anahtar; etiketi: “Başlat / Durdur · DI1”
- REVERSE (reverse) — Seçici Anahtar; etiketi: “Yön · DI2”
- DC (dc) — Pozitif DC Besleme
- SIGNAL (signal) — Sıcaklık / Nem Sensörü; etiketi: “20 °C → 12 mA”; kayıtlı ayar: {"instrumentSettings":{"temperature":20,"humidity":50,"measurement":"both","output":"4-20mA"}}
- AO0 (ao0) — Ampermetre; etiketi: “AO1 · mA”
- AO1 (ao1) — Ampermetre; etiketi: “AO2 · mA”
- LAMP (lamp) — Yeşil Sinyal Lambası; etiketi: “RO2 · çalışıyor”
- **Kablo bağlantıları:**
- wire0: G1.L1 → U1.U1
- wire1: G1.L2 → U1.V1
- wire2: G1.L3 → U1.W1
- wire3: U1.U2 → M1.U
- wire4: U1.V2 → M1.V
- wire5: U1.W2 → M1.W
- wire6: G1.PE → U1.PE
- wire7: U1.PE2 → M1.PE
- wire8: U1.X22:7 → RUN.13
- wire9: RUN.14 → U1.X22:1
- wire10: U1.X22:7 → REVERSE.13
- wire11: REVERSE.14 → U1.X22:2
- wire12: DC.P → SIGNAL.+
- wire13: DC.M → SIGNAL.−
- wire14: SIGNAL.T → U1.X21:5
- wire15: SIGNAL.− → U1.X21:6
- wire16: U1.X21:9 → AO0.1
- wire17: AO0.2 → U1.X21:10
- wire18: U1.X21:11 → AO1.1
- wire19: AO1.2 → U1.X21:12
- wire20: DC.P → U1.X26:2
- wire21: U1.X26:3 → LAMP.X1
- wire22: LAMP.X2 → DC.M
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- AO0 (ao0) — Ampermetre; etiketi: “AO1 · mA”
- AO1 (ao1) — Ampermetre; etiketi: “AO2 · mA”
- **Beklenen çalışma / açıklama:**
- U1: “AI2 4–20 mA, 12 mA → 750 rpm. AO1 hız; AO2 motor akımı. Yeşil lamba RO2 NO (X26:3) üzerinden yanar. Giriş sinyali kesilirse 8110 arızasını ve RESET davranışını inceleyin.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, DC, SIGNAL. Ölçü aleti göstergesi: AO0: 0 mA (0 A); AO1: 0 mA (0 A).

### acs800pid — ACS800 · PID kontrol

- **Konu / kazanım:** ACS800 · PID kontrol. Kaynak notlarının açıkladığı hedef: PID makrosu, EXT2. DI5 çalışma izni köprülü; DI6 başlatır. AI1 referans, AI2 geri besleme. 40.13=OFF: önce oransal tepkiyi gözleyin; sonra ON seçerek integral etkisini ekleyin. Sensör sıcaklığı arttıkça hedef hız azalır.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ACS800_R5_PID_Kontrol_v1.17.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 3 Faz Besleme; etiketi: “3~ 400 V”
- M1 (motor) — 3 Faz Motor; etiketi: “400 V Y · 75 kW”; kayıtlı ayar: {"motorConnection":"star"}
- U1 (acs) — ABB ACS800 · R5; etiketi: “ABB ACS800 R5 · 75 kW”; kayıtlı ayar: {"acs800":"model ayarı; 105 parametre, çalışma=false, yerel=false"}
  Açıklama: PID makrosu, EXT2. DI5 çalışma izni köprülü; DI6 başlatır. AI1 referans, AI2 geri besleme. 40.13=OFF: önce oransal tepkiyi gözleyin; sonra ON seçerek integral etkisini ekleyin. Sensör sıcaklığı arttıkça hedef hız azalır.
- RUN (run) — Seçici Anahtar; etiketi: “PID çalıştır · DI6”
- POT (pot) — Analog Potansiyometre; etiketi: “AI1 · PID referansı %50”; kayıtlı ayar: {"potentiometer":50,"potMax":1000}
- SENSOR (sensor) — Sıcaklık / Nem Sensörü; etiketi: “AI2 · geri besleme”; kayıtlı ayar: {"instrumentSettings":{"temperature":0,"humidity":50,"measurement":"both","output":"0-20mA"}}
- **Kablo bağlantıları:**
- wire0: G1.L1 → U1.U1
- wire1: G1.L2 → U1.V1
- wire2: G1.L3 → U1.W1
- wire3: U1.U2 → M1.U
- wire4: U1.V2 → M1.V
- wire5: U1.W2 → M1.W
- wire6: G1.PE → U1.PE
- wire7: U1.PE2 → M1.PE
- wire8: U1.X22:7 → RUN.13
- wire9: RUN.14 → U1.X22:6
- wire10: U1.X22:8 → U1.X22:5
- wire11: U1.X21:1 → POT.1
- wire12: U1.X21:2 → POT.3
- wire13: POT.2 → U1.X21:3
- wire14: U1.X21:4 → U1.X21:2
- wire15: U1.X23:1 → SENSOR.+
- wire16: U1.X23:2 → SENSOR.−
- wire17: SENSOR.T → U1.X21:5
- wire18: SENSOR.− → U1.X21:6
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- U1: “PID makrosu, EXT2. DI5 çalışma izni köprülü; DI6 başlatır. AI1 referans, AI2 geri besleme. 40.13=OFF: önce oransal tepkiyi gözleyin; sonra ON seçerek integral etkisini ekleyin. Sensör sıcaklığı arttıkça hedef hız azalır.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, SENSOR.

### v20bop — V20 · Panel ve rampalar

- **Konu / kazanım:** V20 · Panel ve rampalar. Kaynak notlarının açıkladığı hedef: Simülasyonu başlatın. V20 üzerindeki I çalıştırır; O durdurur; oklar frekansı değiştirir. M veya yan menüdeki Parametreler ile P1120/P1121 rampalarını ayarlayın. ↔ motor yönünü rampayla değiştirir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/V20_Panel_ve_Rampalar_v1.16.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 1 Faz Besleme; etiketi: “230 V AC”
- U1 (v20) — SINAMICS V20 · 1 Faz Giriş; etiketi: “SINAMICS V20 · 1,5 kW”; kayıtlı ayar: {"v20":"sürücü ayarları mevcut"}
  Açıklama: Simülasyonu başlatın. V20 üzerindeki I çalıştırır; O durdurur; oklar frekansı değiştirir. M veya yan menüdeki Parametreler ile P1120/P1121 rampalarını ayarlayın. ↔ motor yönünü rampayla değiştirir.
- M1 (motor) — 3 Faz Motor; etiketi: “230 V Δ · 1,5 kW”; kayıtlı ayar: {"motorConnection":"delta"}
- **Kablo bağlantıları:**
- wire0: G1.L → U1.L1
- wire1: G1.N → U1.N
- wire2: G1.PE → U1.PE
- wire3: U1.PE2 → M1.PE
- wire4: U1.U → M1.U
- wire5: U1.V → M1.V
- wire6: U1.W → M1.W
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- U1: “Simülasyonu başlatın. V20 üzerindeki I çalıştırır; O durdurur; oklar frekansı değiştirir. M veya yan menüdeki Parametreler ile P1120/P1121 rampalarını ayarlayın. ↔ motor yönünü rampayla değiştirir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### v20pot — V20 · Potansiyometre ile hız

- **Konu / kazanım:** V20 · Potansiyometre ile hız. Kaynak notlarının açıkladığı hedef: Cn002: çalıştır anahtarını açın. Potansiyometre AI1 hız referansıdır. P1120/P1121 = 10 s. 50 Hz için potu uç konumuna getirin. Yön anahtarı DI2 üzerinden ters komut verir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/V20_PNP_Potansiyometre_v1.16.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 1 Faz Besleme; etiketi: “230 V AC”
- U1 (v20) — SINAMICS V20 · 1 Faz Giriş; etiketi: “SINAMICS V20 · 1,5 kW”; kayıtlı ayar: {"v20":"sürücü ayarları mevcut"}
  Açıklama: Cn002: çalıştır anahtarını açın. Potansiyometre AI1 hız referansıdır. P1120/P1121 = 10 s. 50 Hz için potu uç konumuna getirin. Yön anahtarı DI2 üzerinden ters komut verir.
- M1 (motor) — 3 Faz Motor; etiketi: “230 V Δ · 1,5 kW”; kayıtlı ayar: {"motorConnection":"delta"}
- RUN (run) — Seçici Anahtar; etiketi: “Çalıştır / Durdur”
- REVERSE (reverse) — Seçici Anahtar; etiketi: “Yön değiştir”
- POT (pot) — Analog Potansiyometre; etiketi: “1 kΩ · hız referansı”; kayıtlı ayar: {"potentiometer":50,"potMax":1000}
- **Kablo bağlantıları:**
- wire0: G1.L → U1.L1
- wire1: G1.N → U1.N
- wire2: G1.PE → U1.PE
- wire3: U1.PE2 → M1.PE
- wire4: U1.U → M1.U
- wire5: U1.V → M1.V
- wire6: U1.W → M1.W
- wire7: U1.12 → U1.14
- wire8: U1.13 → RUN.13
- wire9: RUN.14 → U1.8
- wire10: U1.13b → REVERSE.13
- wire11: REVERSE.14 → U1.9
- wire12: U1.1 → POT.1
- wire13: U1.5 → POT.3
- wire14: U1.2 → POT.2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- U1: “Cn002: çalıştır anahtarını açın. Potansiyometre AI1 hız referansıdır. P1120/P1121 = 10 s. 50 Hz için potu uç konumuna getirin. Yön anahtarı DI2 üzerinden ters komut verir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### v20npn — V20 · NPN kumanda

- **Konu / kazanım:** V20 · NPN kumanda. Kaynak notlarının açıkladığı hedef: NPN: DIC (12) +24 V terminaline bağlıdır. Anahtarlar DI1/DI2 girişlerini 0 V hattına çeker. 30 Hz referans; P1040 değiştirilebilir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/V20_NPN_Sabit_Hiz_v1.16.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 1 Faz Besleme; etiketi: “230 V AC”
- U1 (v20) — SINAMICS V20 · 1 Faz Giriş; etiketi: “SINAMICS V20 · 1,5 kW”; kayıtlı ayar: {"v20":"sürücü ayarları mevcut"}
  Açıklama: NPN: DIC (12) +24 V terminaline bağlıdır. Anahtarlar DI1/DI2 girişlerini 0 V hattına çeker. 30 Hz referans; P1040 değiştirilebilir.
- M1 (motor) — 3 Faz Motor; etiketi: “230 V Δ · 1,5 kW”; kayıtlı ayar: {"motorConnection":"delta"}
- RUN (run) — Seçici Anahtar; etiketi: “Çalıştır / Durdur”
- REVERSE (reverse) — Seçici Anahtar; etiketi: “Yön değiştir”
- **Kablo bağlantıları:**
- wire0: G1.L → U1.L1
- wire1: G1.N → U1.N
- wire2: G1.PE → U1.PE
- wire3: U1.PE2 → M1.PE
- wire4: U1.U → M1.U
- wire5: U1.V → M1.V
- wire6: U1.W → M1.W
- wire7: U1.12 → U1.13
- wire8: U1.14 → RUN.13
- wire9: RUN.14 → U1.8
- wire10: U1.14b → REVERSE.13
- wire11: REVERSE.14 → U1.9
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- U1: “NPN: DIC (12) +24 V terminaline bağlıdır. Anahtarlar DI1/DI2 girişlerini 0 V hattına çeker. 30 Hz referans; P1040 değiştirilebilir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### v20current — V20 · 4–20 mA ve AO1 ölçümü

- **Konu / kazanım:** V20 · 4–20 mA ve AO1 ölçümü. Kaynak notlarının açıkladığı hedef: AI1: P0756[0]=3, x1=4 mA, x2=20 mA. 20 °C = 12 mA = 25 Hz. Sensör sıcaklığını değiştirin. AO1 frekansa göre 0–20 mA üretir (25 Hz → 10 mA).
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/V20_4_20mA_ve_Cikis_Olcumu_v1.16.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (g) — 1 Faz Besleme; etiketi: “230 V AC”
- U1 (v20) — SINAMICS V20 · 1 Faz Giriş; etiketi: “SINAMICS V20 · 1,5 kW”; kayıtlı ayar: {"v20":"sürücü ayarları mevcut"}
  Açıklama: AI1: P0756[0]=3, x1=4 mA, x2=20 mA. 20 °C = 12 mA = 25 Hz. Sensör sıcaklığını değiştirin. AO1 frekansa göre 0–20 mA üretir (25 Hz → 10 mA).
- M1 (motor) — 3 Faz Motor; etiketi: “230 V Δ · 1,5 kW”; kayıtlı ayar: {"motorConnection":"delta"}
- RUN (run) — Seçici Anahtar; etiketi: “Çalıştır / Durdur”
- REVERSE (reverse) — Seçici Anahtar; etiketi: “Yön değiştir”
- DC (dc) — Pozitif DC Besleme
- SENSOR (sensor) — Sıcaklık / Nem Sensörü; etiketi: “20 °C → 12 mA → 25 Hz”; kayıtlı ayar: {"instrumentSettings":{"temperature":20,"humidity":50,"measurement":"both","output":"4-20mA"}}
- AO (ao) — Ampermetre; etiketi: “AO1 · 0–20 mA”
- **Kablo bağlantıları:**
- wire0: G1.L → U1.L1
- wire1: G1.N → U1.N
- wire2: G1.PE → U1.PE
- wire3: U1.PE2 → M1.PE
- wire4: U1.U → M1.U
- wire5: U1.V → M1.V
- wire6: U1.W → M1.W
- wire7: U1.12 → U1.14
- wire8: U1.13 → RUN.13
- wire9: RUN.14 → U1.8
- wire10: U1.13b → REVERSE.13
- wire11: REVERSE.14 → U1.9
- wire12: DC.P → SENSOR.+
- wire13: DC.M → SENSOR.−
- wire14: SENSOR.T → U1.2
- wire15: SENSOR.− → U1.5
- wire16: U1.4 → AO.1
- wire17: AO.2 → U1.5
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- AO (ao) — Ampermetre; etiketi: “AO1 · 0–20 mA”
- **Beklenen çalışma / açıklama:**
- U1: “AI1: P0756[0]=3, x1=4 mA, x2=20 mA. 20 °C = 12 mA = 25 Hz. Sensör sıcaklığını değiştirin. AO1 frekansa göre 0–20 mA üretir (25 Hz → 10 mA).”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, DC, SENSOR. Ölçü aleti göstergesi: AO: 0 mA (0 A).

### ht2115 — Gentek · sıcaklık ve nem

- **Konu / kazanım:** Gentek · sıcaklık ve nem. Kaynak notlarının açıkladığı hedef: 20 °C → 12 mA; %25 RH → 8 mA. Özelliklerden sıcaklık, nem ve çıkış türünü değiştir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Gentek_HT2_Sicaklik_ve_Nem_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — Sıcaklık / Nem Sensörü; etiketi: “Sıcaklık / Nem Sensörü”; kayıtlı ayar: {"instrumentSettings":{"temperature":20,"humidity":25,"measurement":"both","output":"4-20mA"}}
  Açıklama: 20 °C → 12 mA; %25 RH → 8 mA. Özelliklerden sıcaklık, nem ve çıkış türünü değiştir.
- T · mA (it) — Ampermetre; etiketi: “Ampermetre”
- RH · mA (irh) — Ampermetre; etiketi: “Ampermetre”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.+
- w1: 24 VDC.M → B.−
- w2: B.T → T · mA.1
- w3: T · mA.2 → B.−
- w4: B.RH → RH · mA.1
- w5: RH · mA.2 → B.−
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- T · mA (it) — Ampermetre; etiketi: “Ampermetre”
- RH · mA (irh) — Ampermetre; etiketi: “Ampermetre”
- **Beklenen çalışma / açıklama:**
- B: “20 °C → 12 mA; %25 RH → 8 mA. Özelliklerden sıcaklık, nem ve çıkış türünü değiştir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, B. Ölçü aleti göstergesi: T · mA: 12 mA (0.012 A); RH · mA: 8 mA (0.008 A).

### waz115 — WAZ5 · V → mA

- **Konu / kazanım:** WAZ5 · V → mA. Kaynak notlarının açıkladığı hedef: Giriş değerini 0–10 V arasında değiştir. 0 V → 4 mA; 5 V → 12 mA; 10 V → 20 mA.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/WAZ5_0_10V_4_20mA_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — mA/V Sinyal Dönüştürücü; etiketi: “mA/V Sinyal Dönüştürücü”; kayıtlı ayar: {"instrumentSettings":{"source":"manual","inputValue":5}}
  Açıklama: Giriş değerini 0–10 V arasında değiştir. 0 V → 4 mA; 5 V → 12 mA; 10 V → 20 mA.
- Çıkış · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.4
- w1: 24 VDC.M → B.5
- w2: B.7 → Çıkış · mA.1
- w3: Çıkış · mA.2 → B.8
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Çıkış · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Beklenen çalışma / açıklama:**
- B: “Giriş değerini 0–10 V arasında değiştir. 0 V → 4 mA; 5 V → 12 mA; 10 V → 20 mA.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, B. Ölçü aleti göstergesi: Çıkış · mA: 12 mA (0.012 A).

### rtd115 — ORDEL · PT100 döngüsü

- **Konu / kazanım:** ORDEL · PT100 döngüsü. Kaynak notlarının açıkladığı hedef: PT100: 4–5; köprü: 5–6. 50 °C → 119.397 Ω → 12 mA.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ORDEL_HMTR_PT100_Dongusu_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — Sıcaklık Sinyal Dönüştürücü; etiketi: “Sıcaklık Sinyal Dönüştürücü”; kayıtlı ayar: {"instrumentSettings":{"input":"PT100","low":0,"high":100}}
  Açıklama: PT100: 4–5; köprü: 5–6. 50 °C → 119.397 Ω → 12 mA.
- PT100 (r) — PT100 Direnç Termometresi · 2 Telli; etiketi: “PT100 Direnç Termometresi · 2 Telli”; kayıtlı ayar: {"temperature":50}
- Döngü · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.2
- w1: B.1 → Döngü · mA.1
- w2: Döngü · mA.2 → 24 VDC.M
- w3: B.4 → PT100.A
- w4: B.5 → PT100.B1
- w5: B.5 → B.6
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Döngü · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Beklenen çalışma / açıklama:**
- B: “PT100: 4–5; köprü: 5–6. 50 °C → 119.397 Ω → 12 mA.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, B. Ölçü aleti göstergesi: Döngü · mA: 12 mA (0.012 A).

### tc115 — ORDEL · termokupl döngüsü

- **Konu / kazanım:** ORDEL · termokupl döngüsü. Kaynak notlarının açıkladığı hedef: K tipi TC: 4(+)–5(−). 400 °C → 12 mA. Sensör ile dönüştürücü tipi aynı olmalı.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ORDEL_HMTT_Termokupl_Dongusu_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — Sıcaklık Sinyal Dönüştürücü; etiketi: “Sıcaklık Sinyal Dönüştürücü”; kayıtlı ayar: {"instrumentSettings":{"input":"K","low":0,"high":800}}
  Açıklama: K tipi TC: 4(+)–5(−). 400 °C → 12 mA. Sensör ile dönüştürücü tipi aynı olmalı.
- K TC (r) — Termokupl · Çift Elemanlı; etiketi: “Termokupl · Çift Elemanlı”; kayıtlı ayar: {"temperature":400,"coldJunction":25,"thermocoupleType":"K"}
- Döngü · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.2
- w1: B.1 → Döngü · mA.1
- w2: Döngü · mA.2 → 24 VDC.M
- w3: B.4 → K TC.+
- w4: B.5 → K TC.−
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Döngü · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Beklenen çalışma / açıklama:**
- B: “K tipi TC: 4(+)–5(−). 400 °C → 12 mA. Sensör ile dönüştürücü tipi aynı olmalı.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, B. Ölçü aleti göstergesi: Döngü · mA: 12 mA (0.012 A).

### enda115 — ENDA · sıcaklık kontrolü

- **Konu / kazanım:** ENDA · sıcaklık kontrolü. Kaynak notlarının açıkladığı hedef: Sensörü 100 °C üstüne çıkar: C/A2 rölesi ve ısıtma lambası kapanır. 98 °C altına indir: yeniden açılır.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/ENDA_ET4420_PT100_Kontrol_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — Sıcaklık Kontrol Cihazı; etiketi: “Sıcaklık Kontrol Cihazı”; kayıtlı ayar: {"instrumentSettings":{"supply":"LV","input":"PT100","set":100,"pb":0,"filter":1,"hy":2,"controlOutput":"relay"}}
  Açıklama: Sensörü 100 °C üstüne çıkar: C/A2 rölesi ve ısıtma lambası kapanır. 98 °C altına indir: yeniden açılır.
- PT100 (r) — PT100 Direnç Termometresi · 2 Telli; etiketi: “PT100 Direnç Termometresi · 2 Telli”; kayıtlı ayar: {"temperature":25}
- Isıtma (h) — Kırmızı Sinyal Lambası; etiketi: “Kırmızı Sinyal Lambası”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.11
- w1: 24 VDC.M → B.12
- w2: B.9 → PT100.A
- w3: B.10 → PT100.B1
- w4: B.8 → B.9
- w5: 24 VDC.P → B.14
- w6: B.15 → Isıtma.X1
- w7: Isıtma.X2 → 24 VDC.M
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- B: “Sensörü 100 °C üstüne çıkar: C/A2 rölesi ve ısıtma lambası kapanır. 98 °C altına indir: yeniden açılır.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, B, Isıtma.

### tx115 — Baykon · kg → mA

- **Konu / kazanım:** Baykon · kg → mA. Kaynak notlarının açıkladığı hedef: 250 kg → 2.5 mV → 8 mA. Yük hücresinin yük değerini değiştir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Baykon_TX11_Loadcell_Analog_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — Tartım Göstergesi; etiketi: “Tartım Göstergesi”; kayıtlı ayar: {"instrumentSettings":{"capacity":1000,"spanMv":10,"zeroMv":0,"output":"4-20mA"}}
  Açıklama: 250 kg → 2.5 mV → 8 mA. Yük hücresinin yük değerini değiştir.
- 1000 kg / 2 mV/V (r) — Yük Hücresi · Kobastar SB2; etiketi: “Yük Hücresi · Kobastar SB2”; kayıtlı ayar: {"loadWeight":250,"loadCapacity":1000}
- Çıkış · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.+
- w1: 24 VDC.M → B.−
- w2: B.EX+ → 1000 kg / 2 mV/V.EX+
- w3: B.EX− → 1000 kg / 2 mV/V.EX−
- w4: 1000 kg / 2 mV/V.SIG+ → B.S+
- w5: 1000 kg / 2 mV/V.SIG− → B.S−
- w6: B.I → Çıkış · mA.1
- w7: Çıkış · mA.2 → B.G
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Çıkış · mA (i) — Ampermetre; etiketi: “Ampermetre”
- **Beklenen çalışma / açıklama:**
- B: “250 kg → 2.5 mV → 8 mA. Yük hücresinin yük değerini değiştir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, B, 1000 kg / 2 mV/V. Ölçü aleti göstergesi: Çıkış · mA: 8 mA (0.008 A).

### meter115 — UNI-T · hareketli problar

- **Konu / kazanım:** UNI-T · hareketli problar. Kaynak notlarının açıkladığı hedef: DC 200 V kademesi: 24 V. Simülasyonda prob gövdesini tutup terminale yaklaştır veya uzaklaştır. Problar boşta iken ölçüm değişir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/UT33D_Hareketli_Problar_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- M (m) — UNI-T UT33D+ Multimetre; etiketi: “UNI-T UT33D+ Multimetre”; kayıtlı ayar: {"meterPosition":4}
  Açıklama: DC 200 V kademesi: 24 V. Simülasyonda prob gövdesini tutup terminale yaklaştır veya uzaklaştır. Problar boşta iken ölçüm değişir.
- + (red) — Kırmızı Ölçüm Probu; etiketi: “Kırmızı Ölçüm Probu”; kayıtlı ayar: {"probeFor":"m","probeTarget":{"c":"g","p":"P"}}
- COM (black) — Siyah Ölçüm Probu; etiketi: “Siyah Ölçüm Probu”; kayıtlı ayar: {"probeFor":"m","probeTarget":{"c":"g","p":"M"}}
- **Kablo bağlantıları:**
- w0: M.V → +.PLUG
- w1: M.COM → COM.PLUG
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- M (m) — UNI-T UT33D+ Multimetre; etiketi: “UNI-T UT33D+ Multimetre”; kademe/konum 4
- + (red) — Kırmızı Ölçüm Probu; etiketi: “Kırmızı Ölçüm Probu”; hedef {"c":"g","p":"P"}
- COM (black) — Siyah Ölçüm Probu; etiketi: “Siyah Ölçüm Probu”; hedef {"c":"g","p":"M"}
- **Beklenen çalışma / açıklama:**
- M: “DC 200 V kademesi: 24 V. Simülasyonda prob gövdesini tutup terminale yaklaştır veya uzaklaştır. Problar boşta iken ölçüm değişir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, M.

### lit115 — Işıklı buton · bağımsız lamba

- **Konu / kazanım:** Işıklı buton · bağımsız lamba. Kaynak notlarının açıkladığı hedef: X1/X2 bağımsız lamba beslemesidir. Buton ışığı sürekli yanar; butona basılı tutulurken H1 yanar.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Isikli_Buton_Bagimsiz_Lamba_v1.15.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- B (b) — Işıklı Buton; etiketi: “Işıklı Buton”
  Açıklama: X1/X2 bağımsız lamba beslemesidir. Buton ışığı sürekli yanar; butona basılı tutulurken H1 yanar.
- H1 (h) — Yeşil Sinyal Lambası; etiketi: “Yeşil Sinyal Lambası”
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B.13
- w1: B.14 → H1.X1
- w2: H1.X2 → 24 VDC.M
- w3: 24 VDC.P → B.X1
- w4: 24 VDC.M → B.X2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- B: “X1/X2 bağımsız lamba beslemesidir. Buton ışığı sürekli yanar; butona basılı tutulurken H1 yanar.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC.

### control — ▶ Başlat / durdur ve mühürleme

- **Konu / kazanım:** ▶ Başlat / durdur ve mühürleme. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — Başlık ve parça etiketleri var; adım sırası ve mühürleme davranışını anlatan ders açıklaması yok.
- **Eşleşen proje dosyaları:** Ornekler/K1_S2_Muhurleme.odsdevre, Kaydedilen_Projeler/01_Kumanda_Muhurleme.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- S3 (source) — 1 Faz Besleme; etiketi: “1 Faz Besleme”; kayıtlı ayar: {"state":false}
- S0 (stop) — Durdur Butonu; etiketi: “Durdur / mühürlemeyi çöz”; kayıtlı ayar: {"state":false}
- S2 (start) — Başlat Butonu; etiketi: “Başlat — basıp bırakın”; kayıtlı ayar: {"state":false}
- K1 (hold) — Yardımcı Kontak; etiketi: “NO mühürleme kontağı”; kayıtlı ayar: {"state":false}
- K1 (coil) — Kontaktör Bobini; etiketi: “Kontaktör bobini”; kayıtlı ayar: {"state":false}
- S1 (ps) — 24 VDC Güç Kaynağı; etiketi: “24 V güç kaynağı”; kayıtlı ayar: {"state":false}
- H1 (lamp) — Kırmızı Sinyal Lambası; etiketi: “Mühürleme varken yanar”; kayıtlı ayar: {"state":false}
- **Kablo bağlantıları:**
- w1: S3.L → S0.21 (hat L1)
- w2: S0.22 → ek noktası feed (hat L1)
- w3: ek noktası feed → K1.13 (hat L1)
- w4: ek noktası feed → S2.13 (hat L1)
- w5: K1.14 → ek noktası load (hat L1)
- w6: S2.14 → ek noktası load (hat L1)
- w7: ek noktası load → K1.A1 (hat L1)
- w8: ek noktası load → S1.L (hat L1)
- w9: S3.N → ek noktası neutral (hat N)
- w10: K1.A2 → ek noktası neutral (hat N)
- w11: S1.N → ek noktası neutral (hat N)
- w12: S1.P → H1.X1 (hat +24V)
- w13: S1.M → H1.X2 (hat 0V)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: S3.

### building — ⌂ Vavien aydınlatma

- **Konu / kazanım:** ⌂ Vavien aydınlatma. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — Başlık ve bağlantılar var; iki anahtar konumuna göre lamba durumunu açıklayan ders metni yok.
- **Eşleşen proje dosyaları:** Kaydedilen_Projeler/02_Tesisat_Vavien.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- X0 (source) — 1 Faz Besleme; etiketi: “1 Faz Besleme”; kayıtlı ayar: {"state":false}
- S1 (s1) — Vaviyen Anahtar; etiketi: “Vaviyen Anahtar”; kayıtlı ayar: {"state":false}
- S2 (s2) — Vaviyen Anahtar; etiketi: “Vaviyen Anahtar”; kayıtlı ayar: {"state":false}
- H1 (light) — Tavan Armatürü; etiketi: “Tavan Armatürü”; kayıtlı ayar: {"state":false}
- **Kablo bağlantıları:**
- w1: X0.L → S1.11 (hat L1)
- w2: S1.12 → S2.12 (hat L1)
- w3: S1.14 → S2.14 (hat L1)
- w4: S2.11 → H1.X1 (hat L1)
- w5: H1.X2 → X0.N (hat N)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: X0, H1.

### panel — ▤ Raylı eğitim panosu

- **Konu / kazanım:** ▤ Raylı eğitim panosu. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — Yalnız pano yerleşim şablonu; kaynakta öğrenme amacı ve işlem açıklaması yok.
- **Eşleşen proje dosyaları:** Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- Şema bileşeni yok.
- **Kablo bağlantıları:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Q1 (mcb-3p), montaj: rail; konum: 80, 137.5
- Q2 (mcb-1p), montaj: rail; konum: 165, 137.5
- G1 (smps), montaj: rail; konum: 255, 117.5
- K1 (main-contact), montaj: rail; konum: 90, 337.5
- K2 (coil-contactor), montaj: rail; konum: 180, 337.5
- K1 (contact-no), montaj: rail; konum: 270, 340
- X1 (terminal-2), montaj: rail; konum: 95, 585
- X2 (terminal-2), montaj: rail; konum: 115, 585
- PE (terminal-pe), montaj: rail; konum: 140, 585
- S1 (push-no), montaj: door; konum: 135, 395
- S0 (push-nc), montaj: door; konum: 235, 395
- H1 (lamp-green), montaj: door; konum: 335, 395
- Q0 (door-isolator-3p), montaj: door; konum: 120, 500
- PV1 (meter-voltmeter), montaj: door; konum: 120, 160
- PA1 (meter-ammeter), montaj: door; konum: 280, 160
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Elektrik simülasyonu uygulanmaz; pano görünümünde 15 yerleşim elemanı var.

### analog110 — ↔ Analog sensör çubukları

- **Konu / kazanım:** ↔ Analog sensör çubukları. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — Üç sensör ve besleme bağlı; öğrenme amacı, hedef değer ve ölçüm sonucu açıklanmamış.
- **Eşleşen proje dosyaları:** Ornekler/Analog_Cubuklar_v1.10.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (s) — Pozitif DC Besleme
- B1 (b0) — Analog Seviye Sensörü
- B2 (b1) — Doğrusal Konum Sensörü – Lineer Potansiyometre
- B3 (b2) — Ultrasonik Mesafe Sensörü · Analog
- **Kablo bağlantıları:**
- s-P-b0-+: G1.P → B1.+
- s-M-b0-−: G1.M → B1.−
- s-P-b1-1: G1.P → B2.1
- s-M-b1-3: G1.M → B2.3
- s-P-b2-BN: G1.P → B3.BN
- s-M-b2-BU: G1.M → B3.BU
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, B1, B2, B3.

### selector110 — ↻ Seçici ve üç lamba

- **Konu / kazanım:** ↻ Seçici ve üç lamba. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — Üç konumlu seçici ve lambalar bağlı; konum/çıkış tablosu veya beklenen durum açıklanmamış.
- **Eşleşen proje dosyaları:** Ornekler/Secici_3_Kademe_v1.10.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (s) — Pozitif DC Besleme
- S1 (sel) — 3 Çıkışlı Seçici; kayıtlı ayar: {"position":0}
- H1 (h1) — Yeşil Sinyal Lambası
- H2 (h2) — Yeşil Sinyal Lambası
- H3 (h3) — Yeşil Sinyal Lambası
- **Kablo bağlantıları:**
- s-P-sel-11: G1.P → S1.11
- sel-13-h1-X1: S1.13 → H1.X1
- s-M-h1-X2: G1.M → H1.X2
- sel-14-h2-X1: S1.14 → H2.X1
- s-M-h2-X2: G1.M → H2.X2
- sel-15-h3-X1: S1.15 → H3.X1
- s-M-h3-X2: G1.M → H3.X2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### sounds110 — ♪ Flaşör ve sesli uyarılar

- **Konu / kazanım:** ♪ Flaşör ve sesli uyarılar. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — Alarm elemanları bağlı; hangi kumanda kombinasyonunun hangi uyarıyı ürettiğini anlatan ders açıklaması yok.
- **Eşleşen proje dosyaları:** Ornekler/Flasor_ve_Sesli_Uyarilar_v1.10.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- G1 (s) — Pozitif DC Besleme
- S1 (sw0) — Kalıcı Tip Buton; kayıtlı ayar: {"state":false}
- H1 (h0) — Flaşör
- S2 (sw1) — Kalıcı Tip Buton; kayıtlı ayar: {"state":false}
- H2 (h1) — Flaşörlü İkaz Lambası
- S3 (sw2) — Kalıcı Tip Buton; kayıtlı ayar: {"state":false}
- H3 (h2) — Hoparlör
- S4 (sw3) — Kalıcı Tip Buton; kayıtlı ayar: {"state":false}
- H4 (h3) — Buzzer
- S5 (sw4) — Kalıcı Tip Buton; kayıtlı ayar: {"state":false}
- H5 (h4) — İhbar / Alarm
- S6 (sw5) — Kalıcı Tip Buton; kayıtlı ayar: {"state":false}
- H6 (h5) — Siren
- **Kablo bağlantıları:**
- s-P-sw0-13: G1.P → S1.13
- sw0-14-h0-1: S1.14 → H1.1
- s-M-h0-2: G1.M → H1.2
- s-P-sw1-13: G1.P → S2.13
- sw1-14-h1-1: S2.14 → H2.1
- s-M-h1-2: G1.M → H2.2
- s-P-sw2-13: G1.P → S3.13
- sw2-14-h2-1: S3.14 → H3.1
- s-M-h2-2: G1.M → H3.2
- s-P-sw3-13: G1.P → S4.13
- sw3-14-h3-1: S4.14 → H4.1
- s-M-h3-2: G1.M → H4.2
- s-P-sw4-13: G1.P → S5.13
- sw4-14-h4-1: S5.14 → H5.1
- s-M-h4-2: G1.M → H5.2
- s-P-sw5-13: G1.P → S6.13
- sw5-14-h5-1: S6.14 → H6.1
- s-M-h5-2: G1.M → H6.2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### temperature112 — ↕ NTC ve sıcaklık probları

- **Konu / kazanım:** ↕ NTC ve sıcaklık probları. Kaynak notlarının açıkladığı hedef: Sağdaki çubuğu sürükleyin: sıcaklık artınca direnç azalır.
- **Sınıflandırma:** DÜZELTİLMELİ — Yalnız NTC için sürükleme notu var; PT100 ve termokuplun amacı/ölçümü açıklanmamış, sensörler devreye bağlanmamış.
- **Eşleşen proje dosyaları:** Ornekler/NTC_Sicaklik_ve_Prob_Gorselleri_v1.12.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- NTC (ntc) — NTC Sıcaklık Sensörü; kayıtlı ayar: {"temperature":25}
  Açıklama: Sağdaki çubuğu sürükleyin: sıcaklık artınca direnç azalır.
- PT100 (pt) — PT100 Direnç Termometresi · 3 Telli
- TC (tc) — Termokupl · Çift Elemanlı
- **Kablo bağlantıları:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- NTC: “Sağdaki çubuğu sürükleyin: sıcaklık artınca direnç azalır.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### load112 — ↓ Kobastar SB2 yük hücresi

- **Konu / kazanım:** ↓ Kobastar SB2 yük hücresi. Kaynak notlarının açıkladığı hedef: Ok: basılı tut veya aşağı sürükle. 500 kg → 10 mV; 1000 kg → 20 mV.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Kobastar_SB2_Yuk_Hucresi_v1.12.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- EX (s) — Yük Hücresi Beslemesi · 10 VDC
- B1 (b) — Yük Hücresi · Kobastar SB2; kayıtlı ayar: {"loadWeight":0,"loadCapacity":1000}
  Açıklama: Ok: basılı tut veya aşağı sürükle. 500 kg → 10 mV; 1000 kg → 20 mV.
- mV (v) — Voltmetre
- **Kablo bağlantıları:**
- w0: EX.P → B1.EX+
- w1: EX.M → B1.EX−
- w2: B1.SIG+ → mV.1
- w3: B1.SIG− → mV.2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- mV (v) — Voltmetre
- **Beklenen çalışma / açıklama:**
- B1: “Ok: basılı tut veya aşağı sürükle. 500 kg → 10 mV; 1000 kg → 20 mV.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: EX, B1. Ölçü aleti göstergesi: mV: 0 mV.

### reed113 — ↔ Reed mıknatıs takımı

- **Konu / kazanım:** ↔ Reed mıknatıs takımı. Kaynak notlarının açıkladığı hedef: Mıknatısı gövdeye yaklaştırın. Varsayılan 10 mm eğitim eşiğidir. / Mıknatısı gövdeye yaklaştırın. Varsayılan 10 mm eğitim eşiğidir.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Reed_Miknatis_NO_NC_v1.13.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (s) — Pozitif DC Besleme
- B1 (b0) — Reed Manyetik Kontak Takımı · NO
  Açıklama: Mıknatısı gövdeye yaklaştırın. Varsayılan 10 mm eğitim eşiğidir.
- NO (h0) — Yeşil Sinyal Lambası
- B2 (b1) — Reed Manyetik Kontak Takımı · NC
  Açıklama: Mıknatısı gövdeye yaklaştırın. Varsayılan 10 mm eğitim eşiğidir.
- NC (h1) — Yeşil Sinyal Lambası
- **Kablo bağlantıları:**
- w0: 24 VDC.P → B1.13
- w1: B1.14 → NO.X1
- w2: NO.X2 → 24 VDC.M
- w3: 24 VDC.P → B2.21
- w4: B2.22 → NC.X1
- w5: NC.X2 → 24 VDC.M
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- B1: “Mıknatısı gövdeye yaklaştırın. Varsayılan 10 mm eğitim eşiğidir.”
- B2: “Mıknatısı gövdeye yaklaştırın. Varsayılan 10 mm eğitim eşiğidir.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, NC.

### visuals113 — ▦ Siemens ve mekanik görseller

- **Konu / kazanım:** ▦ Siemens ve mekanik görseller. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — 11 malzeme, kablo yok; amaç ve malzeme görevleri açıklanmamış.
- **Eşleşen proje dosyaları:** Ornekler/Siemens_ve_Mekanik_Gorseller_v1.13.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- Q1 (v0) — Otomatik Sigorta
- Q2 (v1) — Otomatik Sigorta
- Q3 (v2) — Otomatik Sigorta
- Q4 (v3) — Tek Kutuplu Ayırıcı
- Q5 (v4) — Termik Manyetik Şalter
- Q6 (v5) — Termik Manyetik Şalter · 1P
- Q7 (v6) — Sınır Anahtarı
- Q8 (v7) — Sınır Anahtarı
- Q9 (v8) — Mekanik Kumanda
- Q10 (v9) — Mekanik Kilitleme
- Q11 (v10) — Sigortalı Şalter · 3 Klemens
- **Kablo bağlantıları:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### visuals111 — ▦ v1.11 malzemeler

- **Konu / kazanım:** ▦ v1.11 malzemeler. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — 20 malzeme, kablo yok; amaç ve malzeme görevleri açıklanmamış.
- **Eşleşen proje dosyaları:** Ornekler/Yeni_Malzeme_Kumandalari_v1.11.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- V0 (v0) — Hoparlör; kayıtlı ayar: {"potMax":100000}
- V1 (v1) — Buzzer; kayıtlı ayar: {"potMax":100000}
- V2 (v2) — İhbar / Alarm; kayıtlı ayar: {"potMax":100000}
- V3 (v3) — Siren; kayıtlı ayar: {"potMax":100000}
- V4 (v4) — PT100 Direnç Termometresi · 4 Telli; kayıtlı ayar: {"potMax":100000}
- V5 (v5) — Termokupl · Çift Elemanlı; kayıtlı ayar: {"potMax":100000}
- V6 (v6) — Analog Potansiyometre; kayıtlı ayar: {"potMax":100000}
- V7 (v7) — Sınır Anahtarı; kayıtlı ayar: {"potMax":100000}
- V8 (v8) — Termik Manyetik Şalter; kayıtlı ayar: {"potMax":100000}
- V9 (v9) — Otomatik Sigorta; kayıtlı ayar: {"potMax":100000}
- V10 (v10) — Sigortalı Şalter · 3 Klemens; kayıtlı ayar: {"potMax":100000}
- V11 (v11) — NH Sigortalı Yük Ayırıcı · Siemens 3NP1; kayıtlı ayar: {"potMax":100000}
- V12 (v12) — NH Bıçaklı Sigorta; kayıtlı ayar: {"potMax":100000}
- V13 (v13) — 1 Kutuplu Aç–Kapa Şalter; kayıtlı ayar: {"potMax":100000}
- V14 (v14) — Yıldız / Üçgen Paket Şalter; kayıtlı ayar: {"potMax":100000}
- V15 (v15) — Faz Sırası Rölesi · Tense FS-R; kayıtlı ayar: {"potMax":100000}
- V16 (v16) — Faz Koruma Rölesi · Tense FKV-03; kayıtlı ayar: {"potMax":100000}
- V17 (v17) — Direnç; kayıtlı ayar: {"potMax":100000}
- V18 (v18) — Sargı; kayıtlı ayar: {"potMax":100000}
- V19 (v19) — Akım Trafosu; kayıtlı ayar: {"potMax":100000}
- **Kablo bağlantıları:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### ct111 — ↔ Akım trafosu

- **Konu / kazanım:** ↔ Akım trafosu. Kaynak notlarının açıkladığı hedef: 23 Ω yük: 230 V / 23 Ω = 10 A / 100/5 oranında 10 A → 0,5 A
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Akim_Trafosu_100_5_v1.11.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- S (s) — 1 Faz Besleme
- CT (ct) — Akım Trafosu
- R (r) — Direnç
  Açıklama: 23 Ω yük: 230 V / 23 Ω = 10 A
- A (a) — Ampermetre
  Açıklama: 100/5 oranında 10 A → 0,5 A
- **Kablo bağlantıları:**
- sLctP1: S.L → CT.P1
- ctP2r1: CT.P2 → R.1
- r2sN: R.2 → S.N
- ctS1a1: CT.S1 → A.1
- a2ctS2: A.2 → CT.S2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- A (a) — Ampermetre
- **Beklenen çalışma / açıklama:**
- R: “23 Ω yük: 230 V / 23 Ω = 10 A”
- A: “100/5 oranında 10 A → 0,5 A”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: S, R. Ölçü aleti göstergesi: A: 500 mA (0.5 A).

### phase111 — ϟ Faz röleleri

- **Konu / kazanım:** ϟ Faz röleleri. Kaynak notlarının açıkladığı hedef: Sağ menüde L2 = 100 V: FKV-03 bırakır. L2 = 0 V: iki röle de bırakır.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Faz_Roleleri_v1.11.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- S (s) — 3 Faz Besleme
  Açıklama: Sağ menüde L2 = 100 V: FKV-03 bırakır. L2 = 0 V: iki röle de bırakır.
- FS (fs) — Faz Sırası Rölesi · Tense FS-R
- FK (fk) — Faz Koruma Rölesi · Tense FKV-03
- L1 (l1) — Yeşil Sinyal Lambası
- L2 (l2) — Yeşil Sinyal Lambası
- **Kablo bağlantıları:**
- sNfsN: S.N → FS.N
- sL1fsL1: S.L1 → FS.L1
- sL2fsL2: S.L2 → FS.L2
- sL3fsL3: S.L3 → FS.L3
- sL1fs11: S.L1 → FS.11
- fs14l1X1: FS.14 → L1.X1
- l1X2sN: L1.X2 → S.N
- sNfkN: S.N → FK.N
- sL1fkL1: S.L1 → FK.L1
- sL2fkL2: S.L2 → FK.L2
- sL3fkL3: S.L3 → FK.L3
- sL1fk11: S.L1 → FK.11
- fk14l2X1: FK.14 → L2.X1
- l2X2sN: L2.X2 → S.N
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- S: “Sağ menüde L2 = 100 V: FKV-03 bırakır. L2 = 0 V: iki röle de bırakır.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: S, FS, FK, L1, L2.

### fuses111 — ▥ Sigortalar ve NH

- **Konu / kazanım:** ▥ Sigortalar ve NH. Kaynak notlarının açıkladığı hedef: Kapağı açınca üç faz ayrılır. Açıkken sigortalar sağ menüden takılır.
- **Sınıflandırma:** UYUMLU — Konuya özel kullanım/ölçüm notu var; komponent ve pin denetimi ile varsayılan çözüm tutarlı.
- **Eşleşen proje dosyaları:** Ornekler/Bagimsiz_Sigortalar_ve_NH_Kapak_v1.11.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- S (s) — Pozitif DC Besleme
- F (f) — Sigortalı Şalter · 3 Klemens
- NH (nh) — NH Sigortalı Yük Ayırıcı · Siemens 3NP1
  Açıklama: Kapağı açınca üç faz ayrılır. Açıkken sigortalar sağ menüden takılır.
- FL0 (fl0) — Yeşil Sinyal Lambası
- FL1 (fl1) — Yeşil Sinyal Lambası
- FL2 (fl2) — Yeşil Sinyal Lambası
- NHL0 (nhl0) — Yeşil Sinyal Lambası
- NHL1 (nhl1) — Yeşil Sinyal Lambası
- NHL2 (nhl2) — Yeşil Sinyal Lambası
- **Kablo bağlantıları:**
- sPf1: S.P → F.1
- f2fl0X1: F.2 → FL0.X1
- fl0X2sM: FL0.X2 → S.M
- sPf3: S.P → F.3
- f4fl1X1: F.4 → FL1.X1
- fl1X2sM: FL1.X2 → S.M
- sPf5: S.P → F.5
- f6fl2X1: F.6 → FL2.X1
- fl2X2sM: FL2.X2 → S.M
- sPnh1: S.P → NH.1
- nh2nhl0X1: NH.2 → NHL0.X1
- nhl0X2sM: NHL0.X2 → S.M
- sPnh3: S.P → NH.3
- nh4nhl1X1: NH.4 → NHL1.X1
- nhl1X2sM: NHL1.X2 → S.M
- sPnh5: S.P → NH.5
- nh6nhl2X1: NH.6 → NHL2.X1
- nhl2X2sM: NHL2.X2 → S.M
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- NH: “Kapağı açınca üç faz ayrılır. Açıkken sigortalar sağ menüden takılır.”
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: S, FL0, FL1, FL2, NHL0, NHL1, NHL2.

### visuals110 — ▦ Yeni ürün görselleri

- **Konu / kazanım:** ▦ Yeni ürün görselleri. Ayrı öğrenme kazanımı kaynakta belirtilmemiş.
- **Sınıflandırma:** DÜZELTİLMELİ — 16 malzeme, kablo yok; amaç ve malzeme görevleri açıklanmamış.
- **Eşleşen proje dosyaları:** Ornekler/Yeni_Gorseller_v1.10.odsdevre
- **Komponentler ve kayıtlı görevleri:**
- D1 (v0) — Analog Seviye Sensörü
- D2 (v1) — Doğrusal Konum Sensörü – Lineer Potansiyometre
- D3 (v2) — Ultrasonik Mesafe Sensörü · U1KT003
- D4 (v3) — Termik Röle
- D5 (v4) — DC Röle Bobini
- D6 (v5) — Çekmede Gecikmeli Bobin
- D7 (v6) — Bırakmada Gecikmeli Bobin
- D8 (v7) — Jog Butonu · 4 Uçlu
- D9 (v8) — Kalıcı Tip Buton
- D10 (v9) — 1 Çıkışlı Seçici
- D11 (v10) — 2 Çıkışlı Seçici
- D12 (v11) — 3 Çıkışlı Seçici
- D13 (v12) — 1 Kutuplu Aç–Kapa Şalter
- D14 (v13) — 2 Kutuplu Aç–Kapa Şalter
- D15 (v14) — 3 Kutuplu Aç–Kapa Şalter
- D16 (v15) — Üç Fazlı Paket Şalter
- **Kablo bağlantıları:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Beklenen çalışma / açıklama:**
- Ayrı açıklama veya beklenen sonuç metni yok; görünen bilgi başlık ve komponent etiketleriyle sınırlı.
- **Gerçek varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

## Ana ekrana bağlı olmayan 26 arşiv örneği

Bunlar mevcut HTML ana ekranında seçilebilir ders olarak görünmüyor; depoda dosya örneği olarak duruyor. Kaynak içerikleri yine envantere alındı. Ana ekrandaki control kaydının iki eşleşen .odsdevre kopyası bu 26 arşiv dışı kayıttan ayrı tutuldu; kopyalar ayrı ders sayılmadı.

### Ornekler/220V_24V_Esnek_Prob_v1.15.1.odsdevre

- **Başlık / konu:** 220V_24V_Kablo_Uzerinden_Olcum
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- 220 VAC (s) — 3 Faz Besleme
- G1 (ps) — 24 VDC Güç Kaynağı; etiketi: “24 VDC güç kaynağı”
- H1 (lamp) — Yeşil Sinyal Lambası
- UT33D+ (m) — UNI-T UT33D+ Multimetre; kayıtlı ayar: {"meterPosition":4}
- k (k) — Siyah Ölçüm Probu; kayıtlı ayar: {"probeFor":"m","probeTarget":{"w":"negative","t":0.56}}
- r (r) — Kırmızı Ölçüm Probu; kayıtlı ayar: {"probeFor":"m","probeTarget":{"w":"positive","t":0.48}}
- **Bağlantılar:**
- inputL: 220 VAC.L1 → G1.L (hat L1)
- inputN: 220 VAC.N → G1.N (hat N)
- positive: G1.P → H1.X1 (hat +24V)
- negative: G1.M → H1.X2 (hat 0V)
- redlead: UT33D+.V → r.PLUG (hat MEASURE)
- blacklead: UT33D+.COM → k.PLUG (hat MEASURE)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- k (k) — Siyah Ölçüm Probu; hedef {"w":"negative","t":0.56}
- r (r) — Kırmızı Ölçüm Probu; hedef {"w":"positive","t":0.48}
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 220 VAC, G1, H1, UT33D+.

### Ornekler/3D_Buton_Kontaktor_Motor.odsdevre

- **Başlık / konu:** 3D · Buton, kontaktör, motor ve fan
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (source) — 3 Faz Besleme; etiketi: “3 Faz Besleme”; kayıtlı ayar: {"state":false}
- S0 (stop) — Durdur Butonu; etiketi: “Durdur”; kayıtlı ayar: {"state":false}
- S2 (start) — Başlat Butonu; etiketi: “Başlat — basıp bırakın”; kayıtlı ayar: {"state":false}
- K1 (hold) — Yardımcı Kontak; etiketi: “Mühürleme kontağı”; kayıtlı ayar: {"state":false}
- K1 (coil) — Kontaktör Bobini; etiketi: “Kontaktör bobini”; kayıtlı ayar: {"state":false}
- K1 (main) — Güç Kontaktörü; etiketi: “Üç faz güç kontakları”; kayıtlı ayar: {"state":false}
- M1 (motor) — 3 Faz Motor; etiketi: “Faz sırasına göre döner”; kayıtlı ayar: {"state":false}
- M2 (fan) — Filtreli Pano Fanı; etiketi: “Pano fanı”; kayıtlı ayar: {"state":false}
- G2 (ps) — 24 VDC Güç Kaynağı; etiketi: “Weidmüller 24 V”; kayıtlı ayar: {"state":false}
- H1 (lamp) — Yeşil Sinyal Lambası; etiketi: “Çalışma lambası”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w1: G1.L1 → ek noktası l1 (hat L1)
- w2: ek noktası l1 → K1.1 (hat L1)
- w3: G1.L2 → K1.3 (hat L2)
- w4: G1.L3 → K1.5 (hat L3)
- w5: ek noktası l1 → S0.21 (hat L1)
- w6: S0.22 → ek noktası feed (hat L1)
- w7: ek noktası feed → S2.13 (hat L1)
- w8: ek noktası feed → K1.13 (hat L1)
- w9: S2.14 → ek noktası load (hat L1)
- w10: K1.14 → ek noktası load (hat L1)
- w11: ek noktası load → K1.A1 (hat L1)
- w12: ek noktası load → G2.L (hat L1)
- w13: G1.N → ek noktası neutral (hat N)
- w14: K1.A2 → ek noktası neutral (hat N)
- w15: G2.N → ek noktası neutral (hat N)
- w16: G2.P → H1.X1 (hat +24V)
- w17: G2.M → H1.X2 (hat 0V)
- w18: K1.2 → M1.U (hat L1)
- w19: K1.4 → M1.V (hat L2)
- w20: K1.6 → M1.W (hat L3)
- w21: K1.2 → M2.U (hat L1)
- w22: M2.N → ek noktası neutral (hat N)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/Analog_Sensorler_v1.9.odsdevre

- **Başlık / konu:** 24 V Analog Sensörler · v1.9
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”; kayıtlı ayar: {"state":false}
- B1 (b1) — Analog Seviye Sensörü; etiketi: “Analog Seviye Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: Şamandırayı sürükleyin. 0/50/100%: 4/12/20 mA. Sağ menüden 0–10 V seçilebilir.
- B2 (b2) — Doğrusal Konum Sensörü – Lineer Potansiyometre; etiketi: “Doğrusal Konum Sensörü – Lineer Potansiyometre”; kayıtlı ayar: {"state":false}
  Açıklama: Çubuğu sürükleyin: 0–10 V.
- **Bağlantılar:**
- w0: G1.P → B1.+
- w1: G1.M → B1.−
- w2: G1.P → B2.1
- w3: G1.M → B2.3
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- B1: “Şamandırayı sürükleyin. 0/50/100%: 4/12/20 mA. Sağ menüden 0–10 V seçilebilir.”
- B2: “Çubuğu sürükleyin: 0–10 V.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, B1, B2.

### Ornekler/Belgeli_PLC_Terminalleri_v1.8.odsdevre

- **Başlık / konu:** Belgeye Göre PLC Terminal Örnekleri
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- PLC1 (plc1) — CPU 1211C DC/DC/DC; etiketi: “CPU 1211C DC/DC/DC”; kayıtlı ayar: {"state":false}
- PLC2 (plc2) — CPU 1214C DC/DC/DC; etiketi: “CPU 1214C DC/DC/DC”; kayıtlı ayar: {"state":false}
- PLC3 (plc3) — DVP12SE11R; etiketi: “DVP12SE11R”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Birakmada_Gecikme_v1.9.odsdevre

- **Başlık / konu:** Birakmada_Gecikme · v1.9
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”; kayıtlı ayar: {"state":false}
- S1 (s1) — Seçici Anahtar; etiketi: “Bobin beslemesini aç/kapat”; kayıtlı ayar: {"state":false}
- K1 (k1) — Bırakmada Gecikmeli Bobin; etiketi: “Bırakmada Gecikmeli Bobin”; kayıtlı ayar: {"state":false}
  Açıklama: Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.
- K1 (aux) — Yardımcı Kontak; etiketi: “Yardımcı Kontak”; kayıtlı ayar: {"state":false}
- H1 (h1) — Yeşil Sinyal Lambası; etiketi: “Yeşil Sinyal Lambası”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w0: G1.P → S1.13
- w1: S1.14 → K1.A1
- w2: G1.M → K1.A2
- w3: G1.P → K1.13
- w4: K1.14 → H1.X1
- w5: G1.M → H1.X2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- K1: “Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/Cekmede_Gecikme_v1.9.odsdevre

- **Başlık / konu:** Cekmede_Gecikme · v1.9
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”; kayıtlı ayar: {"state":false}
- S1 (s1) — Seçici Anahtar; etiketi: “Bobin beslemesini aç/kapat”; kayıtlı ayar: {"state":false}
- K1 (k1) — Çekmede Gecikmeli Bobin; etiketi: “Çekmede Gecikmeli Bobin”; kayıtlı ayar: {"state":false}
  Açıklama: Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.
- K1 (aux) — Yardımcı Kontak; etiketi: “Yardımcı Kontak”; kayıtlı ayar: {"state":false}
- H1 (h1) — Yeşil Sinyal Lambası; etiketi: “Yeşil Sinyal Lambası”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w0: G1.P → S1.13
- w1: S1.14 → K1.A1
- w2: G1.M → K1.A2
- w3: G1.P → K1.13
- w4: K1.14 → H1.X1
- w5: G1.M → H1.X2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- K1: “Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/Darbe_Rolesi_v1.9.odsdevre

- **Başlık / konu:** Darbe_Rolesi · v1.9
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”; kayıtlı ayar: {"state":false}
- S1 (s1) — Başlat Butonu; etiketi: “Her basışta lambayı değiştir”; kayıtlı ayar: {"state":false}
- K1 (k1) — Darbe Rölesi Bobini; etiketi: “Darbe Rölesi Bobini”; kayıtlı ayar: {"state":false}
  Açıklama: Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.
- K1 (aux) — Yardımcı Kontak; etiketi: “Röle yardımcı kontağı”; kayıtlı ayar: {"state":false}
- H1 (h1) — Yeşil Sinyal Lambası; etiketi: “Yeşil Sinyal Lambası”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w0: G1.P → S1.13
- w1: S1.14 → K1.A1
- w2: G1.M → K1.A2
- w3: G1.P → K1.13
- w4: K1.14 → H1.X1
- w5: G1.M → H1.X2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- K1: “Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/Delta_SE_Varyantlari_v1.14.odsdevre

- **Başlık / konu:** Delta_SE_Varyantlari_v1.14
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- PLC1 (plc0) — DVP12SE11R; etiketi: “DVP12SE11R”
- PLC2 (plc1) — DVP12SE11T; etiketi: “DVP12SE11T”
- PLC3 (plc2) — DVP26SE11R; etiketi: “DVP26SE11R”
- PLC4 (plc3) — DVP26SE11T; etiketi: “DVP26SE11T”
- PLC5 (plc4) — DVP26SE11S; etiketi: “DVP26SE11S”
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Flasor_Rolesi_v1.9.odsdevre

- **Başlık / konu:** Flasor_Rolesi · v1.9
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”; kayıtlı ayar: {"state":false}
- S1 (s1) — Seçici Anahtar; etiketi: “Bobin beslemesini aç/kapat”; kayıtlı ayar: {"state":false}
- K1 (k1) — Flaşör Bobini; etiketi: “Flaşör Bobini”; kayıtlı ayar: {"state":false}
  Açıklama: Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.
- K1 (aux) — Yardımcı Kontak; etiketi: “Röle yardımcı kontağı”; kayıtlı ayar: {"state":false}
- H1 (h1) — Yeşil Sinyal Lambası; etiketi: “Yeşil Sinyal Lambası”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w0: G1.P → S1.13
- w1: S1.14 → K1.A1
- w2: G1.M → K1.A2
- w3: G1.P → K1.13
- w4: K1.14 → H1.X1
- w5: G1.M → H1.X2
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- K1: “Süre: 2 saniye. Simülasyonu başlatıp S1 ile kumanda edin.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/GMTCNT_Ornekleri_v1.14.odsdevre

- **Başlık / konu:** GMTCNT_Ornekleri_v1.14
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- PLC1 (plc0) — GLC-196R; etiketi: “GLC-196R”
- PLC2 (plc1) — GLC-296T; etiketi: “GLC-296T”
- PLC3 (plc2) — GLC-496R; etiketi: “GLC-496R”
- PLC4 (plc3) — GXM-16IA; etiketi: “GXM-16IA”
- PLC5 (plc4) — GXM-42AN; etiketi: “GXM-42AN”
- PLC6 (plc5) — GXM-20L; etiketi: “GXM-20L”
- PLC7 (plc6) — GXM-40UA; etiketi: “GXM-40UA”
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Ileri_Geri_Motor_v1.6.3.odsdevre

- **Başlık / konu:** İleri / geri motor · faz sırası ve gri güç çıkışları
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (supply) — 3 Faz Besleme; etiketi: “3 Faz Besleme”; kayıtlı ayar: {"state":false}
- S1 (selector) — 3 Çıkışlı Seçici; etiketi: “0 → SAĞ → DUR → SOL”; kayıtlı ayar: {"state":false,"position":0}
  Açıklama: Her tıklama bir sonraki konuma geçer.
- K1 (coil1) — Kontaktör Bobini; etiketi: “Sağ yön bobini”; kayıtlı ayar: {"state":false}
- K2 (coil2) — Kontaktör Bobini; etiketi: “Sol yön bobini”; kayıtlı ayar: {"state":false}
- K1 (forward) — Güç Kontaktörü; etiketi: “Sağ yön güç kontakları”; kayıtlı ayar: {"state":false}
- K2 (reverse) — Güç Kontaktörü; etiketi: “Sol yön güç kontakları”; kayıtlı ayar: {"state":false}
- M1 (motor) — 3 Faz Motor; etiketi: “İki faz yer değiştirir”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w1: G1.L1 → S1.11 (hat L1)
- w2: S1.13 → K1.A1 (hat L1)
- w3: S1.15 → K2.A1 (hat L1)
- w4: G1.N → ek noktası neutral (hat N)
- w5: ek noktası neutral → K1.A2 (hat N)
- w6: ek noktası neutral → K2.A2 (hat N)
- w7: G1.L1 → ek noktası phase0 (hat L1)
- w8: ek noktası phase0 → K1.1 (hat L1)
- w9: ek noktası phase0 → K2.1 (hat L1)
- w10: G1.L2 → ek noktası phase1 (hat L2)
- w11: ek noktası phase1 → K1.3 (hat L2)
- w12: ek noktası phase1 → K2.3 (hat L2)
- w13: G1.L3 → ek noktası phase2 (hat L3)
- w14: ek noktası phase2 → K1.5 (hat L3)
- w15: ek noktası phase2 → K2.5 (hat L3)
- w16: K1.2 → ek noktası output0 (hat CONTROL)
- w17: K2.6 → ek noktası output0 (hat CONTROL)
- w18: ek noktası output0 → M1.U (hat CONTROL)
- w19: K1.4 → ek noktası output1 (hat CONTROL)
- w20: K2.4 → ek noktası output1 (hat CONTROL)
- w21: ek noktası output1 → M1.V (hat CONTROL)
- w22: K1.6 → ek noktası output2 (hat CONTROL)
- w23: K2.2 → ek noktası output2 (hat CONTROL)
- w24: ek noktası output2 → M1.W (hat CONTROL)
- w25: G1.PE → M1.PE (hat PE)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- S1: “Her tıklama bir sonraki konuma geçer.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/K1_NO_NC.odsdevre

- **Başlık / konu:** K1 bobini — NO ve NC yardımcı kontakları
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (source) — 1 Faz Besleme; etiketi: “1 Faz Besleme”; kayıtlı ayar: {"state":false}
- S1 (switch) — Seçici Anahtar; etiketi: “K1 bobinine enerji”; kayıtlı ayar: {"state":false}
- K1 (coil) — Kontaktör Bobini; etiketi: “Kontaktör bobini”; kayıtlı ayar: {"state":false}
- K1 (no) — Yardımcı Kontak; etiketi: “NO yardımcı kontak”; kayıtlı ayar: {"state":false}
- K1 (nc) — Yardımcı Kontak; etiketi: “NC yardımcı kontak”; kayıtlı ayar: {"state":false}
- H1 (green) — Yeşil Sinyal Lambası; etiketi: “K1 çektiğinde yanar”; kayıtlı ayar: {"state":false}
- H2 (red) — Kırmızı Sinyal Lambası; etiketi: “K1 bırakınca yanar”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w1: G1.L → ek noktası L0 (hat L1)
- w2: ek noktası L0 → ek noktası L1 (hat L1)
- w3: ek noktası L1 → ek noktası L2 (hat L1)
- w4: ek noktası L0 → S1.13 (hat L1)
- w5: ek noktası L1 → K1.13 (hat L1)
- w6: ek noktası L2 → K1.21 (hat L1)
- w7: S1.14 → K1.A1 (hat L1)
- w8: K1.14 → H1.X1 (hat L1)
- w9: K1.22 → H2.X1 (hat L1)
- w10: G1.N → ek noktası N0 (hat N)
- w11: ek noktası N0 → ek noktası N1 (hat N)
- w12: ek noktası N1 → ek noktası N2 (hat N)
- w13: K1.A2 → ek noktası N0 (hat N)
- w14: H1.X2 → ek noktası N1 (hat N)
- w15: H2.X2 → ek noktası N2 (hat N)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, H2.

### Ornekler/Norm_Etiket_Yerlesimi.odsdevre

- **Başlık / konu:** TSE · Bağımsız etiket yerleşimi
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (source) — 1 Faz Besleme; etiketi: “1 Faz Besleme”; kayıtlı ayar: {"state":false}
- S1 (switch) — Seçici Anahtar; etiketi: “K1 bobinine enerji”; kayıtlı ayar: {"state":false}
- K1 (coil) — Kontaktör Bobini; etiketi: “Kontaktör bobini”; kayıtlı ayar: {"state":false}
  Açıklama: Pano A<br>Etiketler ayrı taşınabilir
- K1 (no) — Yardımcı Kontak; etiketi: “NO yardımcı kontak”; kayıtlı ayar: {"state":false}
- K1 (nc) — Yardımcı Kontak; etiketi: “NC yardımcı kontak”; kayıtlı ayar: {"state":false}
- H1 (green) — Yeşil Sinyal Lambası; etiketi: “K1 çektiğinde yanar”; kayıtlı ayar: {"state":false}
- H2 (red) — Kırmızı Sinyal Lambası; etiketi: “K1 bırakınca yanar”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w1: G1.L → ek noktası L0 (hat L1)
- w2: ek noktası L0 → ek noktası L1 (hat L1)
- w3: ek noktası L1 → ek noktası L2 (hat L1)
- w4: ek noktası L0 → S1.13 (hat L1)
- w5: ek noktası L1 → K1.13 (hat L1)
- w6: ek noktası L2 → K1.21 (hat L1)
- w7: S1.14 → K1.A1 (hat L1)
- w8: K1.14 → H1.X1 (hat L1)
- w9: K1.22 → H2.X1 (hat L1)
- w10: G1.N → ek noktası N0 (hat N)
- w11: ek noktası N0 → ek noktası N1 (hat N)
- w12: ek noktası N1 → ek noktası N2 (hat N)
- w13: K1.A2 → ek noktası N0 (hat N)
- w14: H1.X2 → ek noktası N1 (hat N)
- w15: H2.X2 → ek noktası N2 (hat N)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- K1: “Pano A<br>Etiketler ayrı taşınabilir”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, H2.

### Ornekler/Omron_CP_Ornekleri_v1.14.odsdevre

- **Başlık / konu:** Omron_CP_Ornekleri_v1.14
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- PLC1 (plc0) — CP1E-E10DR-A; etiketi: “CP1E-E10DR-A”
- PLC2 (plc1) — CP1E-N30S1DT1-D; etiketi: “CP1E-N30S1DT1-D”
- PLC3 (plc2) — CP1E-NA20DR-A; etiketi: “CP1E-NA20DR-A”
- PLC4 (plc3) — CP2E-N14DR-A; etiketi: “CP2E-N14DR-A”
- PLC5 (plc4) — CP2E-N30DT-D; etiketi: “CP2E-N30DT-D”
- PLC6 (plc5) — CP2E-N60DT1-D; etiketi: “CP2E-N60DT1-D”
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/PLC_Marka_Gorselleri.odsdevre

- **Başlık / konu:** 3D · PLC markaları
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- PLC1 (plc-demo-0) — CPU 1211C DC/DC/DC; etiketi: “CPU 1211C DC/DC/DC”; kayıtlı ayar: {"state":false}
  Açıklama: 6ES7211-1AE40-0XB0
- PLC2 (plc-demo-1) — DVP-SS2 CPU; etiketi: “DVP-SS2 CPU”; kayıtlı ayar: {"state":false}
- PLC3 (plc-demo-2) — CP1L-EM CPU; etiketi: “CP1L-EM CPU”; kayıtlı ayar: {"state":false}
- PLC4 (plc-demo-3) — M221 CPU; etiketi: “M221 CPU”; kayıtlı ayar: {"state":false}
  Açıklama: TM221CE16R
- PLC5 (plc-demo-4) — PM573-ETH CPU; etiketi: “PM573-ETH CPU”; kayıtlı ayar: {"state":false}
- PLC6 (plc-demo-5) — FX3U CPU; etiketi: “FX3U CPU”; kayıtlı ayar: {"state":false}
- PLC7 (plc-demo-6) — CompactLogix 5380; etiketi: “CompactLogix 5380”; kayıtlı ayar: {"state":false}
  Açıklama: 5069-L306ER
- PLC8 (plc-demo-7) — GLC-196R CPU; etiketi: “GLC-196R CPU”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- PLC1: “6ES7211-1AE40-0XB0”
- PLC4: “TM221CE16R”
- PLC7: “5069-L306ER”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Pano_Rekor_Kapak_v1.9.odsdevre

- **Başlık / konu:** Pano · Rekor, kanal kapağı ve spiral
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- Şema bileşeni yok.
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- G1 (supply-1p), montaj: external; konum: -120, 80
- Q1 (mcb-1p), montaj: plate; konum: 100, 180
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Elektrik simülasyonu uygulanmaz; pano görünümünde 2 yerleşim elemanı var.

### Ornekler/Pano_ve_Kumanda_v1.6.2.odsdevre

- **Başlık / konu:** Pano ve Kumanda v1.6.2
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- F1 (doc-nh-fuse) — NH Bıçaklı Sigorta; etiketi: “NH Bıçaklı Sigorta”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- F2 (doc-thermal-magnetic-1p) — Termik Manyetik Şalter · 1P; etiketi: “Termik Manyetik Şalter · 1P”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137
- F3 (doc-overload-1p) — Termik Röle · 1P; etiketi: “Termik Röle · 1P”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 89
- F4 (doc-thermal-contact-no) — Termik Röle Yardımcı Kontağı · NO; etiketi: “Termik Röle Yardımcı Kontağı · NO”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137
- F5 (doc-thermal-contact-nc) — Termik Röle Yardımcı Kontağı · NC; etiketi: “Termik Röle Yardımcı Kontağı · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137
- S6 (doc-jog-4pin) — Jog Butonu · 4 Uçlu; etiketi: “Jog Butonu · 4 Uçlu”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137
- S7 (doc-push-maintained) — Kalıcı Tip Buton; etiketi: “Kalıcı Tip Buton”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 89
- S8 (doc-packet-switch-3p) — Üç Fazlı Paket Şalter; etiketi: “Üç Fazlı Paket Şalter”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137
- K9 (doc-coil-relay-dc) — DC Röle Bobini; etiketi: “DC Röle Bobini”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137
- H10 (doc-speaker) — Hoparlör; etiketi: “Hoparlör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- G11 (doc-supply-ac-symbol) — Alternatif Gerilim Kaynağı · Daire; etiketi: “Alternatif Gerilim Kaynağı · Daire”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- X12 (doc-ground-functional) — Fonksiyon Toprağı; etiketi: “Fonksiyon Toprağı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- X13 (doc-ground-chassis) — Şasi / Gövde Toprağı; etiketi: “Şasi / Gövde Toprağı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- P14 (doc-meter-kwh-1p) — Bir Fazlı Aktif Enerji Sayacı; etiketi: “Bir Fazlı Aktif Enerji Sayacı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P15 (doc-meter-kwh-3p) — Üç Fazlı Aktif Enerji Sayacı; etiketi: “Üç Fazlı Aktif Enerji Sayacı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P16 (doc-meter-combined-ct) — Üç Fazlı X/5 Kombi Sayaç; etiketi: “Üç Fazlı X/5 Kombi Sayaç”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- F17 (doc-motor-protection-relay) — Faz Koruma Rölesi · Tense FKV-03; etiketi: “Motor Koruma Rölesi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- F18 (doc-phase-sequence-relay) — Faz Sırası Rölesi · Tense FS-R; etiketi: “Faz Sırası Rölesi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- C19 (doc-capacitor-bank-3p) — Üç Fazlı Kondansatör Grubu · Üçgen; etiketi: “Üç Fazlı Kondansatör Grubu · Üçgen”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- F20 (doc-surge-arrester) — Alçak Gerilim Parafudru; etiketi: “Alçak Gerilim Parafudru”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- X21 (doc-bar-pe) — Toprak Barası; etiketi: “Toprak Barası”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- X22 (doc-bar-n) — Nötr Barası; etiketi: “Nötr Barası”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- B23 (doc-temperature-controller) — Sıcaklık Kontrol Cihazı; etiketi: “Sıcaklık Kontrol Cihazı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 43–45
- B24 (doc-solid-state-relay) — Katı Hâl Rölesi · SSR; etiketi: “Katı Hâl Rölesi · SSR”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 44–45
- P25 (doc-layout-mcb1) — Bir Fazlı Sigorta · Pano Yerleşimi; etiketi: “Bir Fazlı Sigorta · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P26 (doc-layout-mcb3) — Üç Fazlı Sigorta · Pano Yerleşimi; etiketi: “Üç Fazlı Sigorta · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P27 (doc-layout-nh) — NH Bıçaklı Sigorta · Pano Yerleşimi; etiketi: “NH Bıçaklı Sigorta · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P28 (doc-layout-rcd) — Kaçak Akım Rölesi · Pano Yerleşimi; etiketi: “Kaçak Akım Rölesi · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P29 (doc-layout-packet) — Üç Fazlı Paket Şalter · Pano Yerleşimi; etiketi: “Üç Fazlı Paket Şalter · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P30 (doc-layout-thermal) — Termik Manyetik Şalter · Pano Yerleşimi; etiketi: “Termik Manyetik Şalter · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P31 (doc-layout-ct) — Akım Trafosu · Pano Yerleşimi; etiketi: “Akım Trafosu · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P32 (doc-layout-meter1) — Bir Fazlı Aktif Sayaç · Pano Yerleşimi; etiketi: “Bir Fazlı Aktif Sayaç · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P33 (doc-layout-meter3) — Üç Fazlı Aktif Sayaç · Pano Yerleşimi; etiketi: “Üç Fazlı Aktif Sayaç · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P34 (doc-layout-meter-ct) — Üç Fazlı Kombi Sayaç · Pano Yerleşimi; etiketi: “Üç Fazlı Kombi Sayaç · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P35 (doc-layout-ammeter) — Ampermetre · Pano Yerleşimi; etiketi: “Ampermetre · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P36 (doc-layout-voltmeter) — Voltmetre · Pano Yerleşimi; etiketi: “Voltmetre · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P37 (doc-layout-terminals) — Ray Klemensi · Pano Yerleşimi; etiketi: “Ray Klemensi · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P38 (doc-layout-bar) — Toprak / Nötr Barası · Pano Yerleşimi; etiketi: “Toprak / Nötr Barası · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P39 (doc-layout-lamp) — Sinyal Lambası · Pano Yerleşimi; etiketi: “Sinyal Lambası · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P40 (doc-layout-start) — Başlat Butonu · Pano Yerleşimi; etiketi: “Başlat Butonu · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P41 (doc-layout-stop) — Durdur Butonu · Pano Yerleşimi; etiketi: “Durdur Butonu · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P42 (doc-layout-jog) — Jog Butonu · Pano Yerleşimi; etiketi: “Jog Butonu · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P43 (doc-layout-overload) — Aşırı Akım Rölesi · Pano Yerleşimi; etiketi: “Aşırı Akım Rölesi · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P44 (doc-layout-motor-breaker) — Motor Koruma Şalteri · Pano Yerleşimi; etiketi: “Motor Koruma Şalteri · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P45 (doc-layout-contactor) — Kontaktör · Pano Yerleşimi; etiketi: “Kontaktör · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P46 (doc-layout-timer) — Zaman Rölesi · Pano Yerleşimi; etiketi: “Zaman Rölesi · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P47 (doc-layout-motor-relay) — Motor Koruma Rölesi · Pano Yerleşimi; etiketi: “Motor Koruma Rölesi · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P48 (doc-layout-phase-relay) — Faz Sırası Rölesi · Pano Yerleşimi; etiketi: “Faz Sırası Rölesi · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P49 (doc-layout-capacitor1) — Bir Fazlı Kondansatör · Pano Yerleşimi; etiketi: “Bir Fazlı Kondansatör · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P50 (doc-layout-capacitor3) — Üç Fazlı Kondansatör · Pano Yerleşimi; etiketi: “Üç Fazlı Kondansatör · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- P51 (doc-layout-surge) — Alçak Gerilim Parafudru · Pano Yerleşimi; etiketi: “Alçak Gerilim Parafudru · Pano Yerleşimi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025PA1113-pano(1).pdf · PDF s. 19
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- P14 (doc-meter-kwh-1p) — Bir Fazlı Aktif Enerji Sayacı; etiketi: “Bir Fazlı Aktif Enerji Sayacı”
- P15 (doc-meter-kwh-3p) — Üç Fazlı Aktif Enerji Sayacı; etiketi: “Üç Fazlı Aktif Enerji Sayacı”
- P16 (doc-meter-combined-ct) — Üç Fazlı X/5 Kombi Sayaç; etiketi: “Üç Fazlı X/5 Kombi Sayaç”
- P32 (doc-layout-meter1) — Bir Fazlı Aktif Sayaç · Pano Yerleşimi; etiketi: “Bir Fazlı Aktif Sayaç · Pano Yerleşimi”
- P33 (doc-layout-meter3) — Üç Fazlı Aktif Sayaç · Pano Yerleşimi; etiketi: “Üç Fazlı Aktif Sayaç · Pano Yerleşimi”
- P34 (doc-layout-meter-ct) — Üç Fazlı Kombi Sayaç · Pano Yerleşimi; etiketi: “Üç Fazlı Kombi Sayaç · Pano Yerleşimi”
- P35 (doc-layout-ammeter) — Ampermetre · Pano Yerleşimi; etiketi: “Ampermetre · Pano Yerleşimi”
- P36 (doc-layout-voltmeter) — Voltmetre · Pano Yerleşimi; etiketi: “Voltmetre · Pano Yerleşimi”
- **Kaynak açıklaması:**
- F1: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- F2: “EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137”
- F3: “EET2025PA1113-pano(1).pdf · PDF s. 89”
- F4: “EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137”
- F5: “EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137”
- S6: “EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137”
- S7: “EET2025PA1113-pano(1).pdf · PDF s. 89”
- S8: “EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137”
- K9: “EET2025PP1232-panoSimgeler(1).pdf · PDF s. 137”
- H10: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- G11: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- X12: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- X13: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- P14: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P15: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P16: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- F17: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- F18: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- C19: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- F20: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- X21: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- X22: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- B23: “EET2025KP1115-pano(1).pdf · PDF s. 43–45”
- B24: “EET2025KP1115-pano(1).pdf · PDF s. 44–45”
- P25: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P26: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P27: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P28: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P29: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P30: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P31: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P32: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P33: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P34: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P35: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P36: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P37: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P38: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P39: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P40: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P41: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P42: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P43: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P44: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P45: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P46: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P47: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P48: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P49: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P50: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- P51: “EET2025PA1113-pano(1).pdf · PDF s. 19”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G11.

### Ornekler/Sensor_Hedefleri_v1.6.3.odsdevre

- **Başlık / konu:** Sensör hedefleri · metal / plastik / reflektör
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (supply) — Pozitif DC Besleme; etiketi: “24 VDC sensör beslemesi”; kayıtlı ayar: {"state":false}
- B1 (sensor0) — Endüktif Sensör; etiketi: “Endüktif Sensör”; kayıtlı ayar: {"state":false}
- H1 (lamp0) — Yeşil Sinyal Lambası; etiketi: “Algılama çıkışı”; kayıtlı ayar: {"state":false}
- B2 (sensor1) — Kapasitif Şalter; etiketi: “Kapasitif Şalter”; kayıtlı ayar: {"state":false}
- H2 (lamp1) — Yeşil Sinyal Lambası; etiketi: “Algılama çıkışı”; kayıtlı ayar: {"state":false}
- B3 (sensor2) — Reflektörlü Optik Sensör; etiketi: “Reflektörlü Optik Sensör”; kayıtlı ayar: {"state":false}
- H3 (lamp2) — Yeşil Sinyal Lambası; etiketi: “Algılama çıkışı”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w1: G1.P → ek noktası plus0 (hat +24V)
- w2: G1.M → ek noktası zero0 (hat 0V)
- w3: ek noktası plus0 → B1.BN (hat +24V)
- w4: ek noktası zero0 → B1.BU (hat 0V)
- w5: B1.BK → H1.X1 (hat SIGNAL)
- w6: H1.X2 → ek noktası zero0 (hat 0V)
- w7: ek noktası plus0 → ek noktası plus1 (hat +24V)
- w8: ek noktası zero0 → ek noktası zero1 (hat 0V)
- w9: ek noktası plus1 → B2.BN (hat +24V)
- w10: ek noktası zero1 → B2.BU (hat 0V)
- w11: B2.BK → H2.X1 (hat SIGNAL)
- w12: H2.X2 → ek noktası zero1 (hat 0V)
- w13: ek noktası plus1 → ek noktası plus2 (hat +24V)
- w14: ek noktası zero1 → ek noktası zero2 (hat 0V)
- w15: ek noktası plus2 → B3.BN (hat +24V)
- w16: ek noktası zero2 → B3.BU (hat 0V)
- w17: B3.BK → H3.X1 (hat SIGNAL)
- w18: H3.X2 → ek noktası zero2 (hat 0V)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1, B1, B2, B3.

### Ornekler/Sensorler_v1.6.2.odsdevre

- **Başlık / konu:** Sensorler v1.6.2
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- S1 (doc-proximity) — Endüktif Sensör; etiketi: “Endüktif Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S2 (doc-photoeye) — Fotosel Sensör; etiketi: “Fotosel Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S3 (doc-magnetic-detector) — Manyetik Dedektör; etiketi: “Manyetik Dedektör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S4 (doc-capacitive-detector) — Kapasitif Dedektör; etiketi: “Kapasitif Dedektör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S5 (doc-inductive-switch) — Endüktif Şalter; etiketi: “Endüktif Şalter”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S6 (doc-capacitive-switch) — Kapasitif Şalter; etiketi: “Kapasitif Şalter”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S7 (doc-magnetic-switch) — Manyetik Şalter; etiketi: “Manyetik Şalter”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S8 (doc-photo-emitter) — Fotosel Verici; etiketi: “Fotosel Verici”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S9 (doc-photo-receiver) — Fotosel Alıcı; etiketi: “Fotosel Alıcı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S10 (doc-photo-emitter-receiver) — Fotosel Verici/Alıcı; etiketi: “Fotosel Verici/Alıcı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S11 (doc-ultrasonic-switch) — Ultrasonik Mesafe Sensörü · U1KT003; etiketi: “Ultrasonik Şalter”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S12 (doc-autonics-pr12-npn) — Endüktif Sensör · NPN; etiketi: “Endüktif Sensör · NPN”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S13 (doc-autonics-bj-npn) — Fotosel Sensör · NPN; etiketi: “Fotosel Sensör · NPN”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S14 (doc-sensor-inductive-nc) — Endüktif Sensör · NC; etiketi: “Endüktif Sensör · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S15 (doc-sensor-capacitive-nc) — Kapasitif Sensör · NC; etiketi: “Kapasitif Sensör · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S16 (doc-sensor-optical-nc) — Optik Sensör · NC; etiketi: “Optik Sensör · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S17 (doc-sensor-magnetic-nc) — Manyetik Sensör · NC; etiketi: “Manyetik Sensör · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S18 (doc-sensor-ultrasonic-nc) — Ultrasonik Sensör · NC; etiketi: “Ultrasonik Sensör · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S19 (doc-sensor-capacitive-npn) — Kapasitif Sensör · NPN; etiketi: “Kapasitif Sensör · NPN”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 117
- S20 (doc-sensor-hall) — Hall Etkili Sensör; etiketi: “Hall Etkili Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 25–26, 117
- S21 (doc-sensor-through-beam) — Karşılıklı Optik Sensör; etiketi: “Karşılıklı Optik Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 27, 117
- S22 (doc-sensor-retroreflective) — Reflektörlü Optik Sensör; etiketi: “Reflektörlü Optik Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 28, 117
- S23 (doc-sensor-diffuse) — Cisimden Yansımalı Optik Sensör; etiketi: “Cisimden Yansımalı Optik Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 28, 117
- S24 (doc-sensor-fiber) — Fiber Optik Sensör; etiketi: “Fiber Optik Sensör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 30–31, 117
- S25 (doc-sensor-color) — Renk Sensörü; etiketi: “Renk Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 32–33, 117
- S26 (doc-reed-no) — Reed Manyetik Kontak Takımı · NO; etiketi: “Reed Manyetik Kontak · NO”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 25–26, 117
- S27 (doc-reed-nc) — Reed Manyetik Kontak Takımı · NC; etiketi: “Reed Manyetik Kontak · NC”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 25–26, 117
- S28 (doc-sensor-inductive-4wire-pnp) — Endüktif Sensör · 4 Telli PNP; etiketi: “Endüktif Sensör · 4 Telli PNP”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 21, 117
- S29 (doc-sensor-inductive-4wire-npn) — Endüktif Sensör · 4 Telli NPN; etiketi: “Endüktif Sensör · 4 Telli NPN”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 21, 117
- B30 (doc-thermocouple) — Termokupl · Çift Elemanlı; etiketi: “Termokupl”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 38–40, 117
- B31 (doc-sensor-ptc) — PTC Sıcaklık Sensörü; etiketi: “PTC Sıcaklık Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 38
- B32 (doc-sensor-ntc) — NTC Sıcaklık Sensörü; etiketi: “NTC Sıcaklık Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 38, 43
- B33 (doc-sensor-pt100) — PT100 Direnç Termometresi · 3 Telli; etiketi: “PT100 Direnç Termometresi · 3 Telli”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 38–40
- B34 (doc-sensor-temperature-humidity) — Sıcaklık / Nem Sensörü; etiketi: “Sıcaklık / Nem Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 41–42
- B35 (doc-temperature-indicator) — Sıcaklık / Nem Göstergesi; etiketi: “Sıcaklık / Nem Göstergesi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 41–43
- B36 (doc-encoder-incremental) — Artımlı Enkoder · A / B / Z; etiketi: “Artımlı Enkoder · A / B / Z”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 34–37
- B37 (doc-encoder-absolute) — Mutlak Enkoder; etiketi: “Mutlak Enkoder”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 34–37
- B38 (doc-encoder-counter) — Enkoder Sayıcı / Gösterge; etiketi: “Enkoder Sayıcı / Gösterge”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 34–37
- B39 (doc-strain-gauge) — Gerinim Ölçer · Strain Gauge; etiketi: “Gerinim Ölçer · Strain Gauge”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 46–47
- B40 (doc-load-cell) — Yük Hücresi · Kobastar SB2; etiketi: “Yük Hücresi · Load Cell”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 46–50
- B41 (doc-weighing-indicator) — Tartım Göstergesi; etiketi: “Tartım Göstergesi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 48–50
- B42 (doc-sensor-ultrasonic-analog) — Ultrasonik Mesafe Sensörü · Analog; etiketi: “Ultrasonik Mesafe Sensörü · Analog”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 51–52
- B43 (doc-sensor-laser-distance) — Lazer Mesafe Sensörü; etiketi: “Lazer Mesafe Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 51–52
- B44 (doc-sensor-linear-position) — Doğrusal Konum Sensörü – Lineer Potansiyometre; etiketi: “Doğrusal Konum Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 51–52
- B45 (doc-sensor-level-analog) — Analog Seviye Sensörü; etiketi: “Analog Seviye Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 51–52
- B46 (doc-converter-temperature) — Sıcaklık Sinyal Dönüştürücü; etiketi: “Sıcaklık Sinyal Dönüştürücü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 53–55
- B47 (doc-converter-pressure) — mA/V Sinyal Dönüştürücü; etiketi: “Basınç Sinyal Dönüştürücü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025KP1115-pano(1).pdf · PDF s. 53–55
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- S1: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S2: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S3: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S4: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S5: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S6: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S7: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S8: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S9: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S10: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S11: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S12: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S13: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S14: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S15: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S16: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S17: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S18: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S19: “EET2025KP1115-pano(1).pdf · PDF s. 117”
- S20: “EET2025KP1115-pano(1).pdf · PDF s. 25–26, 117”
- S21: “EET2025KP1115-pano(1).pdf · PDF s. 27, 117”
- S22: “EET2025KP1115-pano(1).pdf · PDF s. 28, 117”
- S23: “EET2025KP1115-pano(1).pdf · PDF s. 28, 117”
- S24: “EET2025KP1115-pano(1).pdf · PDF s. 30–31, 117”
- S25: “EET2025KP1115-pano(1).pdf · PDF s. 32–33, 117”
- S26: “EET2025KP1115-pano(1).pdf · PDF s. 25–26, 117”
- S27: “EET2025KP1115-pano(1).pdf · PDF s. 25–26, 117”
- S28: “EET2025KP1115-pano(1).pdf · PDF s. 21, 117”
- S29: “EET2025KP1115-pano(1).pdf · PDF s. 21, 117”
- B30: “EET2025KP1115-pano(1).pdf · PDF s. 38–40, 117”
- B31: “EET2025KP1115-pano(1).pdf · PDF s. 38”
- B32: “EET2025KP1115-pano(1).pdf · PDF s. 38, 43”
- B33: “EET2025KP1115-pano(1).pdf · PDF s. 38–40”
- B34: “EET2025KP1115-pano(1).pdf · PDF s. 41–42”
- B35: “EET2025KP1115-pano(1).pdf · PDF s. 41–43”
- B36: “EET2025KP1115-pano(1).pdf · PDF s. 34–37”
- B37: “EET2025KP1115-pano(1).pdf · PDF s. 34–37”
- B38: “EET2025KP1115-pano(1).pdf · PDF s. 34–37”
- B39: “EET2025KP1115-pano(1).pdf · PDF s. 46–47”
- B40: “EET2025KP1115-pano(1).pdf · PDF s. 46–50”
- B41: “EET2025KP1115-pano(1).pdf · PDF s. 48–50”
- B42: “EET2025KP1115-pano(1).pdf · PDF s. 51–52”
- B43: “EET2025KP1115-pano(1).pdf · PDF s. 51–52”
- B44: “EET2025KP1115-pano(1).pdf · PDF s. 51–52”
- B45: “EET2025KP1115-pano(1).pdf · PDF s. 51–52”
- B46: “EET2025KP1115-pano(1).pdf · PDF s. 53–55”
- B47: “EET2025KP1115-pano(1).pdf · PDF s. 53–55”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Siemens_S71200_Ornekleri_v1.14.odsdevre

- **Başlık / konu:** Siemens_S71200_Ornekleri_v1.14
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- PLC1 (plc0) — CPU 1211C DC/DC/DC; etiketi: “6ES7211-1AE40-0XB0”
- PLC2 (plc1) — CPU 1212C AC/DC/Relay; etiketi: “6ES7212-1BE40-0XB0”
- PLC3 (plc2) — CPU 1214C DC/DC/Relay; etiketi: “6ES7214-1HG40-0XB0”
- PLC4 (plc3) — CPU 1215C DC/DC/DC; etiketi: “6ES7215-1AG40-0XB0”
- PLC5 (plc4) — CPU 1217C DC/DC/DC; etiketi: “6ES7217-1AG40-0XB0”
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Sinamics_V20_Kontrol_v1.8.odsdevre

- **Başlık / konu:** SINAMICS V20 — Çalıştır, Ters Yön, Potansiyometre
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — 1 Faz Besleme; etiketi: “1 Faz Besleme”; kayıtlı ayar: {"state":false}
- A1 (a1) — SINAMICS V20 · 1 Faz Giriş; etiketi: “SINAMICS V20 · 1 Faz Giriş”; kayıtlı ayar: {"state":false}
- M1 (m1) — 3 Faz Motor; etiketi: “3 Faz Motor”; kayıtlı ayar: {"motorConnection":"delta","state":false}
- S1 (s1) — Seçici Anahtar; etiketi: “Çalıştır / Durdur”; kayıtlı ayar: {"state":false}
- S2 (s2) — Seçici Anahtar; etiketi: “Yön Değiştir”; kayıtlı ayar: {"state":false}
- R1 (r1) — Analog Potansiyometre; etiketi: “Analog Potansiyometre”; kayıtlı ayar: {"potentiometer":60,"state":false}
- **Bağlantılar:**
- w0: G1.L → A1.L1
- w1: G1.N → A1.N
- w2: G1.PE → A1.PE
- w3: A1.PE2 → M1.PE
- w4: A1.U → M1.U
- w5: A1.V → M1.V
- w6: A1.W → M1.W
- w7: A1.13 → S1.13
- w8: S1.14 → A1.8
- w9: A1.13 → S2.13
- w10: S2.14 → A1.9
- w11: A1.12 → A1.14
- w12: A1.1 → R1.1
- w13: A1.2 → R1.2
- w14: A1.5 → R1.3
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- R1 (r1) — Analog Potansiyometre; etiketi: “Analog Potansiyometre”
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/TX11_0_10V_Prob_Olcumu_v1.15.2.odsdevre

- **Başlık / konu:** TX11_0_10V_Prob_Olcumu
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- TX11 (b) — Tartım Göstergesi; etiketi: “Tartım Göstergesi”; kayıtlı ayar: {"instrumentSettings":{"capacity":1000,"spanMv":10,"zeroMv":0,"output":"0-10V"}}
  Açıklama: 0–1000 kg → 0–10 V. V (+) / G (−) çıkışını DC 20 V kademesinde ölç.
- SB2 · 1000 kg (r) — Yük Hücresi · Kobastar SB2; etiketi: “Yük Hücresi · Kobastar SB2”; kayıtlı ayar: {"loadWeight":500,"loadCapacity":1000}
- X1 · I / V / G (x) — Geçiş Klemensi · 3 Sıra
- UT33D+ (m) — UNI-T UT33D+ Multimetre; kayıtlı ayar: {"meterPosition":3}
- + (red) — Kırmızı Ölçüm Probu; kayıtlı ayar: {"probeFor":"m","probeTarget":{"c":"x","p":"4"}}
- COM (black) — Siyah Ölçüm Probu; kayıtlı ayar: {"probeFor":"m","probeTarget":{"c":"x","p":"6"}}
- **Bağlantılar:**
- w0: 24 VDC.P → TX11.+ (hat +24V)
- w1: 24 VDC.M → TX11.− (hat 0V)
- w2: TX11.EX+ → SB2 · 1000 kg.EX+ (hat FREE)
- w3: TX11.EX− → SB2 · 1000 kg.EX− (hat FREE)
- w4: SB2 · 1000 kg.SIG+ → TX11.S+ (hat FREE)
- w5: SB2 · 1000 kg.SIG− → TX11.S− (hat FREE)
- iout: TX11.I → X1 · I / V / G.1 (hat CONTROL)
- vout: TX11.V → X1 · I / V / G.3 (hat CONTROL)
- ground: TX11.G → X1 · I / V / G.5 (hat CONTROL)
- redlead: UT33D+.V → +.PLUG (hat MEASURE)
- blacklead: UT33D+.COM → COM.PLUG (hat MEASURE)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- + (red) — Kırmızı Ölçüm Probu; hedef {"c":"x","p":"4"}
- COM (black) — Siyah Ölçüm Probu; hedef {"c":"x","p":"6"}
- **Kaynak açıklaması:**
- TX11: “0–1000 kg → 0–10 V. V (+) / G (−) çıkışını DC 20 V kademesinde ölç.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, TX11, SB2 · 1000 kg, UT33D+.

### Ornekler/TX11_4_20mA_Prob_Olcumu_v1.15.2.odsdevre

- **Başlık / konu:** TX11_4_20mA_Prob_Olcumu
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** UYUMLU — Kaynakta konuya özel işlem/sonuç notu var; komponent/pin ve varsayılan çözüm denetimi temiz.
- **Komponentler ve kayıtlı görevleri:**
- 24 VDC (g) — Pozitif DC Besleme; etiketi: “Pozitif DC Besleme”
- TX11 (b) — Tartım Göstergesi; etiketi: “Tartım Göstergesi”; kayıtlı ayar: {"instrumentSettings":{"capacity":1000,"spanMv":10,"zeroMv":0,"output":"4-20mA"}}
  Açıklama: 0–1000 kg → 4–20 mA. I (+) / G (−) arasındaki akım döngüsünde DC 200 mA kademesini kullan.
- SB2 · 1000 kg (r) — Yük Hücresi · Kobastar SB2; etiketi: “Yük Hücresi · Kobastar SB2”; kayıtlı ayar: {"loadWeight":1000,"loadCapacity":1000}
- X1 · I / V / G (x) — Geçiş Klemensi · 3 Sıra
- UT33D+ (m) — UNI-T UT33D+ Multimetre; kayıtlı ayar: {"meterPosition":10}
- + (red) — Kırmızı Ölçüm Probu; kayıtlı ayar: {"probeFor":"m","probeTarget":{"c":"x","p":"2"}}
- COM (black) — Siyah Ölçüm Probu; kayıtlı ayar: {"probeFor":"m","probeTarget":{"c":"x","p":"6"}}
- **Bağlantılar:**
- w0: 24 VDC.P → TX11.+ (hat +24V)
- w1: 24 VDC.M → TX11.− (hat 0V)
- w2: TX11.EX+ → SB2 · 1000 kg.EX+ (hat FREE)
- w3: TX11.EX− → SB2 · 1000 kg.EX− (hat FREE)
- w4: SB2 · 1000 kg.SIG+ → TX11.S+ (hat FREE)
- w5: SB2 · 1000 kg.SIG− → TX11.S− (hat FREE)
- iout: TX11.I → X1 · I / V / G.1 (hat CONTROL)
- vout: TX11.V → X1 · I / V / G.3 (hat CONTROL)
- ground: TX11.G → X1 · I / V / G.5 (hat CONTROL)
- redlead: UT33D+.V → +.PLUG (hat MEASURE)
- blacklead: UT33D+.COM → COM.PLUG (hat MEASURE)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- + (red) — Kırmızı Ölçüm Probu; hedef {"c":"x","p":"2"}
- COM (black) — Siyah Ölçüm Probu; hedef {"c":"x","p":"6"}
- **Kaynak açıklaması:**
- TX11: “0–1000 kg → 4–20 mA. I (+) / G (−) arasındaki akım döngüsünde DC 200 mA kademesini kullan.”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: 24 VDC, TX11, SB2 · 1000 kg, UT33D+.

### Ornekler/Tesisat_ve_KNX_v1.6.2.odsdevre

- **Başlık / konu:** Tesisat ve KNX v1.6.2
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- X1 (doc-phone-line-surface) — Sıva Üstü Telefon Hattı; etiketi: “Sıva Üstü Telefon Hattı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X2 (doc-phone-line-concealed) — Sıva Altı Telefon Hattı; etiketi: “Sıva Altı Telefon Hattı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X3 (doc-phone-entry-box) — Bina Giriş Telefon Kutusu · PTT; etiketi: “Bina Giriş Telefon Kutusu · PTT”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X4 (doc-phone-floor-box) — Kat Telefon Terminal Kutusu; etiketi: “Kat Telefon Terminal Kutusu”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X5 (doc-phone-socket) — Telefon Prizi; etiketi: “Telefon Prizi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X6 (doc-telephone) — Telefon Cihazı; etiketi: “Telefon Cihazı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X7 (doc-phone-apartment-box) — Daire Telefon Terminal Kutusu; etiketi: “Daire Telefon Terminal Kutusu”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 102
- X8 (doc-tv-socket) — TV Prizi; etiketi: “TV Prizi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- X9 (doc-satellite-receiver) — Uydu Alıcısı; etiketi: “Uydu Alıcısı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- X10 (doc-satellite-dish) — Çanak Anten; etiketi: “Çanak Anten”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- X11 (doc-television) — Televizyon; etiketi: “Televizyon”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- X12 (doc-antenna-amplifier) — Anten Yükselteci; etiketi: “Anten Yükselteci”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- X13 (doc-antenna-distributor) — Anten Dağıtım Kutusu; etiketi: “Anten Dağıtım Kutusu”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- X14 (doc-telephone-exchange) — Telefon Santrali; etiketi: “Telefon Santrali”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 114
- P15 (doc-building-panel) — Elektrik Panosu · Plan; etiketi: “Elektrik Panosu · Plan”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- X16 (doc-socket-power) — Elektrik Prizi · Topraklı; etiketi: “Elektrik Prizi · Topraklı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- X17 (doc-socket-covered) — Kapaklı Elektrik Prizi; etiketi: “Kapaklı Elektrik Prizi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- X18 (doc-socket-data) — Data Prizi; etiketi: “Data Prizi”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- M19 (doc-blind-motor) — Perde / Panjur Motoru; etiketi: “Perde / Panjur Motoru”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- H20 (doc-wall-light-outlet) — Aplik Armatür Ucu; etiketi: “Aplik Armatür Ucu”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- X21 (doc-plug-1p) — Bir Fazlı Fiş · Yassı, Topraksız; etiketi: “Bir Fazlı Fiş”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 182–190
- X22 (doc-socket-3p) — Üç Fazlı Priz; etiketi: “Üç Fazlı Priz”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 182–190
- X23 (doc-plug-3p) — Üç Fazlı Fiş; etiketi: “Üç Fazlı Fiş”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 182–190
- X24 (doc-building-junction) — Tesisat Buatı; etiketi: “Tesisat Buatı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 77–80
- A25 (doc-knx-power) — KNX · Güç Kaynağı; etiketi: “KNX · Güç Kaynağı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A26 (doc-knx-choke-power) — KNX · Şok Bobinli Güç Kaynağı; etiketi: “KNX · Şok Bobinli Güç Kaynağı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A27 (doc-knx-coupler) — KNX · Hat Bağlayıcı; etiketi: “KNX · Hat Bağlayıcı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A28 (doc-knx-logic) — KNX · Lojik Modül; etiketi: “KNX · Lojik Modül”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A29 (doc-knx-button) — KNX · Buton; etiketi: “KNX · Buton”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A30 (doc-knx-temperature) — KNX · Sıcaklık Sensörü; etiketi: “KNX · Sıcaklık Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A31 (doc-knx-time) — KNX · Zaman Sensörü; etiketi: “KNX · Zaman Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A32 (doc-knx-wind) — KNX · Rüzgâr Hızı Sensörü; etiketi: “KNX · Rüzgâr Hızı Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A33 (doc-knx-dimmer-button) — KNX · Dimmer Butonu; etiketi: “KNX · Dimmer Butonu”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A34 (doc-knx-smoke) — KNX · Duman Sensörü; etiketi: “KNX · Duman Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A35 (doc-knx-motion) — KNX · Hareket Sensörü; etiketi: “KNX · Hareket Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A36 (doc-knx-actuator) — KNX · Anahtarlama Aktüatörü; etiketi: “KNX · Anahtarlama Aktüatörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A37 (doc-knx-delay) — KNX · Zaman Gecikmeli Aktüatör; etiketi: “KNX · Zaman Gecikmeli Aktüatör”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A38 (doc-knx-dimmer) — KNX · Dimmer Aktüatörü; etiketi: “KNX · Dimmer Aktüatörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A39 (doc-knx-valve) — KNX · Valf Aktüatörü; etiketi: “KNX · Valf Aktüatörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A40 (doc-knx-display) — KNX · Ekran; etiketi: “KNX · Ekran”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A41 (doc-knx-com) — KNX · COM Arayüzü; etiketi: “KNX · COM Arayüzü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A42 (doc-knx-interface) — KNX · X–KNX Arayüzü; etiketi: “KNX · X–KNX Arayüzü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 141
- A43 (doc-knx-single) — Tekli Otomasyon Anahtarı; etiketi: “Tekli Otomasyon Anahtarı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- A44 (doc-knx-double) — İkili Otomasyon Anahtarı; etiketi: “İkili Otomasyon Anahtarı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- A45 (doc-knx-single-thermostat) — Tekli Termostatlı Otomasyon Anahtarı; etiketi: “Tekli Termostatlı Otomasyon Anahtarı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- A46 (doc-knx-double-thermostat) — İkili Termostatlı Otomasyon Anahtarı; etiketi: “İkili Termostatlı Otomasyon Anahtarı”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- A47 (doc-knx-presence) — Varlık Sensörü; etiketi: “Varlık Sensörü”; kayıtlı ayar: {"state":false}
  Açıklama: EET2025TA1005(1).pdf · PDF s. 142
- **Bağlantılar:**
- Elektrik kablosu yok.
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- X1: “EET2025TA1005(1).pdf · PDF s. 102”
- X2: “EET2025TA1005(1).pdf · PDF s. 102”
- X3: “EET2025TA1005(1).pdf · PDF s. 102”
- X4: “EET2025TA1005(1).pdf · PDF s. 102”
- X5: “EET2025TA1005(1).pdf · PDF s. 102”
- X6: “EET2025TA1005(1).pdf · PDF s. 102”
- X7: “EET2025TA1005(1).pdf · PDF s. 102”
- X8: “EET2025TA1005(1).pdf · PDF s. 114”
- X9: “EET2025TA1005(1).pdf · PDF s. 114”
- X10: “EET2025TA1005(1).pdf · PDF s. 114”
- X11: “EET2025TA1005(1).pdf · PDF s. 114”
- X12: “EET2025TA1005(1).pdf · PDF s. 114”
- X13: “EET2025TA1005(1).pdf · PDF s. 114”
- X14: “EET2025TA1005(1).pdf · PDF s. 114”
- P15: “EET2025TA1005(1).pdf · PDF s. 142”
- X16: “EET2025TA1005(1).pdf · PDF s. 142”
- X17: “EET2025TA1005(1).pdf · PDF s. 142”
- X18: “EET2025TA1005(1).pdf · PDF s. 142”
- M19: “EET2025TA1005(1).pdf · PDF s. 142”
- H20: “EET2025TA1005(1).pdf · PDF s. 142”
- X21: “EET2025TA1005(1).pdf · PDF s. 182–190”
- X22: “EET2025TA1005(1).pdf · PDF s. 182–190”
- X23: “EET2025TA1005(1).pdf · PDF s. 182–190”
- X24: “EET2025TA1005(1).pdf · PDF s. 77–80”
- A25: “EET2025TA1005(1).pdf · PDF s. 141”
- A26: “EET2025TA1005(1).pdf · PDF s. 141”
- A27: “EET2025TA1005(1).pdf · PDF s. 141”
- A28: “EET2025TA1005(1).pdf · PDF s. 141”
- A29: “EET2025TA1005(1).pdf · PDF s. 141”
- A30: “EET2025TA1005(1).pdf · PDF s. 141”
- A31: “EET2025TA1005(1).pdf · PDF s. 141”
- A32: “EET2025TA1005(1).pdf · PDF s. 141”
- A33: “EET2025TA1005(1).pdf · PDF s. 141”
- A34: “EET2025TA1005(1).pdf · PDF s. 141”
- A35: “EET2025TA1005(1).pdf · PDF s. 141”
- A36: “EET2025TA1005(1).pdf · PDF s. 141”
- A37: “EET2025TA1005(1).pdf · PDF s. 141”
- A38: “EET2025TA1005(1).pdf · PDF s. 141”
- A39: “EET2025TA1005(1).pdf · PDF s. 141”
- A40: “EET2025TA1005(1).pdf · PDF s. 141”
- A41: “EET2025TA1005(1).pdf · PDF s. 141”
- A42: “EET2025TA1005(1).pdf · PDF s. 141”
- A43: “EET2025TA1005(1).pdf · PDF s. 142”
- A44: “EET2025TA1005(1).pdf · PDF s. 142”
- A45: “EET2025TA1005(1).pdf · PDF s. 142”
- A46: “EET2025TA1005(1).pdf · PDF s. 142”
- A47: “EET2025TA1005(1).pdf · PDF s. 142”
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: yok.

### Ornekler/Trafo_Guc_Kaynagi.odsdevre

- **Başlık / konu:** Anahtar → trafo → güç kaynağı → lamba
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (source) — 1 Faz Besleme; etiketi: “1 Faz Besleme”; kayıtlı ayar: {"state":false}
- S1 (switch) — Seçici Anahtar; etiketi: “Giriş beslemesini aç / kapat”; kayıtlı ayar: {"state":false}
- T1 (transformer) — Kumanda Trafosu; etiketi: “Giriş 1–2 / çıkış 3–4”; kayıtlı ayar: {"state":false}
- G2 (supply) — 24 VDC Güç Kaynağı; etiketi: “Giriş L–N / çıkış +24V–0V”; kayıtlı ayar: {"state":false}
- H1 (lamp) — Yeşil Sinyal Lambası; etiketi: “24 V çıkış lambası”; kayıtlı ayar: {"state":false}
- H2 (unconnected) — Kırmızı Sinyal Lambası; etiketi: “Bağlantısız: sönük kalır”; kayıtlı ayar: {"state":false}
- **Bağlantılar:**
- w1: G1.L → S1.13 (hat L1)
- w2: S1.14 → T1.1 (hat L1)
- w3: G1.N → T1.2 (hat N)
- w4: T1.3 → G2.L (hat L1)
- w5: T1.4 → G2.N (hat N)
- w6: G2.P → H1.X1 (hat +24V)
- w7: G2.M → H1.X2 (hat 0V)
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.

### Ornekler/Yildiz_Ucgen_Paket_v1.8.odsdevre

- **Başlık / konu:** Paket Şalter ile Yıldız Üçgen
- **Ana ekran durumu:** Arşiv dosyası; ana ekranda düğmesi yok.
- **Sınıflandırma:** DÜZELTİLMELİ — Ayrı öğrenme amacı/çalışma sonucu yok veya yalnız katalog/yerleşim tanımı var; kaynak dosyası ana ekranda ders olarak sunulmuyor.
- **Komponentler ve kayıtlı görevleri:**
- G1 (g1) — 3 Faz Besleme; etiketi: “3 Faz Besleme”; kayıtlı ayar: {"state":false}
- S1 (s1) — Yıldız / Üçgen Paket Şalter; etiketi: “Yıldız / Üçgen Paket Şalter”; kayıtlı ayar: {"state":false}
- M1 (m1) — Üç Faz Yıldız-Üçgen Motor; etiketi: “Üç Faz Yıldız-Üçgen Motor”; kayıtlı ayar: {"motorConnection":"external","state":false}
- **Bağlantılar:**
- w0: G1.L1 → S1.L1
- w1: G1.L2 → S1.L2
- w2: G1.L3 → S1.L3
- w3: S1.U1 → M1.U1
- w4: S1.V1 → M1.V1
- w5: S1.W1 → M1.W1
- w6: S1.U2 → M1.U2
- w7: S1.V2 → M1.V2
- w8: S1.W2 → M1.W2
- w9: G1.PE → M1.PE
- **Pano yerleşimi:**
- Uygulanmaz.
- **Ölçüm elemanları:**
- Ayrı ölçü aleti/prob tanımlı değil.
- **Kaynak açıklaması:**
- Ayrı komponent notu/öğretici açıklama yok.
- **Varsayılan çözüm:** Varsayılan durum, t=0: kararlı=true; kısa devre=false; başlangıçta etkin: G1.


### Arşiv dosyalarının sınıflandırma toplamı

| Sınıflandırma | Adet |
|---|---:|
| UYUMLU | 7 |
| DÜZELTİLMELİ | 19 |
| KONU TEKRARI | 0 |
| EKSİK MALZEME / BAĞLANTI HATASI | 0 |

Sinamics_V20_Kontrol_v1.8 arşiv örneği ile ana ekrandaki v20pot arasında konu benzerliği var. Kayıtlı hedef ve adım açıklaması aynı değil/eksik olduğundan bunları tekrarlı ders diye kesinleştirmedim. Benzer ad tek başına tekrar sayılmadı.

### Faz 7'de tekrar açısından karşılaştırılacak eşleşmeler

- Ana ekran analog çubuklar ile arşivdeki 24 V analog sensörler.
- Ana ekran V20 potansiyometre uygulaması ile arşivdeki SINAMICS V20 kontrol devresi.
- Ana ekran hareketli prob ölçümü ile arşivdeki 220 V / 24 V kablo üstü ölçüm örneği.
- Ana ekran Baykon TX11 akım döngüsü ile arşivdeki TX11 gerilim ve akım probu örnekleri.

Bu eşleşmeler şu anda KONU TEKRARI sayılmadı; notlar ve ölçüm yöntemi farklılıkları, aynı öğrenme kazanımını tekrar ettiklerini tek başına kanıtlamıyor. Faz 7'de içerikleri ve kullanım adımlarını yan yana karşılaştırmak üzere kaydedildiler.
## Kapatma notu

Faz 1 sırasında ders/devre içeriği değiştirilmedi. DÜZELTİLMELİ sınıfları envanter bulgusudur; düzeltmeler sonraki fazlarda ele alınır. Bu kayıt Faz 1 kontrol noktasına sunulur; sonraki faza geçiş için kullanıcı onayı gerekir.
