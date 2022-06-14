import React from "../deps/react.ts";
import type {
  AbstractDeclarator,
  Declaration,
  DeclarationSpecifier,
  Declarator,
  InitDeclarator,
  ParameterDeclaration,
} from "../c_ast.ts";
import { basicTypes, typedefs } from "../c_ast.ts";
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
        <React.Fragment key={index}>
          {index ? ", " : ""}
          <ParameterDeclarationNode ast={param} />
        </React.Fragment>
      ))})
    </>
  );
};

type NC<T> = React.FC<{ ast: T }>;
export const ParameterDeclarationNode: NC<ParameterDeclaration> = ({ ast }) => (
  <>
    {ast.specifiers.map((specifier, index, arr) => (
      <React.Fragment key={index}>
        <DeclarationSpecifierNode ast={specifier} />
        {index !== arr.length - 1 || ast.declarator.type.length ||
            "name" in ast.declarator
          ? " "
          : ""}
      </React.Fragment>
    ))}
    {<DeclaratorNode ast={ast.declarator} />}
  </>
);
export const DeclarationNode: NC<Declaration> = ({ ast }) => (
  <>
    {ast.specifiers.map((specifier, index, arr) => (
      <React.Fragment key={index}>
        <DeclarationSpecifierNode ast={specifier} />
        {index !== arr.length - 1 || ast.declarators.length ? " " : ""}
      </React.Fragment>
    ))}
    {ast.declarators.map((declarator, index) =>
      index
        ? (
          <React.Fragment key={index}>
            , <InitDeclaratorNode ast={declarator} />
          </React.Fragment>
        )
        : <InitDeclaratorNode key={index} ast={declarator} />
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
  let result = "name" in ast ? <HlVariable>{ast.name}</HlVariable> : null;
  let wasPointer = false;
  for (const layer of ast.type) {
    if (layer.type === "pointer") {
      wasPointer = true;
    } else {
      if (wasPointer) {
        result = <Parentheses>{result}</Parentheses>;
      }
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
  return result;
};
