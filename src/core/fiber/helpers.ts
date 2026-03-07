import type { Fiber } from "./types";

export function attachChildren(parent: Fiber, children: Fiber[]): void {
  parent.child = children[0] ?? null;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    child.parent = parent;
    child.sibling = children[i + 1] ?? null;
  }
}

export function collectChildren(fiber: Fiber): Fiber[] {
  const out: Fiber[] = [];
  let child = fiber.child;

  while (child) {
    out.push(child);
    child = child.sibling;
  }

  return out;
}

export function findHostParentFiber(fiber: Fiber | null) {
  let current = fiber;

  while (current) {
    if (current.kind === "host") {
      return current;
    }
    current = current.parent;
  }

  return null;
}
