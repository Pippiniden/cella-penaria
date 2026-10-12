import type { DateStr } from '../data/types';

// 日付はすべて 'YYYY-MM-DD' の文字列で扱う。タイムゾーンのずれを避けるため、
// 計算は UTC の 0 時として行う（表示上の「今日」は端末のローカル日付）。

const DAY_MS = 86_400_000;

/** 端末のローカル日付で今日を返す */
export function todayStr(now: Date = new Date()): DateStr {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toUtcMs(date: DateStr): number {
  const [y, m, d] = date.split('-').map(Number);
  if (y === undefined || m === undefined || d === undefined) throw new Error(`不正な日付: ${date}`);
  return Date.UTC(y, m - 1, d);
}

/** b − a の日数 */
export function diffDays(a: DateStr, b: DateStr): number {
  return Math.round((toUtcMs(b) - toUtcMs(a)) / DAY_MS);
}

export function addDays(date: DateStr, days: number): DateStr {
  return new Date(toUtcMs(date) + days * DAY_MS).toISOString().slice(0, 10);
}
