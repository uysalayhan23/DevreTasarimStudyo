# Tarihsel kayıt indeksi

Bu belge, repo kökünde korunmaya devam eden eski sürüm kayıtlarını **güncel durum dosyalarından ayırmak** için oluşturulmuştur. Dosyalar geçmiş sürümlerde kullanılan bağlantıları ve hash/kanıt referanslarını kırmamak için fiziksel olarak taşınmamıştır.

## Güncel gerçek için kullanılacak dosyalar

- `README.md` — aktif sürüm/dal ve kullanıcı indirme yolu.
- `docs/DURUM_VE_SINIRLAR.md` — güncel kapsam ve açık sınırlar.
- `docs/GELISTIRME.md` — güncel geliştirme, CI ve paketleme yöntemi.
- `docs/MASTER_DUZELTME_LISTESI_V1.19.20.md` — kalite backlog'u.
- `docs/AGENT_OPERASYON_PANOSU_V1.19.20.md` — aktif iş paketi/kanıt durumu.
- `V1.19.20_*_LOCKED.md` — kilitli kalite/ajan politikaları.

## Tarihsel doğrulama kayıtları

Aşağıdaki dosyalar ilgili eski sürümün anlık doğrulamasıdır; güncel `v1.19.20` HEAD'inin test sonucu değildir.

- `DOGRULAMA_v*.json`
- `DOSYA_LISTESI_v*.json`
- `final-v*.txt`
- `tests/SONUC_v*.tap` benzeri tarihsel test çıktıları

## Tarihsel sürüm notları

- `YENILIKLER_v*.md`
- `GORSEL_KAYNAKLARI_v*.md`
- `GORSEL_VE_TEKNIK_KAYNAKLAR_v*.md`
- Eski sürüme özel kök manifest/iş-sırası belgeleri

Bu belgelerde geçen test sayıları, aktif dal adı veya paket boyutu yalnız yazıldıkları sürüm için geçerlidir.

## Ürün/kaynak kayıtları

- `URUN_GORSEL_KAYNAKLARI.txt`
- `SEMBOL_KAYNAKLARI.txt`
- `SEMBOL_ESLESTIRMELERI.json`
- `Belgeler/**`

Bu dosyalar tarihsel veya kaynak kanıtı olabilir. Teknik doğrulama seviyesi için güncel `sourceAuthority`, `sourceStatus`, `technicalSource`, orientation ve physical metadata sözleşmeleri esas alınır.

## Neden dosyalar taşınmadı?

Eski sürüm notları ve doğrulama kayıtları birbirlerine kök yollarıyla referans verebilir. WP-014 kapsamında amaç, görünür current-truth ayrımını sağlamak ve yeni çalışmanın yanlışlıkla eski dosyayı otorite saymasını önlemektir. Fiziksel taşıma ancak ayrı bir referans-migration paketi ve tam link/regresyon kontrolüyle yapılmalıdır.

## GitHub default branch notu

Repo ayarında default branch şu anda `main` ve bu dal golden v1.18.0 referansıdır. Bu ayar değişene kadar güncel kaynak için açıkça `v1.19.20` seçilmeli veya Actions runtime artifact'ı kullanılmalıdır.
