import { useEffect } from "../core/hooks/useEffect";
import { createElement } from "../core/vdom/createElement";

export function UnmountCleanupDemo() {
  useEffect(() => {
    console.log("UnmountCleanupDemo mounted");

    return () => {
      console.log("UnmountCleanupDemo cleanup on unmount");
    };
  }, []);

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
      "span",
      { style: valueStyle },
      "Компонент сейчас смонтирован",
    ),
    createElement(
      "p",
      { style: noteStyle },
      "Если скрыть этот блок, в консоли должен сработать cleanup при unmount.",
    ),
  );
}
