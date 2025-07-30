import type { Story, StoryDefault } from "@ladle/react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { PipecatClientProvider } from "@pipecat-ai/client-react";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import { useEffect, useState } from "react";
import { LocalVADPanel } from "./LocalVADPanel";

export default {
  title: "Panels",
} satisfies StoryDefault;

export const Default: Story = () => {
  return <LocalVADPanel />;
};

Default.storyName = "Local VAD Panel";

Default.decorators = [
  (Component) => {
    const [client, setClient] = useState<PipecatClient | null>(null);

    useEffect(() => {
      const client = new PipecatClient({
        transport: new SmallWebRTCTransport(),
      });
      setClient(client);

      client.initDevices();
    }, []);

    if (!client) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <PipecatClientProvider client={client!}>
          <Component />
        </PipecatClientProvider>
      </div>
    );
  },
];
