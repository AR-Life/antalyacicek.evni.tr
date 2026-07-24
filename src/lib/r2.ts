import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

function getEnv(key: string): string {
  return (import.meta.env?.[key] || process.env?.[key] || "") as string;
}

const R2 = new S3Client({
  region: "auto",
  endpoint: getEnv("R2_ENDPOINT"),
  credentials: {
    accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
  },
  forcePathStyle: true,
});

const BUCKET = getEnv("R2_BUCKET_NAME") || "antalyacicek";
const PUBLIC_URL = getEnv("R2_PUBLIC_URL") || "";

export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

export async function uploadToR2(
  file: File,
  folder: string = "products"
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "webp";
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const upload = new Upload({
    client: R2,
    params: {
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    },
  });

  await upload.done();
  return getPublicUrl(key);
}

export async function deleteFromR2(key: string): Promise<void> {
  await R2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key.replace(`${PUBLIC_URL}/`, ""),
    })
  );
}
