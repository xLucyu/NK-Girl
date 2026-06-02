const TIMEOUT = 3 * 60 * 1000; // 3 minutes

export type ComponentState = {
  eventId: string;
  difficulty: string;
  userId: string;
  expiresAt: number;
};

export const componentState: Record<string, ComponentState> = {};

export function CreateComponentState(args: {
  eventId: string;
  difficulty: string;
  userId: string;
}): ComponentState {
  return {
    ...args,
    expiresAt: Date.now() + TIMEOUT,
  };
}