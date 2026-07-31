import { readProducts } from "../../../lib/products-store";

export const GET = async () => {
  const products = readProducts();
  
  const searchProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice,
    image: p.images?.[0]?.url || "",
    images: p.images,
    tags: p.tags || [],
    categoryId: p.categoryId,
  }));

  return new Response(JSON.stringify(searchProducts), {
    status: 200,
    headers: { 
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300"
    },
  });
};
