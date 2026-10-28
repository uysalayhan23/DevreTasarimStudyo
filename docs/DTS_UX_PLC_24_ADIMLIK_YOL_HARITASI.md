### 28 Ekim — Madde 20: PNG/PDF çıktılarında ölçü aletleri ve temiz düzenleme katmanları

Gerçek kusur: `dist/project-png.js` ve `dist/project-print.js` yazdırılacak SVG kopyasını hazırlarken `.measurement-overlay` katmanını bütünüyle siliyordu. Bu katmanda gerçek multimetre, pens metre, osiloskop, prob ve ölçüm kabloları bulunur; yani kullanıcı ekranda gördüğü ölçü aletlerini çıktıda kaybediyordu. İkinci kusur: render kaynağı `.wire-editors` ve `.draft-wire-group` sınıflarını kullanırken mevcut çıktı temizleme seçicisi onları tanımıyordu. Yalnız **geçici düzenleme tutamakları, taslak kablo, hizalama kılavuzları ve seçim kutusu** temizlenir; ölçüm katmanı ve `malzeme < kablo < ölçü aleti` SVG boyama sırası korunur. Harici görsel içeren SVG için PNG güvenlik reddi, çevrimdışı `file:///`, PDF için tarayıcı yazdır ve CSV malzeme listesi mevcut davranışlarını korur. `tests/dts-project-export-meter-layer.test.cjs` yeni 4, mevcut PNG 5, mevcut PDF 4 olmak üzere **13/13 hedefli V8 regresyon PASS**. Gerçek Edge PDF/PNG dosya açılışı **NOT_RUN/REVIEW**; 20. madde **KISMİ**.


# DTS UI/UX + PLC Ladder — 24 Adımlık Canlı Geliştirme Planı
**28 Ekim 2026 · Depo:** `uysalayhan23/DevreTasarimStudyo` · **Aktif dal:** `main`

**Öncelik:** Arayüzde kullanım kolaylığı, tam sayfa ve simülasyon odak görünümü, özgün ve sanal PLC Ladder programlama. Kullanıcının açık yeni talebi olmadan geniş ders taramasını başlatma. Ders değişikliği istenirse ilk olarak [ders arşivi](DERS_GUNCEL_DURUM_VE_DEVAM_PROTOKOLU.md) okunur. Önce [AGENTS.md](../AGENTS.md), [Ladder incelemesi](LOGO_SOFT_COMFORT_STATIK_INCELEME_2026-10-27.md) ve [güncel teknik gelişmeler](PLANNER_UI_LADDER_GUNCEL_2026-10-28.md) okunur.

**Durum terminolojisi:** `KOD/TEST` işlevin kodu ve adı geçen hedefli test tamamlandı; **Windows Edge/3D/pedagojik tam kabul değildir.** `KISMİ` başlangıç altyapısı mevcut, bütün kabul maddesi tamamlanmadı. `MEVCUT` daha eski DTS özelliği. `PLAN` henüz uygulanmadı. `REVIEW` kullanıcı/gerçek görsel kabulü açık. PASS yalnız gerçekte koşulan testin kapsamını ifade eder.

### 28 Ekim — Network içindeki her öğe için güvenli sil / yeniden ekle

Kullanıcı, Network'e eklediği **her kontağı ve her çıkış bobinini/blokunu** ayrı ayrı kaldırıp yeniden eklemek istiyor. Önceden LAD/FBD tek kalan kontağı silemiyor, Ladder V1'de boş seri yol tehlikeli biçimde `[].every(...)=true` çıkışı enerjileyebiliyordu. Onarım: son kontak silindiğinde yol `[]` olabilir ancak `scan` onu daima **açık devre/false** sayar; SVG ve FBD `BOŞ KONTAK` gösterir. Kullanıcı + Seri / paletten kontakla tekrar doldurur. OUT/SET/RESET dahil tüm çıkışlar adrese yazmayan `NOP` olarak kaldırılıp komut paleti/menüyle geri eklenebilir; silinen SET M latch belleği artık yetim M bitini enerji altında tutmaz, hâlen SET sahibi olan M belleği korunur. Tüm değişiklikler taslak+Undo/Redo olarak kalır. `tests/dts-ladder-remove-any-network-element.test.cjs` **10/10 hedefli V8 regresyon PASS**, bağımsız Node ve Windows/Edge görsel kabulü ayrı **NOT_RUN/REVIEW**. 24 madde/09/11/15/23 **KISMİ**, 703 katalog ve fiziksel Simulation.solve değiştirilmedi.

## Öncelik 0 — Son kullanıcı geri bildirimleri (24 maddeyi genişletmeden)

Bunlar **24 maddelik mevcut planda zorunlu alt görevlerdir; 25. madde değildir.** Genel UX/devre iyileştirmesinden önce ele alınır:

- **P0-A (03/05/08):** Sağ Özellikler panelini standart, tam sayfa ve simülasyon modunda isteğe bağlı aç/kapat. Sensör/PLC alanları sağ panelden erişilebilir; kapanınca kenar düğmesiyle tekrar açılır. Tam ekran dönüşünde önceki yerleşim korunur. Kaynak: `dist/workspace-modes.js`, `dist/studio.css`. Windows/Edge **REVIEW**.
- **P0-B (08/16/17/19):** Sağ paneldeki kablo rengi/hat/gerilim/kesit ayarları korunur ve tam ekran/simülasyon modunda panel açılarak erişilir. Simülasyon sırasındaki elektriksel düzenleme kilitleri değiştirilmez. Gerçek kullanıcı tıklama/kablo seçimi Windows **REVIEW**.
- **P0-C (08/17/19):** SVG çizim sırası **normal malzeme altında → sıradan/terminal kabloları üstünde → ölçü aletleri en üstte**. Multimetre, voltmetre, ampermetre, osiloskop, pens metre, prob vb. aynı üst katmandadır. `dist/scene-layer-order.js` ayrı salt görsel sınıflayıcıdır; `dist/app.js` normal malzemeleri önce, kabloları sonra ve ölçüm cihazlarını en son çizer. 2D/3D terminal geometrisi ve `Simulation.solve` değişmez; fiziksel Windows/3D kabulü **REVIEW**.
- **P0-D (09/15/23):** Ladder zamanlayıcı/sayaç için **“Bloğu kaldır”** düğmesi eklendi. Çalışan OUT bobini oluşturmak yerine tek Network'te dahi geçerli **NOP / BOŞ (çıkış yok)** komutu kullanılır. Q/M/T/C'ye yeni yazım yapmaz, eski T/C bitleri ve onlardan türeyen Q çıkışı sonraki sanal taramada kapanır. LAD/FBD, Undo/Redo ve görsel kopuk çıkış 7 hedefli JS regresyon testiyle PASS. `Simulation.solve` / 703 katalog değişmedi. Bağımsız Node, Windows Edge ekran etkileşimi ve 3D kabul **REVIEW / NOT_RUN**; madde genel **KISMİ**.

Bunların dışında 01–24 arasındaki tüm başlıklar korunacak; kanıtsız genel COMPLETE yok. 703 katalog, 1686 ders, SC1194 fiziksel HOLD ve tüm Golden/PASS/HOLD/REVIEW kilitleri devam eder.

### 28 Ekim — P0 Windows başlatıcı sessiz kapanma düzeltmesi

`BASLAT.bat` açılışında `start "" "%INDEX%"` Windows varsayılan HTML ilişkilendirmesi görünür tarayıcı açmadan da başarı döndürebildiği için BAT dosyası Edge'e geçmeden kapanabiliyordu. Öncelik artık kurulu Edge yürütülebilir dosyası (gerekirse Chrome/Firefox), sonra varsayılan HTML ilişkilendirmesi ve eski URL/PowerShell yedekleridir. Yerel `dist/index.html`, `file:///`, smoke-test, paket bütünlüğü, görünür hata mesajı ve sunucusuz kullanım korunur. Eski 4 başlatıcı kontrolü ve yeni 3 hedefli regresyon kontrolü V8 PASS. Gerçek Windows/Edge BAT çift tıklama **REVIEW/NOT_RUN**; genel COMPLETE değil.

### 28 Ekim — Madde 08 tam sayfa çıkışı ve sağ panel tercih regresyonu

Çalışma alanı `toggleFull()` önce modal/güvenlik/dashboard engelini kontrol ettiğinden, tam sayfa **zaten açıkken** bir güvenlik veya ayar penceresi görünürse üstteki tam sayfa düğmesiyle standart görünüme dönmek engellenebiliyordu. Engel yalnız **tam sayfaya girerken** uygulanır; standart görünüme çıkış her zaman mümkün, Escape ve native fullscreen kapatma korunur. Eski `tests/workspace-modes-ui.test.cjs` sağ panelin simülasyonda zorla gizlenmesini bekliyordu; kullanıcı isteğiyle önceden düzeltilmiş `propertiesVisible` koruma davranışına uyarlandı. Toplam **12/12 hedefli V8 regresyon PASS**. Windows/Edge gerçek modal/tam ekran ve responsive piksel kabulü **REVIEW**; 08. madde KISMİ, devre/PLC/3D kabulü değişmez.

## Paket A — Çalışma alanı (8 madde)

### 28 Ekim — Kullanıcı Edge ekranına göre tam sayfa malzeme paneli ve PLC sanal simülasyon başlangıcı

