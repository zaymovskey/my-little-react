import type {
  ChildInput,
  ElementProps,
  FunctionalComponent,
  HostTag,
  Key,
  Props,
  VNode,
} from "./types";

function normalizeChildren(raw: ChildInput[]): VNode[] {
  const out: VNode[] = [];

  for (const child of raw) {
    if (child == null || child === false || child === true) continue;

    if (typeof child === "string" || typeof child === "number") {
      out.push({
        kind: "text",
        value: String(child),
        key: null,
      });
      continue;
    }

    out.push(child);
  }

  return out;
}

// Host
export function createElement(
  tag: HostTag,
  rawProps: ElementProps | null,
  ...rawChildren: ChildInput[]
): VNode;

// FC
export function createElement<P extends ElementProps>(
  component: FunctionalComponent<P & { children: VNode[] }>,
  rawProps: P | null,
  ...rawChildren: ChildInput[]
): VNode;

export function createElement(
  type: HostTag | FunctionalComponent<any>,
  rawProps: ElementProps | null,
  ...rawChildren: ChildInput[]
): VNode {
  const children = normalizeChildren(rawChildren);

  const key: Key = rawProps?.key ?? null;
  const { key: _ignoredKey, ...restRawProps } = rawProps ?? {};

  const props: Props = {
    ...restRawProps,
    children,
  };

  if (typeof type === "string") {
    return {
      kind: "host",
      tag: type,
      props,
      children,
      key,
    };
  }

  return {
    kind: "fc",
    component: type,
    props,
    key,
  };
}
