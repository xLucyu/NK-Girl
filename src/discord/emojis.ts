import { CONFIG } from "@app/config";
import { getData } from "@lib";
import { API_URLS } from "@btd6";

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
      API_URLS.Emojis.replace("{}", CONFIG.BOT_ID),
        {
          Authorization: `Bot ${CONFIG.BOT_TOKEN}`,
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

export function getEmoji(name: string): FormattedEmojiData | undefined {

  const emoji = EmojiCache.get(name);

  if (!emoji) {
    console.warn(`Emoji ${name} wasn't found.`);
    return undefined;
  }
  return {
    id: emoji.id,
    name: emoji.name
  }
}