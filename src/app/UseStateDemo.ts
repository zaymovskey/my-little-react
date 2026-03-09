import { useState } from "../core/hooks/useState";
import { createElement } from "../core/vdom/createElement";

export function UseStateDemo() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(10);

  const pageStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  };

  const cardStyle = {
    border: "1px solid #27272a",
    borderRadius: "18px",
    padding: "24px",
    background: "linear-gradient(180deg, #18181b 0%, #111113 100%)",
  };

  const cardTitleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: "16px",
  };

  const rowStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap" as const,
    marginBottom: "18px",
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

  const valueStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
  };

  const noteStyle = {
    marginTop: "16px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#a1a1aa",
  };

  return createElement(
    "div",
    { style: pageStyle },

    createElement(
      "h1",
      { style: { fontSize: "30px", marginTop: "20px", textAlign: "center" } },
      "Демонстрация работы useState",
    ),

    createElement(
      "section",
      { style: cardStyle },

      createElement(
        "h2",
        { style: cardTitleStyle },
        "useState с прямым значением",
      ),

      createElement(
        "div",
        { style: rowStyle },
        createElement("span", { style: valueStyle }, `Count: ${count1}`),
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

      createElement(
        "p",
        { style: noteStyle },
        "Здесь используется setCount1(count1 + 1). Повторные вызовы в одном обработчике берут одно и то же замкнутое значение count1.",
      ),
    ),

    createElement(
      "section",
      { style: cardStyle },

      createElement(
        "h2",
        { style: cardTitleStyle },
        "useState с functional update",
      ),

      createElement(
        "div",
        { style: rowStyle },
        createElement("span", { style: valueStyle }, `Count: ${count2}`),
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

      createElement(
        "p",
        { style: noteStyle },
        "Здесь используется setCount2((prev) => prev + 1). Каждый update получает актуальное предыдущее значение, поэтому +2 и -2 работают корректно.",
      ),
    ),
  );
}
