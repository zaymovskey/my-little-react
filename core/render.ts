import { isTextVNode, isHTMLElementVNode, type VNode } from "./types";

function convertVNodetoDOM(vnode: VNode): Node {
  if (isTextVNode(vnode)) {
    return document.createTextNode(vnode.props.nodeValue);
  }

  if (isHTMLElementVNode(vnode)) {
    const dom = document.createElement(vnode.tagName);

    vnode.children.forEach((child) => {
      const childDom = convertVNodetoDOM(child);
      dom.appendChild(childDom);
    });

    return dom;
  }

  throw new Error("⛔ Unknown VNode type");
}

export function render(VDOM: VNode, container: HTMLElement) {
  container.innerHTML = "";
  const dom = convertVNodetoDOM(VDOM);
  container.appendChild(dom);
}
