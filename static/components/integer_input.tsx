import React from "../deps/react.ts";

export interface IntegerInputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "onChange"> {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => unknown;
}

export const IntegerInput: React.FC<IntegerInputProps> = ({
  value,
  min = -Infinity,
  max = Infinity,
  onChange,
  ...props
}) => (
  <input
    type="number"
    value={value}
    min={min}
    max={max}
    onChange={(event) => {
      const value = event.target.valueAsNumber;
      if (Number.isInteger(value) && value >= min && value <= max) {
        onChange(value);
      }
    }}
    {...props}
  />
);
