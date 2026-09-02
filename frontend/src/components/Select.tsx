import { useEffect, useId, useRef, useState } from "react";

// `select`의 펼친 목록도 브라우저가 그리는 위젯이라 CSS가 닿지 않는다. 닫힌 상자만 우리
// 토큰을 따르고 펼친 목록은 OS 것이어서, 직접 그린 달력 옆에 OS 드롭다운이 서 있었다.
//
// 네이티브를 버리면서 잃는 것이 있다 — 모바일에서 `select`는 OS 시트를 띄우고 그쪽이
// 손가락에 맞다. 대신 얻는 것은 목록 높이를 화면의 다른 목록과 같은 19rem으로 맞추는
// 것과, 항목이 쌓이는 계획 고르기에 검색을 넣을 수 있다는 것이다. 네이티브의 타자
// 검색은 첫 글자만 먹는다.

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  /** 칸 위에 붙는 이름. 없으면 `ariaLabel`만으로 이름을 준다. */
  label?: string;
  ariaLabel?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** 목록 안에 검색 칸을 둔다. 항목이 쌓이는 계획 고르기용. */
  searchable?: boolean;
  /** 바깥에서 폭·자리를 잡던 기존 클래스를 그대로 넘긴다. */
  className?: string;
}

export default function Select({ label, ariaLabel, value, options, onChange, searchable, className }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // 목록 안에서 초점이 놓인 항목. 고른 값과 따로 둔다 — 화살표로 훑는 동안 값이 따라
  // 바뀌면 계획을 지나칠 때마다 집계가 다시 불린다.
  const [active, setActive] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // 타자 검색용. 검색 칸이 없는 짧은 목록에서 네이티브가 하던 일을 대신한다.
  const typed = useRef({ text: "", at: 0 });

  const selected = options.find((option) => option.value === value);
  const needle = query.trim().toLowerCase();
  const visible = needle === "" ? options : options.filter((o) => o.label.toLowerCase().includes(needle));

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(value);
  }, [open, value]);

  // 고른 항목이 목록 밖에 있으면 보이지 않는다. 열 때와 초점이 옮겨갈 때마다 끌어온다.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close(focusButton = true) {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }

  function pick(next: string) {
    onChange(next);
    close();
  }

  // 갱신 함수로 옮긴 값을 계산한다. 렌더 시점의 `active`를 읽으면 화살표를 빠르게
  // 연타하거나 눌러 둘 때 여러 번의 키가 같은 값에서 출발해 한 칸만 움직인다.
  function moveBy(step: number) {
    if (visible.length === 0) return;
    setActive((current) => {
      const at = visible.findIndex((option) => option.value === current);
      const next = at < 0 ? (step > 0 ? 0 : visible.length - 1) : Math.min(visible.length - 1, Math.max(0, at + step));
      return visible[next].value;
    });
  }

  // 이어 친 글자를 하나의 낱말로 모은다. 1초를 넘겨 치면 새로 시작한다 — 네이티브
  // select와 같은 규칙이다.
  function typeAhead(key: string) {
    const now = Date.now();
    typed.current = { text: now - typed.current.at > 1000 ? key : typed.current.text + key, at: now };
    const hit = visible.find((option) => option.label.toLowerCase().startsWith(typed.current.text.toLowerCase()));
    if (hit) setActive(hit.value);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key === "Tab") { close(false); return; }
    if (event.key === "ArrowDown") { event.preventDefault(); moveBy(1); return; }
    if (event.key === "ArrowUp") { event.preventDefault(); moveBy(-1); return; }
    if (event.key === "Home") { event.preventDefault(); moveBy(-options.length); return; }
    if (event.key === "End") { event.preventDefault(); moveBy(options.length); return; }
    if (event.key === "Enter") {
      event.preventDefault();
      if (visible.some((option) => option.value === active)) pick(active);
      return;
    }
    // 검색 칸이 있으면 글자는 그쪽이 받는다. 두 곳이 같은 키를 먹으면 안 된다.
    if (!searchable && event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      typeAhead(event.key);
    }
  }

  const activeId = `${id}-option-${active}`;

  return (
    <div className={`select-field${className ? ` ${className}` : ""}`} ref={wrapRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="select-control" onKeyDown={onKeyDown}>
        <button
          type="button"
          id={id}
          ref={buttonRef}
          className="select-button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={open ? activeId : undefined}
          aria-label={ariaLabel}
          onClick={() => setOpen((was) => !was)}
        >
          <span className="select-value">{selected?.label ?? ""}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="select-pop">
            {searchable && (
              <input
                className="select-search"
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="이름으로 찾기"
                aria-label="목록에서 이름으로 찾기"
                aria-controls={`${id}-list`}
                aria-activedescendant={activeId}
              />
            )}
            <ul className="select-list" id={`${id}-list`} role="listbox" ref={listRef} aria-label={ariaLabel ?? label}>
              {visible.length === 0 && <li className="select-none">이름이 맞는 항목이 없습니다.</li>}
              {visible.map((option) => (
                <li
                  key={option.value}
                  id={`${id}-option-${option.value}`}
                  role="option"
                  aria-selected={option.value === value}
                  data-active={option.value === active}
                  className={`select-option${option.value === value ? " selected" : ""}`}
                  // 목록 안을 누르면 단추에서 초점이 빠져나가 팝업이 닫힌다. 기본 동작만 막는다.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(option.value)}
                  onClick={() => pick(option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
