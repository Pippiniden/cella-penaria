import { matchKind, toKey } from './normalize';

// まとめて追加。docs/spec.md > ロジック仕様 > 表記揺れの正規化
// 「卵、牛乳、豆腐」のような入力を分割し、食材マスタと照合する。

const SEPARATORS = /[、,，､\n]+/;

/** 区切り文字で分割し、空要素と重複を除く */
export function splitBulk(input: string): string[] {
  const seen = new Set<string>();
  const words: string[] = [];
  for (const raw of input.split(SEPARATORS)) {
    const word = raw.trim();
    const key = toKey(word);
    if (key === '' || seen.has(key)) continue;
    seen.add(key);
    words.push(word);
  }
  return words;
}

/** まとめて追加モードに入るか（区切り文字を含むか） */
export function isBulkInput(input: string): boolean {
  return /[、,，､\n]/.test(input.trim());
}

export interface BulkResult<T> {
  matched: { word: string; item: T }[];
  /** マスタにない語。確認のうえ新規登録する */
  unknown: string[];
}

/** 各語を完全一致 → 前方一致の順で照合する（部分一致は誤登録が増えるので使わない） */
export function resolveBulk<T>(
  words: string[],
  items: T[],
  names: (item: T) => string[],
): BulkResult<T> {
  const keyed = items.map((item) => ({ item, keys: names(item).map(toKey) }));
  const result: BulkResult<T> = { matched: [], unknown: [] };
  for (const word of words) {
    const q = toKey(word);
    const exact = keyed.find((k) => matchKind(q, k.keys) === 'exact');
    const prefix = exact ?? keyed
      .filter((k) => matchKind(q, k.keys) === 'prefix')
      .sort((a, b) => (a.keys[0]?.length ?? 0) - (b.keys[0]?.length ?? 0))[0];
    if (prefix) result.matched.push({ word, item: prefix.item });
    else result.unknown.push(word);
  }
  return result;
}
