import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const cardVariants = cva(
  "vkui:text-card-foreground vkui:flex vkui:flex-col vkui:bg-card vkui:border-(length:--vkui-border-width-element) vkui:border-border",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "vkui:shadow-destructive/10 vkui:dark:shadow-destructive/15 vkui:border-destructive vkui:text-destructive-foreground vkui:bg-destructive/[.05] vkui:[--vkui-color-elbow:var(--vkui-color-destructive-foreground)]",
      },
      background: {
        none: "",
        scanlines: "vkui:bg-scanlines",
        grid: "vkui:bg-grid",
      },
      size: {
        md: "vkui:py-[calc(var(--vkui-spacing-element-md)*var(--vkui-spacing-element-offset-mul))] vkui:gap-[calc(var(--vkui-spacing-element-md)*var(--vkui-spacing-element-offset-mul))] vkui:[&>[data-slot^=card-]]:px-element-md",
        sm: "vkui:py-[calc(var(--vkui-spacing-element-sm)*var(--vkui-spacing-element-offset-mul))] vkui:gap-[calc(var(--vkui-spacing-element-sm)*var(--vkui-spacing-element-offset-mul))] vkui:[&>[data-slot^=card-]]:px-element-sm",
        lg: "vkui:py-[calc(var(--vkui-spacing-element-lg)*var(--vkui-spacing-element-offset-mul))] vkui:gap-[calc(var(--vkui-spacing-element-xl)*var(--vkui-spacing-element-offset-mul))] vkui:[&>[data-slot^=card-]]:px-element-lg",
        xl: "vkui:py-[calc(var(--vkui-spacing-element-xl)*var(--vkui-spacing-element-offset-mul))] vkui:gap-[calc(var(--vkui-spacing-element-xl)*var(--vkui-spacing-element-offset-mul))] vkui:[&>[data-slot^=card-]]:px-element-xl",
      },
      rounded: {
        none: "",
        sm: "vkui:rounded-element-sm",
        md: "vkui:rounded-element-md",
        lg: "vkui:rounded-element-lg",
        xl: "vkui:rounded-element-xl",
      },
      shadow: {
        none: "",
        xshort: "vkui:shadow-xshort",
        short: "vkui:shadow-short",
        long: "vkui:shadow-long",
        xlong: "vkui:shadow-xlong",
      },
    },
    defaultVariants: {
      size: "md",
      shadow: "none",
      variant: "default",
      background: "none",
    },
  },
);

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "destructive";
  noGradientBorder?: boolean;
  noElbow?: boolean;
  className?: string;
  background?: "none" | "scanlines" | "grid";
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "xshort" | "short" | "long" | "xlong";
}

function Card({
  variant,
  className,
  noGradientBorder = true,
  noElbow = true,
  size = "md",
  rounded = "none",
  shadow = "none",
  background = "none",
  ...props
}: CardProps) {
  const roundedValue = rounded ?? size;

  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({
          variant,
          size,
          shadow,
          background,
          rounded: roundedValue,
        }),
        variant === "default" &&
          !noGradientBorder &&
          "vkui:border vkui:border-transparent vkui:bg-origin-border vkui:borderclip vkui:bg-cardGradientBorder",
        !noElbow && "vkui:elbow",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "vkui:flex vkui:gap-1.5 vkui:px-[var(--card-padding)]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("vkui:font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("vkui:text-muted-foreground vkui:text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "vkui:col-start-2 vkui:row-span-2 vkui:row-start-1 vkui:self-start vkui:justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "vkui:flex vkui:gap-card vkui:px-[calc(var(--card-padding)/2)] vkui:py-[calc(var(--card-padding)/2)]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
