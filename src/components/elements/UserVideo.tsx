import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/buttongroup";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, VideoIcon, VideoOffIcon } from "@/icons";
import { cn } from "@/lib/utils";
import {
  RTVIClientCamToggle,
  RTVIClientVideo,
  useRTVIClientMediaDevices,
} from "@pipecat-ai/client-react";

export const UserVideo: React.FC = () => {
  const { availableCams, selectedCam, updateCam } = useRTVIClientMediaDevices();

  return (
    <RTVIClientCamToggle>
      {({ isCamEnabled, onClick }) => (
        <div
          className={cn("bg-muted rounded-xl relative", {
            "aspect-video": isCamEnabled,
            "h-12": !isCamEnabled,
          })}
        >
          <RTVIClientVideo
            className={cn("rounded-xl", {
              hidden: !isCamEnabled,
            })}
            participant="local"
          />
          {!isCamEnabled && (
            <div className="absolute h-full left-28 flex items-center justify-start rounded-xl">
              <div className="text-muted-foreground font-mono text-sm">
                Camera is off
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <ButtonGroup>
              <Button variant="outline" onClick={onClick}>
                {isCamEnabled ? <VideoIcon /> : <VideoOffIcon />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableCams.map((cam) => (
                    <DropdownMenuCheckboxItem
                      key={cam.deviceId}
                      checked={selectedCam?.deviceId === cam.deviceId}
                      onClick={() => updateCam(cam.deviceId)}
                    >
                      {cam.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>
      )}
    </RTVIClientCamToggle>
  );
};
export default UserVideo;
