# GaviaWorks CRM — Proje Beyni

## Proje Kimliği

| | |
|---|---|
| **Proje** | GaviaWorks CRM / ERP / Operasyon Yönetim Sistemi |
| **Konum** | `~/Developer/Projects/gaviaworks-crm` |
| **Repo** | `gaviaworks-dev/gaviaworks-crm` (public) |
| **Canlı** | `https://gaviaworks-dev.github.io/gaviaworks-crm/` |
| **Tip** | Statik prototip — buildless HTML/CSS/JS, GitHub Pages |
| **Kapsam** | **SADECE ARAYÜZ.** Backend, veritabanı, gerçek API yok. |
| **Referans** | `https://gaviaworks-dev.github.io/gaviacrm/v2/` (GaviaCRM — inşaat sektörü) |
| **Şirket** | Gavia Works — 5–7 kişilik yazılım / AI / dijital danışmanlık şirketi |

## Ana Kaynak Doküman

`PROMPT.md` bu projenin **tek doğru kaynağıdır**. Harfiyen uygulanır.
Her wave öncesi ilgili bölümü tekrar okunur. PROMPT.md'deki hiçbir modül,
alan, sekme, durum, rol veya rapor "yeterince önemli değil" diye atlanmaz.

## Çalışma Modu — OTONOM

Bu proje **kesintisiz otonom modda** yürütülür:

- Beyar'a soru **sorulmaz**. Onay kapısı **yoktur**.
- Eksik bilgide durulmaz — yazılım şirketi operasyonlarına uygun makul
  varsayım yapılır ve `tasks/assumptions.md`'ye yazılır.
- Wave bitince durulmaz, sıradaki wave'e geçilir.
- İş bitene kadar devam edilir. "Devam edeyim mi?" diye sorulmaz.
- Sadece şu iki durumda durulur: (a) veri kaybı riski, (b) art arda
  3 kez çözülemeyen teknik blokaj. İkisinde de net rapor yazılır.

## Teknik Kurallar

### Stack
- Buildless: saf HTML + CSS + vanilla JS. Framework yok, npm build yok.
- `assets/css/tokens.css` — **tüm** renk/spacing/radius/shadow/type CSS
  custom property. Sıfır hardcode değer.
- `assets/js/shell.js` — GaviaCRM'deki gibi rol tabanlı shell engine
  (sol menü, üst nav, rol değiştirme, bildirim merkezi, sayfa yönlendirme).
- Mock veri `assets/data/*.js` içinde tutulur. Ekranlar arası **canonical
  data disiplini**: aynı kayıt no = her ekranda aynı değerler.

### Ortak Bileşen Zorunluluğu
Benzer ekranlar için tekrarlı kod yazılmaz. Şunlar tek bir ortak
bileşen olarak kurulur ve her sayfa onu kullanır:
- Liste bileşeni (arama + gelişmiş filtre + kolon yönetimi + sekmeler +
  toplu işlem + sayfalama + çıktı al + arşiv/pasif toggle)
- Form bileşenleri + doğrulama
- Durum etiketi (badge) sistemi
- Dosya yükleme alanı
- Aktivite geçmişi timeline'ı
- Onay akışı bileşeni
- Modal ve sağ panel (drawer)
- Boş durum / yüklenme / hata durumu
- Kart, tablo ve kanban görünüm anahtarı

### Liste Sayfası Standardı
PROMPT.md Bölüm 6 **her** liste ekranında birebir uygulanır. İstisna yok.
Filtre değişince sayfalama 1'e döner. Sayfa/filtre/sıralama URL'de korunur.

### Yasaklar
- Sahte buton, çalışmayan aksiyon, `href="#"` bırakmak **yasak**.
  Hedef sayfa henüz yoksa `data-wip` kullan, sayfa doğunca `href`'e çevir.
- İnşaat sektörü terminolojisi (şantiye, taşeron, hakediş, saha) **yasak**.
  PROMPT.md Bölüm 1'deki dönüşüm tablosu uygulanır.
- GaviaCRM ekranlarını isim değiştirip kopyalamak yasak — bilgi mimarisi
  yazılım şirketine özgü kurulur.
- Brand token cross-contamination yasak.
- Modal/overlay markup'ı `.page-main` içine konmaz (stacking context).
- `git add -A` yasak — dosyalar tek tek isimle stage edilir.
- `git commit --no-verify` yasak.
- Kare görsel: `img` değil, `div + background-image: cover/center`.
- CSS render genişliği esas — 2x retina çarpma yok.

## Git

- Doğrudan `main`. Repo public, içinde secret yok (statik prototip).
- Stage: dosya adıyla tek tek.
- Commit mesajı: **Conventional Commits**, İngilizce, kişi ismi yok.
  `feat(customers): add customer list screen with tabs and filters`
- Atomicity: "ve"siz tek cümlede anlatamıyorsan commit'i böl.
- `tasks/` ve `docs/screenshots/` gitignored.
- Bu projede otonom mod aktif: **her wave sonunda commit + push serbest**,
  ayrıca izin istenmez.
- Push: `! git push origin main`
- GitHub Pages'te "push = live" varsayılmaz — curl ile doğrulanır.

## QA

- Playwright headless, **1440 + 768 + 390px**.
- Screenshot'lar gitignored `docs/screenshots/`'a — CC'nin öz-doğrulaması
  içindir, Beyar'a sunum değildir.
- Her wave sonunda kısa yazılı rapor: değişen dosyalar, eklenen bileşenler,
  oluşturulan ekranlar, tamamlanan akışlar, eksik teknik noktalar (dürüstçe),
  test edilmesi gereken alanlar.

## tasks/ Dosyaları

| Dosya | İçerik |
|---|---|
| `research.md` | GaviaCRM referans incelemesi, korunacak/değişecek yapılar |
| `plan.md` | Modül haritası, sayfa haritası, wave planı — işaretlenerek ilerler |
| `components.md` | Component sözlüğünün tek doğru kaynağı |
| `assumptions.md` | Yapılan tüm varsayımlar, gerekçeleriyle |
| `lessons.md` | Her hatadan çıkan kural |
| `handoff.md` | Context %75'e inince yazılır |

## Context

- Kalan context %75'e inince `tasks/handoff.md` yazılır, Beyar `/clear` yapar.
- `claude --continue` sonrası ilk talimat: handoff dosyasını oku.
