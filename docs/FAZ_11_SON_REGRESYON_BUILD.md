# FAZ 11 — SON REGRESYON / BUILD

Durum: **KABUL EDİLDİ**

Başlangıç: 2026-10-04  
Çalışma dalı: `v1.19.1`

## Geçiş koşulu

Kullanıcının “faz11 i yap” talebi, kilitli manifestteki Faz 10 kullanıcı kontrol noktasının kabulü ve Faz 11'e geçiş onayı olarak kaydedildi.

Faz 10 durumu: **KABUL EDİLDİ**

## Manifest kapsamı

Faz 11'de yalnız aşağıdaki son doğrulamalar yapılır:

- eski testler
- yeni testler
- ders testleri
- kütüphane testleri
- simülasyon testleri
- build
- paketleme
- GitHub Actions

Yeni özellik veya kapsam eklenmez.

## Son doğrulama planı

- [x] `node scripts/check.cjs`
- [x] ilk açılış / güvenlik smoke testi
- [x] tam regresyon test paketi
- [x] Windows ZIP oluşturma
- [x] ZIP çıkarma doğrulaması
- [x] artifact üretimi
- [x] GitHub Actions sonucu
- [x] paket/test sayıları ve run kimliği kaydı
- [x] `v1.19.0` dalının değişmediğinin doğrulanması

## Kontrol noktası 11

Teknik doğrulamalar temiz geçse bile Faz 11 **KONTROL BEKLİYOR** durumuna alınır. Son kullanıcı kabulü olmadan **KABUL EDİLDİ** yapılmaz.


## Build sürüm kimliği düzeltmesi

Faz 11 paketleme denetiminde çalışma dalı/dashboard 1.19.1 olmasına rağmen `dist/app.js` içindeki `APP_VERSION` değerinin 1.19.0 kaldığı tespit edildi. Paketleyici ZIP adını bu değerden ürettiği için son build kimliği yanlış olacaktı.

- `APP_VERSION`: **1.19.1**
- Son Windows paketi `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip` adıyla üretilmelidir.
- Bu düzeltmeden sonra Faz 11 tam CI/build turu yeniden çalıştırılacaktır.


## İlk final CI bulgusu

İlk v1.19.1 final run `37189159207`, `scripts/check.cjs` aşamasında **“Kullanım sürümü tutarsız”** nedeniyle durdu.

Kök neden:
- `dist/app.js`: 1.19.1
- `KULLANIM.txt`: 1.19.0

Düzeltme:
- `KULLANIM.txt` sürüm başlığı ve dashboard kullanım akışı 1.19.1 ile eşitlendi.
- Kullanım belgesi beş ana kartı (Kumanda, Tesisat, Pano, Arduino, Öğretici) ve güncel canlı düzenleme davranışını açıklar.
- Final CI bu düzeltmeden sonra yeniden çalıştırılacaktır.


## Final Faz 11 doğrulaması

Doğrulanan kod HEAD'i: `25bd47ded10c86fd6cda02fef5c0a33ad0a9d244`

GitHub Actions:
- Run: `37189269404`
- Sonuç: **success**
- Job: `validate-and-package` — **success**

Kontroller:
- `node scripts/check.cjs`: **success**
- İlk açılış / güvenlik smoke testi: **success**
- Tam regresyon: **451 / 451 geçti, 0 hata**
- Windows ZIP oluşturma: **success**
- ZIP CRC: **passed**
- Çıkarılan dosya hash karşılaştırması: **passed**
- Artifact üretimi: **success**

Windows paketi:
- Dosya: `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip`
- Paketlenen dosya sayısı: **635**
- ZIP boyutu: **84,668,739 byte**
- SHA256: `6a793d0b925f5b6784f7c87077a7f66f791297c9311680be1b76a7c0f33b3f22`
- Artifact: `Devre-Tasarim-Studyosu-Windows`
- Artifact ID: `11298685776`

Sürüm tutarlılığı:
- Uygulama `APP_VERSION`: **1.19.1**
- `KULLANIM.txt`: **1.19.1**
- Dashboard/başlatıcı: **1.19.1**
- Kilitli `v1.19.0` dalı değiştirilmedi; HEAD `6846c6ee7df1c2f194eabf4fd58035d4423e8508`.

