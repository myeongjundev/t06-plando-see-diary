// 라이트/다크 수동 전환.
//
// 배포는 CSP `script-src 'self'`로 잠겨 있어(T06-C58, D-023) index.html에 인라인
// 스크립트를 넣을 수 없다. 그래서 저장된 선택은 모듈 스크립트인 main.tsx가
// 렌더 직전에 적용한다. 마운트 전까지 눈에 보이는 것은 body 배경뿐이고, 그동안은
// styles.css의 prefers-color-scheme 대비값이 받는다.
//
// JS가 항상 구체적인 값(light|dark)을 data-theme에 쓰기 때문에 다크 팔레트는
// `:root[data-theme="dark"]` 한 곳에만 있으면 된다.

export type ThemeChoice = "system" | "light" | "dark";

const KEY = "t06-theme";
const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

export function readChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // 시크릿 창이나 저장이 막힌 브라우저. 시스템 설정으로 돌아간다.
  }
  return "system";
}

export function resolve(choice: ThemeChoice) {
  return choice === "system" ? (darkQuery().matches ? "dark" : "light") : choice;
}

export function apply(choice: ThemeChoice) {
  document.documentElement.dataset.theme = resolve(choice);
}

export function store(choice: ThemeChoice) {
  try {
    if (choice === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    // 저장하지 못해도 이번 방문 동안의 선택은 그대로 적용된다.
  }
}

// 시스템을 따르는 동안에만 OS 전환을 반영한다.
export function watchSystem(onChange: () => void) {
  const query = darkQuery();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
