import type { FCFiber } from "../fiber/types";
import { rerender } from "../render/render";
import type { StateHook } from "./types";

let currentFiber: FCFiber | null = null;
let currentHookIndex = 0;

// TODO: сделать батчинг обновлений, чтобы при нескольких
// вызовах setState в одном обработчике событий не было лишних перерисовок

export function useState<T>(
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  if (currentFiber === null) {
    throw new Error(
      "🛑 useState can only be called inside a function component",
    );
  }

  const fiber = currentFiber;
  const hookIndex = currentHookIndex;

  if (!fiber.hooks[hookIndex]) {
    fiber.hooks[hookIndex] = {
      type: "state",
      state: initialValue,
    };
  }

  const hook = fiber.hooks[hookIndex] as StateHook<T>;

  currentHookIndex++;

  return [
    hook.state,
    (newValue: T | ((prev: T) => T)) => {
      if (typeof newValue === "function") {
        const updater = newValue as (prev: T) => T;
        hook.state = updater(hook.state as T);
      } else {
        hook.state = newValue;
      }

      rerender();
    },
  ];
}

export function setCurrentFiber(fiber: FCFiber | null): void {
  currentFiber = fiber;
  currentHookIndex = 0;
}

export function resetCurrentFiber(): void {
  currentFiber = null;
  currentHookIndex = 0;
}
