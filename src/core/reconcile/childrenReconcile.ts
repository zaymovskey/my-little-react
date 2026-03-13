import { attachChildren, collectChildren } from "../fiber/helpers";
import type { Fiber } from "../fiber/types";
import type { VNode } from "../vdom/types";
import type { CommitOp, KeyedOldChild } from "./types";
import { collectRemovals } from "./helpers";
import { reconcileFiber } from "./reconcileFiber";

export function reconcileChildren(
  oldParentFiber: Fiber | null,
  newParentFiber: Fiber,
  newChildrenVNodes: VNode[],
  ops: CommitOp[],
): void {
  const oldChildren = oldParentFiber ? collectChildren(oldParentFiber) : [];

  const oldSomeKeyed = oldChildren.some((c) => c.vnode.key != null);
  const oldAllKeyed = oldChildren.every((c) => c.vnode.key != null);

  const newSomeKeyed = newChildrenVNodes.some((c) => c.key != null);
  const newAllKeyed = newChildrenVNodes.every((c) => c.key != null);

  const someKeyed = oldSomeKeyed || newSomeKeyed;
  const allKeyed = oldAllKeyed && newAllKeyed;

  if (someKeyed && !allKeyed) {
    throw new Error("🛑 Mixed keyed and unkeyed children are not supported");
  }

  const result: Fiber[] = [];

  if (!someKeyed) {
    // reconcile по индексу
    const maxLen = Math.max(oldChildren.length, newChildrenVNodes.length);

    for (let i = 0; i < maxLen; i++) {
      const oldChild = oldChildren[i] ?? null;
      const newChildVNode = newChildrenVNodes[i] ?? null;

      if (oldChild && newChildVNode) {
        result.push(
          reconcileFiber(oldChild, newChildVNode, newParentFiber, ops),
        );
      } else if (!oldChild && newChildVNode) {
        result.push(reconcileFiber(null, newChildVNode, newParentFiber, ops));
      } else if (oldChild && !newChildVNode) {
        collectRemovals(oldChild, ops);
      }
    }

    attachChildren(newParentFiber, result);
    return;
  }

  // reconcile по ключу
  const oldKeyToChild = new Map<string | number, KeyedOldChild>();

  oldChildren.forEach((child, index) => {
    const key = child.vnode.key;
    if (key == null) {
      throw new Error("🛑 Expected keyed old child");
    }

    oldKeyToChild.set(key, { fiber: child, oldIndex: index });
  });

  for (const newChildVNode of newChildrenVNodes) {
    const key = newChildVNode.key;
    if (key == null) {
      throw new Error("🛑 Expected keyed new child");
    }

    const matchedOld = oldKeyToChild.get(key);

    if (!matchedOld) {
      result.push(reconcileFiber(null, newChildVNode, newParentFiber, ops));
      continue;
    }

    result.push(
      reconcileFiber(matchedOld.fiber, newChildVNode, newParentFiber, ops),
    );
    oldKeyToChild.delete(key);
  }

  for (const { fiber } of oldKeyToChild.values()) {
    collectRemovals(fiber, ops);
  }

  attachChildren(newParentFiber, result);
}
