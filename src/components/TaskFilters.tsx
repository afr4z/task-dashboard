import type { Priority, Status } from "../types/task";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (v: Status | "all") => void;
  priorityFilter: Priority | "all";
  setPriorityFilter: (v: Priority | "all") => void;
};

export default function TaskFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: Props) {
  const base = "px-3 py-1 text-sm rounded-full transition cursor-pointer";

  const active = "bg-gray-800 text-white";
  const idle = "bg-gray-200 dark:bg-gray-400 text-gray-700 hover:bg-gray-300";

  return (
    <div className="mb-4 space-y-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="w-full bg-white dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 text-sm shadow-sm outline-none"
      />

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "complete"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as Status | "all")}
            className={`${base} ${statusFilter === s ? active : idle}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "low", "medium", "high"].map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p as Priority | "all")}
            className={`${base} ${priorityFilter === p ? active : idle}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
