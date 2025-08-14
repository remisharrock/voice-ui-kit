import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonGroupVariants = cva("vkui:flex vkui:items-center", {
  variants: {
    orientation: {
      horizontal:
        "vkui:flex-row vkui:*:not-first:not-last:rounded-none vkui:*:first:rounded-e-none vkui:*:last:rounded-s-none vkui:*:not-first:not-last:border-x-0",
      vertical:
        "vkui:flex-col vkui:*:not-first:not-last:rounded-none vkui:*:first:rounded-b-none vkui:*:last:rounded-t-none vkui:*:not-first:not-last:border-y-0 vkui:*:self-stretch",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const ButtonGroup = ({
  className,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div
      className={cn(
        "vkui:flex",
        buttonGroupVariants({ orientation }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
