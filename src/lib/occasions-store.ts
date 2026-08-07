import fs from "node:fs";
import path from "node:path";
import { defaultOccasions } from "../data/occasions";
import type { Occasion } from "../data/occasions";

const DATA_FILE = path.join(process.cwd(), "src", "data", "occasions.json");

function ensureFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultOccasions, null, 2), "utf-8");
  }
}

export function readOccasions(): Occasion[] {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function writeOccasions(occasions: Occasion[]): void {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(occasions, null, 2), "utf-8");
}

export function createOccasion(data: Omit<Occasion, "id">): Occasion {
  const occasions = readOccasions();
  const newOcc: Occasion = {
    ...data,
    id: `occ-${Date.now()}`,
  };
  occasions.push(newOcc);
  writeOccasions(occasions);
  return newOcc;
}

export function updateOccasion(id: string, data: Partial<Omit<Occasion, "id">>): Occasion | null {
  const occasions = readOccasions();
  const idx = occasions.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  
  occasions[idx] = {
    ...occasions[idx],
    ...data,
  };
  writeOccasions(occasions);
  return occasions[idx];
}

export function deleteOccasion(id: string): boolean {
  const occasions = readOccasions();
  const filtered = occasions.filter((o) => o.id !== id);
  if (filtered.length === occasions.length) return false;
  writeOccasions(filtered);
  return true;
}
