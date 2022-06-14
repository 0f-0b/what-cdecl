import React, { useState } from "./deps/react.ts";
import { primitives } from "./c_ast.ts";
import { sample } from "./collections/sample.ts";
import { DeclarationNode } from "./components/c_ast_nodes.tsx";
import { IntegerInput } from "./components/integer_input.tsx";
import {
  InputLayer,
  makeInputLayer,
  TypeInput,
} from "./components/layers_input.tsx";
import { randomLayers } from "./layers.ts";
import { useProvider } from "./use_provider.ts";

export const App: React.FC = () => {
  const name = "my_type";
  const [difficulty, setDifficulty] = useState(6);
  const [primitive, resetPrimitive] = useProvider(() => sample(primitives)!);
  const [type, resetType] = useProvider(() => randomLayers(difficulty));
  const [input, setInput] = useState<readonly InputLayer[]>([]);
  const expected = type.map((layer) => layer.type);

  function reset() {
    resetPrimitive();
    resetType();
    setInput([]);
  }

  return (
    <div className="app">
      <h1>What cdecl?</h1>
      <div>
        <code>
          <DeclarationNode
            ast={{
              specifiers: ["typedef", ...primitive],
              declarators: [{ declarator: { type, name } }],
            }}
          />
        </code>
      </div>
      <TypeInput
        name={name}
        primitive={primitive}
        value={input}
        expected={expected}
        onUpdate={setInput}
      />
      <div>
        <label>
          difficulty:{" "}
          <IntegerInput
            value={difficulty}
            min={1}
            max={1000}
            onChange={(value) => {
              setDifficulty(value);
              reset();
            }}
          />
        </label>{" "}
        <button onClick={() => setInput(expected.map(makeInputLayer))}>
          show solution
        </button>{" "}
        <button onClick={reset}>
          another one
        </button>
      </div>
    </div>
  );
};
