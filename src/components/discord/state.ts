import type { Boss } from "@utils";

export const TIMEOUT = 3 * 60 * 1000; // 3 minutes

export interface Options {
  difficulty?: string;
  playerCount?: number;
  boss?: Boss;
  hpModifier?: number;
  tileCode?: string;
}

export type ComponentState = {
  event: string;
  userId: string;
  options: Options;
  expiresAt: number;
};

export const componentState = new Map<string, ComponentState>();

export function CreateComponentState(paramters: {
  event: string;
  userId: string;
  options?: Options;
}): ComponentState {
  return {
    event: paramters.event,
    userId: paramters.userId,
    options: paramters.options ?? {},
    expiresAt: Date.now() + TIMEOUT,
  };
}
