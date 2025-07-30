"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { type LucideIcon, XIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  useContext,
} from "react";
type BannerContextProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};
const BannerContext = createContext<BannerContextProps>({
  show: true,
  setShow: () => {},
});
export type BannerProps = HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  defaultVisible?: boolean;
  onClose?: () => void;
  inset?: boolean;
  variant?: "default" | "destructive";
};
export const Banner = ({
  children,
  visible,
  defaultVisible = true,
  variant = "default",
  onClose,
  className,
  inset = false,
  ...props
}: BannerProps) => {
  const [show, setShow] = useControllableState({
    defaultProp: defaultVisible,
    prop: visible,
    onChange: onClose,
  });
  if (!show) {
    return null;
  }
  return (
    <BannerContext.Provider value={{ show, setShow }}>
      <div
        className={cn(
          "vkui:flex vkui:w-full vkui:font-semibold vkui:items-center vkui:justify-between vkui:gap-2 vkui:bg-primary vkui:px-2 vkui:py-1 vkui:text-primary-foreground",
          inset && "vkui:rounded-lg",
          variant === "destructive" && "vkui:bg-destructive vkui:text-white",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </BannerContext.Provider>
  );
};
export type BannerIconProps = HTMLAttributes<HTMLDivElement> & {
  icon: LucideIcon;
};
export const BannerIcon = ({
  icon: Icon,
  className,
  ...props
}: BannerIconProps) => (
  <div
    className={cn(
      "vkui:rounded-full vkui:bg-foreground/10 vkui:dark:bg-foreground/30 vkui:p-1",
      className,
    )}
    {...props}
  >
    <Icon size={16} />
  </div>
);
export type BannerTitleProps = HTMLAttributes<HTMLParagraphElement>;
export const BannerTitle = ({ className, ...props }: BannerTitleProps) => (
  <p className={cn("vkui:flex-1 vkui:text-sm", className)} {...props} />
);
export type BannerActionProps = ComponentProps<typeof Button>;
export const BannerAction = ({
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: BannerActionProps) => (
  <Button
    className={cn(
      "vkui:shrink-0 vkui:bg-transparent vkui:hover:bg-background/10 vkui:hover:text-background",
      className,
    )}
    size={size}
    variant={variant}
    {...props}
  />
);
export type BannerCloseProps = ComponentProps<typeof Button>;
export const BannerClose = ({
  variant = "ghost",
  size = "icon",
  onClick,
  className,
  ...props
}: BannerCloseProps) => {
  const { setShow } = useContext(BannerContext);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setShow(false);
    onClick?.(e);
  };
  return (
    <Button
      className={cn(
        "vkui:shrink-0 vkui:bg-transparent vkui:hover:bg-background/10 vkui:hover:text-background",
        className,
      )}
      onClick={handleClick}
      size={size}
      variant={variant}
      {...props}
    >
      <XIcon size={18} />
    </Button>
  );
};
