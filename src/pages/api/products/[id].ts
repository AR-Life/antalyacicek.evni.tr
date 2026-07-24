import { getProductById, updateProduct, deleteProduct } from "../../../lib/products-store";

export const GET = async ({ request, params }: { request: Request; params: { id: string } }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const product = getProductById(params.id);
  if (!product) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PUT = async ({ request, params }: { request: Request; params: { id: string } }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const product = updateProduct(params.id, body);
  if (!product) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE = async ({ request, params }: { request: Request; params: { id: string } }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const success = deleteProduct(params.id);
  if (!success) return new Response("Not found", { status: 404 });

  return new Response(null, { status: 204 });
};
