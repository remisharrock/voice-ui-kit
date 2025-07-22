import { ErrorCard } from "@/components/ui/error";
import type { Story, StoryDefault } from "@ladle/react";

export default {
  title: "Primitives",
} satisfies StoryDefault;

export const Default: Story<{
  error: string;
}> = ({ error }) => <ErrorCard error={error} />;

Default.args = {
  error: "An error occurred",
};
Default.storyName = "Error Card";
