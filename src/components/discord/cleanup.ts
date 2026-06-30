import { InteractionEditReplyOptions } from "discord.js";
import { componentState } from "./state";

export function scheduleComponentCleanup(paramters: {
  messageId: string;
  editReply: (options: InteractionEditReplyOptions) => Promise<unknown>;
  expiresAt: number; 
  onExpire: () => void;
}): void {

  const delay = paramters.expiresAt - Date.now();
  if (delay <= 0) {
    paramters.onExpire();
    return;
  }

  setTimeout(async () => {
    try {
      await paramters.editReply({ components: [] });
    } catch {}
    
    paramters.onExpire();
  }, delay);
}