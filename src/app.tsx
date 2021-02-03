import * as React from "react";
import { useReducer, useState } from "react";
import * as ReactDOM from "react-dom";
import { Layer, primitives, TypeSpecifier } from "./c-ast";
import { DeclarationNode } from "./c-rst";
import { IntegerInput } from "./integer-input";
import { randomLayers } from "./layers";
import { InputLayer, makeInputLayer, TypeInput } from "./layers-input";
import { randomElement } from "./util";

function useProvider<T>(provider: () => T): [T, () => void] {
  return useReducer(provider, undefined, provider);
}

export interface CdeclProps {
  primitive: TypeSpecifier[];
  type: Layer[];
  name: string;
}

function App(): JSX.Element {
  const name = "my_type";
  const [difficulty, setDifficulty] = useState(6);
  const [primitive, resetPrimitive] = useProvider(() => [...randomElement(primitives)]);
  const [type, resetType] = useProvider(() => randomLayers(difficulty));
  const [input, setInput] = useState<InputLayer[]>([]);
  const expected = type.map(layer => layer.type);

  function reset() {
    resetPrimitive();
    resetType();
    setInput([]);
  }

  return <div className="app">
    <h1>What cdecl?</h1>
    <div>
      <code><DeclarationNode ast={{ specifiers: ["typedef", ...primitive], declarators: [{ declarator: { type: type, name } }] }} /></code>
    </div>
    <TypeInput name={name} primitive={primitive} value={input} expected={expected} onUpdate={setInput} />
    <div>
      <label>difficulty: <IntegerInput value={difficulty} min={1} max={1000} onChange={value => {
        setDifficulty(value);
        reset();
      }} /></label>{" "}
      <button onClick={() => setInput(expected.map(makeInputLayer))}>show solution</button>{" "}
      <button onClick={reset}>another one</button>
    </div>
  </div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
