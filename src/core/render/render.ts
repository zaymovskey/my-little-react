import { applyCommit } from "../commit/applyCommit";
import type { Fiber } from "../fiber/types";
import { reconcileFiber } from "../reconcile/reconcileFiber";
import type { CommitOp } from "../reconcile/types";
import type { VNode } from "../vdom/types";

let currentRoot: Fiber | null = null;
let currentContainer: Node | null = null;

export function render(vnode: VNode, container: Node): void {
  const ops: CommitOp[] = [];
  const newRoot = reconcileFiber(currentRoot, vnode, null, ops);

  applyCommit(ops, container);

  currentRoot = newRoot;
  currentContainer = container;
}

export function getCurrentContainer(): Node | null {
  return currentContainer;
}

export function getCurrentRoot(): Fiber | null {
  return currentRoot;
}
