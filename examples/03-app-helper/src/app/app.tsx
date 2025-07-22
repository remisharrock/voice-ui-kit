import {
  ControlBar,
  HelperChildProps,
  TranscriptOverlay,
} from "@pipecat-ai/voice-ui-kit";
import { PlasmaVisualizer } from "@pipecat-ai/voice-ui-kit/webgl";

export const App = ({ handleConnect, handleDisconnect }: HelperChildProps) => {
  return (
    <main className="relative flex flex-col gap-0 h-full w-full justify-end items-center">
      <PlasmaVisualizer />
      <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center">
        <TranscriptOverlay participant="remote" className="max-w-md" />
      </div>
      <div className="relative z-10 h-1/2 flex flex-col w-full items-center justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
        <ControlBar onConnect={handleConnect} onDisconnect={handleDisconnect} />
      </div>
    </main>
  );
};
