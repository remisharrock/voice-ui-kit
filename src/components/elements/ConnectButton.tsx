import React from "react";
import { Button } from "@/components/ui/button";
import { useRTVIClientTransportState } from "@pipecat-ai/client-react";
import { cn } from "@/lib/utils";

export type ConnectButtonProps = {
  className?: string;
  onConnect?: () => void;
  onClick?: () => void;
  onDisconnect?: () => void;
};

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  className: passedClassName,
  onClick,
  onConnect,
  onDisconnect,
}) => {
  const transportState = useRTVIClientTransportState();

  const getButtonProps = (): React.ComponentProps<typeof Button> => {
    switch (transportState) {
      case "disconnected":
        return {
          children: "Connect",
          variant: "default",
          className: "bg-green-600 hover:bg-green-700",
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
          variant: "default",
          className: "bg-green-600 hover:bg-green-700",
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
      className={cn(className, passedClassName)}
      onClick={handleClick}
      variant={variant}
      disabled={transportState === "connecting"}
    >
      {children}
    </Button>
  );
};

export default ConnectButton;
