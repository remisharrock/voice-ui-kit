import { usePipecatClientMediaTrack } from "@pipecat-ai/client-react";
import { useEffect, useState } from "react";
import { VAD } from "web-vad";
import AudioWorkletURL from "web-vad/dist/worklet?worker&url";

interface UseLocalVADProps {
  pathToSileroModel?: string;
}

export const useLocalVAD = ({
  pathToSileroModel = "./silero_vad.onnx",
}: UseLocalVADProps = {}) => {
  const [vadInstance, setVadInstance] = useState<VAD | undefined>();
  const localMediaTrack = usePipecatClientMediaTrack("audio", "local");

  useEffect(() => {
    console.log("useEffect", localMediaTrack, vadInstance);
    if (!localMediaTrack || vadInstance) {
      return;
    }
    console.log("Loading VAD", pathToSileroModel);

    async function loadVad() {
      console.log("Attempting to load VAD");
      const stream = new MediaStream([localMediaTrack!]);

      const vad = new VAD({
        workletURL: AudioWorkletURL,
        modelURL: pathToSileroModel,
        stream,
        onSpeechStart: () => {
          console.log("Speech started");
        },
        onVADMisfire: () => {
          console.log("VAD misfire");
        },
        onSpeechEnd: () => {
          console.log("Speech ended");
        },
      }) as VAD;
      await vad.init();
      vad.start();

      console.log("VAD instance", vad);
      setVadInstance(vad);
    }

    // Load VAD
    loadVad();

    return () => {
      if (vadInstance) {
        (vadInstance as VAD).destroy();
      }
      setVadInstance(undefined);
    };
  }, [localMediaTrack, vadInstance, pathToSileroModel]);

  return vadInstance;
};
