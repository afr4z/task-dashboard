import type { Task } from "../types/task";

type Props = {
  task: Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
};

export default function TaskItemRow({ task, updateTask, deleteTask }: Props) {
  const isDone = task.status === "complete";

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition ${
        isDone ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-4 h-4 rounded-full ${
            task.priority === "low"
              ? "bg-green-400"
              : task.priority === "medium"
                ? "bg-yellow-400"
                : "bg-red-400"
          }`}
        />

        <div className="flex flex-col">
          <span
            className={`text-lg font-medium ${
              isDone
                ? "line-through text-gray-400"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {task.title}
          </span>
          <span
            className={`text-sm font-medium ${
              isDone
                ? "line-through text-gray-400"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {task.description}
          </span>

          <span className="text-xs text-gray-500">
            {task.dueDate || "No due date"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            updateTask(task.id, {
              status: isDone ? "pending" : "complete",
            })
          }
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
        >
          {task.status === "complete" ? "↩️" : "✔️"}
        </button>

        <button
          title="Delete task"
          onClick={() => deleteTask(task.id)}
          className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
        >
          ❌
        </button>
      </div>
    </div>
  );
}
