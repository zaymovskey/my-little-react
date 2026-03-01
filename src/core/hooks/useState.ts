import { rerender } from "../render";
import { currentOwner } from "./hooksOwner";

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
