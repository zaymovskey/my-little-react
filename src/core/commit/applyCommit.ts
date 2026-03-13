import { runUnmountCleanups } from "../reconcile/helpers";
import type { CommitOp } from "../reconcile/types";
import { applyProps } from "./applyProps";

export function applyCommit(ops: CommitOp[], container: Node): void {
  for (const op of ops) {
    switch (op.type) {
      case "placement": {
        const { fiber, parentFiber } = op;

        let domNode: HTMLElement | Text;

        if (fiber.kind === "host") {
          domNode = document.createElement(fiber.vnode.tag);
          applyProps(domNode, {}, fiber.vnode.props);
        } else {
          domNode = document.createTextNode(fiber.vnode.value);
        }

        const parentNode = parentFiber?.stateNode ?? container;

        if (!parentNode) {
          throw new Error("🛑 placement: parent DOM node is missing");
        }

        parentNode.appendChild(domNode);
        fiber.stateNode = domNode;

        break;
      }

      case "remove": {
        op.node.parentNode?.removeChild(op.node);
        break;
      }

      case "updateText": {
        op.node.nodeValue = op.text;
        break;
      }

      case "updateProps": {
        applyProps(op.node, op.prev, op.next);
        break;
      }

      case "cleanup": {
        runUnmountCleanups(op.fiber);
        break;
      }
    }
  }
}
