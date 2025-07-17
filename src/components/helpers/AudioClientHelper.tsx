"use client";

import { LoaderIcon } from "@/icons";
import {
  type ConnectionEndpoint,
  PipecatClient,
  type PipecatClientOptions,
  type TransportConnectionParams,
} from "@pipecat-ai/client-js";
import {
  PipecatClientAudio,
  PipecatClientProvider,
} from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import { cloneElement, isValidElement, useEffect, useState } from "react";
import { ThemeProvider } from "../ThemeProvider";

export interface AppProps {
  connectParams: TransportConnectionParams | ConnectionEndpoint;
  transportType: "smallwebrtc" | "daily";
  clientOptions?: PipecatClientOptions;
  children: React.ReactNode;
}

export interface HelperChildProps {
  handleConnect?: () => Promise<void>;
  handleDisconnect?: () => Promise<void>;
  error?: string;
}

export const AudioClientHelper = ({
  connectParams,
  transportType,
  clientOptions,
  children,
}: AppProps) => {
  const [client, setClient] = useState<PipecatClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      ...clientOptions,
    });
    setClient(pcClient);

    return () => {
      /**
       * Disconnect client when component unmounts or options change.
       */
      pcClient.disconnect();
    };
  }, [connectParams, transportType, clientOptions]);

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

  const childrenWithProps = isValidElement(children)
    ? cloneElement(children, {
        handleConnect,
        handleDisconnect,
        error,
      } as HelperChildProps)
    : children;

  return (
    <ThemeProvider>
      <PipecatClientProvider client={client!}>
        {childrenWithProps}
        <PipecatClientAudio />
      </PipecatClientProvider>
    </ThemeProvider>
  );
};
