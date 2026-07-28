export const TIMEOUT = 3 * 60 * 1000; // 3 minutes

export interface BaseOptions {
  [key: string]: unknown;
} 

export interface ComponentState<O extends BaseOptions = BaseOptions> {
  event: string;
  options: O;
  userId: string;
  expiresAt: number;
};

export const componentState = new Map<string, ComponentState>();

export function CreateComponentState<O extends BaseOptions>(parameters: {
  event: string;
  options: O;
  userId: string;
}): ComponentState<O> {
  return {
    ...parameters,
    expiresAt: Date.now() + TIMEOUT,
  };
}
