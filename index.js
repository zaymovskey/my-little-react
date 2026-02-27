import { createElement } from "./core/createElement.js";
import { render } from "./core/render.js";
import { useState } from "./core/hooks.js";

const root = document.getElementById("root");

function CounterA() {
  const [a, setA] = useState(0);

  return createElement(
    "button",
    { onClick: () => setA((v) => v + 1) },
    "A: ",
    String(a),
  );
}

function CounterB() {
  const [b, setB] = useState(100);

  return createElement(
    "button",
    { onClick: () => setB((v) => v + 1) },
    "B: ",
    String(b),
  );
}

function App() {
  return createElement(
    "div",
    null,
    createElement(CounterA, null),
    createElement("br", null),
    createElement(CounterB, null),
  );
}

render(() => createElement(App, null), root);
