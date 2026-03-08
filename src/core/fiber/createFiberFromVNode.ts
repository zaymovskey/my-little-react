import type { Fiber } from "./types";
import type { VNode } from "../vdom/types";

export function createFiberFromVNode(vnode: VNode): Fiber {
  if (vnode.kind === "host") {
    return {
      kind: "host",
      vnode,
      parent: null,
      child: null,
      sibling: null,
      stateNode: null,
    };
  }

  if (vnode.kind === "text") {
    return {
      kind: "text",
      vnode,
      parent: null,
      child: null,
      sibling: null,
      stateNode: null,
    };
  }

  return {
    kind: "fc",
    vnode,
    parent: null,
    child: null,
    sibling: null,
    stateNode: null,
    hooks: [],
  };
}
