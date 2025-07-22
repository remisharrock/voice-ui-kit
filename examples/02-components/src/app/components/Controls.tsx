import {
  Button,
  Card,
  CardContent,
  LogoutIcon,
  UserAudioControl,
} from "@pipecat-ai/voice-ui-kit";

export const Controls = ({ onEndSession }: { onEndSession: () => void }) => {
  return (
    <div className="relative z-10 h-1/2 flex flex-col w-full items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="vkui:shadow-long bg-background">
        <CardContent className="flex flex-row gap-4 p-4">
          <UserAudioControl size="xl" variant="outline" />
          <div className="h-full w-px vkui:bg-border mx-2" />
          <Button onClick={onEndSession} size="xl" variant="outline" isIcon>
            <LogoutIcon className="text-destructive" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
