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

  const prevHook = fiber.alternate?.hooks[hookIndex] as EffectHook | undefined;

  const newHook: EffectHook = {
    type: "effect",
    effect,
    deps,
    cleanup: prevHook?.cleanup,
  };

  fiber.hooks[hookIndex] = newHook;

  const hasChanged = shouldRunEffect(prevHook, deps);

  if (hasChanged) {
    effectsQueue.push({
      hook: newHook,
      prevHook,
    });
  }

  incrementHookIndex();
}

export function runEffects(): void {
  while (effectsQueue.length > 0) {
    const pendingEffect = effectsQueue.shift();

    if (!pendingEffect) continue;

    pendingEffect.prevHook?.cleanup?.();

    const cleanup = pendingEffect.hook.effect();

    if (typeof cleanup === "function") {
      pendingEffect.hook.cleanup = cleanup;
    } else {
      pendingEffect.hook.cleanup = undefined;
    }
  }
}

function shouldRunEffect(
  prevHook: EffectHook | undefined,
  deps?: EffectHook["deps"],
): boolean {
  if (!prevHook) {
    // Нет предыдущего эффекта, значит это первый рендер, эффект должен выполниться
    return true;
  }

  if (deps === undefined) {
    // Если deps не переданы, эффект должен выполняться после каждого рендера
    return true;
  }

  const prevDeps = prevHook.deps;

  if (prevDeps === undefined) {
    // Если в предыдущем эффекте не было deps, а сейчас они есть, считаем, что deps изменились и эффект должен выполниться
    return true;
  }

  if (deps.length !== prevDeps.length) {
    // Если длина массивов deps изменилась, считаем, что deps изменились и эффект должен выполниться
    return true;
  }

  for (let i = 0; i < deps.length; i++) {
    // Если хотя бы один элемент в deps отличается от соответствующего элемента в prevDeps, эффект должен выполниться
    if (!Object.is(deps[i], prevDeps[i])) {
      return true;
    }
  }

  return false;
}
