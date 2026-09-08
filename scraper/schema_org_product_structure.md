# Schema.org Ürün (Product) Veri Yapısı

Tıklacıçek'ten çekeceğimiz verileri sitemize eklerken SEO açısından maksimum fayda sağlamak için Google'ın arama sonuçlarında (Rich Snippets) ürün fiyatını, stok durumunu ve yıldızlarını göstermesini sağlayan **Schema.org/Product** yapısını kullanacağız. 

Veritabanı şemamıza (Drizzle ORM) ve Astro'nun SEO yapısına tam uyumlu olacak JSON-LD şeması aşağıdaki gibidir:

## TypeScript Arayüzü (Interface)

Astro tarafında veya verileri çekerken kullanacağımız tip tanımlaması:

```typescript
interface SchemaOrgProduct {
  "@context": "https://schema.org/";
  "@type": "Product";
  /** Ürünün tam adı (Örn: Lilya Esintisi Buketi) */
  name: string;
  /** Ürünün detaylı SEO açıklaması */
  description: string;
  /** Ürün görselinin tam URL'si */
  image: string[];
  /** Sitemizdeki benzersiz ürün kodu veya URL slug'ı */
  sku: string;
  /** (Varsa) Global Ticari Ürün Numarası - Çiçeklerde genelde olmaz */
  gtin14?: string;
  /** Marka (Örn: Antalya Çiçek) */
  brand: {
    "@type": "Brand";
    name: string;
  };
  /** Teklif / Fiyatlandırma detayları */
  offers: {
    "@type": "Offer";
    /** Sitemizdeki ürün linki (Örn: https://antalyacicek.evni.tr/urun/lilya-esintisi) */
    url: string;
    /** Ürün fiyatı (Örn: 5290.00) */
    price: number;
    /** Para birimi (Örn: TRY) */
    priceCurrency: "TRY" | "USD" | "EUR";
    /** Stok durumu (Örn: https://schema.org/InStock) */
    availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
    /** Durumu (Örn: https://schema.org/NewCondition) */
    itemCondition: "https://schema.org/NewCondition";
  };
  /** (Varsa) Ürün Değerlendirmeleri ve Yıldızlar */
  aggregateRating?: {
    "@type": "AggregateRating";
    /** Ortalama puan (Örn: 4.8) */
    ratingValue: number;
    /** Toplam yorum sayısı (Örn: 24) */
    reviewCount: number;
  };
}
```

## Örnek JSON-LD Çıktısı

Astro sayfamızın `<head>` etiketleri arasına eklenecek olan, arama motorlarının okuyacağı örnek JSON yapısı:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Lilya Esintisi Buketi",
  "description": "Saf beyaz lilyumların zarafeti, pastel tonlardaki çiçeklerin romantik uyumuyla buluştu... Özel günler için zarif bir seçimdir.",
  "image": [
    "https://antalyacicek.evni.tr/uploads/urunler/lilya-esintisi-buketi.webp"
  ],
  "sku": "CK142",
  "brand": {
    "@type": "Brand",
    "name": "Antalya Çiçek"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://antalyacicek.evni.tr/urun/lilya-esintisi-buketi",
    "priceCurrency": "TRY",
    "price": "5290.00",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

## Scraping (Veri Çekme) Aşamasında Hedeflenecek Alanlar

Yukarıdaki SEO yapısını doldurabilmek için tiklacicek.com'dan şu alanları net olarak çekmemiz gerekiyor:

1. **`name`**: Sayfadaki `<h1 class="product-title">`
2. **`description`**: `<meta name="description">` içeriği
3. **`image`**: Ana ürün görselinin `src` adresi (Kendi sunucumuza indirip WebP formatında sunacağız)
4. **`sku`**: Karşı sitenin ürün kodu (Örn: Butondaki toggleFavorite fonksiyonu içindeki `'CK142'` parametresi)
5. **`price`**: Fiyat bilgisi (Örn: `5290.00`)
6. **`url`**: Kendi sistemimizde oluşturacağımız URL (Slug bilgisini karşı sitenin URL'sinden `lilya-esintisi-buketi` şeklinde alacağız)

> [!TIP]
> Çiçek ürünlerinde kargo/teslimat genellikle bölgeye özel olduğu için Schema.org'un `shippingDetails` özelliği de eklenebilir ancak ilk aşamada temel Product yapısı Google'da fiyat ve resim çıkması için yeterlidir.

Hazırladığım bu veri yapısı uygunsa, scraper kodunu direkt olarak bu yapıyı (JSON) oluşturacak şekilde yazabilirim. Hazır mıyız?
