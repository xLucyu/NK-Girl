import { MenuState } from "@commands/base.command";

const TIMEOUT = 5 * 60_000;

export function CreateComponentState(args: {
  eventId: string;
  difficulty: string;
  userId: string;
}): MenuState {
  return {
    eventId: args.eventId,
    difficulty: args.difficulty,
    userId: args.userId,
    expiresAt: Date.now() + TIMEOUT,
  };
}