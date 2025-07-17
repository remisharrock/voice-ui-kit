import { usePipecatClientTransportState } from "@pipecat-ai/client-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FullScreenContainer,
  HelperChildProps,
  InfoIcon,
} from "@pipecat-ai/voice-ui-kit";
import { useCallback, useMemo } from "react";

export const App = ({
  handleConnect,
  handleDisconnect,
  error,
}: HelperChildProps) => {
  const state = usePipecatClientTransportState();

  const buttonLabel = useMemo(() => {
    switch (state) {
      case "initializing":
      case "initialized":
        return "Initializing...";
      case "authenticating":
        return "Authenticating...";
      case "connecting":
      case "connected":
        return "Connecting...";
      case "ready":
        return "Disconnect";
      case "error":
        return "Error";
      case "disconnected":
      default:
        return "Try live chat";
    }
  }, [state]);

  const handleButtonClick = useCallback(() => {
    if (state === "disconnected") {
      handleConnect?.();
    } else {
      handleDisconnect?.();
    }
  }, [state, handleConnect, handleDisconnect]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="vkui:shadow-long min-w-md gap-0" destructive>
          <CardHeader className="vkui:font-semibold flex flex-row items-center">
            <InfoIcon size={24} />
            An Error Occurred
          </CardHeader>
          <CardContent>
            <p className="vkui:text-sm vkui:text-balanced">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FullScreenContainer>
      <div className="p-5">
        <div className="mx-auto max-w-xl bg-black 5 text-white p-12 rounded-2xl">
          {state}
          <Button
            onClick={handleButtonClick}
            size="lg"
            disabled={!["disconnected", "ready"].includes(state)}
            isLoading={!["disconnected", "ready"].includes(state)}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
