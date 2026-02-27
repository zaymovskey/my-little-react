export const TEXT_ELEMENT = "TEXT";

function createTextElement(value) {
  return {
    type: TEXT_ELEMENT,
    props: { nodeValue: String(value) },
    children: [],
  };
}

function isVNode(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "type" in value
  );
}

function normalizeChildren(children) {
  const normalized = [];
  for (const child of children) {
    if (child === null || child === undefined || typeof child === "boolean") {
      continue;
    }

    if (typeof child === "string" || typeof child === "number") {
      normalized.push(createTextElement(child));
      continue;
    }

    if (Array.isArray(child)) {
      normalized.push(...normalizeChildren(child));
      continue;
    }

    if (isVNode(child)) {
      normalized.push(child);
      continue;
    }
  }
  return normalized;
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: props ?? {},
    children: normalizeChildren(children),
  };
}
