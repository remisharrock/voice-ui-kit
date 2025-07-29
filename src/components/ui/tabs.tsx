import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("vkui:flex vkui:flex-col vkui:gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "vkui:bg-muted vkui:text-muted-foreground vkui:inline-flex vkui:h-10 vkui:p-1 vkui:w-fit vkui:items-center vkui:justify-center vkui:rounded-md p-[3px] vkui:gap-1",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "vkui:data-[state=active]:bg-background vkui:data-[state=active]:text-foreground vkui:focus-visible:border-ring vkui:focus-visible:ring-ring/50 vkui:focus-visible:outline-ring vkui:hover:bg-muted-foreground/10 vkui:dark:data-[state=active]:border-input vkui:dark:data-[state=active]:bg-input/30 vkui:text-foreground vkui:inline-flex vkui:h-[calc(100%-1px)] vkui:flex-1 vkui:items-center vkui:justify-center vkui:gap-1.5 vkui:rounded-sm vkui:border vkui:border-transparent vkui:px-2 vkui:py-1 vkui:text-xs vkui:font-bold vkui:whitespace-nowrap vkui:transition-[color,box-shadow] vkui:focus-visible:ring-[3px] vkui:focus-visible:outline-1 vkui:disabled:pointer-events-none vkui:disabled:opacity-50 vkui:[&_svg]:pointer-events-none vkui:[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 vkui:mono-upper",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      forceMount
      className={cn(
        "vkui:flex-1 vkui:outline-none vkui:data-[state=inactive]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
