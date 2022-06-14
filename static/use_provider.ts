import { useReducer } from "./deps/react.ts";

export function useProvider<T>(provider: () => T): [T, () => undefined] {
  return useReducer(provider, undefined, provider) as [T, () => undefined];
}
