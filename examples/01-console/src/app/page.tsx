"use client";

import { ConsoleTemplate, ThemeProvider } from "@pipecat-ai/voice-ui-kit";
import { BotPlasmaPanel } from "./BotPlasmaPanel";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="w-full h-dvh bg-background flex flex-row">
        {/* Colonne gauche : BotPlasmaPanel dans un carré */}
        <div style={{ width: 240, minWidth: 240, height: 240, margin: 16 }}>
          <BotPlasmaPanel />
        </div>
        {/* Colonne droite : ConsoleTemplate sans panneau bot */}
        <div className="flex-1">
          <ConsoleTemplate
            transportType="smallwebrtc"
            onConnect={async () => {
              return new Response(JSON.stringify({}), { status: 200 });
            }}
            clientOptions={{
              params: {
                baseUrl: "http://localhost:7860/api/offer",
              },
            }}
            noBotVideo={true}
            noBotAudio={true}
            noUserVideo={true}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
