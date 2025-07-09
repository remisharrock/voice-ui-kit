"use client";

import { ConsoleTemplate, ThemeProvider } from "@pipecat-ai/voice-ui-kit";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="w-full h-dvh bg-background">
        <ConsoleTemplate
          connectParams={{
            endpoint: "/api/connect",
          }}
          transportType="daily"
        />
      </div>
    </ThemeProvider>
  );
}
