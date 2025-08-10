import type {
  ButtonSize,
  ButtonState,
  ButtonVariant,
} from "@/components/ui/buttonVariants";
import {
  buttonSizeOptions,
  buttonVariantOptions,
} from "@/components/ui/buttonVariants";
import type { Story, StoryDefault } from "@ladle/react";
import { PipecatClient } from "@pipecat-ai/client-js";
import {
  type OptionalMediaDeviceInfo,
  PipecatClientProvider,
} from "@pipecat-ai/client-react";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import UserAudioControl, { UserAudioComponent } from "./UserAudioControl";

export default {
  title: "Components / User Audio Control",
  argTypes: {
    variant: {
      options: buttonVariantOptions,
      control: { type: "select" },
      defaultValue: "secondary",
    },
    size: {
      options: buttonSizeOptions,
      control: { type: "select" },
      defaultValue: "default",
    },
    noAudioText: {
      control: { type: "text" },
      defaultValue: null,
    },
  },
} satisfies StoryDefault;

/**
 * No audio / audio disabled
 */
export const NoAudio: Story<{
  variant: ButtonVariant;
  size: ButtonSize;
  noAudioText: string;
}> = ({ variant, size, noAudioText }) => {
  return (
    <UserAudioComponent
      variant={variant}
      size={size}
      noAudio={true}
      {...(noAudioText && { noAudioText })}
    />
  );
};

NoAudio.args = {
  variant: "secondary",
  size: "default",
};

NoAudio.storyName = "No Audio";

/**
 * Active
 */
export const Default: Story<{
  variant: ButtonVariant;
  size: ButtonSize;
  isMuted: boolean;
  noDevicePicker: boolean;
  noVisualizer: boolean;
  isLoading: boolean;
}> = ({
  variant,
  size,
  isMuted = false,
  noDevicePicker = false,
  noVisualizer = false,
  isLoading = false,
}) => (
  <Card className="vkui:w-full">
    <CardContent className="vkui:flex vkui:flex-col vkui:gap-4 vkui:shrink-0">
      <UserAudioComponent
        variant={variant}
        size={size}
        isMicEnabled={!isMuted}
        availableMics={[]}
        selectedMic={undefined as unknown as OptionalMediaDeviceInfo}
        updateMic={() => {}}
        noVisualizer={noVisualizer}
        noDevicePicker={noDevicePicker}
        buttonProps={{
          isLoading,
        }}
      />
    </CardContent>
  </Card>
);

Default.args = {
  variant: "secondary",
  size: "default",
  isMuted: false,
};

Default.argTypes = {
  ...Default.argTypes,
  isMuted: {
    control: { type: "boolean" },
    defaultValue: false,
  },
  noDevicePicker: {
    control: { type: "boolean" },
    defaultValue: false,
  },
  noVisualizer: {
    control: { type: "boolean" },
    defaultValue: false,
  },
  isLoading: {
    control: { type: "boolean" },
    defaultValue: false,
  },
};

Default.storyName = "Default";

/**
 * Connected
 */
export const Connected: Story<{
  variant: ButtonVariant;
  size: ButtonSize;
  state: ButtonState;
}> = ({ variant, size, state }) => (
  <UserAudioControl variant={variant} size={size} state={state} />
);

Connected.args = {
  variant: "secondary",
  size: "default",
};

Connected.decorators = [
  (Component) => {
    const [client, setClient] = useState<PipecatClient | null>(null);

    useEffect(() => {
      const client = new PipecatClient({
        transport: new SmallWebRTCTransport(),
      });
      setClient(client);
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
Connected.storyName = "Connected";
