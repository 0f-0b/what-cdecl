/* @jsxImportSource react */

import { type React, useEffect, useRef } from "react";

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
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = ref.current;
    if (input && !(input.validity.valid && input.valueAsNumber === value)) {
      input.valueAsNumber = value;
    }
  }, [value]);
  return (
    <input
      type="number"
      inputMode="numeric"
      defaultValue={value}
      min={min}
      max={max}
      required
      onChange={(event) => {
        const input = event.target;
        if (input.validity.valid && input.valueAsNumber !== value) {
          onChange(input.valueAsNumber);
        }
      }}
      ref={ref}
      {...props}
    />
  );
};
