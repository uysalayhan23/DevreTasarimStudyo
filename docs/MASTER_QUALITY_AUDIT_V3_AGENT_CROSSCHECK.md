# MASTER QUALITY AUDIT v3 — AJAN TAKIMI ÇAPRAZ DOĞRULAMA

Durum: **TAMAMLANDI — V2 DOĞRULANDI, EK BULGULAR EKLENDİ**  
Tarih: 2026-10-04  
Aktif dal: `v1.19.20`  
İncelenen HEAD: `be575a79e6bb297e3ffda0d029c26157c196e0c4`

## Yöntem

Bu tur tek bir genel tarama olarak yapılmadı. Kilitli ajan takımındaki uzmanlıklar ayrı denetim geçişleri olarak kullanıldı:

- HAT-A: MQ-01 / MQ-02 / MQ-03 / MQ-04 / MQ-09 — ürün, görsel, fiziksel ölçü, terminal, pano/digital twin.
- HAT-B: MQ-05 / MQ-06 — simülasyon, signed current/energy flow.
- HAT-C: MQ-07 / MQ-08 — öğretici, pedagojik doğruluk, MEB/source traceability.
- HAT-D: MQ-10 / MQ-11 / MQ-12 / MQ-13 — UI, save/load, test/CI, GitHub süreklilik ve repo organizasyonu.
- MQ-00 — bulguların çakışma kontrolü, yanlış pozitif eleme ve nihai önceliklendirme.

Not: Bu ortamda birbirinden bağımsız ayrı otonom agent process'leri başlatılmadı. MQ rolleri ayrı inceleme geçişleri ve çapraz doğrulama kriterleri olarak uygulandı. Bu nedenle rapor “tek geçiş audit”ten daha güçlüdür; bağımsız dış denetim yerine geçmez.

## Sonuç özeti

- V2'deki dört P0 bulgunun tamamı yeniden doğrulandı.
- V2'deki P1/P2 bulguların hiçbiri geri çekilmedi.
- Yeni **2 P1**, **3 P2** ve **1 audit-gap** tespit edildi.
- Son tamamlanan GitHub Actions run `37197997363` başarıyla tamamlandı; docs-only audit commitinde bile tam regresyon + paketleme çalıştığı doğrulandı.

---

# HAT-A — FİZİKSEL GERÇEKLİK / DIGITAL TWIN

## Yeniden doğrulananlar

- MQ-P0-001 — ürün bazlı gerçek W/H/D mm sistemi yok.
- MQ-P0-002 — terminal pano geometrisi yaklaşık gövde ölçüsüne bağlı.
- MQ-P0-004 — door/plate 3B clearance ve kapanma çarpışması yok.
- MQ-P1-001/002/003/004/013 — merkezi digital twin, orientation/sourceStatus, aspect-safe render, 2.5D standardı ve pano engineering constraints açık.

## Yeni P1 — MQ-P1-014 — Asset kaynak otoritesi / doğrulama seviyesi makinece sınıflandırılmıyor

### Kanıt
- PLC asset manifesti: 202 kayıt.
- `sourceStatus`: 0/202.
- `license/usageRights/permission`: 0/202.
- Görsel source hostname'leri içinde çok sayıda üretici dışı tedarikçi/distribütör vardır; örneğin santaclarasystems, em.co.za, plc-direct, ima-tec, plcdepartment.
- Mevcut `match` yalnız 89 exact / 113 family ayrımı sağlar; kaynağın teknik otorite seviyesi ayrı tutulmaz.

### Risk
Bir “gerçek ürün fotoğrafı” ile “teknik ölçü/terminal doğruluğu kanıtı” birbirine karışabilir.

### Düzeltme
`sourceAuthority: manufacturer|official-doc|authorized-distributor|supplier|other` + `sourceStatus` + teknik veri için ayrı `technicalSource`; görsel kaynak ile teknik kaynak birbirinden ayrılmalı.

## Yeni P2 — MQ-P2-005 — Asset kullanım/lisans/provenance metadata'sı yok

Bu teknik terminal doğruluğundan ayrı bir dağıtım kalitesi konusudur. Ürün görselinin kaynağı kayıtlı olsa da kullanım hakkı/lisans durumu manifestte yok.

### Düzeltme
`license/usageRights/attributionRequired/retrievedAt` metadata; bilinmiyorsa UNKNOWN.

## Audit Gap — MQ-AUDIT-GAP-001 — Tüm binary assetlerin piksel seviyesinde front-view audit'i tamamlanmadı

