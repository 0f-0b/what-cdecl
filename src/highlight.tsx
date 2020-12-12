import * as React from "react";
import { PropsWithChildren } from "react";

export function HlKeyword({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <span className="hl-keyword">{children}</span>;
}

export function HlNumeric({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <span className="hl-numeric">{children}</span>;
}

export function HlOperator({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <span className="hl-operator">{children}</span>;
}

export function HlType({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <span className="hl-type">{children}</span>;
}

export function HlVariable({ children }: PropsWithChildren<unknown>): JSX.Element {
  return <span className="hl-variable">{children}</span>;
}
