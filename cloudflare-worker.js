export default {
  async fetch(request, env, ctx) {
    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);
    if (!response) {
      try {
        const tcmbResponse = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
        const xml = await tcmbResponse.text();
        
        const rates = {};
        // Currencies present in TCMB today.xml
        const currencies = ["USD", "EUR", "GBP", "RUB", "RON", "CHF"];
        for (const cur of currencies) {
          // Format: <Currency ... CurrencyCode="USD">...<ForexSelling>33.15</ForexSelling>
          const regex = new RegExp(`<Currency[^>]*CurrencyCode="${cur}"[^>]*>[\\s\\S]*?<ForexSelling>([0-9.]+)</ForexSelling>`);
          const match = xml.match(regex);
          if (match && match[1]) {
            // Convert to 1 TRY = X Foreign format to match external APIs
            // TCMB gives 1 Foreign = X TRY.
            const tryPerForeign = parseFloat(match[1]);
            rates[cur] = 1 / tryPerForeign;
          }
        }
        
        // TCMB doesn't include PLN, UAH, CZK natively. We calculate approximate rates via EUR cross rates.
        if (rates["EUR"]) {
          rates["PLN"] = rates["EUR"] * 4.3; // 1 EUR = ~4.3 PLN
          rates["UAH"] = rates["EUR"] * 45.0; // 1 EUR = ~45 UAH
          rates["CZK"] = rates["EUR"] * 25.3; // 1 EUR = ~25.3 CZK
        }

        rates["TRY"] = 1;

        const data = {
          base: "TRY",
          timestamp: Date.now(),
          rates: rates
        };

        response = new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600" // Cloudflare Edge Cache for 1 hour
          }
        });
        
        // Store in cache for 1 hour
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }
    
    return response;
  }
}
