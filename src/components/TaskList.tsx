import type { Task } from "../types/task";
import TaskItem from "./TaskItem";
import TaskItemRow from "./TaskItemRow";

type Props = {
  tasks: Task[];
  view: "list" | "grid";
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
};

export default function TaskList({
  tasks,
  view,
  updateTask,
  deleteTask,
}: Props) {
  if (!tasks.length) {
    return <p className="text-gray-500">No tasks yet</p>;
  }

  return (
    <div
      className={
        view === "grid"
          ? "grid items-start gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "flex flex-col gap-2"
      }
    >
      {tasks.map((t) =>
        view === "grid" ? (
          <TaskItem
            key={t.id}
            task={t}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ) : (
          <TaskItemRow
            key={t.id}
            task={t}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ),
      )}
    </div>
  );
}
