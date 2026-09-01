import type { Priority } from "./plans";

export type TaskStatus = "active" | "completed";

export interface Task {
  id: string;
  planId: string;
  content: string;
  status: TaskStatus;
  dueDate: string;
  priority: Priority;
  tags: string[];
  estimatedMinutes: number;
  durationUnit: "minutes";
  completedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  content: string;
  dueDate: string;
  priority: Priority;
  tags: string[];
  estimatedMinutes: number;
}

export interface TaskFilters {
  q?: string;
  status?: TaskStatus | "";
  priority?: Priority | "";
  tag?: string;
}

interface ApiErrorBody {
  error?: { message?: string; details?: Record<string, string> };
}

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (response.status === 204) return undefined as T;
  const body = (await response.json()) as T & ApiErrorBody;
  if (!response.ok) {
    const detail = body.error?.details ? Object.values(body.error.details)[0] : undefined;
    throw new Error(detail ?? body.error?.message ?? "요청을 처리하지 못했습니다.");
  }
  return body;
}

export async function listTasks(planId: string, filters: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const suffix = params.size ? `?${params.toString()}` : "";
  return (await request<{ tasks: Task[] }>(`/api/plans/${planId}/tasks${suffix}`)).tasks;
}

export async function createTask(planId: string, input: TaskInput): Promise<Task> {
  return (
    await request<{ task: Task }>(`/api/plans/${planId}/tasks`, {
      method: "POST",
      body: JSON.stringify(input),
    })
  ).task;
}

export async function updateTask(id: string, input: Partial<TaskInput>): Promise<Task> {
  return (
    await request<{ task: Task }>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    })
  ).task;
}

export async function completeTask(id: string, idempotencyKey: string): Promise<Task> {
  return (await request<{ task: Task }>(`/api/tasks/${id}/complete`, {
    method: "POST", body: JSON.stringify({ idempotencyKey }),
  })).task;
}

export async function reopenTask(id: string): Promise<Task> {
  return (await request<{ task: Task }>(`/api/tasks/${id}/reopen`, { method: "POST" })).task;
}

export async function deleteTask(id: string): Promise<void> {
  await request<void>(`/api/tasks/${id}`, { method: "DELETE" });
}

