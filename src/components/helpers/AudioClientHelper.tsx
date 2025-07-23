"use client";

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
import { useEffect, useState } from "react";
import { ThemeProvider } from "../ThemeProvider";

/**
 * Props for the AudioClientHelper component.
 */
export interface AppProps {
  /** Connection parameters for the Pipecat client */
  connectParams: TransportConnectionParams | ConnectionEndpoint;
  /** Type of transport to use for the connection */
  transportType: "smallwebrtc" | "daily";
  /** Optional configuration options for the Pipecat client */
  clientOptions?: PipecatClientOptions;
  /**
   * Render prop function that receives helper props and returns React nodes.
   *
   * @param props - HelperChildProps including connection handlers, loading, and error state
   * @returns React.ReactNode
   */
  children: (props: HelperChildProps) => React.ReactNode;
}

/**
 * Props that are passed to child components by the AudioClientHelper.
 */
export interface HelperChildProps {
  /** Function to initiate a connection to the session */
  handleConnect?: () => Promise<void>;
  /** Function to disconnect from the current session */
  handleDisconnect?: () => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Error message if connection fails */
  error?: string | null;
}

/**
 * AudioClientHelper component that provides a configured Pipecat client with audio capabilities.
 *
 * This component:
 * - Initializes a Pipecat client with the specified transport type
 * - Provides connection and disconnection handlers
 * - Wraps children in the necessary providers (ThemeProvider, PipecatClientProvider)
 * - Handles error states and loading states
 * - Automatically disconnects the client when unmounting
 *
 * @param props - Configuration for the audio client including connection params and transport type
 * @returns A provider component that wraps children with client context and handlers
 *
 * @example
 * ```tsx
 * <AudioClientHelper
 *   connectParams={...}
 *   transportType="daily"
 * >
 *   {({ handleConnect, handleDisconnect, loading, error }) => (
 *     <YourComponent
 *       handleConnect={handleConnect}
 *       handleDisconnect={handleDisconnect}
 *       loading={loading}
 *       error={error}
 *     />
 *   )}
 * </AudioClientHelper>
 * ```
 */
export const AudioClientHelper = ({
  connectParams,
  transportType,
  clientOptions,
  children,
}: AppProps) => {
  const [client, setClient] = useState<PipecatClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initializes the Pipecat client with the specified transport type.
   * Creates a new client instance when transport type or connection params change.
   */
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

  /**
   * Initiates a connection to the session using the configured client.
   * Only allows connection from specific states (initialized, disconnected, error).
   * Clears any previous errors and handles connection failures.
   */
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

  /**
   * Disconnects from the current session.
   * Safely handles the case where no client is available.
   */
  const handleDisconnect = async () => {
    if (!client) return;
    await client.disconnect();
  };

  /**
   * Show loading state while client is being initialized.
   */
  if (!client) {
    return children({ loading: true, error: null });
  }

  return (
    <ThemeProvider>
      <PipecatClientProvider client={client!}>
        {children({
          handleConnect,
          handleDisconnect,
          loading: false,
          error,
        })}
        <PipecatClientAudio />
      </PipecatClientProvider>
    </ThemeProvider>
  );
};