Ekran görüntüsüyle doğrulanan üç kullanım sorunu: tam sayfada kütüphanenin CSS ile gizlenmesi, açık düğmelerin okunabilir koyu yazı istemi ve henüz Ladder kaydedilmemiş doğrulanmış CPU 1211C'nin genel PLC yasağına takılması. Tam sayfada sol malzeme paneli görünür ve kullanıcı daraltabilir; standart moda dönünce önceki panel düzeni geri yüklenir. Üst araç çubuğu, kütüphane ve Ladder düğmelerinin açık arka plan üzerinde koyu gri Edge/WebKit yazı rengi kesinleştirilir. `DTSPLCRuntime.simulationGate` yalnız `plc-hw-6es7211-1ae40-0xb0` ve geçerli DTS Ladder'ı kabul eder; **henüz programı olmayan doğrulanmış PLC** simülatörü güvenli boş durumda çalıştırabilir, otomatik program atanmaz ve Q çıkışları 0 kalır. Geçersiz Ladder, doğrulanmamış PLC modu, görsel-only cihaz ve desteklenmeyen PLC kilidi korunur. Eski genel `PLC bulunan projede simülasyon kapalıdır` yazısı yalnız gerçek engel nedenini gösterir. İlgili dosyalar `dist/workspace-modes.js`, `dist/studio.css`, `dist/plc-runtime.js`, `dist/app.js`, `dist/index.html`. Bağımsız Windows/Edge gerçek tıklama/görsel ve 3D kabulü **REVIEW**; tam elektriksel `Simulation.solve` bu turda değiştirilmedi. Madde 01/04/08/11/13 ve 24 listesi **KISMİ** kabul çerçevesinde korunur.



| No | Özellik | Durum ve kanıt |
| --- | --- | --- |
| 01 | Standart / Simülasyon Odak / Tam Sayfa görünüm | **KOD/TEST**: `ea96daf90d`; 18/18 izolasyon UI testi, Windows görsel REVIEW |
| 02 | Simülasyon başlarken kütüphaneyi daralt | **KOD/TEST**: `dist/workspace-modes.js` |
| 03 | Özellikler panelini gizle ve önceki düzeni geri getir | **KOD/TEST**: panel snapshot + restore |
| 04 | Tam sayfa / standart düğmesi, Esc ile çıkış | **KOD/TEST**: CSS fallback, Fullscreen API; Edge REVIEW |
| 05 | Yan panelleri kullanıcının isteğiyle aç/kapat | **MEVCUT**: `collapseLibrary`, `applyPropertiesVisibility` |
| 06 | Sade, gruplandırılmış üst araç çubuğu | **KOD / REVIEW**: Dosya, Düzenle, Görünüm grupları; eski ID'ler korunur, dar ekranda kaydırılır; Windows görsel kabulü açık |
| 07 | Ctrl/Cmd+K hızlı kütüphane araması; Esc ile temizle | **KOD/TEST**: `67547c6ba4`, 15 hedefli mantık kontrolü |
| 08 | Dar ekran ergonomisi, odak modu, tercihleri koruma | **KISMİ**: simülasyon snapshot, tam responsive Windows REVIEW |

### 28 Ekim 2026 — TOF sanal saat geri sarma hedefli onarımı

`dist/ladder-runtime.js` TOF gecikmeli kapatma sırasında sanal saat geri alınırsa geçmiş `offStart` değerini yeni zaman çizelgesine taşımayıp gecikmeyi o andan başlatır. Önceki kodda 1010 ms'de başlatılan 100 ms gecikme, sanal saat 0 ms'ye döndüğünde 100 ms sonunda kapanmıyordu. Yalnız TOF dalı değiştirildi; TON, TP, katalog ve elektriksel `Simulation.solve` değiştirilmedi. Hedefli 7 JavaScript V8 kontrolü PASS (eski kusur yeniden üretildi); `tests/dts-ladder-tof-rewind.test.cjs` beş Node test senaryosu eklendi, bu ortamda Node test dosyası bağımsız çalıştırılmadı (NOT_RUN). Windows/Edge, 3D ve tam native kabul **REVIEW**; madde 11 **KISMİ** korunur.

### 28 Ekim — CTU/CTD tür değiştirme regresyonu

Sanal Ladder V1'de FBD/PLC taslağı CTU C1'den CTD C1'e değiştirilirse önceki `count`/kenar belleği yanlış yeniden kullanılıyordu; CTD hedef değerinden başlamıyordu. Sayaç tipi değişiminde eski durumu temizleyen dar kapsamlı düzeltme eklendi. CTU→CTD, CTD→CTU ve mevcut yükselen kenar/same-timestamp davranışı için üç hedefli V8 kontrolü PASS; `tests/dts-ladder-counter-type-switch.test.cjs` Node regresyonları eklendi, Node çalıştırması NOT_RUN. Windows/Edge, özgün fiziksel `Simulation.solve` kabulü REVIEW; madde 11 KISMİ kalır.

### 28 Ekim — Enerjisiz PLC için Ladder/FBD canlı iz kapısı

`dist/ladder-editor.js` içindeki canlı Network izleri, eski `pathStates` / `coilValue` değerlerini PLC enerjisizken göstermemeli. `monitorRows` artık `_plcRuntime.powered===true` koşulunu arıyor; FBD ve Ladder diyagramını besleyen `bits` kapısı aynı gerçek PLC beslemesini kontrol ediyor. Enerjisiz / bilinmeyen güç ve durdurulmuş simülasyonda geçmiş yeşil yol işaretleri gizlenir; gerçek `Simulation.solve` veya PLC çıkış hesaplaması değiştirilmedi. Kaynak üzerinden hedefli pozitif-negatif JS doğrulaması ve dört Node regresyon senaryosu eklendi. Gerçek Windows/Edge görsel testi ve 3D kabulü REVIEW; madde 14/23 KISMİ.

### 28 Ekim — LAD çıkış kablosu durum çizimi

`dist/ladder-diagram.js` daha önce TON giriş yolu aktifken zamanlayıcı çıkışı kapalı olmasına rağmen bobinden sonraki kabloyu yeşile boyuyordu. Giriş yolu gerçek `pathStates`, çıkış kablosu ise gerçek `coilValue` ile çizilir. TON bekleme/bitiş, TOF gecikmeli çıkış ve OUT açık/kapalı için 5 hedefli JavaScript kontrolü PASS. `tests/dts-ladder-output-wire-state.test.cjs` Node regresyon dosyası eklendi (Node çalıştırması NOT_RUN); Windows/Edge, 3D ve tam fiziksel kabul REVIEW, madde 14 KISMİ.

### 28 Ekim — LAD paletinde geçerli T/C adresi seçimi

LAD ve FBD açılır menülerindeki daha önce düzeltilmiş adres sahipliği kuralı, `dist/ladder-toolbox.js` sürükle/bırak paletinde uygulanmıyordu. T1/C1 başka bir Network'te kullanılıyorsa, T2/C2 boş olsa bile yeni TON/CTD işlemi reddediliyordu. Gerçek eski kaynakta tekrar üretildi. Palet şimdi mevcut geçerli T/C adresini ve süre/hedefini korur; yeni fonksiyon bloklarında boş T1–T16/C1–C16 adresini seçer; adresler doluysa yerel taslağı değiştirmeden hata verir. Normal NO/NC ve OUT davranışı korunur. `tests/dts-ladder-palette-free-block-address.test.cjs`: **8/8 hedefli V8 regresyon PASS**. Bağımsız Node/Windows-Edge sürükle/bırak **NOT_RUN/REVIEW**. 24 maddenin 09/11/15/23 kabulü **KISMİ** kalır. Native `Simulation.solve`, 703 katalog, 1686 ders ve Golden/PASS/HOLD/REVIEW değiştirilmedi.

### 28 Ekim — M bellek sahipliği / FBD açık yol hedefli güvenlik onarımı

Network sil/yeniden ekle teslimatı sonrası bir regresyon bulundu: ilk sürüm, yazarı olmayan bütün M bitlerini sıfırlayarak bağımsız M değerlerini de silebiliyordu. Artık yalnız **önceki taramada OUT/SET yazarı bulunan ve kaldırılmış M bitleri** sıfırlanır; diğer M bellek ve geçerli SET latch korunur. FBD boş yol artık `AÇIK` gösterir; FBD yapısal düzenleme ve polarite değişimi simülasyon çalışırken engellenir. Boş yol/NOP `.dtsladder` roundtrip ve olumsuz dosya testleri `tests/dts-ladder-empty-path-memory-and-io.test.cjs` içinde hedefli V8 PASS. Native fiziksel `Simulation.solve`, 703 katalog ve ders kabulü değiştirilmedi. Windows/Edge ve 3D **REVIEW**.

### 28 Ekim — .dtsladder içe aktarma yarış durumu ve canlı düzenleme kilidi

Aynı PLC'de iki `File.text()` okuması ters sırada tamamlanırsa eski dosya yeni taslağın üzerine yazılabiliyordu. Her seçim artık artan istek kimliği taşır; eski okuma, kapanmış modal, farklı PLC/proje veya simülasyon sırasında tamamlanan dosya taslağı değiştirmez. LAD/FBD alanları, yapısal ekle/sil, Undo/Redo ve örnek yükleme simülasyon çalışırken düzenlenemez; simülasyonu durdurma erişimi korunur. `tests/dts-ladder-import-race-and-edit-lock.test.cjs`: 7 hedefli V8 test PASS (bağımsız Edge dosya seçici **REVIEW**). Önceki 703 katalog, `Simulation.solve`, 1686 ders ve fiziksel kabul değiştirilmedi.

### 28 Ekim — Kullanıcı serbest silme kabulü ve .dtsladder asenkron dosya yükleme güvenliği

