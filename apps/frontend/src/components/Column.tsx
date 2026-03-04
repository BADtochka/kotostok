import { cn } from 'badlib';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type PropsWithChildren } from 'react';

interface ColumnProps extends HTMLMotionProps<'div'> {
  available?: boolean;
}

export const Column = forwardRef<HTMLDivElement, PropsWithChildren<ColumnProps>>(
  ({ children, available, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'flex flex-col-reverse gap-2 min-w-16 h-full outline-2 outline-transparent hover:outline-violet-500 cursor-pointer transition-all',
          {
            'cursor-not-allowed hover:outline-transparent': !available,
          },
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
