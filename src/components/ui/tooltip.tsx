import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";
import { getPipecatUIContainer } from "@/lib/dom";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal container={getPipecatUIContainer()}>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "vkui:bg-primary vkui:text-primary-foreground vkui:animate-in vkui:fade-in-0 vkui:zoom-in-95 vkui:data-[state=closed]:animate-out vkui:data-[state=closed]:fade-out-0 vkui:data-[state=closed]:zoom-out-95 vkui:data-[side=bottom]:slide-in-from-top-2 vkui:data-[side=left]:slide-in-from-right-2 vkui:data-[side=right]:slide-in-from-left-2 vkui:data-[side=top]:slide-in-from-bottom-2 vkui:z-50 vkui:w-fit vkui:origin-(--radix-tooltip-content-transform-origin) vkui:rounded-md vkui:px-3 vkui:py-1.5 vkui:text-xs vkui:text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="vkui:bg-primary vkui:fill-primary vkui:z-50 vkui:size-2.5 vkui:translate-y-[calc(-50%_-_2px)] vkui:rotate-45 vkui:rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
