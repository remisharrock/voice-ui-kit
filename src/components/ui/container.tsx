import { cn } from "@/lib/utils";

export function FullScreenContainer({
  className,
  horizontal = false,
  ...props
}: React.ComponentProps<"div"> & { horizontal?: boolean }) {
  return (
    <div
      className={cn(
        "vkui:w-full vkui:h-dvh vkui:bg-background vkui:flex vkui:items-center vkui:justify-center vkui:flex-col",
        horizontal && "vkui:flex-row",
        className,
      )}
      {...props}
    />
  );
}
