import AudioOutput from "@/components/elements/AudioOutput";
import { ClientStatus } from "@/components/elements/ClientStatus";
import { SessionInfo } from "@/components/elements/SessionInfo";
import UserAudio from "@/components/elements/UserAudio";
import UserVideo from "@/components/elements/UserVideo";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/ui/panel";

interface Props {
  participantId?: string;
  sessionId?: string;
}

export const InfoPanel: React.FC<Props> = ({ participantId, sessionId }) => {
  return (
    <Panel className="h-full overflow-y-auto overflow-x-hidden">
      <PanelHeader variant="inline">
        <PanelTitle>Status</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <ClientStatus />
      </PanelContent>
      <PanelHeader className="border-t border-t-border" variant="inline">
        <PanelTitle>Devices</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <UserAudio />
        <UserVideo />
        <AudioOutput />
      </PanelContent>
      <PanelHeader className="border-t border-t-border" variant="inline">
        <PanelTitle>Session</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <SessionInfo sessionId={sessionId} participantId={participantId} />
      </PanelContent>
    </Panel>
  );
};
