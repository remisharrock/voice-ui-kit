"use client";

import { createTransport } from "@/lib/transports";
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
import { useEffect, useState } from "react";
import { ThemeProvider, type ThemeProviderProps } from "../ThemeProvider";

/**
 * Props for the PipecatAppBase component.
 */
export interface PipecatBaseProps {
  /** Connection parameters for the Pipecat client */
  connectParams: TransportConnectionParams | ConnectionEndpoint;
  /** Type of transport to use for the connection */
  transportType: "smallwebrtc" | "daily";
  /** Optional configuration options for the Pipecat client */
  clientOptions?: PipecatClientOptions;
  /** Default theme to use for the app */
  themeProps?: ThemeProviderProps;
  /**
   * Children can be either:
   * - A render prop function that receives helper props and returns React nodes
   * - Direct React nodes that will be wrapped with the necessary providers
   *
   * @param props - PipecatBasePassedProps including connection handlers, loading, and error state
   * @returns React.ReactNode
   */
  children:
    | ((props: PipecatBasePassedProps) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Props that are passed to child components by the PipecatAppBase.
 */
export interface PipecatBasePassedProps {
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
 * PipecatAppBase component that provides a configured Pipecat client with audio capabilities.
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
 * // Using as a render prop (function children)
 * <PipecatAppBase
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
 * </PipecatAppBase>
 *
 * // Using with direct React nodes
 * <PipecatAppBase
 *   connectParams={...}
 *   transportType="daily"
 * >
 *   <YourComponent />
 * </PipecatAppBase>
 * ```
 */
export const PipecatAppBase = ({
  connectParams,
  transportType,
  clientOptions,
  themeProps,
  children,
}: PipecatBaseProps) => {
  const [client, setClient] = useState<PipecatClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initializes the Pipecat client with the specified transport type.
   * Creates a new client instance when transport type or connection params change.
   */
  useEffect(() => {
    let currentClient: PipecatClient | null = null;

    (async () => {
      try {
        const transport = await createTransport(transportType);

        const pcClient = new PipecatClient({
          enableCam: false,
          enableMic: true,
          transport: transport,
          ...clientOptions,
        });
        currentClient = pcClient;
        setClient(pcClient);
      } catch (error) {
        console.error("Failed to initialize transport:", error);
      }
    })();

    return () => {
      /**
       * Disconnect client when component unmounts or options change.
       */
      if (currentClient) {
        currentClient.disconnect();
      }
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
    return typeof children === "function"
      ? children({ loading: true, error: null })
      : children;
  }

  const passedProps: PipecatBasePassedProps = {
    handleConnect,
    handleDisconnect,
    loading: false,
    error,
  };

  return (
    <ThemeProvider {...themeProps}>
      <PipecatClientProvider client={client!}>
        {typeof children === "function" ? children(passedProps) : children}
        <PipecatClientAudio />
      </PipecatClientProvider>
    </ThemeProvider>
  );
};

/**
 * @deprecated Use PipecatAppBase instead. This component will be removed in a future version.
 */
export const AudioAppHelper = PipecatAppBase;
