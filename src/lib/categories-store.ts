import { defaultCategories } from "../data/categories";
import type { Category } from "../data/categories";

let inMemoryCategories = [...defaultCategories];

export function readCategories(): Category[] {
  return [...inMemoryCategories];
}

export function writeCategories(categories: Category[]): void {
  inMemoryCategories = [...categories];
}

export function createCategory(data: Omit<Category, "id">): Category {
  const newCat: Category = {
    ...data,
    id: `cat-${Date.now()}`,
  };
  inMemoryCategories.push(newCat);
  return newCat;
}

export function updateCategory(id: string, data: Partial<Omit<Category, "id">>): Category | null {
  const idx = inMemoryCategories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  
  inMemoryCategories[idx] = {
    ...inMemoryCategories[idx],
    ...data,
  };
  return inMemoryCategories[idx];
}

export function deleteCategory(id: string): boolean {
  const initialLength = inMemoryCategories.length;
  inMemoryCategories = inMemoryCategories.filter((c) => c.id !== id);
  return inMemoryCategories.length !== initialLength;
}