Manifest/metadata tarandı; ancak yüzlerce JPG/PNG/WebP'nin tamamı tek tek görsel olarak “ortografik front / perspective / isometric / cropped wrong” sınıflandırılmadı.

### Düzeltme
WP-016 Visual Corpus Audit: her aktif asset için görsel kontrol + orientation sonucu + terminal görünürlük sonucu.

---

# HAT-B — SİMÜLASYON / ENERJİ AKIŞI

## Yeniden doğrulanan P0

MQ-P0-003 doğrulandı.

### Çapraz kanıt
- `tutorial-mode.js`: `flow(project)` yalnız `clearHighlights()`.
- `simulation.js`: kablo runtime verisi `_active/_fault`; signed wire current/direction yok.
- `current-model.js`: birçok akım büyüklüğü `Math.abs(...)` olarak saklanıyor.
- CSS tüm energized wire'lara aynı dash yönünü uygular.
- Testler enerji-flow CSS tokenının varlığını kontrol ediyor; signed direction davranışını test etmiyor.

### Nihai ifade
“Enerji akışı hiç görünmüyor” değil; **enerjili hat animasyonu var fakat fiziksel/signed akım yönü yok**. Düzeltilmesi gereken nokta yönün solver sonucundan türetilmesidir.

---

# HAT-C — ÖĞRETİCİ / MEB

## Yeniden doğrulanan P1

MQ-P1-005 doğrulandı: ders bazlı resmi MEB area/branch/module/outcome/prerequisite/source status zinciri yok.

## Yeni ayrıntı

Mevcut tutorial testleri birçok derste `sourceDocs.length > 0` kontrolü yapıyor; fakat:
- kaynak dosyanın gerçekten mevcut/erişilebilir olması,
- resmi kurum/üretici niteliği,
- belge sürümü,
- sayfa aralığı,
- kazanımla birebir eşleşme
otomatik doğrulanmıyor.

Bu bulgu MQ-P1-005 içine **source-evidence subtask** olarak eklenmelidir; ayrı P1 açılmasına gerek yoktur.

---

# HAT-D — UI / SAVE-LOAD / TEST / GITHUB

## Yeniden doğrulananlar

- MQ-P1-006 gerçek browser visual test yok.
- MQ-P1-007 G1-G4 kalite validatorları CI'da yok.
- MQ-P1-008 v1.19.20 branch artifact/app kimliği v1.19.1.
- MQ-P1-009 doküman current-truth çelişkileri.
- MQ-P1-010 versioned migration chain yok.
- MQ-P1-011 kilitli branch değişikliği anlık alarm değil.
- MQ-P1-012 default branch `main` olduğu için branch seçmeden Download ZIP eski v1.18.0 verir.
- MQ-P2-002 stale version:6 new-project handler.
- MQ-P2-003 cache-buster semver karmaşası.
- MQ-P2-004 tarihsel root kayıtları aktif repo yüzeyiyle karışık.

## Yeni P1 — MQ-P1-015 — Repo kilidi tamper-resistant değil

### Kanıt
`scripts/check-v11920-lock.cjs` kilitli iki dosyanın hash'ini kendi içinde tutuyor. Ancak:
- checker dosyasının kendisi harici/sunucu tarafı sabitlenmiş değil,
- `.github/workflows/check.yml` de aynı aktif branch üzerinde değiştirilebilir,
- server-side Ruleset/Branch Protection mevcut özel repo koşulunda etkinleştirilemedi.

### Sonuç
Bu kilit iyi bir **drift/tutarlılık alarmıdır**, fakat kötü niyetli veya yanlış bir commit checker + beklenen hash + workflow'u birlikte değiştirirse kendi başına kriptografik/harici koruma sağlamaz.

### Düzeltme
Mümkün olduğunda GitHub server-side branch protection/ruleset. O zamana kadar:
- checker/workflow değişikliklerini ayrıca MQ-13 kritik değişiklik say,
- ilgili commitlerde manual review/checklist,
- mümkünse sabit baseline hash'i farklı bağımsız referans/tag/release recordunda tut.

## Yeni P2 — MQ-P2-006 — Docs-only commitlerde tam 455 test + Windows package çalışıyor

### Kanıt
`check.yml` her `v1.19.20` push'ında tam validate/test/package çalıştırıyor; path ayrımı yok.
V2 audit gibi yalnız belge değişikliğinde bile run `37197997363` tam regresyon ve ZIP üretimini tamamladı.

### Risk
Gereksiz Actions süresi, artifact depolaması ve çalışma kuyruğu; sık audit/doküman güncellemesinde takımın verimini düşürür.

