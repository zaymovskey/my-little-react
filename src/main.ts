import { render, getCurrentContainer } from "./core/render/render";
import { createElement } from "./core/vdom/createElement";
import type { VNode } from "./core/vdom/types";

function Title(props: { children: VNode[] }) {
  return createElement("h1", null, ...props.children);
}

function App() {
  return createElement(
    "div",
    { className: "app" },
    createElement(Title, null, "Hello"),
    createElement(
      "button",
      {
        onClick: () => {
          const container = getCurrentContainer();
          if (!container) {
            throw new Error("No current container");
          }

          render(
            createElement(
              "div",
              { className: "app updated" },
              createElement(Title, null, "Hello updated"),
              createElement("span", null, "Rerender worked"),
            ),
            container,
          );
        },
      },
      "Update",
    ),
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root container not found");
}

render(createElement(App, null), root);
