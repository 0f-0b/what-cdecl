import * as React from "react";
import { ReactNode } from "react";
import { HlType, HlVariable } from "./highlight";
import { LayerType, layerTypes } from "./layers";
import { Primitive } from "./primitives";
import { arrayEqual, joinArray } from "./util";

let nextId = 0;

export interface InputLayer {
  id: number;
  type: LayerType;
}

export function makeInputLayer(type: LayerType): InputLayer {
  return {
    id: nextId++,
    type
  };
}

export interface LayersInputProps {
  name: string;
  root: Primitive;
  layers: InputLayer[];
  expected: LayerType[];
  onUpdate(layers: InputLayer[]): void;
}

export function LayersInput({ name, root, layers, expected, onUpdate }: LayersInputProps): JSX.Element {
  return <>
    <div className={arrayEqual(layers.map(layer => layer.type), expected) ? "correct" : undefined}>
      instances of <code><HlVariable>{name}</HlVariable></code> are <span>{joinArray(layers.map((layer, index): ReactNode => <button key={layer.id} className="layer removable" onClick={() => onUpdate([...layers.slice(0, index), ...layers.slice(index + 1)])}>{layerTypes[layer.type].description}</button>), " ")}</span> <code><HlType>{root}</HlType></code>s
    </div>
    <div>
      {joinArray((Object.keys(layerTypes) as LayerType[]).map((type): ReactNode => <button key={type} className="layer insertable" onClick={() => onUpdate([...layers, makeInputLayer(type)])}>{type}</button>), " ")}
    </div>
  </>;
}
