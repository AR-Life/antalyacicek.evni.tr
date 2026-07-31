Aşağıdaki tasarım ve UI/UX hatalarını düzeltmek için projede kapsamlı bir refactoring yapmanı istiyorum. Amacımız, modern, ferah, "premium" hissettiren ve kullanıcıyı yormayan bir arayüz (Google Material Design 3 ve modern web trendleri) oluşturmak.

Lütfen aşağıdaki adımları sırasıyla uygula:

### 1. Kategori Alanı (Hero'nun Altındaki Grid) Tasarım Faciası
- **Sorun:** Kategoriler listelenirken gri devasa arka planlar üzerine küçücük bir ikon konmuş, yazılar okunmuyor ve çok yapay duruyor. Sayfada devasa bir alan kaplıyor.
- **Çözüm:** 
  - Kategori kartlarını tamamen yeniden tasarla. 
  - Sıkıcı `aspect-[4/5]` büyük gri kutular yerine, daha yatay, modern, yuvarlak hatlı (örneğin hap şeklinde `rounded-full` veya küçük şık kareler) minimal kartlar kullan.
  - Arka planları pastel tonlarda, soft renklerle (forest-50, rose-50 gibi) renklendir.
  - Kartların üzerine gelindiğinde (hover) smooth bir yukarı kayma (translate-y) ve zarif bir gölge efekti ekle.

### 2. Kategori Slider'larının Tekrarı ve Dikey Yığılma
- **Sorun:** Sayfada her kategori için alt alta tekrarlayan slider'lar var ("Premium Buketler", "Güller", "Papatyalar" vs.). Bu durum sayfayı inanılmaz derecede uzatıyor, kullanıcıyı yoruyor. Bazı kategorilerde sadece 1-2 ürün olmasına rağmen tüm bir satırı işgal ediyor.
- **Çözüm:** 
  - Her kategori için ayrı bir section/slider koymak yerine, ana sayfada **Tab'lı (Sekmeli) bir yapı** oluştur.
  - "Kategorilere Göre Ürünler" adında tek bir section yap.
  - Üstte kategorilerin isimleri sekmeler (butonlar) halinde yanyana dizilsin. Kullanıcı bir sekmeye tıkladığında, sadece o kategoriye ait ürünler o alandaki grid/slider içinde gösterilsin. (Bunu Vanilla JS ile basit bir sekme yapısı kurarak yapabilirsin).
  - Bu sayede sayfa yüksekliği devasa oranda kısalacak ve site çok daha modern görünecek.

### 3. "Tüm Ürünler" Bölümündeki Yığın Görüntüsü
- **Sorun:** Ana sayfada "Tüm Ürünler" başlığı altında devasa bir grid var ve bütün ürünler alt alta listeleniyor. Bu, ana sayfayı karmaşık bir kataloğa çevirip estetiği bozuyor.
- **Çözüm:**
  - Ana sayfadaki "Tüm Ürünler" gridini sadece "En Çok Satanlar" veya "Öne Çıkanlar" olarak sınırla (maksimum 4 veya 8 ürün gösterilsin).
  - Sınırlandırılan bu listenin altına şık bir "Tüm Ürünleri Gör" butonu ekle.

### 4. Header (Üst Menü) Karmaşası
- **Sorun:** Header'ın alt kısmında "Fırsatlar" ve "Kategoriler" için çok satırlı, karmaşık bir navigasyon alanı (quick-nav) var. Tasarımı çok kalabalık gösteriyor ve yorucu.
- **Çözüm:**
  - Header'ı sadeleştir. O kalabalık alt navigasyonu tamamen kaldır veya sadece en önemli duyuruları içeren ince şık bir banner (kayan yazı vb.) kullan.
  - Kategori ve fırsat linklerini ana menüye veya mobil menüye (drawer) taşı. Header olabildiğince "temiz" kalsın (Sadece Logo, Arama çubuğu, İletişim/Sipariş butonu ve Hamburger menü).

### 5. Ürün Kartları (Product Card) Modernizasyonu
- **Sorun:** Ürün kartlarındaki "Bu Çiçeği Gönder" butonu kartın içinde çok ağır duruyor (koyu yeşil ve tam genişlik). Kartlar çok klasik.
- **Çözüm:**
  - Ürün kartlarının köşelerini daha yumuşat (`rounded-2xl` veya `rounded-3xl`).
  - "Bu Çiçeği Gönder" butonu sürekli görünmek yerine, daha zarif bir ikona dönüşebilir ya da karta hover yapıldığında alttan slide-up (kayarak çıkan) şık bir butona dönüşebilir. 
  - Etiketleri (İndirim vb.) sol üst köşede daha modern, göze batmayan badge'ler olarak konumlandır.

### 6. Genel Tipografi ve Boşluk (Spacing) Uyumu
- **Sorun:** Bölümler arası boşluklar (margin/padding) çok dengesiz. Kategori sliderları birbirine yapışıkken diğer kısımlar çok ayrık.
- **Çözüm:**
  - Section'lar arası tutarlı bir padding hiyerarşisi kullan (örneğin tüm büyük section'lar için `py-16 lg:py-24`).
  - Arka plan renklerini her section için hafifçe değiştirerek (beyaz -> forest-50 -> beyaz -> rose-50) bölümleri birbirinden estetik bir şekilde ayır.

Lütfen bu tasarım kararlarını uygulayarak `src/pages/index.astro`, `src/components/Header.astro`, `src/components/HeroSection.astro`, `src/components/ProductCard.astro` ve sekme (tab) yapısını eklemek için ilgili yeni bileşenleri oluşturarak projeyi refactor et. TailwindCSS kullanarak soft shadows, glassmorphism ve hover transitions gibi modern UI tekniklerini uygulamayı unutma.
