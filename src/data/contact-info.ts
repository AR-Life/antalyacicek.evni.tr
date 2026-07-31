export interface ContactInfo {
  businessName: string;
  legalName: string;
  description: string;
  phone: string;
  phoneDisplay: string;
  phoneInternational: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: {
    street: string;
    district: string;
    city: string;
    postalCode: string;
    country: string;
    fullAddress: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    day: string;
    hours: string;
  }[];
  social: {
    instagram: string;
    facebook: string;
    twitter?: string;
    youtube?: string;
  };
  delivery: {
    areas: string[];
    freeDeliveryMin: number;
    deliveryTime: string;
  };
  payment: {
    methods: string[];
  };
}

export const contactInfo: ContactInfo = {
  businessName: "Antalya Çiçek",
  legalName: "Antalya Çiçekçilik",
  description:
    "Antalya'nın en hızlı çiçek teslimatı. Doğum günü, yıl dönümü, düğün ve özel günler için taze çiçek aranjmanları. Aynı gün teslimat ve WhatsApp ile hızlı sipariş.",
  phone: "+905001234567",
  phoneDisplay: "0 (500) 123 45 67",
  phoneInternational: "+90 500 123 45 67",
  whatsapp: "905001234567",
  whatsappMessage: "Merhaba, çiçek siparişi vermek istiyorum.",
  email: "info@antalyacicek.com",
  address: {
    street: "Cumhuriyet Mah. Çiçek Sk. No:12",
    district: "Muratpaşa",
    city: "Antalya",
    postalCode: "07040",
    country: "TR",
    fullAddress: "Cumhuriyet Mah. Çiçek Sk. No:12, Muratpaşa, Antalya",
  },
  geo: {
    latitude: 36.8969,
    longitude: 30.7133,
  },
  openingHours: [
    { day: "Pazartesi - Cuma", hours: "08:00 - 21:00" },
    { day: "Cumartesi", hours: "09:00 - 22:00" },
    { day: "Pazar", hours: "10:00 - 20:00" },
  ],
  social: {
    instagram: "https://instagram.com/antalyacicek",
    facebook: "https://facebook.com/antalyacicek",
  },
  delivery: {
    areas: [
      "Muratpaşa",
      "Konyaaltı",
      "Kepez",
      "Döşemealtı",
      "Aksu",
      "Lara",
      "Kundu",
      "Belek",
      "Kemer",
    ],
    freeDeliveryMin: 500,
    deliveryTime: "2-4 saat",
  },
  payment: {
    methods: ["Nakit", "Kredi Kartı", "Banka Kartı", "Havale/EFT"],
  },
};

export function generateLocalBusinessSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": `${contactInfo.address.fullAddress}#business`,
    name: contactInfo.businessName,
    legalName: contactInfo.legalName,
    description: contactInfo.description,
    image: "https://antalyacicek.evni.tr/logo.png",
    url: "https://antalyacicek.evni.tr",
    telephone: contactInfo.phone,
    email: contactInfo.email,
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      streetAddress: contactInfo.address.street,
      addressLocality: contactInfo.address.district,
      addressRegion: contactInfo.address.city,
      postalCode: contactInfo.address.postalCode,
      addressCountry: contactInfo.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: contactInfo.geo.latitude,
      longitude: contactInfo.geo.longitude,
    },
    openingHoursSpecification: contactInfo.openingHours.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: oh.day.includes("Pazartesi")
        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        : oh.day.includes("Cumartesi")
          ? "Saturday"
          : "Sunday",
      opens: oh.hours.split(" - ")[0],
      closes: oh.hours.split(" - ")[1],
    })),
    sameAs: [
      contactInfo.social.instagram,
      contactInfo.social.facebook,
    ].filter(Boolean),
    areaServed: contactInfo.delivery.areas.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Çiçek Kategorileri",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Buketler",
          url: "https://antalyacicek.evni.tr/#cat-premium-buketler",
        },
        {
          "@type": "OfferCatalog",
          name: "Güller",
          url: "https://antalyacicek.evni.tr/#cat-guller",
        },
        {
          "@type": "OfferCatalog",
          name: "Orkideler",
          url: "https://antalyacicek.evni.tr/#cat-orkide-saksi-cicekleri",
        },
      ],
    },
    paymentAccepted: contactInfo.payment.methods.join(", "),
    currenciesAccepted: "TRY",
  };
}

export function generateContactPageSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `İletişim - ${contactInfo.businessName}`,
    description: `${contactInfo.businessName} iletişim bilgileri. Telefon, adres, çalışma saatleri.`,
    url: "https://antalyacicek.evni.tr/iletisim",
    mainEntity: {
      "@type": "Organization",
      name: contactInfo.businessName,
      telephone: contactInfo.phone,
      email: contactInfo.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: contactInfo.address.street,
        addressLocality: contactInfo.address.district,
        addressRegion: contactInfo.address.city,
        postalCode: contactInfo.address.postalCode,
        addressCountry: contactInfo.address.country,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: contactInfo.phone,
        contactType: "customer service",
        availableLanguage: ["Turkish", "English"],
        areaServed: "TR",
      },
    },
  };
}

export function generateAboutPageSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Hakkımızda - ${contactInfo.businessName}`,
    description: `${contactInfo.businessName} hakkında bilgi. Antalya'nın güvenilir çiçekçisi.`,
    url: "https://antalyacicek.evni.tr/hakkinda",
    mainEntity: {
      "@type": "Florist",
      name: contactInfo.businessName,
      description: contactInfo.description,
      foundingDate: "2020",
      slogan: "Antalya'nın Premium Çiçekçisi",
    },
  };
}
