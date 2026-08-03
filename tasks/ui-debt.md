# ui-debt.md — Arayüz Borç Defteri

> Ekran üretimi sırasında fark edilen ama **o an düzeltilmeyen** arayüz sorunları.
> Hiçbiri nokta yamasıyla kapatılmaz — hepsi **plan.md → FAZ: UI ve UX KALİTE GEÇİŞİ**
> içinde, ortak katmanda kök nedenden çözülür.
>
> **Genel kural:** Referans projeden **biçim, oran, yerleşim ve etkileşim davranışı** alınır;
> **renk, tipografi ve gölge değerleri ALINMAZ** — onlar `assets/css/tokens.css`'ten gelir.
> Hiçbir çözümde hardcode renk kullanılmaz.

---

## UID-01 · Rail collapse çentiği referansa göre bozuk

**Nerede:** Tüm ekranlarda sol rail ile içerik arasındaki daralt/genişlet tutamağı.

**Sorun:** Tutamak açık renkli, kenarlıklı ve yüzen bir pastil gibi duruyor; arkasındaki
vurgu çizgisiyle üst üste biniyor, sidebar ile arasında görünür bir dikiş oluşuyor.

**Referans:** `https://gaviaworks-dev.github.io/gaviacrm/v2/crm-panel-ajanda.html`
adresindeki tutamak.

**ÖNEMLİ AYRIM — referanstan SADECE biçim ve davranış alınacak, renk ALINMAYACAK:**

- **Alınacak olan:** geometri ve oturuş — tutamak sidebar yüzeyinin devamı gibi, tam yapışık,
  sadece dışa bakan kenarı yuvarlak, kenarlıksız, dikişsiz; ikon optik olarak ortalanmış;
  genişlik, yükseklik ve köşe yarıçapı oranları.
- **Alınmayacak olan:** referansın renk paleti. Renkler bu projenin kendi `tokens.css`
  değerlerinden gelecek, hardcode renk yazılmayacak. Tutamak, bitişik olduğu yüzeyin token
  rengini kullanacak ki uzantısı gibi görünsün; hover ve odak durumları da bu projenin
  token'larıyla kurulacak.

**Kök neden tahmini:** Tutamak sidebar bileşeninin parçası değil, ayrı konumlanmış bir öğe
olarak kurulmuş.

**Çözüm (kapanış fazında):** Tutamak sidebar yüzeyinin uzantısı olarak yeniden kurulacak,
tıklama alanı en az 24×44 px olacak, hover ve odak durumu olacak, içerikle çakışmayacak.
