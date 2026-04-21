export type Priority = "low" | "medium" | "high";
export type Status = "complete" | "pending";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
}
