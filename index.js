import { createElement, render } from "./core/index.js";

const root = document.getElementById("root");

const app = createElement(
  "div",
  { id: "app", className: "box" },
  createElement("h1", null, "Hello"),
  createElement("button", { onClick: () => alert("click") }, "Click"),
);

const newApp = createElement(
  "div",
  { id: "app", className: "box" },
  createElement("h1", null, "Hello2"),
  createElement("button", { onClick: () => alert("click") }, "Click"),
);

render(app, root);

render(newApp, root);
