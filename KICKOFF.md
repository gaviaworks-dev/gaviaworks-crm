# CC Başlangıç Promptu — GaviaWorks CRM

Aşağıdaki blok, proje klasöründe `claude` başlatıldıktan sonra CC'ye
olduğu gibi yapıştırılır.

---

```
Bu klasör GaviaWorks CRM projesinin kökü. Sıfırdan başlıyoruz.

ÖNCE ŞUNLARI OKU:
Kök dizindeki CLAUDE.md dosyasını oku — proje kuralları, teknik stack,
yasaklar ve git disiplini orada.
Kök dizindeki PROMPT.md dosyasını BAŞTAN SONA, satır satır, derinlemesine oku.
O doküman bu projenin tek doğru kaynağı ve harfiyen uygulanacak.
Hiçbir modülü, alanı, sekmeyi, durumu, rolü veya raporu atlama.

SONRA REFERANSI İNCELE:
Referans proje şu adreste: "https://gaviaworks-dev.github.io/gaviacrm/v2/"
Playwright ile aç, tüm ekranlarını gez, 1440 ve 390 px genişlikte incele.
Sol menü, üst nav, rol tabanlı dashboard, liste sayfası standardı, sekmeli
detay sayfaları, form düzenleri, durum etiketleri, filtre ve kolon yönetimi,
modal ve sağ panel kullanımı, aktivite geçmişi — bu yapıları çıkar.
Bulgularını "tasks" klasöründeki research.md dosyasına yaz.
Bu bir görsel ve bileşen referansıdır; inşaat sektörü içeriği KOPYALANMAZ,
PROMPT.md Bölüm 1'deki dönüşüm tablosuna göre yazılım şirketine uyarlanır.

KAPSAM:
Bu aşamada SADECE ARAYÜZ yapılıyor. Backend, veritabanı, gerçek API yok.
Buildless statik prototip: saf HTML + CSS + vanilla JS, GitHub Pages'te
yayınlanacak. Mock veri JS dosyalarında tutulacak.

ÇALIŞMA ŞEKLİ — BU ÇOK ÖNEMLİ:
Bu iş tam otonom yürütülecek. Bana hiçbir şey sormayacaksın.
Onay beklemeyeceksin. "Devam edeyim mi?", "Şunu mu tercih edersiniz?",
"Wave 1 bitti, bakar mısınız?" gibi hiçbir soru sormayacaksın.
Eksik bilgi bulursan durma — yazılım şirketlerinin gerçek çalışma
süreçlerine uygun makul varsayım yap, varsayımı "tasks" klasöründeki
assumptions.md dosyasına yaz ve devam et.
Bir wave bitince durma, otomatik olarak sıradaki wave'e geç.
İş tamamen bitene kadar durmayacaksın. Bulana kadar devam et, bitene
kadar devam et. Tam iş çıkar, yarım bırakma.
Sadece iki durumda dur: veri kaybı riski, ya da art arda 3 denemede
çözemediğin teknik blokaj. İkisinde de net bir rapor yaz.

YAPILACAK SIRA:
1. research.md — GaviaCRM referans incelemesi
2. plan.md — modül haritası, kullanıcı rolleri ve yetki matrisi,
   menü ve sayfa haritası, veri modeli, wave planı
3. components.md — ortak bileşen sözlüğü
4. tokens.css — token tabanlı tasarım sistemi, sıfır hardcode değer
5. shell.js — rol tabanlı shell engine (sol menü, üst nav, rol değiştirme,
   bildirim merkezi, routing)
6. Wave 1: giriş ekranı + rol bazlı dashboard'ların tamamı
   (Şirket Sahibi, Satış, Proje Yöneticisi, Personel, İK, Satın Alma)
7. Wave 2+: PROMPT.md'deki modülleri Faz 1'den başlayarak sırayla ekle —
   müşteri adayları, müşteriler, referans/yönlendiren kişi, satış pipeline,
   ön analiz, teklif, projeler, gelişmiş görev yönetimi, departmanlar arası
   iş talebi, sohbet, personel, izin, zaman kaydı, demirbaş ve zimmet,
   araç ve filo, satın alma, destek, toplantı ve ajanda, dokümanlar,
   raporlama merkezi, bildirim merkezi, ayarlar ve yetkilendirme.

KALİTE ŞARTLARI:
Sahte buton ve çalışmayan aksiyon bırakma. Ekranlar arasında gerçek
navigasyon kur. Form doğrulamalarını yaz. Her sayfada boş durum, yüklenme
durumu ve hata durumu olsun. Bütün liste sayfaları PROMPT.md Bölüm 6'daki
ortak standardı birebir kullansın. Benzer ekranlar için tekrarlı kod yazma,
ortak bileşen kur. Aynı kayıt numarası her ekranda aynı değerleri göstersin.
Responsive: 1440, 768 ve 390 px'de çalışsın.

HER WAVE SONUNDA:
Playwright ile 1440, 768 ve 390 px'de kendi ekranlarını doğrula.
Screenshot'ları "docs/screenshots" klasörüne at (gitignored, bana sunma).
plan.md'de biten maddeleri işaretle.
Değişen dosyaları tek tek isimle stage et, Conventional Commits formatında
İngilizce commit at ve main'e push et — bunun için izin isteme.
Kısa yazılı rapor yaz: eklenen ekranlar, eklenen bileşenler, tamamlanan
akışlar, eksik kalan teknik noktalar (dürüstçe), test edilmesi gerekenler.
Sonra durmadan bir sonraki wave'e geç.

Başla.
```
