import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Card } from "~/components/card";

const meta = {
  title: "Card",
  component: Card,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },

  decorators: [
    (Story) => (
      <div className="main">
        <Story />
      </div>
    ),
  ],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const NoCard: Story = {
  args: { active: false, title: "No active card in reader" },
};

export const UnknownCard: Story = {
  args: {
    active: true,
    title: "Unknown card in reader",
    action: { title: "Add", onClick: fn() },
  },
};
