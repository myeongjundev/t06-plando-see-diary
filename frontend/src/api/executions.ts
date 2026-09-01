import { request } from "./tasks";

export interface ExecutionInput {
  startedAt: string;
  endedAt: string;
  actualMinutes: number;
  blockerReason: string;
}

export interface ExecutionLog extends ExecutionInput {
  id: string;
  taskId: string;
  durationUnit: "minutes";
  createdAt: string;
}

export interface CompletionEvent {
  id: string;
  taskId: string;
  idempotencyKey: string;
  completedAt: string;
}

export async function listExecutions(taskId: string) {
  return (await request<{ executions: ExecutionLog[] }>(`/api/tasks/${taskId}/executions`)).executions;
}

export async function createExecution(taskId: string, input: ExecutionInput) {
  return (await request<{ execution: ExecutionLog }>(`/api/tasks/${taskId}/executions`, {
    method: "POST", body: JSON.stringify(input),
  })).execution;
}

export async function listCompletions(taskId: string) {
  return (await request<{ completionEvents: CompletionEvent[] }>(`/api/tasks/${taskId}/completions`)).completionEvents;
}
