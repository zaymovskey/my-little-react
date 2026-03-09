import { createElement } from "../core/vdom/createElement";
import { UseEffectDemo } from "./UseEffectDemo";
import { UseStateDemo } from "./UseStateDemo";

export function App() {
  return createElement(
    "div",
    {},
    createElement(UseStateDemo, null),
    createElement(UseEffectDemo, null),
  );
}
