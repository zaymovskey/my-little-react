import { setCurrentOwner, resetOwnerHookIndex } from "./hooks";
import {
  isTextVNode,
  isHTMLElementVNode,
  isFunctionalComponentVNode,
  type VNode,
  type ElementProps,
  type FunctinalComponentVNode,
  type Operation,
} from "./types";

function isEventProp(propName: string): boolean {
  return propName.startsWith("on");
}

const eventStore = new WeakMap<Element, Map<string, EventListener>>();

const eventNameToEventListenerName = (eventName: string) =>
  eventName.substring(2).toLowerCase();

function runComponent(vnode: FunctinalComponentVNode): VNode {
  // owner = этот компонент
  setCurrentOwner(vnode);
  resetOwnerHookIndex(vnode);

  const componentResult = vnode.component(vnode.props);
  vnode.componentResult = componentResult;

  // можно сбросить owner, чтобы useState вне рендера падал
  setCurrentOwner(null);

  return componentResult;
}

function convertVNodetoDOM(vnode: VNode): Node {
  // TEXT
  if (isTextVNode(vnode)) {
    const dom = document.createTextNode(vnode.props.nodeValue);
    vnode.dom = dom;
    return dom;
  }

  // FC
  if (isFunctionalComponentVNode(vnode)) {
    const childVNode = runComponent(vnode);
    const dom = convertVNodetoDOM(childVNode);
    vnode.dom = dom;
    return dom;
  }

  // HTML
  if (isHTMLElementVNode(vnode)) {
    const dom = document.createElement(vnode.tagName);
    vnode.dom = dom;

    Object.entries(vnode.props).forEach(([propKey, propValue]) => {
      // Events
      if (isEventProp(propKey)) {
        const eventCallback = propValue as EventListener;
        const eventName = eventNameToEventListenerName(propKey);

        dom.addEventListener(eventName, eventCallback);

        const map = getEventMap(dom);
        map.set(eventName, eventCallback);

        return;
      }

      // Default
      dom.setAttribute(propKey, String(propValue));
    });

    vnode.children.forEach((child) => {
      const childDom = convertVNodetoDOM(child);
      dom.appendChild(childDom);
    });

    return dom;
  }

  throw new Error("⛔ Unknown VNode type");
}

function setCommitOperations(
  parentDom: Node,
  prevVNode: VNode | undefined,
  nextVNode: VNode | undefined,
  commitOperations: Operation[],
) {
  // 0) both missing
  if (!prevVNode && !nextVNode) return;

  // 1) mount
  if (!prevVNode && nextVNode) {
    commitOperations.push({
      type: "CREATE",
      parentDom: parentDom,
      vnode: nextVNode,
    });
    return;
  }

  // 2) unmount
  if (prevVNode && !nextVNode) {
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");
    commitOperations.push({
      type: "REMOVE",
      parentDom: parentDom,
      dom: prevVNode.dom,
    });
    return;
  }

  if (!prevVNode || !nextVNode) return;

  // =========================
  // 3) FC
  // =========================
  const prevIsFC = isFunctionalComponentVNode(prevVNode);
  const nextIsFC = isFunctionalComponentVNode(nextVNode);

  // один FC другой нет -> replace
  if (prevIsFC !== nextIsFC) {
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");

    commitOperations.push({
      type: "REPLACE",
      parentDom: parentDom,
      oldDom: prevVNode.dom,
      vnode: nextVNode,
    });
    return;
  }

  // оба FC
  if (prevIsFC && nextIsFC) {
    // другой компонент -> replace

    if (prevVNode.component !== nextVNode.component) {
      if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");

      commitOperations.push({
        type: "REPLACE",
        parentDom: parentDom,
        oldDom: prevVNode.dom,
        vnode: nextVNode,
      });
      return;
    }

    // dom остаётся тем же
    nextVNode.dom = prevVNode.dom;

    // prev componentResult БЕРЁМ, НЕ выполняем prev component заново
    const prevComponentResult = prevVNode.componentResult;

    // next ComponentResult выполняем
    const nextComponentResult = runComponent(nextVNode);

    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");
    setCommitOperations(
      prevVNode.dom,
      prevComponentResult ?? undefined,
      nextComponentResult,
      commitOperations,
    );
    return;
  }

  // =========================
  // 4) TEXT
  // =========================
  if (isTextVNode(prevVNode) && isTextVNode(nextVNode)) {
    nextVNode.dom = prevVNode.dom;
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");

    if (prevVNode.props.nodeValue !== nextVNode.props.nodeValue) {
      commitOperations.push({
        type: "SET_TEXT",
        dom: prevVNode.dom as Text,
        value: nextVNode.props.nodeValue,
      });
    }
    return;
  }

  // =========================
  // 5) HTML
  // =========================
  if (isHTMLElementVNode(prevVNode) && isHTMLElementVNode(nextVNode)) {
    // разные теги -> replace
    if (prevVNode.tagName !== nextVNode.tagName) {
      commitOperations.push({
        type: "REPLACE",
        parentDom: parentDom,
        oldDom: prevVNode.dom!,
        vnode: nextVNode,
      });
      return;
    }

    nextVNode.dom = prevVNode.dom;
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");

    setPropsCommitOperations(
      prevVNode.dom,
      prevVNode.props,
      nextVNode.props,
      commitOperations,
    );

    const maxChildrenLength = Math.max(
      prevVNode.children.length,
      nextVNode.children.length,
    );

    for (let i = 0; i < maxChildrenLength; i++) {
      setCommitOperations(
        prevVNode.dom,
        prevVNode.children[i],
        nextVNode.children[i],
        commitOperations,
      );
    }

    return;
  }

  // =========================
  // 6) fallback
  // =========================
  if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");
  commitOperations.push({
    type: "REPLACE",
    parentDom: parentDom,
    oldDom: prevVNode.dom,
    vnode: nextVNode,
  });
}

