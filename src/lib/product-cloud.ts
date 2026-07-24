import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { gzipSync, gunzipSync } from "node:zlib";
import type { ProductData } from "./products-store";

function env(key: string): string {
  return (import.meta.env?.[key] || process.env?.[key] || "") as string;
}

const R2 = new S3Client({
  region: "auto",
  endpoint: env("R2_ENDPOINT"),
  credentials: {
    accessKeyId: env("R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
  },
  forcePathStyle: true,
});

const BUCKET = env("R2_BUCKET_NAME") || "antalyacicek";
const PUBLIC_URL = env("R2_PUBLIC_URL") || "";
const PRODUCTS_KEY = "data/products.json.gz";
const LOCAL_CACHE_TTL = 60_000; // 1 dakika
let cachedProducts: ProductData[] | null = null;
let cacheTime = 0;

function isCloudConfigured(): boolean {
  return !!(env("R2_ENDPOINT") && env("R2_ACCESS_KEY_ID") && env("R2_SECRET_ACCESS_KEY"));
}

export async function uploadProductsToCloud(products: ProductData[]): Promise<void> {
  if (!isCloudConfigured()) return;
  const compressed = gzipSync(JSON.stringify(products), { level: 9 });
  await R2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: PRODUCTS_KEY,
    Body: compressed,
    ContentType: "application/gzip",
    ContentEncoding: "gzip",
    CacheControl: "public, max-age=60",
  }));
  cachedProducts = products;
  cacheTime = Date.now();
}

export async function loadProductsFromCloud(): Promise<ProductData[] | null> {
  if (!isCloudConfigured()) return null;
  if (cachedProducts && Date.now() - cacheTime < LOCAL_CACHE_TTL) return cachedProducts;

  try {
    const res = await R2.send(new GetObjectCommand({ Bucket: BUCKET, Key: PRODUCTS_KEY }));
    if (!res.Body) return null;

    const chunks: Buffer[] = [];
    for await (const chunk of res.Body as any) chunks.push(Buffer.from(chunk));
    const decompressed = gunzipSync(Buffer.concat(chunks)).toString("utf-8");
    const products = JSON.parse(decompressed);
    cachedProducts = products;
    cacheTime = Date.now();
    return products;
  } catch {
    return null;
  }
}

export async function uploadBufferToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  if (!isCloudConfigured()) return "";
  await R2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return `${PUBLIC_URL}/${key}`;
}

export function getPublicUrl(): string {
  return PUBLIC_URL;
}
