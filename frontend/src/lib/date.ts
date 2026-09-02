// 날짜는 전부 `YYYY-MM-DD` 문자열로 오간다. 계약이 그 모양이고(contracts/pds-schema-v2),
// 저장·비교·표시가 같은 문자열을 쓰면 시간대가 끼어들 자리가 없다.
//
// Date 객체를 거칠 때는 언제나 자정 UTC로 읽고 UTC 메서드만 쓴다. `new Date("2026-09-01")`
// 은 UTC 자정이지만 `getDate()`는 로컬 시간대로 답하므로, UTC+09 밖에서는 하루가 밀린다.

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// 마감 판정과 «오늘»은 See·집계와 같은 서울 시간대를 쓴다(D-008).
// sv-SE 로캘이 YYYY-MM-DD를 준다.
export function seoulToday(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
}

export function isValidIso(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00Z`);
  // 2026-02-31처럼 형식은 맞지만 없는 날짜는 다른 날로 굴러간다. 되돌려 찍어 확인한다.
  return !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value;
}

export function addDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function addMonths(value: string, months: number): string {
  const date = new Date(`${value}T00:00:00Z`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  // 1월 31일에서 한 달 뒤는 3월 3일이 아니라 2월 말이어야 한다.
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

export interface DateParts { year: number; month: number; day: number }

export function partsOf(value: string): DateParts {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
}

// 달력 한 장. 항상 42칸(6주)을 돌려준다 — 달마다 줄 수가 달라지면 팝업 높이가 5주 달과
// 6주 달 사이에서 튀고, 그러면 다음 달 버튼이 손가락 밑에서 움직인다.
export function monthGrid(year: number, month: number): string[] {
  const first = new Date(Date.UTC(year, month, 1));
  const start = new Date(first);
  start.setUTCDate(1 - first.getUTCDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
