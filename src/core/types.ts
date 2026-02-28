export type TagName = keyof HTMLElementTagNameMap;

export type HTMLElementProps = Record<string, unknown>;

export type Kind = "TEXT" | "HTML";

export type TextProps = {
  nodeValue: string;
};

export type ElementProps = Record<string, unknown>;

export type TextVNode = {
  kind: "TEXT";
  props: TextProps;
  dom: Text | null;
};

export type HTMLElementVNode<tagName extends TagName = TagName> = {
  kind: "HTML";
  tagName: tagName;
  props: ElementProps;
  children: VNode[];
  dom: HTMLElement | null;
};

export type VNode = TextVNode | HTMLElementVNode;

export function isTextVNode(vnode?: VNode): vnode is TextVNode {
  return vnode?.kind === "TEXT";
}

export function isHTMLElementVNode(vnode?: VNode): vnode is HTMLElementVNode {
  return vnode?.kind === "HTML";
}
