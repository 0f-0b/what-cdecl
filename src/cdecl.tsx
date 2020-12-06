import * as React from "react";
import { PropsWithChildren, ReactNode } from "react";
import { Layer, LayerType } from "./layers";
import { Primitive } from "./primitives";
import { joinArray } from "./util";

function Parens({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <>({children})</>;
}

function PointerLayer({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <>*{children}</>;
}

function ArrayLayer({ children, length }: PropsWithChildren<{ length: number; }>): JSX.Element {
  return <>{children}[<span className="hl-number">{length}</span>]</>;
}

function FunctionLayer({ children, args }: PropsWithChildren<{ args: Primitive[]; }>): JSX.Element {
  return <>{children}({joinArray(args.map((arg, index): ReactNode => <span key={index} className="hl-type">{arg}</span>), ", ")})</>;
}

function renderLayer(last: ReactNode, layer: Layer, lastType?: LayerType): ReactNode {
  if (lastType === "pointer" && layer.type !== "pointer")
    last = <Parens>{last}</Parens>;
  switch (layer.type) {
    case "pointer":
      return <PointerLayer>{last}</PointerLayer>;
    case "array":
      return <ArrayLayer length={layer.length}>{last}</ArrayLayer>;
    case "function": {
      return <FunctionLayer args={layer.args}>{last}</FunctionLayer>;
    }
  }
}

export interface CdeclProps {
  name: string;
  root: Primitive;
  layers: Layer[];
}

export function Cdecl({ name, root, layers }: CdeclProps): JSX.Element {
  let result: ReactNode = <span className="hl-variable">{name}</span>;
  for (let i = 0, size = layers.length; i < size; i++)
    result = renderLayer(result, layers[i], layers[i - 1]?.type);
  return <code><span className="hl-keyword">typedef</span> <span className="hl-type">{root}</span> {result};</code>;
}
