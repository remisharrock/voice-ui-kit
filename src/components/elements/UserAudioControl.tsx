"use client";

import { Button } from "@/components/ui/button";
import {
  buttonAccentColorMap,
  type ButtonSize,
  type ButtonState,
  type ButtonVariant,
} from "@/components/ui/buttonVariants";
import { ChevronDownIcon, MicIcon, MicOffIcon } from "@/icons";
import { cn } from "@/lib/utils";
import { VoiceVisualizer } from "@/visualizers";
import {
  type OptionalMediaDeviceInfo,
  PipecatClientMicToggle,
  usePipecatClient,
  usePipecatClientMediaDevices,
} from "@pipecat-ai/client-react";
import { useEffect } from "react";
import { DeviceDropDown } from "./DeviceDropDown";

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  buttonProps?: Partial<React.ComponentProps<typeof Button>>;
  classNames?: {
    button?: string;
    buttongroup?: string;
    dropdownMenuTrigger?: string;
    dropdownMenuContent?: string;
    dropdownMenuCheckboxItem?: string;
  };
  dropdownButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  noDevicePicker?: boolean;
  noVisualizer?: boolean;
  visualizerProps?: Partial<React.ComponentProps<typeof VoiceVisualizer>>;
  noAudio?: boolean;
  noAudioText?: string | null;
}

interface ComponentProps extends Props {
  onClick?: () => void;
  isMicEnabled?: boolean;
  availableMics?: MediaDeviceInfo[];
  selectedMic?: OptionalMediaDeviceInfo;
  updateMic?: (deviceId: string) => void;
}

const btnClasses = "vkui:flex-1 vkui:w-full vkui:z-10 vkui:justify-start";

export const UserAudioComponent: React.FC<ComponentProps> = ({
  variant = "secondary",
  size = "md",
  classNames = {},
  buttonProps = {},
  dropdownButtonProps = {},
  noDevicePicker = false,
  noVisualizer = false,
  visualizerProps = {},
  isMicEnabled = false,
  state,
  availableMics,
  selectedMic,
  updateMic,
  noAudio,
  noAudioText = "Audio disabled",
  onClick,
}) => {
  let buttonComp;

  /** NO AUDIO */
  if (noAudio || buttonProps?.isLoading) {
    buttonComp = (
      <Button
        variant={variant}
        size={size}
        {...buttonProps}
        disabled
        className={cn(
          btnClasses,
          buttonProps?.isLoading && "vkui:justify-center",
          classNames.button,
        )}
      >
        {!buttonProps?.isLoading && (
          <>
            <MicOffIcon />
            <span className="vkui:flex-1">{noAudioText}</span>
          </>
        )}
      </Button>
    );
  } else {
    /** AUDIO ENABLED */
    const buttonState = state || (isMicEnabled ? "default" : "inactive");
    const accentColor =
      buttonAccentColorMap[variant || "primary"]?.[buttonState];

    buttonComp = (
      <>
        <Button
          onClick={onClick}
          variant={variant}
          state={buttonState}
          size={size}
          {...buttonProps}
          className={cn(
            btnClasses,
            !noDevicePicker && "vkui:rounded-e-none",
            classNames.button,
          )}
        >
          {isMicEnabled ? <MicIcon /> : <MicOffIcon />}
          {!noVisualizer && (
            <VoiceVisualizer
              participantType="local"
              backgroundColor="transparent"
              barCount={10}
              barGap={2}
              barMaxHeight={size === "lg" ? 24 : size === "xl" ? 36 : 20}
              barOrigin="center"
              barWidth={3}
              barColor={accentColor}
              className="vkui:mx-auto"
              {...visualizerProps}
            />
          )}
        </Button>
        {!noDevicePicker && (
          <DeviceDropDown
            menuLabel="Microphone device"
            availableDevices={availableMics}
            selectedDevice={selectedMic}
            updateDevice={updateMic}
            classNames={{
              dropdownMenuContent: classNames.dropdownMenuContent,
              dropdownMenuCheckboxItem: classNames.dropdownMenuCheckboxItem,
            }}
          >
            <Button
              className={cn(
                "vkui:flex-none vkui:z-0 vkui:rounded-s-none vkui:border-l-0",
                classNames.dropdownMenuTrigger,
              )}
              variant={variant}
              size={size}
              isIcon
              {...dropdownButtonProps}
            >
              <ChevronDownIcon size={16} />
            </Button>
          </DeviceDropDown>
        )}
      </>
    );
  }

  return (
    <div
      className={cn(
        "vkui:grid vkui:grid-cols-[1fr_auto] vkui:gap-[1px]",
        variant === "outline" && "vkui:gap-0",
      )}
    >
      {buttonComp}
    </div>
  );
};

export const UserAudioControl: React.FC<Props> = (props) => {
  const client = usePipecatClient();
  const { availableMics, selectedMic, updateMic } =
    usePipecatClientMediaDevices();

  const hasAudio = client?.isMicEnabled;
  const loading = hasAudio === null;

  useEffect(() => {
    if (!client) return;

    if (["idle", "disconnected"].includes(client.state)) {
      client.initDevices();
    }
  }, [client]);

  return (
    <PipecatClientMicToggle>
      {({ isMicEnabled, onClick }) => (
        <UserAudioComponent
          noAudio={!hasAudio}
          onClick={onClick}
          isMicEnabled={isMicEnabled}
          availableMics={availableMics}
          selectedMic={selectedMic}
          updateMic={updateMic}
          state={isMicEnabled ? "default" : "inactive"}
          buttonProps={{
            isLoading: loading,
          }}
          {...props}
        />
      )}
    </PipecatClientMicToggle>
  );
};

export default UserAudioControl;
