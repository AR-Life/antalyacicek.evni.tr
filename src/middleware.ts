import { defineMiddleware } from "astro:middleware";
import { DEFAULT_LOCALE, isValidLocale, type Locale } from "./i18n/config";

export const onRequest = defineMiddleware((context: any, next: any) => {
  const { request, url, cookies, redirect, locals } = context;
  const pathname = url.pathname;

  // Ignore static assets, images, API, admin routes, and file extensions
  if (
    pathname.startsWith("/_astro/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return next();
  }

  // Determine current locale from URL prefix
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] || "";
  let currentLocale: Locale = DEFAULT_LOCALE;

  if (isValidLocale(firstSegment) && firstSegment !== DEFAULT_LOCALE) {
    currentLocale = firstSegment;
  }

  // Store resolved locale in locals for runtime access
  locals.locale = currentLocale;

  // Browser auto-detection redirect ONLY on root path "/" when no preference cookie exists
  if (pathname === "/" && !cookies.has("locale_pref")) {
    const acceptLang = request.headers.get("accept-language") || "";
    if (acceptLang) {
      const preferredCodes = acceptLang
        .split(",")
        .map((part: string) => part.split(";")[0].trim().toLowerCase().split("-")[0]);

      for (const code of preferredCodes) {
        if (isValidLocale(code)) {
          if (code !== DEFAULT_LOCALE) {
            cookies.set("locale_pref", code, { path: "/", maxAge: 60 * 60 * 24 * 30 });
            return redirect(`/${code}/`, 302);
          } else {
            cookies.set("locale_pref", DEFAULT_LOCALE, { path: "/", maxAge: 60 * 60 * 24 * 30 });
            break;
          }
        }
      }
    }
  }

  // Update preference cookie if user visits an explicit locale path or Turkish home/catalog
  if (currentLocale !== DEFAULT_LOCALE || pathname === "/" || pathname === "/cicekler") {
    if (cookies.get("locale_pref")?.value !== currentLocale) {
      cookies.set("locale_pref", currentLocale, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    }
  }

  return next();
});
