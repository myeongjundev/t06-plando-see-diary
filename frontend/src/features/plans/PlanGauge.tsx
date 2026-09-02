import type { Summary } from "../../api/reflections";

// 예상과 실제의 간격을 숫자보다 먼저 읽히게 하는 막대.
//
// 기준선은 따로 그린 표식이 아니라 «두 색이 만나는 자리»다. 예전에는 검은 눈금을 세웠는데
// 그것이 카드에서 대비가 가장 센 요소였다 — 색은 제목과 같은 --ink였고, 8px 막대 위로
// 위아래 5px씩 솟아 18px이라 막대보다 컸다. 기준선이 흠집으로 읽혔다.
//
// 색도 나눈다. 예전에는 초과일 때 막대 전체가 --crit이라 화면이 «165분 전부가 잘못됐다»고
// 말했다. 계획대로 쓴 90분은 상태가 아니므로 무채색이고, 넘어선 75분만 --crit이다.
// 절약이면 채움과 기준선 사이의 빈 자리가 --good 빗금으로, 아낀 만큼이 자리로 보인다.
//
// 눈금은 트랙의 늘 같은 자리에 선다. 예전에는 눈금자를 max(예상, 실제)로 잡아서 큰 쪽이
// 언제나 100%를 채웠고, 그 바람에 (1) 기준선이 초과일 때 54%, 절약일 때 100%로 옮겨
// 다녀 계획끼리 비교가 되지 않았고 (2) 초과는 10%든 500%든 똑같이 꽉 찬 막대여서
// «얼마나»가 길이에서 사라졌다 — 정도는 눈금 위치에만 남았는데 그 관계가 예상/실제라
// 역수였다. 이제 채움 길이가 곧 «계획 대비 몇 배»이고 선형이다.
//
// 여기서 쓰는 예상치는 See와 같은 "할 일 예상치 합계"다(D-014). 계획 카드가 따로
// 보여주는 "N분 예상"은 계획 자체의 예상치이고 둘은 다른 값이라, 화면에서 서로
// 모순으로 읽히지 않도록 양쪽 다 이름을 붙여 표시한다.
export default function PlanGauge({ summary }: { summary: Summary }) {
  const { estimatedMinutes: estimated, actualMinutes: actual, varianceMinutes: variance } = summary;

  if (estimated === 0 && actual === 0) {
    return <p className="plan-gauge-empty">할 일과 실행 기록을 남기면 예상 대비 실제가 여기에 표시됩니다.</p>;
  }

  // 눈금이 서는 자리. 오른쪽 40%가 초과분이 자랄 여지다 — 1.67배까지 길이로 보인다.
  const BASELINE = 60;
  // 예상이 0이면 견줄 기준이 없다. 눈금을 그리지 않고 실제만 채운다 —
  // 없는 기준을 60% 자리에 세우면 그 자리가 무엇을 뜻하는지 화면이 거짓말한다.
  const hasBaseline = estimated > 0;
  const reach = hasBaseline ? (actual / estimated) * BASELINE : 100;
  const fill = Math.min(reach, 100);
  // 1.67배를 넘으면 막대가 끝에서 잘린다. 조용히 잘라 두면 «딱 맞게 꽉 찼다»로 읽히므로
  // 잘린 자리를 찢긴 가장자리로 드러낸다. 정확한 값은 아래 문장과 숫자가 갖고 있다.
  const clipped = reach > 100;
  // 세 구간. 계획대로 쓴 만큼 · 넘어선 만큼 · 아낀 만큼. 셋 다 같은 눈금자 위에 있어서
  // 길이끼리 견줄 수 있다.
  const planned = Math.min(fill, BASELINE);
  const over = Math.max(0, fill - BASELINE);
  // 실행 기록이 아직 없는 것은 «아낀 것»이 아니다. 시작도 안 한 계획에 초록 빗금을
  // 채우면 화면이 축하부터 한다.
  const saved = hasBaseline && actual > 0 ? Math.max(0, BASELINE - fill) : 0;
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
        {/* 구간이 덮지 않는 자리에서만 보이는 실선. 아직 실행 기록이 없으면 트랙이
            비어 계획이 어디쯤인지 사라지므로, 그때를 위해 깔아 둔다. */}
        {hasBaseline && <div className="plan-gauge-baseline" style={{ left: `${BASELINE}%` }} />}
        {planned > 0 && (
          <div className={`plan-gauge-planned${over > 0 || saved > 0 ? " joined" : ""}`}
               style={{ width: `${planned}%` }} />
        )}
        {over > 0 && <div className="plan-gauge-over" style={{ left: `${BASELINE}%`, width: `${over}%` }} />}
        {saved > 0 && <div className="plan-gauge-saved" style={{ left: `${fill}%`, width: `${saved}%` }} />}
        {clipped && <div className="plan-gauge-clip" aria-hidden="true" />}
      </div>
      {actual === 0
        ? <p className="plan-gauge-note">아직 실행 기록이 없습니다.</p>
        : <p className="plan-gauge-note"><strong>{signed}</strong> {variance > 0 ? "더 걸렸습니다" : variance < 0 ? "덜 걸렸습니다" : "예상과 같습니다"}</p>}
    </div>
  );
}
