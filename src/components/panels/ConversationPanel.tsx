import Conversation from "@/components/elements/Conversation";
import Metrics from "@/components/elements/Metrics";
import { Panel, PanelContent, PanelHeader } from "@/components/ui/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChartIcon, MessagesSquareIcon } from "lucide-react";

export const ConversationPanel: React.FC = () => {
  return (
    <Tabs className="h-full" defaultValue="conversation">
      <Panel className="h-full max-sm:border-none">
        <PanelHeader>
          <TabsList>
            <TabsTrigger className="text-mono-upper" value="conversation">
              <MessagesSquareIcon size={16} />
              Conversation
            </TabsTrigger>
            <TabsTrigger className="text-mono-upper" value="metrics">
              <LineChartIcon size={16} />
              Metrics
            </TabsTrigger>
          </TabsList>
        </PanelHeader>
        <PanelContent className="p-0! overflow-hidden h-full">
          <TabsContent value="conversation" className="overflow-hidden h-full">
            <Conversation />
          </TabsContent>
          <TabsContent value="metrics" className="h-full">
            <Metrics />
          </TabsContent>
        </PanelContent>
      </Panel>
    </Tabs>
  );
};
export default ConversationPanel;
