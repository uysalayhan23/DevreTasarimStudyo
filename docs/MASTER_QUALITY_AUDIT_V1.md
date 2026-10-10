# MASTER QUALITY AUDIT v1 — v1.19.20

Durum: **BAŞLATILDI**  
Baş Ajan: MQ-00  
Aktif dal: v1.19.20  
Üst kural: V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md

## 1. İlk mimari harita

- Çalışan uygulama kaynakları: dist/
- Malzeme tanımları: dist/library.js, dist/design-library.js, dist/components.js ve genişletme modülleri
- Görsel/asset sistemi: dist/materials*.js, dist/design-visuals.js, dist/product-assets*.js, dist/assets/
- Pano modeli: dist/panel.js, dist/panel-editor.js, dist/panel-wiring.js
- Simülasyon: dist/simulation.js, dist/current-model.js, dist/device-behavior.js
- Öğretici: dist/tutorial-lessons.js, dist/tutorial-expanded-lessons.js, dist/tutorial-pedagogy.js, dist/tutorial-mode.js
- Save/load/migration: dist/project-store.js
- Test: tests/, scripts/check.cjs, scripts/run-tests.cjs
- Paket/CI: scripts/package.py, .github/workflows/check.yml

## 2. Confirmed P0 — MQ-P0-001 — Ürün bazlı gerçek fiziksel ölçü sistemi eksik / pano ölçüsü kategori varsayımına bağlı

### Kanıt

dist/panel.js içindeki spec(d), fiziksel ürün bazlı doğrulanmış ölçü yerine kategori/ID kalıplarına göre ölçü döndürüyor. Örnekler:
- buttons / lamps → 32 × 32 × 50
- terminals → 8 × 50 × 45
- MCB/RCD → 18/36/54 × 85 × 70
- contactors → 45 × 85 × 75
- relays/timers/protection → 40 × 80 × 60
- drives → 100 × 180 × 150
- bilinmeyen diğer cihaz → 70 × 85 × 55

dist/design-library.js ise birçok tesisat elemanını varsayılan w:100, h:120 ile oluşturuyor. Bazı kapak şalterlerinde w/h sonradan görsel amaçla büyütülüyor; bu değerler üretici doğrulanmış fiziksel ölçü olarak işaretlenmiyor.

### Kök neden

Mevcut veri modeli görsel çizim w/h değerleri ile pano gerçek fiziksel W/H/D değerlerini merkezi bir digital twin kaydında ayırmıyor. panel.js bu boşluğu kategori varsayımlarıyla dolduruyor.

### Etki

- cihazlar gerçek pano alanını yanlış kaplayabilir,
- DIN rayı yerleşimi gerçek dışı olabilir,
- çakışma/boşluk kontrolü gerçek paneli temsil etmeyebilir,
- terminal ve kablo başlangıç noktaları fiziksel ürüne göre yanlış yerde olabilir,
- pano tasarımı gerçek imalat için güvenilir sayılamaz.

### Öncelik

**P0 / RELEASE BLOCKER**  
Master Quality Agent Programdaki “fiziksel boyut sisteminin pano tasarımını yanlış hale getirmesi” maddesine doğrudan girer.

### Doğru çözüm yönü

Kategori varsayımını bir anda silmek değil:
1. merkezi fiziksel ölçü şeması tanımla,
2. mevcut her cihaz için sourceStatus ekle,
3. doğrulanmış ürünlerde widthMm / heightMm / depthMm kullan,
4. doğrulanmamış ürünlerde açık UNVERIFIED durumu tut,
5. panel.spec yalnız doğrulanmış fiziksel veri varsa gerçek ölçek kullanmalı,
6. legacy fallback açıkça approximate olarak kalmalı ve release kalite skorunda bloklayıcı olmalı,
7. migration ve eski proje uyumluluğu korunmalı.

## 3. Confirmed P0 — MQ-P0-002 — Terminal pano geometrisi yaklaşık cihaz ölçüsüne bağlı

### Kanıt

dist/panel-wiring.js ports(item,d) terminal konumunu:
- pin.x / d.w * item.w
- pin.y / d.h * item.h

oranlarıyla pano üzerindeki item.w/item.h ölçüsüne taşıyor.

Bu yaklaşım ancak:
- d.w/d.h gerçek çizim koordinat sistemi,
- item.w/item.h gerçek fiziksel boyut

