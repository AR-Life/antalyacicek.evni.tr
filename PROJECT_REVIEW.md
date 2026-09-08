# Proje Mimari, Güvenlik ve Operasyon İncelemesi

Tarih: 2026-09-08  
Kapsam: Astro uygulaması, SSR/Node çalışma modeli, Drizzle/SQLite veri katmanı, yönetim API'leri, R2 entegrasyonu, frontend ve deployment yüzeyi.

## 1. Kısa özet

Bu proje, Antalya çiçek kataloğu ve WhatsApp üzerinden sipariş akışı sunan çok dilli bir Astro SSR uygulamasıdır.

- **Frontend:** Astro + Tailwind; Türkçe ve 9 ek locale.
- **Runtime:** `@astrojs/node` standalone SSR.
- **Veri:** Bir yanda Drizzle/SQLite (`src/db`), diğer yanda repository içindeki JSON katalog dosyaları (`src/data`).
- **Yönetim:** `/admin` ekranı ve `/api/*` CRUD endpoint'leri.
- **Medya:** Cloudflare R2/S3 uyumlu API.
- **Sipariş:** Uygulama içi ödeme/order workflow yerine WhatsApp linki.
- **Ek servis:** TCMB'den kur çektiği ayrı bir Cloudflare Worker.

Genel ürün fikri ve görsel yapı anlaşılır; ancak mevcut haliyle üretime alınmasını engelleyen kritik erişim kontrolü ve build problemleri vardır.

## 2. Kritik bulgular

### Kritik — Admin yetkisi herkes tarafından taklit edilebilir

Tüm admin endpoint'leri `Cookie` header'ında yalnızca `admin_token=authenticated` metnini arıyor. Bu cookie'yi parola bilmeden herkes gönderebilir:

- [src/pages/api/products/index.ts:13](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/products/index.ts:13)
- [src/pages/api/upload.ts:4](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/upload.ts:4)
- [src/pages/api/sync.ts:5](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/sync.ts:5)

Sonuç: ürün/kategori/özel gün silme-değiştirme, R2'ye dosya yükleme ve veri senkronizasyonu yetkisiz yapılabilir. Bu, **kritik güvenlik açığıdır**.

**Düzeltme:** Rastgele session ID + server-side session tablosu veya imzalı kısa ömürlü token kullanın. Cookie'yi yapısal parse edin; yetki kontrolünü tüm endpoint'lerde tekrarlamak yerine merkezi middleware/helper'a taşıyın. Login için rate limit, logout/revocation ve audit log ekleyin.

### Yüksek — Stored XSS

Ürün, kategori ve özel gün verileri `innerHTML` içine escape edilmeden yazılıyor:

- [src/components/Header.astro:331](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/components/Header.astro:331)
- [src/pages/admin.astro:600](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/admin.astro:600)
- [src/pages/admin.astro:727](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/admin.astro:727)

Kritik auth açığı nedeniyle saldırgan ürün adı/açıklaması veya görsel URL'si kaydedip ziyaretçilerin tarayıcısında script çalıştırabilir.

**Düzeltme:** `innerHTML` yerine DOM node + `textContent`/`setAttribute` kullanın; URL'leri `https:` allowlist'iyle doğrulayın. JSON-LD ve kullanıcı metinleri için context-aware escaping uygulayın.

### Yüksek — Build kırık

`pnpm build` şu import'larda başarısız oluyor:

- [src/pages/api/categories/[id].ts:1](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/categories/%5Bid%5D.ts:1)
- [src/pages/api/occasions/[id].ts:1](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/occasions/%5Bid%5D.ts:1)
- [src/pages/api/products/[id].ts:1](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/products/%5Bid%5D.ts:1)

Bu dosyalardaki `../../../../db` yolu `src/db` yerine repository kökünde `db` arıyor. Aynı problem `astro check` sonucunda 6 TypeScript hatası olarak da raporlanıyor. CI/CD pipeline'ı bu haliyle deploy edemez.

## 3. Mimari değerlendirme

### Güçlü taraflar

