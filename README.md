# Devre Tasarım Stüdyosu

> **Güncel çalışma bilgisi (2026-10-23):** Aktif geliştirme deposu/dalı **uysalayhan23/DevreTasarimStudyo / main**. Aşağıdaki v1.19.20/Actions açıklamaları tarihsel kayıttır; geliştirmeyi bunlara göre başka dala taşıma veya Actions tetikleme. Yeni oturumda önce [AGENTS.md](AGENTS.md), [PROJECT_MANIFESTO.md](PROJECT_MANIFESTO.md), [ACCEPTANCE_PROTOCOL.md](ACCEPTANCE_PROTOCOL.md), [NEXT_TASK.md](NEXT_TASK.md) ve [LESSON_PROGRESS.json](LESSON_PROGRESS.json) oku. Kanıtlar [LESSON_EVIDENCE.jsonl](LESSON_EVIDENCE.jsonl), kontrol `node scripts/lesson-acceptance-gate.cjs`. Yalnız gerçek doğrulanmış onarımlar `[skip ci]` ile doğrudan main'e gönderilir.\n\n
Yakub Uysal için hazırlanmış, Türkçe ve çevrimdışı çalışan elektrik eğitim, devre çizimi ve pano yerleşim uygulaması.

## Güncel sürüm gerçeği

- **Aktif kalite/geliştirme dalı:** `v1.19.20`
- **Tamamlanmış referans sürümler:** `v1.19.0`, `v1.19.1`
- **Golden v1.18.0:** `main` üzerinde sabit tutulur ve geliştirme için kullanılmaz.
- GitHub depo ayarında default branch hâlâ `main` olduğu için **Code → Download ZIP** doğrudan kullanılırsa golden/eski kaynak gelebilir. Güncel kaynak için önce `v1.19.20` dalına geçin veya Actions içindeki güncel Windows runtime artifact'ını kullanın.
- Güncel test sayısı sabit bir README değeri değildir; son commit için **Actions → Test ve Windows ZIP** sonucu otoritedir.

## Çalıştırma

Güncel Windows runtime paketini GitHub **Actions → Test ve Windows ZIP** çalışmasının artifact bölümünden alın. ZIP'i tamamen yeni bir klasöre çıkarın ve `BASLAT.bat` dosyasını açın. Alternatif olarak `dist/index.html` dosyasını güncel Chrome / Edge ile açabilirsiniz.

Uygulamayı kullanmak için Node.js, Python, kurulum veya internet gerekmez. Geliştirici kontrolleri için Node.js 24 ve Python 3.12+ kullanılır.

> Elektrik çarpması ölümcül olabilir. Bu uygulama bir eğitim simülasyonudur. Yazılımdaki DURDUR düğmesi gerçek bir panonun enerjisini kesmez. Gerçek elektrik çalışmalarını öğretmen/yetkin kişi gözetimi olmadan yapmayın.

## Çalışma alanları

Dashboard üzerinden **Kumanda**, **Tesisat ve Dağıtım**, **Pano**, **Arduino** ve **Öğretici Modu** çalışma alanlarına erişilir. Hazır örnekler salt okunur korunur; düzenlemek için **Farklı Kaydet** ile kişisel kopya oluşturulur.

## Geliştirmeye buradan devam et

| Belge | Ne için okunmalı? |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Oturum başlangıç kuralları |
| [Kurallar ve kilitler](docs/KURALLAR_VE_KILITLER.md) | Korunacak davranışlar ve kalite kilitleri |
| [Proje haritası](docs/PROJE_HARITASI.md) | Özellik → kaynak dosyası haritası |
| [Geliştirme yöntemi](docs/GELISTIRME.md) | Test, CI, paketleme ve GitHub yöntemi |
| [Durum ve sınırlar](docs/DURUM_VE_SINIRLAR.md) | Güncel sürüm durumu ve bilinen sınırlar |
| [Talepler ve kararlar](docs/TALEPLER_VE_KARARLAR.md) | Kalıcı kullanıcı kararları |
| [Master düzeltme listesi](docs/MASTER_DUZELTME_LISTESI_V1.19.20.md) | v1.19.20 kalite backlog'u |
| [Operasyon panosu](docs/AGENT_OPERASYON_PANOSU_V1.19.20.md) | Aktif WP ve kanıt durumu |

## Kontrol ve Windows paketi

```sh
node scripts/check.cjs
node scripts/run-tests.cjs
python3 scripts/package.py
```

CI iki katmanlıdır: GitHub Actions dakika tasarrufu nedeniyle `v1.19.20` push'ları otomatik workflow başlatmaz. Doğrulama, ilgili pull request üzerinde veya anlamlı kilometre taşında elle `workflow_dispatch` ile çalıştırılır. Fast gate repo-integrity/docs/change-scope kontrolünü yapar; runtime, test, script, launcher, workflow veya diğer kalite-kritik değişikliklerde tam regresyon, G1–G4 kalite kapıları, gerçek browser smoke, Windows launcher smoke ve runtime ZIP doğrulaması çalışır.

Windows runtime paketi explicit allowlist kullanır; geliştirme testleri, ajan belgeleri ve repo bakım dosyaları kullanıcı ZIP'ine doldurulmaz. Kaynak/developer arşivi için GitHub kaynak ağacı ayrı kalır.

## Tarihsel kayıt

v1.18.0 aktarımının eski test sayıları, ilk Actions denemeleri ve önceki sürüm notları tarihsel belgelerdir; güncel release doğrulaması sayılmaz. Geçmiş kayıtlar ilgili `DOGRULAMA_*`, `YENILIKLER_*` ve docs dosyalarında korunur.

Üretici belgeleri ve ürün görsellerinin hakları ilgili sahiplerindedir. Bu depo üçüncü taraf içeriklere yeni bir lisans vermez.
