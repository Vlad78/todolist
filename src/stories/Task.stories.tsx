import { useSelector } from 'react-redux';

import { TaskType } from '../AppRedux';
import { AppRootStateType } from '../redux/store';
import { Task } from '../Task';
import ReduxStoreProviderDecorator from './ReduxStoreProviderDecorator';


import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta<typeof Task> = {
  title: "TODOLISTS/Task",
  component: Task,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    task: {},
  },
  args: {},
  decorators: [ReduxStoreProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof meta>;

const TaskWrapper = () => {
  const task = useSelector<AppRootStateType, TaskType>((state) => state.tasks["todolistId1"][0]);

  if (task === undefined) return "No tasks left. Reload the page.";

  return (
    <Task
      task={task}
      todolist={{ id: "todolistId1", title: "What to learn", filter: "all", entityStatus: "idle" }}
    />
  );
};

export const TaskStory: Story = {
  render: () => <TaskWrapper />,
};
