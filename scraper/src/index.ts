import 'dotenv/config';
import { runCrawler } from './core/crawler';
import { tiklacicekConfig } from './sites/tiklacicek';

async function main() {
    // Sadece tiklacicekConfig'i çalıştırıyoruz
    await runCrawler(tiklacicekConfig);
}

main().catch((error) => {
    console.error("Uygulama Hatası:", error);
});
