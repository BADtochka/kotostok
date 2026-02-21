import { cn } from "badlib";
import type { HTMLAttributes, PropsWithChildren } from "react";

interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  available?: boolean;
}

export const Column = ({
  children,
  available,
  ...props
}: PropsWithChildren<ColumnProps>) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 min-w-16 h-full outline-2 outline-transparent hover:outline-violet-500 cursor-pointer transition-all",
        {
          "cursor-not-allowed hover:outline-transparent": !available,
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
};
