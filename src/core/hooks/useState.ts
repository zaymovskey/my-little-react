import { scheduleRender } from "../render/render";
import type { StateHook, StateUpdate } from "./types";
import {
  currentFiber,
  currentHookIndex,
  incrementHookIndex,
} from "./currentFiber";

export function useState<T>(
  initialValue: T,
): [T, (value: StateUpdate<T>) => void] {
  if (currentFiber === null) {
    throw new Error(
      "🛑 useState can only be called inside a function component",
    );
  }

  const fiber = currentFiber;
  const hookIndex = currentHookIndex;

  const prevHook = fiber.alternate?.hooks[hookIndex] as
    | StateHook<T>
    | undefined;

  const queue = prevHook ? prevHook.queue : [];
  let state = prevHook ? prevHook.state : initialValue;

  for (const update of queue) {
    if (typeof update === "function") {
      state = (update as (prev: T) => T)(state);
    } else {
      state = update;
    }
  }

  queue.length = 0;

  const newHook: StateHook<T> = {
    type: "state",
    state,
    queue,
  };

  fiber.hooks[hookIndex] = newHook;

  incrementHookIndex();

  return [
    newHook.state,
    (value: StateUpdate<T>) => {
      queue.push(value);
      scheduleRender();
    },
  ];
}
