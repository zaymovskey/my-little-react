import { useState } from "../core/hooks/useState";
import { createElement } from "../core/vdom/createElement";

export function UseStateDemo() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(10);

  const cardStyle = {
    border: "1px solid #27272a",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    background: "linear-gradient(180deg, #18181b 0%, #111113 100%)",
  };

  const rowStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap" as const,
    marginTop: "12px",
  };

  const valueStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
    minWidth: "100px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "1px solid #3f3f46",
    background: "#27272a",
    color: "#f9fafb",
    fontWeight: "700",
    cursor: "pointer",
  };

  const titleStyle = {
    fontSize: "24px",
    color: "#a1a1aa",
    marginBottom: "12px",
  };

  return createElement(
    "div",
    {},
    createElement(
      "h1",
      { style: { fontSize: "30px", margin: "20px auto" } },
      "Демонстрация работы useState",
    ),
    createElement(
      "div",
      { style: cardStyle },

      createElement(
        "p",
        { style: titleStyle },
        "setCount1(count1 - 1); (+2 не работает, как в реакте из-за замыкания)",
      ),

      createElement(
        "div",
        { style: rowStyle },

        createElement(
          "button",
          {
            style: buttonStyle,
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
            style: buttonStyle,
            onClick: () => {
              setCount1(count1 - 1);
            },
          },
          "-",
        ),

        createElement("span", { style: valueStyle }, `Count: ${count1}`),

        createElement(
          "button",
          {
            style: buttonStyle,
            onClick: () => {
              setCount1(count1 + 1);
            },
          },
          "+",
        ),

        createElement(
          "button",
          {
            style: buttonStyle,
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
      { style: cardStyle },

      createElement(
        "p",
        { style: titleStyle },
        "setCount2((prev) => prev - 1); (+2 работает, как в реакте)",
      ),

      createElement(
        "div",
        { style: rowStyle },

        createElement(
          "button",
          {
            style: buttonStyle,
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
            style: buttonStyle,
            onClick: () => {
              setCount2((prev) => prev - 1);
            },
          },
          "-",
        ),

        createElement("span", { style: valueStyle }, `Count: ${count2}`),

        createElement(
          "button",
          {
            style: buttonStyle,
            onClick: () => {
              setCount2((prev) => prev + 1);
            },
          },
          "+",
        ),

        createElement(
          "button",
          {
            style: buttonStyle,
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
