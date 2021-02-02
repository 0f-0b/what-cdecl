export const primitives = [
  "char",
  "signed char", "short int", "int", "long int",
  "unsigned char", "unsigned short int", "unsigned int", "unsigned long int",
  "float", "double", "long double"
] as const;
export type Primitive = typeof primitives[number];
export type Specifier =
  | Primitive
  | "typedef";

export interface Declaration {
  specifiers: Specifier[];
  declarators: Declarator[];
}

export interface Declarator {
  type: Layer[];
  name: string;
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
  specifiers: Specifier[];
  declarator: Declarator | AbstractDeclarator;
}

export type Layer =
  | PointerLayer
  | ArrayLayer
  | FunctionLayer;
