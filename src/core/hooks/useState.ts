import { rerender } from "../render";
import type { FunctinalComponentVNode } from "../types";

let currentOwner: FunctinalComponentVNode | null = null;

export function setCurrentStateOwner(owner: FunctinalComponentVNode | null) {
  currentOwner = owner;
}

export function resetOwnerHookIndex(owner: FunctinalComponentVNode) {
  owner.hookIndex = 0;
}

type SetState<T> = (next: T | ((prev: T) => T)) => void;

export function useState<T>(initialValue: T): [T, SetState<T>] {
  if (!currentOwner) {
    throw new Error(
      "⛔ useState can only be used inside a functional component",
    );
  }

  const owner = currentOwner;
  const index = owner.hookIndex;

  if (owner.stateStorage[index] === undefined) {
    owner.stateStorage[index] = initialValue;
  }

  owner.hookIndex++;

  // Пока работает тольео (prev) => prev + 1, потому что нужно обновлять (в render.ts) обработчики событий,
  // которые замыкают старые значения.
  const setState: SetState<T> = (next) => {
    const prev = owner.stateStorage[index] as T;
    const value =
      typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    owner.stateStorage[index] = value;
    rerender();
  };

  return [owner.stateStorage[index] as T, setState];
}
