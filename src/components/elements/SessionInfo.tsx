import CopyText from "@/components/elements/CopyText";
import DataList from "@/components/elements/DataList";
import Daily from "@daily-co/daily-js";
import { usePipecatClient } from "@pipecat-ai/client-react";

export const SessionInfo: React.FC<{
  sessionId?: string;
  participantId?: string;
}> = ({ sessionId, participantId }) => {
  const client = usePipecatClient();

  let transportTypeName = "Unknown";
  if (client && "dailyCallClient" in client.transport) {
    transportTypeName = `Daily (v${Daily.version()})`;
  } else if (
    // @ts-expect-error - __proto__ not typed
    client?.transport.__proto__.constructor.SERVICE_NAME ===
    "small-webrtc-transport"
  ) {
    transportTypeName = "Small WebRTC";
  }

  return (
    <DataList
      className="vkui:w-full vkui:overflow-hidden"
      data={{
        Transport: transportTypeName,
        "Session ID": sessionId ? (
          <CopyText
            className="vkui:justify-end"
            iconSize={12}
            text={sessionId}
          />
        ) : (
          "---"
        ),
        "Participant ID": participantId ? (
          <CopyText
            className="vkui:justify-end"
            iconSize={12}
            text={participantId}
          />
        ) : (
          "---"
        ),
        RTVI: client?.version || "---",
      }}
    />
  );
};
