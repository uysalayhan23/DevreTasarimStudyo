# DTS — Ders Geliştirme Arşivi ve Yeniden Başlama Rehberi

> **Referans tarihi:** 27 Ekim 2026. **Repo:** `uysalayhan23/DevreTasarimStudyo`, **dal:** `main`. **Son teknik onarım referansı:** `7851829be045444da7a4f46f722b3576055f9f40` (SC453). Bu SHA canlı HEAD'in sonsuza kadar sabit kalacağı anlamına gelmez. Her işlemde güncel uzak `main` yeniden okunur.

## Bu dosyanın amacı ve ilk okuma kuralı

Bu belge, yoğun ders onarım döneminin kapanış durumunu, elde edilen kanıtları ve ileride derslere güvenle geri dönüş yöntemini saklar. **Gelecekte bir kullanıcı DTS'nin herhangi bir dersini değiştirmemi isterse önce bu dosyayı, ardından `AGENTS.md`, `LESSON_PROGRESS.json`, `LESSON_EVIDENCE.jsonl`, `ACCEPTANCE_PROTOCOL.md` ve ilgili gerçek kaynakları okumalıyım.** Eski sohbetlerden körlemesine onarım başlatmayacağım.

27 Ekim itibarıyla kullanıcının yeni ana önceliği **uygulamanın arayüzünü, görünümünü ve kullanım kolaylığını iyileştirmektir**. Kullanıcı yeniden açıkça istemedikçe geniş ders onarım taramasına dönme; bu kaydı koru. Görsel/arayüz değişikliklerinde Golden, motor, PLC, simülasyon, ders ve kabul kilitlerini koru.

## Sabit kararlar

- **Çalışma yöntemi:** tespit et → gerçek kaynakta onar → özgün simülatörde pozitif/negatif test et → yalnız kanıtlı sonucu teslim et. Sadece raporlama onarım değildir.
- **GitHub:** Normal ChatGPT + GitHub, doğrudan `main`, `[skip ci]`, force-push yok, GitHub Actions yok, Work/Codex yok, geçici dal yok. Gerçek HEAD ve uzak blob SHA doğrulanmadan "teslim edildi" yazma.
- **Paket:** Bağımsız, güvenli işler için 20/50 veya daha fazla ders; yalnız PASS olanlar gönderilir. Tek tek onay istenmez. Eski toplu QA gereksiz yere tekrarlanmaz.
- **Bütün zorunlu kabul kapıları ayrı:** hedefli teknik native PASS ≠ pedagojik kabul ≠ Windows/Edge ≠ 3D terminal/kablo görsel kabulü ≠ fiziksel/donanım kabulü ≠ bağımsız COMPLETE. **NOT_RUN asla PASS değildir.**
- **Sahte devre / sahte test yok:** Başlığa uymayan genel motor/lamba/sensör şablonu doğrulanmış kablolu deney gibi sunulamaz. Eksik katalog ve fiziksel model REVIEW/HOLD kalır. Test sonucunu sabitleme veya beklenen sonucu sağlayacak biçimde gevşetme yok.
- **Tasarım ve kullanım:** `BASLAT.bat` → `file:///.../dist/index.html` Edge çalışması, çevrimdışı kullanım, hazır örneklerin salt okunur olması, mevcut canlı simülasyon, ön görünüm/3D ölçek ve gerçek terminaller korunur. Kullanıcı hazır olmadan tekrar tekrar PowerShell testleri isteme.
- **Pedagoji:** Samimi, sade, kısa, hikâye gibi; "ne işe yarar, neden bağlanır, çalışınca ne olur, bağlantı koparsa ne olur?" sorularını karşılar. Fiziksel güvenlik hakkında doğrulanmamış iddia yok.

## Kapsam ve sayaçlar

| Alan | Kayıt |
| --- | --- |
| Ders havuzu | **1686 benzersiz ders** |
| Tarihsel bildirilen sıralı ilerleme | **77/1686** |
| Bağımsız bütün kabul kapılarını geçtiği kanıtlanmış COMPLETE | **0/1686** |
| Eski tam QA raporu (25 Ekim) | **2082 test = 1822 PASS + 260 FAIL** |
| ZIP'de `.git` yokluğu | Eski üç integrity testinin gerçek kaynak kusuru sayılmaması kararı |
| Gerçek katalog | **703 tanım** |
| Uygulama | Windows/Edge, `BASLAT.bat`, yerel sunucusuz çevrimdışı kullanım |

