import type { Story, StoryDefault } from "@ladle/react";
import { ControlBar } from "./ControlBar";

export default {
  title: "Components / Control Bar",
} satisfies StoryDefault;

export const Default: Story = () => <ControlBar />;

Default.storyName = "Default";
