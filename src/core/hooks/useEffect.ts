import {
  currentFiber,
  currentHookIndex,
  incrementHookIndex,
} from "./currentFiber";
import type { EffectHook, PendingEffect } from "./types";

const effectsQueue: PendingEffect[] = [];

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

  const prevHook = fiber.hooks[hookIndex] as EffectHook;

  if (!prevHook) {
    // Первый рендер: просто добавляем эффект в очередь
    effectsQueue.push({
      hook: { type: "effect", effect, deps },
    });
    incrementHookIndex();
    return;
  }

  // Рендер после первого: сравниваем deps
  const hasChanged =
    !deps || !prevHook.deps || deps.some((dep, i) => dep !== prevHook.deps![i]);

  if (hasChanged) {
    effectsQueue.push({
      hook: { type: "effect", effect, deps },
      prevHook,
    });
  }

  incrementHookIndex();
}

export function runEffects(): void {
  while (effectsQueue.length > 0) {
    const effect = effectsQueue.shift();
    if (effect) {
      effect.prevHook?.cleanup?.();

      const cleanUp = effect.hook.effect();
      if (typeof cleanUp === "function") {
        effect.hook.cleanup = cleanUp;
      }
    }
  }
}
