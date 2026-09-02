import { FormEvent, useEffect, useRef, useState } from "react";
import ExecutionPanel from "./ExecutionPanel";
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
  plan?: Plan;
  onDataChange: () => void;
}

export default function TaskPanel({ plan, onDataChange }: Props) {
  const planId = plan?.id ?? "";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskInput>(EMPTY_TASK);
  const [tagText, setTagText] = useState("");
  // 대부분의 방문은 '적기'가 아니라 '보기'다. 제목 한 줄만 늘 보이고 나머지는 접어 둔다.
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ q: "", status: "", priority: "", tag: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [changingIds, setChangingIds] = useState<string[]>([]);
  const inFlight = useRef(new Set<string>());
  const refreshVersion = useRef(0);

  async function refresh(currentPlanId = planId, currentFilters = filters) {
    const version = ++refreshVersion.current;
    if (!currentPlanId) {
      setTasks([]);
      return;
    }
    try {
      const nextTasks = await listTasks(currentPlanId, currentFilters);
      if (version !== refreshVersion.current) return;
      setTasks(nextTasks);
      onDataChange();
      setMessage("");
    } catch (error) {
      if (version !== refreshVersion.current) return;
      setMessage(error instanceof Error ? error.message : "할 일을 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(planId, filters), 180);
    return () => window.clearTimeout(timer);
  }, [planId, filters.q, filters.status, filters.priority, filters.tag]);

  const knownTags = [...new Set(tasks.flatMap((task) => task.tags))].sort();

  function addTag(tag: string) {
    const current = tagText.split(",").map((t) => t.trim()).filter(Boolean);
    if (current.includes(tag)) return;
    setTagText([...current, tag].join(", "));
  }

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
    if (inFlight.current.has(task.id)) return;
    inFlight.current.add(task.id);
    setChangingIds([...inFlight.current]);
    const storageKey = `t06-complete:${task.id}`;
    try {
      if (task.status === "completed") {
        await reopenTask(task.id);
      } else {
        const key = sessionStorage.getItem(storageKey) ?? crypto.randomUUID();
        sessionStorage.setItem(storageKey, key);
        await completeTask(task.id, key);
      }
      sessionStorage.removeItem(storageKey);
      setMessage(task.status === "completed" ? "할 일을 진행 중으로 되돌렸습니다." : "할 일을 완료했습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "상태를 바꾸지 못했습니다.");
    } finally {
      inFlight.current.delete(task.id);
      setChangingIds([...inFlight.current]);
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
    <section className="panel task-panel flow-section" id="do-step" tabIndex={-1} aria-label="Do 할 일과 실행">
      <div className="section-heading">
        <div><span>02</span><h2>Do · 할 일과 실행</h2></div>
        <p>할 일을 정하고, 실행 시간과 막힌 이유를 기록합니다.</p>
      </div>

      {!plan ? (
        <p className="empty">먼저 계획을 하나 저장하세요.</p>
      ) : (
        <>
          <p className="selected-plan-name">현재 계획: <strong>{plan.title}</strong></p>

          <form className={`task-form${detailOpen ? " open" : ""}`} onSubmit={submit}>
            <div className="task-quick">
              <input
                className="task-quick-input"
                value={form.content}
                onChange={(event) => setForm({ ...form, content: event.target.value })}
                placeholder="할 일을 적고 Enter"
                aria-label="할 일"
                required
              />
              <button className="primary" disabled={busy}>{busy ? "추가 중…" : "추가"}</button>
              <button type="button" className="task-detail-toggle" aria-expanded={detailOpen}
                      onClick={() => setDetailOpen(!detailOpen)}>
                {detailOpen ? "자세히 닫기" : "자세히"}
              </button>
            </div>
            <p className="task-quick-hint">
              그냥 추가하면 마감일 {form.dueDate} · 우선순위 보통 · 예상 {form.estimatedMinutes}분으로 저장됩니다.
            </p>
            {detailOpen && (
              <div className="task-detail">
                <div className="grid three">
                  <label>마감일<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required /></label>
                  <label>우선순위<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Priority })}><option value="high">높음</option><option value="medium">보통</option><option value="low">낮음</option></select></label>
                  <label>예상 시간(분)<input type="number" min="0" value={form.estimatedMinutes} onChange={(event) => setForm({ ...form, estimatedMinutes: Number(event.target.value) })} required /></label>
                </div>
                <label>태그<input value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="backend, test처럼 쉼표로 구분" /></label>
                {knownTags.length > 0 && (
                  <div className="tag-picker">
                    <span>이 계획에서 쓴 태그</span>
                    {knownTags.map((tag) => (
                      <button type="button" key={tag} className="tag-chip" onClick={() => addTag(tag)}>#{tag}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="task-tools" aria-label="할 일 검색과 필터">
            <label>검색<input value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} placeholder="내용 또는 태그 검색" /></label>
            <label>상태<select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as TaskFilters["status"] })}><option value="">전체</option><option value="active">진행 중</option><option value="completed">완료</option></select></label>
            <label>우선순위<select value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value as TaskFilters["priority"] })}><option value="">전체</option><option value="high">높음</option><option value="medium">보통</option><option value="low">낮음</option></select></label>
            <label>태그<input value={filters.tag} onChange={(event) => setFilters({ ...filters, tag: event.target.value })} placeholder="정확한 태그" /></label>
          </div>
          <p className="sort-rule">정렬 기준: 우선순위(높음→보통→낮음) → 마감일 → 생성 시각 → ID</p>
          {message && <p className="message" role="status">{message}</p>}

          <div className="task-list" aria-label={`${plan.title}의 할 일`}>
            {tasks.length === 0 && <p className="empty">조건에 맞는 할 일이 없습니다.</p>}
            {tasks.map((task) => (
              <article className={`task-row ${task.status}`} id={`task-${task.id}`} key={task.id}>
                <button className="status-button" disabled={changingIds.includes(task.id)} onClick={() => void changeStatus(task)} aria-label={task.status === "completed" ? `${task.content} 진행 중으로 되돌리기` : `${task.content} 완료로 바꾸기`}>{task.status === "completed" ? "✓" : "○"}</button>
                <div className="task-body">
                  <div className="task-meta"><span className={`priority ${task.priority}`}>{task.priority}</span><span>{task.dueDate}</span><span>{task.estimatedMinutes}분</span></div>
                  <h3>{task.content}</h3>
                  <div className="tags">{task.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
                  <div className="actions"><button onClick={() => beginEdit(task)}>내용 수정</button><button className="danger" onClick={() => setPendingDeleteId(task.id)}>삭제</button></div>
                  {editingId === task.id && <form className="inline-edit" onSubmit={(event) => void saveEdit(event, task)}><label>새 할 일 내용<input value={editContent} onChange={(event) => setEditContent(event.target.value)} autoFocus required /></label><div className="actions"><button className="primary">수정 저장</button><button type="button" onClick={() => setEditingId(null)}>취소</button></div></form>}
                  {pendingDeleteId === task.id && <div className="delete-check" role="alert"><p>이 할 일만 삭제할까요?</p><div className="actions"><button className="danger solid" onClick={() => void confirmDelete(task)}>삭제 확인</button><button onClick={() => setPendingDeleteId(null)}>취소</button></div></div>}
                </div>
                <ExecutionPanel task={task} onSaved={onDataChange} />
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

