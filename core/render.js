import { TEXT_ELEMENT } from "./createElement.js";

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
  console.log(dom);
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

  updateDom(dom, {}, vnode.props ?? {});

  for (const child of vnode.children ?? []) {
    dom.appendChild(createDom(child));
  }

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

export function render(vnode, container) {
  container.textContent = "";
  container.appendChild(createDom(vnode));
}
