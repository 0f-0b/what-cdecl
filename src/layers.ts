import { Primitive, primitives } from "./primitives";
import { randomElement } from "./util";

export interface PointerLayer {
  type: "pointer";
}

export interface ArrayLayer {
  type: "array";
  length: number;
}

export interface FunctionLayer {
  type: "function";
  args: Primitive[];
}

export type Layer =
  | PointerLayer
  | ArrayLayer
  | FunctionLayer;
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
      return { type, length: Math.trunc(Math.random() * 8) + 2 };
    case "function":
      return { type, args: Array.from({ length: Math.trunc(Math.random() * 4) }, () => randomElement(primitives)) };
  }
}

export function randomLayers(size: number): Layer[] {
  const result: Layer[] = [];
  for (let i = 0; i < size; i++)
    result.push(randomLayer(randomElement(layerTypes[result[i - 1]?.type ?? "pointer"].next)));
  return result;
}
