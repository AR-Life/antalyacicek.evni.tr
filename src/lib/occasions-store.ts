import { defaultOccasions } from "../data/occasions";
import type { Occasion } from "../data/occasions";

let inMemoryOccasions = [...defaultOccasions];

export function readOccasions(): Occasion[] {
  return [...inMemoryOccasions];
}

export function writeOccasions(occasions: Occasion[]): void {
  inMemoryOccasions = [...occasions];
}

export function createOccasion(data: Omit<Occasion, "id">): Occasion {
  const newOcc: Occasion = {
    ...data,
    id: `occ-${Date.now()}`,
  };
  inMemoryOccasions.push(newOcc);
  return newOcc;
}

export function updateOccasion(id: string, data: Partial<Omit<Occasion, "id">>): Occasion | null {
  const idx = inMemoryOccasions.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  
  inMemoryOccasions[idx] = {
    ...inMemoryOccasions[idx],
    ...data,
  };
  return inMemoryOccasions[idx];
}

export function deleteOccasion(id: string): boolean {
  const initialLength = inMemoryOccasions.length;
  inMemoryOccasions = inMemoryOccasions.filter((o) => o.id !== id);
  return inMemoryOccasions.length !== initialLength;
}
