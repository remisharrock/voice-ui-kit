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
  RTVIClientMicToggle,
  useRTVIClient,
  useRTVIClientMediaDevices,
  VoiceVisualizer,
} from "@pipecat-ai/client-react";
import { memo, useEffect } from "react";

const UserAudio: React.FC = () => {
  const client = useRTVIClient();
  const { availableMics, selectedMic, updateMic } = useRTVIClientMediaDevices();

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
      <div className="flex items-center gap-2 bg-muted rounded-md p-2 text-muted-foreground font-mono text-sm">
        <MicOffIcon size={16} />
        Audio disabled
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ButtonGroup className="w-full">
        <RTVIClientMicToggle>
          {({ isMicEnabled, onClick }) => (
            <Button
              onClick={onClick}
              className="flex-1 justify-start"
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
        </RTVIClientMicToggle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="border-s border-border p-2! flex-none"
              variant="secondary"
            >
              <ChevronDownIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
