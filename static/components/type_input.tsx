/* @jsxImportSource react */

import { Fragment, type React } from "react";

import type { TypeSpecifier } from "../c_ast.ts";
import { type LayerType, layerTypes } from "../layers.ts";
import { DeclarationSpecifierNode } from "./c_ast_nodes.tsx";
import { HlVariable } from "./highlight.tsx";

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
  primitive: readonly TypeSpecifier[];
  value: readonly InputLayer[];
  expected: readonly LayerType[];
  onUpdate: (value: readonly InputLayer[]) => unknown;
}

export const TypeInput: React.FC<TypeInputProps> = ({
  name,
  primitive,
  expected,
  value,
  onUpdate,
}) => (
  <>
    <div
      className={value.length === expected.length &&
          value.every(({ type }, index) => type === expected[index])
        ? "correct"
        : undefined}
    >
      Instances of{" "}
      <code>
        <HlVariable>{name}</HlVariable>
      </code>{" "}
      are{" "}
      <span>
        {value.map((layer, index) => (
          <Fragment key={layer.id}>
            <input
              type="button"
              className="layer removable"
              value={layerTypes[layer.type].description}
              onClick={() => {
                // TODO change to `toSpliced` when targeting es2023
                const newValue = value.slice();
                newValue.splice(index, 1);
                onUpdate(newValue);
              }}
            />
            {" "}
          </Fragment>
        ))}
      </span>
      <code>
        {primitive.map((specifier, index) => (
          <Fragment key={index}>
            {index ? " " : ""}
            <DeclarationSpecifierNode ast={specifier} />
          </Fragment>
        ))}
      </code>s.
    </div>
    <div>
      {(Object.keys(layerTypes) as LayerType[]).map((type) => (
        <Fragment key={type}>
          <input
            type="button"
            className="layer insertable"
            value={type}
            onClick={() =>
              onUpdate([...value, makeInputLayer(type)])}
          />
          {" "}
        </Fragment>
      ))}
    </div>
  </>
);
