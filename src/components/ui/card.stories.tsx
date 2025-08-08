import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  CardTitle,
} from "@/components/ui/card";
import type { Story, StoryDefault } from "@ladle/react";

export default {
  title: "Primitives",
} satisfies StoryDefault;

export const Default: Story<CardProps> = (props) => (
  <Card {...props}>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
    </CardHeader>
    <CardContent>Card Content 2</CardContent>
    <CardContent>Card Content 1</CardContent>
  </Card>
);

Default.argTypes = {
  size: {
    options: ["sm", "md", "lg", "xl"],
    control: { type: "select" },
    defaultValue: "md",
  },
  shadow: {
    options: ["none", "xshort", "short", "long", "xlong"],
    control: { type: "select" },
    defaultValue: "none",
  },
  rounded: {
    options: ["none", "sm", "md", "lg", "xl"],
    control: { type: "select" },
  },
  variant: {
    options: ["default", "destructive"],
    control: { type: "radio" },
    defaultValue: "default",
  },
  noGradientBorder: {
    control: { type: "boolean" },
    defaultValue: true,
  },
  className: {
    control: { type: "text" },
    defaultValue: "",
  },
};

Default.storyName = "Card";
