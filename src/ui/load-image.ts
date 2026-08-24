import { logError } from "@discord/error/error.log";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ASSET_ROOT = resolve(__dirname, "../btd6/assets");
const cache = new Map<string, string>();

export function loadImage(path: string): string {

  if (!path) return "";

  const cached = cache.get(path);
  if (cached) return cached;

  try {
    const file = readFileSync(join(ASSET_ROOT, path));
    const encoded = `data:image/png;base64,${file.toString("base64")}`;
    cache.set(path, encoded);
    return encoded;
  } catch (error) {
    logError("No Image", error);
    return "";
  }
}