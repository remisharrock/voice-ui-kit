import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const cardVariants = cva(
  "vkui:text-card-foreground vkui:flex vkui:flex-col vkui:bg-card vkui:border vkui:border-border",
  {
    variants: {
      size: {
        default: "vkui:gap-2 vkui:p-2 vkui:rounded-element",
        sm: "vkui:gap-1 vkui:p-1 vkui:rounded-md",
        lg: "vkui:gap-3 vkui:p-3 vkui:rounded-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

// Size-based shadow mapping
const sizeToShadow = {
  sm: "vkui:shadow-xshort",
  default: "vkui:shadow-short",
  lg: "vkui:shadow-long",
} as const;

export interface CardProps extends React.ComponentProps<"div"> {
  destructive?: boolean;
  noGradientBorder?: boolean;
  noShadow?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}

function Card({
  className,
  noGradientBorder = false,
  noShadow = false,
  size = "default",
  destructive = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ size }),
        !noShadow && sizeToShadow[size],
        !noShadow &&
          destructive &&
          "vkui:shadow-destructive/10 vkui:dark:shadow-destructive/15",
        !destructive &&
          !noGradientBorder &&
          "vkui:border vkui:border-transparent vkui:bg-origin-border vkui:borderclip vkui:bg-cardGradientBorder",
        destructive && "vkui:text-destructive vkui:border-destructive",
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
        "vkui:flex vkui:gap-2 vkui:md:gap-3 vkui:p-2 vkui:md:p-3",
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
      className={cn("vkui:leading-none vkui:font-semibold", className)}
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
    <div
      data-slot="card-content"
      className={cn("vkui:gap-2 vkui:md:gap-3 vkui:p-2 vkui:md:p-3", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "vkui:flex vkui:gap-2 vkui:md:gap-3 vkui:p-2 vkui:md:p-3",
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
