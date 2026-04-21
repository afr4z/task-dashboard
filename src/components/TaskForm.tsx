import { useState, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useTaskKeyboard } from "../hooks/useTaskKeyboard";
import type { Priority } from "../types/task";

type Props = {
  addTask: (data: {
    title: string;
    description: string;
    priority: Priority;
    dueDate: string;
  }) => void;
};

export default function TaskForm({ addTask }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("low");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const ref = useRef<HTMLDivElement | null>(null);

  const collapse = () => {
    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");
    setError("");
    setExpanded(false);
  };

  useClickOutside(ref, collapse, expanded);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    addTask({ title: title.trim(), description, priority, dueDate });
    collapse();
  };

  const { handleKeyDown } = useTaskKeyboard({
    onSubmit: handleSubmit,
    onCancel: collapse,
  });

  const priorityBorder = {
    low: "border-green-400",
    medium: "border-yellow-400",
    high: "border-red-400",
  }[priority];

  return (
    <div
      ref={ref}
      onClick={() => !expanded && setExpanded(true)}
      className={`bg-white ${expanded ? "border-l-4" : ""} ${priorityBorder} dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-6 cursor-text`}
    >
      {!expanded ? (
        <p className="text-gray-400">Take a note...</p>
      ) : (
        <div
          className="animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoFocus
            className="w-full text-lg font-medium bg-transparent outline-none mb-2 text-gray-800 dark:text-gray-100"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
          />
          {error && <p className="text-xs text-red-500 mb-2">⚠️ {error}</p>}
          <textarea
            className="w-full text-sm bg-transparent outline-none resize-none mb-2 text-gray-700 dark:text-gray-300"
            placeholder="Take a note..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
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
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleSubmit}
                className="text-sm px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Add
              </button>
              <button
                onClick={collapse}
                className="text-sm px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
