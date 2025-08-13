import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  `vkui:inline-flex vkui:overflow-hidden vkui:bg-white vkui:min-h-[1px] vkui:h-full vkui:relative vkui:shrink-0 vkui:grow-0
  "vkui:after:absolute vkui:after:top-0 vkui:after:left-0 vkui:after:bottom-0 vkui:after:w-[var(--progress-width)]`,
  {
    variants: {
      size: {
        default: "vkui:w-10",
        xs: "vkui:w-2",
        sm: "vkui:w-5",
        lg: "vkui:w-15",
        xl: "vkui:w-20",
        half: "vkui:h-1/2 vkui:w-1/2",
      },
      color: {
        primary: "vkui:bg-primary/20 vkui:after:bg-primary",
        secondary: "vkui:bg-secondary/20 vkui:after:bg-secondary",
        destructive: "vkui:bg-destructive/20 vkui:after:bg-destructive",
        warning: "vkui:bg-warning/20 vkui:after:bg-warning",
        active: "vkui:bg-active/20 vkui:after:bg-active",
        inactive: "vkui:bg-inactive/20 vkui:after:bg-inactive",
        agent: "vkui:bg-agent/20 vkui:after:bg-agent",
        client: "vkui:bg-client/20 vkui:after:bg-client",
      },
    },
    defaultVariants: {
      size: "default",
      color: "primary",
    },
  },
);

export interface ProgressProps extends VariantProps<typeof progressVariants> {
  percent?: number;
  className?: string;
}

export const Progress = ({
  size,
  className,
  color,
  ...props
}: ProgressProps) => {
  return (
    <div
      className={cn(progressVariants({ size, color }), className)}
      {...props}
      style={
        {
          "--progress-width": `${props.percent}%`,
        } as React.CSSProperties
      }
    />
  );
};
