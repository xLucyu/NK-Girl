import { getData } from "../../api/wrapper";
import { config } from "../../config";
import { URLS } from "../assets";

interface EmojiItem {
    id: string;
    name: string;
}

interface EmojiResponse {
    items?: EmojiItem[];
}

let emojiCache: Record<string, string> = {};

export async function getEmojis(): Promise<Record<string, string>> {

    if (Object.keys(emojiCache).length > 0) return emojiCache;

    const headers: HeadersInit = {
        Authorization: `Bot ${config.BOT_TOKEN}`,
        "Content-Type": "application/json", 
    };

    const data = await getData<EmojiResponse>(
        URLS.Emojis.base.replace("{}", config.BOT_ID),
        headers,
    );

    const items = data.items ?? [];

    emojiCache = Object.fromEntries(items.map((emoji) => [
        emoji.id,
        emoji.name
    ]));

    return emojiCache;
}
