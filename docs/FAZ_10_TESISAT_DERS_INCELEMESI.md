# Faz 10 — Tesisat dersleri incelemesi

Dal: `Devre-Tasarim-Studyosu-1.19.1`
Tarih: 2026-10-03

## Kapsam

Öğretici Modu'ndaki 16 Tesisat dersi ve 230 VAC adi anahtar dersi incelendi:

- 1 adet adi anahtar ile aydınlatma
- 4 adet komütatör
- 4 adet vaviyen
- 4 adet ara vaviyen
- 4 adet zil butonu

Her devrenin besleme, anahtar/buton ve yük uçları kontrol edildi. Gerçek simülasyon çözücüsünde anahtar durumları tarandı: adi anahtar için 2; komütatör için 4; vaviyen için 4; ara vaviyen için 8; zil dersleri için toplam 30 durum. 48 durumun tamamında çözücü kararlı kaldı ve yüklerin beklenen açma/kapama davranışı görüldü.

## Düzeltmeler

- Komütatör açıklamasındaki “iki faz kolu” ifadesi tek fazlı devreyi doğru anlatacak biçimde düzeltildi: faz iki bağımsız anahtarlanan kola ayrılır; nötr lambalara doğrudan döner.
- “Işıklı çağırma butonu” kullanılan zil dersinde komponentin yalnızca 13–14 çağrı kontağı bulunduğu, ışık halkasının bu ders devresinde görsel olup elektriksel olarak simüle edilmediği özet ve açıklamada açıkça belirtildi. Simüle edilmeyen gösterge çalışıyormuş gibi sunulmuyor.
- Tüm Tesisat grubu derslerinin anahtar/buton doğruluk tablolarını ve bu gösterge sınırını koruyan regresyon testi eklendi.

## Doğrulama ve sınır

- `node --test tests/installation-tutorial-v119.test.cjs tests/tutorial-mode-v119.test.cjs tests/tutorial-pedagogy-v119.test.cjs`: **36/36 geçti**.
- Bu kontrol gerçek çözücü ve ders verilerini kullanır; gerçek Windows/Edge ekran etkileşimi veya görsel yerleşim kabulü değildir.
- Faz 10'un diğer ders grupları ve kullanıcı gözünden son kabulü devam ediyor; bu kayıt Faz 10'un tamamlandığı anlamına gelmez.
