let state = undefined;

export function useState(initial) {
  if (state === undefined) {
    state = initial;
  }

  function setState(next) {
    state = typeof next === "function" ? next(state) : next;
    rerender();
  }

  return [state, setState];
}

let rerender = null;

export function setRerender(fn) {
  rerender = fn;
}
