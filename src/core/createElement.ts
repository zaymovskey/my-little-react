import type {
  ElementProps,
  FunctinalComponentVNode,
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

export function createFunctionalComponentVNode(
  component: FunctinalComponentVNode["component"],
  props: FunctinalComponentVNode["props"] = {},
): FunctinalComponentVNode {
  return {
    kind: "FUNCTIONAL_COMPONENT",
    component,
    props,

    dom: null,
    child: null,

    hookIndex: 0,
    stateStorage: [],
  };
}
