import Conversation from "@/components/elements/Conversation";
import Metrics from "@/components/elements/Metrics";
import { Panel, PanelContent, PanelHeader } from "@/components/ui/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChartIcon, MessagesSquareIcon } from "@/icons";

interface Props {
  noConversation?: boolean;
  noMetrics?: boolean;
}

export const ConversationPanel: React.FC<Props> = ({
  noConversation = false,
  noMetrics = false,
}) => {
  const defaultValue = noConversation ? "metrics" : "conversation";
  return (
    <Tabs className="h-full" defaultValue={defaultValue}>
      <Panel className="h-full max-sm:border-none">
        <PanelHeader>
          <TabsList>
            {!noConversation && (
              <TabsTrigger className="text-mono-upper" value="conversation">
                <MessagesSquareIcon size={16} />
                Conversation
              </TabsTrigger>
            )}
            {!noMetrics && (
              <TabsTrigger className="text-mono-upper" value="metrics">
                <LineChartIcon size={16} />
                Metrics
              </TabsTrigger>
            )}
          </TabsList>
        </PanelHeader>
        <PanelContent className="p-0! overflow-hidden h-full">
          {!noConversation && (
            <TabsContent
              value="conversation"
              className="overflow-hidden h-full"
            >
              <Conversation />
            </TabsContent>
          )}
          {!noMetrics && (
            <TabsContent value="metrics" className="h-full">
              <Metrics />
            </TabsContent>
          )}
        </PanelContent>
      </Panel>
    </Tabs>
  );
};
export default ConversationPanel;
