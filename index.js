import { createElement, render } from "./core/index.js";

const app = createElement(
  "div",
  { id: "app", className: "box" },
  createElement("h1", null, "Hello"),
  createElement("button", { onClick: () => alert("click") }, "Click"),
);
render(app, document.getElementById("root"));
