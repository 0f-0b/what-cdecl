import { Layer, primitives } from "./c-ast";
import { randomElement, randomInt } from "./util";

export type LayerType = Layer["type"];

export const layerTypes: {
  [key in LayerType]: {
    description: string;
    next: LayerType[];
  };
} = {
  pointer: {
    description: "pointers to",
    next: ["pointer", "array", "function"]
  },
  array: {
    description: "arrays of",
    next: ["pointer", "array"]
  },
  function: {
    description: "functions returning",
    next: ["pointer"]
  }
};

export function randomLayer(type: LayerType): Layer {
  switch (type) {
    case "pointer":
      return { type };
    case "array":
      return { type, size: 2 + randomInt(8) };
    case "function":
      return { type, params: Array.from({ length: randomInt(4) }, () => ({ specifiers: [randomElement(primitives)], declarator: { type: [] } })) };
  }
}

export function randomLayers(size: number): Layer[] {
  const result: Layer[] = [];
  let last: LayerType = "pointer";
  for (let i = 0; i < size; i++)
    result.push(randomLayer(last = randomElement(layerTypes[last].next)));
  return result;
}
