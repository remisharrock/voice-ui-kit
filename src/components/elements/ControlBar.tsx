import { UserAudioControl } from "@/components/elements/UserAudioControl";
import { Button, Card, CardContent } from "@/components/ui";
import { LogoutIcon } from "@/icons";

interface Props {
  onEndSession?: () => void;
  size?: "xl" | "lg" | "default" | "sm";
}

export const ControlBar = ({ onEndSession, size = "xl" }: Props) => {
  return (
    <Card className="vkui:shadow-long vkui:bg-background">
      <CardContent className="vkui:flex vkui:flex-row vkui:gap-4 vkui:p-4">
        <UserAudioControl size={size} variant="outline" />
        <div className="vkui:w-px vkui:bg-border vkui:self-stretch vkui:mx-2" />
        <Button onClick={onEndSession} size={size} variant="outline" isIcon>
          <LogoutIcon className="vkui:text-destructive" />
        </Button>
      </CardContent>
    </Card>
  );
};
