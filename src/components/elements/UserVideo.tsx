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
  PipecatClientCamToggle,
  PipecatClientVideo,
  usePipecatClientMediaDevices,
} from "@pipecat-ai/client-react";

export const UserVideo: React.FC = () => {
  const { availableCams, selectedCam, updateCam } =
    usePipecatClientMediaDevices();

  return (
    <PipecatClientCamToggle>
      {({ isCamEnabled, onClick }) => (
        <div
          className={cn("vkui:bg-muted vkui:rounded-xl vkui:relative", {
            "vkui:aspect-video": isCamEnabled,
            "vkui:h-12": !isCamEnabled,
          })}
        >
          <PipecatClientVideo
            className={cn("vkui:rounded-xl", {
              "vkui:hidden": !isCamEnabled,
            })}
            participant="local"
          />
          {!isCamEnabled && (
            <div className="vkui:absolute vkui:h-full vkui:left-28 vkui:flex vkui:items-center vkui:justify-start vkui:rounded-xl">
              <div className="vkui:text-muted-foreground vkui:font-mono vkui:text-sm">
                Camera is off
              </div>
            </div>
          )}
          <div className="vkui:absolute vkui:bottom-2 vkui:left-2">
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
                <DropdownMenuContent align="end">
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
    </PipecatClientCamToggle>
  );
};
export default UserVideo;
