import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import type { PipecatBaseChildProps } from "@pipecat-ai/voice-ui-kit";
import {
  Card,
  CardContent,
  ConnectButton,
  ErrorCard,
  FullScreenContainer,
  PipecatAppBase,
  SpinLoader,
} from "@pipecat-ai/voice-ui-kit";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FullScreenContainer>
      <PipecatAppBase
        connectParams={{
          connectionUrl: "/api/offer",
        }}
        transportType="smallwebrtc"
        noThemeProvider
      >
        {({
          client,
          handleConnect,
          handleDisconnect,
          error,
        }: PipecatBaseChildProps) =>
          !client ? (
            <SpinLoader />
          ) : error ? (
            <ErrorCard>{error}</ErrorCard>
          ) : (
            <Card
              size="lg"
              shadow="xlong"
              noGradientBorder={false}
              rounded="xl"
            >
              <CardContent>
                <ConnectButton
                  size="lg"
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              </CardContent>
            </Card>
          )
        }
      </PipecatAppBase>
    </FullScreenContainer>
  </StrictMode>,
);
