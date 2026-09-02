import type { Summary } from "../../api/reflections";

// 예상과 실제의 간격을 숫자보다 먼저 읽히게 하는 막대.
// 눈금이 예상, 채움이 실제다. 채움이 눈금에 못 미치면 절약, 넘어서면 초과.
//
// 여기서 쓰는 예상치는 See와 같은 "할 일 예상치 합계"다(D-014). 계획 카드가 따로
// 보여주는 "N분 예상"은 계획 자체의 예상치이고 둘은 다른 값이라, 화면에서 서로
// 모순으로 읽히지 않도록 양쪽 다 이름을 붙여 표시한다.
export default function PlanGauge({ summary }: { summary: Summary }) {
  const { estimatedMinutes: estimated, actualMinutes: actual, varianceMinutes: variance } = summary;

  if (estimated === 0 && actual === 0) {
    return <p className="plan-gauge-empty">할 일과 실행 기록을 남기면 예상 대비 실제가 여기에 표시됩니다.</p>;
  }

  const span = Math.max(estimated, actual, 1);
  const tone = variance > 0 ? "over" : variance < 0 ? "under" : "even";
  // 부호는 See 지표 카드와 같은 규칙이다. 음수는 ASCII 하이픈을 유지한다(T06-C32).
  const signed = `${variance > 0 ? "+" : ""}${variance}분`;
  const label = actual === 0
    ? `할 일 예상 ${estimated}분, 아직 실행 기록 없음`
    : `할 일 예상 ${estimated}분 대비 실제 ${actual}분, 차이 ${signed}`;

  return (
    <div className={`plan-gauge ${tone}`}>
      <div className="plan-gauge-heads">
        <span>할 일 예상 <strong>{estimated}분</strong></span>
        <span>실제 <strong>{actual}분</strong></span>
      </div>
      <div className="plan-gauge-track" role="img" aria-label={label}>
        <div className="plan-gauge-fill" style={{ width: `${(actual / span) * 100}%` }} />
        <div className="plan-gauge-tick" style={{ left: `${(estimated / span) * 100}%` }} />
      </div>
      {actual === 0
        ? <p className="plan-gauge-note">아직 실행 기록이 없습니다.</p>
        : <p className="plan-gauge-note"><strong>{signed}</strong> {variance > 0 ? "더 걸렸습니다" : variance < 0 ? "덜 걸렸습니다" : "예상과 같습니다"}</p>}
    </div>
  );
}
