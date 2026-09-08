import { getAllProducts } from "../data/products";
import { occasions } from "../data/occasions";
import { SITE } from "../data/site.config";
import { LOCALES, localePath } from "../i18n/config";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = getAllProducts();
  const resolvedUrls = new Set<string>();
  const addUrl = (url: string) => {
    resolvedUrls.add(url);
  };

  const staticPaths = [
    "/",
    "/cicekler",
    "/hakkinda",
    "/iletisim",
  ];

  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      addUrl(`${SITE.url}${localePath(locale, path)}`);
    }

    for (const product of products) {
      addUrl(`${SITE.url}${localePath(locale, `/cicek/${product.slug}`)}`);
    }
  }

  for (const occasion of occasions) {
    addUrl(`${SITE.url}/firsatlar/${occasion.slug}`);
  }

  const sitemapUrls = [...resolvedUrls].sort();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls
    .map(
      (url) => `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
