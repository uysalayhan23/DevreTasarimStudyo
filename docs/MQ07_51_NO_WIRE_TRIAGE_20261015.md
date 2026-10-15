# MQ-07 — 51 NO_WIRED_CIRCUIT kaydının ayrıntılı sınıflandırması (15.10.2026)

**Güncel ek (2026-10-15, HEAD `210111df3b16b5857b9456c43db18c6b73a0c5fa`):** Bu belge başlangıçtaki 51 adayın tarihsel fotoğrafıdır; aşağıdaki ilk tabloyu geriye dönük silmeyin. Sonraki onarımlar `electronic-switching-src-03` (röleli motor yönü), `electronic-switching-src-09` (FET RC gecikme) ve `electronic-switching-src-10` (MOSFET G/D/S fonksiyon kontrolü) için sanal kaynak ve özgün V8 solver düzeyinde kayıtlıdır. **Güncel açık teknik REVIEW: 48 = 14 kavramsal + 34 henüz onarılmamış uygulama**; bu 3 onarımın fiziksel/Windows/bağımsız pedagojik kabulü yine açık olduğundan tüm dersler DONE değildir. Yeni iş adayı `electronic-switching-src-11` (MOSFET ile DC motor hız kontrolü); PWM/gate sürüşü ve motor solver davranışı gerçekten desteklenmeden `quiz` → `rich` veya tam kabul yapılmamalıdır. Bu ek yalnız belge senkronizasyonudur; yeni test koşulmadı. Dayanak: `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` son üç MQ-07 kaydı ve `evidence/mq07_mosfet_health_v8_20261015.json`.

**Aktif kaynak:** `uysalayhan23/DevreTasarimStudyo`, `main`; başlangıç HEAD `fc0dc590edea27f25e06d38dab4022c20e3a3618`.

**Kaynak:** 51/51 `quiz`, 50/51 sıfır bağlantı, 1/51 sadece iki referans/ölçüm prob bağlantısı. Kategoriler: **14 korunan kavramsal**, **37 uygulama adayı**, bunların **1'i doğrulanmış sanal röle-motor yön devresi**, **36'sı hâlâ uygulama onarımı için REVIEW**. 14 kavramsal da orijinal kabul kapıları sağlanana kadar REVIEW'da tutulur.

