import { describe, expect, it } from 'vitest';
import { searchByName, toKey } from '../../src/domain/normalize';

describe('toKey', () => {
  it('カタカナをひらがなにする', () => {
    expect(toKey('トマト')).toBe('とまと');
  });
  it('半角カナ・全角英数を揃える', () => {
    expect(toKey('ﾄﾏﾄ')).toBe('とまと');
    expect(toKey('ＡＢＣ１２３')).toBe('abc123');
  });
  it('空白・中黒・記号を除き、長音は残す', () => {
    expect(toKey(' ベーコン・ブロック ')).toBe('べーこんぶろっく');
    expect(toKey('鶏もも（皮つき）')).toBe('鶏もも皮つき');
  });
});

describe('searchByName', () => {
  const items = [
    { name: 'トマト缶', aliases: [] },
    { name: 'トマト', aliases: [] },
    { name: 'ミニトマト', aliases: ['プチトマト'] },
    { name: '鶏もも肉', aliases: ['とりもも', '鶏もも'] },
  ];
  const names = (i: (typeof items)[number]) => [i.name, ...i.aliases];

  it('完全一致 → 前方一致 → 部分一致の順', () => {
    expect(searchByName('とまと', items, names).map((i) => i.name)).toEqual([
      'トマト',
      'トマト缶',
      'ミニトマト',
    ]);
  });
  it('別名でも見つかる', () => {
    expect(searchByName('ﾄﾘﾓﾓ', items, names).map((i) => i.name)).toEqual(['鶏もも肉']);
  });
  it('空の検索語は何も返さない', () => {
    expect(searchByName('  ', items, names)).toEqual([]);
  });
});
