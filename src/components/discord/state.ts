const TIMEOUT = 3 * 60 * 1000; // 3 minutes

export type ComponentState = {
  eventId: string;
  difficulty: string;
  userId: string;
  expiresAt: number;
  [key: string]: unknown;
};

export const componentState = new Map<string, ComponentState>();

export function CreateComponentState(paramters: {
  eventId: string;
  difficulty: string;
  userId: string;
}): ComponentState {
  return {
    ...paramters,
    expiresAt: Date.now() + TIMEOUT,
  };
}