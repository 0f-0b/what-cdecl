import * as React from "react";
import { Fragment, PropsWithChildren, ReactNode } from "react";
import { AbstractDeclarator, Declaration, Declarator, ParameterDeclaration } from "./c-ast";
import { HlKeyword, HlNumeric, HlOperator, HlVariable } from "./highlight";

function Parentheses({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <>({children})</>;
}

function PointerNode({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <><HlOperator>*</HlOperator>{children}</>;
}

function ArrayNode({ children, size }: PropsWithChildren<{ size: number; }>): JSX.Element {
  return <>{children}[<HlNumeric>{size}</HlNumeric>]</>;
}

function FunctionNode({ children, params }: PropsWithChildren<{ params: ParameterDeclaration[]; }>): JSX.Element {
  return <>{children}({params.map((param, index): ReactNode => index
    ? <Fragment key={index}>, <ParameterDeclarationNode ast={param} /></Fragment>
    : <ParameterDeclarationNode key={index} ast={param} />)})</>;
}

function ParameterDeclarationNode({ ast }: { ast: ParameterDeclaration; }): JSX.Element {
  return <>{ast.specifiers.map((specifier, index) => <Fragment key={index}><HlKeyword>{specifier}</HlKeyword>{ast.declarator.type.length || "name" in ast.declarator ? " " : ""}</Fragment>)}{<DeclaratorNode ast={ast.declarator} />}</>;
}

export function DeclaratorNode({ ast }: { ast: Declarator | AbstractDeclarator; }): JSX.Element {
  let result: ReactNode = "name" in ast ? <HlVariable>{ast.name}</HlVariable> : null;
  let wasPointer = false;
  for (const layer of ast.type) {
    if (layer.type === "pointer")
      wasPointer = true;
    else {
      if (wasPointer)
        result = <Parentheses>{result}</Parentheses>;
      wasPointer = false;
    }
    switch (layer.type) {
      case "pointer":
        result = <PointerNode>{result}</PointerNode>;
        break;
      case "array":
        result = <ArrayNode size={layer.size}>{result}</ArrayNode>;
        break;
      case "function":
        result = <FunctionNode params={layer.params}>{result}</FunctionNode>;
        break;
    }
  }
  return <>{result}</>;
}

export function DeclarationNode({ ast }: { ast: Declaration; }): JSX.Element {
  return <>{ast.specifiers.map((specifier, index) => <Fragment key={index}><HlKeyword>{specifier}</HlKeyword> </Fragment>)}{ast.declarators.map((declarator, index): ReactNode => index ? <Fragment key={index}>, <DeclaratorNode ast={declarator} /></Fragment> : <DeclaratorNode key={index} ast={declarator} />)};</>;
}
