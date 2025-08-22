"use client";
import { useSandboxStore } from "@/lib/sandbox";

import {
  usePipecatClientTransportState,
  useRTVIClientEvent,
} from "@pipecat-ai/client-react";
import {
  Button,
  Card,
  CardContent,
  ErrorCard,
  PipecatAppBase,
  SpinLoader,
} from "@pipecat-ai/voice-ui-kit";
import { useRouter } from "next/navigation";

import { RTVIEvent } from "@pipecat-ai/client-js";
import "@pipecat-ai/voice-ui-kit/styles.scoped";

const App = ({ onConnect }: { onConnect: () => void }) => {
  const transportState = usePipecatClientTransportState();
  const router = useRouter();
  const { setCode } = useSandboxStore();

  useRTVIClientEvent(RTVIEvent.ServerMessage, (message) => {
    console.log("message", message);
    if (message.page) {
      router.push(message.page);
    } else {
      setCode(message.code);
      router.push("/sandbox");
    }
  });

  return (
    <Button
      isLoading={
        !["ready", "disconnected", "initialized"].includes(transportState)
      }
      disabled={
        !["ready", "disconnected", "initialized"].includes(transportState)
      }
      variant={transportState === "ready" ? "secondary" : "active"}
      onClick={() => {
        onConnect();
      }}
    >
      {transportState === "ready" ? "Disconnect" : "Connect"}
    </Button>
  );
};

export default function Bot() {
  return (
    <div className="vkui-root fixed bottom-4 right-4 z-50">
      <Card rounded="xl" shadow="xlong" withGradientBorder>
        <CardContent>
          <PipecatAppBase
            transportType="smallwebrtc"
            connectParams={{
              webrtcUrl: "/api/offer",
            }}
          >
            {({ client, handleConnect, error }) =>
              !client ? (
                <SpinLoader />
              ) : error ? (
                <ErrorCard error={error} />
              ) : (
                <App onConnect={() => handleConnect?.()} />
              )
            }
          </PipecatAppBase>
        </CardContent>
      </Card>
    </div>
  );
}
