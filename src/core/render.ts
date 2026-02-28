import { setCurrentStateOwner, resetOwnerHookIndex } from "./hooks/useState";
import {
  isTextVNode,
  isHTMLElementVNode,
  isFunctionalComponentVNode,
  type VNode,
  type ElementProps,
  type FunctinalComponentVNode,
} from "./types";

function isEventProp(propName: string): boolean {
  return propName.startsWith("on");
}

function runComponent(vnode: FunctinalComponentVNode): VNode {
  // owner = этот компонент
  setCurrentStateOwner(vnode);
  resetOwnerHookIndex(vnode);

  const child = vnode.component(vnode.props);
  vnode.componentResult = child;

  // можно сбросить owner, чтобы useState вне рендера падал
  setCurrentStateOwner(null);

  return child;
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
        dom.addEventListener(
          propKey.substring(2).toLowerCase(),
          propValue as EventListener,
        );
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

function replaceVNode(parentDom: Node, prevVNode: VNode, nextVNode: VNode) {
  const dom = convertVNodetoDOM(nextVNode);
  if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");
  parentDom.replaceChild(dom, prevVNode.dom);
}

function updateDom(
  parentDom: Node,
  prevVNode: VNode | undefined,
  nextVNode: VNode | undefined,
) {
  // 0) both missing
  if (!prevVNode && !nextVNode) return;

  // 1) mount
  if (!prevVNode && nextVNode) {
    const dom = convertVNodetoDOM(nextVNode);
    parentDom.appendChild(dom);
    return;
  }

  // 2) unmount
  if (prevVNode && !nextVNode) {
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");
    parentDom.removeChild(prevVNode.dom);
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
    replaceVNode(parentDom, prevVNode, nextVNode);
    return;
  }

  // оба FC
  if (prevIsFC && nextIsFC) {
    // другой компонент -> replace
    if (prevVNode.component !== nextVNode.component) {
      replaceVNode(parentDom, prevVNode, nextVNode);
      return;
    }

    // dom остаётся тем же
    nextVNode.dom = prevVNode.dom;

    // prev child БЕРЁМ, НЕ выполняем prev component заново
    const prevChild = prevVNode.componentResult;

    // next child выполняем
    const nextChild = runComponent(nextVNode);

    updateDom(parentDom, prevChild ?? undefined, nextChild);
    return;
  }

  // =========================
  // 4) TEXT
  // =========================
  if (isTextVNode(prevVNode) && isTextVNode(nextVNode)) {
    nextVNode.dom = prevVNode.dom;
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");

    if (prevVNode.props.nodeValue !== nextVNode.props.nodeValue) {
      prevVNode.dom.nodeValue = nextVNode.props.nodeValue;
    }
    return;
  }

  // =========================
  // 5) HTML
  // =========================
  if (isHTMLElementVNode(prevVNode) && isHTMLElementVNode(nextVNode)) {
    // разные теги -> replace
    if (prevVNode.tagName !== nextVNode.tagName) {
      replaceVNode(parentDom, prevVNode, nextVNode);
      return;
    }

    nextVNode.dom = prevVNode.dom;
    if (prevVNode.dom === null) throw new Error("⛔ DOM node is not mounted");

    updateDomByProps(prevVNode.dom, prevVNode.props, nextVNode.props);

    const maxChildrenLength = Math.max(
      prevVNode.children.length,
      nextVNode.children.length,
    );

    for (let i = 0; i < maxChildrenLength; i++) {
      updateDom(prevVNode.dom, prevVNode.children[i], nextVNode.children[i]);
    }

    return;
  }

  // =========================
  // 6) fallback
  // =========================
  replaceVNode(parentDom, prevVNode, nextVNode);
}

function updateDomByProps(
  dom: Element,
  prevProps: ElementProps,
  nextProps: ElementProps,
) {
  // Remove deleted props
  Object.keys(prevProps).forEach((key) => {
    if (!(key in nextProps)) dom.removeAttribute(key);
  });

  // Update or set new props
  Object.entries(nextProps).forEach(([key, value]) => {
    // Events — пока тупо игнорим в update (как ты хотел)
    if (isEventProp(key)) return;

    dom.setAttribute(key, String(value));
  });
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
    const dom = convertVNodetoDOM(newVDOM);
    container.appendChild(dom);
  } else {
    updateDom(container, prevVDom, newVDOM);
  }

  prevVDom = newVDOM;
}

export function rerender() {
  if (!prevRootFC || !prevContainer) {
    throw new Error("⛔ No component is rendered");
  }
  render(prevRootFC, prevContainer);
}
