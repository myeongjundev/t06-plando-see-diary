import { useEffect, useState } from "react";

// 판정선: 상단 sticky 바 아래. 뷰포트가 낮은 화면에서도 화면 안에 있도록 비율로
// 잡고 상한을 둔다.
export const markerFor = (viewportHeight: number) => Math.min(viewportHeight * 0.34, 260);

// 판정선을 지난 구획 중 마지막 것이 현재 구획이다. 브라우저 없이도 시험할 수 있게
// 순수 함수로 떼어 둔다.
export function pickActive(
  sections: readonly { id: string; top: number }[],
  marker: number,
  atBottom: boolean,
): string {
  if (sections.length === 0) return "";
  // 문서 끝에 닿으면 마지막 구획을 현재로 본다. 마지막 구획이 짧으면 그 top이
  // 판정선을 끝내 지나지 못해 영영 활성화되지 않는다.
  if (atBottom) return sections[sections.length - 1].id;
  const passed = sections.filter((section) => section.top <= marker);
  return (passed[passed.length - 1] ?? sections[0]).id;
}

// 지금 보고 있는 단계를 알려 준다. 단계 바가 sticky라 화면에 늘 붙어 있는데,
// 세 링크가 항상 똑같이 생겨서 어디를 보고 있는지 말해 주지 않았다.
//
// 판정선은 상단 sticky 바 아래에 둔다(.flow-section의 scroll-margin-top이 148px).
// 그 선을 지난 구획 중 마지막 것이 현재 구획이다.
//
// ids는 매 렌더 새 배열이 되지 않도록 모듈 상수를 넘겨야 한다.
export default function useActiveStep(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    // 엘리먼트를 이펙트에서 한 번만 붙잡아 두면 안 된다. TaskPanel은 key가 계획 ID라
    // 계획을 바꿀 때마다 리마운트되고, 그러면 붙잡아 둔 #do-step은 DOM에서 떨어져
    // 나간 옛 노드가 된다. 떨어진 노드의 getBoundingClientRect()는 전부 0이라
    // 그 단계가 늘 판정선을 지난 것으로 계산된다. 매번 다시 찾는다.
    const update = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((node): node is HTMLElement => node !== null)
        .map((node) => ({ id: node.id, top: node.getBoundingClientRect().top }));
      if (sections.length === 0) return;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const current = pickActive(sections, markerFor(window.innerHeight), atBottom);
      setActive((previous) => (previous === current ? previous : current));
    };

    // 계획·할 일·집계가 도착하기 전에는 문서가 짧아 판정이 실제와 다르다. 데이터가
    // 채워지면서 본문 높이가 변하는 것을 ResizeObserver가 잡아 다시 계산한다.
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(document.body);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return active;
}
