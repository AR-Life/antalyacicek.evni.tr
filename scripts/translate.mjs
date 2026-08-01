import fs from 'fs/promises';
import path from 'path';

const LOCALES = ["en", "ru", "de", "pl", "nl", "ro", "uk", "cs", "lt"];

const uiStrings = {
  "ui.whatsapp_order": "Siparişinizi Hemen Verin",
  "ui.whatsapp_desc": "Yabancı misafirlerimiz için WhatsApp üzerinden tam destek sağlıyoruz. Aşağıdaki butona tıklayarak doğrudan çiçekçimizle görüşebilir, teslimat adresi ve notunuzu iletebilirsiniz.",
  "ui.order_btn": "WhatsApp ile Sipariş Ver",
  "ui.search_placeholder": "Çiçek adı ara...",
  "ui.all_flowers": "Tüm Çiçeklerimiz",
  "ui.home": "Ana Sayfa",
  "ui.flowers": "Çiçekler",
  "ui.collection_title": "Çiçek Koleksiyonumuz",
  "ui.collection_desc": "Sevdiklerinize en uygun, taze ve lüks tasarımları keşfedin. Aynı gün teslimat.",
  "ui.sale": "İndirim",
  "ui.matching_products": "Eşleşen Ürün Bulunamadı",
  "ui.clear_filters": "Filtreleri Temizle",
  "ui.stats": "Toplam {count} ürün bulunuyor",
  "ui.category": "Kategori",
  "ui.purpose": "Gönderim Amacı"
};

const categories = [
  { id: "cat-28", name: "Premium Buketler" },
  { id: "cat-29", name: "Güller" },
  { id: "cat-30", name: "Papatyalar" },
  { id: "cat-31", name: "Lilyum / Zambak" },
  { id: "cat-32", name: "Orkide & Saksı Çiçekleri" },
  { id: "cat-36", name: "Kutuda Çiçekler" },
  { id: "cat-34", name: "Çelenk" },
  { id: "cat-33", name: "Ev & Ofis Bitkileri" }
];

const occasions = [
  { id: "occ-1", name: "Anneye Çiçek" },
  { id: "occ-2", name: "Babaya Çiçek" },
  { id: "occ-3", name: "Sevgiliye Çiçek" },
  { id: "occ-4", name: "Doğum Günü Çiçekleri" },
  { id: "occ-5", name: "Bebek Doğum Çiçekleri" },
  { id: "occ-6", name: "Düğün / Nişan / Söz" },
  { id: "occ-7", name: "Yıl Dönümü Çiçeği" },
  { id: "occ-8", name: "Özür Çiçekleri" },
  { id: "occ-9", name: "Erkeğe Çiçek" },
  { id: "occ-10", name: "Geçmiş Olsun Çiçekleri" },
  { id: "occ-11", name: "Tebrik Çiçekleri" },
  { id: "occ-12", name: "Yeni Yıl Çiçekleri" }
];

async function translateText(text, targetLang) {
  // If it contains a placeholder {count}, split it
  if (text.includes("{count}")) {
    const parts = text.split("{count}");
    const tParts = [];
    for (const p of parts) {
      if (p.trim() === "") { tParts.push(""); continue; }
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(p)}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        tParts.push(data[0].map(x => x[0]).join(''));
      } catch (e) {
        tParts.push(p);
      }
    }
    return tParts.join("{count}");
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(x => x[0]).join('');
  } catch (e) {
    console.error(`Error translating to ${targetLang}:`, e);
    return text;
  }
}

async function main() {
  const productsRaw = await fs.readFile('./src/data/products.json', 'utf-8');
  const products = JSON.parse(productsRaw);
  
  const trDict = { ...uiStrings };
  for (const p of products) {
    trDict[`product.name.${p.slug}`] = p.name;
    trDict[`product.desc.${p.slug}`] = p.description;
  }
  for (const c of categories) {
    trDict[`category.${c.id}`] = c.name;
  }
  for (const o of occasions) {
    trDict[`occasion.${o.id}`] = o.name;
  }
  
  await fs.mkdir('./src/i18n/locales', { recursive: true });
  await fs.writeFile('./src/i18n/locales/tr.json', JSON.stringify(trDict, null, 2));
  console.log("Created TR base translations.");

  for (const lang of LOCALES) {
    console.log(`Translating to ${lang}...`);
    const dict = {};
    for (const [key, text] of Object.entries(trDict)) {
      dict[key] = await translateText(text, lang);
      await new Promise(r => setTimeout(r, 100)); // anti-rate limit
    }
    await fs.writeFile(`./src/i18n/locales/${lang}.json`, JSON.stringify(dict, null, 2));
    console.log(`Finished ${lang}`);
  }
  console.log("All translations completed!");
}

main();