### Düzeltme
Workflow'u iki kapıya ayır:
1. fast repo-integrity/docs check,
2. code/assets/tests değiştiğinde full regression + Windows package.
Locked policy/team değişiklikleri fast gate'i mutlaka çalıştırmalı.

## Yeni P2 — MQ-P2-007 — Windows artifact tüm geliştirme reposunu paketliyor

### Kanıt
`scripts/package.py` Git varsa `git ls-files --cached` ile tüm tracked dosyaları paketliyor; yalnız birkaç sistem klasörünü hariç tutuyor.

Mevcut tracked dağılım yaklaşık:
- toplam 641 dosya / 106 MB raw,
- dist: 409 dosya / 91.7 MB,
- Belgeler: 6 / 8.4 MB,
- tools: 9 / 3.4 MB,
- tests: 59,
- docs: 30,
- scripts: 6,
- .github workflow da pakete giriyor.

### Risk
End-user artifact testler, geliştirici scriptleri, ajan belgeleri ve repo bakım dosyalarıyla gereksiz büyür/karmaşıklaşır.

### Düzeltme
İki çıktı:
- **Runtime Windows package:** BASLAT + dist + gerekli örnek/proje/kullanım dosyaları + gerçekten gerekli runtime belgeleri.
- **Source/developer ZIP:** GitHub Code ZIP zaten kaynak paketidir.

Runtime paketin dosya manifesti explicit allowlist olmalı ve hash testleri korunmalı.

---

# AJAN ÇAPRAZ DOĞRULAMA MATRİSİ

| Alan | Lider | İkinci kontrol | Sonuç |
|---|---|---|---|
| Fiziksel ölçü | MQ-02 | MQ-01/MQ-04 | P0 doğrulandı |
| Terminal frame | MQ-04 | MQ-02/MQ-03 | P0 doğrulandı |
| Asset orientation/provenance | MQ-01/MQ-03 | MQ-09/MQ-13 | P1 + audit gap |
| Signed flow | MQ-05/MQ-06 | MQ-07/MQ-12 | P0 doğrulandı |
| MEB/source evidence | MQ-08 | MQ-07/MQ-12 | P1 doğrulandı |
| Save/load migration | MQ-11 | MQ-12 | P1 doğrulandı |
| UI/browser | MQ-10 | MQ-12 | P1 doğrulandı |
| Repo/CI continuity | MQ-13 | MQ-12/MQ-00 | 1 yeni P1 + 2 yeni P2 |
| Nihai öncelik | MQ-00 | tüm hatlar | V3 kabul |

---

# V3 SONRASI NİHAİ DÜZELTME SIRASI

## A — Önce P0
1. Physical Digital Twin W/H/D schema.
2. Terminal coordinate contract.
3. Signed current/energy-flow solver + UI.
4. Door/plate 3B collision + clearance.

## B — Sonra P1 veri kalitesi
5. sourceAuthority/sourceStatus + technical source ayrımı.
6. Asset orientation/exact-family validation.
7. MEB outcome/source/prerequisite schema.
8. Versioned project migration.
9. Gerçek browser visual regression.
10. CI G1-G4 validators.
11. v1.19.20 app/package identity.
12. Current-truth documentation cleanup.
13. Locked-branch immediate detection.
14. Default branch / Download ZIP davranışı.
15. Repo-lock tamper resistance iyileştirmesi.

## C — Sonra P2 verim/temizlik
16. Docs-only fast CI.
17. Runtime package allowlist.
18. Asset provenance/license metadata.
19. Stale new-project handler.
20. Cache revision standardı.
21. Root archive/history organization.

## D — Ayrı görsel denetim
22. WP-016 full binary asset visual corpus audit.

# MQ-00 KARARI

**Ajan-takımı tarzı çapraz denetim, tek Master Audit geçişinden daha kararlı sonuç verdi.**

Sebep:
- aynı bulgu iki farklı sorumluluk açısından doğrulandı,
- bazı ifadeler düzeltildi (ör. “flow yok” yerine “signed yön yok”),
- repo/CI/paketleme gibi ilk auditte daha az görünür kalan sorunlar ortaya çıktı,
- yeni bulgular P0 üretmedi; mevcut P0 seti istikrarlı kaldı.

Bu nedenle bundan sonraki kalite kararlarında önerilen standart:
**uzman denetimi → ikinci uzman doğrulaması → MQ-12 test kanıtı → MQ-13 repo süreklilik kontrolü → MQ-00 nihai karar**.
