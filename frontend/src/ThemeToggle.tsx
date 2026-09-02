import { useEffect, useState } from "react";
import { apply, readChoice, resolve, store, ThemeChoice, watchSystem } from "./theme";

// 아이콘은 인라인 SVG다. CSP는 script-src만 잠그므로 마크업 SVG는 영향이 없고,
// 외부 아이콘 요청도 생기지 않는다.
const Sun = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </svg>
);

const Moon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.5 14.4A8.5 8.5 0 1 1 9.6 3.5a6.8 6.8 0 0 0 10.9 10.9Z" />
  </svg>
);

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(readChoice);
  const [, redraw] = useState(0);

  // 시스템을 따르는 동안에만 OS 전환을 반영한다. 직접 고른 뒤에는 그 선택이 이긴다.
  useEffect(() => {
    if (choice !== "system") return;
    return watchSystem(() => {
      apply("system");
      redraw((n) => n + 1);
    });
  }, [choice]);

  const active = resolve(choice);
  const next: ThemeChoice = active === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={next === "dark" ? "어두운 화면으로 바꾸기" : "밝은 화면으로 바꾸기"}
      onClick={() => {
        setChoice(next);
        store(next);
        apply(next);
      }}
    >
      {next === "dark" ? <Moon /> : <Sun />}
      <span>{next === "dark" ? "어둡게" : "밝게"}</span>
    </button>
  );
}
