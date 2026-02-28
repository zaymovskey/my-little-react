import type {
  ElementProps,
  HTMLElementVNode,
  TagName,
  TextVNode,
  VNode,
} from "./types";

export function createTextVNode(nodeValue: string): TextVNode {
  return { kind: "TEXT", props: { nodeValue } };
}

export function createHtmlVNode<K extends TagName>(
  tagName: K,
  props: ElementProps = {},
  children: VNode[],
): HTMLElementVNode<K> {
  return { kind: "HTML", tagName, props, children };
}
