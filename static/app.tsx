/* @jsxRuntime automatic */
/* @jsxImportSource react */

import { type React, useState } from "react";

import { primitives } from "./c_ast.ts";
import { sample } from "./collections/sample.ts";
import { DeclarationNode } from "./components/c_ast_nodes.tsx";
import { IntegerInput } from "./components/integer_input.tsx";
import {
  type InputLayer,
  makeInputLayer,
  TypeInput,
} from "./components/type_input.tsx";
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
          {"difficulty: "}
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
        <input
          type="button"
          value="show solution"
          onClick={() => setInput(expected.map(makeInputLayer))}
        />{" "}
        <input
          type="button"
          value="another one"
          onClick={reset}
        />
      </div>
    </div>
  );
};
