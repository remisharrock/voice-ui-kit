import AudioOutput from "@/components/elements/AudioOutput";
import { ClientStatus } from "@/components/elements/ClientStatus";
import ConnectButton from "@/components/elements/ConnectButton";
import PipecatLogo from "@/components/elements/PipecatLogo";
import { SessionInfo } from "@/components/elements/SessionInfo";
import UserAudio from "@/components/elements/UserAudio";
import UserVideo from "@/components/elements/UserVideo";
import { BotAudioPanel } from "@/components/panels/BotAudioPanel";
import { BotVideoPanel } from "@/components/panels/BotVideoPanel";
import ConversationPanel from "@/components/panels/ConversationPanel";
import { EventsPanel } from "@/components/panels/EventsPanel";
import { InfoPanel } from "@/components/panels/InfoPanel";
import ThemeModeToggle from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BotIcon,
  ChevronsLeftRightEllipsisIcon,
  InfoIcon,
  MessagesSquareIcon,
  MicIcon,
} from "@/icons";
import {
  RTVIClient,
  type RTVIClientOptions,
  type RTVIClientParams,
  Transport,
} from "@pipecat-ai/client-js";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import deepEqual from "fast-deep-equal";
import { useEffect, useMemo, useRef, useState } from "react";

export interface ConsoleTemplateProps {
  audioCodec?: string;
  clientOptions?: Partial<RTVIClientOptions>;
  onConnect: () => Promise<Response>;
  transportType?: "daily" | "smallwebrtc";
  videoCodec?: string;
}

const defaultParams: RTVIClientParams = {
  baseUrl: "noop",
};

