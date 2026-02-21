import { useEffect, useMemo } from "react";

type SelectProps = {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  value?: string;
  label?: string;
};

export const Select = ({
  options = [],
  value,
  onChange,
  label,
}: SelectProps) => {
  const defaultValue = useMemo(
    () => (!value ? options[0]?.value : value),
    [value, options],
  );

  useEffect(() => {
    if (!value) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  return (
    <div className="flex flex-col gap-2">
      {label && <label>{label}</label>}
      <select
        className="h-10 w-full flex items-center bg-zinc-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
