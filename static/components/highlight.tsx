/* @jsxImportSource react */

import type { React } from "react";

export type HlProps = React.PropsWithChildren;
export const HlKeyword: React.FC<HlProps> = ({ children }) => (
  <span className="hl-keyword">{children}</span>
);
export const HlNumeric: React.FC<HlProps> = ({ children }) => (
  <span className="hl-numeric">{children}</span>
);
export const HlOperator: React.FC<HlProps> = ({ children }) => (
  <span className="hl-operator">{children}</span>
);
export const HlBasicType: React.FC<HlProps> = ({ children }) => (
  <span className="hl-basic-type">{children}</span>
);
export const HlType: React.FC<HlProps> = ({ children }) => (
  <span className="hl-type">{children}</span>
);
export const HlVariable: React.FC<HlProps> = ({ children }) => (
  <span className="hl-variable">{children}</span>
);
