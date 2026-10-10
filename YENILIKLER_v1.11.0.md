# Devre Tasarım Stüdyosu v1.11.0

## Kullanım

ZIP dosyasını yeni bir klasöre çıkarıp `BASLAT.bat` dosyasını açın. Önceki sürümün proje dosyaları açılabilir. Dashboard'da dört yeni örnek bulunur: **v1.11 malzemeler**, **Akım trafosu**, **Faz röleleri**, **Sigortalar ve NH**.

- Hoparlör, buzzer, ihbar/alarm ve siren artık dört ayrı, isimlerine uygun ürün fotoğrafı kullanır. Önceki sürümün ses işlevleri korunur.
- PT100 ve çift elemanlı termokupl aynı prob görünümünü kullanır. PT100 için sağ menüden 2, 3 veya 4 telli bağlantı seçilir. Termokuplun dört terminali iki ayrı +/− çiftidir.
- Eleman seçiliyken **Eleman boyutu (%)** alanıyla %25–300 arası büyütüp küçültün. Gövde, terminaller ve kablo uçları birlikte ölçeklenir. Pano tasarımında mevcut genişlik/yükseklik ayarları da kullanılabilir.
- SSR'nin 3+ ve 4− girişine doğru polaritede 24 V uygulanınca yalıtılmış 1–2 çıkışı NO/NC seçimine göre değişir.
- Tek kutuplu aç–kapa şalterin kutup sayısı sağ menüden 1–8 yapılabilir. Terminaller çiftler halinde eklenir. Bağlı kablosu olan bir terminal kaldırılmadan önce kablosunun ayrılması gerekir.
- Güç şalteri ve düz/yön değiştiren paket şalterler kalıcı butonun ön görünümünü kullanır. Yıldız–üçgen şalterin ayrı Metop görünümü ve üç konumu korunur.
- Mekanik kilitleme, mekanik kumanda ve sınır anahtarlarının hareketli tekerlek kolu 90° sağa yatar. Otomatik sigorta mandalı yukarı/aşağı; termik manyetik şalter düğmesi 90° hareket eder.
- Metop MT031 yıldız–üçgen şalterde 16 fiziksel terminal, 8 kam kontağı ve 7 sabit köprü bulunur. Sembol ve çalışma tablosu 0/Y/Δ konumlarını gösterir. Eski U1/L1 gibi terminal kimlikleri proje uyumluluğu için korunur; etiketlerde fiziksel numaralar da gösterilir.
- Tense FS-R faz sırasını ve faz/nötr varlığını; FKV-03 ayrıca gerilim toleransını kontrol eder. Sağlıklı durumda 2 COM–3 NO, hatada 2 COM–1 NC bağlıdır. Üç fazlı kaynağın sağ menüsünde gerilimleri değiştirin; 0 V ilgili fazı kaldırır.
- NH sigortalı yük ayırıcının kapağına tıklayın. Açılınca üç kutup da ayrılır ve kapak aşağı yatar. Kapak açıkken sağ menüden üç sigortayı ayrı ayrı takıp çıkarın. Kapak kapalı olsa da boş sigorta yuvası iletmez.
- Sigortalı ayırıcı ve sigortalı şalter üstten görünüşlü WSI 6 uyarlamasıdır. Sağ menüden 1–6 klemens seçilir; her klemense tıklamak yalnız o sigortayı açar/kapatır.
- Akım trafosunun oranı sağ menüden seçilir. P1–P2 yükle seri, S1–S2 ampermetre devresine bağlanır. Örnekte 230 V / 23 Ω = 10 A; 100/5 oranında 0,5 A, 200/5 oranında 0,25 A okunur.
- Genel endüktif/kapasitif sensörler endüktif şalter gövdesini kullanır; algılama mantıkları korunur. Autonics, Omron, Baumer, IFM, Telemecanique, Wenglor ve Pepperl+Fuchs marka sensör tanımları değiştirilmedi.
- Potansiyometrenin ön düğmesini sağa/yukarı sürüklemek direnci artırır, sola/aşağı sürüklemek azaltır. Değeri altında Ω olarak görünür. Azami direnci sağ menüden örneğin 100000 Ω seçin. 1–2 sürgü direnci ile 2–3 tamamlayıcı direnç bu ayara uyar.
- Direnç standart kahverengi–siyah–kırmızı–altın bantlı 1 kΩ görünümünde; sargı 150 mH bobin görünümündedir. Yük direncini değiştirmek devre hesabını değiştirir, çizimdeki nominal 1 kΩ gövdeyi değiştirmez.

## Bağlantı ve model kapsamı

PT100: 2 telde A–B1; 3 telde A ile B1/B2; 4 telde A/A2 ile B1/B2 kullanılır. Aynı harfli terminaller sensörün aynı ucuna bağlıdır. 3 telli gerçek ölçüm, eşit kablo dirençleri varsayımıyla kompanzasyon; 4 telli ölçüm ayrı akım ve gerilim uçları kullanır. Simülatör kablo direnci hatasını hesaplamaz. Direnç göstergesi −50…150°C arasında Pt100 eğrisini kullanır.

Termokupl dört ucu, iki bağımsız K tipi ölçüm çifti olarak modellenmiştir; her çift aynı sıcaklığı görür. Yaklaşık 41 µV/°C ve 25°C soğuk uç modeli kullanılır.

Akım trafosu hesabı dirençli AC yüklerin RMS değerleri içindir. Fazlar arası gerilim farkı ve paralel direnç yolları hesaba katılır; DC giriş sekondere aktarılmaz. Motor/bobin reaktansı, doyma, faz hatası, geçici rejim ve açık sekonderin yüksek gerilimi modellenmez. SSR ideal yalıtılmış anahtar modelidir. Faz koruması ±%40 toleranslı mantıksal modeldir; gerçek ürünün bütün süre ve histerezis ayrıntıları yoktur. NH ve WSI sigortalarında takılı/açık durumları modellenir; akıma bağlı erime eğrisi hesaplanmaz.

Görsellerin kaynakları ve önden/üstten üretim uyarlamalarının kapsamı `GORSEL_KAYNAKLARI_v1.11.0.md` dosyasındadır.
