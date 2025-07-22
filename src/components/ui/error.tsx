import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InfoIcon } from "@/icons";
import { cn } from "@/lib/utils";

export const ErrorCard = ({
  title = "An Error Occurred",
  error,
  className,
}: {
  title?: string;
  error: string;
  className?: string;
}) => {
  return (
    <Card
      className={cn("vkui:shadow-long vkui:min-w-md vkui:gap-0", className)}
      destructive
    >
      <CardHeader className="vkui:font-semibold vkui:flex vkui:flex-row vkui:items-center">
        <InfoIcon size={24} />
        {title}
      </CardHeader>
      <CardContent>
        <p className="vkui:text-sm vkui:text-balanced">{error}</p>
      </CardContent>
    </Card>
  );
};
