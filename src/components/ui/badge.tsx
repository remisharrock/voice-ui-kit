import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "vkui:shrink-0 vkui:[&_svg]:shrink-0 vkui:self-start vkui:items-center vkui:border vkui:text-xs vkui:font-semibold vkui:rounded-element vkui:justify-center",
  {
    variants: {
      color: {
        default: "vkui:bg-primary/10 vkui:text-primary vkui:border-primary",
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
        elbow: "vkui:elbow vkui:border-0 vkui:rounded-none",
        bracket: "vkui:elbow vkui:border-0 vkui:rounded-none",
      },
      size: {
        default:
          "vkui:text-xs vkui:px-3 vkui:gap-1.5 vkui:py-1 vkui:[&_svg:not([class*='size-'])]:size-3.5",
        sm: "vkui:text-xs vkui:px-2 vkui:gap-1 vkui:py-0.5 vkui:[&_svg:not([class*='size-'])]:size-2.5",
        lg: "vkui:text-sm vkui:px-4 vkui:gap-2.5 vkui:py-2 vkui:[&_svg:not([class*='size-'])]:size-4",
      },
      noUppercase: {
        true: "vkui:uppercase-none",
        false: "vkui:uppercase vkui:tracking-wider",
      },
      buttonSizing: {
        true: "vkui:flex",
        false: "vkui:inline-flex",
      },
    },
    compoundVariants: [
      {
        noUppercase: false,
        size: "default",
        className: "vkui:text-[11px]",
      },
      {
        noUppercase: false,
        size: "sm",
        className: "vkui:text-[10px]",
      },
      {
        noUppercase: false,
        size: "lg",
        className: "vkui:text-xs",
      },
      /* Elbow/Bracket composites */
      {
        variant: "elbow",
        size: "default",
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
      {
        variant: ["elbow", "bracket"],
        color: "default",
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
      /* Button Sizing */
      {
        buttonSizing: true,
        size: "default",
        className:
          "vkui:h-8 vkui:px-4 vkui:py-2 vkui:has-[>svg]:px-3 vkui:[&_svg:not([class*='size-'])]:size-5",
      },
      {
        buttonSizing: true,
        size: "sm",
        className:
          "vkui:h-7 vkui:gap-1.5 vkui:px-3 vkui:has-[>svg]:px-2.5 vkui:[&_svg:not([class*='size-'])]:size-4",
      },
      {
        buttonSizing: true,
        size: "lg",
        className:
          "vkui:h-10 vkui:px-6 vkui:has-[>svg]:px-4 vkui:[&_svg:not([class*='size-'])]:size-5",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const Badge = ({
  buttonSizing = false,
  children,
  className,
  color,
  noUppercase = true,
  size,
  variant,
  ...props
}: VariantProps<typeof badgeVariants> &
  React.ComponentProps<"div"> & {
    buttonSizing?: boolean;
  }) => {
  return (
    <div
      className={cn(
        badgeVariants({
          variant,
          size,
          noUppercase,
          color,
          buttonSizing,
          ...props,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
