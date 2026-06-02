import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = "src/utils/assets/images";

export function loadImage(path: string): string {
  const file = readFileSync(join(process.cwd(), root, path));
  return `data:image/png;base64,${file.toString("base64")}`;
}