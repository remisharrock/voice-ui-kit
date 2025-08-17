import { usePipecatClientTransportState } from "@pipecat-ai/client-react";
import {
  Button,
  Divider,
  FullScreenContainer,
  HighlightOverlay,
  useTheme,
  type PipecatBaseChildProps,
} from "@pipecat-ai/voice-ui-kit";
import { useState } from "react";
import { Controls } from "./Controls";
import { EventStreamPanel } from "./EventStreamPanel";

export function App({
  handleConnect,
  handleDisconnect,
}: Partial<PipecatBaseChildProps>) {
  const [highlightedElement, setHighlightedElement] = useState<string | null>();
  const { theme, setTheme } = useTheme();
  const transportState = usePipecatClientTransportState();
  return (
    <FullScreenContainer className="max-w-5xl">
      <EventStreamPanel />
      <Divider size="md" />
      <Controls>
        <Button
          onClick={() => {
            if (["connected", "ready"].includes(transportState)) {
              handleDisconnect?.();
            } else {
              handleConnect?.();
            }
          }}
          isLoading={
            !["initialized", "disconnected", "ready"].includes(transportState)
          }
          disabled={
            !["initialized", "disconnected", "ready"].includes(transportState)
          }
          variant={theme === "terminal" ? "outline" : "primary"}
          size="lg"
          className="w-full terminal-button"
        >
          {["initialized", "disconnected"].includes(transportState)
            ? "Connect"
            : transportState === "ready"
              ? "Disconnect"
              : "Establishing link..."}
        </Button>
      </Controls>

      <Button
        onClick={() => {
          setTheme(theme === "terminal" ? "system" : "terminal");
        }}
      >
        Toggle theme
      </Button>
      <Button
        onClick={() => {
          setHighlightedElement("controls");
        }}
      >
        Test highlight
      </Button>
      <HighlightOverlay
        highlightedElement={highlightedElement}
        onHighlightElement={setHighlightedElement}
      />
    </FullScreenContainer>
  );
}
