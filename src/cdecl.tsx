import * as React from "react";
import { PropsWithChildren, ReactNode } from "react";
import { HlKeyword, HlNumeric, HlOperator, HlType, HlVariable } from "./highlight";
import { Layer, LayerType } from "./layers";
import { Primitive } from "./primitives";
import { joinArray } from "./util";

function Parens({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <>({children})</>;
}

function PointerLayer({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <><HlOperator>*</HlOperator>{children}</>;
}

function ArrayLayer({ children, length }: PropsWithChildren<{ length: number; }>): JSX.Element {
  return <>{children}[<HlNumeric>{length}</HlNumeric>]</>;
}

function FunctionLayer({ children, args }: PropsWithChildren<{ args: Primitive[]; }>): JSX.Element {
  return <>{children}({joinArray(args.map((arg, index): ReactNode => <HlType key={index}>{arg}</HlType>), ", ")})</>;
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
  let result: ReactNode = <HlVariable>{name}</HlVariable>;
  for (let i = 0, size = layers.length; i < size; i++)
    result = renderLayer(result, layers[i], layers[i - 1]?.type);
  return <code><HlKeyword>typedef</HlKeyword> <HlType>{root}</HlType> {result};</code>;
}
