"use client";

import { Card, CardContent } from "@/components/ui";
import { LoaderIcon } from "@/icons";
import {
  type ConnectionEndpoint,
  PipecatClient,
  type TransportConnectionParams,
} from "@pipecat-ai/client-js";
import { PipecatClientProvider } from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { ThemeProvider } from "../ThemeProvider";

export interface AppProps {
  connectParams: TransportConnectionParams | ConnectionEndpoint;
  transportType: "smallwebrtc" | "daily";
  children: React.ReactNode;
}

export interface HelperChildrenProps {
  handleConnect?: () => Promise<void>;
  handleDisconnect?: () => Promise<void>;
}

export const AudioClientHelper = ({
  connectParams,
  transportType,
  children,
}: AppProps) => {
  const [client, setClient] = useState<PipecatClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    if (typeof window === "undefined") return;

    let transport: DailyTransport | SmallWebRTCTransport;
    switch (transportType) {
      case "smallwebrtc":
        transport = new SmallWebRTCTransport();
        break;
      case "daily":
      default:
        transport = new DailyTransport();
        break;
    }

    const pcClient = new PipecatClient({
      enableCam: false,
      enableMic: true,
      transport: transport,
      callbacks: {
        onError: () => {
          setError(
            "An error occured connecting to agent. It may be that the agent is at capacity. Please try again later.",
          );
        },
      },
    });
    setClient(pcClient);

    return () => {
      /**
       * Disconnect client when component unmounts or options change.
       */
      pcClient.disconnect();
    };
  }, [connectParams, transportType]);

  const handleConnect = async () => {
    if (
      !client ||
      !["initialized", "disconnected", "error"].includes(client.state)
    ) {
      return;
    }
    setError(null);

    try {
      await client.connect(connectParams);
    } catch (err) {
      console.error("Connection error:", err);
      setError(
        `Failed to start session: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleDisconnect = async () => {
    if (!client) return;
    await client.disconnect();
  };

  if (!client) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoaderIcon className="animate-spin opacity-50" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Card className="shadow-long">
          <CardContent>
            <div className="bg-destructive text-background font-semibold text-center p-3 rounded-lg flex flex-col gap-2">
              An error occured connecting to agent.
              <p className="text-sm font-medium text-balanced text-background/80">
                It may be that the agent is at capacity. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const childrenWithProps = isValidElement(children)
    ? cloneElement(children, {
        handleConnect,
        handleDisconnect,
      } as HelperChildrenProps)
    : children;

  return (
    <ThemeProvider>
      <PipecatClientProvider client={client!}>
        {childrenWithProps}
      </PipecatClientProvider>
    </ThemeProvider>
  );
};
