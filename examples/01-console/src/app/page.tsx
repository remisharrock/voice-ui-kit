"use client";

import { ConsoleTemplate, ThemeProvider } from "@pipecat-ai/voice-ui-kit";

export default function Home() {
  return (
    <ThemeProvider>
      <ConsoleTemplate
        onConnect={() => Promise.resolve(new Response("Connected"))}
      />
    </ThemeProvider>
  );
}
