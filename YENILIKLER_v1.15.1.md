# Devre Tasarım Stüdyosu v1.15.1

Bu paket v1.15.0 üzerine güç kaynağı bağlantısı, kablo rengi ve multimetre probu düzeltmelerini içerir. Uygulama çevrimdışı çalışır; önceki sürüm klasörüne ihtiyaç duymaz.

## Bağlantılar

- 24 V güç kaynağının **L ve N girişleri 220 V AC hattına** bağlanabilir. Nötr kablosu önce cihazdan/klemens tarafından çizilmiş olsa bile gerçek hatta bağlanınca nötr adını ve rengini devralır.
- Güç kaynağı, L/N beslemesi tamamlanmadan 24 V çıkış üretmez. Önündeki anahtar açılınca çıkış kesilir.
- Son devre kablosu silinen veya başka renge geçirilen rengin kilidi kalkar. Eski kayıt açılırken de kullanılmayan renk kilitleri temizlenir.
- Mevcut bağlantıların hat kimliği, ayrı besleme çıkışları ve pano hat ayrımları korunur.

## Esnek ölçüm probları

- Kalın kırmızı ve siyah prob kabloları, geniş ve yumuşak kıvrımlarla çizilir. Grid ve devre elemanı engellerinden bağımsızdır.
- Ölçü aleti, prob kabloları ve uçlar devrenin üst katmanında kalır. Ölçü aleti hareketi, devre elemanlarını ve normal kablo yollarını değiştirmez.
- Kabloyu tutup sürüklemek kıvrımı değiştirir; uçları yuvalardan koparmaz. Sağ tık menüsünden prob kablosunun kalınlığı ayrıca seçilebilir.
- Probun metal ucu, terminallere, birleşim noktalarına ve **mevcut kablonun herhangi bir noktasına** temas ettirilebilir. Mavi/beyaz işaret temas kurulduğunu gösterir.
- Temas, asıl kabloyu bölmez veya yeni birleşim noktası oluşturmaz. Prob uzaklaşınca ya da ölçülen kablo silinince temas biter.
- Prob rengi ölçülen hattın rengini veya kimliğini değiştirmez. Örneğin kırmızı prob hem L1 hem +24 V ölçümünde kullanılabilir.
- Serbest konumlar, kıvrımlar ve kablo temasları proje dosyasında saklanır.

## Deneme

1. ZIP'i yeni bir klasöre tamamen çıkarın ve `BASLAT.bat` dosyasını çalıştırın.
2. `Ornekler/220V_24V_Esnek_Prob_v1.15.1.odsdevre` dosyasını açın.
3. 3D görünümde simülasyonu başlatın; 200 V DC kademesinde 24.0 V okunur.
4. Ölçü aletini ve kablolarını sürükleyin, prob uçlarını farklı hatlara değdirin.

Gerilim için uygun AC/DC kademesini seçin. Kabloya iki noktadan temas etmek gerilim farkını ölçer; akım ölçümü için ölçü aleti seri bağlanmalıdır. Uygulamadaki ölçümler önceki sürümün basitleştirilmiş devre modelini kullanır.

## Doğrulama

Bağlantı kurma/silme, renk kilitleri, gerçek uygulama olaylarıyla canlı prob sürükleme, kablo teması, konum/kıvrım kaydı, devre yollarının korunması ve mevcut pano davranışları otomatik testlerle kontrol edildi. Görünüm uygulamanın SVG çıktısından işlendi ve incelendi. Bu ortamda Windows Chrome/Edge üzerinde doğrudan çalıştırma yapılmadı. Sayısal sonuçlar ve komut `DOGRULAMA_v1.15.1.json` dosyasındadır.
