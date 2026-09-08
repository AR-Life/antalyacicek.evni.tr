import { readProducts } from "../../lib/products-store";
import { uploadProductsToCloud } from "../../lib/product-cloud";
import { isAdminRequest } from "../../lib/admin-auth";

export const POST = async ({ request }: { request: Request }) => {
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });

  const products = readProducts();
  await uploadProductsToCloud(products);

  return new Response(JSON.stringify({ synced: products.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
