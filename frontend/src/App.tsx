import { FormEvent, useEffect, useState } from "react";
import {
  createPlan,
  listPlanRevisions,
  listPlans,
  Plan,
  PlanInput,
  PlanRevision,
  updatePlan,
} from "./api/plans";
import TaskPanel from "./features/tasks/TaskPanel";
import SeePanel from "./features/see/SeePanel";
import ExportPanel from "./features/export/ExportPanel";

const EMPTY_PLAN: PlanInput = {
  title: "T06 프로젝트 완주",
  startDate: "2026-09-01",
  endDate: "2026-09-07",
  priority: "high",
  successCriterion: "44개 검사 통과",
  estimatedMinutes: 600,
  carriedImprovement: null,
};

function App() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState<PlanInput>(EMPTY_PLAN);
  const [history, setHistory] = useState<Record<string, PlanRevision[]>>({});
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState(0);
  const [message, setMessage] = useState("계획을 불러오는 중입니다.");
  const [busy, setBusy] = useState(false);
  const [dataRevision, setDataRevision] = useState(0);

  async function refresh() {
    try {
      setPlans(await listPlans());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "계획을 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await createPlan(form);
      setMessage("계획을 서버 데이터베이스에 저장했습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "계획을 저장하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  function beginRevise(plan: Plan) {
    setEditingPlanId(plan.id);
    setEditMinutes(plan.estimatedMinutes);
  }

  async function revise(event: FormEvent, plan: Plan) {
    event.preventDefault();
    const minutes = editMinutes;
    if (!Number.isInteger(minutes) || minutes < 0) {
      setMessage("예상 시간은 0 이상의 정수 분이어야 합니다.");
      return;
    }
    try {
      await updatePlan(plan.id, { estimatedMinutes: minutes });
      const revisions = await listPlanRevisions(plan.id);
      setHistory((current) => ({ ...current, [plan.id]: revisions }));
      setEditingPlanId(null);
      setMessage("계획을 고쳤고 이전 값은 수정 이력에 남겼습니다.");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "계획을 고치지 못했습니다.");
    }
  }

  async function toggleHistory(planId: string) {
    if (history[planId]) {
      setHistory((current) => {
        const next = { ...current };
        delete next[planId];
        return next;
      });
      return;
    }
    try {
      const revisions = await listPlanRevisions(planId);
      setHistory((current) => ({ ...current, [planId]: revisions }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "수정 이력을 불러오지 못했습니다.");
    }
  }

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">PLAN · DO · SEE</p>
        <h1>플랜두씨 다이어리</h1>
        <p>계획한 나와 실제의 차이를 기록하고, 다음 계획을 더 정확하게 만듭니다.</p>
      </header>

      <aside className="public-warning" role="note">
        지금은 로그인이 없어 링크를 아는 사람은 누구나 볼 수 있습니다. 남이 봐도 괜찮은 내용만 넣으세요
      </aside>

      <section className="panel">
        <div className="section-heading">
          <div><span>01</span><h2>Plan · 계획 세우기</h2></div>
          <p>기간과 성공 기준을 먼저 정하고, 바뀐 계획도 기록으로 남깁니다.</p>
        </div>

        <form onSubmit={submit}>
          <label>계획 이름<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
          <div className="grid two">
            <label>시작일<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} required /></label>
            <label>종료일<input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} required /></label>
          </div>
          <div className="grid two">
            <label>우선순위<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as PlanInput["priority"] })}><option value="high">높음</option><option value="medium">보통</option><option value="low">낮음</option></select></label>
            <label>예상 시간(분)<input type="number" min="0" value={form.estimatedMinutes} onChange={(event) => setForm({ ...form, estimatedMinutes: Number(event.target.value) })} required /></label>
          </div>
          <label>성공 기준<textarea value={form.successCriterion} onChange={(event) => setForm({ ...form, successCriterion: event.target.value })} required /></label>
          <button className="primary" disabled={busy}>{busy ? "저장 중…" : "계획 저장"}</button>
        </form>
        {message && <p className="message" role="status">{message}</p>}
      </section>

      <section className="plan-list" aria-label="저장된 계획">
        {plans.map((plan) => (
          <article className="plan-card" id={`plan-${plan.id}`} key={plan.id}>
            <div className="plan-top"><span className={`priority ${plan.priority}`}>{plan.priority}</span><span>{plan.startDate} — {plan.endDate}</span></div>
            <h3>{plan.title}</h3>
            <p>{plan.successCriterion}</p>
            <strong>{plan.estimatedMinutes}분 예상</strong>
            {plan.carriedImprovement && <p className="carried-improvement">이전 회고의 개선점: <strong>{plan.carriedImprovement}</strong></p>}
            <div className="actions"><button onClick={() => beginRevise(plan)}>예상 시간 수정</button><button onClick={() => void toggleHistory(plan.id)}>수정 이력</button></div>
            {editingPlanId === plan.id && <form className="inline-edit" onSubmit={(event) => void revise(event, plan)}><label>새 예상 시간(분)<input type="number" min="0" value={editMinutes} onChange={(event) => setEditMinutes(Number(event.target.value))} autoFocus /></label><div className="actions"><button className="primary">수정 저장</button><button type="button" onClick={() => setEditingPlanId(null)}>취소</button></div></form>}
            {history[plan.id] && <div className="history"><h4>처음 계획 기록</h4>{history[plan.id].length === 0 ? <p>아직 수정 이력이 없습니다.</p> : history[plan.id].map((item) => <p key={item.revisionId}>#{item.revisionNumber} · {item.estimatedMinutes}분 · {item.successCriterion}</p>)}</div>}
          </article>
        ))}
      </section>
      <TaskPanel plans={plans} onDataChange={() => setDataRevision((value) => value + 1)} />
      <SeePanel plans={plans} revision={dataRevision} onPlanCreated={(plan) => setPlans((current) => current.some((item) => item.id === plan.id) ? current : [...current, plan])} />
      <ExportPanel />
    </main>
  );
}

export default App;
