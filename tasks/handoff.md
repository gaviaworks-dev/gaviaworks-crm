# Handoff — Cloud Turu (Faz 0 → uygulama)

**Son güncelleme:** bu oturum · **Dal:** `main` · **Canlı:** her commit push edildi, yarım iş push edilmedi.

## Nerede kaldık

Faz 0 (analiz) kapandı ve **uygulama başladı**. Kullanıcı "durma, deploy edilebilir hâle gelene kadar koş" dedi; 17 blokaj sorusu ADR olarak karara bağlandı ve üç öncelikli kırık kapatıldı.

## Okunacak defterler (bu sırayla)

| Dosya | Ne için |
|---|---|
| `tasks/cloud-talimati.md` | Şartname — tek doğruluk kaynağı (843 satır, 23 bölüm) |
| `tasks/cloud-envanter.md` | 519 madde, numaralı |
| `docs/P-cloud-gap-analizi.md` | Madde madde ölçüm + dört sayı |
| `tasks/cloud-kararlar.md` | **17 ADR** — verilen kararlar ve geri alma yolları |
| `tasks/cloud-plan.md` | 23 iş paketi, §22'nin yedi başlığıyla |
| `tasks/cloud-acik-sorular.md` | 50 kararlık madde (17'si ADR oldu, 33'ü açık) |
| `tasks/lessons.md` | **L-37 · L-38 · L-39** bu turda eklendi |

## Bitmiş iş paketleri

| Paket | Durum | Kanıt |
|---|---|---|
| P0-00 Faz 0 çıktıları | ✅ | beş belge, 519 madde ölçüldü |
| P1-01 Merkezî geçiş motoru | ✅ | `GV.flow`, 14 varlık, `tasks/qa/flow.js` 0 bulgu |
| P1-03 Onay motoru | ✅ | `GV.approval`, zincir 1/3→3/3 ilerledi, kaynak kayıt geçti |
| P1-05 Finansal kanonik kaynak | ✅ | `DB.paymentAllocations`, tek `GV.fin.balance` |
| P1-06 İş takvimi / SLA | ✅ (motor) | `GV.calendar`, `DB.holidays`, bekleme politikası |
| ADR-07 Tarih bilinci | ✅ | maaş 2× → geçmiş maliyet sabit (406.059) |
| Ekran göçü: teklif · satın alma · sipariş · destek · değişiklik | ✅ | 16 ekran, sözdizimi 16/16 temiz |

## Yarım kalan / sıradaki

1. **Proje ekran grubu** — `app-proje*.html`, `app-proje-hata*.html`, `app-proje-teslim*.html` bir ajanda açıktı. **Commit edilmedi.** Devralırken önce `git status` ile diskteki hâli ölç, `python3 <scratchpad>/syn.py <dosyalar>` ile sözdizimini doğrula, sonra commit et.
2. **P1-02 Ortak eylem penceresi** (`GV.action`) — henüz yok. Ekranlar kendi modallarını kuruyor; `app-panel-onaylar.html`'deki `kararModal` bunun prototipi, ortak bileşene çıkarılmalı.
3. **P1-04 Tek audit defteri** — `DB.logs` hâlâ ayrı yaşıyor, `GV.audit` yok.
4. **P1-07 Veri kalitesi sayfası**, **P1-08 Entegrasyon hata kuyruğu**, **P1-09 Notlarım testleri** — başlanmadı.
5. **P2-01 CreateEditPage** (sekme + sağ panel) — `GV.form` hâlâ sekme desteklemiyor.
6. **P3-05 Tahsilat formu** — `app-tahsilat-form.html` hâlâ yok; motor (`GV.fin.tahsisEt`) hazır, ekran eksik.
7. **P4-01/02/03** — ReportRegistry, export, Notlarım modülü.

## Ortak katmanın yeni yüzeyi

```
GV.flow      gec · adimlar · kural · kayit · denetle        (durum geçişi)
GV.gates     projeAktif · projeTeslim · projeKapanis ·
             sozlesmeAktif · teklifOnAnaliz · teslimKritikHata ·
             izinBakiye · destekKota                        (engelleyici kapılar)
GV.approval  karar · adim · zincir · bekleyen · tazeleSayaclar
GV.fin       balance · odemeDurum · gecikti · tahsisEt ·
             tahsisKaldir · tahsilEt · tahsilGeriAl · tazeleHepsi
GV.calendar  isGunu · mesaiDakika · gecenDakika ·
             beklemeBaslat · beklemeBitir
GV.hr        icMaliyet(kod, tarih) · kayitOrani
GV.destek    paketOf · kotaDusum
```

Veri: `DB.transitions` · `DB.flowEntities` · `DB.statusMigration` · `DB.reasonCodes` · `DB.approvalTypes` · `DB.approvalFlows` · `DB.paymentAllocations` · `DB.salaryHistory` · `DB.holidays` · `DB.workCalendar` · `DB.slaWaitPolicy`

## Duruş değişti — bunu bilerek sürdür

Kod "uyar ama engelleme" felsefesiyle yazılmıştı; `domain.js:865` bunu yazılı bir karar olarak savunuyordu. Şartname tersini emrediyor. **Kapılar artık reddediyor**: proje kapanışı, teslim onayı, sözleşme aktivasyonu, izin bakiyesi, bakım kotası. İstisna yolu `sahip`/`genelmudur` + neden kodu + açıklama; aktiviteye "YÖNETİCİ İSTİSNASI" olarak yazılır. Yeni ekran yazarken bu dili sürdür.

## Ölçüm araçları

```bash
node tasks/qa/flow.js              # geçiş sözleşmesi denetimi (0 bulgu olmalı)
node tasks/qa/flow.js --selftest   # eksenin kendisi bozuk kopyada sınanır
python3 <scratchpad>/syn.py *.html # inline script sözdizimi (HTML'i node --check okumaz)
```

Playwright kurulu (`node_modules/`, gitignored). Yerel sunucu: `python3 -m http.server 8791`.
Oturum kurmak için: `sessionStorage['gv.session'] = {"rol":"sahip","emp":"EMP-001"}` — alan adı `rol`, `role` değil.

## Uyarılar

- **`git add -A` yasak** — dosyalar tek tek isimle stage edilir.
- Yorumlarda `SAT-*` gibi desen yazma (L-37 — `*/` bloğu kapatır).
- Veri dosyasında koleksiyon değiştirirken satır aralığı kullan (L-38).
- Yeni ölçüm ekseni bozuk kopyada sınanmadan koşmaz (L-39).
- 🔸 ADR-06, 08, 11, 16 Yasin Bey'in teyidini bekliyor (bkz. `tasks/cloud-kararlar.md`).
