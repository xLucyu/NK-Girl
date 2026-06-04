import { config } from "@config";
import { getData } from "@wrapper";
import { API_URLS } from "../assets";

interface Emoji {
    id: string;
    name: string;
}

const EmojiCache = new Map<string, Emoji>();

export async function loadEmojis(): Promise<void> {

    try {
        const data = await getData<any>(
            API_URLS.Emoji.replace("{}", config.BOT_ID),
            {
                headers: {
                    Authorization: `Bot ${config.BOT_TOKEN}`
                }
            }
        )

        for (const emoji of data?.items) {
            EmojiCache.set(emoji.name, emoji)
        }
        console.log("Emojis loaded");
    } catch (error) {
        console.warn("Failed to load Emojis", error);
    }
}

export function getEmoji(name: string): Emoji {

    const emoji = EmojiCache.get(name);
    if (!emoji) throw new Error();
    return {
        id: emoji.id,
        name: emoji.name
    }
}
