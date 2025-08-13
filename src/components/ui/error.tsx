import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon } from "@/icons";
import { cn } from "@/lib/utils";

export const ErrorCard = ({
  title = "An Error Occurred",
  noHeader = false,
  classNames,
  icon = <InfoIcon size={24} />,
  children,
  ...cardProps
}: {
  title?: string;
  noHeader?: boolean;
  classNames?: {
    header?: string;
    title?: string;
    content?: string;
  };
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & CardProps) => {
  return (
    <Card
      className={cn("vkui:min-w-md", cardProps.className)}
      variant="destructive"
      {...cardProps}
    >
      {!noHeader && (
        <CardHeader className={classNames?.header}>
          <CardTitle
            className={cn(
              "vkui:font-semibold vkui:flex vkui:flex-row vkui:items-center vkui:gap-2",
              classNames?.title,
            )}
          >
            {icon} {title}
          </CardTitle>
        </CardHeader>
      )}
      {children && (
        <CardContent className={cn("vkui:text-balanced", classNames?.content)}>
          {children}
        </CardContent>
      )}
    </Card>
  );
};
