import fs from "node:fs";
import path from "node:path";
import { uploadProductsToCloud } from "./product-cloud";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  images: ProductImage[];
  tags: string[];
  brand: string;
  gtin?: string;
  mpn?: string;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  condition: "new" | "refurbished" | "used";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "src", "data", "products.json");

function ensureFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function readProducts(): ProductData[] {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function writeProducts(products: ProductData[]): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
  uploadProductsToCloud(products).catch(() => {});
}

export function getProductBySlug(slug: string): ProductData | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): ProductData | undefined {
  return readProducts().find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): ProductData[] {
  return readProducts().filter((p) => p.categoryId === categoryId);
}

export function createProduct(data: Omit<ProductData, "id" | "createdAt" | "updatedAt">): ProductData {
  const products = readProducts();
  const product: ProductData = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(product);
  writeProducts(products);
  return product;
}

export function updateProduct(id: string, data: Partial<Omit<ProductData, "id" | "createdAt">>): ProductData | null {
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  
  products[idx] = {
    ...products[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  writeProducts(products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const products = readProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeProducts(filtered);
  return true;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ğ]/g, "g")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
