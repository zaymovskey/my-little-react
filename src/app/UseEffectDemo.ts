import { useEffect } from "../core/hooks/useEffect";
import { useState } from "../core/hooks/useState";
import { createElement } from "../core/vdom/createElement";

export function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [rerenders, setRerenders] = useState(0);

  useEffect(() => {
    console.log("useEffect fired after commit", { count, rerenders });
  });

  const cardStyle = {
    border: "1px solid #27272a",
    borderRadius: "18px",
    padding: "24px",
    background: "linear-gradient(180deg, #18181b 0%, #111113 100%)",
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
    {},

    createElement(
      "h1",
      { style: { fontSize: "30px", margin: "20px auto" } },
      "Демонстрация работы useEffect",
    ),

    createElement(
      "section",
      { style: cardStyle },

      createElement(
        "div",
        { style: rowStyle },
        createElement("span", { style: valueStyle }, `Count: ${count}`),
        createElement("span", { style: valueStyle }, `Rerenders: ${rerenders}`),
      ),

      createElement(
        "div",
        { style: rowStyle },

        createElement(
          "button",
          {
            style: buttonStyle,
            onClick: () => setCount((prev) => prev + 1),
          },
          "Count +1",
        ),

        createElement(
          "button",
          {
            style: buttonStyle,
            onClick: () => setRerenders((prev) => prev + 1),
          },
          "Force rerender",
        ),
      ),

      createElement(
        "p",
        { style: noteStyle },
        "Открой консоль: useEffect без deps срабатывает после каждого commit.",
      ),
    ),
  );
}
