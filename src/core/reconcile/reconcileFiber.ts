import { createFiberFromVNode } from "../fiber/createFiberFromVNode";
import type { Fiber } from "../fiber/types";
import type { VNode } from "../vdom/types";
import type { CommitOp } from "./types";
import { collectRemovals } from "./helpers";
import { reconcileChildren } from "./childrenReconcile";
import { resetCurrentFiber, setCurrentFiber } from "../hooks/currentFiber";

export function reconcileFiber(
  oldFiber: Fiber | null,
  newVNode: VNode,
  parentFiber: Fiber | null,
  ops: CommitOp[],
): Fiber {
  const newFiber = createFiberFromVNode(newVNode);
  newFiber.parent = parentFiber;

  // 1. Mount
  if (oldFiber === null) {
    mountFiber(newFiber, ops);
    return newFiber;
  }

  // 2. kind mismatch -> replace subtree
  if (oldFiber.kind !== newFiber.kind) {
    collectRemovals(oldFiber, ops);
    mountFiber(newFiber, ops);
    return newFiber;
  }

  // 3. text-text
  if (oldFiber.kind === "text" && newFiber.kind === "text") {
    newFiber.stateNode = oldFiber.stateNode;

    if (!newFiber.stateNode || !(newFiber.stateNode instanceof Text)) {
      throw new Error("🛑 text-text: old text fiber has no Text stateNode");
    }

    if (oldFiber.vnode.value !== newFiber.vnode.value) {
      ops.push({
        type: "updateText",
        node: newFiber.stateNode,
        text: newFiber.vnode.value,
      });
    }

    return newFiber;
  }

  // 4. host-host
  if (oldFiber.kind === "host" && newFiber.kind === "host") {
    if (oldFiber.vnode.tag !== newFiber.vnode.tag) {
      collectRemovals(oldFiber, ops);
      mountFiber(newFiber, ops);
      return newFiber;
    }

    newFiber.stateNode = oldFiber.stateNode;

    if (!newFiber.stateNode || !(newFiber.stateNode instanceof HTMLElement)) {
      throw new Error(
        "🛑 host-host: old host fiber has no HTMLElement stateNode",
      );
    }

    ops.push({
      type: "updateProps",
      node: newFiber.stateNode,
      prev: oldFiber.vnode.props,
      next: newFiber.vnode.props,
    });

    reconcileChildren(oldFiber, newFiber, newFiber.vnode.children, ops);
    return newFiber;
  }

  // 5. fc-fc
  if (oldFiber.kind === "fc" && newFiber.kind === "fc") {
    if (oldFiber.vnode.component !== newFiber.vnode.component) {
      collectRemovals(oldFiber, ops);
      mountFiber(newFiber, ops);
      return newFiber;
    }

    newFiber.hooks = oldFiber.hooks;
    setCurrentFiber(newFiber);

    const rendered = newFiber.vnode.component(newFiber.vnode.props);
    reconcileChildren(oldFiber, newFiber, [rendered], ops);

    resetCurrentFiber();

    return newFiber;
  }

  throw new Error("🛑 Unreachable reconcile branch");
}

function mountFiber(fiber: Fiber, ops: CommitOp[]): void {
  if (fiber.kind === "host" || fiber.kind === "text") {
    ops.push({
      type: "placement",
      fiber,
      parentFiber: findHostParentFiberFromParent(fiber.parent),
    });
  }

  if (fiber.kind === "host") {
    reconcileChildren(null, fiber, fiber.vnode.children, ops);
    return;
  }

  if (fiber.kind === "fc") {
    setCurrentFiber(fiber);
    const rendered = fiber.vnode.component(fiber.vnode.props);
    reconcileChildren(null, fiber, [rendered], ops);
    resetCurrentFiber();
    return;
  }
}

function findHostParentFiberFromParent(fiber: Fiber | null) {
  let current = fiber;

  while (current) {
    if (current.kind === "host") {
      return current;
    }
    current = current.parent;
  }

  return null;
}
