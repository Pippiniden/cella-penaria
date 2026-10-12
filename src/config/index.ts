// 数値の初期値はすべてここに集める。コードの中に直接書かない（CLAUDE.md ルール7）。
// 根拠は docs/spec.md の各節を参照。

export const config = {
  /** 期限区分の境界（日数）。ロジック仕様 > 期限区分 */
  expiry: {
    /** d <= soonMaxDays を「今日・明日」とする */
    soonMaxDays: 1,
    /** d <= weekMaxDays を「今週」とする */
    weekMaxDays: 6,
  },
  /** 作り置きの期限の初期値（今日からの日数）。画面仕様 > 作った確認シート */
  leftoverShelfLifeDays: 2,
  /** スロットの組み合わせの上限。ロジック仕様 > 組み合わせの展開 */
  maxCombinations: 256,
  /** 質問フローを終えて結果を出す候補数。ロジック仕様 > 質問の軸選択 */
  questionStopAt: 5,
  /** ホームに出す提案の最大件数。画面仕様 > 今日 */
  homeSuggestionLimit: 5,
  /** 元に戻すバーの表示時間（ms）。画面仕様 > 共通部品 */
  undoDurationMs: 5000,
  /** よく使う食材チップの集計期間と件数。画面仕様 > 共通部品 */
  frequentIngredients: { days: 30, limit: 12 },
  /** 同期。同期仕様 */
  sync: {
    /** 前回の同期からこの時間が経っていれば、起動・復帰時に同期する（ms） */
    minIntervalMs: 5 * 60 * 1000,
    /** 論理削除レコードを物理削除するまでの日数 */
    tombstoneRetentionDays: 180,
    /** 孤立した画像を削除するまでの猶予日数 */
    orphanImageGraceDays: 7,
    /** 同期の再試行回数（Drive 上の data.json が途中で変わった場合） */
    maxRetries: 3,
  },
  /** 画像。画像処理仕様 */
  image: {
    full: { maxEdge: 1280, quality: 0.8 },
    thumb: { maxEdge: 240, quality: 0.7 },
  },
} as const;
