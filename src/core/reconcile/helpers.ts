import type { Fiber } from "../fiber/types";
import type { VNode } from "../vdom/types";
import type { CommitOp } from "./types";
import { findHostParentFiber } from "../fiber/helpers";

export function isSameType(oldFiber: Fiber, newVNode: VNode): boolean {
  if (oldFiber.kind !== newVNode.kind) return false;

  if (oldFiber.kind === "host" && newVNode.kind === "host") {
    return oldFiber.vnode.tag === newVNode.tag;
  }

  if (oldFiber.kind === "text" && newVNode.kind === "text") {
    return true;
  }

  if (oldFiber.kind === "fc" && newVNode.kind === "fc") {
    return oldFiber.vnode.component === newVNode.component;
  }

  return false;
}

export function collectRemovals(fiber: Fiber, ops: CommitOp[]): void {
  if (fiber.kind === "host" || fiber.kind === "text") {
    if (fiber.stateNode) {
      ops.push({
        type: "remove",
        node: fiber.stateNode,
      });
    }
  }

  if (fiber.child) {
    collectRemovals(fiber.child, ops);
  }

  if (fiber.sibling) {
    collectRemovals(fiber.sibling, ops);
  }
}

export function collectPlacements(fiber: Fiber, ops: CommitOp[]): void {
  if (fiber.kind === "host" || fiber.kind === "text") {
    ops.push({
      type: "placement",
      fiber,
      parentFiber: findHostParentFiber(fiber.parent),
    });
  }

  if (fiber.child) {
    collectPlacements(fiber.child, ops);
  }

  if (fiber.sibling) {
    collectPlacements(fiber.sibling, ops);
  }
}
