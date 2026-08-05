import type { ProductImage } from "../lib/products-store";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  image: string;
  images?: ProductImage[];
  tags: string[];
  occasions?: string[];
  delivery: string;
}

export const products: Product[] = [
  {
    id: "p-1",
    name: "Renkli Papatya Buketi ile Sıcacık Bir Gülümseme",
    slug: "renkli-papatya-buketi-ile-sicacik-bir-gulumseme",
    description: "Canlı renkleriyle içimizi ısıtan rengarenk papatyalardan oluşan özel tasarım buket. Sevdiklerinize sıcak bir gülümseme hediye edin.",
    price: 2099,
    oldPrice: 2518.80,
    categoryId: "cat-30",
    image: "/images/thumb_renkli-papatya-buketi-ile-sicacik-bir-gulumseme-351.webp",
    tags: ["papatya", "renkli", "neşeli"],
    occasions: ["dogum-gunu-cicekleri", "tebrik-cicekleri"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-2",
    name: "Lila Saf Neşe Buketi",
    slug: "lila-saf-nese-buketi",
    description: "Eflatun tonlarında zarif çiçeklerden oluşan lila buket. Saflığı ve neşeyi bir arada sunan özel tasarım.",
    price: 1899,
    oldPrice: 2278.80,
    categoryId: "cat-28",
    image: "/images/thumb_lila-saf-nese-buketi-354.webp",
    tags: ["lila", "premium", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-3",
    name: "Beyaz Krizantemlerle Saf Zarafet Buketi",
    slug: "beyaz-krizantemlerle-saf-zarafet-buketi",
    description: "Beyaz krizantemlerin zarafetini yansıtan sade ve şık buket. Saflığın ve zarafetin simgesi.",
    price: 2299,
    oldPrice: 2758.80,
    categoryId: "cat-28",
    image: "/images/thumb_beyaz-krizantemlerle-saf-zarafet-buketi-391.webp",
    tags: ["krizantem", "beyaz", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-4",
    name: "Beyaz Papatya Saflık Buketi",
    slug: "beyaz-papatya-saflik-buketi",
    description: "Beyaz papatyaların saf güzelliğini sunan klasik buket. Her ortama uyum sağlayan zamansız tasarım.",
    price: 2199,
    oldPrice: 2638.80,
    categoryId: "cat-30",
    image: "/images/thumb_beyaz-papatya-saflik-buketi-350.webp",
    tags: ["papatya", "beyaz", "klasik"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-5",
    name: "Beyaz & Lila Saflık Buketi",
    slug: "beyaz-lila-saflik-buketi",
    description: "Beyaz ve lila çiçeklerin uyumuyla oluşturulmuş zarif buket. İki rengin mükemmel dansı.",
    price: 1899,
    oldPrice: 2278.80,
    categoryId: "cat-28",
    image: "/images/thumb_beyaz-lila-saflik-buketi-349.webp",
    tags: ["lila", "beyaz", "premium"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-6",
    name: "Kırmızı Güllü Lüks Kutuda Sürpriz Hediye Seti",
    slug: "kirmizi-gullu-luks-kutuda-surpriz-hediye-seti",
    description: "Kırmızı güllerle süslenmiş lüks kutuda özel sürpriz hediye seti. İstiridye inci kolye hediyeli.",
    price: 999,
    oldPrice: 1198.80,
    categoryId: "cat-36",
    image: "/images/thumb_kirmizi-gullu-luks-kutuda-surpriz-istiridye-inci-kolye-hediye-seti-403.webp",
    tags: ["gül", "kutu", "hediye seti", "lüks"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-7",
    name: "Saf Huzur Beyaz Papatya Buketi",
    slug: "saf-huzur-beyaz-papatya-buketi",
    description: "Huzur veren beyaz papatyalardan oluşan sade tasarım. Sakin ve dingin bir hediye seçeneği.",
    price: 1799,
    oldPrice: 2158.80,
    categoryId: "cat-30",
    image: "/images/thumb_saf-huzur-beyaz-papatya-buketi-357.webp",
    tags: ["papatya", "beyaz", "huzur"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-8",
    name: "Pastel Krizantem Buketi",
    slug: "pastel-krizantem-buketi",
    description: "Pastel tonlarda krizantemlerle hazırlanmış yumuşak ve romantik buket tasarımı.",
    price: 2099,
    oldPrice: 2518.80,
    categoryId: "cat-28",
    image: "/images/thumb_pastel-krizantem-buketi-347.webp",
    tags: ["krizantem", "pastel", "romantik"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-9",
    name: "Mor & Pembe Bahar Esintisi",
    slug: "mor-pembe-bahar-esintisi",
    description: "Mor ve pembe tonlarının uyumuyla baharı evinize getiren etkileyici çiçek aranjmanı.",
    price: 2799,
    oldPrice: 3358.80,
    categoryId: "cat-28",
    image: "/images/thumb_mor-pembe-bahar-esintisi-348.webp",
    tags: ["mor", "pembe", "bahar", "premium"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-10",
    name: "Rengarenk Papatya Buketi",
    slug: "rengarenk-papatya-buketi",
    description: "Farklı renklerde papatyaların bir araya geldiği neşeli ve enerjik buket. Gününüzü renklendirsin.",
    price: 1899,
    oldPrice: 2278.80,
    categoryId: "cat-30",
    image: "/images/thumb_rengarenk-papatya-buketi-314.webp",
    tags: ["papatya", "renkli", "neşeli"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-11",
    name: "Beyaz Papatyalar Zamansız Şıklık Buketi",
    slug: "beyaz-papatyalar-zamansiz-siklik-buketi",
    description: "Beyaz papatyalarla hazırlanmış zarif tasarım. Her zaman şık, her zaman etkileyici.",
    price: 2599,
    oldPrice: 3118.80,
    categoryId: "cat-30",
    image: "/images/thumb_beyaz-papatyalar-zamansiz-siklik-buketi-393.webp",
    tags: ["papatya", "beyaz", "şık"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-12",
    name: "Pembe & Beyaz Papatyalarla Zarif Buket",
    slug: "pembe-beyaz-papatyalarla-zarif-buket",
    description: "Pembe ve beyaz papatyaların zarif birleşimi. Romantik ve şık bir hediye alternatifi.",
    price: 2199,
    oldPrice: 2638.80,
    categoryId: "cat-30",
    image: "/images/thumb_pembe-beyaz-papatyalarla-zarif-buket-392.webp",
    tags: ["papatya", "pembe", "beyaz", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-13",
    name: "Pembe Dokunuşlu Zarafet Buketi",
    slug: "pembe-dokunuslu-zarafet-buketi",
    description: "Pembe tonların ön planda olduğu, zarafeti ve şıklığı yansıtan özel buket tasarımı.",
    price: 1899,
    oldPrice: 2278.80,
    categoryId: "cat-28",
    image: "/images/thumb_pembe-dokunuslu-zarafet-buketi-358.webp",
    tags: ["pembe", "zarif", "premium"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-14",
    name: "41 Adet Kucak Dolusu İthal Güller 70cm",
    slug: "41-adet-kucak-dolusu-ithal-guller",
    description: "41 adet ithal 70 cm kırmızı gülden oluşan kucak dolusu muhteşem buket. Görkemli bir aşk ilanı.",
    price: 6199,
    oldPrice: 7438.80,
    categoryId: "cat-29",
    image: "/images/thumb_41-adet-kucak-dolusu-ithal-guller-70cm-4.webp",
    tags: ["gül", "kırmızı", "ithal", "lüks", "popüler"],
    occasions: ["sevgiliye-cicek", "yil-donumu-cicegi"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-15",
    name: "41 Adet Beyaz Gül",
    slug: "41-adet-beyaz-gul",
    description: "41 adet saf beyaz gülden oluşan nefes kesici buket. Saflığın ve asaletin zirvesi.",
    price: 6299,
    oldPrice: 7558.80,
    categoryId: "cat-29",
    image: "/images/thumb_41-adet-beyaz-gul-285.webp",
    tags: ["gül", "beyaz", "lüks", "popüler"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-16",
    name: "41 Adet Kırmızı & Beyaz İthal Güller 70cm",
    slug: "41-adet-kirmizi-beyaz-ithal-guller",
    description: "Kırmızı ve beyaz ithal güllerin muhteşem uyumu. 41 adet 70 cm'lik premium güllerden oluşan özel buket.",
    price: 5999,
    oldPrice: 7198.80,
    categoryId: "cat-29",
    image: "/images/thumb_41-adet-kirmizi-ve-beyaz-ithal-guller-70cm-335.webp",
    tags: ["gül", "kırmızı", "beyaz", "lüks", "popüler"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-17",
    name: "Çift Dal Mavi Pembe Orkide",
    slug: "cift-dal-mavi-pembe-orkide",
    description: "Çift dal mavi ve pembe renkli özel orkide. Seramik saksıda uzun ömürlü zarif hediye.",
    price: 2799,
    oldPrice: 3358.80,
    categoryId: "cat-32",
    image: "/images/thumb_cift-dal-mavi-pembe-orkide-404.webp",
    tags: ["orkide", "mavi", "pembe", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-18",
    name: "20 Adet Kırmızı Gül Buketi",
    slug: "20-adet-kirmizi-gul-buketi",
    description: "20 dal en taze kırmızı gülden oluşan klasik buket. Aşkınızı ifade etmenin en etkileyici yolu.",
    price: 3399,
    oldPrice: 4078.80,
    categoryId: "cat-29",
    image: "/images/thumb_20-adet-kirmizi-gul-buketi-50.webp",
    tags: ["gül", "kırmızı", "aşk", "popüler"],
    occasions: ["sevgiliye-cicek", "yil-donumu-cicegi"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-19",
    name: "Karışık Renkli Gül Buketi",
    slug: "karisik-renkli-gul-buketi",
    description: "Farklı renklerde güllerin bir araya geldiği rengarenk buket. Canlı ve enerjik tasarım.",
    price: 3299,
    oldPrice: 3958.80,
    categoryId: "cat-29",
    image: "/images/thumb_karisik-renkli-gul-322.webp",
    tags: ["gül", "renkli", "karışık"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-20",
    name: "Papatya ve Tek Gül Buketi",
    slug: "papatya-ve-tek-gul-buketi",
    description: "Papatyalarla süslenmiş tek kırmızı gülün zarif birleşimi. Sade ama etkileyici hediye.",
    price: 1799,
    oldPrice: 2158.80,
    categoryId: "cat-29",
    image: "/images/thumb_papatya-ve-tek-gul-buketi-77.webp",
    tags: ["papatya", "gül", "sade", "romantik"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-21",
    name: "Beyaz Lilyum Zambak ve Papatya Buketi",
    slug: "beyaz-lilyum-zambak-ve-papatya-buketi",
    description: "Beyaz lilyum zambak ve papatyaların muhteşem birleşimi. Ferah ve zarif buket.",
    price: 2599,
    oldPrice: 3118.80,
    categoryId: "cat-31",
    image: "/images/thumb_beyaz-lilyum-zambak-ve-papatya-buketi-334.webp",
    tags: ["lilyum", "zambak", "beyaz", "papatya"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-22",
    name: "17 Gül ve Papatyalar Kucak Dolusu",
    slug: "17-gul-ve-papatyalar-kucak-dolusu",
    description: "17 gül ve papatyalardan oluşan kucak dolusu görkemli buket. Bolluk ve bereketin simgesi.",
    price: 4499,
    oldPrice: 5398.80,
    categoryId: "cat-29",
    image: "/images/thumb_17-gul-ve-papatyalar-kucak-dolusu-80.webp",
    tags: ["gül", "papatya", "lüks", "popüler"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-23",
    name: "Pembe Lilyum Zambak Buketi",
    slug: "pembe-lilyum-zambak-buketi",
    description: "Pembe lilyum zambaklarla hazırlanmış romantik ve etkileyici buket.",
    price: 1999,
    oldPrice: 2398.80,
    categoryId: "cat-31",
    image: "/images/thumb_pembe-lilyum-zambak-buketi-329.webp",
    tags: ["lilyum", "zambak", "pembe", "romantik"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-24",
    name: "21 Adet Kırmızı ve Beyaz Gül Buketi",
    slug: "21-adet-kirmizi-ve-beyaz-gul-buketi",
    description: "21 dal kırmızı ve beyaz güllerden oluşan özel buket. Aşk ve saflığın mükemmel birleşimi.",
    price: 3499,
    oldPrice: 4198.80,
    categoryId: "cat-29",
    image: "/images/thumb_21-adet-kirmizi-ve-beyaz-gul-buketi-330.webp",
    tags: ["gül", "kırmızı", "beyaz", "popüler"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-25",
    name: "Beyaz Lilyum Zambak ve Gül Buketi",
    slug: "beyaz-lilyum-zambak-ve-gul-buketi",
    description: "Beyaz lilyum zambak ve güllerle hazırlanmış asil ve lüks buket tasarımı.",
    price: 3299,
    oldPrice: 3958.80,
    categoryId: "cat-31",
    image: "/images/thumb_beyaz-lilyum-zambak-ve-gul-buketi-366.webp",
    tags: ["lilyum", "gül", "beyaz", "lüks"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-26",
    name: "Mor Papatya Buketi",
    slug: "mor-papatya-buketi",
    description: "Mor papatyalarla hazırlanmış özel buket. Huzur veren renkleriyle etkileyici hediye.",
    price: 1599,
    oldPrice: 1918.80,
    categoryId: "cat-30",
    image: "/images/thumb_mor-papatya-buketi-339.webp",
    tags: ["papatya", "mor", "huzur"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-27",
    name: "Zarif Bahar Buketi",
    slug: "zarif-bahar-buketi",
    description: "Baharın taze enerjisini yansıtan renkli ve zarif çiçek aranjmanı.",
    price: 1699,
    oldPrice: 2038.80,
    categoryId: "cat-28",
    image: "/images/thumb_zarif-bahar-buketi-341.webp",
    tags: ["bahar", "renkli", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-28",
    name: "Pembe Benekli Orkide",
    slug: "pembe-benekli-orkide",
    description: "Pembe benekli özel orkide. Dekoratif saksıda uzun ömürlü zarif hediye.",
    price: 2399,
    oldPrice: 2878.80,
    categoryId: "cat-32",
    image: "/images/thumb_pembe-benekli-orkide-217.webp",
    tags: ["orkide", "pembe", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-29",
    name: "Çift Dallı Beyaz Orkide",
    slug: "cift-dalli-beyaz-orkide",
    description: "Çift dallı saf beyaz orkide. Zarafeti ve asaletiyle her ortamı güzelleştirir.",
    price: 2399,
    oldPrice: 2878.80,
    categoryId: "cat-32",
    image: "/images/thumb_cift-dalli-beyaz-orkide-220.webp",
    tags: ["orkide", "beyaz", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-30",
    name: "17 Adet Turuncu & Beyaz Gül Buketi",
    slug: "17-adet-turuncu-beyaz-gul-buketi",
    description: "Turuncu ve beyaz güllerin enerjik birleşimi. 17 dal gülden oluşan canlı buket.",
    price: 2899,
    oldPrice: 3478.80,
    categoryId: "cat-29",
    image: "/images/thumb_17-adet-turuncu-beyaz-gul-buketi-401.webp",
    tags: ["gül", "turuncu", "beyaz", "canlı"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-31",
    name: "11 Adet Premium Gül Buketi",
    slug: "11-adet-premium-gul-buketi",
    description: "11 dal premium kalite gülden oluşan özel buket. Şıklığı ve zarafeti bir arada sunar.",
    price: 2199,
    oldPrice: 2638.80,
    categoryId: "cat-29",
    image: "/images/thumb_11-adet-premium-gul-buketi-399.webp",
    tags: ["gül", "premium", "şık"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-32",
    name: "25 Adet Beyaz İthal Güller",
    slug: "25-adet-beyaz-ithal-guller",
    description: "25 adet ithal beyaz gülden oluşan etkileyici buket. Saflığın ve asaletin ifadesi.",
    price: 4899,
    oldPrice: 5878.80,
    categoryId: "cat-29",
    image: "/images/thumb_25-adet-beyaz-ithal-guller-395.webp",
    tags: ["gül", "beyaz", "ithal", "lüks"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-33",
    name: "101 Adet Kırmızı İthal Güller 70cm",
    slug: "101-adet-kirmizi-ithal-guller",
    description: "101 adet ithal 70 cm kırmızı gül. Gösterişli ve büyüleyici bir aşk ilanı.",
    price: 12999,
    oldPrice: 15598.80,
    categoryId: "cat-29",
    image: "/images/thumb_101-adet-kirmizi-ithal-guller-70cm-378.webp",
    tags: ["gül", "kırmızı", "ithal", "lüks", "özel"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-34",
    name: "51 Adet Pembe İthal Güller 70cm",
    slug: "51-adet-pembe-ithal-guller",
    description: "51 adet ithal 70 cm pembe gül. Romantizmin ve zerafetin görkemli buluşması.",
    price: 7199,
    oldPrice: 8638.80,
    categoryId: "cat-29",
    image: "/images/thumb_51-adet-pembe-ithal-guller-70cm-369.webp",
    tags: ["gül", "pembe", "ithal", "lüks"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-35",
    name: "101 Adet Beyaz İthal Güller 70cm",
    slug: "101-adet-beyaz-ithal-guller",
    description: "101 adet ithal beyaz gül. Saflığın ve asaletin en görkemli ifadesi.",
    price: 12999,
    oldPrice: 15598.80,
    categoryId: "cat-29",
    image: "/images/thumb_101-adet-beyaz-ithal-guller-70cm-376.webp",
    tags: ["gül", "beyaz", "ithal", "lüks", "özel"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-36",
    name: "51 Adet Kırmızı İthal Güller 70cm",
    slug: "51-adet-kirmizi-ithal-guller",
    description: "51 adet ithal kırmızı gülden oluşan nefes kesici buket. Büyük aşklar için özel tasarım.",
    price: 7199,
    oldPrice: 8638.80,
    categoryId: "cat-29",
    image: "/images/thumb_31-adet-kirmizi-ithal-guller-70cm-368.webp",
    tags: ["gül", "kırmızı", "ithal", "lüks"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-37",
    name: "Örgülü Benjamin Ficus İthal Büyük Boy",
    slug: "orgulu-benjamin-ficus-ithal",
    description: "İthal büyük boy örgülü Benjamin Ficus bitkisi. Ev ve ofis için etkileyici dekoratif bitki.",
    price: 5499,
    oldPrice: 6598.80,
    categoryId: "cat-33",
    image: "/images/thumb_orgulu-benjami-n-fi-cus-ithal-buyuk-boy-437.webp",
    tags: ["bitki", "ithal", "ofis", "dekorasyon"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-38",
    name: "15 Adet Kırmızı Gül ve Papatya Buketi",
    slug: "15-adet-kirmizi-gul-papatya-buketi",
    description: "15 kırmızı gül ve papatyanın uyumu. Aşkın ve samimiyetin mükemmel birleşimi.",
    price: 3199,
    oldPrice: 3838.80,
    categoryId: "cat-29",
    image: "/images/thumb_15-adet-kirmizi-gul-ve-papatya-buketi-askin-ve-samimiyetin-uyumu-362.webp",
    tags: ["gül", "papatya", "kırmızı", "aşk"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-39",
    name: "Renkli Lisiantus Buketi",
    slug: "renkli-lisiantus-buketi",
    description: "Farklı renklerde lisiantus çiçeklerinden oluşan zarif ve uzun ömürlü buket.",
    price: 2299,
    oldPrice: 2758.80,
    categoryId: "cat-28",
    image: "/images/thumb_renkli-li-syantus-buketi-123.webp",
    tags: ["lisiantus", "renkli", "zarif"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-40",
    name: "Cam Vazoda Büyük Beyaz Lilyum",
    slug: "cam-vazoda-buyuk-beyaz-lilyum",
    description: "Cam vazoda büyük boy beyaz lilyumlar. Asaleti ve zarafetiyle etkileyici hediye.",
    price: 2299,
    oldPrice: 2758.80,
    categoryId: "cat-31",
    image: "/images/thumb_cam-vazoda-buyuk-beyaz-lilyum-284.webp",
    tags: ["lilyum", "beyaz", "vazo", "asalet"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-41",
    name: "Cam Vazoda Büyük Pembe Lilyum Zambak",
    slug: "cam-vazoda-buyuk-pembe-lilyum",
    description: "Cam vazoda büyük pembe lilyum zambak. Romantik ve etkileyici hediye seçeneği.",
    price: 2399,
    oldPrice: 2878.80,
    categoryId: "cat-31",
    image: "/images/thumb_cam-vazoda-buyuk-pembe-lilyum-zambak-283.webp",
    tags: ["lilyum", "pembe", "vazo", "romantik"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-42",
    name: "Beyaz Kutuda Güller",
    slug: "beyaz-kutuda-guller",
    description: "Şık beyaz kutuda özenle yerleştirilmiş kırmızı güller. Modern ve lüks hediye.",
    price: 4399,
    oldPrice: 5278.80,
    categoryId: "cat-36",
    image: "/images/thumb_beyaz-ruya-buketi-324.webp",
    tags: ["gül", "kutu", "lüks", "modern"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-43",
    name: "Kutuda 41 Adet Kırmızı Gül ve Ferrero Rocher Çikolata",
    slug: "kutuda-41-kirmizi-gul-ferrero",
    description: "41 kırmızı gül ve Ferrero Rocher çikolatalarla hazırlanmış lüks hediye seti.",
    price: 8199,
    oldPrice: 9838.80,
    categoryId: "cat-36",
    image: "/images/thumb_kutuda-41-adet-kirmizi-gul-ve-ferrero-rocher-cikolata-298.webp",
    tags: ["gül", "kutu", "çikolata", "lüks", "özel"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-44",
    name: "101 Adet Pembe Gül VIP Buketi",
    slug: "101-adet-pembe-gul-vip",
    description: "101 adet pembe gülden oluşan VIP buket. Görkemli ve unutulmaz bir hediye deneyimi.",
    price: 13599,
    oldPrice: 16318.80,
    categoryId: "cat-29",
    image: "/images/thumb_101-adet-pembe-gul-vip-buketi-276.webp",
    tags: ["gül", "pembe", "lüks", "özel", "vip"],
    delivery: "Aynı gün teslimat",
  },
  {
    id: "p-45",
    name: "101 Adet İthal Güller 70cm",
    slug: "101-adet-ithal-guller",
    description: "101 adet ithal 70 cm karışık renk güllerden oluşan görkemli buket.",
    price: 12499,
    oldPrice: 14998.80,
    categoryId: "cat-29",
    image: "/images/thumb_101-adet-ithal-guller-70cm-3.webp",
    tags: ["gül", "ithal", "lüks", "özel"],
    delivery: "Aynı gün teslimat",
  },
];

export function getProductsByCategory(categoryId: string): Product[] {
  const all = getAllProducts();
  return all.filter((p: any) => p.categoryId === categoryId);
}

export function getProductsByOccasion(occasionSlug: string): Product[] {
  const all = getAllProducts();
  return all.filter((p: any) => p.occasions?.includes(occasionSlug));
}

export function getBestSellers(): Product[] {
  const all = getAllProducts();
  return all.filter((p: any) => p.tags?.includes("popüler"));
}

export function getDiscounted(): Product[] {
  const all = getAllProducts();
  return all.filter((p: any) => p.oldPrice !== undefined && p.oldPrice > p.price);
}

import fs from "node:fs";
import path from "node:path";

function getAllProducts(): any[] {
  // Helper to assign differentiated, realistic occasions to each product so filters clearly change products
  const enrich = (p: any, idx: number = 0) => {
    const allOccasions = [
      "anneye-cicek",
      "babaya-cicek",
      "sevgiliye-cicek",
      "dogum-gunu-cicekleri",
      "bebek-dogum-cicekleri",
      "dugun-nisan-soz",
      "yil-donumu-cicegi",
      "ozur-cicekleri",
      "erkege-cicek",
      "gecmis-olsun-cicekleri",
      "tebrik-cicekleri",
      "yeni-yil-cicekleri"
    ];
    
    const text = ((p.name || "") + " " + (p.description || "") + " " + (p.tags || []).join(" ")).toLowerCase();
    const matched: string[] = [];

    // Kelime ve tema analizine göre özel eşleştirme
    if (text.includes("gül") || text.includes("kırmızı") || text.includes("lila") || text.includes("lüks") || text.includes("aşk") || text.includes("romant")) {
      matched.push("sevgiliye-cicek", "yil-donumu-cicegi", "ozur-cicekleri", "dogum-gunu-cicekleri");
    }
    if (text.includes("papatya") || text.includes("renkli") || text.includes("neşeli") || text.includes("krizantem") || text.includes("sarı")) {
      matched.push("dogum-gunu-cicekleri", "anneye-cicek", "gecmis-olsun-cicekleri", "yeni-yil-cicekleri", "tebrik-cicekleri");
    }
    if (text.includes("orkide") || text.includes("saksı") || text.includes("ofis") || text.includes("bitki") || text.includes("zarif") || text.includes("kutuda") || text.includes("beyaz")) {
      matched.push("tebrik-cicekleri", "babaya-cicek", "erkege-cicek", "dugun-nisan-soz", "bebek-dogum-cicekleri");
    }
    if (text.includes("çelenk") || text.includes("tören") || text.includes("cenaze") || text.includes("açılış")) {
      matched.push("dugun-nisan-soz", "tebrik-cicekleri");
    }

    // Her ürüne deterministik ek çeşitlilik ver (her kategori ve amaçta mutlaka farklı ürünler çıksın)
    const num = parseInt(String(p.id).replace(/\D/g, "") || String(idx), 10) || 0;
    matched.push(
      allOccasions[num % 12],
      allOccasions[(num + 3) % 12],
      allOccasions[(num + 5) % 12],
      allOccasions[(num + 8) % 12]
    );

    const finalOccasions = Array.from(new Set([...(p.occasions || []), ...matched])).filter(Boolean);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice,
      categoryId: p.categoryId,
      image: p.images?.[0]?.url || p.image || "",
      images: p.images,
      tags: p.tags || [],
      occasions: finalOccasions.length > 0 ? finalOccasions : ["dogum-gunu-cicekleri", "tebrik-cicekleri", "sevgiliye-cicek"],
      delivery: p.delivery || "Aynı gün teslimat",
    };
  };

  // Read from local products.json (admin keeps this in sync)
  // Cloud R2 sync happens in background via writeProducts
  try {
    const dataFile = path.join(process.cwd(), "src", "data", "products.json");
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf-8");
      const storeData = JSON.parse(raw);
      if (storeData.length > 0) {
        return storeData.map(enrich);
      }
    }
  } catch {}

  // Fallback to hardcoded
  return [...products].map(enrich);
}

export { getAllProducts };
