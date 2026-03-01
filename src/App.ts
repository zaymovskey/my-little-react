import {
  createFunctionalComponentVNode,
  createHtmlVNode,
  createTextVNode,
} from "@/core";
import { useState } from "@/core/hooks";

const A = createFunctionalComponentVNode(() => {
  const [counter, setCounter] = useState(0);
  return createHtmlVNode("button", { onclick: () => setCounter(counter + 1) }, [
    createTextVNode(`Counter: ${counter}`),
  ]);
});

const B = createFunctionalComponentVNode(() => {
  const [counter, setCounter] = useState(0);
  return createHtmlVNode(
    "button",
    { onclick: () => setCounter((prev) => prev + 1) },
    [createTextVNode(`Counter: ${counter}`)],
  );
});

export const App = createFunctionalComponentVNode(() => {
  return createHtmlVNode("main", {}, [A, B]);
});
