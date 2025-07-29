import { cn } from "@/lib/utils";

export const TextDashBlankslate = ({ className }: { className?: string }) => {
  return (
    <span className={cn("vkui:mono-upper vkui:text-subtle/60", className)}>
      ---
    </span>
  );
};
