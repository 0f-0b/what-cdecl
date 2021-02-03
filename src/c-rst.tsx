import * as React from "react";
import { Fragment, PropsWithChildren, ReactNode } from "react";
import { AbstractDeclarator, BasicType, basicTypes, Declaration, DeclarationSpecifier, Declarator, InitDeclarator, ParameterDeclaration, TypedefName, typedefs } from "./c-ast";
import { HlBasicType, HlKeyword, HlNumeric, HlOperator, HlType, HlVariable } from "./highlight";

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
  return <>{children}({params.map((param, index) => <Fragment key={index}>{index ? ", " : ""}<ParameterDeclarationNode ast={param} /></Fragment>)})</>;
}

function ParameterDeclarationNode({ ast }: { ast: ParameterDeclaration; }): JSX.Element {
  return <>{ast.specifiers.map((specifier, index, arr) => <Fragment key={index}><DeclarationSpecifierNode ast={specifier} />{index !== arr.length - 1 || ast.declarator.type.length || "name" in ast.declarator ? " " : ""}</Fragment>)}{<DeclaratorNode ast={ast.declarator} />}</>;
}

export function DeclarationNode({ ast }: { ast: Declaration; }): JSX.Element {
  return <>{ast.specifiers.map((specifier, index, arr) => <Fragment key={index}><DeclarationSpecifierNode ast={specifier} />{index !== arr.length - 1 || ast.declarators.length ? " " : ""}</Fragment>)}{ast.declarators.map((declarator, index): ReactNode => index ? <Fragment key={index}>, <InitDeclaratorNode ast={declarator} /></Fragment> : <InitDeclaratorNode key={index} ast={declarator} />)};</>;
}

export function DeclarationSpecifierNode({ ast }: { ast: DeclarationSpecifier; }): JSX.Element {
  if (basicTypes.includes(ast as BasicType))
    return <HlBasicType>{ast}</HlBasicType>;
  if (typedefs.includes(ast as TypedefName))
    return <HlType>{ast}</HlType>;
  return <HlKeyword>{ast}</HlKeyword>;
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

export function InitDeclaratorNode({ ast }: { ast: InitDeclarator; }): JSX.Element {
  return <DeclaratorNode ast={ast.declarator} />;
}
