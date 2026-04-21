import { useState, useRef, useCallback, useEffect } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useTaskKeyboard } from "../hooks/useTaskKeyboard";
import type { Task, Priority } from "../types/task";

type Props = {
  task: Task;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
};

export default function TaskItem({ task, updateTask, deleteTask }: Props) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [error, setError] = useState("");

  const ref = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!editing) {
      setTitle(task.title);
      setDesc(task.description);
      setPriority(task.priority);
      setDueDate(task.dueDate);
    }
  }, [task, editing]);

  useEffect(() => {
    if (editing) {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [editing]);

  const save = useCallback(() => {
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

  const discard = useCallback(() => {
    setError("");
    setTitle(task.title);
    setDesc(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditing(false);
  }, [task]);

  useClickOutside(ref, discard, editing);

  const border = {
    low: "border-green-400",
    medium: "border-yellow-400",
    high: "border-red-400",
  }[priority];

  const { handleKeyDown } = useTaskKeyboard({
    onSubmit: save, // Don't submit on Enter inside textarea
    onCancel: discard,
  });

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div
      ref={ref}
      onClick={() => !editing && setEditing(true)}
      className={`group bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-8 ${border}`}
    >
      {editing ? (
        <div
          className="w-full h-auto min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Bug fix #4 (cont): also clear error as soon as the user starts typing.
              if (error) setError("");
            }}
            className="w-full text-lg mb-2 bg-transparent outline-none text-gray-800 dark:text-gray-100"
            onKeyDown={handleKeyDown}
          />

          {error && <p className="text-xs text-red-500 mb-1">{error}</p>}

          <textarea
            ref={textareaRef}
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
              autoResize();
            }}
            className="w-full mb-2 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 resize-none"
            onKeyDown={handleKeyDown}
          />

          <div className="flex justify-between">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-xs bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
            />

            <div className="flex gap-1">
              <button
                onClick={save}
                className="text-xs px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                Done
              </button>
              <button
                onClick={discard}
                className="text-xs px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Bug fix (dead code): removed the redundant !editing wrapper since
        // this entire branch is already the else side of editing ? ... : ...
        <div className="min-w-0">
          <h3
            className={`break-words font-medium text-lg text-gray-800 dark:text-gray-100 ${
              task.status === "complete"
                ? "line-through text-gray-500 dark:text-gray-400"
                : ""
            }`}
          >
            {task.title}
          </h3>

          <p
            className={`text-sm break-words text-gray-600 dark:text-gray-300 mt-1 ${
              task.status === "complete"
                ? "line-through dark:text-gray-400"
                : ""
            }`}
          >
            {task.description}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            {task.dueDate || "No date"}
          </p>

          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
            <button
              title={
                task.status === "complete"
                  ? "Mark as pending"
                  : "Mark as complete"
              }
              onClick={(e) => {
                e.stopPropagation();
                updateTask(task.id, {
                  status: task.status === "complete" ? "pending" : "complete",
                });
              }}
              className="text-xs px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {task.status === "complete" ? "↩️" : "✔️"}
            </button>

            <button
              title="Delete task"
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
              className="text-xs px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
