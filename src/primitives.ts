export const primitives = [
  "char",
  "short",
  "int",
  "long",
  "signed char",
  "unsigned char",
  "unsigned short",
  "unsigned",
  "unsigned long",
  "float",
  "double",
  "long double"
] as const;

export type Primitive = typeof primitives[number];
