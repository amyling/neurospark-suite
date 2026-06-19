import type { SavedReflection } from "@/types/youthmentor";

const STORAGE_KEY = "youthmentor-reflections";

function readAll(): SavedReflection[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SavedReflection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedReflection[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Persists a reflection session locally (minimal personal data).
 */
export function saveReflection(entry: SavedReflection): SavedReflection {
  const items = readAll();
  const existing = items.findIndex((r) => r.id === entry.id);
  if (existing >= 0) {
    items[existing] = entry;
  } else {
    items.unshift(entry);
  }
  writeAll(items.slice(0, 50));
  return entry;
}

/**
 * Returns saved reflections newest first.
 */
export function getReflectionHistory(): SavedReflection[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Removes a reflection by id.
 */
export function deleteReflection(id: string): boolean {
  const items = readAll();
  const next = items.filter((r) => r.id !== id);
  if (next.length === items.length) {
    return false;
  }
  writeAll(next);
  return true;
}
