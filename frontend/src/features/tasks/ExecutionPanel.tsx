import { FormEvent, useEffect, useRef, useState } from "react";
import { CompletionEvent, createExecution, ExecutionLog, listCompletions, listExecutions } from "../../api/executions";
import type { Task } from "../../api/tasks";
import DateField from "../../components/DateField";

const seoulTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
});

export default function ExecutionPanel({ task, onSaved }: { task: Task; onSaved: () => void }) {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [events, setEvents] = useState<CompletionEvent[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [blocker, setBlocker] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listExecutions(task.id), listCompletions(task.id)])
      .then(([nextLogs, nextEvents]) => {
        if (!cancelled) { setLogs(nextLogs); setEvents(nextEvents); setMessage(""); }
      })
      .catch((error: unknown) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "기록을 불러오지 못했습니다.");
      });
    return () => { cancelled = true; };
  }, [task.id, task.status]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    try {
      // Inputs always mean Seoul wall time, regardless of the browser timezone.
      const log = await createExecution(task.id, {
        startedAt: `${start}+09:00`, endedAt: `${end}+09:00`,
        actualMinutes: minutes, blockerReason: blocker,
      });
      setLogs((current) => [...current, log].sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id)));
      setStart(""); setEnd(""); setMinutes(0); setBlocker("");
      setMessage("실행 기록을 저장했습니다. 예상 시간은 그대로입니다.");
      onSaved();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "기록을 저장하지 못했습니다.");
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return <div className="execution-panel">
    <div>
      <h4>실제로 한 일 적기</h4>
      <p className="time-rule">입력·표시 시각: Asia/Seoul (UTC+09:00) · 예상 {task.estimatedMinutes}분</p>
      <form onSubmit={save}>
        <div className="grid two">
          <DateField label="시작 시각 (서울)" withTime required value={start} onChange={setStart} />
          <DateField label="종료 시각 (서울)" withTime required value={end} onChange={setEnd} />
        </div>
        <label>실제 시간(분)<input type="number" min="0" max="1000000" step="1" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} required /></label>
        <label>막혔던 이유<textarea value={blocker} maxLength={500} onChange={(e) => setBlocker(e.target.value)} placeholder="없으면 비워 두세요" /></label>
        <button className="primary" disabled={busy}>{busy ? "저장 중…" : "실행 기록 저장"}</button>
      </form>
      {message && <p className="message" role="status">{message}</p>}
      <div className="execution-list" aria-label="저장된 실행 기록">
        <h4>실행 기록 {logs.length}건</h4>
        {logs.map((log) => <article key={log.id}>
          <p><time dateTime={log.startedAt}>{seoulTime.format(new Date(log.startedAt))}</time> → <time dateTime={log.endedAt}>{seoulTime.format(new Date(log.endedAt))}</time> (서울)</p>
          <p><strong>실제 {log.actualMinutes}분</strong> · 막힌 이유: {log.blockerReason || "없음"}</p>
          <small>기록 ID: {log.id} · 할 일 ID: {log.taskId}</small>
        </article>)}
      </div>
      <details className="completion-history"><summary>완료 이력 {events.length}건</summary>
        <p>다시 시작해도 과거 완료 이력은 남습니다.</p>
        {events.map((event) => <p key={event.id}>{seoulTime.format(new Date(event.completedAt))} (서울)<br /><small>완료 ID: {event.id}</small></p>)}
      </details>
    </div>
  </div>;
}
