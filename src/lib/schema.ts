import { SITE } from "../data/site.config";

function absoluteUrl(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("http")) return value;
  return `${SITE.url}${value.startsWith("/") ? value : `/${value}`}`;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? item
          : item && typeof item === "object" && "url" in item
            ? String((item as { url?: string }).url ?? "")
            : ""
      )
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) return [value];

  if (value && typeof value === "object" && "url" in (value as Record<string, unknown>)) {
    return [String((value as { url?: string }).url ?? "")].filter(Boolean);
  }

  return [];
}

function normalizeImageList(product: Record<string, any>): string[] {
  const images = toArray(product.images ?? product.image ?? []);
  return images.length > 0 ? images : ["/images/og-default.svg"];
}

function getAvailability(value?: string): string {
  switch (value) {
    case "InStock":
      return "https://schema.org/InStock";
    case "OutOfStock":
      return "https://schema.org/OutOfStock";
    case "PreOrder":
      return "https://schema.org/PreOrder";
    default:
      return "https://schema.org/InStock";
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildProductSchema(product: Record<string, any>, options: { canonicalUrl: string; categoryName?: string; fallbackImage?: string }) {
  const canonicalUrl = options.canonicalUrl;
  const categoryName = options.categoryName || "Çiçek";
  const imageList = normalizeImageList(product);
  const normalizedImages = imageList.map((img) => absoluteUrl(img) || `${SITE.url}/images/og-default.svg`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name || "Çiçek",
    description: product.description || "",
    sku: product.id || product.slug || "",
    mpn: product.mpn || product.gtin || product.id || product.slug || "",
    gtin13: product.gtin || undefined,
    brand: {
      "@type": "Brand",
      name: product.brand || SITE.name,
    },
    category: categoryName,
    image: normalizedImages,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "TRY",
      price: String(product.price ?? 0),
      availability: getAvailability(product.availability),
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "TRY",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "TR",
          addressRegion: ["Antalya"],
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function buildCollectionSchema(items: Array<{ name: string; url: string; image?: string }>, options: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    description: options.description,
    url: options.url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      image: item.image ? absoluteUrl(item.image) : undefined,
    })),
  };
}

export function buildCollectionPageSchema(options: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: options.url,
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    image: absoluteUrl("/images/og-default.svg"),
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    priceRange: SITE.priceRange,
    currenciesAccepted: "TRY",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, WhatsApp",
    areaServed: ["Antalya", "Muratpaşa", "Lara", "Konyaaltı", "Kundu"],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "10:00", closes: "20:00" },
    ],
    sameAs: [SITE.social.instagram, SITE.social.facebook],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Organization", name: SITE.name },
        reviewBody: "Aynı gün teslimat, taze çiçekler ve kişiye özel aranjmanlar ile müşteriler için güvenli ve hızlı bir sipariş deneyimi sunuyor.",
        reviewRating: { "@type": "Rating", ratingValue: "4.9", bestRating: "5", worstRating: "1" },
      },
    ],
  };
}

export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildReviewSchema(options: { author?: string; reviewBody: string; ratingValue?: string; itemName?: string; url?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: options.author || "Müşteri",
    },
    reviewBody: options.reviewBody,
    itemReviewed: {
      "@type": "Thing",
      name: options.itemName || SITE.name,
      url: options.url || SITE.url,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: options.ratingValue || "4.9",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function buildWebsiteSchema(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url,
    description: SITE.description,
    inLanguage: "tr",
  };
}