## Kontrol Noktası 11 sonucu

Teknik Faz 11 işleri tamamlandı.

**Faz 11 durumu: KONTROL BEKLİYOR**

Kilitli manifest gereği son kullanıcı açıkça kabul etmeden Faz 11 **KABUL EDİLDİ** durumuna geçirilmez.


## 2026-10-04 · Kullanıcı kabul bulgusu — “Devreyi yeniden kur” rehberi

Faz 11 son kullanıcı kontrolünde **Buton ile LED / lamba yakma · 1** dersinde “Devreyi yeniden kur” seçildiğinde terminal yönlendirmeleri başlamadı. Alt çubukta `Bağlantı 0 / 0 · Devre tamamlanıyor…` görülüyordu.

Kök neden:
- Temel Öğretici dersleri gerçek kablolar ve rehber adımlarıyla üretiliyor; ancak son `tutorial-pedagogy.js` geçişinde `kind` alanı eski temel derslerde tanımlı değilse `steps` listesi yanlışlıkla sıfırlanıyordu.
- Sonuçta devre kabloları mevcut olmasına rağmen yeniden-kurma oturumu hedef terminal çiftlerini göremiyordu.

Düzeltme:
- Nihai pedagoji geçişi, gerçekten rehberli/demo olan kablolu dersleri `wiring` olarak korur ve `steps` listesini gerçek `project.wires` üzerinden yeniden üretir.
- `tutorial-mode.js` çalışma zamanı savunması, eski/stale ders nesnesinde kablolar mevcutken rehber adımları eksik veya uyumsuzsa adımları kablolardan yeniden kurar.
- Tarayıcı cache anahtarları `tutorial-pedagogy.js?v=1.19.1-pedagogy15` ve `tutorial-mode.js?v=1.19.1-guidance1` olarak yenilendi.
- İki farklı DC kaynak derslerinde bilinçli elektrik adaları ayrıca doğru sayıyla işaretlendi; izole yük ve röle izolasyonu örnekleri iki ayrı ada olarak audit edilir.

Hedefli doğrulama:
- Run `37192886772`: **success**
- Öğretici + pedagoji + devre-audit: **47 / 47 başarılı, 0 hata**
- Aynı run içinde Windows ZIP ve artifact üretimi de başarılıdır.

Bu kullanıcı bulgusu nedeniyle önceki final run artık son kabul kanıtı sayılmaz; aşağıdaki yeni tam run onun yerini alır.

## Faz 11 final doğrulaması — Öğretici rehber düzeltmesi sonrası

Doğrulanan kod HEAD'i: `d0d523dbaa67ba5e25224427b5d7e4c7d375c651`

GitHub Actions:
- Run: `37192774170`
- Sonuç: **success**
- Job: `validate-and-package` — **success**

Kontroller:
- `node scripts/check.cjs`: **success**
- İlk açılış / güvenlik smoke testi: **success**
- Tam regresyon: **454 / 454 geçti, 0 hata**
- Windows ZIP oluşturma: **success**
- ZIP CRC: **passed**
- Çıkarılan dosya hash karşılaştırması: **passed**
- Artifact üretimi: **success**

Windows paketi:
- Dosya: `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip`
- Paketlenen dosya sayısı: **635**
- ZIP boyutu: **84,671,038 byte**
- SHA256: `623e0bc530b106cdfd8254cdba13c869add64cf105936ddd029885fc17ed8ea8`
- Artifact: `Devre-Tasarim-Studyosu-Windows`
- Artifact ID: `11299852031`

Kilitli `v1.19.0` dalı değiştirilmedi; HEAD `6846c6ee7df1c2f194eabf4fd58035d4423e8508`.

## Güncel Kontrol Noktası 11

Teknik düzeltme ve tekrar doğrulama tamamlandı.

**Faz 11 durumu: KONTROL BEKLİYOR**

Gerçek Windows/Edge kullanıcı akışında özellikle **Buton ile LED / lamba yakma · 1 → Devreyi yeniden kur** adımında `Bağlantı 1 / 4` yönlendirmesinin ve yanıp sönen iki hedef terminalin görünmesi kullanıcı tarafından yeniden doğrulanmalıdır. Bu doğrulama olmadan Faz 11 **KABUL EDİLDİ** yapılmaz.