Sayaçlar yalnızca ilgili gerçek kabul manifestoları ve kanıtlar karşılaştırılarak güncellenir. Bir commitin başlığında "Repair" yazması bağımsız COMPLETE kanıtı değildir.

## Son teknik onarım serisi — geçerli geçmiş

Başlangıç noktasında `d05afa074e4f710204e14b5acdce1b03eb83a9bb` (SC1166, SC1183–1185, SC1193, SC1195) vardı. 27 Ekimde canlı ana dal bu noktadan sonra **20 commit ileri**, geri alınmış commit bulunmadan `3c56b2853d0b8a914999e1047ea64bbd430f11f6` olmuştu. Ardından bu sohbet sırasında aşağıdaki SC453 commit'i gönderildi.

### Daha önce teslim edildiği bildirilen hedefli native PASS kilitleri

- SC988–990: 51/51 hedefli senaryo; SC992 9/9; SC993 9/9; SC995 23/23; SC996 28/28.
- SC999–1002 önceki gerçek onarımlar; SC1016 V20 BOP 9/9; SC1017 V20 Cn003 12/12; SC1018–1021 PASS.
- SC1048, SC1053 ve SC1077–1078 önceki PASS.
- SC1166 **10/10**; SC1183 **8/8**; SC1184 **9/9**; SC1185 **11/11**; SC1193 **9/9**; SC1195 **8/8**. Bu altı dersin daha önce GitHub'a gönderilip uzak SHA kontrolünün yapıldığı bildirilmiştir.
- SC991, SC994, SC997–998, SC1003–1015 gerçek quiz/kavram kapsamındadır; keyfi olarak kablolu derse çevrilmez.

### `d05afa...` sonrası canlı geçmişte gözlenen 20 commit

Commit mesajından ve GitHub karşılaştırmasından gelen kapsam kayıtlarıdır; burada ayrıca Windows/3D ya da bütün derslerin bağımsız kabulü iddia edilmez.

| Commit kısaltması | Kapsam |
| --- | --- |
| `5bc4283a` | SC1196–1225 başlığa uygun sensör quiz'leri |
| `2f81a370` | SC1226–1255 elektrik temelleri konu kontrolleri |
| `514b1612` | SC1256–1305 konuya uygun kavramsal dersler |
| `2ae05d8b` | SC1306–1355 quiz dersleri |
| `9ceab33e` | SC1356–1405; SC1397 REVIEW korundu |
| `ebb22388` | SC1406–1455, 50 kavramsal quiz |
| `4078cbed` | SC1456–1505 başlık uyumlu quiz'ler |
| `7be23f75` | SC1506–1555 kavramsal kontrol |
| `e07a6a58` | SC1556–1605 kavramsal kontrol |
| `0ad24002` | SC1606–1655: 43 quiz, 7 fiziksel ön kontrol |
| `f2abefa4` | SC1656–1686, 31 kavramsal quiz |
| `c958f9da` | Gerçek fiziksel modeli doğrulanmamış 49 ders için yanlış kablolu gösterim koruması |
| `c42967fa` | Sensör/PLC alanında 24 uyumsuz şablonu concept-only koruması |
| `94ab7677` | SC835–838 motor jog/mühürleme/seçici/iki istasyon |
| `89e1d113` | SC379/380/727/964–966/968, hedefli 7 kablolu ders |
| `191426cf` | SC833/834/969/970, motor kontrolleri |
| `5ec75ffd` | SC445/446/448/454 NTC/PTC/PT100/Hall |
| `318adf74` | SC447/463 termokupl/yük hücresi |
| `79a2b12c` | SC597 encoder A/B/Z ve SC827 NO/NC ohmmetre |
| `3c56b285` | SC439 NTC, SC450/464 Hall/optik sensör |

**Bu sohbetin ayrıca teslim ettiği yeni teknik commit:**

