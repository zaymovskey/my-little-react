export type StateUpdate<T> = T | ((prev: T) => T);

export interface StateHook<T> {
  type: "state";
  state: T;
  queue: StateUpdate<T>[];
}

export interface EffectHook {
  type: "effect";
  effect: () => void | (() => void);
  deps?: unknown[];
  hasRun?: boolean;
  cleanup?: () => void;
}

export type PendingEffect = {
  hook: EffectHook;
  prevHook?: EffectHook;
};
