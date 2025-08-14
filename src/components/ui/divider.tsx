import { PlusIcon } from "@/icons";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const dividerVariants = cva("vkui:relative vkui:items-center", {
  variants: {
    orientation: {
      horizontal: "vkui:h-px vkui:w-full",
      vertical: "vkui:w-px vkui:h-full",
    },
    color: {
      primary: "vkui:bg-primary",
      secondary: "vkui:bg-border",
      destructive: "vkui:bg-destructive",
      active: "vkui:bg-active",
      inactive: "vkui:bg-inactive",
      warning: "vkui:bg-warning",
    },
    thickness: {
      thin: "vkui:h-[1px]",
      medium: "vkui:h-[2px]",
      thick: "vkui:h-[3px]",
    },
    variant: {
      solid: "",
      dotted:
        "vkui:bg-transparent vkui:bg-[repeating-linear-gradient(to_right,currentColor,currentColor_2px,transparent_2px,transparent_6px)] vkui:bg-[length:6px_100%]",
      dashed:
        "vkui:bg-transparent vkui:bg-[repeating-linear-gradient(to_right,currentColor,currentColor_20px,transparent_20px,transparent_40px)] vkui:bg-[length:40px_100%]",
    },
    size: {
      none: "vkui:my-0 vkui:mx-0",
      sm: "vkui:my-2 vkui:mx-2",
      md: "vkui:my-4 vkui:mx-4",
      lg: "vkui:my-8 vkui:mx-8",
      xl: "vkui:my-10 vkui:mx-10",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    thickness: "thin",
    variant: "solid",
    color: "secondary",
    size: "none",
  },
  compoundVariants: [
    {
      orientation: "vertical",
      thickness: "thin",
      className: "vkui:h-full vkui:w-[1px]",
    },
    {
      orientation: "vertical",
      thickness: "medium",
      className: "vkui:h-full vkui:w-[2px]",
    },
    {
      orientation: "vertical",
      thickness: "thick",
      className: "vkui:h-full vkui:w-[3px]",
    },
    {
      orientation: "vertical",
      variant: "dashed",
      className:
        "vkui:bg-[repeating-linear-gradient(to_bottom,currentColor,currentColor_20px,transparent_20px,transparent_40px)] vkui:bg-[length:100%_40px]",
    },
    {
      orientation: "vertical",
      variant: "dotted",
      className:
        "vkui:bg-[repeating-linear-gradient(to_bottom,currentColor,currentColor_2px,transparent_2px,transparent_6px)] vkui:bg-[length:6px_100%]",
    },
    {
      variant: ["dotted", "dashed"],
      color: "primary",
      className: "vkui:text-primary",
    },
    {
      variant: ["dotted", "dashed"],
      color: "secondary",
      className: "vkui:text-border",
    },
    {
      variant: ["dotted", "dashed"],
      color: "destructive",
      className: "vkui:text-destructive",
    },
    {
      variant: ["dotted", "dashed"],
      color: "active",
      className: "vkui:text-active",
    },
    {
      variant: ["dotted", "dashed"],
      color: "inactive",
      className: "vkui:text-inactive",
    },
    {
      variant: ["dotted", "dashed"],
      color: "warning",
      className: "vkui:text-warning",
    },
    // Size variants
    {
      size: ["sm", "md", "lg", "xl"],
      orientation: "horizontal",
      className: "vkui:mx-0",
    },
    {
      size: ["sm", "md", "lg", "xl"],
      orientation: "vertical",
      className: "vkui:my-0",
    },
  ],
});

const dividerChildrenVariants = cva("", {
  variants: {
    color: {
      primary: "vkui:text-foreground",
      secondary: "vkui:text-foreground",
      destructive: "vkui:text-destructive",
      active: "vkui:text-active",
      inactive: "vkui:text-inactive",
      warning: "vkui:text-warning",
    },
  },
});

const dividerDecorationVariants = cva("vkui:flex", {
  variants: {
    decoration: {
      plus: "vkui:text-foreground",
    },
    thickness: {
      thin: "vkui:[&_svg]:size-2.5 vkui:gap-1.5",
      medium: "vkui:[&_svg]:size-3 vkui:gap-2",
      thick: "vkui:[&_svg]:size-3.5 vkui:gap-2.5",
    },
    orientation: {
      horizontal:
        "vkui:flex vkui:flex-row vkui:items-center vkui:justify-center vkui:w-full",
      vertical:
        "vkui:flex vkui:flex-col vkui:items-center vkui:justify-center vkui:h-full",
    },
    color: {
      primary: "vkui:text-primary",
      secondary: "vkui:text-border",
      destructive: "vkui:text-destructive vkui:[&_svg]:text-destructive",
      active: "vkui:text-active vkui:[&_svg]:text-active",
      inactive: "vkui:text-inactive vkui:[&_svg]:text-inactive",
      warning: "vkui:text-warning vkui:[&_svg]:text-warning",
    },
  },
});

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof dividerVariants>,
    VariantProps<typeof dividerChildrenVariants> {
  childrenClassName?: string;
  color?: VariantProps<typeof dividerVariants>["color"];
  decoration?: "none" | "plus";
}

export function Divider({
  children,
  color = "secondary",
  decoration = "none",
  thickness = "thin",
  orientation = "horizontal",
  variant = "solid",
  size = "none",
  className,
  childrenClassName,
  ...props
}: DividerProps) {
  const innerContent = children ? (
    <div
      className={cn(
        orientation === "horizontal" &&
          "vkui:flex vkui:flex-row vkui:items-center vkui:justify-center vkui:gap-4 vkui:w-full",
        orientation === "vertical" &&
          "vkui:flex vkui:flex-col vkui:items-center vkui:justify-center vkui:gap-4 vkui:h-full",
        className,
      )}
    >
      <span
        className={cn(
          dividerVariants({
            color,
            thickness,
            variant,
            size,
            orientation,
          }),
        )}
        {...props}
      />
      <span
        className={cn(dividerChildrenVariants({ color }), childrenClassName)}
      >
        {children}
      </span>
      <span
        className={cn(
          dividerVariants({
            color,
            thickness,
            variant,
            size,
            orientation,
          }),
        )}
        {...props}
      />
    </div>
  ) : (
    <div
      className={cn(
        dividerVariants({
          color,
          thickness,
          orientation,
          variant,
          size,
        }),
        className,
      )}
      {...props}
    />
  );

  if (decoration === "none") {
    return innerContent;
  }

  return (
    <div
      className={dividerDecorationVariants({
        color,
        decoration,
        thickness,
        orientation,
      })}
    >
      <span>
        <PlusIcon
          strokeLinecap="square"
          strokeWidth={
            thickness === "thin" ? 2 : thickness === "medium" ? 3.5 : 4.5
          }
        />
      </span>
      {innerContent}
      <span>
        <PlusIcon
          strokeLinecap="square"
          strokeWidth={
            thickness === "thin" ? 2 : thickness === "medium" ? 3.5 : 4.5
          }
        />
      </span>
    </div>
  );
}
