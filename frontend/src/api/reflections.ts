import { request, Task } from "./tasks";
import type { ExecutionLog } from "./executions";
import type { Plan, PlanInput } from "./plans";

export type Metric = "taskCount" | "completedCount" | "overdueCount" | "blockedTaskCount" | "estimatedMinutes" | "actualMinutes" | "varianceMinutes";
export interface Period { periodStart: string; periodEnd: string }
export type Summary = Record<Metric, number> & Period & {
  planId: string; asOf: string; today: string; scope: "plan" | "dueDate";
  sources: Record<Metric, { taskIds: string[]; executionIds: string[] }>;
  records: { tasks: Task[]; executions: ExecutionLog[] };
};
export interface Reflection extends Period {
  id: string; planId: string; improvement: string; nextPlanId: string | null; createdAt: string;
}
export type NextPlanInput = Omit<PlanInput, "carriedImprovement">;
export function getSummary(planId: string, period: Period | null) {
  const query = period ? `?${new URLSearchParams({ ...period })}` : "";
  return request<Summary>(`/api/plans/${planId}/see${query}`);
}
export async function listReflections(planId: string) {
  return (await request<{ reflections: Reflection[] }>(`/api/plans/${planId}/reflections`)).reflections;
}
export async function saveReflection(planId: string, input: Period & { improvement: string }) {
  return (await request<{ reflection: Reflection }>(`/api/plans/${planId}/reflections`, {
    method: "POST", body: JSON.stringify(input),
  })).reflection;
}
export function createNextPlan(id: string, input: NextPlanInput) {
  return request<{ plan: Plan; reflection: Reflection; replayed: boolean }>(`/api/reflections/${id}/next-plan`, {
    method: "POST", body: JSON.stringify(input),
  });
}
