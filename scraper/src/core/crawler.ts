import { CheerioCrawler, log, Dataset } from 'crawlee';
import type { CheerioAPI } from 'cheerio';
import fs from 'fs';
import path from 'path';

export interface SiteConfig {
    name: string;
    sitemapUrl: string;
    productUrlRegex: RegExp;
    extract: ($: CheerioAPI, url: string) => Promise<any> | any;
}

export async function runCrawler(config: SiteConfig) {
    log.info(`Starting crawler for ${config.name}...`);

    // Sync state (Hangi URL'yi en son hangi tarihte taradık?)
    const syncStatePath = path.join(process.cwd(), `storage/${config.name}_sync_state.json`);
    let syncState: Record<string, string> = {};
    if (fs.existsSync(syncStatePath)) {
        syncState = JSON.parse(fs.readFileSync(syncStatePath, 'utf-8'));
    }

    const crawler = new CheerioCrawler({
        // Sunucuyu yormamak ve engellenmemek için aynı anda atılacak istek sayısını düşürdük
        maxConcurrency: 1,
        minConcurrency: 1,
        maxRequestRetries: 3,
        requestHandlerTimeoutSecs: 60,

        async requestHandler({ request, $, enqueueLinks }: any) {
            // Sitemap'te isek
            if (request.url === config.sitemapUrl) {
                log.info(`Sitemap işleniyor: ${request.url}`);
                const requestsToAdd: any[] = [];
                let skippedCount = 0;

                $('url').each((_: any, el: any) => {
                    const loc = $(el).find('loc').text();
                    const lastmod = $(el).find('lastmod').text() || 'unknown';

                    if (config.productUrlRegex.test(loc)) {
                        // Eğer URL bizde kayıtlıysa ve lastmod değişmemişse atla
                        if (syncState[loc] && syncState[loc] === lastmod) {
                            skippedCount++;
                        } else {
                            requestsToAdd.push({ url: loc, userData: { lastmod } });
                        }
                    }
                });
                
                log.info(`Sitemap analizi: ${requestsToAdd.length} yeni/güncellenmiş ürün eklenecek, ${skippedCount} ürün değişmediği için atlandı.`);
                
                if (requestsToAdd.length > 0) {
                    // Sadece yeni veya güncellenen URL'leri sıraya ekle
                    await enqueueLinks({ 
                        urls: requestsToAdd.map(r => r.url),
                        transformRequestFunction(req) {
                            const match = requestsToAdd.find(r => r.url === req.url);
                            if (match) req.userData = match.userData;
                            return req;
                        }
                    });
                }
                return;
            }

            // Eğer bir ürün sayfasındaysak:
            if (config.productUrlRegex.test(request.url)) {
                log.info(`Ürün işleniyor: ${request.url}`);
                
                try {
                    // Siteye özel çıkarma mantığını çalıştır
                    const productData = await config.extract($, request.url);
                    
                    if (productData) {
                        // Veriyi kaydet (Crawlee Dataset)
                        await Dataset.pushData(productData);
                        log.info(`✅ Ürün başarıyla çıkarıldı: ${productData.name}`);

                        // Başarılı olursa syncState'i güncelle ve diske yaz
                        if (request.userData?.lastmod) {
                            syncState[request.url] = request.userData.lastmod;
                            fs.writeFileSync(syncStatePath, JSON.stringify(syncState, null, 2));
                        }
                    } else {
                        log.warning(`⚠️ Ürün verisi boş döndü: ${request.url}`);
                    }
                } catch (e) {
                    log.error(`❌ Ürün çıkarılamadı: ${request.url}`, { error: e });
                }
            }
        },
        
        failedRequestHandler({ request }: any) {
            log.error(`İstek başarısız oldu: ${request.url}`);
        },
    });

    await crawler.run([config.sitemapUrl]);
    log.info(`Tarama tamamlandı. Veriler 'storage/datasets/default' klasörüne kaydedildi.`);
}
