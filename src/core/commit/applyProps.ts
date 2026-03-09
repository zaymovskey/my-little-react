export function applyProps(
  node: HTMLElement,
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): void {
  // remove old
  for (const prevKey in prev) {
    if (prevKey === "children") continue;

    if (!(prevKey in next)) {
      if (isEventProp(prevKey)) {
        const eventName = getEventName(prevKey);
        const prevHandler = prev[prevKey];

        if (typeof prevHandler === "function") {
          node.removeEventListener(eventName, prevHandler as EventListener);
        }
      } else if (prevKey === "style") {
        const prevStyle = prev[prevKey] as Record<string, string> | undefined;
        if (prevStyle) {
          for (const styleName in prevStyle) {
            (node.style as any)[styleName] = "";
          }
        }
      } else {
        const attr = normalizeAttrName(prevKey);
        node.removeAttribute(attr);
      }
    }
  }

  // add / update new
  for (const nextKey in next) {
    if (nextKey === "children") continue;

    if (prev[nextKey] !== next[nextKey]) {
      if (isEventProp(nextKey)) {
        const eventName = getEventName(nextKey);
        const prevHandler = prev[nextKey];
        const nextHandler = next[nextKey];

        if (typeof prevHandler === "function") {
          node.removeEventListener(eventName, prevHandler as EventListener);
        }

        if (typeof nextHandler === "function") {
          node.addEventListener(eventName, nextHandler as EventListener);
        }
      } else if (nextKey === "style") {
        const prevStyle = (prev[nextKey] as Record<string, string>) ?? {};
        const nextStyle = (next[nextKey] as Record<string, string>) ?? {};

        // удалить старые стили, которых больше нет
        for (const styleName in prevStyle) {
          if (!(styleName in nextStyle)) {
            (node.style as any)[styleName] = "";
          }
        }

        // применить новые
        for (const styleName in nextStyle) {
          (node.style as any)[styleName] = nextStyle[styleName];
        }
      } else {
        const attr = normalizeAttrName(nextKey);
        const value = next[nextKey];

        if (value == null || value === false) {
          node.removeAttribute(attr);
        } else {
          node.setAttribute(attr, String(value));
        }
      }
    }
  }
}

function isEventProp(key: string): boolean {
  return /^on[A-Z]/.test(key);
}

function getEventName(propName: string): string {
  return propName.slice(2).toLowerCase();
}

function normalizeAttrName(propName: string): string {
  return propName === "className" ? "class" : propName;
}
