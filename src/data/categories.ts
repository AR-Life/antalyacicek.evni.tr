export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export const defaultCategories: Category[] = [
  {
    id: "cat-28",
    name: "Premium Buketler",
    slug: "premium-buketler",
    description: "Özenle hazırlanmış en özel buket seçenekleri",
    image: "/images/premium-buketler.svg",
  },
  {
    id: "cat-29",
    name: "Güller",
    slug: "guller",
    description: "Klasikten moderne en şık gül aranjmanları",
    image: "/images/guller.svg",
  },
  {
    id: "cat-30",
    name: "Papatyalar",
    slug: "papatyalar",
    description: "Zarif ve neşeli papatya buketleri",
    image: "/images/papatyalar.svg",
  },
  {
    id: "cat-31",
    name: "Lilyum / Zambak",
    slug: "lilyum-zambak",
    description: "Büyüleyici lilyum ve zambak aranjmanları",
    image: "/images/lilyum-zambak.svg",
  },
  {
    id: "cat-32",
    name: "Orkide & Saksı Çiçekleri",
    slug: "orkide-saksi-cicekleri",
    description: "Uzun ömürlü zarif orkide ve bitki seçenekleri",
    image: "/images/orkide-saksi.svg",
  },
  {
    id: "cat-36",
    name: "Kutuda Çiçekler",
    slug: "kutuda-cicekler",
    description: "Lüks kutu içinde özel tasarım aranjmanlar",
    image: "/images/kutuda-cicekler.svg",
  },
  {
    id: "cat-34",
    name: "Çelenk",
    slug: "celenk",
    description: "Anlamlı mesajlarınız için özel çelenkler",
    image: "/images/celenk.svg",
  },
  {
    id: "cat-33",
    name: "Ev & Ofis Bitkileri",
    slug: "ev-ofis-bitkileri",
    description: "Ev ve ofisinizi güzelleştirecek bitkiler",
    image: "/images/ev-ofis-bitkileri.svg",
  },
];

import fs from "node:fs";
import path from "node:path";

export function getAllCategories(): Category[] {
  try {
    const dataFile = path.join(process.cwd(), "src", "data", "categories.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const storeData = JSON.parse(raw);
      if (storeData.length > 0) {
        return storeData;
      }
    }
  } catch (err) {
    // Ignore errors in browser/client environment, or parsing issues
  }
  return [...defaultCategories];
}

export const categories: Category[] = getAllCategories();
