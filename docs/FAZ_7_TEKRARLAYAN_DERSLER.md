# Faz 7 — tekrarlayan dersler

Dal: `Devre-Tasarim-Studyosu-1.19.1`  
Tarih: 2026-10-03

## Karşılaştırma yöntemi

Kaynak ve outline dersleri konu içinde karşılaştırıldı. Başlık karşılaştırmasında yalnız numaralı bölüm/temrin önekleri kaldırılır; “2 paralel buton”, “3 paralel buton”, “14 W” ve “100 W” gibi teknik miktarlar korunur.

Bir tekrarın kaldırılması için konu yanında ders türü, komponent kimlikleri/değerleri, pin-pin kablo topolojisi, quiz sorusu/yanıtı, öğrenme kazanımı, açıklama, başlangıç adımları ve malzeme gerekçelerinin aynı olması aranır. Aynı başlık veya benzer malzeme listesi tek başına kaldırma nedeni değildir.

## Sonuç

İçerik imzası aynı olan **10 yinelenen kayıt** birleştirildi. Kalan ders sayısı **1.675**. Birleştirilen örnekler: aynı termokupl ve PT100 uygulama devrelerinin tekrar kayıtları; ADC/DAC temrinlerinin aynı konu kartları; PLC-frekans invertörü, pano izolasyon testi, enstrümantasyon yükselteci, Schmitt trigger ve pano/PLC bağlantı şeması tekrarları.

Öğrenme amacı veya uygulaması farklı olanlar korundu:

- İki ve üç paralel zil butonu: devrelerde buton sayısı/bağlantı sayısı farklı.
- Sensörlerde enerji dönüşümü, otomobil sensörleri, sıcaklık sensörü seçimi, Hall ve optik sensör konuları: konu kartları ile gerçek bağlantılı sensör etkinlikleri farklı amaç taşır.
- 14 W ve 100 W ses yükselteci başlıkları teknik güç değerleri farklı olduğundan ayrı kaldı.

Tekrar seçimi `dist/tutorial-pedagogy.js` içinde konu ve tam ders içeriği karşılaştırmasıyla yapılır. `tests/lesson-circuit-audit-v119.test.cjs` birleştirilen kayıtları ve özellikle korunması gereken farklı öğrenme amaçlarını doğrular.

## Doğrulama ve sınırlar

- Öğretici, ders-devre ve pedagojik hedefli kontroller: **37/37 geçti**.
- `node scripts/check.cjs`: **başarılı**, 728 kütüphane tanımı ve 58 korumalı proje.
- `git diff --check`: temiz.

**Faz 7 tamamlandı.** Faz 8’e geçilmedi.
