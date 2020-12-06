import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import { Cdecl } from "./cdecl";
import { IntegerInput } from "./integer-input";
import { LayerType, randomLayers } from "./layers";
import { LayersInput } from "./layers-input";
import { primitives } from "./primitives";
import { randomElement } from "./util";

function App(): JSX.Element {
  const name = "my_type";
  const [difficulty, setDifficulty] = useState(6);
  const [root, setRoot] = useState(randomElement(primitives));
  const [layers, setLayers] = useState(randomLayers(difficulty));
  const [inputLayers, setInputLayers] = useState<LayerType[]>([]);
  const expected = layers.map(layer => layer.type);
  return <div className="app">
    <h1>What cdecl?</h1>
    <Cdecl name={name} root={root} layers={layers} />
    <LayersInput name={name} root={root} layers={inputLayers} expected={expected} onUpdate={setInputLayers} />
    difficulty: <IntegerInput value={difficulty} min={1} max={1000} onChange={value => {
      setDifficulty(value);
      setRoot(randomElement(primitives));
      setLayers(randomLayers(value));
      setInputLayers([]);
    }} />
    <button className="button" onClick={() => setInputLayers(expected)}>show solution</button>
    <button className="button" onClick={() => {
      setRoot(randomElement(primitives));
      setLayers(randomLayers(difficulty));
      setInputLayers([]);
    }}>another one</button>
  </div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
