import type { Story, StoryDefault } from "@ladle/react";
import { type CardProps, FullScreenContainer } from "../ui";
import { ControlBar, ControlBarDivider } from "./ControlBar";

export default {
  title: "Components / Control Bar",
  args: {
    noGradientBorder: false,
    noShadow: false,
    size: "default",
  },
} satisfies StoryDefault;

export const Default: Story = ({ ...props }: CardProps) => (
  <FullScreenContainer>
    <ControlBar {...props}>
      aa
      <ControlBarDivider />
      bb
    </ControlBar>
  </FullScreenContainer>
);

Default.storyName = "Default";
