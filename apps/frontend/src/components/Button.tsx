import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, ...props }: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className='bg-zinc-800 px-2 h-10 rounded-md cursor-pointer hover:bg-zinc-700 transition-colors'
      {...props}
    >
      {children}
    </button>
  );
};
