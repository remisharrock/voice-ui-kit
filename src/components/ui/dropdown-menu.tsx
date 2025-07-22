import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import { CheckIcon, ChevronRightIcon, CircleIcon } from "@/icons";
import { getPipecatUIContainer } from "@/lib/dom";
import { cn } from "@/lib/utils";

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal
      container={getPipecatUIContainer()}
      data-slot="dropdown-menu-portal"
      {...props}
    />
  );
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "vkui:bg-popover vkui:text-popover-foreground vkui:data-[state=open]:animate-in vkui:data-[state=closed]:animate-out vkui:data-[state=closed]:fade-out-0 vkui:data-[state=open]:fade-in-0 vkui:data-[state=closed]:zoom-out-95 vkui:data-[state=open]:zoom-in-95 vkui:data-[side=bottom]:slide-in-from-top-2 vkui:data-[side=left]:slide-in-from-right-2 vkui:data-[side=right]:slide-in-from-left-2 vkui:data-[side=top]:slide-in-from-bottom-2 vkui:z-50 vkui:max-h-(--radix-dropdown-menu-content-available-height) vkui:min-w-[8rem] vkui:origin-(--radix-dropdown-menu-content-transform-origin) vkui:overflow-x-hidden vkui:overflow-y-auto vkui:rounded-element vkui:border vkui:p-1 vkui:shadow-short",
          className,
        )}
        {...props}
      />
    </DropdownMenuPortal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "vkui:focus:bg-accent vkui:focus:text-accent-foreground vkui:data-[variant=destructive]:text-destructive vkui:data-[variant=destructive]:focus:bg-destructive/10 vkui:dark:data-[variant=destructive]:focus:bg-destructive/20 vkui:data-[variant=destructive]:focus:text-destructive vkui:data-[variant=destructive]:*:[svg]:!text-destructive vkui:[&_svg:not([class*='text-'])]:text-muted-foreground vkui:relative vkui:flex vkui:cursor-default vkui:items-center vkui:gap-2 vkui:rounded-sm vkui:px-2 vkui:py-1.5 vkui:text-sm vkui:outline-hidden vkui:select-none vkui:data-[disabled]:pointer-events-none vkui:data-[disabled]:opacity-50 vkui:data-[inset]:pl-8 vkui:[&_svg]:pointer-events-none vkui:[&_svg]:shrink-0 vkui:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "vkui:focus:bg-accent vkui:focus:text-accent-foreground vkui:relative vkui:flex vkui:cursor-default vkui:items-center vkui:gap-2 vkui:rounded-sm vkui:py-1.5 vkui:pr-2 vkui:pl-8 vkui:text-sm vkui:outline-hidden vkui:select-none vkui:data-[disabled]:pointer-events-none vkui:data-[disabled]:opacity-50 vkui:[&_svg]:pointer-events-none vkui:[&_svg]:shrink-0 vkui:[&_svg:not([class*='size-'])]:size-4",
        checked && "vkui:font-medium vkui:bg-accent",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="vkui:pointer-events-none vkui:absolute vkui:left-2 vkui:flex size-3.5 vkui:items-center vkui:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "vkui:focus:bg-accent vkui:focus:text-accent-foreground vkui:relative vkui:flex vkui:cursor-default vkui:items-center vkui:gap-2 vkui:rounded-panel vkui:py-1.5 vkui:pr-2 vkui:pl-8 vkui:text-sm vkui:outline-hidden vkui:select-none vkui:data-[disabled]:pointer-events-none vkui:data-[disabled]:opacity-50 vkui:[&_svg]:pointer-events-none vkui:[&_svg]:shrink-0 vkui:[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="vkui:pointer-events-none vkui:absolute vkui:left-2 vkui:flex vkui:size-3.5 vkui:items-center vkui:justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 vkui:fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "vkui:px-2 vkui:py-1.5 vkui:text-sm vkui:font-medium vkui:data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("vkui:bg-border vkui:-mx-1 vkui:my-1 vkui:h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "vkui:text-muted-foreground vkui:ml-auto vkui:text-xs vkui:tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "vkui:focus:bg-accent vkui:focus:text-accent-foreground vkui:data-[state=open]:bg-accent vkui:data-[state=open]:text-accent-foreground vkui:flex vkui:cursor-default vkui:items-center vkui:rounded-sm vkui:px-2 vkui:py-1.5 vkui:text-sm vkui:outline-hidden vkui:select-none vkui:data-[inset]:pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="vkui:ml-auto vkui:size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "vkui:bg-popover vkui:text-popover-foreground vkui:data-[state=open]:animate-in vkui:data-[state=closed]:animate-out vkui:data-[state=closed]:fade-out-0 vkui:data-[state=open]:fade-in-0 vkui:data-[state=closed]:zoom-out-95 vkui:data-[state=open]:zoom-in-95 vkui:data-[side=bottom]:slide-in-from-top-2 vkui:data-[side=left]:slide-in-from-right-2 vkui:data-[side=right]:slide-in-from-left-2 vkui:data-[side=top]:slide-in-from-bottom-2 vkui:z-50 vkui:min-w-[8rem] vkui:origin-(--radix-dropdown-menu-content-transform-origin) vkui:overflow-hidden vkui:rounded-md vkui:border vkui:p-1 vkui:shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
