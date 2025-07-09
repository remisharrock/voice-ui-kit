import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "vkui:file:text-foreground vkui:placeholder:text-muted-foreground vkui:selection:bg-primary vkui:selection:text-primary-foreground vkui:dark:bg-input/30 vkui:border-input vkui:flex vkui:w-full vkui:min-w-0 vkui:rounded-md vkui:border vkui:bg-transparent vkui:px-3 vkui:text-foreground vkui:transition-[color,box-shadow] vkui:outline-none vkui:file:inline-flex vkui:file:border-0 vkui:file:bg-transparent vkui:file:text-sm vkui:file:font-medium vkui:disabled:pointer-events-none vkui:disabled:cursor-not-allowed vkui:disabled:opacity-50 vkui:md:text-sm vkui:focus-visible:border-ring vkui:focus-visible:ring-ring/50 vkui:focus-visible:ring-[3px] vkui:aria-invalid:ring-destructive/20 vkui:dark:aria-invalid:ring-destructive/40 vkui:aria-invalid:border-destructive",
  {
    variants: {
      size: {
        sm: "vkui:h-7 vkui:px-2.5 vkui:py-1 vkui:text-sm",
        default: "vkui:h-8 vkui:px-3 vkui:py-1",
        lg: "vkui:h-10 vkui:px-3 vkui:py-2 vkui:rounded-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  );
}

export default Input;
