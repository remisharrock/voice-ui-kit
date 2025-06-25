import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { getPipecatUIContainer } from "@/lib/dom";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal container={getPipecatUIContainer()}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "vkui:bg-popover vkui:text-popover-foreground vkui:data-[state=open]:animate-in vkui:data-[state=closed]:animate-out vkui:data-[state=closed]:fade-out-0 vkui:data-[state=open]:fade-in-0 vkui:data-[state=closed]:zoom-out-95 vkui:data-[state=open]:zoom-in-95 vkui:data-[side=bottom]:slide-in-from-top-2 vkui:data-[side=left]:slide-in-from-right-2 vkui:data-[side=right]:slide-in-from-left-2 vkui:data-[side=top]:slide-in-from-bottom-2 vkui:z-50 vkui:w-72 origin-(--radix-popover-content-transform-origin) vkui:rounded-md vkui:border vkui:p-4 vkui:shadow-md vkui:outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
