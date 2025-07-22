import { UserAudioControl } from "@/components/elements/UserAudioControl";
import { Card, CardContent } from "@/components/ui";
import { ConnectButton } from "@/index";
import { cn } from "@/lib/utils";

interface Props {
  onConnect?: () => void;
  onDisconnect?: () => void;
  size?: "xl" | "lg" | "default" | "sm";
  className?: string;
}

export const ControlBar = ({
  onConnect,
  onDisconnect,
  size = "xl",
  className,
}: Props) => {
  return (
    <Card className={cn("vkui:shadow-long vkui:bg-background", className)}>
      <CardContent className="vkui:flex vkui:flex-row vkui:gap-4 vkui:p-4">
        <UserAudioControl size={size} variant="outline" />
        <div className="vkui:w-px vkui:bg-border vkui:self-stretch vkui:mx-2" />
        <ConnectButton
          onConnect={() => {
            onConnect?.();
          }}
          onDisconnect={() => {
            onDisconnect?.();
          }}
          defaultVariant="outline"
          size={size}
        />
      </CardContent>
    </Card>
  );
};
