import { config } from "@config";
import { getData } from "../../api/api-client";
import { API_URLS } from "../assets";

interface EmojiData {
    id: string;
    name: string;
    user: Object;
    roles: [];
    required_colons: boolean;
    managed: boolean;
    animated: boolean;
    available: boolean;
}

interface EmojiResponse {
    items: EmojiData[];
}

interface FormattedEmojiData {
    id: string;
    name: string;
}

const EmojiCache = new Map<string, FormattedEmojiData>();

export async function loadEmojis(): Promise<void> {

    try {
        const data = await getData<EmojiResponse>(
            API_URLS.Emojis.replace("{}", config.BOT_ID),
            {
                Authorization: `Bot ${config.BOT_TOKEN}`,
                "Content-Type": "application/json"
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

export function getEmoji(name: string): FormattedEmojiData {

    const emoji = EmojiCache.get(name);
    if (!emoji) throw new Error();
    return {
        id: emoji.id,
        name: emoji.name
    }
}