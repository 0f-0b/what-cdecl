/* @jsxImportSource react */

import { Fragment, type React } from "react";

import {
  type AbstractDeclarator,
  basicTypes,
  type Declaration,
  type DeclarationSpecifier,
  type Declarator,
  type InitDeclarator,
  type ParameterDeclaration,
  typedefs,
} from "../c_ast.ts";
import {
  HlBasicType,
  HlKeyword,
  HlNumeric,
  HlOperator,
  HlType,
  HlVariable,
} from "./highlight.tsx";

const Parentheses: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>({children})</>
);
const PointerNode: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    <HlOperator>*</HlOperator>
    {children}
  </>
);
const ArrayNode: React.FC<React.PropsWithChildren<{ size: number }>> = ({
  children,
  size,
}) => (
  <>
    {children}[<HlNumeric>{size}</HlNumeric>]
  </>
);
const FunctionNode: React.FC<
  React.PropsWithChildren<{ params: ParameterDeclaration[] }>
> = ({ children, params }) => {
  return (
    <>
      {children}({params.map((param, index) => (
        <Fragment key={index}>
          {index ? ", " : ""}
          <ParameterDeclarationNode ast={param} />
        </Fragment>
      ))})
    </>
  );
};
type NC<T> = React.FC<{ ast: T }>;
export const ParameterDeclarationNode: NC<ParameterDeclaration> = ({ ast }) => (
  <>
    {ast.specifiers.map((specifier, index, arr) => (
      <Fragment key={index}>
        <DeclarationSpecifierNode ast={specifier} />
        {index !== arr.length - 1 || ast.declarator.type.length ||
            "name" in ast.declarator
          ? " "
          : ""}
      </Fragment>
    ))}
    {<DeclaratorNode ast={ast.declarator} />}
  </>
);
export const DeclarationNode: NC<Declaration> = ({ ast }) => (
  <>
    {ast.specifiers.map((specifier, index, arr) => (
      <Fragment key={index}>
        <DeclarationSpecifierNode ast={specifier} />
        {index !== arr.length - 1 || ast.declarators.length ? " " : ""}
      </Fragment>
    ))}
    {ast.declarators.map((declarator, index) =>
      index === 0
        ? <InitDeclaratorNode key={index} ast={declarator} />
        : (
          <Fragment key={index}>
            , <InitDeclaratorNode ast={declarator} />
          </Fragment>
        )
    )};
  </>
);
export const DeclarationSpecifierNode: NC<DeclarationSpecifier> = ({ ast }) =>
  (basicTypes as readonly DeclarationSpecifier[]).includes(ast)
    ? <HlBasicType>{ast}</HlBasicType>
    : (typedefs as readonly DeclarationSpecifier[]).includes(ast)
    ? <HlType>{ast}</HlType>
    : <HlKeyword>{ast}</HlKeyword>;
export const InitDeclaratorNode: NC<InitDeclarator> = ({ ast }) => (
  <DeclaratorNode ast={ast.declarator} />
);
export const DeclaratorNode: NC<Declarator | AbstractDeclarator> = ({
  ast,
}) => {
  return ast.type.reduce((prev, layer, index, array) => {
    const wasPointer = index !== 0 && array[index - 1].type === "pointer";
    const isPointer = layer.type === "pointer";
    if (wasPointer && !isPointer) {
      prev = <Parentheses>{prev}</Parentheses>;
    }
    switch (layer.type) {
      case "pointer":
        return <PointerNode>{prev}</PointerNode>;
      case "array":
        return <ArrayNode size={layer.size}>{prev}</ArrayNode>;
      case "function":
        return <FunctionNode params={layer.params}>{prev}</FunctionNode>;
    }
  }, "name" in ast ? <HlVariable>{ast.name}</HlVariable> : null);
};
