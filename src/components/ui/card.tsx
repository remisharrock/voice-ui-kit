import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "vkui:text-card-foreground vkui:flex vkui:flex-col vkui:bg-card vkui:border-(length:--vkui-border-width-element) vkui:border-border",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "vkui:shadow-destructive/10 vkui:dark:shadow-destructive/15 vkui:border-destructive vkui:text-destructive-foreground vkui:bg-destructive/[.05] vkui:[--vkui-color-elbow:var(--vkui-color-destructive-foreground)]",
        success:
          "vkui:shadow-active/10 vkui:dark:shadow-active/15 vkui:border-active vkui:text-active-foreground vkui:bg-active/[.05] vkui:[--vkui-color-elbow:var(--vkui-color-active-foreground)]",
      },
      background: {
        none: "",
        scanlines: "vkui:bg-scanlines",
        grid: "vkui:bg-grid",
        stripes: "vkui:bg-stripes vkui:shrink-0",
      },
      size: {
        md: "vkui:py-element-md vkui:gap-element-md vkui:[&_*[data-slot^=card-]:not([data-slot^=card-title])]:px-element-md",
        sm: "vkui:py-element-sm vkui:gap-element-sm vkui:[&_*[data-slot^=card-]:not([data-slot^=card-title])]:px-element-md",
        lg: "vkui:py-element-lg vkui:gap-element-lg vkui:[&_*[data-slot^=card-]:not([data-slot^=card-title])]:px-element-lg",
        xl: "vkui:py-element-xl vkui:gap-element-xl vkui:[&_*[data-slot^=card-]:not([data-slot^=card-title])]:px-element-xl",
      },
      rounded: {
        none: "",
        sm: "vkui:rounded-sm",
        md: "vkui:rounded-md",
        lg: "vkui:rounded-lg",
        xl: "vkui:rounded-xl",
      },
      shadow: {
        none: "",
        xshort: "vkui:shadow-xshort",
        short: "vkui:shadow-short",
        long: "vkui:shadow-long",
        xlong: "vkui:shadow-xlong",
      },
      withElbows: {
        false: "",
        true: "vkui:elbow",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        withElbows: false,
        className: "vkui:[--vkui-elbow-size:var(--vkui-text-xs)]",
      },
      {
        size: "lg",
        withElbows: false,
        className: "vkui:[--vkui-elbow-size:var(--vkui-text-lg)]",
      },
      {
        size: "xl",
        withElbows: false,
        className: "vkui:[--vkui-elbow-size:var(--vkui-text-xl)]",
      },
      {
        size: "sm",
        background: "stripes",
        className:
          "vkui:[--vkui-stripe-border-size:calc(var(--vkui-text-base)/2)] vkui:[--vkui-stripe-inset:calc(var(--vkui-stripe-border-size)/2)]",
      },
      {
        variant: "destructive",
        background: "stripes",
        className: "vkui:[--vkui-stripe-color:var(--vkui-color-destructive)]",
      },
      {
        variant: "success",
        background: "stripes",
        className: "vkui:[--vkui-stripe-color:var(--vkui-color-active)]",
      },
      {
        rounded: ["sm", "md", "lg", "xl"],
        withElbows: true,
        className: "vkui:rounded-none",
      },
    ],

    defaultVariants: {
      size: "md",
      shadow: "none",
      variant: "default",
      background: "none",
      withElbows: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof cardVariants>, "rounded"> {
  withGradientBorder?: boolean;
  rounded?: VariantProps<typeof cardVariants>["rounded"];
}

export function Card({
  variant,
  className,
  withGradientBorder = false,
  withElbows = false,
  size = "md",
  rounded,
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
          withElbows,
        }),
        variant === "default" &&
          withGradientBorder &&
          "vkui:border vkui:border-transparent vkui:bg-origin-border vkui:borderclip vkui:bg-cardGradientBorder",
        className,
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn("vkui:flex vkui:gap-1.5", className)}
      {...props}
    />
  );
}

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      className={cn("vkui:font-semibold vkui:leading-none", className)}
      {...props}
    />
  );
}

export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("vkui:text-muted-foreground vkui:text-sm", className)}
      {...props}
    />
  );
}

export type CardActionProps = React.HTMLAttributes<HTMLDivElement>;

export function CardAction({ className, ...props }: CardActionProps) {
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

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  );
}

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
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
