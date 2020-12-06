import * as React from "react";

export interface IntegerInputProps extends Omit<React.ComponentPropsWithoutRef<"input">, "onChange"> {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function IntegerInput({ value, min, max, onChange, ...props }: IntegerInputProps): JSX.Element {
  return <input type="number" value={value} min={min} max={max} onChange={event => {
    const value = event.target.valueAsNumber;
    if (Number.isInteger(value) && (min === undefined || value >= min) && (max === undefined || value <= max))
      onChange(value);
  }} {...props} />;
}
