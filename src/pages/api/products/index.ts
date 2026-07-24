import { readProducts, createProduct } from "../../../lib/products-store";

export const GET = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const data = readProducts();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const product = createProduct(body);
  
  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
