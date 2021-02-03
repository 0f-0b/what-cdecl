import * as React from "react";
import { Fragment } from "react";
import { TypeSpecifier } from "./c-ast";
import { DeclarationSpecifierNode } from "./c-rst";
import { HlVariable } from "./highlight";
import { LayerType, layerTypes } from "./layers";
import { arrayEqual } from "./util";

let nextId = 0;

export interface InputLayer {
  id: number;
  type: LayerType;
}

export function makeInputLayer(type: LayerType): InputLayer {
  return { id: nextId++, type };
}

export interface TypeInputProps {
  name: string;
  primitive: TypeSpecifier[];
  value: InputLayer[];
  expected: LayerType[];
  onUpdate(type: InputLayer[]): void;
}

export function TypeInput({ name, primitive, expected, value, onUpdate }: TypeInputProps): JSX.Element {
  return <>
    <div className={arrayEqual(value.map(layer => layer.type), expected) ? "correct" : undefined}>
      Instances of <code><HlVariable>{name}</HlVariable></code> are <span>{value.map((layer, index) => <Fragment key={layer.id}><button className="layer removable" onClick={() => onUpdate([...value.slice(0, index), ...value.slice(index + 1)])}>{layerTypes[layer.type].description}</button> </Fragment>)}</span><code>{primitive.map((specifier, index) => <Fragment key={index}>{index ? " " : ""}<DeclarationSpecifierNode ast={specifier} /></Fragment>)}</code>s.
    </div>
    <div>
      {(Object.keys(layerTypes) as LayerType[]).map(type => <Fragment key={type}><button className="layer insertable" onClick={() => onUpdate([...value, makeInputLayer(type)])}>{type}</button> </Fragment>)}
    </div>
  </>;
}
