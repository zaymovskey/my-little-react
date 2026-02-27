import { TEXT_ELEMENT } from "./createElement.js";
import { setCurrentOwner } from "./hooks.js";

function isFunctionType(type) {
  return typeof type === "function";
}

function isEventProp(name) {
  return name.startsWith("on");
}

function isPropertyProp(name) {
  return name !== "children" && !isEventProp(name);
}

function removeProp(dom, name) {
  const attr = name === "className" ? "class" : name;
  dom.removeAttribute(attr);
}

function setProp(dom, name, value) {
  if (name === "className") {
    dom.setAttribute("class", value);
    return;
  }
  dom.setAttribute(name, String(value));
}

function eventName(name) {
  return name.slice(2).toLowerCase(); // onClick -> click
}

function createDom(vnode) {
  const dom =
    vnode.type === TEXT_ELEMENT
      ? document.createTextNode(vnode.props?.nodeValue ?? "")
      : document.createElement(vnode.type);

  vnode.dom = dom;
  updateDom(dom, {}, vnode.props ?? {});
  return dom;
}

function updateDom(dom, prevProps, nextProps) {
  // Text node
  if (dom.nodeType === 3) {
    const nextText = nextProps?.nodeValue ?? "";
    if (dom.nodeValue !== String(nextText)) {
      dom.nodeValue = String(nextText);
    }
    return;
  }

  // Remove old or changed event listeners
  for (const name in prevProps) {
    if (!isEventProp(name)) continue;
    const prevHandler = prevProps[name];
    const nextHandler = nextProps[name];
    if (!nextHandler || prevHandler !== nextHandler) {
      dom.removeEventListener(eventName(name), prevHandler);
    }
  }

  // Remove old properties
  for (const name in prevProps) {
    if (!isPropertyProp(name)) continue;
    if (!(name in nextProps)) {
      removeProp(dom, name);
    }
  }

  // Set new or changed properties
  for (const name in nextProps) {
    if (!isPropertyProp(name)) continue;
    if (prevProps[name] !== nextProps[name]) {
      setProp(dom, name, nextProps[name]);
    }
  }

  // Add event listeners
  for (const name in nextProps) {
    if (!isEventProp(name)) continue;
    const prevHandler = prevProps[name];
    const nextHandler = nextProps[name];
    if (!prevHandler || prevHandler !== nextHandler) {
      dom.addEventListener(eventName(name), nextHandler);
    }
  }
}

function reconcileRender(parentDom, oldVNode, newVNode) {
  // Function component
  if (newVNode != null && isFunctionType(newVNode.type)) {
    if (oldVNode && oldVNode.type === newVNode.type) {
      newVNode.hooks = oldVNode.hooks;
    }

    newVNode.__rerender = rerenderRoot;

    setCurrentOwner(newVNode);

    const rendered = newVNode.type(newVNode.props ?? {});
    const child = reconcileRender(parentDom, oldVNode?.child ?? null, rendered);

    newVNode.child = child;
    newVNode.dom = child?.dom ?? null;
    return newVNode;
  }

  // new node
  if (oldVNode == null) {
    const dom = createDom(newVNode);
    parentDom.appendChild(dom);

    const children = newVNode.children ?? [];
    const mounted = [];

    for (let i = 0; i < children.length; i++) {
      const child = reconcileRender(dom, null, children[i]);
      if (child != null) mounted.push(child);
    }

    newVNode.children = mounted;
    return newVNode;
  }

  // remove node
  if (newVNode == null) {
    parentDom.removeChild(oldVNode.dom);
    return null;
  }

  // replace node
  if (oldVNode.type !== newVNode.type) {
    const dom = createDom(newVNode);
    parentDom.replaceChild(dom, oldVNode.dom);
    return newVNode;
  }

  // pass dom to newVNode
  newVNode.dom = oldVNode.dom;

  // update simple vnode and text node
  updateDom(newVNode.dom, oldVNode.props ?? {}, newVNode.props ?? {});

  // reconcile children
  const oldChildren = oldVNode.children ?? [];
  const newChildren = newVNode.children ?? [];

  const max = Math.max(oldChildren.length, newChildren.length);
  const reconciledChildren = [];

  for (let i = 0; i < max; i++) {
    const child = reconcileRender(newVNode.dom, oldChildren[i], newChildren[i]);
    if (child != null) reconciledChildren.push(child);
  }

  newVNode.children = reconciledChildren;
  return newVNode;
}

let rootContainer = null;
let rootRenderFn = null;

function rerenderRoot() {
  const vnode = rootRenderFn();
  const prevRoot = rootContainer.__rootVNode ?? null;
  const nextRoot = reconcileRender(rootContainer, prevRoot, vnode);
  rootContainer.__rootVNode = nextRoot;
}

export function render(renderFn, container) {
  rootContainer = container;
  rootRenderFn = renderFn;
  rerenderRoot();
}
