import { useState, useEffect } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import TaskSummary from "./components/TaskSummary";

export default function App() {
  const tasksState = useTasks();

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("dark") === "true";
    if (saved) document.documentElement.classList.add("dark");
    return saved;
  });

  const [view, setView] = useState<"list" | "grid">(() => {
    return localStorage.getItem("view") === "grid" ? "grid" : "list";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("dark", String(dark));
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-700 dark:text-gray-200">
            Task Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark(!dark)}
              aria-pressed={dark}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              {dark ? "Light" : "Dark"}
            </button>
            <button
              onClick={() => setView(view === "list" ? "grid" : "list")}
              aria-pressed={view === "grid"}
              title={
                view === "list" ? "Switch to grid view" : "Switch to list view"
              }
              className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              {view === "list" ? "Grid View" : "List View"}
            </button>
          </div>
        </div>

        <TaskForm addTask={tasksState.addTask} />
        <TaskFilters
          search={tasksState.search}
          setSearch={tasksState.setSearch}
          statusFilter={tasksState.statusFilter}
          setStatusFilter={tasksState.setStatusFilter}
          priorityFilter={tasksState.priorityFilter}
          setPriorityFilter={tasksState.setPriorityFilter}
        />
        <TaskList
          tasks={tasksState.tasks}
          updateTask={tasksState.updateTask}
          deleteTask={tasksState.deleteTask}
          view={view}
        />
      </div>
      <TaskSummary tasks={tasksState.tasks} />
    </div>
  );
}
