import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/ui/panel";
import { VideoOffIcon } from "@/icons";
import { cn } from "@/lib/utils";
import {
  RTVIClientVideo,
  useRTVIClientMediaTrack,
} from "@pipecat-ai/client-react";

interface BotVideoPanelProps {
  className?: string;
  collapsed?: boolean;
}

export const BotVideoPanel: React.FC<BotVideoPanelProps> = ({
  className,
  collapsed = false,
}) => {
  const track = useRTVIClientMediaTrack("video", "bot");
  return (
    <Panel
      className={cn(className, {
        "border-none": collapsed,
      })}
    >
      {!collapsed && (
        <PanelHeader>
          <PanelTitle>Bot Video</PanelTitle>
        </PanelHeader>
      )}
      <PanelContent
        className={cn("relative overflow-hidden", {
          "p-0!": collapsed,
        })}
      >
        <RTVIClientVideo
          participant="bot"
          className="aspect-video bg-muted rounded-sm max-h-full"
          fit="contain"
        />
        {!track && (
          <div className="absolute inset-0 flex gap-1 items-center justify-center">
            <VideoOffIcon size={16} />
            {!collapsed && <span className="font-mono text-xs">No video</span>}
          </div>
        )}
      </PanelContent>
    </Panel>
  );
};
