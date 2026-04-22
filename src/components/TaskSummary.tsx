import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
};

export default function TaskSummary({ tasks }: Props) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "complete").length;
  const pending = total - completed;

  return (
    <div>
      <div className="flex items-center gap-6 mb-4 text-sm text-gray-500 dark:text-gray-400 justify-center">
        <span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {total}
          </span>{" "}
          total
        </span>
        <span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {pending}
          </span>{" "}
          pending
        </span>
        <span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {completed}
          </span>{" "}
          complete
        </span>
      </div>
    </div>
  );
}
