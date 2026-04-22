import { useState, useRef, useCallback, useEffect } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import type { Task, Priority } from "../types/task";

type Props = {
  task: Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
};

export default function TaskItemRow({ task, updateTask, deleteTask }: Props) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [error, setError] = useState("");

  const ref = useRef<HTMLDivElement | null>(null);

  const isDone = task.status === "complete";

  const priorityColor =
    priority === "low"
      ? "bg-green-400"
      : priority === "medium"
        ? "bg-yellow-400"
        : "bg-red-400";

  // Bug fix #3: Sync local state when task prop changes externally,
  // only when not actively editing.
  useEffect(() => {
    if (!editing) {
      setTitle(task.title);
      setDesc(task.description);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    }
  }, [task, editing]);

  // Bug fix #1: useCallback with full dep array including updateTask and task.id
  // so save never closes over a stale version of either.
  const save = useCallback(() => {
    // Bug fix #4: Clear error on every save attempt.
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    updateTask(task.id, {
      title: title.trim(),
      description: desc,
      priority,
      dueDate,
    });

    setEditing(false);
  }, [title, desc, priority, dueDate, updateTask, task.id]);

  // Bug fix #2: Click-outside discards instead of calling save, so clicking
  // outside with an empty title doesn't trap the user in edit mode.
  const discard = useCallback(() => {
    setError("");
    setTitle(task.title);
    setDesc(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditing(false);
  }, [task]);

  useClickOutside(ref, discard, editing);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") discard(); // Bug fix #2 (cont): Escape also discards.
  };

  return (
    <div
      ref={ref}
      onClick={() => !editing && setEditing(true)}
      className={`flex items-center justify-between px-3 py-3 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition ${
        isDone ? "opacity-60" : ""
      }`}
    >
      {/* LEFT */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span
          className={`w-3 h-3 mt-1 rounded-full shrink-0 ${priorityColor}`}
        />

        {editing ? (
          <div
            className="flex flex-col gap-1 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Bug fix #4 (cont): Clear error as soon as user starts correcting.
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium bg-transparent outline-none"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xs bg-transparent outline-none text-gray-600 dark:text-gray-300"
            />

            <div className="flex gap-2 mt-1 flex-wrap">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="text-xs bg-gray-100 dark:bg-gray-700 rounded px-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs bg-gray-100 dark:bg-gray-700 rounded px-1"
              />

              <div className="flex gap-1 ml-auto">
                <button
                  onClick={save}
                  className="text-xs px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Done
                </button>
                <button
                  onClick={discard}
                  className="text-xs px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-w-0">
            <span
              className={`text-sm font-medium break-words ${
                isDone ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </span>

            <span
              className={`text-xs break-words ${
                isDone ? "line-through text-gray-400" : "text-gray-500"
              }`}
            >
              {task.description}
            </span>

            <span className="text-[11px] text-gray-400 mt-1">
              {task.dueDate || "No date"}
            </span>
          </div>
        )}
      </div>

      {/* ACTIONS — only shown in view mode, so stopPropagation is enough */}
      {!editing && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            title={isDone ? "Mark pending" : "Mark complete"}
            onClick={(e) => {
              e.stopPropagation();
              updateTask(task.id, {
                status: isDone ? "pending" : "complete",
              });
            }}
            className="text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDone ? "↩️" : "✔️"}
          </button>

          <button
            title="Delete task"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
}
