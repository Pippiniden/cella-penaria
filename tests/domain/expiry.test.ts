import { describe, expect, it } from 'vitest';
import { addDays, diffDays } from '../../src/domain/date';
import { defaultExpiresOn, expiryBucket, expiryLabel, isExpiringSoon } from '../../src/domain/expiry';

const today = '2026-10-12';

describe('date', () => {
  it('月またぎ・年またぎでも日数を数えられる', () => {
    expect(diffDays('2026-10-31', '2026-11-01')).toBe(1);
    expect(diffDays('2026-12-31', '2027-01-01')).toBe(1);
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
  });
});

describe('expiryBucket', () => {
  it.each([
    ['2026-10-11', 'expired'],
    ['2026-10-12', 'soon'],
    ['2026-10-13', 'soon'],
    ['2026-10-14', 'week'],
    ['2026-10-18', 'week'],
    ['2026-10-19', 'later'],
  ])('%s は %s', (date, bucket) => {
    expect(expiryBucket(date, today)).toBe(bucket);
  });

  it('期限なしは none', () => {
    expect(expiryBucket(null, today)).toBe('none');
  });

  it('期限が近いのは期限切れと今日・明日', () => {
    expect(isExpiringSoon('2026-10-10', today)).toBe(true);
    expect(isExpiringSoon('2026-10-13', today)).toBe(true);
    expect(isExpiringSoon('2026-10-14', today)).toBe(false);
    expect(isExpiringSoon(null, today)).toBe(false);
  });
});

describe('defaultExpiresOn', () => {
  it('今日＋期限目安', () => {
    expect(defaultExpiresOn(2, today)).toBe('2026-10-14');
    expect(defaultExpiresOn(null, today)).toBeNull();
  });
});

describe('expiryLabel', () => {
  it.each([
    ['2026-10-10', '2日前'],
    ['2026-10-12', '今日'],
    ['2026-10-13', '明日'],
    ['2026-10-15', '3日'],
    ['2027-01-12', '3か月'],
  ])('%s は「%s」', (date, label) => {
    expect(expiryLabel(date, today)).toBe(label);
  });
});
