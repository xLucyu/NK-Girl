import { InteractionEditReplyOptions } from "discord.js";

const cleanupTimers = new Map<string, NodeJS.Timeout>();

export function scheduleComponentCleanup(parameters: {
  messageId: string;
  editReply: (options: InteractionEditReplyOptions) => Promise<unknown>;
  expiresAt: number;
  onExpire: () => void;
}): void {

  const existing = cleanupTimers.get(parameters.messageId);
  if (existing) clearTimeout(existing);

  const delay = parameters.expiresAt - Date.now();

  if (delay <= 0) {
    cleanupTimers.delete(parameters.messageId);
    parameters.onExpire();
    return;
  }

  const timer = setTimeout(async () => {
    cleanupTimers.delete(parameters.messageId);
    try {
      await parameters.editReply({ components: [] });
    } catch {
      return;
    } finally {
      parameters.onExpire();
    }
  }, delay);

  cleanupTimers.set(parameters.messageId, timer);
}