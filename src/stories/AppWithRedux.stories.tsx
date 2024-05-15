import { Provider } from "react-redux";

import { fn } from "@storybook/test";

import App from "../AppRedux";
import { store } from "../redux/store";

import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta<typeof App> = {
  title: "TODOLISTS/AppWithRedux",
  component: App,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AppRedux: Story = {
  render: () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  },
};