## 2026-10-04 · Kullanıcı kabul bulgusu — Windows başlatıcı

Kullanıcı GitHub dal ekranından indirdiği ZIP içindeki `BASLAT.bat` dosyasına çift tıkladığında uygulamanın açılmadığını bildirdi.

Kök neden / risk:
- GitHub **Code → Download ZIP** kaynak arşivinde `BASLAT.bat` ZIP penceresinin içinden doğrudan çalıştırılırsa Windows yalnız BAT dosyasını geçici klasöre çıkarabilir; yanındaki `dist` ağacı bulunmaz.
- Eski başlatıcı ayrıca yalnız Windows'un varsayılan `.html` dosya ilişkilendirmesine güveniyordu.
- Önceki CI Windows paketi üretse de `BASLAT.bat` gerçek Windows `cmd.exe` üzerinde çalıştırılmıyordu.

Düzeltme:
- `BASLAT.bat`, ZIP içinden/eksik çıkarılmış çalıştırmayı açık hata ve **Tümünü ayıkla / Extract All** talimatıyla bildirir.
- Başlatıcı Microsoft Edge'i standart Program Files/LocalAppData yollarında arar, sonra Chrome'u dener; ikisi de bulunamazsa Windows varsayılan HTML uygulamasına düşer.
- Tarayıcı başlatma başarısızsa `dist\index.html` yolu açıkça gösterilir ve pencere kapanmadan hata verir.
- Kökte alternatif `BASLAT.html` eklendi; doğrudan `dist/index.html`e yönlendirir.
- `KULLANIM.txt`, GitHub kaynak ZIP ile Actions artifact arasındaki farkı ve ZIP'in mutlaka tamamen ayıklanması gerektiğini açıklar.
- Paketleyici `BASLAT.html` dosyasını da zorunlu teslim dosyası olarak doğrular.
- GitHub Actions'a ayrı `windows-launcher-smoke` işi eklendi; `BASLAT.bat` gerçek `windows-latest` / `cmd.exe` ortamında çalıştırılır.

Final doğrulama:
- Kod HEAD: `77348a19f4c15db68cd89cfc429a1394a5f8e0cf`
- GitHub Actions run: `37194288287` — **success**
- `windows-launcher-smoke`: **success**
- `validate-and-package`: **success**
- Tam regresyon: **455 / 455 başarılı, 0 hata**
- Windows ZIP / CRC / çıkarılan dosya hash doğrulaması: **success**
- Paket: `Devre_Tasarim_Studyosu_v1.19.1_Windows.zip`
- Paketlenen dosya sayısı: **636**
- ZIP boyutu: **84,674,296 byte**
- SHA256: `3433fce9323713d1ff7ded56bc5e3b83f0703b1d300671eac2428a01dd97bfba`
- Artifact: `Devre-Tasarim-Studyosu-Windows`
- Artifact ID: `11300362804`

**Faz 11 durumu: KONTROL BEKLİYOR.** Kullanıcı güncel paketi tamamen ayıklayıp `BASLAT.bat` veya `BASLAT.html` ile gerçek Windows/Edge akışını doğrulamadan Faz 11 kabul edilmiş sayılmaz.


## 2026-10-04 · Kullanıcı kabulü ve branch sadeleştirme

- Kullanıcı Faz 11'i tamamlanmış olarak kabul etti.
- **Faz 11 durumu: KABUL EDİLDİ.**
- GitHub branch yapısı 44 daldan 3 kalıcı dala indirildi: `main` (v1.18.0), `v1.19.0` ve `v1.19.1`.
- 40 adet geçici `ci/*` dalı, yinelenen `golden/v1.18.0` dalı ve eski uzun adlı `Devre-Tasarim-Studyosu-1.19.1` dalı kaldırıldı.
- `main` dalı yeniden v1.18.0 golden commit'i `e00b6fcf0ea3eb721eae8285beb7052573b61373` üzerine sabitlendi.
- `v1.19.0` değişmeden korundu; `v1.19.1` güncel indirme ve geliştirme dalıdır.
- Tek kullanımlık branch temizlik run'ı `37195483833` başarıyla tamamlandı ve temizlik workflow dosyası daha sonra repodan kaldırıldı.
