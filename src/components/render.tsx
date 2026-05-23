import { JSX } from "react";
import { ImageResponse } from "@vercel/og";

export async function render(element: JSX.Element) {
    
    const image = new ImageResponse(element, {
        width: 1280,
        height: 720
    });

    const arrayBuffer = await image.arrayBuffer();
    return Buffer.from(arrayBuffer);
}