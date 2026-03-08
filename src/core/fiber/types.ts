import type { StateHook } from "../hooks/types";
import type { FCVNode, HostVNode, TextVNode } from "../vdom/types";

type FiberBase = {
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  stateNode: Node | null;
};

export type HostFiber = FiberBase & {
  kind: "host";
  vnode: HostVNode;
  stateNode: HTMLElement | null;
};

export type TextFiber = FiberBase & {
  kind: "text";
  vnode: TextVNode;
  stateNode: Text | null;
};

export type FCFiber = FiberBase & {
  kind: "fc";
  vnode: FCVNode;
  stateNode: null;
  hooks: StateHook<unknown>[];
};

export type Fiber = HostFiber | TextFiber | FCFiber;
export type HostOrTextFiber = HostFiber | TextFiber;
