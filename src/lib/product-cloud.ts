import type { ProductData } from "./products-store";

export async function uploadProductsToCloud(products: ProductData[]): Promise<void> {
  // Mocked for Edge environment compatibility
}

export async function loadProductsFromCloud(): Promise<ProductData[] | null> {
  // Mocked for Edge environment compatibility
  return null;
}

export async function uploadBufferToR2(buffer: any, key: string, contentType: string): Promise<string> {
  // Mocked for Edge environment compatibility
  return "";
}

export function getPublicUrl(): string {
  return "";
}