Son kontak silindiğinde Ladder V1 yolu artık güvenli açık devredir. Eski FBD regresyonunun “son kontak silinemez” beklentisi yeni kabul şartına göre güncellendi. Mevcut `importSerial` farklı dosya/PLC ve modal yarışlarını engelliyordu; yeni `draftSnapshot` ayrıca **dosya okunurken yapılan yerel kontak/bobin düzenlemesini** korur, geç dönen dosya yeni taslağı ezmez. Önceki 5 ve 7 argümanlı yardımcı işlev çağrıları korunur. Güncellenmiş FBD 8 + yeni içe aktarma 5, toplam **13/13 V8 hedefli regresyon PASS**; bağımsız Node/Windows-Edge dosya diyalogu **NOT_RUN / REVIEW**. Madde 15/23 KISMİ, 1686 ders / 703 katalog / Golden/PASS/HOLD korunur.

## Paket B — PLC Ladder (7 madde)

### 28 Ekim — Ladder kontak seçicisinde tüm geçerli M/T/C adresleri

**Somut kusur:** Native Ladder V1 `M1–M32`, `T1–T16`, `C1–C16` kontaklarını ve FBD bu yüksek adresleri kabul ederken LAD arayüzündeki kontak menüsü yalnız `M1–M8`, `T1–T4`, `C1–C4` gösteriyordu. Geçerli yüksek adresli içe alınan program kontakları LAD üzerinden seçilemiyor/değiştirilemiyordu. Kaynak içindeki gerçek adres oluşturma işlevinden `M32`, `T16`, `C16` örnekleriyle kusur yeniden üretildi. **Onarım:** `dist/ladder-editor.js` kontak seçenekleri ortak `contactChoices` yordamıyla tüm sanal M/T/C adreslerini ve yalnız gerçek PLC'nin mevcut I/Q pinlerini gösterir; terminal etiketleri korunur. FBD, native scan ve 703 katalog değiştirilmedi. Hedefli 11 kaynak-V8 kontrolü ve `tests/dts-ladder-contact-address-range.test.cjs` içindeki 5 regresyon senaryosu gerçek kaynakları V8'de yürüterek PASS; bağımsız Node dosya yürütümü **NOT_RUN**. Windows/Edge `file:///` kullanıcı kabulü **REVIEW**; madde 09/11/15 **KISMİ**.
 
**24 madde bütünlük denetimi:** 01–08 çalışma alanı; 09–15 Ladder/PLC; 16–20 devre deneyimi; 21–24 gelişmiş üretkenlik olarak 24 madde yol haritasında ayrı ayrı kayıtlıdır. `KOD/TEST` ve `MEVCUT` ifadeleri Windows/3D bağımsız kabulü yerine geçmez. Açık kalemler arasında 06/08 responsive+görsel, 09/11/14/15 Ladder UI ve sınır davranışları, 16/17/18/19/20 devre UX ve dışa aktarım, 21/22/23/24 daha zengin editör+HMI ve gerçek Windows/3D kabul kapıları vardır. Bu not hiçbir maddeyi `COMPLETE` ilan etmez.



### 28 Ekim — Ladder T1 zamanlayıcı tür değişiminde eski çıkışın taşınmasını engelleme

**Gerçek kusur:** Sanal Ladder `TON T1` 100 ms sonunda aktifken aynı adresteki blok `TOF T1` türüne değiştirilip giriş pasif yapıldığında eski `T1` biti ve zamanlayıcı belleği yeni TOF'a taşınıyor, Q1 yanlışlıkla açık kalıyordu. Önceki kaynakta bu yanlışlık gerçek V1 taraması ve gerçek katalogdaki CPU 1211C için `PLC.evaluate`/çıkış bağlantısı kontrolünde yeniden üretildi. **Hedefli onarım:** `dist/ladder-runtime.js` T adresinin `TON/TOF/TP` türünü izler; tür değişiminde yalnız o zamanlayıcının eski `start/offStart/pulseStart/prev` alanlarını ve çıkış bitini sıfırlar. Eski oturumların `kind` alanı bulunmayan zamanlayıcı belleği de savunmalı temizlenir. Aynı türün zamanlaması, sayaçlar ve M kilitleri değiştirilmedi. Hedefli 11 V8 kontrolü PASS; `tests/dts-ladder-timer-kind-switch.test.cjs` içindeki 8 regresyon senaryosu V8 koşumuyla PASS. Gerçek `dist/library.js` CPU 1211C katalog tanımıyla `PLC.evaluate` ve `PLC.links` pozitif-negatif entegrasyonu PASS; bu, tam `Simulation.solve` veya fiziksel lamba kanıtı değildir. Bağımsız Node.js ve özgün tam `Simulation.solve` yürütümü bu turda **NOT_RUN**; Windows/Edge, 3D ve fiziksel kabul **REVIEW**. Madde 11/13 **KISMİ**, 1686 ders ve Golden/HOLD kilitleri değişmedi.



### 28 Ekim — Kaldırılmış Ladder T/C bloklarının hayalet sinyal temizliği

**Somut kusur:** Bir Ladder taslağında ON olmuş `TON T1` veya `CTU C1` bloğu sonraki program değişikliğinde çıkarıldığında, `scan` yalnız sahipsiz Q çıkışlarını sıfırladığı için eski `T1/C1` bitleri ve `blocks` sayım/zaman belleği kalabiliyordu. Eski bir T/C kontağını okuyan başka Network böylece gerçekte artık üretilmeyen sinyalden Q çıkışını etkinleştirebiliyordu. Her iki durum gerçek eski kaynakla yeniden üretildi. **Dar kapsamlı onarım:** `dist/ladder-runtime.js` yalnız sahibi olmayan T1–T16 / C1–C16 adreslerini kapatıp o adreslerin eski blok durumunu temizler; hâlen sahibi olan zamanlayıcı/sayaç blokları ve M kilitleme belleği korunur. FBD'de CTU'nun pasif RESET'e değiştirilmesi de güvenli sonuç verir. Hedefli 6 yeni regresyon senaryosu V8 ortamında PASS; `tests/dts-ladder-orphan-block-memory.test.cjs` Node test dosyası eklendi, bağımsız Node yürütümü bu turda **NOT_RUN**. 703 katalog / `Simulation.solve`, Windows/Edge, 3D ve bağımsız COMPLETE kabulü bu değişiklikten etkilenmez (**REVIEW**); 11/23 maddeleri **KISMİ** kalır.



### 28 Ekim — Çoklu Network'ün aynı T/C fonksiyon bloğuna yazmasını reddetme

**Somut kusur:** `dist/ladder-runtime.js` birden fazla TON/TOF/TP Network'ünün aynı T adresini veya CTU/CTD Network'ünün aynı C adresini paylaşmasını geçerli sayıyordu. Gerçek V1 taramasında I1 açık ve 100 ms dolmuş olsa bile ikinci `TON T1` (I2 kapalı) ortak zamanlayıcı durumunu temizliyor ve `Q1` yanlış kapalı kalıyordu. **Düzeltme:** `validate` aşamasında T/C için tek fonksiyon bloğu yazarı zorunludur; açık `RESET T1/C1` rung'ları ve ayrı T/C adresleri kabul edilmeye devam eder. Geçersiz program taraması çıktıları kapalı tutar, belleğe dokunmaz. Önce hata eski kaynakta yeniden üretildi, ardından 12 hedefli çekirdek + 3 FBD V8/JavaScript kontrolü PASS. `tests/dts-ladder-block-owner-unique.test.cjs` 7 Node regresyonu eklendi; Node test dosyası burada yürütülmedi (**NOT_RUN**). `Simulation.solve`, 703 katalog, Windows/Edge ve fiziksel/3D kabulü değiştirilmedi (**REVIEW**); madde 11 ve 23 **KISMİ**.



| No | Özellik | Durum ve kanıt |
| --- | --- | --- |
| 09 | PLC üzerinde görsel Ladder editörü | **KISMİ**: `64bc88b835`, rung/kontak/bobin kontrol ekranı; sürükle-bırak, Edge REVIEW |
| 10 | NO/NC, seri/paralel, bobin | **KOD/TEST**: `82c84733fab`, hedefli Boolean native test |
| 11 | TON/TOF/TP/SET/RESET/CTU/CTD ve M bitleri | **KISMİ**: sanal çalışma motorunda temelleri var; tüm karşıt/kenar/reset vakaları için ek regresyon açık |
| 12 | Ladder I1/Q1 adreslerini gerçek katalog terminalleriyle eşleştirme | **KOD/TEST (tek model)**: `plc-hw-6es7211-1ae40-0xb0` |
| 13 | Ladder tarama ve özgün `Simulation.solve` ile fiziksel devre | **KOD/TEST (tek model)**: 703 katalog 7/7 hedefli gerçek native sanal sahne |
| 14 | Canlı Ladder sinyal/aktif kontak/timer/sayaç izleme | **KISMİ**: rung aktivite işareti var; tam mantık yolu, timer değeri ve UI testleri açık |
| 15 | Ladder kaydet/aç/örnek program kütüphanesi | **KISMİ/KOD**: DTS `.dtsladder` dosyası ve **dört özgün hedefli native testli örnek** (Start/Stop, TON, CTU, ileri/geri kilit) editörde yalnız taslağa yüklenir; Windows Edge / dosya seçici kabulü açık |

### 28 Ekim — Madde 14: canlı TON/TOF/TP ilerleme ve CTU/CTD hedef takibi

