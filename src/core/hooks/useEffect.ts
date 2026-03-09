import {
  currentFiber,
  currentHookIndex,
  incrementHookIndex,
} from "./currentFiber";
import type { EffectHook } from "./types";

const effectsQueue: EffectHook["effect"][] = [];

export function useEffect(
  effect: EffectHook["effect"],
  deps?: EffectHook["deps"],
): void {
  if (currentFiber === null) {
    throw new Error(
      "🛑 useEffect can only be called inside a function component",
    );
  }

  const fiber = currentFiber;
  const hookIndex = currentHookIndex;

  if (!fiber.hooks[hookIndex]) {
    fiber.hooks[hookIndex] = {
      type: "effect",
      effect,
      deps,
    };
  } else {
    (fiber.hooks[hookIndex] as EffectHook).effect = effect;
    (fiber.hooks[hookIndex] as EffectHook).deps = deps;
  }

  const hook = fiber.hooks[hookIndex] as EffectHook;

  if (deps === undefined) {
    effectsQueue.push(hook.effect);
  } else if (deps.length === 0) {
    if (hook.hasRun !== true) {
      effectsQueue.push(hook.effect);
      hook.hasRun = true;
    }
  }

  incrementHookIndex();
}

export function runEffects(): void {
  while (effectsQueue.length > 0) {
    const effect = effectsQueue.shift();
    if (effect) {
      try {
        effect();
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    }
  }
}
