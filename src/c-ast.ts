export const primitives: readonly (readonly TypeSpecifier[])[] = [
  ["char"],
  ["signed", "char"],
  ["short", "int"],
  ["int"],
  ["long", "int"],
  ["unsigned", "char"],
  ["unsigned", "short", "int"],
  ["unsigned", "int"],
  ["unsigned", "long", "int"],
  ["float"],
  ["double"],
  ["long", "double"]
] as const;
export const basicTypes = ["void", "char", "short", "int", "long", "float", "double", "signed", "unsigned"] as const;
export type BasicType = typeof basicTypes[number];
export const typedefs = [] as const;
export type TypedefName = typeof typedefs[number];
export type TypeSpecifier =
  | BasicType
  | TypedefName;
export type DeclarationSpecifier =
  | TypeSpecifier
  | "typedef";

export interface Declaration {
  specifiers: DeclarationSpecifier[];
  declarators: InitDeclarator[];
}

export interface Declarator {
  type: Layer[];
  name: string;
}

export interface InitDeclarator {
  declarator: Declarator;
}

export interface AbstractDeclarator {
  type: Layer[];
}

export interface PointerLayer {
  type: "pointer";
}

export interface ArrayLayer {
  type: "array";
  size: number;
}

export interface FunctionLayer {
  type: "function";
  params: ParameterDeclaration[];
}

export interface ParameterDeclaration {
  specifiers: DeclarationSpecifier[];
  declarator: Declarator | AbstractDeclarator;
}

export type Layer =
  | PointerLayer
  | ArrayLayer
  | FunctionLayer;
