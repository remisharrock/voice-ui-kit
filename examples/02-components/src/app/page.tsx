"use client";

import { FullScreenContainer, ThemeProvider } from "@pipecat-ai/voice-ui-kit";
import { App } from "./components/App";

export default function Home() {
  return (
    <ThemeProvider>
      <FullScreenContainer>
        <App
          transportType="smallwebrtc"
          connectParams={{
            webrtcUrl: "/api/offer",
          }}
        />
      </FullScreenContainer>
    </ThemeProvider>
  );
}
