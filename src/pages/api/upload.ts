import { uploadBufferToR2 } from "../../lib/product-cloud";

export const POST = async ({ request }: { request: Request }) => {
  const token = request.headers.get("cookie")?.includes("admin_token=authenticated");
  if (!token) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return new Response(JSON.stringify({ error: "Dosya yok" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const urls = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop() || "webp";
      const key = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      return uploadBufferToR2(buffer, key, file.type);
    })
  );

  return new Response(JSON.stringify({ urls: urls.filter(Boolean) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
