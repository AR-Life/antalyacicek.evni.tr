import { SiteConfig } from '../core/crawler';

export const tiklacicekConfig: SiteConfig = {
    name: 'tiklacicek',
    sitemapUrl: 'https://www.tiklacicek.com/sitemap.xml',
    productUrlRegex: /https:\/\/www\.tiklacicek\.com\/urun\/.+/,
    
    extract: ($, url) => {
        // Tıklaçiçek SEO için Schema.org JSON-LD verisi sağlıyor.
        // Sayfadaki "application/ld+json" scriptlerini bulup Product olanı çekmek en sağlıklı yoldur.
        let productData: any = null;

        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const jsonContent = $(el).html() || '';
                const parsed = JSON.parse(jsonContent.trim());
                // Bazen dizi içinde de olabiliyor
                if (Array.isArray(parsed)) {
                    const product = parsed.find(item => item['@type'] === 'Product');
                    if (product) productData = product;
                } else if (parsed['@type'] === 'Product') {
                    productData = parsed;
                }
            } catch (e) {
                // Parse error, ignore
            }
        });

        if (productData) {
            return {
                source_url: url,
                name: productData.name || '',
                slug: new URL(url).pathname.split('/').pop() || '',
                description: productData.description || '',
                price: productData.offers?.price ? parseFloat(productData.offers.price) : 0,
                currency: productData.offers?.priceCurrency || 'TRY',
                images: productData.image ? (Array.isArray(productData.image) ? productData.image : [productData.image]) : [],
                sku: productData.sku || ''
            };
        }

        // Eğer JSON-LD bulunamazsa fallback olarak sayfadaki HTML'den çekmeyi deneriz.
        const fallbackName = $('h1').first().text().trim();
        const priceText = $('.price, .product-price').first().text() || '';
        const priceMatch = priceText.match(/[\d,.]+/);
        const fallbackPrice = priceMatch ? parseFloat(priceMatch[0].replace('.', '').replace(',', '.')) : 0;
        const fallbackDescription = $('#description').text().trim() || $('.product-description').text().trim();
        
        const fallbackImages: string[] = [];
        $('.product-image img, .gallery img, .swiper-slide img').each((_, el) => {
            const src = $(el).attr('src');
            if (src && !fallbackImages.includes(src)) {
                fallbackImages.push(src.startsWith('http') ? src : `https://www.tiklacicek.com${src}`);
            }
        });

        return {
            source_url: url,
            name: fallbackName,
            slug: new URL(url).pathname.split('/').pop() || '',
            description: fallbackDescription,
            price: fallbackPrice,
            currency: "TRY",
            images: fallbackImages,
            sku: $('.sku').text().trim()
        };
    }
};
