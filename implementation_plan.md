# Çoklu Dil Altyapısı — 10 Dil

## Diller

| Kod  | Dil        | URL Prefix    | Çiçekler Slug | Sipariş         |
| ---- | ---------- | ------------- | ------------- | --------------- |
| `tr` | Türkçe     | `/` (default) | `/cicekler`   | Tam (form + WA) |
| `en` | English    | `/en/`        | `/en/flowers` | WhatsApp only   |
| `ru` | Русский    | `/ru/`        | `/ru/tsvety`  | WhatsApp only   |
| `de` | Deutsch    | `/de/`        | `/de/blumen`  | WhatsApp only   |
| `pl` | Polski     | `/pl/`        | `/pl/kwiaty`  | WhatsApp only   |
| `nl` | Nederlands | `/nl/`        | `/nl/bloemen` | WhatsApp only   |
| `ro` | Română     | `/ro/`        | `/ro/flori`   | WhatsApp only   |
| `cs` | Čeština    | `/cs/`        | `/cs/kvetiny` | WhatsApp only   |
| `uk` | Українська | `/uk/`        | `/uk/kvity`   | WhatsApp only   |
| `lt` | Lietuvių   | `/lt/`        | `/lt/geles`   | WhatsApp only   |

> [!NOTE]
> Çeviri içerikleri (UI string'leri, ürün çevirileri) sonraki fazda yapılacak. Şimdi sadece altyapı kuruluyor. Çeviriler hazır olana kadar tüm diller İngilizce fallback kullanacak.

---

## Proposed Changes

### 1. i18n Config & Veri Katmanı

#### [MODIFY] [astro.config.mjs](file:///Users/arlife/Desktop/Projects/antalyacicek.evni.tr/astro.config.mjs)

- `i18n` bloğu ekle: 10 locale, `tr` default, `prefixDefaultLocale: false`

#### [NEW] `src/i18n/config.ts`

- `Locale` type, desteklenen diller listesi, slug mapping tablosu, `isDefaultLocale()`, `localePath()` helper'ları
- Slug map:

```ts
export const LOCALE_SLUGS = {
  tr: { flowers: "cicekler", flower: "cicek" },
  en: { flowers: "flowers", flower: "flower" },
  ru: { flowers: "tsvety", flower: "tsvetok" },
  de: { flowers: "blumen", flower: "blume" },
  pl: { flowers: "kwiaty", flower: "kwiat" },
  nl: { flowers: "bloemen", flower: "bloem" },
  ro: { flowers: "flori", flower: "floare" },
  cs: { flowers: "kvetiny", flower: "kvetina" },
  uk: { flowers: "kvity", flower: "kvitka" },
  lt: { flowers: "geles", flower: "gele" },
} as const;
```

#### [NEW] `src/i18n/translations.ts`

- `t(locale, key)` fonksiyonu — şimdilik boş/fallback döner, sonra JSON dosyalarından okuyacak
- Her locale için `src/i18n/locales/{lang}.json` dosyası — şimdilik sadece `en.json` ile başlanacak, diğerleri fallback

---

### 2. Middleware

#### [NEW] `src/middleware.ts`

```
Request geliyor →
  1. URL'den locale belirle (prefix veya slug'dan)
  2. `locale_pref` cookie var mı?
     → Evet: redirect yapma, devam et
     → Hayır & URL = "/" (kök):
        Accept-Language header'dan dil algıla
        → Desteklenen dil ise → 302 redirect /{lang}/
        → Cookie set: locale_pref={lang} (30 gün)
  3. Slug rewrite: /de/blumen → internal /[lang]/flowers (lang=de)
```

---

### 3. TR Sayfa Rename + Redirect

#### [RENAME] `src/pages/urunler.astro` → `src/pages/cicekler.astro`

#### [RENAME] `src/pages/urun/[slug].astro` → `src/pages/cicek/[slug].astro` (varsa)

#### [NEW] `src/pages/urunler.astro` — sadece 301 redirect → `/cicekler`

Mevcut internal linkler güncelleme: Hero, index.astro, Header vb. `/urunler` → `/cicekler`

---

### 4. Diğer Diller İçin Sayfalar

#### [NEW] `src/pages/[lang]/index.astro`

- Ana sayfa — locale prop ile component'lere aktarım
- Non-TR olduğu için sipariş alanları WhatsApp-only

#### [NEW] `src/pages/[lang]/[flowersSlug].astro`

- Çiçekler listesi sayfası
- Middleware slug rewrite ile `flowersSlug` → locale resolve
- Filtreler + ürün grid (WhatsApp-only sipariş)

#### [NEW] `src/pages/[lang]/[flowerSlug]/[slug].astro`

- Ürün detay (varsa) — WhatsApp-only

---

### 5. Component Locale Desteği

Tüm component'ler `locale` prop alacak. Non-TR ise sipariş butonları WhatsApp'a yönlenecek.

#### [MODIFY] [BaseLayout.astro](file:///Users/arlife/Desktop/Projects/antalyacicek.evni.tr/src/layouts/BaseLayout.astro)

- `locale` prop → `<html lang={locale}>`
- Hreflang `<link>` tagları (10 dil + x-default)
- Çevrilmiş title/description (fallback ile)

#### [MODIFY] [Header.astro](file:///Users/arlife/Desktop/Projects/antalyacicek.evni.tr/src/components/Header.astro)

- Dil seçici dropdown (bayrak + dil adı)
- Nav linkleri locale-aware: `localePath(locale, '/cicekler')`
- `locale` prop

#### [MODIFY] [HeroSection.astro](file:///Users/arlife/Desktop/Projects/antalyacicek.evni.tr/src/components/HeroSection.astro)

- `locale` prop
- Non-TR: form → WhatsApp redirect
- CTA linkleri locale-aware

#### [MODIFY] [ProductCard.astro](file:///Users/arlife/Desktop/Projects/antalyacicek.evni.tr/src/components/ProductCard.astro)

- `locale` prop
- Non-TR: sipariş butonu → WhatsApp link

#### [MODIFY] [Footer.astro](file:///Users/arlife/Desktop/Projects/antalyacicek.evni.tr/src/components/Footer.astro)

- `locale` prop, locale-aware linkler

---

### 6. SEO

Her sayfada otomatik:

```html
<link rel="alternate" hreflang="tr" href=".../" />
<link rel="alternate" hreflang="en" href=".../en/" />
<link rel="alternate" hreflang="ru" href=".../ru/" />
<link rel="alternate" hreflang="de" href=".../de/" />
<link rel="alternate" hreflang="pl" href=".../pl/" />
<link rel="alternate" hreflang="nl" href=".../nl/" />
<link rel="alternate" hreflang="ro" href=".../ro/" />
<link rel="alternate" hreflang="cs" href=".../cs/" />
<link rel="alternate" hreflang="uk" href=".../uk/" />
<link rel="alternate" hreflang="lt" href=".../lt/" />
<link rel="alternate" hreflang="x-default" href=".../" />
```

JSON-LD: `availableLanguage` güncelleme.

---

## Uygulama Sırası

1. ⚙️ `src/i18n/config.ts` + `translations.ts` — altyapı modülleri
2. 📝 `astro.config.mjs` — i18n config aktifleştir
3. 🔄 `src/middleware.ts` — dil algılama + slug rewrite
4. 📂 TR sayfa rename: `urunler`→`cicekler` + 301 redirect
5. 🌍 `[lang]` dynamic sayfalar: index, flowers, flower/[slug]
6. 🧩 Component'lere `locale` prop + WhatsApp-only logic
7. 🏷️ SEO: hreflang, BaseLayout güncellemeleri

---

## Verification Plan

### Automated

- `curl -s -o /dev/null -w "%{http_code}"` ile tüm locale URL'lerinin 200 dönmesi
- `/urunler` → 301 → `/cicekler` kontrolü
- `/de/blumen`, `/ru/tsvety` vb. slug rewrite doğrulaması

### Manual

- Tarayıcı dili değiştirerek redirect testi
- Dil seçici ile geçiş
- Non-TR sipariş butonlarının WhatsApp'a gitmesi
