import { applyCommit } from "../commit/applyCommit";
import type { Fiber } from "../fiber/types";
import { runEffects } from "../hooks/useEffect";
import { reconcileFiber } from "../reconcile/reconcileFiber";
import type { CommitOp } from "../reconcile/types";
import type { VNode } from "../vdom/types";

let currentRoot: Fiber | null = null;
let currentContainer: Node | null = null;

let lastVnode: VNode | null = null;

export function render(vnode: VNode, container: Node): void {
  lastVnode = vnode;

  const ops: CommitOp[] = [];
  const newRoot = reconcileFiber(currentRoot, vnode, null, ops);

  applyCommit(ops, container);

  runEffects();

  currentRoot = newRoot;
  currentContainer = container;
}

export function rerender(): void {
  if (lastVnode && currentContainer) {
    render(lastVnode, currentContainer);
    return;
  }

  throw new Error("🛑 No previous render found to rerender");
}
