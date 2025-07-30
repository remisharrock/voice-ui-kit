import type { Story, StoryDefault } from "@ladle/react";
import { type TransportState, TransportStateEnum } from "@pipecat-ai/client-js";
import { ClientStatusComponent } from "./ClientStatus";

const transportStateOptions = Object.values(TransportStateEnum);

export default {
  title: "Components / Client Status",
  args: {
    state: "disconnected",
  },
  argTypes: {
    transportState: {
      options: transportStateOptions,
      control: { type: "select" },
      defaultValue: "disconnected",
    },
  },
} satisfies StoryDefault;

export const Default: Story<{ transportState: TransportState }> = ({
  transportState,
}) => <ClientStatusComponent transportState={transportState} />;

Default.storyName = "Default";
