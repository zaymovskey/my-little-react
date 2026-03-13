import type {
  FCFiber,
  Fiber,
  HostFiber,
  HostOrTextFiber,
} from "../fiber/types";

export type CommitOp =
  | {
      type: "placement";
      fiber: HostOrTextFiber;
      parentFiber: HostFiber | null;
    }
  | {
      type: "remove";
      node: Node;
    }
  | {
      type: "updateText";
      node: Text;
      text: string;
    }
  | {
      type: "updateProps";
      node: HTMLElement;
      prev: Record<string, unknown>;
      next: Record<string, unknown>;
    }
  | { type: "cleanup"; fiber: FCFiber };

export type KeyedOldChild = {
  fiber: Fiber;
  oldIndex: number;
};
