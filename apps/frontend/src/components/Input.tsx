import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ ...props }: InputProps) => {
  return (
    <input
      className="bg-zinc-800 px-2 h-10 rounded-md outline-none border border-transparent focus:border-zinc-500"
      {...props}
    />
  );
};
