import type {
  ElementProps,
  HTMLElementVNode,
  TagName,
  TextVNode,
  VNode,
} from "./types";

export function createTextVNode(nodeValue: string): TextVNode {
  return { kind: "TEXT", props: { nodeValue }, dom: null };
}

export function createHtmlVNode<tagName extends TagName>(
  tagName: tagName,
  props: ElementProps = {},
  children: VNode[],
): HTMLElementVNode<tagName> {
  return { kind: "HTML", tagName, props, children, dom: null };
}
