# Proje haritası

Uygulama derleme gerektirmeyen HTML/CSS/JavaScript'tir. `dist/` burada atılacak bir derleme çıktısı değildir: **asıl çalışan kaynaklar bu klasördedir**. Modüller tarayıcıda global adlar, uygun dosyalarda Node testleri için CommonJS dışa aktarımları kullanır. `dist/index.html` betik sırası bağımlılıkların yüklenme sırasıdır.

| İş / sorun | Önce bakılacak dosyalar |
| --- | --- |
| Windows başlangıcı, ana sayfa | `BASLAT.bat`, `dist/index.html`, `dist/studio.js`, `dist/studio.css` |
| Editör olayları, seçme, silme, taşıma, özellik menüsü | `dist/app.js`, `dist/selection.js`, `dist/viewport.js`, `dist/labels.js` |
| Kaydet/aç, taslak, örnek kilidi | `dist/project-store.js`, `dist/studio.js`, `tests/protected-examples-v118.test.cjs` |
| Uyarılar ve simülasyonda temas | `dist/safety.js`, `dist/app.js`, `tests/live-touch-v118.test.cjs` |
| Kumanda / tesisat / pano filtreleri, favoriler | `dist/workspaces.js`, `dist/catalog.js`, `dist/studio.js` |
| Malzeme tanımları ve terminal kimlikleri | `dist/library.js`, `dist/design-library.js`, `dist/components.js`, `dist/device-behavior.js` |
| Hat kimliği, renk kilidi, kalınlık | `dist/conductors.js`, `dist/app.js` |
| Genel elektriksel çözüm, motor, bobin/kontak | `dist/simulation.js`, `dist/components.js`, `dist/current-model.js`, `dist/thermal.js` |
| Sensör hedefi ve animasyon | `dist/sensors.js`, `dist/device-behavior.js`, `dist/app.js` |
| Ölçü aleti, prob kıvrımı, kablo teması | `dist/multimeter.js`, `dist/probe-leads.js`, `dist/instruments.js`, `dist/instrument-ui.js` |
| SINAMICS V20 | `dist/v20.js`, `dist/v20-ui.js`, `dist/starter-v116.js`, `V20_KILAVUZU.md` |
| ABB ACS800 R5 / RMIO | `dist/acs800.js`, `dist/acs800-ui.js`, `dist/acs800-art.js`, `dist/acs800-terminals.json`, `dist/starter-v117.js`, `ACS800_KILAVUZU.md` |
| Pano gövdesi, kapak, ray, kanal | `dist/panel.js`, `dist/panel-editor.js`, `dist/panel.css` |
| Pano kabloları, yüksük, bağımsız rotalar | `dist/panel-wiring.js`, `dist/panel-editor.js` |
| Şema geometrisi, standartlar | `dist/symbols.js`, `dist/norms.js`, `dist/book-symbols.js`, `dist/normlar.html` |
| Malzeme SVG çizicileri | `dist/materials.js`, `dist/design-visuals.js`, `dist/modern-materials.js`, `dist/materials-v111.js`, `dist/materials-v113.js`, `dist/materials-v115.js` |
| v1.18 tesisat sembolleri ve priz/fiş/duy | `dist/installation-v118.js`, `tests/installation-v118.test.cjs` |
| Yerel ürün resimleri / atlas | `dist/product-assets*.js`, `dist/material-assets.js`, `dist/photo-plane.js`, `dist/assets/` |
| PLC katalogları / ön yüzler | `dist/plc-front.js`, `dist/plc-assets.js`, `dist/plc-photo-data.js`, `tools/plc-v114/`, `dist/assets/plc/` |
| Cihazın ek parçaları / prob oluşturma | `dist/assemblies.js` |
| Buton hareketi ve ses | `dist/actuation.js`, `dist/audio.js` |
| Hazır dashboard devreleri | `dist/starter-projects.js`, `dist/starter-v110.js` … `dist/starter-v117.js` |
| Hazır dosya örnekleri | `Ornekler/`, `Kaydedilen_Projeler/` |
| Otomatik testler | `tests/*.test.cjs`, `tests/helpers/offline-dom.cjs` |
| Test / paket komutları | `scripts/check.cjs`, `scripts/run-tests.cjs`, `scripts/package.py`, `.github/workflows/check.yml` |

`library.js` tarayıcı globalini VM içinde oluşturur; yalnız `require` etmek tüm kütüphaneyi döndürmez. Testlerdeki örnek yükleme: `window.COMPONENT_LIBRARY` → `Design.extend(...)` → `Symbols.prepareLibrary(...)`. Gerçek editör köprüsü `window.DTSEditor` üzerinden sağlanır. Yeni modül eklerken hem `index.html` yükleme sırasını hem Node test yolunu düşünün.

`YENILIKLER_*`, `DOGRULAMA_*`, `DOSYA_LISTESI_*`, `final-*.txt` ve eski TAP dosyaları **tarihsel kanıttır**. Güncel çalışma çıktısını bunların üzerine yazmayın. `build/` geçici yeni kontrol/paket çıktıları içindir ve Git'e alınmaz.

Görseller ve PDF'ler çalışma sırasında yerel dosyalardan okunur. `tools/` içindeki üretim betikleri tarihsel yardımcı araçları da içerir; bunların tamamının ek girdiler olmadan yeniden üretim yapacağı varsayılmamalıdır. Son üretilmiş ve çalışan veriler depoda tutulur.
