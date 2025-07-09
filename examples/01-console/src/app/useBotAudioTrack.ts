import { useContext } from "react";

// Ce contexte est fourni par le provider RTVIClient dans le kit Pipecat
// On suppose que le client expose une propriété botAudioTrack (MediaStreamTrack | null)
import { RTVIClientContext } from "@pipecat-ai/client-react";

/**
 * Hook custom pour récupérer la piste audio du bot (MediaStreamTrack)
 * à utiliser dans un composant enfant de RTVIClientProvider.
 */
export function useBotAudioTrack(): MediaStreamTrack | null {
  const client = useContext(RTVIClientContext) as any;
  // Selon l'implémentation du client, adapte la propriété ici :
  return client?.botAudioTrack ?? null;
}
