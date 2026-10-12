import { config } from '../config';
import type { DateStr } from '../data/types';
import { addDays, diffDays } from './date';

// docs/spec.md > ロジック仕様 > 期限区分

export type ExpiryBucket = 'expired' | 'soon' | 'week' | 'later' | 'none';

export const EXPIRY_BUCKET_LABEL: Record<ExpiryBucket, string> = {
  expired: '期限切れ',
  soon: '今日・明日',
  week: '今週',
  later: '余裕あり',
  none: '期限なし',
};

/** 表示順 */
export const EXPIRY_BUCKET_ORDER: ExpiryBucket[] = ['expired', 'soon', 'week', 'later', 'none'];

/** 今日から期限までの日数（期限なしは null） */
export function daysLeft(expiresOn: DateStr | null, today: DateStr): number | null {
  return expiresOn === null ? null : diffDays(today, expiresOn);
}

export function expiryBucket(expiresOn: DateStr | null, today: DateStr): ExpiryBucket {
  const d = daysLeft(expiresOn, today);
  if (d === null) return 'none';
  if (d < 0) return 'expired';
  if (d <= config.expiry.soonMaxDays) return 'soon';
  if (d <= config.expiry.weekMaxDays) return 'week';
  return 'later';
}

/** 「期限が近い」＝期限切れ または 今日・明日 */
export function isExpiringSoon(expiresOn: DateStr | null, today: DateStr): boolean {
  const b = expiryBucket(expiresOn, today);
  return b === 'expired' || b === 'soon';
}

/** 期限の初期値 ＝ 今日 ＋ 期限目安 */
export function defaultExpiresOn(shelfLifeDays: number | null, today: DateStr): DateStr | null {
  return shelfLifeDays === null ? null : addDays(today, shelfLifeDays);
}

/** 画面に出す短い文字（「今日」「明日」「3日」「2日前」など） */
export function expiryLabel(expiresOn: DateStr | null, today: DateStr): string {
  const d = daysLeft(expiresOn, today);
  if (d === null) return '期限なし';
  if (d < 0) return `${-d}日前`;
  if (d === 0) return '今日';
  if (d === 1) return '明日';
  if (d < 60) return `${d}日`;
  return `${Math.round(d / 30)}か月`;
}
