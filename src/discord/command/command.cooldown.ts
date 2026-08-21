import { CommandOnCooldown } from "@lib/errors";

const cooldowns = new Map<string, number>();

export function checkCooldown(userId: string, command: string, ms: number): void {

  const key = `${userId}:${command}`;
  const now = Date.now();
  const expiresAt = cooldowns.get(key);

  if (expiresAt && now < expiresAt) {

    const remaining = Math.ceil((expiresAt - now) / 1000);
    throw new CommandOnCooldown(remaining);
  }

  const newExpiresAt = now + ms;

  cooldowns.set(key, newExpiresAt);

  setTimeout(() => {
    if (cooldowns.get(key) === newExpiresAt) cooldowns.delete(key);
  }, ms);
}