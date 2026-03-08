import { useState } from "./core/hooks/useState";
import { render } from "./core/render/render";
import { createElement } from "./core/vdom/createElement";

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(10);

  return createElement(
    "div",
    {},
    createElement(
      "div",
      {},
      createElement(
        "div",
        {},
        createElement(
          "button",
          {
            onClick: () => {
              setCount1(count1 - 1);
              setCount1(count1 - 1);
            },
          },
          "-2",
        ),
        createElement(
          "button",
          {
            onClick: () => {
              setCount1(count1 - 1);
            },
          },
          "-",
        ),
        createElement("span", {}, `Count: ${count1}`),
        createElement(
          "button",
          {
            onClick: () => {
              setCount1(count1 + 1);
            },
          },
          "+",
        ),
        createElement(
          "button",
          {
            onClick: () => {
              setCount1(count1 + 1);
              setCount1(count1 + 1);
            },
          },
          "+2",
        ),
      ),
    ),

    createElement(
      "div",
      {},
      createElement(
        "div",
        {},
        createElement(
          "button",
          {
            onClick: () => {
              setCount2((prev) => prev - 1);
              setCount2((prev) => prev - 1);
            },
          },
          "-2",
        ),
        createElement(
          "button",
          {
            onClick: () => {
              setCount2((prev) => prev - 1);
            },
          },
          "-",
        ),
        createElement("span", {}, `Count: ${count2}`),
        createElement(
          "button",
          {
            onClick: () => {
              setCount2((prev) => prev + 1);
            },
          },
          "+",
        ),
        createElement(
          "button",
          {
            onClick: () => {
              setCount2((prev) => prev + 1);
              setCount2((prev) => prev + 1);
            },
          },
          "+2",
        ),
      ),
    ),
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root container not found");
}

render(createElement(App, null), root);
