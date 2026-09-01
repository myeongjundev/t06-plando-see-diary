import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Plan, Priority } from "../../api/plans";
import {
  completeTask,
  createTask,
  deleteTask,
  listTasks,
  reopenTask,
  Task,
  TaskFilters,
  TaskInput,
  updateTask,
} from "../../api/tasks";

function tomorrow(): string {
  const value = new Date();
  value.setDate(value.getDate() + 1);
  return value.toISOString().slice(0, 10);
}

const EMPTY_TASK: TaskInput = {
  content: "",
  dueDate: tomorrow(),
  priority: "medium",
  tags: [],
  estimatedMinutes: 30,
};

interface Props {
  plans: Plan[];
}

export default function TaskPanel({ plans }: Props) {
  const [planId, setPlanId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskInput>(EMPTY_TASK);
  const [tagText, setTagText] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({ q: "", status: "", priority: "", tag: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!planId && plans[0]) setPlanId(plans[0].id);
  }, [planId, plans]);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === planId), [planId, plans]);

  async function refresh(currentPlanId = planId, currentFilters = filters) {
    if (!currentPlanId) {
      setTasks([]);
      return;
    }
    try {
      setTasks(await listTasks(currentPlanId, currentFilters));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "할 일을 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(planId, filters), 180);
    return () => window.clearTimeout(timer);
  }, [planId, filters.q, filters.status, filters.priority, filters.tag]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!planId) return;
    setBusy(true);
    try {
      await createTask(planId, {
        ...form,
        tags: tagText.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      setForm({ ...EMPTY_TASK, dueDate: form.dueDate });
      setTagText("");
      setMessage("할 일을 서버 데이터베이스에 저장했습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "할 일을 저장하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(task: Task) {
    try {
      if (task.status === "completed") await reopenTask(task.id);
      else await completeTask(task.id);
      setMessage(task.status === "completed" ? "할 일을 진행 중으로 되돌렸습니다." : "할 일을 완료했습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상태를 바꾸지 못했습니다.");
    }
  }

  function beginEdit(task: Task) {
    setEditingId(task.id);
    setEditContent(task.content);
  }

  async function saveEdit(event: FormEvent, task: Task) {
    event.preventDefault();
    try {
      await updateTask(task.id, { content: editContent });
      setEditingId(null);
      setMessage("할 일 내용을 고쳤습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "할 일을 고치지 못했습니다.");
    }
  }

  async function confirmDelete(task: Task) {
    try {
      await deleteTask(task.id);
      setPendingDeleteId(null);
      setMessage("선택한 할 일을 삭제했습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "할 일을 삭제하지 못했습니다.");
    }
  }

  return (
    <section className="panel task-panel">
      <div className="section-heading">
        <div><span>02</span><h2>Tasks · 할 일 다루기</h2></div>
        <p>찾고, 걸러 보고, 같은 기준으로 정렬합니다.</p>
      </div>

      {plans.length === 0 ? (
        <p className="empty">먼저 계획을 하나 저장하세요.</p>
      ) : (
        <>
          <label>할 일을 연결할 계획
            <select value={planId} onChange={(event) => setPlanId(event.target.value)}>
              {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.title}</option>)}
            </select>
          </label>

          <form className="task-form" onSubmit={submit}>
            <label>할 일<input value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="실제로 할 일을 입력하세요" required /></label>
            <div className="grid three">
              <label>마감일<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required /></label>
              <label>우선순위<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })}><option value="high">높음</option><option value="medium">보통</option><option value="low">낮음</option></select></label>
              <label>예상 시간(분)<input type="number" min="0" value={form.estimatedMinutes} onChange={(event) => setForm({ ...form, estimatedMinutes: Number(event.target.value) })} required /></label>
            </div>
            <label>태그<input value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="backend, test처럼 쉼표로 구분" /></label>
            <button className="primary" disabled={busy}>{busy ? "추가 중…" : "할 일 추가"}</button>
          </form>

          <div className="task-tools" aria-label="할 일 검색과 필터">
            <label>검색<input value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} placeholder="내용 또는 태그 검색" /></label>
            <label>상태<select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as TaskFilters["status"] })}><option value="">전체</option><option value="active">진행 중</option><option value="completed">완료</option></select></label>
            <label>우선순위<select value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value as TaskFilters["priority"] })}><option value="">전체</option><option value="high">높음</option><option value="medium">보통</option><option value="low">낮음</option></select></label>
            <label>태그<input value={filters.tag} onChange={(event) => setFilters({ ...filters, tag: event.target.value })} placeholder="정확한 태그" /></label>
          </div>
          <p className="sort-rule">정렬 기준: 우선순위(높음→보통→낮음) → 마감일 → 생성 시각 → ID</p>
          {message && <p className="message" role="status">{message}</p>}

          <div className="task-list" aria-label={`${selectedPlan?.title ?? "선택한 계획"}의 할 일`}>
            {tasks.length === 0 && <p className="empty">조건에 맞는 할 일이 없습니다.</p>}
            {tasks.map((task) => (
              <article className={`task-row ${task.status}`} key={task.id}>
                <button className="status-button" onClick={() => void changeStatus(task)} aria-label={task.status === "completed" ? `${task.content} 진행 중으로 되돌리기` : `${task.content} 완료로 바꾸기`}>{task.status === "completed" ? "✓" : "○"}</button>
                <div className="task-body">
                  <div className="task-meta"><span className={`priority ${task.priority}`}>{task.priority}</span><span>{task.dueDate}</span><span>{task.estimatedMinutes}분</span></div>
                  <h3>{task.content}</h3>
                  <div className="tags">{task.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
                  <div className="actions"><button onClick={() => beginEdit(task)}>내용 수정</button><button className="danger" onClick={() => setPendingDeleteId(task.id)}>삭제</button></div>
                  {editingId === task.id && <form className="inline-edit" onSubmit={(event) => void saveEdit(event, task)}><label>새 할 일 내용<input value={editContent} onChange={(event) => setEditContent(event.target.value)} autoFocus required /></label><div className="actions"><button className="primary">수정 저장</button><button type="button" onClick={() => setEditingId(null)}>취소</button></div></form>}
                  {pendingDeleteId === task.id && <div className="delete-check" role="alert"><p>이 할 일만 삭제할까요?</p><div className="actions"><button className="danger solid" onClick={() => void confirmDelete(task)}>삭제 확인</button><button onClick={() => setPendingDeleteId(null)}>취소</button></div></div>}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