- **SC453**, gerçek ders kimliği `sensor-analog-apps-outline-038` ("25. TEMRİN Reed Röle / Dil Kontak Uygulaması").
- **Kaynak kusuru:** Gerçek Reed NO/NC şeması yerine alakasız `proximity` PNP sensörlü üç bileşenli genel şablon.
- **Onarım:** Gerçek 703 katalogdaki `reed-no` (13/14), `reed-nc` (21/22), iki gösterge ve sanal DC kaynak. 5 bileşen + 6 kablo; güncellenen birebir öğretici adımlar, sade açıklama ve konu quiz'i. İki sanal mıknatıs birbirinden bağımsızdır.
- **Native test:** Özgün `CCSSimulation.solve` ile uzak/yakın/uzak ve 6 kopuk kablo; **9/9 PASS**, tüm katalog pinleri doğru.
- **Durum:** Hedefli native PASS; fakat gerçek manyetik alan/mesafe kalibrasyonu, üretici NC donanım doğrulaması, Windows/3D, fiziksel ve bağımsız pedagojik kabul açık. **REVIEW, COMPLETE değil.**
- **GitHub commit:** `7851829be045444da7a4f46f722b3576055f9f40`.
- **Değişen dosya:** `dist/tutorial-practice-guide-batch-n.js`.
- **Uzak blob SHA:** `0220aab26d56aaa0c9f4f6c6fad9d46ed38d8acb`.
- **Teslim doğrulaması:** GitHub canlı `main` HEAD ve uzak blob eşleşti. Commit `[skip ci]` içerir; Actions kullanılmadı.

## Açık iş ve özel kilitler

- **SC1194 solar/şarj:** Güneş paneli + şarj denetleyicisi + akü için özgün fiziksel model/katalog/donanım kabulü kanıtlanmadan sahte DC LED devresi atama. HOLD olarak koru.
- **SC469–470 LDR uygulamaları:** Önceki turun önerilen olası sonraki hedefi; henüz bu belgede native onarımı ve teslimi kanıtlanmış değil. Kullanıcı derslere geri dönerse gerçek `lesson.id`/sıra, LDR katalog modeli, gerçek kablolar ve özgün simülasyonla yeniden değerlendir.
- **Diğer REVIEW/HOLD:** Depodaki güncel `LESSON_PROGRESS.json`, `LESSON_EVIDENCE.jsonl` ve kaynak notları otoritedir. Buradaki özet tüm açık kayıtların tek tek temizlendiği anlamına gelmez.
- **Korunacaklar:** Golden örnekler, `AGENTS.md`, `BASLAT.bat`, kabul kapıları, SC712/718/725–727, NE555/BD139, V20/Siemens/ACS800/HCFA onarımları, pano 3D ve terminal-kablo eşleşmesi, zamanlayıcı/motor davranışı, tüm mevcut PASS/HOLD/REVIEW.
- UI çalışmasında ders kaynağına veya simülatörün elektriksel sonuçlarına ihtiyaç yoksa onları değiştirme.

## Bir sonraki **ders değişikliği** talebinde protokol

1. Bu dosyanın canlı `main` sürümünü ilk oku; ardından `AGENTS.md`, kabul/ilerleme dosyalarını ve isteğin gerçek ders `id` bilgisini kontrol et.
2. Bu kayıttaki önceden kanıtlı onarımları tekrar etme; yeni HEAD'e göre gerçek kaynak kusurunu ve geçerli kilitleri belirle.
3. Sadece ilgili ders ve gerekli gerçek katalog/simülasyon kaynaklarını en dar kapsamda değiştir.
4. Özgün `Simulation.solve` + 703 katalog, doğru terminaller ve pozitif/negatif kontroller. Native koşulamadıysa PASS yazma. Windows/3D/gerçek donanım zorunluysa REVIEW/HOLD kalsın.
5. Testli somut değişikliği `[skip ci]` ile doğrudan `main` gönder; uzak HEAD ve her değişen dosyanın blob SHA'sını yeniden doğrula. Actions/force-push/geçici dal yok.
6. Kısa kanıtlı sonuç: ders sayısı ve `id`, gerçek düzeltme, hedefli testler, commit, uzak blob SHA, açık kabul, gerçek COMPLETE sayacı ve bir sonraki görev. Kullanıcı özellikle ders istemedikçe mevcut **arayüz iyileştirme** önceliğini koru.

## Yeni öncelik: DTS kullanım deneyimi

27 Ekim 2026 itibarıyla kullanıcı, özellikle arayüzün daha şık, hızlı, anlaşılır ve kullanılabilir hâle gelmesini istiyor. Referans incelenen uygulamalar: **Simurelay** (Microsoft Store ID `9mwmfj4l40g1`) ve **EduVolt Designer 2.2.10** (kütüphaneden statik olarak incelenen Windows kurulum dosyası). Tasarım için araştırma ve uygulanabilir öneriler ayrıca `docs/ARAYUZ_REFERANS_2026-10-27.md` belgesinde kaydedilebilir. Yeni öncelik dersler için kanıtsız COMPLETE ilan etmek anlamına gelmez.
