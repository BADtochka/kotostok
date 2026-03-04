import type { PropsWithChildren } from 'react';

type MenuProps = {};

export const Menu = ({ children }: PropsWithChildren<MenuProps>) => {
  return (
    <div className='*:rounded-none *:not-last:border-r *:border-zinc-700 *:px-4 rounded-2xl flex items-center overflow-hidden absolute bottom-4 left-1/2 -translate-x-1/2'>
      {children}
    </div>
  );
};
