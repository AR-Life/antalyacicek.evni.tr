export const SITE = {
  name: "Antalya Çiçek",
  title: "Antalya Çiçek - Aynı Gün Teslimat Çiçek | Antalya Çiçekçi",
  description:
    "Antalya'nın en hızlı çiçek teslimatı. Doğum günü, yıl dönümü, düğün ve özel günler için taze çiçek aranjmanları. Aynı gün teslimat ve WhatsApp ile hızlı sipariş.",
  url: "https://antalyacicek.evni.tr",
  locale: "tr_TR",
  phone: "+905001234567",
  phoneFormatted: "+90 (500) 123 45 67",
  phoneDigits: "905001234567",
  address: {
    street: "Cumhuriyet Mah. Çiçek Sk. No:12",
    city: "Antalya",
    region: "Muratpaşa",
    postalCode: "07040",
    country: "TR",
  },
  geo: {
    latitude: 36.8969,
    longitude: 30.7133,
  },
  openingHours: [
    { opens: "Mo-Fr 08:00-21:00" },
    { opens: "Sa 09:00-22:00" },
    { opens: "Su 10:00-20:00" },
  ],
  social: {
    whatsapp: "905001234567",
    instagram: "https://instagram.com/antalyacicek",
    facebook: "https://facebook.com/antalyacicek",
  },
  priceRange: "₺₺",
} as const;