ise fiziksel olarak güvenilir olur.

MQ-P0-001 nedeniyle item.w/item.h çoğu cihazda kategori varsayımıdır. Dolayısıyla terminal konumu da orantılı fakat gerçek olmayan bir gövde üzerinde hesaplanabilir.

### Etki

- kablo gerçek terminal deliğinden çıkmayabilir,
- görsel terminal ile hitbox/endpoint ayrışabilir,
- cihaz ölçüsü düzeltildiğinde eski terminal koordinatları yeniden doğrulama gerektirir.

### Öncelik

**P0 / RELEASE BLOCKER**

### Doğru çözüm yönü

Terminal koordinatları digital twin içinde mm veya normalize + sourceStatus ile tutulmalı; asset, front-view ve pano fiziksel ölçüsü aynı referans sistemine bağlanmalı.

## 4. İlk olumlu bulgular

### Pano kamera ölçeği fiziksel modelden ayrılmış

dist/panel.js ve dist/panel-editor.js kamera scale değerini viewport fit/zoom amacıyla kullanıyor. Bu doğru mimari yöndür: fiziksel ölçüyü küçültmek yerine görüntüleme kamera/zoom ile yapılabilir.

### Kablo rotalama kamera zoomundan bağımsız

dist/panel-wiring.js açıkça terminal ve rota koordinatlarını panel dünya koordinatlarında tutuyor; kamera zoom routing hesabına sokulmuyor.

### Eski proje migration katmanı mevcut

dist/project-store.js normalizeLegacy() ile eski components/wires/devices/connections/workspace adlarını normalize ediyor. Yeni digital twin/fiziksel metadata genişletmesi bu uyumluluğu bozmadan yapılmalı.

## 5. Açık audit alanları

Aşağıdaki maddeler henüz DONE değildir:

- [ ] tüm malzemelerin fiziksel W/H/D envanteri
- [ ] kaynak doğrulama seviyesi envanteri
- [ ] front-view / top-view / izometrik / placeholder sınıflandırması
- [ ] terminal koordinat kaynak doğrulaması
- [ ] panel DIN rayı / kanal gerçek ölçü standardı
- [ ] 1 scene unit = 1 mm uygunluk analizi
- [ ] dijital ikiz şema tasarımı
- [ ] enerji/akım yönü runtime türetim audit'i
- [ ] öğretici tüm derslerin malzeme uyumu
- [ ] MEB kaynak eşleştirmesi
- [ ] save/load ve migration regresyon matrisi
- [ ] test kapsamı / release gate matrisi

## 6. İlk çalışma paketleri

### WP-001 — Physical Dimension Schema
Lider: MQ-02  
Doğrulayıcılar: MQ-01, MQ-03, MQ-04, MQ-11, MQ-12  
Durum: **AUDIT**

Çıktı:
- mevcut ölçü alanlarının haritası,
- önerilen merkezi digital twin fiziksel metadata şeması,
- legacy uyumluluk planı,
- panel.spec migration planı.

### WP-002 — Terminal Coordinate Contract
Lider: MQ-04  
Doğrulayıcılar: MQ-02, MQ-03, MQ-12  
Durum: **AUDIT**

Çıktı:
- pin coordinate sistemleri,
- görsel/pano/hitbox referans ilişkisi,
- mm tabanlı terminal contract.

### WP-003 — Asset Orthographic Classification
Lider: MQ-01 + MQ-03  
Durum: **BACKLOG**

Çıktı:
- front / top / isometric / perspective / placeholder envanteri,
- P0/P1 asset listesi.

### WP-004 — Simulation / Energy Flow Audit
Lider: MQ-05 + MQ-06  
Durum: **BACKLOG**

### WP-005 — Tutorial / MEB Audit
Lider: MQ-07 + MQ-08  
Durum: **BACKLOG**

### WP-006 — Save/Load / Migration Regression
Lider: MQ-11 + MQ-12  
Durum: **BACKLOG**

## 7. Master kararı

v1.19.20 için ilk kalite programı başarıyla başlatıldı. Şu aşamada üretici ölçü kaynakları doğrulanmadan panel cihazlarını topluca yeniden boyutlandırmak yasaktır. Önce WP-001 ve WP-002 veri sözleşmesi ile kaynak statüsü tamamlanacaktır.
