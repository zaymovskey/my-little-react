import { createElement } from "./core/createElement.js";
import { render } from "./core/render.js";
import { useState } from "./core/hooks.js";

const root = document.getElementById("root");

function view() {
  const [n, setN] = useState(0);

  return createElement(
    "div",
    null,
    createElement("h1", null, "Count: ", String(n)),
    createElement("button", { onClick: () => setN((x) => x + 1) }, "+"),
    createElement("button", { onClick: () => setN((x) => x - 1) }, "-"),
  );
}

render(view, root);
