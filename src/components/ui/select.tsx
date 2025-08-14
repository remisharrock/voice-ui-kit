import * as SelectPrimitive from "@radix-ui/react-select";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SelectChevronIcon,
} from "@/icons";
import { getPipecatUIContainer } from "@/lib/dom";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const selectTriggerVariants = cva(
  "vkui:truncate vkui:data-[placeholder]:text-muted-foreground vkui:font-mono vkui:text-xs vkui:[&_svg:not([class*='text-'])]:text-muted-foreground vkui:focus-visible:border-ring vkui:focus-visible:ring-ring/50 vkui:aria-invalid:ring-destructive/20 vkui:dark:aria-invalid:ring-destructive/40 vkui:aria-invalid:border-destructive vkui:dark:bg-input/30 vkui:dark:hover:bg-input/50 vkui:flex w-fit vkui:items-center vkui:justify-between vkui:border vkui:bg-transparent vkui:whitespace-nowrap vkui:transition-[color,box-shadow] vkui:outline-none vkui:focus-visible:ring-[3px] vkui:disabled:cursor-not-allowed vkui:disabled:opacity-50 vkui:*:data-[slot=select-value]:line-clamp-1 vkui:*:data-[slot=select-value]:flex vkui:*:data-[slot=select-value]:items-center vkui:*:data-[slot=select-value]:gap-2 vkui:[&_svg]:pointer-events-none vkui:[&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "vkui:text-primary-foreground vkui:bg-primary vkui:hover:bg-primary/90 vkui:dark:hover:bg-primary/90 vkui:border-transparent vkui:data-[placeholder]:text-primary-foreground vkui:dark:bg-primary vkui:[&_svg:not([class*='text-'])]:text-brder",
        outline: "vkui:text-foreground vkui:border-input vkui:hover:bg-accent",
        ghost: "vkui:text-foreground vkui:border-none vkui:hover:bg-accent",
      },
      size: {
        md: "vkui:button-md vkui:[&_svg]:size-3.5 vkui:[&_[data-slot^=select-guide]]:mr-2",
        sm: "vkui:button-sm vkui:[&_svg]:size-3.5 vkui:[&_[data-slot^=select-guide]]:mr-2",
        lg: "vkui:button-lg vkui:[&_svg]:size-4 vkui:[&_[data-slot^=select-guide]]:mr-3",
        xl: "vkui:button-xl vkui:[&_svg]:size-4 vkui:[&_[data-slot^=select-guide]]:mr-3",
      },
      rounded: {
        size: "",
        none: "vkui:rounded-none",
        sm: "vkui:rounded-sm",
        md: "vkui:rounded-md",
        lg: "vkui:rounded-lg",
        xl: "vkui:rounded-xl",
        full: "vkui:rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "outline",
      rounded: "size",
    },
  },
);

export type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;

export function Select({ ...props }: SelectProps) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

export type SelectGroupProps = React.ComponentProps<
  typeof SelectPrimitive.Group
>;

export function SelectGroup({ ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

export type SelectValueProps = React.ComponentProps<
  typeof SelectPrimitive.Value
>;

export function SelectValue({ ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

export interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {}

export function SelectTrigger({
  className,
  size = "md",
  variant,
  rounded = "size",
  children,
  ...props
}: SelectTriggerProps) {
  const roundedValue = rounded === "size" ? size : rounded;

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        selectTriggerVariants({
          size,
          variant,
          rounded: roundedValue,
          className,
        }),
      )}
      {...props}
    >
      <span className="vkui:truncate vkui:flex-1 vkui:min-w-0">{children}</span>
      <SelectPrimitive.Icon asChild>
        <SelectChevronIcon className="vkui:opacity-50 vkui:flex-none" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export type SelectGuideProps = React.HTMLAttributes<HTMLSpanElement>;

export function SelectGuide({ className, ...props }: SelectGuideProps) {
  return (
    <span
      data-slot="select-guide"
      className={cn("vkui:text-subtle vkui:font-sans", className)}
      {...props}
    />
  );
}

export type SelectContentProps = React.ComponentProps<
  typeof SelectPrimitive.Content
>;

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal container={getPipecatUIContainer()}>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "vkui:bg-popover vkui:text-popover-foreground vkui:data-[state=open]:animate-in vkui:data-[state=closed]:animate-out vkui:data-[state=closed]:fade-out-0 vkui:data-[state=open]:fade-in-0 vkui:data-[state=closed]:zoom-out-95 vkui:data-[state=open]:zoom-in-95 vkui:data-[side=bottom]:slide-in-from-top-2 vkui:data-[side=left]:slide-in-from-right-2 vkui:data-[side=right]:slide-in-from-left-2 vkui:data-[side=top]:slide-in-from-bottom-2 vkui:relative vkui:z-50 vkui:max-h-(--radix-select-content-available-height) vkui:min-w-[8rem] vkui:origin-(--radix-select-content-transform-origin) vkui:overflow-x-hidden vkui:overflow-y-auto vkui:rounded-md vkui:border vkui:shadow-md",
          position === "popper" &&
            "vkui:data-[side=bottom]:translate-y-1 vkui:data-[side=left]:-translate-x-1 vkui:data-[side=right]:translate-x-1 vkui:data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "vkui:p-1",
            position === "popper" &&
              "vkui:h-[var(--radix-select-trigger-height)] vkui:w-full vkui:min-w-[var(--radix-select-trigger-width)] vkui:scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "vkui:focus:bg-accent vkui:focus:text-accent-foreground vkui:[&_svg:not([class*='text-'])]:text-muted-foreground vkui:relative vkui:flex vkui:w-full vkui:cursor-default vkui:items-center vkui:gap-2 vkui:rounded-sm vkui:py-1.5 vkui:pr-8 vkui:pl-2 vkui:text-sm vkui:outline-hidden vkui:select-none vkui:data-[disabled]:pointer-events-none vkui:data-[disabled]:opacity-50 [&_svg]:pointer-events-none vkui:[&_svg]:shrink-0 vkui:[&_svg:not([class*='size-'])]:size-4 vkui:*:[span]:last:flex vkui:*:[span]:last:items-center vkui:*:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="vkui:absolute vkui:right-2 vkui:flex vkui:size-3.5 vkui:items-center vkui:justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export type SelectSeparatorProps = React.ComponentProps<
  typeof SelectPrimitive.Separator
>;

export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "vkui:bg-border vkui:pointer-events-none vkui:-mx-1 vkui:my-1 vkui:h-px",
        className,
      )}
      {...props}
    />
  );
}

export type SelectScrollUpButtonProps = React.ComponentProps<
  typeof SelectPrimitive.ScrollUpButton
>;

export function SelectScrollUpButton({
  className,
  ...props
}: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "vkui:flex vkui:cursor-default vkui:items-center vkui:justify-center vkui:py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

export type SelectScrollDownButtonProps = React.ComponentProps<
  typeof SelectPrimitive.ScrollDownButton
>;

export function SelectScrollDownButton({
  className,
  ...props
}: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "vkui:flex vkui:cursor-default vkui:items-center vkui:justify-center vkui:py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}
