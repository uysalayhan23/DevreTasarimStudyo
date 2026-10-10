# Faz 3 — komponent davranışları

> **Taban düzeltme notu (2026-10-03):** Bu rapor, `main` dalındaki v1.18.0 tabanı üzerinde yazılmış ilk 1.19.1 çalışmasını anlatıyordu. 1.19.1 dalı sonradan gerçek v1.19.0 koduyla birleştirildi. Güncel dalda v1.19.0'ın gelişmiş RLC modeli ile BD139/BD140 ve LM358P davranışları korunur. Aşağıdaki “komponent kütüphanesinde tanımlı değildir” tespiti artık geçerli değildir; ilk tabanın tarihsel kaydıdır.

> **1.19.1 doğru taban doğrulaması:** v1.19.0 çözücü koduyla birleştirmede `network()` içindeki sayısal örnekleme çağrısına aktarılmış `now` değişkeni fonksiyon kapsamında tanımlı değildi. `network()` artık çözüm zamanını parametre olarak alıyor; solver başlangıç zamanını tüm ağ ve ölçüm çözümlemelerine iletiyor. Faz 3 entegrasyonunda karmaşık AC admitansı, DC R/C/L zaman adımı, ileri/ters diyot ve LED eşiği ile köprü doğrultucunun ortalama DC çıkışı korunup tamamlandı. `tests/passive-rlc-v119.test.cjs`: 4 geçti, 0 başarısız. Tam paket 427 testte 379 geçti; temiz v1.19.0 tabanındaki başarısız test adları yalnızca korunmuş/devralınmış testlerdir. Ayrıntı Faz 0 kaydındadır.

## Sonuç ve kapsam

- Dal: `Devre-Tasarim-Studyosu-1.19.1`
- İş sırası: `V1.19.0_IS_SIRASI_MANIFESTO_LOCKED.md`, Faz 3.
- Model yaklaşımı: kullanıcı onaylı ideal eğitim modeli; üretici toleransı veya tam yarı iletken fiziği iddiası yoktur.
- Mevcut ders/arşiv dosyalarında kullanılan doğrusal pasifler: direnç ve 150 mH sargı. Kondansatör, reaktör, diyot, LED ve köprü redresör kütüphanede bulunur; Faz 1’de incelenen ders projelerinde doğrudan kullanılmıyor.

## Uygulanan davranışlar

| Eleman | Model |
| --- | --- |
| Direnç | Ohm yasasıyla DC ve AC fazör çözücüsünde akım/gerilim; bileşenin özelliklerinden Ω değeri. |
| Kondansatör | DC’de geriye doğru Euler zaman adımıyla şarj/boşalma; 50 Hz AC’de (X_C=1/(2πfC)) fazör admitansı. Varsayılan değer 100 µF; özelliklerden değiştirilebilir. |
| Reaktör / sargı | DC’de (v=L,di/dt) ile akımın zaman adımında değişmesi; 50 Hz AC’de (X_L=2πfL) fazör admitansı. Varsayılan değer 150 mH; özelliklerden değiştirilebilir. |
| Diyot | İleri yönde 0,7 V eşik ve düşük seri direnç; ters DC polaritede kesim. |
| LED | İleri yönde 2 V eğitim eşiği ve düşük seri direnç; ters DC polaritede kesim. |
| Köprü redresör | Tek faz girişte tam dalga doğrultulmuş sinüsün ortalama DC değeri (2√2/π × V_{RMS}); çıkışta dalgalanma modellenmez. |

AC pasif ağ çözümü kompleks admitansla yapılır. Direnç, reaktans ve seri R–C devresi için akım/gerilim denetimleri eklendi. DC kondansatör şarjı, bobin akım artışı, diyot yönü, LED eşiği ve redresör ortalama çıkışı için regresyon kontrolleri eklendi.

## Sınırlar ve sonraki fazlar

- Tek diyotun AC yarım dalga anahtarlaması anlık dalga biçiminde çözülmez; tek diyot modeli DC ileri/ters kullanım içindir. AC doğrultma için mevcut köprü redresör ortalama DC modeli kullanılır.
- Kondansatör ESR/kaçak, bobin sargı direnci/doyumu/kayıp ve yarı iletken sıcaklık/ters toparlanma etkileri modellenmez.
- Bu ilk taban raporunda BJT/op-amp kapsamı eksik görünüyordu. Gerçek v1.19.0 tabanında BD139/BD140 ve LM358P modelleri zaten bulunur. Kalan eksik güç yarı iletkenleri Faz 5 raporunda ele alınır.
- Model, ideal ve eğitim amaçlıdır; gerçek donanım, üretici firmware’i veya tam devre simülatörü yerine geçmez.

## Doğrulama

- `node --test tests/passive-rlc-v119.test.cjs`: 4 geçti, 0 başarısız.
- `node scripts/run-tests.cjs`: 259 geçti, 0 başarısız, 0 atlandı.
- Değişen JavaScript dosyaları için sözdizimi denetimi ve `git diff --check` temiz.
- Gerçek Windows/Edge etkileşimli testi bu fazda yapılmadı.

## Faz durumu

İlk faz denetimi v1.18 tabanına aittir ve üstteki notla sınırlandırılmıştır. Güncel uygulama v1.19.0 kodunu içerir; doğru tabana göre sonuçlar `docs/DURUM_VE_SINIRLAR.md` içinde izlenir.