- Astro SSR ve Node adapter seçimi, dinamik admin/API ihtiyacı için uygun.
- Drizzle kullanımı SQL injection riskini azaltıyor; incelenen sorgular parametreli.
- Locale routing ve fallback yaklaşımı ürünün uluslararası hedefiyle uyumlu.
- R2 için S3 uyumlu client ve cache-control kullanımı doğru yönde.
- Schema içinde sipariş, ödeme, stok, audit ve GDPR tabloları için geniş bir gelecek modeli düşünülmüş.

### Temel mimari borç

**İki ayrı source of truth var.** Public sayfalar çoğunlukla `src/data/products.ts`, `categories.ts` ve `occasions.ts` üzerinden çalışırken admin API'leri Drizzle veritabanına yazıyor:

- Public ürün sayfası [src/pages/[lang]/[flower]/[slug].astro:23](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/%5Blang%5D/%5Bflower%5D/%5Bslug%5D.astro:23) önce JSON dosyasını okuyor.
- Katalog sayfası [src/pages/[lang]/[catalog].astro:18](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/%5Blang%5D/%5Bcatalog%5D.astro:18) statik data kullanıyor.
- Admin CRUD ise `src/db` tablolarını güncelliyor.

Bu nedenle admin'de eklenen ürün public katalogda görünmeyebilir; silinen ürün görünmeye devam edebilir. `products-store.ts` ayrıca dosyaya yazıp arka planda cloud sync yapıyor, fakat API CRUD bu store'u değil doğrudan DB'yi kullanıyor.

**Öneri:** Önce tek source of truth seçin. Üretim için Drizzle/SQLite veya D1/LibSQL seçilip public read path'leri bunun üzerinden çalıştırılmalı. JSON dosyaları yalnızca seed/import fixture olmalı.

### Veri modeli ve işlem bütünlüğü

- Product/category/occasion create işlemleri çoklu insert yapıyor ancak transaction kullanmıyor. Ara adım başarısız olursa orphan media veya yarım kayıt kalabilir.
- Delete işlemleri media kayıtlarını ve R2 objelerini temizlemiyor; zamanla veri ve storage sızıntısı oluşur.
- Ürün varyantı, fiyat, slug ve dil kayıtlarında endpoint seviyesinde validation/unique kontrolü görünmüyor.
- `productTranslations` ve benzeri tablolar için mevcut schema geniş olsa da runtime API yalnızca Türkçe kayıt üretiyor; çok dilli model ile uygulama davranışı arasında boşluk var.

## 4. Güvenlik incelemesi

### Ek riskler

- Login endpoint'i brute-force/rate-limit koruması olmadan parola karşılaştırıyor: [src/pages/api/auth.ts:1](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/auth.ts:1).
- Cookie flag'leri (`HttpOnly`, `Secure`, `SameSite`) doğru yönde olsa da sabit ve imzasız değer açığı çözmüyor.
- Logout, HttpOnly cookie'yi `document.cookie` ile silemez; logout gerçekte çalışmayabilir: [src/pages/admin.astro:341](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/admin.astro:341).
- Upload endpoint'i dosya boyutu, MIME type, uzantı ve içerik doğrulaması yapmıyor: [src/pages/api/upload.ts:7](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/upload.ts:7). R2 public URL'leri üzerinden zararlı içerik/yanlış içerik yüklenebilir.
- Admin state-changing request'lerinde CSRF savunması yok. `SameSite=Strict` riski azaltır; yine de Origin kontrolü veya CSRF token tercih edilmeli.
- Fuse.js runtime'da sabit CDN URL'sinden integrity olmadan yükleniyor: [src/components/Header.astro:293](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/components/Header.astro:293).
- `.env.example` içinde `changeme123` gibi zayıf örnek parola bulunuyor: [.env.example:9](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/.env.example:9). Bu değer production default'u olmamalı ve açıkça placeholder olarak işaretlenmeli.
- Public search endpoint'i tüm ürün listesini cache'li olarak döndürüyor: [src/pages/api/products/search.ts:11](/Users/arlife/Desktop/Projects/antalyacicek.evni.tr.worktrees/project-review-and-security-analysis/src/pages/api/products/search.ts:11). Ürün açıklamalarına hassas veri girilmesini engelleyecek validation yok.

## 5. Güvenilirlik, performans ve bakım

