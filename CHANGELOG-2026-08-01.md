# Changelog — 2026-08-01

Bu dosya, 1 Ağustos 2026 tarihinde yapılan i18n (çoklu dil) ve navigasyon iyileştirmelerini belgelemektedir. Bir sonraki yazılımcı veya AI agent'ın yapılan değişiklikleri hızlıca kavraması için hazırlanmıştır.

---

## 1. `locale` Değişkeni Eksikliği Giderildi

**Dosya:** `src/components/Header.astro`

Header bileşeninde `t(locale, ...)` çağrısı yapılıyordu ancak `locale` değişkeni frontmatter'da tanımlı değildi. Aşağıdaki import ve değişken eklendi:

```astro
import { DEFAULT_LOCALE, type Locale, localePath } from "../i18n/config";

const locale = (Astro.locals.locale as Locale) || DEFAULT_LOCALE;
```

> **Not:** `Astro.locals.locale` değeri middleware tarafından (`src/middleware.ts`) set edilmektedir. URL prefix'ine bakarak mevcut dili belirler.

---

## 2. LanguageSelector Bileşeni Oluşturuldu

**Yeni dosya:** `src/components/LanguageSelector.astro`

Dil değiştirme bileşeni sıfırdan yazıldı. Daha önceden projede böyle bir bileşen yoktu (git history'de de bulunmadı).

### Nasıl çalışır:
- `LOCALES` dizisindeki tüm dilleri bir native HTML `<select>` olarak listeler.
- Her option'ın `value`'su hedef dildeki URL'dir (`localePath` mantığıyla).
- Dil seçimi yapılınca `astro:transitions/client` modülünden `navigate()` fonksiyonu kullanılır → sayfa yenilenmeden (SPA-benzeri) geçiş sağlanır.
- Mevcut dil `selected` attribute ile işaretlenir.

### URL dönüştürme mantığı:
```
TR (varsayılan) → /          → seçilen dile: /en/, /ru/, /de/ ...
EN              → /en/sayfa  → TR'ye dönüş: /sayfa
EN              → /en/sayfa  → DE'ye geçiş: /de/sayfa
```

### Header'daki konumu:
Sağ tarafta, WhatsApp sipariş butonunun **solunda** yer alır (arama çubuğu ile WhatsApp butonu arasında).

```
[Logo] ... [Arama Çubuğu] ... [🇹🇷 TR ▼] [WhatsApp Sipariş] [☰ Mobil Menü]
```

---

## 3. ClientRouter (ViewTransitions) Eklendi

**Dosya:** `src/layouts/BaseLayout.astro`

Sayfalar arası geçişlerin yenilenmeden (SPA tarzı) yapılması için Astro'nun `ClientRouter` bileşeni eklendi.

```astro
import { ClientRouter } from "astro:transitions";
```

```html
<head>
  ...
  <ClientRouter />
  ...
</head>
```

> **ÖNEMLİ:** Astro v7.x'te `ViewTransitions` bileşeni **kaldırıldı**, yerine `ClientRouter` geldi. Eski `import { ViewTransitions } from "astro:transitions"` kullanılırsa `undefined` hatası alınır.

### Etkileri:
- Tüm dahili navigasyonlar (`<a>` linkleri) artık tam sayfa yenilemesi yapmaz.
- LanguageSelector'daki dil değişiklikleri de `navigate()` ile pürüzsüz geçiş yapar.
- Script'ler `astro:page-load` event'ini dinlemelidir (`DOMContentLoaded` yerine), çünkü SPA geçişlerinde DOM tam yenilenme yapmaz.

---

## 4. Logo Linkleri Locale-Aware Yapıldı

**Dosyalar:**
- `src/components/Header.astro`
- `src/components/Footer.astro`

Önceden logo linkleri `href="/"` şeklinde sabit Türkçe ana sayfaya yönlendiriyordu. Şimdi `localePath(locale, "/")` kullanılıyor:

```diff
- <a href="/">
+ <a href={localePath(locale, "/")}>
```

Bu sayede:
- `/en/` sayfasındayken logoya tıklanınca → `/en/` (İngilizce ana sayfa)
- `/ru/` sayfasındayken logoya tıklanınca → `/ru/` (Rusça ana sayfa)
- `/` (Türkçe) sayfasındayken logoya tıklanınca → `/` (zaten Türkçe)

---

## İlgili Dosya Yapısı

```
src/
├── i18n/
│   ├── config.ts          # LOCALES, DEFAULT_LOCALE, localePath(), LOCALE_FLAGS, LOCALE_NAMES
│   └── translations.ts    # t(locale, key, fallback) fonksiyonu
├── middleware.ts           # URL prefix'ten locale belirler, Astro.locals.locale'e yazar
├── layouts/
│   └── BaseLayout.astro   # ClientRouter burada, locale prop olarak Header/Footer'a geçer
├── components/
│   ├── Header.astro        # Logo linki + LanguageSelector + arama + whatsapp
│   ├── Footer.astro        # Logo linki locale-aware
│   └── LanguageSelector.astro  # Dil seçici select bileşeni
```

---

## Dikkat Edilmesi Gerekenler

1. **Yeni bileşen eklerken** `Astro.locals.locale` kullanılabilir; middleware tarafından otomatik set edilir.
2. **Dahili linkler** için `localePath(locale, "/hedef-sayfa")` kullanılmalıdır.
3. **Client-side script'ler** `astro:page-load` event'ini dinlemelidir (ClientRouter aktif olduğu için).
4. **Varsayılan dil (TR)** URL prefix'siz çalışır (`/`), diğer diller prefix ile çalışır (`/en/`, `/ru/` vb.).