**Gerçek eksik:** Native `Ladder.scan` gerçek sayacın `count` bilgisini üretse de `TON/TOF/TP` için geçen süreyi `traces` içine kaydetmiyor; LAD/FBD ortak editör izlemesi yalnız `0/1` ve hedefi gösterilmeyen sayaç değerini yazıyordu. **Hedefli geliştirme:** `dist/ladder-runtime.js` her zamanlayıcı Network'ünün gerçek tarama anındaki `elapsedMs` süresini (süre başlangıcı yoksa `null`, süre dolmuşsa preset ile sınırlı) ekler; `dist/ladder-editor.js` aynı kayıtlı/simüle edilen programın izini `TON 35/100 ms` ve `Sayaç 1/3` biçiminde görüntüler. TOF aktif girişte bekleme, pasif girişte geçen gecikme; TP darbe süresi; CTU/CTD sayım hedefi, çıktı davranışı değişmeden test edildi. Duran/enerjisiz, kaydedilmemiş taslaklarda sahte canlı veri yoktur. `tests/dts-ladder-live-timer-counter-progress.test.cjs` içindeki **8 hedefli V8 regresyon senaryosu PASS**; bağımsız Node çalıştırması **NOT_RUN**, Windows/Edge görseli ve 3D/elektriksel `Simulation.solve` bağımsız kabulü **REVIEW**. **Madde 14 KISMİ**; 08/15/20/23 ve diğer 24 kabul maddeleri ayrı açık kalmaya devam eder.

### 28 Ekim — LAD bobin türü değişikliklerinin FBD ile aynı adres sahipliği kontrolünü kullanması

**Yeni doğrulanmış kusur:** LAD arayüzünde `coil-type` alanı değişince ilk T1/C1 adresi seçildiğinden, T1/C1 başka bir Network tarafından kullanılıyorsa boş T2/C2 var olmasına rağmen LAD programı geçersiz kalıyordu. FBD daha önce boş adres bulacak şekilde düzeltilmişti. `dist/ladder-editor.js` LAD bobin türü değişikliklerini bu **aynı** native Ladder doğrulama yordamına yönlendirir; adres korunabiliyorsa korunur, boş T/C adresi gerekiyorsa seçilir, tümü doluysa taslak değiştirilmeden reddedilir. Kaynak davranışı eski LAD ile yeniden üretildi; `tests/dts-ladder-coil-type-shared-editor.test.cjs` dosyasındaki 7 pozitif/negatif V8 regresyon senaryosu PASS. Uygulama elektriği, 703 katalog, Golden/PASS/HOLD/REVIEW ve Windows/3D kabulünü değiştirmez. Bağımsız Node ile Edge DOM testi bu turda **NOT_RUN/REVIEW**; madde 09/11/23 **KISMİ**.

### 28 Ekim — Madde 18: Kablo kendi terminaline geri bağlandığında kimlik tabanlı teşhis

`dist/wire-diagnostics.js` daha önce bir kablonun iki ucunun aynı terminal olup olmadığını `JSON.stringify(from)===JSON.stringify(to)` ile değerlendiriyordu. Terminal alanlarının sırası veya tanıtıcı ek özellikler farklıysa fiziksel olarak aynı kimliğe dönen bağlantı tespit edilemiyordu. `sameEndpoint` yalnız `c+p` veya `j` kimliğiyle karşılaştırır; gerçek kayıtlara, renk/kesit bilgilerine veya native elektriksel simülatöre dokunmaz. Bilinmeyen pin/bileşen/düğüm uyarıları önceliğini korur. `tests/dts-wire-diagnostics-endpoint-identity.test.cjs` 5 yeni + mevcut 4 toplam **9/9 V8 hedefli regresyon PASS**. Windows/Edge görsel işaretleme, 3D terminal hizalaması ve bağımsız native test **REVIEW/NOT_RUN**; 18. madde KISMİ.

### 28 Ekim — Madde 16/17: seçilen cihaz kimliği, 0 terminal ve kablo kesit edit kapısı

Seçili cihaz kartı modelde zaten bulunan `ref` alanını göstermiyordu; sayısal `0` ID/etiketli katalog terminalleri de `||''` yüzünden boş görünüyordu. Yeni kart gerçek cihaz kimliğini HTML kaçışlı `Cihaz: …` satırında gösterir, 0 terminalini korur. Kablo kesit değiştirici daha önce aynı paneldeki rol ve gerilim girişlerinden farklı olarak `guardEdit()` çağırmadan `snapshot()` oluşturuyordu. Kesit artık salt-okunur örnek, güvenlik ve öğretici kilidinde değiştirilemez. İzin verilen normal düzenlemede renk bazlı kesit yayılımı aynıdır; prob kabloları etkilenmez. `tests/dts-component-wire-guard-and-identity.test.cjs` **7 yeni + 3 mevcut = 10/10 hedefli V8 PASS**. Madde 19'un ortak `portPosition` koordinat bağları kaynakta doğrulandı; **gerçek Windows/Edge 2D/3D piksel ve terminal hizası REVIEW**, bağımsız Node NOT_RUN. 703 katalog ve 1686 ders değişmedi.

### 28 Ekim — Madde 19: ölçeklenmiş malzeme terminali ve kablonun ortak geometrisi

`Symbols.markup` görsel malzeme ölçeğini `0,25–3` aralığına alırken `app.js` kablo ucu, TX11 özel uçları, terminal overlay clip, imleç yerel koordinatı ve pens çene noktasında ham `c.materialScale||1` kullanıyordu. Eski/dışarıdan açılan 4x veya 0,1x ölçekli projelerde SVG malzeme ile kablo uçları ayrışabiliyordu. `Symbols.materialScale/terminalPosition` artık sembol, kablo uçları, 90° döndürme ve özel cihaz overlay koordinatını aynı etkin ölçekle çözer. Dosya/katalog elektriksel uçları ve `Simulation.solve` değiştirilmedi. `tests/dts-material-terminal-scale-consistency.test.cjs` **7/7 V8 hedefli regresyon PASS**. Gerçek Windows/Edge 3D piksel kabulü **REVIEW**; bağımsız Node NOT_RUN; madde 19 KISMİ, Golden/PASS/HOLD ve SC1194 korunur.

### 28 Ekim — Madde 19: malzeme/kablo engel geometrisini ortaklaştırma

Önceki düzeltme terminal konumunu `Symbols.terminalPosition` ile görsel ölçekte sabitlemişti; kablo yönlendirici `componentObstacles()` hâlâ ham `c.materialScale||1` kullandığı için eski projede sınır dışı ölçeklerde kablo cihaz gövdesini yanlış boyutta algılıyordu. Pens metre açık çene göstergesi de ham ölçeği kullanıyordu. Yeni `Symbols.materialBounds` cihazın dört döndürülmüş köşesini aynı sınırlandırılmış ölçekte hesaplar; kablo engeli ve açık çene de bu ortak geometriyi kullanır. `tests/dts-material-obstacle-scale.test.cjs` 5 yeni, güncellenmiş eski geometri testleri 7, toplam **12/12 V8 PASS**. Bağımsız Node.js ve Windows/Edge 2D/3D görsel kabulü **NOT_RUN/REVIEW**; `Simulation.solve`, 703 katalog, 1686 ders, SC1194 ve tüm Golden/PASS/HOLD/REVIEW kilitleri değişmedi. Madde 19 KISMİ.

### 28 Ekim — Madde 17: Kablo ayar panelinde seçili rengin doğru okunması

Kablo durum satırı `w?.color||wireColor` kullanırken kesit/hat/gerilim/renk seçimi `wireColor` kullanıyordu; bu iki renk özellikle kablo yeniden bağlanırken farklı kalabiliyordu. `updateWireStatus()` seçili kablo için aynı `color` anahtarıyla ilgili kesit, rol, gerilim ve aktif renk düğmesini gösterir; boş seçimde palet rengini kullanır. `beginReconnect()` seçili kablonun rengini de eşitler. Mevcut `guardEdit/snapshot`, kablo elektriksel ağı ve 703 katalog korunur. `tests/dts-wire-selected-settings.test.cjs` 5/5 hedefli V8 PASS (farklı palet rengi, boş seçim, ölçüm probu, mutasyonsuz görünüm, yeniden bağlama). Bağımsız Node / Windows Edge ve 3D kabulü NOT_RUN/REVIEW; madde 17 KISMİ.

### 28 Ekim — Madde 16: Seçili algılama sensörünün sanal parametreleri

Bileşen kısa kartı daha önce katalog ad/model/ilk 8 terminali gösterirken sensör hedef ve hareket parametrelerini göstermiyordu. Salt okunur `dist/component-brief.js` artık yalnız `Sensors.supported(d)` ile desteklenen algılama sensörlerinde mevcut `Sensors.settings(c,d)` üzerinden sanal hedef, algılama aralığı, hedef uzaklığı ve otomatik hareket tercihini listeler. Desteklenmeyen cihazlara sahte parametre eklenmez; eski terminal ve HTML kaçış koruması sürer. Test: `dts-component-sensor-parameter-card.test.cjs` 5 yeni + 7 eski hedefli V8 kontrol **12/12 PASS**. Bağımsız Node/Windows Edge ve fiziksel sensör/3D kabulü NOT_RUN/REVIEW; madde 16 KISMİ, 703 katalog, 1686 ders ve `Simulation.solve` değişmedi.

## Paket C — Devre deneyimi (5 madde)