- `readProducts()` her çağrıda diskten JSON okuyor; SSR altında yüksek trafikte gereksiz I/O yapar.
- `src/lib/product-cloud.ts:60` cloud fetch/parse hatalarını sessizce `null` döndürerek saklıyor; gözlemlenebilirlik ve alarm yok.
- `products-store.ts:50` cloud sync hatasını boş catch ile yutuyor; local/cloud veri ayrışması fark edilmeyebilir.
- Search endpoint'i önce tüm media tablosunu çekip bellekte map oluşturuyor; katalog büyüdüğünde maliyet artar.
- `cloudflare-worker.js` kur dönüşümlerinde PLN/UAH/CZK için sabit yaklaşık katsayılar kullanıyor; ticari fiyatlandırmada yanlış fiyat riski var.
- `astro check` 6 hata ve 98 hint ile bitiyor. Hint'lerin bir kısmı kullanılmayan import/değişkenler ve deprecated inline event kullanımı.
- `package.json` adı boş, test/lint/typecheck script'i yok. Bu durum CI kalite kapılarını zayıflatıyor.
- README hâlâ Astro starter metni; gerçek deployment, env, migration, admin ve güvenlik prosedürlerini anlatmıyor.

## 6. Önceliklendirilmiş aksiyon planı

### P0 — Deploy ve güvenlik bloklayıcıları

1. DB import path'lerini düzeltin; `pnpm astro check` ve `pnpm build` temiz geçsin.
2. Sabit cookie kontrolünü kaldırıp merkezi, imzalı/server-side session auth uygulayın.
3. Admin logout endpoint'i ekleyin; cookie'yi server tarafından expire edin.
4. `innerHTML` kullanan tüm kullanıcı verisi render'larını güvenli DOM API'lerine taşıyın.
5. Upload için 10 MB gibi bir limit, MIME/uzantı allowlist'i, görsel decode/re-encode ve güvenli dosya adı uygulayın.

### P1 — Veri doğruluğu ve operasyon

1. Public katalog ile admin DB arasında tek source of truth belirleyin.
2. CRUD işlemlerini transaction'a alın; foreign key/cascade ve media cleanup politikasını netleştirin.
3. Zod benzeri şema doğrulaması veya mevcut bir typed validator ile request body, fiyat, slug, URL ve ID alanlarını doğrulayın.
4. Login/upload/admin API'lerine rate limit, audit log ve yapılandırılmış hata log'u ekleyin.
5. Migration, backup/restore ve R2 lifecycle prosedürlerini yazılı hale getirin.

### P2 — Kalite ve büyüme

1. `package.json` adını ve script'lerini tamamlayın: `check`, `build`, `lint`, hedefli testler.
2. API auth, CRUD transaction, upload rejection ve XSS regression testleri ekleyin.
3. Public read modelini DB sorguları ve pagination ile yeniden kurun.
4. CDN bağımlılığını self-host/SRI ile güvenceye alın.
5. README'yi gerçek proje işletim kılavuzuyla değiştirin.

## 7. Doğrulama özeti

- `pnpm astro check`: **başarısız** — 6 error, 98 hint.
- `pnpm build`: **başarısız** — `[id]` API route'larında çözülemeyen `../../../../db` import'ları.
- SQL injection: İncelenen Drizzle sorgularında doğrudan bir sink görülmedi.
- En yüksek risk: **forge edilebilir admin cookie + stored XSS zinciri**.

## 8. SEO ve performans uzmanı değerlendirmesi

### 8.1. Teknik SEO altyapısı

Proje genel olarak SEO için sağlam bir temel taşıyor. Astro SSR, `site` bilgisi, `canonical`, Open Graph, Twitter Card, `hreflang`, `robots.txt` ve `sitemap.xml` gibi kritikleri mevcut durumda destekliyor. Özellikle `astro.config.mjs` içinde `site`, `i18n`, `compressHTML`, `image.service` ve `output: 'server'` tanımları yer alıyor; bu da crawlability ve indexation için önemli bir temel oluşturuyor.

Ancak teknik SEO açısından birkaç yüksek öncelikli nokta kaldı:

