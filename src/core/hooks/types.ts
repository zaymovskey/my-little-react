export interface StateHook<T> {
  type: "state";
  state: T;
}
