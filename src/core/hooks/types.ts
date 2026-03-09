export interface StateHook<T> {
  type: "state";
  state: T;
}

export interface EffectHook {
  type: "effect";
  effect: () => void;
  deps?: unknown[];
  hasRun?: boolean;
}
