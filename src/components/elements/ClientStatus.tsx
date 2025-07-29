import DataList from "@/components/elements/DataList";
import { LoaderIcon } from "@/icons";
import { TextDashBlankslate } from "@/index";
import { cn } from "@/lib/utils";
import { RTVIEvent } from "@pipecat-ai/client-js";
import {
  usePipecatClientTransportState,
  useRTVIClientEvent,
} from "@pipecat-ai/client-react";
import { useState } from "react";

interface Props {
  classNames?: React.ComponentProps<typeof DataList>["classNames"] & {
    agentValue?: string;
    clientValue?: string;
  };
  noAgentState?: boolean;
  noClientState?: boolean;
}

export const ClientStatusComponent = ({
  className,
  transportState,
}: {
  className?: string;
  transportState?: string;
}) => {
  return (
    <span
      className={cn(
        "vkui:mono-upper vkui:text-muted-foreground vkui:font-medium vkui:flex vkui:items-center vkui:gap-1.5 vkui:leading-none vkui:justify-end",
        {
          "vkui:text-active":
            transportState === "connected" || transportState === "ready",
          "vkui:text-destructive": transportState === "error",
          "vkui:text-subtle": !transportState,
          "vkui:animate-pulse": [
            "authenticating",
            "authenticated",
            "connecting",
          ].includes(transportState || ""),
        },
        className,
      )}
    >
      {transportState || <TextDashBlankslate />}
      {transportState &&
        ["authenticating", "authenticated", "connecting"].includes(
          transportState,
        ) && <LoaderIcon size={12} className="vkui:animate-spin" />}
    </span>
  );
};

export const ClientStatus: React.FC<Props> = ({
  classNames = {},
  noAgentState = false,
  noClientState = false,
}) => {
  const transportState = usePipecatClientTransportState();

  const agentConnecting =
    transportState === "connecting" ||
    transportState === "connected" ||
    transportState === "ready";

  const [isBotConnected, setIsBotConnected] = useState(false);

  useRTVIClientEvent(RTVIEvent.BotReady, () => {
    if (noAgentState) return;
    setIsBotConnected(true);
  });
  useRTVIClientEvent(RTVIEvent.Disconnected, () => {
    if (noAgentState) return;
    setIsBotConnected(false);
  });
  useRTVIClientEvent(RTVIEvent.BotDisconnected, () => {
    if (noAgentState) return;
    setIsBotConnected(false);
  });

  if (noAgentState && noClientState) return null;

  const data: React.ComponentProps<typeof DataList>["data"] = {};
  if (!noClientState) {
    data["Client"] = <ClientStatusComponent transportState={transportState} />;
  }

  if (!noAgentState) {
    data["Agent"] = isBotConnected ? (
      <ClientStatusComponent transportState="connected" />
    ) : agentConnecting ? (
      <ClientStatusComponent transportState="connecting" />
    ) : (
      <ClientStatusComponent />
    );
  }

  return <DataList classNames={classNames} data={data} />;
};

export default ClientStatus;
