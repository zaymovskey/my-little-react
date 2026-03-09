import { useEffect } from "../core/hooks/useEffect";
import { useState } from "../core/hooks/useState";
import { createElement } from "../core/vdom/createElement";

export function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [rerenders, setRerenders] = useState(0);
  const [mountOnlyRuns, setMountOnlyRuns] = useState(0);
  const [countEffectRuns, setCountEffectRuns] = useState(0);

  useEffect(() => {
    console.log("useEffect срабатывает при каждом рендере", {
      count,
      rerenders,
    });
  });

  useEffect(() => {
    console.log(
      "useEffect с [] срабатывает только при первом mount компонента",
    );
    setMountOnlyRuns((prev) => prev + 1);
  }, []);

  useEffect(() => {
    console.log(
      "useEffect с deps [count] срабатывает только когда меняется count",
    );

    setCountEffectRuns((prev) => prev + 1);
  }, [count]);

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
      "Демонстрация работы useEffect",
    ),

    // ---------- БЕЗ DEPS ----------
    createElement(
      "section",
      { style: cardStyle },

      createElement("h2", { style: cardTitleStyle }, "useEffect без deps"),

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

    // ---------- [] ----------
    createElement(
      "section",
      { style: cardStyle },

      createElement("h2", { style: cardTitleStyle }, "useEffect с []"),

      createElement(
        "div",
        { style: rowStyle },
        createElement(
          "span",
          { style: valueStyle },
          `Mount-only runs: ${mountOnlyRuns}`,
        ),
      ),

      createElement(
        "p",
        { style: noteStyle },
        "Этот effect выполняется только один раз при первом mount компонента.",
      ),
    ),

    // ---------- [count] ----------
    createElement(
      "section",
      { style: cardStyle },

      createElement(
        "h2",
        { style: cardTitleStyle },
        "useEffect с deps [count]",
      ),

      createElement(
        "div",
        { style: rowStyle },
        createElement("span", { style: valueStyle }, `Count: ${count}`),
        createElement(
          "span",
          { style: valueStyle },
          `Effect runs: ${countEffectRuns}`,
        ),
      ),

      createElement(
        "p",
        { style: noteStyle },
        "Этот effect запускается только когда меняется count.",
      ),
    ),
  );
}
