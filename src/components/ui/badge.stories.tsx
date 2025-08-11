import { TriangleAlertIcon } from "@/icons";
import type { Story, StoryDefault } from "@ladle/react";
import { Badge } from "./badge";
import Button from "./button";

export default {
  title: "Primitives",
} satisfies StoryDefault;

export const Default: Story<typeof Badge> = ({ ...props }) => (
  <div className="vkui:flex vkui:flex-col vkui:gap-4 vkui:w-fit">
    <Badge {...props}>Badge</Badge>
    <Badge {...props} color="secondary">
      Badge
    </Badge>
    <Badge {...props} color="secondary" className="vkui:w-full">
      full width
    </Badge>
    <Badge {...props} color="destructive">
      Badge
    </Badge>
    <Badge {...props} color="warning">
      Badge
    </Badge>
    <Badge {...props} color="active">
      Badge
    </Badge>
    <Badge {...props} color="inactive">
      Badge
    </Badge>
    <Badge {...props} color="agent">
      Badge
    </Badge>
    <Badge {...props} color="client">
      Badge
    </Badge>
    <Badge {...props} variant="elbow">
      Elbow Badge
    </Badge>
    <Badge {...props} variant="elbow" color="active">
      Elbow Badge
    </Badge>
    <Badge {...props} variant="bracket">
      Bracket Badge
    </Badge>
    <Badge {...props} variant="bracket" color="active">
      Active Bracket Badge
    </Badge>
    <Badge {...props}>
      <TriangleAlertIcon />
      Badge with icon
    </Badge>

    <div className="vkui:flex vkui:flex-row vkui:gap-4 vkui:w-fit">
      <Badge {...props} buttonSizing>
        Sized to buttons
      </Badge>
      <Button variant="outline">Button for reference</Button>
    </div>
    <div className="vkui:flex vkui:flex-row vkui:gap-4 vkui:w-fit">
      <Badge {...props} buttonSizing size="sm">
        Sized to buttons
      </Badge>
      <Button variant="outline" size="sm">
        Button for reference
      </Button>
    </div>
    <div className="vkui:flex vkui:flex-row vkui:gap-4 vkui:w-fit">
      <Badge {...props} buttonSizing size="lg">
        Sized to buttons
      </Badge>
      <Button variant="outline" size="lg">
        Button for reference
      </Button>
    </div>
  </div>
);

Default.argTypes = {
  size: {
    options: ["default", "sm", "lg"],
    control: { type: "select" },
    defaultValue: "default",
  },
  color: {
    options: [
      "default",
      "secondary",
      "destructive",
      "active",
      "inactive",
      "warning",
      "agent",
      "client",
    ],
    control: { type: "select" },
    defaultValue: "default",
  },
  variant: {
    options: ["default", "outline", "elbow", "bracket"],
    control: { type: "select" },
    defaultValue: "default",
  },
  noUppercase: {
    control: { type: "boolean" },
    defaultValue: true,
  },
};

Default.storyName = "Badge";
