import { Card, CardContent } from "@/components/ui/card";
import type { Story, StoryDefault } from "@ladle/react";

export default {
  title: "Primitives",
} satisfies StoryDefault;

export const Default: Story = () => (
  <div className="vkui:flex vkui:flex-col vkui:gap-8">
    <Card size="default">
      <CardContent>Card with gradient border</CardContent>
    </Card>

    <Card noGradientBorder size="default">
      <CardContent>Card without gradient border</CardContent>
    </Card>

    <Card size="lg">
      <CardContent>Card with lg size</CardContent>
    </Card>

    <Card size="sm">
      <CardContent>Card with sm size</CardContent>
    </Card>

    <Card destructive>
      <CardContent>Card with destructive state</CardContent>
    </Card>
  </div>
);

Default.storyName = "Card";
