import { cn } from "@/lib/utils";

export function FullScreenContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("vkui:w-full vkui:h-dvh vkui:bg-background", className)}
      {...props}
    />
  );
}
