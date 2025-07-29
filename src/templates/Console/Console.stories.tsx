import { FullScreenContainer } from "@/components/ui";
import type { StoryDefault } from "@ladle/react";
import { ConsoleTemplate } from "./index";

export default {
  title: "Templates / Console",
} satisfies StoryDefault;

export const Default = () => (
  <FullScreenContainer>
    <ConsoleTemplate
      transportType="smallwebrtc"
      connectParams={{
        connectionUrl: "/api/offer",
      }}
      noUserVideo={true}
    />
  </FullScreenContainer>
);
Default.meta = { iframed: false };