| # | Ders kimliği | Ders başlığı | Kaynak kablo | İşlem | Karar |
|---:|---|---|---:|---|---|
| 1 | `installation-grounding-src-03` | Kolon-linye-sorti PE hattı | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 2 | `installation-grounding-src-04` | Dağıtım panosu topraklaması | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 3 | `installation-grounding-src-05` | Motor gövde koruma iletkeni | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 4 | `installation-grounding-src-06` | Prizde topraklama hattı tespiti | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 5 | `installation-grounding-src-07` | Topraklama direnci ölçümü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 6 | `installation-grounding-src-08` | Yalıtkanlık direnci ölçümü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 7 | `installation-grounding-src-09` | Paratoner iletken bağlantısı | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 8 | `installation-grounding-src-10` | Kaçak akım koruma düzeninin tesisattaki yeri | 2 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 9 | `installation-systems-src-07` | Aydınlatma ve priz tesisatı | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 10 | `electronic-switching-src-03` | Röle ile motor yönü değiştirme | 0 | Uygulama devresini değerlendir | Sanal kaynak PASS; fiziksel REVIEW |
| 11 | `electronic-switching-src-08` | Transistörlü Schmitt Trigger | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 12 | `electronic-switching-src-09` | FET’li zaman gecikmeli duran devre | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 13 | `electronic-switching-src-10` | MOSFET sağlamlık kontrolü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 14 | `electronic-switching-src-11` | MOSFET ile DC motor hız kontrolü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 15 | `electronic-switching-src-12` | IGBT ile dimmer | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 16 | `electronic-switching-src-13` | Tristörün DC’de tetiklenmesi | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 17 | `electronic-switching-src-14` | Tristörün durdurulması | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 18 | `electronic-switching-src-15` | Tristörün AC’de çalışması | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 19 | `electronic-switching-src-16` | Triyakın DC’de çalışması | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 20 | `electronic-switching-src-17` | Triyaklı dimmer | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 21 | `electronic-switching-src-18` | Optokuplör sağlamlık kontrolü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 22 | `electronic-switching-src-19` | Opto-triyak ile flaşör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 23 | `sensor-analog-apps-src-09` | Ağırlık sensörü / load cell | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 24 | `sensor-analog-apps-src-15` | Güneş pili uygulaması | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 25 | `sensor-analog-apps-src-17` | Sensörlerde enerji dönüşümü | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 26 | `sensor-analog-apps-src-18` | Otomobillerde kullanılan sensörler | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 27 | `sensor-analog-apps-src-19` | Sıcaklık ölçümünde sensör seçimi | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 28 | `sensor-analog-apps-src-21` | Güneş pilli bahçe aydınlatma ve şarj sensörü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 29 | `opamp-apps-src-09` | Op-amp turn-on gecikme | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 30 | `opamp-apps-src-10` | Op-amp turn-off gecikme | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 31 | `opamp-apps-src-15` | Yarım dalga doğrultmaç | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 32 | `opamp-apps-src-16` | Enstrümantasyon yükselteci | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 33 | `oscillator-filter-apps-src-01` | Colpitts osilatör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 34 | `oscillator-filter-apps-src-02` | Hartley osilatör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 35 | `oscillator-filter-apps-src-03` | Kristal osilatör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 36 | `oscillator-filter-apps-src-04` | RC faz kaymalı osilatör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 37 | `oscillator-filter-apps-src-05` | Wien köprü osilatörü | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 38 | `oscillator-filter-apps-src-06` | Transistörlü tek kararlı multivibratör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 39 | `oscillator-filter-apps-src-07` | Transistörlü çift kararlı multivibratör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 40 | `oscillator-filter-apps-src-08` | Transistörlü kararsız multivibratör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 41 | `oscillator-filter-apps-src-09` | Kırpıcı devre | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 42 | `oscillator-filter-apps-src-10` | Kenetleyici devre | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 43 | `oscillator-filter-apps-src-11` | Miller devresi | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 44 | `oscillator-filter-apps-src-12` | Boot strap devresi | 0 | Kavramı koru | Quiz değişmez / REVIEW |
| 45 | `oscillator-filter-apps-src-13` | Schmitt Trigger | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 46 | `oscillator-filter-apps-src-14` | 555 osilatör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 47 | `oscillator-filter-apps-src-15` | 555 PWM | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 48 | `oscillator-filter-apps-src-16` | 555 tek kararlı multivibratör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 49 | `oscillator-filter-apps-src-17` | 555 çift kararlı multivibratör | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 50 | `oscillator-filter-apps-src-18` | Alçak geçiren aktif filtre | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |
| 51 | `oscillator-filter-apps-src-19` | Yüksek geçiren aktif filtre | 0 | Uygulama devresini değerlendir | Beklemede / REVIEW |

**Koruma politikası:** Kavramsal 14 dersin kimliği, başlığı, quiz akışı, malzeme referansları ve sıfır kablo durumu değiştirilmedi. Kablo bulunmaması tek başına arıza veya tam fiziksel kabul değildir.

**Öncelik:** `electronic-switching-src-03` röleli motor yön değişimi ilk uygulama adayıdır; gerçek `coil-relay` K1 ve iki `contact-both` kontağı, `motor-dc` polarite çözücüsü ile test edildi. Sonraki uygulama adayı `electronic-switching-src-09` FET'li gecikmeli durma devresi; canlı FET ve RC modelinin desteklenip desteklenmediği doğrulanmadan yeni şema kabul edilmeyecek. Ölçüm cihazı/modeli bulunmayan topraklama ve yalıtım konuları gerçek ölçüm gibi gösterilmeyecek.

**MQ-00:** Sanal motor devre topolojisi ve V8 motor yönü solver kapısı PASS; tüm müfredatın Node/Windows görsel/ürün fiziksel/bağımsız pedagojik kabul kapıları açık. Actions kullanılmadı; commitler `[skip ci]`.
