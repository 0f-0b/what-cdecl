import { Layer, primitives } from "./c_ast.ts";
import { sample } from "./collections/sample.ts";
import { randomInt } from "./random.ts";

export type LayerType = Layer["type"];
export const layerTypes: {
  [key in LayerType]: {
    description: string;
    next: LayerType[];
  };
} = {
  pointer: {
    description: "pointers to",
    next: ["pointer", "array", "function"],
  },
  array: {
    description: "arrays of",
    next: ["pointer", "array"],
  },
  function: {
    description: "functions returning",
    next: ["pointer"],
  },
};

export function randomLayer(type: LayerType): Layer {
  switch (type) {
    case "pointer":
      return { type: "pointer" };
    case "array":
      return { type: "array", size: 2 + randomInt(8) };
    case "function":
      return {
        type: "function",
        params: Array.from({ length: randomInt(4) }, () => ({
          specifiers: Array.from(sample(primitives)!),
          declarator: { type: [] },
        })),
      };
  }
}

export function randomLayers(size: number): Layer[] {
  const result: Layer[] = [];
  let last: LayerType = "pointer";
  for (let i = 0; i < size; i++) {
    result.push(randomLayer(last = sample(layerTypes[last].next)!));
  }
  return result;
}
