import { cn } from "@/lib/utils";

export function LayoutSection({
  key,
  className,
  ...props
}: React.ComponentProps<"section"> & { key: string }) {
  return <section data-section={key} className={cn(className)} {...props} />;
}

export default LayoutSection;