export const ConsoleTemplate: React.FC<ConsoleTemplateProps> = ({
  audioCodec = "default",
  clientOptions = {
    params: defaultParams,
  },
  onConnect,
  transportType = "daily",
  videoCodec = "default",
}) => {
  const [isBotAreaCollapsed, setIsBotAreaCollapsed] = useState(false);
  const [isInfoPanelCollapsed, setIsInfoPanelCollapsed] = useState(false);
  const [isEventsPanelCollapsed, setIsEventsPanelCollapsed] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [participantId, setParticipantId] = useState("");

  const clientRef = useRef<RTVIClient | null>(null);
  const previousClientOptions = useRef<Partial<RTVIClientOptions>>({});

  useEffect(() => {
    if (!deepEqual(previousClientOptions.current, clientOptions)) {
      clientRef.current = null;
    }
    previousClientOptions.current = clientOptions;
  }, [clientOptions]);

  const rtviClient = useMemo(() => {
    if (clientRef.current) {
      return clientRef.current;
    }
    let transport: DailyTransport | SmallWebRTCTransport;
    switch (transportType) {
      case "smallwebrtc":
        transport = new SmallWebRTCTransport();
        if (audioCodec) {
          transport.setAudioCodec(audioCodec);
        }
        if (videoCodec) {
          transport.setVideoCodec(videoCodec);
        }
        break;
      case "daily":
      default:
        transport = new DailyTransport();
        transport.dailyCallClient.on("meeting-session-updated", (event) => {
          setSessionId(event.meetingSession.id);
        });
        break;
    }
    const client = new RTVIClient({
      enableCam: false,
      enableMic: true,
      customConnectHandler: (async (_params, timeout) => {
        if (transportType === "smallwebrtc") {
          return Promise.resolve();
        }
        try {
          const response = await onConnect();
          clearTimeout(timeout);
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(
            new Error(`Connection failed: ${response.status}`),
          );
        } catch (err) {
          return Promise.reject(err);
        }
      }) as (
        params: RTVIClientParams,
        timeout: NodeJS.Timeout | undefined,
        abortController: AbortController,
      ) => Promise<void>,
      ...clientOptions,
      params: {
        ...(clientOptions.params ?? defaultParams),
      },
      transport: (clientOptions?.transport as Transport) ?? transport,
      callbacks: {
        onParticipantJoined: (participant) => {
          setParticipantId(participant.id || "");
          clientOptions?.callbacks?.onParticipantJoined?.(participant);
        },
        onTrackStarted(track, participant) {
          if (participant?.id && participant.local)
            setParticipantId(participant.id);
          clientOptions?.callbacks?.onTrackStarted?.(track, participant);
        },
      },
    });
    client.initDevices();
    clientRef.current = client;
    return client;
  }, [audioCodec, clientOptions, onConnect, transportType, videoCodec]);

  const handleConnect = async () => {
    try {
      await rtviClient.connect();
    } catch {
      await rtviClient.disconnect();
    }
  };

  const handleDisconnect = async () => {
    await rtviClient.disconnect();
  };

  return (
    <RTVIClientProvider client={rtviClient!}>
      <div className="grid grid-cols-1 grid-rows-[min-content_1fr] sm:grid-rows-[min-content_1fr_auto] h-full w-full overflow-auto">
        <div className="flex items-center justify-between p-2 bg-background sm:relative top-0 w-full z-10">
          <PipecatLogo className="h-6 w-auto" />
          <strong className="hidden sm:block">Pipecat Playground</strong>
          <div className="flex items-center gap-4">
            <ThemeModeToggle />
            <ConnectButton
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel defaultSize={70} minSize={50}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                  className="flex flex-col gap-2 p-2"
                  defaultSize={15}
                  maxSize={30}
                  minSize={9}
                  collapsible
                  collapsedSize={8}
                  onCollapse={() => setIsBotAreaCollapsed(true)}
                  onExpand={() => setIsBotAreaCollapsed(false)}
                >
                  <BotAudioPanel
                    className="max-h-[calc(50%-4px)] mt-auto"
                    collapsed={isBotAreaCollapsed}
                  />
                  <BotVideoPanel
                    className="max-h-[calc(50%-4px)] mb-auto"
                    collapsed={isBotAreaCollapsed}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  className="h-full p-2"
                  defaultSize={60}
                  minSize={40}
                >
                  <ConversationPanel />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                  id="info-panel"
                  collapsible
                  collapsedSize={4}
                  minSize={15}
                  defaultSize={20}
                  onCollapse={() => setIsInfoPanelCollapsed(true)}
                  onExpand={() => setIsInfoPanelCollapsed(false)}
                  className="p-2"
                >
                  {isInfoPanelCollapsed ? (
                    <div className="flex flex-col items-center justify-center gap-4 h-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronsLeftRightEllipsisIcon size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="left">
                          <ClientStatus />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MicIcon size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="flex flex-col gap-2"
                          side="left"
                        >
                          <UserAudio />
                          <UserVideo />
                          <AudioOutput />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <InfoIcon size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="left">
                          <SessionInfo
                            sessionId={sessionId}
                            participantId={participantId}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <InfoPanel
                      participantId={participantId}
                      sessionId={sessionId}
                    />
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              collapsible
              collapsedSize={4}
              minSize={7}
              onCollapse={() => setIsEventsPanelCollapsed(true)}
              onExpand={() => setIsEventsPanelCollapsed(false)}
            >
              <EventsPanel collapsed={isEventsPanelCollapsed} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <Tabs
          defaultValue="bot"
          className="flex flex-col gap-0 sm:hidden overflow-hidden"
        >
          <div className="flex flex-col overflow-hidden">
            <TabsContent
              value="bot"
              className="flex-1 overflow-auto flex flex-col gap-4 p-2"
            >
              <BotAudioPanel />
              <BotVideoPanel />
            </TabsContent>
            <TabsContent value="conversation" className="flex-1 overflow-auto">
              <ConversationPanel />
            </TabsContent>
            <TabsContent value="info" className="flex-1 overflow-auto p-2">
              <InfoPanel participantId={participantId} sessionId={sessionId} />
            </TabsContent>
            <TabsContent value="events" className="flex-1 overflow-auto">
              <EventsPanel />
            </TabsContent>
          </div>
          <TabsList className="w-full h-12 rounded-none z-10 mt-auto shrink-0">
            <TabsTrigger value="bot">
              <BotIcon />
            </TabsTrigger>
            <TabsTrigger value="conversation">
              <MessagesSquareIcon />
            </TabsTrigger>
            <TabsTrigger value="info">
              <InfoIcon />
            </TabsTrigger>
            <TabsTrigger value="events">
              <ChevronsLeftRightEllipsisIcon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <RTVIClientAudio />
      </div>
    </RTVIClientProvider>
  );
};
