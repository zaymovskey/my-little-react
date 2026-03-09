import {
  currentFiber,
  currentHookIndex,
  incrementHookIndex,
} from "./currentFiber";
import type { EffectHook } from "./types";

const effectsQueue: EffectHook["effect"][] = [];

export function useEffect(effect: EffectHook["effect"]): void {
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
    };
  } else {
    (fiber.hooks[hookIndex] as EffectHook).effect = effect;
  }

  const hook = fiber.hooks[hookIndex] as EffectHook;

  effectsQueue.push(hook.effect);

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
