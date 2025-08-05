"use client";

import {
  ErrorCard,
  FullScreenContainer,
  PipecatAppBase,
  PipecatBasePassedProps,
  SpinLoader,
} from "@pipecat-ai/voice-ui-kit";

import { App } from "./app";

export default function Home() {
  return (
    <FullScreenContainer>
      <PipecatAppBase
        transportType="smallwebrtc"
        connectParams={{
          connectionUrl: "/api/offer",
        }}
      >
        {({
          handleConnect,
          handleDisconnect,
          loading,
          error,
        }: PipecatBasePassedProps) =>
          loading ? (
            <SpinLoader />
          ) : error ? (
            <ErrorCard error={error} />
          ) : (
            <App
              handleConnect={handleConnect}
              handleDisconnect={handleDisconnect}
              error={error}
            />
          )
        }
      </PipecatAppBase>
    </FullScreenContainer>
  );
}
