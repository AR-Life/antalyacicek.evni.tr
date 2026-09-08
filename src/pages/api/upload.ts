import { uploadBufferToR2 } from "../../lib/product-cloud";
import { isAdminRequest } from "../../lib/admin-auth";

export const POST = async ({ request }: { request: Request }) => {
  if (!isAdminRequest(request)) return new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return new Response(JSON.stringify({ error: "Dosya yok" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  const validFiles = files.filter((file) => {
    if (!allowedTypes.has(file.type)) return false;
    if (file.size <= 0 || file.size > 10 * 1024 * 1024) return false;
    return true;
  });

  if (validFiles.length === 0) {
    return new Response(JSON.stringify({ error: "Yalnızca JPG, PNG, WEBP veya GIF görseller yüklenebilir (10MB azami)" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const urls = await Promise.all(
    validFiles.map(async (file) => {
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
