export interface Occasion {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const defaultOccasions: Occasion[] = [
  {
    id: "occ-1",
    name: "Anneye Çiçek",
    slug: "anneye-cicek",
    description: "Annenize en özel çiçek aranjmanları",
    icon: "💐",
  },
  {
    id: "occ-2",
    name: "Babaya Çiçek",
    slug: "babaya-cicek",
    description: "Babanıza şık ve anlamlı çiçekler",
    icon: "🌿",
  },
  {
    id: "occ-3",
    name: "Sevgiliye Çiçek",
    slug: "sevgiliye-cicek",
    description: "Aşkınızı ifade eden romantik buketler",
    icon: "❤️",
  },
  {
    id: "occ-4",
    name: "Doğum Günü Çiçekleri",
    slug: "dogum-gunu-cicekleri",
    description: "Doğum gününü özel kılacak çiçekler",
    icon: "🎂",
  },
  {
    id: "occ-5",
    name: "Bebek Doğum Çiçekleri",
    slug: "bebek-dogum-cicekleri",
    description: "Yeni doğan bebek için tebrik çiçekleri",
    icon: "👶",
  },
  {
    id: "occ-6",
    name: "Düğün / Nişan / Söz",
    slug: "dugun-nisan-soz",
    description: "Özel günler için zarif çiçekler",
    icon: "💍",
  },
  {
    id: "occ-7",
    name: "Yıl Dönümü Çiçeği",
    slug: "yil-donumu-cicegi",
    description: "Yıl dönümünüzü kutlayan buketler",
    icon: "🥂",
  },
  {
    id: "occ-8",
    name: "Özür Çiçekleri",
    slug: "ozur-cicekleri",
    description: "Özrünüzü ifade eden anlamlı çiçekler",
    icon: "🙏",
  },
  {
    id: "occ-9",
    name: "Erkeğe Çiçek",
    slug: "erkege-cicek",
    description: "Erkeklere özel şık aranjmanlar",
    icon: "🎁",
  },
  {
    id: "occ-10",
    name: "Geçmiş Olsun Çiçekleri",
    slug: "gecmis-olsun-cicekleri",
    description: "Geçmiş olsun dilek çiçekleri",
    icon: "🌸",
  },
  {
    id: "occ-11",
    name: "Tebrik Çiçekleri",
    slug: "tebrik-cicekleri",
    description: "Başarı ve tebrik için çiçekler",
    icon: "🎉",
  },
  {
    id: "occ-12",
    name: "Yeni Yıl Çiçekleri",
    slug: "yeni-yil-cicekleri",
    description: "Yeni yılı karşılayan özel aranjmanlar",
    icon: "🎄",
  },
];

import fs from "node:fs";
import path from "node:path";

export function getAllOccasions(): Occasion[] {
  try {
    const dataFile = path.join(process.cwd(), "src", "data", "occasions.json");
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
  return [...defaultOccasions];
}

export const occasions: Occasion[] = getAllOccasions();
