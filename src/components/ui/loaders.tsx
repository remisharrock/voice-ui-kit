import { LoaderIcon } from "@/icons";

export const SpinLoader = ({ size = 32 }: { size?: number }) => {
  return (
    <LoaderIcon className="vkui:animate-spin vkui:opacity-50" size={size} />
  );
};

/**
 * @deprecated Use SpinLoader instead. This component will be removed in a future version.
 */
export const LoaderSpinner = SpinLoader;
