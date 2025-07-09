import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
  Plasma,
} from "@pipecat-ai/voice-ui-kit";

// Synchro audio désactivée (pas de hook audio utilisé)

interface BotPlasmaPanelProps {
  className?: string;
  collapsed?: boolean;
}

export const BotPlasmaPanel: React.FC<BotPlasmaPanelProps> = ({
  className,
  collapsed = false,
}) => {
  // Plasma non réactif (pas de piste audio)

  return (
    <Panel className={className}>
      {!collapsed && (
        <PanelHeader>
          <PanelTitle>Bot Audio</PanelTitle>
        </PanelHeader>
      )}
      <PanelContent className="vkui:overflow-hidden">
        <div
          className="vkui:relative vkui:aspect-video vkui:flex vkui:max-h-full vkui:overflow-hidden"
          style={{ width: 240, height: 240 }}
        >
          <div className="vkui:m-auto">
            <Plasma width={240} height={240} />
          </div>
        </div>
      </PanelContent>
    </Panel>
  );
};
