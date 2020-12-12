export const primitives = [
  "char",
  "signed char", "short int", "int", "long int",
  "unsigned signed char", "unsigned short int", "unsigned int", "unsigned long int",
  "float", "double", "long double"
] as const;

export type Primitive = typeof primitives[number];
