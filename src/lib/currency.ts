let cachedRates: Record<string, number> | null = null;
let lastFetch = 0;

export const currencyConfig: Record<string, { code: string, symbol: string, locale: string }> = {
  tr: { code: "TRY", symbol: "₺", locale: "tr-TR" },
  en: { code: "GBP", symbol: "£", locale: "en-GB" },
  ru: { code: "RUB", symbol: "₽", locale: "ru-RU" },
  de: { code: "EUR", symbol: "€", locale: "de-DE" },
  pl: { code: "PLN", symbol: "zł", locale: "pl-PL" },
  nl: { code: "EUR", symbol: "€", locale: "nl-NL" },
  ro: { code: "RON", symbol: "lei", locale: "ro-RO" },
  uk: { code: "UAH", symbol: "₴", locale: "uk-UA" },
  cs: { code: "CZK", symbol: "Kč", locale: "cs-CZ" },
  lt: { code: "EUR", symbol: "€", locale: "lt-LT" },
};

export async function getRates(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() - lastFetch < 3600000) {
    return cachedRates; // 1 hour memory cache (if server runs continuously)
  }
  
  try {
    // Fetch from the Cloudflare worker that pulls from TCMB
    // If not deployed yet, this will fail and use the static fallbacks below.
    const res = await fetch("https://rates.antalyacicek.evni.tr");
    const data = await res.json();
    if (data && data.rates) {
      const rates = data.rates as Record<string, number>;
      cachedRates = rates;
      lastFetch = Date.now();
      return rates;
    }
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
  }
  
  // Fallback static rates (1 TRY = X Foreign)
  return {
    "TRY": 1,
    "EUR": 0.027,
    "GBP": 0.023,
    "RUB": 2.8,
    "PLN": 0.12,
    "RON": 0.13,
    "UAH": 1.25,
    "CZK": 0.68,
  };
}

export async function formatPrice(priceTRY: number, lang: string): Promise<string> {
  const config = currencyConfig[lang] || currencyConfig.tr;
  if (config.code === "TRY") {
    return new Intl.NumberFormat("tr-TR", { 
      style: "currency", 
      currency: "TRY", 
      minimumFractionDigits: 0 
    }).format(priceTRY);
  }
  
  const rates = await getRates();
  const rate = rates[config.code] || 0;
  
  if (rate === 0) {
    return priceTRY + " ₺"; // Fallback if currency not found
  }
  
  const converted = priceTRY * rate;
  const rounded = Math.ceil(converted);
  
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
}
