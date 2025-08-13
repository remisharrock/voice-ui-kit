import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "vkui:shrink-0 vkui:[&_svg]:shrink-0 vkui:self-start vkui:items-center vkui:border vkui:text-xs vkui:font-semibold vkui:justify-center",
  {
    variants: {
      color: {
        primary: "vkui:bg-primary/10 vkui:text-primary vkui:border-primary",
        secondary:
          "vkui:bg-secondary vkui:text-secondary-foreground/80 vkui:border-border",
        destructive:
          "vkui:bg-destructive/10 vkui:text-destructive vkui:border-destructive",
        active: "vkui:bg-active/10 vkui:text-active vkui:border-active",
        inactive: "vkui:bg-inactive/10 vkui:text-inactive vkui:border-inactive",
        warning: "vkui:bg-warning/10 vkui:text-warning vkui:border-warning",
        agent: "vkui:bg-agent/10 vkui:text-agent vkui:border-agent",
        client: "vkui:bg-client/10 vkui:text-client vkui:border-client",
      },
      variant: {
        default: "",
        outline: "vkui:bg-transparent",
        filled: "",
        elbow: "vkui:elbow vkui:border-transparent",
        bracket: "vkui:elbow vkui:border-transparent",
      },
      size: {
        sm: "vkui:text-xs vkui:px-2 vkui:gap-1 vkui:py-0.5 vkui:[&_svg:not([class*='size-'])]:size-2.5",
        md: "vkui:text-xs vkui:px-3 vkui:gap-1.5 vkui:py-1 vkui:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "vkui:text-sm vkui:px-4 vkui:gap-2.5 vkui:py-2 vkui:[&_svg:not([class*='size-'])]:size-4",
      },
      uppercase: {
        false: "",
        true: "vkui:uppercase vkui:tracking-wider",
      },
      buttonSizing: {
        true: "vkui:flex",
        false: "vkui:inline-flex",
      },
      rounded: {
        size: "",
        none: "vkui:rounded-none",
        sm: "vkui:rounded-sm",
        md: "vkui:rounded-md",
        lg: "vkui:rounded-lg",
        full: "vkui:rounded-full",
      },
    },
    compoundVariants: [
      // Text size adjustments for uppercase variants
      {
        uppercase: true,
        size: "md",
        className: "vkui:text-[11px]",
      },
      {
        uppercase: true,
        size: "sm",
        className: "vkui:text-[10px]",
      },
      {
        uppercase: true,
        size: "lg",
        className: "vkui:text-xs",
      },
      // Filled variant styles
      {
        variant: "filled",
        color: "primary",
        className:
          "vkui:bg-primary/100 vkui:text-primary-foreground vkui:border-primary",
      },
      {
        variant: "filled",
        color: "secondary",
        className:
          "vkui:bg-secondary/100 vkui:text-secondary-foreground vkui:border-secondary",
      },
      {
        variant: "filled",
        color: "destructive",
        className:
          "vkui:bg-destructive/100 vkui:text-destructive-foreground vkui:border-destructive",
      },
      {
        variant: "filled",
        color: "warning",
        className:
          "vkui:bg-warning/100 vkui:text-warning-foreground vkui:border-warning",
      },
      {
        variant: "filled",
        color: "active",
        className:
          "vkui:bg-active/100 vkui:text-active-foreground vkui:border-active",
      },
      {
        variant: "filled",
        color: "inactive",
        className:
          "vkui:bg-inactive/100 vkui:text-inactive-foreground vkui:border-inactive",
      },
      {
        variant: "filled",
        color: "agent",
        className:
          "vkui:bg-agent/100 vkui:text-agent-foreground vkui:border-agent",
      },
      {
        variant: "filled",
        color: "client",
        className:
          "vkui:bg-client/100 vkui:text-client-foreground vkui:border-client",
      },
      // Elbow/Bracket size variants
      {
        variant: "elbow",
        size: "md",
        className: "vkui:[--vkui-elbow-size:6px]",
      },
      {
        variant: "elbow",
        size: "sm",
        className: "vkui:[--vkui-elbow-size:4px]",
      },
      {
        variant: "elbow",
        size: "lg",
        className: "vkui:[--vkui-elbow-size:8px]",
      },
      {
        variant: "bracket",
        size: "sm",
        className: "vkui:[--vkui-elbow-size:12px]",
      },
      {
        variant: "bracket",
        size: "lg",
        className: "vkui:[--vkui-elbow-size:20px]",
      },
      // Elbow/Bracket color variants
      {
        variant: ["elbow", "bracket"],
        color: "primary",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-primary)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "secondary",
        className:
          "vkui:[--vkui-color-elbow:var(--vkui-color-secondary-foreground)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "destructive",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-destructive)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "active",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-active)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "inactive",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-inactive)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "warning",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-warning)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "agent",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-agent)]",
      },
      {
        variant: ["elbow", "bracket"],
        color: "client",
        className: "vkui:[--vkui-color-elbow:var(--vkui-color-client)]",
      },
      {
        variant: ["elbow", "bracket"],
        className: "vkui:rounded-none",
      },
      // Button sizing variants
      {
        buttonSizing: true,
        size: "md",
        className:
          "vkui:button-md/md vkui:[&_svg:not([class*='size-'])]:size-5",
      },
      {
        buttonSizing: true,
        size: "sm",
        className:
          "vkui:button-sm/sm vkui:[&_svg:not([class*='size-'])]:size-4",
      },
      {
        buttonSizing: true,
        size: "lg",
        className:
          "vkui:button-lg/lg vkui:[&_svg:not([class*='size-'])]:size-5",
      },
      // Rounded size variants
      {
        rounded: "size",
        size: "md",
        className: "vkui:rounded-md",
      },
      {
        rounded: "size",
        size: "sm",
        className: "vkui:rounded-sm",
      },
      {
        rounded: "size",
        size: "lg",
        className: "vkui:rounded-lg",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "size",
      color: "primary",
    },
  },
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    Omit<VariantProps<typeof badgeVariants>, "color" | "uppercase"> {
  buttonSizing?: boolean;
  asChild?: boolean;
  color?: VariantProps<typeof badgeVariants>["color"];
  uppercase?: VariantProps<typeof badgeVariants>["uppercase"];
}

export function Badge({
  buttonSizing = false,
  children,
  className,
  color,
  uppercase = false,
  rounded,
  size,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? "span" : "div";

  return (
    <Comp
      className={cn(
        badgeVariants({
          variant,
          size,
          uppercase,
          color,
          buttonSizing,
          rounded,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
