export type Key = string | number | null;
export type HostTag = string;

export type Props = Record<string, unknown> & {
  children: VNode[];
};

export type ElementProps = Record<string, unknown> & {
  children?: VNode[];
  key?: string | number;
};

export type FunctionalComponent<P extends Props = Props> = (props: P) => VNode;

export type HostVNode = {
  kind: "host";
  tag: HostTag;
  props: Props;
  children: VNode[];
  key: Key;
};

export type TextVNode = {
  kind: "text";
  value: string;
  key: null;
};

export type FCVNode = {
  kind: "fc";
  component: FunctionalComponent<any>;
  props: Props;
  key: Key;
};

export type VNode = HostVNode | TextVNode | FCVNode;

export type ChildInput = VNode | string | number | boolean | null | undefined;
