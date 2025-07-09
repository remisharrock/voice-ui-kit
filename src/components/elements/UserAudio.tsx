"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/buttongroup";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, MicIcon, MicOffIcon } from "@/icons";
import {
  PipecatClientMicToggle,
  usePipecatClient,
  usePipecatClientMediaDevices,
  VoiceVisualizer,
} from "@pipecat-ai/client-react";
import { memo, useEffect } from "react";

const UserAudio: React.FC = () => {
  const client = usePipecatClient();
  const { availableMics, selectedMic, updateMic } =
    usePipecatClientMediaDevices();

  // @ts-expect-error _options is protected, but can be totally accessed in JS
  const hasAudio = client?._options?.enableMic;

  useEffect(() => {
    if (!client) return;

    if (["idle", "disconnected"].includes(client.state)) {
      client.initDevices();
    }
  }, [client]);

  if (!hasAudio) {
    return (
      <div className="vkui:flex vkui:items-center vkui:gap-2 vkui:bg-muted vkui:rounded-md vkui:p-2 vkui:text-muted-foreground vkui:font-mono vkui:text-sm">
        <MicOffIcon size={16} />
        Audio disabled
      </div>
    );
  }

  return (
    <div className="vkui:flex vkui:flex-col vkui:gap-2">
      <ButtonGroup className="vkui:w-full">
        <PipecatClientMicToggle>
          {({ isMicEnabled, onClick }) => (
            <Button
              onClick={onClick}
              className="vkui:flex-1 vkui:justify-start"
              variant="secondary"
            >
              {isMicEnabled ? <MicIcon size={16} /> : <MicOffIcon size={16} />}
              <VoiceVisualizer
                participantType="local"
                backgroundColor="transparent"
                barColor={isMicEnabled ? "#00bc7d" : "#999999"}
                barCount={10}
                barGap={2}
                barMaxHeight={20}
                barOrigin="center"
                barWidth={3}
              />
            </Button>
          )}
        </PipecatClientMicToggle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="vkui:border-s vkui:border-border vkui:p-2! vkui:flex-none"
              variant="secondary"
            >
              <ChevronDownIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableMics.map((mic) => (
              <DropdownMenuCheckboxItem
                key={mic.deviceId}
                checked={selectedMic?.deviceId === mic.deviceId}
                onCheckedChange={() => updateMic(mic.deviceId)}
              >
                {mic.label || `Mic ${mic.deviceId.slice(0, 5)}`}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  );
};

export default memo(UserAudio);
