# Faz 5 — komponent kütüphanesi

> **1.19.1 doğru taban kontrolü (2026-10-03):** v1.19.0 kütüphanesi üzerine yapılan karşılaştırmada BD139/BD140, LM358P ve önceki v1.19.0 kayıtları korundu; Faz 5’in altı yeni yarı iletkeni (N/P MOSFET, IGBT, SCR, TRIAC, DIAC) ayrı tanımlar olarak mevcut. Statik proje denetimi 728 tanım ve 58 korumalı projeyi doğruladı. Sözdizimi ve diff whitespace denetimleri temiz. Faz 3 RLC/diyot testleri 4/4 geçti. Tam paket 379/427; kalan 48 başarısız testin tamamı temiz v1.19.0’da da başarısızdı. Görsel ürün CAD’i temsili; donanım/Windows/Edge kontrolü yapılmadı.

## Kapsam

Dalın doğru taban sürümü v1.19.0’dır. Bu tabanda BD139/BD140 BJT ve LM358P işlemsel yükselteç, kütüphane kaydı, sembol ve çözücü modeliyle zaten bulunur. Bunlar yeniden tanımlanmadı. Bu fazda eksik olan altı bileşen eklendi; kütüphane, şema, terminal ve malzeme çizimleri ortak pin kimliklerini kullanır.

| Komponent | Pinler ve şema yönü | Temel eğitim modeli | Malzeme görünümü |
| --- | --- | --- | --- |
| N kanal MOSFET | G solda, D/S üst/alt kolda; paket uçları altta | VGS ≥ 4 V iken ideal D-S anahtarı | TO-220 temsili |
| P kanal MOSFET | G solda, D/S üst/alt kolda; paket uçları altta | VSG ≥ 4 V iken ideal D-S anahtarı | TO-220 temsili |
| N kanal IGBT | G solda, C/E üst/alt kolda; paket uçları altta | VGE ≥ 4 V iken ideal C-E anahtarı | TO-247 temsili |
| SCR | A/K ana akım yolu, G kapı ucu; paket uçları altta | V(G-K) ≥ 0,7 V iken A-K anahtarı | TO-220 temsili |
| TRIAC | MT1/MT2 çift yönlü yol, G kapı ucu; paket uçları altta | V(G-MT1) mutlak değeri ≥ 0,7 V iken çift yönlü anahtar | TO-220 temsili |
| DIAC | A1/A2 yatay, çift yönlü | V(A1-A2) mutlak değeri ≥ 30 V iken anahtar | DO-35 temsili |

Şema işaretleri ortak terminal kimliklerini kullanır. Temsili paket çizimleri ölçülü üretici CAD'i veya belirli ürünün pin dizilimi değildir. v1.19.0’daki BD139/BD140 ve LM358P ürün kayıtları kendi üretici referanslarını korur.

## Model sınırları

- Eğitim modelleri üreticiye özgü komponent veya tolerans modeli değildir.
- Eklenen MOSFET/IGBT anahtarları ideal iletken bağlantı gibi davranır; RDS(on), gövde/ters diyot ve anahtarlama kayıpları modellenmez.
- Eşik anahtarlaması DC eğitim modelidir; anahtarlama dalga biçimleri/AC faz açısı hesaplanmaz. SCR tutma akımı/mandallanması ve TRIAC AC komütasyonu yoktur.
- DIAC modeli ±30 V sabit DC eşiği kullanır; AC kırılma dalga biçimi ve histerezis yoktur.
- BJT ve LM358P mevcut v1.19.0 modellerini kullanır; Faz 5 bunları değiştirmez.
- Görsel bağlantı ve sayısal eğitim modeli gerçek devre simülatörü ya da donanım ölçümü yerine geçmez.

## Değişen kaynaklar ve kontrol

- `dist/library.js`: 6 yeni tanım ve pin düzeni.
- `dist/design-visuals.js`: MOSFET/IGBT için TO-220/247 ve DIAC için DO-35 temsili paket çizimleri.
- `dist/norms.js`: MOSFET/IGBT, SCR/TRIAC/DIAC sembolleri.
- `dist/catalog.js`: yarı iletken/entegre gruplandırması; mevcut v1.19.0 ürün gruplarıyla uyum.
- `dist/simulation.js`: DC eşik kontrollü ideal anahtar davranışı.
- Faz 5’in ilk raporundaki BJT/op-amp’ın eksik olduğu ve yeni tanım olarak eklendiği ifadeleri, gerçek v1.19.0 tabanına göre geçersizdir.
- `node scripts/check.cjs`: başarılı; 728 kütüphane tanımı ve 58 korumalı proje.
- Atölye, dashboard, öğretici modu ve ders denetimi hedefli testleri: 24/32 başarılı. Kalan 8 başarısızlık temiz `v1.19.0` tabanında da aynı sonuçla görüldü; bu birleştirmeyle yeni test gerilemesi oluşmadı.
- Tam test paketi, Windows/Edge arayüz denemesi ve fiziksel donanım denemesi yapılmadı.

## Faz durumu

Faz 5’in kapsamı v1.19.0 tabanına göre düzeltildi ve yukarıdaki altı eksik komponent eklendi. Rapor kullanıcı kontrol noktasıdır. Faz 6'ya geçiş için kullanıcı onayı gerekir.