| No | Özellik | Durum |
| --- | --- | --- |
| 16 | Bileşene tıklayınca kısa görev/terminal/parametre kartı | **KISMİ/KOD**: katalog ad/model/kind/gerçek ilk 8 terminal özeti; dinamik parametre öğreticisi ve Edge görsel kabulü açık |
| 17 | Simülasyon durumu ve aktif enerji yollarını daha anlaşılır göster | **KISMİ**: eski DTS enerji yolu göstergeleri mevcut; tutarlı yeni UX ayrı |
| 18 | Yanlış bağlantıyı kaynak/terminal üzerinde açıkla | **KISMİ/KOD**: salt okunur kablo ucu/katalog terminali ve silinmiş bileşen referansı taraması, sorun adıyla rapor; fiziksel kablo davranışı / ekran üstü vurgulama açık |
| 19 | 2D/3D arasında terminal/kablo sürekliliği | **MEVCUT/REVIEW**: eski özellik, Windows piksel kabulü ayrı |
| 20 | PDF/PNG ve malzeme listesiyle proje teslimi | **KISMİ/KOD**: çevrimdışı CSV + 2B SVG devresi için tarayıcıda **Yazdır → PDF olarak kaydet** akışı; doğrudan PDF binary, harici görselli PNG ve pano 3B ile Windows Edge kabulü açık |

### 28 Ekim — Madde 23: FBD kontakları seçili konuma ekleme

**Gerçek açık kusur:** FBD görünümündeki `+ Seri` düğmesi yalnız seri kolun sonuna kontak ekliyordu; bir kontağın **önüne veya iki kontak arasına** doğrudan eklemek mümkün değildi. `dist/fbd-view.js` içindeki özgün `editStructure` artık `add-contact-before` komutuyla belirtilen pozisyondan hemen önce yeni NO kontağı ekler. Açık/boş yol için indeks 0, 12 kontak tavanı, 8 paralel yol, geçerli sanal I/M adresleri ve kaynak programın değiştirilmemesi kuralları korunur; `Ladder.validate` doğrular ve gerçek `Ladder.scan` AND davranışı hedefli test edilmiştir. FBD ekranında her kontak için erişilebilir `+ Önüne` düğmesi bulunur; mevcut `+ Seri`, `− Kontak`, Undo/Redo ve kayıtlı program ayrımı korunur. Yeni 6 senaryo + mevcut 4 FBD test dosyasının kontrolleri V8 PASS; bağımsız Node ve gerçek Windows/Edge UI kabulü **NOT_RUN/REVIEW**. FBD tam serbest blok editörü hâlâ **KISMİ**.

### 28 Ekim — Madde 23: FBD üzerinde gerçek kontak I/Q/M/T/C adresini değiştirme

**Somut eksik:** FBD'de NO/NC, seri/paralel konum ve çıkış bloğu düzenlenmesine rağmen kontağın I/Q/M/T/C operandını seçmek için LAD alt bölümüne dönmek gerekiyordu. `dist/fbd-view.js` her kontakta erişilebilir `Adres` seçicisi gösterir ve `editContactRef` yalnız bağımsız taslak kopyasında `Ladder.validate` kontrolü uygular. Giriş/çıkış adetleri gerçek PLC katalog `inputCount/outputCount` sınırındadır; M1–M32/T1–T16/C1–C16 geçerli aralıktadır; sahte I/Q uçları ve bozuk indeks reddedilir. `dist/ladder-editor.js` FBD seçim değişimini yalnız taslak+Undo/Redo'ya işler ve 300 ms izleme yenilemesi sırasında odak koruması ekler. `dist/studio.css` okunabilir/kullanılabilir alanı sağlar. `tests/dts-fbd-contact-ref-edit.test.cjs` yeni 6 + önceden kabul edilen FBD 25 senaryo **31/31 hedefli V8 PASS**. Bağımsız Node, gerçek Windows/Edge, fiziksel `Simulation.solve` ve 3D kabul **NOT_RUN/REVIEW**; 23. madde **KISMİ**.

### 28 Ekim — Madde 23 FBD dosyalarının çevrimdışı Edge önbellek güncellemesi

FBD kontak operand düzenleme kaynakları yayımlandıktan sonra `dist/index.html`, `dist/fbd-view.js`, `dist/ladder-editor.js`, `dist/studio.css` dosyalarını önceki `rev` parametreleriyle işaretliyordu. Yerel `file:///` Windows/Edge yüklemesinde eski FBD sürümünün kullanılma riskini azaltmak için üç yükleme etiketi yenilendi. Yeni bağımsız test `tests/dts-fbd-offline-asset-order.test.cjs`: FBD/LAD/CSS sürüm etiketleri, runtime→FBD→LAD yükleme sırası ve sunucusuz kalan giriş **3/3 V8 PASS**. Tarayıcı önbelleği ve gerçek Windows Edge görsel kabulü **NOT_RUN/REVIEW**; 23. madde **KISMİ**.

### 28 Ekim — Madde 24: Geçersiz Ladder veya native tarama hatasında sanal I/O güvenli izleme

Sanal PLC operatör paneli daha önce yalnız `!!c.ladderProgram` durumuyla “kayıtlı” kabul ediyor, geçersiz `rungs:[]` programına veya `_dtsLadderError` bulunan sanal tarama hatasına rağmen `_plcRuntime.program==='dts-ladder-v1'` ise eski `0/1` bitlerini **canlı** gösterebiliyordu. `dist/plc-operator.js` şimdi gerçek CPU terminal sayılarıyla aynı `Ladder.validate` denetimini uygular; `dist/ladder-monitor.js` native tarama/validasyon hatasında eski I/O'yu `—` ve doğrulanamayan program durumunu açık metinle gösterir. Sahte PLC modelleri, güç yok ve durdurulmuş simülasyon kilitleri korunur. Başarılı program için canlı I/Q gösterimi değişmez. `tests/dts-plc-operator-validation.test.cjs` yeni 7, güncellenmiş mevcut `tests/dts-plc-operator.test.cjs` 3 senaryoyla **10/10 hedefli V8 PASS**; bağımsız Node.js ve gerçek Windows/Edge UI **NOT_RUN/REVIEW**. 24. madde KISMİ; gerçek fiziksel PLC, Simulation.solve, katalog ve sahneler değişmez.

### 28 Ekim — Madde 21: terminal yerleşimi taslağında asenkron içe aktarmanın son dosya ilkesi

`dist/component-terminal-draft.js` daha önce ilk `.dtscomponent` dosyası okunurken ikinci dosya seçildiğinde iki okumanın da aynı `source` ve `draft` referanslarını taşıması nedeniyle **ilk dosyanın geç biten okumasını kabul edebiliyordu**. Yeni `importSerial` ve saf `importContextMatches` denetimi yalnız son dosyayı kabul eder; modal kapanma/açılma, malzeme değişimi, katalogdan sıfırlama ve X/Y yerleşim düzenlemesi sırasında geç dönen okuma taslağa dokunamaz. `tests/dts-terminal-import-latest-file.test.cjs` yeni 4, mevcut terminal taslağı regresyonlarından 4 toplam **8/8 hedefli V8 PASS**. Taslak yalnız önizlemedir; katalogya kayıt, native devre ve fiziksel 3D pin-kablo hizası **HOLD/REVIEW**. Gerçek Windows/Edge dosya seçimi **NOT_RUN**. Madde 21 **KISMİ**.

### 28 Ekim — Madde 22: Dashboard son seçilen projenin açılması

İki proje kartı kısa aralıklarla seçildiğinde önceki kartın asenkron okuması sonradan sonuçlanıp en son seçimi ezebiliyordu. `dist/dashboard-open-requests.js` güncel istek belirtecini korur; `dist/studio.js` proje kartı için hem `await preserve()` sonrası hem `await store.readEntry/get()` sonrası token, Dashboard ve güvenlik kapısı kontrol eder. Başka proje oluşturma, dosya açma, eve dönme veya yükleme bekleyen isteği iptal eder. `aria-busy` korunarak kart yükleme sürecinde işaretlenir. `tests/dts-dashboard-latest-project-request.test.cjs`: **5/5 V8 hedefli regresyon PASS**. Gerçek Windows/Edge disk/klasör izin denemesi **NOT_RUN/REVIEW**; 22. madde KISMİ. Salt okunur örnekler ve eski dört atölye kilidi korunur.

## Paket D — Gelişmiş üretkenlik (4 madde)

### 28 Ekim — FBD tür değiştirmede boş zamanlayıcı/sayaç adresi seçimi

**Gerçek kusur:** FBD'nin `editCoil` işlevi, farklı bir bloğu TON/TOF/TP veya CTU/CTD'ye dönüştürürken daima ilk `T1/C1` adresini seçiyordu. Bu adres zaten başka bir fonksiyon bloğuna aitse `T2/C2` gibi boş adresler bulunsa bile tür değiştirme yanlışlıkla reddediliyordu. Eski FBD kaynak kodunda iki karşıt örnekle yeniden üretildi. **Onarım:** Yalnız `type` değişikliği sırasında mevcut blok sahibinin adresi korunur veya ilk boş T/C adresi seçilir. Bütün adresler doluysa işlem güvenli biçimde başarısız olur; açık `ref` düzenlemesinde çakışmayı sessizce başka adrese taşıma yapılmaz. Katalog, `Simulation.solve` ve Ladder tarama motoru değiştirilmedi. On hedefli V8 kontrolü PASS; `tests/dts-fbd-free-block-address.test.cjs` içindeki 7 regresyon senaryosu V8 test koşumuyla PASS. Bağımsız Node.js yürütümü **NOT_RUN**, Windows/Edge görsel ve 3D kabulü **REVIEW**, plan maddesi 23 **KISMİ**.



