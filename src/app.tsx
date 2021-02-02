import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import { Layer, Primitive, primitives } from "./c-ast";
import { DeclarationNode } from "./c-rst";
import { IntegerInput } from "./integer-input";
import { randomLayers } from "./layers";
import { InputLayer, LayersInput, makeInputLayer } from "./layers-input";
import { randomElement } from "./util";

export interface CdeclProps {
  primitive: Primitive;
  type: Layer[];
  name: string;
}

export function Cdecl({ primitive, type, name }: CdeclProps): JSX.Element {
  return <code><DeclarationNode ast={{ specifiers: ["typedef", primitive], declarators: [{ type, name }] }} /></code>;
}

function App(): JSX.Element {
  const name = "my_type";
  const [difficulty, setDifficulty] = useState(6);
  const [primitive, setPrimitive] = useState(randomElement(primitives));
  const [layers, setLayers] = useState(randomLayers(difficulty));
  const [inputLayers, setInputLayers] = useState<InputLayer[]>([]);
  const expected = layers.map(layer => layer.type);
  return <div className="app">
    <h1>What cdecl?</h1>
    <div>
      <Cdecl primitive={primitive} type={layers} name={name} />
    </div>
    <LayersInput name={name} primitive={primitive} layers={inputLayers} expected={expected} onUpdate={setInputLayers} />
    <div>
      <label>difficulty: <IntegerInput value={difficulty} min={1} max={1000} onChange={value => {
        setDifficulty(value);
        setPrimitive(randomElement(primitives));
        setLayers(randomLayers(value));
        setInputLayers([]);
      }} /></label>{" "}
      <button onClick={() => setInputLayers(expected.map(makeInputLayer))}>show solution</button>{" "}
      <button onClick={() => {
        setPrimitive(randomElement(primitives));
        setLayers(randomLayers(difficulty));
        setInputLayers([]);
      }}>another one</button>
    </div>
  </div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
