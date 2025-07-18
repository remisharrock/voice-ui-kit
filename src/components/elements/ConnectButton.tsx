import { Button } from "@/components/ui/button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/utils";
import { type TransportState } from "@pipecat-ai/client-js";
import { usePipecatClientTransportState } from "@pipecat-ai/client-react";
import React from "react";

export type ConnectButtonStateContent = Partial<
  Record<
    TransportState,
    {
      children: React.ReactNode;
      variant: ButtonVariant;
      className?: string;
    }
  >
>;

export type ConnectButtonProps = {
  className?: string;
  onConnect?: () => void;
  onClick?: () => void;
  onDisconnect?: () => void;
  size?: ButtonSize;
  stateContent?: ConnectButtonStateContent;
};

export const ConnectButtonComponent: React.FC<
  ConnectButtonProps & {
    transportState: TransportState;
  }
> = ({
  className: passedClassName,
  onClick,
  onConnect,
  onDisconnect,
  stateContent,
  size = "default",
  transportState,
}) => {
  const getButtonProps = (): React.ComponentProps<typeof Button> => {
    if (stateContent && stateContent[transportState]) {
      return stateContent[transportState]!;
    }

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

export const ConnectButton = (props: ConnectButtonProps) => {
  const transportState = usePipecatClientTransportState();

  return <ConnectButtonComponent transportState={transportState} {...props} />;
};

export default ConnectButton;