function getEventMap(dom: Element) {
  let map = eventStore.get(dom);
  if (!map) {
    map = new Map();
    eventStore.set(dom, map);
  }
  return map;
}

function setPropsCommitOperations(
  dom: Element,
  prevProps: ElementProps,
  nextProps: ElementProps,
  commitOperations: Operation[],
) {
  Object.keys(prevProps).forEach((key) => {
    if (!(key in nextProps)) {
      commitOperations.push({
        type: "REMOVE_PROP",
        dom,
        key,
      });
    }
  });

  Object.entries(nextProps).forEach(([key, value]) => {
    if (prevProps[key] !== value) {
      commitOperations.push({
        type: "SET_PROP",
        dom,
        key,
        value,
      });
    }
  });
}

function applyCommitOperations(operations: Operation[]) {
  for (const operation of operations) {
    switch (operation.type) {
      case "CREATE": {
        const dom = convertVNodetoDOM(operation.vnode);
        operation.parentDom.appendChild(dom);
        break;
      }
      case "REMOVE": {
        operation.parentDom.removeChild(operation.dom);
        break;
      }
      case "REPLACE": {
        const newDom = convertVNodetoDOM(operation.vnode);
        operation.parentDom.replaceChild(newDom, operation.oldDom);
        break;
      }
      case "SET_TEXT": {
        operation.dom.nodeValue = operation.value;
        break;
      }
      case "SET_PROP": {
        if (isEventProp(operation.key)) {
          const eventName = eventNameToEventListenerName(operation.key);
          const eventMap = getEventMap(operation.dom);
          const prevListener = eventMap.get(eventName);

          if (prevListener) {
            operation.dom.removeEventListener(eventName, prevListener);
          }

          operation.dom.addEventListener(eventName, operation.value);
          eventMap.set(eventName, operation.value);
        } else {
          operation.dom.setAttribute(operation.key, String(operation.value));
        }

        break;
      }
      case "REMOVE_PROP": {
        if (isEventProp(operation.key)) {
          const eventName = eventNameToEventListenerName(operation.key);
          const map = getEventMap(operation.dom);

          const listener = map.get(eventName);
          if (listener) {
            operation.dom.removeEventListener(eventName, listener);
            map.delete(eventName);
          }
        } else {
          operation.dom.removeAttribute(operation.key);
        }

        break;
      }
    }
  }
}

// ===== public API =====

let prevVDom: VNode | null = null;
let prevRootFC: FunctinalComponentVNode | null = null;
let prevContainer: HTMLElement | null = null;

export function render(
  rootFC: FunctinalComponentVNode,
  container: HTMLElement,
) {
  prevRootFC = rootFC;
  prevContainer = container;

  const newVDOM = runComponent(rootFC);

  if (prevVDom === null) {
    // initial mount
    const dom = convertVNodetoDOM(newVDOM);
    container.appendChild(dom);
  } else {
    // update
    const commitOperations: Operation[] = [];
    setCommitOperations(container, prevVDom, newVDOM, commitOperations);
    applyCommitOperations(commitOperations);
  }

  prevVDom = newVDOM;
}

export function rerender() {
  if (!prevRootFC || !prevContainer) {
    throw new Error("⛔ No component is rendered");
  }
  render(prevRootFC, prevContainer);
}
