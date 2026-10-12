// docs/spec.md > ロジック仕様 > 表記揺れの正規化
//
// 1. Unicode NFKC 正規化（全角英数・半角カナを統一）
// 2. カタカナをひらがなに変換
// 3. 英字を小文字に変換
// 4. 空白・中黒・記号を除去（長音「ー」は残す）

const KATAKANA = /[ァ-ヶ]/g;
// 空白・句読点・記号。長音「ー」(U+30FC) は文字扱いなので残る
const STRIP = /[\s\p{P}\p{S}]/gu;

export function toKey(text: string): string {
  return text
    .normalize('NFKC')
    .replace(KATAKANA, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .toLowerCase()
    .replace(STRIP, '');
}

export type MatchKind = 'exact' | 'prefix' | 'partial';

/** 照合の強さ。一致しなければ null */
export function matchKind(queryKey: string, targetKeys: string[]): MatchKind | null {
  if (queryKey === '') return null;
  if (targetKeys.some((k) => k === queryKey)) return 'exact';
  if (targetKeys.some((k) => k.startsWith(queryKey))) return 'prefix';
  if (targetKeys.some((k) => k.includes(queryKey))) return 'partial';
  return null;
}

const RANK: Record<MatchKind, number> = { exact: 0, prefix: 1, partial: 2 };

/**
 * 名前と別名で検索する。完全一致 → 前方一致 → 部分一致の順、同じ強さなら名前の短い順。
 */
export function searchByName<T>(
  query: string,
  items: T[],
  names: (item: T) => string[],
): T[] {
  const q = toKey(query);
  return items
    .map((item) => {
      const keys = names(item).map(toKey);
      const kind = matchKind(q, keys);
      return { item, kind, len: keys[0]?.length ?? 0 };
    })
    .filter((x): x is { item: T; kind: MatchKind; len: number } => x.kind !== null)
    .sort((a, b) => RANK[a.kind] - RANK[b.kind] || a.len - b.len)
    .map((x) => x.item);
}
