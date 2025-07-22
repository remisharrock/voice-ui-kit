import { LoaderIcon } from "@/icons";

export const LoaderSpinner = ({ size = 32 }: { size?: number }) => {
  return (
    <LoaderIcon className="vkui:animate-spin vkui:opacity-50" size={size} />
  );
};
