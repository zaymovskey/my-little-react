import type { FCFiber } from "../fiber/types";

export let currentFiber: FCFiber | null = null;
export let currentHookIndex = 0;

export function setCurrentFiber(fiber: FCFiber | null): void {
  currentFiber = fiber;
  currentHookIndex = 0;
}

export function resetCurrentFiber(): void {
  currentFiber = null;
  currentHookIndex = 0;
}

export function incrementHookIndex(): void {
  currentHookIndex++;
}
