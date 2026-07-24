import { readProducts } from "../../lib/products-store";
import { uploadProductsToCloud } from "../../lib/product-cloud";

export const POST = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const products = readProducts();
  await uploadProductsToCloud(products);

  return new Response(JSON.stringify({ synced: products.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
