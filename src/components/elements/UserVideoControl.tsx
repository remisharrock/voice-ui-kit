import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/buttongroup";
import { ChevronDownIcon, VideoIcon, VideoOffIcon } from "@/icons";
import { cn } from "@/lib/utils";
import {
  type OptionalMediaDeviceInfo,
  PipecatClientCamToggle,
  PipecatClientVideo,
  usePipecatClientMediaDevices,
} from "@pipecat-ai/client-react";
import { DeviceDropDown } from "./DeviceDropDown";

interface Props {
  buttonProps?: Partial<React.ComponentProps<typeof Button>>;
  classNames?: {
    container?: string;
    video?: string;
    buttongroup?: string;
    button?: string;
    dropdownMenuTrigger?: string;
    dropdownMenuContent?: string;
    dropdownMenuCheckboxItem?: string;
    videoOffContainer?: string;
    videoOffText?: string;
  };
  dropdownButtonProps?: Partial<React.ComponentProps<typeof Button>>;
  noDevicePicker?: boolean;
  noVideo?: boolean;
  videoProps?: Partial<React.ComponentProps<typeof PipecatClientVideo>>;
}

interface ComponentProps extends Props {
  onClick?: () => void;
  isCamEnabled?: boolean;
  availableCams?: MediaDeviceInfo[];
  selectedCam?: OptionalMediaDeviceInfo;
  updateCam?: (deviceId: string) => void;
}

export const UserVideoComponent: React.FC<ComponentProps> = ({
  buttonProps = {},
  classNames = {},
  dropdownButtonProps = {},
  noDevicePicker = false,
  noVideo = false,
  videoProps = {},
  onClick,
  isCamEnabled,
  availableCams = [],
  selectedCam,
  updateCam,
}) => {
  return (
    <div
      className={cn(
        "vkui:bg-muted vkui:rounded-xl vkui:relative",
        {
          "vkui:aspect-video": isCamEnabled && !noVideo,
          "vkui:h-12": !isCamEnabled || noVideo,
        },
        classNames.container,
      )}
    >
      {!noVideo && (
        <PipecatClientVideo
          className={cn(
            "vkui:rounded-xl",
            {
              "vkui:hidden": !isCamEnabled,
            },
            classNames.video,
          )}
          participant="local"
          {...videoProps}
        />
      )}
      {(!isCamEnabled || noVideo) && (
        <div
          className={cn(
            "vkui:absolute vkui:h-full vkui:left-28 vkui:flex vkui:items-center vkui:justify-start vkui:rounded-xl",
            {
              "vkui:left-16": noDevicePicker,
            },
            classNames.videoOffContainer,
          )}
        >
          <div
            className={cn(
              "vkui:text-muted-foreground vkui:font-mono vkui:text-sm",
              classNames.videoOffText,
            )}
          >
            {isCamEnabled ? "Camera is on" : "Camera is off"}
          </div>
        </div>
      )}
      <div className="vkui:absolute vkui:bottom-2 vkui:left-2">
        <ButtonGroup className={cn(classNames.buttongroup)}>
          <Button
            className={cn(classNames.button)}
            variant="outline"
            onClick={onClick}
            {...buttonProps}
          >
            {isCamEnabled ? <VideoIcon /> : <VideoOffIcon />}
          </Button>
          {!noDevicePicker && (
            <DeviceDropDown
              availableDevices={availableCams}
              selectedDevice={selectedCam}
              updateDevice={updateCam}
              classNames={{
                dropdownMenuCheckboxItem: classNames.dropdownMenuCheckboxItem,
                dropdownMenuContent: classNames.dropdownMenuContent,
                dropdownMenuTrigger: classNames.dropdownMenuTrigger,
              }}
              menuLabel="Camera device"
            >
              <Button
                className={cn(classNames.dropdownMenuTrigger)}
                variant="outline"
                {...dropdownButtonProps}
              >
                <ChevronDownIcon />
              </Button>
            </DeviceDropDown>
          )}
        </ButtonGroup>
      </div>
    </div>
  );
};

export const UserVideoControl: React.FC<Props> = (props) => {
  const { availableCams, selectedCam, updateCam } =
    usePipecatClientMediaDevices();

  return (
    <PipecatClientCamToggle>
      {({ isCamEnabled, onClick }) => (
        <UserVideoComponent
          {...props}
          isCamEnabled={isCamEnabled}
          onClick={onClick}
          availableCams={availableCams}
          selectedCam={selectedCam}
          updateCam={updateCam}
        />
      )}
    </PipecatClientCamToggle>
  );
};
export default UserVideoControl;
