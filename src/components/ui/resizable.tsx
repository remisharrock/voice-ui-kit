import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { disableGlobalCursorStyles } from "react-resizable-panels";

import { EllipsisVerticalIcon } from "@/icons";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  disableGlobalCursorStyles();

  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "vkui:flex vkui:h-full vkui:w-full vkui:data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "vkui:focus-visible:ring-ring vkui:relative vkui:flex vkui:w-px vkui:items-center vkui:justify-center vkui:after:absolute vkui:after:inset-y-0 vkui:after:left-1/2 vkui:after:w-1 vkui:after:-translate-x-1/2 vkui:focus-visible:ring-1 vkui:focus-visible:ring-offset-1 focus-visible:outline-hidden vkui:data-[panel-group-direction=vertical]:h-px vkui:data-[panel-group-direction=vertical]:w-full vkui:data-[panel-group-direction=vertical]:after:left-0 vkui:data-[panel-group-direction=vertical]:after:h-1 vkui:data-[panel-group-direction=vertical]:after:w-full vkui:data-[panel-group-direction=vertical]:after:-translate-y-1/2 vkui:data-[panel-group-direction=vertical]:after:translate-x-0 vkui:[&[data-panel-group-direction=vertical]>div]:rotate-90",
        props["aria-orientation"] === "vertical"
          ? "vkui:cursor-row-resize"
          : "vkui:cursor-col-resize",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "vkui:border-transparent vkui:z-10 vkui:flex vkui:h-8 vkui:w-4 vkui:items-center vkui:justify-center vkui:rounded-xs vkui:border vkui:text-subtle vkui:hover:text-foreground vkui:focus:text-foreground",
            {
              "vkui:h-4 vkui:w-8 ": props["aria-orientation"] === "horizontal",
            },
          )}
        >
          <EllipsisVerticalIcon size={16} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
