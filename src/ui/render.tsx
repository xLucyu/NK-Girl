import { ImageResponse } from "@vercel/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const loadFont = readFileSync(join(process.cwd(), "src/ui/fonts/LuckiestGuy-Regular.ttf"));

export async function render(element: JSX.Element) {
    
  const image = new ImageResponse(element, {
    width: 1280,
    height: 720,
    fonts: [
      {
        name: "LuckyGuy",
        data: loadFont,
        style: "normal",
        weight: 400
      }
    ]
  });

  const arrayBuffer = await image.arrayBuffer();
  return Buffer.from(arrayBuffer);
}