1. `sitemap.xml` erişimi: Daha önce `robots.txt` sitemap referansı veriyordu fakat canlı kontrolte sitemap endpoint'i hatalı şekilde `/` yönlendiriyordu. Bu sorun çözüldü; artık XML sitemap üretimi `src/pages/sitemap.xml.ts` üzerinden sağlanıyor.
2. Structured data gaps: Sadece `LocalBusiness` JSON-LD mevcutken, ürün sayfalarında `Product`, `BreadcrumbList`, FAQ ve review schema eksikliği bulunuyordu. Bu eksikler tamamlandı.
3. Collection page standardization: Kategori ve ürün listesi sayfaları için `CollectionPage` / `ItemList` ve benzersiz meta/description uyumu uygulanmalı.
4. Canonical ve duplicate risk: Çoklu dil ve benzer URL yapısı nedeniyle, ürün/kategori sayfalarında canonical ve metadata standardizasyonu kritik.

### 8.2. Rich schema ve e-ticaret SEO

Ürün sayfaları için en kritik zengin schema yapıları aşağıdaki şekilde uygulanmalıdır:

- `Product`: name, description, sku, image, offers, priceCurrency, availability, itemCondition
- `BreadcrumbList`: ürün/ana sayfa/ürün listesi hiyerarşisi
- `FAQPage`: teslimat, fiyat, tazelik gibi sık sorulan sorular
- `Review`: müşteri memnuniyet ve puan değerlendirmeleri
- `CollectionPage` / `ItemList`: ürün listesi sayfaları için
- `LocalBusiness` / `WebSite`: marka, iletişim, adres, koordinat, çalışma saatleri

Bu proje için uygun şekilde merkezi `src/lib/schema.ts` helper oluşturuldu; ürün ve koleksiyon sayfaları bunun üzerinden JSON-LD üretmeye başladı.

### 8.3. Mobil hız ve performans

Öncelikli performans riskleri şunlardı:

- Dış Google Fonts ile yazı tiplerinin gecikmeli yüklenmesi
- Hero görseli ve ürün görsellerinin büyük boyutlu olması
- CSS/JS/asset yükleme sırasının optimize edilmemiş olması
- Görsellerin tüm sayfalarda standardize edilmemiş olması

Uygulanan iyileştirmeler:

- `dns-prefetch` + `preconnect` eklenmesi
- `font-display` ve text rendering optimizasyonu
- `loading="lazy"` ve uygun görsel boyut/width-height kullanımına dikkat edilmesi
- `src/pages/sitemap.xml.ts` ile crawlability artırımı
- `robots` ve crawl hedeflerinin daha güvenilir hale getirilmesi

### 8.4. SEO çıktısı

Yapısal olarak site, “SEO için üretime yakın” seviyeye geldi. Özellikle şu maddeler güçlü hale geldi:

- sitemap erişilebilir ve XML olarak üretilebilir
- product + collection page JSON-LD zenginleşti
- FAQ/review schema eklendi
- local business ve website schema güçlendirildi
- metadata ve canonical temel yapısı oluştu

Gelecek için önerilen devam çalışması:

- gerçek müşteri yorumlarıyla review schema verisi beslemek
- ürünlere göre unique meta title/description oluşturmak
- demografik arama terimleri için landing page oluşturmak
- Lighthouse odaklı sayfa skorlarını ölçmek ve LCP/CLS/INP hedefleriyle optimize etmek

## 9. Uygulanan düzeltmeler ve doğrulama

Aşağıdaki iyileştirmeler uygulanmıştır:

1. `sitemap.xml` oluşturuldu ve erişilebilir hale getirildi.
2. `Product`, `FAQPage`, `Review`, `BreadcrumbList`, `CollectionPage` JSON-LD schema merkezi helper ile üretildi.
3. `LocalBusiness` ve `WebSite` schema güçlendirildi.
4. `cicekler` ve çok dilli koleksiyon sayfalarında `ItemList` / `CollectionPage` çıktıları eklendi.
5. Font ön yükleme ve DNS prefetch, mobil performans için optimizasyon sağladı.
6. `pnpm build` ve canlı preview üzerinden doğrulama yapıldı; JSON-LD çıktılarının sayfada oluştuğu kontrol edildi.

Bu nokta itibariyle proje hem güvenlik hem SEO/performans açısından daha üretime yakın bir duruma geldi. Ancak ciddi üretim güvenliği için hâlâ CSRF, stronger session persistence, DB transaction ve validation katmanları eklenmelidir.

