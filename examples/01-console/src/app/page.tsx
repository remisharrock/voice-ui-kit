"use client";

import { ConsoleTemplate, ThemeProvider } from "@pipecat-ai/voice-ui-kit";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="w-full h-dvh bg-background">
        <ConsoleTemplate
          transportType="daily"
          onConnect={async () => {
            // Call the connect serverless function and get the room URL and token from Daily
            const response = await fetch("/api/connect", {
              method: "POST",
              body: JSON.stringify({
                createDailyRoom: true,
              }),
            });
            if (!response.ok) {
              throw new Error("Failed to connect to Pipecat");
            }
            const data = await response.json();
            if (data.error) {
              throw new Error(data.error);
            }

            return new Response(
              JSON.stringify({
                room_url: data.dailyRoom,
                token: data.dailyToken,
              }),
              { status: 200 },
            );
          }}
        />
      </div>
    </ThemeProvider>
  );
}
