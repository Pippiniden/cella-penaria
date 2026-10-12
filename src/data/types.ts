// 型の定義はこのファイルだけに置く（CLAUDE.md ルール2）。
// 形を変えたら migrations と同期の schemaVersion も同時に変える（ルール3）。
// 根拠: docs/spec.md > データ仕様

export type ID = string;
/** 'YYYY-MM-DD'（端末のローカル日付） */
export type DateStr = string;

export interface SyncMeta {
  id: ID;
  /** 最終更新（ms）。初期データは 0 にして、利用者の編集が必ず勝つようにする */
  updatedAt: number;
  /** 論理削除（ms） */
  deletedAt: number | null;
  /** 最終更新した端末 */
  deviceId: string;
}

/** 期限管理 | 残量管理 */
export type TrackingType = 'expiry' | 'quantity';
/** ある | 少ない | ない */
export type Level = 'enough' | 'low' | 'none';

export interface Substitute {
  id: ID;
  /** 組み合わせ可（生クリーム → 牛乳＋バター など） */
  items: { ingredientId: ID; amountText: string }[];
  note: string;
}

export interface Ingredient extends SyncMeta {
  name: string;
  aliases: string[];
  categoryId: ID;
  defaultLocationId: ID;
  tracking: TrackingType;
  /** 期限目安。null＝期限なし */
  shelfLifeDays: number | null;
  /** 単位ごとの可食部の重さ */
  unitConversions: { unit: string; grams: number }[];
  /** 成分表の食品番号 */
  foodCode: string | null;
  substitutes: Substitute[];
}

export interface StockItem extends SyncMeta {
  /** 食材 | 作り置き */
  kind: 'ingredient' | 'leftover';
  /** leftover は null */
  ingredientId: ID | null;
  /** leftover の料理名 */
  label: string | null;
  sourceRecipeId: ID | null;
  locationId: ID;
  /** 個数で持つ場合 */
  count: number | null;
  /** 個数で持たない場合の状態 */
  level: Level;
  expiresOn: DateStr | null;
  addedOn: DateStr;
}

export interface IngredientLine {
  id: ID;
  ingredientId: ID;
  /** 例「1/2束」 */
  displayText: string;
  amount: number | null;
  /** 'g' | '個' | '大さじ' など */
  unit: string | null;
  optional: boolean;
}

export interface Step {
  id: ID;
  text: string;
  /** タイマー用 */
  minutes: number | null;
}

export type StepEntry = { type: 'step'; step: Step } | { type: 'slot'; slotId: ID };

export interface Slot {
  id: ID;
  /** 'ソース' など */
  name: string;
  optionPartIds: ID[];
  defaultPartId: ID | null;
  allowNone: boolean;
}

/** 軸ID → 値ID（複数可） */
export type Tags = Record<ID, ID[]>;

export interface Part extends SyncMeta {
  /** 'ソース' | 'トッピング' など */
  kind: string;
  name: string;
  ingredients: IngredientLine[];
  steps: Step[];
  tags: Tags;
}

export interface SubstituteOverride {
  ingredientId: ID;
  rule: 'noSubstitute' | 'omittable' | 'substitute';
  substitute?: Substitute;
}

export interface Recipe extends SyncMeta {
  name: string;
  servings: number;
  minutes: number | null;
  imageId: ID | null;
  memo: string;
  /** ベースの材料 */
  ingredients: IngredientLine[];
  /** 手順とスロット差し込み位置 */
  entries: StepEntry[];
  slots: Slot[];
  tags: Tags;
  overrides: SubstituteOverride[];
}

export interface TagValue {
  id: ID;
  name: string;
  /** valueSource が 'minutes' の軸だけで使う。所要時間がこの分数以下なら該当（null＝上限なし） */
  maxMinutes?: number | null;
}

export interface TagAxis extends SyncMeta {
  name: string;
  /** 例「どんな気分？」 */
  question: string;
  values: TagValue[];
  /** 質問フローで聞くか */
  askable: boolean;
  /** 同点時に先に聞く順（小さいほど先） */
  order: number;
  /** 値の決め方。'minutes' はレシピの所要時間から自動で決め、手入力させない */
  valueSource: 'manual' | 'minutes';
  /** パーツにも付けられるか（気分・ジャンルなど味付けで変わる軸） */
  partTaggable: boolean;
}

export interface ShoppingItem extends SyncMeta {
  ingredientId: ID | null;
  freeText: string | null;
  source: 'manual' | 'recipe' | 'stock';
  sourceRecipeId: ID | null;
  checked: boolean;
}

export interface CookLog extends SyncMeta {
  recipeId: ID;
  /** スロット順。null＝なし */
  selectedPartIds: (ID | null)[];
  servings: number;
  cookedOn: DateStr;
  note: string;
}

export interface Location extends SyncMeta {
  name: string;
  order: number;
}

/** order は売り場の順（買い物リストの並びに使う） */
export interface Category extends SyncMeta {
  name: string;
  order: number;
}

export interface ImageMeta extends SyncMeta {
  width: number;
  height: number;
  bytes: number;
  /** Drive に送信済みか */
  uploaded: boolean;
}

export interface ImageBlob {
  id: ID;
  blob: Blob;
}

/** 成分表（同梱・読み取り専用・同期しない） */
export interface Food {
  code: string;
  group: number;
  name: string;
  /** 検索用の正規化キー */
  key: string;
  kcal: number | null;
  protein: number | null;
  fat: number | null;
  carb: number | null;
  fiber: number | null;
  salt: number | null;
}

/** 端末ごとの設定（同期しない） */
export interface SettingRow {
  key: string;
  value: unknown;
}

/** 同期対象のストア名 */
export const SYNCED_STORES = [
  'ingredients',
  'stock',
  'parts',
  'recipes',
  'tagAxes',
  'shopping',
  'cookLogs',
  'locations',
  'categories',
  'imageMeta',
] as const;
export type SyncedStore = (typeof SYNCED_STORES)[number];
