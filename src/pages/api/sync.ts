import { readProducts } from "../../lib/products-store";
import { uploadProductsToCloud } from "../../lib/product-cloud";
import { requireAuth } from "../../lib/auth-guard";

export const POST = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const products = readProducts();
  await uploadProductsToCloud(products);

  return new Response(JSON.stringify({ synced: products.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
