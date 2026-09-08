import { db } from "../../db";
import { media } from "../../db/schema";
import { requireAuth } from "../../lib/auth-guard";

export const GET = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const allMedia = await db.select().from(media).all();

  return new Response(JSON.stringify(allMedia), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let result = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    result += String.fromCharCode(...bytes.slice(i, i + chunkSize));
  }
  return btoa(result);
}

export const POST = async ({ request }: { request: Request }) => {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return new Response(JSON.stringify({ error: "Dosya yok" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const uploaded: { id: string; url: string; type: string }[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);
    const dataUrl = `data:${file.type};base64,${base64}`;

    const id = `media-${crypto.randomUUID()}`;

    await db.insert(media).values({
      id,
      url: dataUrl,
      type: "image",
      mimeType: file.type,
    });

    uploaded.push({ id, url: dataUrl, type: "image" });
  }

  return new Response(JSON.stringify({ uploaded }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
