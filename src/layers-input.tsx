import * as React from "react";
import { LayerType, layerTypes } from "./layers";
import { Primitive } from "./primitives";

export interface LayersInputProps {
  name: string;
  root: Primitive;
  layers: LayerType[];
  expected: LayerType[];
  onUpdate(layers: LayerType[]): void;
}

export function LayersInput({ name, root, layers, expected, onUpdate }: LayersInputProps): JSX.Element {
  return <div>
    <span className={layers.length === expected.length && layers.every((layer, index) => layer === expected[index]) ? "correct" : undefined}>
      instances of <code><span className="hl-variable">{name}</span></code> are {layers.map((layer, index) => <button key={index} className="layer removable" onClick={() => onUpdate([...layers.slice(0, index), ...layers.slice(index + 1)])}>{layerTypes[layer].description}</button>)}<code><span className="hl-type">{root}</span></code>s
    </span><br />
    <span>
      {(Object.keys(layerTypes) as LayerType[]).map(layer => <button key={layer} className="layer insertable" onClick={() => onUpdate([...layers, layer])}>{layer}</button>)}
    </span>
  </div>;
}