| No | Özellik | Durum |
| --- | --- | --- |
| 21 | Görsel bileşen editörü, terminal koordinatları ve katalogya kontrollü ekleme | **KISMİ/KOD**: gerçek katalogdan salt okunur kopyalanan terminal taslağı, ayrı SVG sürükleme/nümerik koordinat ve `.dtscomponent` taslak indirme; gerçek kataloğa ekleme, Windows/Edge kabulü açık |
| 22 | Hızlı Başla / Hazır Örnek / Öğretici başlangıç akışı | **KISMİ**: dashboard mevcut, yeniden tasarım açık |
| 23 | FBD editörü, Ladder ile işlevsel eşdeğerlik | **KISMİ/KOD**: LAD/FBD arasında aynı native Ladder programını gösteren alternatif AND/OR/NOT blok görünümü; tıklanabilir bloklar mevcut alanları düzenler, bağımsız FBD dosyası/sürükle-bırak ve Edge kabulü açık |
| 24 | Sanal operatör paneli ve canlı PLC I/O ekranı | **KISMİ/KOD**: ayrı açılıp kapanan salt okunur sanal PLC I/O paneli, birden fazla native onaylı PLC seçimi, kaynaklı sinyal durumu; giriş zorlama/cihaz kontrolü yok, Windows/Edge kabulü açık |

## Zorunlu teknik dosyalar ve gerçek teslimat özeti

| Paket | Doğrulanmış `main` commit | Teknik test |
| --- | --- | --- |
| UI 3 modu | `ea96daf90dfb54654879f409ed2ec449f5e3a874` | 18/18 UI davranışı, Windows/Edge REVIEW |
| Ladder sanal çekirdek | `82c84733fabcf28da61318e84bf6514e643a86d1` | 20/20 izole mantık/PLC program testi |
| Görsel Ladder editörü | `64bc88b83574410acf48d47b0dfe843c247a46e5` | 6/6 UI source/helper kontrolü, Windows/Edge REVIEW |
| Katalog modeli doğrulaması | `14d56cc36339501f2a73e9eee783754e75f6c7a4` | 703 gerçek katalog 7/7 native, 8/8 ek donanım gate kontrolü |
| Native regresyon dosyaları | `db18e5fe9ca268d841bbf0d34163f1ae592beb46` | `tests/dts-ladder-native-703.test.cjs` ve UI smoke; CI/Actions kullanılmadı |

**Elektriksel gerçek:** Yük kablosu veya çıkış bankı koparsa PLC'nin sanal mantıksal çıkışı doğru biçimde Q1=1 kalabilir, buna rağmen yük **enerjilenmemelidir**; simülasyonda bu ayrım kanıtlandı. Kanıtsız diğer PLC modellerinin Ladder çalıştırması korumalı; yalnız doğrulanmış 703 katalog modeli seçilebilir. Bu bir eğitim simülasyonudur; gerçek Siemens PLC donanımına program göndermez.

## Kalanların gece güvenli öncelik sırası

1. Önce yeni Ladder kaynaklarının güncel GH HEAD ve blob SHA'sını teyit et, tüm eski 1686 dersi yeniden tarama.
2. `tests/dts-ladder-native-703.test.cjs`, `tests/dts-ladder-editor-smoke.test.cjs`, `tests/workspace-modes-ui.test.cjs` ve uygun eski PLC testlerinden yalnız hedefli olanları gerçek Node ile doğrula. **NOT_RUN = PASS değil.**
3. Karşıt Timer/counter kenarı, PLC besleme kesme, sanal I/O model sınırları ve Ladder canlı izleme; kusur varsa küçük gerçek kaynak onarımı.
4. Ardından 06, 08, 14, 15, 16 gibi yüksek değerli UX maddeleri; modal, kaydetme/undo, kullanıcı sayfa düzeni ve güvenilir çalışma alanı.
5. Windows/Edge `file:///` ile gerçek tam ekran/panel dönüşü ve Ladder modalının görsel kabulü yalnız gerçekten çalıştırıldıysa PASS.
6. Sadece kanıtlı gerçek değişiklik `[skip ci]` ile `main`, uzak HEAD/blob SHA doğrula. `BASLAT.bat`, 3D ölçek, Golden, PASS/HOLD/REVIEW, 703 katalog ve bağımsız COMPLETE kilitleri korunur.

**Önceki 1686 ders ilerleme sayacı ile bu 24 maddelik ürün planını birleştirme.** Yeni plan maddesi tamamlandığında burada ilgili test/commit ve kabul seviyesi açıkça güncellenecek.

## 28 Ekim — Ladder görsel ağ editörü (görsel referanslar)

Kullanıcının gönderdiği üç LAD örneğinin soyut ilkeleri kullanılarak (görseller/Siemens kaynakları depoya kopyalanmadan) özgün DTS şeması geliştirildi: beyaz 20 px grid, L1/L2 rayları, network/rung numarası, yatay NO/NC sembolleri, paralel yollar, Q bobini, TON/TOF/TP/CTU/CTD fonksiyon blokları; simülasyon yürürken yalnız doğrulanmış, kaydedilmiş program ve gerçek hafıza bitleri üzerinden yeşil tam yol gösterimi. SVG görseli gerçek rung yapısından üretilir, düzenleme alanları ve undo/redo korunur. **Durum:** Madde 09 görsel yaklaşım KISMİ/KOD; Windows Edge görsel ve erişilebilir düzenleme kabulü REVIEW. 

### 28 Ekim — tıklanabilir rung + sanal PLC I/O paneli

Yeni SVG kontak ve bobin sembolleri klavye (Enter/Space) ve fare ile kendi düzenleme alanına odaklanır. Ladder penceresi içinde gerçek sanal CPU DI/DO durumunu sadece **kayıtlı program eşleşiyorsa ve simülasyon çalışıyorsa** gösteren, yazı/renk destekli I/O izleme paneli bulunur. Etkin olmayan veya farklı taslakta değerler `—` gösterilir; `Q` mantıksal çıkışı bir yükün gerçekten enerjilendiği anlamına gelmez. Düzenlemeler simülasyon sırasında kaydedilmez, simülasyon başlat/durdur düğmesi mevcut DTS `simulateBtn` yolunu kullanır. **Durum:** madde 09, 14, 24 üzerinde KISMİ ilerleme; Windows/Edge/3D kabul REVIEW.

**Hedefli çalıştırma-kapısı onarımı:** Ladder modalindeki Simüle et düğmesinin önceki kodunda `live` değişkeni yalnız `running=true` iken doğru olduğundan kaydedilmiş programdan simülasyon başlatılamıyordu. Ayrı `canStartLadder` kapısı, kayıtlı program eşleşmesi ve mevcut `#simulateBtn.disabled` durumu üzerinden bu sorunu düzeltiyor. Boş taslak/kayıtsız değişiklik/PLC kilidi negatif kontrolleri korunur. Windows Edge kabulü açık.

### Network açıklaması ve görsel rung başlıkları

Her Ladder ağında isteğe bağlı 100 karakterlik açıklama desteklenir; proje nesnesiyle birlikte kaydedilir, Ctrl+Z/ileri al ile geri alınabilir, SVG üstünde Network başlığının yanında güvenli kaçışla gösterilir. Açıklama mantık hesabının operandı değildir, 100 karakter üstü veya metin dışı içeriği doğrulama kapısı reddeder. **KOD + hedefli mantık testi; gerçek Windows/Edge görsel kabulü REVIEW.**

### 28 Ekim — Ladder modalı simülasyon başlatma düğmesinin 300 ms güncelleme kusuru

**Somut kusur:** İlk çizimde kayıtlı Ladder için etkin görünen `Simüle et`, 300 ms izleme yenilemesinde `liveSaved` (yalnız çalışan simülasyonda true) ile denetlendiği için simülasyon kapalıyken yanlışlıkla devre dışı kalıyordu. `dist/ladder-editor.js` zamanlayıcı yolunda mevcut `canStartLadder` kapısı tekrar kullanıldı; kaydedilmemiş taslak, devre kilidi, başka program ve devre dışı native simülasyon için negatif kapılar korunur. `tests/dts-ladder-editor-smoke.test.cjs` dosyasına iki hedefli pozitif/negatif test eklendi. **Bu turda V8 üzerinde gerçek kaynakla 8/8 izole JS testi PASS; Node/Windows Edge görsel ve native entegrasyon bu turda NOT_RUN/REVIEW.** 09/13/14 numaralı maddeler hâlâ KISMİ; bağımsız COMPLETE verilmedi.

### 28 Ekim — tarama anı sinyali ve enerjisiz PLC izlemesi

**Somut kusur:** Önceki rung Q1 kontağını okurken Q1=0 olmasına rağmen, daha sonraki rung Q1'i 1 yapınca SVG önceki yolu yanlış yeşil gösterebiliyordu. TON/RESET giriş etkinliği ile gerçek bobin/blok çıkışı da ayrıştırılmamıştı. CPU beslemesi yokken sanal Ladder taraması iz ve bellek oluşturabiliyordu.

**Onarım:** `ladder-runtime.js` her network için gerçek tarama anı `pathStates` izini üretir. `ladder-editor.js` yalnız kaydedilmiş programın izini gösterir; `ladder-diagram.js` gerçek giriş yolunu ve çıkış durumunu ayrı renklendirir. `plc-runtime.js` enerjisiz CPU'da taramayı durdurup bellek/izleri temizler; `ladder-monitor.js` I/O durumunu gizler. Fiziksel çıkış bankı beslemesi ile CPU mantık çıkışı ayrımı korunur.

**Kanıt:** Yeni `tests/dts-ladder-trace-power-regression.test.cjs` dosyası 7 hedefli vaka içerir; aynı 7 vaka değiştirilmiş gerçek kaynakla V8'de çalıştırıldı. **Node.js dosya çalıştırması ve Windows/Edge/3D kabulü NOT_RUN/REVIEW.** Maddeler 11/13/14/17/24 hâlâ KISMİ; Golden/HOLD/1686 ders etkilenmedi.

