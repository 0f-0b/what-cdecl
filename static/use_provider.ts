import { useReducer } from "react";

export function useProvider<T>(provider: () => T): [T, () => undefined] {
  return useReducer(provider, undefined, provider) as [T, () => undefined];
}
