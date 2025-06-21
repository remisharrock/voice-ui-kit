import { ThemeProvider } from "@/components/ThemeProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ConsoleTemplate } from ".";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="pipecat-ui-theme">
      <div className="w-full h-dvh bg-background">
        <ConsoleTemplate
          onConnect={async () => {
            const response = await fetch(import.meta.env.VITE_PCC_API_URL, {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_PCC_API_KEY}`,
              },
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
  </StrictMode>,
);
