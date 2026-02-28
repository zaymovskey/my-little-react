export type TagName = keyof HTMLElementTagNameMap;

export type HTMLElementProps = Record<string, unknown>;

export type Kind = "TEXT" | "HTML" | "FUNCTIONAL_COMPONENT";

export type TextProps = {
  nodeValue: string;
};

export type ElementProps = Record<string, unknown>;

export interface TextVNode {
  kind: "TEXT";
  props: TextProps;
  dom: Text | null;
}

export interface HTMLElementVNode<tagName extends TagName = TagName> {
  kind: "HTML";
  tagName: tagName;
  props: ElementProps;
  children: VNode[];
  dom: HTMLElement | null;
}

export type FunctinalComponentVNode = {
  kind: "FUNCTIONAL_COMPONENT";
  props: Record<string, unknown>;
  component: (props: Record<string, unknown>) => VNode;
  dom: Node | null;
  componentResult: VNode | null;
  hookIndex: number;
  stateStorage: unknown[];
};

export type VNode = TextVNode | HTMLElementVNode | FunctinalComponentVNode;

export function isTextVNode(vnode?: VNode): vnode is TextVNode {
  return vnode?.kind === "TEXT";
}

export function isHTMLElementVNode(vnode?: VNode): vnode is HTMLElementVNode {
  return vnode?.kind === "HTML";
}

export function isFunctionalComponentVNode(
  vnode?: VNode,
): vnode is FunctinalComponentVNode {
  return vnode?.kind === "FUNCTIONAL_COMPONENT";
}