### 28 Ekim — Asenkron Ladder dosyası içe aktarma kimlik kapısı

**Somut kusur:** `File.text()` beklenirken Ladder penceresinde PLC değiştirildiğinde geç gelen dosya sonucu yeni PLC'nin taslağına yazılabiliyordu. **Onarım:** İçe aktarma başındaki PLC nesnesi, proje nesnesi ve terminal sınırı sabitlenir; dosya okunduktan sonra hâlâ aynı PLC ve aynı açık pencere değilse hiçbir program değiştirilmez ve anlaşılır iptal mesajı gösterilir. İçe aktarma zaten kaydedilmiş programa doğrudan müdahale etmez. `tests/dts-ladder-import-context.test.cjs` eklendi. Yalnız hedefli V8 JS davranış testi; Node/Windows görsel kabulü REVIEW.

### 28 Ekim — Çevrimdışı CSV malzeme listesi

Şema `project.components` ve gerçek katalog `byId` alanları kullanılarak malzemeler tür kimliğine göre sayılır, katalog model/marka ve varsa referanslar kaydedilir. Fiyat, fiziksel uygunluk ve çalışır devre iddiası üretilmez. CSV'de formül hücresi enjeksiyonuna karşı güvenli metin kaçışı kullanılır. `dist/material-list.js` ve hedefli testleri eklendi. PDF/PNG ayrı açık; Windows/Edge görsel ve gerçek indirme testi REVIEW.

### 28 Ekim — Kaynak temelli bağlantı denetimi

`dist/wire-diagnostics.js` gerçek şemadaki kabloların `from/to` uçlarını `project.components`, `junctions`, `byId` katalog terminal kimlikleriyle karşılaştırır. Silinmiş bileşen, olmayan terminal/düğüm, eksik uç, aynı uç bağlantısı gibi doğrulanabilir referans sorunlarını gösterir. **Kabloları veya simülasyonu otomatik değiştirmez.** Sonuçta sorun yoksa yalnız kimliklerin tanındığını söyler; güvenli/devre çalışır/elektriksel doğru iddiası vermez. Madde 18 KISMİ; terminal vurgusu, Windows Edge ve fiziksel kabul ayrı.

### 28 Ekim — Kablo teşhisinden çizimdeki kabloya görsel yönlendirme

18 numaralı bağlantı denetimi geliştirildi: gerçek `data-wire` SVG kimliği üzerinden ilgili kablo, çizimde geçici turuncu kesik çizgili vurguyla işaretlenir. Sonuç listesindeki kablo kimliği düğmesine tıklamak yalnız o kabloyu vurgular; eşleşen çizim düğümü yoksa yanlış başarı bildirmez. `wire-diagnostics.js` salt okunur DOM sınıfı değiştirir, model, gerçek tel rengi, bağlantı veya native `Simulation.solve` durumuna dokunmaz. Tanınan uçlar elektriksel doğruluk veya güvenlik kabulü değildir. Hedefli pozitif/negatif V8 mantık kontrolleri; Windows/Edge görsel kabulü **REVIEW**.

### 28 Ekim — bağımsız sanal PLC operatör paneli (24)

DTS üst barına `▣ PLC I/O` eklendi. Pencere editörden bağımsız açılır/kapanır; yalnız `ladder-runtime.supportedPLC` kapısından geçmiş gerçek katalog cihazları listeler. Giriş/çıkışlar `ladder-monitor.snapshot` ve orijinal `_plcRuntime` durumuyla canlı, simülasyon kapalı/CPU enerjisiz/yanlış Ladder modunda bilinmiyor olarak gösterilir. Panel PLC girişlerini zorlamaz, gerçek donanım ile iletişim kurmaz. Dashboard'a geçerken kapanır; yalnız açıkken 350 ms günceller. **KOD / hedefli izole test; Windows/Edge görsel REVIEW.**

### 28 Ekim — dört özgün testli Ladder hazır örneği

`dist/ladder-examples.js` kaynak kodunda dört özgün derslik V1 programı bulunur: I1/I2 Start–Stop mühürleme; I1→TON T1 1500ms→Q1; CTU C1 üç darbe, I2 RESET C1, Q1; I1/I3 ileri-geri Q1/Q2 sanal karşılıklı kilitleme, I2 durdurma. `Ladder.validate` giriş/çıkış sayısına göre örnek seçimini kısıtlar. `dist/ladder-editor.js` örnek düğmesi yalnız aktif PLC taslağını değiştirir; kalıcı değişiklik için mevcut proje kilitlerini kullanan Kaydet gerekir. Bu kod gerçek Siemens LOGO binary/.lsc örneklerinden türetilmiş bir aktarım değildir. **Bu turdaki JS izole native tarama pozitif/negatif kontrolleri** raporlandı; Windows/Edge ve bağımsız gerçek elektriksel kabul ayrıca REVIEW.

### 28 Ekim — TP (darbe zamanlayıcı) erken yeniden tetikleme onarımı

**Somut kusur:** `dist/ladder-runtime.js` içindeki sanal TP zamanlayıcısı, 100 ms darbe sürerken giriş 10 ms'de bırakılıp 20 ms'de tekrar yükseldiğinde `pulseStart` değerini 20 ms'ye taşıyarak darbenin süresini istemeden uzatıyordu. Bu, özgün DTS V1'deki IEC benzeri TP tek darbe beklentisine aykırıydı.

**Onarım:** Yeni yükselen kenar yalnız önceki TP darbesi bitmişse yeni darbe başlatır; giriş darbe sırasında bırakılıp tekrar verilirse süre uzamaz. Süre sonunda giriş hâlâ yüksekse kendiliğinden yeni darbe oluşmaz; yeni yükselen kenar gerekir. Sanal saat geriye dönerse gelecekteki başlangıç belleği temizlenir. TON, TOF, CTU, CTD, PLC katalog modeli ve fiziksel çıkış eşlemesi değiştirilmedi.

**Kanıt:** Kaynaktaki hata önce gerçek Node 22 testinde yeniden üretildi (**1 FAIL, 2 PASS**); onarımdan sonra yeni `tests/dts-ladder-tp-nonretrigger.test.cjs` **5/5 PASS**, daha önce var olan `dts-ladder-ctd-regression.test.cjs` **4/4 PASS** ve `dts-ladder-output-safety.test.cjs` **4/4 PASS**, toplam **13/13 hedefli Node testi PASS**. Gerçek Windows/Edge görsel ve tüm `Simulation.solve` entegrasyonu bu turda **NOT_RUN/REVIEW**; madde **11 KISMİ**, 24 maddelik tam kabul veya 1686 ders COMPLETE sayacı değişmedi.

### 28 Ekim — Gerçek tarama verisine bağlı FBD blok görünümü

`dist/fbd-view.js` yalnız Ladder V1 rung'larını alternatif AND/OR ve ters kontak (NOT) blokları olarak gösterir. Tıklanan kontak ve bobin mevcut Ladder editöründeki ilgili alana yönlendirilir. Yeşil durumlar `pathStates` ve `coilValue` tarama izinden gelir; yeni bir hesaplama/sahte elektrik modeli oluşturulmaz. Geliştirme **KISMİ**; Windows/Edge ve serbest FBD düzenleme kabulü açık.


### 28 Ekim — 2B SVG devresi için çevrimdışı PDF Yazdır akışı

`dist/project-print.js` mevcut `#workspace` SVG'yi ve `#scene.getBBox()` çizim sınırını kullanarak yalnız yazdırma amaçlı kopya oluşturur; gerçek projedeki kamera ve simülasyon değişmez. `PDF / Yazdır` düğmesi tarayıcı yazdırma arayüzünü açar; PDF dosyasını kullanıcı `PDF olarak kaydet` seçimiyle oluşturur. Kaynak SVG'nin boyutu/koordinatı doğrulanır, ekran taşıma/yakınlaştırma çıktıda kaldırılır. Kopya görünümü A4 yatay kağıda sığdırılır. **Doğrudan PDF dosyası üretme, otomatik dosyaya kaydetme veya pano 3B desteği iddia edilmez.** PNG ayrı açıktır. Hedefli izole JS testleri eklenmiştir; gerçek Edge `file:///` yazdırma kabulü REVIEW. Ders/GOLDEN/703 katalog değiştirilmedi.

### 28 Ekim — Güvenli 2B PNG dışa aktarma (kısıtlı destek)

`dist/project-png.js` mevcut SVG devre sahnesini, kaynak nesnesini değiştirmeden `getComputedStyle` ile bağımsız kopyalar; ekran kamera pan/zoom'unu kaldırır ve geçerli çizim sınırından beyaz zeminli PNG üretir. Yalnız **harici dosya görselleri olmayan**, SVG içinde gömülü kaynaklarla çizilebilen devrelerde desteklenir. Cihaz fotoğrafı `<image href="assets/...">`, `foreignObject`, başka belgeye giden `use` içeren şemalar PNG için **açık hata** verir; çıktı kaydedildi diye sahte başarı yazılmaz. 24 megapiksel/10.000 px sınırı vardır; Canvas/CORS/tainted sorunlarında hata durumuna düşer. Kaynak SVG, kamera, fiziksel terminaller, `Simulation.solve` değişmez. **Gerçek Windows/Edge `file:///` PNG indirme görsel kabulü REVIEW; bütün katalog görsellerinin PNG'ye aktarımı TAMAM değil.** 20. madde kısmi.

