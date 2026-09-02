import { useEffect, useId, useRef, useState } from "react";
import {
  addDays,
  addMonths,
  isValidIso,
  ISO_DATE,
  monthGrid,
  partsOf,
  seoulToday,
  WEEKDAYS,
} from "../lib/date";

// `input[type="date"]`의 달력 팝업은 브라우저가 그리는 것이라 CSS가 닿지 않는다. 화면의
// 나머지가 전부 토큰 위에 올라가 있는데 그 하나만 크롬 기본 위젯이었다. 그래서 직접 그린다.
//
// 타자 입력은 남긴다 — 네이티브 입력이 하던 일이고, 2026-09-01을 아는 사람에게 달력을
// 여섯 번 누르게 하는 건 손해다. 텍스트가 온전한 날짜가 됐을 때만 값을 올려보낸다.
//
// 라이브러리를 들이지 않은 이유: 제출물의 의존성을 늘리지 않으려는 것과, 여기서 필요한
// 것이 달력 한 장과 키보드 이동뿐이라는 것.

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function DateField({ label, value, onChange, required }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);
  // 달력이 보고 있는 달과, 격자 안에서 키보드 초점이 놓인 날. 값과 따로 둔다 —
  // 화살표로 돌아다니는 동안 값이 따라 바뀌면 집계가 매 키 입력마다 다시 불린다.
  const [active, setActive] = useState(() => (isValidIso(value) ? value : seoulToday()));
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const followFocus = useRef(false);
  const today = seoulToday();

  // 밖에서 값이 바뀌면(다른 계획을 고르면 집계 기간이 그 계획 날짜로 바뀐다) 글자도 따라간다.
  useEffect(() => { setText(value); }, [value]);

  // `pattern`은 모양만 본다. 2026-02-31은 모양이 맞지만 없는 날이고, 반쯤 지운 글자는
  // 모양에서 걸리더라도 그 사실이 제출 순간에야 드러난다. 브라우저의 유효성 검사에 사유를
  // 직접 실어 두면 잘못된 날짜를 담은 폼은 아예 제출되지 않는다. 빈 칸은 `required`가 맡는다.
  useEffect(() => {
    inputRef.current?.setCustomValidity(
      text === "" || isValidIso(text) ? "" : "YYYY-MM-DD 형식의 실제 날짜를 입력하세요.");
  }, [text]);

  // 열 때마다 값이 있는 달로 되돌아온다. 지난번에 3월까지 넘겨 본 것이 남아 있으면
  // 다음에 열었을 때 어디를 보고 있는지 알 수 없다.
  useEffect(() => {
    if (!open) return;
    setActive(isValidIso(value) ? value : today);
  }, [open, value, today]);

  // 격자가 생긴 뒤에, 그리고 키보드로 날을 옮길 때마다 초점을 따라 옮긴다. 옮기지
  // 않으면 tabIndex가 -1이 된 옛 칸에 초점이 남아 두 번째 화살표부터 먹히지 않는다.
  // 달 이동 버튼을 누른 것까지 따라가면 초점이 격자로 끌려가 연타가 끊기므로,
  // 키보드에서 온 이동만 표시해 둔다.
  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [open]);
  useEffect(() => {
    if (!open || !followFocus.current) return;
    followFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function close(focusToggle = true) {
    setOpen(false);
    if (focusToggle) toggleRef.current?.focus();
  }

  function pick(next: string) {
    onChange(next);
    setText(next);
    close();
  }

  function onType(next: string) {
    setText(next);
    if (ISO_DATE.test(next) && isValidIso(next)) onChange(next);
  }

  // 온전한 날짜가 아닌 채로 떠나면 마지막으로 성립했던 값으로 되돌린다. 반쯤 지운
  // 글자를 남겨 두면 화면의 날짜와 실제로 쓰인 날짜가 달라진다.
  function onLeave() {
    if (!isValidIso(text)) setText(value);
  }

  // 갱신 함수로 옮긴 날을 계산한다. 렌더 시점의 `active`를 읽으면 화살표를 빠르게
  // 연타하거나 눌러 둘 때 여러 번의 키가 같은 날에서 출발해 하루만 움직인다.
  function moveTo(shift: (from: string) => string) {
    followFocus.current = true;
    setActive(shift);
  }

  function onGridKeyDown(event: React.KeyboardEvent) {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in moves) {
      event.preventDefault();
      moveTo((from) => addDays(from, moves[event.key]));
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      moveTo((from) => addMonths(from, event.key === "PageUp" ? -1 : 1));
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      moveTo((from) => {
        const weekday = new Date(`${from}T00:00:00Z`).getUTCDay();
        return addDays(from, event.key === "Home" ? -weekday : 6 - weekday);
      });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(active);
    }
  }

  const view = partsOf(active);
  const days = monthGrid(view.year, view.month);
  const weeks = Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7));
  const monthLabel = `${view.year}년 ${String(view.month + 1).padStart(2, "0")}월`;

  return (
    <div className="date-field" ref={wrapRef}>
      <label htmlFor={id}>{label}</label>
      <div className="date-field-control">
        <input
          id={id}
          ref={inputRef}
          type="text"
          className="date-input"
          inputMode="numeric"
          autoComplete="off"
          placeholder="YYYY-MM-DD"
          required={required}
          value={text}
          onChange={(event) => onType(event.target.value)}
          onBlur={onLeave}
        />
        <button
          type="button"
          ref={toggleRef}
          className="date-open"
          aria-label={`${label} 달력 열기`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((was) => !was)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {open && (
          <div
            className="date-pop"
            role="dialog"
            aria-label={`${label} 선택`}
            // 라벨과 입력 칸이 한 덩어리라 팝업 안을 누르면 초점이 입력 칸으로 끌려간다.
            // 기본 동작만 막고 우리 onClick은 그대로 돈다.
            onMouseDown={(event) => event.preventDefault()}
            onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}
          >
            <div className="date-pop-head">
              <button type="button" aria-label="이전 달" onClick={() => setActive(addMonths(active, -1))}>‹</button>
              <strong aria-live="polite">{monthLabel}</strong>
              <button type="button" aria-label="다음 달" onClick={() => setActive(addMonths(active, 1))}>›</button>
            </div>

            <div className="date-weekdays" aria-hidden="true">
              {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
            </div>

            {/* role="grid"은 row를 거쳐 cell을 소유해야 한다. 줄 요소에 display:contents를
                주어 접근성 구조는 갖추고 CSS의 7열 격자는 그대로 둔다. */}
            <div className="date-grid" role="grid" ref={gridRef} onKeyDown={onGridKeyDown}>
              {weeks.map((week) => (
                <div className="date-row" role="row" key={week[0]}>
                  {week.map((day) => {
                    const parts = partsOf(day);
                    const outside = parts.month !== view.month;
                    const selected = day === value;
                    return (
                      <button
                        type="button"
                        key={day}
                        role="gridcell"
                        // 격자 전체가 아니라 한 칸만 탭 순서에 남는다. 42번 탭을 눌러야
                        // 달력을 빠져나가는 일이 없도록.
                        tabIndex={day === active ? 0 : -1}
                        className={`date-cell${outside ? " outside" : ""}${selected ? " selected" : ""}${day === today ? " today" : ""}`}
                        aria-selected={selected}
                        aria-current={day === today ? "date" : undefined}
                        aria-label={day}
                        onClick={() => pick(day)}
                      >
                        {parts.day}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="date-pop-foot">
              <button type="button" onClick={() => pick(today)}>오늘</button>
              <button type="button" onClick={() => close()}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
