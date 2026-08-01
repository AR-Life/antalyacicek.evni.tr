import fs from 'fs/promises';

const LOCALES = ["en", "ru", "de", "pl", "nl", "ro", "uk", "cs", "lt"];

const newStrings = {
  "ui.hero_badge": "45 Dakika VIP Teslimat",
  "ui.hero_title_line1": "Antalya'da Aşkı Başlatın:",
  "ui.hero_title_line2": "45 Dakikada Lüks Çiçek Teslimatı 🌹",
  "ui.hero_form_title": "Kimin İçin / Ne İçin?",
  "ui.other_purposes": "Diğer Gönderim Amacı",
  "ui.hero_delivery_guarantee": "Tüm Antalya'da 45 Dakika VIP Kurye Teslimatı Garantilidir",
  "ui.hero_find_surprise": "Sevimli Sürprizi Bul & Sipariş Ver 💐",
  "ui.hero_features": "Ücretsiz kart notu · Motorlu kurye · %100 tazelik",
  "occasion.sevgili": "Sevgiliye 💕",
  "occasion.dogum-gunu": "Doğum Günü 🎂",
  "occasion.is-terfi": "Yeni İş & Terfi 💼",
  "occasion.ozur-af": "Özür & Af 🙏",
  "occasion.anne": "Anneye 🌷",
  "occasion.yildonumu": "Yıldönümü 💍",
  "occasion.gelin-düğün": "Gelin & Düğün Buketi",
  "occasion.hasta-ziyareti": "Hasta Ziyareti & Geçmiş Olsun",
  "occasion.yeni-bebek": "Yeni Bebek Tebriki 👶",
  "occasion.ofis-acilis": "Ofis & İş yeri Açılışı",
  "occasion.ogretmenler-gunu": "Öğretmenler Günü",
  "occasion.kadinlar-gunu": "Kadınlar Günü",
  "occasion.sevgililer-gunu": "Sevgililer Günü Özel",
  "occasion.mezuniyet": "Mezuniyet Kutlaması",
  "occasion.arkadas-surpriz": "Arkadaştan Arkadaşa Sürpriz",
  "occasion.soz-nisan": "Söz & Nişan Masası Çiçeği",
  "occasion.kurumsal-hediye": "Kurumsal Hediye Aranjmanı",
  "occasion.kiz-isteme": "Ev Tanışma & Kız İsteme",
  "occasion.cenaze-celenk": "Cenaze & Çelenk Siparişi",
  "occasion.icimden-geldi": "İçimden Geldi (Neden Gerekmez) 😊",
  "ui.footer_occasions": "Özel Günler",
  "ui.footer_corporate": "Kurumsal",
  "ui.about_us": "Hakkımızda",
  "ui.contact": "İletişim",
  "ui.categories": "Kategoriler",
  "ui.all_products": "Tüm Ürünler",
  "ui.same_day_delivery": "Aynı Gün Teslimat",
  "ui.privacy_policy": "Gizlilik Politikası",
  "ui.kvkk": "KVKK",
  "ui.delivery_returns": "Teslimat ve İade",
  "ui.all_rights_reserved": "Tüm hakları saklıdır."
};

async function translateText(text, targetLang) {
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
  const trRaw = await fs.readFile('./src/i18n/locales/tr.json', 'utf-8');
  const trDict = JSON.parse(trRaw);
  for (const [k, v] of Object.entries(newStrings)) {
    trDict[k] = v;
  }
  await fs.writeFile('./src/i18n/locales/tr.json', JSON.stringify(trDict, null, 2));
  console.log("Updated tr.json");

  for (const lang of LOCALES) {
    console.log(`Processing ${lang}...`);
    const file = `./src/i18n/locales/${lang}.json`;
    let dict = {};
    try {
      const raw = await fs.readFile(file, 'utf-8');
      dict = JSON.parse(raw);
    } catch(e) {
      console.log(`Error reading ${lang}.json`);
    }

    let modified = false;
    for (const [key, trText] of Object.entries(newStrings)) {
      if (!dict[key]) {
        dict[key] = await translateText(trText, lang);
        modified = true;
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (modified) {
      await fs.writeFile(file, JSON.stringify(dict, null, 2));
      console.log(`Updated ${lang}.json`);
    } else {
      console.log(`No new keys for ${lang}.json`);
    }
  }
  console.log("All missing translations completed!");
}

main();
