"use client";

import { cn } from "@/lib/utils";
import { type BotTTSTextData, RTVIEvent } from "@pipecat-ai/client-js";
import {
  usePipecatClientTransportState,
  useRTVIClientEvent,
} from "@pipecat-ai/client-react";
import { cva } from "class-variance-authority";
import { useCallback, useState } from "react";

interface Props {
  participant: "local" | "remote";
  className?: string;
  size?: "default";
}

const transcriptOverlayVariants = cva(
  `vkui:mx-auto vkui:items-center vkui:justify-end vkui:text-center 
  vkui:*:box-decoration-clone vkui:*:text-balance vkui:*:animate-in vkui:*:fade-in vkui:*:duration-300 vkui:*:mx-auto
  vkui:*:**:bg-foreground vkui:*:**:text-background vkui:*:**:box-decoration-clone vkui:*:**:text-balance
  `,
  {
    variants: {
      size: {
        default:
          "vkui:*:leading-6 vkui:*:**:px-3 vkui:*:**:py-1.5 vkui:*:**:text-sm vkui:*:**:font-medium vkui:*:**:rounded-lg",
        sm: "vkui:*:leading-4 vkui:*:**:px-2 vkui:*:**:py-1 vkui:*:**:text-xs vkui:*:**:font-medium vkui:*:**:rounded-md",
        lg: "vkui:*:leading-7 vkui:*:**:px-4 vkui:*:**:py-2 vkui:*:**:text-base vkui:*:**:font-medium vkui:*:**:rounded-xl",
      },
    },
  },
);

export const TranscriptOverlayPartComponent = ({ text }: { text: string }) => (
  <span>{text}</span>
);

export const TranscriptOverlayComponent = ({
  children,
  className,
  size = "default",
  turnEnd,
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  turnEnd?: boolean;
}) => {
  return (
    <div
      className={cn(
        transcriptOverlayVariants({ size }),
        turnEnd
          ? "vkui:animate-out vkui:fade-out vkui:duration-1000 vkui:fill-mode-forwards"
          : "",
        className,
      )}
    >
      <p>{children}</p>
    </div>
  );
};

export const TranscriptOverlay = ({
  participant = "remote",
  className,
  size = "default",
}: Props) => {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [turnEnd, setIsTurnEnd] = useState(false);
  const transportState = usePipecatClientTransportState();

  useRTVIClientEvent(
    RTVIEvent.BotTtsText,
    useCallback(
      (event: BotTTSTextData) => {
        if (participant === "local") {
          return;
        }

        if (turnEnd) {
          setTranscript([]);
          setIsTurnEnd(false);
        }

        setTranscript((prev) => [...prev, event.text]);
      },
      [turnEnd, participant],
    ),
  );

  useRTVIClientEvent(
    RTVIEvent.BotStoppedSpeaking,
    useCallback(() => {
      if (participant === "local") {
        return;
      }
      setIsTurnEnd(true);
    }, [participant]),
  );

  useRTVIClientEvent(
    RTVIEvent.BotTtsStopped,
    useCallback(() => {
      if (participant === "local") {
        return;
      }
      setIsTurnEnd(true);
    }, [participant]),
  );

  if (transcript.length === 0 || transportState !== "ready") {
    return null;
  }

  return (
    <TranscriptOverlayComponent
      size={size}
      turnEnd={turnEnd}
      className={className}
    >
      <TranscriptOverlayPartComponent text={transcript.join(" ")} />
    </TranscriptOverlayComponent>
  );
};

export default TranscriptOverlay;
