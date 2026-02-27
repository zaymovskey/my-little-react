import { createElement } from "./core/createElement.js";
import { render } from "./core/render.js";
import { useState } from "./core/hooks.js";

const root = document.getElementById("root");

function view() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(10);

  return createElement(
    "div",
    null,
    createElement("h1", null, "a=", String(a), " b=", String(b)),
    createElement("button", { onClick: () => setA((x) => x + 1) }, "A+"),
    createElement("button", { onClick: () => setB((x) => x + 1) }, "B+"),
  );
}

render(view, root);
