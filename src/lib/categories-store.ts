import fs from "node:fs";
import path from "node:path";
import { defaultCategories } from "../data/categories";
import type { Category } from "../data/categories";

const DATA_FILE = path.join(process.cwd(), "src", "data", "categories.json");

function ensureFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultCategories, null, 2), "utf-8");
  }
}

export function readCategories(): Category[] {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function writeCategories(categories: Category[]): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

export function createCategory(data: Omit<Category, "id">): Category {
  const categories = readCategories();
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}`,
  };
  categories.push(newCat);
  writeCategories(categories);
  return newCat;
}

export function updateCategory(id: string, data: Partial<Omit<Category, "id">>): Category | null {
  const categories = readCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  
  categories[idx] = {
    ...categories[idx],
    ...data,
  };
  writeCategories(categories);
  return categories[idx];
}

export function deleteCategory(id: string): boolean {
  const categories = readCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  writeCategories(filtered);
  return true;
}
