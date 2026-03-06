import { cn } from 'badlib';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, className, onClick, disabled, ...props }: PropsWithChildren<ButtonProps>) => {
  const _onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick || disabled) return;
    onClick(e);
  };

  return (
    <button
      className={cn(
        'bg-zinc-800 px-2 h-10 rounded-md cursor-pointer hover:bg-zinc-700 transition-colors disabled:cursor-not-allowed ',
        className,
      )}
      onClick={_onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
