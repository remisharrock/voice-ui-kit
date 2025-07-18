import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type TransportState } from "@pipecat-ai/client-js";
import { usePipecatClientTransportState } from "@pipecat-ai/client-react";
import React from "react";
import type { ButtonSize } from "../ui/buttonVariants";

type StateContent = {
  children: React.ReactNode;
  variant: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

export type ConnectButtonProps = {
  className?: string;
  onConnect?: () => void;
  onClick?: () => void;
  onDisconnect?: () => void;
  size?: ButtonSize;
  stateContent?: Record<TransportState, StateContent>;
};

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  className: passedClassName,
  onClick,
  onConnect,
  onDisconnect,
  stateContent,
  size = "default",
}) => {
  const transportState = usePipecatClientTransportState();

  const getButtonProps = (): React.ComponentProps<typeof Button> => {
    // Prioritize stateContent over default content
    if (stateContent) {
      return stateContent[transportState];
    }

    // Default content
    switch (transportState) {
      case "disconnected":
        return {
          children: "Connect",
          variant: "default",
        };
      case "authenticating":
      case "connecting":
        return { children: "Connecting...", variant: "default" };
      case "connected":
      case "ready":
        return { children: "Disconnect", variant: "destructive" };
      default:
        return {
          children: "Connect",
          variant: "active",
        };
    }
  };

  const { children, className, variant } = getButtonProps();

  const handleClick = () => {
    onClick?.();
    if (transportState === "connected") {
      onDisconnect?.();
    } else {
      onConnect?.();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      disabled={!["disconnected", "ready"].includes(transportState)}
      isLoading={!["disconnected", "ready"].includes(transportState)}
      className={cn(className, passedClassName)}
    >
      {children}
    </Button>
  );
};

export default ConnectButton;
