"use client";

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
import { useTheme } from "@/components/ThemeProvider";
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
import { cn } from "@/lib/utils";
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
import { useEffect, useRef, useState } from "react";

export interface ConsoleTemplateProps {
  /**
   * Sets the audio codec. Only applicable for SmallWebRTC transport.
   * Defaults to "default" which uses the browser's default codec.
   */
  audioCodec?: string;
  /**
   * Options for configuring the RTVI client.
   */
  clientOptions?: Partial<RTVIClientOptions>;
  /**
   * Disables audio output for the bot. The bot may still send audio, but it won't be played.
   */
  noAudioOutput?: boolean;
  /**
   * Disables audio visualization for the bot.
   * The bot may still send audio, but it won't be visualized.
   */
  noBotAudio?: boolean;
  /**
   * Disables video visualization for the bot.
   * The bot may still send video, but it won't be displayed.
   */
  noBotVideo?: boolean;
  /**
   * Disables the conversation panel.
   * The bot may still send messages, but they won't be displayed.
   */
  noConversation?: boolean;
  /**
   * Disables the logo in the header.
   */
  noLogo?: boolean;
  /**
   * Disables the metrics panel.
   * The bot may still send metrics, but they won't be displayed.
   */
  noMetrics?: boolean;
  /**
   * Disables the theme switcher in the header.
   * Useful when there's an application-level theme switcher or when the theme is controlled globally.
   */
  noThemeSwitch?: boolean;
  /**
   * Disables user audio input entirely.
   */
  noUserAudio?: boolean;
  /**
   * Disables user video input entirely.
   */
  noUserVideo?: boolean;
  onConnect: () => Promise<Response>;
  /**
   * Title displayed in the header.
   * Defaults to "Pipecat Playground".
   */
  title?: string;
  /**
   * Type of transport to use for the RTVI client.
   * - "daily" for Daily Transport
   * - "smallwebrtc" for SmallWebRTC Transport
   * Defaults to "daily".
   */
  transportType?: "daily" | "smallwebrtc";
  /**
   * Sets the video codec. Only applicable for SmallWebRTC transport.
   * Defaults to "default" which uses the browser's default codec.
   */
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
  noAudioOutput = false,
  noBotAudio = false,
  noBotVideo = false,
  noConversation = false,
  noLogo = false,
  noMetrics = false,
  noThemeSwitch = false,
  noUserAudio = false,
  noUserVideo = false,
  title = "Pipecat Playground",
  transportType = "daily",
  videoCodec = "default",
}) => {
  const [isBotAreaCollapsed, setIsBotAreaCollapsed] = useState(false);
  const [isInfoPanelCollapsed, setIsInfoPanelCollapsed] = useState(false);
  const [isEventsPanelCollapsed, setIsEventsPanelCollapsed] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [rtviClient, setRtviClient] = useState<RTVIClient | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  const clientRef = useRef<RTVIClient | null>(null);
  const previousClientOptions = useRef<Partial<RTVIClientOptions>>({});

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!deepEqual(previousClientOptions.current, clientOptions)) {
      clientRef.current = null;
    }
    previousClientOptions.current = clientOptions;
  }, [clientOptions]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    if (clientRef.current) {
      setRtviClient(clientRef.current);
      setIsClientReady(true);
      return;
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
      enableCam: !noUserVideo,
      enableMic: !noUserAudio,
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
    setRtviClient(client);
    setIsClientReady(true);
  }, [audioCodec, clientOptions, onConnect, transportType, videoCodec]);

  const handleConnect = async () => {
    if (!rtviClient) return;
    try {
      await rtviClient.connect();
    } catch {
      await rtviClient.disconnect();
    }
  };

  const handleDisconnect = async () => {
    if (!rtviClient) return;
    await rtviClient.disconnect();
  };

  // Return loading state until client is ready (prevents hydration mismatch)
  if (!isClientReady || !rtviClient) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div>Loading...</div>
      </div>
    );
  }

  const noBotArea = noBotAudio && noBotVideo;
  const noConversationPanel = noConversation && noMetrics;
  const noDevices = noAudioOutput && noUserAudio && noUserVideo;

  return (
    <RTVIClientProvider client={rtviClient}>
      <div className="grid grid-cols-1 grid-rows-[min-content_1fr] sm:grid-rows-[min-content_1fr_auto] h-full w-full overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-[150px_1fr_150px] gap-2 items-center justify-center p-2 bg-background sm:relative top-0 w-full z-10">
          {noLogo ? (
            <span className="h-6" />
          ) : (
            <PipecatLogo
              className="h-6 w-auto"
              color={resolvedTheme === "dark" ? "#ffffff" : "#171717"}
            />
          )}
          <strong className="hidden sm:block text-center">{title}</strong>
          <div className="flex items-center justify-end gap-4">
            {!noThemeSwitch && <ThemeModeToggle />}
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
                {!noBotArea && (
                  <>
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
                      {!noBotAudio && (
                        <BotAudioPanel
                          className={cn({
                            "max-h-[calc(50%-4px)] mt-auto": !noBotVideo,
                          })}
                          collapsed={isBotAreaCollapsed}
                        />
                      )}
                      {!noBotVideo && (
                        <BotVideoPanel
                          className={cn({
                            "max-h-[calc(50%-4px)] mb-auto": !noBotAudio,
                          })}
                          collapsed={isBotAreaCollapsed}
                        />
                      )}
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}
                {!noConversationPanel && (
                  <>
                    <ResizablePanel
                      className="h-full p-2"
                      defaultSize={60}
                      minSize={40}
                    >
                      <ConversationPanel
                        noConversation={noConversation}
                        noMetrics={noMetrics}
                      />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}
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
                      {!noDevices && (
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
                            {!noUserAudio && <UserAudio />}
                            {!noUserVideo && <UserVideo />}
                            {!noAudioOutput && <AudioOutput />}
                          </PopoverContent>
                        </Popover>
                      )}
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
                      noAudioOutput={noAudioOutput}
                      noUserAudio={noUserAudio}
                      noUserVideo={noUserVideo}
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
          defaultValue={
            noBotArea ? (noConversationPanel ? "info" : "conversation") : "bot"
          }
          className="flex flex-col gap-0 sm:hidden overflow-hidden"
        >
          <div className="flex flex-col overflow-hidden">
            {!noBotArea && (
              <TabsContent
                value="bot"
                className="flex-1 overflow-auto flex flex-col gap-4 p-2"
              >
                {!noBotAudio && <BotAudioPanel />}
                {!noBotVideo && <BotVideoPanel />}
              </TabsContent>
            )}
            {!noConversationPanel && (
              <TabsContent
                value="conversation"
                className="flex-1 overflow-auto"
              >
                <ConversationPanel
                  noConversation={noConversation}
                  noMetrics={noMetrics}
                />
              </TabsContent>
            )}
            <TabsContent value="info" className="flex-1 overflow-auto p-2">
              <InfoPanel
                noAudioOutput={noAudioOutput}
                noUserAudio={noUserAudio}
                noUserVideo={noUserVideo}
                participantId={participantId}
                sessionId={sessionId}
              />
            </TabsContent>
            <TabsContent value="events" className="flex-1 overflow-auto">
              <EventsPanel />
            </TabsContent>
          </div>
          <TabsList className="w-full h-12 rounded-none z-10 mt-auto shrink-0">
            {!noBotArea && (
              <TabsTrigger value="bot">
                <BotIcon />
              </TabsTrigger>
            )}
            {!noConversationPanel && (
              <TabsTrigger value="conversation">
                <MessagesSquareIcon />
              </TabsTrigger>
            )}
            <TabsTrigger value="info">
              <InfoIcon />
            </TabsTrigger>
            <TabsTrigger value="events">
              <ChevronsLeftRightEllipsisIcon />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {!noAudioOutput && <RTVIClientAudio />}
      </div>
    </RTVIClientProvider>
  );
};
