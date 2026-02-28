import {
  isTextVNode,
  isHTMLElementVNode,
  isFunctionalComponentVNode,
  type VNode,
  type ElementProps,
} from "./types";

function isEventProp(propName: string): boolean {
  return propName.startsWith("on");
}

function convertVNodetoDOM(vnode: VNode): Node {
  if (isTextVNode(vnode)) {
    const dom = document.createTextNode(vnode.props.nodeValue);
    vnode.dom = dom;
    return dom;
  }

  if (isFunctionalComponentVNode(vnode)) {
    const childVNode = vnode.component(vnode.props);
    const dom = convertVNodetoDOM(childVNode);
    vnode.dom = dom;
    return dom;
  }

  if (isHTMLElementVNode(vnode)) {
    const dom = document.createElement(vnode.tagName);
    vnode.dom = dom;

    Object.entries(vnode.props).forEach(([propKey, propValue]) => {
      // 1) Events
      if (isEventProp(propKey)) {
        dom.addEventListener(
          propKey.substring(2).toLowerCase(),
          propValue as EventListener,
        );
        return;
      }

      // 2) Default
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

function updateDom(
  parentDom: Node,
  prevVNode: VNode | undefined,
  nextVNode: VNode | undefined,
) {
  // Two undefined
  if (prevVNode === undefined && nextVNode === undefined) {
    return;
  }

  // 1) Mounting
  if (prevVNode === undefined && nextVNode !== undefined) {
    const dom = convertVNodetoDOM(nextVNode);
    parentDom.appendChild(dom);

    return;
  }

  // 2) Unmounting
  if (prevVNode !== undefined && nextVNode === undefined) {
    if (prevVNode.dom === null) {
      throw new Error("⛔ DOM node is not mounted");
    }

    parentDom.removeChild(prevVNode.dom);

    return;
  }

  // ----------------
  // 3) Replacement  |
  // ----------------
  //    3.1) Two TEXT VNodes
  if (isTextVNode(prevVNode) && isTextVNode(nextVNode)) {
    nextVNode.dom = prevVNode.dom;

    // 3.1.1) With different text content - replace text content
    if (prevVNode.props.nodeValue !== nextVNode.props.nodeValue) {
      if (prevVNode.dom === null) {
        throw new Error("⛔ DOM node is not mounted");
      }

      prevVNode.dom.nodeValue = nextVNode.props.nodeValue;
    }

    return;
  }

  //    3.2) Two HTML VNodes
  if (isHTMLElementVNode(prevVNode) && isHTMLElementVNode(nextVNode)) {
    //    3.2.1) With different tag names - replace node
    if (prevVNode.tagName !== nextVNode.tagName) {
      const dom = convertVNodetoDOM(nextVNode);
      nextVNode.dom = dom as HTMLElement;

      if (prevVNode.dom === null) {
        throw new Error("⛔ DOM node is not mounted");
      }

      parentDom.replaceChild(dom, prevVNode.dom);
      return;
    }

    //    3.2.2) With the same tag name - update props
    if (prevVNode.tagName === nextVNode.tagName) {
      nextVNode.dom = prevVNode.dom;

      if (prevVNode.dom === null) {
        throw new Error("⛔ DOM node is not mounted");
      }

      updateDomByProps(prevVNode.dom, prevVNode.props, nextVNode.props);
    }

    // Update children
    const maxChildrenLength = Math.max(
      prevVNode.children.length,
      nextVNode.children.length,
    );
    for (let i = 0; i < maxChildrenLength; i++) {
      if (prevVNode.dom === null) {
        throw new Error("⛔ DOM node is not mounted");
      }

      updateDom(prevVNode.dom, prevVNode.children[i], nextVNode.children[i]);
    }

    return;
  }
}

function updateDomByProps(
  dom: Element,
  prevProps: ElementProps,
  nextProps: ElementProps,
) {
  // Remove deleted props
  Object.keys(prevProps).forEach((key) => {
    if (!(key in nextProps)) {
      dom.removeAttribute(key);
    }
  });

  // Update or set new props
  Object.entries(nextProps).forEach(([key, value]) => {
    // Events (Ничего не делаем, оставляем те обработчики, добавленные в convertVNodetoDOM)
    if (isEventProp(key)) {
      return;
    }

    // Default
    dom.setAttribute(key, String(value));
  });
}

let prevVDom: VNode | null = null;

export function render(newVDOM: VNode, container: HTMLElement) {
  if (prevVDom === null) {
    // First render
    const dom = convertVNodetoDOM(newVDOM);
    prevVDom = newVDOM;
    container.appendChild(dom);
  } else {
    // Update
    updateDom(container, prevVDom, newVDOM);
    prevVDom = newVDOM;
  }
}
