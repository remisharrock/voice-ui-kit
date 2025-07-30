import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/ui/panel";
import { VideoOffIcon } from "@/icons";
import { cn } from "@/lib/utils";
import {
  PipecatClientVideo,
  usePipecatClientMediaTrack,
} from "@pipecat-ai/client-react";

interface BotVideoPanelProps {
  className?: string;
  collapsed?: boolean;
}

export const BotVideoPanel: React.FC<BotVideoPanelProps> = ({
  className,
  collapsed = false,
}) => {
  const track = usePipecatClientMediaTrack("video", "bot");

  return (
    <Panel
      className={cn(
        "vkui:flex-1 vkui:mb-auto",
        {
          "vkui:flex-0 vkui:border-none": collapsed,
        },
        className,
      )}
    >
      {!collapsed && (
        <PanelHeader>
          <PanelTitle>Bot Video</PanelTitle>
        </PanelHeader>
      )}
      <PanelContent
        className={cn("vkui:overflow-hidden vkui:flex-1", {
          "vkui:aspect-video": collapsed,
        })}
      >
        {track ? (
          <div
            className={cn(
              "vkui:relative vkui:flex vkui:h-full vkui:bg-muted vkui:rounded-sm",
              {
                "vkui:aspect-video": collapsed,
              },
            )}
          >
            <PipecatClientVideo
              participant="bot"
              className="vkui:aspect-video vkui:max-h-full"
              fit="contain"
            />
          </div>
        ) : (
          <div className="vkui:text-subtle vkui:flex vkui:w-full vkui:h-full vkui:gap-2 vkui:items-center vkui:justify-center">
            <VideoOffIcon size={16} />
            {!collapsed && (
              <span className="vkui:font-semibold vkui:text-sm">No video</span>
            )}
          </div>
        )}
      </PanelContent>
    </Panel>
  );
};

export default BotVideoPanel;