**PNG indirme güvenliği ek onarım:** PNG için oluşturulan Blob URL, indirme `a.click()` çağrısıyla aynı işleme yığınında iptal edilmiyor; Edge/Chromium indirmeyi başlatabilsin diye 1,2 saniyelik temizleme uygulanır. SVG geçici URL'si çizim tamamlanınca hemen temizlenir. Hedefli başarılı indirme/temizlik regresyonu eklendi; Windows Edge `file:///` kabulü açık.

### 28 Ekim — Madde 23, doğrudan ve güvenli FBD kontak düzenleme

**Somut açık iş:** FBD AND/OR/NOT görünümünde mevcut kontaklar tıklanınca yalnız LAD alanına odaklanıyor, FBD içinden NO↔NC yapılamıyordu. **Onarım:** `dist/fbd-view.js` her kontağa ayrı klavye erişilebilir **NO → NC / NC → NO** düğmesi ekler. `toggleContact` kaynak Ladder taslağını **kopyalayıp** günceller; pozisyon biçimini, mevcut kontak ve gerçek PLC I/O sınırlarını `Ladder.validate` ile denetler. `ladder-editor.js` yalnız aktif FBD görünümünde sonucu taslak geçmişine ekler; kayıtlı program, `Simulation.solve`, bobinler ve kablolar tıklama ile değişmez. `tests/dts-fbd-view.test.cjs` pozitif-negatif ve gerçek `Ladder.scan` eşdeğerliği testleriyle genişletildi. **Durum:** FBD düzenleme KISMİ/KOD; tam serbest blok düzenleyici, dışa aktarma ve Windows/Edge görsel kabulü REVIEW.

### 28 Ekim — FBD çıkış bloğunun doğrudan düzenlenmesi (NO/NC işi tekrarlanmadı)

**Somut kusur:** FBD görünümünde kontak NO/NC artık düzenlenebilse de çıkış bobininin `OUT/SET/RESET` ve `TON/TOF/TP/CTU/CTD` türü, adresi ve süre/hedefi yalnız LAD alt kontrolünde değiştirilebiliyordu. **Onarım:** FBD bloğuna kendi erişilebilir tür/adres/süre/hedef kontrolleri eklendi; `FBDView.editCoil` seçili network'ün tek coil nesnesini ayrı taslak kopyasında oluşturur, giriş/çıkış PLC sınırlarını `Ladder.validate` ile kontrol eder; başarısız değişikliği reddeder. Tür değişiminde geçersiz adres güvenli uygun adrese döner; kaydedilmiş program, devre, kablolar ve native solver doğrudan değişmez. Değişiklik sadece Ladder editörü taslak geçmişine eklenir; LAD ve FBD aynı V1 `Ladder.scan` semantiğini kullanır. Simülasyon göstergesi yenilenirken odaktaki FBD düzenleme kontrolü koparılmaz. **KOD + izole pozitif/negatif JS testleri**; gerçek Windows/Edge `file:///` görsel kabulü REVIEW. FBD serbest mantık blok şeması ve bağımsız COMPLETE hâlâ açık.

### 28 Ekim — LAD/FBD ortak coil adres listesi

**Somut eşdeğerlik kusuru:** FBD blok düzenleyicisi, runtime tarafından doğrulanan `RESET T1/C1` ve yüksek `M/T/C` adreslerini kabul ederken LAD adres seçicisi yalnız ilk dört T/C veya sadece Q/M listesine bakıyordu. Dolayısıyla geçerli FBD taslağı LAD'de farklı/boş adres gibi görünebiliyordu. **Onarım:** LAD seçicisi `FBDView.refsFor(type,limits())` ile aynı geçerli adres aralığını kullanır ve gerçek katalog Q terminal etiketini korur. Hatalı/fazla fiziksel Q adresleri hâlâ yasaktır. `tests/dts-lad-fbd-coil-address-parity.test.cjs` eklendi. 24 madde 23 yine **KISMİ**; gerçek Windows/Edge ve genel FBD grafik editör kabulü açık.

### 28 Ekim — FBD seri/paralel yol bağlantı düzenleme (23)

**Gerçek açık kusur:** FBD'de NO/NC ve çıkış blokları değiştirilebildiği halde FBD üzerinden seri kontak/paralel yol ekleme-silme yoktu. `dist/fbd-view.js` artık her yolda + Seri, + Paralel, Yolu sil ve çok kontaklı yolda − Kontak düğmeleri üretir. `editStructure` kaynak Ladder V1 programını değiştirmez: bağımsız taslak kopyası oluşturur, indeks/12 kontak/8 yol/son yol/son kontak/PLC native adres sınırlarını `Ladder.validate` ile kontrol eder. `dist/ladder-editor.js` değişikliği yalnız FBD açıkken taslak undo/redo geçmişine kaydeder; gerçek `Ladder.scan` ile AND/OR davranışı doğrulanır. Kaydedilmiş PLC, 703 katalog, gerçek devre, Golden, diğer PASS/HOLD ve dersler değişmez. `tests/dts-fbd-structure-edit.test.cjs` hedefli regresyonları eklenmiştir. Windows Edge `file:///` görsel kabulü REVIEW; FBD özgür grafik akış editörü hâlâ KISMİ.

### 28 Ekim — Kullanıcının talebi: okunaklı siyah butonlar + bağımsız TIA benzeri LAD Network'leri

Ana üst kontrol ve Ladder/PLC panel butonlarında **siyah yazı ve açık kontrastlı arka plan** uygulandı. Ladder editörü her rung'u ayrı daraltılabilir Network penceresi olarak sunar; **Tek pencere** odak tuşuyla yalnız seçili Network büyütülebilir, **Tüm Networkleri göster** ile geri dönülür. Network başına görsel SVG ve mevcut select düzenlemesi saklanır. Üstte **NO, NC, OUT, SET, RESET, TON, TOF, TP, CTU, CTD** komut paleti yer alır; HTML5 sürükle-bırak veya palet öğesini seçip Network/seri kontak/sonuç alanına tıklama ile yalnız **taslak** program güncellenir. Undo/Redo, gerçek pin sınırları ve simülasyon çalışırken düzenleme kilidi korunur. `dist/ladder-toolbox.js` saf doğrulamalı değişiklik motorudur. Siemens kodu/UI varlıkları kopyalanmadı. **Uygulama kodu/testleri teslim, gerçek Windows Edge file:/// sürükle-bırak ve görsel kabulü REVIEW.**

**Öğe üzerinde hassas bırakma:** SVG'nin gerçek kontak sembolleri `data-drop-kind=contact`, `r/p/i` ve bobin/timer/sayaç sembolleri `data-drop-kind=coil` alanlarına sahip. Araç paletinden doğrudan sembol üzerine sürüklenince o Network ve o konum düzenlenir. Paletten seçip sembole tıklama da aynı yolu kullanır; palet seçili değilken eski operandla düzenleme davranışı korunur. Sadece taslak/Undo geçmişi değişir. Edge fare testi REVIEW.

### 28 Ekim — Madde 21 güvenli terminal yerleşim taslağı

Seçili bileşenin gerçek `w/h/pins[id,label,x,y,side]` katalog verileri salt okunur şekilde **bağımsız taslağa** kopyalanır. `dist/component-terminal-draft.js` ile taslak terminalleri ayrı SVG'de fareyle veya X/Y sayısal alanlarında ayarlanabilir. `dts-terminal-draft` sürümlü JSON `.dtscomponent` indirilir. **Katalogya ekleme/elektriksel simülasyona bağlama/3B fiziksel konum değiştirme YOK**; kaynak `byId`, proje, kablolar ve native `Simulation.solve` asla değiştirilmez. Geçersiz ölçüler/koordinatlar, yinelenen uç kimlikleri engellenir. Bu, ürün maddesi 21'in yalnız güvenli taslak önizleme aşamasıdır; Windows Edge file:/// sürükle-bırak/indirme görsel kabulü ve gerçek katalog entegrasyonu **REVIEW/HOLD**.

### 28 Ekim 2026 — madde 21 kontrollü terminal taslak içe aktarımı ve ayrı kabul kapıları

- `dist/component-terminal-draft.js`: sürümlü `.dtscomponent` dosyası **en çok 128 KiB** ile okunur, JSON ve V1 şeması doğrulanır. `sourceId`, katalog adı, orijinal `w/h`, terminal sayısı ve **bütün terminal ID/etiket/kenar** alanları tam eşleşmedikçe aktarım reddedilir. Tek izin verilen fark katalog sınırları içindeki **X/Y önizleme koordinatıdır**. Dosyadan gelen davranış/özel metadata alanları kullanılmaz. Sonuç özgün katalog verisinden yeni taslak nesne olarak kopyalanır.
- Görsel editörde içe aktarma dosyası seçimi ve asenkron yarış koruması (farklı PLC/bileşen, değişen taslak, kapanmış pencere) eklendi. Dosya yalnız mevcut taslak önizlemeyi değiştirir. Canlı `byId` katalog, proje dosyası, kablolar, terminal id, 3B ve `Simulation.solve` **değişmez**.
- `acceptance` sonucunda **dosya/kimlik/önizleme PASS**, **değişen geometri REVIEW**, **katalog ekleme HOLD**, **3B fiziksel uyum HOLD**, **native simülasyon HOLD** ayrı durumdur. Fiziksel delil ve bağımsız 3B/native kabulü yokken katalogya ekle/dışarıdan yüklenmiş davranışı çalıştır düğmesi yok.
- `tests/dts-component-terminal-import.test.cjs` negatif/pozitif doğrulama. **16/16 eski editör QA tekrarlanmadı**. Gerçek Windows Edge `file:///...` dosya seçici ve 3B kabulü NOT_RUN/REVIEW. Madde 21 KISMİ, COMPLETE değil.
