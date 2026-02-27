let hooks = [];
let currentHookIndex = 0;

let rerender = null;

export function setRerender(fn) {
  rerender = fn;
}

export function resetHooksCursor() {
  currentHookIndex = 0;
}

export function useState(initial) {
  const i = currentHookIndex;

  if (hooks[i] === undefined) {
    hooks[i] = initial;
  }

  function setState(next) {
    const prev = hooks[i];
    hooks[i] = typeof next === "function" ? next(prev) : next;
    rerender?.();
  }

  currentHookIndex++;
  return [hooks[i], setState];
}
