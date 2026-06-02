import { CommandOnCooldown } from "@utils/error-handler/error.codes";

const cooldowns = new Map<string, number>();

export function checkCooldown(userId: string, command: string, ms: number) {

    const key = `${userId}:${command}`;
    const now = Date.now();
    const expiresAt = cooldowns.get(key);

    if (expiresAt && now < expiresAt) {
        const remaining = Math.ceil((expiresAt - now) / 1000);
        throw new CommandOnCooldown(remaining);
    }
    cooldowns.set(key, now + ms);
    setTimeout(() => {
        cooldowns.delete(key)
    }, ms)
}