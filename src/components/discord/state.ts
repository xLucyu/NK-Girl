import { Boss } from "@utils";

export const TIMEOUT = 3 * 60 * 1000; // 3 minutes

interface Options {
  difficulty?: string;
  playerCount?: number;
  boss?: Boss;
  hpModifier?: number;
}

export type ComponentState = {
  eventId: string;
  userId: string;
  options: Options;
  expiresAt: number;
};

export const componentState = new Map<string, ComponentState>();

export function CreateComponentState(paramters: {
  eventId: string;
  userId: string;
  options?: Record<string, unknown>;
}): ComponentState {
  return {
    eventId: paramters.eventId,
    userId: paramters.userId,
    options: paramters.options ?? {},
    expiresAt: Date.now() + TIMEOUT,
  };
}
