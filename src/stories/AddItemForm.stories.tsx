import { fn } from "@storybook/test";

import { AddItemForm } from "../AddItemForm";

import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta<typeof AddItemForm> = {
  title: "TODOLISTS/AddItemForm",
  component: AddItemForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    addItem: {
      description: "add todolist",
      name: "Add todolist",
    },
  },
  args: {
    addItem: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AddItemFormStory: Story = {
  //   args: {
  // primary: true,
  // label: 'Button',
  //   },
};

// export const AddItemFormStory1 = () => <AddItemForm addItem={action("addItem")}/> // action где-то в аддоне лежит

// export const AddItemFormStoryError: Story = {

// }
