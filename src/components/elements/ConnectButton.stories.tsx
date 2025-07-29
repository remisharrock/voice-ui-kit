import type { Story, StoryDefault } from "@ladle/react";
import { type TransportState, TransportStateEnum } from "@pipecat-ai/client-js";
import { type ButtonSize, buttonSizeOptions } from "../ui/buttonVariants";
import { ConnectButtonComponent } from "./ConnectButton";

const transportStateOptions = Object.values(TransportStateEnum);

export default {
  title: "Components / Connect Button",
  argTypes: {
    transportState: {
      options: transportStateOptions,
      control: { type: "select" },
      defaultValue: "disconnected",
    },
    size: {
      options: buttonSizeOptions,
      control: { type: "select" },
      defaultValue: "default",
    },
  },
} satisfies StoryDefault;

export const ConnectButtonDefault: Story<{
  transportState: TransportState;
  size: ButtonSize;
}> = ({ transportState, size }) => {
  return <ConnectButtonComponent transportState={transportState} size={size} />;
};
ConnectButtonDefault.storyName = "Default";
