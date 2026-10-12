import { describe, expect, it } from 'vitest';
import { isBulkInput, resolveBulk, splitBulk } from '../../src/domain/bulk-parse';

describe('splitBulk', () => {
  it('読点・カンマ・改行で分け、空と重複を除く', () => {
    expect(splitBulk('卵、牛乳,豆腐，\nトマト、、たまご 、卵')).toEqual(['卵', '牛乳', '豆腐', 'トマト', 'たまご']);
  });
  it('区切りを含むときだけまとめて追加モード', () => {
    expect(isBulkInput('卵、牛乳')).toBe(true);
    expect(isBulkInput('卵')).toBe(false);
    expect(isBulkInput('卵、')).toBe(true);
  });
});

describe('resolveBulk', () => {
  const items = [
    { name: '卵', aliases: ['たまご'] },
    { name: '牛乳', aliases: [] },
    { name: 'トマト', aliases: [] },
    { name: 'トマト缶', aliases: [] },
  ];
  const names = (i: (typeof items)[number]) => [i.name, ...i.aliases];

  it('完全一致を優先し、なければ前方一致、どちらもなければ未登録', () => {
    const r = resolveBulk(['たまご', 'とまと', '牛', 'ほうれん草'], items, names);
    expect(r.matched.map((m) => [m.word, m.item.name])).toEqual([
      ['たまご', '卵'],
      ['とまと', 'トマト'],
      ['牛', '牛乳'],
    ]);
    expect(r.unknown).toEqual(['ほうれん草']);
  });
});
