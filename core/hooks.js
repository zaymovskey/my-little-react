let currentOwner = null;

export function setCurrentOwner(vnode) {
  currentOwner = vnode;
  if (!currentOwner.hooks) currentOwner.hooks = [];
  currentOwner.hookIndex = 0;
}

export function useState(initial) {
  const owner = currentOwner;
  const i = owner.hookIndex;

  if (owner.hooks[i] === undefined) owner.hooks[i] = initial;

  const setState = (next) => {
    const prev = owner.hooks[i];
    owner.hooks[i] = typeof next === "function" ? next(prev) : next;
    owner.__rerender?.();
  };

  owner.hookIndex++;
  return [owner.hooks[i], setState];
}
