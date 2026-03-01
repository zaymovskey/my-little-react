import type { FunctinalComponentVNode } from "../types";

export let currentOwner: FunctinalComponentVNode | null = null;

export function setCurrentOwner(owner: FunctinalComponentVNode | null) {
  currentOwner = owner;
}

export function resetOwnerHookIndex(owner: FunctinalComponentVNode) {
  owner.hookIndex = 0;
}
