export const LOCALES = ["tr", "en", "ru", "de", "pl", "nl", "ro", "cs", "uk", "lt"] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const LOCALE_NAMES: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  pl: "Polski",
  nl: "Nederlands",
  ro: "Română",
  cs: "Čeština",
  uk: "Українська",
  lt: "Lietuvių",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ru: "🇷🇺",
  de: "🇩🇪",
  pl: "🇵🇱",
  nl: "🇳🇱",
  ro: "🇷🇴",
  cs: "🇨🇿",
  uk: "🇺🇦",
  lt: "🇱🇹",
};

export const LOCALE_SLUGS: Record<Locale, { flowers: string; flower: string }> = {
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
};

export function isDefaultLocale(locale: string): boolean {
  return locale === DEFAULT_LOCALE;
}

export function isValidLocale(val: string): val is Locale {
  return LOCALES.includes(val as any);
}

export function localePath(locale: Locale, path: string): string {
  let cleanedPath = path.startsWith("/") ? path : "/" + path;
  if (cleanedPath === "/") {
    return isDefaultLocale(locale) ? "/" : `/${locale}/`;
  }

  // Handle flowers catalog route slug replacement
  if (cleanedPath === "/cicekler" || cleanedPath.startsWith("/cicekler/") || cleanedPath.startsWith("/cicekler?")) {
    cleanedPath = cleanedPath.replace("/cicekler", "/" + LOCALE_SLUGS[locale].flowers);
  } else if (cleanedPath === "/urunler" || cleanedPath.startsWith("/urunler/") || cleanedPath.startsWith("/urunler?")) {
    cleanedPath = cleanedPath.replace("/urunler", "/" + LOCALE_SLUGS[locale].flowers);
  } else if (cleanedPath.startsWith("/cicek/")) {
    cleanedPath = cleanedPath.replace("/cicek/", "/" + LOCALE_SLUGS[locale].flower + "/");
  } else if (cleanedPath.startsWith("/urun/")) {
    cleanedPath = cleanedPath.replace("/urun/", "/" + LOCALE_SLUGS[locale].flower + "/");
  }

  if (isDefaultLocale(locale)) {
    return cleanedPath;
  }
  return `/${locale}${cleanedPath}`;
}

export function getBasePath(pathname: string): string {
  let clean = pathname.startsWith("/") ? pathname : "/" + pathname;
  for (const loc of LOCALES) {
    if (loc !== DEFAULT_LOCALE && (clean === `/${loc}` || clean.startsWith(`/${loc}/`))) {
      let remainder = clean.slice(loc.length + 1) || "/";
      if (!remainder.startsWith("/")) remainder = "/" + remainder;
      const slugs = LOCALE_SLUGS[loc];
      if (remainder === `/${slugs.flowers}` || remainder.startsWith(`/${slugs.flowers}/`) || remainder.startsWith(`/${slugs.flowers}?`)) {
        return remainder.replace(`/${slugs.flowers}`, "/cicekler");
      } else if (remainder.startsWith(`/${slugs.flower}/`)) {
        return remainder.replace(`/${slugs.flower}/`, "/cicek/");
      }
      return remainder;
    }
  }
  return clean;
}

