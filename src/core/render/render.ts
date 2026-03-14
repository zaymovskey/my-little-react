import { applyCommit } from "../commit/applyCommit";
import type { Fiber } from "../fiber/types";
import { runEffects } from "../hooks/useEffect";
import { reconcileFiber } from "../reconcile/reconcileFiber";
import type { CommitOp } from "../reconcile/types";
import type { VNode } from "../vdom/types";

let currentRoot: Fiber | null = null;
let currentContainer: Node | null = null;

let lastVnode: VNode | null = null;

let renderScheduled = false;

export function render(vnode: VNode, container: Node): void {
  lastVnode = vnode;

  const ops: CommitOp[] = [];
  const newRoot = reconcileFiber(currentRoot, vnode, null, ops);

  applyCommit(ops, container);

  // Здесь выполняются useLayoutEffect колбэки. До браузерного рендер пайплайна.

  currentRoot = newRoot;
  currentContainer = container;

  schedulePassiveEffects();
}

export function rerender(): void {
  if (lastVnode && currentContainer) {
    render(lastVnode, currentContainer);
    return;
  }

  throw new Error("🛑 No previous render found to rerender");
}

export function scheduleRender() {
  if (renderScheduled) return;

  renderScheduled = true;

  queueMicrotask(() => {
    renderScheduled = false;
    rerender();
  });
}

function schedulePassiveEffects() {
  // Эффекты в реакте выполняются после браузерного рендер пайплайна.
  // Мы говорим: не запускай runEffects() прямо сейчас.
  // Поставь его в очередь и выполни позже, когда текущий код уже полностью закончится.
  // Это нужно в том числе для того, чтобы ускорить отрисовку, перекинув ее на следующий тик
  // и не блокировать отрисовку UI выполнением эффектов.
  setTimeout(() => {
    runEffects();
  }, 0);
}
