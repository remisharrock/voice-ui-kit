import type { Story, StoryDefault } from "@ladle/react";
import { Badge } from "./badge";
import { Progress } from "./progress";

export default {
  title: "Primitives",
} satisfies StoryDefault;

export const Default: Story<typeof Progress> = ({ ...props }) => (
  <div className="vkui:flex vkui:flex-col vkui:gap-4 vkui:w-fit">
    <div className="vkui:flex vkui:flex-row vkui:gap-4 vkui:w-fit vkui:h-4">
      <Progress {...props} />
      <Progress {...props} percent={50} />
      <Progress {...props} percent={100} />
    </div>
    <div className="vkui:flex vkui:flex-col vkui:gap-4 vkui:w-fit">
      <Progress {...props} percent={50} color="secondary" />
      <Progress {...props} percent={50} color="destructive" />
      <Progress {...props} percent={50} color="warning" />
      <Progress {...props} percent={50} color="active" />
      <Progress {...props} percent={50} color="inactive" />
      <Progress {...props} percent={50} color="agent" />
      <Progress {...props} percent={50} color="client" />
    </div>

    <Badge buttonSizing>
      <Progress {...props} percent={50} size="lg" className="vkui:h-[2px]" />
      Some Badge
    </Badge>
  </div>
);

Default.argTypes = {
  size: {
    options: ["default", "half", "xs", "sm", "lg", "xl"],
    control: { type: "select" },
    defaultValue: "default",
  },
};

Default.storyName = "Progress";
